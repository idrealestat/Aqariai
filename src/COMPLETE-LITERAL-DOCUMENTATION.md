# 📚 التوثيق الحرفي الكامل - بدون أي افتراض
## كل التفاصيل الدقيقة من الكود الفعلي

---

# 1️⃣ الواجهة الرئيسية (SimpleDashboard)

## 📍 المسار: `/components/SimpleDashboard-updated.tsx`

### 🔧 الـ Imports الحرفية

```typescript
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  Menu, Bell, PanelLeft, Star, Building2, 
  Component, Globe, Users, TrendingUp, 
  Sparkles, Calendar, Calculator
} from "lucide-react";
import RightSliderComplete from "./RightSliderComplete-fixed";
import { LeftSliderComplete } from "./LeftSliderComplete";
import { NotificationsPanel } from "./NotificationsPanel";
import { useDashboardContext } from "../context/DashboardContext";
```

### 🎯 الـ Props Interface

```typescript
interface User {
  id?: string;
  name: string;
  email?: string;
  phone: string;
  type?: "individual" | "team" | "office" | "company";
  companyName?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  plan?: string;
  planExpiry?: string;
  rating?: number;
  profileImage?: string;
}

interface SimpleDashboardProps {
  user: User | null;
  onNavigate: (page: string) => void;
}
```

### 📊 الـ States

```typescript
const [rightMenuOpen, setRightMenuOpen] = useState(false);
const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
const [notificationsOpen, setNotificationsOpen] = useState(false);
const { leftSidebarOpen: contextLeftSidebarOpen } = useDashboardContext();
```

### 🎨 الـ Header الحرفي الكامل

```tsx
<header 
  className="sticky top-0 z-40 bg-gradient-to-r from-[#01411C] via-[#065f41] to-[#01411C] backdrop-blur-md border-b-2 border-[#D4AF37] shadow-lg transition-all duration-300"
>
  <div className="container mx-auto px-4 py-2">
    <div className="flex items-center justify-between">
      
      {/* اليمين: Burger Menu */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setRightMenuOpen(true)}
          className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all bg-white/10 text-white h-9 w-9"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* الوسط: Logo */}
      <div className="flex-1 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full shadow-lg border-2 border-[#D4AF37] backdrop-blur-sm">
          <Building2 className="w-5 h-5" />
          <span className="font-bold">عقاري</span>
          <span className="font-bold text-[#D4AF37]">AI</span>
          <span className="font-bold">Aqari</span>
        </div>
      </div>

      {/* اليسار: Left Sidebar + Bell */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setLeftSidebarOpen(true)}
          className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all bg-white/10 text-white"
        >
          <PanelLeft className="w-5 h-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setNotificationsOpen(true)}
          className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all relative bg-white/10 text-white"
        >
          <Bell className="w-5 h-5" />
          {/* مؤشر الإشعارات */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </Button>
      </div>
    </div>
  </div>
</header>
```

### 📋 بطاقة البروفايل الحرفية

```tsx
<Card className="border-2 border-[#D4AF37] bg-gradient-to-r from-white to-[#f0fdf4] shadow-xl">
  <CardContent className="p-6">
    <div className="flex items-center justify-between gap-4">
      
      {/* 1. الصورة الشخصية */}
      <Avatar className="w-16 h-16 border-4 border-[#D4AF37] shadow-lg flex-shrink-0">
        {user.profileImage && (
          <AvatarImage src={user.profileImage} alt={user.name} />
        )}
        <AvatarFallback className="bg-[#01411C] text-white text-xl font-bold">
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      {/* 2. الاسم والشركة */}
      <div className="flex-1">
        <h1 className="text-xl md:text-2xl font-bold text-[#01411C] text-right">
          مرحباً، {user.name}
        </h1>
        {user.companyName && (
          <p className="text-sm md:text-base text-gray-600 text-right">
            {user.companyName}
          </p>
        )}
      </div>

      {/* 3. التقييم بالنجوم */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= (user.rating || 4) 
                  ? "text-[#D4AF37] fill-current" 
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-xs md:text-sm text-gray-600">
          ({user.rating || 4.0})
        </span>
      </div>
    </div>
  </CardContent>
</Card>
```

