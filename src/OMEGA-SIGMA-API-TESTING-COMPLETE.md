# 🧪 **OMEGA-Σ - دليل اختبار API الكامل**

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         🧪 COMPLETE API TESTING GUIDE 🧪                    ║
║                                                               ║
║  جميع Endpoints + أمثلة curl كاملة                          ║
║  جاهزة للنسخ واللصق! ⚡                                      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 🚀 **قبل البدء**

### **تشغيل الـ Server:**
```bash
cd backend && npm run dev
```

### **متغيرات مهمة:**
```bash
# احفظ الـ Token بعد التسجيل/الدخول
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# احفظ المعرفات
export PROPERTY_ID="clx..."
export CUSTOMER_ID="clx..."
export REQUEST_ID="clx..."
```

---

## 1️⃣ **Authentication APIs**

### **1.1 تسجيل مستخدم جديد**

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456",
    "name": "محمد أحمد السعيد",
    "phone": "+966501234567",
    "jobTitle": "وسيط عقاري",
    "company": "العقارات الذهبية"
  }'
```

**ستحصل على:**
- ✅ بيانات المستخدم
- ✅ Workspace شخصي
- ✅ AccessToken
- ✅ RefreshToken
- ✅ DigitalCard

**احفظ الـ Token:**
```bash
export TOKEN="AccessToken_من_الاستجابة"
```

---

### **1.2 تسجيل الدخول**

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456"
  }'
```

---

### **1.3 تحديث Token**

```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

---

### **1.4 تفعيل 2FA**

```bash
curl -X POST http://localhost:4000/api/auth/2fa/enable \
  -H "Authorization: Bearer $TOKEN"
```

**ستحصل على:**
- Secret key
- QR Code (base64)

**استخدم Google Authenticator:**
1. امسح QR Code
2. احصل على الرمز
3. تحقق بالخطوة التالية

---

### **1.5 التحقق من 2FA**

```bash
curl -X POST http://localhost:4000/api/auth/2fa/verify \
  -H "Content-Type: application/json" \
  -d '{
    "token": "123456",
    "tempToken": "TEMP_TOKEN_من_الدخول"
  }'
```

---

## 2️⃣ **CRM APIs**

### **2.1 Dashboard CRM**

```bash
curl http://localhost:4000/api/crm/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

**ستحصل على:**
```json
{
  "totalCustomers": 5,
  "leads": 2,
  "prospects": 1,
  "qualified": 1,
  "converted": 1,
  "conversionRate": 20,
  "pendingFollowups": 3,
  "todayAppointments": 2
}
```

---

### **2.2 إضافة عميل**

```bash
curl -X POST http://localhost:4000/api/crm/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "خالد العتيبي",
    "phone": "+966509876543",
    "email": "khaled@example.com",
    "alternatePhone": "+966501111111",
    "type": "BUYER",
    "status": "LEAD",
    "source": "موقع إلكتروني",
    "budget": 500000,
    "location": "حي الياسمين",
    "city": "الرياض",
    "district": "الياسمين",
    "requirements": "شقة 3 غرف في حي راقي",
    "notes": "عميل مهتم جداً",
    "tags": ["VIP", "مهتم بالفلل"],
    "priority": "HIGH"
  }'
```

**احفظ الـ ID:**
```bash
export CUSTOMER_ID="clx..."
```

---

### **2.3 قائمة العملاء**

```bash
# جميع العملاء
curl http://localhost:4000/api/crm/customers \
  -H "Authorization: Bearer $TOKEN"

# مع فلاتر
curl "http://localhost:4000/api/crm/customers?status=LEAD&city=الرياض&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# بحث
curl "http://localhost:4000/api/crm/customers?search=خالد" \
  -H "Authorization: Bearer $TOKEN"
```

---

### **2.4 تفاصيل عميل**

```bash
curl http://localhost:4000/api/crm/customers/$CUSTOMER_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

### **2.5 إضافة تفاعل**

```bash
curl -X POST http://localhost:4000/api/crm/interactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "'$CUSTOMER_ID'",
    "type": "CALL",
    "subject": "مكالمة متابعة",
    "notes": "تم الاتصال بالعميل ومناقشة متطلباته بالتفصيل",
    "outcome": "مهتم بمعاينة 3 عقارات",
    "nextAction": "تحديد مواعيد المعاينة",
    "duration": 15
  }'
