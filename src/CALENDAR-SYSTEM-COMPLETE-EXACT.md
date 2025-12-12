# 📅 نظام التقويم والمواعيد - التوثيق الحرفي الكامل

## ⚠️ كل كود وحقل وزر ومسار - بدون أي إضافة

---

# 📂 الملفات المرتبطة:

## 1️⃣ المكونات الرئيسية:
- `/components/calendar-system-complete.tsx` - الملف الرئيسي (648+ سطر)
- `/components/AppointmentForm.tsx` - نموذج إضافة/تعديل موعد (500+ سطر)
- `/components/AppointmentCard.tsx` - بطاقة عرض موعد (51 سطر)
- `/components/CalendarWeeklyView.tsx` - العرض الأسبوعي (133 سطر)
- `/components/CalendarDailyView.tsx` - العرض اليومي
- `/components/AppointmentsListLeftSlider.tsx` - قائمة المواعيد الجانبية
- `/components/WeeklySummaryPanel.tsx` - ملخص الأسبوع
- `/components/AppointmentAnalyticsDashboard.tsx` - لوحة التحليلات
- `/components/SmartNotificationsPanel.tsx` - لوحة الإشعارات الذكية
- `/components/VoiceCommandsPanel.tsx` - الأوامر الصوتية
- `/components/PermissionsManager.tsx` - إدارة الصلاحيات
- `/components/WorkingHoursEditor.tsx` - إدارة ساعات العمل

## 2️⃣ الأنظمة الخلفية:
- `/api/calendar.ts` - Calendar API (471 سطر)
- `/hooks/useCalendar.ts` - Hook إدارة التقويم (127 سطر)
- `/types/calendar.ts` - التعريفات (54 سطر)

## 3️⃣ الربط:
- `/App.tsx` - التوجيه (line 131, 394, 914-920, 968-972, 1001-1004)
- `/context/DashboardContext.tsx` - السياق العام

---

# 🎯 المسارات (Routes):

## في `/App.tsx`:

### 1. الاستيراد (Line 131):
```typescript
const CalendarSystemComplete = lazy(() => import("./components/calendar-system-complete"));
```

### 2. Hash Routes (Line 394):
```typescript
'#/calendar': 'calendar'
```

### 3. Render Cases:

#### Case 1: التقويم الكامل (Line 914-920):
```typescript
case "calendar-system-complete":
  return withPageLayout(
    <Suspense fallback={<LoadingSpinner />}>
      <CalendarSystemComplete
        onBack={() => setCurrentPage("dashboard")}
      />
    </Suspense>
  );
```

#### Case 2: التقويم في CRM (Line 1001-1004):
```typescript
case "leader-crm-calendar":
  return withPageLayout(
    <Suspense fallback={<LoadingSpinner />}>
      <LeaderCRMSystemComplete
        initialTab="calendar"
        onBack={() => setCurrentPage("dashboard")}
      />
    </Suspense>
  );
```

---

# 📋 التعريفات (Types):

## من `/types/calendar.ts` (54 سطر - حرفياً):

```typescript
// types/calendar.ts
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO 8601 format
  end: string; // ISO 8601 format
  type: 'meeting' | 'showing' | 'call' | 'custom' | 'short_followup';
  priority: 'normal' | 'critical';
  reminder?: number; // بالدقائق
  status: 'مجدول' | 'مؤكد' | 'مكتمل' | 'ملغي';
  
  // بيانات مرتبطة
  property_id?: string;
  client_id?: string;
  agent_id?: string;
  
  // بيانات العميل
  client_name?: string;
  client_phone?: string;
  client_email?: string;
  
  // الموقع
  location?: string;
  city?: string;
  district?: string;
  
  // الصلاحيات والإشعارات
  cancellable_by_client?: boolean;
  notification_sent?: boolean;
  verification_sent?: boolean;
  client_confirmed?: boolean;
  agent_confirmed?: boolean;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  client_reminder_time: number;
  agent_reminder_time: number;
  auto_resend: boolean;
}

export interface VoiceCommand {
  hotword: string; // "عقاري أي آي"
  enabled: boolean;
  language: 'ar' | 'en';
}

export interface AppointmentAnalytics {
  total_appointments: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  attendance_rate: number; // %
  cancellation_rate: number; // %
  avg_response_time: number; // بالدقائق
  peak_hours: string[];
  client_behavior: Record<string, any>;
}
```

---

# 🔧 الـ Hook الأساسي:

## `/hooks/useCalendar.ts` (127 سطر - حرفياً):

```typescript
import { useState, useEffect } from "react";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type?: string;
  reminder?: number;
  property_id?: string;
  client_id?: string;
  agent_id?: string;
  status?: 'مجدول' | 'مؤكد' | 'مكتمل' | 'ملغي';
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const STORAGE_KEY = "app_calendar_events_v1";

  // 💾 استرجاع من localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setEvents(JSON.parse(raw));
  }, []);

  // 💾 حفظ في localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  // ✅ التحقق من صحة التواريخ
  function validateDates(start: string, end: string): boolean {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    return endTime > startTime; // end > start
  }

  // ➕ إنشاء موعد
  function createEvent(payload: Omit<CalendarEvent, 'id'>) {
    if (!validateDates(payload.start, payload.end)) {
      throw new Error('تاريخ النهاية يجب أن يكون بعد تاريخ البداية');
    }
    
    const ev = { id: generateId(), ...payload };
    setEvents((s) => [...s, ev]);
    return ev;
  }

  // ✏️ تحديث موعد
  function updateEvent(updated: CalendarEvent) {
    if (!validateDates(updated.start, updated.end)) {
      throw new Error('تاريخ النهاية يجب أن يكون بعد تاريخ البداية');
    }
    
    setEvents((s) => s.map((e) => (e.id === updated.id ? updated : e)));
  }

  // 🗑️ حذف موعد
  function deleteEvent(id: string) {
    setEvents((s) => s.filter((e) => e.id !== id));
  }

  return {
    events,
    createEvent,
    updateEvent,
    deleteEvent,
    openCreate: (dateString?: string) => {}, // Integration hook
    openEdit: (ev: CalendarEvent) => {} // Integration hook
  };
}
```

**التخزين:**
- **localStorage Key:** `"app_calendar_events_v1"`
- **Format:** JSON array of CalendarEvent[]

---

# 🌐 Calendar API:

## من `/api/calendar.ts` (471 سطر):

### الدوال المصدّرة (CalendarAPI):

```typescript
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
```

