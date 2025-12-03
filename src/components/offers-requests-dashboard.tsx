import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  PlusCircle, Users, Home, Building2, 
  KeyRound, MapPin, Phone, MessageCircle, AlertCircle,
  Trash2, User, Eye, CheckCircle, ArrowLeft, Search, Filter, Edit,
  Star, Mail, Calendar, Clock, Activity, TrendingUp, DollarSign,
  X, ChevronDown, ChevronUp, Send, Bookmark, Tag, Timer,
  ChevronLeft, ChevronRight, PanelLeft, PanelRight, BarChart, Menu, Bell, Search,
  ThumbsUp, ThumbsDown, Heart, UserCheck
} from "lucide-react";

// استيراد المكونات الجديدة
import LeftSliderComplete from "./LeftSliderComplete";
import RightSliderComplete from "./RightSliderComplete-fixed";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";

// استيراد مكون MapPicker المحسن
import { MapPicker } from "./owners/MapPicker";
import { Address } from "../types/owners";



export type OffersRequestsUserType = "property-owner" | "buyer" | "client" | "developer";

interface OffersRequestsUser {
  id: string;
  name: string;
  nickname?: string;
  idNumber?: string;
  birthDate?: string;
  phone: string;
  whatsapp?: string;
  type: OffersRequestsUserType;
  plan?: string;
  profileImage?: string;
}

interface OffersRequestsDashboardProps {
  user: OffersRequestsUser | null;
  onNavigate?: (page: string) => void;
}

// أنواع المستخدمين محسنة - محدثة لتتطابق مع النظام الجديد
type OwnerRoleNew = "baye3" | "moshtari" | "mo2ager" | "mosta2jer";

// نوع النموذج المحسن مع دعم Google Maps
interface FormData {
  propertyType: string;
  area: string;
  price: string;
  location: Address | null; // استخدام نوع Address المحسن
  description: string;
  features: string[];
  contactInfo: {
    name: string;
    phone: string;
    whatsapp?: string;
  };
  // حقول إضافية للعقارات
  rooms?: string;
  bathrooms?: string;
  age?: string;
  // حقول إضافية للطلبات
  requiredRooms?: string;
  priority?: string;
  // حقول العنوان المحسنة
  city?: string;
  district?: string;
  street?: string;
  postalCode?: string;
  buildingNumber?: string;
}

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

interface Offer {
  id: string;
  type: "sale" | "rent";
  title: string;
  price: number;
  location: LocationData;
  description: string;
  features: string[];
  images: string[];
  status: "active" | "pending" | "sold" | "rented";
  ownerType: OwnerRoleNew;
  contactInfo: {
    name: string;
    phone: string;
    whatsapp?: string;
  };
  createdAt: Date;
  brokerProposals?: BrokerProposal[];
}

interface BrokerProposal {
  id: string;
  brokerName: string;
  brokerPhone: string;
  commission: number;
  timeline: string;
  strategy: string;
  status: "pending" | "accepted" | "rejected";
  submittedAt: Date;
}

// بيانات تجريبية للوسطاء - محسنة
const mockBrokers: BrokerProposal[] = [
  {
    id: "1",
    brokerName: "أحمد العقاري",
    brokerPhone: "+966501234567",
    commission: 2.5,
    timeline: "30 يوم",
    strategy: "تسويق مكثف عبر منصات التواصل الاجتماعي وشبكة العملاء",
    status: "pending",
    submittedAt: new Date()
  },
  {
    id: "2", 
    brokerName: "سارة المطور",
    brokerPhone: "+966509876543",
    commission: 2.0,
    timeline: "45 يوم",
    strategy: "استخدام قاعدة بيانات واسعة من المهتمين والتصوير الاحترافي",
    status: "pending",
    submittedAt: new Date()
  }
];

// بيانات محسنة للوسطاء - للـ Right Slider
const enhancedBrokers = [
  {
    id: 1,
    name: "أحمد العقاري",
    offers: ["فيلا 3 غرف", "شقة مفروشة"],
    rating: 4.8,
    phone: "+966501234567",
    whatsapp: "+966501234567",
    commission: 2.5,
    experience: "5+ سنوات",
    specialties: ["فلل", "شقق", "أراضي"],
    completedDeals: 45,
    responseTime: "15 دقيقة",
    location: "الرياض",
    verified: true,
    premium: true
  },
  {
    id: 2,
    name: "سارة المطور",
    offers: ["أرض سكنية", "مكتب تجاري"],
    rating: 4.9,
    phone: "+966509876543",
    whatsapp: "+966509876543",
    commission: 2.0,
    experience: "7+ سنوات",
    specialties: ["عقارات تجارية", "أراضي", "استثمار"],
    completedDeals: 62,
    responseTime: "10 دقائق",
    location: "جدة",
    verified: true,
    premium: true
  },
  {
    id: 3,
    name: "محمد السكني",
    offers: ["شقة عوائل", "دوبلكس"],
    rating: 4.6,
    phone: "+966555666777",
    whatsapp: "+966555666777",
    commission: 3.0,
    experience: "3+ سنوات",
    specialties: ["شقق", "دوبلكس", "بنتهاوس"],
    completedDeals: 28,
    responseTime: "30 دقيقة",
    location: "الدمام",
    verified: true,
    premium: false
  },
  {
    id: 4,
    name: "فاطمة التجارية",
    offers: ["محل تجاري", "مستودع"],
    rating: 4.7,
    phone: "+966544333222",
    whatsapp: "+966544333222", 
    commission: 2.8,
    experience: "4+ سنوات",
    specialties: ["عقارات تجارية", "مستودعات", "محلات"],
    completedDeals: 35,
    responseTime: "20 دقيقة",
    location: "مكة المكرمة",
    verified: true,
    premium: false
  }
];

// بيانات تجريبية للعروض - محسنة ومفصلة
const mockOffers: Offer[] = [
  {
    id: "1",
    type: "sale",
    title: "فيلا للبيع في الرياض",
    price: 1200000,
    location: { lat: 24.7136, lng: 46.6753, address: "الرياض" },
    description: "فيلا فاخرة بتصميم عصري في حي الملقا، تتميز بالتشطيبات الراقية والموقع المتميز قريباً من جميع الخدمات. مساحة البناء 400 متر مربع على قطعة أرض 600 متر مربع.",
    features: ["4 غرف نوم", "3 حمامات", "مطبخ مجهز", "حديقة", "مطبخ مجهز", "تكييف مركزي", "موقف سيارة", "غرفة خادمة", "مسبح", "أمن وحراسة"],
    images: [],
    status: "active",
    ownerType: "baye3",
    contactInfo: {
      name: "محمد أحمد العتيبي",
      phone: "+966501234567",
      whatsapp: "+966501234567"
    },
    createdAt: new Date(),
    brokerProposals: mockBrokers
  },
  {
    id: "2",
    type: "rent",
    title: "شقة للإيجار في جدة",
    price: 3500,
    location: { lat: 21.4858, lng: 39.1925, address: "جدة" },
    description: "شقة مفروشة بالكامل في حي الزهراء، تتميز بقربها من الكورنيش والخدمات الأساسية. مناسبة للعائلات الصغيرة أو المهنيين.",
    features: ["2 غرف نوم", "حمامان", "مفروشة", "موقف سيارة", "بلكونة", "مصعد", "قريب من المدارس", "إنترنت مجاني"],
    images: [],
    status: "active",
    ownerType: "mo2ager",
    contactInfo: {
      name: "فاطمة سعد الغامدي",
      phone: "+966509876543",
      whatsapp: "+966509876543"
    },
    createdAt: new Date(),
    brokerProposals: [mockBrokers[0]]
  },
  {
    id: "3",
    type: "sale",
    title: "مطلوب فيلا للشراء في الدمام",
    price: 900000,
    location: { lat: 26.4282, lng: 50.1046, address: "الدمام" },
    description: "أبحث عن فيلا للشراء في الدمام أو الخبر، يفضل أن تكون في حي هادئ ومناسب للعائلات. الميزانية المتاحة حتى 900 ألف ريال.",
    features: ["3 غرف نوم", "حمامان", "الأولوية: الموقع", "حديقة", "موقف سيارة"],
    images: [],
    status: "active",
    ownerType: "moshtari",
    contactInfo: {
      name: "عبدالله الشمري",
      phone: "+966555123456",
      whatsapp: "+966555123456"
    },
    createdAt: new Date(),
    brokerProposals: []
  },
  {
    id: "4",
    type: "rent",
    title: "مطلوب شقة للإيجار في مكة المكرمة",
    price: 2500,
    location: { lat: 21.3891, lng: 39.8579, address: "مكة المكرمة" },
    description: "أبحث عن شقة للإيجار في مكة المكرمة، يفضل أن تكون قريبة من الحرم المكي الشريف. للإيجار طويل المدى.",
    features: ["غرفتان", "حمام واحد", "مطلوب: 2 غرف", "الأولوية: الموقع", "مفروشة"],
    images: [],
    status: "active",
    ownerType: "mosta2jer",
    contactInfo: {
      name: "أحمد حسن",
      phone: "+966544987654",
      whatsapp: "+966544987654"
    },
    createdAt: new Date(),
    brokerProposals: [mockBrokers[1]]
  }
];

