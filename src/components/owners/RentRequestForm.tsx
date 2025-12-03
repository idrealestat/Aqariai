import { useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import { PriceSuggest } from "./PriceSuggest";
import { AIDescription } from "./AIDescription";
import { RegistrationData, PropertyFeatures, Request, Guarantee } from "../../types/owners";
import { 
  Save, 
  Eye, 
  Search, 
  FileText, 
  Plus,
  Minus,
  X,
  DollarSign,
  MapPin,
  CreditCard
} from "lucide-react";

interface RentRequestFormProps {
  user?: RegistrationData;
  onSave: (request: Partial<Request>) => void;
  onCancel: () => void;
  initialData?: Partial<Request>;
}

const propertyTypes = [
  'شقة', 'فيلا', 'أرض', 'دبلكس', 'تجاري', 'استراحة', 'مزرعة', 'مخزن', 'مكتب'
];

const saudiCities = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الظهران',
  'تبوك', 'بريدة', 'خميس مشيط', 'حائل', 'نجران', 'الجبيل', 'ينبع', 'الطائف',
  'القطيف', 'صبيا', 'سكاكا', 'جيزان', 'أرع', 'الباحة', 'عرعر'
];

const paymentTypes = [
  { value: 'نقد', label: 'نقد', description: 'دفع نقدي مباشر' },
  { value: 'تمويل', label: 'تمويل', description: 'عبر التمويل العقاري' }
];

const paymentMethods = [
  { value: 'دفعتان', label: 'دفعتان', description: 'دفعة كل 6 أشهر' },
  { value: 'أربع دفعات', label: 'أربع دفعات', description: 'دفعة كل 3 أشهر' },
  { value: 'شهري', label: 'شهري', description: 'دفعة شهرية' }
];

// قاموس الأحياء المقترحة لكل مدينة
const neighborhoodsByCity: { [key: string]: string[] } = {
  'الرياض': ['العليا', 'الملز', 'النرجس', 'العقيق', 'الروضة', 'السليمانية', 'المروج', 'الياسمين'],
  'جدة': ['الروضة', 'الزهراء', 'النزهة', 'الشاطئ', 'السلامة', 'البلد', 'الصفا', 'المرجان'],
  'الدمام': ['الفيصلية', 'الشاطئ', 'النورس', 'العنود', 'الناصرية', 'الخالدية', 'المنار'],
  'الخبر': ['الراكة الشمالية', 'الراكة الجنوبية', 'العقربية', 'مدينة العمال', 'الثقبة', 'اللؤلؤ']
};