### 1️⃣ `getAllAppointments()`:
```typescript
export async function getAllAppointments(): Promise<CalendarEvent[]> {
  try {
    if (appointmentsDB.size === 0) {
      generateSampleAppointments(); // بيانات تجريبية
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
```

### 2️⃣ `getTodayAppointments()`:
```typescript
export function getTodayAppointments(): CalendarEvent[] {
  try {
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
```

### 3️⃣ `createAppointment()`:
```typescript
export async function createAppointment(
  appointment: Omit<CalendarEvent, 'id'>
): Promise<CalendarEvent> {
  try {
    const id = generateId(); // `appt_${Date.now()}_${Math.random()}`
    const newAppointment: CalendarEvent = { ...appointment, id };
    
    appointmentsDB.set(id, newAppointment);
    
    console.log('✅ تم إنشاء موعد جديد:', id);
    
    // ✅ إشعار
    NotificationsAPI.notifyAppointmentAdded(getCurrentUserId(), newAppointment);
    
    // ✅ Event
    window.dispatchEvent(new CustomEvent('appointmentCreated', {
      detail: newAppointment
    }));
    
    return newAppointment;
  } catch (error) {
    console.error('❌ خطأ في إنشاء الموعد:', error);
    throw new Error('فشل إنشاء الموعد');
  }
}
```

### 4️⃣ `updateAppointment()`:
```typescript
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
    
    // ✅ إشعار
    NotificationsAPI.notifyAppointmentUpdated(getCurrentUserId(), updatedAppointment);
    
    // ✅ Event
    window.dispatchEvent(new CustomEvent('appointmentUpdated', {
      detail: updatedAppointment
    }));
    
    return updatedAppointment;
  } catch (error) {
    console.error('❌ خطأ في تحديث الموعد:', error);
    return null;
  }
}
```

### 5️⃣ `cancelAppointment()`:
```typescript
export async function cancelAppointment(id: string): Promise<CalendarEvent | null> {
  try {
    const appointment = appointmentsDB.get(id);
    if (!appointment) {
      throw new Error('الموعد غير موجود');
    }
    
    const cancelled = await updateAppointment(id, {
      status: 'ملغي'
    });
    
    // ✅ إشعار
    if (cancelled) {
      NotificationsAPI.notifyAppointmentCancelled(getCurrentUserId(), cancelled);
      
      window.dispatchEvent(new CustomEvent('appointmentCancelled', {
        detail: cancelled
      }));
    }
    
    return cancelled;
  } catch (error) {
    console.error('❌ خطأ في إلغاء الموعد:', error);
    return null;
  }
}
```

### 6️⃣ `getAppointmentStats()`:
```typescript
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
    return { total: 0, today: 0, confirmed: 0, completed: 0, cancelled: 0, pending: 0 };
  }
}
```

---

# 🎨 الواجهة الرئيسية:

## `/components/calendar-system-complete.tsx`:

### الاستيرادات (Lines 1-25):
```typescript
import React, { useState, useEffect } from "react";
import AppointmentCard from "./AppointmentCard";
import AppointmentForm from "./AppointmentForm";
import AppointmentsListLeftSlider from "./AppointmentsListLeftSlider";
import SmartNotificationsPanel from "./SmartNotificationsPanel";
import VoiceCommandsPanel from "./VoiceCommandsPanel";
import AppointmentAnalyticsDashboard from "./AppointmentAnalyticsDashboard";
import CalendarWeeklyView from "./CalendarWeeklyView";
import CalendarDailyView from "./CalendarDailyView";
import WeeklySummaryPanel from "./WeeklySummaryPanel";
import PermissionsManager from "./PermissionsManager";
import WorkingHoursEditor from "./WorkingHoursEditor";
import { useDashboardContext } from '../context/DashboardContext';
import useCalendar from "../hooks/useCalendar";
import useSmartNotifications from "../hooks/useSmartNotifications";
import useVoiceCommands from "../hooks/useVoiceCommands";
import useSmartScheduling from "../hooks/useSmartScheduling";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { ArrowRight, Calendar, Clock, CheckCircle, Share2, List, X, Bell, Mic, BarChart3, Sparkles, CalendarDays, CalendarClock, TrendingUp, Shield, Settings2 } from "lucide-react@0.487.0";
import { toast } from "sonner@2.0.3";
```

### Props (Lines 27-29):
```typescript
interface CalendarSystemCompleteProps {
  onBack: () => void;
}
```

### States (Lines 32-41):
```typescript
const { leftSidebarOpen } = useDashboardContext();
const [isOpen, setIsOpen] = useState(false); // نموذج إضافة/تعديل
const [editingEvent, setEditingEvent] = useState<any>(null);
const [prefilledDate, setPrefilledDate] = useState<string>("");
const [prefilledClientData, setPrefilledClientData] = useState<any>(null);
const [showWorkingHours, setShowWorkingHours] = useState(false);
const [filterType, setFilterType] = useState<string>('all');
const [filterStatus, setFilterStatus] = useState<string>('all');
const [showAppointmentsList, setShowAppointmentsList] = useState(false);
const [activeTab, setActiveTab] = useState('calendar');
```

### Hooks المستخدمة (Lines 43-46):
```typescript
const calendar = useCalendar();
const notifications = useSmartNotifications();
const voiceCommands = useVoiceCommands();
const scheduling = useSmartScheduling();
```

---

# 🔔 نظام الإشعارات:

## طلب إذن الإشعارات (Lines 49-53):
```typescript
React.useEffect(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}, []);
```

## الاستماع لطلبات من إدارة العملاء (Lines 56-84):
```typescript
React.useEffect(() => {
  const handleScheduleFromCRM = (event: Event) => {
    const customEvent = event as CustomEvent;
    if (customEvent.detail) {
      const { clientName, clientPhone, clientWhatsapp, clientId } = customEvent.detail;
      
      // حفظ بيانات العميل
      setPrefilledClientData({
        clientName,
        clientPhone,
        clientWhatsapp,
        clientId
      });
      
      // فتح نموذج
      setIsOpen(true);
      setEditingEvent(null);
      
      toast.success(`جاري إضافة موعد للعميل: ${clientName}`);
    }
  };

  window.addEventListener('scheduleAppointmentFromCRM', handleScheduleFromCRM);
  
  return () => {
    window.removeEventListener('scheduleAppointmentFromCRM', handleScheduleFromCRM);
  };
}, []);
```

**Event Name:** `'scheduleAppointmentFromCRM'`

**Detail Structure:**
```typescript
{
  clientName: string,
  clientPhone: string,
  clientWhatsapp: string,
  clientId: string
}
```

