// hooks/useSmartScheduling.ts
import { useState, useCallback } from 'react';
import { CalendarEvent } from '../types/calendar';
import { toast } from 'sonner@2.0.3';

export default function useSmartScheduling() {
  const [loading, setLoading] = useState(false);

  const suggestAlternativeSlots = useCallback((
    events: CalendarEvent[],
    cancelledEvent: CalendarEvent
  ): Date[] => {
    const suggestions: Date[] = [];
    const now = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const day = new Date(now);
      day.setDate(now.getDate() + i);
      
      [9, 11, 14, 16].forEach(hour => {
        day.setHours(hour, 0, 0, 0);
        
        const isAvailable = !events.some(event => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          return day >= eventStart && day <= eventEnd;
        });
        
        if (isAvailable) {
          suggestions.push(new Date(day));
        }
      });
      
      if (suggestions.length >= 5) break;
    }
    
    return suggestions.slice(0, 5);
  }, []);

  const analyzeClientBehavior = useCallback((events: CalendarEvent[], clientId: string) => {
    const clientEvents = events.filter(e => e.client_id === clientId);
    
    const preferredTimes = clientEvents.reduce((acc, event) => {
      const hour = new Date(event.start).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const mostPreferredHour = Object.entries(preferredTimes)
      .sort(([, a], [, b]) => b - a)[0]?.[0];
    
    const attendanceRate = clientEvents.length > 0
      ? (clientEvents.filter(e => e.status === 'مكتمل').length / clientEvents.length) * 100
      : 0;
    
    return {
      preferredHour: mostPreferredHour ? parseInt(mostPreferredHour) : 9,
      attendanceRate,
      totalAppointments: clientEvents.length
    };
  }, []);

  const rescheduleAutomatically = useCallback(async (
    cancelledEvent: CalendarEvent,
    events: CalendarEvent[]
  ) => {
    setLoading(true);
    
    try {
      const suggestions = suggestAlternativeSlots(events, cancelledEvent);
      
      if (suggestions.length === 0) {
        toast.error('لا توجد مواعيد بديلة متاحة');
        return null;
      }
      
      let clientBehavior = null;
      if (cancelledEvent.client_id) {
        clientBehavior = analyzeClientBehavior(events, cancelledEvent.client_id);
      }
      
      const bestSlot = clientBehavior
        ? suggestions.find(slot => slot.getHours() === clientBehavior.preferredHour) || suggestions[0]
        : suggestions[0];
      
      toast.success('تم اقتراح موعد بديل بناءً على سلوك العميل');
      
      return {
        suggestedSlot: bestSlot,
        allSuggestions: suggestions,
        clientBehavior
      };
    } finally {
      setLoading(false);
    }
  }, [suggestAlternativeSlots, analyzeClientBehavior]);

  const notifyAffectedClients = useCallback((
    availableSlot: Date,
    events: CalendarEvent[]
  ) => {
    const interestedClients = events.filter(event => 
      event.status === 'مجدول' && 
      !event.client_confirmed &&
      new Date(event.start) > new Date()
    );
    
    interestedClients.forEach(client => {
      const message = `
عميلنا العزيز،
أصبح لدينا موعد متاح في ${availableSlot.toLocaleDateString('ar-SA')} الساعة ${availableSlot.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
هل تريد حجز هذا الموعد؟
      `.trim();
      
      console.log('Notifying client:', client.client_name, message);
    });
    
    toast.info(`تم إشعار ${interestedClients.length} من العملاء المهتمين`);
  }, []);

  const optimizeSchedule = useCallback((events: CalendarEvent[]) => {
    const upcomingEvents = events
      .filter(e => new Date(e.start) > new Date() && e.status !== 'ملغي')
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    
    const gaps: { start: Date; end: Date; duration: number }[] = [];
    
    for (let i = 0; i < upcomingEvents.length - 1; i++) {
      const currentEnd = new Date(upcomingEvents[i].end);
      const nextStart = new Date(upcomingEvents[i + 1].start);
      const duration = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60);
      
      if (duration >= 60) {
        gaps.push({
          start: currentEnd,
          end: nextStart,
          duration
        });
      }
    }
    
    return {
      totalEvents: upcomingEvents.length,
      availableGaps: gaps,
      utilizationRate: upcomingEvents.length > 0 
        ? ((upcomingEvents.length / (upcomingEvents.length + gaps.length)) * 100).toFixed(1)
        : '0'
    };
  }, []);

  return {
    loading,
    suggestAlternativeSlots,
    analyzeClientBehavior,
    rescheduleAutomatically,
    notifyAffectedClients,
    optimizeSchedule
  };
}
