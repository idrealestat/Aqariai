-- =======================================================
-- استعلامات SQL نموذجية لنظام وسِيطي العقاري
-- أمثلة عملية للاستعلامات الشائعة والتقارير
-- =======================================================

-- =======================================================
-- 1. استعلامات المستخدمين ومساحات العمل
-- =======================================================

-- البحث عن مستخدم بالبريد الإلكتروني أو الهاتف
SELECT u.*, w.name as workspace_name, uw.role as workspace_role
FROM users u
LEFT JOIN user_workspaces uw ON u.id = uw.user_id
LEFT JOIN workspaces w ON uw.workspace_id = w.id
WHERE (u.email = $1 OR u.phone = $2)
  AND u.deleted_at IS NULL;

-- الحصول على جميع أعضاء مساحة العمل
SELECT 
    u.id, u.name, u.email, u.phone, u.role as user_role,
    uw.role as workspace_role, uw.joined_at, uw.status,
    COUNT(p.id) as properties_count,
    COUNT(c.id) as contacts_count
FROM users u
JOIN user_workspaces uw ON u.id = uw.user_id
LEFT JOIN properties p ON u.id = p.created_by
LEFT JOIN crm_contacts c ON u.id = c.assigned_to
WHERE uw.workspace_id = $1
  AND uw.status = 'active'
GROUP BY u.id, u.name, u.email, u.phone, u.role, uw.role, uw.joined_at, uw.status
ORDER BY uw.joined_at DESC;

-- =======================================================
-- 2. استعلامات العقارات
-- =======================================================

-- البحث في العقارات مع فلترة متقدمة
SELECT 
    p.*,
    w.name as workspace_name,
    u.name as created_by_name,
    COUNT(pf.id) as images_count,
    COUNT(l.id) as listings_count,
    AVG(CASE WHEN pf.file_type = 'image' THEN 1 ELSE 0 END) as has_images
FROM properties p
LEFT JOIN workspaces w ON p.workspace_id = w.id
LEFT JOIN users u ON p.created_by = u.id
LEFT JOIN property_files pf ON p.id = pf.property_id
LEFT JOIN listings l ON p.id = l.property_id
WHERE p.workspace_id = $1
  AND p.status = COALESCE($2, p.status) -- فلتر الحالة اختياري
  AND p.type = COALESCE($3, p.type) -- فلتر النوع اختياري
  AND p.city = COALESCE($4, p.city) -- فلتر المدينة اختياري
  AND p.price BETWEEN COALESCE($5, 0) AND COALESCE($6, 999999999) -- نطاق السعر
  AND (
    $7 IS NULL OR 
    p.title ILIKE '%' || $7 || '%' OR 
    p.description ILIKE '%' || $7 || '%' OR
    p.address ILIKE '%' || $7 || '%'
  ) -- البحث النصي
GROUP BY p.id, w.name, u.name
ORDER BY 
    CASE WHEN $8 = 'price_asc' THEN p.price END ASC,
    CASE WHEN $8 = 'price_desc' THEN p.price END DESC,
    CASE WHEN $8 = 'created_desc' THEN p.created_at END DESC,
    CASE WHEN $8 = 'created_asc' THEN p.created_at END ASC,
    p.created_at DESC
LIMIT $9 OFFSET $10;

-- العقارات الأكثر مشاهدة
SELECT 
    p.id, p.title, p.price, p.city, p.type,
    p.views_count, p.inquiries_count,
    COUNT(pf.id) as images_count
FROM properties p
LEFT JOIN property_files pf ON p.id = pf.property_id AND pf.file_type = 'image'
WHERE p.workspace_id = $1 
  AND p.status = 'published'
GROUP BY p.id, p.title, p.price, p.city, p.type, p.views_count, p.inquiries_count
ORDER BY p.views_count DESC, p.inquiries_count DESC
LIMIT 10;

-- العقارات المشابهة (نفس النوع والمدينة ونطاق سعر قريب)
SELECT 
    p.id, p.title, p.price, p.district, p.bedrooms, p.area_m2,
    ABS(p.price - $2) as price_diff
FROM properties p
WHERE p.id != $1 -- استبعاد العقار الحالي
  AND p.type = (SELECT type FROM properties WHERE id = $1)
  AND p.city = (SELECT city FROM properties WHERE id = $1)
  AND p.status = 'published'
  AND p.price BETWEEN 
    (SELECT price * 0.7 FROM properties WHERE id = $1) AND 
    (SELECT price * 1.3 FROM properties WHERE id = $1)
ORDER BY price_diff ASC
LIMIT 5;

-- =======================================================
-- 3. استعلامات CRM والعملاء
-- =======================================================

