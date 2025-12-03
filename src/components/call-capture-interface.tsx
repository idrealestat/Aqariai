import { useState } from 'react';
import { Phone, PhoneCall, PhoneIncoming, PhoneOff, Users, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface CallCaptureProps {
  onNavigate: (page: string) => void;
}

interface CallRecord {
  id: string;
  phoneNumber: string;
  callType: 'incoming' | 'outgoing' | 'missed';
  notes: string;
  timestamp: Date;
}

export function CallCaptureInterface({ onNavigate }: CallCaptureProps) {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callType, setCallType] = useState<'incoming' | 'outgoing' | 'missed'>('incoming');
  const [notes, setNotes] = useState('');
  const [calls, setCalls] = useState<CallRecord[]>([]);

  const handleSaveCall = () => {
    if (!phoneNumber.trim()) return;
    
    const newCall: CallRecord = {
      id: Date.now().toString(),
      phoneNumber: phoneNumber.trim(),
      callType,
      notes: notes.trim(),
      timestamp: new Date()
    };
    
    setCalls(prev => [newCall, ...prev]);
    
    // إعادة تعيين النموذج
    setPhoneNumber('');
    setCallType('incoming');
    setNotes('');
    setIsCallModalOpen(false);
  };

  const getCallTypeIcon = (type: string) => {
    switch (type) {
      case 'incoming': return <PhoneIncoming className="w-4 h-4" />;
      case 'outgoing': return <PhoneCall className="w-4 h-4" />;
      case 'missed': return <PhoneOff className="w-4 h-4 text-red-500" />;
      default: return <Phone className="w-4 h-4" />;
    }
  };

  const getCallTypeLabel = (type: string) => {
    switch (type) {
      case 'incoming': return 'واردة';
      case 'outgoing': return 'صادرة';
      case 'missed': return 'مفقودة';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7] p-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button 
          onClick={() => onNavigate("dashboard")}
          variant="outline" 
          className="border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-[#01411C]"
        >
          العودة
        </Button>
        <h1 className="text-2xl font-bold text-[#01411C]">واجهة المكالمات</h1>
        <div className="w-20"></div>
      </div>

      {/* الدائرة العائمة الخضراء الكبيرة */}
      <div className="flex flex-col items-center justify-center mb-12">
        <Dialog open={isCallModalOpen} onOpenChange={setIsCallModalOpen}>
          <DialogTrigger asChild>
            <button className="relative w-48 h-48 bg-[#01411C] hover:bg-[#065f41] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#D4AF37] focus:ring-opacity-50">
              <div className="flex flex-col items-center justify-center h-full">
                <Phone className="w-12 h-12 mb-3" />
                <span className="text-lg font-semibold">تسجيل مكالمة</span>
              </div>
              {/* تأثير النبضة */}
              <div className="absolute inset-0 rounded-full border-4 border-[#D4AF37] animate-ping opacity-30"></div>
            </button>
          </DialogTrigger>

          {/* نافذة تسجيل المكالمة */}
          <DialogContent className="sm:max-w-[500px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-[#01411C] text-xl">تسجيل مكالمة جديدة</DialogTitle>
              <DialogDescription className="text-gray-600">
                املأ تفاصيل المكالمة أدناه لحفظها في سجل المكالمات
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* رقم الهاتف */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#01411C] font-medium">
                  رقم الهاتف
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="05xxxxxxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="border-[#D4AF37] focus:ring-[#D4AF37] text-right"
                    dir="ltr"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#01411C] hover:bg-[#f0fdf4]"
                  >
                    <Users className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">يمكنك الإدخال يدوياً أو الاختيار من جهات الاتصال</p>
              </div>

              {/* نوع المكالمة */}
              <div className="space-y-2">
                <Label htmlFor="callType" className="text-[#01411C] font-medium">
                  نوع المكالمة
                </Label>
                <Select value={callType} onValueChange={(value: any) => setCallType(value)}>
                  <SelectTrigger className="border-[#D4AF37] focus:ring-[#D4AF37]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incoming">
                      <div className="flex items-center gap-2">
                        <PhoneIncoming className="w-4 h-4" />
                        <span>واردة</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="outgoing">
                      <div className="flex items-center gap-2">
                        <PhoneCall className="w-4 h-4" />
                        <span>صادرة</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="missed">
                      <div className="flex items-center gap-2">
                        <PhoneOff className="w-4 h-4 text-red-500" />
                        <span>مفقودة</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ملاحظات المكالمة */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-[#01411C] font-medium">
                  ملاحظات المكالمة
                </Label>
                <Textarea
                  id="notes"
                  placeholder="اكتب ملاحظاتك حول المكالمة هنا..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="border-[#D4AF37] focus:ring-[#D4AF37] min-h-[100px] resize-none"
                />
              </div>

              {/* أزرار الحفظ والإلغاء */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveCall}
                  className="flex-1 bg-[#01411C] hover:bg-[#065f41] text-white"
                  disabled={!phoneNumber.trim()}
                >
                  حفظ المكالمة
                </Button>
                <Button
                  onClick={() => setIsCallModalOpen(false)}
                  variant="outline"
                  className="flex-1 border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-[#01411C]"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <p className="text-[#01411C] mt-6 text-center max-w-md">
          اضغط على الدائرة لتسجيل مكالمة جديدة أو إضافة تفاصيل مكالمة سابقة
        </p>
      </div>

      {/* سجل المكالمات */}
      {calls.length > 0 && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-[#01411C] mb-4">سجل المكالمات الأخيرة</h2>
          <div className="space-y-3">
            {calls.slice(0, 5).map((call) => (
              <div
                key={call.id}
                className="bg-white rounded-lg border border-[#D4AF37] p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getCallTypeIcon(call.callType)}
                    <span className="font-medium text-[#01411C]" dir="ltr">
                      {call.phoneNumber}
                    </span>
                  </div>
                  <div className="flex flex-col items-end text-sm text-gray-500">
                    <span>{getCallTypeLabel(call.callType)}</span>
                    <span>{call.timestamp.toLocaleString('ar-SA')}</span>
                  </div>
                </div>
                {call.notes && (
                  <p className="text-gray-700 text-sm bg-[#f0fdf4] p-2 rounded">
                    {call.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
          
          {calls.length > 5 && (
            <div className="text-center mt-4">
              <Button variant="outline" className="border-[#D4AF37] text-[#01411C]">
                عرض جميع المكالمات ({calls.length})
              </Button>
            </div>
          )}
        </div>
      )}

      {/* رسالة عندما لا توجد مكالمات */}
      {calls.length === 0 && (
        <div className="text-center text-gray-500 mt-12">
          <Phone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">لا توجد مكالمات مسجلة بعد</p>
          <p className="text-sm mt-2">ابدأ بتسجيل أول مكالمة من خلال الضغط على الدائرة أعلاه</p>
        </div>
      )}
    </div>
  );
}