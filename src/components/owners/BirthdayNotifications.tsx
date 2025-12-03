import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CRMContact } from "../../types/owners";
import { Cake, X, Phone, MessageSquare } from "lucide-react";

interface BirthdayNotificationsProps {
  contacts: CRMContact[];
  onClose: () => void;
  onContactClick: (contact: CRMContact) => void;
}

interface BirthdayAlert {
  contact: CRMContact;
  daysUntil: number;
  isToday: boolean;
  isTomorrow: boolean;
  isThisWeek: boolean;
  age?: number;
}

export function BirthdayNotifications({
  contacts,
  onClose,
  onContactClick
}: BirthdayNotificationsProps) {
  
  // حساب أعياد الميلاد القادمة
  const birthdayAlerts = useMemo<BirthdayAlert[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const alerts: BirthdayAlert[] = [];
    
    contacts.forEach(contact => {
      if (!contact.birthDate) return;
      
      const birthDate = new Date(contact.birthDate);
      const thisYear = today.getFullYear();
      
      // تاريخ عيد الميلاد هذا العام
      const birthdayThisYear = new Date(thisYear, birthDate.getMonth(), birthDate.getDate());
      birthdayThisYear.setHours(0, 0, 0, 0);
      
      // إذا فات عيد الميلاد هذا العام، احسب للعام القادم
      let nextBirthday = birthdayThisYear;
      if (birthdayThisYear < today) {
        nextBirthday = new Date(thisYear + 1, birthDate.getMonth(), birthDate.getDate());
      }
      
      // حساب عدد الأيام
      const diffTime = nextBirthday.getTime() - today.getTime();
      const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // إظهار أعياد الميلاد القادمة خلال 30 يوم
      if (daysUntil >= 0 && daysUntil <= 30) {
        const age = nextBirthday.getFullYear() - birthDate.getFullYear();
        
        alerts.push({
          contact,
          daysUntil,
          isToday: daysUntil === 0,
          isTomorrow: daysUntil === 1,
          isThisWeek: daysUntil <= 7,
          age
        });
      }
    });
    
    // ترتيب حسب الأقرب للحاضر
    return alerts.sort((a, b) => a.daysUntil - b.daysUntil);
  }, [contacts]);
  
  // فتح رابط واتساب
  const openWhatsApp = (phone: string, name: string, isToday: boolean) => {
    const message = isToday 
      ? encodeURIComponent(`🎂 كل عام وأنت بخير يا ${name}! نتمنى لك عاماً مليئاً بالسعادة والنجاح 🎉`)
      : encodeURIComponent(`مرحباً ${name}, نود أن نذكرك بأننا نحتفل بعيد ميلادك قريباً 🎂`);
    window.open(`https://wa.me/${phone.replace(/^0/, '966')}?text=${message}`, '_blank');
  };
  
  // فتح رابط الاتصال
  const makeCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };
  
  // الحصول على رسالة العرض
  const getAlertMessage = (alert: BirthdayAlert) => {
    if (alert.isToday) {
      return `🎉 عيد ميلاد اليوم!`;
    } else if (alert.isTomorrow) {
      return `غداً`;
    } else if (alert.isThisWeek) {
      return `خلال ${alert.daysUntil} أيام`;
    } else {
      return `بعد ${alert.daysUntil} يوم`;
    }
  };
  
  // الحصول على لون البطاقة
  const getCardColor = (alert: BirthdayAlert) => {
    if (alert.isToday) {
      return 'from-[#D4AF37] to-[#f1c40f]';
    } else if (alert.isTomorrow) {
      return 'from-[#01411C] to-[#065f41]';
    } else if (alert.isThisWeek) {
      return 'from-[#065f41] to-[#01411C]';
    } else {
      return 'from-[#f0fdf4] to-white';
    }
  };
  
  // الحصول على لون النص
  const getTextColor = (alert: BirthdayAlert) => {
    if (alert.isToday || alert.isTomorrow || alert.isThisWeek) {
      return 'text-white';
    } else {
      return 'text-[#01411C]';
    }
  };
  
  if (birthdayAlerts.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
      >
        {/* الهيدر */}
        <div className="bg-gradient-to-br from-[#01411C] to-[#065f41] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Cake className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">تنبيهات أعياد الميلاد</h2>
                <p className="text-white/80 text-sm mt-1">
                  {birthdayAlerts.length} عميل لديه عيد ميلاد قريباً
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* قائمة التنبيهات */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="space-y-4">
            {birthdayAlerts.map((alert, index) => (
              <motion.div
                key={alert.contact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-gradient-to-br ${getCardColor(alert)} rounded-xl p-4 shadow-lg ${
                  alert.isToday || alert.isTomorrow || alert.isThisWeek ? 'border-2 border-white' : 'border border-[#D4AF37]/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {/* أيقونة الكعكة */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      alert.isToday || alert.isTomorrow || alert.isThisWeek 
                        ? 'bg-white/20' 
                        : 'bg-[#D4AF37]/20'
                    }`}>
                      <Cake className={`w-6 h-6 ${getTextColor(alert)}`} />
                    </div>
                    
                    {/* معلومات العميل */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold ${getTextColor(alert)}`}>
                          {alert.contact.brokerName}
                        </h3>
                        {alert.contact.brokerRating && (
                          <div className={`flex items-center gap-1 ${
                            alert.isToday || alert.isTomorrow || alert.isThisWeek 
                              ? 'text-white/80' 
                              : 'text-[#D4AF37]'
                          }`}>
                            <span className="text-sm">⭐</span>
                            <span className="text-sm">{alert.contact.brokerRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className={`text-sm mb-2 ${
                        alert.isToday || alert.isTomorrow || alert.isThisWeek 
                          ? 'text-white/90' 
                          : 'text-[#065f41]'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{getAlertMessage(alert)}</span>
                          {alert.age && (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              alert.isToday || alert.isTomorrow || alert.isThisWeek 
                                ? 'bg-white/20' 
                                : 'bg-[#D4AF37]/20'
                            }`}>
                              {alert.age} سنة
                            </span>
                          )}
                        </div>
                        {alert.contact.phone && (
                          <div className="mt-1">{alert.contact.phone}</div>
                        )}
                      </div>
                      
                      {/* أزرار التواصل */}
                      <div className="flex items-center gap-2">
                        {alert.contact.whatsapp && (
                          <button
                            onClick={() => openWhatsApp(alert.contact.whatsapp!, alert.contact.brokerName, alert.isToday)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              alert.isToday || alert.isTomorrow || alert.isThisWeek
                                ? 'bg-white/20 hover:bg-white/30 text-white'
                                : 'bg-[#01411C] hover:bg-[#065f41] text-white'
                            }`}
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>واتساب</span>
                          </button>
                        )}
                        {alert.contact.phone && (
                          <button
                            onClick={() => makeCall(alert.contact.phone!)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              alert.isToday || alert.isTomorrow || alert.isThisWeek
                                ? 'bg-white/20 hover:bg-white/30 text-white'
                                : 'bg-[#D4AF37] hover:bg-[#f1c40f] text-[#01411C]'
                            }`}
                          >
                            <Phone className="w-4 h-4" />
                            <span>اتصال</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onContactClick(alert.contact);
                            onClose();
                          }}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            alert.isToday || alert.isTomorrow || alert.isThisWeek
                              ? 'bg-white/20 hover:bg-white/30 text-white'
                              : 'bg-[#f0fdf4] hover:bg-[#065f41]/10 text-[#01411C]'
                          }`}
                        >
                          <span>عرض التفاصيل</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
