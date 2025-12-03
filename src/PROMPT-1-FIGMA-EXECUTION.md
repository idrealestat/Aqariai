# 🎨 **FIGMA PROTOTYPE - Execution Prompt**
## **Nova CRM - عقاري AI**

---

## 📋 **PROJECT SETUP**

### **Create New Figma File:**
```
File Name: "Nova CRM - عقاري AI"
Team: Real Estate CRM
Version: 1.0.0
```

### **Pages Structure:**
Create 5 pages in this order:

1. **🎨 Design System** - Foundation elements
2. **📱 Screens (00-14)** - All application screens
3. **🔄 Flows** - User journeys & interactions
4. **📚 Documentation** - Notes & guidelines
5. **🚀 Dev Handoff** - Export-ready assets

---

## 🎨 **DESIGN SYSTEM PAGE**

### **1. Colors:**

#### **Brand Colors:**
```css
/* Primary - Royal Green */
--primary-900: #01411C
--primary-800: #025A27
--primary-700: #037332
--primary-600: #048C3D
--primary-500: #05A548
--primary-400: #37B769
--primary-300: #69C98A
--primary-200: #9BDBAB
--primary-100: #CDEDCD
--primary-50: #E6F6E6

/* Secondary - Gold */
--secondary-900: #8C7020
--secondary-800: #A58628
--secondary-700: #BE9C30
--secondary-600: #D4AF37
--secondary-500: #DCC05F
--secondary-400: #E4D087
--secondary-300: #ECE0AF
--secondary-200: #F4EFD7
--secondary-100: #FAF7EB
--secondary-50: #FDFCF5

/* Extended Palette */
/* Success */
--success-900: #0F5132
--success-500: #198754
--success-100: #D1E7DD

/* Danger */
--danger-900: #58151C
--danger-500: #DC3545
--danger-100: #F8D7DA

/* Warning */
--warning-900: #664D03
--warning-500: #FFC107
--warning-100: #FFF3CD

/* Info */
--info-900: #055160
--info-500: #0DCAF0
--info-100: #CFF4FC

/* Neutrals */
--neutral-900: #1A1A1A
--neutral-800: #2D2D2D
--neutral-700: #404040
--neutral-600: #666666
--neutral-500: #808080
--neutral-400: #999999
--neutral-300: #B3B3B3
--neutral-200: #CCCCCC
--neutral-100: #E6E6E6
--neutral-50: #F5F5F5

/* Backgrounds */
--bg-primary: #FFFFFF
--bg-secondary: #F8F9FA
--bg-tertiary: #F5F5F5
--bg-dark: #1A1A1A

/* Text Colors */
--text-primary: #1A1A1A
--text-secondary: #666666
--text-tertiary: #999999
--text-inverse: #FFFFFF
--text-link: #01411C
--text-success: #198754
--text-danger: #DC3545
```

**Create Color Styles in Figma:**
- Right Panel → Color Styles → Create all 50 colors
- Name format: `Color/Primary/900`, `Color/Secondary/500`

---

### **2. Typography:**

**Font Family: Cairo (Google Font)**

#### **Text Styles:**
```
Display/Large
- Font: Cairo
- Weight: Bold (700)
- Size: 48px
- Line Height: 64px
- Letter Spacing: -2%

Display/Medium
- Weight: Bold (700)
- Size: 36px
- Line Height: 48px
- Letter Spacing: -1%

Heading/H1
- Weight: Bold (700)
- Size: 32px
- Line Height: 42px

Heading/H2
- Weight: SemiBold (600)
- Size: 24px
- Line Height: 32px

Heading/H3
- Weight: SemiBold (600)
- Size: 20px
- Line Height: 28px

Body/Large
- Weight: Regular (400)
- Size: 18px
- Line Height: 28px

Body/Medium
- Weight: Regular (400)
- Size: 16px
- Line Height: 24px

Body/Small
- Weight: Regular (400)
- Size: 14px
- Line Height: 20px

Caption/Large
- Weight: Regular (400)
- Size: 12px
- Line Height: 16px

Caption/Small
- Weight: Regular (400)
- Size: 10px
- Line Height: 14px
```

**Create Text Styles:**
- Right Panel → Text Styles → Create all 10 styles
- Enable RTL for Arabic text

---

### **3. Spacing System:**

**Base Unit: 8px**

```
--space-0: 0px
--space-1: 8px     (0.5rem)
--space-2: 16px    (1rem)
--space-3: 24px    (1.5rem)
--space-4: 32px    (2rem)
--space-5: 40px    (2.5rem)
--space-6: 48px    (3rem)
--space-7: 64px    (4rem)
--space-8: 80px    (5rem)
--space-9: 96px    (6rem)
```

