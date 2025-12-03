-- =======================================================
-- مخطط قاعدة البيانات الشامل لنظام وسِيطي العقاري
-- PostgreSQL 13+ مع PostGIS للمواقع الجغرافية
-- =======================================================

-- تفعيل الإضافات المطلوبة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =======================================================
-- 1. جداول المستخدمين والمصادقة
-- =======================================================

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone text UNIQUE,
  name text NOT NULL,
  password_hash text, -- nullable for social login
  role text NOT NULL DEFAULT 'agent', -- agent, manager, admin, owner
  profile_image text,
  license_number text,
  license_expiry date,
  otp_enabled boolean DEFAULT false,
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  last_login timestamptz,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz,
  
  CONSTRAINT valid_role CHECK (role IN ('agent', 'manager', 'admin', 'owner')),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE TABLE refresh_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  revoked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =======================================================
-- 2. مساحات العمل والفرق
-- =======================================================

CREATE TABLE workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  description text,
  logo_url text,
  owner_id uuid REFERENCES users(id) ON DELETE SET NULL,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz,
  
  CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9-]+$')
);

CREATE TABLE user_workspaces (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member', -- member, manager, admin
  permissions jsonb DEFAULT '[]',
  joined_at timestamptz DEFAULT now(),
  status text DEFAULT 'active', -- active, suspended, pending
  
  PRIMARY KEY(user_id, workspace_id),
  CONSTRAINT valid_workspace_role CHECK (role IN ('member', 'manager', 'admin'))
);

-- =======================================================
-- 3. الاشتراكات والمدفوعات
-- =======================================================

CREATE TABLE subscription_plans (
  id text PRIMARY KEY, -- 'individual', 'team', 'office', 'enterprise'
  name text NOT NULL,
  description text,
  price_monthly numeric(10,2),
  price_yearly numeric(10,2),
  features jsonb DEFAULT '[]',
  limits jsonb DEFAULT '{}', -- max_properties, max_users, etc
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  plan_id text REFERENCES subscription_plans(id),
  status text NOT NULL DEFAULT 'active', -- active, cancelled, trial, past_due, suspended
  started_at timestamptz DEFAULT now(),
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at timestamptz,
  cancelled_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_subscription_status CHECK (status IN ('active', 'cancelled', 'trial', 'past_due', 'suspended'))
);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id),
  workspace_id uuid REFERENCES workspaces(id),
  amount_cents int NOT NULL,
  currency text NOT NULL DEFAULT 'SAR',
  provider text NOT NULL, -- 'moyasar', 'hyperpay', 'stripe'
  provider_payment_id text,
  provider_response jsonb,
  status text NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_method text, -- 'card', 'mada', 'stc_pay', 'bank_transfer'
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  
  CONSTRAINT valid_payment_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  CONSTRAINT positive_amount CHECK (amount_cents > 0)
);

-- =======================================================
-- 4. المنصات والتكاملات
-- =======================================================

CREATE TABLE platforms (
  id serial PRIMARY KEY,
  key text UNIQUE NOT NULL, -- 'aqaar', 'haraj', 'bayut', 'dubizzle', 'opensooq', 'waseety'
  name text NOT NULL,
  name_ar text NOT NULL,
  description text,
  logo_url text,
  website_url text,
  supports_oauth boolean DEFAULT false,
  supports_api_publish boolean DEFAULT true,
  supports_webhook boolean DEFAULT false,
  api_documentation_url text,
  requires_approval boolean DEFAULT false,
  countries text[] DEFAULT '{"SA"}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE platform_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  platform_id int REFERENCES platforms(id) ON DELETE CASCADE,
  account_identifier text, -- username or email or account-id
  account_name text,
  oauth_token text,
  oauth_refresh_token text,
  oauth_expires_at timestamptz,
  api_key text,
  api_secret text,
  webhook_secret text,
  connected boolean DEFAULT false,
  last_sync_at timestamptz,
  sync_status text DEFAULT 'idle', -- idle, syncing, error
  error_message text,
  metadata jsonb DEFAULT '{}',
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(workspace_id, platform_id, account_identifier),
  CONSTRAINT valid_sync_status CHECK (sync_status IN ('idle', 'syncing', 'error'))
);

-- =======================================================
-- 5. العقارات والإعلانات
-- =======================================================

