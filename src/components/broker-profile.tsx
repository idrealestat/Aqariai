import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { 
  ArrowLeft, 
  Edit, 
  Camera, 
  Star, 
  Home, 
  Users, 
  Award, 
  Globe, 
  Phone, 
  MessageCircle, 
  Mail, 
  Calendar,
  Share2,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  UserCheck
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  birthDate: string;
  type: "individual" | "group" | "company";
  companyName?: string;
  licenseNumber?: string;
  city: string;
  district: string;
  plan?: string;
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  workingHours?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    snapchat?: string;
  };
}

interface BrokerProfileProps {
  onBack: () => void;
  user: User | null;
  onNavigate: (page: string) => void;
}

export function BrokerProfile({ onBack, user, onNavigate }: BrokerProfileProps) {
  const [showTabsSection, setShowTabsSection] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    workingHours: user?.workingHours || "الأحد - الخميس: 9:00 ص - 6:00 م",
    phone: user?.phone || "",
    whatsapp: user?.whatsapp || "",
    email: user?.email || "",
    licenseNumber: user?.licenseNumber || "",
    type: user?.type || "individual",
    companyName: user?.companyName || "",
    socialMedia: {
      facebook: user?.socialMedia?.facebook || "",
      twitter: user?.socialMedia?.twitter || "",
      instagram: user?.socialMedia?.instagram || "",
      linkedin: user?.socialMedia?.linkedin || "",
      youtube: user?.socialMedia?.youtube || "",
      tiktok: user?.socialMedia?.tiktok || "",
      snapchat: user?.socialMedia?.snapchat || ""
    }
  });
  
  if (!user) {
    return null;
  }
  
  // بيانات وهمية للعقارات
  const properties = [
    { id: 1, title: 'فيلا فاخرة في حي الربيع', price: '2,500,000 ر.س', image: 'https://images.unsplash.com/photo-1712182942056-eb855fede792?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMHNhdWRpJTIwYXJhYmlhfGVufDF8fHx8MTc1NzY5MDQwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: 2, title: 'شقة راقية في حي النخيل', price: '1,200,000 ر.س', image: 'https://images.unsplash.com/photo-1664892798972-079f15663b16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsdXh1cnl8ZW58MXx8fHwxNzU3NjA0NDk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: 3, title: 'أرض سكنية في حي الورود', price: '800,000 ر.س', image: 'https://images.unsplash.com/photo-1606500307322-61cf2c98aab3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxlbXB0eSUyMGxhbmQlMjByZXNpZGVudGlhbCUyMHBsb3R8ZW58MXx8fHwxNzU3NjkwNDE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  ];
  
  // تقييمات وهمية
  const reviews = [
    { id: 1, client: 'محمد أحمد', rating: 5, comment: 'وسيط محترف وملتزم، ساعدني في إيجاد المنزل المثالي' },
    { id: 2, client: 'سارة عبدالله', rating: 4, comment: 'تعامل راقي ومهنية عالية، أنصح بالتعامل معه' },
    { id: 3, client: 'خالد السعدي', rating: 5, comment: 'يستحق التقييم العالي، قام بكل ما بوسعه لإتمام الصفقة' },
  ];

  // شبكات التواصل الاجتماعي مع أيقونات مخصصة لتيكتوك وسناب شات
  const socialMediaPlatforms = [
    { key: 'facebook', icon: Facebook, color: '#1877F2', name: 'فيسبوك' },
    { key: 'twitter', icon: Twitter, color: '#1DA1F2', name: 'منصة إكس' },
    { key: 'instagram', icon: Instagram, color: '#E4405F', name: 'إنستغرام' },
    { key: 'linkedin', icon: Linkedin, color: '#0A66C2', name: 'لينكدإن' },
    { key: 'youtube', icon: Youtube, color: '#FF0000', name: 'يوتيوب' },
    { 
      key: 'tiktok', 
      icon: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
        <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ), 
      color: '#000000', 
      name: 'تيكتوك' 
    },
    { 
      key: 'snapchat', 
      icon: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
        <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.404-5.958 1.404-5.958s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.16-1.507-.402-2.450-1.160-2.450-3.442 0-3.77 2.748-7.447 7.929-7.447 4.161 0 7.397 2.967 7.397 6.923 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
        </svg>
      ), 
      color: '#FFFC00', 
      name: 'سناب شات' 
    }
  ];

  const handleEditSubmit = () => {
    // هنا سيتم حفظ التعديلات
    toast.success("تم حفظ التعديلات بنجاح!");
    setIsEditMode(false);
  };

  const handleImageUpload = (type: 'profile' | 'cover') => {
    // محاكاة رفع الصورة
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      toast.success(`تم رفع ${type === 'profile' ? 'صورة الملف الشخصي' : 'صورة الغلاف'} بنجاح!`);
    };
    input.click();
  };

  const handleContactAction = (action: 'call' | 'whatsapp' | 'email' | 'website') => {
    switch (action) {
      case 'call':
        window.open(`tel:${user.phone}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${user.whatsapp.replace(/\D/g, '')}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:${user.email}`, '_blank');
        break;
      case 'website':
        const websiteUrl = `https://waseety-${user.name?.replace(/\s+/g, '').toLowerCase()}.com`;
        window.open(websiteUrl, '_blank');
        break;
    }
  };

  const handleShare = async (includeRating = false) => {
    const profileUrl = `https://waseety-${user.name?.replace(/\s+/g, '').toLowerCase()}.com`;
    const text = includeRating 
      ? `تعرف على ${user.name} - وسيط عقاري معتمد بتقييم 4.5/5 ⭐\n${profileUrl}`
      : `تعرف على ${user.name} - وسيط عقاري معتمد\n${profileUrl}`;
    
    // التحقق من دعم Web Share API
    if (navigator.share && navigator.canShare) {
      try {
        await navigator.share({
          title: `ملف ${user.name} الشخصي`,
          text: text,
          url: profileUrl
        });
        toast.success("تمت المشاركة بنجاح!");
      } catch (err: any) {
        // إذا رفض المستخدم أو حدث خطأ، نستخدم النسخ كبديل
        if (err.name !== 'AbortError') {
          await navigator.clipboard.writeText(text);
          toast.success("تم نسخ الرابط!");
        }
      }
    } else {
      // Fallback: نسخ إلى الحافظة
      try {
        await navigator.clipboard.writeText(text);
        toast.success("تم نسخ الرابط!");
      } catch (err) {
        toast.error("فشل نسخ الرابط");
      }
    }
  };

  const handleStatsClick = (type: 'properties' | 'clients' | 'deals') => {
    if (type === 'properties') {
      setShowTabsSection(true);
      setActiveTab('properties');
    }
  };

  const activeSocialMedia = socialMediaPlatforms.filter(platform => 
    editData.socialMedia[platform.key as keyof typeof editData.socialMedia]
  );





  return (
    <div 
      className="min-h-screen" 
      style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 25%, #fffef7 100%)',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Cg fill-opacity=\'0.03\'%3E%3Cpath fill=\'%23D4AF37\' d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")'
      }} 
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="border-2" 
            style={{ borderColor: '#D4AF37' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: '#01411C' }} />
          </Button>
          
          <h1 className="font-bold" style={{ color: '#01411C' }}>
            بطاقة العمل الخاص بي
          </h1>
          
          {/* Edit Button */}
          <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                className="border-2"
                style={{ borderColor: '#D4AF37', color: '#01411C' }}
              >
                <Edit className="w-4 h-4 ml-1" />
                تعديل
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle style={{ color: '#01411C' }}>تعديل الملف الشخصي</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* صور البروفايل والغلاف */}
                <div className="space-y-4">
                  <h3 className="font-medium" style={{ color: '#01411C' }}>الصور</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm mb-2">صورة البروفايل</Label>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-20 border-2 border-dashed"
                        style={{ borderColor: '#D4AF37' }}
                        onClick={() => handleImageUpload('profile')}
                      >
                        <Camera className="w-6 h-6" style={{ color: '#01411C' }} />
                      </Button>
                    </div>
                    <div>
                      <Label className="block text-sm mb-2">صورة الغلاف</Label>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-20 border-2 border-dashed"
                        style={{ borderColor: '#D4AF37' }}
                        onClick={() => handleImageUpload('cover')}
                      >
                        <Camera className="w-6 h-6" style={{ color: '#01411C' }} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* المعلومات الشخصية */}
                <div className="space-y-4">
                  <h3 className="font-medium" style={{ color: '#01411C' }}>المعلومات الشخصية</h3>
                  
                  <div>
                    <Label className="block text-sm mb-2">اسم الوسيط</Label>
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({...prev, name: e.target.value}))}
                      className="border-2"
                      style={{ borderColor: '#D4AF37' }}
                    />
                  </div>

                  <div>
                    <Label className="block text-sm mb-2">نوع الاشتراك</Label>
                    <Select value={editData.type} onValueChange={(value) => setEditData(prev => ({...prev, type: value as any}))}>
                      <SelectTrigger className="border-2" style={{ borderColor: '#D4AF37' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">فرد</SelectItem>
                        <SelectItem value="group">فريق</SelectItem>
                        <SelectItem value="company">شركة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(editData.type === 'group' || editData.type === 'company') && (
                    <div>
                      <Label className="block text-sm mb-2">
                        {editData.type === 'group' ? 'اسم الفريق' : 'اسم الشركة'}
                      </Label>
                      <Input
                        value={editData.companyName}
                        onChange={(e) => setEditData(prev => ({...prev, companyName: e.target.value}))}
                        placeholder={editData.type === 'group' ? 'اسم الفريق' : 'اسم الشركة'}
                        className="border-2"
                        style={{ borderColor: '#D4AF37' }}
                      />
                    </div>
                  )}

                  <div>
                    <Label className="block text-sm mb-2">رقم الرخصة</Label>
                    <Input
                      value={editData.licenseNumber}
                      onChange={(e) => setEditData(prev => ({...prev, licenseNumber: e.target.value}))}
                      className="border-2"
                      style={{ borderColor: '#D4AF37' }}
                    />
                  </div>

                  <div>
                    <Label className="block text-sm mb-2">ساعات العمل</Label>
                    <Input
                      value={editData.workingHours}
                      onChange={(e) => setEditData(prev => ({...prev, workingHours: e.target.value}))}
                      className="border-2"
                      style={{ borderColor: '#D4AF37' }}
                    />
                  </div>
                </div>

                {/* معلومات التواصل */}
                <div className="space-y-4">
                  <h3 className="font-medium" style={{ color: '#01411C' }}>معلومات التواصل</h3>
                  
                  <div>
                    <Label className="block text-sm mb-2">رقم الاتصال</Label>
                    <Input
                      value={editData.phone}
                      onChange={(e) => setEditData(prev => ({...prev, phone: e.target.value}))}
                      className="border-2"
                      style={{ borderColor: '#D4AF37' }}
                    />
                  </div>

                  <div>
                    <Label className="block text-sm mb-2">رقم الواتساب</Label>
                    <Input
                      value={editData.whatsapp}
                      onChange={(e) => setEditData(prev => ({...prev, whatsapp: e.target.value}))}
                      className="border-2"
                      style={{ borderColor: '#D4AF37' }}
                    />
                  </div>

                  <div>
                    <Label className="block text-sm mb-2">البريد الإلكتروني</Label>
                    <Input
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({...prev, email: e.target.value}))}
                      className="border-2"
                      style={{ borderColor: '#D4AF37' }}
                    />
                  </div>
                </div>

                {/* وسائل التواصل الاجتماعي */}
                <div className="space-y-4">
                  <h3 className="font-medium" style={{ color: '#01411C' }}>وسائل التواصل الاجتماعي</h3>
                  
                  {socialMediaPlatforms.map((platform) => (
                    <div key={platform.key}>
                      <Label className="block text-sm mb-2">{platform.name}</Label>
                      <Input
                        value={editData.socialMedia[platform.key as keyof typeof editData.socialMedia]}
                        onChange={(e) => setEditData(prev => ({
                          ...prev, 
                          socialMedia: {
                            ...prev.socialMedia,
                            [platform.key]: e.target.value
                          }
                        }))}
                        placeholder={`رابط ${platform.name}`}
                        className="border-2"
                        style={{ borderColor: '#D4AF37' }}
                      />
                    </div>
                  ))}
                </div>

                {/* النبذة */}
                <div>
                  <Label className="block text-sm mb-2">نبذة عني</Label>
                  <Textarea
                    value={editData.bio}
                    onChange={(e) => setEditData(prev => ({...prev, bio: e.target.value}))}
                    placeholder="اكتب نبذة عنك..."
                    maxLength={200}
                    rows={4}
                    className="border-2"
                    style={{ borderColor: '#D4AF37' }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {editData.bio.length}/200 حرف
                  </p>
                </div>
                
                <div className="flex space-x-2 space-x-reverse pt-4">
                  <Button 
                    onClick={handleEditSubmit}
                    className="flex-1"
                    style={{ backgroundColor: '#01411C', borderColor: '#01411C' }}
                  >
                    حفظ التعديلات
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditMode(false)}
                    className="flex-1"
                    style={{ borderColor: '#D4AF37' }}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        {/* Profile Card */}
        <Card className="mb-6 border-2 overflow-hidden" style={{ borderColor: '#D4AF37' }}>
          <div className="relative">
            {/* Cover Image */}
            <div 
              className="h-32 relative cursor-pointer group"
              style={{
                background: user.coverImage 
                  ? `url(${user.coverImage}) center/cover` 
                  : 'linear-gradient(135deg, #01411C 0%, #065f41 100%)'
              }}
              onClick={() => handleImageUpload('cover')}
            >
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* Profile Image */}
            <div className="absolute -bottom-12 right-6">
              <div className="relative cursor-pointer group" onClick={() => handleImageUpload('profile')}>
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback style={{ backgroundColor: '#01411C', color: 'white' }}>
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="pt-16 pb-6">
            {/* Name and Company */}
            <div className="mb-4">
              <h2 className="font-bold text-xl mb-1" style={{ color: '#01411C' }}>
                {user.name}
              </h2>
              {(user.type === 'group' || user.type === 'company') && user.companyName && (
                <p className="text-muted-foreground text-sm mb-2">
                  {user.companyName}
                </p>
              )}
              
              {/* Rating */}
              <div className="flex items-center mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 mx-0.5"
                    fill={star <= 4.5 ? '#D4AF37' : 'none'}
                    stroke={star <= 4.5 ? '#D4AF37' : '#ccc'}
                  />
                ))}
                <span className="text-sm text-muted-foreground mr-2">(4.5)</span>
              </div>
            </div>

            {/* Working Hours */}
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#f0fdf4' }}>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Clock className="w-4 h-4" style={{ color: '#01411C' }} />
                <span className="text-sm font-medium" style={{ color: '#01411C' }}>
                  ساعات العمل
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {editData.workingHours}
              </p>
            </div>

            {/* License Info */}
            <div className="mb-4 p-3 rounded-lg border" style={{ borderColor: '#D4AF37', backgroundColor: '#fffef7' }}>
              <p className="text-sm">
                <span className="text-muted-foreground">رخصة رقم: </span>
                <span className="font-medium" style={{ color: '#01411C' }}>
                  {user.licenseNumber || '1234567890'}
                </span>
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-muted-foreground ml-2">تنتهي بعد:</span>
                <Badge 
                  className="text-xs"
                  style={{ 
                    backgroundColor: 45 > 30 ? '#ECFDF5' : (45 > 7 ? '#FFFBEB' : '#FEF2F2'),
                    color: 45 > 30 ? '#065F46' : (45 > 7 ? '#92400E' : '#DC2626')
                  }}
                >
                  45 يوم
                </Badge>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {/* العقارات */}
              <button 
                className="text-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => handleStatsClick('properties')}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-2" style={{ backgroundColor: '#F0FDF4' }}>
                  <Home className="w-6 h-6" style={{ color: '#01411C' }} />
                </div>
                <p className="text-xs text-muted-foreground">العقارات</p>
                <p className="font-bold" style={{ color: '#01411C' }}>24</p>
              </button>
              
              {/* العملاء */}
              <button 
                className="text-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => handleStatsClick('clients')}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-2" style={{ backgroundColor: '#F0FDF4' }}>
                  <Users className="w-6 h-6" style={{ color: '#01411C' }} />
                </div>
                <p className="text-xs text-muted-foreground">العملاء</p>
                <p className="font-bold" style={{ color: '#01411C' }}>58</p>
              </button>
              
              {/* الصفقات */}
              <button 
                className="text-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => handleStatsClick('deals')}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-2" style={{ backgroundColor: '#F0FDF4' }}>
                  <Award className="w-6 h-6" style={{ color: '#01411C' }} />
                </div>
                <p className="text-xs text-muted-foreground">الصفقات</p>
                <p className="font-bold" style={{ color: '#01411C' }}>42</p>
              </button>

              {/* منصتي */}
              <button 
                className="text-center p-2 rounded-lg hover:bg-gray-50 transition-colors" 
                onClick={() => handleContactAction('website')}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-2" style={{ backgroundColor: '#F0FDF4' }}>
                  <Globe className="w-6 h-6" style={{ color: '#01411C' }} />
                </div>
                <p className="text-xs text-muted-foreground">منصتي</p>
                <p className="text-xs font-medium" style={{ color: '#01411C' }}>زيارة</p>
              </button>
            </div>

            {/* Bio Section */}
            {editData.bio && (
              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#fffef7', border: '2px solid #D4AF37' }}>
                <h4 className="font-medium mb-2 flex items-center space-x-2 space-x-reverse" style={{ color: '#01411C' }}>
                  <UserCheck className="w-4 h-4" />
                  <span>نبذة عني</span>
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {editData.bio}
                </p>
              </div>
            )}

            {/* Contact Actions Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {/* Phone */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContactAction('call')}
                className="flex items-center justify-center space-x-1 space-x-reverse border-2"
                style={{ borderColor: '#01411C', color: '#01411C' }}
              >
                <Phone className="w-4 h-4" />
                <span className="text-xs">اتصال</span>
              </Button>

              {/* WhatsApp */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContactAction('whatsapp')}
                className="flex items-center justify-center space-x-1 space-x-reverse border-2"
                style={{ borderColor: '#25D366', color: '#25D366' }}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">واتساب</span>
              </Button>

              {/* Email */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContactAction('email')}
                className="flex items-center justify-center space-x-1 space-x-reverse border-2"
                style={{ borderColor: '#065f41', color: '#065f41' }}
              >
                <Mail className="w-4 h-4" />
                <span className="text-xs">بريد</span>
              </Button>
            </div>

            {/* Schedule Call Button */}
            <Button
              onClick={() => onNavigate('schedule-call')}
              className="w-full mb-6"
              style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37', color: '#01411C' }}
            >
              <Calendar className="w-4 h-4 ml-2" />
              جدولة مكالمة
            </Button>

            {/* Share Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button
                variant="outline"
                onClick={() => handleShare(false)}
                className="border-2"
                style={{ borderColor: '#D4AF37', color: '#01411C' }}
              >
                <Share2 className="w-4 h-4 ml-2" />
                مشاركة البروفايل
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleShare(true)}
                className="border-2"
                style={{ borderColor: '#D4AF37', color: '#01411C' }}
              >
                <Star className="w-4 h-4 ml-2" />
                مشاركة مع التقييم
              </Button>
            </div>

            {/* Social Media */}
            {activeSocialMedia.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-center" style={{ color: '#01411C' }}>
                  تابعني على
                </h4>
                <div className="flex justify-center flex-wrap gap-3">
                  {activeSocialMedia.map((platform) => {
                    const IconComponent = platform.icon;
                    const url = editData.socialMedia[platform.key as keyof typeof editData.socialMedia];
                    return (
                      <Button
                        key={platform.key}
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 border-2"
                        style={{ borderColor: platform.color + '40' }}
                        onClick={() => window.open(url, '_blank')}
                      >
                        <IconComponent className="w-4 h-4" style={{ color: platform.color }} />
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Tabs Section - Only shows when user clicks on properties */}
        {showTabsSection && (
          <Card className="mb-6 border-2 overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
            <div className="flex border-b">
              <button
                className={`flex-1 py-3 text-center font-medium ${activeTab === 'properties' ? 'border-b-2' : ''}`}
                style={{ 
                  color: activeTab === 'properties' ? '#01411C' : '#6b7280',
                  borderBottomColor: activeTab === 'properties' ? '#01411C' : 'transparent'
                }}
                onClick={() => setActiveTab('properties')}
              >
                عقاراتي
              </button>
              <button
                className={`flex-1 py-3 text-center font-medium ${activeTab === 'reviews' ? 'border-b-2' : ''}`}
                style={{ 
                  color: activeTab === 'reviews' ? '#01411C' : '#6b7280',
                  borderBottomColor: activeTab === 'reviews' ? '#01411C' : 'transparent'
                }}
                onClick={() => setActiveTab('reviews')}
              >
                التقييمات
              </button>
              <button
                className={`flex-1 py-3 text-center font-medium ${activeTab === 'achievements' ? 'border-b-2' : ''}`}
                style={{ 
                  color: activeTab === 'achievements' ? '#01411C' : '#6b7280',
                  borderBottomColor: activeTab === 'achievements' ? '#01411C' : 'transparent'
                }}
                onClick={() => setActiveTab('achievements')}
              >
                الإنجازات
              </button>
            </div>
            
            {/* Tab Content */}
            <CardContent className="p-4">
              {activeTab === 'properties' && (
                <div className="space-y-4">
                  {properties.map(property => (
                    <div key={property.id} className="flex items-center p-3 rounded-lg border border-gray-200">
                      <ImageWithFallback src={property.image} alt={property.title} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="mr-3 flex-1">
                        <h3 className="font-medium text-gray-800">{property.title}</h3>
                        <p className="text-sm text-gray-600">{property.price}</p>
                      </div>
                      <Badge 
                        variant="secondary"
                        style={{ backgroundColor: '#F0FDF4', color: '#065F46' }}
                      >
                        نشط
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className="w-4 h-4 mx-0.5"
                              fill={star <= review.rating ? '#D4AF37' : 'none'}
                              stroke={star <= review.rating ? '#D4AF37' : '#ccc'}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-800 mr-2">{review.client}</span>
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'achievements' && (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 mx-auto mb-4" style={{ color: '#D4AF37' }} />
                  <h3 className="font-medium text-gray-800 mb-2">الإنجازات والشهادات</h3>
                  <p className="text-sm text-gray-600">سيتم عرض شهاداتك وإنجازاتك هنا</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}