**Create as Variables:**
- Variables Panel → Create "Spacing" collection
- Add all 10 values

---

### **4. Border Radius:**

```
--radius-none: 0px
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-2xl: 24px
--radius-full: 9999px
```

---

### **5. Shadows:**

```
/* Shadow/Small */
box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05)

/* Shadow/Medium */
box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1),
            0px 2px 4px -1px rgba(0, 0, 0, 0.06)

/* Shadow/Large */
box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1),
            0px 4px 6px -2px rgba(0, 0, 0, 0.05)

/* Shadow/XLarge */
box-shadow: 0px 20px 25px -5px rgba(0, 0, 0, 0.1),
            0px 10px 10px -5px rgba(0, 0, 0, 0.04)
```

**Create as Effect Styles:**
- Right Panel → Effects → Create 4 shadow styles

---

## 🧩 **COMPONENTS**

### **1. Button Component:**

**Master Component: `Button/Master`**

**Variants (48 total):**
```
Type: Primary, Secondary, Outline, Ghost
Size: Small (S), Medium (M), Large (L)
State: Default, Hover, Active, Disabled

Dimensions:
- Small: 32px height, 12px padding, 14px text
- Medium: 40px height, 16px padding, 16px text
- Large: 48px height, 20px padding, 18px text

Primary:
- Background: --primary-900
- Text: --text-inverse
- Border: none
- Hover: --primary-800
- Active: --primary-700
- Disabled: --neutral-300

Secondary:
- Background: --secondary-500
- Text: --text-inverse
- Border: none

Outline:
- Background: transparent
- Text: --primary-900
- Border: 1px solid --primary-900

Ghost:
- Background: transparent
- Text: --primary-900
- Border: none
- Hover: --neutral-50
```

**How to Build:**
1. Create base button (Medium/Primary/Default)
2. Add text layer: "زر" (use Body/Medium style)
3. Add icon slot (optional, 20x20)
4. Group: [Icon] [Text] [Icon] with Auto Layout
5. Add all variants (Type, Size, State)
6. Add interactions:
   - Hover → Change to Hover state
   - Mouse Down → Change to Active state

---

### **2. Input Component:**

**Master Component: `Input/Master`**

**Variants (12 total):**
```
Size: Small, Medium, Large
State: Default, Focus, Error, Disabled

Small: 36px height
Medium: 44px height
Large: 52px height

Default:
- Background: --bg-primary
- Border: 1px solid --neutral-300
- Text: --text-primary
- Placeholder: --text-tertiary

Focus:
- Border: 2px solid --primary-500
- Shadow: 0 0 0 3px --primary-100

Error:
- Border: 2px solid --danger-500
- Text: --text-danger

Disabled:
- Background: --neutral-50
- Border: 1px solid --neutral-200
- Text: --neutral-400
```

**Structure:**
```
[Input Container]
  ├─ [Label] (optional)
  ├─ [Input Field]
  │  ├─ [Left Icon] (optional)
  │  ├─ [Text/Placeholder]
  │  └─ [Right Icon] (optional)
  └─ [Helper Text / Error Message]
```

---

### **3. Card Components:**

#### **A. Generic Card:**
```
Component: Card/Generic

Structure:
[Card Container - Shadow/Medium, Radius/lg]
  ├─ [Content Area]
  │  └─ [Auto Layout: Vertical, Gap: 16px]
  └─ [Padding: 24px]

Variants:
- Default
- Hover (Shadow/Large)
- Active
- Disabled (Opacity: 0.5)
```

#### **B. Customer Card:**
```
Component: Card/Customer

Structure:
[Card Container - 320px × Auto]
  ├─ [Header - 48px height]
  │  ├─ [Avatar - 40px circle]
  │  ├─ [Name + Category]
  │  └─ [VIP Badge] (conditional)
  │
  ├─ [Body - Auto height]
  │  ├─ [Phone Icon + Number]
  │  ├─ [WhatsApp Icon + Number]
  │  ├─ [Email Icon + Email]
  │  ├─ [Budget Range]
  │  ├─ [Preferred Cities]
  │  └─ [Tags] (array)
  │
  ├─ [Quick Actions - 56px height]
  │  └─ [7 Icon Buttons in row]
  │     1. اتصال (Phone)
  │     2. واتساب (WhatsApp)
  │     3. موعد (Calendar)
  │     4. مهمة (Task)
  │     5. عقار (Property)
  │     6. ملاحظة (Note)
  │     7. المزيد (More)
  │
  └─ [Footer]
     ├─ [Interest Level Badge]
     └─ [Last Contact Date]

Interactions:
- Click Card → Navigate to Customer Details
- Click Quick Action → Open Modal/Action
- Drag Card → Move to different category
- Hover → Shadow/Large
```

