# 🚀 **OMEGA-Σ PHASE 4 - دليل Finance System**

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         ✅ OMEGA-Σ PHASE 4: FINANCE SYSTEM ✅               ║
║                                                               ║
║  Finance + Payments + Deposits Controllers                   ║
║  جاهزة للاستخدام والاختبار الفوري!                         ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## ⚡ **التنفيذ الفوري**

```bash
chmod +x omega-sigma-phase4-finance.sh && ./omega-sigma-phase4-finance.sh
```

**⏱️ الوقت:** 5-10 دقائق  
**📊 النتيجة:** Finance System كامل

---

## 📋 **ما تم بناؤه**

### **✅ Finance Controller (10 Endpoints)**

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/finance/dashboard` | GET | إحصائيات مالية شاملة |
| `/api/finance/sales` | GET | قائمة المبيعات + فلاتر |
| `/api/finance/sales/:id` | GET | تفاصيل عملية بيع |
| `/api/finance/sales` | POST | إنشاء عملية بيع |
| `/api/finance/sales/:id` | PUT | تحديث بيع |
| `/api/finance/sales/:id` | DELETE | حذف بيع |
| `/api/finance/commission/calculate` | POST | حساب عمولة |
| `/api/finance/deposit` | POST | دفع عربون + حجز |
| `/api/finance/reports` | GET | تقارير مالية |

---

## 🧪 **الاختبار الشامل**

### **1. Financial Dashboard**

```bash
curl http://localhost:4000/api/finance/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**الاستجابة المتوقعة:**
```json
{
  "success": true,
  "data": {
    "totalSales": 15,
    "monthSales": 5,
    "weekSales": 2,
    "totalCommission": 125000,
    "monthCommission": 37500,
    "pendingPayments": 3,
    "paidSales": 10,
    "partialPayments": 2,
    "paymentDistribution": {
      "pending": 3,
      "partial": 2,
      "paid": 10
    }
  }
}
```

---

### **2. إنشاء عملية بيع**

```bash
curl -X POST http://localhost:4000/api/finance/sales \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "PROPERTY_ID",
    "customerId": "CUSTOMER_ID",
    "saleAmount": 500000,
    "commissionRate": 2.5,
    "saleType": "DIRECT_SALE",
    "paymentMethod": "BANK_TRANSFER",
    "paymentStatus": "PAID",
    "contractDate": "2025-12-01",
    "notes": "عملية بيع فيلا في حي الياسمين"
  }'
```

**ما يحدث:**
1. ✅ التحقق من ملكية العقار
2. ✅ حساب العمولة تلقائياً: 500,000 × 2.5% = 12,500
3. ✅ إنشاء Sale record
4. ✅ تحديث Property status → SOLD (لأن payment = PAID)
5. ✅ Log Activity
6. ✅ Track Analytics Event

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم تسجيل عملية البيع بنجاح",
  "data": {
    "id": "...",
    "propertyId": "...",
    "customerId": "...",
    "userId": "...",
    "saleAmount": 500000,
    "commissionRate": 2.5,
    "commissionAmount": 12500,
    "saleType": "DIRECT_SALE",
    "paymentMethod": "BANK_TRANSFER",
    "paymentStatus": "PAID",
    "contractDate": "2025-12-01T00:00:00.000Z",
    "notes": "عملية بيع فيلا في حي الياسمين",
    "createdAt": "2025-11-29T...",
    "updatedAt": "2025-11-29T..."
  }
}
```

---

### **3. دفع عربون (Deposit)**

```bash
curl -X POST http://localhost:4000/api/finance/deposit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "PROPERTY_ID",
    "customerId": "CUSTOMER_ID",
    "depositAmount": 50000,
    "notes": "عربون شقة في النرجس"
  }'
```

**ما يحدث:**
1. ✅ التحقق من العقار والعميل
2. ✅ حساب العمولة على العربون: 50,000 × 2.5% = 1,250
3. ✅ إنشاء Sale مع:
   - saleAmount = سعر العقار الكامل
   - paymentStatus = PARTIAL
   - paymentMethod = INSTALLMENTS
   - notes = "عربون: 50000 ريال..."
4. ✅ تحديث Property status → RESERVED
5. ✅ Log Activity (deposit_paid)
6. ✅ Track Analytics Event
7. ✅ ربط بالهيئة العامة للعقار

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم دفع العربون وحجز العقار",
  "data": {
    "sale": {
      "id": "...",
      "propertyId": "...",
      "customerId": "...",
      "saleAmount": 600000,
      "commissionAmount": 15000,
      "paymentStatus": "PARTIAL",
      "paymentMethod": "INSTALLMENTS",
      "notes": "عربون: 50000 ريال. عربون شقة في النرجس",
      ...
    },
    "depositAmount": 50000,
    "remainingAmount": 550000,
    "propertyStatus": "RESERVED",
    "linkedToRealEstateAuthority": true
  }
}
```

