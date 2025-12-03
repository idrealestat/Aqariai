/*
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                         📅 Calendar API - نظام التقويم                               ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

📋 الوصف: API حقيقي لإدارة المواعيد والتقويم
📅 تاريخ الإنشاء: 4 نوفمبر 2025
🔗 مرتبط بـ: /components/calendar-system-complete.tsx, /hooks/useCalendar.ts
✅ الإشعارات: مربوط بنظام الإشعارات الحقيقي
*/

import { CalendarEvent } from '../types/calendar';
// ✅ استيراد نظام الإشعارات
import { NotificationsAPI } from './notifications-real';

// ============================================
// 🔧 HELPER FUNCTIONS
// ============================================

/**
 * الحصول على معرف المستخدم الحالي
 */
function getCurrentUserId(): string {
  if (typeof window === 'undefined') return 'anonymous';
  
  try {
    const brokerData = localStorage.getItem('broker-registration-data');
    if (brokerData) {
      const parsed = JSON.parse(brokerData);
      return parsed.phone || parsed.id || 'anonymous';
    }
  } catch (error) {
    console.error('Error getting user ID:', error);
  }
  
  return 'anonymous';
}

// ============================================
// Mock Database
// ============================================

let appointmentsDB: Map<string, CalendarEvent> = new Map();

// ============================================
// Helper Functions
// ============================================

