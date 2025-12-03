// components/CalendarWeeklyView.tsx
import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react@0.487.0';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type?: string;
  status?: string;
  priority?: 'normal' | 'critical';
}

interface Props {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: Date, hour: number) => void;
}

export default function CalendarWeeklyView({ events, onEventClick, onTimeSlotClick }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 6 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForTimeSlot = (day: Date, hour: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      return isSameDay(eventStart, day) && eventStart.getHours() === hour;
    });
  };

  return (
    <div className="space-y-4">
      {/* التنقل */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentDate(addDays(currentDate, -7))}
        >
          <ChevronRight className="w-4 h-4" />
          الأسبوع السابق
        </Button>
        
        <div className="text-center">
          <p className="font-semibold text-[#01411C]">
            {format(weekStart, 'dd MMMM', { locale: ar })} - {format(addDays(weekStart, 6), 'dd MMMM yyyy', { locale: ar })}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentDate(addDays(currentDate, 7))}
        >
          الأسبوع التالي
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* الشبكة */}
      <div className="border rounded-lg overflow-auto max-h-[600px]">
        <table className="w-full border-collapse min-w-[800px]">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="border p-2 bg-gray-50 w-20 text-xs">الساعة</th>
              {weekDays.map((day, i) => (
                <th key={i} className="border p-2 bg-gray-50">
                  <div className="text-center">
                    <div className="text-xs text-gray-600">
                      {format(day, 'EEEE', { locale: ar })}
                    </div>
                    <div className={`text-sm font-semibold ${isSameDay(day, new Date()) ? 'text-blue-600' : 'text-[#01411C]'}`}>
                      {format(day, 'dd MMM', { locale: ar })}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map(hour => (
              <tr key={hour}>
                <td className="border p-2 text-center text-xs bg-gray-50 font-medium">
                  {hour.toString().padStart(2, '0')}:00
                </td>
                {weekDays.map((day, dayIndex) => {
                  const slotEvents = getEventsForTimeSlot(day, hour);
                  return (
                    <td
                      key={dayIndex}
                      className="border p-1 hover:bg-blue-50 cursor-pointer transition-colors min-h-[60px]"
                      onClick={() => slotEvents.length === 0 && onTimeSlotClick(day, hour)}
                    >
                      <div className="space-y-1">
                        {slotEvents.map(event => (
                          <div
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventClick(event);
                            }}
                            className={`
                              text-xs p-1 rounded cursor-pointer hover:shadow-md transition-all
                              ${event.priority === 'critical' ? 'bg-red-100 border border-red-300' : 'bg-blue-100 border border-blue-300'}
                            `}
                          >
                            <div className="font-semibold truncate">{event.title}</div>
                            <div className="text-[10px] text-gray-600">
                              {format(new Date(event.start), 'HH:mm', { locale: ar })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