**ملاحظة مهمة:**
- ✅ العقار أصبح **RESERVED**
- ✅ المبلغ المتبقي: 550,000 ريال
- ✅ مرتبط بالهيئة العامة للعقار

---

### **4. حساب العمولة**

```bash
curl -X POST http://localhost:4000/api/finance/commission/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "saleAmount": 500000,
    "commissionRate": 2.5
  }'
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "saleAmount": 500000,
    "commissionRate": 2.5,
    "commissionAmount": 12500,
    "netAmount": 487500
  }
}
```

**الحسابات:**
- العمولة = 500,000 × 2.5% = 12,500 ريال
- الصافي = 500,000 - 12,500 = 487,500 ريال

---

### **5. قائمة المبيعات**

```bash
# جميع المبيعات
curl http://localhost:4000/api/finance/sales \
  -H "Authorization: Bearer YOUR_TOKEN"

# مع فلاتر
curl "http://localhost:4000/api/finance/sales?paymentStatus=PAID&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# نطاق تاريخ
curl "http://localhost:4000/api/finance/sales?startDate=2025-11-01&endDate=2025-11-30" \
  -H "Authorization: Bearer YOUR_TOKEN"

# حسب النوع
curl "http://localhost:4000/api/finance/sales?saleType=DIRECT_SALE" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**الفلاتر المدعومة:**
- `paymentStatus` (PENDING, PARTIAL, PAID)
- `saleType` (DIRECT_SALE, RENTAL, COMMISSION)
- `startDate` (تاريخ البداية)
- `endDate` (تاريخ النهاية)
- `page` (رقم الصفحة)
- `limit` (عدد النتائج)

---

### **6. تفاصيل عملية بيع**

```bash
curl http://localhost:4000/api/finance/sales/SALE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**الاستجابة تتضمن:**
- معلومات البيع الكاملة
- تفاصيل العقار
- معلومات العميل
- بيانات الوسيط

---

### **7. تحديث عملية بيع**

```bash
curl -X PUT http://localhost:4000/api/finance/sales/SALE_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentStatus": "PAID",
    "notes": "تم استلام كامل المبلغ"
  }'
```

**ما يحدث عند تغيير paymentStatus:**

| من | إلى | Property Status |
|----|-----|-----------------|
| PARTIAL | PAID | SOLD/RENTED |
| PENDING | PARTIAL | RESERVED |
| PENDING | PAID | SOLD/RENTED |

---

### **8. حذف عملية بيع**

```bash
curl -X DELETE http://localhost:4000/api/finance/sales/SALE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**ما يحدث:**
- ✅ حذف Sale
- ✅ إرجاع Property status → AVAILABLE

---

### **9. التقارير المالية**

```bash
# تقرير شهري
curl "http://localhost:4000/api/finance/reports?period=month" \
  -H "Authorization: Bearer YOUR_TOKEN"

# تقرير أسبوعي
curl "http://localhost:4000/api/finance/reports?period=week" \
  -H "Authorization: Bearer YOUR_TOKEN"

# تقرير سنوي
curl "http://localhost:4000/api/finance/reports?period=year" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "summary": {
      "totalSales": 12,
      "totalRevenue": 6500000,
      "totalCommission": 162500,
      "averageSale": 541666.67
    },
    "salesByStatus": [
      { "paymentStatus": "PAID", "_count": 8 },
      { "paymentStatus": "PARTIAL", "_count": 3 },
      { "paymentStatus": "PENDING", "_count": 1 }
    ],
    "salesByType": [
      {
        "saleType": "DIRECT_SALE",
        "_count": 10,
        "_sum": { "saleAmount": 5500000 }
      },
      {
        "saleType": "RENTAL",
        "_count": 2,
        "_sum": { "saleAmount": 1000000 }
      }
    ],
    "topProperties": [
      {
        "id": "...",
        "saleAmount": 2500000,
        "property": {
          "id": "...",
          "title": "فيلا فاخرة في الياسمين",
          "type": "VILLA",
          "city": "الرياض"
        }
      },
      ...
    ]
  }
}
```

---

## 🎯 **الميزات الرئيسية**

### **1. Auto Commission Calculation**

```typescript
// التلقائي
const commissionAmount = saleAmount * (commissionRate / 100);