CREATE TABLE properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  owner_contact_id uuid, -- reference to crm_contacts (added later)
  
  -- معلومات أساسية
  title text NOT NULL,
  description text,
  type text NOT NULL, -- 'villa', 'apartment', 'land', 'commercial', 'warehouse', 'office'
  category text NOT NULL, -- 'sale', 'rent'
  
  -- الموقع
  country text DEFAULT 'SA',
  city text NOT NULL,
  district text,
  neighborhood text,
  address text,
  location point, -- PostGIS point (lat, lng)
  location_accuracy text DEFAULT 'exact', -- exact, approximate, city
  
  -- التفاصيل
  area_m2 numeric(10,2),
  land_area_m2 numeric(10,2),
  bedrooms int,
  bathrooms int,
  living_rooms int,
  kitchens int DEFAULT 1,
  parking_spaces int DEFAULT 0,
  floors int DEFAULT 1,
  floor_number int, -- for apartments
  age_years int,
  furnished boolean DEFAULT false,
  
  -- الأسعار
  price numeric(15,2) NOT NULL,
  currency text DEFAULT 'SAR',
  price_per_m2 numeric(10,2),
  down_payment numeric(15,2),
  monthly_payment numeric(15,2),
  
  -- الميزات
  features text[],
  amenities text[],
  
  -- معلومات قانونية
  deed_number text,
  advertising_license_number text,
  rera_permit_number text,
  
  -- الحالة
  status text DEFAULT 'draft', -- draft, published, sold, rented, archived
  visibility text DEFAULT 'public', -- public, private, workspace
  featured boolean DEFAULT false,
  urgent boolean DEFAULT false,
  
  -- SEO
  slug text,
  meta_title text,
  meta_description text,
  
  -- تتبع النشاط
  views_count int DEFAULT 0,
  inquiries_count int DEFAULT 0,
  favorites_count int DEFAULT 0,
  
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  expires_at timestamptz,
  
  CONSTRAINT valid_property_type CHECK (type IN ('villa', 'apartment', 'land', 'commercial', 'warehouse', 'office')),
  CONSTRAINT valid_property_category CHECK (category IN ('sale', 'rent')),
  CONSTRAINT valid_property_status CHECK (status IN ('draft', 'published', 'sold', 'rented', 'archived')),
  CONSTRAINT valid_visibility CHECK (visibility IN ('public', 'private', 'workspace')),
  CONSTRAINT positive_price CHECK (price > 0),
  CONSTRAINT valid_bedrooms CHECK (bedrooms >= 0),
  CONSTRAINT valid_bathrooms CHECK (bathrooms >= 0)
);

CREATE TABLE property_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  file_type text NOT NULL, -- 'image', 'video', 'document', 'floor_plan', 'virtual_tour'
  file_name text NOT NULL,
  file_size bigint,
  mime_type text,
  url text NOT NULL,
  thumbnail_url text,
  title text,
  description text,
  order_index int DEFAULT 0,
  is_primary boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_file_type CHECK (file_type IN ('image', 'video', 'document', 'floor_plan', 'virtual_tour'))
);

-- =======================================================
-- 6. الإعلانات والنشر على المنصات
-- =======================================================

CREATE TABLE listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  
  title text NOT NULL,
  description text,
  price numeric(15,2) NOT NULL,
  currency text DEFAULT 'SAR',
  
  -- إعدادات النشر
  auto_publish boolean DEFAULT false,
  auto_renew boolean DEFAULT false,
  renew_days int DEFAULT 30,
  
  -- حالة الإعلان
  status text DEFAULT 'draft', -- draft, published, paused, expired, archived
  
  -- تتبع النشر على المنصات
  platform_listing_meta jsonb DEFAULT '{}', -- stores per-platform ids, links, status
  
  -- تواريخ
  published_at timestamptz,
  expires_at timestamptz,
  last_published_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_listing_status CHECK (status IN ('draft', 'published', 'paused', 'expired', 'archived')),
  CONSTRAINT positive_listing_price CHECK (price > 0)
);

CREATE TABLE publish_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  platform_account_id uuid REFERENCES platform_accounts(id) ON DELETE CASCADE,
  
  job_type text DEFAULT 'publish', -- publish, update, delete, renew
  status text DEFAULT 'pending', -- pending, in_progress, success, failed, cancelled
  priority int DEFAULT 0, -- higher priority = processed first
  
  -- بيانات المنصة
  platform_listing_id text, -- the ID returned by the platform
  platform_url text, -- direct link to the listing on platform
  platform_response jsonb,
  platform_error jsonb,
  
  -- محاولات التنفيذ
  attempts int DEFAULT 0,
  max_attempts int DEFAULT 3,
  next_retry_at timestamptz,
  
  -- التوقيت
  scheduled_at timestamptz,
  started_at timestamptz,
  finished_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_job_type CHECK (job_type IN ('publish', 'update', 'delete', 'renew')),
  CONSTRAINT valid_job_status CHECK (status IN ('pending', 'in_progress', 'success', 'failed', 'cancelled'))
);

-- =======================================================
-- 7. نظام CRM - العملاء والجهات
-- =======================================================

