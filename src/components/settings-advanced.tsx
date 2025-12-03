import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, User, Users, Building, Building2, Settings, Phone, Mail, 
  Edit, Save, Plus, Trash2, Shield, Star, Crown, Award,
  AlertCircle, CheckCircle, UserPlus, UserMinus, UserCheck
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";

interface SettingsAdvancedProps {
  onBack: () => void;
  currentUser?: {
    name: string;
    phone?: string;
    type?: string;
    email?: string;
    plan?: string;
  };
  defaultTab?: string;
}

// بيانات تجريبية للزملاء
const mockTeamMembers = [
  {
    id: "1",
    name: "أحمد محمد الأحمد",
    email: "ahmed@example.com",
    phone: "0501234567",
    role: "مدير فرع",
    permissions: ["إدارة العقارات", "إدارة العملاء", "التقارير"],
    joinDate: "2024-01-15",
    active: true
  },
  {
    id: "2", 
    name: "فاطمة سالم الزهراني",
    email: "fatima@example.com",
    phone: "0507654321",
    role: "وسيط عقاري",
    permissions: ["إدارة العقارات", "إدارة العملاء"],
    joinDate: "2024-02-01",
    active: true
  },
  {
    id: "3",
    name: "محمد عبدالله الشهري", 
    email: "mohammed@example.com",
    phone: "0509876543",
    role: "مساعد وسيط",
    permissions: ["إدارة العقارات"],
    joinDate: "2024-02-15",
    active: false
  }
];