### 🎯 الخدمات الـ 8 (بالكود الحرفي الكامل)

#### خدمة 1: منصتي

```tsx
<Card 
  onClick={() => onNavigate("dashboard-main-252")}
  className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
>
  <CardContent className="p-6 text-center relative h-full min-h-[220px] flex flex-col justify-center">
    {/* Badge */}
    <div className="absolute top-2 right-2">
      <Badge className="bg-[#D4AF37] text-[#01411C] text-xs">
        النظام الجديد
      </Badge>
    </div>
    
    {/* الأيقونة */}
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
      <Component className="w-8 h-8 text-[#D4AF37]" />
    </div>
    
    {/* العنوان */}
    <h3 className="font-bold text-[#01411C] mb-2">منصتي</h3>
    
    {/* الوصف */}
    <p className="text-sm text-gray-600 leading-relaxed">
      نظام متكامل مع CRM وإحصائيات متقدمة وإدارة العقارات
    </p>
  </CardContent>
</Card>
```

**التفاصيل:**
- **الهدف**: الانتقال إلى صفحة `dashboard-main-252`
- **الألوان**:
  - Border: `#D4AF37` (ذهبي)
  - Background: Gradient من `#fffef7` إلى `white`
  - Hover Border: `#01411C` (أخضر ملكي)
  - Icon Background: Gradient من `#01411C` إلى `#065f41`
  - Icon Color: `#D4AF37`
  - Text: `#01411C`
- **Badge**: "النظام الجديد" - `bg-[#D4AF37] text-[#01411C]`
- **الأيقونة**: `Component` من lucide-react
- **الحجم**: `min-h-[220px]`
- **الـ onClick**: `onNavigate("dashboard-main-252")`

#### خدمة 2: النشر على المنصات

```tsx
<Card 
  onClick={() => onNavigate("property-upload-complete")}
  className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
>
  <CardContent className="p-6 text-center h-full min-h-[220px] flex flex-col justify-center">
    {/* الأيقونة */}
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
      <Globe className="w-8 h-8 text-[#D4AF37]" />
    </div>
    
    {/* العنوان */}
    <h3 className="font-bold text-[#01411C] mb-2">النشر على المنصات</h3>
    
    {/* الوصف */}
    <p className="text-sm text-gray-600 leading-relaxed">
      انشر عقاراتك على منصتك الخاصه وعلى المنصات العقارية من مكان واحد
    </p>
  </CardContent>
</Card>
```

**التفاصيل:**
- **الهدف**: الانتقال إلى صفحة `property-upload-complete`
- **الأيقونة**: `Globe` من lucide-react
- **الـ onClick**: `onNavigate("property-upload-complete")`

#### خدمة 3: إدارة العملاء

```tsx
<Card 
  onClick={() => onNavigate("customer-management-72")}
  className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
>
  <CardContent className="p-6 text-center relative h-full min-h-[220px] flex flex-col justify-center">
    {/* Badge */}
    <div className="absolute top-2 right-2">
      <Badge className="bg-[#D4AF37] text-[#01411C] text-xs">
        جديد
      </Badge>
    </div>
    
    {/* الأيقونة */}
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41] shadow-lg">
      <Users className="w-8 h-8 text-[#D4AF37]" />
    </div>
    
    {/* العنوان */}
    <h3 className="font-bold text-[#01411C] mb-2">إدارة العملاء</h3>
    
    {/* الوصف */}
    <p className="text-sm text-gray-600 leading-relaxed">
      نظام كانبان متقدم لإدارة العملاء مع السحب والإفلات
    </p>
  </CardContent>
</Card>
```

**التفاصيل:**
- **الهدف**: الانتقال إلى صفحة `customer-management-72`
- **الأيقونة**: `Users` من lucide-react
- **Badge**: "جديد"
- **الـ onClick**: `onNavigate("customer-management-72")`

#### خدمة 4: العروض والطلبات