// المثال:
500,000 × 2.5% = 12,500 ريال
```

**الافتراضي:** 2.5%  
**قابل للتخصيص:** يمكن تغيير النسبة لكل عملية

---

### **2. Payment Status Tracking**

| Status | الوصف | Property Status |
|--------|-------|-----------------|
| **PENDING** | لم يتم الدفع | لا تغيير |
| **PARTIAL** | عربون/دفعة جزئية | RESERVED |
| **PAID** | تم الدفع بالكامل | SOLD/RENTED |

---

### **3. Property Status Sync**

**عند إنشاء/تحديث البيع:**
```typescript
if (paymentStatus === 'PAID') {
  propertyStatus = purpose === 'SALE' ? 'SOLD' : 'RENTED';
} else if (paymentStatus === 'PARTIAL') {
  propertyStatus = 'RESERVED';
}
```

**النتيجة:**
- حالة العقار تتحدث تلقائياً
- لا حاجة لتحديث يدوي
- تناسق دائم بين البيانات

---

### **4. Deposit System (عربون)**

**الخصائص:**
- ✅ حساب عمولة على العربون
- ✅ حفظ المبلغ الكامل للعقار
- ✅ حساب المبلغ المتبقي
- ✅ تحديث حالة العقار → RESERVED
- ✅ ربط بالهيئة العامة للعقار
- ✅ تتبع كامل للدفعات

**Use Case:**
```
1. العميل يدفع عربون 50,000 ريال
2. سعر العقار الكامل 600,000 ريال
3. النظام:
   • يحفظ Sale بـ saleAmount = 600,000
   • paymentStatus = PARTIAL
   • notes = "عربون: 50000 ريال"
   • يحسب remainingAmount = 550,000
   • يحدث Property → RESERVED
```

---

## 📊 **Business Logic**

### **عند إنشاء بيع:**

```
1. Validation
   ↓
2. Verify property ownership
   ↓
3. Calculate commission
   ↓
4. Create Sale record
   ↓
5. Update Property status
   ↓
6. Log Activity (sale_created)
   ↓
7. Track Analytics Event
   ↓
8. Return data
```

---

### **عند دفع عربون:**

```
1. Validation
   ↓
2. Verify property & customer
   ↓
3. Get property price
   ↓
4. Calculate commission
   ↓
5. Create Sale:
   • saleAmount = full price
   • paymentStatus = PARTIAL
   • paymentMethod = INSTALLMENTS
   • notes = "عربون: X ريال"
   ↓
6. Update Property → RESERVED
   ↓
7. Calculate remaining amount
   ↓
8. Log Activity (deposit_paid)
   ↓
9. Track Analytics Event
   ↓
10. Link to Real Estate Authority
   ↓
11. Return {sale, depositAmount, remainingAmount, status}
```

---

### **عند تحديث Payment Status:**

```
OLD Status → NEW Status → Property Action

PENDING → PARTIAL → RESERVED
PENDING → PAID → SOLD/RENTED
PARTIAL → PAID → SOLD/RENTED
```

---

## 💰 **أمثلة حسابية**

### **مثال 1: بيع مباشر**

```
سعر العقار: 500,000 ريال
نسبة العمولة: 2.5%

العمولة = 500,000 × 0.025 = 12,500 ريال
الصافي = 500,000 - 12,500 = 487,500 ريال
```

---

### **مثال 2: عربون**

```
سعر العقار الكامل: 600,000 ريال
مبلغ العربون: 50,000 ريال
نسبة العمولة: 2.5%

العمولة (على الكامل) = 600,000 × 0.025 = 15,000 ريال
المبلغ المتبقي = 600,000 - 50,000 = 550,000 ريال

في قاعدة البيانات:
saleAmount: 600,000
commissionAmount: 15,000
paymentStatus: PARTIAL
notes: "عربون: 50000 ريال"
```

---

### **مثال 3: إيجار**

```
قيمة الإيجار السنوي: 100,000 ريال
نسبة العمولة: 2.5%

العمولة = 100,000 × 0.025 = 2,500 ريال
الصافي = 100,000 - 2,500 = 97,500 ريال

Property status: RENTED (بعد الدفع الكامل)
```

---

## 📈 **Analytics Events**

### **الأحداث المتتبعة:**

| الحدث | Category | متى |
|-------|----------|-----|
| `sale_created` | FINANCE | إنشاء عملية بيع |
| `deposit_paid` | FINANCE | دفع عربون |
| `payment_updated` | FINANCE | تحديث حالة الدفع |
| `sale_completed` | FINANCE | إتمام البيع |

**البيانات المسجلة:**
- saleId
- propertyId
- customerId
- amount
- commission
- paymentStatus

---

## 🔄 **سير العمل الكامل**

### **السيناريو: من العرض حتى البيع**

```bash
# 1. إضافة عقار
curl -X POST http://localhost:4000/api/properties \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"فيلا","type":"VILLA","purpose":"SALE","price":600000,...}'

