import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { MapPicker } from "./MapPicker";
import { PriceSuggest } from "./PriceSuggest";
import { AIDescription } from "./AIDescription";
import { RegistrationData, Address, PropertyFeatures, Offer, Guarantee } from "../../types/owners";
import { 
  Save, 
  Eye, 
  MapPin, 
  Home, 
  FileText, 
  Upload,
  Plus,
  Minus,
  CheckCircle2,
  X,
  DollarSign,
  Info
} from "lucide-react";

interface RentOfferFormProps {
  user?: RegistrationData;
  onSave: (offer: Partial<Offer>) => void;
  onCancel: () => void;
  initialData?: Partial<Offer>;
}

const propertyTypes = [
  'شقة', 'فيلا', 'أرض', 'دبلكس', 'تجاري', 'استراحة', 'مزرعة', 'مخزن', 'مكتب'
];

const kitchenAppliances = [
  'ثلاجة', 'غسالة', 'غسالة أطباق', 'فرن', 'مكروويف', 'خلاط', 'محضرة طعام', 
  'صانعة قهوة', 'غلاية كهربائية', 'محمصة'
];

export function RentOfferForm({ user, onSave, onCancel, initialData }: RentOfferFormProps) {
  // بيانات أساسية
  const [contact, setContact] = useState<RegistrationData>({
    fullName: user?.fullName || '',
    dob: user?.dob || '',
    nationalId: user?.nationalId || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });

  // تفاصيل العقار
  const [title, setTitle] = useState(initialData?.title || '');
  const [propertyType, setPropertyType] = useState(initialData?.type || '');
  const [area, setArea] = useState<number | undefined>(initialData?.areaM2);

  // الموقع الجغرافي المفصل
  const [address, setAddress] = useState<Address>(initialData?.address || {});
  const [detailedAddress, setDetailedAddress] = useState({
    city: initialData?.address?.city || '',
    district: initialData?.address?.district || '',
    street: initialData?.address?.street || '',
    postalCode: initialData?.address?.postalCode || '',
    building: initialData?.address?.building || initialData?.address?.buildingNumber || '',
    buildingNumber: initialData?.address?.buildingNumber || initialData?.address?.building || '',
    additionalNumber: initialData?.address?.additionalNumber || ''
  });
  const [showMapPicker, setShowMapPicker] = useState(false);

  // المواصفات التفصيلية
  const [features, setFeatures] = useState<PropertyFeatures>({
    entrances: 'مدخل واحد',
    position: 'بطن',
    level: 'أرضي',
    hasAnnex: false,
    hasMaidRoom: false,
    hasLaundryRoom: false,
    hasJacuzzi: false,
    hasRainShower: false,
    isSmartHome: false,
    hasSmartEntry: false,
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

  // الوثائق
  const [deedNumber, setDeedNumber] = useState(initialData?.deedNumber || '');
  const [deedDate, setDeedDate] = useState(initialData?.deedDate || '');

  // الأسعار للإيجار
  const [basePrice, setBasePrice] = useState<number | undefined>(initialData?.pricePlan?.rentSingle);
  const [rentTwo, setRentTwo] = useState<number | undefined>(initialData?.pricePlan?.rentTwo);
  const [rentFour, setRentFour] = useState<number | undefined>(initialData?.pricePlan?.rentFour);
  const [monthly, setMonthly] = useState<number | undefined>(initialData?.pricePlan?.monthly);

  // الوصف
  const [description, setDescription] = useState(initialData?.description || '');

  // الملفات  
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [documents, setDocuments] = useState<string[]>(initialData?.documents || []);

  // حالات واجهة المستخدم
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPreview, setShowPreview] = useState(false);

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

  // إضافة/إزالة الأجهزة
  const toggleAppliance = useCallback((appliance: string) => {
    setFeatures(prev => ({
      ...prev,
      kitchenAppliances: prev.kitchenAppliances?.includes(appliance)
        ? prev.kitchenAppliances.filter(a => a !== appliance)
        : [...(prev.kitchenAppliances || []), appliance]
    }));
  }, []);

  // حساب الأسعار الأخرى تلقائياً بناءً على السعر الأساسي
  const calculatePrices = useCallback((baseAmount: number) => {
    if (!baseAmount) return;
    
    // نسبة الفائدة للمنصة حسب طريقة الدفع
    const twoPaymentRate = 1.05; // 5% فائدة للدفعتين
    const fourPaymentRate = 1.08; // 8% فائدة لأربع دفعات  
    const monthlyRate = 1.12; // 12% فائدة للدفع الشهري

    setRentTwo(Math.round((baseAmount * twoPaymentRate) / 2));
    setRentFour(Math.round((baseAmount * fourPaymentRate) / 4));
    setMonthly(Math.round((baseAmount * monthlyRate) / 12));
  }, []);

  // التحقق من صحة البيانات
  const validateForm = useCallback(() => {
    const newErrors: {[key: string]: string} = {};

    if (!contact.fullName.trim()) newErrors.fullName = 'الاسم مطلوب';
    if (!contact.nationalId?.trim()) newErrors.nationalId = 'رقم الهوية مطلوب';
    if (!title.trim()) newErrors.title = 'عنوان العقار مطلوب';
    if (!propertyType) newErrors.propertyType = 'نوع العقار مطلوب';
    if (!area || area <= 0) newErrors.area = 'مساحة العقار مطلوبة';
    
    // التحقق من الموقع (يدوي أو خريطة)
    if (!detailedAddress.city.trim() && !address.city) {
      newErrors.address = 'المدينة مطلوبة';
    }
    if (!detailedAddress.district.trim() && !address.district) {
      newErrors.address = 'الحي مطلوب';
    }
    
    if (!deedNumber.trim()) newErrors.deedNumber = 'رقم الصك مطلوب';
    if (!deedDate) newErrors.deedDate = 'تاريخ الصك مطلوب';
    if (!basePrice || basePrice <= 0) newErrors.basePrice = 'السعر الأساسي مطلوب';

    // التحقق من الأجهزة إذا تم تحديد مطبخ بالأجهزة
    if (features.kitchenWithAppliances && (!features.kitchenAppliances || features.kitchenAppliances.length === 0)) {
      newErrors.kitchenAppliances = 'يجب تحديد الأجهزة المتوفرة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [contact, title, propertyType, area, address, detailedAddress, deedNumber, deedDate, basePrice, features]);

  // حفظ العرض
  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      // دمج العنوان التفصيلي مع عنوان الخريطة
      const finalAddress = {
        ...address,
        city: detailedAddress.city || address.city,
        district: detailedAddress.district || address.district,
        street: detailedAddress.street || address.street,
        postalCode: detailedAddress.postalCode || address.postalCode,
        building: detailedAddress.building || address.building,
        additionalNumber: detailedAddress.additionalNumber || address.additionalNumber
      };

      const offerData: Partial<Offer> = {
        contact,
        title,
        type: propertyType,
        areaM2: area,
        address: finalAddress,
        features,
        guarantees,
        deedNumber,
        deedDate,
        pricePlan: {
          rentSingle: basePrice,
          rentTwo,
          rentFour,
          monthly,
          currency: 'SAR'
        },
        description: description.startsWith('للإيجار:') ? description : `للإيجار: ${description}`,
        images,
        documents,
        offerType: 'rent'
      };

      await onSave(offerData);

    } catch (error) {
      console.error('Error saving rent offer:', error);
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, contact, title, propertyType, area, address, detailedAddress, features, guarantees, deedNumber, deedDate, basePrice, rentTwo, rentFour, monthly, description, images, documents, onSave]);

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

      {/* تفاصيل العقار */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <Home className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="text-lg font-bold text-[#01411C]">تفاصيل العقار</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[#01411C] font-medium mb-2">
              عنوان العقار *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="أدخل عنوان العقار"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="">اختر نوع العقار</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
            </div>

            <div>
              <label className="block text-[#01411C] font-medium mb-2">
                مساحة العقار (م²) *
              </label>
              <input
                type="number"
                value={area || ''}
                onChange={(e) => setArea(e.target.value ? parseInt(e.target.value) : undefined)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] ${
                  errors.area ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="المساحة بالمتر المربع"
                min="1"
              />
              {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
            </div>
          </div>
        </div>
      </motion.div>

      {/* المواصفات التفصيلية - نفس نموذج البيع */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🏗️</span>
          <h3 className="text-lg font-bold text-[#01411C]">المواصفات التفصيلية</h3>
        </div>

        <div className="space-y-6">
          {/* خيارات المدخل والموقع */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#01411C] font-medium mb-2">نوع المدخل</label>
              <select
                value={features.entrances}
                onChange={(e) => updateFeatures('entrances', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
              >
                <option value="مدخل واحد">مدخل واحد</option>
                <option value="مدخلين">مدخلين</option>
              </select>
            </div>

            <div>
              <label className="block text-[#01411C] font-medium mb-2">موقع العقار</label>
              <select
                value={features.position}
                onChange={(e) => updateFeatures('position', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
              >
                <option value="زاوية">زاوية</option>
                <option value="بطن">بطن</option>
              </select>
            </div>

            <div>
              <label className="block text-[#01411C] font-medium mb-2">مستوى العقار</label>
              <select
                value={features.level}
                onChange={(e) => updateFeatures('level', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
              >
                <option value="أرضي">أرضي</option>
                <option value="علوي">علوي</option>
              </select>
            </div>
          </div>

          {/* الغرف والمرافق */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* غرف النوم */}
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
              <span className="text-sm text-[#01411C] mb-2">غرف النوم</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateRoomCount('bedrooms', false)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold text-[#01411C]">{features.bedrooms}</span>
                <button
                  type="button"
                  onClick={() => updateRoomCount('bedrooms', true)}
                  className="w-8 h-8 flex items-center justify-center bg-[#D4AF37] hover:bg-[#f1c40f] rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#01411C]" />
                </button>
              </div>
            </div>

            {/* دورات المياه */}
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
              <span className="text-sm text-[#01411C] mb-2">دورات المياه</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateRoomCount('bathrooms', false)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold text-[#01411C]">{features.bathrooms}</span>
                <button
                  type="button"
                  onClick={() => updateRoomCount('bathrooms', true)}
                  className="w-8 h-8 flex items-center justify-center bg-[#D4AF37] hover:bg-[#f1c40f] rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#01411C]" />
                </button>
              </div>
            </div>

            {/* مستودعات */}
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
              <span className="text-sm text-[#01411C] mb-2">مستودعات</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateRoomCount('storageRooms', false)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold text-[#01411C]">{features.storageRooms}</span>
                <button
                  type="button"
                  onClick={() => updateRoomCount('storageRooms', true)}
                  className="w-8 h-8 flex items-center justify-center bg-[#D4AF37] hover:bg-[#f1c40f] rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#01411C]" />
                </button>
              </div>
            </div>

            {/* بلكونات */}
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
              <span className="text-sm text-[#01411C] mb-2">بلكونات</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateRoomCount('balconies', false)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold text-[#01411C]">{features.balconies}</span>
                <button
                  type="button"
                  onClick={() => updateRoomCount('balconies', true)}
                  className="w-8 h-8 flex items-center justify-center bg-[#D4AF37] hover:bg-[#f1c40f] rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#01411C]" />
                </button>
              </div>
            </div>

            {/* ستائر */}
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
              <span className="text-sm text-[#01411C] mb-2">ستائر</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateRoomCount('curtains', false)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold text-[#01411C]">{features.curtains}</span>
                <button
                  type="button"
                  onClick={() => updateRoomCount('curtains', true)}
                  className="w-8 h-8 flex items-center justify-center bg-[#D4AF37] hover:bg-[#f1c40f] rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#01411C]" />
                </button>
              </div>
            </div>

            {/* مكيفات */}
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
              <span className="text-sm text-[#01411C] mb-2">مكيفات</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateRoomCount('airConditioners', false)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold text-[#01411C]">{features.airConditioners}</span>
                <button
                  type="button"
                  onClick={() => updateRoomCount('airConditioners', true)}
                  className="w-8 h-8 flex items-center justify-center bg-[#D4AF37] hover:bg-[#f1c40f] rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#01411C]" />
                </button>
              </div>
            </div>

            {/* موقف خاص */}
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
              <span className="text-sm text-[#01411C] mb-2">موقف خاص</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateRoomCount('parkingSpaces', false)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold text-[#01411C]">{features.parkingSpaces}</span>
                <button
                  type="button"
                  onClick={() => updateRoomCount('parkingSpaces', true)}
                  className="w-8 h-8 flex items-center justify-center bg-[#D4AF37] hover:bg-[#f1c40f] rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#01411C]" />
                </button>
              </div>
            </div>

            {/* الأدوار */}
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
              <span className="text-sm text-[#01411C] mb-2">الأدوار</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateRoomCount('floors', false)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold text-[#01411C]">{features.floors}</span>
                <button
                  type="button"
                  onClick={() => updateRoomCount('floors', true)}
                  className="w-8 h-8 flex items-center justify-center bg-[#D4AF37] hover:bg-[#f1c40f] rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#01411C]" />
                </button>
              </div>
            </div>
          </div>

          {/* خيارات إضافية */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'hasAnnex', label: 'ملحق' },
              { key: 'hasMaidRoom', label: 'غرفة خادمة' },
              { key: 'hasLaundryRoom', label: 'غرفة غسيل' },
              { key: 'hasJacuzzi', label: 'جاكوزي' },
              { key: 'hasRainShower', label: 'دش مطري' },
              { key: 'isSmartHome', label: 'سمارت هوم' },
              { key: 'hasSmartEntry', label: 'دخول ذكي' },
              { key: 'hasPool', label: 'مسبح' },
              { key: 'hasGarden', label: 'حديقة' },
              { key: 'hasElevator', label: 'مصعد' },
              { key: 'hasExternalMajlis', label: 'مجلس خارجي' },
              { key: 'hasPrivateRoof', label: 'سطح خاص' },
              { key: 'isFurnished', label: 'مؤثث' },
              { key: 'hasBuiltInKitchen', label: 'مطبخ راكب' }
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={features[key as keyof PropertyFeatures] as boolean}
                  onChange={(e) => updateFeatures(key as keyof PropertyFeatures, e.target.checked)}
                  className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
                />
                <span className="text-[#01411C]">{label}</span>
              </label>
            ))}
          </div>

          {/* مطبخ بالأجهزة */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={features.kitchenWithAppliances}
                onChange={(e) => updateFeatures('kitchenWithAppliances', e.target.checked)}
                className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
              />
              <span className="text-[#01411C] font-medium">مطبخ بالأجهزة</span>
            </label>

            {features.kitchenWithAppliances && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-[#01411C] font-medium mb-3">اختر الأجهزة المتوفرة:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {kitchenAppliances.map(appliance => (
                    <label key={appliance} className="flex items-center gap-2 p-2 bg-white rounded border cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={features.kitchenAppliances?.includes(appliance) || false}
                        onChange={() => toggleAppliance(appliance)}
                        className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
                      />
                      <span className="text-sm text-[#01411C]">{appliance}</span>
                    </label>
                  ))}
                </div>
                {errors.kitchenAppliances && (
                  <p className="text-red-500 text-sm mt-2">{errors.kitchenAppliances}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* الموقع الجغرافي */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-[#D4AF37]" />
            <h3 className="text-lg font-bold text-[#01411C]">الموقع الجغرافي</h3>
          </div>
          <button
            onClick={() => setShowMapPicker(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#f1c40f] transition-colors"
          >
            <MapPin className="w-4 h-4" />
            اختيار على الخريطة
          </button>
        </div>

        {/* إدخال يدوي للعنوان */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[#01411C] font-medium mb-2">المدينة *</label>
            <input
              type="text"
              value={detailedAddress.city}
              onChange={(e) => setDetailedAddress(prev => ({ ...prev, city: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
              placeholder="أدخل المدينة"
            />
          </div>
          
          <div>
            <label className="block text-[#01411C] font-medium mb-2">الحي *</label>
            <input
              type="text"
              value={detailedAddress.district}
              onChange={(e) => setDetailedAddress(prev => ({ ...prev, district: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
              placeholder="أدخل الحي"
            />
          </div>
          
          <div>
            <label className="block text-[#01411C] font-medium mb-2">الشارع</label>
            <input
              type="text"
              value={detailedAddress.street}
              onChange={(e) => setDetailedAddress(prev => ({ ...prev, street: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
              placeholder="أدخل الشارع"
            />
          </div>
          
          <div>
            <label className="block text-[#01411C] font-medium mb-2">الرمز البريدي</label>
            <input
              type="text"
              value={detailedAddress.postalCode}
              onChange={(e) => setDetailedAddress(prev => ({ ...prev, postalCode: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
              placeholder="12345"
            />
          </div>
          
          <div>
            <label className="block text-[#01411C] font-medium mb-2">المبنى</label>
            <input
              type="text"
              value={detailedAddress.building}
              onChange={(e) => setDetailedAddress(prev => ({ ...prev, building: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
              placeholder="رقم المبنى"
            />
          </div>
          
          <div>
            <label className="block text-[#01411C] font-medium mb-2">الرقم الإضافي</label>
            <input
              type="text"
              value={detailedAddress.additionalNumber}
              onChange={(e) => setDetailedAddress(prev => ({ ...prev, additionalNumber: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
              placeholder="الرقم الإضافي"
            />
          </div>
        </div>

        {/* عرض الموقع المحدد من الخريطة */}
        {address.formattedAddress && (
          <div className="bg-[#f0fdf4] border border-[#D4AF37]/30 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-[#01411C] mb-2">الموقع المحدد من الخريطة:</h4>
                <p className="text-[#065f41] text-sm">{address.formattedAddress}</p>
              </div>
            </div>
          </div>
        )}
        
        {errors.address && <p className="text-red-500 text-sm mt-2">{errors.address}</p>}
      </motion.div>

      {/* الصك والوثائق */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="text-lg font-bold text-[#01411C]">الصك والوثائق</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#01411C] font-medium mb-2">رقم الصك *</label>
            <input
              type="text"
              value={deedNumber}
              onChange={(e) => setDeedNumber(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] ${
                errors.deedNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="أدخل رقم الصك"
            />
            {errors.deedNumber && <p className="text-red-500 text-sm mt-1">{errors.deedNumber}</p>}
          </div>

          <div>
            <label className="block text-[#01411C] font-medium mb-2">تاريخ الصك *</label>
            <input
              type="date"
              value={deedDate}
              onChange={(e) => setDeedDate(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] ${
                errors.deedDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.deedDate && <p className="text-red-500 text-sm mt-1">{errors.deedDate}</p>}
          </div>
        </div>
      </motion.div>

      {/* الضمانات */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🛡️</span>
          <h3 className="text-lg font-bold text-[#01411C]">الضمانات</h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={guarantees.exists}
              onChange={(e) => setGuarantees(prev => ({ ...prev, exists: e.target.checked }))}
              className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
            />
            <span className="text-[#01411C] font-medium">يوجد ضمانات</span>
          </label>

          {guarantees.exists && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-[#01411C] font-medium mb-2">نوع الضمان</label>
                <select
                  value={guarantees.type}
                  onChange={(e) => setGuarantees(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
                >
                  <option value="">اختر نوع الضمان</option>
                  <option value="ضمان كهرباء">ضمان كهرباء</option>
                  <option value="ضمان سباكة">ضمان سباكة</option>
                  <option value="ضمان مكيفات">ضمان مكيفات</option>
                  <option value="ضمان عام">ضمان عام</option>
                </select>
              </div>

              <div>
                <label className="block text-[#01411C] font-medium mb-2">مدة الضمان</label>
                <select
                  value={guarantees.duration}
                  onChange={(e) => setGuarantees(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
                >
                  <option value="">اختر المدة</option>
                  <option value="سنة واحدة">سنة واحدة</option>
                  <option value="سنتان">سنتان</option>
                  <option value="ثلاث سنوات">ثلاث سنوات</option>
                  <option value="خمس سنوات">خمس سنوات</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[#01411C] font-medium mb-2">ملاحظات الضمان</label>
                <textarea
                  value={guarantees.notes}
                  onChange={(e) => setGuarantees(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] h-20 resize-y"
                  placeholder="أدخل تفاصيل إضافية حول الضمان"
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* اقتراح السعر من المؤشرات العقارية */}
      {(detailedAddress.city || address.city) && propertyType && area && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.37 }}
        >
          <PriceSuggest
            city={detailedAddress.city || address.city}
            district={detailedAddress.district || address.district}
            propertyType={propertyType}
            area={area}
            features={features}
            mode="rent"
            onPriceSelect={(price) => {
              setBasePrice(price);
              calculatePrices(price);
            }}
            className="animate-fade-in-scale"
          />
        </motion.div>
      )}

      {/* السعر للدفعة مع النظام الائتماني */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="text-lg font-bold text-[#01411C]">السعر للدفعة</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[#01411C] font-medium mb-2">
              السعر الأساسي (سنوي) *
            </label>
            <input
              type="number"
              value={basePrice || ''}
              onChange={(e) => {
                const price = e.target.value ? parseInt(e.target.value) : undefined;
                setBasePrice(price);
                if (price) calculatePrices(price);
              }}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] ${
                errors.basePrice ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="أدخل السعر الأساسي السنوي"
              min="1"
            />
            {errors.basePrice && <p className="text-red-500 text-sm mt-1">{errors.basePrice}</p>}
          </div>

          {basePrice && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-[#01411C] font-medium mb-2">دفعتان</label>
                <div className="text-lg font-bold text-[#01411C]">
                  {new Intl.NumberFormat('ar-SA').format(rentTwo || 0)} ريال
                </div>
                <p className="text-xs text-[#065f41] mt-1">كل دفعة (5% فائدة سنوية)</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-[#01411C] font-medium mb-2">أربع دفعات</label>
                <div className="text-lg font-bold text-[#01411C]">
                  {new Intl.NumberFormat('ar-SA').format(rentFour || 0)} ريال
                </div>
                <p className="text-xs text-[#065f41] mt-1">كل دفعة (8% فائدة سنوية)</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-[#01411C] font-medium mb-2">شهري</label>
                <div className="text-lg font-bold text-[#01411C]">
                  {new Intl.NumberFormat('ar-SA').format(monthly || 0)} ريال
                </div>
                <p className="text-xs text-[#065f41] mt-1">كل شهر (12% فائدة سنوية)</p>
              </div>
            </div>
          )}

          {/* شرح النظام */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-blue-800 text-sm">
                <p className="font-semibold mb-2">💡 ضمن حقك، والباقي علينا</p>
                <p className="mb-2">
                  سيتم زيادة مبلغ الفائدة بالشهر على المستأجر، وتدفع المنصة للمالك دفعة أو دفعتين مباشرة بعد عقد الإيجار بالباطن، والتحصيل بالدفع الشهري بين المنصة والمستأجر.
                </p>
                <ul className="text-xs space-y-1">
                  <li>• الدفعتان: فائدة 5% سنوياً</li>
                  <li>• أربع دفعات: فائدة 8% سنوياً</li>
                  <li>• الدفع الشهري: فائدة 12% سنوياً</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* الوصف (يدوي أو الذكاء الاصطناعي) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#D4AF37]" />
            <h3 className="text-lg font-bold text-[#01411C]">الوصف (يدوي أو الذكاء الاصطناعي)</h3>
          </div>
          
          {(detailedAddress.city || address.city) && propertyType && (
            <AIDescription
              mode="rent"
              city={detailedAddress.city || address.city}
              district={detailedAddress.district || address.district}
              propertyType={propertyType}
              features={features}
              price={basePrice}
              area={area}
              currentDescription={description}
              onDescriptionSelect={(desc) => {
                // إضافة "للإيجار:" في البداية إذا لم تكن موجودة
                const finalDesc = desc.startsWith('للإيجار:') ? desc : `للإيجار: ${desc}`;
                setDescription(finalDesc);
              }}
            />
          )}
        </div>

        <div className="space-y-2">
          <textarea
            value={description}
            onChange={(e) => {
              let value = e.target.value;
              // التأكد من وجود "للإيجار:" في البداية
              if (value && !value.startsWith('للإيجار:')) {
                value = `للإيجار: ${value}`;
              }
              setDescription(value);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] min-h-[120px] resize-y"
            placeholder="للإيجار: أدخل وصف العقار أو استخدم الذكاء الاصطناعي لتوليد الوصف"
          />
          <p className="text-xs text-[#065f41]">
            💡 سيبدأ الوصف تلقائياً بـ "للإيجار:" - يمكنك استخدام الذكاء الاصطناعي لتوليد وصف شامل
          </p>
        </div>
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
              حفظ العرض
            </>
          )}
        </button>
      </motion.div>

      {/* Map Picker Modal */}
      <MapPicker
        isOpen={showMapPicker}
        address={address}
        onAddressSelect={setAddress}
        onClose={() => setShowMapPicker(false)}
      />
    </div>
  );
}