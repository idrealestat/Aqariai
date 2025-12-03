import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { RegistrationData, PropertyForm, PropertyType, PaymentOptions, PaymentOptionType } from "../../types/crm";
import { getMarketRange, analyzePriceStatus, generateAIDescription, saveProperty } from "../../api/mockApi";
import { Home, MapPin, Building, DollarSign, FileText, Wand2, Calculator, ArrowLeft, Save, AlertCircle, CheckCircle, Info, Star, Crown, Check, Phone, Mail, Calendar, CreditCard } from "lucide-react";

/**
 Props:
 - registration: بيانات المستخدم المسجل
 - mode: "property" | "requirements"
 - onSave: callback عند الحفظ
 - onBack: العودة للصفحة السابقة
*/

interface Props {
  registration: RegistrationData;
  mode: "property" | "requirements";
  onSave: (form: PropertyForm) => Promise<void>;
  onBack?: () => void;
}

const PROPERTY_TYPES = [
  { value: "apartment", label: "شقة", icon: "🏠" },
  { value: "villa", label: "فيلا", icon: "🏘️" },
  { value: "land", label: "أرض", icon: "🏞️" },
  { value: "duplex", label: "دبلكس", icon: "🏡" },
  { value: "triplex", label: "تربلكس", icon: "🏠" },
  { value: "shop", label: "محل تجاري", icon: "🏪" },
  { value: "hotel", label: "فندق", icon: "🏨" },
  { value: "other", label: "أخرى", icon: "🏗️" }
];

const FEATURES_CONFIG = [
  { key: "pool", label: "مسبح", icon: "🏊‍♂️", type: "boolean" },
  { key: "frontYard", label: "فناء أمامي", icon: "🌿", type: "boolean" },
  { key: "backYard", label: "فناء خلفي", icon: "🌳", type: "boolean" },
  { key: "balconies", label: "بلكونات", icon: "🪟", type: "number" },
  { key: "storages", label: "مستودعات", icon: "📦", type: "number" },
  { key: "privateEntrance", label: "مداخل خاصة", icon: "🚪", type: "number" },
  { key: "apartmentsCount", label: "عدد الشقق", icon: "🏠", type: "number" },
  { key: "playground", label: "ملعب أطفال", icon: "🛝", type: "boolean" },
  { key: "externalMajlis", label: "مجلس خارجي", icon: "🪑", type: "boolean" },
  { key: "annex", label: "ملحق", icon: "🏘️", type: "boolean" },
  { key: "internalGarden", label: "حديقة داخلية", icon: "🌺", type: "boolean" },
  { key: "fountain", label: "نافورة", icon: "⛲", type: "boolean" },
  { key: "modernDesign", label: "تصميم حديث", icon: "✨", type: "boolean" },
  { key: "elevator", label: "مصعد", icon: "🛗", type: "boolean" },
  { key: "twoEntrances", label: "مدخلين", icon: "🚪", type: "boolean" },
  { key: "openKitchen", label: "مطبخ مفتوح", icon: "🍳", type: "boolean" },
  { key: "closedKitchen", label: "مطبخ مغلق", icon: "🥘", type: "boolean" },
  { key: "dirtyKitchen", label: "مطبخ تحضير", icon: "🍽️", type: "boolean" },
  { key: "furnished", label: "مفروش", icon: "🛋️", type: "boolean" },
  { key: "fittedKitchen", label: "مطبخ راكب", icon: "🏠", type: "boolean" },
  { key: "appliancesIncluded", label: "أجهزة مدمجة", icon: "📱", type: "boolean" },
  { key: "curtains", label: "ستائر", icon: "🪟", type: "boolean" }
];

const PAYMENT_OPTIONS = [
  { key: "single", label: "دفعة واحدة", icon: "💳" },
  { key: "two", label: "دفعتين", icon: "💰" },
  { key: "four", label: "أربع دفعات", icon: "📊" },
  { key: "monthly", label: "شهري", icon: "📅" },
  { key: "monthly_rais", label: "شهري - رايز", icon: "🏦" },
  { key: "monthly_tajir", label: "شهري - تأجير", icon: "🏢" }
];

