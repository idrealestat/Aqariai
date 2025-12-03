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

interface CalendarSystemCompleteProps {
  onBack: () => void;
}

export default function CalendarSystemComplete({ onBack }: CalendarSystemCompleteProps) {
  const { leftSidebarOpen } = useDashboardContext();
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [prefilledDate, setPrefilledDate] = useState<string>("");
  const [prefilledClientData, setPrefilledClientData] = useState<any>(null);
  const [showWorkingHours, setShowWorkingHours] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAppointmentsList, setShowAppointmentsList] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar');
  
  const calendar = useCalendar();
  const notifications = useSmartNotifications();
  const voiceCommands = useVoiceCommands();
  const scheduling = useSmartScheduling();

  // طلب إذن الإشعارات
  React.useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // الاستماع لطلبات جدولة موعد من إدارة العملاء
  React.useEffect(() => {
    const handleScheduleFromCRM = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        const { clientName, clientPhone, clientWhatsapp, clientId } = customEvent.detail;
        
        // حفظ بيانات العميل للاستخدام في النموذج
        setPrefilledClientData({
          clientName,
          clientPhone,
          clientWhatsapp,
          clientId
        });
        
        // فتح نموذج إضافة موعد
        setIsOpen(true);
        setEditingEvent(null);
        
        // إشعار بنجاح الفتح
        toast.success(`جاري إضافة موعد للعميل: ${clientName}`);
      }
    };

    window.addEventListener('scheduleAppointmentFromCRM', handleScheduleFromCRM);
    
    return () => {
      window.removeEventListener('scheduleAppointmentFromCRM', handleScheduleFromCRM);
    };
  }, []);

  // تصفية المواعيد حسب النوع والحالة
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

  // نظام مشاركة رابط الحجز
  const handleShareBookingLink = async () => {
    const bookingUrl = `${window.location.origin}/appointment-booking?broker=broker-123`;
    
    // رسالة المشاركة مع ساعات العمل
    const message = `يمكنك حجز موعد معي مباشرة عبر الرابط التالي:\n${bookingUrl}\n\nساعات العمل:\nالأحد: 9:00 ص - 12:00 م | 4:00 م - 8:00 م\nالاثنين: 9:00 ص - 12:00 م | 4:00 م - 8:00 م`;
    
    // نسخ إلى الحافظة أولاً
    try {
      await navigator.clipboard.writeText(message);
      toast.success("تم نسخ رابط الحجز للحافظة");
    } catch (err) {
      console.error('Failed to copy:', err);
    }
    
    // مشاركة واتساب
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    // فتح خيارات المشاركة
    if (navigator.share && navigator.canShare) {
      try {
        await navigator.share({
          title: 'حجز موعد',
          text: message,
          url: bookingUrl
        });
      } catch (err: any) {
        // إذا رفض المستخدم المشاركة، لا نعرض رسالة خطأ
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
          toast.info("يمكنك مشاركة الرابط المنسوخ يدوياً");
        }
      }
    }
  };

  // نظام التنبيهات المتقدم
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
    
    // تشغيل النغمة
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.6);
  };

  const showNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/calendar-icon.png' });
    }
  };

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

  const handlers = {
    ...calendar,
    openCreate: (date?: string) => {
      console.log('🔍 [CalendarSystemComplete] openCreate called with date:', date);
      console.log('🔍 [CalendarSystemComplete] isOpen before:', isOpen);
      
      setIsOpen(true);
      console.log('🔍 [CalendarSystemComplete] setIsOpen(true) called');
      
      setEditingEvent(null);
      setPrefilledDate(date || "TODAY");
      
      console.log('🔍 [CalendarSystemComplete] prefilledDate set to:', date || "TODAY");
      console.log('🔍 [CalendarSystemComplete] openCreate completed');
    },
    openEdit: (ev: any) => {
      setIsOpen(true);
      setEditingEvent(ev);
      setPrefilledDate("");
      setPrefilledClientData(null);
    },
    cancelEdit: () => {
      setEditingEvent(null);
      setPrefilledDate("");
      setPrefilledClientData(null);
    },
    createEvent: (payload: any) => {
      try {
        const newEvent = calendar.createEvent(payload);
        scheduleReminders(newEvent);
        setEditingEvent(null);
        setPrefilledDate("");
        setPrefilledClientData(null);
        setIsOpen(false);
        toast.success('تم إضافة الموعد بنجاح');
      } catch (error: any) {
        toast.error(error.message || 'حدث خطأ أثناء إضافة الموعد');
      }
    },
    updateEvent: (updated: any) => {
      try {
        calendar.updateEvent(updated);
        scheduleReminders(updated);
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

  const stats = {
    total: calendar.events.length,
    upcoming: calendar.events.filter(e => new Date(e.start) > new Date() && e.status !== 'ملغي').length,
    completed: calendar.events.filter(e => new Date(e.end) < new Date() && e.status !== 'ملغي').length,
    cancelled: calendar.events.filter(e => e.status === 'ملغي').length
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-white p-6 transition-all duration-300" 
      dir="rtl"
      style={{
        marginLeft: leftSidebarOpen ? "350px" : "0"
      }}
    >
      {/* Dynamic Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-2 border-[#D4AF37] hover:bg-[#f0fdf4]"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          عودة
        </Button>

        <div className="text-center flex-1">
          <h1 className="text-2xl text-[#01411C]">التقويم والمواعيد</h1>
          <p className="text-sm text-gray-600">جدولة المواعيد والمعاينات مع العملاء</p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowAppointmentsList(true)}
            variant="outline"
            className="border-2 border-[#D4AF37] hover:bg-[#f0fdf4]"
          >
            <List className="w-4 h-4 ml-2" />
            قائمة المواعيد
          </Button>
          <Button
            onClick={handleShareBookingLink}
            className="bg-[#D4AF37] text-[#01411C] hover:bg-[#c49d2f]"
          >
            <Share2 className="w-4 h-4 ml-2" />
            مشاركة رابط الحجز
          </Button>
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

      {/* Stats Cards - مربعات 2×2 أصغر على الموبايل */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6">
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
      </div>

      {/* التصفية والقائمة للموبايل - تظهر فوق التقويم */}
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
                            {new Date(ev.start).toLocaleDateString('ar-SA')} - {new Date(ev.start).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
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



      {/* Tabs للمميزات */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9 bg-gray-100 p-1 rounded-lg gap-1">
          <TabsTrigger value="calendar" className="flex items-center gap-1 text-xs">
            <Calendar className="w-3 h-3" />
            <span className="hidden sm:inline">التقويم</span>
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-1 text-xs">
            <CalendarDays className="w-3 h-3" />
            <span className="hidden sm:inline">أسبوعي</span>
            <Badge className="bg-red-500 text-white text-[8px] sm:text-[10px]">🆕</Badge>
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center gap-1 text-xs">
            <CalendarClock className="w-3 h-3" />
            <span className="hidden sm:inline">يومي</span>
            <Badge className="bg-red-500 text-white text-[8px] sm:text-[10px]">🆕</Badge>
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-1 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span className="hidden sm:inline">ملخص</span>
            <Badge className="bg-red-500 text-white text-[8px] sm:text-[10px]">🆕</Badge>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1 text-xs">
            <Bell className="w-3 h-3" />
            <span className="hidden sm:inline">إشعارات</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-1 text-xs">
            <Mic className="w-3 h-3" />
            <span className="hidden sm:inline">صوتي</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs">
            <BarChart3 className="w-3 h-3" />
            <span className="hidden sm:inline">تحليلات</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-1 text-xs">
            <Shield className="w-3 h-3" />
            <span className="hidden sm:inline">صلاحيات</span>
            <Badge className="bg-red-500 text-white text-[8px] sm:text-[10px]">🆕</Badge>
          </TabsTrigger>
          <TabsTrigger value="working-hours" className="flex items-center gap-1 text-xs">
            <Settings2 className="w-3 h-3" />
            <span className="hidden sm:inline">ساعات العمل</span>
            <Badge className="bg-red-500 text-white text-[8px] sm:text-[10px]">🆕</Badge>
          </TabsTrigger>
        </TabsList>

        {/* التقويم الشهري */}
        <TabsContent value="calendar" className="mt-6">
          <Card className="border-2 border-[#D4AF37] shadow-xl">
            <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41]">
              <CardTitle className="text-white flex items-center justify-between">
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
                  // تحديد التاريخ المحدد مع وقت افتراضي 9 صباحاً
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const timeStr = `${dateStr}T09:00`;
                  setPrefilledDate(timeStr);
                  handlers.openCreate(timeStr);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* الإشعارات الذكية */}
        <TabsContent value="notifications" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-700">
                نظام الإشعارات الذكية يرسل تذكيرات تلقائية للعملاء والوسطاء قبل المواعيد الحرجة
              </p>
            </div>
            <SmartNotificationsPanel />
          </div>
        </TabsContent>

        {/* الأوامر الصوتية */}
        <TabsContent value="voice" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-purple-700">
                تحكم كامل في المواعيد عبر الأوامر الصوتية بالعربية والإنجليزية - قل "عقاري أي آي" للبدء
              </p>
            </div>
            <VoiceCommandsPanel />
          </div>
        </TabsContent>

        {/* العرض الأسبوعي */}
        <TabsContent value="weekly" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-purple-700">
                عرض أسبوعي كامل مع شبكة 7 أيام × 24 ساعة - اضغط على أي خلية فارغة لإضافة موعد
              </p>
            </div>
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

        {/* العرض اليومي */}
        <TabsContent value="daily" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
              <Sparkles className="w-5 h-5 text-orange-600" />
              <p className="text-sm text-orange-700">
                عرض تفصيلي ليوم واحد مع جدول ساعات كامل وتفاصيل شاملة لكل موعد
              </p>
            </div>
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

        {/* الملخص الأسبوعي */}
        <TabsContent value="summary" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-teal-50 border-2 border-teal-200 rounded-lg">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <p className="text-sm text-teal-700">
                ملخص ذكي لأداء الأسبوع الحالي مع رؤى وتوصيات وإمكانية التصدير
              </p>
            </div>
            <WeeklySummaryPanel events={calendar.events} />
          </div>
        </TabsContent>

        {/* التحليلات */}
        <TabsContent value="analytics" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <Sparkles className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-700">
                تحليلات ذكية لأداء المواعيد ومعدلات الحضور والإلغاء مع رؤى مفصلة
              </p>
            </div>
            <AppointmentAnalyticsDashboard events={calendar.events} />
          </div>
        </TabsContent>

        {/* نظام الصلاحيات */}
        <TabsContent value="permissions" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <p className="text-sm text-indigo-700">
                إدارة كاملة لصلاحيات الأدوار - 4 أدوار (مالك، مدير، وسيط، عميل) و17 صلاحية
              </p>
            </div>
            <PermissionsManager />
          </div>
        </TabsContent>

        {/* إدارة ساعات العمل */}
        <TabsContent value="working-hours" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-cyan-50 border-2 border-cyan-200 rounded-lg">
              <Sparkles className="w-5 h-5 text-cyan-600" />
              <p className="text-sm text-cyan-700">
                حدد ساعات عملك الأسبوعية - سيتم استخدامها في صفحة الحجز الديناميكي لإظهار الأوقات المتاحة فقط
              </p>
            </div>
            <WorkingHoursEditor />
          </div>
        </TabsContent>
      </Tabs>

      {/* Past Appointments */}
      {calendar.events.filter(e => new Date(e.end) < new Date()).length > 0 && (
        <Card className="mt-6 border-2 border-gray-300">
          <CardHeader className="bg-gray-100">
            <CardTitle className="text-gray-700 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              المواعيد المكتملة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              {calendar.events
                .filter(e => new Date(e.end) < new Date())
                .slice(0, 3)
                .map((event) => (
                  <div
                    key={event.id}
                    className="p-3 border rounded-lg bg-gray-50 opacity-75"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-700">{event.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.start).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        مكتمل
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* نموذج إضافة/تعديل موعد */}
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          setIsOpen(false);
          setEditingEvent(null);
          setPrefilledDate("");
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#01411C] flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#D4AF37]" />
              {editingEvent ? "تعديل موعد" : "إضافة موعد جديد"}
            </DialogTitle>
            <DialogDescription>
              {editingEvent ? "تعديل تفاصيل الموعد" : "أدخل تفاصيل الموعد الجديد"}
            </DialogDescription>
          </DialogHeader>
          
          <AppointmentForm
            event={editingEvent}
            onSubmit={(data) => {
              if (editingEvent) {
                handlers.updateEvent({ ...editingEvent, ...data });
              } else {
                handlers.createEvent(data);
              }
            }}
            onCancel={() => {
              setIsOpen(false);
              setEditingEvent(null);
              setPrefilledDate("");
              setPrefilledClientData(null);
            }}
            prefilledDate={prefilledDate}
            prefilledClientData={prefilledClientData}
          />
        </DialogContent>
      </Dialog>

      {/* Left Slider - قائمة المواعيد */}
      <AppointmentsListLeftSlider
        isOpen={showAppointmentsList}
        onClose={() => setShowAppointmentsList(false)}
        events={calendar.events}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filteredEvents={filteredEvents}
        onEdit={(event) => handlers.openEdit(event)}
        onDelete={(id) => calendar.deleteEvent(id)}
      />

      {/* زر العودة في الأسفل */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-2 border-[#D4AF37] hover:bg-[#f0fdf4] px-8 py-6"
        >
          <ArrowRight className="w-5 h-5 mr-2" />
          العودة للوحة الرئيسية
        </Button>
      </div>
    </div>
  );
}

// ✅ مكون شبكة التقويم الشهري المدمج
function MonthlyCalendarView({ 
  events, 
  handlers, 
  onDayClick 
}: { 
  events: any[], 
  handlers: any, 
  onDayClick?: (date: Date) => void 
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 6 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 6 });

  const dateMatrix: Date[][] = [];
  let day = startDate;
  while (day <= endDate) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    dateMatrix.push(week);
  }

  const eventsByDate = events.reduce((acc: Record<string, any[]>, ev) => {
    const dayKey = format(new Date(ev.start), "yyyy-MM-dd");
    acc[dayKey] = acc[dayKey] || [];
    acc[dayKey].push(ev);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button 
          onClick={() => setCurrentDate(addDays(currentDate, -30))} 
          className="px-3 py-1 border rounded hover:bg-gray-50"
        >
          السابق
        </button>
        <div className="font-semibold text-lg">{format(monthStart, "MMMM yyyy")}</div>
        <button 
          onClick={() => setCurrentDate(addDays(currentDate, 30))} 
          className="px-3 py-1 border rounded hover:bg-gray-50"
        >
          التالي
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["السبت","الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة"].map((d) => (
          <div key={d} className="text-xs text-center py-2 font-medium">{d}</div>
        ))}

        {dateMatrix.map((week, wi) =>
          week.map((day, di) => {
            const key = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDate[key] || [];
            const isCurrentMonth = day.getMonth() === monthStart.getMonth();
            const isToday = format(new Date(), "yyyy-MM-dd") === key;

            return (
              <div
                key={`${wi}-${di}`}
                onClick={() => {
                  // فتح نموذج إضافة موعد عند النقر على اليوم
                  if (onDayClick && isCurrentMonth) {
                    onDayClick(day);
                  }
                }}
                className={`
                  min-h-24 p-2 border rounded-md transition-all
                  ${isCurrentMonth ? "cursor-pointer hover:bg-blue-50 hover:border-blue-400 hover:shadow-md" : "opacity-50 cursor-default"}
                  ${isToday ? "bg-blue-50 border-blue-400 ring-2 ring-blue-300" : "border-gray-200"}
                `}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : "text-gray-700"}`}>
                  {format(day, "d")}
                </div>
                <div className="flex flex-col gap-1">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handlers.openEdit(ev); 
                      }}
                      className="text-xs p-1 rounded-md border bg-white hover:shadow-sm transition-shadow cursor-pointer"
                    >
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500">+{dayEvents.length - 3} المزيد</div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
