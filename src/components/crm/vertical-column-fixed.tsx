import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, MoreVertical, Phone, Mail, MapPin, User, Move, Grip,
  MessageSquare, FileText, Bell, TrendingUp, BarChart3, DollarSign, Star, Clock,
  Eye, EyeOff, Activity, Target, Award, Send, Bookmark, Tag, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  propertyType: 'sale' | 'rent';
  budget: string;
  location: string;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
  lastContact: string;
  source: string;
  avatar?: string;
  // إضافات جديدة للتفاصيل المحسنة
  score?: number;
  tags?: string[];
  properties?: string[];
  type?: 'buyer' | 'seller' | 'tenant' | 'landlord' | 'investor';
  status?: 'hot' | 'active' | 'pending' | 'cold' | 'completed';
  interactions?: Array<{
    id: string;
    type: 'call' | 'email' | 'meeting' | 'whatsapp';
    content: string;
    date: string;
    outcome?: string;
  }>;
  family?: {
    maritalStatus?: string;
    children?: number;
    occupation?: string;
  };
  financials?: {
    income?: number;
    creditScore?: number;
    preApproved?: boolean;
  };
  reminders?: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export interface Column {
  id: string;
  title: string;
  leads: Lead[];
  color: string;
  icon: string;
}

interface VerticalColumnProps {
  column: Column;
  index: number;
  onAddLead?: (columnId: string, lead: Partial<Lead>) => void;
  onEditColumn?: (columnId: string, newTitle: string) => void;
  onDeleteColumn?: (columnId: string) => void;
  onMoveCard?: (leadId: string, fromColumn: string, toColumn: string) => void;
  canDelete?: boolean;
}

// مكون بطاقة العميل القابل للسحب
interface DraggableLeadCardProps {
  lead: Lead;
  priorityColor: string;
  priorityText: string;
  columnId: string;
  onMoveCard?: (leadId: string, fromColumn: string, toColumn: string) => void;
}