const SAUDI_CITIES = [
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الظهران",
  "تبوك", "بريدة", "خميس مشيط", "حفر الباطن", "الطائف", "الجبيل", "نجران",
  "ينبع", "الأحساء", "القطيف", "عرعر", "سكاكا", "أبها", "جازان", "الباحة",
  "عنيزة", "الرس", "القريات", "طريف", "رفحاء", "الدوادمي", "الأفلاج",
  "وادي الدواسر", "الزلفي", "المجمعة", "شقراء", "القويعية", "الخرج"
];

const CITY_DISTRICTS: Record<string, string[]> = {
  "الرياض": [
    "العليا", "الملز", "الياسمين", "الورود", "النرجس", "الصحافة", "الروابي", "الوادي", 
    "الشفا", "المعذر", "الملقا", "النخيل", "الرحمانية", "العارض", "المروج", "المونسية",
    "الغدير", "الأندلس", "المحمدية", "الفيصلية", "العقيق", "الدرعية", "الدريهمية",
    "السليمانية", "البديعة", "الشميسي", "القدس", "الخليج", "السفارات", "الربوة"
  ],
  "جدة": [
    "الشاطئ", "الصفا", "الأندلس", "المرجان", "الروضة", "السلامة", "البلد", "الحمراء",
    "الفيصلية", "النزهة", "الثغر", "الصالحية", "الرويس", "الكندرة", "البساتين",
    "الفيحاء", "المحمدية", "الحرازات", "النعيم", "السامر", "العزيزية", "الزهراء"
  ],
  "الدمام": [
    "النخيل", "الضباب", "الفيصلية", "الشاطئ", "المنار", "الجوهرة", "الواحة",
    "الشاطئ الغربي", "الشاطئ الشرقي", "الأحساء", "العدامة", "المريكبات",
    "النور", "السيف", "الخضرية", "المنتزه", "الروابي", "الربيع", "الندى"
  ],
  "الخبر": [
    "الراكة", "الحمراء", "العقربية", "الخالدية", "اليرموك", "الثقبة",
    "الكورنيش", "العليا", "الهضبة", "البندرية", "الشروق", "الشاطئ"
  ]
};