---

# 🎯 نظام التصفية:

## كود التصفية (Lines 87-106):
```typescript
const filteredEvents = calendar.events.filter(ev => {
  const typeMatch = filterType === 'all' || ev.type === filterType;
  
  const now = new Date();
  const eventStart = new Date(ev.start);
  const eventEnd = new Date(ev.end);
  
  let statusMatch = true;
  if (filterStatus === 'upcoming') {
    statusMatch = eventStart > now && ev.status !== 'ملغي';
  } else if (filterStatus === 'completed') {
    statusMatch = eventEnd < now && ev.status !== 'ملغي';
  } else if (filterStatus === 'ongoing') {
    statusMatch = eventStart <= now && eventEnd >= now && ev.status !== 'ملغي';
  } else if (filterStatus === 'cancelled') {
    statusMatch = ev.status === 'ملغي';
  }
  
  return typeMatch && statusMatch;
});
```

**أنواع التصفية:**
1. **حسب النوع (filterType):**
   - `'all'` - الكل
   - `'meeting'` - اجتماع
   - `'showing'` - عرض عقار
   - `'call'` - مكالمة

2. **حسب الحالة (filterStatus):**
   - `'all'` - الكل
   - `'upcoming'` - قادم
   - `'ongoing'` - جاري
   - `'completed'` - مكتمل
   - `'cancelled'` - ملغي

---

# 🔗 نظام مشاركة رابط الحجز:

## الكود الحرفي (Lines 109-142):
```typescript
const handleShareBookingLink = async () => {
  const bookingUrl = `${window.location.origin}/appointment-booking?broker=broker-123`;
  
  // رسالة المشاركة
  const message = `يمكنك حجز موعد معي مباشرة عبر الرابط التالي:\n${bookingUrl}\n\nساعات العمل:\nالأحد: 9:00 ص - 12:00 م | 4:00 م - 8:00 م\nالاثنين: 9:00 ص - 12:00 م | 4:00 م - 8:00 م`;
  
  // نسخ للحافظة
  try {
    await navigator.clipboard.writeText(message);
    toast.success("تم نسخ رابط الحجز للحافظة");
  } catch (err) {
    console.error('Failed to copy:', err);
  }
  
  // واتساب
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  
  // Native Share API
  if (navigator.share && navigator.canShare) {
    try {
      await navigator.share({
        title: 'حجز موعد',
        text: message,
        url: bookingUrl
      });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
        toast.info("يمكنك مشاركة الرابط المنسوخ يدوياً");
      }
    }
  }
};
```

**URL Format:** `${window.location.origin}/appointment-booking?broker=broker-123`

---

# 🔊 نظام التنبيهات الصوتية:

## 1️⃣ تشغيل نغمة (Lines 145-164):
```typescript
const playNotificationSound = () => {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // نغمة مميزة للمواعيد
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2);
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.4);
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.6);
};
```

## 2️⃣ إشعار نظام (Lines 166-170):
```typescript
const showNotification = (title: string, body: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/calendar-icon.png' });
  }
};
```

## 3️⃣ جدولة التذكيرات (Lines 172-196):
```typescript
const scheduleReminders = (event: any) => {
  const appointmentDateTime = new Date(event.start);
  const now = new Date();
  
  // تنبيه قبل 30 دقيقة
  const reminderTime = new Date(appointmentDateTime.getTime() - 30 * 60 * 1000);
  const timeUntilReminder = reminderTime.getTime() - now.getTime();
  
  if (timeUntilReminder > 0) {
    setTimeout(() => {
      playNotificationSound();
      showNotification('تذكير بالموعد', `موعدك "${event.title}" خلال 30 دقيقة`);
    }, timeUntilReminder);
  }
  
  // تنبيه في وقت الموعد
  const timeUntilAppointment = appointmentDateTime.getTime() - now.getTime();
  
  if (timeUntilAppointment > 0) {
    setTimeout(() => {
      playNotificationSound();
      showNotification('حان وقت الموعد', `موعدك "${event.title}" الآن`);
    }, timeUntilAppointment);
  }
};
```

**التنبيهات:**
1. **قبل 30 دقيقة:** نغمة + إشعار "خلال 30 دقيقة"
2. **في وقت الموعد:** نغمة + إشعار "الآن"

---

# 🎯 Handlers:

## الكود الحرفي (Lines 198-250):
```typescript
const handlers = {
  ...calendar,
  
  // فتح نموذج إنشاء جديد
  openCreate: (date?: string) => {
    console.log('🔍 [CalendarSystemComplete] openCreate called with date:', date);
    
    setIsOpen(true);
    setEditingEvent(null);
    setPrefilledDate(date || "TODAY");
    
    console.log('🔍 [CalendarSystemComplete] prefilledDate set to:', date || "TODAY");
  },
  
  // فتح نموذج تحرير
  openEdit: (ev: any) => {
    setIsOpen(true);
    setEditingEvent(ev);
    setPrefilledDate("");
    setPrefilledClientData(null);
  },
  
  // إلغاء التحرير
  cancelEdit: () => {
    setEditingEvent(null);
    setPrefilledDate("");
    setPrefilledClientData(null);
  },
  
  // إنشاء موعد
  createEvent: (payload: any) => {
    try {
      const newEvent = calendar.createEvent(payload);
      scheduleReminders(newEvent); // ← جدولة التذكيرات
      setEditingEvent(null);
      setPrefilledDate("");
      setPrefilledClientData(null);
      setIsOpen(false);
      toast.success('تم إضافة الموعد بنجاح');
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ أثناء إضافة الموعد');
    }
  },
  
  // تحديث موعد
  updateEvent: (updated: any) => {
    try {
      calendar.updateEvent(updated);
      scheduleReminders(updated); // ← جدولة التذكيرات
      setEditingEvent(null);
      setPrefilledDate("");
      setPrefilledClientData(null);
      setIsOpen(false);
      toast.success('تم تحديث الموعد بنجاح');
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ أثناء تحديث الموعد');
    }
  }
};
```

---

# 📊 الإحصائيات:

## الكود (Lines 252-257):
```typescript
const stats = {
  total: calendar.events.length,
  upcoming: calendar.events.filter(e => 
    new Date(e.start) > new Date() && e.status !== 'ملغي'
  ).length,
  completed: calendar.events.filter(e => 
    new Date(e.end) < new Date() && e.status !== 'ملغي'
  ).length,
  cancelled: calendar.events.filter(e => 
    e.status === 'ملغي'
  ).length
};
```