export function SettingsAdvanced({ onBack, currentUser, defaultTab }: SettingsAdvancedProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || "account");
  const [teamMembers, setTeamMembers] = useState(() => {
    // تحميل الزملاء من localStorage أو استخدام البيانات التجريبية
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crm-team-members');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error('خطأ في تحميل الزملاء:', error);
        }
      }
    }
    return mockTeamMembers;
  });
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  
  // حصول على نوع الحساب لتحديد عرض إدارة الزملاء
  const accountType = currentUser?.type || "individual";
  const showTeamManagement = true; // إظهار إدارة الزملاء لجميع أنواع الحسابات

  // دالة للحصول على عنوان إدارة الفريق حسب نوع الحساب
  const getTeamTitle = () => {
    switch (accountType) {
      case "team": return "إدارة أعضاء الفريق";
      case "office": return "إدارة موظفي المكتب";
      case "company": return "إدارة موظفي الشركة";
      default: return "إدارة الزملاء";
    }
  };

  const getTeamDescription = () => {
    switch (accountType) {
      case "team": return "إدارة أعضاء فريقك وصلاحياتهم";
      case "office": return "إدارة موظفي المكتب والأقسام";
      case "company": return "إدارة جميع موظفي الشركة والفروع";
      default: return "إدارة الزملاء والمتعاونين";
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const handleToggleMemberStatus = (memberId: string) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === memberId 
          ? { ...member, active: !member.active }
          : member
      )
    );
  };

  // حفظ الزملاء في localStorage عند التغيير
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('crm-team-members', JSON.stringify(teamMembers));
      
      // إرسال event للتحديث
      window.dispatchEvent(new CustomEvent('team-members-updated', {
        detail: { members: teamMembers }
      }));
    }
  }, [teamMembers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7]" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b-2 border-[#D4AF37] shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 text-[#01411C] hover:text-[#D4AF37] hover:bg-[#f0fdf4]"
            >
              <ArrowRight className="w-5 h-5" />
              <span>العودة</span>
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-[#01411C]">
                الإعدادات والإدارة
              </h1>
              <p className="text-sm text-gray-600">
                إدارة الحساب {showTeamManagement && "والزملاء"}
              </p>
            </div>
            
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              الحساب الشخصي
            </TabsTrigger>
            
            {showTeamManagement && (
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {accountType === "team" ? "الفريق" : accountType === "office" ? "المكتب" : "الشركة"}
              </TabsTrigger>
            )}
            
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              الصلاحيات
            </TabsTrigger>
            
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              متقدم
            </TabsTrigger>
          </TabsList>

          {/* Account Settings Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card className="border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#01411C]">
                  <User className="w-5 h-5" />
                  معلومات الحساب الشخصي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-4 border-[#D4AF37]">
                      <AvatarFallback className="bg-[#01411C] text-white text-xl">
                        {currentUser?.name?.charAt(0) || "و"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold text-[#01411C]">
                        {currentUser?.name || "اسم المستخدم"}
                      </h3>
                      <p className="text-gray-600">{currentUser?.email || "user@example.com"}</p>
                      <Badge className="mt-1 bg-[#D4AF37] text-[#01411C]">
                        {accountType === "individual" ? "حساب فردي" :
                         accountType === "team" ? "حساب فريق" :
                         accountType === "office" ? "حساب مكتب" :
                         accountType === "company" ? "حساب شركة" : "حساب عادي"}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => setEditingProfile(!editingProfile)}
                    className="border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4]"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    تعديل
                  </Button>
                </div>

                {editingProfile && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#01411C] mb-2">
                          الاسم الكامل
                        </label>
                        <Input 
                          defaultValue={currentUser?.name}
                          className="border-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#01411C] mb-2">
                          البريد الإلكتروني
                        </label>
                        <Input 
                          type="email"
                          defaultValue={currentUser?.email}
                          className="border-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#01411C] mb-2">
                          رقم الهاتف
                        </label>
                        <Input 
                          defaultValue={currentUser?.phone}
                          className="border-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-[#01411C] text-white hover:bg-[#065f41]">
                        <Save className="w-4 h-4 mr-2" />
                        حفظ التغييرات
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setEditingProfile(false)}
                        className="border-gray-300"
                      >
                        إلغاء
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Management Tab */}
          {showTeamManagement && (
            <TabsContent value="team" className="space-y-6">
              <Card className="border-2 border-[#D4AF37]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-[#01411C]">
                      <Users className="w-5 h-5" />
                      {getTeamTitle()}
                    </CardTitle>
                    <Button
                      onClick={() => setShowAddMember(true)}
                      className="bg-[#D4AF37] text-[#01411C] hover:bg-[#b8941f]"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      إضافة عضو جديد
                    </Button>
                  </div>
                  <p className="text-gray-600">{getTeamDescription()}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <motion.div
                        key={member.id}
                        layout
                        className="p-4 border rounded-lg hover:border-[#D4AF37] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-[#01411C] text-white">
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-[#01411C]">{member.name}</h4>
                                <Badge 
                                  variant={member.active ? "default" : "secondary"}
                                  className={member.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                                >
                                  {member.active ? "نشط" : "غير نشط"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{member.role}</p>
                              <p className="text-xs text-gray-500">{member.email} • {member.phone}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleMemberStatus(member.id)}
                              className="border-[#D4AF37] text-[#01411C]"
                            >
                              {member.active ? (
                                <>
                                  <UserMinus className="w-4 h-4 mr-1" />
                                  إيقاف
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-1" />
                                  تفعيل
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveMember(member.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">الصلاحيات:</p>
                          <div className="flex flex-wrap gap-1">
                            {member.permissions.map((permission, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Add Member Modal */}
                  <AnimatePresence>
                    {showAddMember && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                      >
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="bg-white rounded-xl p-6 w-full max-w-md"
                        >
                          <h3 className="text-lg font-bold text-[#01411C] mb-4">
                            إضافة عضو جديد
                          </h3>
                          <div className="space-y-4">
                            <Input placeholder="الاسم الكامل" className="border-[#D4AF37]" />
                            <Input placeholder="البريد الإلكتروني" type="email" className="border-[#D4AF37]" />
                            <Input placeholder="رقم الهاتف" className="border-[#D4AF37]" />
                            <Input placeholder="المنصب/الدور" className="border-[#D4AF37]" />
                          </div>
                          <div className="flex gap-2 mt-6">
                            <Button 
                              className="flex-1 bg-[#01411C] text-white hover:bg-[#065f41]"
                              onClick={() => setShowAddMember(false)}
                            >
                              إضافة العضو
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => setShowAddMember(false)}
                              className="flex-1 border-gray-300"
                            >
                              إلغاء
                            </Button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card className="border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#01411C]">
                  <Shield className="w-5 h-5" />
                  إدارة الصلاحيات والأمان
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    إعدادات الصلاحيات
                  </h3>
                  <p className="text-gray-500">
                    هذا القسم قيد التطوير وسيتم إضافته قريباً
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card className="border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#01411C]">
                  <Settings className="w-5 h-5" />
                  الإعدادات المتقدمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    الإعدادات المتقدمة
                  </h3>
                  <p className="text-gray-500">
                    المزيد من الإعدادات المتقدمة ستكون متاحة قريباً
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}