```tsx
<Card 
  onClick={() => onNavigate("marketplace-page")}
  className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
>
  <CardContent className="p-6 text-center relative h-full min-h-[220px] flex flex-col justify-center">
    {/* Badge متحرك */}
    <div className="absolute top-2 right-2">
      <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] text-[#01411C] text-xs animate-pulse">
        جديد
      </Badge>
    </div>
    
    {/* الأيقونة */}
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41] shadow-lg">
      <TrendingUp className="w-8 h-8 text-[#D4AF37]" />
    </div>
    
    {/* العنوان */}
    <h3 className="font-bold text-[#01411C] mb-2">العروض والطلبات</h3>
    
    {/* الوصف */}
    <p className="text-sm text-gray-600 leading-relaxed">
      واصل مع الملاك والباحثين عن عقارات وقدم خدماتك
    </p>
  </CardContent>
</Card>
```

**التفاصيل:**
- **الهدف**: الانتقال إلى صفحة `marketplace-page`
- **الأيقونة**: `TrendingUp` من lucide-react
- **Badge**: "جديد" مع `animate-pulse` و Gradient من `#D4AF37` إلى `#f1c40f`
- **الـ onClick**: `onNavigate("marketplace-page")`

#### خدمة 5: تحليلات السوق

```tsx
<Card 
  onClick={() => onNavigate("analytics-dashboard")}
  className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
>
  <CardContent className="p-6 text-center h-full min-h-[220px] flex flex-col justify-center">
    {/* الأيقونة */}
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
      <TrendingUp className="w-8 h-8 text-[#D4AF37]" />
    </div>
    
    {/* العنوان */}
    <h3 className="font-bold text-[#01411C] mb-2">تحليلات السوق</h3>
    
    {/* الوصف */}
    <p className="text-sm text-gray-600 leading-relaxed">
      اكتشف اتجاهات السوق العقاري
    </p>
  </CardContent>
</Card>
```

**التفاصيل:**
- **الهدف**: الانتقال إلى صفحة `analytics-dashboard`
- **الأيقونة**: `TrendingUp` من lucide-react
- **الـ onClick**: `onNavigate("analytics-dashboard")`

#### خدمة 6: الفرص الذكية

```tsx
<Card 
  onClick={() => onNavigate("smart-matches")}
  className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
>
  <CardContent className="p-6 text-center relative h-full min-h-[220px] flex flex-col justify-center">
    {/* Badge متحرك مع Gradient */}
    <div className="absolute top-2 right-2">
      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs animate-pulse">
        ✨ ذكاء اصطناعي
      </Badge>
    </div>
    
    {/* الأيقونة */}
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
      <Sparkles className="w-8 h-8 text-[#D4AF37]" />
    </div>
    
    {/* العنوان */}
    <h3 className="font-bold text-[#01411C] mb-2">الفرص الذكية</h3>
    
    {/* الوصف */}
    <p className="text-sm text-gray-600 leading-relaxed">
      تطابق ذكي بين عروضك وطلباتك مع الوسطاء الآخرين
    </p>
  </CardContent>
</Card>
```

**التفاصيل:**
- **الهدف**: الانتقال إلى صفحة `smart-matches`
- **الأيقونة**: `Sparkles` من lucide-react
- **Badge**: "✨ ذكاء اصطناعي" مع Gradient من `purple-500` إلى `pink-500` و `animate-pulse`
- **الـ onClick**: `onNavigate("smart-matches")`

#### خدمة 7: التقويم والمواعيد

```tsx
<Card 
  onClick={() => onNavigate("calendar-system-complete")}
  className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
>
  <CardContent className="p-6 text-center h-full min-h-[220px] flex flex-col justify-center">
    {/* الأيقونة */}
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
      <Calendar className="w-8 h-8 text-[#D4AF37]" />
    </div>
    
    {/* العنوان */}
    <h3 className="font-bold text-[#01411C] mb-2">التقويم والمواعيد</h3>
    
    {/* الوصف */}
    <p className="text-sm text-gray-600 leading-relaxed">
      جدولة المواعيد والمعاينات مع العملاء
    </p>
  </CardContent>
</Card>
```

**التفاصيل:**
- **الهدف**: الانتقال إلى صفحة `calendar-system-complete`
- **الأيقونة**: `Calendar` من lucide-react
- **الـ onClick**: `onNavigate("calendar-system-complete")`

#### خدمة 8: حاسبة سريعة

