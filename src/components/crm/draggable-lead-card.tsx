import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Phone, MessageCircle, Mail, MapPin, Calendar, Edit2, Star, Clock } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Lead } from './vertical-column';

interface DraggableLeadCardProps {
  lead: Lead;
  index: number;
  priorityColor?: 'destructive' | 'default' | 'secondary' | 'outline';
  priorityText?: string;
}

export const DraggableLeadCard: React.FC<DraggableLeadCardProps> = ({
  lead,
  index,
  priorityColor = 'default',
  priorityText = 'متوسط'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPropertyTypeIcon = (type: string) => {
    return type === 'sale' ? '💰' : '🏠';
  };

  const getPropertyTypeText = (type: string) => {
    return type === 'sale' ? 'بيع' : 'إيجار';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`tel:${lead.phone}`, '_self');
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(`مرحباً ${lead.name}، أتواصل معك بخصوص العقار`);
    window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const handleEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lead.email) {
      window.open(`mailto:${lead.email}`, '_self');
    }
  };

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3"
        >
          <Card 
            className={`crm-contact-card transition-all duration-200 cursor-pointer ${
              snapshot.isDragging 
                ? 'shadow-xl rotate-3 scale-105 ring-2 ring-[#D4AF37] ring-opacity-50' 
                : 'hover:shadow-md hover:border-[#D4AF37]'
            } ${isExpanded ? 'expanded ring-2 ring-blue-300' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <CardContent className="p-3">
              {/* الصف الأول - المعلومات الأساسية */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={lead.avatar} />
                    <AvatarFallback className="bg-[#01411C] text-white text-xs font-medium">
                      {lead.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-[#01411C] text-sm truncate leading-tight">
                      {lead.name}
                    </h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Phone className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600 truncate">{lead.phone}</span>
                    </div>
                  </div>
                </div>
                
                <Badge variant={priorityColor} className="text-xs shrink-0">
                  {priorityText}
                </Badge>
              </div>

              {/* المعلومات السريعة */}
              <div className="space-y-1.5 text-xs text-gray-600">
                {lead.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    <span className="truncate">{lead.location}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <span className="text-sm">{getPropertyTypeIcon(lead.propertyType)}</span>
                  <span>{getPropertyTypeText(lead.propertyType)}</span>
                  {lead.budget && (
                    <>
                      <span className="mx-1">•</span>
                      <span className="truncate font-medium text-[#D4AF37]">{lead.budget}</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span>آخر تواصل: {formatDate(lead.lastContact)}</span>
                </div>
              </div>

              {/* المحتوى الموسع */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                  {/* معلومات إضافية */}
                  <div className="space-y-2">
                    {lead.email && (
                      <div className="flex items-center gap-2 text-xs">
                        <Mail className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-600">{lead.email}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs">
                      <Star className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-600">مصدر العميل: {lead.source}</span>
                    </div>
                  </div>

                  {/* الملاحظات */}
                  {lead.notes && (
                    <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
                      <strong>ملاحظات:</strong> {lead.notes}
                    </div>
                  )}

                  {/* أزرار العمليات */}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCall}
                      className="flex-1 h-8 text-xs"
                    >
                      <Phone className="h-3 w-3 ml-1" />
                      اتصال
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleWhatsApp}
                      className="flex-1 h-8 text-xs border-green-500 text-green-600 hover:bg-green-50"
                    >
                      <MessageCircle className="h-3 w-3 ml-1" />
                      واتساب
                    </Button>
                    
                    {lead.email && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleEmail}
                        className="flex-1 h-8 text-xs border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        <Mail className="h-3 w-3 ml-1" />
                        إيميل
                      </Button>
                    )}
                  </div>

                  {/* زر التعديل */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full h-8 text-xs text-[#01411C] hover:bg-[#f0fdf4]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit2 className="h-3 w-3 ml-1" />
                        تعديل معلومات العميل
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md" dir="rtl">
                      <DialogHeader>
                        <DialogTitle>تعديل معلومات العميل</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-center text-gray-600">
                          سيتم إضافة نموذج التعديل في التحديث القادم
                        </p>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p><strong>الاسم:</strong> {lead.name}</p>
                          <p><strong>الهاتف:</strong> {lead.phone}</p>
                          <p><strong>الإيميل:</strong> {lead.email || 'غير محدد'}</p>
                          <p><strong>الموقع:</strong> {lead.location || 'غير محدد'}</p>
                          <p><strong>الميزانية:</strong> {lead.budget || 'غير محددة'}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {/* مؤشر للتوسع */}
              <div className="flex justify-center mt-2">
                <div className={`w-8 h-0.5 bg-gray-300 rounded transition-all duration-200 ${
                  isExpanded ? 'rotate-90' : ''
                }`} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableLeadCard;