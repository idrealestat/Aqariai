# 🎨 **عقاري AI - الجزء 2: المكونات المتقدمة**

## 📂 **7. منصتي (My Platform / Workspace)**

### **7.1 القائمة الجانبية اليسرى (Left Sidebar):**

```typescript
// المكون: LeftSliderComplete
// الموقع: /components/LeftSliderComplete.tsx

interface MenuItem {
  icon: LucideIcon;
  title: string;
  description: string;
  action: () => void;
  color: string;
  bgColor: string;
  badge?: string;
}

const menuItems: MenuItem[] = [
  {
    icon: Home,
    title: 'الرئيسية',
    description: 'العودة للصفحة الرئيسية',
    action: () => onNavigate('dashboard'),
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Users,
    title: 'إدارة العملاء',
    description: 'إدارة العملاء وقاعدة البيانات',
    action: () => onNavigate('enhanced-crm'),
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    badge: 'جديد'
  },
  {
    icon: Target,
    title: 'الطلبات الخاصة',
    description: 'اطلب عقار بمواصفات محددة',
    action: () => onNavigate('special-requests'),
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    badge: 'VIP'
  },
  {
    icon: BarChart,
    title: 'التحل��لات',
    description: 'إحصائيات وتقارير',
    action: () => onNavigate('analytics'),
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    icon: Calendar,
    title: 'المواعيد',
    description: 'جدولة المواعيد والمعاينات',
    action: () => onNavigate('calendar'),
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    icon: FileText,
    title: 'العقود',
    description: 'إدارة العقود والوثائق',
    action: () => onNavigate('contracts'),
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    icon: Tag,
    title: 'العروض المحفوظة',
    description: 'العروض التي أعجبتك',
    action: () => onNavigate('saved-offers'),
    color: 'text-pink-600',
    bgColor: 'bg-pink-50'
  },
  {
    icon: Settings,
    title: 'الإعدادات والزملاء',
    description: 'إدارة الحساب • إدارة الفريق',
    action: () => onNavigate('settings'),
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    badge: 'فريق'  // يظهر فقط للأنواع التي تدعم الفريق
  }
];
```

---

### **تصميم Left Sidebar:**

```tsx
<AnimatePresence>
  {isOpen && (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
        dir="rtl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-l from-[#01411C] to-[#065f41] p-4 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">القائمة</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* User Info */}
        {currentUser && (
          <div className="p-4 border-b-2 border-[#D4AF37]">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-[#D4AF37]">
                <AvatarFallback className="bg-[#01411C] text-white">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-right">
                <p className="font-bold text-[#01411C]">
                  {currentUser.name}
                </p>
                <p className="text-sm text-gray-600">
                  {currentUser.phone}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              القائمة الرئيسية
            </h3>
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="w-full text-right p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className={`
                        w-10 h-10 ${item.bgColor} rounded-lg 
                        flex items-center justify-center 
                        group-hover:scale-110 transition-transform
                      `}
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {item.title}
                        </span>
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-[#D4AF37] text-[#01411C]"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 text-right">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Support Section */}
          <Separator />
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              الدعم والمساعدة
            </h3>
            <div className="space-y-2">
              {supportItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full text-right p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

---

### **7.2 القائمة اليمنى (Right Slider - 18 عنصر):**

```typescript
// المكون: RightSliderComplete-fixed
// 18 عنصر رئيسي محمي

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

---

### **تصميم Right Sidebar:**

```tsx
<AnimatePresence>
  {isOpen && (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
        dir="rtl"
      >
        {/* Header with User Info */}
        <div className="sticky top-0 bg-gradient-to-r from-[#01411C] to-[#065f41] p-6 border-b-4 border-[#D4AF37]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold">القائمة الرئيسية</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Mini User Card */}
          {currentUser && (
            <MiniUserCard user={currentUser} />
          )}
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="navigation" className="w-full">
          <TabsList className="w-full grid grid-cols-2 p-2 bg-gray-100">
            <TabsTrigger value="navigation">التنقل</TabsTrigger>
            <TabsTrigger value="tools">الأدوات</TabsTrigger>
          </TabsList>

          {/* Navigation Tab */}
          <TabsContent value="navigation" className="p-4">
            <div className="space-y-2">
              {RIGHT_SIDEBAR_ITEMS.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.path);
                    onClose();
                  }}
                  className="w-full p-4 rounded-xl border-2 border-gray-100 hover:border-[#D4AF37] hover:bg-gray-50 transition-all text-right group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <item.icon 
                        className="w-6 h-6"
                        style={{ color: item.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="text-xs">{item.badge}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <ToolCard 
                icon={<Calculator />}
                label="حاسبة التمويل"
                onClick={() => onNavigate('finance-calculator')}
              />
              <ToolCard 
                icon={<Upload />}
                label="رفع عقار"
                onClick={() => onNavigate('property-upload')}
              />
              <ToolCard 
                icon={<Share2 />}
                label="المشاركة"
                onClick={() => onNavigate('sharing')}
              />
              <ToolCard 
                icon={<FileSignature />}
                label="عقد جاهز"
                onClick={() => onNavigate('contracts')}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Subscription Tier at Bottom */}
        <div className="p-4 border-t-2 border-gray-100">
          <SubscriptionTierSlab
            currentPlan={currentUser?.plan || 'bronze'}
            compact={true}
          />
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

---

## 👥 **8. إدارة العملاء (CRM)**

### **8.1 جدول العملاء:**

```typescript
// المكون: EnhancedBrokerCRM
// جدول كامل مع Search, Filter, Sort, Pagination

interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  status: 'جديد' | 'متابعة' | 'مهتم' | 'تم البيع' | 'ملغي';
  priority: 'عادي' | 'متوسط' | 'عالي' | 'عاجل';
  propertyType: 'شقة' | 'فيلا' | 'أرض' | 'محل' | 'مكتب';
  budget: string;
  location: string;
  notes: string;
  source: 'موقع' | 'واتساب' | 'مكالمة' | 'إحالة' | 'معرض';
  assignedTo?: string;
  createdAt: string;
  lastContact: string;
  nextFollowUp?: string;
  tags: string[];
}
```

---

### **تصميم جدول CRM:**

```tsx
<div className="space-y-4">
  {/* Header with Actions */}
  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
    {/* Search */}
    <div className="relative flex-1 max-w-md">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        placeholder="ابحث عن عميل..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pr-10 text-right"
      />
    </div>

    {/* Filters */}
    <div className="flex gap-2">
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="الحالة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">الكل</SelectItem>
          <SelectItem value="جديد">جديد</SelectItem>
          <SelectItem value="متابعة">متابعة</SelectItem>
          <SelectItem value="مهتم">مهتم</SelectItem>
          <SelectItem value="تم البيع">تم البيع</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filterPriority} onValueChange={setFilterPriority}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="الأولوية" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">الكل</SelectItem>
          <SelectItem value="عادي">عادي</SelectItem>
          <SelectItem value="متوسط">متوسط</SelectItem>
          <SelectItem value="عالي">عالي</SelectItem>
          <SelectItem value="عاجل">عاجل</SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={() => setShowAddCustomer(true)}
        className="bg-[#01411C] hover:bg-[#065f41]"
      >
        <Plus className="w-4 h-4 ml-2" />
        إضافة عميل
      </Button>
    </div>
  </div>

  {/* Table */}
  <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
              الاسم
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
              الهاتف
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
              الحالة
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
              الأولوية
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
              نوع العقار
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
              الميزانية
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
              آخر تواصل
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredCustomers.map((customer) => (
            <tr 
              key={customer.id}
              className="hover:bg-gray-50 transition-colors"
            >
              {/* Name */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-[#D4AF37]">
                    <AvatarFallback className="bg-[#01411C] text-white text-sm">
                      {customer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">
                      {customer.name}
                    </p>
                    {customer.email && (
                      <p className="text-xs text-gray-500">
                        {customer.email}
                      </p>
                    )}
                  </div>
                </div>
              </td>

              {/* Phone */}
              <td className="px-4 py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <MessageCircle className="w-4 h-4" />
                    <span>{customer.whatsapp}</span>
                  </div>
                </div>
              </td>

              {/* Status */}
              <td className="px-4 py-4">
                <Badge
                  className={getStatusColor(customer.status)}
                >
                  {customer.status}
                </Badge>
              </td>

              {/* Priority */}
              <td className="px-4 py-4">
                <Badge
                  variant="outline"
                  className={getPriorityColor(customer.priority)}
                >
                  {customer.priority}
                </Badge>
              </td>

              {/* Property Type */}
              <td className="px-4 py-4">
                <span className="text-sm text-gray-700">
                  {customer.propertyType}
                </span>
              </td>

              {/* Budget */}
              <td className="px-4 py-4">
                <span className="text-sm font-medium text-[#01411C]">
                  {customer.budget}
                </span>
              </td>

              {/* Last Contact */}
              <td className="px-4 py-4">
                <span className="text-sm text-gray-600">
                  {formatDate(customer.lastContact)}
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleViewCustomer(customer)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditCustomer(customer)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCallCustomer(customer.phone)}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleWhatsAppCustomer(customer.whatsapp)}
                  >
                    <MessageCircle className="w-4 h-4 text-green-600" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Pagination */}
  <div className="flex items-center justify-between">
    <p className="text-sm text-gray-600">
      عرض {startIndex + 1} إلى {Math.min(endIndex, totalCustomers)} من {totalCustomers}
    </p>
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
      >
        السابق
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
      >
        التالي
      </Button>
    </div>
  </div>
</div>
```

---

## 📅 **10. التقويم والمواعيد (Calendar)**

### **10.1 واجهة التقويم:**

```typescript
// المكون: CalendarSystemComplete

interface Appointment {
  id: string;
  title: string;
  clientName: string;
  clientPhone: string;
  clientWhatsapp: string;
  type: 'معاينة' | 'اجتماع' | 'توقيع عقد' | 'استشارة' | 'متابعة';
  start: string;  // ISO date string
  end: string;
  location: string;
  notes: string;
  status: 'قادم' | 'جاري' | 'مكتمل' | 'ملغي';
  priority: 'عادي' | 'متوسط' | 'عالي';
  reminder: '15 دقيقة' | '30 دقيقة' | 'ساعة' | 'يوم';
  color: string;
}
```

---

### **عرض التقويم:**

```tsx
<div className="space-y-6">
  {/* Header */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        onClick={handlePrevMonth}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <h2 className="text-2xl font-bold text-[#01411C]">
        {format(currentMonth, 'MMMM yyyy', { locale: ar })}
      </h2>
      <Button
        variant="outline"
        onClick={handleNextMonth}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>

    <div className="flex gap-2">
      <Button
        variant={view === 'month' ? 'default' : 'outline'}
        onClick={() => setView('month')}
      >
        شهري
      </Button>
      <Button
        variant={view === 'week' ? 'default' : 'outline'}
        onClick={() => setView('week')}
      >
        أسبوعي
      </Button>
      <Button
        variant={view === 'day' ? 'default' : 'outline'}
        onClick={() => setView('day')}
      >
        يومي
      </Button>
      <Button
        onClick={() => setShowAddAppointment(true)}
        className="bg-[#01411C] hover:bg-[#065f41]"
      >
        <Plus className="w-4 h-4 ml-2" />
        موعد جديد
      </Button>
    </div>
  </div>

  {/* Calendar Grid */}
  <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
    {/* Days Header */}
    <div className="grid grid-cols-7 bg-gray-50 border-b-2 border-gray-200">
      {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
        <div key={day} className="p-4 text-center font-semibold text-gray-700 border-l border-gray-200 last:border-l-0">
          {day}
        </div>
      ))}
    </div>

    {/* Calendar Days */}
    <div className="grid grid-cols-7">
      {calendarDays.map((day, index) => (
        <div
          key={index}
          className={`
            min-h-32 p-2 border-b border-l border-gray-200
            last:border-l-0
            ${!isSameMonth(day, currentMonth) ? 'bg-gray-50' : 'bg-white'}
            ${isToday(day) ? 'bg-blue-50' : ''}
            hover:bg-gray-50 transition-colors
          `}
          onClick={() => handleDayClick(day)}
        >
          {/* Day Number */}
          <div className={`
            text-right mb-2
            ${isToday(day) ? 'font-bold text-blue-600' : 'text-gray-700'}
          `}>
            {format(day, 'd')}
          </div>

          {/* Appointments */}
          <div className="space-y-1">
            {getAppointmentsForDay(day).slice(0, 3).map(appointment => (
              <div
                key={appointment.id}
                className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: `${appointment.color}20` }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewAppointment(appointment);
                }}
              >
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span className="font-medium truncate">
                    {format(new Date(appointment.start), 'HH:mm')}
                  </span>
                </div>
                <p className="truncate">
                  {appointment.title}
                </p>
              </div>
            ))}
            {getAppointmentsForDay(day).length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{getAppointmentsForDay(day).length - 3} المزيد
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Filters */}
  <div className="flex flex-wrap gap-2">
    <Badge 
      className="cursor-pointer"
      variant={filterType === 'all' ? 'default' : 'outline'}
      onClick={() => setFilterType('all')}
    >
      الكل ({appointments.length})
    </Badge>
    <Badge 
      className="cursor-pointer bg-blue-500"
      variant={filterType === 'معاينة' ? 'default' : 'outline'}
      onClick={() => setFilterType('معاينة')}
    >
      معاينة ({countByType('معاينة')})
    </Badge>
    <Badge 
      className="cursor-pointer bg-green-500"
      variant={filterType === 'اجتماع' ? 'default' : 'outline'}
      onClick={() => setFilterType('اجتماع')}
    >
      اجتماع ({countByType('اجتماع')})
    </Badge>
    <Badge 
      className="cursor-pointer bg-purple-500"
      variant={filterType === 'توقيع عقد' ? 'default' : 'outline'}
      onClick={() => setFilterType('توقيع عقد')}
    >
      توقيع عقد ({countByType('توقيع عقد')})
    </Badge>
  </div>
</div>
```

---

سأكمل باقي المكونات في ملف ثالث...