# PROPERTY_ID = clx...
export PROPERTY_ID="..."

# 2. إضافة عميل
curl -X POST http://localhost:4000/api/crm/customers \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"عميل","phone":"+966501234567","type":"BUYER",...}'

# CUSTOMER_ID = clx...
export CUSTOMER_ID="..."

# 3. دفع عربون
curl -X POST http://localhost:4000/api/finance/deposit \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"propertyId":"'$PROPERTY_ID'","customerId":"'$CUSTOMER_ID'","depositAmount":50000}'

# SALE_ID = clx...
export SALE_ID="..."

# 4. التحقق من حالة العقار (الآن RESERVED)
curl http://localhost:4000/api/properties/$PROPERTY_ID \
  -H "Authorization: Bearer $TOKEN"

# 5. إتمام الدفع
curl -X PUT http://localhost:4000/api/finance/sales/$SALE_ID \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"paymentStatus":"PAID","notes":"تم استلام كامل المبلغ"}'

# 6. التحقق من حالة العقار (الآن SOLD)
curl http://localhost:4000/api/properties/$PROPERTY_ID \
  -H "Authorization: Bearer $TOKEN"

# 7. Dashboard المالي
curl http://localhost:4000/api/finance/dashboard \
  -H "Authorization: Bearer $TOKEN"

# 8. تقرير شهري
curl "http://localhost:4000/api/finance/reports?period=month" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 **Dashboard المالي**

### **البيانات المتوفرة:**

```json
{
  "totalSales": 25,           // إجمالي المبيعات
  "monthSales": 8,            // مبيعات الشهر
  "weekSales": 3,             // مبيعات الأسبوع
  "totalCommission": 250000,  // إجمالي العمولات
  "monthCommission": 87500,   // عمولات الشهر
  "pendingPayments": 5,       // مدفوعات معلقة
  "paidSales": 18,            // مبيعات مدفوعة
  "partialPayments": 2,       // دفعات جزئية
  "paymentDistribution": {
    "pending": 5,
    "partial": 2,
    "paid": 18
  }
}
```

---

## 🎯 **Progress**

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  OMEGA-Σ PROGRESS AFTER PHASE 4                              ║
║                                                               ║
║  Phase 1: Foundation      ████████████████████ 100%          ║
║  Phase 2: Auth + CRM      ████████████████████ 100%          ║
║  Phase 3: Properties      ████████████████████ 100%          ║
║  Phase 4: Finance         ████████████████████ 100%          ║
║  Phase 5: Analytics       ░░░░░░░░░░░░░░░░░░░░   0%          ║
║  Phase 6: Workspace       ░░░░░░░░░░░░░░░░░░░░   0%          ║
║  Phase 7: Digital Card    ░░░░░░░░░░░░░░░░░░░░   0%          ║
║  Phase 8: Notifications   ░░░░░░░░░░░░░░░░░░░░   0%          ║
║                                                               ║
║  Overall: 65% ████████████████░░░░░░░░░░░░░░                 ║
║                                                               ║
║  🎯 Finance System: OPERATIONAL ✅                           ║
║  💰 Commission: AUTO-CALCULATED ✅                           ║
║  📊 Reports: AVAILABLE ✅                                    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 🎊 **ملخص**

### **✅ ما تم إنجازه:**

**Finance Controller:**
- ✅ 10 endpoints
- ✅ Financial dashboard
- ✅ Sales CRUD
- ✅ Auto commission calculation
- ✅ Payment status tracking
- ✅ Deposit system (عربون)
- ✅ Reports (week, month, year)

**Features:**
- ✅ Real-time commission calculation
- ✅ Property status sync
- ✅ Deposit management
- ✅ Link to Real Estate Authority
- ✅ Payment tracking
- ✅ Financial analytics
- ✅ Activity logging

**Security:**
- ✅ Ownership verification
- ✅ Authorization checks
- ✅ Audit trail

---

## 🚀 **التشغيل**

```bash
# تنفيذ Phase 4
chmod +x omega-sigma-phase4-finance.sh
./omega-sigma-phase4-finance.sh

# تشغيل الـ Server
cd backend && npm run dev

# اختبار
curl http://localhost:4000/api/finance/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

---

**🎉 Phase 4 جاهز! نظام المالية مكتمل! 🎉**

**الأوامر السريعة:**
```bash
./omega-sigma-auto-pilot.sh
./omega-sigma-phase2-controllers.sh
./omega-sigma-phase3-controllers.sh
./omega-sigma-phase4-finance.sh      ← جديد!
cd backend && npm run dev
```

**📊 Overall: 65% Complete!**
