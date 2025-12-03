# 🚀 **OMEGA-Σ PHASE 2 - دليل Controllers**

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         ✅ OMEGA-Σ PHASE 2: API CONTROLLERS ✅              ║
║                                                               ║
║  Authentication + CRM Controllers                            ║
║  جاهزة للاستخدام والاختبار الفوري!                         ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## ⚡ **التنفيذ الفوري**

```bash
chmod +x omega-sigma-phase2-controllers.sh && ./omega-sigma-phase2-controllers.sh
```

**⏱️ الوقت:** 5-10 دقائق  
**📊 النتيجة:** Controllers كاملة جاهزة

---

## 📋 **ما تم بناؤه**

### **✅ Authentication Controller (6 Endpoints)**

| Endpoint | Method | الوصف | Body |
|----------|--------|-------|------|
| `/api/auth/register` | POST | تسجيل مستخدم جديد | email, password, name, phone |
| `/api/auth/login` | POST | تسجيل الدخول | email, password |
| `/api/auth/refresh` | POST | تحديث Token | refreshToken |
| `/api/auth/2fa/enable` | POST | تفعيل المصادقة الثنائية | - |
| `/api/auth/2fa/verify` | POST | التحقق من 2FA | token, tempToken |

---

### **✅ CRM Controller (8 Endpoints)**

| Endpoint | Method | الوصف | Params/Body |
|----------|--------|-------|-------------|
| `/api/crm/dashboard` | GET | إحصائيات CRM | - |
| `/api/crm/customers` | GET | قائمة العملاء | page, limit, status, type, city, search |
| `/api/crm/customers/:id` | GET | تفاصيل عميل | id |
| `/api/crm/customers` | POST | إضافة عميل | name, phone, email, type, budget... |
| `/api/crm/customers/:id` | PUT | تحديث عميل | id + data |
| `/api/crm/customers/:id` | DELETE | حذف عميل | id |
| `/api/crm/interactions` | POST | إضافة تفاعل | customerId, type, subject, notes |
| `/api/crm/followups` | POST | إضافة متابعة | customerId, subject, dueDate |

---

## 🧪 **الاختبار**

### **1. تشغيل الـ Server**

```bash
cd backend
npm run dev
```

يجب أن ترى:
```
╔═══════════════════════════════════════════════════════════════╗
║        🚀 OMEGA-Σ API SERVER RUNNING 🚀                     ║
║        Server: http://localhost:4000                         ║
╚═══════════════════════════════════════════════════════════════╝
```

---

### **2. اختبار Authentication**

#### **تسجيل مستخدم جديد:**

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456",
    "name": "محمد أحمد",
    "phone": "+966501234567"
  }'
```

**الاستجابة المتوقعة:**
```json
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "data": {
    "user": {
      "id": "...",
      "email": "test@example.com",
      "name": "محمد أحمد",
      "role": "BROKER"
    },
    "workspace": {
      "id": "...",
      "name": "مساحة محمد أحمد",
      "type": "PERSONAL"
    },
    "tokens": {
      "accessToken": "eyJhbGci...",
      "refreshToken": "eyJhbGci..."
    }
  }
}
```

---

#### **تسجيل الدخول:**

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456"
  }'
```

**الاستجابة المتوقعة:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

**احفظ الـ accessToken للاستخدام في الطلبات التالية!**

---

#### **تحديث Token:**

```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

---

### **3. اختبار CRM**

#### **الحصول على Dashboard:**

```bash
curl http://localhost:4000/api/crm/dashboard \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**الاستجابة المتوقعة:**
```json
{
  "success": true,
  "data": {
    "totalCustomers": 0,
    "leads": 0,
    "prospects": 0,
    "qualified": 0,
    "converted": 0,
    "conversionRate": 0,
    "pendingFollowups": 0,
    "todayAppointments": 0
  }
}
```

---

#### **إضافة عميل:**

```bash
curl -X POST http://localhost:4000/api/crm/customers \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "خالد العتيبي",
    "phone": "+966509876543",
    "email": "khaled@example.com",
    "type": "BUYER",
    "status": "LEAD",
    "budget": 500000,
    "city": "الرياض",
    "district": "الياسمين",
    "priority": "HIGH",
    "requirements": "شقة 3 غرف في حي راقي"
  }'
```

**الاستجابة المتوقعة:**
```json
{
  "success": true,
  "message": "تم إضافة العميل بنجاح",
  "data": {
    "id": "...",
    "name": "خالد العتيبي",
    "phone": "+966509876543",
    ...
  }
}
```

---

#### **الحصول على قائمة العملاء:**

```bash
# جميع العملاء
curl http://localhost:4000/api/crm/customers \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# مع فلاتر
curl "http://localhost:4000/api/crm/customers?status=LEAD&city=الرياض&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# مع بحث
curl "http://localhost:4000/api/crm/customers?search=خالد" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

#### **الحصول على تفاصيل عميل:**

```bash
curl http://localhost:4000/api/crm/customers/CUSTOMER_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**الاستجابة تتضمن:**
- بيانات العميل الأساسية
- آخر التفاعلات
- المتابعات القادمة
- المواعيد المجدولة
- المبيعات المرتبطة

---

#### **إضافة تفاعل:**

```bash
curl -X POST http://localhost:4000/api/crm/interactions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUSTOMER_ID",
    "type": "CALL",
    "subject": "متابعة استفسار",
    "notes": "تم الاتصال بالعميل لمناقشة متطلباته",
    "outcome": "مهتم بمعاينة عقار",
    "duration": 15
  }'
```

---

#### **إضافة متابعة:**