#### **C. Smart Match Card:**
```
Component: Card/SmartMatch

Variants:
1. Swipe View (Full Screen)
2. Split View (Offer | Request)
3. Accepted View (List item)

[Swipe View - 375px × 600px]
  ├─ [Match Score Circle - Top Right]
  │  └─ [85%] + [Match Icon]
  │
  ├─ [Property Image - 375px × 240px]
  │  └─ [Image Carousel Dots]
  │
  ├─ [Content - Scrollable]
  │  ├─ [Title - H2]
  │  ├─ [Price + Area]
  │  ├─ [Location]
  │  ├─ [Details Grid]
  │  │  ├─ غرف النوم: 4
  │  │  ├─ دورات المياه: 3
  │  │  ├─ المجالس: 2
  │  │  └─ عمر العقار: 5 سنوات
  │  ├─ [Features Tags]
  │  └─ [Description]
  │
  └─ [Action Buttons - Fixed Bottom]
     ├─ [Reject - Outline, Red] ← Swipe Right
     └─ [Accept - Primary, Green] → Swipe Left

[Split View - 800px × 600px]
  ├─ [Left: Offer - 400px]
  │  └─ [Same structure as Swipe]
  │
  └─ [Right: Request - 400px]
     ├─ [Buyer/Renter Info]
     ├─ [Requirements]
     ├─ [Match Score]
     └─ [Matched Features List]

Interactions:
- Swipe Left → Accept + Animate out
- Swipe Right → Reject + Animate out
- Click Match Score → Show breakdown
- Click Image → Full screen gallery
- Click Accept → Confirmation modal
```

---

### **4. Tag Component:**

```
Component: Tag/Master

Variants:
- Color: Primary, Secondary, Success, Danger, Warning, Info, Neutral
- Size: Small, Medium, Large
- Removable: True, False

Small: 20px height, 8px padding
Medium: 24px height, 12px padding
Large: 28px height, 16px padding

Structure:
[Tag Container - Radius/full]
  ├─ [Text]
  └─ [X Icon] (if removable)
```

---

### **5. Badge Component:**

```
Component: Badge/Master

Types:
1. VIP Badge
   - Background: --secondary-500
   - Icon: Crown
   - Text: VIP
   - Size: 24px height

2. Level Badge
   - Starter: Gray
   - Bronze: #CD7F32
   - Silver: #C0C0C0
   - Gold: --secondary-500
   - Platinum: #E5E4E2
   - Diamond: #B9F2FF

3. Status Badge
   - Active: Success
   - Pending: Warning
   - Inactive: Neutral
   - Archived: Danger

4. Notification Badge
   - Circle: 8px diameter
   - Background: --danger-500
   - Position: Top right corner
```

---

### **6. Modal Component:**

```
Component: Modal/Master

Structure:
[Overlay - Full screen, Black 40% opacity]
  └─ [Modal Container - Center]
     ├─ [Header - 56px]
     │  ├─ [Title - H3]
     │  └─ [Close Button X]
     │
     ├─ [Content - Scrollable]
     │  └─ [Dynamic content]
     │
     └─ [Footer - 64px]
        ├─ [Cancel Button - Ghost]
        └─ [Confirm Button - Primary]

Sizes:
- Small: 400px width
- Medium: 600px width
- Large: 800px width
- Full: 90vw width

Interactions:
- Click Overlay → Close
- Click X → Close
- Click Cancel → Close
- Click Confirm → Action + Close
- ESC key → Close
```

---

## 📱 **SCREENS (00-14)**

### **Screen 00: Login**
```
Layout: [1200px × 800px]

[Left Panel - 50%]
  ├─ [Logo + App Name]
  ├─ [Hero Image]
  └─ [Tagline Text]

[Right Panel - 50%]
  ├─ [Form Container - 400px]
  │  ├─ [Title: تسجيل الدخول]
  │  ├─ [Input: البريد الإلكتروني أو الجوال]
  │  ├─ [Input: كلمة المرور]
  │  ├─ [Checkbox: تذكرني]
  │  ├─ [Link: نسيت كلمة المرور؟]
  │  ├─ [Button: دخول - Primary]
  │  └─ [Link: ليس لديك حساب؟ سجل الآن]
  └─ [Footer: اللغة + الدعم]

Interactions:
- Click دخول → Navigate to Dashboard
- Click سجل الآن → Navigate to Register
- Show/Hide Password icon
```