export default function PropertyEditor({ registration, mode, onSave, onBack }: Props) {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState(registration.city || "");
  const [district, setDistrict] = useState(registration.district || "");
  const [propertyType, setPropertyType] = useState<PropertyType>("apartment");
  const [deedNumber, setDeedNumber] = useState("");
  const [deedDate, setDeedDate] = useState("");
  const [commission, setCommission] = useState<number>(2);
  const [rooms, setRooms] = useState<number>(3);
  const [floors, setFloors] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [kitchens, setKitchens] = useState<number>(1);
  const [majlis, setMajlis] = useState<number>(1);
  const [livingRooms, setLivingRooms] = useState<number>(1);
  const [area, setArea] = useState<number>(120);
  const [price, setPrice] = useState<number>(450000);
  const [marketRange, setMarketRange] = useState<any>(null);
  const [priceStatus, setPriceStatus] = useState<string>("");
  const [guarantees, setGuarantees] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionMode, setDescriptionMode] = useState<"manual" | "ai">("manual");
  const [features, setFeatures] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [loadingMarket, setLoadingMarket] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  // Payment options
  const [paymentOption, setPaymentOption] = useState<PaymentOptionType | null>(null);
  const [splits, setSplits] = useState<number[]>([]);

  useEffect(() => {
    // جلب نطاق السوق عند تحديد المدينة/الحي/نوع العقار
    if (city && district) {
      const timeoutId = setTimeout(() => {
        fetchMarketData();
      }, 300); // تأخير لتجنب الطلبات المتتالية
      return () => clearTimeout(timeoutId);
    }
  }, [city, district, propertyType]);

  useEffect(() => {
    // تحليل حالة السعر عند تغيير السعر أو نطاق السوق
    if (price && marketRange) {
      const timeoutId = setTimeout(() => {
        analyzePrice();
      }, 500); // تأخير لتجنب التحليل المتكرر
      return () => clearTimeout(timeoutId);
    }
  }, [price, marketRange]);

  const fetchMarketData = async () => {
    if (!city || !district) return;
    
    setLoadingMarket(true);
    try {
      const range = await getMarketRange(city, district, propertyType);
      setMarketRange(range);
    } catch (error) {
      console.error("خطأ في جلب بيانات السوق:", error);
      // استخدام بيانات افتراضية في حالة الخطأ
      setMarketRange({
        low: 300000,
        avg: 400000,
        high: 500000,
        rangeLabel: "300,000 - 500,000 ريال"
      });
    } finally {
      setLoadingMarket(false);
    }
  };

  const analyzePrice = async () => {
    try {
      const status = await analyzePriceStatus(price, marketRange);
      setPriceStatus(status);
    } catch (error) {
      console.error("خطأ في تحليل السعر:", error);
      setPriceStatus("غير محدد");
    }
  };

  const toggleFeature = (key: string, type: string) => {
    if (type === "boolean") {
      setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
    } else if (type === "number") {
      setFeatures(prev => ({ 
        ...prev, 
        [key]: prev[key] ? prev[key] + 1 : 1 
      }));
    }
  };

  const updateFeatureNumber = (key: string, value: number) => {
    if (value <= 0) {
      setFeatures(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    } else {
      setFeatures(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleGenerateAI = async () => {
    setGeneratingAI(true);
    try {
      const aiDescription = await generateAIDescription({
        title,
        city,
        district, 
        propertyType,
        area,
        rooms,
        bathrooms,
        features,
        price
      });
      setDescription(aiDescription);
      setDescriptionMode("ai");
    } catch (error) {
      alert("حدث خطأ في توليد الوصف بالذكاء الاصطناعي");
    } finally {
      setGeneratingAI(false);
    }
  };

  const generatePaymentSplits = () => {
    if (!price || !paymentOption) return;

    let newSplits: number[] = [];
    switch (paymentOption) {
      case "single":
        newSplits = [price];
        break;
      case "two":
        newSplits = [Math.round(price * 0.5), Math.round(price * 0.5)];
        break;
      case "four":
        const quarter = Math.round(price * 0.25);
        newSplits = [quarter, quarter, quarter, price - (quarter * 3)]; // لضمان المجموع الصحيح
        break;
      case "monthly":
      case "monthly_rais":
      case "monthly_tajir":
        // افتراض إيجار شهري - يمكن تعديله
        newSplits = Array(12).fill(Math.round(price / 12));
        break;
    }
    setSplits(newSplits);
  };

  const handleSave = async () => {
    // التحقق من الحقول المطلوبة
    if (!title || !city || !district) {
      alert("يرجى إدخال العنوان والمدينة والحي");
      return;
    }

    if (mode === "property" && (registration.role === "owner" || registration.role === "lessor") && !deedNumber) {
      const confirm = window.confirm("لم تدخل رقم الصك. هل تريد المتابعة؟");
      if (!confirm) return;
    }

    const form: PropertyForm = {
      id: uuidv4(),
      ownerId: registration.id,
      title,
      city,
      district,
      propertyType,
      deedNumber: deedNumber || undefined,
      deedDate: deedDate || undefined,
      commission,
      rooms: propertyType === "land" ? undefined : rooms,
      floors: propertyType === "land" ? undefined : floors,
      bathrooms: propertyType === "land" ? undefined : bathrooms,
      kitchens: propertyType === "land" ? undefined : kitchens,
      majlis: propertyType === "land" ? undefined : majlis,
      livingRooms: propertyType === "land" ? undefined : livingRooms,
      area,
      price,
      priceMarketRange: marketRange?.rangeLabel,
      priceStatus,
      guarantees,
      features: features as any,
      description,
      descriptionMode,
      createdAt: new Date().toISOString(),
      paymentOptions: paymentOption ? { 
        option: paymentOption, 
        splits, 
        collaborateRais: paymentOption.includes("rais"), 
        collaborateTajir: paymentOption.includes("tajir") 
      } : null
    };

    setSaving(true);
    try {
      await saveProperty(form);
      await onSave(form);
    } catch (error) {
      alert("حدث خطأ في حفظ العرض");
    } finally {
      setSaving(false);
    }
  };

  const isLand = propertyType === "land";
  const isForRent = registration.role === "lessor" || registration.role === "tenant";

  const getPriceStatusColor = (status: string) => {
    switch (status) {
      case "سعر معقول": return "text-green-600 bg-green-100";
      case "فرصة ممتازة": return "text-blue-600 bg-blue-100";
      case "مبالغ فيه": return "text-red-600 bg-red-100";
      case "قد تكون بها عيوب": return "text-orange-600 bg-orange-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#D4AF37]/20 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-[#01411C] to-[#065f41] p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center">
                {mode === "property" ? <Home className="w-6 h-6 text-[#01411C]" /> : <Building className="w-6 h-6 text-[#01411C]" />}
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {mode === "property" ? "تفاصيل العقار" : "متطلبات البحث"}
                </h1>
                <p className="text-green-100">
                  {mode === "property" ? "أدخل تفاصيل العقار المراد عرضه" : "حدد متطلباتك للبحث عن العقار المناسب"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          {/* معلومات أساسية */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#01411C] mb-4">المعلومات الأساسية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#01411C] mb-2">عنوان العرض *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  placeholder={mode === "property" ? "مثال: شقة مفروشة بالكامل للبيع في حي الياسمين" : "مثال: أبحث عن شقة مفروشة للإيجار في الرياض"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#01411C] mb-2">المدينة *</label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setDistrict(""); // إعادة تعيين الحي عند تغيير المدينة
                    }}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">اختر المدينة</option>
                    {SAUDI_CITIES.map(cityName => (
                      <option key={cityName} value={cityName}>{cityName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#01411C] mb-2">الحي *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  disabled={!city}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent appearance-none bg-white disabled:bg-gray-50"
                >
                  <option value="">اختر الحي</option>
                  {city && CITY_DISTRICTS[city]?.map(districtName => (
                    <option key={districtName} value={districtName}>{districtName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#01411C] mb-2">نوع العقار *</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent appearance-none bg-white"
                >
                  {PROPERTY_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#01411C] mb-2">المساحة (م²) *</label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  placeholder="120"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* حقول الصك للمالك/المؤجر فقط */}
          {mode === "property" && (registration.role === "owner" || registration.role === "lessor") && (
            <div className="mb-8">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">معلومات الصك</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#01411C] mb-2">رقم الصك</label>
                    <input
                      type="text"
                      value={deedNumber}
                      onChange={(e) => setDeedNumber(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="123456789/1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#01411C] mb-2">تاريخ الصك</label>
                    <input
                      type="date"
                      value={deedDate}
                      onChange={(e) => setDeedDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* حقول تفاصيل المبنى (تختفي للأرض) */}
          {!isLand && (
            <div className="mb-8">
              <h3 className="font-semibold text-[#01411C] mb-4">تفاصيل المبنى</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#01411C] mb-2">غرف النوم</label>
                  <input
                    type="number"
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#01411C] mb-2">دورات المياه</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#01411C] mb-2">المطابخ</label>
                  <input
                    type="number"
                    value={kitchens}
                    onChange={(e) => setKitchens(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#01411C] mb-2">عدد الأدوار</label>
                  <input
                    type="number"
                    value={floors}
                    onChange={(e) => setFloors(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#01411C] mb-2">المجالس</label>
                  <input
                    type="number"
                    value={majlis}
                    onChange={(e) => setMajlis(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#01411C] mb-2">الصالات</label>
                  <input
                    type="number"
                    value={livingRooms}
                    onChange={(e) => setLivingRooms(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* السعر وتحليل السوق */}
          <div className="mb-8">
            <h3 className="font-semibold text-[#01411C] mb-4">السعر والتحليل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-[#01411C] mb-2">
                  {isForRent ? "الإيجار السنوي (ريال) *" : "السعر المطلوب (ريال) *"}
                </label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    placeholder="450000"
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#01411C] mb-2">العمولة المقترحة (%)</label>
                <input
                  type="number"
                  value={commission}
                  onChange={(e) => setCommission(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  placeholder="2"
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
            </div>

            {/* تحليل السوق */}
            {marketRange && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">تحليل السوق في {district}</h4>
                  {loadingMarket && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                </div>
                <div className="text-sm text-blue-700 mb-2">
                  📊 نطاق السوق: {marketRange.rangeLabel}
                </div>
                {priceStatus && (
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getPriceStatusColor(priceStatus)}`}>
                    {priceStatus === "سعر معقول" && <CheckCircle className="w-4 h-4" />}
                    {priceStatus === "فرصة ممتازة" && <CheckCircle className="w-4 h-4" />}
                    {priceStatus === "مبالغ فيه" && <AlertCircle className="w-4 h-4" />}
                    {priceStatus === "قد تكون بها عيوب" && <AlertCircle className="w-4 h-4" />}
                    {priceStatus}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* المميزات */}
          <div className="mb-8">
            <h3 className="font-semibold text-[#01411C] mb-4">المميزات والخصائص</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {FEATURES_CONFIG.map((feature) => (
                <div key={feature.key} className="relative">
                  <button
                    type="button"
                    onClick={() => toggleFeature(feature.key, feature.type)}
                    className={`w-full p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                      features[feature.key]
                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#01411C]"
                        : "border-gray-200 hover:border-[#D4AF37]/50 text-gray-600 hover:text-[#01411C]"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{feature.icon}</span>
                      <span>{feature.label}</span>
                      {features[feature.key] && feature.type === "boolean" && (
                        <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                      )}
                    </div>
                  </button>
                  
                  {/* حقل العدد للميزات الرقمية */}
                  {feature.type === "number" && features[feature.key] && (
                    <div className="absolute -top-2 -right-2">
                      <input
                        type="number"
                        value={features[feature.key] || 1}
                        onChange={(e) => updateFeatureNumber(feature.key, Number(e.target.value))}
                        className="w-12 h-8 text-center text-xs border border-[#D4AF37] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                        min="1"
                        max="50"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* خيارات الدفع (للإيجار فقط) */}
          {isForRent && mode === "property" && (
            <div className="mb-8">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">خيارات الدفع</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {PAYMENT_OPTIONS.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setPaymentOption(option.key as PaymentOptionType)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                        paymentOption === option.key
                          ? "border-green-600 bg-green-100 text-green-800"
                          : "border-gray-200 hover:border-green-400 text-gray-600"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {paymentOption && paymentOption !== "single" && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        type="button"
                        onClick={generatePaymentSplits}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                      >
                        حساب التقسيط التلقائي
                      </button>
                      <span className="text-sm text-gray-600">أو قم بتعديل المبالغ يدوياً</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {splits.map((split, index) => (
                        <input
                          key={index}
                          type="number"
                          value={split}
                          onChange={(e) => {
                            const newSplits = [...splits];
                            newSplits[index] = Number(e.target.value);
                            setSplits(newSplits);
                          }}
                          className="w-24 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
                          placeholder={`دفعة ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* الضمانات */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-[#01411C] mb-2">الضمانات المقدمة</label>
            <textarea
              value={guarantees}
              onChange={(e) => setGuarantees(e.target.value)}
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              placeholder="مثال: ضمان صيانة لمدة سنة، ضمان عدم وجود عيوب خفية..."
            />
          </div>

          {/* الوصف */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#01411C]">وصف العقار</h3>
              <div className="flex items-center gap-2">
                <select
                  value={descriptionMode}
                  onChange={(e) => setDescriptionMode(e.target.value as "manual" | "ai")}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                >
                  <option value="manual">كتابة يدوية</option>
                  <option value="ai">ذكاء اصطناعي</option>
                </select>
                {descriptionMode === "ai" && (
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={generatingAI}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {generatingAI ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                    {generatingAI ? "جاري التوليد..." : "توليد وصف"}
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              placeholder={mode === "property" 
                ? "اكتب وصفاً تفصيلياً للعقار يشمل الموقع والمميزات والحالة العامة..."
                : "اكتب متطلباتك بالتفصيل مثل الموقع المفضل والمميزات المطلوبة والميزانية..."
              }
            />
            <div className="text-xs text-gray-500 mt-1 text-left">
              {description.length} حرف
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving || !title || !city || !district || !price}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-lg font-medium hover:from-[#065f41] hover:to-[#01411C] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {mode === "property" ? "إرسال ونشر العرض" : "حفظ المتطلبات"}
                </>
              )}
            </button>
            
            {onBack && (
              <button
                onClick={onBack}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                رجوع
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}