**الحقول:**
- `stats.total` - إجمالي المواعيد
- `stats.upcoming` - المواعيد القادمة
- `stats.completed` - المواعيد المكتملة
- `stats.cancelled` - المواعيد الملغاة

---

# 🎨 الواجهة - الهيكل الرئيسي:

## 1️⃣ Header (Lines 268-308):
```tsx
<div className="mb-6 flex items-center justify-between">
  {/* زر العودة */}
  <Button
    onClick={onBack}
    variant="outline"
    className="border-2 border-[#D4AF37] hover:bg-[#f0fdf4]"
  >
    <ArrowRight className="w-4 h-4 mr-2" />
    عودة
  </Button>

  {/* العنوان */}
  <div className="text-center flex-1">
    <h1 className="text-2xl text-[#01411C]">التقويم والمواعيد</h1>
    <p className="text-sm text-gray-600">جدولة المواعيد والمعاينات مع العملاء</p>
  </div>

  {/* الأزرار */}
  <div className="flex gap-2">
    {/* زر قائمة المواعيد */}
    <Button
      onClick={() => setShowAppointmentsList(true)}
      variant="outline"
      className="border-2 border-[#D4AF37] hover:bg-[#f0fdf4]"
    >
      <List className="w-4 h-4 ml-2" />
      قائمة المواعيد
    </Button>
    
    {/* زر المشاركة */}
    <Button
      onClick={handleShareBookingLink}
      className="bg-[#D4AF37] text-[#01411C] hover:bg-[#c49d2f]"
    >
      <Share2 className="w-4 h-4 ml-2" />
      مشاركة رابط الحجز
    </Button>
    
    {/* زر ساعات العمل */}
    <Button
      onClick={() => setShowWorkingHours(true)}
      variant="outline"
      className="border-2 border-[#D4AF37]"
    >
      <Clock className="w-4 h-4 ml-2" />
      إدارة ساعات العمل
    </Button>
  </div>
</div>
```

**الأزرار (3):**
1. **قائمة المواعيد** - يفتح Slider جانبي
2. **مشاركة رابط الحجز** - نسخ + مشاركة
3. **إدارة ساعات العمل** - يفتح Dialog

---

## 2️⃣ بطاقات الإحصائيات (Lines 311-369):

### البطاقة 1: إجمالي المواعيد
```tsx
<Card className="border border-[#D4AF37] md:border-2 bg-gradient-to-br from-[#fffef7] to-white">
  <CardContent className="p-2 md:p-4">
    <div className="flex flex-col md:flex-row items-center md:gap-3 text-center md:text-right">
      <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-[#01411C] to-[#065f41] rounded-full flex items-center justify-center mb-1 md:mb-0">
        <Calendar className="w-4 h-4 md:w-6 md:h-6 text-[#D4AF37]" />
      </div>
      <div>
        <p className="text-[10px] md:text-sm text-gray-600 leading-tight">إجمالي المواعيد</p>
        <p className="text-lg md:text-2xl text-[#01411C]">{stats.total}</p>
      </div>
    </div>
  </CardContent>
</Card>
```

### البطاقة 2: المواعيد القادمة
```tsx
<Card className="border border-[#D4AF37] md:border-2 bg-gradient-to-br from-[#fffef7] to-white">
  <CardContent className="p-2 md:p-4">
    <div className="flex flex-col md:flex-row items-center md:gap-3 text-center md:text-right">
      <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-[#01411C] to-[#065f41] rounded-full flex items-center justify-center mb-1 md:mb-0">
        <Clock className="w-4 h-4 md:w-6 md:h-6 text-[#D4AF37]" />
      </div>
      <div>
        <p className="text-[10px] md:text-sm text-gray-600 leading-tight">المواعيد القادمة</p>
        <p className="text-lg md:text-2xl text-[#01411C]">{stats.upcoming}</p>
      </div>
    </div>
  </CardContent>
</Card>
```

### البطاقة 3: المواعيد المكتملة
```tsx
<Card className="border border-[#D4AF37] md:border-2 bg-gradient-to-br from-[#fffef7] to-white">
  <CardContent className="p-2 md:p-4">
    <div className="flex flex-col md:flex-row items-center md:gap-3 text-center md:text-right">
      <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-[#01411C] to-[#065f41] rounded-full flex items-center justify-center mb-1 md:mb-0">
        <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-[#D4AF37]" />
      </div>
      <div>
        <p className="text-[10px] md:text-sm text-gray-600 leading-tight">المواعيد المكتملة</p>
        <p className="text-lg md:text-2xl text-[#01411C]">{stats.completed}</p>
      </div>
    </div>
  </CardContent>
</Card>
```

### البطاقة 4: المواعيد الملغاة
```tsx
<Card className="border border-red-400 md:border-2 bg-gradient-to-br from-red-50 to-white">
  <CardContent className="p-2 md:p-4">
    <div className="flex flex-col md:flex-row items-center md:gap-3 text-center md:text-right">
      <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mb-1 md:mb-0">
        <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div>
        <p className="text-[10px] md:text-sm text-gray-600 leading-tight">المواعيد الملغاة</p>
        <p className="text-lg md:text-2xl text-red-600">{stats.cancelled}</p>
      </div>
    </div>
  </CardContent>
</Card>
```

**Grid:** `grid-cols-2 md:grid-cols-4`

---

## 3️⃣ التصفية (للموبايل) (Lines 372-447):

```tsx
<div className="block md:hidden mb-6">
  <Card className="border-2 border-[#D4AF37]">
    <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41]">
      <CardTitle className="text-white">تصفية المواعيد</CardTitle>
    </CardHeader>
    <CardContent className="p-4">
      {/* تصفية حسب النوع */}
      <div className="mb-3">
        <label className="text-sm text-gray-700 mb-1 block">النوع:</label>
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="all">الكل</option>
          <option value="meeting">اجتماع</option>
          <option value="showing">عرض عقار</option>
          <option value="call">مكالمة</option>
        </select>
      </div>

      {/* تصفية حسب الحالة */}
      <div className="mb-3">
        <label className="text-sm text-gray-700 mb-1 block">الحالة:</label>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="all">الكل</option>
          <option value="upcoming">قادم</option>
          <option value="ongoing">جاري</option>
          <option value="completed">مكتمل</option>
          <option value="cancelled">ملغي</option>
        </select>
      </div>

      {/* قائمة المواعيد */}
      <div>
        <h3 className="text-sm text-gray-700 mb-2">قائمة المواعيد</h3>
        <div className="space-y-2 max-h-60 overflow-auto">
          {filteredEvents.length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-4">لا يوجد مواعيد</div>
          ) : (
            filteredEvents.map((ev) => (
              <div key={ev.id} className="p-2 rounded-md border bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-sm text-[#01411C]">{ev.title}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(ev.start).toLocaleDateString('ar-SA')} - 
                      {new Date(ev.start).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handlers.openEdit(ev)}
                      className="text-xs px-2 py-1 bg-[#01411C] text-white rounded"
                    >
                      تعديل
                    </button>
                    <button 
                      onClick={() => calendar.deleteEvent(ev.id)}
                      className="text-xs px-2 py-1 bg-red-500 text-white rounded"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </CardContent>
  </Card>
</div>
```

