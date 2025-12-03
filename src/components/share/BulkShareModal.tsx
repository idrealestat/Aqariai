// ملف: components/share/BulkShareModal.tsx
// مشاركة جماعية لعدة جهات اتصال

'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Users, Send, Search, X, Upload, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  lastContact?: Date;
}

interface BulkShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerId: string;
  shareUrl: string;
}

export function BulkShareModal({
  isOpen,
  onClose,
  offerId,
  shareUrl,
}: BulkShareModalProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchContacts();
    }
  }, [isOpen]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      // في الإنتاج، استدعاء API لجلب جهات الاتصال
      // هنا نستخدم بيانات تجريبية
      const mockContacts: Contact[] = [
        { id: '1', name: 'أحمد محمد', phone: '+966501234567', email: 'ahmed@example.com' },
        { id: '2', name: 'فاطمة علي', phone: '+966509876543', email: 'fatima@example.com' },
        { id: '3', name: 'خالد عبدالله', phone: '+966507654321' },
        { id: '4', name: 'نورة سعيد', phone: '+966502345678', email: 'nora@example.com' },
        { id: '5', name: 'عمر حسن', phone: '+966508765432' },
      ];
      setContacts(mockContacts);
    } catch (error) {
      toast.error('فشل في تحميل جهات الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const toggleContact = (contactId: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedContacts(newSelected);
  };

  const selectAll = () => {
    if (selectedContacts.size === filteredContacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(filteredContacts.map(c => c.id)));
    }
  };

  const handleBulkSend = async () => {
    if (selectedContacts.size === 0) {
      toast.error('يرجى اختيار جهة اتصال واحدة على الأقل');
      return;
    }

    setSending(true);

    try {
      const response = await fetch('/api/share/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId,
          shareUrl,
          contactIds: Array.from(selectedContacts),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`تم الإرسال إلى ${selectedContacts.size} جهة اتصال بنجاح!`);
        onClose();
      } else {
        toast.error('فشل في إرسال بعض الرسائل');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الإرسال');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Users className="w-6 h-6 text-[#01411C]" />
            مشاركة جماعية
            {selectedContacts.size > 0 && (
              <Badge variant="secondary" className="mr-2">
                {selectedContacts.size} محدد
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* شريط البحث */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن اسم أو رقم..."
                className="pr-10"
              />
            </div>
            <Button variant="outline" onClick={selectAll}>
              {selectedContacts.size === filteredContacts.length ? 'إلغاء الكل' : 'تحديد الكل'}
            </Button>
          </div>

          {/* قائمة جهات الاتصال */}
          <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                جاري التحميل...
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                لا توجد جهات اتصال
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleContact(contact.id)}
                >
                  <Checkbox
                    checked={selectedContacts.has(contact.id)}
                    onCheckedChange={() => toggleContact(contact.id)}
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{contact.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                      {contact.email && (
                        <p className="text-sm text-gray-500">{contact.email}</p>
                      )}
                    </div>
                  </div>

                  {selectedContacts.has(contact.id) && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* معلومات الإرسال */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              📱 <span className="font-bold">طريقة الإرسال:</span> سيتم إرسال رسالة واتساب
              تحتوي على رابط العرض إلى كل جهة اتصال محددة
            </p>
          </div>

          {/* إحصائيات */}
          {selectedContacts.size > 0 && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-[#01411C]">{selectedContacts.size}</p>
                <p className="text-xs text-gray-600 mt-1">جهة محددة</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{contacts.length}</p>
                <p className="text-xs text-gray-600 mt-1">إجمالي الجهات</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((selectedContacts.size / contacts.length) * 100)}%
                </p>
                <p className="text-xs text-gray-600 mt-1">نسبة التحديد</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            onClick={handleBulkSend}
            disabled={sending || selectedContacts.size === 0}
            className="bg-[#01411C] hover:bg-[#01411C]/90"
          >
            {sending ? (
              'جاري الإرسال...'
            ) : (
              <>
                <Send className="w-4 h-4 ml-2" />
                إرسال ({selectedContacts.size})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