function generateId(): string {
  return `appt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function isToday(date: string): boolean {
  const today = new Date();
  const appointmentDate = new Date(date);
  
  return (
    appointmentDate.getDate() === today.getDate() &&
    appointmentDate.getMonth() === today.getMonth() &&
    appointmentDate.getFullYear() === today.getFullYear()
  );
}

function isBetweenDates(date: string, start: string, end: string): boolean {
  const appointmentDate = new Date(date);
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  return appointmentDate >= startDate && appointmentDate <= endDate;
}

// ============================================
// Sample Data Generator
// ============================================

function generateSampleAppointments(): void {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const sampleAppointments: Omit<CalendarEvent, 'id'>[] = [
    {
      title: 'معاينة فيلا في الملقا',
      description: 'معاينة فيلا فاخرة 5 غرف نوم',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0).toISOString(),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0).toISOString(),
      type: 'showing',
      priority: 'critical',
      status: 'مؤكد',
      reminder: 30,
      client_name: 'أحمد محمد',
      client_phone: '+966501234567',
      client_email: 'ahmed@example.com',
      location: 'حي الملقا، الرياض',
      city: 'الرياض',
      district: 'الملقا',
      cancellable_by_client: true,
      client_confirmed: true,
      agent_confirmed: true
    },
    {
      title: 'اجتماع مع عميل محتمل',
      description: 'مناقشة احتياجات العميل للعقار',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0).toISOString(),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0).toISOString(),
      type: 'meeting',
      priority: 'normal',
      status: 'مجدول',
      reminder: 15,
      client_name: 'سارة علي',
      client_phone: '+966507654321',
      client_email: 'sara@example.com',
      location: 'مكتب العقار',
      cancellable_by_client: false,
      client_confirmed: false,
      agent_confirmed: true
    },
    {
      title: 'متابعة سريعة - عميل VIP',
      description: 'متابعة مع عميل VIP بخصوص عرض سابق',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 30).toISOString(),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0).toISOString(),
      type: 'short_followup',
      priority: 'critical',
      status: 'مؤكد',
      reminder: 10,
      client_name: 'خالد السعيد',
      client_phone: '+966509876543',
      cancellable_by_client: true,
      client_confirmed: true,
      agent_confirmed: true
    },
    {
      title: 'اتصال هاتفي - استفسار',
      description: 'مكالمة مع عميل للإجابة على الاستفسارات',
      start: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 0).toISOString(),
      end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 30).toISOString(),
      type: 'call',
      priority: 'normal',
      status: 'م��دول',
      reminder: 5,
      client_name: 'فاطمة حسن',
      client_phone: '+966503456789',
      cancellable_by_client: true,
      client_confirmed: false,
      agent_confirmed: true
    }
  ];
  
  sampleAppointments.forEach((appointment) => {
    const event: CalendarEvent = {
      ...appointment,
      id: generateId()
    };
    appointmentsDB.set(event.id, event);
  });
  
  console.log('✅ تم إنشاء مواعيد تجريبية:', appointmentsDB.size);
}

// ============================================
// API Functions
// ============================================

/**
 * الحصول على جميع المواعيد
 */
export async function getAllAppointments(): Promise<CalendarEvent[]> {
  try {
    // إنشاء بيانات تجريبية إذا كانت قاعدة البيانات فارغة
    if (appointmentsDB.size === 0) {
      generateSampleAppointments();
    }
    
    const appointments = Array.from(appointmentsDB.values());
    return appointments.sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  } catch (error) {
    console.error('❌ خطأ في جلب المواعيد:', error);
    return [];
  }
}

/**
 * الحصول على مواعيد اليوم
 */
export function getTodayAppointments(): CalendarEvent[] {
  try {
    // إنشاء بيانات تجريبية إذا كانت قاعدة البيانات فارغة
    if (appointmentsDB.size === 0) {
      generateSampleAppointments();
    }
    
    const appointments = Array.from(appointmentsDB.values());
    const todayAppointments = appointments.filter(appointment => 
      isToday(appointment.start)
    );
    
    return todayAppointments.sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  } catch (error) {
    console.error('❌ خطأ في جلب مواعيد اليوم:', error);
    return [];
  }
}

/**
 * الحصول على المواعيد في نطاق زمني
 */
export async function getAppointments(startDate: string, endDate: string): Promise<CalendarEvent[]> {
  try {
    // إنشاء بيانات تجريبية إذا كانت قاعدة البيانات فارغة
    if (appointmentsDB.size === 0) {
      generateSampleAppointments();
    }
    
    const appointments = Array.from(appointmentsDB.values());
    const filteredAppointments = appointments.filter(appointment => 
      isBetweenDates(appointment.start, startDate, endDate)
    );
    
    return filteredAppointments.sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  } catch (error) {
    console.error('❌ خطأ في جلب المواعيد:', error);
    return [];
  }
}

/**
 * الحصول على موعد بواسطة ID
 */
export async function getAppointmentById(id: string): Promise<CalendarEvent | null> {
  try {
    return appointmentsDB.get(id) || null;
  } catch (error) {
    console.error('❌ خطأ في جلب الموعد:', error);
    return null;
  }
}

/**
 * إنشاء موعد جديد
 */
export async function createAppointment(appointment: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
  try {
    const id = generateId();
    const newAppointment: CalendarEvent = {
      ...appointment,
      id
    };
    
    appointmentsDB.set(id, newAppointment);
    
    console.log('✅ تم إنشاء موعد جديد:', id);
    
    // ✅ إشعار بإضافة موعد جديد
    try {
      NotificationsAPI.notifyAppointmentAdded(getCurrentUserId(), newAppointment);
      
      // إطلاق event للتكامل
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('appointmentCreated', {
          detail: newAppointment
        }));
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
    
    return newAppointment;
  } catch (error) {
    console.error('❌ خطأ في إنشاء الموعد:', error);
    throw new Error('فشل إنشاء الموعد');
  }
}

/**
 * تحديث موعد
 */
export async function updateAppointment(
  id: string,
  updates: Partial<CalendarEvent>
): Promise<CalendarEvent | null> {
  try {
    const appointment = appointmentsDB.get(id);
    if (!appointment) {
      throw new Error('الموعد غير موجود');
    }
    
    const updatedAppointment: CalendarEvent = {
      ...appointment,
      ...updates,
      id // الحفاظ على الـ ID
    };
    
    appointmentsDB.set(id, updatedAppointment);
    
    console.log('✅ تم تحديث الموعد:', id);
    
    // ✅ إشعار بتحديث الموعد
    try {
      NotificationsAPI.notifyAppointmentUpdated(getCurrentUserId(), updatedAppointment);
      
      // إطلاق event للتكامل
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('appointmentUpdated', {
          detail: updatedAppointment
        }));
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
    
    return updatedAppointment;
  } catch (error) {
    console.error('❌ خطأ في تحديث الموعد:', error);
    return null;
  }
}

/**
 * حذف موعد
 */
export async function deleteAppointment(id: string): Promise<boolean> {
  try {
    const deleted = appointmentsDB.delete(id);
    
    if (deleted) {
      console.log('✅ تم حذف الموعد:', id);
    }
    
    return deleted;
  } catch (error) {
    console.error('❌ خطأ في حذف الموعد:', error);
    return false;
  }
}

/**
 * تأكيد موعد من قبل العميل
 */
export async function confirmAppointmentByClient(id: string): Promise<CalendarEvent | null> {
  try {
    return await updateAppointment(id, {
      client_confirmed: true,
      status: 'مؤكد'
    });
  } catch (error) {
    console.error('❌ خطأ في تأكيد الموعد:', error);
    return null;
  }
}

/**
 * إلغاء موعد
 */
export async function cancelAppointment(id: string): Promise<CalendarEvent | null> {
  try {
    const appointment = appointmentsDB.get(id);
    if (!appointment) {
      throw new Error('الموعد غير موجود');
    }
    
    const cancelled = await updateAppointment(id, {
      status: 'ملغي'
    });
    
    // ✅ إشعار بإلغاء الموعد
    if (cancelled) {
      try {
        NotificationsAPI.notifyAppointmentCancelled(getCurrentUserId(), cancelled);
        
        // إطلاق event للتكامل
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('appointmentCancelled', {
            detail: cancelled
          }));
        }
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
    
    return cancelled;
  } catch (error) {
    console.error('❌ خطأ في إلغاء الموعد:', error);
    return null;
  }
}

/**
 * إكمال موعد
 */
export async function completeAppointment(id: string): Promise<CalendarEvent | null> {
  try {
    return await updateAppointment(id, {
      status: 'مكتمل'
    });
  } catch (error) {
    console.error('❌ خطأ في إكمال الموعد:', error);
    return null;
  }
}

/**
 * الحصول على إحصائيات المواعيد
 */
export async function getAppointmentStats(): Promise<{
  total: number;
  today: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  pending: number;
}> {
  try {
    const allAppointments = await getAllAppointments();
    const todayAppointments = getTodayAppointments();
    
    return {
      total: allAppointments.length,
      today: todayAppointments.length,
      confirmed: allAppointments.filter(a => a.status === 'مؤكد').length,
      completed: allAppointments.filter(a => a.status === 'مكتمل').length,
      cancelled: allAppointments.filter(a => a.status === 'ملغي').length,
      pending: allAppointments.filter(a => a.status === 'مجدول').length
    };
  } catch (error) {
    console.error('❌ خطأ في جلب إحصائيات المواعيد:', error);
    return {
      total: 0,
      today: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      pending: 0
    };
  }
}

// ============================================
// Export All Functions
// ============================================

export const CalendarAPI = {
  // Get
  getAll: getAllAppointments,
  getToday: getTodayAppointments,
  getRange: getAppointments,
  getById: getAppointmentById,
  
  // Create/Update/Delete
  create: createAppointment,
  update: updateAppointment,
  delete: deleteAppointment,
  
  // Actions
  confirm: confirmAppointmentByClient,
  cancel: cancelAppointment,
  complete: completeAppointment,
  
  // Stats
  getStats: getAppointmentStats
};

export default CalendarAPI;