**الأزرار في كل موعد:**
1. **تعديل** - `handlers.openEdit(ev)`
2. **حذف** - `calendar.deleteEvent(ev.id)`

---

# 📑 التبويبات (Tabs):

## TabsList (Lines 453-495):

```tsx
<TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9 bg-gray-100 p-1 rounded-lg gap-1">
  {/* 1. التقويم */}
  <TabsTrigger value="calendar" className="flex items-center gap-1 text-xs">
    <Calendar className="w-3 h-3" />
    <span className="hidden sm:inline">التقويم</span>
  </TabsTrigger>
  
  {/* 2. أسبوعي 🆕 */}
  <TabsTrigger value="weekly" className="flex items-center gap-1 text-xs">
    <CalendarDays className="w-3 h-3" />
    <span className="hidden sm:inline">أسبوعي</span>
    <Badge className="bg-red-500 text-white text-[8px] sm:text-[10px]">🆕</Badge>
  </TabsTrigger>
  
  {/* 3. يومي 🆕 */}
  <TabsTrigger value="daily" className="flex items-center gap-1 text-xs">
    <CalendarClock className="w-3 h-3" />
    <span className="hidden sm:inline">يومي</span>
    <Badge className="bg-red-500 text-white text-[8px] sm:text-[10px]">🆕</Badge>
  </TabsTrigger>
  
  {/* 4. ملخص 🆕 */}
  <TabsTrigger value="summary" className="flex items-center gap-1 text-xs">
    <TrendingUp className="w-3 h-3" />
    <span className="hidden sm:inline">ملخص</span>
    <Badge className="bg-red-500 text-white text-[8px] sm:text-[10px]">🆕</Badge>
  </TabsTrigger>
  
  {/* 5. إشعارات */}
  <TabsTrigger value="notifications" className="flex items-center gap-1 text-xs">
    <Bell className="w-3 h-3" />
    <span className="hidden sm:inline">إشعارات</span>
  </TabsTrigger>
  
  {/* 6. صوتي */}
  <TabsTrigger value="voice" className="flex items-center gap-1 text-xs">
    <Mic className="w-3 h-3" />
    <span className="hidden sm:inline">صوتي</span>
  </TabsTrigger>
  
  {/* 7. تحليلات */}
  <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs">
    <BarChart3 className="w-3 h-3" />
    <span className="hidden sm:inline">تحليلات</span>
  </TabsTrigger>
  
  {/* 8. صلاحيات 🆕 */}
  <TabsTrigger value="permissions" className="flex items-center gap-1 text-xs">
    <Shield className="w-3 h-3" />
    <span className="hidden sm:inline">صلاحيات</span>
    <Badge className="bg-red-500 text-white text-[8px] sm:text-[10px]">🆕</Badge>
  </TabsTrigger>
  
  {/* 9. ساعات العمل 🆕 */}
  <TabsTrigger value="working-hours" className="flex items-center gap-1 text-xs">
    <Settings2 className="w-3 h-3" />
    <span className="hidden sm:inline">ساعات العمل</span>
    <Badge className="bg-red-500 text-white text-[8px] sm:text-[10px]">🆕</Badge>
  </TabsTrigger>
</TabsList>
```

**إجمالي التبويبات: 9**

**Grid:**
- موبايل: `grid-cols-3`
- تابلت: `grid-cols-5`
- ديسكتوب: `grid-cols-9`

---

# 📅 التبويبات - المحتوى:

## Tab 1: التقويم الشهري (Lines 498-529):

```tsx
<TabsContent value="calendar" className="mt-6">
  <Card className="border-2 border-[#D4AF37] shadow-xl">
    <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41]">
      <CardTitle className="text-white flex items-center justify-between">
        {/* زر إضافة موعد */}
        <Button
          onClick={() => handlers.openCreate()}
          className="bg-[#D4AF37] text-[#01411C] hover:bg-[#B8941F] font-semibold"
        >
          <Calendar className="w-4 h-4 ml-2" />
          إضافة موعد
        </Button>
        
        <span className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#D4AF37]" />
          التقويم الشهري
        </span>
      </CardTitle>
    </CardHeader>
    
    <CardContent className="p-4">
      <MonthlyCalendarView 
        events={filteredEvents} 
        handlers={handlers}
        onDayClick={(date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const timeStr = `${dateStr}T09:00`;
          setPrefilledDate(timeStr);
          handlers.openCreate(timeStr);
        }}
      />
    </CardContent>
  </Card>
</TabsContent>
```

**المكون:** `MonthlyCalendarView`

**Props:**
- `events` - المواعيد المفلترة
- `handlers` - دوال الإدارة
- `onDayClick` - عند النقر على يوم (يفتح نموذج بالتاريخ المحدد)

---

## Tab 2: الإشعارات الذكية (Lines 532-542):

```tsx
<TabsContent value="notifications" className="mt-6">
  <div className="space-y-4">
    {/* Banner */}
    <div className="flex items-center gap-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
      <Sparkles className="w-5 h-5 text-blue-600" />
      <p className="text-sm text-blue-700">
        نظام الإشعارات الذكية يرسل تذكيرات تلقائية للعملاء والوسطاء قبل المواعيد الحرجة
      </p>
    </div>
    
    {/* Panel */}
    <SmartNotificationsPanel />
  </div>
</TabsContent>
```

**المكون:** `SmartNotificationsPanel`

---

## Tab 3: الأوامر الصوتية (Lines 545-555):

```tsx
<TabsContent value="voice" className="mt-6">
  <div className="space-y-4">
    {/* Banner */}
    <div className="flex items-center gap-2 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
      <Sparkles className="w-5 h-5 text-purple-600" />
      <p className="text-sm text-purple-700">
        تحكم كامل في المواعيد عبر الأوامر الصوتية بالعربية والإنجليزية - قل "عقاري أي آي" للبدء
      </p>
    </div>
    
    {/* Panel */}
    <VoiceCommandsPanel />
  </div>
</TabsContent>
```