const DraggableLeadCard: React.FC<DraggableLeadCardProps> = ({ 
  lead, 
  priorityColor, 
  priorityText, 
  columnId,
  onMoveCard 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dropZone, setDropZone] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ isDragging: boolean; startPos: { x: number; y: number } }>({
    isDragging: false,
    startPos: { x: 0, y: 0 }
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'hot': return 'bg-red-50 text-red-600 border-red-200';
      case 'active': return 'bg-green-50 text-green-600 border-green-200';
      case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'cold': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'completed': return 'bg-purple-50 text-purple-600 border-purple-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'hot': return '🔥 ساخن';
      case 'active': return '✅ نشط';
      case 'pending': return '⏳ معلق';
      case 'cold': return '❄️ بارد';
      case 'completed': return '✨ مكتمل';
      default: return '📋 جديد';
    }
  };

  // بداية السحب
  const handleDragStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragRef.current = {
      isDragging: true,
      startPos: { x: clientX, y: clientY }
    };

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top
      });
    }
  }, []);

  // أثناء السحب
  const handleDragMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (!dragRef.current.isDragging) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (cardRef.current) {
      const newX = clientX - dragOffset.x;
      const newY = clientY - dragOffset.y;
      
      cardRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
      cardRef.current.style.zIndex = '1000';
      cardRef.current.style.pointerEvents = 'none';
    }

    // البحث عن منطقة الإسقاط
    const elementsBelow = document.elementsFromPoint(clientX, clientY);
    const dropColumn = elementsBelow.find(el => el.classList.contains('drop-zone'));
    
    if (dropColumn) {
      const newDropZone = dropColumn.getAttribute('data-column-id');
      setDropZone(newDropZone);
    } else {
      setDropZone(null);
    }
  }, [dragOffset]);

  // انتهاء السحب
  const handleDragEnd = useCallback(() => {
    if (!dragRef.current.isDragging) return;
    
    dragRef.current.isDragging = false;
    setIsDragging(false);

    if (cardRef.current) {
      cardRef.current.style.transform = '';
      cardRef.current.style.zIndex = '';
      cardRef.current.style.pointerEvents = '';
    }

    // إذا كانت هناك منطقة إسقاط صالحة
    if (dropZone && dropZone !== columnId && onMoveCard) {
      onMoveCard(lead.id, columnId, dropZone);
    }
    
    setDropZone(null);
  }, [dropZone, columnId, lead.id, onMoveCard]);

  // إضافة event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  return (
    <Card 
      ref={cardRef}
      className={`mb-2 hover:shadow-lg transition-all duration-300 border-2 ${
        isDragging ? 'opacity-50' : ''
      } ${showDetails ? 'border-[#D4AF37] shadow-xl bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7]' : 'border-gray-200 hover:border-[#D4AF37]/50 bg-white'} relative`}
    >
      {/* مؤشر بصري للتفاصيل */}
      {!showDetails && (lead.interactions?.length || lead.family || lead.financials || lead.reminders?.length) && (
        <div className="absolute top-2 left-2 w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          {/* مقبض السحب والمعلومات الأساسية */}
          <div className="flex items-center gap-2 flex-1">
            <div 
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded touch-none"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <Grip className="h-4 w-4 text-gray-400" />
            </div>
            
            <Avatar className="h-10 w-10 border-2 border-[#D4AF37]">
              <AvatarImage src={lead.avatar} />
              <AvatarFallback className="bg-[#01411C] text-white font-bold">
                {lead.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#01411C] hover:text-[#D4AF37] transition-colors text-sm truncate">
                {lead.name}
              </h4>
              {!isExpanded && (
                <div className="text-xs text-gray-400 mb-1">
                  👆 اضغط السهم للمزيد
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                {lead.status && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(lead.status)}`}
                  >
                    {getStatusLabel(lead.status)}
                  </Badge>
                )}
                <Badge variant={priorityColor as any} className="text-xs">
                  {priorityText}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {lead.score && (
              <div className="text-center">
                <div className="text-lg font-bold text-[#01411C]">{lead.score}</div>
                <div className="text-xs text-gray-500">نقاط</div>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* المعلومات الأساسية - تظهر فقط عند التوسع الأولي */}
        {isExpanded && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{lead.phone}</span>
          </div>
          {lead.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          {lead.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{lead.location}</span>
            </div>
          )}
          {lead.budget && (
            <div className="text-sm text-gray-600">
              <strong>الميزانية:</strong> {lead.budget}
            </div>
          )}
          
          {/* مؤشر وجود تفاصيل إضافية */}
          {!showDetails && (lead.interactions?.length || lead.family || lead.financials || lead.reminders?.length) && (
            <div className="text-xs text-[#D4AF37] font-medium mt-2 bg-[#D4AF37]/10 px-2 py-1 rounded border border-[#D4AF37]/30 animate-pulse">
              💎 متوفر تفاصيل متقدمة ({
                (lead.interactions?.length || 0) + 
                (lead.family ? 1 : 0) + 
                (lead.financials ? 1 : 0) +
                (lead.reminders?.length || 0)
              } عناصر) - اضغط "💎 التفاصيل" أدناه
            </div>
          )}
          
          {/* أزرار العمليات السريعة */}
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
              <Phone className="h-3 w-3 mr-1" />
              اتصال
            </Button>
            <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              رسالة
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={`flex-1 h-8 text-xs font-bold transition-all duration-300 ${
                showDetails 
                  ? 'border-red-500 text-red-600 hover:bg-red-500 hover:text-white bg-red-50' 
                  : 'border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-white bg-[#D4AF37]/10 animate-pulse'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
            >
              {showDetails ? (
                <>
                  <EyeOff className="h-3 w-3 mr-1" />
                  إخفاء التفاصيل
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3 mr-1" />
                  💎 التفاصيل
                </>
              )}
            </Button>
          </div>
        </div>
        )}

        {/* التوسع المحسن - نفس نمط القائمة التفصيلية */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="border-t-2 border-[#D4AF37] bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7] mt-4 pt-4"
            >
              {/* إحصائيات سريعة محسنة */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-white p-2 rounded-lg border border-blue-200 text-center">
                  <div className="text-sm font-bold text-blue-600">{lead.interactions?.length || 0}</div>
                  <div className="text-xs text-gray-600">تفاعلات</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-green-200 text-center">
                  <div className="text-sm font-bold text-green-600">{lead.properties?.length || 0}</div>
                  <div className="text-xs text-gray-600">عقارات</div>
                </div>
              </div>

              {/* التبويبات المحسنة */}
              <div className="flex flex-wrap gap-1 border-b border-[#D4AF37]/30 pb-2 mb-3">
                {[
                  { id: 'overview', label: '📊', icon: BarChart3 },
                  { id: 'interactions', label: '💬', icon: MessageSquare },
                  { id: 'documents', label: '📁', icon: FileText },
                  { id: 'reminders', label: '⏰', icon: Bell }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab(tab.id);
                    }}
                    className={`px-2 py-1 text-xs rounded transition-all ${
                      activeTab === tab.id 
                        ? 'bg-[#01411C] text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-3 h-3 inline" />
                    <span className="ml-1">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* محتوى التبويبات */}
              <div className="min-h-[120px] text-sm">
                {activeTab === 'overview' && (
                  <div className="space-y-3">
                    {/* معلومات شخصية */}
                    {lead.family && (
                      <Card className="border-[#D4AF37]/30 bg-white/80">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-[#01411C] text-xs flex items-center gap-1">
                            <User className="w-3 h-3" />
                            معلومات شخصية
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-xs">
                          {lead.family.maritalStatus && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">الحالة:</span>
                              <span className="font-medium">{lead.family.maritalStatus}</span>
                            </div>
                          )}
                          {lead.family.children !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">الأطفال:</span>
                              <span className="font-medium">{lead.family.children}</span>
                            </div>
                          )}
                          {lead.family.occupation && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">المهنة:</span>
                              <span className="font-medium">{lead.family.occupation}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* معلومات مالية */}
                    {lead.financials && (
                      <Card className="border-[#D4AF37]/30 bg-white/80">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-[#01411C] text-xs flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            معلومات مالية
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-xs">
                          {lead.financials.income && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">الراتب:</span>
                              <span className="font-bold">{lead.financials.income.toLocaleString()} ريال</span>
                            </div>
                          )}
                          {lead.financials.creditScore && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">التقييم الائتماني:</span>
                              <span className="font-bold text-green-600">{lead.financials.creditScore}</span>
                            </div>
                          )}
                          {typeof lead.financials.preApproved === 'boolean' && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">الموافقة المسبقة:</span>
                              <span className={`font-bold ${lead.financials.preApproved ? 'text-green-600' : 'text-red-600'}`}>
                                {lead.financials.preApproved ? '✅ معتمد' : '❌ غير معتمد'}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* معلومات عامة */}
                    <div className="text-xs text-gray-500">
                      آخر تواصل: {lead.lastContact}
                    </div>
                    {lead.tags && lead.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {lead.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'interactions' && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-[#01411C] mb-2">💬 سجل التفاعلات</h4>
                    {lead.interactions && lead.interactions.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {lead.interactions.slice(0, 3).map((interaction) => (
                          <div key={interaction.id} className="p-2 border rounded-lg bg-white">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-xs">
                                  {interaction.type === 'call' ? '📞 مكالمة' :
                                   interaction.type === 'email' ? '📧 إيميل' :
                                   interaction.type === 'meeting' ? '🤝 اجتماع' : '💬 واتساب'}
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{interaction.content}</p>
                                {interaction.outcome && (
                                  <p className="text-xs text-green-600 font-medium">النتيجة: {interaction.outcome}</p>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">{interaction.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs">لا توجد تفاعلات مسجلة</p>
                    )}
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-[#01411C] mb-2">📁 المستندات</h4>
                    <p className="text-gray-500 text-xs">لا توجد مستندات مرفقة</p>
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                      <Plus className="w-3 h-3 mr-1" />
                      إضافة مستند
                    </Button>
                  </div>
                )}

                {activeTab === 'reminders' && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-[#01411C] mb-2">⏰ التذكيرات</h4>
                    {lead.reminders && lead.reminders.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {lead.reminders.slice(0, 3).map((reminder) => (
                          <div key={reminder.id} className="p-2 border rounded-lg bg-white">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-xs">{reminder.title}</div>
                                <p className="text-xs text-gray-600">{reminder.description}</p>
                              </div>
                              <Badge variant={reminder.completed ? 'default' : 'destructive'} className="text-xs">
                                {reminder.completed ? '✅' : '⏰'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs">لا توجد تذكيرات</p>
                    )}
                  </div>
                )}
              </div>

              {/* أزرار العمليات المحسنة */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-[#D4AF37]/30">
                <Button size="sm" className="bg-[#01411C] hover:bg-[#065f41] text-xs h-7">
                  <Edit2 className="w-3 h-3 mr-1" />
                  تعديل
                </Button>
                <Button variant="outline" size="sm" className="border-green-500 text-green-600 text-xs h-7">
                  <Plus className="w-3 h-3 mr-1" />
                  تفاعل
                </Button>
                <Button variant="outline" size="sm" className="border-blue-500 text-blue-600 text-xs h-7">
                  <Calendar className="w-3 h-3 mr-1" />
                  موعد
                </Button>
                <Button variant="outline" size="sm" className="border-[#D4AF37] text-[#01411C] text-xs h-7">
                  <FileText className="w-3 h-3 mr-1" />
                  تقرير
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export const VerticalColumn: React.FC<VerticalColumnProps> = ({
  column,
  index,
  onAddLead,
  onEditColumn,
  onDeleteColumn,
  onMoveCard,
  canDelete = true
}) => {
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [newLead, setNewLead] = useState<Partial<Lead>>({});
  const [isDragOver, setIsDragOver] = useState(false);

  const handleAddLead = () => {
    if (!newLead.name || !newLead.phone) return;

    const lead: Lead = {
      id: `lead-${Date.now()}`,
      name: newLead.name,
      phone: newLead.phone,
      email: newLead.email || '',
      propertyType: (newLead.propertyType as 'sale' | 'rent') || 'sale',
      budget: newLead.budget || '',
      location: newLead.location || '',
      priority: (newLead.priority as 'high' | 'medium' | 'low') || 'medium',
      lastContact: new Date().toISOString().split('T')[0],
      source: newLead.source || 'يدوي',
      notes: newLead.notes || ''
    };

    onAddLead?.(column.id, lead);
    setNewLead({});
    setIsAddingLead(false);
  };

  const handleEditTitle = () => {
    if (newTitle.trim() && newTitle !== column.title) {
      onEditColumn?.(column.id, newTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return 'غير محدد';
    }
  };

  return (
    <Card className={`bg-gray-50 w-full min-h-[500px] crm-column ${isDragOver ? 'ring-2 ring-[#D4AF37] bg-[#f0fdf4]' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{column.icon}</span>
            {isEditingTitle ? (
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={handleEditTitle}
                onKeyPress={(e) => e.key === 'Enter' && handleEditTitle()}
                className="h-8 text-sm font-semibold px-2 border border-gray-300 rounded focus:border-[#D4AF37] focus:outline-none"
                autoFocus
              />
            ) : (
              <h3 
                className="font-semibold text-[#01411C] cursor-pointer hover:text-[#D4AF37]"
                onClick={() => setIsEditingTitle(true)}
              >
                {column.title}
              </h3>
            )}
            <Badge variant="secondary" className="text-xs">
              {column.leads.length}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingLead(true)}
              className="h-8 w-8 p-0 hover:bg-[#D4AF37] hover:text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md" dir="rtl">
                <DialogHeader>
                  <DialogTitle>إدارة القائمة</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingTitle(true)}
                    className="w-full justify-start"
                  >
                    <Edit2 className="h-4 w-4 ml-2" />
                    تعديل اسم القائمة
                  </Button>
                  
                  {canDelete && (
                    <Button
                      variant="destructive"
                      onClick={() => onDeleteColumn?.(column.id)}
                      className="w-full justify-start"
                    >
                      <Trash2 className="h-4 w-4 ml-2" />
                      حذف القائمة
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div 
          className={`min-h-[200px] transition-colors duration-200 rounded-lg p-2 space-y-3 drop-zone`}
          data-column-id={column.id}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={() => setIsDragOver(false)}
        >
          {column.leads.map((lead, leadIndex) => (
            <DraggableLeadCard 
              key={lead.id} 
              lead={lead} 
              priorityColor={getPriorityColor(lead.priority)}
              priorityText={getPriorityText(lead.priority)}
              columnId={column.id}
              onMoveCard={onMoveCard}
            />
          ))}
          
          {/* منطقة الإسقاط المرئية */}
          {isDragOver && (
            <div className="border-2 border-dashed border-[#D4AF37] bg-[#f0fdf4] rounded-lg p-4 text-center text-sm text-[#01411C]">
              <Move className="h-5 w-5 mx-auto mb-2 text-[#D4AF37]" />
              إفلات البطاقة هنا
            </div>
          )}
        </div>

        {/* نموذج إضافة عميل جديد */}
        {isAddingLead && (
          <div className="mt-3 p-3 bg-white rounded-lg border-2 border-[#D4AF37]">
            <h4 className="font-medium text-[#01411C] mb-3">إضافة عميل جديد</h4>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="leadName" className="text-sm">اسم العميل *</Label>
                <input
                  id="leadName"
                  type="text"
                  placeholder="اسم العميل"
                  value={newLead.name || ''}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#D4AF37] focus:outline-none text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="leadPhone" className="text-sm">رقم الهاتف *</Label>
                <input
                  id="leadPhone"
                  type="tel"
                  placeholder="05xxxxxxxx"
                  value={newLead.phone || ''}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#D4AF37] focus:outline-none text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="leadEmail" className="text-sm">البريد الإلكتروني</Label>
                <input
                  id="leadEmail"
                  type="email"
                  placeholder="example@email.com"
                  value={newLead.email || ''}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#D4AF37] focus:outline-none text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="leadLocation" className="text-sm">الموقع</Label>
                <input
                  id="leadLocation"
                  type="text"
                  placeholder="المدينة - الحي"
                  value={newLead.location || ''}
                  onChange={(e) => setNewLead({ ...newLead, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#D4AF37] focus:outline-none text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="leadBudget" className="text-sm">الميزانية</Label>
                <input
                  id="leadBudget"
                  type="text"
                  placeholder="مثال: 500,000 - 800,000 ريال"
                  value={newLead.budget || ''}
                  onChange={(e) => setNewLead({ ...newLead, budget: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#D4AF37] focus:outline-none text-sm mt-1"
                />
              </div>

              <div>
                <Label className="text-sm">نوع العقار</Label>
                <div className="flex gap-2 mt-1">
                  <Button
                    type="button"
                    variant={newLead.propertyType === 'sale' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewLead({ ...newLead, propertyType: 'sale' })}
                    className="flex-1"
                  >
                    بيع
                  </Button>
                  <Button
                    type="button"
                    variant={newLead.propertyType === 'rent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewLead({ ...newLead, propertyType: 'rent' })}
                    className="flex-1"
                  >
                    إيجار
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm">الأولوية</Label>
                <div className="flex gap-1 mt-1">
                  <Button
                    type="button"
                    variant={newLead.priority === 'high' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => setNewLead({ ...newLead, priority: 'high' })}
                    className="flex-1 text-xs"
                  >
                    عالي
                  </Button>
                  <Button
                    type="button"
                    variant={newLead.priority === 'medium' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewLead({ ...newLead, priority: 'medium' })}
                    className="flex-1 text-xs"
                  >
                    متوسط
                  </Button>
                  <Button
                    type="button"
                    variant={newLead.priority === 'low' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setNewLead({ ...newLead, priority: 'low' })}
                    className="flex-1 text-xs"
                  >
                    منخفض
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleAddLead}
                className="flex-1 bg-[#01411C] hover:bg-[#065f41]"
                disabled={!newLead.name || !newLead.phone}
              >
                إضافة العميل
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingLead(false);
                  setNewLead({});
                }}
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerticalColumn;