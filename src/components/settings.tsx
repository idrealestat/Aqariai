import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { 
  ArrowRight, 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Palette,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Download,
  Upload,
  Users
} from 'lucide-react';
import TeamManagement from './TeamManagement';

interface SettingsProps {
  onBack: () => void;
  defaultTab?: string; // ✅ إضافة دعم للتبويب المبدئي
}

export function Settings({ onBack, defaultTab }: SettingsProps) {
  const [currentTab, setCurrentTab] = useState(defaultTab || 'profile'); // ✅ استخدام defaultTab
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '0555123456',
    company: 'مؤسسة العقارات المتميزة',
    license: '123456789',
    city: 'الرياض',
    district: 'الملقا'
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    newLeads: true,
    appointments: true,
    propertyUpdates: true,
    systemUpdates: false
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showPhone: true,
    showEmail: false,
    allowDirectContact: true,
    dataCollection: true,
    analytics: true
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'ar',
    fontSize: 'medium',
    compactMode: false
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: '30',
    passwordStrength: 'strong'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = () => {
    alert('تم حفظ بيانات الملف الشخصي بنجاح!');
  };

  const handleSaveNotifications = () => {
    alert('تم حفظ إعدادات الإشعارات بنجاح!');
  };

  const handleSavePrivacy = () => {
    alert('تم حفظ إعدادات الخصوصية بنجاح!');
  };

  const handleSaveAppearance = () => {
    alert('تم حفظ إعدادات المظهر بنجاح!');
  };

  const handleSaveSecurity = () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert('كلمتا المرور غير متطابقتين');
      return;
    }
    alert('تم حفظ إعدادات الأمان بنجاح!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleExportData = () => {
    alert('سيتم تحضير ملف بياناتك وإرساله عبر البريد الإلكتروني خلال 24 ساعة');
  };

  const handleDeleteAccount = () => {
    const confirmation = confirm('هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.');
    if (confirmation) {
      alert('تم إرسال طلب حذف الحساب. سيتم التواصل معك خلال 48 ساعة لتأكيد الطلب.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7] p-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button 
          onClick={onBack}
          variant="outline" 
          className="border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-[#01411C]"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة
        </Button>
        <h1 className="text-2xl font-bold text-[#01411C]">الإعدادات</h1>
        <div className="w-20"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          {/* Tabs Navigation */}
          <TabsList className="grid w-full grid-cols-6 bg-white border-2 border-[#D4AF37] rounded-lg">
            <TabsTrigger 
              value="profile" 
              className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white"
            >
              <User className="w-4 h-4 ml-2" />
              الملف
            </TabsTrigger>
            <TabsTrigger 
              value="team" 
              className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 ml-2" />
              الفريق
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white"
            >
              <Bell className="w-4 h-4 ml-2" />
              الإشعارات
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white"
            >
              <Shield className="w-4 h-4 ml-2" />
              الخصوصية
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white"
            >
              <Palette className="w-4 h-4 ml-2" />
              المظهر
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white"
            >
              <Lock className="w-4 h-4 ml-2" />
              الأمان
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-2 border-[#D4AF37] shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <User className="w-6 h-6" />
                  الملف الشخصي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="border-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="border-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الجوال</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="border-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">اسم الشركة</Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      className="border-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license">رقم الرخصة</Label>
                    <Input
                      id="license"
                      value={profileData.license}
                      onChange={(e) => setProfileData({...profileData, license: e.target.value})}
                      className="border-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">المدينة</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                      className="border-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveProfile} className="bg-[#01411C] hover:bg-[#065f41] text-white">
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="border-2 border-[#D4AF37] shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <Bell className="w-6 h-6" />
                  إعدادات الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#01411C]">طرق الإشعار</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <span>إشعارات البريد الإلكتروني</span>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                        <span>رسائل SMS</span>
                      </div>
                      <Switch
                        checked={notifications.smsNotifications}
                        onCheckedChange={(checked) => setNotifications({...notifications, smsNotifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span>الإشعارات المباشرة</span>
                      </div>
                      <Switch
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                      />
                    </div>
                  </div>

                  <Separator />

                  <h3 className="font-semibold text-[#01411C]">أنواع الإشعارات</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>عملاء جدد</span>
                      <Switch
                        checked={notifications.newLeads}
                        onCheckedChange={(checked) => setNotifications({...notifications, newLeads: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>المواعيد</span>
                      <Switch
                        checked={notifications.appointments}
                        onCheckedChange={(checked) => setNotifications({...notifications, appointments: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>تحديثات العقارات</span>
                      <Switch
                        checked={notifications.propertyUpdates}
                        onCheckedChange={(checked) => setNotifications({...notifications, propertyUpdates: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>تحديثات النظام</span>
                      <Switch
                        checked={notifications.systemUpdates}
                        onCheckedChange={(checked) => setNotifications({...notifications, systemUpdates: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>رسائل تسويقية</span>
                      <Switch
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) => setNotifications({...notifications, marketingEmails: checked})}
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={handleSaveNotifications} className="bg-[#01411C] hover:bg-[#065f41] text-white">
                  <Save className="w-4 h-4 ml-2" />
                  حفظ الإعدادات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Management Tab */}
          <TabsContent value="team">
            <TeamManagement 
              accountType="office" // يمكن تمرير نوع الحساب الفعلي هنا
              currentUser={{
                id: '1',
                name: 'أحمد محمد',
                email: 'ahmed@example.com',
                role: 'مدير'
              }}
            />
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card className="border-2 border-[#D4AF37] shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  إعدادات الخصوصية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>مستوى ظهور الملف الشخصي</Label>
                    <Select value={privacy.profileVisibility} onValueChange={(value) => setPrivacy({...privacy, profileVisibility: value})}>
                      <SelectTrigger className="border-[#D4AF37] focus:ring-[#D4AF37]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">عام - يمكن للجميع الرؤية</SelectItem>
                        <SelectItem value="clients">العملاء فقط</SelectItem>
                        <SelectItem value="private">خاص - لا يظهر للآخرين</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>إظهار رقم الهاتف</span>
                    <Switch
                      checked={privacy.showPhone}
                      onCheckedChange={(checked) => setPrivacy({...privacy, showPhone: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>إظهار البريد الإلكتروني</span>
                    <Switch
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) => setPrivacy({...privacy, showEmail: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>السماح بالتواصل المباشر</span>
                    <Switch
                      checked={privacy.allowDirectContact}
                      onCheckedChange={(checked) => setPrivacy({...privacy, allowDirectContact: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>جمع البيانات لتحسين الخدمة</span>
                    <Switch
                      checked={privacy.dataCollection}
                      onCheckedChange={(checked) => setPrivacy({...privacy, dataCollection: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>تحليلات الاستخدام</span>
                    <Switch
                      checked={privacy.analytics}
                      onCheckedChange={(checked) => setPrivacy({...privacy, analytics: checked})}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleSavePrivacy} className="bg-[#01411C] hover:bg-[#065f41] text-white">
                    <Save className="w-4 h-4 ml-2" />
                    حفظ الإعدادات
                  </Button>
                  <Button onClick={handleExportData} variant="outline" className="border-[#D4AF37] text-[#01411C]">
                    <Download className="w-4 h-4 ml-2" />
                    تصدير بياناتي
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card className="border-2 border-[#D4AF37] shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <Palette className="w-6 h-6" />
                  إعدادات المظهر
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>المظهر</Label>
                    <Select value={appearance.theme} onValueChange={(value) => setAppearance({...appearance, theme: value})}>
                      <SelectTrigger className="border-[#D4AF37] focus:ring-[#D4AF37]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4" />
                            فاتح
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            داكن
                          </div>
                        </SelectItem>
                        <SelectItem value="auto">تلقائي (حسب النظام)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>اللغة</Label>
                    <Select value={appearance.language} onValueChange={(value) => setAppearance({...appearance, language: value})}>
                      <SelectTrigger className="border-[#D4AF37] focus:ring-[#D4AF37]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>حجم الخط</Label>
                    <Select value={appearance.fontSize} onValueChange={(value) => setAppearance({...appearance, fontSize: value})}>
                      <SelectTrigger className="border-[#D4AF37] focus:ring-[#D4AF37]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">صغير</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="large">كبير</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>الوضع المضغوط</span>
                    <Switch
                      checked={appearance.compactMode}
                      onCheckedChange={(checked) => setAppearance({...appearance, compactMode: checked})}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveAppearance} className="bg-[#01411C] hover:bg-[#065f41] text-white">
                  <Save className="w-4 h-4 ml-2" />
                  حفظ الإعدادات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="border-2 border-[#D4AF37] shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <Lock className="w-6 h-6" />
                  إعدادات الأمان
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* تغيير كلمة المرور */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#01411C]">تغيير كلمة المرور</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="border-[#D4AF37] focus:ring-[#D4AF37] pl-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute left-1 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* إعدادات الأمان الأخرى */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#01411C]">إعدادات الأمان</h3>
                  
                  <div className="flex items-center justify-between">
                    <span>المصادقة الثنائية</span>
                    <Switch
                      checked={security.twoFactorAuth}
                      onCheckedChange={(checked) => setSecurity({...security, twoFactorAuth: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>إشعارات تسجيل الدخول</span>
                    <Switch
                      checked={security.loginNotifications}
                      onCheckedChange={(checked) => setSecurity({...security, loginNotifications: checked})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>انتهاء الجلسة (دقيقة)</Label>
                    <Select value={security.sessionTimeout} onValueChange={(value) => setSecurity({...security, sessionTimeout: value})}>
                      <SelectTrigger className="border-[#D4AF37] focus:ring-[#D4AF37]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 دقيقة</SelectItem>
                        <SelectItem value="30">30 دقيقة</SelectItem>
                        <SelectItem value="60">ساعة واحدة</SelectItem>
                        <SelectItem value="120">ساعتان</SelectItem>
                        <SelectItem value="never">لا تنتهي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* منطقة الخطر */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-red-600">منطقة الخطر</h3>
                  <Button 
                    onClick={handleDeleteAccount}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                    حذف الحساب نهائياً
                  </Button>
                  <p className="text-sm text-gray-600">
                    تحذير: حذف الحساب سيؤدي إلى فقدان جميع البيانات نهائياً ولا يمكن التراجع عن هذا الإجراء.
                  </p>
                </div>

                <Button onClick={handleSaveSecurity} className="bg-[#01411C] hover:bg-[#065f41] text-white">
                  <Save className="w-4 h-4 ml-2" />
                  حفظ إعدادات الأمان
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}