CREATE TABLE crm_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- معلومات أساسية
  type text DEFAULT 'lead', -- lead, client, owner, tenant, broker, partner
  source text, -- 'website', 'facebook', 'whatsapp', 'referral', 'cold_call', 'walk_in'
  source_meta jsonb DEFAULT '{}', -- {listing_id, campaign_id, referral_user_id, etc}
  
  -- الاسم والهوية
  title text, -- 'mr', 'mrs', 'dr', etc
  first_name text,
  last_name text,
  full_name text NOT NULL,
  company_name text,
  job_title text,
  
  -- التواصل
  phone text,
  whatsapp text,
  email text,
  website text,
  
  -- العنوان
  country text DEFAULT 'SA',
  city text,
  district text,
  address text,
  
  -- تصنيف العميل
  status text DEFAULT 'new', -- new, contacted, qualified, proposal_sent, negotiating, closed_won, closed_lost
  priority text DEFAULT 'medium', -- low, medium, high, urgent
  rating int CHECK (rating >= 1 AND rating <= 5),
  
  -- النقاط والتقييم
  lead_score int DEFAULT 0,
  lifetime_value numeric(15,2) DEFAULT 0,
  
  -- التخصيص
  assigned_to uuid REFERENCES users(id),
  team_members uuid[], -- array of user IDs
  
  -- اهتمامات العميل
  interested_in text[], -- ['villa', 'apartment'], ['sale', 'rent']
  budget_min numeric(15,2),
  budget_max numeric(15,2),
  preferred_locations text[],
  requirements text,
  
  -- ملاحظات سريعة
  notes text,
  tags text[],
  
  -- خصوصية
  marketing_consent boolean DEFAULT false,
  data_processing_consent boolean DEFAULT true,
  
  -- تتبع النشاط
  last_contact_at timestamptz,
  last_activity_at timestamptz,
  next_follow_up_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_contact_type CHECK (type IN ('lead', 'client', 'owner', 'tenant', 'broker', 'partner')),
  CONSTRAINT valid_contact_status CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'negotiating', 'closed_won', 'closed_lost')),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  CONSTRAINT valid_budget CHECK (budget_min IS NULL OR budget_max IS NULL OR budget_min <= budget_max)
);

CREATE TABLE crm_tags (
  id serial PRIMARY KEY,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text DEFAULT '#D4AF37',
  description text,
  category text, -- 'status', 'source', 'custom'
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(workspace_id, name)
);

CREATE TABLE crm_contact_tags (
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE CASCADE,
  tag_id int REFERENCES crm_tags(id) ON DELETE CASCADE,
  added_by uuid REFERENCES users(id),
  added_at timestamptz DEFAULT now(),
  
  PRIMARY KEY(contact_id, tag_id)
);

-- =======================================================
-- 8. الأنشطة والمتابعات
-- =======================================================

CREATE TABLE crm_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE CASCADE,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  
  type text NOT NULL, -- 'call', 'email', 'whatsapp', 'sms', 'meeting', 'note', 'property_view', 'document_sent'
  direction text, -- 'inbound', 'outbound'
  
  subject text,
  summary text,
  details text,
  outcome text, -- 'positive', 'negative', 'neutral', 'no_answer'
  
  -- تفاصيل إضافية
  duration_minutes int, -- for calls/meetings
  location text, -- for meetings
  participants uuid[], -- other users involved
  
  -- ملفات مرفقة
  attachments jsonb DEFAULT '[]',
  
  -- المتابعة
  requires_follow_up boolean DEFAULT false,
  follow_up_date timestamptz,
  follow_up_note text,
  
  performed_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  
  -- بيانات إضافية (للتكاملات)
  external_id text, -- ID from external system (email provider, phone system)
  metadata jsonb DEFAULT '{}',
  
  CONSTRAINT valid_activity_type CHECK (type IN ('call', 'email', 'whatsapp', 'sms', 'meeting', 'note', 'property_view', 'document_sent')),
  CONSTRAINT valid_direction CHECK (direction IN ('inbound', 'outbound')),
  CONSTRAINT valid_outcome CHECK (outcome IN ('positive', 'negative', 'neutral', 'no_answer'))
);

-- =======================================================
-- 9. المهام والتذكيرات
-- =======================================================

CREATE TABLE crm_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE CASCADE,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  
  title text NOT NULL,
  description text,
  type text DEFAULT 'follow_up', -- follow_up, property_show, send_proposal, paperwork, meeting
  
  -- التخصيص والأولوية
  assigned_to uuid REFERENCES users(id),
  created_by uuid REFERENCES users(id),
  priority text DEFAULT 'medium', -- low, medium, high, urgent
  
  -- التوقيت
  due_date date,
  due_time time,
  estimated_duration_minutes int,
  
  -- التذكيرات
  reminder_datetime timestamptz,
  reminder_sent boolean DEFAULT false,
  
  -- الحالة
  status text DEFAULT 'pending', -- pending, in_progress, completed, cancelled, overdue
  completed_at timestamptz,
  completion_notes text,
  
  -- التكرار
  is_recurring boolean DEFAULT false,
  recurrence_rule text, -- RRULE format
  parent_task_id uuid REFERENCES crm_tasks(id),
  
  -- التبعيات
  depends_on uuid[], -- array of task IDs
  blocks uuid[], -- array of task IDs
  
  -- المرفقات
  attachments jsonb DEFAULT '[]',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_task_type CHECK (type IN ('follow_up', 'property_show', 'send_proposal', 'paperwork', 'meeting')),
  CONSTRAINT valid_task_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  CONSTRAINT valid_task_status CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'overdue'))
);