export function OffersRequestsDashboard({ user, onNavigate }: OffersRequestsDashboardProps) {
  // التحقق من وجود بيانات المستخدم وإنشاء بيانات احتياطية
  const currentUser = user || {
    id: "demo-user",
    name: "مستخدم النظام التفصيلي المحسن",
    nickname: "مستخدم تجريبي",
    phone: "05xxxxxxxx",
    type: "property-owner" as OffersRequestsUserType,
    plan: "باقة شاملة محسنة"
  };

  // الحالات الأساسية
  const [role, setRole] = useState<OwnerRoleNew | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage] = useState("offers-requests-dashboard");
  const [currentView, setCurrentView] = useState<"roles" | "offers" | "form" | "crm">("roles");
  const [formType, setFormType] = useState<"sale" | "rent" | "buy-request" | "rent-request" | null>(null);
  
  // حالات النظام المحسن الجديد
  const [showRightSlider, setShowRightSlider] = useState(false);
  const [showLeftSlider, setShowLeftSlider] = useState(false);
  const [rightSliderContent, setRightSliderContent] = useState<"offer-details" | "brokers" | "analytics">("offer-details");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCRM, setShowCRM] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<any>(null);
  
  // حالات نظام السحب التفاعلي للوسطاء
  const [currentBrokerIndex, setCurrentBrokerIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSwipeCards, setShowSwipeCards] = useState(false);
  
  // حالات النماذج والموقع مع دعم Google Maps المحسن
  const [selectedLocation, setSelectedLocation] = useState<Address | null>(null);
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    propertyType: '',
    area: '',
    price: '',
    location: null,
    description: '',
    features: [],
    contactInfo: {
      name: currentUser.name,
      phone: currentUser.phone,
      whatsapp: currentUser.whatsapp
    },
    city: '',
    district: '',
    street: '',
    postalCode: '',
    buildingNumber: ''
  });
  
  // بيانات المدن السعودية المدعومة - موسعة
  const saudiCities = [
    { name: 'الرياض', lat: 24.7136, lng: 46.6753, region: 'المنطقة الوسطى' },
    { name: 'جدة', lat: 21.4858, lng: 39.1925, region: 'المنطقة الغربية' },
    { name: 'الدمام', lat: 26.4282, lng: 50.1046, region: 'المنطقة الشرقية' },
    { name: 'مكة المكرمة', lat: 21.3891, lng: 39.8579, region: 'المنطقة الغربية' },
    { name: 'المدينة المنورة', lat: 24.5247, lng: 39.5692, region: 'المنطقة الغربية' },
    { name: 'الطائف', lat: 21.2703, lng: 40.4128, region: 'المنطقة الغربية' },
    { name: 'بريدة', lat: 26.3260, lng: 43.9750, region: 'منطقة القصيم' },
    { name: 'تبوك', lat: 28.3998, lng: 36.5700, region: 'منطقة تبوك' },
    { name: 'الخبر', lat: 26.2172, lng: 50.1971, region: 'المنطقة الشرقية' },
    { name: 'أبها', lat: 18.2164, lng: 42.5047, region: 'منطقة عسير' },
    { name: 'نجران', lat: 17.4924, lng: 44.1277, region: 'منطقة نجران' },
    { name: 'جازان', lat: 16.8892, lng: 42.5511, region: 'منطقة جازان' },
    { name: 'حائل', lat: 27.5208, lng: 41.6906, region: 'منطقة حائل' },
    { name: 'الجبيل', lat: 27.0174, lng: 49.6251, region: 'المنطقة الشرقية' },
    { name: 'ينبع', lat: 24.0896, lng: 38.0618, region: 'المنطقة الغربية' }
  ];

  // معالجة التنقل المحسنة
  const handleSafeNavigate = useCallback((page: string) => {
    try {
      if (onNavigate) {
        setIsLoading(true);
        setTimeout(() => {
          onNavigate(page);
          setIsLoading(false);
        }, 300);
      }
    } catch (error) {
      console.error('Navigation error in dashboard:', error);
      setIsLoading(false);
    }
  }, [onNavigate]);

  // معالجة اختيار العنوان من Google Maps
  const handleAddressSelect = useCallback((address: Address) => {
    setSelectedLocation(address);
    setFormData(prev => ({
      ...prev,
      location: address,
      city: address.city || '',
      district: address.district || '',
      street: address.street || '',
      postalCode: address.postalCode || '',
      buildingNumber: address.buildingNumber || address.building || ''
    }));
    setShowMapPicker(false);
  }, []);

  // معالجة اختيار المدينة (للتوافق مع النظام القديم)
  const handleCitySelect = useCallback((cityName: string) => {
    const selectedCity = saudiCities.find(city => city.name === cityName);
    if (selectedCity) {
      const address: Address = {
        formattedAddress: selectedCity.name,
        city: selectedCity.name,
        district: '',
        street: '',
        latitude: selectedCity.lat,
        longitude: selectedCity.lng
      };
      setSelectedLocation(address);
      setFormData(prev => ({ 
        ...prev, 
        location: address,
        city: selectedCity.name
      }));
    }
  }, []);

  // حذف الموقع المحدد
  const clearLocation = useCallback(() => {
    setSelectedLocation(null);
    setFormData(prev => ({ 
      ...prev, 
      location: null,
      city: '',
      district: '',
      street: '',
      postalCode: '',
      buildingNumber: ''
    }));
  }, []);

  // معالجة تحديث بيانات النموذج
  const updateFormData = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // إرسال النموذج المحسن
  const handleSubmitForm = useCallback(() => {
    // التحقق من الحقول المطلوبة
    if (!selectedLocation) {
      alert('يرجى تحديد موقع العقار');
      return;
    }

    if (!formData.propertyType || !formData.area || !formData.price || !formData.description || !formData.contactInfo.name.trim()) {
      alert('يرجى ملء جميع الحقول المطلوبة (*)');
      return;
    }

    // تحديد نوع العرض أو الطلب
    const getOfferType = () => {
      if (role === 'baye3' || role === 'moshtari') return 'sale';
      if (role === 'mo2ager' || role === 'mosta2jer') return 'rent';
      return 'sale';
    };

    // تحديد عنوان مناسب
    const getOfferTitle = () => {
      const propertyTypeArabic = {
        villa: 'فيلا',
        apartment: 'شقة',
        duplex: 'دوبلكس',
        penthouse: 'بنتهاوس',
        office: 'مكتب',
        shop: 'محل تجاري',
        warehouse: 'مستودع',
        land: 'أرض',
        farm: 'مزرعة',
        building: 'مبنى كامل'
      }[formData.propertyType] || formData.propertyType;

      const actionText = {
        baye3: 'للبيع',
        mo2ager: 'للإيجار',
        moshtari: 'مطلوب للشراء',
        mosta2jer: 'مطلوب للإيجار'
      }[role as string] || 'للبيع';

      return `${propertyTypeArabic} ${actionText} في ${selectedLocation.address}`;
    };

    // إنشاء عرض أو طلب جديد
    const newOffer: Offer = {
      id: Date.now().toString(),
      type: getOfferType(),
      title: getOfferTitle(),
      price: parseInt(formData.price),
      location: {
        lat: selectedLocation.latitude || 0,
        lng: selectedLocation.longitude || 0,
        address: selectedLocation.formattedAddress || `${selectedLocation.city}, ${selectedLocation.district}`
      },
      description: formData.description,
      features: [
        ...formData.features,
        // إضافة تفاصيل العنوان المحسنة
        ...(formData.city ? [`المدينة: ${formData.city}`] : []),
        ...(formData.district ? [`الحي: ${formData.district}`] : []),
        ...(formData.street ? [`الشارع: ${formData.street}`] : []),
        ...(formData.buildingNumber ? [`رقم المبنى: ${formData.buildingNumber}`] : []),
        ...(formData.postalCode ? [`الرمز البريدي: ${formData.postalCode}`] : []),
        // إضافة التفاصيل الجديدة كخصائص
        ...(formData.rooms ? [`${formData.rooms === 'studio' ? 'استوديو' : formData.rooms + ' غرف'}`] : []),
        ...(formData.bathrooms ? [`${formData.bathrooms} حمام${formData.bathrooms !== '1' ? 'ات' : ''}`] : []),
        ...(formData.area ? [`المساحة: ${formData.area} م²`] : []),
        ...(formData.age ? [`العمر: ${
          formData.age === 'new' ? 'جديد' :
          formData.age === 'recent' ? 'حديث' :
          formData.age === 'good' ? 'جيد' : 'قديم'
        }`] : []),
        // للطلبات
        ...(formData.requiredRooms && formData.requiredRooms !== 'any' ? 
          [`مطلوب: ${formData.requiredRooms === 'studio' ? 'استوديو' : formData.requiredRooms + ' غرف'}`] : []),
        ...(formData.priority ? [`الأولوية: ${
          formData.priority === 'location' ? 'الموقع' :
          formData.priority === 'price' ? 'السعر' :
          formData.priority === 'size' ? 'المساحة' :
          formData.priority === 'condition' ? 'حالة العقار' : 'المرافق'
        }`] : [])
      ].filter(Boolean),
      images: [],
      status: 'active',
      ownerType: role as any,
      contactInfo: {
        name: formData.contactInfo.name.trim(),
        phone: formData.contactInfo.phone,
        whatsapp: formData.contactInfo.whatsapp || formData.contactInfo.phone
      },
      createdAt: new Date(),
      brokerProposals: []
    };

    // إضافة العرض للقائمة
    setOffers(prev => [newOffer, ...prev]);
    
    // إعادة تعيين النموذج
    setFormData({
      propertyType: '',
      area: '',
      price: '',
      location: null,
      description: '',
      features: [],
      contactInfo: {
        name: currentUser.name,
        phone: currentUser.phone,
        whatsapp: currentUser.whatsapp
      },
      city: '',
      district: '',
      street: '',
      postalCode: '',
      buildingNumber: ''
    });
    setSelectedLocation(null);
    setCurrentView('offers');
    
    // رسالة نجاح م��صصة
    const successMessage = role === 'baye3' || role === 'mo2ager' 
      ? `تم إضافة العرض بنجاح! 🎉\n\nسيتمكن الوسطاء من رؤية عرضك والتواصل معك.`
      : `تم إضافة طلبك بنجاح! 🎉\n\nسيتمكن الوسطاء من رؤية طلبك وتقديم العروض المناسبة لك.`;
    
    alert(successMessage);
  }, [formData, selectedLocation, role, currentUser]);

  // معالج اختيار الدور
  const handleRoleSelect = useCallback((newRole: OwnerRoleNew) => {
    setRole(newRole);
    setCurrentView("offers");
  }, []);

  // معالجة قبول/رفض عروض الوسطاء
  const handleBrokerAction = useCallback((offerId: string, brokerId: string, action: "accept" | "reject") => {
    setOffers(prev => prev.map(offer => {
      if (offer.id === offerId) {
        const updatedProposals = offer.brokerProposals?.map(proposal =>
          proposal.id === brokerId ? { ...proposal, status: action === "accept" ? "accepted" : "rejected" } : proposal
        ) || [];
        return { ...offer, brokerProposals: updatedProposals };
      }
      return offer;
    }));

    // تحديث العرض المحدد في Right Slider أيضاً
    if (selectedOffer && selectedOffer.id === offerId) {
      setSelectedOffer(prev => {
        if (!prev) return prev;
        const updatedProposals = prev.brokerProposals?.map(proposal =>
          proposal.id === brokerId ? { ...proposal, status: action === "accept" ? "accepted" : "rejected" } : proposal
        ) || [];
        return { ...prev, brokerProposals: updatedProposals };
      });
    }
  }, [selectedOffer]);

  // معالجة السحب التفاعلي للوسطاء
  const handleSwipeAction = useCallback((direction: "left" | "right") => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSwipeDirection(direction);
    
    const currentBroker = enhancedBrokers[currentBrokerIndex];
    const action = direction === "right" ? "accept" : "reject";
    
    // تحديث حالة الوسيط
    if (selectedOffer) {
      handleBrokerAction(selectedOffer.id, currentBroker.id.toString(), action);
    }
    
    // الانتقال للوسيط التالي بعد التحريك
    setTimeout(() => {
      if (currentBrokerIndex < enhancedBrokers.length - 1) {
        setCurrentBrokerIndex(prev => prev + 1);
      } else {
        setCurrentBrokerIndex(0); // العودة للبداية
      }
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 500);
  }, [isAnimating, currentBrokerIndex, selectedOffer, handleBrokerAction]);

  // التنقل بين بطاقات الوسطاء
  const handleNextBroker = useCallback(() => {
    if (currentBrokerIndex < enhancedBrokers.length - 1) {
      setCurrentBrokerIndex(prev => prev + 1);
    } else {
      setCurrentBrokerIndex(0);
    }
  }, [currentBrokerIndex]);

  const handlePrevBroker = useCallback(() => {
    if (currentBrokerIndex > 0) {
      setCurrentBrokerIndex(prev => prev - 1);
    } else {
      setCurrentBrokerIndex(enhancedBrokers.length - 1);
    }
  }, [currentBrokerIndex]);

  // تصفية العروض
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || offer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // مكون اختيار الموقع المحسن مع دعم Google Maps
  const renderLocationPicker = () => {
    return (
      <div className="mb-4">
        <div className="border-2 border-[#D4AF37] rounded-lg p-4 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="text-center mb-4">
            <MapPin className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
            <h4 className="font-medium text-[#01411C] mb-2">🗺️ اختر موق�� العقار</h4>
            <p className="text-sm text-gray-600">استخدم خرائط Google لتحديد الموقع بدقة</p>
          </div>
          
          {/* زر فتح خرائط Google */}
          <div className="text-center mb-4">
            <Button
              onClick={() => setShowMapPicker(true)}
              className="bg-[#01411C] hover:bg-[#065f41] text-white px-6 py-3 rounded-lg text-lg flex items-center gap-3 mx-auto"
            >
              <MapPin className="w-5 h-5" />
              📍 اختيار الموقع بدقة من الخريطة
            </Button>
            <p className="text-xs text-gray-500 mt-2">سيتم ملء جميع تفاصيل العنوان تلقائياً</p>
          </div>

          {/* عرض العنوان المحدد */}
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 mb-2">✅ تم تحديد الموقع بنجاح</p>
                    
                    {/* عرض تفاصيل العنوان */}
                    <div className="space-y-1 text-sm text-green-700">
                      {selectedLocation.formattedAddress && (
                        <div className="bg-white/50 p-2 rounded">
                          <strong>العنوان الكامل:</strong> {selectedLocation.formattedAddress}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {selectedLocation.city && (
                          <div className="bg-white/50 p-2 rounded">
                            <strong>المدينة:</strong> {selectedLocation.city}
                          </div>
                        )}
                        {selectedLocation.district && (
                          <div className="bg-white/50 p-2 rounded">
                            <strong>الحي:</strong> {selectedLocation.district}
                          </div>
                        )}
                        {selectedLocation.street && (
                          <div className="bg-white/50 p-2 rounded">
                            <strong>الشارع:</strong> {selectedLocation.street}
                          </div>
                        )}
                        {(selectedLocation.buildingNumber || selectedLocation.building) && (
                          <div className="bg-white/50 p-2 rounded">
                            <strong>رقم المبنى:</strong> {selectedLocation.buildingNumber || selectedLocation.building}
                          </div>
                        )}
                        {selectedLocation.postalCode && (
                          <div className="bg-white/50 p-2 rounded">
                            <strong>الرمز البريدي:</strong> {selectedLocation.postalCode}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={clearLocation}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors ml-2"
                  title="حذف الموقع المحدد"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* خيار سريع للمدن الرئيسية */}
          {!selectedLocation && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 mb-3 text-center">أو اختر مدينة للتحديد السريع</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة', 'الطائف'].map((cityName) => (
                  <motion.button
                    key={cityName}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCitySelect(cityName)}
                    className="p-3 rounded-lg border-2 border-gray-200 bg-white hover:border-[#D4AF37]/50 hover:bg-gray-50 transition-all duration-200 touch-manipulation"
                  >
                    <span className="text-sm font-medium">{cityName}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // مكون السحب التفاعلي للوسطاء - شبيه بـ Leader CRM
  const SwipeableBrokerCards = () => {
    if (!showSwipeCards || enhancedBrokers.length === 0) return null;

    const currentBroker = enhancedBrokers[currentBrokerIndex];

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowSwipeCards(false)}
        >
          <motion.div
            dir="rtl"
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* مؤشر الصفحات */}
            <div className="text-center mb-4">
              <div className="flex justify-center gap-2 mb-2">
                {enhancedBrokers.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentBrokerIndex 
                        ? 'bg-[#D4AF37] w-8' 
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
              <p className="text-white text-sm">
                {currentBrokerIndex + 1} من {enhancedBrokers.length} وسطاء
              </p>
            </div>

            {/* بطاقة الوسيط */}
            <motion.div
              key={currentBroker.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                x: swipeDirection === "left" ? -300 : 
                   swipeDirection === "right" ? 300 : 0,
                rotate: swipeDirection === "left" ? -15 : 
                        swipeDirection === "right" ? 15 : 0
              }}
              exit={{ 
                scale: 0.8, 
                opacity: 0,
                x: swipeDirection === "left" ? -300 : 300,
                rotate: swipeDirection === "left" ? -15 : 15
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.5
              }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden swipe-container"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '3px solid #D4AF37'
              }}
              drag="x"
              dragConstraints={{ left: -50, right: 50 }}
              onDragEnd={(event, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -10000) {
                  handleSwipeAction("left");
                } else if (swipe > 10000) {
                  handleSwipeAction("right");
                }
              }}
            >
              {/* Header بتدرج أ��ضر ملكي */}
              <div className="bg-gradient-to-r from-[#01411C] to-[#065f41] p-6 text-white relative">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center text-2xl font-bold text-[#01411C]">
                    {currentBroker.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{currentBroker.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex text-[#D4AF37]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(currentBroker.rating) ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <span className="text-sm">{currentBroker.rating}</span>
                    </div>
                  </div>
                  {currentBroker.premium && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-[#D4AF37] text-[#01411C] px-2 py-1 rounded-full text-xs font-bold">
                        ⭐ مميز
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* محتوى البطاقة */}
              <div className="p-6 space-y-4">
                {/* معلومات أساسية */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="text-xs text-green-600 font-medium mb-1">العمولة</div>
                    <div className="text-lg font-bold text-green-800">{currentBroker.commission}%</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-600 font-medium mb-1">الصفقات</div>
                    <div className="text-lg font-bold text-blue-800">{currentBroker.completedDeals}</div>
                  </div>
                </div>

                {/* التخصصات */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">التخصصات</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentBroker.specialties.map((specialty, index) => (
                      <span key={index} className="bg-[#D4AF37]/20 text-[#01411C] px-3 py-1 rounded-full text-sm font-medium">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* العروض المتاحة */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">العروض المتاحة</h4>
                  <div className="space-y-2">
                    {currentBroker.offers.map((offer, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                        <div className="text-sm font-medium">{offer}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* معلومات إضافية */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{currentBroker.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{currentBroker.responseTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-gray-500" />
                    <span>{currentBroker.experience}</span>
                  </div>
                  {currentBroker.verified && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">موثق</span>
                    </div>
                  )}
                </div>

                {/* معلومات الاتصال */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">الهاتف:</span>
                    <span className="text-sm">{currentBroker.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">واتساب:</span>
                    <span className="text-sm">{currentBroker.whatsapp}</span>
                  </div>
                </div>
              </div>

              {/* أزرار التحكم */}
              <div className="p-6 bg-gray-50 flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSwipeAction("left")}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <ThumbsDown className="w-5 h-5" />
                  رفض
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSwipeAction("right")}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <ThumbsUp className="w-5 h-5" />
                  قبول
                </motion.button>
              </div>
            </motion.div>

            {/* أزرار التنقل */}
            <div className="flex justify-between mt-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevBroker}
                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
              
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSwipeCards(false)}
                  className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  إغلاق
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNextBroker}
                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
            </div>

            {/* تعليمات السحب */}
            <div className="text-center mt-4">
              <p className="text-white/80 text-sm">
                👈 اسحب يساراً للرفض • اسحب يميناً للقبول 👉
              </p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // مكون Right Slider المحسن
  const EnhancedRightSlider = () => (
    <AnimatePresence>
      {showRightSlider && selectedOffer && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setShowRightSlider(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Right Slider */}
          <motion.div
            dir="rtl"
            className="fixed top-0 right-0 z-50 h-full w-[90%] md:w-[40%] lg:w-[35%] bg-white shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">تفاصيل العرض</h3>
                <button
                  onClick={() => setShowRightSlider(false)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant={rightSliderContent === "offer-details" ? "secondary" : "ghost"}
                  onClick={() => setRightSliderContent("offer-details")}
                  className="text-xs text-white hover:text-gray-900"
                >
                  التفاصيل
                </Button>
                <Button
                  size="sm"
                  variant={rightSliderContent === "brokers" ? "secondary" : "ghost"}
                  onClick={() => setRightSliderContent("brokers")}
                  className="text-xs text-white hover:text-gray-900"
                >
                  الوسطاء
                </Button>
                <Button
                  size="sm"
                  variant={rightSliderContent === "analytics" ? "secondary" : "ghost"}
                  onClick={() => setRightSliderContent("analytics")}
                  className="text-xs text-white hover:text-gray-900"
                >
                  التحليلات
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {rightSliderContent === "offer-details" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* معلومات العرض الأساسية */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          معلومات العقار
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-600">العنوان:</span>
                          <p className="font-medium">{selectedOffer.title}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">الوصف:</span>
                          <p className="text-sm bg-gray-50 p-3 rounded">{selectedOffer.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">الموقع:</span>
                            <p className="font-medium flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {selectedOffer.location.address}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">السعر:</span>
                            <p className="font-medium text-[#D4AF37]">
                              {selectedOffer.price.toLocaleString()} ريال
                              {selectedOffer.type === "rent" && " / شهر"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">النوع:</span>
                          <Badge variant={selectedOffer.type === "sale" ? "default" : "secondary"}>
                            {selectedOffer.type === "sale" ? "للبيع" : "للإيجار"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* الميزات */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">الميزات والخصائص</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedOffer.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* معلومات الاتصال */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">معلومات التواصل</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-[#01411C] text-white">
                              {selectedOffer.contactInfo.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h5 className="font-medium">{selectedOffer.contactInfo.name}</h5>
                            <p className="text-sm text-gray-600">{selectedOffer.contactInfo.phone}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Button size="sm" className="bg-[#01411C] hover:bg-[#065f41]">
                            <Phone className="h-4 w-4 mr-2" />
                            اتصال
                          </Button>
                          <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            واتساب
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {rightSliderContent === "brokers" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-[#01411C]">
                        عروض الوسطاء ({selectedOffer.brokerProposals?.length || 0})
                      </h4>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowSwipeCards(true)}
                        className="bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] text-[#01411C] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                      >
                        <Heart className="w-4 h-4" />
                        تصفح تفاعلي
                      </motion.button>
                    </div>
                    
                    {selectedOffer.brokerProposals && selectedOffer.brokerProposals.length > 0 ? (
                      selectedOffer.brokerProposals.map((proposal) => (
                        <Card key={proposal.id} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-[#D4AF37] text-white">
                                  {proposal.brokerName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h5 className="font-medium">{proposal.brokerName}</h5>
                                <p className="text-sm text-gray-600">{proposal.brokerPhone}</p>
                              </div>
                              <Badge 
                                variant={proposal.status === "accepted" ? "default" : 
                                        proposal.status === "rejected" ? "destructive" : "secondary"}
                              >
                                {proposal.status === "accepted" ? "مقبول" : 
                                 proposal.status === "rejected" ? "مرفوض" : "معلق"}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                              <div>
                                <span className="text-gray-600">العمولة:</span>
                                <span className="font-medium mr-2">{proposal.commission}%</span>
                              </div>
                              <div>
                                <span className="text-gray-600">المدة:</span>
                                <span className="font-medium mr-2">{proposal.timeline}</span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mb-3">
                              {proposal.strategy}
                            </p>
                            
                            {proposal.status === "pending" && (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 flex-1"
                                  onClick={() => handleBrokerAction(selectedOffer.id, proposal.id, "accept")}
                                >
                                  قبول
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={() => handleBrokerAction(selectedOffer.id, proposal.id, "reject")}
                                >
                                  رفض
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>لا توجد عروض من الوسطاء بعد</p>
                        <p className="text-sm">سيتم إشعارك عند تلقي عروض جديدة</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {rightSliderContent === "analytics" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h4 className="font-bold text-[#01411C]">تحليلات العرض</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-[#01411C]">
                            {selectedOffer.brokerProposals?.length || 0}
                          </div>
                          <div className="text-sm text-gray-600">عروض وسطاء</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedOffer.brokerProposals?.filter(p => p.status === "accepted").length || 0}
                          </div>
                          <div className="text-sm text-gray-600">مقبول</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {selectedOffer.brokerProposals?.filter(p => p.status === "pending").length || 0}
                          </div>
                          <div className="text-sm text-gray-600">في الانتظار</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-[#D4AF37]">
                            {Math.floor((Date.now() - selectedOffer.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                          </div>
                          <div className="text-sm text-gray-600">أيام منذ النشر</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* متوسط العمولة */}
                    {selectedOffer.brokerProposals && selectedOffer.brokerProposals.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">إحصائيات العمولة</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">متوسط العمولة:</span>
                              <span className="font-medium">
                                {(selectedOffer.brokerProposals.reduce((sum, p) => sum + p.commission, 0) / selectedOffer.brokerProposals.length).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">أقل عمولة:</span>
                              <span className="font-medium text-green-600">
                                {Math.min(...selectedOffer.brokerProposals.map(p => p.commission))}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">أعلى عمولة:</span>
                              <span className="font-medium text-red-600">
                                {Math.max(...selectedOffer.brokerProposals.map(p => p.commission))}%
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // مكون الأدوار المحسن
  const RoleTiles = () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      {[
        {
          id: "baye3" as OwnerRoleNew,
          icon: Home,
          title: "بائع",
          description: "أريد بيع عقاري",
          gradient: "from-green-100 to-green-200",
          border: "border-green-300",
          hoverBorder: "hover:border-green-300"
        },
        {
          id: "moshtari" as OwnerRoleNew,
          icon: User,
          title: "مشتري",
          description: "أريد شراء عقار",
          gradient: "from-blue-100 to-blue-200",
          border: "border-blue-300",
          hoverBorder: "hover:border-blue-300"
        },
        {
          id: "mo2ager" as OwnerRoleNew,
          icon: Building2,
          title: "مؤجر",
          description: "أريد تأجير عقاري",
          gradient: "from-yellow-100 to-yellow-200",
          border: "border-yellow-300",
          hoverBorder: "hover:border-yellow-300"
        },
        {
          id: "mosta2jer" as OwnerRoleNew,
          icon: KeyRound,
          title: "مستأجر",
          description: "أريد استئجار عقار",
          gradient: "from-purple-100 to-purple-200",
          border: "border-purple-300",
          hoverBorder: "hover:border-purple-300"
        }
      ].map((roleData) => (
        <motion.div
          key={roleData.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setRole(roleData.id);
            setCurrentView("offers");
          }}
          className={`
            relative cursor-pointer rounded-xl p-4 transition-all duration-300
            bg-gradient-to-br ${roleData.gradient}
            border-2 ${role === roleData.id ? roleData.border : 'border-transparent'}
            ${roleData.hoverBorder} hover:shadow-lg touch-manipulation
          `}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center
              ${role === roleData.id ? 'bg-white shadow-md' : 'bg-white/80'}
            `}>
              <roleData.icon className={`w-6 h-6 ${roleData.border.includes('green') ? 'text-green-600' : 
                roleData.border.includes('blue') ? 'text-blue-600' :
                roleData.border.includes('yellow') ? 'text-yellow-600' : 'text-purple-600'}`} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{roleData.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{roleData.description}</p>
            </div>
          </div>
          
          {role === roleData.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );

  // نموذج التفاصيل المحسن مع الخريطة
  // نماذج التفاصيل المحسن مع كامل التفاصيل للأنواع الأربعة
  const DetailedForm = () => {
    // إعداد خاص لكل نوع من النماذج
    const getFormConfig = () => {
      switch (role) {
        case 'baye3':
          return {
            title: '🏠 تفاصيل العقار للبيع',
            priceLabel: 'السعر الإجمالي (ريال)',
            pricePlaceholder: 'مثال: 850000',
            descriptionPlaceholder: 'اكتب وصفاً تفصيلياً للعقار المراد بيعه...',
            submitText: 'إضافة العرض للبيع',
            showOwnershipFields: true,
            showPropertyDetails: true
          };
        case 'mo2ager':
          return {
            title: '🏠 تفاصيل العقار للإيجار',
            priceLabel: 'الإيجار الشهري (ريال)',
            pricePlaceholder: 'مثال: 3500',
            descriptionPlaceholder: 'اكتب وصفاً تفصيل��اً للعقار المراد تأجيره...',
            submitText: 'إضافة العرض للإيجار',
            showOwnershipFields: true,
            showPropertyDetails: true
          };
        case 'moshtari':
          return {
            title: '🔍 طلب شراء عقار',
            priceLabel: 'الميزانية المتاحة (ريال)',
            pricePlaceholder: 'مثال: 800000',
            descriptionPlaceholder: 'اكتب تفاصيل العقار الذي تريد شراؤه وأي متطلبات خاصة...',
            submitText: 'إضافة طلب الشراء',
            showOwnershipFields: false,
            showPropertyDetails: false
          };
        case 'mosta2jer':
          return {
            title: '🔍 طلب استئجار عقار',
            priceLabel: 'الميزانية للإيجار (ريال/شهر)',
            pricePlaceholder: 'مثال: 3000',
            descriptionPlaceholder: 'اكتب تفاصيل العقار الذي تريد استئجاره ومتطلباتك...',
            submitText: 'إضافة طلب الإيجار',
            showOwnershipFields: false,
            showPropertyDetails: false
          };
        default:
          return null;
      }
    };

    const config = getFormConfig();
    if (!config) return null;

    return (
      <div className="space-y-6 p-4">
        <div className="bg-white rounded-xl shadow-md p-6 border border-[#D4AF37]/20">
          <h3 className="text-lg font-semibold text-[#01411C] mb-6">
            {config.title}
          </h3>
          
          {/* معلومات أساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع العقار *
              </label>
              <Input
                type="text"
                placeholder="مثال: فيلا، شقة، دوبلكس، بنتهاوس، مكتب، محل تجاري، مستودع، أرض، مزرعة، مبنى كامل"
                value={formData.propertyType}
                onChange={(e) => updateFormData('propertyType', e.target.value)}
                className="form-input-enhanced"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المساحة (متر مربع) *
              </label>
              <Input
                type="number"
                placeholder="مثال: 200"
                value={formData.area}
                onChange={(e) => updateFormData('area', e.target.value)}
                className="form-input-enhanced"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {config.priceLabel} *
              </label>
              <Input
                type="number"
                placeholder={config.pricePlaceholder}
                value={formData.price}
                onChange={(e) => updateFormData('price', e.target.value)}
                className="form-input-enhanced"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف *
              </label>
              <Input
                type="tel"
                placeholder="05xxxxxxxx"
                value={formData.contactInfo.phone}
                onChange={(e) => updateFormData('contactInfo', { ...formData.contactInfo, phone: e.target.value })}
                className="form-input-enhanced"
              />
            </div>
          </div>

          {/* تفاصيل إضافية للعقار (للبائعين والمؤجرين فقط) */}
          {config.showPropertyDetails && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد الغرف
                  </label>
                  <Input
                    type="text"
                    placeholder="مثال: استوديو، غرفة واحدة، غرفتان، 3 غرف، 4 غرف، 5 غرف، 6+ غرف"
                    value={formData.rooms || ''}
                    onChange={(e) => updateFormData('rooms', e.target.value)}
                    className="form-input-enhanced"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد الحمامات
                  </label>
                  <Input
                    type="text"
                    placeholder="مثال: حمام واحد، حمامان، 3 حمامات، 4 حمامات، 5+ حمامات"
                    value={formData.bathrooms || ''}
                    onChange={(e) => updateFormData('bathrooms', e.target.value)}
                    className="form-input-enhanced"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عمر العقار
                  </label>
                  <Input
                    type="text"
                    placeholder="مثال: جديد (0-2 سنة)، حديث (3-5 سنوات)، جيد (6-10 سنوات)، قديم (10+ سنوات)"
                    value={formData.age || ''}
                    onChange={(e) => updateFormData('age', e.target.value)}
                    className="form-input-enhanced"
                  />
                </div>
              </div>

              {/* خصائص إضافية */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  المميزات المتوفرة
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'مفروش', 'غير مفروش', 'مطبخ مجهز', 'تكييف مركزي', 'موقف سيارة',
                    'مصعد', 'حديقة', 'بلكونة', 'غرفة خادمة', 'مخزن', 'جاكوزي',
                    'مسبح', 'صالة رياضة', 'أمن وحراسة', 'إنترنت مجاني', 'قريب من المدارس'
                  ].map((feature) => (
                    <label key={feature} className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('features', [...formData.features, feature]);
                          } else {
                            updateFormData('features', formData.features.filter(f => f !== feature));
                          }
                        }}
                        className="rounded border-gray-300 text-[#01411C] focus:ring-[#D4AF37]"
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* متطلبات خاصة (للمشترين والمستأجرين) */}
          {!config.showPropertyDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عدد الغرف المطلوب
                </label>
                <Input
                  type="text"
                  placeholder="مثال: أي عدد، استوديو، غرفة واحدة، غرفتان، 3 غرف، 4 غرف، 5+ غرف"
                  value={formData.requiredRooms || ''}
                  onChange={(e) => updateFormData('requiredRooms', e.target.value)}
                  className="form-input-enhanced"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الأولوية في الاختيار
                </label>
                <Input
                  type="text"
                  placeholder="مثال: الموقع، السعر، المساحة، حالة العقار، المرافق"
                  value={formData.priority || ''}
                  onChange={(e) => updateFormData('priority', e.target.value)}
                  className="form-input-enhanced"
                />
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف التفصيلي *
            </label>
            <Textarea
              placeholder={config.descriptionPlaceholder}
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              rows={5}
              className="form-input-enhanced"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📍 تحديد موقع العقار *
            </label>
            {renderLocationPicker()}
            {!selectedLocation && (
              <p className="text-sm text-amber-600 mt-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                يرجى اختيار المدينة التي يقع بها العقار
              </p>
            )}
          </div>

          {/* معلومات اتصال إضافية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل *
              </label>
              <Input
                type="text"
                placeholder="أدخل اسمك الكامل"
                value={formData.contactInfo.name}
                onChange={(e) => updateFormData('contactInfo', { ...formData.contactInfo, name: e.target.value })}
                className="form-input-enhanced"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الواتساب (اختياري)
              </label>
              <Input
                type="tel"
                placeholder="05xxxxxxxx"
                value={formData.contactInfo.whatsapp || ''}
                onChange={(e) => updateFormData('contactInfo', { ...formData.contactInfo, whatsapp: e.target.value })}
                className="form-input-enhanced"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleSubmitForm}
              disabled={!selectedLocation || !formData.propertyType || !formData.area || !formData.price || !formData.description || !formData.contactInfo.name.trim()}
              className="flex-1 bg-[#01411C] hover:bg-[#065f41] text-white disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              {config.submitText}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setCurrentView('offers')}
              className="px-8 border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-white"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // مكون بطاقة العرض المحسن
  const OfferCard = ({ offer }: { offer: Offer }) => {
    const isRequest = offer.ownerType === "moshtari" || offer.ownerType === "mosta2jer";
    
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-[#D4AF37]/20">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg text-[#01411C] leading-tight">{offer.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge 
                  variant={offer.type === "sale" ? "default" : "secondary"} 
                  className={`text-xs ${isRequest ? 'bg-blue-100 text-blue-800' : ''}`}
                >
                  {isRequest ? (offer.type === "sale" ? "طلب شراء" : "طلب إيجار") : (offer.type === "sale" ? "للبيع" : "للإيجار")}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {offer.ownerType === "baye3" ? "🏠 بائع" : 
                   offer.ownerType === "moshtari" ? "🔍 مشتري" :
                   offer.ownerType === "mo2ager" ? "🏠 مؤجر" : "🔍 مستأجر"}
                </Badge>
              </div>
            </div>
            <div className="text-left">
              <p className="font-bold text-[#D4AF37] text-lg">
                {offer.price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {isRequest ? (offer.type === "sale" ? "ميزانية" : "ميزانية/شهر") : (offer.type === "sale" ? "ريال" : "ريال/شهر")}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-medium">{offer.location.address}</span>
            <Badge variant="outline" className="text-xs ml-auto">
              {saudiCities.find(c => c.name === offer.location.address)?.region || 'المملكة العربية السعودية'}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">{offer.description}</p>
          
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {offer.features.slice(0, 4).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {offer.features.length > 4 && (
                <Badge variant="outline" className="text-xs bg-gray-100">
                  +{offer.features.length - 4} المزيد
                </Badge>
              )}
            </div>
          </div>

          {/* معلومات التواصل */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{offer.contactInfo.name}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                  <Phone className="w-3 h-3 mr-1" />
                  اتصال
                </Button>
                <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  واتساب
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs px-2 py-1 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white"
                  onClick={() => {
                    setSelectedOffer(offer);
                    setShowRightSlider(true);
                    setRightSliderContent("offer-details");
                  }}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  عرض تفصيلي
                </Button>
              </div>
            </div>
          </div>

          {/* عرض الوسطاء في Accordion */}
          {offer.brokerProposals && offer.brokerProposals.length > 0 && (
            <Accordion type="single" collapsible>
              <AccordionItem value="brokers">
                <AccordionTrigger className="text-sm font-medium text-[#01411C]">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>عروض الوسطاء ({offer.brokerProposals.length})</span>
                    <Badge variant="outline" className="text-xs">
                      {offer.brokerProposals.filter(b => b.status === "pending").length} جديد
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                  {offer.brokerProposals.map((broker) => (
                    <div key={broker.id} className="bg-white border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-[#01411C]">{broker.brokerName}</h5>
                          <p className="text-sm text-gray-600">💰 عمولة: {broker.commission}%</p>
                          <p className="text-sm text-gray-600">⏱️ المدة المتوقعة: {broker.timeline}</p>
                        </div>
                        <Badge variant={
                          broker.status === "pending" ? "secondary" :
                          broker.status === "accepted" ? "default" : "destructive"
                        }>
                          {broker.status === "pending" ? "⏳ قيد المراجعة" :
                           broker.status === "accepted" ? "✅ مقبول" : "❌ مرفوض"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                        📋 <strong>الاستراتيجية:</strong> {broker.strategy}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="w-3 h-3 mr-1" />
                          اتصال
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          واتساب
                        </Button>
                        {broker.status === "pending" && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleBrokerAction(offer.id, broker.id, "accept")}
                            >
                              قبول
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleBrokerAction(offer.id, broker.id, "reject")}
                            >
                              رفض
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" className="flex-1 border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-white">
              <Eye className="w-4 h-4 mr-1" />
              التفاصيل الكاملة
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="w-4 h-4 mr-1" />
              تواصل مباشر
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };



  // رسم المحتوى الرئيسي
  const renderMainContent = () => {
    switch (currentView) {
      case "roles":
        return (
          <div className="p-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-[#01411C] mb-2">
                مرحباً {currentUser.name} 👋
              </h2>
              <p className="text-gray-600">اختر دورك لبدء استخدام النظام</p>
            </div>
            <RoleTiles />
          </div>
        );

      case "crm":
        return role ? <IntegratedCRM /> : (
          <div className="p-4 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">يرجى اختيار دور أولاً من تبويب الأدوار</p>
          </div>
        );

      case "form":
        return role ? <DetailedForm /> : (
          <div className="p-4 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">يرجى اختيار دور أولاً من تبويب الأدوار</p>
          </div>
        );

      default:
        // عرض العروض والطلبات (الصفحة الافتراضية)
        return role ? <OffersListView /> : (
          <div className="p-4 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">يرجى اختيار دور أولاً من تبويب الأدوار</p>
          </div>
        );
    }
  };

  // مكون عرض قائمة العروض
  const OffersListView = () => {
    const roleFilteredOffers = offers.filter(offer => {
      if (!role) return false;
      
      if (role === "baye3") return offer.ownerType === "baye3";
      if (role === "moshtari") return offer.ownerType === "moshtari";
      if (role === "mo2ager") return offer.ownerType === "mo2ager";
      if (role === "mosta2jer") return offer.ownerType === "mosta2jer";
      
      return false;
    });

    return (
      <div className="space-y-4 p-4">
        {/* Header مع أزرار الإضافة */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentView("roles")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              تغيير النوع
            </Button>
            <div>
              <h2 className="font-semibold text-[#01411C]">
                {role === "baye3" ? "العروض للبيع" :
                 role === "moshtari" ? "طلبات الشراء" :
                 role === "mo2ager" ? "العروض للإيجار" : "طلبات الإيجار"}
              </h2>
              <p className="text-sm text-gray-600">
                {roleFilteredOffers.length} عنصر متاح
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => setCurrentView("form")}
              className={
                role === "baye3" || role === "mo2ager" 
                  ? "bg-[#01411C] hover:bg-[#065f41] text-white"
                  : "bg-[#D4AF37] hover:bg-[#b8941f] text-[#01411C]"
              }
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              {role === "baye3" || role === "mo2ager" ? "إضافة عرض" : "إضافة طلب"}
            </Button>
          </div>
        </div>

        {/* قائمة العروض */}
        <div className="grid gap-4">
          {roleFilteredOffers.map(offer => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
          
          {roleFilteredOffers.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">لا توجد عروض حالياً</h3>
              <p className="text-gray-500 mb-4">ابدأ بإضافة أول عرض أو طلب لك</p>
              <Button
                onClick={() => setCurrentView("form")}
                className="bg-[#01411C] hover:bg-[#065f41]"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                {role === "baye3" || role === "mo2ager" ? "إضافة عرض" : "إضافة طلب"}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#01411C] font-medium">جاري تحميل النظام التفصيلي المحسن...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 touch-scroll-smooth" dir="rtl">
      
      {/* النظام المتقدم الجديد المطلوب - مع التحسينات */}
      <NewAdvancedSystemEnhanced />

      {/* Left Slider للتنقل */}
      <LeftSliderComplete 
        isOpen={showLeftSlider}
        onClose={() => setShowLeftSlider(false)}
        currentUser={{
          name: currentUser.name,
          phone: currentUser.phone,
          type: currentUser.type
        }}
        onNavigate={(page) => {
          handleSafeNavigate(page);
          setShowLeftSlider(false);
        }}
        mode="tools"
      />

      {/* Right Slider للوسطاء */}
      <RightSliderComplete 
        isOpen={showRightSlider}
        onClose={() => setShowRightSlider(false)}
        currentPage={undefined}
        mode="navigation"
        onNavigate={(page) => {
          handleSafeNavigate(page);
          setShowRightSlider(false);
        }}
      />

      {/* Main Content - النظام الأصلي */}
      <div className="pb-20" style={{ display: 'none' }}>
        {renderMainContent()}
      </div>

      {/* Bottom Navigation - محسن مع CRM */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#D4AF37]/20 p-4 z-50 backdrop-blur-sm">
        <div className="flex justify-center gap-2 max-w-lg mx-auto">
          <button
            onClick={() => setCurrentView('roles')}
            className={`flex-1 touch-manipulation text-sm px-2 py-2 rounded transition-colors flex items-center justify-center gap-1 ${
              currentView === 'roles' 
                ? 'bg-[#01411C] text-white' 
                : 'border border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">الأدوار</span>
          </button>
          
          <button
            onClick={() => setCurrentView('offers')}
            disabled={!role}
            className={`flex-1 touch-manipulation text-sm px-2 py-2 rounded transition-colors flex items-center justify-center gap-1 ${
              currentView === 'offers' 
                ? 'bg-[#01411C] text-white' 
                : 'border border-gray-200 bg-white hover:bg-gray-50'
            } ${!role ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">العروض</span>
          </button>
          
          <button
            onClick={() => setCurrentView('form')}
            disabled={!role}
            className={`flex-1 touch-manipulation text-sm px-2 py-2 rounded transition-colors flex items-center justify-center gap-1 ${
              currentView === 'form' 
                ? 'bg-[#01411C] text-white' 
                : 'border border-gray-200 bg-white hover:bg-gray-50'
            } ${!role ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">إضافة</span>
          </button>

          <button
            onClick={() => setCurrentView('crm')}
            disabled={!role}
            className={`flex-1 touch-manipulation text-sm px-2 py-2 rounded transition-colors flex items-center justify-center gap-1 ${
              currentView === 'crm' 
                ? 'bg-[#D4AF37] text-[#01411C]' 
                : 'border border-gray-200 bg-white hover:bg-gray-50'
            } ${!role ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">CRM</span>
          </button>
        </div>
      </div>

      {/* Floating Action Button للوصول السريع للسحب التفاعلي */}
      {role && enhancedBrokers.length > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="fixed bottom-24 left-4 z-40"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSwipeCards(true)}
            className="w-16 h-16 bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] text-[#01411C] rounded-full shadow-2xl flex items-center justify-center font-bold text-xl hover:shadow-3xl transition-all duration-300"
            title="تصفح الوسطاء بالسحب التفاعلي"
          >
            <Heart className="w-8 h-8" />
          </motion.button>
          
          {/* نص توضيحي */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            سحب تفاعلي للوسطاء
          </div>
        </motion.div>
      )}

      {/* Enhanced Right Slider - الأصلي المحسن */}
      <EnhancedRightSlider />

      {/* Swipeable Broker Cards - نظام السحب التفاعلي الجديد */}
      <SwipeableBrokerCards />

      {/* Google Maps Picker - محسن */}
      <MapPicker
        isOpen={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onAddressSelect={handleAddressSelect}
        address={selectedLocation}
      />

      {/* Loading Overlay - محسن */}
      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-xl p-8 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[#01411C] font-medium text-lg">جاري التحميل...</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  // النظام المتقدم الجديد المطلوب - محسن مع جميع الميزات
  function NewAdvancedSystemEnhanced() {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden relative">

        {/* 🔹 Header with Back Button */}
        <div className="absolute top-0 left-0 right-0 z-40 bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate && onNavigate('registration')}
              className="flex items-center gap-2 text-[#01411C] hover:text-[#D4AF37] hover:bg-[#f0fdf4]"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>العودة</span>
            </Button>
            
            <div className="text-center">
              <h1 className="text-lg font-bold text-[#01411C]">
                النظام التفصيلي المحسن
              </h1>
            </div>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* 🔹 Top Role Tiles - محسنة */}
        <div className="absolute top-16 left-0 right-0 z-30 bg-white shadow-sm">
          <div className="grid grid-cols-4 gap-2 p-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className={`p-3 text-center cursor-pointer transition-all duration-300 touch-manipulation ${
                  role === "baye3" 
                    ? "bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-300 shadow-md" 
                    : "bg-green-100 hover:bg-green-150 border border-green-200"
                }`}
                onClick={() => handleRoleSelect("baye3")}
              >
                <div className="flex flex-col items-center gap-1">
                  <Home className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">بائع</span>
                </div>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className={`p-3 text-center cursor-pointer transition-all duration-300 touch-manipulation ${
                  role === "moshtari" 
                    ? "bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300 shadow-md" 
                    : "bg-yellow-100 hover:bg-yellow-150 border border-yellow-200"
                }`}
                onClick={() => handleRoleSelect("moshtari")}
              >
                <div className="flex flex-col items-center gap-1">
                  <User className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium">مشتري</span>
                </div>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className={`p-3 text-center cursor-pointer transition-all duration-300 touch-manipulation ${
                  role === "mo2ager" 
                    ? "bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-300 shadow-md" 
                    : "bg-purple-100 hover:bg-purple-150 border border-purple-200"
                }`}
                onClick={() => handleRoleSelect("mo2ager")}
              >
                <div className="flex flex-col items-center gap-1">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium">مؤجر</span>
                </div>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className={`p-3 text-center cursor-pointer transition-all duration-300 touch-manipulation ${
                  role === "mosta2jer" 
                    ? "bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300 shadow-md" 
                    : "bg-blue-100 hover:bg-blue-150 border border-blue-200"
                }`}
                onClick={() => handleRoleSelect("mosta2jer")}
              >
                <div className="flex flex-col items-center gap-1">
                  <KeyRound className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">مستأجر</span>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* 🔹 Main Content Area - محسن */}
        <div className="flex-1 overflow-y-auto scrollable-container pt-32 pb-20">
          {!role && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-24 h-24 bg-gradient-to-br from-[#01411C] to-[#065f41] rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Home className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-[#01411C] mb-2">مرحباً بك في النظام المتقدم</h3>
                <p className="text-gray-500">اختر دورك من الأعلى لبدء الاستخدام</p>
              </div>
            </div>
          )}

          {/* نظام CRM المدمج */}
          {role && showCRM && <IntegratedCRM />}

          {/* نماذج البائع / المؤجر - محسنة */}
          {(role === "baye3" || role === "mo2ager") && !showCRM && (
            <div className="p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#01411C] to-[#065f41] rounded-lg flex items-center justify-center">
                      {role === "baye3" ? <Home className="w-6 h-6 text-white" /> : <Building2 className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#01411C]">
                        {role === "baye3" ? "خيارات البائع" : "خيارات المؤجر"}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {role === "baye3" ? "أضف عقارك للبيع واحصل على أفضل العروض" : "أضف عقارك للإيجار وابحث عن أفضل المستأجرين"}
                      </p>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="send-offer" className="border border-[#D4AF37]/20 rounded-lg">
                      <AccordionTrigger className="px-4 py-3 hover:bg-[#D4AF37]/5 rounded-t-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
                            <PlusCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">📤 تقديم عرض جديد</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <motion.form 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input 
                              placeholder="الاسم الكامل" 
                              className="form-input-enhanced"
                              value={formData.contactInfo.name}
                              onChange={(e) => updateFormData('contactInfo', { 
                                ...formData.contactInfo, 
                                name: e.target.value 
                              })}
                            />
                            <Input 
                              placeholder="رقم الهاتف" 
                              className="form-input-enhanced"
                              value={formData.contactInfo.phone}
                              onChange={(e) => updateFormData('contactInfo', { 
                                ...formData.contactInfo, 
                                phone: e.target.value 
                              })}
                            />
                          </div>
                          
                          {/* زر فتح خرائط Google - محسن */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="button"
                              onClick={() => setShowMapPicker(true)}
                              className="w-full bg-gradient-to-r from-[#01411C] to-[#065f41] hover:from-[#065f41] hover:to-[#01411C] text-white py-4 flex items-center gap-3 rounded-lg text-lg font-medium shadow-lg"
                            >
                              <MapPin className="w-6 h-6" />
                              📍 تحديد موقع العقار بدقة
                            </Button>
                          </motion.div>
                          
                          {/* عرض تفاصيل العنوان المحدد */}
                          {selectedLocation && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-4"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-800">تم تحديد الموقع بنجاح</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {selectedLocation.city && (
                                  <div className="bg-white/50 p-2 rounded">
                                    <strong>المدينة:</strong> {selectedLocation.city}
                                  </div>
                                )}
                                {selectedLocation.district && (
                                  <div className="bg-white/50 p-2 rounded">
                                    <strong>الحي:</strong> {selectedLocation.district}
                                  </div>
                                )}
                                {selectedLocation.street && (
                                  <div className="bg-white/50 p-2 rounded">
                                    <strong>الشارع:</strong> {selectedLocation.street}
                                  </div>
                                )}
                                {selectedLocation.postalCode && (
                                  <div className="bg-white/50 p-2 rounded">
                                    <strong>الرمز البريدي:</strong> {selectedLocation.postalCode}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input 
                              placeholder="نوع العقار (فيلا، شقة، إلخ)" 
                              className="form-input-enhanced"
                              value={formData.propertyType}
                              onChange={(e) => updateFormData('propertyType', e.target.value)}
                            />
                            <Input 
                              placeholder="المساحة (م²)" 
                              className="form-input-enhanced"
                              value={formData.area}
                              onChange={(e) => updateFormData('area', e.target.value)}
                            />
                            <Input 
                              placeholder={role === "baye3" ? "السعر الإجمالي" : "الإيجار الشهري"} 
                              className="form-input-enhanced"
                              value={formData.price}
                              onChange={(e) => updateFormData('price', e.target.value)}
                            />
                            <Input 
                              placeholder="عدد الغرف" 
                              className="form-input-enhanced"
                              value={formData.rooms || ''}
                              onChange={(e) => updateFormData('rooms', e.target.value)}
                            />
                          </div>
                          
                          <Textarea 
                            placeholder="وصف تفصيلي للعقار..." 
                            className="form-input-enhanced min-h-[100px]"
                            value={formData.description}
                            onChange={(e) => updateFormData('description', e.target.value)}
                          />
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              type="button"
                              onClick={handleSubmitForm}
                              disabled={!selectedLocation || !formData.propertyType || !formData.area || !formData.price}
                              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] hover:from-[#f1c40f] hover:to-[#D4AF37] text-[#01411C] py-3 font-bold text-lg shadow-lg disabled:opacity-50"
                            >
                              <PlusCircle className="w-5 h-5 mr-2" />
                              {role === "baye3" ? "إضافة عرض البيع" : "إضافة عرض الإيجار"}
                            </Button>
                          </motion.div>
                        </motion.form>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="my-offers" className="border border-[#D4AF37]/20 rounded-lg">
                      <AccordionTrigger className="px-4 py-3 hover:bg-[#D4AF37]/5 rounded-t-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <Home className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">📂 عروضي ({offers.filter(offer => offer.ownerType === role).length})</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4">
                          {offers.filter(offer => offer.ownerType === role).map((offer) => (
                            <motion.div 
                              key={offer.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <h4 className="font-bold text-[#01411C] text-lg">{offer.title}</h4>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-4 h-4" />
                                      <span>{offer.contactInfo.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      <span>{offer.location.address}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold text-[#D4AF37]">
                                    {offer.price.toLocaleString()} ريال
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {offer.type === "sale" ? "سعر ا��بيع" : "شهرياً"}
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mb-3">
                                {offer.description}
                              </p>

                              {/* عرض الوسطاء بطريقة محسنة داخل البطاقة */}
                              {offer.brokerProposals && offer.brokerProposals.length > 0 && (
                                <div className="border-t border-gray-200 pt-3">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      <Users className="w-5 h-5 text-[#01411C]" />
                                      <span className="font-medium text-[#01411C]">عروض الوسطاء</span> 
                                      <Badge className="bg-[#D4AF37] text-white">
                                        {offer.brokerProposals.length}
                                      </Badge>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-[#01411C] text-[#01411C] hover:bg-[#01411C] hover:text-white"
                                        onClick={() => {
                                          setSelectedOffer(offer);
                                          setShowRightSlider(true);
                                        }}
                                      >
                                        <Eye className="w-4 h-4 mr-1" />
                                        عرض تفصيلي
                                      </Button>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                          setSelectedOffer(offer);
                                          setShowSwipeCards(true);
                                        }}
                                        className="px-3 py-2 bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] text-[#01411C] rounded-md text-sm font-bold flex items-center gap-1 shadow-md hover:shadow-lg transition-all"
                                        title="تصفح تفاعلي بالسحب"
                                      >
                                        <Heart className="w-4 h-4" />
                                        سحب
                                      </motion.button>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    {offer.brokerProposals.map((proposal) => (
                                      <div key={proposal.id} className="bg-white border border-gray-200 rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-2">
                                          <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                                              <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                              <h5 className="font-medium text-[#01411C]">{proposal.brokerName}</h5>
                                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span>💰 عمولة: {proposal.commission}%</span>
                                                <span>⏱️ المدة: {proposal.timeline}</span>
                                              </div>
                                            </div>
                                          </div>
                                          <Badge variant={
                                            proposal.status === "pending" ? "secondary" :
                                            proposal.status === "accepted" ? "default" : "destructive"
                                          }>
                                            {proposal.status === "pending" ? "⏳ قيد المراجعة" :
                                             proposal.status === "accepted" ? "✅ مقبول" : "❌ مرفوض"}
                                          </Badge>
                                        </div>
                                        
                                        <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded mb-3">
                                          📋 <strong>الاستراتيجية:</strong> {proposal.strategy}
                                        </p>
                                        
                                        <div className="flex gap-2">
                                          <Button size="sm" variant="outline" className="flex-1">
                                            <Phone className="w-3 h-3 mr-1" />
                                            اتصال
                                          </Button>
                                          <Button size="sm" variant="outline" className="flex-1 border-green-500 text-green-600 hover:bg-green-50">
                                            <MessageCircle className="w-3 h-3 mr-1" />
                                            واتساب
                                          </Button>
                                          {proposal.status === "pending" && (
                                            <>
                                              <Button 
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                onClick={() => handleBrokerAction(offer.id, proposal.id, "accept")}
                                              >
                                                قبول
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant="destructive"
                                                onClick={() => handleBrokerAction(offer.id, proposal.id, "reject")}
                                              >
                                                رفض
                                              </Button>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {(!offer.brokerProposals || offer.brokerProposals.length === 0) && (
                                <div className="text-center py-4 text-gray-500 border-t border-gray-200">
                                  <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                  <p className="text-sm">لا توجد عروض من الوسطاء بعد</p>
                                  <p className="text-xs">سيتم إشعارك عند تلقي عروض جديدة</p>
                                </div>
                              )}
                            </motion.div>
                          ))}
                          
                          {offers.filter(offer => offer.ownerType === role).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <Home className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p className="font-medium mb-1">لا توجد عروض حالياً</p>
                              <p className="text-sm">ابدأ بإضافة أول عرض لك</p>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </motion.div>
            </div>
          )}

          {/* نماذج المشتري / المستأجر - محسنة */}
          {(role === "moshtari" || role === "mosta2jer") && !showCRM && (
            <div className="p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      {role === "moshtari" ? <User className="w-6 h-6 text-white" /> : <KeyRound className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#01411C]">
                        {role === "moshtari" ? "خيارات المشتري" : "خيارات المستأجر"}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {role === "moshtari" ? "اطلب العقار المناسب واحصل على أفضل العروض" : "ابحث عن العقار المثالي للإيجار"}
                      </p>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="send-request" className="border border-[#D4AF37]/20 rounded-lg">
                      <AccordionTrigger className="px-4 py-3 hover:bg-[#D4AF37]/5 rounded-t-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
                            <PlusCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">📝 تقديم طلب جديد</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <motion.form 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input 
                              placeholder="الاسم الكامل" 
                              className="form-input-enhanced"
                              value={formData.contactInfo.name}
                              onChange={(e) => updateFormData('contactInfo', { 
                                ...formData.contactInfo, 
                                name: e.target.value 
                              })}
                            />
                            <Input 
                              placeholder="رقم الهاتف" 
                              className="form-input-enhanced"
                              value={formData.contactInfo.phone}
                              onChange={(e) => updateFormData('contactInfo', { 
                                ...formData.contactInfo, 
                                phone: e.target.value 
                              })}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input 
                              placeholder="المدينة المطلوبة" 
                              className="form-input-enhanced"
                              value={formData.city || ''}
                              onChange={(e) => updateFormData('city', e.target.value)}
                            />
                            <Input 
                              placeholder="الحي المفضل" 
                              className="form-input-enhanced"
                              value={formData.district || ''}
                              onChange={(e) => updateFormData('district', e.target.value)}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input 
                              placeholder={role === "moshtari" ? "الميزانية المتاحة" : "الميزانية الشهرية"} 
                              className="form-input-enhanced"
                              value={formData.price}
                              onChange={(e) => updateFormData('price', e.target.value)}
                            />
                            <Input 
                              placeholder="عدد الغرف المطلوب" 
                              className="form-input-enhanced"
                              value={formData.requiredRooms || ''}
                              onChange={(e) => updateFormData('requiredRooms', e.target.value)}
                            />
                          </div>

                          <Input 
                            placeholder="نوع العقار المطلوب (فيلا، شقة، إلخ)" 
                            className="form-input-enhanced"
                            value={formData.propertyType}
                            onChange={(e) => updateFormData('propertyType', e.target.value)}
                          />
                          
                          <Textarea 
                            placeholder="وصف متطلباتك وأي ملاحظات إضافية..." 
                            className="form-input-enhanced min-h-[100px]"
                            value={formData.description}
                            onChange={(e) => updateFormData('description', e.target.value)}
                          />
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              type="button"
                              onClick={handleSubmitForm}
                              disabled={!formData.city || !formData.price || !formData.description}
                              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] hover:from-[#f1c40f] hover:to-[#D4AF37] text-[#01411C] py-3 font-bold text-lg shadow-lg disabled:opacity-50"
                            >
                              <PlusCircle className="w-5 h-5 mr-2" />
                              {role === "moshtari" ? "إضافة طلب الشراء" : "إضافة طلب الإيجار"}
                            </Button>
                          </motion.div>
                        </motion.form>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="my-requests" className="border border-[#D4AF37]/20 rounded-lg">
                      <AccordionTrigger className="px-4 py-3 hover:bg-[#D4AF37]/5 rounded-t-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Search className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">📂 طلباتي ({offers.filter(offer => offer.ownerType === role).length})</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4">
                          {offers.filter(offer => offer.ownerType === role).map((offer) => (
                            <motion.div 
                              key={offer.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-gradient-to-r from-white to-blue-50 border-2 border-blue-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <h4 className="font-bold text-[#01411C] text-lg">{offer.title}</h4>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-4 h-4" />
                                      <span>{offer.contactInfo.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      <span>{offer.location.address}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold text-blue-600">
                                    {offer.price.toLocaleString()} ريال
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {role === "moshtari" ? "ميزانية متاحة" : "ميزانية شهرية"}
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg mb-3">
                                {offer.description}
                              </p>

                              {/* عرض عروض الوسطاء للطلبات */}
                              {offer.brokerProposals && offer.brokerProposals.length > 0 && (
                                <div className="border-t border-blue-200 pt-3">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      <Users className="w-5 h-5 text-blue-600" />
                                      <span className="font-medium text-blue-800">العروض المناسبة</span> 
                                      <Badge className="bg-blue-500 text-white">
                                        {offer.brokerProposals.length}
                                      </Badge>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                                      onClick={() => {
                                        setSelectedOffer(offer);
                                        setShowRightSlider(true);
                                      }}
                                    >
                                      <Eye className="w-4 h-4 mr-1" />
                                      عرض تفصيلي
                                    </Button>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    {offer.brokerProposals.map((proposal) => (
                                      <div key={proposal.id} className="bg-white border border-blue-200 rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-2">
                                          <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                              <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                              <h5 className="font-medium text-[#01411C]">{proposal.brokerName}</h5>
                                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span>💰 عمولة: {proposal.commission}%</span>
                                                <span>⏱️ يمكن إيجاد خلال: {proposal.timeline}</span>
                                              </div>
                                            </div>
                                          </div>
                                          <Badge variant={
                                            proposal.status === "pending" ? "secondary" :
                                            proposal.status === "accepted" ? "default" : "destructive"
                                          }>
                                            {proposal.status === "pending" ? "⏳ قيد المراجعة" :
                                             proposal.status === "accepted" ? "✅ مقبول" : "❌ مرفوض"}
                                          </Badge>
                                        </div>
                                        
                                        <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded mb-3">
                                          📋 <strong>خطة البحث:</strong> {proposal.strategy}
                                        </p>
                                        
                                        <div className="flex gap-2">
                                          <Button size="sm" variant="outline" className="flex-1">
                                            <Phone className="w-3 h-3 mr-1" />
                                            اتصال
                                          </Button>
                                          <Button size="sm" variant="outline" className="flex-1 border-green-500 text-green-600 hover:bg-green-50">
                                            <MessageCircle className="w-3 h-3 mr-1" />
                                            واتساب
                                          </Button>
                                          {proposal.status === "pending" && (
                                            <>
                                              <Button 
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                onClick={() => handleBrokerAction(offer.id, proposal.id, "accept")}
                                              >
                                                قبول
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant="destructive"
                                                onClick={() => handleBrokerAction(offer.id, proposal.id, "reject")}
                                              >
                                                رفض
                                              </Button>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {(!offer.brokerProposals || offer.brokerProposals.length === 0) && (
                                <div className="text-center py-4 text-gray-500 border-t border-blue-200">
                                  <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                  <p className="text-sm">الوسطاء يبحثون عن العقار المناسب لك</p>
                                  <p className="text-xs">سيتم إشعارك عند العثور على عروض مناسبة</p>
                                </div>
                              )}
                            </motion.div>
                          ))}
                          
                          {offers.filter(offer => offer.ownerType === role).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p className="font-medium mb-1">لا توجد طلبات حالياً</p>
                              <p className="text-sm">ابدأ بإضافة أول طلب لك</p>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* 🔹 Bottom Bar - محسن مع جميع الميزات */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#D4AF37]/20 shadow-2xl backdrop-blur-sm z-40">
          <div className="flex justify-between items-center p-3 max-w-2xl mx-auto">
            {/* Left Slider Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowLeftSlider(true)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-[#01411C]/10 transition-colors touch-manipulation"
            >
              <Menu className="w-5 h-5 text-[#01411C]" />
              <span className="text-xs text-[#01411C] font-medium">القائمة</span>
            </motion.button>

            {/* CRM Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowCRM(!showCRM)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors touch-manipulation ${
                showCRM ? 'bg-[#D4AF37]/20 text-[#01411C]' : 'hover:bg-[#01411C]/10 text-[#01411C]'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="text-xs font-medium">CRM</span>
            </motion.button>

            {/* Analytics Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-[#01411C]/10 transition-colors touch-manipulation"
            >
              <BarChart className="w-5 h-5 text-[#01411C]" />
              <span className="text-xs text-[#01411C] font-medium">التحليلات</span>
            </motion.button>

            {/* Home Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowCRM(false)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors touch-manipulation ${
                !showCRM ? 'bg-[#01411C]/20 text-[#01411C]' : 'hover:bg-[#01411C]/10 text-[#01411C]'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">الرئيسية</span>
            </motion.button>

            {/* Right Slider Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowRightSlider(true)}
              className="relative flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-[#01411C]/10 transition-colors touch-manipulation"
            >
              <Users className="w-5 h-5 text-[#01411C]" />
              <span className="text-xs text-[#01411C] font-medium">الوسطاء</span>
              {enhancedBrokers.length > 0 && (
                <Badge className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-white text-xs rounded-full p-0 flex items-center justify-center">
                  {enhancedBrokers.length}
                </Badge>
              )}
            </motion.button>
          </div>
        </div>

        {/* 🔹 Floating Action Buttons */}
        <div className="fixed bottom-24 right-5 flex flex-col gap-3 z-30">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] rounded-full shadow-lg flex items-center justify-center touch-manipulation"
          >
            <Bell className="w-6 h-6 text-white" />
            <Badge className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full p-0 flex items-center justify-center">
              3
            </Badge>
          </motion.button>

          {/* Add New */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-gradient-to-r from-[#01411C] to-[#065f41] rounded-full shadow-xl flex items-center justify-center touch-manipulation"
          >
            <PlusCircle className="w-8 h-8 text-white" />
          </motion.button>
        </div>
      </div>
    );
  }

  // مكون CRM المدمج - مبسط وفعال
  function IntegratedCRM() {
    const crmData = {
      contacts: [
        { id: 1, name: "أحمد السعيد", type: "عميل محتمل", phone: "0501234567", status: "جديد", lastContact: "اليوم" },
        { id: 2, name: "فاطمة العلي", type: "عميل حالي", phone: "0509876543", status: "متابعة", lastContact: "أمس" },
        { id: 3, name: "محمد الأحمد", type: "وسيط", phone: "0555666777", status: "نشط", lastContact: "3 أيام" }
      ],
      tasks: [
        { id: 1, title: "متابعة عميل الفيلا", priority: "عالية", dueDate: "اليوم", completed: false },
        { id: 2, title: "معاينة الشقة مع العميل", priority: "متوسطة", dueDate: "غداً", completed: false },
        { id: 3, title: "إرسال العقد للمراجعة", priority: "منخفضة", dueDate: "بعد غد", completed: true }
      ]
    };

    return (
      <div className="p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#01411C]">نظام إدار�� العلاقات</h2>
              <p className="text-sm text-gray-600">إدارة العملاء والمهام والمتابعات</p>
            </div>
          </div>

          <Tabs defaultValue="contacts" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contacts">جهات الاتصال</TabsTrigger>
              <TabsTrigger value="tasks">المهام</TabsTrigger>
              <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            </TabsList>

            <TabsContent value="contacts" className="space-y-4">
              {crmData.contacts.map((contact) => (
                <div key={contact.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#01411C]">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.type}</p>
                        <p className="text-xs text-gray-500">آخر ات��ال: {contact.lastContact}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={contact.status === "نشط" ? "default" : "secondary"}>
                        {contact.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Phone className="w-3 h-3 mr-1" />
                        اتصال
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              {crmData.tasks.map((task) => (
                <div key={task.id} className={`bg-gray-50 rounded-lg p-4 border border-gray-200 ${task.completed ? 'opacity-60' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        className="w-4 h-4 text-[#01411C] rounded border-gray-300"
                        readOnly
                      />
                      <div>
                        <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-[#01411C]'}`}>
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-600">استحقاق: {task.dueDate}</p>
                      </div>
                    </div>
                    <Badge variant={
                      task.priority === "عالية" ? "destructive" :
                      task.priority === "متوسطة" ? "default" : "secondary"
                    }>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-[#01411C]">{crmData.contacts.length}</div>
                    <div className="text-sm text-gray-600">إجمالي جهات الاتصال</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {crmData.tasks.filter(t => t.completed).length}
                    </div>
                    <div className="text-sm text-gray-600">مهام مكتملة</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {crmData.tasks.filter(t => !t.completed).length}
                    </div>
                    <div className="text-sm text-gray-600">مهام معلقة</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-[#D4AF37]">85%</div>
                    <div className="text-sm text-gray-600">معدل الإنجاز</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    );
  }
}