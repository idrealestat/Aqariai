// ملف: components/share/ContactsManager.tsx
// إدارة جهات الاتصال وسجل المشاركة

'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Users, UserPlus, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ContactsManagerProps {
  offerId: string;
  shareUrl: string;
  onBulkShare: () => void;
}

export function ContactsManager({
  offerId,
  shareUrl,
  onBulkShare,
}: ContactsManagerProps) {
  const handleImportContacts = () => {
    toast.info('ميزة استيراد جهات الاتصال قيد التطوير');
  };

  const handleAddContact = () => {
    toast.info('ميزة إضافة جهة اتصال قيد التطوير');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Users className="w-5 h-5 text-[#01411C]" />
          إدارة جهات الاتصال
        </h3>
      </div>

      {/* أزرار الإجراءات */}
      <div className="grid grid-cols-1 gap-3">
        <Button
          onClick={onBulkShare}
          className="w-full bg-[#01411C] hover:bg-[#01411C]/90"
          size="lg"
        >
          <Users className="w-5 h-5 ml-2" />
          مشاركة جماعية
        </Button>

        <Button
          onClick={handleAddContact}
          variant="outline"
          className="w-full"
        >
          <UserPlus className="w-5 h-5 ml-2" />
          إضافة جهة اتصال
        </Button>

        <Button
          onClick={handleImportContacts}
          variant="outline"
          className="w-full"
        >
          <Upload className="w-5 h-5 ml-2" />
          استيراد جهات الاتصال
        </Button>
      </div>

      {/* معلومات */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <span className="font-bold">نصيحة:</span> يمكنك إدارة جهات الاتصال
          ومشاركة العروض معهم بشكل جماعي، مع تتبع حالة كل مشاركة
        </p>
      </div>
    </div>
  );
}
