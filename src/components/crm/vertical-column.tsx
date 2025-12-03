import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MoreVertical, Phone, Mail, MapPin, User, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ClientDetailsModal } from './client-details-modal';

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
  canDelete?: boolean;
}

// مكون بطاقة العميل
interface LeadCardProps {
  lead: Lead;
  priorityColor: string;
  priorityText: string;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, priorityColor, priorityText }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  return (
    <Card className="bg-white border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <CardContent className="p-3">
        <div className="flex items-start justify-between" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2 flex-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={lead.avatar} />
              <AvatarFallback className="bg-[#01411C] text-white text-xs">
                {lead.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-[#01411C] text-sm truncate">{lead.name}</h4>
              <p className="text-xs text-gray-600 truncate">{lead.phone}</p>
            </div>
          </div>
          <Badge 
            variant={priorityColor as any}
            className="text-xs shrink-0"
          >
            {priorityText}
          </Badge>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t space-y-2">
            {lead.email && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Mail className="h-3 w-3" />
                <span className="truncate">{lead.email}</span>
              </div>
            )}
            {lead.location && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{lead.location}</span>
              </div>
            )}
            {lead.budget && (
              <div className="text-xs text-gray-600">
                <strong>الميزانية:</strong> {lead.budget}
              </div>
            )}
            <div className="text-xs text-gray-500">
              آخر تواصل: {lead.lastContact}
            </div>
            <div className="flex gap-1 mt-2">
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                <Phone className="h-3 w-3 ml-1" />
                اتصال
              </Button>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                <Mail className="h-3 w-3 ml-1" />
                رسالة
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 px-2 text-xs border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-white bg-[#D4AF37]/10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetailsModal(true);
                }}
              >
                <Eye className="h-3 w-3 ml-1" />
                التفاصيل
              </Button>
            </div>


          </div>
        )}
      </CardContent>
      
      {/* مودال التفاصيل */}
      <ClientDetailsModal 
        client={{
          ...lead,
          status: 'new' as const,
          tags: ['عميل جديد'],
          interactions: [
            {
              id: '1',
              type: 'call',
              content: 'مكالمة أولية للتعارف',
              date: lead.lastContact,
              outcome: 'مهتم'
            }
          ],
          reminders: [
            {
              id: '1',
              title: 'متابعة العميل',
              description: 'الاتصال بالعميل خلال 24 ساعة',
              date: '2024-01-20',
              completed: false,
              priority: 'high'
            }
          ]
        }}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </Card>
  );
};

export const VerticalColumn: React.FC<VerticalColumnProps> = ({
  column,
  index,
  onAddLead,
  onEditColumn,
  onDeleteColumn,
  canDelete = true
}) => {
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [newLead, setNewLead] = useState<Partial<Lead>>({});

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
    <Card className="bg-gray-50 w-full min-h-[500px] crm-column">
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
        <div className="min-h-[200px] transition-colors duration-200 rounded-lg p-2 space-y-3">
          {column.leads.map((lead, leadIndex) => (
            <LeadCard 
              key={lead.id} 
              lead={lead} 
              priorityColor={getPriorityColor(lead.priority)}
              priorityText={getPriorityText(lead.priority)}
            />
          ))}
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
                    منخف��
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