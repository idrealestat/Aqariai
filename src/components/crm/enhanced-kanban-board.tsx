import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Users, Clock, Target } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { VerticalColumn, Lead, Column } from './vertical-column';
import { MobileSwipeHandler } from './mobile-swipe-handler';

// استيراد الأنواع من vertical-column
// تم نقل أنواع البيانات إلى ملف منفصل

// بيانات تجريبية
const initialColumns: Column[] = [
  {
    id: 'leads',
    title: 'عملاء جدد',
    color: '#3b82f6',
    icon: '👋',
    leads: [
      {
        id: 'lead-1',
        name: 'أحمد محمد السعيد',
        phone: '0501234567',
        email: 'ahmed@example.com',
        propertyType: 'sale',
        budget: '500,000 - 800,000 ريال',
        location: 'الرياض - النرجس',
        priority: 'high',
        lastContact: '2024-01-15',
        source: 'موقع إلكتروني',
        notes: 'يبحث عن فيلا في حي راقي'
      },
      {
        id: 'lead-2',
        name: 'فاطمة علي الزهراني',
        phone: '0507654321',
        propertyType: 'rent',
        budget: '3,000 - 5,000 ريال/شهر',
        location: 'جدة - الروضة',
        priority: 'medium',
        lastContact: '2024-01-14',
        source: 'إحالة'
      }
    ]
  },
  {
    id: 'contacted',
    title: 'تم التواصل',
    color: '#f59e0b',
    icon: '📞',
    leads: [
      {
        id: 'lead-3',
        name: 'خالد عبدالله النصر',
        phone: '0551234567',
        propertyType: 'sale',
        budget: '1,000,000+ ريال',
        location: 'الدمام - الشاطئ',
        priority: 'high',
        lastContact: '2024-01-13',
        source: 'مكالمة هاتفية'
      }
    ]
  },
  {
    id: 'qualified',
    title: 'عملاء مؤهلون',
    color: '#10b981',
    icon: '✅',
    leads: [
      {
        id: 'lead-4',
        name: 'نورا سعد الغامدي',
        phone: '0561234567',
        propertyType: 'rent',
        budget: '4,000 ريال/شهر',
        location: 'الرياض - العليا',
        priority: 'medium',
        lastContact: '2024-01-12',
        source: 'وسائل التواصل'
      }
    ]
  },
  {
    id: 'viewing',
    title: 'معاينة العقار',
    color: '#8b5cf6',
    icon: '🏠',
    leads: []
  },
  {
    id: 'negotiation',
    title: 'في التفاوض',
    color: '#f97316',
    icon: '💬',
    leads: []
  },
  {
    id: 'closed',
    title: 'تم الإغلاق',
    color: '#06b6d4',
    icon: '🎉',
    leads: []
  }
];

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

interface EnhancedKanbanBoardProps {
  onBack?: () => void;
  clients?: Client[];
  onUpdateClientStatus?: (clientId: string, newStatus: string) => void;
}