```tsx
<Card 
  onClick={() => onNavigate("quick-calculator")}
  className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
>
  <CardContent className="p-6 text-center h-full min-h-[220px] flex flex-col justify-center">
    {/* الأيقونة */}
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
      <Calculator className="w-8 h-8 text-[#D4AF37]" />
    </div>
    
    {/* العنوان */}
    <h3 className="font-bold text-[#01411C] mb-2">حاسبة سريعة</h3>
    
    {/* الوصف */}
    <p className="text-sm text-gray-600 leading-relaxed">
      حساب العمولة المساحة، ومسطح البناء
    </p>
  </CardContent>
</Card>
```

**التفاصيل:**
- **الهدف**: الانتقال إلى صفحة `quick-calculator`
- **الأيقونة**: `Calculator` من lucide-react
- **الـ onClick**: `onNavigate("quick-calculator")`

### 📱 الـ Sidebars

```tsx
{/* Right Slider */}
<RightSliderComplete
  isOpen={rightMenuOpen}
  onClose={() => setRightMenuOpen(false)}
  onNavigate={onNavigate}
  mode="navigation"
  currentUser={user}
/>

{/* Left Slider */}
<LeftSliderComplete
  isOpen={leftSidebarOpen || contextLeftSidebarOpen}
  onClose={() => setLeftSidebarOpen(false)}
  currentUser={user}
  onNavigate={onNavigate}
  mode="menu"
/>

{/* Notifications Panel */}
<NotificationsPanel
  isOpen={notificationsOpen}
  onClose={() => setNotificationsOpen(false)}
/>
```

---

# 2️⃣ الرايت سلايدر (RightSliderComplete)

## 📍 المسار: `/components/RightSliderComplete-fixed.tsx`

### 🔧 الـ Imports الحرفية

```typescript
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Phone, MessageCircle, Star, Users, 
  TrendingUp, Clock, CheckCircle, AlertCircle,
  User, Badge as BadgeIcon, Award, Activity,
  Home, Building2, BarChart3, Settings,
  Calendar, Plus, Archive, LifeBuoy,
  Crown, UserPlus, Receipt, BookOpen,
  Headphones, Info, Lightbulb, UserCheck, Briefcase,
  LogOut, FileText
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { DynamicHeader, MiniUserCard } from "./layout/DynamicHeader";
import { SubscriptionTierSlab } from "./SubscriptionTierSlab";
import { DigitalBusinessCardHeader } from "./DigitalBusinessCardHeader";
```

### 📋 قائمة العناصر الـ 18 (RIGHT_SIDEBAR_ITEMS)

```typescript
const RIGHT_SIDEBAR_ITEMS = [
  {
    id: 'dashboard',
    icon: Home,
    label: 'الرئيسية',
    path: '/dashboard',
    color: '#01411C'
  },
  {
    id: 'business-card',
    icon: UserCheck,
    label: 'بطاقة أعمالي الرقمية',
    path: '/business-card-profile',
    color: '#D4AF37'
  },
  {
    id: 'course',
    icon: BookOpen,
    label: 'دورة الوساطة',
    path: '/course',
    color: '#065f41'
  },
  {
    id: 'colleagues',
    icon: Crown,
    label: 'إدارة الفريق',
    path: '/colleagues',
    color: '#01411C'
  },
  {
    id: 'workspace',
    icon: Briefcase,
    label: 'مساحة العمل',
    path: '/workspace',
    color: '#065f41'
  },
  {
    id: 'archive',
    icon: Archive,
    label: 'الأرشيف',
    path: '/archive',
    color: '#10b981',
    description: 'ملفات إضافية تم اكتشافها',
    badge: '📁'
  },
  {
    id: 'calendar',
    icon: FileText,
    label: 'عروض الأسعار',
    path: '/calendar',
    color: '#01411C'
  },
  {
    id: 'receipts',
    icon: Receipt,
    label: 'سندات القبض',
    path: '/receipts',
    color: '#D4AF37'
  },
  {
    id: 'tasks-management',
    icon: Plus,
    label: 'إدارة المهام',
    path: '/tasks-management',
    color: '#065f41'
  },
  {
    id: 'analytics',
    icon: BarChart3,
    label: 'التحليلات',
    path: '/analytics',
    color: '#D4AF37'
  },
  {
    id: 'blog',
    icon: Info,
    label: 'ما الجديد؟',
    path: '/blog',
    color: '#01411C'
  },
  {
    id: 'support',
    icon: Headphones,
    label: 'الدعم الفني',
    path: '/support',
    color: '#01411C'
  },
  {
    id: 'settings',
    icon: Settings,
    label: 'الإعدادات',
    path: '/settings',
    color: '#01411C'
  }
];
```