export function RentRequestForm({ user, onSave, onCancel, initialData }: RentRequestFormProps) {
  // بيانات أساسية
  const [contact, setContact] = useState<RegistrationData>({
    fullName: user?.fullName || '',
    dob: user?.dob || '',
    nationalId: user?.nationalId || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });

  // تفاصيل الطلب
  const [propertyType, setPropertyType] = useState(initialData?.type || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [district, setDistrict] = useState(initialData?.district || '');
  const [suggestedDistricts, setSuggestedDistricts] = useState<string[]>(initialData?.suggestedDistricts || []);
  const [customDistrict, setCustomDistrict] = useState('');

  // نوع الدفع وطريقة الدفع
  const [paymentType, setPaymentType] = useState(initialData?.paymentType || '');
  const [paymentMethod, setPaymentMethod] = useState(initialData?.paymentMethod || '');

  // الميزانية - حسب طريقة الدفع
  const [budgetMin, setBudgetMin] = useState<number | undefined>(initialData?.budgetMin);
  const [budgetMax, setBudgetMax] = useState<number | undefined>(initialData?.budgetMax);

  // المواصفات المطلوبة
  const [features, setFeatures] = useState<PropertyFeatures>({
    entrances: undefined,
    position: undefined,
    hasAnnex: false,
    bedrooms: 0,
    bathrooms: 0,
    storageRooms: 0,
    balconies: 0,
    curtains: 0,
    airConditioners: 0,
    parkingSpaces: 0,
    floors: 1,
    hasPool: false,
    hasPlayground: false,
    hasGarden: false,
    hasElevator: false,
    hasExternalMajlis: false,
    hasPrivateRoof: false,
    isFurnished: false,
    hasBuiltInKitchen: false,
    kitchenWithAppliances: false,
    kitchenAppliances: [],
    ...initialData?.features
  });

  // الضمانات
  const [guarantees, setGuarantees] = useState<Guarantee>({
    exists: false,
    type: '',
    duration: '',
    notes: '',
    ...initialData?.guarantees
  });

  // الوصف
  const [description, setDescription] = useState(initialData?.description || '');

  // حالات واجهة المستخدم
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPreview, setShowPreview] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  // تحديث الأحياء المتاحة عند تغيير المدينة
  useEffect(() => {
    if (city && neighborhoodsByCity[city]) {
      setAvailableDistricts(neighborhoodsByCity[city]);
    } else {
      setAvailableDistricts([]);
    }
    
    // إعادة تعيين الحي إذا كان غير متوفر
    if (city && district && neighborhoodsByCity[city] && !neighborhoodsByCity[city].includes(district)) {
      setDistrict('');
    }
  }, [city, district]);

  // اقتراح الأحياء المجاورة
  const suggestNearbyDistricts = useCallback(async () => {
    if (!city || !district) return;

    try {
      const response = await fetch(`/api/geo/nearby?city=${city}&district=${district}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestedDistricts(data.neighborhoods || []);
      } else {
        const cityDistricts = neighborhoodsByCity[city] || [];
        const nearby = cityDistricts.filter(d => d !== district).slice(0, 3);
        setSuggestedDistricts(nearby);
      }
    } catch (error) {
      console.error('Error fetching nearby districts:', error);
      const cityDistricts = neighborhoodsByCity[city] || [];
      const nearby = cityDistricts.filter(d => d !== district).slice(0, 3);
      setSuggestedDistricts(nearby);
    }
  }, [city, district]);

  // تشغيل اقتراح الأحياء عند تغيير المدينة والحي
  useEffect(() => {
    if (city && district) {
      suggestNearbyDistricts();
    }
  }, [city, district, suggestNearbyDistricts]);

  // تحديث المواصفات
  const updateFeatures = useCallback((key: keyof PropertyFeatures, value: any) => {
    setFeatures(prev => ({ ...prev, [key]: value }));
  }, []);

  // تحديث عدد الغرف
  const updateRoomCount = useCallback((key: keyof PropertyFeatures, increment: boolean) => {
    setFeatures(prev => ({
      ...prev,
      [key]: Math.max(0, (prev[key] as number || 0) + (increment ? 1 : -1))
    }));
  }, []);

  // إضافة حي مخصص
  const addCustomDistrict = useCallback(() => {
    if (customDistrict.trim() && !suggestedDistricts.includes(customDistrict.trim())) {
      setSuggestedDistricts(prev => [...prev, customDistrict.trim()]);
      setCustomDistrict('');
    }
  }, [customDistrict, suggestedDistricts]);

  // إزالة حي مقترح
  const removeSuggestedDistrict = useCallback((districtToRemove: string) => {
    setSuggestedDistricts(prev => prev.filter(d => d !== districtToRemove));
  }, []);

  // الحصول على تسمية الميزانية حسب طريقة الدفع
  const getBudgetLabel = useCallback(() => {
    switch (paymentMethod) {
      case 'دفعتان': return 'لكل دفعة (كل 6 أشهر)';
      case 'أربع دفعات': return 'لكل دفعة (كل 3 أشهر)';
      case 'شهري': return 'شهرياً';
      default: return 'للميزانية';
    }
  }, [paymentMethod]);

  // التحقق من صحة البيانات
  const validateForm = useCallback(() => {
    const newErrors: {[key: string]: string} = {};

    if (!contact.fullName.trim()) newErrors.fullName = 'الاسم مطلوب';
    if (!contact.nationalId?.trim()) newErrors.nationalId = 'رقم الهوية مطلوب';
    if (!propertyType) newErrors.propertyType = 'نوع العقار مطلوب';
    if (!city) newErrors.city = 'المدينة مطلوبة';
    if (!paymentType) newErrors.paymentType = 'نوع الدفع مطلوب';
    if (!paymentMethod) newErrors.paymentMethod = 'طريقة الدفع مطلوبة';
    if (!budgetMin || budgetMin <= 0) newErrors.budgetMin = 'الحد الأدنى للميزانية مطلوب';
    if (!budgetMax || budgetMax <= 0) newErrors.budgetMax = 'الحد الأقصى للميزانية مطلوب';
    if (budgetMin && budgetMax && budgetMin >= budgetMax) {
      newErrors.budget = 'الحد الأدنى يجب أن يكون أقل من الحد الأقصى';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [contact, propertyType, city, paymentType, paymentMethod, budgetMin, budgetMax]);

  // حفظ الطلب
  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const requestData: Partial<Request> = {
        contact,
        type: propertyType,
        city,
        district,
        suggestedDistricts,
        paymentType: paymentType as 'نقد' | 'تمويل',
        paymentMethod: paymentMethod as 'دفعتان' | 'أربع دفعات' | 'شهري',
        budgetMin,
        budgetMax,
        features,
        guarantees,
        description,
        requestType: 'rent'
      };

      await onSave(requestData);

    } catch (error) {
      console.error('Error saving rent request:', error);
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, contact, propertyType, city, district, suggestedDistricts, paymentType, paymentMethod, budgetMin, budgetMax, features, guarantees, description, onSave]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* البيانات الأساسية */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="text-lg font-bold text-[#01411C]">البيانات الأساسية</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#01411C] font-medium mb-2">
              الاسم الكامل *
            </label>
            <input
              type="text"
              value={contact.fullName}
              onChange={(e) => setContact(prev => ({ ...prev, fullName: e.target.value }))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="أدخل الاسم الكامل"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-[#01411C] font-medium mb-2">
              تاريخ الميلاد
            </label>
            <input
              type="date"
              value={contact.dob}
              onChange={(e) => setContact(prev => ({ ...prev, dob: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-[#01411C] font-medium mb-2">
              رقم الهوية *
            </label>
            <input
              type="text"
              value={contact.nationalId}
              onChange={(e) => setContact(prev => ({ ...prev, nationalId: e.target.value }))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] ${
                errors.nationalId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="رقم الهوية الوطنية"
            />
            {errors.nationalId && <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>}
          </div>

          <div>
            <label className="block text-[#01411C] font-medium mb-2">
              رقم الجوال
            </label>
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) => setContact(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
              placeholder="05xxxxxxxx"
            />
          </div>
        </div>
      </motion.div>

      {/* تفاصيل الطلب */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="text-lg font-bold text-[#01411C]">تفاصيل الطلب</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[#01411C] font-medium mb-2">
              نوع العقار *
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] ${
                errors.propertyType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">اختر نوع العقار المطلوب</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#01411C] font-medium mb-2">
                المدينة *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">اختر المدينة</option>
                {saudiCities.map(cityName => (
                  <option key={cityName} value={cityName}>{cityName}</option>
                ))}
              </select>
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-[#01411C] font-medium mb-2">
                الحي المفضل
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
                disabled={!city}
              >
                <option value="">اختر الحي (اختياري)</option>
                {availableDistricts.map(districtName => (
                  <option key={districtName} value={districtName}>{districtName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* الأحياء المقترحة */}
          {city && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[#01411C] font-medium">
                  أحياء أخرى مقبولة
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customDistrict}
                    onChange={(e) => setCustomDistrict(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                    placeholder="أضف حي"
                  />
                  <button
                    onClick={addCustomDistrict}
                    className="px-3 py-1 bg-[#D4AF37] text-[#01411C] rounded text-sm hover:bg-[#f1c40f] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {suggestedDistricts.map((suggestedDistrict, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-[#f0fdf4] text-[#01411C] border border-[#D4AF37]/30 rounded-full text-sm"
                  >
                    {suggestedDistrict}
                    <button
                      onClick={() => removeSuggestedDistrict(suggestedDistrict)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              
              {suggestedDistricts.length === 0 && (
                <p className="text-[#065f41] text-sm italic">
                  لم يتم تحديد أحياء إضافية
                </p>
              )}
            </div>
          )}

          {/* نوع الدفع وطريقة الدفع */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#01411C] font-medium mb-2">
                نوع الدفع *
              </label>
              <div className="space-y-2">
                {paymentTypes.map(type => (
                  <label key={type.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#D4AF37] cursor-pointer">
                    <input
                      type="radio"
                      name="paymentType"
                      value={type.value}
                      checked={paymentType === type.value}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="text-[#D4AF37] focus:ring-[#D4AF37]/20"
                    />
                    <div>
                      <div className="font-medium text-[#01411C]">{type.label}</div>
                      <div className="text-[#065f41] text-sm">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.paymentType && <p className="text-red-500 text-sm mt-1">{errors.paymentType}</p>}
            </div>

            <div>
              <label className="block text-[#01411C] font-medium mb-2">
                طريقة الدفع *
              </label>
              <div className="space-y-2">
                {paymentMethods.map(method => (
                  <label key={method.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#D4AF37] cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-[#D4AF37] focus:ring-[#D4AF37]/20"
                    />
                    <div>
                      <div className="font-medium text-[#01411C]">{method.label}</div>
                      <div className="text-[#065f41] text-sm">{method.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
            </div>
          </div>
        </div>
      </motion.div>

      {/* اقتراح السعر */}
      {city && propertyType && paymentMethod && (
        <PriceSuggest
          city={city}
          district={district}
          propertyType={propertyType}
          mode="rent"
          onPriceSelect={(price) => {
            // تعيين النطاق بناءً على السعر المقترح وطريقة الدفع
            let adjustedPrice = price;
            if (paymentMethod === 'دفعتان') {
              adjustedPrice = Math.round(price / 2);
            } else if (paymentMethod === 'أربع دفعات') {
              adjustedPrice = Math.round(price / 4);
            } else if (paymentMethod === 'شهري') {
              adjustedPrice = Math.round(price / 12);
            }
            
            setBudgetMin(Math.round(adjustedPrice * 0.8));
            setBudgetMax(Math.round(adjustedPrice * 1.2));
          }}
          className="animate-fade-in-scale"
        />
      )}

      {/* الميزانية */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="text-lg font-bold text-[#01411C]">الميزانية</h3>
        </div>

        {paymentMethod && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 text-sm font-medium">
                الميزانية {getBudgetLabel()}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#01411C] font-medium mb-2">
              الحد الأدنى (ريال سعودي) *
            </label>
            <input
              type="number"
              value={budgetMin || ''}
              onChange={(e) => setBudgetMin(e.target.value ? parseInt(e.target.value) : undefined)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] ${
                errors.budgetMin ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={`الحد الأدنى ${getBudgetLabel()}`}
              min="1"
            />
            {errors.budgetMin && <p className="text-red-500 text-sm mt-1">{errors.budgetMin}</p>}
          </div>

          <div>
            <label className="block text-[#01411C] font-medium mb-2">
              الحد الأقصى (ريال سعودي) *
            </label>
            <input
              type="number"
              value={budgetMax || ''}
              onChange={(e) => setBudgetMax(e.target.value ? parseInt(e.target.value) : undefined)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] ${
                errors.budgetMax ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={`الحد الأقصى ${getBudgetLabel()}`}
              min="1"
            />
            {errors.budgetMax && <p className="text-red-500 text-sm mt-1">{errors.budgetMax}</p>}
          </div>
        </div>

        {errors.budget && <p className="text-red-500 text-sm mt-2">{errors.budget}</p>}

        {budgetMin && budgetMax && paymentMethod && (
          <div className="mt-4 p-3 bg-[#f0fdf4] border border-[#D4AF37]/30 rounded-lg">
            <p className="text-[#065f41] text-sm">
              <strong>نطاق الميزانية {getBudgetLabel()}:</strong> {new Intl.NumberFormat('ar-SA').format(budgetMin)} - {new Intl.NumberFormat('ar-SA').format(budgetMax)} ريال سعودي
            </p>
            {paymentMethod !== 'شهري' && (
              <p className="text-[#065f41] text-xs mt-1">
                * المبلغ السنوي التقريبي: {new Intl.NumberFormat('ar-SA').format(
                  paymentMethod === 'دفعتان' ? (budgetMin! + budgetMax!) : (budgetMin! + budgetMax!) * 2
                )} - {new Intl.NumberFormat('ar-SA').format(
                  paymentMethod === 'دفعتان' ? (budgetMin! + budgetMax!) * 2 : (budgetMin! + budgetMax!) * 2
                )} ريال
              </p>
            )}
          </div>
        )}
      </motion.div>

      {/* المواصفات المطلوبة (نفس نموذج الشراء) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🏠</span>
          <h3 className="text-lg font-bold text-[#01411C]">المواصفات المطلوبة</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* عدد غرف النوم */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-[#01411C] font-medium">غرف النوم</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateRoomCount('bedrooms', false)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold">{features.bedrooms || 0}</span>
              <button
                onClick={() => updateRoomCount('bedrooms', true)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* عدد دورات المياه */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-[#01411C] font-medium">دورات المياه</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateRoomCount('bathrooms', false)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold">{features.bathrooms || 0}</span>
              <button
                onClick={() => updateRoomCount('bathrooms', true)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* مواقف السيارات */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-[#01411C] font-medium">مواقف السيارات</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateRoomCount('parkingSpaces', false)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold">{features.parkingSpaces || 0}</span>
              <button
                onClick={() => updateRoomCount('parkingSpaces', true)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* الخيارات الإضافية */}
        <div className="mt-6 space-y-3">
          <h4 className="font-semibold text-[#01411C]">مميزات مرغوبة:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { key: 'hasPool', label: 'مسبح' },
              { key: 'hasGarden', label: 'حديقة' },
              { key: 'hasElevator', label: 'مصعد' },
              { key: 'hasExternalMajlis', label: 'مجلس خارجي' },
              { key: 'hasPrivateRoof', label: 'سطح خاص' },
              { key: 'isFurnished', label: 'مؤثث' }
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg hover:border-[#D4AF37] cursor-pointer">
                <input
                  type="checkbox"
                  checked={features[key as keyof PropertyFeatures] as boolean || false}
                  onChange={(e) => updateFeatures(key as keyof PropertyFeatures, e.target.checked)}
                  className="text-[#D4AF37] focus:ring-[#D4AF37]/20"
                />
                <span className="text-[#01411C]">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </motion.div>

      {/* الوصف */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#D4AF37]" />
            <h3 className="text-lg font-bold text-[#01411C]">وصف الطلب</h3>
          </div>
          
          {city && propertyType && (
            <AIDescription
              mode="rent-request"
              city={city}
              district={district}
              propertyType={propertyType}
              features={features}
              price={budgetMax}
              currentDescription={description}
              onDescriptionSelect={setDescription}
            />
          )}
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] min-h-[120px] resize-y"
          placeholder="اكتب وصف مفصل لما تبحث عنه أو استخدم الذكاء الاصطناعي"
        />
      </motion.div>

      {/* الأزرار */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4 justify-end"
      >
        <button
          onClick={onCancel}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          إلغاء
        </button>
        
        <button
          onClick={() => setShowPreview(true)}
          className="flex items-center gap-2 px-6 py-3 border-2 border-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
        >
          <Eye className="w-4 h-4" />
          معاينة
        </button>

        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-[#01411C] text-white rounded-lg hover:bg-[#065f41] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              حفظ الطلب
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}