---

### **Screen 01: Dashboard**
```
Layout: [PageLayout with Sidebar]

[Header - 72px]
  ├─ [Logo + Menu Toggle]
  ├─ [Search Bar - 400px]
  └─ [Notifications + Profile]

[Sidebar - 280px, Collapsible]
  ├─ [Dashboard - Active]
  ├─ [CRM]
  ├─ [بطاقة أعمالي]
  ├─ [الفرص الذكية]
  ├─ [التقويم]
  ├─ [منصتي]
  ├─ [اطلب وسيطك]
  ├─ [المهام]
  ├─ [الفريق]
  └─ [الإعدادات]

[Main Content]
  ├─ [Stats Cards Row - 4 cards]
  │  1. إجمالي العملاء: 156
  │  2. العقارات النشطة: 42
  │  3. المواعيد القادمة: 8
  │  4. الفرص الذكية: 23
  │
  ├─ [Charts Row - 2 charts]
  │  ├─ [Line Chart: إحصائيات الشهر]
  │  └─ [Donut Chart: توزيع العملاء]
  │
  ├─ [Recent Activity - 6 items]
  │  └─ [Activity Card: Icon + Text + Time]
  │
  └─ [Quick Actions - 4 buttons]
     1. إضافة عميل
     2. إضافة عقار
     3. إنشاء موعد
     4. إنشاء مهمة

[Right Sidebar - 300px]
  ├─ [Calendar Widget]
  ├─ [Upcoming Appointments - 3 items]
  └─ [Tasks Summary]

Interactions:
- Click Stat Card → Navigate to section
- Click Activity → Open details
- Click Quick Action → Open form modal
- Sidebar collapse/expand animation
```

---

### **Screen 02: CRM - Customer Management**
```
Layout: [PageLayout]

[Header]
  ├─ [Title: إدارة العملاء]
  ├─ [Search + Filters]
  │  ├─ [Search Input]
  │  ├─ [Filter: التصنيف]
  │  ├─ [Filter: مستوى الاهتمام]
  │  └─ [Filter: الباقة]
  └─ [Actions]
     ├─ [Button: تصدير]
     └─ [Button: إضافة عميل - Primary]

[View Toggle]
  ├─ [Grid View - Active]
  └─ [List View]

[Customer Cards Grid]
  ├─ [Row 1: 3 cards]
  ├─ [Row 2: 3 cards]
  ├─ [Row 3: 3 cards]
  └─ [... more rows]

[Pagination]
  ├─ [Page: 1 of 12]
  └─ [Next/Previous buttons]

[Floating Action Button]
  └─ [+ إضافة عميل]

States:
- Empty State: No customers yet
- Loading State: Skeleton cards
- Error State: Retry button

Interactions:
- Click Card → Navigate to Customer Details
- Drag Card → Move between categories
- Click Quick Action → Open modal
- Filter change → Reload grid
- Search typing → Live filter
```

---

### **Screen 03: Business Card - بطاقة أعمالي الرقمية**
```
Layout: [Centered, No Sidebar]

[Card Preview - 375px × 600px]
  ├─ [Cover Image - 375px × 150px]
  │  └─ [Upload button overlay on hover]
  │
  ├─ [Profile Section - Overlap -60px]
  │  ├─ [Logo - 120px circle, White border]
  │  ├─ [Profile Image - 80px circle]
  │  └─ [Upload buttons]
  │
  ├─ [Info Section]
  │  ├─ [Name - H2]
  │  ├─ [Company Name]
  │  ├─ [FAL License]
  │  ├─ [Level Badge: Diamond]
  │  └─ [Bio Text]
  │
  ├─ [Stats Row]
  │  ├─ [العقارات: 42]
  │  ├─ [العملاء: 156]
  │  └─ [التقييم: 4.8/5]
  │
  ├─ [Action Buttons - 11 buttons]
  │  1. اتصال مباشر
  │  2. واتساب
  │  3. البريد الإلكتروني
  │  4. الموقع الإلكتروني
  │  5. موقع المكتب
  │  6. Instagram
  │  7. X (Twitter)
  │  8. Snapchat
  │  9. TikTok
  │  10. LinkedIn
  │  11. YouTube
  │
  └─ [QR Code Section]
     ├─ [QR Code Image]
     └─ [Share Button]

[Right Panel - 400px]
  ├─ [Edit Form]
  │  ├─ [Upload Cover Image]
  │  ├─ [Upload Logo]
  │  ├─ [Upload Profile]
  │  ├─ [Input: Name]
  │  ├─ [Input: Company]
  │  ├─ [Input: License]
  │  ├─ [Textarea: Bio]
  │  ├─ [Input: Phone]
  │  ├─ [Input: WhatsApp]
  │  ├─ [Input: Email]
  │  ├─ [Input: Website]
  │  └─ [Social Media Inputs]
  │
  └─ [Save Button - Primary]

[Bottom Actions]
  ├─ [Preview Button]
  ├─ [Share Button]
  └─ [Generate QR Button]

Interactions:
- Image upload → Show preview
- Edit field → Live preview update
- Click button → Navigate/Action
- Click QR → Download PNG
- Click Share → Copy link + Show toast
```