### 🎨 عرض العنصر الواحد (الكود الحرفي)

```tsx
{RIGHT_SIDEBAR_ITEMS.map((item) => {
  const IconComponent = item.icon;
  
  return (
    <div
      key={item.id}
      className="flex items-center justify-center text-xs bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-[#D4AF37] border-l-4 cursor-pointer hover:shadow-lg transition-all duration-200 group"
      style={{ borderLeftColor: item.color }}
      onClick={() => {
        if (item.path.startsWith('/')) {
          onNavigate(item.path.substring(1));
        } else {
          onNavigate(item.path);
        }
        onClose();
      }}
    >
      {/* الأيقونة */}
      <div className="flex items-center gap-3 flex-1">
        <div 
          className="p-2 rounded-lg transition-colors"
          style={{ 
            backgroundColor: `${item.color}15`, 
            color: item.color 
          }}
        >
          <IconComponent className="w-5 h-5" />
        </div>
        
        {/* النص والوصف */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 group-hover:text-[#01411C] transition-colors">
              {item.label}
            </span>
            {(item as any).badge && (
              <span className="text-sm">{(item as any).badge}</span>
            )}
          </div>
          {(item as any).description && (
            <p className="text-xs text-gray-600 mt-1">{(item as any).description}</p>
          )}
        </div>
      </div>
    </div>
  );
})}
```

**التفاصيل لكل عنصر:**

| ID | الأيقونة | العنوان | المسار | اللون | الوصف | Badge |
|----|---------|---------|--------|-------|-------|-------|
| dashboard | Home | الرئيسية | /dashboard | #01411C | - | - |
| business-card | UserCheck | بطاقة أعمالي الرقمية | /business-card-profile | #D4AF37 | - | - |
| course | BookOpen | دورة الوساطة | /course | #065f41 | - | - |
| colleagues | Crown | إدارة الفريق | /colleagues | #01411C | - | - |
| workspace | Briefcase | مساحة العمل | /workspace | #065f41 | - | - |
| archive | Archive | الأرشيف | /archive | #10b981 | ملفات إضافية تم اكتشافها | 📁 |
| calendar | FileText | عروض الأسعار | /calendar | #01411C | - | - |
| receipts | Receipt | سندات القبض | /receipts | #D4AF37 | - | - |
| tasks-management | Plus | إدارة المهام | /tasks-management | #065f41 | - | - |
| analytics | BarChart3 | التحليلات | /analytics | #D4AF37 | - | - |
| blog | Info | ما الجديد؟ | /blog | #01411C | - | - |
| support | Headphones | الدعم الفني | /support | #01411C | - | - |
| settings | Settings | الإعدادات | /settings | #01411C | - | - |

### 🎴 البطاقة في الهيدر (DigitalBusinessCardHeader)

```tsx
<div className="bg-gradient-to-r from-[#01411C] via-[#065f41] to-[#01411C]">
  <DigitalBusinessCardHeader currentUser={currentUser} />
</div>
```

**المكون المستدعى:** `DigitalBusinessCardHeader`

**الـ Props المُمررة:**
```typescript
currentUser?: {
  name: string;
  email?: string;
  phone?: string;
  type?: string;
  plan?: string;
  profileImage?: string;
  id?: string;
  companyName?: string;
  licenseNumber?: string;
  city?: string;
  district?: string;
  birthDate?: string;
  whatsapp?: string;
} | null
```

### 🔄 زر تسجيل الخروج