-- قائمة العملاء مع آخر نشاط ومعلومات التواصل
SELECT 
    c.*,
    u.name as assigned_to_name,
    la.created_at as last_activity_date,
    la.type as last_activity_type,
    la.summary as last_activity_summary,
    COUNT(a.id) as total_activities,
    COUNT(t.id) as open_tasks,
    COUNT(t2.id) as completed_tasks,
    EXTRACT(DAYS FROM (NOW() - c.last_contact_at)) as days_since_contact
FROM crm_contacts c
LEFT JOIN users u ON c.assigned_to = u.id
LEFT JOIN crm_activities la ON c.id = la.contact_id AND la.created_at = (
    SELECT MAX(created_at) FROM crm_activities WHERE contact_id = c.id
)
LEFT JOIN crm_activities a ON c.id = a.contact_id
LEFT JOIN crm_tasks t ON c.id = t.contact_id AND t.status IN ('pending', 'in_progress')
LEFT JOIN crm_tasks t2 ON c.id = t2.contact_id AND t2.status = 'completed'
WHERE c.workspace_id = $1
  AND c.status = COALESCE($2, c.status)
  AND c.assigned_to = COALESCE($3, c.assigned_to)
GROUP BY c.id, u.name, la.created_at, la.type, la.summary
ORDER BY 
    CASE WHEN c.priority = 'urgent' THEN 1
         WHEN c.priority = 'high' THEN 2
         WHEN c.priority = 'medium' THEN 3
         ELSE 4 END,
    c.created_at DESC;

-- العملاء الذين يحتاجون متابعة
SELECT 
    c.id, c.full_name, c.phone, c.status, c.priority,
    c.last_contact_at, c.next_follow_up_at,
    u.name as assigned_to_name,
    EXTRACT(DAYS FROM (c.next_follow_up_at - NOW())) as days_until_followup
FROM crm_contacts c
LEFT JOIN users u ON c.assigned_to = u.id
WHERE c.workspace_id = $1
  AND c.next_follow_up_at <= NOW() + interval '7 days'
  AND c.status NOT IN ('closed_won', 'closed_lost')
ORDER BY c.next_follow_up_at ASC;

-- أفضل مصادر العملاء
SELECT 
    c.source,
    COUNT(*) as total_contacts,
    COUNT(*) FILTER (WHERE c.status = 'closed_won') as won_contacts,
    ROUND(
        COUNT(*) FILTER (WHERE c.status = 'closed_won') * 100.0 / COUNT(*), 2
    ) as conversion_rate,
    AVG(c.lead_score) as avg_lead_score,
    SUM(d.value) FILTER (WHERE d.status = 'won') as total_revenue
FROM crm_contacts c
LEFT JOIN crm_deals d ON c.id = d.contact_id
WHERE c.workspace_id = $1
  AND c.created_at >= $2 -- فترة التقرير
GROUP BY c.source
ORDER BY conversion_rate DESC, total_contacts DESC;

-- =======================================================
-- 4. استعلامات المهام والأنشطة
-- =======================================================

-- المهام المتأخرة والمستحقة اليوم
SELECT 
    t.*,
    c.full_name as contact_name,
    c.phone as contact_phone,
    p.title as property_title,
    u.name as assigned_to_name,
    CASE 
        WHEN t.due_date < CURRENT_DATE THEN 'overdue'
        WHEN t.due_date = CURRENT_DATE THEN 'due_today'
        WHEN t.due_date <= CURRENT_DATE + 1 THEN 'due_tomorrow'
        ELSE 'upcoming'
    END as urgency_status
FROM crm_tasks t
LEFT JOIN crm_contacts c ON t.contact_id = c.id
LEFT JOIN properties p ON t.property_id = p.id
LEFT JOIN users u ON t.assigned_to = u.id
WHERE t.workspace_id = $1
  AND t.status IN ('pending', 'in_progress')
  AND t.due_date <= CURRENT_DATE + 7 -- المهام خلال الأسبوع القادم
ORDER BY 
    CASE WHEN t.due_date < CURRENT_DATE THEN 1
         WHEN t.due_date = CURRENT_DATE THEN 2
         ELSE 3 END,
    t.priority = 'urgent' DESC,
    t.priority = 'high' DESC,
    t.due_date ASC;

-- تقرير إنتاجية المستخدم
SELECT 
    u.id, u.name,
    COUNT(t.id) as total_tasks,
    COUNT(t.id) FILTER (WHERE t.status = 'completed') as completed_tasks,
    COUNT(t.id) FILTER (WHERE t.status = 'completed' AND t.completed_at >= $2) as completed_this_period,
    COUNT(a.id) as total_activities,
    COUNT(a.id) FILTER (WHERE a.created_at >= $2) as activities_this_period,
    COUNT(c.id) as assigned_contacts,
    COUNT(c.id) FILTER (WHERE c.status = 'closed_won') as won_contacts