-- =======================================================
-- 10. مراحل المبيعات (Pipeline)
-- =======================================================

CREATE TABLE pipeline_stages (
  id serial PRIMARY KEY,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  color text DEFAULT '#D4AF37',
  position int NOT NULL,
  is_closed_stage boolean DEFAULT false, -- true for won/lost stages
  probability_percent int DEFAULT 0, -- 0-100
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(workspace_id, name),
  UNIQUE(workspace_id, position),
  CONSTRAINT valid_probability CHECK (probability_percent >= 0 AND probability_percent <= 100)
);

CREATE TABLE crm_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE CASCADE,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  stage_id int REFERENCES pipeline_stages(id),
  
  title text NOT NULL,
  description text,
  value numeric(15,2) NOT NULL,
  currency text DEFAULT 'SAR',
  
  probability_percent int DEFAULT 0,
  expected_close_date date,
  
  assigned_to uuid REFERENCES users(id),
  created_by uuid REFERENCES users(id),
  
  status text DEFAULT 'open', -- open, won, lost
  close_reason text,
  
  -- تتبع المراحل
  stage_history jsonb DEFAULT '[]',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  closed_at timestamptz,
  
  CONSTRAINT valid_deal_status CHECK (status IN ('open', 'won', 'lost')),
  CONSTRAINT positive_deal_value CHECK (value > 0),
  CONSTRAINT valid_deal_probability CHECK (probability_percent >= 0 AND probability_percent <= 100)
);

-- =======================================================
-- 11. العقود والوثائق
-- =======================================================

CREATE TABLE contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE SET NULL,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  deal_id uuid REFERENCES crm_deals(id) ON DELETE SET NULL,
  
  contract_type text NOT NULL, -- 'brokerage', 'sale', 'rental', 'management'
  contract_number text,
  
  -- الأطراف
  client_name text NOT NULL,
  client_id_number text,
  client_address text,
  broker_name text NOT NULL,
  broker_license text,
  
  -- التفاصيل المالية
  total_amount numeric(15,2),
  commission_amount numeric(15,2),
  commission_percent numeric(5,2),
  currency text DEFAULT 'SAR',
  
  -- فترة العقد
  start_date date,
  end_date date,
  duration_months int,
  
  -- الحالة
  status text DEFAULT 'draft', -- draft, sent, signed, active, completed, cancelled, expired
  
  -- التوقيعات
  client_signed_at timestamptz,
  broker_signed_at timestamptz,
  witness_signed_at timestamptz,
  
  -- ملفات
  pdf_url text,
  signed_pdf_url text,
  attachments jsonb DEFAULT '[]',
  
  -- تكامل مع الأنظمة الحكومية
  ejar_reference text, -- for rental contracts
  rega_reference text, -- for sale contracts
  najz_reference text, -- for ownership transfers
  
  notes text,
  terms_and_conditions text,
  
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_contract_type CHECK (contract_type IN ('brokerage', 'sale', 'rental', 'management')),
  CONSTRAINT valid_contract_status CHECK (status IN ('draft', 'sent', 'signed', 'active', 'completed', 'cancelled', 'expired'))
);

CREATE TABLE contract_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  
  name text NOT NULL,
  contract_type text NOT NULL,
  template_content text NOT NULL, -- HTML template with placeholders
  is_default boolean DEFAULT false,
  
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_template_contract_type CHECK (contract_type IN ('brokerage', 'sale', 'rental', 'management'))
);

-- =======================================================
-- 12. الفواتير وعروض الأسعار
-- =======================================================

CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE SET NULL,
  contract_id uuid REFERENCES contracts(id) ON DELETE SET NULL,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  
  invoice_type text NOT NULL, -- 'quote', 'invoice', 'receipt'
  invoice_number text,
  
  -- معلومات العميل
  client_name text NOT NULL,
  client_email text,
  client_phone text,
  client_address text,
  
  -- المبالغ
  subtotal numeric(15,2) NOT NULL,
  tax_amount numeric(15,2) DEFAULT 0,
  discount_amount numeric(15,2) DEFAULT 0,
  total_amount numeric(15,2) NOT NULL,
  currency text DEFAULT 'SAR',
  
  -- التواريخ
  issue_date date DEFAULT CURRENT_DATE,
  due_date date,
  
  -- الحالة
  status text DEFAULT 'draft', -- draft, sent, viewed, accepted, paid, overdue, cancelled
  
  -- الدفع
  payment_method text,
  payment_reference text,
  paid_at timestamptz,
  
  -- ملفات
  pdf_url text,
  
  notes text,
  terms text,
  
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_invoice_type CHECK (invoice_type IN ('quote', 'invoice', 'receipt')),
  CONSTRAINT valid_invoice_status CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'paid', 'overdue', 'cancelled')),
  CONSTRAINT positive_amounts CHECK (subtotal >= 0 AND tax_amount >= 0 AND discount_amount >= 0 AND total_amount >= 0)
);