```tsx
<div className="pt-4 mt-4 border-t-2 border-gray-200">
  <div
    className="flex items-center justify-center text-xs bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-[#D4AF37] border-l-4 border-l-red-500 cursor-pointer hover:shadow-lg transition-all duration-200 group bg-gradient-to-br from-red-50 to-white"
    onClick={() => {
      if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        window.dispatchEvent(new CustomEvent('navigateToPage', { detail: 'registration' }));
        onClose();
      }
    }}
  >
    <div className="flex items-center gap-3 flex-1">
      {/* الأيقونة */}
      <div className="p-2 rounded-lg bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors">
        <LogOut className="w-5 h-5" />
      </div>
      
      {/* النص */}
      <div className="flex-1">
        <span className="font-medium text-red-600 group-hover:text-red-700 transition-colors">
          تسجيل الخروج
        </span>
        <p className="text-xs text-red-500 mt-1">الخروج من الحساب</p>
      </div>
    </div>
  </div>
</div>
```

**التفاصيل:**
- **الأيقونة**: `LogOut` من lucide-react
- **اللون الأساسي**: `red-600`
- **الـ Gradient**: من `red-50` إلى `white`
- **Border**: `border-l-red-500`
- **الـ onClick**: 
  1. عرض Confirm Dialog
  2. إطلاق CustomEvent `navigateToPage` مع `detail: 'registration'`
  3. إغلاق الـ Slider

---

# 3️⃣ بطاقة الأعمال الرقمية (DigitalBusinessCardHeader)

## 📍 المسار: `/components/DigitalBusinessCardHeader.tsx`

### 🔧 الـ Imports

```typescript
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Download, Printer, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SubscriptionTierSlab, useSubscriptionTier } from "./SubscriptionTierSlab";
import logoImage from "figma:asset/3821378221125549f243ee4345da40c6457c2dae.png";
```

### 🎯 الـ Props

```typescript
interface DigitalBusinessCardHeaderProps {
  currentUser?: {
    name: string;
    email?: string;
    phone?: string;
    type?: string;
    plan?: string;
    profileImage?: string;
    id?: string;
    companyName?: string;
    licenseNumber?: string;
    city?: string;
    district?: string;
    birthDate?: string;
    whatsapp?: string;
  } | null;
}
```

### 📊 الـ States

```typescript
const [isFlipped, setIsFlipped] = useState(false);
const [showActions, setShowActions] = useState(false);
const [cardData, setCardData] = useState<any>(null);
```

### 🎨 أزرار الإجراءات

```tsx
{showActions && (
  <motion.div
    className="flex justify-center gap-2 mb-2 z-20 relative"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  >
    {/* زر تحميل صورة */}
    <Button
      size="sm"
      variant="outline"
      className="bg-white/90 backdrop-blur-sm border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-white text-xs h-7"
      onClick={(e) => {
        e.stopPropagation();
        handleDownloadImage();
      }}
    >
      <Download className="w-3 h-3 mr-1" />
      صورة
    </Button>
    
    {/* زر تحميل PDF */}
    <Button
      size="sm"
      variant="outline"
      className="bg-white/90 backdrop-blur-sm border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-white text-xs h-7"
      onClick={(e) => {
        e.stopPropagation();
        handleDownloadPDF();
      }}
    >
      <Download className="w-3 h-3 mr-1" />
      PDF
    </Button>
    
    {/* زر الطباعة */}
    <Button
      size="sm"
      variant="outline"
      className="bg-white/90 backdrop-blur-sm border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-white text-xs h-7"
      onClick={(e) => {
        e.stopPropagation();
        handlePrint();
      }}
    >
      <Printer className="w-3 h-3 mr-1" />
      طباعة
    </Button>
  </motion.div>
)}
```

**تفاصيل الأزرار:**

| الزر | الأيقونة | النص | الـ className | الـ onClick |
|-----|---------|------|--------------|------------|
| 1 | Download | صورة | bg-white/90 backdrop-blur-sm border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-white | handleDownloadImage() |
| 2 | Download | PDF | bg-white/90 backdrop-blur-sm border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-white | handleDownloadPDF() |
| 3 | Printer | طباعة | bg-white/90 backdrop-blur-sm border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-white | handlePrint() |

### 🎴 البطاقة القابلة للقلب