FROM users u
LEFT JOIN crm_tasks t ON u.id = t.assigned_to
LEFT JOIN crm_activities a ON u.id = a.performed_by
LEFT JOIN crm_contacts c ON u.id = c.assigned_to
JOIN user_workspaces uw ON u.id = uw.user_id
WHERE uw.workspace_id = $1
  AND uw.status = 'active'
GROUP BY u.id, u.name
ORDER BY completed_this_period DESC, activities_this_period DESC;

-- =======================================================
-- 5. استعلامات التقارير المالية
-- =======================================================

-- تقرير الإيرادات الشهرية
SELECT 
    DATE_TRUNC('month', p.completed_at) as month,
    COUNT(*) as total_payments,
    SUM(p.amount_cents) / 100.0 as total_amount,
    AVG(p.amount_cents) / 100.0 as avg_amount,
    COUNT(*) FILTER (WHERE p.payment_method = 'card') as card_payments,
    COUNT(*) FILTER (WHERE p.payment_method = 'bank_transfer') as bank_payments
FROM payments p
WHERE p.workspace_id = $1
  AND p.status = 'completed'
  AND p.completed_at >= $2 -- فترة التقرير
GROUP BY DATE_TRUNC('month', p.completed_at)
ORDER BY month DESC;

-- أداء العقود
SELECT 
    c.contract_type,
    COUNT(*) as total_contracts,
    COUNT(*) FILTER (WHERE c.status = 'active') as active_contracts,
    COUNT(*) FILTER (WHERE c.status = 'completed') as completed_contracts,
    SUM(c.commission_amount) as total_commission,
    AVG(c.commission_amount) as avg_commission,
    AVG(EXTRACT(DAYS FROM (c.end_date - c.start_date))) as avg_duration_days
FROM contracts c
WHERE c.workspace_id = $1
  AND c.created_at >= $2
GROUP BY c.contract_type
ORDER BY total_contracts DESC;

-- =======================================================
-- 6. استعلامات التحليلات والإحصائيات
-- =======================================================

-- إحصائيات لوحة التحكم
WITH workspace_stats AS (
    SELECT 
        COUNT(DISTINCT p.id) as total_properties,
        COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'published') as published_properties,
        COUNT(DISTINCT c.id) as total_contacts,
        COUNT(DISTINCT c.id) FILTER (WHERE c.created_at >= CURRENT_DATE - interval '30 days') as new_contacts_month,
        COUNT(DISTINCT ct.id) as total_contracts,
        COUNT(DISTINCT ct.id) FILTER (WHERE ct.status = 'active') as active_contracts,
        COALESCE(SUM(py.amount_cents) FILTER (WHERE py.status = 'completed' AND py.completed_at >= CURRENT_DATE - interval '30 days'), 0) / 100.0 as revenue_month
    FROM workspaces w
    LEFT JOIN properties p ON w.id = p.workspace_id
    LEFT JOIN crm_contacts c ON w.id = c.workspace_id
    LEFT JOIN contracts ct ON w.id = ct.workspace_id
    LEFT JOIN payments py ON w.id = py.workspace_id
    WHERE w.id = $1
),
property_performance AS (
    SELECT 
        p.id, p.title, p.price, p.views_count, p.inquiries_count,
        COUNT(pf.id) as images_count
    FROM properties p
    LEFT JOIN property_files pf ON p.id = pf.property_id AND pf.file_type = 'image'
    WHERE p.workspace_id = $1 AND p.status = 'published'
    GROUP BY p.id, p.title, p.price, p.views_count, p.inquiries_count
    ORDER BY p.views_count DESC, p.inquiries_count DESC
    LIMIT 5
)
SELECT 
    (SELECT row_to_json(workspace_stats) FROM workspace_stats) as stats,
    (SELECT json_agg(property_performance) FROM property_performance) as top_properties;

-- اتجاهات السوق حسب المنطقة
SELECT 
    p.city,
    p.district,
    p.type,
    COUNT(*) as properties_count,
    AVG(p.price) as avg_price,
    MIN(p.price) as min_price,
    MAX(p.price) as max_price,
    AVG(p.price / p.area_m2) as avg_price_per_m2,
    AVG(p.views_count) as avg_views,
    AVG(p.inquiries_count) as avg_inquiries
FROM properties p
WHERE p.status = 'published'
  AND p.created_at >= CURRENT_DATE - interval '90 days'
GROUP BY p.city, p.district, p.type
HAVING COUNT(*) >= 3 -- مناطق بها على الأقل 3 عقارات
ORDER BY p.city, p.district, avg_price DESC;

