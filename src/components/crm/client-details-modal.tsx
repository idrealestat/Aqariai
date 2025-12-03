import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Phone, Mail, MapPin, Calendar, Clock, Tag, FileText, 
  Star, TrendingUp, DollarSign, Activity, Bell, CheckCircle,
  Plus, Edit, Trash2, ExternalLink, MessageSquare, BarChart3,
  ChevronDown, Copy, Share2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";

// واجهة بيانات العميل
interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: 'new' | 'contacted' | 'meeting' | 'proposal' | 'negotiation' | 'closed';
  source: string;
  location: string;
  budget: string;
  propertyType: 'sale' | 'rent';
  priority: 'high' | 'medium' | 'low';
  lastContact: string;
  notes?: string;
  tags?: string[];
  interactions?: {
    id: string;
    type: 'call' | 'email' | 'meeting' | 'message';
    content: string;
    date: string;
    outcome: string;
  }[];
  reminders?: {
    id: string;
    title: string;
    description: string;
    date: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
  }[];
  properties?: string[];
  financials?: {
    income?: number;
    creditScore?: number;
    preApproved?: boolean;
  };
  family?: {
    maritalStatus?: string;
    children?: number;
    occupation?: string;
  };
}

interface ClientDetailsModalProps {
  client: Lead;
  isOpen: boolean;
  onClose: () => void;
}

