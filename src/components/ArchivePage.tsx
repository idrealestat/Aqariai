import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, Search, Archive, RotateCcw, Trash2, X,
  User, Phone, Mail, Calendar, Tag, AlertTriangle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

// ============================================================
// 📊 TYPES
// ============================================================

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  position?: string;
  image?: string;
  type: string;
  interestLevel: string;
  tags: string[];
  assignedTo?: string;
  createdAt: Date;
  archivedAt?: Date;
}

interface ArchivePageProps {
  archivedCustomers: Customer[];
  onRestore: (customerId: string) => void;
  onPermanentDelete: (customerId: string) => void;
  onBack: () => void;
}

// ============================================================
// 🎨 CUSTOMER TYPE COLORS
// ============================================================

const CUSTOMER_TYPE_COLORS: Record<string, { bg: string; label: string; color: string }> = {
  buyer: { bg: 'bg-blue-100', label: 'مشتري', color: '#1E90FF' },
  seller: { bg: 'bg-green-100', label: 'بائع', color: '#32CD32' },
  lessor: { bg: 'bg-orange-100', label: 'مؤجر', color: '#FF8C00' },
  tenant: { bg: 'bg-yellow-100', label: 'مستأجر', color: '#FFD700' },
  prospect: { bg: 'bg-purple-100', label: 'محتمل', color: '#9370DB' },
  other: { bg: 'bg-gray-100', label: 'آخر', color: '#A9A9A9' },
};

// ============================================================
// 🗑️ MAIN ARCHIVE PAGE COMPONENT
// ============================================================

export default function ArchivePage({
  archivedCustomers,
  onRestore,
  onPermanentDelete,
  onBack
}: ArchivePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // تصفية العملاء المؤرشفين
  const filteredCustomers = archivedCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.tags.some(tag => tag.includes(searchQuery))
  );

  const handlePermanentDelete = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedCustomerId) {
      onPermanentDelete(selectedCustomerId);
      setShowDeleteConfirm(false);
      setSelectedCustomerId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#01411C] via-[#065f41] to-[#01411C] backdrop-blur-md border-b-2 border-[#D4AF37] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* زر العودة */}
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-[#D4AF37] hover:bg-white/10"
            >
              <ArrowRight className="w-5 h-5" />
              <span>العودة</span>
            </Button>

            {/* العنوان */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-[#D4AF37]">
                <Archive className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">الأرشيف</h1>
                <p className="text-sm text-white/80">{archivedCustomers.length} عميل مؤرشف</p>
              </div>
            </div>

            {/* مساحة فارغة للتوازن */}
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* شريط البحث */}
      <div className="bg-white border-b-2 border-[#D4AF37] shadow-md sticky top-[88px] z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="ابحث في الأرشيف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 border-2 border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="container mx-auto px-4 py-6">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Archive className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {archivedCustomers.length === 0 ? 'الأرشيف فارغ' : 'لا توجد نتائج'}
            </h3>
            <p className="text-gray-500">
              {archivedCustomers.length === 0
                ? 'لم يتم أرشفة أي عملاء بعد'
                : 'جرب البحث بكلمات مختلفة'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredCustomers.map((customer) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-2 border-gray-200 hover:border-[#D4AF37] transition-all">
                    <CardContent className="p-4">
                      {/* الصف الأول: الصورة + المعلومات */}
                      <div className="flex items-start gap-3 mb-3">
                        {/* الصورة */}
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white shrink-0">
                          {customer.image ? (
                            <img
                              src={customer.image}
                              alt={customer.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6" />
                          )}
                        </div>

                        {/* المعلومات */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 truncate">{customer.name}</h3>
                          <p className="text-xs text-gray-600 truncate">
                            {customer.position || 'لا توجد وظيفة'}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Phone className="w-3 h-3" />
                            <span className="truncate">{customer.phone}</span>
                          </div>
                        </div>

                        {/* نوع العميل */}
                        <div
                          className={`px-2 py-1 rounded text-xs ${
                            CUSTOMER_TYPE_COLORS[customer.type]?.bg || 'bg-gray-100'
                          }`}
                        >
                          {CUSTOMER_TYPE_COLORS[customer.type]?.label || 'آخر'}
                        </div>
                      </div>

                      {/* العلامات */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {customer.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {customer.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{customer.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* تاريخ الأرشفة */}
                      {customer.archivedAt && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 bg-gray-50 px-2 py-1 rounded">
                          <Calendar className="w-3 h-3" />
                          <span>تم الأرشفة: {customer.archivedAt.toLocaleDateString('ar-SA')}</span>
                        </div>
                      )}

                      {/* الأزرار */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => onRestore(customer.id)}
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                        >
                          <RotateCcw className="w-4 h-4 ml-1" />
                          استعادة
                        </Button>
                        <Button
                          onClick={() => handlePermanentDelete(customer.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 ml-1" />
                          حذف نهائي
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal تأكيد الحذف النهائي */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">تأكيد الحذف النهائي</h3>
                <p className="text-sm text-gray-600">هل أنت متأكد؟</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-700">
                ⚠️ <strong>تحذير:</strong> سيتم حذف العميل نهائياً ولن يمكن استعادته مرة أخرى.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="w-full"
              >
                إلغاء
              </Button>
              <Button
                onClick={confirmDelete}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 ml-2" />
                حذف نهائي
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