```

---

### **2.6 إضافة متابعة**

```bash
curl -X POST http://localhost:4000/api/crm/followups \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "'$CUSTOMER_ID'",
    "subject": "معاينة عقار",
    "description": "تحديد موعد لمعاينة الفيلا في حي الياسمين",
    "dueDate": "2025-12-01T10:00:00Z",
    "priority": "HIGH",
    "status": "PENDING"
  }'
```

---

## 3️⃣ **Properties APIs**

### **3.1 إضافة عقار**

```bash
curl -X POST http://localhost:4000/api/properties \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "فيلا فاخرة في حي الياسمين",
    "type": "VILLA",
    "purpose": "SALE",
    "price": 2500000,
    "area": 500,
    "bedrooms": 5,
    "bathrooms": 4,
    "location": "حي الياسمين، شارع الورد، رقم 123",
    "city": "الرياض",
    "district": "الياسمين",
    "street": "شارع الورد",
    "latitude": 24.7136,
    "longitude": 46.6753,
    "description": "فيلا فاخرة بمواصفات عالية على مساحة 500 متر مربع، تحتوي على 5 غرف نوم و 4 حمامات، مع حديقة واسعة ومسبح خاص",
    "features": ["مسبح", "حديقة", "مصعد", "غرفة خادمة", "غرفة سائق", "مطبخ مجهز", "مكيفات", "موقف 4 سيارات"],
    "images": ["/villa1.jpg", "/villa2.jpg", "/villa3.jpg"],
    "videos": ["/villa-tour.mp4"],
    "documents": ["/deed.pdf", "/plans.pdf"],
    "ownerName": "عبدالله المالك",
    "ownerPhone": "+966509999999"
  }'
```

**احفظ الـ ID:**
```bash
export PROPERTY_ID="clx..."
```

---

### **3.2 نشر العقار (Touch-to-Copy Link)**

```bash
curl -X POST http://localhost:4000/api/properties/$PROPERTY_ID/publish \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "platforms": ["nova_marketplace", "aqar", "haraj", "twitter"]
  }'
```

**ستحصل على:**
```json
{
  "success": true,
  "message": "تم نشر العقار بنجاح",
  "data": {
    "shareableLink": "http://localhost:3000/property/clx...",
    "platforms": ["nova_marketplace", "aqar", "haraj", "twitter"],
    "touchToCopy": "http://localhost:3000/property/clx..."
  }
}
```

**انسخ الـ touchToCopy واستخدمه مباشرة!** 📋

---

### **3.3 قائمة العقارات (عامة - بدون معلومات المالك)**

```bash
# جميع العقارات
curl http://localhost:4000/api/properties

# مع فلاتر
curl "http://localhost:4000/api/properties?city=الرياض&type=VILLA&purpose=SALE"

# نطاق سعر
curl "http://localhost:4000/api/properties?minPrice=1000000&maxPrice=3000000"

# نطاق مساحة
curl "http://localhost:4000/api/properties?minArea=300&maxArea=600"

# عدد الغرف
curl "http://localhost:4000/api/properties?bedrooms=5"

# بحث
curl "http://localhost:4000/api/properties?search=فيلا"

# مجموع الفلاتر
curl "http://localhost:4000/api/properties?city=الرياض&type=VILLA&minPrice=2000000&maxPrice=3000000&bedrooms=5"
```

**ملاحظة:** معلومات المالك **لا تظهر** هنا! ✅

---

### **3.4 تفاصيل عقار (مع الحماية)**

```bash
# كزائر (بدون token)
curl http://localhost:4000/api/properties/$PROPERTY_ID

# كمستخدم مسجل
curl http://localhost:4000/api/properties/$PROPERTY_ID \
  -H "Authorization: Bearer $TOKEN"
```

**الفرق:**
- **زائر:** لا يرى معلومات المالك ❌
- **مستخدم عادي:** لا يرى معلومات المالك ❌
- **المالك:** يرى كل شيء ✅
- **مدير:** يرى كل شيء ✅

---

### **3.5 عقاراتي (Owner Dashboard)**

```bash
curl http://localhost:4000/api/properties/my/properties \
  -H "Authorization: Bearer $TOKEN"
```

**ستحصل على:**
- جميع عقاراتك
- معلومات المالك كاملة ✅
- سجل المشاهدات (آخر 5)
- عدد المبيعات
- الإحصائيات

---

### **3.6 أزرار الإجراءات**

#### **زر: تواصل**
```bash
curl -X POST http://localhost:4000/api/properties/$PROPERTY_ID/action \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "contact"}'
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "phone": "+966509999999",
    "message": "يمكنك الاتصال على الرقم"
  }
}
```

---

#### **زر: واتساب**
```bash
curl -X POST http://localhost:4000/api/properties/$PROPERTY_ID/action \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "whatsapp"}'
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "link": "https://wa.me/966509999999?text=...",
    "message": "فتح واتساب"
  }
}
```

**افتح الرابط في المتصفح أو نسخه للعميل!**

---

#### **زر: تحديد موعد**
```bash
curl -X POST http://localhost:4000/api/properties/$PROPERTY_ID/action \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "schedule_appointment",
    "customerId": "'$CUSTOMER_ID'",
    "startTime": "2025-12-01T10:00:00Z",
    "endTime": "2025-12-01T11:00:00Z"
  }'
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "appointment": {
      "id": "...",
      "title": "معاينة عقار: فيلا فاخرة في حي الياسمين",
      "startTime": "2025-12-01T10:00:00.000Z",
      "endTime": "2025-12-01T11:00:00.000Z",
      "status": "SCHEDULED",
      "type": "SITE_VISIT"
    },
    "message": "تم تحديد موعد المعاينة"
  }
}
```

---

#### **زر: دفع عربون**
```bash
curl -X POST http://localhost:4000/api/properties/$PROPERTY_ID/action \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "pay_deposit",
    "customerId": "'$CUSTOMER_ID'"
  }'
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "sale": {
      "id": "...",
      "saleAmount": 2500000,
      "commissionRate": 2.5,
      "commissionAmount": 62500,
      "paymentStatus": "PARTIAL",
      "paymentMethod": "INSTALLMENTS"
    },
    "message": "تم دفع العربون وحجز العقار"
  }
}
```

**ملاحظة:** حالة العقار أصبحت `RESERVED` تلقائياً!

---

### **3.7 تعديل عقار**

```bash
curl -X PUT http://localhost:4000/api/properties/$PROPERTY_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "فيلا فاخرة محدثة",
    "price": 2400000,
    "description": "خصم 100,000 ريال!"
  }'
```

---

### **3.8 حذف عقار**

```bash
curl -X DELETE http://localhost:4000/api/properties/$PROPERTY_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 4️⃣ **Requests APIs**

### **4.1 إنشاء طلب**

```bash
curl -X POST http://localhost:4000/api/requests \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "SALE",
    "propertyType": "APARTMENT",
    "budgetMin": 500000,
    "budgetMax": 800000,
    "city": "الرياض",
    "districts": ["الياسمين", "الملقا", "النرجس", "العليا"],
    "minArea": 120,
    "maxArea": 200,
    "minBedrooms": 3,
    "minBathrooms": 2,
    "features": ["موقف سيارات", "مصعد", "أمن 24/7", "حديقة"],
    "description": "أبحث عن شقة عائلية واسعة في حي راقي وهادئ"
  }'
```

**احفظ الـ ID:**
```bash
export REQUEST_ID="clx..."
```

---

### **4.2 مطابقة الطلب (Smart Matching)**

```bash
curl http://localhost:4000/api/requests/$REQUEST_ID/matches \
  -H "Authorization: Bearer $TOKEN"
```

**ستحصل على:**
```json
{
  "success": true,
  "data": {
    "request": { ... },
    "matches": [
      {
        "id": "...",
        "title": "شقة 3 غرف في الياسمين",
        "price": 650000,
        "area": 150,
        "bedrooms": 3,
        "bathrooms": 2,
        "city": "الرياض",
        "district": "الياسمين",
        "features": ["موقف سيارات", "مصعد"],
        "viewCount": 35
      },
      ...
    ],
    "matchCount": 5
  }
}
```

**الخوارزمية تطابق:**
- ✅ النوع (APARTMENT)
- ✅ الغرض (SALE)
- ✅ المدينة (الرياض)
- ✅ الأحياء (الياسمين، الملقا، إلخ)
- ✅ السعر (500K - 800K)
- ✅ المساحة (120 - 200)
- ✅ عدد الغرف (≥ 3)
- ✅ الحمامات (≥ 2)

---

### **4.3 قائمة الطلبات**

```bash
# جميع الطلبات
curl http://localhost:4000/api/requests

# طلباتي فقط
curl http://localhost:4000/api/requests/my/requests \
  -H "Authorization: Bearer $TOKEN"

# مع فلاتر
curl "http://localhost:4000/api/requests?city=الرياض&type=SALE&status=ACTIVE"
```

