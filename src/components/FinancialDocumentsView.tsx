import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Phone, ArrowRight, X, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface FinancialDocument {
  id: string;
  type: 'receipt' | 'quotation';
  customerName: string;
  customerPhone: string;
  items: Array<{ id: string; description: string; amount: number }>;
  subtotal: number;
  vat: number;
  vatAmount: number;
  total: number;
  createdAt: string;
  brokerName: string;
  brokerPhone: string;
  brokerLicense: string;
  brokerCompanyName?: string;
  brokerProfileImage?: string;
  brokerLogoImage?: string;
  brokerCoverImage?: string;
}

interface FinancialDocumentsViewProps {
  type: 'receipts' | 'quotations';
  onBack: () => void;
}

export function FinancialDocumentsView({ type, onBack }: FinancialDocumentsViewProps) {
  const [documents, setDocuments] = useState<FinancialDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<FinancialDocument | null>(null);
  const [isSwapped, setIsSwapped] = useState(false);

  useEffect(() => {
    loadDocuments();

    const handleUpdate = () => {
      loadDocuments();
    };

    window.addEventListener('financial-documents-updated', handleUpdate);
    return () => {
      window.removeEventListener('financial-documents-updated', handleUpdate);
    };
  }, [type]);

  const loadDocuments = () => {
    const storageKey = type === 'quotations' ? 'quotations' : 'receipts';
    const docs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setDocuments(docs);
  };

  const handleDownloadPDF = (doc: FinancialDocument) => {
    // وظيفة التحميل ستتم لاحقاً
    alert('سيتم تحميل PDF قريباً');
  };

  const handleSwapImages = () => {
    setIsSwapped(!isSwapped);
  };

  if (selectedDoc) {
    const profileImage = selectedDoc.brokerProfileImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiBmaWxsPSIjMDE0MTFDIHN0eWxlPSIiLz4KPHBhdGggZD0iTTk2IDk2YzE3LjY3MyAwIDMyLTE0LjMyNyAzMi0zMlM4NC44NDYgMzIgOTYgMzJzMzIgMTQuMzI3IDMyIDMyIiBmaWxsPSIjRDRBRjM3Ii8+Cjwvc3ZnPg==';
    const logoImage = selectedDoc.brokerLogoImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRDRBRjM3Ii8+CjxwYXRoIGQ9Ik0zMiAzMmM1Ljg5MSAwIDEwLjY2Ny00Ljc3NiAxMC42NjctMTAuNjY3UzM3Ljg5MSAxMC42NjcgMzIgMTAuNjY3IDIxLjMzMyAxNS40NDMgMjEuMzMzIDIxLjMzMyAyNi4xMDkgMzIgMzIgMzJ6IiBmaWxsPSIjMDE0MTFDIHN0eWxlPSIiLz4KPC9zdmc+';
    const coverImage = selectedDoc.brokerCoverImage;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#fffef7] p-4" dir="rtl">
        <div className="max-w-4xl mx-auto">
          {/* زر العودة */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedDoc(null)}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              عودة
            </Button>
          </div>

          {/* المستند */}
          <Card className="border-2 border-[#D4AF37] overflow-hidden">
            {/* هيدر بطاقة الأعمال - مطابق تماماً */}
            <div
              className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white p-6 relative bg-cover bg-center"
              style={coverImage ? {
                backgroundImage: `url(${coverImage})`,
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(1, 65, 28, 0.85)'
              } : {}}
            >
              <div className="text-center space-y-2">
                {/* صورة البروفايل */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    {/* الصورة الرئيسية - تتبدل - مكبرة 50% */}
                    <img
                      src={!isSwapped ? profileImage : logoImage}
                      alt={!isSwapped ? "Profile" : "Logo"}
                      className="w-48 h-48 rounded-full border-4 border-[#D4AF37] shadow-lg object-cover cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
                      onClick={handleSwapImages}
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiBmaWxsPSIjMDE0MTFDIHN0eWxlPSIiLz4KPHBhdGggZD0iTTk2IDk2YzE3LjY3MyAwIDMyLTE0LjMyNyAzMi0zMlM4NC44NDYgMzIgOTYgMzJzMzIgMTQuMzI3IDMyIDMyIiBmaWxsPSIjRDRBRjM3Ii8+Cjwvc3ZnPg==';
                      }}
                    />
                    {/* الشعار الصغير - يتبدل */}
                    <div
                      className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full border-4 border-white bg-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
                      onClick={handleSwapImages}
                    >
                      <img
                        src={isSwapped ? profileImage : logoImage}
                        alt={isSwapped ? "Profile" : "Logo"}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRDRBRjM3Ii8+CjxwYXRoIGQ9Ik0zMiAzMmM1Ljg5MSAwIDEwLjY2Ny00Ljc3NiAxMC42NjctMTAuNjY3UzM3Ljg5MSAxMC42NjcgMzIgMTAuNjY3IDIxLjMzMyAxNS40NDMgMjEuMzMzIDIxLjMzMyAyNi4xMDkgMzIgMzIgMzJ6IiBmaWxsPSIjMDE0MTFDIHN0eWxlPSIiLz4KPC9zdmc+';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* الاسم */}
                <h1 className="text-xl font-bold">{selectedDoc.brokerName || 'اسم الوسيط'}</h1>

                {/* اسم الشركة */}
                <p className="text-base">{selectedDoc.brokerCompanyName || 'اسم الشركة'}</p>

                {/* التقييم */}
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                  <span className="mr-2 text-sm">5.0</span>
                </div>

                {/* رخصة FAL */}
                <div className="mt-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <FileText className="w-4 h-4" />
                    <span>رخصة FAL: {selectedDoc.brokerLicense || '123456789'}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs mt-1">
                    <Phone className="w-3 h-3" />
                    <span>{selectedDoc.brokerPhone || '0501234567'}</span>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-8">
              {/* عنوان المستند */}
              <h2 className="text-3xl font-bold text-center mb-8 text-[#01411C]">
                {selectedDoc.type === 'quotation' ? 'عرض سعر' : 'سند قبض'}
              </h2>

              {/* معلومات العميل */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-right" dir="rtl">
                <p className="font-bold">العميل: {selectedDoc.customerName}</p>
                <p className="text-gray-600">الجوال: {selectedDoc.customerPhone}</p>
                <p className="text-gray-500 text-sm">التاريخ: {new Date(selectedDoc.createdAt).toLocaleDateString('ar-SA')}</p>
              </div>

              {/* جدول البنود */}
              <div className="mb-6 overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-right">الوصف</th>
                      <th className="border border-gray-300 p-2 text-right">المبلغ (ريال)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDoc.items.map((item) => (
                      <tr key={item.id}>
                        <td className="border border-gray-300 p-2 text-right">{item.description}</td>
                        <td className="border border-gray-300 p-2 text-right">{item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* الملخص */}
              <div className="mb-6 space-y-2 text-right" dir="rtl">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold">{selectedDoc.subtotal.toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span>ضريبة القيمة المضافة ({selectedDoc.vat}%):</span>
                  <span className="font-bold">{selectedDoc.vatAmount.toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between text-xl border-t pt-2">
                  <span className="font-bold">المجموع الإجمالي:</span>
                  <span className="font-bold text-[#01411C]">{selectedDoc.total.toFixed(2)} ريال</span>
                </div>
              </div>

              {/* الأزرار */}
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={() => handleDownloadPDF(selectedDoc)}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 ml-2" />
                  تحميل PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#fffef7] p-4">
      <div className="max-w-4xl mx-auto">
        {/* الهيدر */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            عودة
          </Button>
          <h1 className="text-2xl font-bold text-[#01411C]">
            {type === 'quotations' ? 'عروض الأسعار' : 'سندات القبض'}
          </h1>
        </div>

        {/* قائمة المستندات */}
        {documents.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                لا توجد {type === 'quotations' ? 'عروض أسعار' : 'سندات قبض'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
                  className="border-2 border-[#D4AF37] hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedDoc(doc)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#01411C] mb-2">
                          {doc.customerName}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <Phone className="w-4 h-4" />
                          <span>{doc.customerPhone}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(doc.createdAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="text-2xl font-bold text-[#01411C]">
                          {doc.total.toFixed(2)} ريال
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadPDF(doc);
                          }}
                          className="mt-2"
                        >
                          <Download className="w-4 h-4 ml-1" />
                          تحميل
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}