import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowRight, 
  Users, 
  Plus, 
  Mail, 
  Phone, 
  Star, 
  MoreVertical,
  UserPlus,
  Settings,
  Trash2,
  Crown,
  Shield,
  Eye,
  MessageSquare,
  TrendingUp
} from 'lucide-react';

interface ColleaguesProps {
  onBack: () => void;
}

interface Colleague {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'agent' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  joinDate: string;
  lastActive: string;
  dealsCount: number;
  revenue: number;
  rating: number;
  avatar?: string;
  permissions: string[];
}

export function Colleagues({ onBack }: ColleaguesProps) {
  const [colleagues, setColleagues] = useState<Colleague[]>([
    {
      id: '1',
      name: 'أحمد الزهراني',
      email: 'ahmed@example.com',
      phone: '0555123456',
      role: 'agent',
      status: 'active',
      joinDate: '2023-06-15',
      lastActive: '2024-01-15',
      dealsCount: 23,
      revenue: 450000,
      rating: 4.8,
      permissions: ['view_properties', 'create_leads', 'manage_clients']
    },
    {
      id: '2',
      name: 'فاطمة العتيبي',
      email: 'fatima@example.com',
      phone: '0551234567',
      role: 'agent',
      status: 'active',
      joinDate: '2023-08-20',
      lastActive: '2024-01-14',
      dealsCount: 18,
      revenue: 320000,
      rating: 4.6,
      permissions: ['view_properties', 'create_leads', 'manage_clients']
    },
    {
      id: '3',
      name: 'محمد السعيد',
      email: 'mohammed@example.com',
      phone: '0552345678',
      role: 'admin',
      status: 'active',
      joinDate: '2023-01-10',
      lastActive: '2024-01-15',
      dealsCount: 45,
      revenue: 890000,
      rating: 4.9,
      permissions: ['all_permissions']
    },
    {
      id: '4',
      name: 'نورا القحطاني',
      email: 'nora@example.com',
      phone: '0553456789',
      role: 'viewer',
      status: 'pending',
      joinDate: '2024-01-10',
      lastActive: 'لم يسجل دخول بعد',
      dealsCount: 0,
      revenue: 0,
      rating: 0,
      permissions: ['view_properties']
    }
  ]);

  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'agent'
  });

  const handleInviteColleague = () => {
    if (!inviteData.name || !inviteData.email || !inviteData.phone) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const newColleague: Colleague = {
      id: Date.now().toString(),
      name: inviteData.name,
      email: inviteData.email,
      phone: inviteData.phone,
      role: inviteData.role as 'admin' | 'agent' | 'viewer',
      status: 'pending',
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: 'لم يسجل دخول بعد',
      dealsCount: 0,
      revenue: 0,
      rating: 0,
      permissions: inviteData.role === 'admin' ? ['all_permissions'] : 
                   inviteData.role === 'agent' ? ['view_properties', 'create_leads', 'manage_clients'] :
                   ['view_properties']
    };

    setColleagues([...colleagues, newColleague]);
    setInviteData({ name: '', email: '', phone: '', role: 'agent' });
    setShowInviteDialog(false);
    alert('تم إرسال دعوة للانضمام إلى الفريق!');
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return { label: 'مدير', color: 'bg-red-100 text-red-800', icon: <Crown className="w-3 h-3" /> };
      case 'agent':
        return { label: 'وسيط', color: 'bg-blue-100 text-blue-800', icon: <Users className="w-3 h-3" /> };
      case 'viewer':
        return { label: 'مراقب', color: 'bg-gray-100 text-gray-800', icon: <Eye className="w-3 h-3" /> };
      default:
        return { label: role, color: 'bg-gray-100 text-gray-800', icon: null };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'نشط', color: 'bg-green-100 text-green-800' };
      case 'pending':
        return { label: 'في انتظار التفعيل', color: 'bg-yellow-100 text-yellow-800' };
      case 'inactive':
        return { label: 'غير نشط', color: 'bg-red-100 text-red-800' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const activeColleagues = colleagues.filter(c => c.status === 'active').length;
  const totalRevenue = colleagues.reduce((sum, c) => sum + c.revenue, 0);
  const totalDeals = colleagues.reduce((sum, c) => sum + c.dealsCount, 0);

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
        <h1 className="text-2xl font-bold text-[#01411C]">الزملاء والفريق</h1>
        <div className="w-20"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* إحصائيات الفريق */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-2 border-[#D4AF37]">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-[#01411C]" />
                <span className="text-2xl font-bold text-[#01411C]">{colleagues.length}</span>
              </div>
              <p className="text-sm text-gray-600">إجمالي أعضاء الفريق</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{activeColleagues}</span>
              </div>
              <p className="text-sm text-gray-600">الأعضاء النشطون</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{totalDeals}</span>
              </div>
              <p className="text-sm text-gray-600">إجمالي الصفقات</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-600" />
                <span className="text-lg font-bold text-yellow-600">
                  {totalRevenue.toLocaleString()} ريال
                </span>
              </div>
              <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
            </CardContent>
          </Card>
        </div>

        {/* قائمة الزملاء */}
        <Card className="border-2 border-[#D4AF37] shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Users className="w-6 h-6" />
                أعضاء الفريق
              </CardTitle>
              <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-[#D4AF37] hover:bg-[#b8941f] text-[#01411C]">
                    <Plus className="w-4 h-4 ml-2" />
                    دعوة زميل
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="text-[#01411C]">
                      <UserPlus className="w-5 h-5 inline ml-2" />
                      دعوة زميل جديد
                    </DialogTitle>
                    <DialogDescription>
                      أدخل بيانات الزميل الذي تريد دعوته للانضمام إلى فريقك
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="invite-name">الاسم الكامل *</Label>
                      <Input
                        id="invite-name"
                        placeholder="أدخل اسم الزميل"
                        value={inviteData.name}
                        onChange={(e) => setInviteData({...inviteData, name: e.target.value})}
                        className="border-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="invite-email">البريد الإلكتروني *</Label>
                      <Input
                        id="invite-email"
                        type="email"
                        placeholder="example@email.com"
                        value={inviteData.email}
                        onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                        className="border-[#D4AF37] focus:ring-[#D4AF37]"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="invite-phone">رقم الجوال *</Label>
                      <Input
                        id="invite-phone"
                        placeholder="05xxxxxxxx"
                        value={inviteData.phone}
                        onChange={(e) => setInviteData({...inviteData, phone: e.target.value})}
                        className="border-[#D4AF37] focus:ring-[#D4AF37]"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="invite-role">الدور *</Label>
                      <Select value={inviteData.role} onValueChange={(value) => setInviteData({...inviteData, role: value})}>
                        <SelectTrigger className="border-[#D4AF37] focus:ring-[#D4AF37]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agent">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              وسيط - صلاحيات كاملة
                            </div>
                          </SelectItem>
                          <SelectItem value="viewer">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              مراقب - عرض فقط
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Crown className="w-4 h-4" />
                              مدير - جميع الصلاحيات
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleInviteColleague} className="flex-1 bg-[#01411C] hover:bg-[#065f41] text-white">
                      <Mail className="w-4 h-4 ml-2" />
                      إرسال الدعوة
                    </Button>
                    <Button onClick={() => setShowInviteDialog(false)} variant="outline" className="flex-1 border-[#D4AF37] text-[#01411C]">
                      إلغاء
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-4">
              {colleagues.map((colleague) => {
                const roleInfo = getRoleInfo(colleague.role);
                const statusInfo = getStatusInfo(colleague.status);
                
                return (
                  <Card key={colleague.id} className="border hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 border-2 border-[#D4AF37]">
                            <AvatarFallback className="bg-[#01411C] text-white font-bold">
                              {colleague.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-[#01411C]">{colleague.name}</h3>
                              <Badge className={roleInfo.color}>
                                <div className="flex items-center gap-1">
                                  {roleInfo.icon}
                                  {roleInfo.label}
                                </div>
                              </Badge>
                              <Badge className={statusInfo.color}>
                                {statusInfo.label}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{colleague.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{colleague.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {colleague.status === 'active' && (
                            <div className="text-left space-y-1">
                              <div className="text-sm">
                                <span className="font-medium">{colleague.dealsCount}</span>
                                <span className="text-gray-500"> صفقة</span>
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">{colleague.revenue.toLocaleString()}</span>
                                <span className="text-gray-500"> ريال</span>
                              </div>
                              {colleague.rating > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                  <span className="text-sm font-medium">{colleague.rating}</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex flex-col gap-2">
                            <Button size="sm" className="bg-[#01411C] hover:bg-[#065f41] text-white">
                              <MessageSquare className="w-4 h-4 ml-1" />
                              رسالة
                            </Button>
                            <Button size="sm" variant="outline" className="border-[#D4AF37] text-[#01411C]">
                              <Settings className="w-4 h-4 ml-1" />
                              إدارة
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t text-xs text-gray-500 flex justify-between">
                        <span>انضم في: {colleague.joinDate}</span>
                        <span>آخر نشاط: {colleague.lastActive}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {colleagues.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">لا يوجد زملاء بعد</h3>
                <p className="text-gray-500 mb-4">ابدأ ببناء فريقك من خلال دعوة زملاء جدد</p>
                <Button onClick={() => setShowInviteDialog(true)} className="bg-[#01411C] hover:bg-[#065f41] text-white">
                  <Plus className="w-4 h-4 ml-2" />
                  دعوة أول زميل
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* نصائح إدارة الفريق */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-800 mb-2">💡 نصائح لإدارة فريق فعال:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• حدد الأدوار والصلاحيات بوضوح لكل عضو في الفريق</li>
              <li>• راقب أداء الفريق بانتظام وقدم التغذية الراجعة المناسبة</li>
              <li>• شارك الأهداف والإنجازات مع جميع أعضاء الفريق</li>
              <li>• استخدم أدوات التواصل المناسبة لضمان التنسيق الفعال</li>
              <li>• قدم التدريب والدعم اللازم لتطوير مهارات الفريق</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}