-- =======================================================
-- 7. استعلامات النشر على المنصات
-- =======================================================

-- حالة النشر على المنصات
SELECT 
    l.id as listing_id,
    l.title,
    p.title as property_title,
    plat.name as platform_name,
    pj.status as publish_status,
    pj.platform_url,
    pj.created_at as published_at,
    pj.platform_error
FROM listings l
JOIN properties p ON l.property_id = p.id
JOIN publish_jobs pj ON l.id = pj.listing_id
JOIN platform_accounts pa ON pj.platform_account_id = pa.id
JOIN platforms plat ON pa.platform_id = plat.id
WHERE l.workspace_id = $1
  AND l.status = 'published'
ORDER BY pj.created_at DESC;

-- إحصائيات النشر
SELECT 
    plat.name as platform_name,
    COUNT(pj.id) as total_jobs,
    COUNT(pj.id) FILTER (WHERE pj.status = 'success') as successful_jobs,
    COUNT(pj.id) FILTER (WHERE pj.status = 'failed') as failed_jobs,
    COUNT(pj.id) FILTER (WHERE pj.status = 'pending') as pending_jobs,
    ROUND(
        COUNT(pj.id) FILTER (WHERE pj.status = 'success') * 100.0 / 
        NULLIF(COUNT(pj.id), 0), 2
    ) as success_rate
FROM publish_jobs pj
JOIN platform_accounts pa ON pj.platform_account_id = pa.id
JOIN platforms plat ON pa.platform_id = plat.id
JOIN listings l ON pj.listing_id = l.id
WHERE l.workspace_id = $1
  AND pj.created_at >= CURRENT_DATE - interval '30 days'
GROUP BY plat.name
ORDER BY success_rate DESC;

-- =======================================================
-- 8. استعلامات البحث والفلترة المتقدمة
-- =======================================================

-- البحث الجغرافي (العقارات القريبة)
SELECT 
    p.*,
    ST_Distance(
        ST_GeomFromText('POINT(' || $2 || ' ' || $3 || ')', 4326),
        p.location
    ) * 111319.9 as distance_meters -- تحويل إلى متر تقريبي
FROM properties p
WHERE p.status = 'published'
  AND p.location IS NOT NULL
  AND ST_DWithin(
        ST_GeomFromText('POINT(' || $2 || ' ' || $3 || ')', 4326),
        p.location,
        $4 / 111319.9 -- تحويل المتر إلى درجات تقريبي
    )
ORDER BY distance_meters ASC
LIMIT $5;

-- البحث النصي المتقدم
SELECT 
    p.*,
    ts_rank(
        to_tsvector('arabic', COALESCE(p.title, '') || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p.address, '')),
        plainto_tsquery('arabic', $2)
    ) as rank
FROM properties p
WHERE p.workspace_id = $1
  AND p.status = 'published'
  AND (
    to_tsvector('arabic', COALESCE(p.title, '') || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p.address, ''))
    @@ plainto_tsquery('arabic', $2)
  )
ORDER BY rank DESC, p.created_at DESC;

-- =======================================================
-- 9. استعلامات الصيانة والتنظيف
-- =======================================================

-- تنظيف الملفات المؤقتة المنتهية الصلاحية
DELETE FROM files 
WHERE is_temporary = true 
  AND expires_at < NOW();

-- تنظيف الإشعارات القديمة
DELETE FROM notifications 
WHERE created_at < NOW() - interval '90 days'
  AND read = true;

-- تنظيف سجلات التدقيق القديمة
DELETE FROM audit_logs 
WHERE created_at < NOW() - interval '1 year';

-- تنظيف refresh tokens منتهية الصلاحية
DELETE FROM refresh_tokens 
WHERE expires_at < NOW() OR revoked = true;

-- =======================================================
-- 10. استعلامات الصحة والمراقبة
-- =======================================================

-- فحص صحة قاعدة البيانات
SELECT 
    'users' as table_name,
    COUNT(*) as total_records,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - interval '24 hours') as recent_records
FROM users
UNION ALL
SELECT 'properties', COUNT(*), COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - interval '24 hours') FROM properties
UNION ALL
SELECT 'crm_contacts', COUNT(*), COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - interval '24 hours') FROM crm_contacts
UNION ALL
SELECT 'crm_activities', COUNT(*), COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - interval '24 hours') FROM crm_activities;

-- مراقبة الأداء - الاستعلامات البطيئة
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public' 
  AND n_distinct > 100
ORDER BY abs(correlation) DESC;

-- مراقبة استخدام المساحة
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- =======================================================
-- نهاية الاستعلامات النموذجية
-- =======================================================