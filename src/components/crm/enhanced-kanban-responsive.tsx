import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Users, Clock, Target, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { VerticalColumn, Lead, Column } from './vertical-column-fixed';

interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  type: "buyer" | "seller" | "tenant" | "landlord" | "investor";
  status: "hot" | "active" | "pending" | "cold" | "completed";
  budget?: number;
  score: number;
  location?: string;
  lastContact: string;
  notes: string[];
  tags: string[];
  properties: string[];
  priority: "vip" | "urgent" | "high" | "medium" | "low";
}

interface EnhancedKanbanResponsiveProps {
  clients?: Client[];
  onUpdateClientStatus?: (clientId: string, newStatus: string) => void;
}

// تحويل العملاء إلى Leads للكانبان مع جميع التفاصيل
const convertClientsToLeads = (clients: Client[]): Lead[] => {
  return clients.map(client => ({
    id: client.id,
    name: client.name,
    phone: client.phone,
    email: client.email || '',
    propertyType: client.type === 'buyer' || client.type === 'investor' ? 'sale' : 'rent',
    budget: client.budget ? `${client.budget.toLocaleString()} ريال` : 'غير محدد',
    location: client.location || '',
    priority: client.priority as 'high' | 'medium' | 'low',
    lastContact: client.lastContact,
    source: 'نظام CRM',
    notes: client.notes.join(', ') || 'لا توجد ملاحظات',
    // إضافة البيانات المحسنة من العميل الأصلي
    score: client.score,
    tags: client.tags,
    properties: client.properties,
    type: client.type,
    status: client.status,
    // محاكاة بيانات محسنة للتفاعلات
    interactions: [
      {
        id: `int-${client.id}-1`,
        type: 'call',
        content: 'مكالمة أولية للتعارف ومناقشة المتطلبات',
        date: client.lastContact,
        outcome: client.status === 'hot' ? 'مهتم جداً' : client.status === 'active' ? 'يتابع' : 'يفكر'
      },
      {
        id: `int-${client.id}-2`,
        type: 'whatsapp',
        content: 'مشاركة عروض عقارية مناسبة',
        date: client.lastContact,
        outcome: 'تم الاطلاع'
      }
    ],
    // محاكاة بيانات عائلية
    family: {
      maritalStatus: client.type === 'buyer' ? 'متزوج' : 'أعزب',
      children: client.type === 'buyer' ? Math.floor(Math.random() * 4) : 0,
      occupation: client.type === 'investor' ? 'مستثمر' : client.type === 'landlord' ? 'مالك عقارات' : 'موظف'
    },
    // محاكاة بيانات مالية
    financials: client.budget ? {
      income: Math.round(client.budget * 0.3),
      creditScore: 700 + Math.floor(Math.random() * 150),
      preApproved: client.status === 'hot' || client.status === 'active'
    } : undefined,
    // محاكاة تذكيرات
    reminders: [
      {
        id: `rem-${client.id}-1`,
        title: 'متابعة العميل',
        description: `متابعة ${client.name} بخصوص العروض المرسلة`,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false,
        priority: client.priority as 'high' | 'medium' | 'low'
      },
      {
        id: `rem-${client.id}-2`,
        title: 'إرسال عروض جديدة',
        description: `البحث عن عروض جديدة مناسبة لـ ${client.name}`,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false,
        priority: 'medium'
      }
    ]
  }));
};

// إنشاء الأعمدة من حالات العملاء
const createColumnsFromClients = (clients: Client[]): Column[] => {
  const leads = convertClientsToLeads(clients);
  
  const statusColumns: Column[] = [
    {
      id: 'hot',
      title: 'عملاء ساخنون 🔥',
      color: '#ef4444',
      icon: '🔥',
      leads: leads.filter(lead => {
        const client = clients.find(c => c.id === lead.id);
        return client?.status === 'hot';
      })
    },
    {
      id: 'active',
      title: 'عملاء نشطون ✅',
      color: '#10b981',
      icon: '✅',
      leads: leads.filter(lead => {
        const client = clients.find(c => c.id === lead.id);
        return client?.status === 'active';
      })
    },
    {
      id: 'pending',
      title: 'في الانتظار ⏳',
      color: '#f59e0b',
      icon: '⏳',
      leads: leads.filter(lead => {
        const client = clients.find(c => c.id === lead.id);
        return client?.status === 'pending';
      })
    },
    {
      id: 'cold',
      title: 'عملاء باردون ❄️',
      color: '#6b7280',
      icon: '❄️',
      leads: leads.filter(lead => {
        const client = clients.find(c => c.id === lead.id);
        return client?.status === 'cold';
      })
    },
    {
      id: 'completed',
      title: 'تم الإنجاز ✨',
      color: '#8b5cf6',
      icon: '✨',
      leads: leads.filter(lead => {
        const client = clients.find(c => c.id === lead.id);
        return client?.status === 'completed';
      })
    }
  ];

  return statusColumns;
};

