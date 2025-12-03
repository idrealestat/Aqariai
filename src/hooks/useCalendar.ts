// hooks/useCalendar.ts
import { useState, useEffect } from "react";

/**
 * useCalendar
 * - يوفر واجهة لإنشاء/تحديث/حذف/جلب الأحداث
 * - مبدئياً يستخدم localStorage كخزين (يمكن تبديله للنداء API)
 *
 * Methods returned:
 * - events, createEvent, updateEvent, deleteEvent, openCreate, openEdit, openEventById
 */

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type?: string;
  reminder?: number;
  property_id?: string;  // ربط بعقار
  client_id?: string;    // ربط بعميل
  agent_id?: string;     // ربط بوسيط
  status?: 'مجدول' | 'مؤكد' | 'مكتمل' | 'ملغي';  // حالة الموعد
}

export default function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const STORAGE_KEY = "app_calendar_events_v1";

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setEvents(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  // تحقق من تداخل المواعيد (تعطيل مؤقتاً للسماح بمواعيد متعددة)
  function checkOverlap(newStart: string, newEnd: string, excludeId?: string): boolean {
    // السماح بالمواعيد المتداخلة مؤقتاً
    return false;
    
    /* الكود الأصلي - معطل مؤقتاً
    const newStartTime = new Date(newStart).getTime();
    const newEndTime = new Date(newEnd).getTime();
    
    return events.some(ev => {
      if (excludeId && ev.id === excludeId) return false;
      if (ev.status === 'ملغي') return false; // تجاهل المواعيد الملغاة
      
      const existingStart = new Date(ev.start).getTime();
      const existingEnd = new Date(ev.end).getTime();
      
      // تحقق: start < existing.end && end > existing.start
      return newStartTime < existingEnd && newEndTime > existingStart;
    });
    */
  }

  // تحقق من صحة التواريخ
  function validateDates(start: string, end: string): boolean {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    
    // end > start
    return endTime > startTime;
  }

  function createEvent(payload: Omit<CalendarEvent, 'id'>) {
    // التحقق من صحة التواريخ فقط
    if (!validateDates(payload.start, payload.end)) {
      throw new Error('تاريخ النهاية يجب أن يكون بعد تاريخ البداية');
    }
    
    // تعطيل التحقق من التداخل مؤقتاً
    // if (checkOverlap(payload.start, payload.end)) {
    //   throw new Error('يوجد تعارض مع موعد آخر في نفس الوقت');
    // }
    
    const ev = { id: generateId(), ...payload };
    setEvents((s) => [...s, ev]);
    return ev;
  }

  function updateEvent(updated: CalendarEvent) {
    // التحقق من صحة التواريخ فقط
    if (!validateDates(updated.start, updated.end)) {
      throw new Error('تاريخ النهاية يجب أن يكون بعد تاريخ البداية');
    }
    
    // تعطيل التحقق من التداخل مؤقتاً
    // if (checkOverlap(updated.start, updated.end, updated.id)) {
    //   throw new Error('يوجد تعارض مع موعد آخر في نفس الوقت');
    // }
    
    setEvents((s) => s.map((e) => (e.id === updated.id ? updated : e)));
  }

  function deleteEvent(id: string) {
    setEvents((s) => s.filter((e) => e.id !== id));
  }

  function openCreate(dateString?: string) {
    // Integration hook: show appointment form with prefilled date
    // Implemented by parent via handlers.openCreate
  }

  function openEdit(ev: CalendarEvent) {
    // Integration hook
  }

  return {
    events,
    createEvent,
    updateEvent,
    deleteEvent,
    openCreate,
    openEdit
  };
}
