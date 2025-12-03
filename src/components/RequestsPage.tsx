/**
 * 📋 صفحة الطلبات - Requests Page
 * =====================================
 * 
 * صفحة كاملة لإدارة طلبات العقارات مع:
 * - نموذج إنشاء طلب جديد
 * - عرض الطلبات في مستطيلات ذهبية فاخرة
 * - درجة الأهمية بالألوان (مستعجل 🔴 / عادي 🟢)
 * - تصميم RTL كامل
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlusCircle, 
  Search, 
  Filter,
  MapPin,
  Building2,
  DollarSign,
  Home,
  Calendar,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
  X,
  Eye,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { MultiSelectOptions } from './MultiSelectOptions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useDashboardContext } from '../context/DashboardContext';

// ============================================
// 📊 TYPES & INTERFACES
// ============================================

type PropertyType = 'شقة' | 'فيلا' | 'أرض' | 'عمارة' | 'محل' | 'مكتب' | 'مستودع' | 'مزرعة' | 'استراحة';
type TransactionType = 'شراء' | 'استئجار';
type PropertyCategory = 'سكني' | 'تجاري';
type PaymentMethod = 'كاش' | 'تمويل';
type Urgency = 'مستعجل' | 'عادي';

interface PropertyRequest {
  id: string;
  title: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  category: PropertyCategory;
  budget: number;
  urgency: Urgency;
  city: string;
  districts: string[]; // 3 أحياء بالترتيب
  paymentMethod: PaymentMethod;
  description?: string;
  createdAt: Date;
  status: 'active' | 'completed' | 'cancelled';
  customerId?: string; // معرف العميل للربط ببطاقته
  customerName?: string; // اسم العميل
}

interface RequestsPageProps {
  onNavigate?: (page: string, options?: any) => void;
}

// ============================================
// 🎨 COMPONENT
// ============================================

export default function RequestsPage({ onNavigate }: RequestsPageProps) {
  const { leftSidebarOpen } = useDashboardContext();

  // ============================================
  // 🎨 DEMO DATA - طلبات وهمية للعرض
  // ============================================
  const demoRequests: PropertyRequest[] = [
    {
      id: 'demo-1',
      title: 'مطلوب فيلا فاخرة في حي راقي - الرياض',
      propertyType: 'فيلا',
      transactionType: 'شراء',
      category: 'سكني',
      budget: 2500000,
      urgency: 'مستعجل',
      city: 'الرياض',
      districts: ['النرجس', 'العليا', 'الملقا'],
      paymentMethod: 'تمويل',
      description: 'أبحث عن فيلا فاخرة 4 غرف نوم + مجلس + صالة كبيرة، مع حديقة ومسبح، في حي هادئ وراقي',
      createdAt: new Date('2025-01-01'),
      status: 'active'
    },
    {
      id: 'demo-2',
      title: 'شقة للإيجار 3 غرف - جدة',
      propertyType: 'شقة',
      transactionType: 'استئجار',
      category: 'سكني',
      budget: 45000,
      urgency: 'عادي',
      city: 'جدة',
      districts: ['الروضة', 'الزهراء'],
      paymentMethod: 'كاش',
      description: 'مطلوب شقة 3 غرف نوم، مطبخ راكب، موقف سيارتين، قريبة من المدارس',
      createdAt: new Date('2024-12-28'),
      status: 'active'
    },
    {
      id: 'demo-3',
      title: 'أرض تجارية على شارع رئيسي',
      propertyType: 'أرض',
      transactionType: 'شراء',
      category: 'تجاري',
      budget: 3000000,
      urgency: 'مستعجل',
      city: 'الرياض',
      districts: ['العليا'],
      paymentMethod: 'كاش',
      description: 'أبحث عن أرض تجارية على شارع رئيسي، مساحة لا تقل عن 800 متر، للاستثمار',
      createdAt: new Date('2025-01-02'),
      status: 'active'
    }
  ];

  // States
  const [requests, setRequests] = useState<PropertyRequest[]>(demoRequests);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<PropertyRequest | null>(null);
  
  // ✅ قراءة الطلبات من localStorage عند التحميل
  useEffect(() => {
    const savedRequests = localStorage.getItem('customer_requests');
    if (savedRequests) {
      try {
        const parsed = JSON.parse(savedRequests);
        setRequests(parsed);
      } catch (error) {
        console.error('خطأ في قراءة الطلبات:', error);
      }
    }
  }, []);

  // ✅ حفظ الطلبات في localStorage عند التعديل
  useEffect(() => {
    if (requests.length > 0) {
      localStorage.setItem('customer_requests', JSON.stringify(requests));
    }
  }, [requests]);

  // Form State
  const [formData, setFormData] = useState<Partial<PropertyRequest>>({
    title: '',
    propertyType: 'شقة',
    transactionType: 'شراء',
    category: 'سكني',
    budget: 0,
    urgency: 'عادي',
    city: 'الرياض',
    districts: [],
    paymentMethod: 'كاش',
    description: ''
  });

  // Available Districts per City
  const cityDistricts: Record<string, string[]> = {
    'الرياض': ['النرجس', 'العليا', 'الملقا', 'الياسمين', 'الربوة', 'الملز', 'السليمانية', 'الورود', 'النخيل', 'حطين', 'المروج', 'الغدير', 'الندى', 'الصحافة', 'الم العذار', 'العقيق', 'الروضة'],
    'جدة': ['الروضة', 'الزهراء', 'الشاطئ', 'الحمراء', 'الفيصلية', 'البساتين', 'السلامة', 'النعيم', 'الصفا', 'المرجان', 'أبحر الشمالية', 'أبحر الجنوبية', 'البوادي', 'الأندلس', 'الواحة'],
    'مكة': ['العزيزية', 'المعابدة', 'النوارية', 'الشرائع', 'الكعكية', 'جرول', 'الهجرة', 'الخالدية', 'الزاهر', 'التنعيم', 'الرصيفة', 'الشوقية', 'الحرم'],
    'المدينة': ['العزيزية', 'سلطانة', 'الحرم', 'المطار', 'الخالدية', 'العيون', 'قباء', 'المبعوث', 'بني ظفر', 'الدفاع', 'الرانوناء', 'الجرف'],
    'الدمام': ['الشاطئ', 'الفيصلية', 'الجلوية', 'البديع', 'الأمانة', 'الخالدية', 'طيبة', 'النور', 'الفردس', 'العنود', 'الروابي', 'الصدفة', 'الواحة'],
    'الخبر': ['العقربية', 'الكورنيش', 'الثقبة', 'الجوهرة', 'اليرموك', 'الخزامى', 'التحلية', 'البندرية', 'العزيزية', 'الهدا', 'العليا', 'الروابي'],
    'الظهران': ['الدوحة الشمالية', 'الدحة الجنوبية', 'الواحة', 'الفيصلية', 'الخزامى', 'الثقبة'],
    'الطائف': ['شهار', 'السلامة', 'الفيصلية', 'العزيزية', 'الشهداء', 'الخالدية', 'النزهة', 'الوشحاء', 'الحويطة', 'الربيع', 'المثناة'],
    'أبها': ['الموظفين', 'الربوة', 'السد', 'الأندلس', 'الزهور', 'السليمانية', 'النسيم', 'الروضة', 'الواديين', 'المفتاحة'],
    'تبوك': ['السلام', 'الأمير فهد بن سلطان', 'الورود', 'الفيصلية', 'المروج', 'النسيم', 'السليمانية', 'الصناعية'],
    'بريدة': ['الزهور', 'الإسكان', 'الروضة', 'الفيصلية', 'البساتين', 'النخيل', 'النقع', 'السالمية'],
    'خميس مشيط': ['الموظفين', 'الراقي', 'المطار', 'المثناة', 'الصناعية', 'الروضة', 'الخالدية', 'النزهة'],
    'نجران': ['الفيصلية', 'الزور', 'المطار', 'الضاحية', 'السليمانية', 'الفهد', 'المخلاف'],
    'جزان': ['الروضة', 'البساتين', 'السلام', 'المحمدية', 'الجوهرة', 'الفيصلية', 'الشاطئ'],
    'حفر الباطن': ['الفيصلية', 'الربوة', 'البديعة', 'الإسكان', 'النسيم', 'الروضة'],
    'الجبيل': ['الدفي', 'الحويلات', 'الفناتير', 'الهياثم', 'الصناعية', 'الورود', 'الدانة'],
    'ينبع': ['الفيصلية', 'النخيل', 'الصناعية', 'الشاطئ', 'المحمدية', 'البلد'],
    'القطيف': ['سنابس', 'الحمام', 'عنك', 'الجش', 'صفوى', 'الأوجام', 'التوبي'],
    'القصيم': ['الملك فهد', 'المنتزه', 'الروضة', 'الصالحية', 'النخيل', 'الفيصلية'],
    'عرعر': ['الروضة', 'المطار', 'الفيصلية', 'البساتين', 'الصناعية', 'المعلمين']
  };

  const [availableDistricts, setAvailableDistricts] = useState<string[]>(
    cityDistricts[formData.city || 'الرياض'] || []
  );

  // ============================================
  // 🔧 HANDLERS
  // ============================================

  const handleCreateRequest = () => {
    if (!formData.title || !formData.budget) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const newRequest: PropertyRequest = {
      id: `req-${Date.now()}`,
      title: formData.title!,
      propertyType: formData.propertyType!,
      transactionType: formData.transactionType!,
      category: formData.category!,
      budget: formData.budget!,
      urgency: formData.urgency!,
      city: formData.city!,
      districts: formData.districts!,
      paymentMethod: formData.paymentMethod!,
      description: formData.description,
      createdAt: new Date(),
      status: 'active'
    };

    setRequests(prev => [newRequest, ...prev]);
    setShowCreateForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      propertyType: 'شقة',
      transactionType: 'شراء',
      category: 'سكني',
      budget: 0,
      urgency: 'عادي',
      city: 'الرياض',
      districts: [],
      paymentMethod: 'كاش',
      description: ''
    });
  };

  const handleDistrictToggle = (district: string) => {
    setFormData(prev => {
      const current = prev.districts || [];
      if (current.includes(district)) {
        return { ...prev, districts: current.filter(d => d !== district) };
      } else if (current.length < 3) {
        return { ...prev, districts: [...current, district] };
      }
      return prev;
    });
  };

  const handleAddNewDistrict = (newDistrict: string) => {
    if (!availableDistricts.includes(newDistrict)) {
      setAvailableDistricts(prev => [...prev, newDistrict]);
      // تحديد الحي الجديد تلقائياً إذا كان هناك مساحة
      if ((formData.districts || []).length < 3) {
        handleDistrictToggle(newDistrict);
      }
    }
  };

  const getUrgencyColor = (urgency: Urgency) => {
    return urgency === 'مستعجل' 
      ? 'bg-red-500 text-white' 
      : 'bg-green-500 text-white';
  };

  const filteredRequests = requests.filter(req =>
    req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ============================================
  // 🎨 RENDER
  // ============================================

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7] p-6 transition-all duration-300" 
      dir="rtl"
      style={{
        marginLeft: leftSidebarOpen ? "350px" : "0"
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#01411C] mb-2">
              📋 الطلبات
            </h1>
            <p className="text-gray-600">
              إدارة طلبات البحث عن العقارات
            </p>
          </div>

          {/* زر إنشاء طلب */}
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-[#01411C] to-[#065f41] hover:from-[#065f41] hover:to-[#01411C] text-white px-6 py-3 shadow-lg"
          >
            <PlusCircle className="w-5 h-5 ml-2" />
            إنشاء طلب جديد
          </Button>
        </div>

        {/* Create Request Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="border-2 border-[#D4AF37] shadow-xl">
                <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <PlusCircle className="w-6 h-6" />
                      إنشاء طلب جديد
                    </CardTitle>
                    <button
                      onClick={() => setShowCreateForm(false)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* عنوان الطلب */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان الطل *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="مثال: مطلوب شقة 3 غرف في حي راقي"
                      className="border-2 border-gray-200 focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* درجة الأهمية */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      درجة الأهمية *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['مستعجل', 'عادي'] as Urgency[]).map(urgency => (
                        <button
                          key={urgency}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, urgency }))}
                          className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                            formData.urgency === urgency
                              ? urgency === 'مستعجل'
                                ? 'bg-red-500 text-white shadow-lg'
                                : 'bg-green-500 text-white shadow-lg'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {urgency === 'مستعجل' ? '🔴' : '🟢'}
                          <span>{urgency}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* المدينة */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المدينة *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, city: e.target.value, districts: [] }));
                        setAvailableDistricts(cityDistricts[e.target.value] || []);
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                    >
                      <option value="الرياض">الرياض</option>
                      <option value="جدة">جدة</option>
                      <option value="الدمام">الدمام</option>
                      <option value="مكة">مكة المكرمة</option>
                      <option value="المدينة">المدينة المنورة</option>
                      <option value="الخبر">الخبر</option>
                      <option value="الظهران">الظهران</option>
                      <option value="الطائف">الطائف</option>
                      <option value="أبها">أبها</option>
                      <option value="تبوك">تبوك</option>
                      <option value="بريدة">بريدة</option>
                      <option value="خميس مشيط">خميس مشيط</option>
                      <option value="نجران">نجران</option>
                      <option value="جزان">جزان</option>
                      <option value="حفر الباطن">حفر الباطن</option>
                      <option value="الجبيل">الجبيل</option>
                      <option value="ينبع">ينبع</option>
                      <option value="القطيف">القطيف</option>
                      <option value="القصيم">القصيم</option>
                      <option value="عرعر">عرعر</option>
                    </select>
                  </div>

                  {/* الأحياء (3 اختيارية بالترتيب) */}
                  <div>
                    <MultiSelectOptions
                      options={availableDistricts}
                      selectedOptions={formData.districts || []}
                      onToggle={handleDistrictToggle}
                      onAddNew={handleAddNewDistrict}
                      label={`الأحياء المفضلة (اختر حتى 3 - الترتيب مهم) - تم اختيار ${(formData.districts || []).length}/3`}
                      addButtonText="إضافة حي جديد"
                    />
                    {formData.districts && formData.districts.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-800 font-medium mb-2">
                          ترتيب البحث:
                        </p>
                        <div className="flex gap-2">
                          {formData.districts.map((district, index) => (
                            <Badge key={district} className="bg-blue-600 text-white">
                              {index + 1}. {district}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* نوع العقار */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نوع العقار *
                      </label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value as PropertyType }))}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="شقة">شقة</option>
                        <option value="فيلا">فيلا</option>
                        <option value="أرض">أرض</option>
                        <option value="عمارة">عمارة</option>
                        <option value="محل">محل</option>
                        <option value="مكتب">مكتب</option>
                        <option value="مستودع">مستودع</option>
                        <option value="مزرعة">مزرعة</option>
                        <option value="استراحة">استراحة</option>
                      </select>
                    </div>

                    {/* شراء/استئجار */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نوع العملية *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['شراء', 'استئجار'] as TransactionType[]).map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, transactionType: type }))}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              formData.transactionType === type
                                ? 'bg-[#01411C] text-white shadow-md'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* سكني/تجاري */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        التصنيف *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['سكني', 'تجاري'] as PropertyCategory[]).map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              formData.category === cat
                                ? 'bg-[#01411C] text-white shadow-md'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* الميزانية */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الميزانية (ريال) *
                      </label>
                      <Input
                        type="number"
                        value={formData.budget || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))}
                        placeholder="500000"
                        className="border-2 border-gray-200 focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  {/* طريقة الدفع */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      طريقة الدفع *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['كاش', 'تمويل'] as PaymentMethod[]).map(method => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            formData.paymentMethod === method
                              ? 'bg-[#01411C] text-white shadow-md'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ملاحظات */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ملاحظات إضافية
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="أضف أي ملاحظات أو متطلبات إضافية..."
                      rows={3}
                      className="border-2 border-gray-200 focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleCreateRequest}
                      className="flex-1 bg-gradient-to-r from-[#01411C] to-[#065f41] hover:from-[#065f41] hover:to-[#01411C] text-white py-3"
                    >
                      <PlusCircle className="w-5 h-5 ml-2" />
                      إنشاء الطلب
                    </Button>
                    <Button
                      onClick={() => setShowCreateForm(false)}
                      variant="outline"
                      className="px-6"
                    >
                      إلغاء
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الطلبات..."
              className="pr-10 border-2 border-gray-200 focus:border-[#D4AF37]"
            />
          </div>
          <Button variant="outline" className="px-6">
            <Filter className="w-5 h-5 ml-2" />
            فلترة
          </Button>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-2 border-[#D4AF37] shadow-lg hover:shadow-xl transition-all overflow-hidden">
                  {/* Golden Header with Budget */}
                  <div className="bg-gradient-to-r from-[#D4AF37] to-[#C5A028] p-4 border-b-4 border-[#D4AF37]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-xs mb-1">الميزانية</p>
                        <p className="text-white font-bold text-xl">
                          {request.budget.toLocaleString('ar-SA')} ر.س
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-lg ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency === 'مستعجل' ? '🔴' : '🟢'} {request.urgency}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    {/* Title */}
                    <h3 className="font-bold text-lg text-[#01411C]">
                      {request.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-sm">
                        {request.city} - {request.districts[0] || 'جميع الأحياء'}
                      </span>
                    </div>

                    {/* Property Type & Transaction */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#01411C]" />
                        <span className="text-sm text-gray-700">
                          {request.propertyType} - {request.transactionType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-[#01411C]" />
                        <span className="text-sm text-gray-700">
                          {request.category}
                        </span>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <Badge className="bg-[#01411C] text-white">
                      <DollarSign className="w-3 h-3 ml-1" />
                      {request.paymentMethod}
                    </Badge>

                    {/* Districts */}
                    {request.districts.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500 mb-2">الأحياء بالترتيب:</p>
                        <div className="flex flex-wrap gap-1">
                          {request.districts.map((district, idx) => (
                            <Badge key={district} variant="outline" className="text-xs">
                              {idx + 1}. {district}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-[#01411C] hover:bg-[#065f41] text-white"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <Eye className="w-4 h-4 ml-1" />
                        عرض التفاصيل
                      </Button>
                      {request.customerId && onNavigate && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4]"
                          onClick={() => onNavigate('customer-details', { customerId: request.customerId })}
                        >
                          <Users className="w-4 h-4 ml-1" />
                          العميل
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 ml-1" />
                        تعديل
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              لا توجد طلبات
            </h3>
            <p className="text-gray-500">
              {searchQuery ? 'لم يتم العثور على نتائج' : 'ابدأ بإنشاء طلب جديد'}
            </p>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* 📋 MODAL: عرض تفاصيل الطلب */}
      {/* ============================================ */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-[#01411C] flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-lg ${
                    selectedRequest.urgency === 'مستعجل' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-green-500 text-white'
                  }`}>
                    {selectedRequest.urgency === 'مستعجل' ? '🔴' : '🟢'} {selectedRequest.urgency}
                  </div>
                  تفاصيل الطلب
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  عرض جميع معلومات الطلب بما في ذلك الميزانية والموقع والمواصفات المطلوبة
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Header الذهبي مع الميزانية */}
                <div className="bg-gradient-to-r from-[#D4AF37] to-[#C5A028] p-6 rounded-xl border-4 border-[#D4AF37] shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm mb-1">الميزانية المحددة</p>
                      <p className="text-white font-bold text-3xl">
                        {selectedRequest.budget.toLocaleString('ar-SA')} ريال سعودي
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-sm mb-1">طريقة الدفع</p>
                      <Badge className="bg-white text-[#01411C] text-lg px-4 py-2">
                        {selectedRequest.paymentMethod}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* العنوان */}
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">عنوان الطلب</p>
                  <h2 className="text-xl font-bold text-[#01411C]">{selectedRequest.title}</h2>
                </div>

                {/* المعلومات الأساسية */}
                <div className="grid grid-cols-2 gap-4">
                  {/* نوع العقار */}
                  <div className="bg-gradient-to-br from-[#f0fdf4] to-white p-4 rounded-lg border-2 border-[#01411C]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-[#01411C]" />
                      <p className="text-xs text-gray-500">نوع العقار</p>
                    </div>
                    <p className="text-lg font-bold text-[#01411C]">{selectedRequest.propertyType}</p>
                  </div>

                  {/* نوع العملية */}
                  <div className="bg-gradient-to-br from-[#fffef7] to-white p-4 rounded-lg border-2 border-[#D4AF37]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                      <p className="text-xs text-gray-500">نوع العملية</p>
                    </div>
                    <p className="text-lg font-bold text-[#D4AF37]">{selectedRequest.transactionType}</p>
                  </div>

                  {/* التصنيف */}
                  <div className="bg-gradient-to-br from-[#f0fdf4] to-white p-4 rounded-lg border-2 border-[#01411C]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="w-5 h-5 text-[#01411C]" />
                      <p className="text-xs text-gray-500">التصنيف</p>
                    </div>
                    <p className="text-lg font-bold text-[#01411C]">{selectedRequest.category}</p>
                  </div>

                  {/* المدينة */}
                  <div className="bg-gradient-to-br from-[#fffef7] to-white p-4 rounded-lg border-2 border-[#D4AF37]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-[#D4AF37]" />
                      <p className="text-xs text-gray-500">المدينة</p>
                    </div>
                    <p className="text-lg font-bold text-[#D4AF37]">{selectedRequest.city}</p>
                  </div>
                </div>

                {/* الأحياء المفضلة بالترتيب */}
                {selectedRequest.districts.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border-2 border-blue-300 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-blue-800">الأحياء المفضلة بالترتيب</h3>
                    </div>
                    <p className="text-xs text-blue-600 mb-3">
                      ⚠️ البحث سيبدأ من الحي الأول ثم الثاني ثم الثالث حسب الترتيب
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {selectedRequest.districts.map((district, idx) => (
                        <div 
                          key={district}
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
                        >
                          <span className="bg-white text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </span>
                          <span className="font-medium">{district}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* الوصف */}
                {selectedRequest.description && (
                  <div className="bg-gray-50 p-5 rounded-lg border-2 border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">ملاحظات إضافية</p>
                    <p className="text-gray-700 leading-relaxed">{selectedRequest.description}</p>
                  </div>
                )}

                {/* معلومات إضافية */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-300">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">تاريخ الإنشاء</p>
                      <p className="font-medium text-gray-800">
                        {selectedRequest.createdAt.toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">حالة الطلب</p>
                      <Badge className={
                        selectedRequest.status === 'active' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-500 text-white'
                      }>
                        {selectedRequest.status === 'active' ? 'نشط' : 'مكتمل'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-[#01411C] to-[#065f41] hover:from-[#065f41] hover:to-[#01411C] text-white py-3"
                  >
                    <Edit className="w-5 h-5 ml-2" />
                    تعديل الطلب
                  </Button>
                  <Button 
                    variant="outline" 
                    className="px-6 text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5 ml-2" />
                    حذف
                  </Button>
                  <Button 
                    variant="outline" 
                    className="px-6"
                    onClick={() => setSelectedRequest(null)}
                  >
                    إغلاق
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}