**المكون:** `VoiceCommandsPanel`

**Hotword:** "عقاري أي آي"

---

## Tab 4: العرض الأسبوعي 🆕 (Lines 558-581):

```tsx
<TabsContent value="weekly" className="mt-6">
  <div className="space-y-4">
    {/* Banner */}
    <div className="flex items-center gap-2 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
      <Sparkles className="w-5 h-5 text-purple-600" />
      <p className="text-sm text-purple-700">
        عرض أسبوعي كامل مع شبكة 7 أيام × 24 ساعة - اضغط على أي خلية فارغة لإضافة موعد
      </p>
    </div>
    
    {/* الشبكة */}
    <Card className="border-2 border-[#D4AF37]">
      <CardContent className="p-4">
        <CalendarWeeklyView 
          events={filteredEvents}
          onEventClick={(event) => handlers.openEdit(event)}
          onTimeSlotClick={(date, hour) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const timeStr = `${dateStr}T${hour.toString().padStart(2, '0')}:00`;
            setPrefilledDate(timeStr);
            handlers.openCreate(timeStr);
          }}
        />
      </CardContent>
    </Card>
  </div>
</TabsContent>
```

**المكون:** `CalendarWeeklyView`

**Props:**
- `events` - المواعيد
- `onEventClick` - عند النقر على موعد (تحرير)
- `onTimeSlotClick` - عند النقر على خلية فارغة (إنشاء جديد)

---

## Tab 5: العرض اليومي 🆕 (Lines 584-603):

```tsx
<TabsContent value="daily" className="mt-6">
  <div className="space-y-4">
    {/* Banner */}
    <div className="flex items-center gap-2 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
      <Sparkles className="w-5 h-5 text-orange-600" />
      <p className="text-sm text-orange-700">
        عرض تفصيلي ليوم واحد مع جدول ساعات كامل وتفاصيل شاملة لكل موعد
      </p>
    </div>
    
    {/* العرض */}
    <CalendarDailyView 
      events={filteredEvents}
      onEventClick={(event) => handlers.openEdit(event)}
      onTimeSlotClick={(date, hour) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const timeStr = `${dateStr}T${hour.toString().padStart(2, '0')}:00`;
        setPrefilledDate(timeStr);
        handlers.openCreate(timeStr);
      }}
    />
  </div>
</TabsContent>
```

**المكون:** `CalendarDailyView`

---

## Tab 6: الملخص الأسبوعي 🆕 (Lines 606-616):

```tsx
<TabsContent value="summary" className="mt-6">
  <div className="space-y-4">
    {/* Banner */}
    <div className="flex items-center gap-2 p-4 bg-teal-50 border-2 border-teal-200 rounded-lg">
      <Sparkles className="w-5 h-5 text-teal-600" />
      <p className="text-sm text-teal-700">
        ملخص ذكي لأداء الأسبوع الحالي مع رؤى وتوصيات وإمكانية التصدير
      </p>
    </div>
    
    {/* Panel */}
    <WeeklySummaryPanel events={calendar.events} />
  </div>
</TabsContent>
```

**المكون:** `WeeklySummaryPanel`

---

## Tab 7: التحليلات (Lines 619-629):

```tsx
<TabsContent value="analytics" className="mt-6">
  <div className="space-y-4">
    {/* Banner */}
    <div className="flex items-center gap-2 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
      <Sparkles className="w-5 h-5 text-green-600" />
      <p className="text-sm text-green-700">
        تحليلات ذكية لأداء المواعيد ومعدلات الحضور والإلغاء مع رؤى مفصلة
      </p>
    </div>
    
    {/* Dashboard */}
    <AppointmentAnalyticsDashboard events={calendar.events} />
  </div>
</TabsContent>
```

**المكون:** `AppointmentAnalyticsDashboard`

---

## Tab 8: نظام الصلاحيات 🆕 (Lines 632-642):

```tsx
<TabsContent value="permissions" className="mt-6">
  <div className="space-y-4">
    {/* Banner */}
    <div className="flex items-center gap-2 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
      <Sparkles className="w-5 h-5 text-indigo-600" />
      <p className="text-sm text-indigo-700">
        إدارة كاملة لصلاحيات الأدوار - 4 أدوار (مالك، مدير، وسيط، عميل) و17 صلاحية
      </p>
    </div>
    
    {/* Manager */}
    <PermissionsManager />
  </div>
</TabsContent>
```

**المكون:** `PermissionsManager`

**الأدوار:** 4 (مالك، مدير، وسيط، عميل)
**الصلاحيات:** 17

---

## Tab 9: إدارة ساعات العمل 🆕 (Lines 645-661):

```tsx
<TabsContent value="working-hours" className="mt-6">
  <div className="space-y-4">
    {/* Banner */}
    <div className="flex items-center gap-2 p-4 bg-cyan-50 border-2 border-cyan-200 rounded-lg">
      <Sparkles className="w-5 h-5 text-cyan-600" />
      <p className="text-sm text-cyan-700">
        تحديد ساعات العمل لكل يوم في الأسبوع - يظهر للعملاء عند الحجز عبر الرابط العام
      </p>
    </div>
    
    {/* Editor */}
    <Card className="border-2 border-[#D4AF37]">
      <CardContent className="p-4">
        <WorkingHoursEditor />
      </CardContent>
    </Card>
  </div>
</TabsContent>
```

**المكون:** `WorkingHoursEditor`

---

# 📝 نموذج إضافة/تعديل موعد:

## `/components/AppointmentForm.tsx` (500+ سطر):

### أنواع المواعيد (Lines 32-37):
```typescript
const appointmentTypes = [
  { value: "meeting", label: "موعد اجتماع", icon: Calendar, color: "from-blue-500 to-blue-600" },
  { value: "showing", label: "معاينة عقار", icon: Home, color: "from-green-500 to-green-600" },
  { value: "call", label: "موعد اتصال", icon: Phone, color: "from-purple-500 to-purple-600" },
  { value: "custom", label: "تخصيص", icon: Sparkles, color: "from-orange-500 to-orange-600" }
];
```

### الحقول (Lines 40-55):
```typescript
const [form, setForm] = useState({
  title: "",
  description: "",
  start: "",
  end: "",
  type: "meeting",
  reminder: 15,
  status: "مجدول" as 'مجدول' | 'مؤكد' | 'مكتمل' | 'ملغي',
  priority: "normal" as 'normal' | 'critical',
  client_name: prefilledClientData?.clientName || "",
  client_phone: prefilledClientData?.clientPhone || prefilledClientData?.clientWhatsapp || "",
  client_email: "",
  city: "",
  district: "",
  cancellable_by_client: true
});
```