```tsx
<div 
  className="relative w-full h-[180px] perspective-1000 mb-4"
  onClick={() => setIsFlipped(!isFlipped)}
>
  <motion.div
    className="relative w-full h-full"
    style={{ transformStyle: "preserve-3d" }}
    animate={{ rotateY: isFlipped ? 180 : 0 }}
    transition={{ duration: 0.6 }}
  >
    {/* الوجه الأمامي */}
    <div 
      className="absolute w-full h-full backface-hidden rounded-xl border-4 border-[#D4AF37] shadow-2xl overflow-hidden"
      style={{ 
        backfaceVisibility: "hidden",
        backgroundImage: `url(${logoImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* محتوى الوجه الأمامي */}
    </div>
    
    {/* الوجه الخلفي */}
    <div 
      className="absolute w-full h-full backface-hidden rounded-xl border-4 border-[#D4AF37] shadow-2xl overflow-hidden bg-gradient-to-br from-[#01411C] to-[#065f41]"
      style={{ 
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)"
      }}
    >
      {/* محتوى الوجه الخلفي */}
    </div>
  </motion.div>
</div>
```

**التفاصيل:**
- **الحجم**: `w-full h-[180px]`
- **Border**: `border-4 border-[#D4AF37]`
- **الانيميشن**: `rotateY` من 0 إلى 180 درجة
- **المدة**: `0.6` ثانية
- **الـ onClick**: `setIsFlipped(!isFlipped)` - قلب البطاقة

### 📌 تحميل البيانات م�� localStorage

```typescript
useEffect(() => {
  if (!currentUser) return;

  const STORAGE_KEY = `business_card_${currentUser.id || currentUser.phone || 'default'}`;
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      setCardData(JSON.parse(savedData));
    }
  } catch (error) {
    console.error('خطأ في تحميل بيانات البطاقة:', error);
  }
}, [currentUser]);
```

**المفتاح المستخدم:** `business_card_${currentUser.id || currentUser.phone || 'default'}`

---

# 4️⃣ بطاقة أعمالي الرقمية (الصفحة الكاملة)

## 📍 المسار: `/components/business-card-profile.tsx`

### 🔧 الـ Imports

```typescript
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  ArrowRight, Download, Share2, Edit, 
  Phone, Mail, Globe, MapPin, 
  Building2, Award, Star, QrCode,
  Copy, Check, ExternalLink
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import QRCode from "qrcode";
import { toast } from "sonner@2.0.3";
```

### 🎯 الـ Props

```typescript
interface BusinessCardProfileProps {
  user: User | null;
  onBack: () => void;
  onEditClick?: () => void;
}
```

### 📊 الـ States

```typescript
const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
const [copied, setCopied] = useState(false);
const [cardData, setCardData] = useState<any>(null);
```

### 🎨 الأزرار الرئيسية (4 أزرار)

```tsx
<div className="flex flex-wrap gap-3 justify-center">
  {/* 1. زر التعديل */}
  <Button
    onClick={onEditClick}
    className="bg-[#01411C] hover:bg-[#065f41] text-white border-2 border-[#D4AF37]"
  >
    <Edit className="w-4 h-4 ml-2" />
    تعديل البطاقة
  </Button>

  {/* 2. زر التحميل */}
  <Button
    onClick={handleDownload}
    variant="outline"
    className="border-2 border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4]"
  >
    <Download className="w-4 h-4 ml-2" />
    تحميل
  </Button>

  {/* 3. زر المشاركة */}
  <Button
    onClick={handleShare}
    variant="outline"
    className="border-2 border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4]"
  >
    <Share2 className="w-4 h-4 ml-2" />
    مشاركة
  </Button>

  {/* 4. زر النسخ */}
  <Button
    onClick={handleCopyLink}
    variant="outline"
    className="border-2 border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4]"
  >
    {copied ? (
      <>
        <Check className="w-4 h-4 ml-2 text-green-600" />
        تم النسخ
      </>
    ) : (
      <>
        <Copy className="w-4 h-4 ml-2" />
        نسخ الرابط
      </>
    )}
  </Button>
</div>
```

**تفاصيل الأزرار:**

| # | الزر | الأيقونة | اللون | الـ onClick | الـ className |
|---|------|---------|-------|------------|--------------|
| 1 | تعديل البطاقة | Edit | bg-[#01411C] | onEditClick | bg-[#01411C] hover:bg-[#065f41] text-white border-2 border-[#D4AF37] |
| 2 | تحميل | Download | outline | handleDownload | border-2 border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4] |
| 3 | مشاركة | Share2 | outline | handleShare | border-2 border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4] |
| 4 | نسخ الرابط | Copy/Check | outline | handleCopyLink | border-2 border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4] |