// تحويل العملاء إلى Leads للكانبان
const convertClientsToLeads = (clients: Client[]): Lead[] => {
  return clients.map(client => ({
    id: client.id,
    name: client.name,
    phone: client.phone,
    email: client.email || '',
    propertyType: client.type === 'buyer' || client.type === 'investor' ? 'sale' : 'rent',
    budget: client.budget ? `${client.budget.toLocaleString()} ريال` : 'غير محدد',
    location: client.location || '',
    priority: client.priority,
    lastContact: client.lastContact,
    source: 'نظام CRM',
    notes: client.notes.join(', ') || 'لا توجد ملاحظات'
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

export const EnhancedKanbanBoard: React.FC<EnhancedKanbanBoardProps> = ({ 
  onBack, 
  clients = [], 
  onUpdateClientStatus 
}) => {
  const [columns, setColumns] = useState<Column[]>(() => 
    clients.length > 0 ? createColumnsFromClients(clients) : initialColumns
  );
  const [currentColumn, setCurrentColumn] = useState(0);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAddingLead, setIsAddingLead] = useState<string | null>(null);
  const [newLead, setNewLead] = useState<Partial<Lead>>({});

  const containerRef = useRef<HTMLDivElement>(null);

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

  // معالجة السحب والإفلات
  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const sourceLead = sourceColumn.leads.find(lead => lead.id === draggableId);
    if (!sourceLead) return;

    const newColumns = columns.map(column => {
      if (column.id === source.droppableId) {
        const newLeads = [...column.leads];
        newLeads.splice(source.index, 1);
        return { ...column, leads: newLeads };
      }
      
      if (column.id === destination.droppableId) {
        const newLeads = [...column.leads];
        newLeads.splice(destination.index, 0, sourceLead);
        return { ...column, leads: newLeads };
      }
      
      return column;
    });

    setColumns(newColumns);

    // تحديث حالة العميل في البيانات الأصلية
    if (onUpdateClientStatus && destination.droppableId !== source.droppableId) {
      onUpdateClientStatus(draggableId, destination.droppableId);
    }
  }, [columns]);

  // معالجة اللمس للموبايل
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentColumn < columns.length - 1) {
      setCurrentColumn(currentColumn + 1);
    }
    
    if (isRightSwipe && currentColumn > 0) {
      setCurrentColumn(currentColumn - 1);
    }
  };

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

  // مكون القائمة العمودية المحسن
  const ColumnComponent: React.FC<{ column: Column; index: number }> = ({ column, index }) => (
    <VerticalColumn 
      column={column} 
      index={index}
      onAddLead={handleAddLead}
      onEditColumn={handleEditColumn}
      onDeleteColumn={handleDeleteColumn}
      canDelete={columns.length > 1}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7]" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
            <div>
              <h1 className="text-xl font-bold text-[#01411C]">إدارة العملاء المتقدمة</h1>
              <p className="text-sm text-gray-600">نظام Kanban لمتابعة العملاء وإدارة المراحل</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{columns.reduce((acc, col) => acc + col.leads.length, 0)} عميل</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>{columns.length} مرحلة</span>
              </div>
            </div>

            <Button
              onClick={() => setIsAddingColumn(true)}
              className="bg-[#01411C] hover:bg-[#065f41] text-white"
            >
              <Plus className="h-4 w-4 ml-1" />
              مرحلة جديدة
            </Button>
          </div>
        </div>

        {/* مؤشرات الصفحات للموبايل */}
        {isMobile && (
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
        )}
      </div>

      {/* محتوى الـ Kanban */}
      <div className="flex-1 p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          {isMobile ? (
            /* عرض الموبايل - قوائم متقاربة مثل الديسكتوب */
            <div className="touch-pan-x overflow-hidden">
              <MobileSwipeHandler
                currentIndex={currentColumn}
                onIndexChange={setCurrentColumn}
                className="h-full"
              >
                {columns.map((column, index) => (
                  <div key={column.id} className="px-1 h-full">
                    <div className="w-full max-w-xs">
                      <ColumnComponent column={column} index={index} />
                    </div>
                  </div>
                ))}
              </MobileSwipeHandler>

              {/* أزرار التنقل */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentColumn(Math.max(0, currentColumn - 1))}
                  disabled={currentColumn === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronRight className="h-4 w-4" />
                  السابق
                </Button>

                <div className="text-sm text-gray-600">
                  {currentColumn + 1} من {columns.length}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentColumn(Math.min(columns.length - 1, currentColumn + 1))}
                  disabled={currentColumn === columns.length - 1}
                  className="flex items-center gap-2"
                >
                  التالي
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            /* عرض سطح المكتب - قوائم متجانبة مع مسافات محسنة */
            <div className="flex gap-3 overflow-x-auto pb-4 crm-desktop-columns px-2">
              {columns.map((column, index) => (
                <div key={column.id} className="flex-shrink-0 w-80">
                  <ColumnComponent column={column} index={index} />
                </div>
              ))}
            </div>
          )}
        </DragDropContext>
      </div>

      {/* نموذج إضافة قائمة جديدة */}
      <Dialog open={isAddingColumn} onOpenChange={setIsAddingColumn}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة مرحلة جديدة</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="columnTitle">اسم المرحلة</Label>
              <Input
                id="columnTitle"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="مثال: عملاء مهتمون"
                className="mt-1"
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

export default EnhancedKanbanBoard;