**إجمالي الحقول: 14**

### التعبئة التلقائية (Lines 57-118):

#### من CRM (Lines 75-83):
```typescript
if (prefilledClientData) {
  setForm(prev => ({
    ...prev,
    client_name: prefilledClientData.clientName || "",
    client_phone: prefilledClientData.clientPhone || prefilledClientData.clientWhatsapp || "",
    title: `موعد مع ${prefilledClientData.clientName || 'عميل'}`,
    type: "meeting"
  }));
}
```

#### من التقويم (Lines 84-117):
```typescript
else if (prefilledDate) {
  if (prefilledDate === "TODAY") {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    setForm(prev => ({
      ...prev,
      start: `${dateStr}T09:00`,
      end: `${dateStr}T10:00`
    }));
  } else {
    const hasTime = prefilledDate.includes('T');
    if (hasTime) {
      const startTime = prefilledDate;
      const startDate = new Date(startTime);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 ساعة
      const endTime = endDate.toISOString().slice(0, 16);
      
      setForm(prev => ({
        ...prev,
        start: startTime,
        end: endTime
      }));
    } else {
      setForm(prev => ({
        ...prev,
        start: `${prefilledDate}T09:00`,
        end: `${prefilledDate}T10:00`
      }));
    }
  }
}
```

### المكونات في النموذج:

#### 1. اختيار نوع الموعد (Lines 185-228):
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
  {appointmentTypes.map((type) => {
    const Icon = type.icon;
    const isSelected = form.type === type.value;
    return (
      <button
        key={type.value}
        type="button"
        onClick={() => setForm({...form, type: type.value})}
        className={`
          relative p-3 md:p-4 rounded-lg border-2 transition-all
          ${isSelected 
            ? 'border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white shadow-md' 
            : 'border-gray-200 hover:border-[#D4AF37]/50 bg-white'
          }
        `}
      >
        <div className={`
          w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 rounded-full 
          bg-gradient-to-br ${type.color} 
          flex items-center justify-center
        `}>
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <p className="text-xs md:text-sm text-center text-gray-700">
          {type.label}
        </p>
        {isSelected && (
          <div className="absolute top-1 left-1 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>
    );
  })}
</div>
```

**Grid:** `grid-cols-2 md:grid-cols-4`

#### 2. حقل العنوان (للتخصيص فقط) (Lines 231-244):
```tsx
{form.type === "custom" && (
  <div>
    <label className="block text-sm text-gray-700 mb-2">
      عنوان الموعد
    </label>
    <input 
      required 
      value={form.title} 
      onChange={(e) => setForm({...form, title: e.target.value})} 
      placeholder="أدخل عنوان الموعد" 
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
    />
  </div>
)}
```

#### 3. تفاصيل/سبب الموعد (Lines 247-258):
```tsx
<div>
  <label className="block text-sm text-gray-700 mb-2">
    {form.type === "custom" ? "تفاصيل الموعد" : "سبب الموعد"}
  </label>
  <textarea 
    value={form.description} 
    onChange={(e) => setForm({...form, description: e.target.value})} 
    placeholder={form.type === "custom" ? "أدخل تفاصيل الموعد" : "أدخل سبب الموعد"}
    rows={3}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
  />
</div>
```

#### 4. بداية الموعد (Lines 263-335):
```tsx
<div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
  <label className="block text-sm text-gray-700 mb-3 font-medium">
    بداية الموعد
    {prefilledDate && (
      <span className="mr-2 inline-flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
        <CheckCircle className="w-3 h-3" />
        محدد من التقويم
      </span>
    )}
    {prefilledClientData && (
      <span className="mr-2 inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
        <CheckCircle className="w-3 h-3" />
        من إدارة العملاء
      </span>
    )}
  </label>
  
  {prefilledDate && (
    <p className="text-xs text-blue-600 mb-2">
      📅 التاريخ محدد تلقائياً - يمكنك تعديل الوقت حسب الحاجة
    </p>
  )}
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    {/* التاريخ */}
    <div>
      <label className="block text-xs text-gray-600 mb-1">التاريخ</label>
      <input 
        type="date" 
        required
        value={form.start.split('T')[0] || ''} 
        onChange={(e) => {
          const currentTime = form.start.split('T')[1] || '09:00';
          setForm({...form, start: `${e.target.value}T${currentTime}`});
        }} 
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent bg-white"
      />
    </div>
    
    {/* الساعة */}
    <div>
      <label className="block text-xs text-gray-600 mb-1">الساعة</label>
      <select
        required
        value={form.start.split('T')[1]?.split(':')[0] || '09'}
        onChange={(e) => {
          const date = form.start.split('T')[0] || '';
          const minutes = form.start.split('T')[1]?.split(':')[1] || '00';
          setForm({...form, start: `${date}T${e.target.value}:${minutes}`});
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent bg-white"
      >
        {Array.from({length: 24}, (_, i) => (
          <option key={i} value={i.toString().padStart(2, '0')}>
            {i.toString().padStart(2, '0')}
          </option>
        ))}
      </select>
    </div>
    
    {/* الدقيقة */}
    <div>
      <label className="block text-xs text-gray-600 mb-1">الدقيقة</label>
      <select
        required
        value={form.start.split('T')[1]?.split(':')[1] || '00'}
        onChange={(e) => {
          const date = form.start.split('T')[0] || '';
          const hours = form.start.split('T')[1]?.split(':')[0] || '09';
          setForm({...form, start: `${date}T${hours}:${e.target.value}`});
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent bg-white"
      >
        {['00', '15', '30', '45'].map((min) => (
          <option key={min} value={min}>{min}</option>
        ))}
      </select>
    </div>
  </div>
</div>
```

**الحقول الفرعية:**
1. **التاريخ** - `<input type="date">`
2. **الساعة** - `<select>` (0-23)
3. **الدقيقة** - `<select>` (00, 15, 30, 45)

#### 5. نهاية الموعد (Lines 338-393):
```tsx
<div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
  <label className="block text-sm text-gray-700 mb-3 font-medium">
    نهاية الموعد
  </label>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    {/* التاريخ */}
    <div>
      <label className="block text-xs text-gray-600 mb-1">التاريخ</label>
      <input 
        type="date" 
        required
        value={form.end.split('T')[0] || ''} 
        onChange={(e) => {
          const currentTime = form.end.split('T')[1] || '10:00';
          setForm({...form, end: `${e.target.value}T${currentTime}`});
        }} 
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent bg-white"
      />
    </div>
    
    {/* الساعة */}
    <div>
      <label className="block text-xs text-gray-600 mb-1">الساعة</label>
      <select
        required
        value={form.end.split('T')[1]?.split(':')[0] || '10'}
        onChange={(e) => {
          const date = form.end.split('T')[0] || '';
          const minutes = form.end.split('T')[1]?.split(':')[1] || '00';
          setForm({...form, end: `${date}T${e.target.value}:${minutes}`});
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent bg-white"
      >
        {Array.from({length: 24}, (_, i) => (
          <option key={i} value={i.toString().padStart(2, '0')}>
            {i.toString().padStart(2, '0')}
          </option>
        ))}
      </select>
    </div>
    
    {/* الدقيقة */}
    <div>
      <label className="block text-xs text-gray-600 mb-1">الدقيقة</label>
      <select
        required
        value={form.end.split('T')[1]?.split(':')[1] || '00'}
        onChange={(e) => {
          const date = form.end.split('T')[0] || '';
          const hours = form.end.split('T')[1]?.split(':')[0] || '10';
          setForm({...form, end: `${date}T${hours}:${e.target.value}`});
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent bg-white"
      >
        {['00', '15', '30', '45'].map((min) => (
          <option key={min} value={min}>{min}</option>
        ))}
      </select>
    </div>
  </div>
</div>
```

#### 6. حالة الموعد (Lines 397-411):
```tsx
<div>
  <label className="block text-sm text-gray-700 mb-2">
    حالة الموعد
  </label>
  <select 
    value={form.status} 
    onChange={(e) => setForm({...form, status: e.target.value as 'مجدول' | 'مؤكد' | 'مكتمل' | 'ملغي'})} 
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
  >
    <option value="مجدول">مجدول</option>
    <option value="مؤكد">مؤكد</option>
    <option value="مكتمل">مكتمل</option>
    <option value="ملغي">ملغي</option>
  </select>
</div>
```

**الخيارات:**
1. مجدول
2. مؤكد
3. مكتمل
4. ملغي

#### 7. أولوية الموعد (Lines 414-431):
```tsx
<div>
  <label className="block text-sm text-gray-700 mb-2">
    أولوية الموعد
  </label>
  <select
    value={form.priority}
    onChange={(e) => setForm({...form, priority: e.target.value as 'normal' | 'critical'})}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
  >
    <option value="normal">عادي - يمكن للعميل الإلغاء</option>
    <option value="critical">حرجة (معاينة عقار/اجتماع ميداني) - إلغاء محدود</option>
  </select>
  
  {form.priority === 'critical' && (
    <p className="text-xs text-orange-600 mt-1">
      سيتم إرسال تذكير للعميل قبل 30 دقيقة وللوسيط قبل 45 دقيقة
    </p>
  )}
</div>
```

**الخيارات:**
1. **normal** - عادي
2. **critical** - حرجة

#### 8. بيانات العميل (Lines 434-477):
```tsx
<div className="border-2 border-blue-100 rounded-lg p-4 space-y-3 bg-blue-50">
  <div className="flex items-center justify-between">
    <h4 className="text-sm font-semibold text-[#01411C]">بيانات العميل</h4>
    {prefilledClientData && (
      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
        ✓ تم التعبئة تلقائياً
      </span>
    )}
  </div>
  
  {/* اسم العميل */}
  <div>
    <label className="block text-sm text-gray-700 mb-2">اسم العميل</label>
    <input
      type="text"
      value={form.client_name}
      onChange={(e) => setForm({...form, client_name: e.target.value})}
      placeholder="أدخل اسم العميل"
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
    />
  </div>

  <div className="grid grid-cols-2 gap-3">
    {/* رقم الجوال */}
    <div>
      <label className="block text-sm text-gray-700 mb-2">رقم الجوال</label>
      <input
        type="tel"
        value={form.client_phone}
        onChange={(e) => setForm({...form, client_phone: e.target.value})}
        placeholder="+966xxxxxxxxx"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
      />
    </div>
    
    {/* البريد الإلكتروني */}
    <div>
      <label className="block text-sm text-gray-700 mb-2">البريد الإلكتروني</label>
      <input
        type="email"
        value={form.client_email}
        onChange={(e) => setForm({...form, client_email: e.target.value})}
        placeholder="email@example.com"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
      />
    </div>
  </div>
</div>
```

**الحقول (3):**
1. اسم العميل
2. رقم الجوال
3. البريد الإلكتروني

#### 9. موقع المعاينة (للمعاينات فقط) (Lines 480-519):
```tsx
{form.type === 'showing' && (
  <div className="border-2 border-green-100 rounded-lg p-4 space-y-3 bg-green-50">
    <h4 className="text-sm font-semibold text-[#01411C]">موقع المعاينة</h4>
    
    <div className="grid grid-cols-2 gap-3">
      {/* المدينة */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">المدينة</label>
        <input
          type="text"
          value={form.city}
          onChange={(e) => setForm({...form, city: e.target.value})}
          placeholder="مثال: الرياض"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
        />
      </div>
      
      {/* الحي */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">الحي</label>
        <input
          type="text"
          value={form.district}
          onChange={(e) => setForm({...form, district: e.target.value})}
          placeholder="مثال: الملقا"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
        />
      </div>
    </div>
  </div>
)}
```

**الحقول (2):**
1. المدينة
2. الحي

---

# 📊 جدول الملخص:

| المكون | الملف | السطور | الوظيفة |
|--------|------|---------|---------|
| CalendarSystemComplete | `/components/calendar-system-complete.tsx` | 648+ | الملف الرئيسي |
| AppointmentForm | `/components/AppointmentForm.tsx` | 500+ | نموذج إضافة/تعديل |
| AppointmentCard | `/components/AppointmentCard.tsx` | 51 | بطاقة عرض موعد |
| CalendarWeeklyView | `/components/CalendarWeeklyView.tsx` | 133 | العرض الأسبوعي |
| CalendarAPI | `/api/calendar.ts` | 471 | الـ API |
| useCalendar | `/hooks/useCalendar.ts` | 127 | الـ Hook |
| Types | `/types/calendar.ts` | 54 | التعريفات |

---

# ✅ التوثيق الكامل انتهى!

**جاهز للنقل الحرفي والتنفيذ!** 📅
