/**
 * 🔍 نموذج طلب شراء عقار
 * ═══════════════════════════════════════
 * نسخة من نموذج الطلبات RequestsPage
 * بدون أي ربط - حرفياً
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { PlusCircle, X, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { MultiSelectOptions } from '../MultiSelectOptions';
import { PriceSuggest } from './PriceSuggest';

interface BuyRequestFormProps {
  user?: any;
  onSave: (request: any) => void;
  onCancel: () => void;
  initialData?: any;
}

type PropertyType = 'شقة' | 'فيلا' | 'أرض' | 'عمارة' | 'محل' | 'مكتب' | 'مستودع' | 'مزرعة' | 'استراحة';
type TransactionType = 'شراء' | 'استئجار';
type PropertyCategory = 'سكني' | 'تجاري';
type PaymentMethod = 'كاش' | 'تمويل' | 'دفعة واحدة' | 'دفعتان سنوي' | 'أربع دفعات' | 'شهري';
type Urgency = 'مستعجل' | 'عادي';
type RentPlatform = 'رايز' | 'إيجاري' | null;

interface PropertyRequest {
  title: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  category: PropertyCategory;
  budget: number;
  urgency: Urgency;
  city: string;
  districts: string[];
  paymentMethod: PaymentMethod;
  description?: string;
  area?: number;
  
  // 🆕 معلومات صاحب الطلب
  ownerFullName?: string;
  ownerNationalId?: string;
  ownerDob?: string;
  ownerAddress?: string;
}

export function BuyRequestForm({ user, onSave, onCancel, initialData }: BuyRequestFormProps) {
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
    description: '',
    area: undefined
  });

  // Available Districts per City
  const cityDistricts: Record<string, string[]> = {
    'الرياض': ['النرجس', 'العليا', 'الملقا', 'الياسمين', 'الربوة', 'الملز', 'السليمانية', 'الورود', 'النخيل', 'حطين', 'المروج', 'الغدير', 'الندى', 'الصحافة', 'الم العذار', 'العقيق', 'الروضة'],
    'جدة': ['الروضة', 'الزهراء', 'الشاطئ', 'الحمراء', 'الفيصلية', 'البساتين', 'السلامة', 'النعيم', 'الصفا', 'المرجان', 'أبحر الشمالية', 'أبحر الجنوبية', 'البوادي', 'الأندلس', 'الواحة'],
    'مكة': ['العزيزية', 'المعابدة', 'النوارية', 'الشرائع', 'الكعكية', 'جرول', 'الهجرة', 'الخالدية', 'الزاهر', 'التنعيم', 'الرصيفة', 'الشوقية', 'الحرم'],
    'المدينة': ['العزيزية', 'سلطانة', 'الحرم', 'المطار', 'الخالدية', 'العيون', 'قباء', 'المبعوث', 'بني ظفر', 'الدفاع', 'الرانوناء', 'الجرف'],
    'الدمام': ['الشاطئ', 'الفيصلية', 'الجلوية', 'البديع', 'الأمانة', 'الخالدية', 'طيبة', 'النور', 'الفردس', 'العنود', 'الروابي', 'الصدفة', 'الواحة'],
    'الخبر': ['العقربية', 'الكورنيش', 'الثقبة', 'الجوهرة', 'اليرموك', 'الخزامى', 'التحلية', 'البندرية', 'العزيزية', 'الهدا', 'العليا', 'الروابي'],
    'الظهران': ['الدوحة الشمالية', 'الدوحة الجنوبية', 'الواحة', 'الفيصلية', 'الخزامى', 'الثقبة'],
    'الطائف': ['شهار', 'السلامة', 'الفيصلية', 'العزيزية', 'الشهداء', 'الخالدية', 'النزهة', 'الوشحاء', 'الحويطة', 'الربيع', 'المثناة'],
    'أبها': ['الموظفين', 'الربوة', 'السد', 'الأندلس', 'لزهور', 'السليمانية', 'النسيم', 'الروضة', 'الواديين', 'المفتاحة'],
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

  const [selectedRentPlatform, setSelectedRentPlatform] = useState<RentPlatform>(null);

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
      if ((formData.districts || []).length < 3) {
        handleDistrictToggle(newDistrict);
      }
    }
  };

  const handleCreateRequest = () => {
    if (!formData.title || !formData.budget) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    onSave(formData);

    // 🆕 1) حفظ الطلب الكامل أولاً
    const fullRequestId = `full-request-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullRequestData = {
      id: fullRequestId,
      title: formData.title || `${formData.propertyType} ${formData.transactionType === 'شراء' ? 'للشراء' : 'للإيجار'} - ${formData.city}`,
      type: formData.transactionType === 'شراء' ? 'buy' : 'rent',
      transactionType: formData.transactionType === 'شراء' ? 'sale' : 'rent',
      propertyType: formData.propertyType || 'شقة',
      propertyCategory: formData.category || 'سكني',
      
      // معلومات الباحث
      ownerName: user?.name || 'باحث عن عقار',
      ownerPhone: user?.phone || '',
      
      // 🆕 معلومات صاحب الطلب الكاملة
      ownerFullName: formData.ownerFullName,
      ownerNationalId: formData.ownerNationalId,
      ownerDob: formData.ownerDob,
      ownerAddress: formData.ownerAddress,
      
      // الموقع
      city: formData.city || 'الرياض',
      districts: formData.districts || [],
      
      // المواصفات الكاملة
      area: formData.area,
      budget: formData.budget,
      priceFrom: formData.budget ? formData.budget * 0.8 : undefined,
      priceTo: formData.budget,
      paymentMethod: formData.paymentMethod,
      urgency: formData.urgency,
      description: formData.description || formData.title || '',
      
      // بدون صور أو فيديو للطلبات
      images: [],
      videos: [],
      
      // حالة الطلب
      status: 'active',
      brokerResponses: [],
      acceptedBrokers: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
      // 🆕 وسم النوع كطلب
      itemType: 'request' as const
    };
    
    // حفظ الطلب الكامل
    const currentUser = JSON.parse(localStorage.getItem('aqary-crm-user') || '{}');
    const userId = currentUser.id || user?.id || 'demo-user';
    const ownerFullRequestsKey = `owner-full-requests-${userId}`;
    const existingFullRequests = JSON.parse(localStorage.getItem(ownerFullRequestsKey) || '[]');
    existingFullRequests.push(fullRequestData);
    localStorage.setItem(ownerFullRequestsKey, JSON.stringify(existingFullRequests));
    
    console.log('✅ [BuyRequestForm] تم حفظ الطلب الكامل:', fullRequestData);

    // 🆕 2) نشر نسخة مختصرة في Marketplace
    const marketplaceOffer = {
      id: `request-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fullRequestId: fullRequestId, // 🔗 مرجع للطلب الكامل
      title: formData.title || `${formData.propertyType} ${formData.transactionType === 'شراء' ? 'للشراء' : 'للإيجار'}`,
      type: 'request' as const,
      transactionType: formData.transactionType === 'شراء' ? 'sale' as const : 'rent' as const,
      propertyCategory: formData.category === 'سكني' ? 'residential' as const : 'commercial' as const,
      userRole: formData.transactionType === 'شراء' ? 'buyer' as const : 'tenant' as const,
      userId: user?.id || 'unknown',
      userName: user?.name || 'باحث عن عقار',
      userPhone: user?.phone || '',
      propertyType: formData.propertyType || 'شقة',
      city: formData.city || 'الرياض',
      district: formData.districts?.[0],
      area: formData.area,
      priceFrom: formData.budget ? formData.budget * 0.8 : undefined,
      priceTo: formData.budget,
      description: (formData.description || formData.title || '').substring(0, 150),
      status: 'active' as const,
      responsesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const existingMarketplaceOffers = JSON.parse(localStorage.getItem('marketplace-offers') || '[]');
    existingMarketplaceOffers.push(marketplaceOffer);
    localStorage.setItem('marketplace-offers', JSON.stringify(existingMarketplaceOffers));
    
    console.log('✅ [BuyRequestForm] تم نشر النسخة المختصرة في Marketplace:', marketplaceOffer);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="border-2 border-[#D4AF37] shadow-xl">
        <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="w-6 h-6" />
              إنشاء طلب جديد
            </CardTitle>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* 🆕 معلومات صاحب الطلب */}
          <div className="bg-[#D4AF37]/10 border-2 border-[#D4AF37] rounded-xl p-6 space-y-4">
            <h3 className="text-[#D4AF37] font-bold text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              معلومات صاحب الطلب
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* الاسم الثلاثي */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الثلاثي *
                </label>
                <Input
                  value={formData.ownerFullName || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, ownerFullName: e.target.value }))}
                  placeholder="مثال: أحمد محمد العلي"
                  className="border-2 border-gray-200 focus:border-[#D4AF37]"
                />
              </div>

              {/* رقم البطاقة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم البطاقة/الهوية *
                </label>
                <Input
                  value={formData.ownerNationalId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, ownerNationalId: e.target.value }))}
                  placeholder="مثال: 1234567890"
                  className="border-2 border-gray-200 focus:border-[#D4AF37]"
                  maxLength={10}
                />
              </div>

              {/* تاريخ الميلاد */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ الميلاد *
                </label>
                <Input
                  type="date"
                  value={formData.ownerDob || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, ownerDob: e.target.value }))}
                  className="border-2 border-gray-200 focus:border-[#D4AF37]"
                />
              </div>

              {/* العنوان الحالي */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان الحالي *
                </label>
                <Input
                  value={formData.ownerAddress || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, ownerAddress: e.target.value }))}
                  placeholder="مثال: الرياض، حي النرجس، شارع الأمير محمد"
                  className="border-2 border-gray-200 focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* عنوان الطلب */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان الطلب *
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

            {/* المساحة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المساحة (متر مربع)
              </label>
              <Input
                type="number"
                value={formData.area || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, area: Number(e.target.value) }))}
                placeholder="مثال: 200"
                className="border-2 border-gray-200 focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* مولد الأسعار الذكي */}
          {formData.city && formData.propertyType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PriceSuggest
                city={formData.city}
                district={formData.districts && formData.districts.length > 0 ? formData.districts[0] : undefined}
                propertyType={formData.propertyType}
                area={formData.area}
                mode={formData.transactionType === 'استئجار' ? 'rent' : 'sale'}
                onPriceSelect={(price) => {
                  setFormData(prev => ({ ...prev, budget: price }));
                }}
                className="animate-fade-in-scale"
              />
            </motion.div>
          )}

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

          {/* طريقة الدفع */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.transactionType === 'استئجار' ? 'الدفعات *' : 'طريقة الدفع *'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {formData.transactionType === 'استئجار' ? (
                // خيارات الإيجار
                (['دفعة واحدة', 'دفعتان سنوي', 'أربع دفعات', 'شهري'] as PaymentMethod[]).map(method => (
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
                ))
              ) : (
                // خيارات البيع
                (['كاش', 'تمويل'] as PaymentMethod[]).map(method => (
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
                ))
              )}
            </div>
          </div>

          {/* منصات الإيجار - تظهر فقط عند اختيار استئجار */}
          {formData.transactionType === 'استئجار' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">💳</span>
                </div>
                <div>
                  <h3 className="font-bold text-blue-900">منصات التقسيط الإيجاري</h3>
                  <p className="text-xs text-blue-700">تدفع للمالك المبلغ كاملاً مقدماً أو على دفعتين وتقسط شهرياً على المستأجر</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* رايز Rize */}
                <button
                  type="button"
                  onClick={() => setSelectedRentPlatform('رايز')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedRentPlatform === 'رايز'
                      ? 'border-blue-600 bg-blue-100 shadow-lg'
                      : 'border-blue-300 bg-white hover:border-blue-500 hover:shadow-md'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏠</div>
                    <h4 className="font-bold text-blue-900 mb-1">رايز Rize</h4>
                    <p className="text-xs text-blue-700 mb-3">منصة تقسيط الإيجار</p>
                    <a
                      href="https://rize.sa/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      زيارة الموقع
                    </a>
                  </div>
                </button>

                {/* إيجاري Ejai */}
                <button
                  type="button"
                  onClick={() => setSelectedRentPlatform('إيجاري')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedRentPlatform === 'إيجاري'
                      ? 'border-green-600 bg-green-100 shadow-lg'
                      : 'border-green-300 bg-white hover:border-green-500 hover:shadow-md'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏘️</div>
                    <h4 className="font-bold text-green-900 mb-1">إيجاري Ejai</h4>
                    <p className="text-xs text-green-700 mb-3">منصة تقسيط الإيجار</p>
                    <a
                      href="https://www.ejari.sa/ar/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                    >
                      زيارة الموقع
                    </a>
                  </div>
                </button>
              </div>

              <div className="bg-white/80 border border-blue-300 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-900 text-center">
                  📝 <strong>ملاحظة:</strong> ادخل على المنصة وسجل المعلومات المطلوبة وسيتم التواصل معك لتأكيد طلبك
                </p>
              </div>
            </motion.div>
          )}

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
              onClick={onCancel}
              variant="outline"
              className="px-6"
            >
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}