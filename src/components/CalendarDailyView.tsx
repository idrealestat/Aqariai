// components/CalendarDailyView.tsx
import React, { useState } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react@0.487.0';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type?: string;
  status?: string;
  priority?: 'normal' | 'critical';
  client_name?: string;
  city?: string;
  district?: string;
}

interface Props {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: Date, hour: number) => void;
}

export default function CalendarDailyView({ events, onEventClick, onTimeSlotClick }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      return isSameDay(eventStart, currentDate) && eventStart.getHours() === hour;
    });
  };

  const dayEvents = events.filter(event => 
    isSameDay(new Date(event.start), currentDate)
  );

  return (
    <div className="space-y-4">
      {/* التنقل */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#01411C] to-[#065f41] text-white p-4 rounded-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentDate(addDays(currentDate, -1))}
          className="text-white hover:bg-white/20"
        >
          <ChevronRight className="w-4 h-4" />
          اليوم السابق
        </Button>
        
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center">
            <Calendar className="w-5 h-5 text-[#D4AF37]" />
            <p className="font-semibold text-lg">
              {format(currentDate, 'EEEE dd MMMM yyyy', { locale: ar })}
            </p>
          </div>
          {isSameDay(currentDate, new Date()) && (
            <Badge className="bg-[#D4AF37] text-[#01411C] mt-1">اليوم</Badge>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentDate(addDays(currentDate, 1))}
          className="text-white hover:bg-white/20"
        >
          اليوم التالي
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* إحصائيات اليوم */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{dayEvents.length}</div>
          <div className="text-xs text-gray-600">إجمالي المواعيد</div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">
            {dayEvents.filter(e => e.status === 'مؤكد').length}
          </div>
          <div className="text-xs text-gray-600">مؤكدة</div>
        </div>
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-600">
            {dayEvents.filter(e => e.priority === 'critical').length}
          </div>
          <div className="text-xs text-gray-600">حرجة</div>
        </div>
      </div>

      {/* جدول الساعات */}
      <div className="border-2 border-[#D4AF37] rounded-lg overflow-auto max-h-[600px]">
        {hours.map(hour => {
          const hourEvents = getEventsForHour(hour);
          const isCurrentHour = new Date().getHours() === hour && isSameDay(currentDate, new Date());

          return (
            <div
              key={hour}
              className={`
                border-b last:border-b-0 hover:bg-gray-50 transition-colors
                ${isCurrentHour ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
              `}
            >
              <div className="flex">
                {/* عمود الوقت */}
                <div className={`
                  w-20 p-3 border-l flex-shrink-0 text-center
                  ${isCurrentHour ? 'bg-blue-100 font-bold text-blue-700' : 'bg-gray-50'}
                `}>
                  <div className="text-sm">{hour.toString().padStart(2, '0')}:00</div>
                  <div className="text-xs text-gray-500">
                    {hour.toString().padStart(2, '0')}:59
                  </div>
                </div>

                {/* عمود المواعيد */}
                <div className="flex-1 p-3 min-h-[80px]">
                  {hourEvents.length === 0 ? (
                    <div
                      onClick={() => onTimeSlotClick(currentDate, hour)}
                      className="h-full flex items-center justify-center text-gray-400 text-sm cursor-pointer hover:text-[#01411C]"
                    >
                      اضغط لإضافة موعد
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {hourEvents.map(event => (
                        <div
                          key={event.id}
                          onClick={() => onEventClick(event)}
                          className={`
                            p-3 rounded-lg cursor-pointer hover:shadow-lg transition-all border-2
                            ${event.priority === 'critical' 
                              ? 'bg-red-50 border-red-300 hover:bg-red-100' 
                              : 'bg-blue-50 border-blue-300 hover:bg-blue-100'}
                          `}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="font-semibold text-[#01411C] mb-1">
                                {event.title}
                              </div>
                              {event.client_name && (
                                <div className="text-sm text-gray-600 mb-1">
                                  👤 {event.client_name}
                                </div>
                              )}
                              {event.description && (
                                <div className="text-xs text-gray-600 mb-1">
                                  {event.description}
                                </div>
                              )}
                              {(event.city || event.district) && (
                                <div className="text-xs text-gray-500">
                                  📍 {event.city} {event.district && `/ ${event.district}`}
                                </div>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-[#01411C] text-white text-xs">
                                  {format(new Date(event.start), 'HH:mm', { locale: ar })} - {format(new Date(event.end), 'HH:mm', { locale: ar })}
                                </Badge>
                                {event.status && (
                                  <Badge variant="outline" className="text-xs">
                                    {event.status}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {event.priority === 'critical' && (
                              <div className="text-red-500 text-lg">⚠️</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