---

### **4.4 تعديل طلب**

```bash
curl -X PUT http://localhost:4000/api/requests/$REQUEST_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "budgetMax": 900000,
    "districts": ["الياسمين", "الملقا", "النرجس", "العليا", "الربوة"]
  }'
```

---

### **4.5 حذف طلب**

```bash
curl -X DELETE http://localhost:4000/api/requests/$REQUEST_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔄 **سير العمل الكامل (End-to-End)**

### **السيناريو: من التسجيل حتى الحجز**

```bash
# 1. تسجيل مستخدم
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"broker@test.com","password":"Test@123","name":"أحمد الوسيط"}'

# احفظ TOKEN من الاستجابة
export TOKEN="..."

# 2. إضافة عميل
curl -X POST http://localhost:4000/api/crm/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"عميل تجريبي","phone":"+966501234567","type":"BUYER","status":"LEAD","city":"الرياض"}'

# احفظ CUSTOMER_ID
export CUSTOMER_ID="..."

# 3. إضافة عقار
curl -X POST http://localhost:4000/api/properties \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"شقة للبيع","type":"APARTMENT","purpose":"SALE","price":600000,"area":150,"city":"الرياض","ownerName":"المالك","ownerPhone":"+966509999999"}'

# احفظ PROPERTY_ID
export PROPERTY_ID="..."

# 4. نشر العقار
curl -X POST http://localhost:4000/api/properties/$PROPERTY_ID/publish \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"platforms":["nova_marketplace"]}'

# 5. مشاهدة العقار (كعميل)
curl http://localhost:4000/api/properties/$PROPERTY_ID \
  -H "Authorization: Bearer $TOKEN"

# 6. التواصل عبر واتساب
curl -X POST http://localhost:4000/api/properties/$PROPERTY_ID/action \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"action":"whatsapp"}'

# 7. تحديد موعد معاينة
curl -X POST http://localhost:4000/api/properties/$PROPERTY_ID/action \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"action":"schedule_appointment","customerId":"'$CUSTOMER_ID'","startTime":"2025-12-01T10:00:00Z","endTime":"2025-12-01T11:00:00Z"}'

# 8. دفع عربون وحجز
curl -X POST http://localhost:4000/api/properties/$PROPERTY_ID/action \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"action":"pay_deposit","customerId":"'$CUSTOMER_ID'"}'

# 9. التحقق من Dashboard
curl http://localhost:4000/api/crm/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 **Filters المدعومة**

### **Properties Filters:**

| Filter | Type | مثال |
|--------|------|------|
| `type` | PropertyType | `VILLA`, `APARTMENT`, `LAND` |
| `purpose` | PropertyPurpose | `SALE`, `RENT` |
| `status` | PropertyStatus | `AVAILABLE`, `RESERVED`, `SOLD` |
| `city` | String | `الرياض`, `جدة` |
| `district` | String | `الياسمين`, `الملقا` |
| `minPrice` | Number | `1000000` |
| `maxPrice` | Number | `3000000` |
| `minArea` | Number | `300` |
| `maxArea` | Number | `600` |
| `bedrooms` | Number | `5` |
| `search` | String | `فيلا`, `شقة` |

---

### **Requests Filters:**

| Filter | Type | مثال |
|--------|------|------|
| `type` | PropertyPurpose | `SALE`, `RENT` |
| `propertyType` | PropertyType | `VILLA`, `APARTMENT` |
| `city` | String | `الرياض` |
| `status` | RequestStatus | `ACTIVE`, `FULFILLED` |

---

## 🎯 **Business Logic المطبق**

### **عند إنشاء عقار:**
```
✅ Validation (title, type, purpose, price, city)
✅ ربط بالمستخدم (ownerId)
✅ حفظ معلومات المالك 🔒
✅ status = AVAILABLE
✅ publishedAt = now
✅ Log Activity
✅ Track Analytics Event
```

---

### **عند نشر عقار:**
```
✅ التحقق من الملكية
✅ توليد Touch-to-Copy Link
✅ تحديث publishedPlatforms
✅ تحديث publishedAt
✅ Log Activity
✅ Track Analytics Event
```

---

### **عند مشاهدة عقار:**
```
✅ جلب التفاصيل
✅ إنشاء PropertyViewLog
✅ viewCount++
✅ Track Analytics Event
✅ التحقق من الصلاحيات
✅ حذف معلومات المالك (إذا لم يكن مصرحاً)
```