```bash
curl -X POST http://localhost:4000/api/crm/followups \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUSTOMER_ID",
    "subject": "معاينة عقار",
    "description": "تحديد موعد لمعاينة الفيلا في الياسمين",
    "dueDate": "2025-12-01T10:00:00Z",
    "priority": "HIGH",
    "status": "PENDING"
  }'
```

---

## 🔒 **الأمان**

### **✅ المطبق حالياً:**

1. **Password Hashing** - bcrypt بـ 12 rounds
2. **JWT Tokens** - Access (1h) + Refresh (7d)
3. **2FA** - Google Authenticator compatible
4. **Account Locking** - بعد 5 محاولات فاشلة (15 دقيقة)
5. **Activity Logging** - كل الأحداث مسجلة
6. **Analytics Tracking** - تتبع جميع الإجراءات

---

### **⏳ يحتاج إضافة (Phase 3):**

1. **Authentication Middleware** - للتحقق من Tokens
2. **Rate Limiting per User** - حد للطلبات
3. **Input Validation** - Zod schemas
4. **RBAC** - صلاحيات حسب الدور
5. **Request Sanitization** - تنظيف المدخلات

---

## 📊 **Database Changes**

### **ما يحدث عند التسجيل:**

```
1. إنشاء User
   ↓
2. Hash Password (bcrypt)
   ↓
3. إنشاء Workspace شخصي
   ↓
4. إنشاء WorkspaceMembership (OWNER)
   ↓
5. تحديث currentWorkspaceId
   ↓
6. إنشاء DigitalCard
   ↓
7. تسجيل Activity (user_registered)
   ↓
8. إصدار JWT Tokens
```

---

### **ما يحدث عند إضافة عميل:**

```
1. إنشاء Customer
   ↓
2. ربطه بالمستخدم (assignedTo)
   ↓
3. تسجيل Activity (customer_created)
   ↓
4. تسجيل AnalyticsEvent
   ↓
5. إرجاع البيانات
```

---

## 🎯 **الميزات المدمجة**

### **✅ Authentication:**
- تسجيل حساب جديد
- تسجيل دخول
- JWT مع Refresh Token
- 2FA (Google Authenticator)
- Account locking بعد محاولات فاشلة
- Password strength requirements

### **✅ CRM:**
- Dashboard مع إحصائيات شاملة
- إدارة العملاء (CRUD)
- فلترة متقدمة (Status, Type, City, Search)
- Pagination
- إضافة تفاعلات
- إضافة متابعات
- تتبع النشاطات
- تحليلات الأحداث

### **✅ Auto-Creation:**
- Workspace شخصي لكل مستخدم جديد
- Digital Card لكل مستخدم
- WorkspaceMembership تلقائي

---

## 🐛 **استكشاف الأخطاء**

### **خطأ: "Cannot find module '@prisma/client'"**

```bash
cd backend
npx prisma generate
npm run build
```

---

### **خطأ: "Email already exists"**

```bash
# استخدم email مختلف أو احذف المستخدم القديم من قاعدة البيانات
npx prisma studio
# ثم احذف المستخدم من جدول users
```

---

### **خطأ: "Invalid token"**

```bash
# تأكد من:
# 1. استخدام Token صحيح
# 2. Token لم ينته (1 ساعة)
# 3. Header صحيح: Authorization: Bearer TOKEN
```

---

### **خطأ: "User not found"**

```bash
# تأكد من تسجيل المستخدم أولاً
curl -X POST http://localhost:4000/api/auth/register ...
```

---

## 📈 **Progress**

### **Phase 2 - المكتمل:**

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  PHASE 2 COMPLETE: AUTHENTICATION + CRM                      ║
║                                                               ║
║  Authentication:      ████████████████████ 100%              ║
║    • Register         ✅                                     ║
║    • Login            ✅                                     ║
║    • Refresh          ✅                                     ║
║    • 2FA              ✅                                     ║
║                                                               ║
║  CRM:                 ████████████████████ 100%              ║
║    • Dashboard        ✅                                     ║
║    • Customers CRUD   ✅                                     ║
║    • Interactions     ✅                                     ║
║    • Followups        ✅                                     ║
║                                                               ║
║  Overall Phase 2: 100% ████████████████████                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

### **الخطوات التالية:**

```
Phase 3: Properties + Requests Controllers ⏳
  • Properties CRUD (with owner info protection)
  • Requests CRUD
  • Property view tracking
  • Matching algorithm
  • Publishing system

Phase 4: Finance Controllers ⏳
  • Sales CRUD
  • Commissions calculation
  • Payment tracking
  • Financial reports

Phase 5: Analytics Engine ⏳
  • Events tracking
  • Metrics collection
  • Dashboard API
  • Reports generation

Phase 6: Workspace Management ⏳
  • Workspaces CRUD
  • Members management
  • Invitations system
  • Role management

Phase 7: Digital Card System ⏳
  • Card CRUD
  • QR code generation
  • Share tracking
  • Analytics

Phase 8: Notifications System ⏳
  • Push notifications
  • Real-time via WebSocket
  • Notification preferences
  • Read/unread tracking
```

---

## 🎊 **ملخص**

✅ **تم إنشاء:**
- Authentication Controller (6 endpoints)
- CRM Controller (8 endpoints)
- Routes متكاملة
- Business Logic كاملة
- Activity Logging
- Analytics Tracking

✅ **جاهز للاستخدام:**
- تسجيل مستخدمين جدد
- تسجيل دخول
- إدارة العملاء
- إضافة تفاعلات ومتابعات

⏳ **يحتاج تطوير:**
- Authentication Middleware
- Properties Controllers
- Finance Controllers
- Analytics Engine
- Workspace Management
- Digital Card
- Notifications

---

**🎉 Phase 2 جاهز! ابدأ الاختبار الآن! 🎉**

```bash
cd backend && npm run dev
```
