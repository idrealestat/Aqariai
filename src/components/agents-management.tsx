import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  UserPlus, 
  Mail, 
  Phone,
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Settings
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  licenseNumber: string;
  phone?: string;
  email?: string;
  role: 'manager' | 'agent';
  status: 'pending' | 'active' | 'inactive';
  addedDate: string;
  inviteMethod: 'phone' | 'email';
}

interface AgentsManagementProps {
  onBack: () => void;
  user: any;
}

export function AgentsManagement({ onBack, user }: AgentsManagementProps) {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'أحمد محمد السالم',
      licenseNumber: '12345678',
      phone: '0501234567',
      email: 'ahmed@example.com',
      role: 'manager',
      status: 'active',
      addedDate: '2024-01-15',
      inviteMethod: 'phone'
    },
    {
      id: '2',
      name: 'سارة عبدالله',
      licenseNumber: '87654321',
      phone: '0557891234',
      role: 'agent',
      status: 'pending',
      addedDate: '2024-01-20',
      inviteMethod: 'email'
    }
  ]);

  const [showAddAgent, setShowAddAgent] = useState(false);
  const [newAgent, setNewAgent] = useState({
    licenseNumber: '',
    phone: '',
    email: '',
    inviteMethod: 'phone' as 'phone' | 'email'
  });

  const handleAddAgent = () => {
    if (!newAgent.licenseNumber.trim()) {
      alert('رقم رخصة فال مطلوب');
      return;
    }

    if (!newAgent.phone.trim() && !newAgent.email.trim()) {
      alert('يجب إدخال رقم الجوال أو الايميل');
      return;
    }

    const agent: Agent = {
      id: `agent-${Date.now()}`,
      name: 'في انتظار القبول',
      licenseNumber: newAgent.licenseNumber,
      phone: newAgent.phone || undefined,
      email: newAgent.email || undefined,
      role: 'agent',
      status: 'pending',
      addedDate: new Date().toISOString().split('T')[0],
      inviteMethod: newAgent.inviteMethod
    };

    setAgents([...agents, agent]);

    // إرسال الدعوة
    const inviteMessage = `لإضافتك كوسيط في ${user?.companyName || user?.name}، ادخل على هذا الرابط: https://play.google.com/store/apps/details?id=com.waseety.app`;
    
    if (newAgent.inviteMethod === 'phone' && newAgent.phone) {
      const whatsappUrl = `https://wa.me/${newAgent.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(inviteMessage)}`;
      window.open(whatsappUrl, '_blank');
    } else if (newAgent.inviteMethod === 'email' && newAgent.email) {
      const mailtoUrl = `mailto:${newAgent.email}?subject=دعوة للانضمام كوسيط&body=${encodeURIComponent(inviteMessage)}`;
      window.open(mailtoUrl, '_blank');
    }

    // إعادة تعيين النموذج
    setNewAgent({
      licenseNumber: '',
      phone: '',
      email: '',
      inviteMethod: 'phone'
    });
    setShowAddAgent(false);
  };

  const handleChangeRole = (agentId: string, newRole: 'manager' | 'agent') => {
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { ...agent, role: newRole }
        : agent
    ));
  };

  const handleActivateAgent = (agentId: string) => {
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: 'active', name: 'وسيط مفعل' } // في التطبيق الحقيقي سيأتي الاسم من التسجيل
        : agent
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'inactive': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'مفعل';
      case 'pending': return 'في الانتظار';
      case 'inactive': return 'غير مفعل';
      default: return 'غير محدد';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'manager': return 'مسؤول';
      case 'agent': return 'تابع';
      default: return 'غير محدد';
    }
  };

  if (showAddAgent) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        {/* Header */}
        <header className="bg-white shadow-sm border-b-2" style={{ borderBottomColor: '#D4AF37' }}>
          <div className="flex items-center justify-between p-4">
            <Button variant="ghost" onClick={() => setShowAddAgent(false)} className="hover:shadow-lg transition-all">
              <ArrowLeft className="w-6 h-6" style={{ color: '#01411C' }} />
            </Button>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <UserPlus className="w-8 h-8" style={{ color: '#01411C' }} />
              <span className="text-xl" style={{ color: '#01411C' }}>إضافة وسيط جديد</span>
            </div>
            
            <Button onClick={handleAddAgent} className="border-2" style={{
              backgroundColor: '#01411C',
              borderColor: '#D4AF37'
            }}>
              إرسال الدعوة
            </Button>
          </div>
        </header>

        <div className="container mx-auto p-4">
          <Card className="border-2" style={{ borderColor: '#D4AF37' }}>
            <CardHeader>
              <CardTitle style={{ color: '#01411C' }}>معلومات الوسيط</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#01411C' }}>
                  رقم رخصة فال *
                </label>
                <Input
                  value={newAgent.licenseNumber}
                  onChange={(e) => setNewAgent({ ...newAgent, licenseNumber: e.target.value })}
                  placeholder="أدخل رقم رخصة فال"
                  className="border-2"
                  style={{ borderColor: '#D4AF37' }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#01411C' }}>
                    رقم الجوال
                  </label>
                  <Input
                    value={newAgent.phone}
                    onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                    placeholder="05xxxxxxxx"
                    className="border-2"
                    style={{ borderColor: '#D4AF37' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#01411C' }}>
                    البريد الإلكتروني
                  </label>
                  <Input
                    type="email"
                    value={newAgent.email}
                    onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                    placeholder="example@email.com"
                    className="border-2"
                    style={{ borderColor: '#D4AF37' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#01411C' }}>
                  طريقة الإرسال
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="inviteMethod"
                      value="phone"
                      checked={newAgent.inviteMethod === 'phone'}
                      onChange={(e) => setNewAgent({ ...newAgent, inviteMethod: 'phone' })}
                      className="ml-2"
                    />
                    <Phone className="w-4 h-4 ml-1" />
                    واتساب
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="inviteMethod"
                      value="email"
                      checked={newAgent.inviteMethod === 'email'}
                      onChange={(e) => setNewAgent({ ...newAgent, inviteMethod: 'email' })}
                      className="ml-2"
                    />
                    <Mail className="w-4 h-4 ml-1" />
                    بريد إلكتروني
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded border" style={{ borderColor: '#D4AF37' }}>
                <p className="text-sm text-blue-800">
                  <strong>ملاحظة:</strong> سيتم إرسال رابط التطبيق للوسيط عبر الطريقة المختارة. 
                  عند تحميل التطبيق وإدخال رقم الرخصة، سيتم تفعيل حسابه تلقائياً.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2" style={{ borderBottomColor: '#D4AF37' }}>
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" onClick={onBack} className="hover:shadow-lg transition-all">
            <ArrowLeft className="w-6 h-6" style={{ color: '#01411C' }} />
          </Button>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <Users className="w-8 h-8" style={{ color: '#01411C' }} />
            <span className="text-xl" style={{ color: '#01411C' }}>إدارة الوسطاء</span>
          </div>
          
          <Button onClick={() => setShowAddAgent(true)} className="border-2" style={{
            backgroundColor: '#01411C',
            borderColor: '#D4AF37'
          }}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة وسيط
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-4">
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: '#01411C' }}>
                {agents.filter(a => a.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">وسطاء مفعلون</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
                {agents.filter(a => a.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">في الانتظار</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: '#01411C' }}>
                {agents.filter(a => a.role === 'manager').length}
              </div>
              <div className="text-sm text-gray-600">مسؤولون</div>
            </CardContent>
          </Card>
        </div>

        {/* قائمة الوسطاء */}
        <div className="space-y-4">
          {agents.map(agent => (
            <Card key={agent.id} className="border-2 shadow-sm" style={{ borderColor: '#D4AF37' }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse flex-1">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#01411C' }}>
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium" style={{ color: '#01411C' }}>{agent.name}</h3>
                        <Badge style={{ 
                          backgroundColor: getStatusColor(agent.status), 
                          color: 'white' 
                        }}>
                          {getStatusLabel(agent.status)}
                        </Badge>
                        <Badge variant="outline" style={{ borderColor: '#D4AF37', color: '#01411C' }}>
                          {getRoleLabel(agent.role)}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>رخصة فال: {agent.licenseNumber}</div>
                        {agent.phone && <div>📱 {agent.phone}</div>}
                        {agent.email && <div>📧 {agent.email}</div>}
                        <div>تاريخ الإضافة: {agent.addedDate}</div>
                        <div>طريقة الدعوة: {agent.inviteMethod === 'phone' ? 'واتساب' : 'بريد إلكتروني'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {agent.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleActivateAgent(agent.id)}
                        style={{ backgroundColor: '#10B981' }}
                      >
                        <CheckCircle className="w-4 h-4 ml-1" />
                        تفعيل
                      </Button>
                    )}
                    
                    {agent.status === 'active' && (
                      <div className="relative">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const currentRole = agent.role;
                            const newRole = currentRole === 'manager' ? 'agent' : 'manager';
                            handleChangeRole(agent.id, newRole);
                          }}
                        >
                          <Settings className="w-4 h-4 ml-1" />
                          {agent.role === 'manager' ? 'جعل تابع' : 'جعل مسؤول'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* شرح الصلاحيات */}
                {agent.status === 'active' && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    {agent.role === 'manager' ? 
                      'المسؤول: يمكنه رؤية جميع العملاء والقوائم، وإحالة العملاء للوسطاء الآخرين' :
                      'التابع: يمكنه إدارة قوائمه الخاصة ويستقبل العملاء المحالين إليه'
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {agents.length === 0 && (
            <Card className="border-2 border-dashed" style={{ borderColor: '#D4AF37' }}>
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 mx-auto mb-4" style={{ color: '#D4AF37' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: '#01411C' }}>
                  لا يوجد وسطاء مضافون
                </h3>
                <p className="text-gray-600 mb-4">
                  ابدأ بإضافة الوسطاء لفريق العمل الخاص بك
                </p>
                <Button onClick={() => setShowAddAgent(true)} style={{ backgroundColor: '#01411C' }}>
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة الوسيط الأول
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}