CREATE TABLE invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  
  description text NOT NULL,
  quantity numeric(10,2) DEFAULT 1,
  unit_price numeric(15,2) NOT NULL,
  total_price numeric(15,2) NOT NULL,
  
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT positive_invoice_item_values CHECK (quantity > 0 AND unit_price >= 0 AND total_price >= 0)
);

-- =======================================================
-- 13. إدارة الملفات
-- =======================================================

CREATE TABLE files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- ارتباط الملف
  entity_type text NOT NULL, -- 'property', 'contact', 'contract', 'invoice', 'user', 'workspace'
  entity_id uuid NOT NULL,
  
  -- معلومات الملف
  file_name text NOT NULL,
  original_name text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  file_extension text,
  
  -- المسارات
  file_path text NOT NULL, -- path in storage
  public_url text,
  thumbnail_url text,
  
  -- التصنيف
  file_category text, -- 'document', 'image', 'video', 'contract', 'id_copy', 'license'
  is_public boolean DEFAULT false,
  is_temporary boolean DEFAULT false,
  
  -- البيانات الوصفية
  alt_text text,
  description text,
  tags text[],
  metadata jsonb DEFAULT '{}',
  
  -- الأمان
  access_level text DEFAULT 'workspace', -- 'public', 'workspace', 'private'
  encrypted boolean DEFAULT false,
  
  uploaded_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz, -- for temporary files
  
  CONSTRAINT valid_file_entity_type CHECK (entity_type IN ('property', 'contact', 'contract', 'invoice', 'user', 'workspace')),
  CONSTRAINT valid_access_level CHECK (access_level IN ('public', 'workspace', 'private')),
  CONSTRAINT positive_file_size CHECK (file_size > 0)
);

-- =======================================================
-- 14. الإشعارات
-- =======================================================

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  
  type text NOT NULL, -- 'new_lead', 'task_due', 'contract_signed', 'payment_received', 'system'
  title text NOT NULL,
  message text NOT NULL,
  
  -- البيانات
  data jsonb DEFAULT '{}',
  
  -- الأولوية والقنوات
  priority text DEFAULT 'medium', -- low, medium, high, urgent
  channels text[] DEFAULT '{"app"}', -- app, email, sms, whatsapp, push
  
  -- الحالة
  read boolean DEFAULT false,
  read_at timestamptz,
  
  -- الإجراءات
  action_url text,
  action_text text,
  
  -- التجميع
  group_key text, -- for grouping similar notifications
  
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '30 days'),
  
  CONSTRAINT valid_notification_type CHECK (type IN ('new_lead', 'task_due', 'contract_signed', 'payment_received', 'system')),
  CONSTRAINT valid_notification_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
);

-- =======================================================
-- 15. التكاملات الخارجية
-- =======================================================

CREATE TABLE integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  
  type text NOT NULL, -- 'whatsapp', 'email', 'sms', 'crm', 'accounting', 'marketing'
  provider text NOT NULL, -- 'twilio', 'sendgrid', 'mailchimp', 'hubspot'
  name text NOT NULL,
  
  -- الإعدادات
  config jsonb NOT NULL DEFAULT '{}',
  credentials jsonb DEFAULT '{}', -- encrypted
  
  -- الحالة
  enabled boolean DEFAULT false,
  connected boolean DEFAULT false,
  last_sync_at timestamptz,
  sync_frequency interval, -- how often to sync
  
  -- الخطأ والسجلات
  last_error text,
  error_count int DEFAULT 0,
  
  -- الإحصائيات
  total_requests int DEFAULT 0,
  successful_requests int DEFAULT 0,
  
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_integration_type CHECK (type IN ('whatsapp', 'email', 'sms', 'crm', 'accounting', 'marketing'))
);

-- =======================================================
-- 16. السجلات والتدقيق
-- =======================================================

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  
  action text NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
  entity_type text NOT NULL,
  entity_id uuid,
  
  -- التفاصيل
  description text,
  changes jsonb, -- old and new values
  
  -- السياق
  ip_address inet,
  user_agent text,
  session_id text,
  
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_audit_action CHECK (action IN ('create', 'update', 'delete', 'login', 'logout'))
);

-- =======================================================
-- 17. الإعدادات العامة
-- =======================================================

CREATE TABLE system_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  data_type text DEFAULT 'json', -- json, string, number, boolean
  is_public boolean DEFAULT false,
  updated_by uuid REFERENCES users(id),
  updated_at timestamptz DEFAULT now()
);

-- =======================================================
-- الفهارس (Indexes) لتحسين الأداء
-- =======================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;