---

### **عند دفع عربون:**
```
✅ إنشاء Sale record
✅ حساب العمولة (2.5%)
✅ paymentStatus = PARTIAL
✅ Property status = RESERVED
✅ Track Analytics Event
```

---

### **عند مطابقة طلب:**
```
✅ Build criteria من الطلب
✅ البحث في العقارات المتاحة
✅ تطبيق الفلاتر:
   • propertyType
   • purpose
   • city
   • districts
   • budget range
   • area range
   • bedrooms
   • bathrooms
✅ الترتيب:
   • الأكثر مشاهدة أولاً
   • الأحدث أولاً
✅ إرجاع أفضل 20 مطابقة
```

---

## 📈 **Analytics Events**

### **الأحداث المسجلة:**

| الحدث | Category | متى |
|-------|----------|-----|
| `property_created` | PROPERTIES | إنشاء عقار |
| `property_viewed` | PROPERTIES | مشاهدة عقار |
| `property_published` | PROPERTIES | نشر عقار |
| `property_contact` | PROPERTIES | زر تواصل |
| `property_whatsapp` | PROPERTIES | زر واتساب |
| `property_schedule_appointment` | PROPERTIES | زر موعد |
| `property_pay_deposit` | PROPERTIES | زر عربون |
| `request_created` | REQUESTS | إنشاء طلب |
| `request_matched` | REQUESTS | مطابقة طلب |

---

## 🔍 **اختبار الحماية**

### **Test 1: معلومات المالك في القائمة**

```bash
curl http://localhost:4000/api/properties | jq '.data.properties[0]'
```

**المتوقع:** لا يحتوي على `ownerName`, `ownerPhone`, `ownerId` ✅

---

### **Test 2: معلومات المالك في التفاصيل (زائر)**

```bash
curl http://localhost:4000/api/properties/$PROPERTY_ID | jq
```

**المتوقع:** لا يحتوي على `ownerName`, `ownerPhone` ✅

---

### **Test 3: معلومات المالك في التفاصيل (مالك)**

```bash
curl http://localhost:4000/api/properties/$PROPERTY_ID \
  -H "Authorization: Bearer $TOKEN" | jq
```

**المتوقع:** يحتوي على `ownerName`, `ownerPhone` ✅ (إذا كنت المالك)

---

### **Test 4: Owner Dashboard**

```bash
curl http://localhost:4000/api/properties/my/properties \
  -H "Authorization: Bearer $TOKEN" | jq
```

**المتوقع:** 
- جميع عقاراتك ✅
- معلومات المالك كاملة ✅
- viewLogs ✅

---

## 🎊 **ملخص**

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  PHASE 3 COMPLETE: REAL ESTATE SYSTEM                        ║
║                                                               ║
║  Properties:          ████████████████████ 100%              ║
║    • CRUD             ✅                                     ║
║    • Owner Protection ✅ 🔒                                  ║
║    • View Tracking    ✅                                     ║
║    • Publishing       ✅                                     ║
║    • Action Buttons   ✅                                     ║
║                                                               ║
║  Requests:            ████████████████████ 100%              ║
║    • CRUD             ✅                                     ║
║    • Smart Matching   ✅                                     ║
║    • Filters          ✅                                     ║
║                                                               ║
║  Security:            ████████████████████ 100%              ║
║    • Owner Info       ✅ 🔒                                  ║
║    • Access Control   ✅                                     ║
║                                                               ║
║  Analytics:           ████████████████████ 100%              ║
║    • Event Tracking   ✅                                     ║
║    • View Logging     ✅                                     ║
║                                                               ║
║  Overall Phase 3: 100% ████████████████████                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

**🎉 Phase 3 جاهز! نظام عقارات متكامل! 🎉**

**التنفيذ:**
```bash
./omega-sigma-phase3-controllers.sh
cd backend && npm run dev
```

**الاختبار:**
```bash
# إنشاء عقار
curl -X POST http://localhost:4000/api/properties -H "Authorization: Bearer $TOKEN" -d '...'

# نشر + رابط
curl -X POST http://localhost:4000/api/properties/$PROPERTY_ID/publish -H "Authorization: Bearer $TOKEN"

# مطابقة ذكية
curl http://localhost:4000/api/requests/$REQUEST_ID/matches -H "Authorization: Bearer $TOKEN"
```

**📊 Overall: 55% Complete!**