### 🎴 البطاقة الرئيسية

```tsx
<Card className="border-4 border-[#D4AF37] shadow-2xl">
  <CardContent className="p-8">
    {/* الصورة الشخصية */}
    <div className="flex justify-center mb-6">
      <Avatar className="w-32 h-32 border-4 border-[#D4AF37]">
        {cardData?.profileImage && (
          <AvatarImage src={cardData.profileImage} alt={displayName} />
        )}
        <AvatarFallback className="bg-[#01411C] text-white text-4xl">
          {displayName.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </div>

    {/* الاسم */}
    <h2 className="text-3xl font-bold text-[#01411C] text-center mb-2">
      {displayName}
    </h2>

    {/* المسمى الوظيفي */}
    <p className="text-lg text-gray-600 text-center mb-1">
      {displayJob}
    </p>

    {/* اسم الشركة */}
    {displayCompany && (
      <p className="text-md text-[#D4AF37] text-center mb-4 font-medium">
        {displayCompany}
      </p>
    )}

    {/* معلومات الاتصال */}
    <div className="space-y-3 mb-6">
      {/* الجوال */}
      {displayPhone && (
        <div className="flex items-center gap-3 justify-center">
          <Phone className="w-5 h-5 text-[#01411C]" />
          <span className="text-gray-700" dir="ltr">{displayPhone}</span>
        </div>
      )}

      {/* البريد الإلكتروني */}
      {displayEmail && (
        <div className="flex items-center gap-3 justify-center">
          <Mail className="w-5 h-5 text-[#01411C]" />
          <span className="text-gray-700" dir="ltr">{displayEmail}</span>
        </div>
      )}

      {/* الموقع الإلكتروني */}
      {displayWebsite && (
        <div className="flex items-center gap-3 justify-center">
          <Globe className="w-5 h-5 text-[#01411C]" />
          <a 
            href={displayWebsite} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#D4AF37] hover:underline"
          >
            {displayWebsite}
          </a>
        </div>
      )}
    </div>

    {/* QR Code */}
    {qrCodeDataUrl && (
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-white rounded-lg border-2 border-[#D4AF37]">
          <img 
            src={qrCodeDataUrl} 
            alt="QR Code" 
            className="w-32 h-32"
          />
        </div>
      </div>
    )}

    {/* معلومات إضافية */}
    <div className="grid grid-cols-2 gap-4 text-sm">
      {/* رخصة فال */}
      {displayFalLicense && (
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Award className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
          <p className="text-gray-600">رخصة فال</p>
          <p className="font-medium text-[#01411C]">{displayFalLicense}</p>
        </div>
      )}

      {/* التقييم */}
      <div className="text-center p-3 bg-gray-50 rounded-lg">
        <Star className="w-5 h-5 text-[#D4AF37] mx-auto mb-1 fill-current" />
        <p className="text-gray-600">التقييم</p>
        <p className="font-medium text-[#01411C]">4.8</p>
      </div>
    </div>
  </CardContent>
</Card>
```

### 🔗 دوال المشاركة والتحميل

```typescript
// نسخ الرابط
const handleCopyLink = async () => {
  const link = `${window.location.origin}/business-card/${user?.id || user?.phone}`;
  try {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("تم نسخ الرابط");
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    toast.error("فشل نسخ الرابط");
  }
};

// المشاركة
const handleShare = async () => {
  const link = `${window.location.origin}/business-card/${user?.id || user?.phone}`;
  const text = `تعرف على بطاقتي الرقمية: ${displayName}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'بطاقة الأعمال الرقمية',
        text: text,
        url: link
      });
      toast.success("تمت المشاركة بنجاح");
    } catch (err) {
      console.error('Share failed:', err);
    }
  } else {
    handleCopyLink();
  }
};

// التحميل
const handleDownload = () => {
  toast.info("جاري العمل على ميزة التحميل...");
};
```

---

سأكمل باقي الأقسام في الرد التالي...