---

### **Screen 04: Smart Matches - الفرص الذكية**
```
Layout: [PageLayout]

[Header]
  ├─ [Title: الفرص الذكية]
  ├─ [Tabs]
  │  ├─ [جديدة: 23 - Active]
  │  └─ [مقبولة: 12]
  └─ [View Toggle]
     ├─ [Swipe View - Active]
     └─ [Split View]

[Main Area - Swipe View]
  ├─ [Match Card - Centered]
  │  └─ [Component: Card/SmartMatch/Swipe]
  │
  └─ [Navigation]
     ├─ [← رفض - Left]
     ├─ [Counter: 1 of 23]
     └─ [قبول → - Right]

[Swipe Interactions]
  - Swipe Left → Reject
    └─ Card slides left + fade out
    └─ Next card appears from right
    └─ Update counter
  
  - Swipe Right → Accept
    └─ Card slides right + fade out
    └─ Show success animation
    └─ Next card appears from left
    └─ Add to "مقبولة" tab
  
  - Click Reject → Same as swipe left
  - Click Accept → Same as swipe right
  
  - Match Score Click → Show modal
    └─ [Score Breakdown]
       ├─ المدينة: 25/25
       ├─ الحي: 20/20
       ├─ نوع العقار: 20/20
       ├─ السعر: 12/15
       └─ المساحة: 8/10

[Empty State - When no matches]
  ├─ [Icon: Target]
  ├─ [Title: لا توجد فرص جديدة]
  ├─ [Description: سنرسل لك إشعار...]
  └─ [Button: إضافة طلب جديد]

[Accepted Tab]
  ├─ [Grid of accepted matches - 3 columns]
  │  └─ [Accepted Match Card]
  │     ├─ [Property Image]
  │     ├─ [Match Score Badge]
  │     ├─ [Title]
  │     ├─ [Price + Area]
  │     └─ [Contact Actions]
  │        ├─ [Call Owner]
  │        ├─ [WhatsApp]
  │        └─ [View Details]
  │
  └─ [Pagination]

Animations:
- Card enter: Slide + Fade (300ms)
- Card exit: Slide + Fade (300ms)
- Score modal: Scale up (200ms)
- Success: Checkmark animation (500ms)
```

---

### **Screen 05: Calendar - التقويم والمواعيد**
```
Layout: [PageLayout]

[Header]
  ├─ [Title: التقويم]
  ├─ [View Toggle]
  │  ├─ [Month - Active]
  │  ├─ [Week]
  │  └─ [Day]
  └─ [Button: إنشاء موعد - Primary]

[Calendar Grid - Month View]
  ├─ [Header: Days of Week]
  │  └─ [الأحد ... السبت]
  │
  └─ [Grid: 5-6 rows × 7 columns]
     └─ [Day Cell]
        ├─ [Date Number]
        └─ [Appointments - Max 3 visible]
           ├─ [معاينة - 10:00]
           ├─ [اجتماع - 14:00]
           └─ [+2 more]

[Right Sidebar - 320px]
  ├─ [Mini Calendar]
  │  └─ [Current Month Navigation]
  │
  ├─ [Upcoming Appointments]
  │  └─ [List of next 5 appointments]
  │     └─ [Appointment Card]
  │        ├─ [Time]
  │        ├─ [Type Icon + Title]
  │        ├─ [Customer Name]
  │        └─ [Quick Actions]
  │
  └─ [Working Hours]
     └─ [Weekly schedule table]

[Appointment Modal - Add/Edit]
  [Modal: Medium]
  ├─ [Form]
  │  ├─ [Input: العنوان]
  │  ├─ [Textarea: الوصف]
  │  ├─ [Select: النوع]
  │  │  └─ معاينة, اجتماع, توقيع عقد, متابعة
  │  ├─ [Date Picker: التاريخ]
  │  ├─ [Time Picker: الوقت]
  │  ├─ [Duration: المدة]
  │  ├─ [Select: العميل]
  │  ├─ [Select: العقار] (optional)
  │  ├─ [Input: الموقع]
  │  ├─ [Input: رابط Google Maps]
  │  └─ [Checkboxes: التذكيرات]
  │     ├─ [30 دقيقة قبل]
  │     ├─ [ساعتين قبل]
  │     └─ [يوم واحد قبل]
  │
  └─ [Actions]
     ├─ [Cancel - Ghost]
     └─ [Save - Primary]

Interactions:
- Click Day → Show appointments
- Click Appointment → Open details modal
- Drag Appointment → Reschedule
- Click Add → Open form modal
- View toggle → Animate transition
- Hover day → Highlight + Show add button
```