export const EnhancedKanbanResponsive: React.FC<EnhancedKanbanResponsiveProps> = ({ 
  clients = [], 
  onUpdateClientStatus 
}) => {
  const [columns, setColumns] = useState<Column[]>(() => 
    clients.length > 0 ? createColumnsFromClients(clients) : []
  );
  const [currentColumn, setCurrentColumn] = useState(0);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // تحديد حجم الشاشة
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // تحديث الأعمدة عند تغيير بيانات العملاء
  useEffect(() => {
    if (clients.length > 0) {
      setColumns(createColumnsFromClients(clients));
    }
  }, [clients]);

  // معالجة تحديث حالة العميل مع السحب والإفلات
  const handleUpdateClientStatus = useCallback((clientId: string, newStatus: string) => {
    // تحديث الأعمدة محلياً
    const newColumns = columns.map(column => {
      // إزالة العميل من العمود الحالي
      const filteredLeads = column.leads.filter(lead => lead.id !== clientId);
      
      // إضافة العميل للعمود الجديد
      if (column.id === newStatus) {
        const clientLead = columns
          .flatMap(col => col.leads)
          .find(lead => lead.id === clientId);
        
        if (clientLead) {
          return { ...column, leads: [...filteredLeads, clientLead] };
        }
      }
      
      return { ...column, leads: filteredLeads };
    });

    setColumns(newColumns);

    // تحديث حالة العميل في البيانات الأصلية
    if (onUpdateClientStatus) {
      onUpdateClientStatus(clientId, newStatus);
    }
  }, [columns, onUpdateClientStatus]);

  // معالجة نقل البطاقة بين الأعمدة (السحب والإفلات)
  const handleMoveCard = useCallback((leadId: string, fromColumn: string, toColumn: string) => {
    if (fromColumn === toColumn) return;

    const newColumns = columns.map(column => {
      if (column.id === fromColumn) {
        // إزالة البطاقة من العمود الأصلي
        return { ...column, leads: column.leads.filter(lead => lead.id !== leadId) };
      } else if (column.id === toColumn) {
        // إضافة البطاقة للعمود الجديد
        const leadToMove = columns
          .find(col => col.id === fromColumn)?.leads
          .find(lead => lead.id === leadId);
        
        if (leadToMove) {
          return { ...column, leads: [...column.leads, leadToMove] };
        }
      }
      return column;
    });

    setColumns(newColumns);

    // تحديث حالة العميل في البيانات الأصلية
    if (onUpdateClientStatus) {
      onUpdateClientStatus(leadId, toColumn);
    }
  }, [columns, onUpdateClientStatus]);

  // إضافة قائمة جديدة
  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;

    const newColumn: Column = {
      id: `column-${Date.now()}`,
      title: newColumnTitle,
      color: '#64748b',
      icon: '📋',
      leads: []
    };

    setColumns([...columns, newColumn]);
    setNewColumnTitle('');
    setIsAddingColumn(false);
  };

  // حذف قائمة
  const handleDeleteColumn = (columnId: string) => {
    if (columns.length <= 1) return;
    setColumns(columns.filter(col => col.id !== columnId));
  };

  // إضافة عميل جديد
  const handleAddLead = (columnId: string, leadData: Partial<Lead>) => {
    const lead: Lead = {
      id: `lead-${Date.now()}`,
      name: leadData.name || '',
      phone: leadData.phone || '',
      email: leadData.email || '',
      propertyType: leadData.propertyType || 'sale',
      budget: leadData.budget || '',
      location: leadData.location || '',
      priority: leadData.priority || 'medium',
      lastContact: new Date().toISOString().split('T')[0],
      source: leadData.source || 'يدوي',
      notes: leadData.notes || ''
    };

    setColumns(columns.map(col => 
      col.id === columnId 
        ? { ...col, leads: [...col.leads, lead] }
        : col
    ));
  };

  // تعديل عنوان القائمة
  const handleEditColumn = (columnId: string, newTitle: string) => {
    setColumns(columns.map(col => 
      col.id === columnId 
        ? { ...col, title: newTitle }
        : col
    ));
  };

  // التنقل للموبايل
  const handleMobileNavigation = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentColumn < columns.length - 1) {
      setCurrentColumn(currentColumn + 1);
    } else if (direction === 'prev' && currentColumn > 0) {
      setCurrentColumn(currentColumn - 1);
    }
  };

  // التمرير الأفقي لسطح المكتب
  const handleDesktopScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // عرض عمود واحد + المسافة
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'right' 
        ? currentScroll + scrollAmount 
        : currentScroll - scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  // مكون القائمة العمودية المحسن مع السحب والإفلات
  const ColumnComponent: React.FC<{ column: Column; index: number }> = ({ column, index }) => (
    <VerticalColumn 
      column={column} 
      index={index}
      onAddLead={handleAddLead}
      onEditColumn={handleEditColumn}
      onDeleteColumn={handleDeleteColumn}
      onMoveCard={handleMoveCard}
      canDelete={columns.length > 1}
    />
  );

  if (columns.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>لا توجد عملاء لعرضها</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7]" dir="rtl">
      {/* Header للموبايل */}
      {isMobile && (
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg font-bold text-[#01411C]">Kanban المتقدم</h1>
                <p className="text-sm text-gray-600">
                  {columns[currentColumn]?.title} ({columns[currentColumn]?.leads.length} عميل)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMobileNavigation('prev')}
                disabled={currentColumn === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMobileNavigation('next')}
                disabled={currentColumn === columns.length - 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* مؤشرات الصفحات */}
          <div className="flex justify-center gap-2 mt-4">
            {columns.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentColumn(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentColumn 
                    ? 'bg-[#D4AF37] w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* محتوى الـ Kanban */}
      <div className="flex-1 p-4">
        {isMobile ? (
          /* عرض الموبايل - قائمة واحدة بالكامل */
          <div className="h-full overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out h-full"
              style={{ transform: `translateX(${-currentColumn * 100}%)` }}
            >
              {columns.map((column, index) => (
                <div key={column.id} className="w-full flex-shrink-0 px-2">
                  <ColumnComponent column={column} index={index} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* عرض سطح المكتب - أعمدة متجانبة مع تمرير أفقي */
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className="kanban-columns-container" 
              style={{ minHeight: '600px' }}
            >
              {columns.map((column, index) => (
                <div key={column.id} className="kanban-column">
                  <ColumnComponent column={column} index={index} />
                </div>
              ))}
              
              {/* مساحة للزر العائم */}
              <div className="w-4 flex-shrink-0"></div>
            </div>

            {/* أزرار التمرير للديسكتوب */}
            {columns.length > 3 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDesktopScroll('left')}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border-[#D4AF37] text-[#01411C] shadow-lg"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDesktopScroll('right')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border-[#D4AF37] text-[#01411C] shadow-lg"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* زر إضافة عمود جديد - سطح المكتب فقط */}
      {!isMobile && (
        <Button
          onClick={() => setIsAddingColumn(true)}
          className="fixed bottom-6 left-6 bg-[#01411C] hover:bg-[#065f41] text-white shadow-lg"
        >
          <Plus className="h-4 w-4 ml-1" />
          مرحلة جديدة
        </Button>
      )}

      {/* نموذج إضافة قائمة جديدة */}
      <Dialog open={isAddingColumn} onOpenChange={setIsAddingColumn}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة مرحلة جديدة</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="columnTitle">اسم المرحلة</Label>
              <input
                id="columnTitle"
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="مثال: عملاء مهتمون"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddColumn}
                className="flex-1 bg-[#01411C] hover:bg-[#065f41]"
                disabled={!newColumnTitle.trim()}
              >
                إضافة المرحلة
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingColumn(false);
                  setNewColumnTitle('');
                }}
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedKanbanResponsive;