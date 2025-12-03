// components/AppointmentForm.tsx
import React, { useState, useEffect } from "react";
import { Calendar, Phone, Home, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { notifyAppointmentCreated, notifyAppointmentUpdated } from "../utils/notificationsSystem";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type?: string;
  reminder?: number;
  status?: 'مجدول' | 'مؤكد' | 'مكتمل' | 'ملغي';
}

interface AppointmentFormProps {
  event?: CalendarEvent | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  prefilledDate?: string;
  prefilledClientData?: {
    clientName?: string;
    clientPhone?: string;
    clientWhatsapp?: string;
    clientId?: string;
  };
}

// أنواع المواعيد المتاحة مع الأيقونات
const appointmentTypes = [
  { value: "meeting", label: "موعد اجتماع", icon: Calendar, color: "from-blue-500 to-blue-600" },
  { value: "showing", label: "معاينة عقار", icon: Home, color: "from-green-500 to-green-600" },
  { value: "call", label: "موعد اتصال", icon: Phone, color: "from-purple-500 to-purple-600" },
  { value: "custom", label: "تخصيص", icon: Sparkles, color: "from-orange-500 to-orange-600" }
];

export default function AppointmentForm({ event, onSubmit, onCancel, prefilledDate, prefilledClientData }: AppointmentFormProps) {
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

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || "",
        description: event.description || "",
        start: event.start || "",
        end: event.end || "",
        type: event.type || "meeting",
        priority: (event as any).priority || "normal",
        client_name: (event as any).client_name || "",
        client_phone: (event as any).client_phone || "",
        client_email: (event as any).client_email || "",
        city: (event as any).city || "",
        district: (event as any).district || "",
        cancellable_by_client: (event as any).cancellable_by_client !== undefined ? (event as any).cancellable_by_client : true,
        reminder: event.reminder || 15,
        status: event.status || "مجدول"
      });
    } else if (prefilledClientData) {
      // ملء بيانات العميل من CRM
      setForm(prev => ({
        ...prev,
        client_name: prefilledClientData.clientName || "",
        client_phone: prefilledClientData.clientPhone || prefilledClientData.clientWhatsapp || "",
        title: `موعد مع ${prefilledClientData.clientName || 'عميل'}`,
        type: "meeting"
      }));
    } else if (prefilledDate) {
      if (prefilledDate === "TODAY") {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        setForm(prev => ({
          ...prev,
          start: `${dateStr}T09:00`,
          end: `${dateStr}T10:00`
        }));
      } else {
        // التحقق إذا كان prefilledDate يحتوي على وقت بالفعل
        const hasTime = prefilledDate.includes('T');
        if (hasTime) {
          // الوقت موجود بالفعل
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
          // فقط تاريخ بدون وقت
          setForm(prev => ({
            ...prev,
            start: `${prefilledDate}T09:00`,
            end: `${prefilledDate}T10:00`
          }));
        }
      }
    }
  }, [event, prefilledDate, prefilledClientData]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // التحقق من أن العنوان مطلوب عند اختيار "تخصيص"
    if (form.type === "custom" && !form.title.trim()) {
      alert("يرجى إدخال عنوان الموعد");
      return;
    }
    
    // إنشاء العنوان تلقائياً للأنواع الأخرى
    const finalForm: any = { ...form };
    if (form.type !== "custom") {
      const typeLabel = appointmentTypes.find(t => t.value === form.type)?.label || "موعد";
      finalForm.title = typeLabel;
    }
    
    // إضافة client_id إذا كان متوفراً من CRM
    if (prefilledClientData?.clientId) {
      finalForm.client_id = prefilledClientData.clientId;
    }
    
    try {
      onSubmit(finalForm);
      
      // إعادة تعيين النموذج
      setForm({
        title: "",
        description: "",
        start: "",
        end: "",
        type: "meeting",
        reminder: 15,
        status: "مجدول"
      });
      
      // إغلاق النموذج
      onCancel();
      
      // إرسال إشعار بناءً على حالة الموعد
      if (event) {
        notifyAppointmentUpdated({
          id: event.id,
          title: finalForm.title,
          customerName: finalForm.client_name,
          date: new Date(finalForm.start).toLocaleDateString('ar-SA'),
          time: new Date(finalForm.start).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        });
      } else {
        notifyAppointmentCreated({
          id: `appointment-${Date.now()}`,
          title: finalForm.title,
          customerName: finalForm.client_name,
          date: new Date(finalForm.start).toLocaleDateString('ar-SA'),
          time: new Date(finalForm.start).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        });
      }
    } catch (error: any) {
      alert(error.message || "حدث خطأ");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">

      <div className="space-y-4">
        {/* اختيار نوع الموعد بالبطاقات */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            نوع الموعد
          </label>
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
        </div>

        {/* حقل العنوان - يظهر فقط عند اختيار "تخصيص" */}
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

        {/* تفاصيل الموعد أو سبب الموعد */}
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

        {/* تحديد التاريخ والوقت */}
        <div className="space-y-4">
          {/* بداية الموعد */}
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

          {/* نهاية الموعد */}
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <label className="block text-sm text-gray-700 mb-3 font-medium">
              نهاية الموعد
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
        </div>

        {/* حالة الموعد */}
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

        {/* أولوية الموعد */}
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

        {/* بيانات العميل */}
        <div className="border-2 border-blue-100 rounded-lg p-4 space-y-3 bg-blue-50">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#01411C]">بيانات العميل</h4>
            {prefilledClientData && (
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                ✓ تم التعبئة تلقائياً
              </span>
            )}
          </div>
          
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

        {/* الموقع (للمعاينات) */}
        {form.type === 'showing' && (
          <div className="border-2 border-green-100 rounded-lg p-4 space-y-3 bg-green-50">
            <h4 className="text-sm font-semibold text-[#01411C]">موقع المعاينة</h4>
            
            <div className="grid grid-cols-2 gap-3">
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
              <div>
                <label className="block text-sm text-gray-700 mb-2">الحي</label>
                <input
                  type="text"
                  value={form.district}
                  onChange={(e) => setForm({...form, district: e.target.value})}
                  placeholder="مثال: النرجس"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* التذكير */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            التذكير قبل الموعد
          </label>
          <div className="flex gap-2 items-center">
            <input 
              type="number" 
              min="0" 
              value={form.reminder} 
              onChange={(e) => setForm({...form, reminder: Number(e.target.value)})} 
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
            <span className="text-sm text-gray-600">دقيقة</span>
          </div>
        </div>

        {/* أزرار الحفظ والإلغاء */}
        <div className="flex gap-3 pt-4 border-t">
          <Button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:shadow-lg"
          >
            {event ? "تحديث الموعد" : "حفظ الموعد"}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel} 
            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            إلغاء
          </Button>
        </div>
      </div>
    </form>
  );
}