---

### **Screen 06: My Platform - منصتي**
```
Layout: [Public View, No Sidebar]

[Platform Header - Custom]
  ├─ [Cover Image - Full width, 200px]
  │  └─ [Logo overlay - Center]
  │
  ├─ [Profile Section]
  │  ├─ [Profile Image - 120px]
  │  ├─ [Name + Company]
  │  ├─ [Level Badge]
  │  ├─ [Stats: عقارات | عملاء | تقييم]
  │  └─ [Contact Buttons Row]
  │     1. اتصال
  │     2. واتساب
  │     3. موقع المكتب
  │
  └─ [Navigation Tabs]
     ├─ [العقارات - Active]
     ├─ [عني]
     └─ [تواصل معي]

[Properties Section]
  ├─ [Filters Bar]
  │  ├─ [Select: النوع - الكل]
  │  ├─ [Select: الفئة - الكل]
  │  └─ [Toggle: العرض المجموع]
  │     └─ When ON: Group by type
  │
  └─ [Properties Grid - 3 columns]
     └─ [Property Card]
        ├─ [Image - 16:9 ratio]
        │  └─ [Status Badge: للبيع]
        ├─ [Title]
        ├─ [Price - Large, Gold]
        ├─ [Location]
        ├─ [Details Icons]
        │  ├─ 🛏️ 4 غرف
        │  ├─ 🚿 3 حمامات
        │  └─ 📐 350 م²
        ├─ [Features Tags]
        └─ [Contact Button]

[Empty State]
  ├─ [Icon: Building]
  ├─ [Text: لم يتم نشر أي عقارات بعد]
  └─ [Button: رجوع للوحة التحكم]

[Footer]
  ├─ [Powered by Nova CRM]
  └─ [Social Media Links]

Interactions:
- Click Property → Open details modal
- Click Contact → WhatsApp/Call
- Toggle Group → Animate re-layout
- Filter change → Reload grid
- Share button → Copy link
```

---

### **Screen 07: HomeOwners - اطلب وسيطك**
```
Layout: [Landing Page Style]

[Hero Section]
  ├─ [Background: Gradient Primary]
  ├─ [Title: هل لديك عقار للبيع أو الإيجار؟]
  ├─ [Subtitle: دع الوسطاء يتنافسون...]
  └─ [Button: ابدأ الآن - Large, Gold]

[Pricing Section]
  ├─ [Title: اختر الباقة المناسبة]
  │
  └─ [2 Plans - Side by side]
     
     [Plan 1: Basic]
     ├─ [Badge: الأكثر شعبية]
     ├─ [Price: 199 ريال]
     ├─ [Features List]
     │  ✓ أولوية عادية
     │  ✓ حتى 5 عروض
     │  ✓ تحليلات أساسية
     │  ✓ دعم فني
     ├─ [Button: اختر الباقة]
     └─ [Footer: لمرة واحدة]
     
     [Plan 2: Premium]
     ├─ [Badge: موصى به]
     ├─ [Price: 259 ريال]
     ├─ [Features List]
     │  ✓ أولوية قصوى
     │  ✓ حتى 10 عروض
     │  ✓ تحليلات متقدمة
     │  ✓ وصف بالذكاء الاصطناعي
     │  ✓ دعم أولوية
     ├─ [Button: اختر الباقة - Gold]
     └─ [Footer: لمرة واحدة]

[Form Section - Multi-step]
  [Step 1: نوع الطلب]
  ├─ [Radio: أرغب في البيع]
  ├─ [Radio: أرغب في التأجير]
  ├─ [Radio: أبحث عن شراء]
  └─ [Radio: أبحث عن إيجار]

  [Step 2: Property Details]
  ├─ [Select: نوع العقار]
  ├─ [Select: المدينة]
  ├─ [Select: الحي]
  ├─ [Input: السعر]
  ├─ [Input: المساحة]
  ├─ [Input: غرف النوم]
  ├─ [Input: دورات المياه]
  └─ [Multi-select: المميزات]

  [Step 3: Contact Info]
  ├─ [Input: الاسم]
  ├─ [Input: الجوال]
  ├─ [Input: WhatsApp]
  └─ [Input: البريد]

  [Step 4: Payment]
  ├─ [Selected Plan Summary]
  ├─ [Payment Methods]
  │  ├─ [Apple Pay]
  │  ├─ [مدى]
  │  └─ [Visa/Mastercard]
  └─ [Button: إتمام الدفع - Gold]

[Progress Indicator]
  └─ [Steps: 1 → 2 → 3 → 4]

[How It Works Section]
  ├─ [Step 1: قدم طلبك]
  ├─ [Step 2: يصل لـ10 وسطاء]
  ├─ [Step 3: اختر الأفضل]
  └─ [Step 4: أتمم الصفقة]

Interactions:
- Click Plan → Scroll to form
- Form validation → Show errors
- Submit → Process payment
- Success → Show confirmation
- Track clicks → Analytics
```

