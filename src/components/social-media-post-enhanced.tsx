import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { 
  ArrowRight, 
  Check, 
  X, 
  Loader2, 
  Heart,
  Eye,
  MessageCircle,
  Share2,
  TrendingUp,
  Users,
  Target,
  Upload,
  Image as ImageIcon,
  Video,
  PlayCircle,
  Camera,
  FileImage,
  Download,
  Link as LinkIcon
} from "lucide-react";

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  url: string;
  isConnected: boolean;
  isSelected: boolean;
  connectionStatus: "connected" | "disconnected" | "checking";
  publishStatus?: "idle" | "publishing" | "published" | "failed";
  publishProgress?: number;
  error?: string;
}

interface AnalyticsData {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  reach: number;
}

interface MediaFile {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
  size: number;
  thumbnail?: string;
}

interface SocialMediaPostProps {
  onBack: () => void;
}

export default function SocialMediaPost({ onBack }: SocialMediaPostProps) {
  const [currentTab, setCurrentTab] = useState("connect");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<MediaFile[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([
    { id: "snapchat", name: "سناب شات", icon: "👻", color: "#FFFC00", url: "", isConnected: false, isSelected: false, connectionStatus: "disconnected" },
    { id: "tiktok", name: "تيك توك", icon: "🎵", color: "#000000", url: "", isConnected: false, isSelected: false, connectionStatus: "disconnected" },
    { id: "instagram", name: "انستغرام", icon: "📷", color: "#E4405F", url: "", isConnected: false, isSelected: false, connectionStatus: "disconnected" },
    { id: "facebook", name: "فيسبوك", icon: "📘", color: "#1877F2", url: "", isConnected: false, isSelected: false, connectionStatus: "disconnected" },
    { id: "twitter", name: "اكس (تويتر)", icon: "🐦", color: "#1DA1F2", url: "", isConnected: false, isSelected: false, connectionStatus: "disconnected" },
    { id: "linkedin", name: "لينكد ان", icon: "💼", color: "#0077B5", url: "", isConnected: false, isSelected: false, connectionStatus: "disconnected" },
    { id: "youtube", name: "يوتيوب", icon: "📹", color: "#FF0000", url: "", isConnected: false, isSelected: false, connectionStatus: "disconnected" },
    { id: "whatsapp", name: "واتساب", icon: "💬", color: "#25D366", url: "", isConnected: false, isSelected: false, connectionStatus: "disconnected" },
    { id: "telegram", name: "تليغرام", icon: "✈️", color: "#0088CC", url: "", isConnected: false, isSelected: false, connectionStatus: "disconnected" },
    { id: "pinterest", name: "بينتريست", icon: "📌", color: "#BD081C", url: "", isConnected: false, isSelected: false, connectionStatus: "disconnected" },
  ]);

  const [analytics, setAnalytics] = useState<Record<string, AnalyticsData>>({
    snapchat: { views: 1250, likes: 89, comments: 23, shares: 15, engagement: 7.1, reach: 2100 },
    tiktok: { views: 8945, likes: 567, comments: 89, shares: 234, engagement: 10.2, reach: 12500 },
    instagram: { views: 3420, likes: 245, comments: 45, shares: 67, engagement: 8.5, reach: 5200 },
    facebook: { views: 2150, likes: 123, comments: 34, shares: 28, engagement: 6.8, reach: 3800 },
    twitter: { views: 1890, likes: 98, comments: 12, shares: 45, engagement: 5.2, reach: 2950 },
    linkedin: { views: 890, likes: 67, comments: 8, shares: 12, engagement: 9.8, reach: 1240 },
  });

  // قائمة المدن السعودية للبحث
  const saudiCities = [
    "الرياض", "جدة", "مكة", "المدينة", "الدمام", "الخبر", "الظهران", "الطائف", 
    "بريدة", "خميس مشيط", "حفر الباطن", "المبرز", "الهفوف", "حائل", "نجران", 
    "الجبيل", "ينبع", "القطيف", "صفوى", "العلا", "سكاكا", "عرعر", "تبوك", 
    "أبها", "الباحة", "جازان", "القنفذة", "الوجه", "الحمراء", "النرجس",
    "الملز", "العليا", "الصحافة", "الشفا", "أشبيليا", "الندى", "المروج"
  ];

  // استخراج المدينة من النص
  const extractCityFromText = (text: string) => {
    const cleanText = text.replace(/[.,!?]/g, '').toLowerCase();
    const words = cleanText.split(' ');
    
    for (const city of saudiCities) {
      const cityLower = city.toLowerCase();
      if (words.includes(cityLower) || cleanText.includes(cityLower)) {
        return city;
      }
    }
    
    const cityIndex = words.findIndex(word => word === "مدينة");
    if (cityIndex !== -1 && cityIndex + 1 < words.length) {
      const potentialCity = words[cityIndex + 1];
      const foundCity = saudiCities.find(city => 
        city.toLowerCase().includes(potentialCity) || 
        potentialCity.includes(city.toLowerCase())
      );
      if (foundCity) return foundCity;
    }

    return null;
  };

  // استخراج نوع العقار من النص
  const extractPropertyType = (text: string) => {
    const propertyTypes = {
      "شقة": "#شقق", "شقه": "#شقق", "شقق": "#شقق",
      "فيلا": "#فلل", "فيله": "#فلل", "فلل": "#فلل", "فلة": "#فلل",
      "أرض": "#أراضي", "ارض": "#أراضي", "قطعة": "#أراضي",
      "عمارة": "#عمائر", "عماره": "#عمائر", "مبنى": "#مباني",
      "محل": "#محلات", "متجر": "#محلات", "دكان": "#محلات",
      "مكتب": "#مكاتب", "مكاتب": "#مكاتب",
      "مستودع": "#مستودعات", "مخزن": "#مستودعات"
    };

    const cleanText = text.toLowerCase().replace(/[.,!?]/g, '');
    const foundTypes: string[] = [];

    for (const [key, hashtag] of Object.entries(propertyTypes)) {
      if (cleanText.includes(key)) {
        foundTypes.push(hashtag);
      }
    }

    return foundTypes;
  };

  // استخراج حالة العقار (بيع/إيجار)
  const extractPropertyStatus = (text: string) => {
    const cleanText = text.toLowerCase();
    const statusKeywords = {
      sale: ["للبيع", "بيع", "شراء", "تملك", "استثمار"],
      rent: ["للإيجار", "للايجار", "إيجار", "ايجار", "تأجير", "استئجار"]
    };

    const foundStatuses: string[] = [];
    
    if (statusKeywords.sale.some(keyword => cleanText.includes(keyword))) {
      foundStatuses.push("#للبيع");
    }
    
    if (statusKeywords.rent.some(keyword => cleanText.includes(keyword))) {
      foundStatuses.push("#للايجار");
    }

    return foundStatuses;
  };

  // اقتراح الهاشتاقات بالذكاء الاصطناعي المحدث
  const generateHashtags = (desc: string) => {
    const baseHashtags = ["#عقارات", "#السعودية", "#استثمار"];
    
    const detectedCity = extractCityFromText(desc);
    const cityHashtags = detectedCity ? [`#${detectedCity}`, `#عقارات_${detectedCity}`] : ["#الرياض", "#عقارات_الرياض"];
    
    const propertyTypes = extractPropertyType(desc);
    const propertyStatus = extractPropertyStatus(desc);
    
    const defaultTypes = propertyTypes.length === 0 ? ["#شقق", "#فلل"] : [];
    const defaultStatus = propertyStatus.length === 0 ? ["#للبيع", "#للايجار"] : [];
    
    const additionalHashtags = ["#عقاري", "#وساطة"];
    
    const allHashtags = [
      ...baseHashtags,
      ...cityHashtags,
      ...propertyTypes,
      ...propertyStatus,
      ...defaultTypes,
      ...defaultStatus,
      ...additionalHashtags
    ];
    
    const uniqueHashtags = [...new Set(allHashtags)];
    return uniqueHashtags.slice(0, 12).join(' ');
  };

  // التحقق من الاتصال
  const checkConnection = async (platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId 
        ? { ...p, connectionStatus: "checking" }
        : p
    ));

    setTimeout(() => {
      const platform = platforms.find(p => p.id === platformId);
      const isValid = platform?.url && platform.url.length > 10;
      
      setPlatforms(prev => prev.map(p => 
        p.id === platformId 
          ? { 
              ...p, 
              connectionStatus: isValid ? "connected" : "disconnected",
              isConnected: isValid,
              isSelected: isValid ? true : p.isSelected
            }
          : p
      ));
    }, 1500);
  };

  // تحديث رابط المنصة
  const updatePlatformUrl = (platformId: string, url: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId ? { ...p, url } : p
    ));
  };

  // تبديل تحديد المنصة
  const togglePlatformSelection = (platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId ? { ...p, isSelected: !p.isSelected } : p
    ));
  };

  // معالجة رفع الملفات
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: MediaFile[] = [];
    Array.from(files).forEach((file, index) => {
      const fileType = file.type.startsWith('video/') ? 'video' : 'image';
      const fileUrl = URL.createObjectURL(file);
      
      newFiles.push({
        id: Date.now() + index + "",
        type: fileType,
        url: fileUrl,
        name: file.name,
        size: file.size,
        thumbnail: fileType === 'image' ? fileUrl : undefined
      });
    });

    setSelectedMedia(prev => [...prev, ...newFiles]);
    setIsUploadModalOpen(false);
  };

  // حذف ملف محدد
  const removeMediaFile = (fileId: string) => {
    setSelectedMedia(prev => prev.filter(file => file.id !== fileId));
  };

  // نشر المحتوى مع شريط التقدم
  const publishToSelected = async () => {
    const selectedPlatforms = platforms.filter(p => p.isSelected && p.isConnected);
    
    setPlatforms(prev => prev.map(p => 
      p.isSelected && p.isConnected 
        ? { ...p, publishStatus: "publishing", publishProgress: 0 }
        : p
    ));

    // محاكاة النشر مع التقدم
    selectedPlatforms.forEach((platform, platformIndex) => {
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 15 + 5; // تقدم عشوائي بين 5-20%
        
        setPlatforms(prev => prev.map(p => 
          p.id === platform.id 
            ? { ...p, publishProgress: Math.min(progress, 95) }
            : p
        ));

        if (progress >= 95) {
          clearInterval(progressInterval);
          
          // انتظار قليل ثم إنهاء النشر
          setTimeout(() => {
            const success = Math.random() > 0.2; // 80% نجاح
            setPlatforms(prev => prev.map(p => 
              p.id === platform.id 
                ? { 
                    ...p, 
                    publishStatus: success ? "published" : "failed",
                    publishProgress: success ? 100 : 0,
                    error: success ? undefined : "فشل في النشر - تحقق من الاتصال"
                  }
                : p
            ));
          }, 500);
        }
      }, 200);
    });
  };

  // إنشاء الهاشتاقات التلقائيا
  useEffect(() => {
    if (description.length > 10) {
      const generatedHashtags = generateHashtags(description);
      setHashtags(generatedHashtags);
    }
  }, [description]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-[#ffffff]" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-[#D4AF37] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 border-2 border-[#D4AF37] hover:bg-[#f0fdf4]"
            >
              <ArrowRight className="w-4 h-4" />
              العودة
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-[#01411C]">النشر على التواصل الاجتماعي</h1>
              <p className="text-sm text-gray-600">إدارة ونشر المحتوى على جميع المنصات</p>
            </div>

            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6" dir="rtl">
          {/* Tabs Navigation */}
          <TabsList className="grid w-full grid-cols-3 bg-white border-2 border-[#D4AF37] rounded-lg">
            <TabsTrigger value="connect" className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
              ربط الحسابات
            </TabsTrigger>
            <TabsTrigger value="compose" className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
              إنشاء المنشور
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
              التحليل والبيانات
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Connect Accounts - شريط أفقي محسن */}
          <TabsContent value="connect" className="space-y-4">
            <Card className="border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="text-[#01411C] text-center">ربط حسابات التواصل الاجتماعي</CardTitle>
                <p className="text-center text-sm text-gray-600">
                  اربط حساباتك مرة واحدة وانشر على جميع المنصات بنقرة واحدة
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* شريط أفقي للمنصات */}
                <div className="flex flex-wrap gap-3 justify-center mb-6">
                  {platforms.map((platform) => (
                    <div key={platform.id} className="flex items-center gap-2">
                      <div className="text-2xl">{platform.icon}</div>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        platform.connectionStatus === "connected" 
                          ? 'bg-green-500' 
                          : platform.connectionStatus === "checking"
                          ? 'bg-yellow-500' 
                          : 'bg-gray-300'
                      }`}>
                        {platform.connectionStatus === "connected" ? (
                          <Check className="w-2 h-2 text-white" />
                        ) : platform.connectionStatus === "checking" ? (
                          <Loader2 className="w-2 h-2 text-white animate-spin" />
                        ) : (
                          <X className="w-2 h-2 text-gray-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* نماذج ربط مفصلة */}
                {platforms.map((platform) => (
                  <div key={platform.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <div className="text-2xl">{platform.icon}</div>
                      <span className="font-medium text-[#01411C]">{platform.name}</span>
                    </div>

                    <div className="flex-1">
                      <Input
                        placeholder={`رابط حساب ${platform.name}`}
                        value={platform.url}
                        onChange={(e) => updatePlatformUrl(platform.id, e.target.value)}
                        className="border-[#D4AF37] focus:border-[#01411C]"
                      />
                    </div>

                    <Button
                      size="sm"
                      onClick={() => checkConnection(platform.id)}
                      disabled={!platform.url || platform.connectionStatus === "checking"}
                      className="bg-[#01411C] hover:bg-[#065f41] text-white min-w-[80px]"
                    >
                      {platform.connectionStatus === "checking" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "تحقق"
                      )}
                    </Button>

                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      {platform.connectionStatus === "connected" ? (
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : platform.connectionStatus === "checking" ? (
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Loader2 className="w-4 h-4 text-white animate-spin" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <X className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Compose Post */}
          <TabsContent value="compose" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Center: Content Creation */}
              <div className="lg:col-span-1 lg:order-2">
                <Card className="border-2 border-[#D4AF37] h-fit">
                  <CardHeader>
                    <CardTitle className="text-[#01411C] text-center">إنشاء المحتوى</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* TikTok Screen مع إمكانية رفع الملفات */}
                    <div 
                      className="aspect-[9/16] max-w-[280px] mx-auto bg-black rounded-2xl p-4 relative overflow-hidden cursor-pointer border-4 border-dashed border-[#D4AF37] hover:border-[#01411C] transition-colors group"
                      onClick={() => setIsUploadModalOpen(true)}
                    >
                      {selectedMedia.length > 0 ? (
                        <div className="h-full relative">
                          {selectedMedia[0].type === 'image' ? (
                            <img 
                              src={selectedMedia[0].url} 
                              alt="معاينة" 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                              <PlayCircle className="w-16 h-16 text-white" />
                            </div>
                          )}
                          
                          {/* عدد الملفات */}
                          {selectedMedia.length > 1 && (
                            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              +{selectedMedia.length - 1}
                            </div>
                          )}

                          {/* النص والهاشتاقات */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                            <p className="text-sm leading-relaxed mb-2">
                              {description || "اكتب وصف العقار هنا..."}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {hashtags.split(' ').filter(Boolean).slice(0, 3).map((tag, index) => (
                                <span key={index} className="text-xs text-[#D4AF37]">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full bg-gradient-to-b from-gray-800 to-black flex flex-col items-center justify-center text-white">
                          <Upload className="w-12 h-12 text-[#D4AF37] mb-4" />
                          <p className="text-center text-sm mb-2">اضغط لتحميل صور أو فيديو</p>
                          <p className="text-center text-xs text-gray-300">الصور والفيديوهات المدعومة</p>
                          <div className="absolute inset-0 bg-[#D4AF37]/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                        </div>
                      )}
                    </div>

                    {/* الملفات المرفوعة */}
                    {selectedMedia.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#01411C]">الملفات المرفوعة:</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setIsUploadModalOpen(true)}
                            className="text-xs"
                          >
                            إضافة المزيد
                          </Button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {selectedMedia.map((file, index) => (
                            <div key={file.id} className="relative group">
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                {file.type === 'image' ? (
                                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                    <Video className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeMediaFile(file.id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#01411C]">الوصف:</label>
                      <Textarea
                        placeholder="اكتب وصف العقار..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="resize-none border-[#D4AF37] focus:border-[#01411C] min-h-[100px]"
                      />
                    </div>

                    {/* Hashtags Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#01411C]">الهاشتاقات:</label>
                      <Textarea
                        placeholder="الهاشتاقات المقترحة..."
                        value={hashtags}
                        onChange={(e) => setHashtags(e.target.value)}
                        className="resize-none border-[#D4AF37] focus:border-[#01411C] min-h-[80px]"
                      />
                      
                      {/* تحليل النص الذكي */}
                      <div className="text-xs text-gray-500 space-y-2">
                        <p>💡 يتم إنشاء الهاشتاقات تلقائياً من الوصف</p>
                        {description.length > 10 && (
                          <div className="bg-[#f0fdf4] p-3 rounded-lg border border-[#D4AF37] space-y-2">
                            <h5 className="text-xs font-medium text-[#01411C]">🤖 تحليل النص الذكي:</h5>
                            
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-gray-600">🏙️ المدينة:</span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  extractCityFromText(description) 
                                    ? 'border-green-500 text-green-700 bg-green-50' 
                                    : 'border-red-500 text-red-700 bg-red-50'
                                }`}
                              >
                                {extractCityFromText(description) || "غير محددة"}
                              </Badge>
                            </div>
                            
                            {extractPropertyType(description).length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-gray-600">🏠 النوع:</span>
                                <div className="flex gap-1">
                                  {extractPropertyType(description).map((type, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {type}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {extractPropertyStatus(description).length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-gray-600">💰 الحالة:</span>
                                <div className="flex gap-1">
                                  {extractPropertyStatus(description).map((status, index) => (
                                    <Badge key={index} variant="outline" className="text-xs border-blue-500 text-blue-700 bg-blue-50">
                                      {status}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Platform Selection المحسن */}
              <div className="lg:col-span-1 lg:order-3">
                <Card className="border-2 border-[#D4AF37]">
                  <CardHeader>
                    <CardTitle className="text-[#01411C]">اختيار المنصات</CardTitle>
                    <p className="text-sm text-gray-600">
                      {platforms.filter(p => p.isConnected).length} من {platforms.length} منصة مرتبطة
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* شبكة المنصات */}
                    <div className="grid grid-cols-2 gap-3">
                      {platforms.filter(p => p.isConnected).map((platform) => (
                        <div
                          key={platform.id}
                          onClick={() => togglePlatformSelection(platform.id)}
                          className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all ${
                            platform.isSelected 
                              ? 'bg-[#01411C] text-white shadow-lg scale-105' 
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="text-2xl mb-2">{platform.icon}</div>
                          <span className="text-xs font-medium text-center">{platform.name}</span>
                          
                          {/* حالة النشر */}
                          {platform.publishStatus === "publishing" && platform.publishProgress !== undefined && (
                            <div className="w-full mt-2">
                              <Progress value={platform.publishProgress} className="h-1" />
                              <span className="text-xs">{Math.round(platform.publishProgress)}%</span>
                            </div>
                          )}
                          
                          {platform.publishStatus === "published" && (
                            <Check className="w-4 h-4 text-green-500 mt-1" />
                          )}
                          
                          {platform.publishStatus === "failed" && (
                            <X className="w-4 h-4 text-red-500 mt-1" />
                          )}
                        </div>
                      ))}
                    </div>

                    {platforms.filter(p => p.isConnected).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <LinkIcon className="w-8 h-8 mx-auto mb-2" />
                        <p>لا توجد منصات مرتبطة</p>
                        <p className="text-sm">اربط حساباتك أولاً</p>
                      </div>
                    )}

                    {/* Publish Button */}
                    {platforms.some(p => p.isSelected && p.isConnected) && (
                      <Button
                        onClick={publishToSelected}
                        className="w-full bg-[#D4AF37] hover:bg-[#b8941f] text-[#01411C] font-bold py-3 mt-4"
                        disabled={platforms.some(p => p.publishStatus === "publishing")}
                      >
                        {platforms.some(p => p.publishStatus === "publishing") ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            جاري النشر...
                          </div>
                        ) : (
                          `نشر على ${platforms.filter(p => p.isSelected && p.isConnected).length} منصة`
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Left: Connected Platforms Overview */}
              <div className="lg:col-span-1 lg:order-1">
                <Card className="border-2 border-[#D4AF37]">
                  <CardHeader>
                    <CardTitle className="text-[#01411C]">المنصات المرتبطة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {platforms.filter(p => p.isConnected).map((platform) => (
                      <div key={platform.id} className="flex items-center gap-3 p-2 bg-green-50 rounded">
                        <div className="text-lg">{platform.icon}</div>
                        <span className="text-sm text-[#01411C]">{platform.name}</span>
                        <div className="mr-auto">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-2 h-2 text-white" />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4 p-2 bg-[#f0fdf4] rounded text-center">
                      <p className="text-sm text-[#01411C] font-medium">
                        {platforms.filter(p => p.isConnected).length} من {platforms.length} منصة مرتبطة
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* إحصائيات سريعة */}
                <Card className="border-2 border-[#D4AF37] mt-4">
                  <CardHeader>
                    <CardTitle className="text-[#01411C] text-sm">إحصائيات سريعة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="text-lg font-bold text-blue-600">
                          {Object.values(analytics).reduce((sum, data) => sum + data.views, 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-blue-600">مشاهدات</div>
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <div className="text-lg font-bold text-red-600">
                          {Object.values(analytics).reduce((sum, data) => sum + data.likes, 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-red-600">إعجابات</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* زر النشر الرئيسي - ثابت في الأسفل */}
            <Card className="border-2 border-[#D4AF37] bg-gradient-to-r from-[#f0fdf4] to-white">
              <CardContent className="p-6">
                <Button
                  onClick={publishToSelected}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#b8941f] hover:from-[#b8941f] hover:to-[#D4AF37] text-[#01411C] font-bold py-6 text-xl shadow-lg"
                  disabled={platforms.some(p => p.publishStatus === "publishing") || !platforms.some(p => p.isSelected && p.isConnected)}
                >
                  {platforms.some(p => p.publishStatus === "publishing") ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      جاري النشر على المنصات...
                    </div>
                  ) : platforms.some(p => p.isSelected && p.isConnected) ? (
                    <div className="flex items-center gap-3">
                      <Share2 className="w-6 h-6" />
                      نشر الإعلان على {platforms.filter(p => p.isSelected && p.isConnected).length} منصة
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Share2 className="w-6 h-6" />
                      نشر الإعلان على التواصل الاجتماعي
                    </div>
                  )}
                </Button>
                
                {!platforms.some(p => p.isSelected && p.isConnected) && (
                  <p className="text-center text-sm text-gray-600 mt-3">
                    💡 اختر منصة واحدة على الأقل للنشر
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Analytics - محسن */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms.filter(p => analytics[p.id]).map((platform) => {
                const data = analytics[platform.id];
                return (
                  <Card key={platform.id} className="border-2 border-[#D4AF37] hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{platform.icon}</div>
                        <div>
                          <CardTitle className="text-lg text-[#01411C]">{platform.name}</CardTitle>
                          <p className="text-sm text-gray-600">آخر 30 يوم</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Main Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <Eye className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-blue-600">{data.views.toLocaleString()}</div>
                          <div className="text-xs text-blue-600">مشاهدة</div>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg text-center">
                          <Heart className="w-4 h-4 text-red-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-red-600">{data.likes.toLocaleString()}</div>
                          <div className="text-xs text-red-600">إعجاب</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                          <MessageCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-green-600">{data.comments}</div>
                          <div className="text-xs text-green-600">تعليق</div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg text-center">
                          <Share2 className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-purple-600">{data.shares}</div>
                          <div className="text-xs text-purple-600">مشاركة</div>
                        </div>
                      </div>

                      {/* Advanced Metrics */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#01411C]" />
                            <span className="text-sm text-[#01411C]">معدل التفاعل</span>
                          </div>
                          <span className="font-bold text-[#D4AF37]">{data.engagement}%</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#01411C]" />
                            <span className="text-sm text-[#01411C]">الوصول</span>
                          </div>
                          <span className="font-bold text-[#D4AF37]">{data.reach.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Performance Badge */}
                      <div className="text-center">
                        <Badge 
                          className={`${
                            data.engagement >= 8 
                              ? 'bg-green-100 text-green-800' 
                              : data.engagement >= 5 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {data.engagement >= 8 ? 'أداء ممتاز' : data.engagement >= 5 ? 'أداء جيد' : 'يحتاج تحسين'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Overall Summary */}
            <Card className="border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="text-[#01411C] text-center">ملخص الأداء العام</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div className="p-4">
                    <div className="text-3xl font-bold text-[#01411C] mb-1">
                      {Object.values(analytics).reduce((sum, data) => sum + data.views, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">إجمالي المشاهدات</div>
                  </div>
                  <div className="p-4">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-1">
                      {Object.values(analytics).reduce((sum, data) => sum + data.likes, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">إجمالي الإعجابات</div>
                  </div>
                  <div className="p-4">
                    <div className="text-3xl font-bold text-[#01411C] mb-1">
                      {Object.values(analytics).reduce((sum, data) => sum + data.comments, 0)}
                    </div>
                    <div className="text-sm text-gray-600">إجمالي التعليقات</div>
                  </div>
                  <div className="p-4">
                    <div className="text-3xl font-bold text-[#D4AF37] mb-1">
                      {(Object.values(analytics).reduce((sum, data) => sum + data.engagement, 0) / Object.values(analytics).length).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">متوسط التفاعل</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal لرفع الملفات */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-[#01411C] text-center">تحميل الملفات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "image/*";
                      fileInputRef.current.click();
                    }
                  }}
                  className="flex flex-col items-center gap-2 h-20"
                >
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-sm">صور</span>
                </Button>
                
                <Button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "video/*";
                      fileInputRef.current.click();
                    }
                  }}
                  className="flex flex-col items-center gap-2 h-20"
                >
                  <Video className="w-6 h-6" />
                  <span className="text-sm">فيديو</span>
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "image/*,video/*";
                      fileInputRef.current.click();
                    }
                  }}
                  className="flex-1"
                >
                  <Camera className="w-4 h-4 ml-2" />
                  اختيار من الجهاز
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
}