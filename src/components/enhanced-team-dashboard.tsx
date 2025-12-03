"use client";

import { useState, useCallback } from "react";
import {
  Bell,
  PlusCircle,
  Users,
  Home,
  BarChart,
  Menu,
  MessageCircle,
  Phone,
  MapPin,
  Star,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  Building2,
  Key,
  DollarSign,
  Timer,
  Eye,
  Edit,
  Send,
  Bookmark,
  Search,
  Filter,
  Trash2,
  Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { motion, AnimatePresence } from "motion/react";
import NotificationsCore from "../core/ai-cores/AI_NotificationsEnhancedCore";

// أنواع الأدوار
type UserRole = "seller" | "buyer" | "landlord" | "renter";

// واجهة البيانات
interface BrokerData {
  id: number;
  name: string;
  rating: number;
  contact: string;
  whatsapp?: string;
  offers: string[];
  speciality: string;
  experience: string;
  location: string;
  verified: boolean;
  responseTime: string;
}

interface OfferRequest {
  id: string;
  title: string;
  type: "offer" | "request";
  category: "sale" | "rent";
  price: string;
  location: string;
  description: string;
  features: string[];
  status: "active" | "pending" | "completed";
  createdAt: Date;
  brokerResponses?: BrokerData[];
}

// بيانات الوسطاء المحدثة
const sampleBrokers: BrokerData[] = [
  {
    id: 1,
    name: "أحمد محمد الوسيط",
    rating: 4.8,
    contact: "+966501234567",
    whatsapp: "+966501234567",
    offers: ["شقة 3 غرف - حي النرجس", "فيلا صغيرة - حي الياسمين"],
    speciality: "عقارات سكنية",
    experience: "7 سنوات",
    location: "الرياض - شمال",
    verified: true,
    responseTime: "خلال ساعة"
  },
  {
    id: 2,
    name: "سارة أحمد العقارية",
    rating: 4.5,
    contact: "+966509876543",
    whatsapp: "+966509876543", 
    offers: ["أرض سكنية - حي الملقا", "مكتب تجاري - حي العليا"],
    speciality: "أراضي ومكاتب",
    experience: "5 سنوات",
    location: "الرياض - وسط",
    verified: true,
    responseTime: "خلال 30 دقيقة"
  },
  {
    id: 3,
    name: "محمد صالح الإقليمي",
    rating: 4.9,
    contact: "+966512345678",
    whatsapp: "+966512345678",
    offers: ["شاليه مفروش - أبحر", "استراحة عائلية - طريق المطار"],
    speciality: "عقارات ترفيهية",
    experience: "10 سنوات",
    location: "جدة - شمال",
    verified: true,
    responseTime: "فوري"
  }
];

// خيارات ميزات العقار
const propertyFeatures = [
  "مدخل منفصل",
  "مدخل مزدوج", 
  "زاوية",
  "دور أرضي",
  "دور علوي",
  "ملحق",
  "غرفة خادمة",
  "غرفة غسيل",
  "جاكوزي",
  "دش مطري",
  "منزل ذكي",
  "دخول ذكي",
  "مسبح",
  "ملعب أطفال",
  "حديقة",
  "مصعد",
  "مجلس خارجي",
  "تراس خاص",
  "مفروش",
  "مطبخ مجهز",
  "أجهزة كهربائية"
];

interface EnhancedTeamDashboardProps {
  onBack?: () => void;
  user?: any;
}

export function EnhancedTeamDashboard({ onBack, user }: EnhancedTeamDashboardProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showRightSlider, setShowRightSlider] = useState(false);
  const [activeTab, setActiveTab] = useState("roles");
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    description: "",
    features: [] as string[],
    propertyType: "",
    rooms: "",
    bathrooms: ""
  });

  const [offers, setOffers] = useState<OfferRequest[]>([]);
  const [expandedBroker, setExpandedBroker] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "pending" | "completed">("all");

  // معالجة تغيير البيانات
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // معالجة الميزات
  const handleFeatureToggle = useCallback((feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  }, []);

  // إرسال العرض أو الطلب
  const handleSubmit = useCallback(async () => {
    if (formData.title && formData.price && formData.location && selectedRole) {
      const newItem: OfferRequest = {
        id: Date.now().toString(),
        title: formData.title,
        type: ["seller", "landlord"].includes(selectedRole) ? "offer" : "request",
        category: ["seller", "buyer"].includes(selectedRole) ? "sale" : "rent",
        price: formData.price,
        location: formData.location,
        description: formData.description,
        features: formData.features,
        status: "active",
        createdAt: new Date(),
        brokerResponses: selectedRole ? sampleBrokers.slice(0, 2) : []
      };

      setOffers(prev => [newItem, ...prev]);
      
      // 🔔 إرسال إشعار عند إنشاء العرض
      await NotificationsCore.createAINotification({
        source: 'offers_requests',
        category: newItem.type === 'offer' ? 'offer' : 'request',
        type: 'created',
        targetId: newItem.id,
        payload: {
          title: newItem.title,
          price: newItem.price,
          location: newItem.location,
          category: newItem.category === 'sale' ? 'بيع' : 'إيجار',
          message: `تم إضافة ${newItem.type === 'offer' ? 'عرض' : 'طلب'} جديد: ${newItem.title}`
        },
        severity: 'info'
      });
      
      // 🔔 إرسال إشعار بردود الوسطاء
      if (newItem.brokerResponses && newItem.brokerResponses.length > 0) {
        await NotificationsCore.createAINotification({
          source: 'offers_requests',
          category: 'broker_response',
          type: 'received',
          targetId: newItem.id,
          payload: {
            title: newItem.title,
            brokersCount: newItem.brokerResponses.length,
            brokers: newItem.brokerResponses.map(b => ({
              name: b.name,
              rating: b.rating,
              contact: b.contact
            })),
            message: `تلقيت ${newItem.brokerResponses.length} رد من الوسطاء على ${newItem.type === 'offer' ? 'عرضك' : 'طلبك'}: ${newItem.title}`
          },
          severity: 'info'
        });
      }
      
      setFormData({
        title: "",
        price: "",
        location: "",
        description: "",
        features: [],
        propertyType: "",
        rooms: "",
        bathrooms: ""
      });
    }
  }, [formData, selectedRole]);

  // معالجة رد الوسطاء
  const handleBrokerResponse = useCallback((brokerId: number, action: "accept" | "reject", offerId?: string) => {
    if (action === "accept") {
      // جلب المستخدم الحالي
      const currentUser = JSON.parse(localStorage.getItem('aqari_current_user') || '{}');
      const userId = currentUser.id || currentUser.phone || 'guest';
      
      // جلب العرض المحدد
      const offer = offers.find(o => o.id === offerId);
      const broker = offer?.brokerResponses?.find(b => b.id === brokerId);
      
      if (!offer || !broker) {
        alert('حدث خطأ في تحميل البيانات');
        return;
      }
      
      // إنشاء عرض مقبول جديد
      const acceptedOffer = {
        id: `accepted-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        offerId: offer.id,
        offerType: offer.type,
        transactionType: offer.category,
        propertyType: offer.type === 'offer' ? 'عقار' : 'طلب',
        city: offer.location.split(' - ')[0] || 'غير محدد',
        district: offer.location.split(' - ')[1] || 'غير محدد',
        description: offer.description || offer.title,
        
        brokerId: broker.id.toString(),
        brokerName: broker.name,
        brokerPhone: broker.contact,
        brokerWhatsapp: broker.whatsapp || broker.contact,
        brokerLicense: 'رخصة وسيط معتمد',
        brokerRating: broker.rating,
        brokerBadge: broker.verified ? 'verified' : 'none',
        
        commissionPercentage: 2.5,
        
        ownerId: userId,
        ownerName: currentUser.name || 'مستخدم',
        ownerPhone: currentUser.phone || 'غير محدد',
        
        acceptedAt: new Date().toISOString(),
        status: 'accepted' as const,
        notes: `تم القبول من لوحة التحكم - ${new Date().toLocaleDateString('ar-SA')}`
      };
      
      // حفظ في accepted-offers
      const storedAcceptedOffers = localStorage.getItem('accepted-offers');
      const acceptedOffers = storedAcceptedOffers ? JSON.parse(storedAcceptedOffers) : [];
      acceptedOffers.unshift(acceptedOffer);
      localStorage.setItem('accepted-offers', JSON.stringify(acceptedOffers));
      
      // تحديث حالة العرض
      setOffers(prev => prev.map(o => 
        o.id === offerId 
          ? { ...o, status: 'completed' as const, brokerResponses: o.brokerResponses?.filter(b => b.id !== brokerId) }
          : o
      ));
      
      alert(`✅ تم قبول عرض الوسيط ${broker.name} بنجاح!\n\nيمكنك مشاهدة العروض المقبولة في قسم "اطلب وسيطك" > "العروض المقبولة"`);
      
      // ✅ console فقط في بيئة التطوير والأحداث المهمة
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ [مهم] تم حفظ العرض المقبول:', { 
          offerId: acceptedOffer.id, 
          brokerName: broker.name,
          timestamp: acceptedOffer.acceptedAt 
        });
      }
    } else {
      // رفض العرض
      setOffers(prev => prev.map(o => 
        o.id === offerId 
          ? { ...o, brokerResponses: o.brokerResponses?.filter(b => b.id !== brokerId) }
          : o
      ));
      
      alert('تم رفض عرض الوسيط');
    }
  }, [offers]);

  // ألوان الأدوار
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "seller": return "from-green-100 to-green-200 border-green-300 text-green-800";
      case "buyer": return "from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-800"; 
      case "landlord": return "from-purple-100 to-purple-200 border-purple-300 text-purple-800";
      case "renter": return "from-blue-100 to-blue-200 border-blue-300 text-blue-800";
      default: return "from-gray-100 to-gray-200 border-gray-300 text-gray-800";
    }
  };

  // عناوين الأدوار
  const getRoleTitle = (role: UserRole) => {
    switch (role) {
      case "seller": return "بائع";
      case "buyer": return "مشتري";
      case "landlord": return "مؤجر"; 
      case "renter": return "مستأجر";
      default: return "";
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7] overflow-hidden" dir="rtl">
      {/* الشريط الجانبي الأيسر */}
      <motion.div 
        className="w-20 bg-white shadow-xl flex flex-col items-center py-6 space-y-8 border-r border-[#D4AF37]/20"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-12 h-12 bg-gradient-to-br from-[#01411C] to-[#065f41] rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="w-6 h-6 text-white" />
        </motion.div>

        <div className="flex flex-col space-y-6">
          {[
            { icon: BarChart, label: "إحصائيات" },
            { icon: Users, label: "العملاء" },
            { icon: Building2, label: "العقارات" },
            { icon: Home, label: "الرئيسية" }
          ].map(({ icon: Icon, label }, index) => (
            <motion.button
              key={label}
              className="w-12 h-12 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Icon className="w-5 h-5 text-[#01411C] group-hover:text-[#D4AF37] transition-colors" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col">
        {/* الهيدر العلوي */}
        <motion.div 
          className="bg-white/90 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-sm"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between p-4">
            {onBack && (
              <Button 
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2 border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37]/10"
              >
                <ArrowRight className="w-4 h-4" />
                العودة
              </Button>
            )}

            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-l from-[#01411C] to-[#065f41] bg-clip-text text-transparent">
                نظام إدارة العروض والطلبات
              </h1>
              <p className="text-[#065f41] text-sm mt-1">
                {user?.name ? `مرحباً ${user.name}` : "اختر دورك وابدأ"}
              </p>
            </div>

            {/* أيقونات التحكم */}
            <div className="flex items-center gap-3">
              <motion.button
                className="relative p-2 rounded-full bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-[#01411C]" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </motion.button>
              
              <motion.button
                className="p-2 rounded-full bg-[#01411C] hover:bg-[#065f41] text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusCircle className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* اختيار الأدوار */}
        <motion.div 
          className="grid grid-cols-4 gap-3 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {(["seller", "buyer", "landlord", "renter"] as UserRole[]).map((role) => (
            <motion.div
              key={role}
              className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                selectedRole === role 
                  ? `bg-gradient-to-br ${getRoleColor(role)} border-current shadow-lg scale-105` 
                  : `bg-gradient-to-br ${getRoleColor(role)} hover:scale-102 hover:shadow-md`
              }`}
              onClick={() => setSelectedRole(role)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="text-lg font-bold">{getRoleTitle(role)}</div>
                {selectedRole === role && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#01411C] rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* المنطقة الرئيسية */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            {!selectedRole ? (
              <motion.div
                key="no-role"
                className="flex flex-col items-center justify-center h-full text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#f1c40f] rounded-full flex items-center justify-center mb-6">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#01411C] mb-2">اختر دورك</h2>
                <p className="text-[#065f41] max-w-md">
                  اختر الدور المناسب من الأعلى لبدء إضافة العروض أو الطلبات والتفاعل مع الوسطاء
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedRole}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-4xl mx-auto">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#01411C] mb-2">
                      {selectedRole === "seller" || selectedRole === "landlord" 
                        ? "إدارة العروض" 
                        : "إدارة الطلبات"
                      }
                    </h2>
                    <p className="text-[#065f41]">
                      {selectedRole === "seller" 
                        ? "أضف عقاراتك لبيع وتفاعل مع الوسطاء المهتمين"
                        : selectedRole === "buyer"
                        ? "أضف طلبات شراء العقارات التي تبحث عنها"
                        : selectedRole === "landlord"
                        ? "أضف عقاراتك للإيجار وإدارة طلبات المستأجرين"
                        : "أضف طلبات الإيجار والبحث عن العقارات المناسبة"
                      }
                    </p>
                  </div>

                  <Accordion type="single" collapsible className="space-y-4">
                    {/* إضافة عرض/طلب جديد */}
                    <AccordionItem value="add-item" className="border-2 border-[#D4AF37]/20 rounded-xl">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#01411C] to-[#065f41] rounded-full flex items-center justify-center">
                            <PlusCircle className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-[#01411C]">
                            {selectedRole === "seller" || selectedRole === "landlord" 
                              ? "إضافة عرض جديد" 
                              : "إضافة طلب جديد"
                            }
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <motion.div 
                          className="space-y-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-[#01411C] mb-2">
                                {selectedRole === "seller" || selectedRole === "landlord" 
                                  ? "عنوان العقار" 
                                  : "وصف الطلب"
                                }
                              </label>
                              <Input
                                placeholder={selectedRole === "seller" 
                                  ? "مثال: شقة 3 غرف في حي النرجس"
                                  : selectedRole === "buyer"
                                  ? "مثال: أبحث عن شقة 3 غرف"
                                  : selectedRole === "landlord"
                                  ? "مثال: فيلا للإيجار في حي الياسمين"
                                  : "مثال: أبحث عن فيلا للإيجار"
                                }
                                value={formData.title}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                className="border-[#D4AF37]/30 focus:border-[#D4AF37]"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-[#01411C] mb-2">
                                {selectedRole === "seller" || selectedRole === "landlord" 
                                  ? "السعر" 
                                  : "الميزانية المتاحة"
                                }
                              </label>
                              <Input
                                placeholder={selectedRole === "seller" || selectedRole === "buyer"
                                  ? "مثال: 500,000 ريال"
                                  : "مثال: 2,500 ريال شهرياً"
                                }
                                value={formData.price}
                                onChange={(e) => handleInputChange("price", e.target.value)}
                                className="border-[#D4AF37]/30 focus:border-[#D4AF37]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#01411C] mb-2">
                              الموقع
                            </label>
                            <Input
                              placeholder="مثال: الرياض - حي النرجس"
                              value={formData.location}
                              onChange={(e) => handleInputChange("location", e.target.value)}
                              className="border-[#D4AF37]/30 focus:border-[#D4AF37]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#01411C] mb-2">
                              الوصف التفصيلي
                            </label>
                            <Textarea
                              placeholder="أضف وصفاً مفصلاً عن العقار أو متطلباتك..."
                              value={formData.description}
                              onChange={(e) => handleInputChange("description", e.target.value)}
                              className="border-[#D4AF37]/30 focus:border-[#D4AF37] min-h-[100px]"
                            />
                          </div>

                          {/* الميزات */}
                          <div>
                            <label className="block text-sm font-medium text-[#01411C] mb-3">
                              الميزات المطلوبة
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                              {propertyFeatures.map((feature) => (
                                <motion.label
                                  key={feature}
                                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                                    formData.features.includes(feature)
                                      ? "bg-[#01411C] text-white shadow-md"
                                      : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                                  }`}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.features.includes(feature)}
                                    onChange={() => handleFeatureToggle(feature)}
                                    className="hidden"
                                  />
                                  <span className="text-xs">{feature}</span>
                                </motion.label>
                              ))}
                              
                              {/* زر إضافة خيار جديد */}
                              <motion.button
                                type="button"
                                onClick={() => {
                                  const newFeature = prompt('أدخل الميزة الجديدة:');
                                  if (newFeature && newFeature.trim()) {
                                    // يمكن إضافة المنطق هنا لإضافة الميزة الجديدة
                                    alert('سيتم إضافة: ' + newFeature);
                                  }
                                }}
                                className="flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer transition-all bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/20 border-2 border-dashed border-[#D4AF37] hover:from-[#D4AF37]/20 hover:to-[#D4AF37]/30 hover:border-solid text-[#01411C]"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
                                <span className="text-xs font-medium">إضافة خيار</span>
                              </motion.button>
                            </div>
                          </div>

                          <motion.div
                            className="pt-4"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              onClick={handleSubmit}
                              className="w-full bg-gradient-to-l from-[#01411C] to-[#065f41] hover:from-[#065f41] hover:to-[#01411C] text-white py-3 font-medium shadow-lg"
                              disabled={!formData.title || !formData.price || !formData.location}
                            >
                              <Send className="w-4 h-4 ml-2" />
                              {selectedRole === "seller" || selectedRole === "landlord" 
                                ? "نشر العرض" 
                                : "إرسال الطلب"
                              }
                            </Button>
                          </motion.div>
                        </motion.div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* قائمة العروض/الطلبات */}
                    <AccordionItem value="my-items" className="border-2 border-[#D4AF37]/20 rounded-xl">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#f1c40f] rounded-full flex items-center justify-center">
                            <Bookmark className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-[#01411C]">
                            {selectedRole === "seller" || selectedRole === "landlord" 
                              ? "عروضي" 
                              : "طلباتي"
                            }
                            {offers.length > 0 && (
                              <Badge variant="secondary" className="mr-2 bg-[#D4AF37] text-white">
                                {offers.length}
                              </Badge>
                            )}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-4">
                          {offers.length === 0 ? (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Building2 className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-gray-500">لا توجد عروض أو طلبات بعد</p>
                              <p className="text-gray-400 text-sm mt-1">ابدأ بإضافة أول عنصر لك</p>
                            </div>
                          ) : (
                            offers.map((item) => (
                              <motion.div
                                key={item.id}
                                className="border-2 border-gray-100 rounded-xl p-4 hover:border-[#D4AF37]/30 transition-all"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h3 className="font-semibold text-[#01411C]">{item.title}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {item.category === "sale" ? "بيع" : "إيجار"}
                                      </Badge>
                                      <Badge 
                                        variant={item.status === "active" ? "default" : "secondary"}
                                        className="text-xs"
                                      >
                                        {item.status === "active" ? "نشط" : "معلق"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="text-left">
                                    <div className="font-bold text-[#01411C]">{item.price}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {item.location}
                                    </div>
                                  </div>
                                </div>

                                {item.description && (
                                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                                )}

                                {item.features.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {item.features.slice(0, 3).map((feature) => (
                                      <Badge key={feature} variant="secondary" className="text-xs">
                                        {feature}
                                      </Badge>
                                    ))}
                                    {item.features.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{item.features.length - 3} أخرى
                                      </Badge>
                                    )}
                                  </div>
                                )}

                                {/* ردود الوسطاء */}
                                {item.brokerResponses && item.brokerResponses.length > 0 && (
                                  <div className="border-t pt-3 mt-3">
                                    <h4 className="font-medium text-[#01411C] mb-2 flex items-center gap-2">
                                      <Users className="w-4 h-4" />
                                      ردود الوسطاء ({item.brokerResponses.length})
                                    </h4>
                                    <div className="space-y-2">
                                      {item.brokerResponses.map((broker) => (
                                        <div key={broker.id} className="bg-gray-50 rounded-lg p-3">
                                          <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                              <Avatar className="w-8 h-8">
                                                <AvatarFallback className="bg-[#D4AF37] text-white text-xs">
                                                  {broker.name.split(' ')[0].charAt(0)}
                                                </AvatarFallback>
                                              </Avatar>
                                              <div>
                                                <div className="font-medium text-sm">{broker.name}</div>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                  {broker.rating}
                                                  <span>•</span>
                                                  <span>{broker.responseTime}</span>
                                                  {broker.verified && (
                                                    <>
                                                      <span>•</span>
                                                      <Check className="w-3 h-3 text-green-500" />
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex gap-2">
                                              <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs"
                                                onClick={() => handleBrokerResponse(broker.id, "accept", item.id)}
                                              >
                                                قبول
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                className="px-3 py-1 text-xs"
                                                onClick={() => handleBrokerResponse(broker.id, "reject", item.id)}
                                              >
                                                رفض
                                              </Button>
                                            </div>
                                          </div>
                                          
                                          <div className="mt-2 text-xs text-gray-600">
                                            <div className="flex justify-between">
                                              <span>التخصص: {broker.speciality}</span>
                                              <span>الخبرة: {broker.experience}</span>
                                            </div>
                                            <div className="mt-1">
                                              <span>المنطقة: {broker.location}</span>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            ))
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* الشريط السفلي */}
        <motion.div 
          className="bg-white/90 backdrop-blur-md border-t border-[#D4AF37]/20 shadow-lg"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex justify-between items-center p-4">
            <Button 
              variant="ghost" 
              className="flex flex-col items-center gap-1 text-[#01411C] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
            >
              <BarChart className="w-5 h-5" />
              <span className="text-xs">إحصائيات</span>
            </Button>
            
            <Button 
              variant="ghost"
              className="flex flex-col items-center gap-1 text-[#01411C] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
              onClick={() => setShowRightSlider(!showRightSlider)}
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">الوسطاء</span>
            </Button>
            
            <Button 
              variant="ghost"
              className="flex flex-col items-center gap-1 text-[#01411C] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">الرئيسية</span>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* الشريط الجانبي الأيمن - CRM */}
      <AnimatePresence>
        {showRightSlider && (
          <motion.div
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 border-l border-[#D4AF37]/20"
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="h-full flex flex-col">
              {/* هيدر الشريط الجانبي */}
              <div className="flex items-center justify-between p-4 border-b border-[#D4AF37]/20 bg-gradient-to-l from-[#01411C] to-[#065f41]">
                <h3 className="font-bold text-white">CRM - إدارة الوسطاء</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRightSlider(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* محتوى الشريط الجانبي */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {sampleBrokers.map((broker) => (
                    <motion.div
                      key={broker.id}
                      className="border-2 border-gray-100 rounded-xl p-4 cursor-pointer hover:border-[#D4AF37]/30 transition-all"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setExpandedBroker(
                        expandedBroker === broker.id ? null : broker.id
                      )}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-[#D4AF37] text-white">
                            {broker.name.split(' ')[0].charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-[#01411C] flex items-center gap-2">
                            {broker.name}
                            {broker.verified && (
                              <Check className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {broker.rating}
                            <span>•</span>
                            <span>{broker.responseTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        <div>التخصص: {broker.speciality}</div>
                        <div>الخبرة: {broker.experience}</div>
                        <div>المنطقة: {broker.location}</div>
                      </div>

                      <AnimatePresence>
                        {expandedBroker === broker.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="border-t pt-3 mt-3">
                              <h4 className="font-medium text-[#01411C] mb-2">العروض المتاحة:</h4>
                              <ul className="space-y-1 mb-3">
                                {broker.offers.map((offer, index) => (
                                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                    <Building2 className="w-3 h-3" />
                                    {offer}
                                  </li>
                                ))}
                              </ul>
                              
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="flex-1 bg-[#01411C] hover:bg-[#065f41] text-white"
                                >
                                  <Phone className="w-3 h-3 ml-1" />
                                  اتصال
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                                >
                                  <MessageCircle className="w-3 h-3 ml-1" />
                                  واتساب
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* الخلفية للشريط الجانبي */}
      <AnimatePresence>
        {showRightSlider && (
          <motion.div
            className="fixed inset-0 bg-black/20 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRightSlider(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}