---

### **Screen 08: Subscriptions - الاشتراكات**
```
Layout: [PageLayout]

[Header]
  ├─ [Title: إدارة الاشتراك]
  └─ [Current Plan Badge]

[Current Plan Card]
  ├─ [Plan Name: فريق]
  ├─ [Status: نشط]
  ├─ [Renewal Date: 15 يناير 2025]
  ├─ [Price: 799 ريال/شهر]
  ├─ [Usage Stats]
  │  ├─ [Members: 3/5]
  │  ├─ [Properties: 42/1500]
  │  └─ [Storage: 2GB/20GB]
  └─ [Actions]
     ├─ [Button: ترقية]
     └─ [Link: إلغاء الاشتراك]

[Plans Comparison]
  └─ [4 Plans Grid]
     
     [Plan 1: فرد]
     ├─ [Price: 299 ريال/شهر]
     ├─ [Features List]
     │  • 1 عضو
     │  • 500 عقار
     │  • 5 جيجا تخزين
     │  • الفرص الذكية
     │  • CRM
     │  • التقويم
     └─ [Button: اختر]
     
     [Plan 2: فريق - Current]
     ├─ [Badge: الباقة الحالية]
     ├─ [Price: 799 ريال/شهر]
     ├─ [Features List]
     │  • 5 أعضاء
     │  • 1500 عقار
     │  • 20 جيجا
     │  • إدارة الفريق
     │  • جميع مميزات فرد
     └─ [Button: الباقة الحالية - Disabled]
     
     [Plan 3: مكتب]
     ├─ [Badge: موصى به]
     ├─ [Price: 1899 ريال/شهر]
     ├─ [Features List]
     │  • 15 عضو
     │  • عقارات غير محدودة
     │  • 100 جيجا
     │  • API Access
     │  • تقارير متقدمة
     └─ [Button: ترقية - Primary]
     
     [Plan 4: شركة]
     ├─ [Price: 4999 ريال/شهر]
     ├─ [Features List]
     │  • أعضاء غير محدودة
     │  • عقارات غير محدودة
     │  • 1 تيرا تخزين
     │  • White Label
     │  • دعم مخصص
     └─ [Button: تواصل معنا]

[Payment History]
  └─ [Table]
     └─ [Columns]
        ├─ التاريخ
        ├─ المبلغ
        ├─ الحالة
        └─ الإجراءات (تحميل الفاتورة)

[Upgrade Modal]
  ├─ [Title: ترقية الاشتراك]
  ├─ [From → To]
  ├─ [Price Difference]
  ├─ [Payment Method]
  ├─ [Confirmation Checkbox]
  └─ [Actions]
     ├─ [Cancel]
     └─ [تأكيد الترقية]

Interactions:
- Click Plan → Open upgrade modal
- Confirm upgrade → Process payment
- Cancel → Show confirmation dialog
```

---

### **Screen 09-14: Remaining Screens**

**Screen 09: Special Requests - الطلبات الخاصة**
- List of special requests from HomeOwners
- Filter by type, status, date
- Request cards with details
- Contact/Accept actions

**Screen 10: Finance Calculator - حاسبة التمويل**
- Mortgage calculator
- Inputs: Price, Down payment, Interest, Years
- Monthly payment calculation
- Amortization schedule table
- Save/Share results

