import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RegistrationData, CRMContact } from "../../types/owners";
import { BirthdayNotifications } from "./BirthdayNotifications";
import { 
  X,
  MessageSquare,
  Phone,
  Star,
  User,
  Search,
  Filter,
  Calendar,
  Tag,
  ExternalLink,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Cake
} from "lucide-react";

interface CRMPanelProps {
  user?: RegistrationData;
  contacts: CRMContact[];
  onClose: () => void;
}

type FilterStatus = 'all' | 'active' | 'completed' | 'blocked';
type SortBy = 'recent' | 'name' | 'rating';

export function CRMPanel({ user, contacts, onClose }: CRMPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [selectedContact, setSelectedContact] = useState<CRMContact | null>(null);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [showBirthdayNotifications, setShowBirthdayNotifications] = useState(false);

  // تصفية وترتيب جهات الاتصال
  const filteredContacts = useCallback(() => {
    let filtered = contacts;

    // تصفية حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(contact => 
        contact.brokerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone?.includes(searchTerm) ||
        contact.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // تصفية حسب الحالة
    if (filterStatus !== 'all') {
      filtered = filtered.filter(contact => contact.status === filterStatus);
    }

    // الترتيب
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.brokerName.localeCompare(b.brokerName, 'ar');
        case 'rating':
          return (b.brokerRating || 0) - (a.brokerRating || 0);
        case 'recent':
        default:
          return new Date(b.lastInteraction || '').getTime() - new Date(a.lastInteraction || '').getTime();
      }
    });

    return filtered;
  }, [contacts, searchTerm, filterStatus, sortBy]);

  // فتح رابط واتساب
  const openWhatsApp = useCallback((phone: string, brokerName: string) => {
    const message = encodeURIComponent(
      `مرحباً ${brokerName}, أود متابعة التواصل بخصوص العروض المتاحة`
    );
    window.open(`https://wa.me/${phone.replace(/^0/, '966')}?text=${message}`, '_blank');
  }, []);

  // تحديث حالة جهة الاتصال
  const updateContactStatus = useCallback(async (contactId: string, newStatus: 'active' | 'completed' | 'blocked') => {
    try {
      // تحديث محلي فوري (optimistic update)
      const contactIndex = contacts.findIndex(c => c.id === contactId);
      if (contactIndex !== -1) {
        const oldStatus = contacts[contactIndex].status;
        contacts[contactIndex].status = newStatus;
        
        try {
          const response = await fetch(`/api/crm/contacts/${contactId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (apiError) {
          // في حالة فشل API، العودة للحالة السابقة
          console.warn('Error processing proposal:', apiError);
          contacts[contactIndex].status = oldStatus;
          // يمكن إضافة toast notification هنا
        }
      }
    } catch (error) {
      console.warn('Error updating contact status:', error);
    }
  }, [contacts]);

  // إضافة ملاحظة
  const addNote = useCallback(async (contactId: string, note: string) => {
    try {
      const response = await fetch(`/api/crm/contacts/${contactId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ note, timestamp: new Date().toISOString() })
      });

      if (response.ok) {
        // تحديث محلي للملاحظات
        const contactIndex = contacts.findIndex(c => c.id === contactId);
        if (contactIndex !== -1) {
          contacts[contactIndex].notes = (contacts[contactIndex].notes || '') + `\n${new Date().toLocaleDateString('ar-SA')}: ${note}`;
        }
      }
    } catch (error) {
      console.warn('Error adding note:', error);
      
      // في حالة فشل API، حفظ محلي فقط
      const contactIndex = contacts.findIndex(c => c.id === contactId);
      if (contactIndex !== -1) {
        const newNote = `${new Date().toLocaleDateString('ar-SA')}: ${note}`;
        const currentNotes = contacts[contactIndex].notes || '';
        contacts[contactIndex].notes = currentNotes ? `${currentNotes}\n${newNote}` : newNote;
      }
    }
  }, [contacts]);

  // الحصول على معلومات الحالة
  const getStatusInfo = (status: string) => {
    const statusConfig = {
      active: { label: 'نشط', color: 'text-green-600 bg-green-100', icon: CheckCircle },
      completed: { label: 'مكتمل', color: 'text-blue-600 bg-blue-100', icon: CheckCircle },
      blocked: { label: 'محظور', color: 'text-red-600 bg-red-100', icon: AlertCircle }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
  };

  const displayedContacts = filteredContacts();

  return (
    <div className="absolute inset-0 bg-white z-30 overflow-y-auto pb-20" dir="rtl">
        
        {/* الرأس */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#01411C] to-[#065f41] rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#01411C]">
                إدارة العلاقات (CRM)
              </h2>
              <p className="text-[#065f41] text-sm">
                إدارة التواصل مع الوسطاء العقاريين
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* أدوات التحكم */}
        <div className="p-4 border-b border-gray-100 space-y-3">
          
          {/* البحث */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في جهات الاتصال..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
            />
          </div>

          {/* التصفية والترتيب */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#065f41]" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="px-3 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="completed">مكتمل</option>
                <option value="blocked">محظور</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[#065f41] text-sm">ترتيب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-3 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
              >
                <option value="recent">الأحدث</option>
                <option value="name">الاسم</option>
                <option value="rating">التقييم</option>
              </select>
            </div>

            {/* زر أعياد الميلاد */}
            <button
              onClick={() => setShowBirthdayNotifications(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-[#D4AF37] to-[#f1c40f] text-[#01411C] rounded-lg hover:from-[#f1c40f] hover:to-[#D4AF37] transition-all shadow-sm"
            >
              <Cake className="w-4 h-4" />
              <span className="text-sm font-medium">أعياد الميلاد</span>
            </button>

            <div className="mr-auto text-sm text-[#065f41]">
              {displayedContacts.length} من {contacts.length} جهة اتصال
            </div>
          </div>
        </div>

        {/* قائمة جهات الاتصال */}
        <div className="flex-1 overflow-hidden">
          {displayedContacts.length === 0 ? (
            /* رسالة عدم وجود جهات اتصال */
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-[#01411C] mb-2">
                  لا توجد جهات اتصال
                </h3>
                <p className="text-[#065f41] mb-4">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'لا توجد نتائج تطابق البحث'
                    : 'ستظهر جهات الاتصال مع الوسطاء هنا بعد التفاعل معهم'
                  }
                </p>
                {(searchTerm || filterStatus !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                    }}
                    className="px-4 py-2 text-[#D4AF37] border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
                  >
                    إعادة تعيين البحث
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* قائمة جهات الاتصال */
            <div className="p-4 space-y-3 overflow-y-auto max-h-full">
              {displayedContacts.map((contact, index) => {
                const statusInfo = getStatusInfo(contact.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedContact(contact);
                      setShowContactDetails(true);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        
                        {/* صورة/أيقونة الوسيط */}
                        <div className="w-12 h-12 bg-[#01411C] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold">
                            {contact.brokerName.charAt(0)}
                          </span>
                        </div>

                        {/* معلومات الوسيط */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-[#01411C] truncate">
                              {contact.brokerName}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3 inline mr-1" />
                              {statusInfo.label}
                            </span>
                          </div>

                          {/* التقييم */}
                          {contact.brokerRating && (
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{contact.brokerRating}</span>
                              <span className="text-gray-500 text-sm">من 5</span>
                            </div>
                          )}

                          {/* العروض المرتبطة */}
                          {contact.offers && contact.offers.length > 0 && (
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4 text-[#D4AF37]" />
                              <span className="text-sm text-[#065f41]">
                                {contact.offers.length} {contact.offers.length === 1 ? 'عرض' : 'عروض'}
                              </span>
                            </div>
                          )}

                          {/* آخر تفاعل */}
                          {contact.lastInteraction && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>
                                آخر تفاعل: {new Date(contact.lastInteraction).toLocaleDateString('ar-SA')}
                              </span>
                            </div>
                          )}

                          {/* التاج */}
                          {contact.tags && contact.tags.length > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              {contact.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 bg-[#f0fdf4] text-[#01411C] text-xs rounded-full border border-[#D4AF37]/30"
                                >
                                  {tag}
                                </span>
                              ))}
                              {contact.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{contact.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* أزرار سريعة */}
                      <div className="flex items-center gap-2">
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-[#01411C] border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
                            title="اتصال"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                        {contact.whatsapp && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openWhatsApp(contact.whatsapp!, contact.brokerName);
                            }}
                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            title="واتساب"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* تفاصيل جهة الاتصال */}
        <AnimatePresence>
          {showContactDetails && selectedContact && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white rounded-2xl flex flex-col"
            >
              
              {/* رأس التفاصيل */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#01411C] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {selectedContact.brokerName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#01411C]">
                      {selectedContact.brokerName}
                    </h3>
                    <div className="flex items-center gap-2">
                      {selectedContact.brokerRating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{selectedContact.brokerRating}</span>
                        </div>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(selectedContact.status).color}`}>
                        {getStatusInfo(selectedContact.status).label}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowContactDetails(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* محتوى التفاصيل */}
              <div className="flex-1 p-6 overflow-y-auto">
                
                {/* معلومات الاتصال */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-semibold text-[#01411C] mb-3">معلومات الاتصال</h4>
                    <div className="space-y-2">
                      {selectedContact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#065f41]" />
                          <a href={`tel:${selectedContact.phone}`} className="text-[#01411C] hover:underline">
                            {selectedContact.phone}
                          </a>
                        </div>
                      )}
                      {selectedContact.email && (
                        <div className="flex items-center gap-2">
                          <span className="text-[#065f41]">📧</span>
                          <a href={`mailto:${selectedContact.email}`} className="text-[#01411C] hover:underline">
                            {selectedContact.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#01411C] mb-3">إجراءات سريعة</h4>
                    <div className="space-y-2">
                      <select
                        value={selectedContact.status}
                        onChange={(e) => updateContactStatus(selectedContact.id, e.target.value as any)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
                      >
                        <option value="active">نشط</option>
                        <option value="completed">مكتمل</option>
                        <option value="blocked">محظور</option>
                      </select>
                      
                      {selectedContact.whatsapp && (
                        <button
                          onClick={() => openWhatsApp(selectedContact.whatsapp!, selectedContact.brokerName)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          فتح واتساب
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* العروض المرتبطة */}
                {selectedContact.offers && selectedContact.offers.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-semibold text-[#01411C] mb-3">العروض المرتبطة</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedContact.offers.map((offerId, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg hover:border-[#D4AF37] cursor-pointer">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-[#01411C] font-medium">عرض #{offerId}</span>
                            <ExternalLink className="w-4 h-4 text-gray-400 mr-auto" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* الملاحظات */}
                <div>
                  <h4 className="font-semibold text-[#01411C] mb-3">الملاحظات</h4>
                  <div className="space-y-3">
                    {selectedContact.notes ? (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-[#065f41] text-sm whitespace-pre-wrap">
                          {selectedContact.notes}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">لا توجد ملاحظات</p>
                    )}
                    
                    {/* إضافة ملاحظة جديدة */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="إضافة ملاحظة..."
                        className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            addNote(selectedContact.id, e.currentTarget.value.trim());
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          if (input.value.trim()) {
                            addNote(selectedContact.id, input.value.trim());
                            input.value = '';
                          }
                        }}
                        className="px-4 py-2 bg-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#f1c40f] transition-colors"
                      >
                        إضافة
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Birthday Notifications Modal */}
      <AnimatePresence>
        {showBirthdayNotifications && (
          <BirthdayNotifications
            contacts={contacts}
            onClose={() => setShowBirthdayNotifications(false)}
            onContactClick={(contact) => {
              setSelectedContact(contact);
              setShowContactDetails(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}