export function ClientDetailsModal({ client, isOpen, onClose }: ClientDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // إغلاق المودال عند الضغط على الخلفية
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* الخلفية المظلمة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleBackdropClick}
          />
          
          {/* المودال */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              dir="rtl"
              style={{
                touchAction: 'auto',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {/* رأس المودال */}
              <div className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white p-6 relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-4 text-white hover:bg-white/20"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </Button>
                
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-white">
                    <AvatarFallback className="text-2xl font-bold bg-[#D4AF37] text-[#01411C]">
                      {client.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">{client.name}</h2>
                    <div className="flex items-center gap-4 text-sm opacity-90">
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {client.phone}
                      </span>
                      {client.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {client.email}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {client.location}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <Badge 
                      className={`mb-2 ${
                        client.priority === 'high' ? 'bg-red-500' :
                        client.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}
                    >
                      {client.priority === 'high' ? 'أولوية عالية' : 
                       client.priority === 'medium' ? 'أولوية متوسطة' : 'أولوية منخفضة'}
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold">{client.budget}</div>
                      <div className="text-sm opacity-75">الميزانية</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* جسم المودال - قابل للتمرير */}
              <div className="flex-1 overflow-y-auto touch-scroll-smooth scrollable-container p-6">
                {/* إحصائيات سريعة */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card className="border-blue-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {client.interactions?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">التفاعلات</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-green-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {client.properties?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">العقارات</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-purple-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {client.tags?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">العلامات</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-orange-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {client.reminders?.filter(r => !r.completed).length || 0}
                      </div>
                      <div className="text-sm text-gray-600">تذكيرات نشطة</div>
                    </CardContent>
                  </Card>
                </div>

                {/* التبويبات */}
                <div className="flex flex-wrap gap-2 border-b-2 border-[#D4AF37]/30 pb-4 mb-6">
                  {[
                    { id: 'overview', label: '📊 نظرة شاملة', color: 'from-blue-500 to-blue-600' },
                    { id: 'interactions', label: '💬 التفاعلات', color: 'from-green-500 to-green-600' },
                    { id: 'reminders', label: '⏰ التذكيرات', color: 'from-orange-500 to-orange-600' },
                    { id: 'analytics', label: '📈 التحليلات', color: 'from-purple-500 to-purple-600' }
                  ].map(tab => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 flex items-center gap-2 ${
                        activeTab === tab.id 
                          ? `bg-gradient-to-r ${tab.color} text-white font-bold shadow-lg` 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tab.label}
                    </motion.button>
                  ))}
                </div>

                {/* محتوى التبويبات */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[400px] pb-6"
                  >
                    {/* تبويب النظرة الشاملة */}
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        {/* المعلومات الأساسية */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Activity className="h-5 w-5 text-[#01411C]" />
                              المعلومات الأساسية
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600">نوع العميل</label>
                                <div className="text-lg">{
                                  client.propertyType === 'sale' ? 'مشتري' : 'مستأجر'
                                }</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">المصدر</label>
                                <div className="text-lg">{client.source}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">آخر تواصل</label>
                                <div className="text-lg">{client.lastContact}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">الحالة</label>
                                <div className="text-lg">
                                  <Badge className={`${
                                    client.status === 'new' ? 'bg-blue-500' :
                                    client.status === 'contacted' ? 'bg-yellow-500' :
                                    client.status === 'meeting' ? 'bg-purple-500' :
                                    client.status === 'proposal' ? 'bg-orange-500' :
                                    client.status === 'negotiation' ? 'bg-red-500' :
                                    'bg-green-500'
                                  }`}>
                                    {client.status === 'new' ? 'جديد' :
                                     client.status === 'contacted' ? 'تم التواصل' :
                                     client.status === 'meeting' ? 'موعد' :
                                     client.status === 'proposal' ? 'عرض' :
                                     client.status === 'negotiation' ? 'تفاوض' :
                                     'مغلق'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* الملاحظات */}
                        {client.notes && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-[#01411C]" />
                                الملاحظات
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                {client.notes}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* العلامات */}
                        {client.tags && client.tags.length > 0 && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Tag className="h-5 w-5 text-[#01411C]" />
                                العلامات
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-2">
                                {client.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="bg-blue-50">
                                    {tag}
                                  </Badge>
                                ))}
                                <Badge variant="outline" className="bg-green-50">مهتم بالشراء</Badge>
                                <Badge variant="outline" className="bg-yellow-50">يفضل الدفع النقدي</Badge>
                                <Badge variant="outline" className="bg-purple-50">عميل VIP</Badge>
                                <Badge variant="outline" className="bg-red-50">يحتاج متابعة</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* التفضيلات والمتطلبات */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Star className="h-5 w-5 text-[#01411C]" />
                              التفضيلات والمتطلبات
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600">نوع العقار المفضل</label>
                                <div className="text-lg">شقة سكنية</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">عدد الغرف</label>
                                <div className="text-lg">3-4 غرف</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">المساحة المطلوبة</label>
                                <div className="text-lg">150-200 متر مربع</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">الطابق المفضل</label>
                                <div className="text-lg">الأول أو الثاني</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* سجل الزيارات */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Activity className="h-5 w-5 text-[#01411C]" />
                              سجل الزيارات
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                <div>
                                  <div className="font-medium">شقة في حي الياسمين</div>
                                  <div className="text-sm text-gray-600">4 غرف، 180 متر</div>
                                </div>
                                <div className="text-sm text-gray-500">2024-01-12</div>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                <div>
                                  <div className="font-medium">فيلا في حي النرجس</div>
                                  <div className="text-sm text-gray-600">5 غرف، 350 متر</div>
                                </div>
                                <div className="text-sm text-gray-500">2024-01-08</div>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                <div>
                                  <div className="font-medium">شقة في حي الملقا</div>
                                  <div className="text-sm text-gray-600">3 غرف، 140 متر</div>
                                </div>
                                <div className="text-sm text-gray-500">2024-01-05</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* تقييم العميل */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TrendingUp className="h-5 w-5 text-[#01411C]" />
                              تقييم العميل
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="text-2xl font-bold text-green-600 mb-1">9.2</div>
                                <div className="text-sm text-gray-600">جدية الشراء</div>
                              </div>
                              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="text-2xl font-bold text-blue-600 mb-1">8.7</div>
                                <div className="text-sm text-gray-600">سهولة التعامل</div>
                              </div>
                              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <div className="text-2xl font-bold text-purple-600 mb-1">9.5</div>
                                <div className="text-sm text-gray-600">الالتزام بالمواعيد</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* تبويب التفاعلات */}
                    {activeTab === 'interactions' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-[#01411C]">سجل التفاعلات</h3>
                          <Button size="sm" className="bg-[#01411C] hover:bg-[#065f41]">
                            <Plus className="w-4 h-4 mr-1" />
                            إضافة تفاعل
                          </Button>
                        </div>
                        
                        {client.interactions && client.interactions.length > 0 ? (
                          <div className="space-y-3">
                            {client.interactions.map((interaction) => (
                              <Card key={interaction.id} className="border-l-4 border-l-blue-500">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                      {interaction.type === 'call' && <Phone className="h-4 w-4 text-green-600" />}
                                      {interaction.type === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                                      {interaction.type === 'meeting' && <Calendar className="h-4 w-4 text-purple-600" />}
                                      {interaction.type === 'message' && <MessageSquare className="h-4 w-4 text-orange-600" />}
                                      <span className="font-medium text-[#01411C]">
                                        {interaction.type === 'call' ? 'مكالمة' :
                                         interaction.type === 'email' ? 'بريد إلكتروني' :
                                         interaction.type === 'meeting' ? 'اجتماع' : 'رسالة'}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-500">{interaction.date}</span>
                                  </div>
                                  <p className="text-gray-700 mb-2">{interaction.content}</p>
                                  <div className="text-sm text-green-600 font-medium">
                                    النتيجة: {interaction.outcome}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}

                            {/* تفاعلات إضافية للاختبار */}
                            <Card className="border-l-4 border-l-green-500">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-orange-600" />
                                    <span className="font-medium text-[#01411C]">واتساب</span>
                                  </div>
                                  <span className="text-sm text-gray-500">2024-01-15</span>
                                </div>
                                <p className="text-gray-700 mb-2">إرسال كتالوج العقارات المتاحة في المنطقة المطلوبة</p>
                                <div className="text-sm text-green-600 font-medium">
                                  النتيجة: تم الاطلاع والاستعلام عن 3 عقارات
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-purple-500">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-purple-600" />
                                    <span className="font-medium text-[#01411C]">زيارة ميدانية</span>
                                  </div>
                                  <span className="text-sm text-gray-500">2024-01-12</span>
                                </div>
                                <p className="text-gray-700 mb-2">زيارة العقار في حي الياسمين - شقة 4 غرف للبيع</p>
                                <div className="text-sm text-green-600 font-medium">
                                  النتيجة: إعجاب بالعقار وطلب دراسة التمويل
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-yellow-500">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium text-[#01411C]">بريد إلكتروني</span>
                                  </div>
                                  <span className="text-sm text-gray-500">2024-01-10</span>
                                </div>
                                <p className="text-gray-700 mb-2">إرسال دراسة التمويل العقاري وخيارات البنوك المتاحة</p>
                                <div className="text-sm text-green-600 font-medium">
                                  النتيجة: موافقة مبدئية من البنك
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-red-500">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-green-600" />
                                    <span className="font-medium text-[#01411C]">مكالمة متابعة</span>
                                  </div>
                                  <span className="text-sm text-gray-500">2024-01-08</span>
                                </div>
                                <p className="text-gray-700 mb-2">متابعة حالة طلب التمويل ومناقشة تفاصيل العقد</p>
                                <div className="text-sm text-green-600 font-medium">
                                  النتيجة: تحديد موعد توقيع العقد الأولي
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 mb-4">لا توجد تفاعلات مسجلة</p>
                            <Button variant="outline" className="border-[#D4AF37] text-[#01411C]">
                              إضافة أول تفاعل
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* تبويب التذكيرات */}
                    {activeTab === 'reminders' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-[#01411C]">إدارة التذكيرات والمهام</h3>
                          <Button size="sm" className="bg-[#01411C] hover:bg-[#065f41]">
                            <Plus className="w-4 h-4 mr-1" />
                            تذكير جديد
                          </Button>
                        </div>
                        
                        {client.reminders && client.reminders.length > 0 ? (
                          <div className="space-y-3">
                            {client.reminders.map((reminder) => (
                              <Card 
                                key={reminder.id} 
                                className={`${
                                  reminder.completed 
                                    ? 'border-green-300 bg-green-50/50' 
                                    : 'border-orange-300 bg-orange-50/50'
                                }`}
                              >
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className={`font-medium ${
                                        reminder.completed ? 'line-through text-gray-500' : 'text-[#01411C]'
                                      }`}>
                                        {reminder.title}
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                                      <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          {reminder.date}
                                        </span>
                                        {!reminder.completed && (
                                          <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700">
                                            معلق
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        className={`h-8 w-8 p-0 ${
                                          reminder.completed 
                                            ? 'text-green-600 hover:bg-green-50' 
                                            : 'text-orange-600 hover:bg-orange-50'
                                        }`}
                                      >
                                        {reminder.completed ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}

                            {/* تذكيرات إضافية للاختبار */}
                            <Card className="border-red-300 bg-red-50/50">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-[#01411C]">
                                      اتصال عاجل للتأكيد
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">الاتصال بالعميل لتأكيد موعد توقيع العقد غداً</p>
                                    <div className="flex items-center gap-3 mt-2">
                                      <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        2024-01-19
                                      </span>
                                      <Badge variant="outline" className="text-xs bg-red-100 text-red-700">
                                        عاجل
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:bg-red-50">
                                      <Clock className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="border-blue-300 bg-blue-50/50">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-[#01411C]">
                                      إرسال تفاصيل التأمين
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">إرسال عروض التأمين من الشركات المختلفة للعقار</p>
                                    <div className="flex items-center gap-3 mt-2">
                                      <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        2024-01-21
                                      </span>
                                      <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                                        متوسط
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50">
                                      <Clock className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="border-green-300 bg-green-50/50">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium line-through text-gray-500">
                                      تجهيز أوراق البنك
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">تجميع وتجهيز جميع الأوراق المطلوبة للتمويل البنكي</p>
                                    <div className="flex items-center gap-3 mt-2">
                                      <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        2024-01-18
                                      </span>
                                      <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                                        مكتمل
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600 hover:bg-green-50">
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="border-purple-300 bg-purple-50/50">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-[#01411C]">
                                      جدولة المعاينة النهائية
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">ترتيب موعد المعاينة النهائية للعقار مع خبير التقييم</p>
                                    <div className="flex items-center gap-3 mt-2">
                                      <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        2024-01-25
                                      </span>
                                      <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                                        منخفض
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-purple-600 hover:bg-purple-50">
                                      <Clock className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Bell className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 mb-4">لا توجد تذكيرات حالياً</p>
                            <Button variant="outline" className="border-[#D4AF37] text-[#01411C]">
                              إضافة أول تذكير
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* تبويب التحليلات */}
                    {activeTab === 'analytics' && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold text-[#01411C]">تحليلات العميل</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-center">نشاط العميل</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                                <div className="text-sm text-gray-600">معدل التفاعل</div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-center">احتمالية الإغلاق</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-center">
                                <div className="text-3xl font-bold text-green-600 mb-2">72%</div>
                                <div className="text-sm text-gray-600">بناءً على النشاط</div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-center">قيمة العميل</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600 mb-2">2.4M</div>
                                <div className="text-sm text-gray-600">ريال سعودي</div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-center">مدة المتابعة</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-center">
                                <div className="text-3xl font-bold text-orange-600 mb-2">45</div>
                                <div className="text-sm text-gray-600">يوم</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* تحليلات إضافية */}
                        <Card>
                          <CardHeader>
                            <CardTitle>تحليل سلوك العميل</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">12</div>
                                <div className="text-sm text-gray-600">مكالمات هاتفية</div>
                              </div>
                              <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">8</div>
                                <div className="text-sm text-gray-600">رسائل واتساب</div>
                              </div>
                              <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">5</div>
                                <div className="text-sm text-gray-600">زيارات ميدانية</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* الأهداف والإنجازات */}
                        <Card>
                          <CardHeader>
                            <CardTitle>الأهداف والإنجازات</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span>هدف الإغلاق الشهري</span>
                                <span className="text-green-600 font-bold">75%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span>التفاعل مع العميل</span>
                                <span className="text-blue-600 font-bold">90%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{width: '90%'}}></div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span>جودة المتابعة</span>
                                <span className="text-purple-600 font-bold">85%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{width: '85%'}}></div>
                              </div>
                            </div>
                        </CardContent>
                        </Card>

                        {/* توقعات مستقبلية */}
                        <Card>
                          <CardHeader>
                            <CardTitle>التوقعات المستقبلية</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <div className="text-lg font-bold text-yellow-700 mb-2">
                                  احتمالية الشراء خلال 30 يوم
                                </div>
                                <div className="text-3xl font-bold text-yellow-600">68%</div>
                              </div>
                              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                <div className="text-lg font-bold text-red-700 mb-2">
                                  مخاطر فقدان العميل
                                </div>
                                <div className="text-3xl font-bold text-red-600">15%</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* أزرار الإجراءات - مثبتة في الأسفل */}
              <div className="border-t bg-gray-50 p-6 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      تعديل
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-1" />
                      نسخ
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-1" />
                      مشاركة
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={onClose}>
                      إغلاق
                    </Button>
                    <Button className="bg-[#01411C] hover:bg-[#065f41]">
                      <Phone className="w-4 h-4 mr-1" />
                      اتصال فوري
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}