**Screen 11: Social Media Posting**
- Property selection
- Template selection (5+ templates)
- Caption with AI generation
- Platform selection (multi)
- Schedule/Post now
- Analytics tracking

**Screen 12: Tasks - إدارة المهام**
- Kanban board (Todo, In Progress, Review, Done)
- Task cards with drag & drop
- Quick add task
- Filters by priority, assigned to, due date
- Task details modal

**Screen 13: Team - إدارة الفريق**
- Team members list
- Add/Edit member
- Permissions management
- Performance stats
- Leaderboard
- Activity log

**Screen 14: Settings - الإعدادات**
- Profile settings
- Company settings
- Notification preferences
- Working hours
- Integrations
- Security (2FA, Sessions)
- Billing

---

## 🔄 **FLOWS PAGE**

Create user journey flows:

1. **Registration Flow**
   - Start → Register → Email Verify → Phone OTP → Choose Plan → Dashboard

2. **Customer Journey**
   - Add Customer → Customer Card → Quick Actions → Activities

3. **Smart Match Flow**
   - Property Added → Match Algorithm → Match Card → Swipe → Accept → Contact

4. **Appointment Flow**
   - Calendar → Add Appointment → Reminder → Confirmation → Completion

5. **HomeOwner Flow**
   - Landing → Choose Plan → Fill Form → Payment → Dashboard

---

## 📚 **DOCUMENTATION PAGE**

Add notes for developers:

```markdown
# Design System Documentation

## Colors
- Use design tokens for all colors
- Never hardcode hex values
- Always use semantic names

## Spacing
- Base unit: 8px
- Use spacing variables
- Maintain consistency

## Typography
- RTL support enabled
- Use text styles, not manual formatting
- Test with long Arabic text

## Components
- All components have variants
- Use auto layout for responsiveness
- Add descriptions to all components

## Interactions
- Document all click targets
- Specify transition durations
- Note any conditional logic

## Responsive Design
- Mobile: 375px
- Tablet: 768px
- Desktop: 1440px
- Large: 1920px

## Accessibility
- Minimum tap target: 44px
- Color contrast ratio: 4.5:1
- Include alt text for images
```

---

## 🚀 **DEV HANDOFF PAGE**

Prepare assets for developers:

### **Export CSS Variables:**
```css
:root {
  --primary-900: #01411C;
  --secondary-500: #D4AF37;
  /* ... all 50 colors */
  
  --space-1: 8px;
  --space-2: 16px;
  /* ... all spacing */
  
  --radius-md: 8px;
  /* ... all radii */
}
```

### **Export Component Code:**
- Use Figma Dev Mode
- Generate React components
- Include TypeScript types
- Add Tailwind classes

### **Export Assets:**
- Icons: SVG format
- Images: WebP format (optimized)
- Logos: SVG + PNG (multiple sizes)

### **Export Design Tokens:**
- JSON format
- Compatible with Style Dictionary
- Include all tokens

---

## ✅ **FINAL CHECKLIST**

Before delivery:

- [ ] All 50 colors created as styles
- [ ] All 10 text styles created
- [ ] All spacing variables created
- [ ] All 48 button variants created
- [ ] All 12 input variants created
- [ ] Customer Card component complete
- [ ] Smart Match Card (3 variants) complete
- [ ] All 15 screens designed
- [ ] All screens responsive (Mobile, Tablet, Desktop)
- [ ] All interactions added
- [ ] All flows documented
- [ ] RTL tested for all Arabic text
- [ ] Accessibility checked
- [ ] Dev handoff prepared
- [ ] Component library organized
- [ ] Documentation complete

---

## 🎯 **SUCCESS CRITERIA**

Your Figma prototype should:

✅ Be fully navigable (click through all screens)
✅ Show all UI states (default, hover, active, disabled, loading, error, empty)
✅ Include all interactions (clicks, swipes, drags, hovers)
✅ Support RTL for Arabic
✅ Be responsive (mobile, tablet, desktop)
✅ Have consistent design system
✅ Include all 50+ components
✅ Be ready for developer handoff

---

📄 **File:** `/PROMPT-1-FIGMA-EXECUTION.md`  
🎨 **Type:** Figma Design Execution  
⏱️ **Estimated Time:** 40-60 hours  
👥 **Role:** UI/UX Designer  
🎯 **Output:** Complete Figma prototype with 15 screens + design system

---

**🚀 Copy this prompt and execute in Figma to build the complete Nova CRM prototype!**