-- Refresh Tokens
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Workspaces
CREATE INDEX idx_workspaces_owner_id ON workspaces(owner_id);
CREATE INDEX idx_workspaces_slug ON workspaces(slug);

-- User Workspaces
CREATE INDEX idx_user_workspaces_workspace_id ON user_workspaces(workspace_id);
CREATE INDEX idx_user_workspaces_status ON user_workspaces(status);

-- Subscriptions
CREATE INDEX idx_subscriptions_workspace_id ON subscriptions(workspace_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end);

-- Payments
CREATE INDEX idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_provider_payment_id ON payments(provider_payment_id);

-- Platform Accounts
CREATE INDEX idx_platform_accounts_workspace_id ON platform_accounts(workspace_id);
CREATE INDEX idx_platform_accounts_platform_id ON platform_accounts(platform_id);
CREATE INDEX idx_platform_accounts_connected ON platform_accounts(connected);

-- Properties
CREATE INDEX idx_properties_workspace_id ON properties(workspace_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_category ON properties(category);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_created_by ON properties(created_by);
CREATE INDEX idx_properties_published_at ON properties(published_at);
CREATE INDEX idx_properties_location ON properties USING GIST(location); -- PostGIS spatial index

-- Property Files
CREATE INDEX idx_property_files_property_id ON property_files(property_id);
CREATE INDEX idx_property_files_file_type ON property_files(file_type);

-- Listings
CREATE INDEX idx_listings_property_id ON listings(property_id);
CREATE INDEX idx_listings_workspace_id ON listings(workspace_id);
CREATE INDEX idx_listings_status ON listings(status);

-- Publish Jobs
CREATE INDEX idx_publish_jobs_listing_id ON publish_jobs(listing_id);
CREATE INDEX idx_publish_jobs_platform_account_id ON publish_jobs(platform_account_id);
CREATE INDEX idx_publish_jobs_status ON publish_jobs(status);
CREATE INDEX idx_publish_jobs_scheduled_at ON publish_jobs(scheduled_at);

-- CRM Contacts
CREATE INDEX idx_crm_contacts_workspace_id ON crm_contacts(workspace_id);
CREATE INDEX idx_crm_contacts_phone ON crm_contacts(phone);
CREATE INDEX idx_crm_contacts_email ON crm_contacts(email);
CREATE INDEX idx_crm_contacts_status ON crm_contacts(status);
CREATE INDEX idx_crm_contacts_assigned_to ON crm_contacts(assigned_to);
CREATE INDEX idx_crm_contacts_source ON crm_contacts(source);
CREATE INDEX idx_crm_contacts_created_at ON crm_contacts(created_at);
CREATE INDEX idx_crm_contacts_last_contact_at ON crm_contacts(last_contact_at);

-- CRM Activities
CREATE INDEX idx_crm_activities_contact_id ON crm_activities(contact_id);
CREATE INDEX idx_crm_activities_workspace_id ON crm_activities(workspace_id);
CREATE INDEX idx_crm_activities_performed_by ON crm_activities(performed_by);
CREATE INDEX idx_crm_activities_created_at ON crm_activities(created_at);
CREATE INDEX idx_crm_activities_type ON crm_activities(type);

-- CRM Tasks
CREATE INDEX idx_crm_tasks_contact_id ON crm_tasks(contact_id);
CREATE INDEX idx_crm_tasks_assigned_to ON crm_tasks(assigned_to);
CREATE INDEX idx_crm_tasks_status ON crm_tasks(status);
CREATE INDEX idx_crm_tasks_due_date ON crm_tasks(due_date);
CREATE INDEX idx_crm_tasks_priority ON crm_tasks(priority);

-- Contracts
CREATE INDEX idx_contracts_workspace_id ON contracts(workspace_id);
CREATE INDEX idx_contracts_contact_id ON contracts(contact_id);
CREATE INDEX idx_contracts_property_id ON contracts(property_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_contract_type ON contracts(contract_type);

-- Files
CREATE INDEX idx_files_workspace_id ON files(workspace_id);
CREATE INDEX idx_files_entity_type_id ON files(entity_type, entity_id);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_workspace_id ON notifications(workspace_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Audit Logs
CREATE INDEX idx_audit_logs_workspace_id ON audit_logs(workspace_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type_id ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- =======================================================
-- Functions و Triggers للصيانة التلقائية
-- =======================================================

-- Function لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- تطبيق Trigger على الجداول المناسبة
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_platform_accounts_updated_at BEFORE UPDATE ON platform_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_publish_jobs_updated_at BEFORE UPDATE ON publish_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_contacts_updated_at BEFORE UPDATE ON crm_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_tasks_updated_at BEFORE UPDATE ON crm_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function لحساب نقاط العميل المحتمل تلقائياً
CREATE OR REPLACE FUNCTION calculate_lead_score()
RETURNS TRIGGER AS $$
DECLARE
    score int := 0;
BEGIN
    -- نقاط أساسية
    IF NEW.phone IS NOT NULL THEN score := score + 10; END IF;
    IF NEW.email IS NOT NULL THEN score := score + 10; END IF;
    IF NEW.budget_max IS NOT NULL THEN score := score + 15; END IF;
    
    -- نقاط حسب المصدر
    CASE NEW.source
        WHEN 'website' THEN score := score + 20;
        WHEN 'referral' THEN score := score + 30;
        WHEN 'facebook' THEN score := score + 15;
        ELSE score := score + 5;
    END CASE;
    
    -- نقاط حسب النشاط
    IF NEW.last_contact_at IS NOT NULL THEN score := score + 10; END IF;
    
    NEW.lead_score := LEAST(score, 100); -- cap at 100
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_crm_contacts_lead_score 
    BEFORE INSERT OR UPDATE ON crm_contacts 
    FOR EACH ROW EXECUTE FUNCTION calculate_lead_score();

-- Function للإشعار بالأحداث المهمة (للـ Real-time)
CREATE OR REPLACE FUNCTION notify_realtime_event()
RETURNS TRIGGER AS $$
DECLARE
    payload json;
    event_type text;
BEGIN
    -- تحديد نوع الحدث
    IF TG_OP = 'INSERT' THEN
        CASE TG_TABLE_NAME
            WHEN 'crm_contacts' THEN event_type := 'lead:new';
            WHEN 'crm_tasks' THEN event_type := 'task:created';
            WHEN 'crm_activities' THEN event_type := 'activity:new';
            ELSE RETURN NEW;
        END CASE;
        
        payload := json_build_object(
            'event', event_type,
            'workspace_id', NEW.workspace_id,
            'data', row_to_json(NEW)
        );
    ELSIF TG_OP = 'UPDATE' THEN
        CASE TG_TABLE_NAME
            WHEN 'crm_tasks' THEN 
                IF OLD.status != NEW.status AND NEW.status = 'completed' THEN
                    event_type := 'task:completed';
                ELSE
                    event_type := 'task:updated';
                END IF;
            WHEN 'crm_contacts' THEN event_type := 'contact:updated';
            ELSE RETURN NEW;
        END CASE;
        
        payload := json_build_object(
            'event', event_type,
            'workspace_id', NEW.workspace_id,
            'data', row_to_json(NEW)
        );
    ELSE
        RETURN NULL;
    END IF;
    
    -- إرسال الإشعار
    PERFORM pg_notify('realtime_events', payload::text);
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ language 'plpgsql';

-- تطبيق Triggers للأحداث المباشرة
CREATE TRIGGER notify_crm_contacts_events 
    AFTER INSERT OR UPDATE ON crm_contacts 
    FOR EACH ROW EXECUTE FUNCTION notify_realtime_event();

CREATE TRIGGER notify_crm_tasks_events 
    AFTER INSERT OR UPDATE ON crm_tasks 
    FOR EACH ROW EXECUTE FUNCTION notify_realtime_event();

CREATE TRIGGER notify_crm_activities_events 
    AFTER INSERT ON crm_activities 
    FOR EACH ROW EXECUTE FUNCTION notify_realtime_event();

-- =======================================================
-- بيانات أولية (Seed Data)
-- =======================================================

-- إدراج خطط الاشتراك
INSERT INTO subscription_plans (id, name, price_monthly, price_yearly, features, limits) VALUES
('individual', 'فردي', 99.00, 999.00, 
 '["إدارة 50 عقار", "CRM أساسي", "تقارير بسيطة"]',
 '{"max_properties": 50, "max_users": 1, "max_contacts": 500}'),

('team', 'فريق', 199.00, 1999.00,
 '["إدارة 150 عقار", "CRM متقدم", "تقارير تفصيلية", "دعم فني"]',
 '{"max_properties": 150, "max_users": 5, "max_contacts": 2000}'),

('office', 'مكتب عقاري', 399.00, 3999.00,
 '["إدارة 500 عقار", "CRM شامل", "تقارير احترافية", "API", "دعم مميز"]',
 '{"max_properties": 500, "max_users": 15, "max_contacts": 10000}'),

('enterprise', 'شركة عقارية', 799.00, 7999.00,
 '["عقارات غير محدودة", "CRM متكامل", "تحليلات متقدمة", "API كامل", "دعم مخصص"]',
 '{"max_properties": -1, "max_users": -1, "max_contacts": -1}');

-- إدراج المنصات العقارية السعودية
INSERT INTO platforms (key, name, name_ar, description, supports_oauth, supports_api_publish, countries) VALUES
('aqaar', 'Aqaar', 'عقار', 'منصة عقار - الموقع الرائد للعقارات في السعودية', false, true, '{"SA"}'),
('haraj', 'Haraj', 'حراج', 'موقع حراج - سوق العقارات والخدمات', false, true, '{"SA"}'),
('bayut_ksa', 'Bayut KSA', 'بيوت السعودية', 'منصة بيوت للعقارات السعودية', false, true, '{"SA"}'),
('dubizzle_ksa', 'Dubizzle KSA', 'دوبيزل السعودية', 'منصة دوبيزل للعقارات', false, true, '{"SA"}'),
('opensooq_ksa', 'OpenSooq KSA', 'السوق المفتوح السعودية', 'السوق المفتوح للعقارات', false, true, '{"SA"}'),
('waseety', 'Waseety', 'وسِيطي', 'منصة وسِيطي الداخلية', false, true, '{"SA"}');

-- إدراج مراحل المبيعات الافتراضية
INSERT INTO pipeline_stages (workspace_id, name, position, probability_percent) VALUES
(NULL, 'عميل جديد', 1, 10),
(NULL, 'تم التواصل', 2, 25),
(NULL, 'مؤهل', 3, 50),
(NULL, 'عرض سعر', 4, 75),
(NULL, 'تفاوض', 5, 90),
(NULL, 'تم الإغلاق', 6, 100);

-- إدراج الإعدادات الأساسية
INSERT INTO system_settings (key, value, description, is_public) VALUES
('app_name', '"عقاري AI Aqari"', 'اسم التطبيق', true),
('app_version', '"1.0.0"', 'إصدار التطبيق', true),
('maintenance_mode', 'false', 'وضع الصيانة', false),
('max_file_size', '10485760', 'حد أقصى لحجم الملف (10MB)', false),
('supported_file_types', '["jpg", "jpeg", "png", "pdf", "doc", "docx"]', 'أنواع الملفات المدعومة', false),
('default_currency', '"SAR"', 'العملة الافتراضية', true),
('default_country', '"SA"', 'البلد الافتراضي', true),
('rtl_support', 'true', 'دعم اللغة العربية RTL', true);

-- =======================================================
-- Views للاستعلامات المتكررة
-- =======================================================

-- عرض شامل للعقارات مع معلومات إضافية
CREATE VIEW properties_detailed AS
SELECT 
    p.*,
    w.name as workspace_name,
    u.name as created_by_name,
    c.full_name as owner_name,
    c.phone as owner_phone,
    COUNT(pf.id) as files_count,
    COUNT(DISTINCT l.id) as listings_count,
    COALESCE(AVG(CASE WHEN pf.file_type = 'image' THEN 1 ELSE 0 END), 0) as has_images
FROM properties p
LEFT JOIN workspaces w ON p.workspace_id = w.id
LEFT JOIN users u ON p.created_by = u.id
LEFT JOIN crm_contacts c ON p.owner_contact_id = c.id
LEFT JOIN property_files pf ON p.id = pf.property_id
LEFT JOIN listings l ON p.id = l.property_id
WHERE p.deleted_at IS NULL
GROUP BY p.id, w.name, u.name, c.full_name, c.phone;

-- عرض للعملاء مع آخر نشاط
CREATE VIEW crm_contacts_with_activity AS
SELECT 
    c.*,
    w.name as workspace_name,
    u.name as assigned_to_name,
    la.created_at as last_activity_date,
    la.type as last_activity_type,
    COUNT(a.id) as total_activities,
    COUNT(t.id) as open_tasks
FROM crm_contacts c
LEFT JOIN workspaces w ON c.workspace_id = w.id
LEFT JOIN users u ON c.assigned_to = u.id
LEFT JOIN crm_activities la ON c.id = la.contact_id AND la.created_at = (
    SELECT MAX(created_at) FROM crm_activities WHERE contact_id = c.id
)
LEFT JOIN crm_activities a ON c.id = a.contact_id
LEFT JOIN crm_tasks t ON c.id = t.contact_id AND t.status IN ('pending', 'in_progress')
GROUP BY c.id, w.name, u.name, la.created_at, la.type;

-- عرض للإحصائيات السريعة لمساحة العمل
CREATE VIEW workspace_stats AS
SELECT 
    w.id as workspace_id,
    w.name as workspace_name,
    COUNT(DISTINCT p.id) as total_properties,
    COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'published') as published_properties,
    COUNT(DISTINCT c.id) as total_contacts,
    COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'new') as new_contacts,
    COUNT(DISTINCT ct.id) as total_contracts,
    COUNT(DISTINCT ct.id) FILTER (WHERE ct.status = 'active') as active_contracts,
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(DISTINCT t.id) FILTER (WHERE t.status IN ('pending', 'in_progress')) as open_tasks
FROM workspaces w
LEFT JOIN properties p ON w.id = p.workspace_id
LEFT JOIN crm_contacts c ON w.id = c.workspace_id
LEFT JOIN contracts ct ON w.id = ct.workspace_id
LEFT JOIN crm_tasks t ON w.id = t.workspace_id
GROUP BY w.id, w.name;

-- =======================================================
-- نهاية مخطط قاعدة البيانات
-- =======================================================

COMMENT ON DATABASE postgres IS 'وسِيطي - نظام إدارة العقارات الشامل';