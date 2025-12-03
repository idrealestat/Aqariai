// ملف: components/share/PDFGenerator.tsx
// مولد PDF للكتالوج

'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { FileText, Download, Share2, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PDFGeneratorProps {
  offer: {
    id: string;
    title: string;
    description: string;
    price: number;
    sku: string;
    images: string[];
  };
  sellerInfo: {
    name: string;
    phone: string;
    email: string;
    logo?: string;
  };
  qrCodeUrl?: string;
  onGenerate?: () => void;
  pdfUrl?: string;
}

export function PDFGenerator({
  offer,
  sellerInfo,
  qrCodeUrl,
  onGenerate,
  pdfUrl,
}: PDFGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [localPdfUrl, setLocalPdfUrl] = useState(pdfUrl || '');

  const handleGeneratePDF = async () => {
    setGenerating(true);
    
    try {
      toast.info('جاري إنشاء كتالوج PDF...');

      const response = await fetch('/api/share/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offer,
          sellerInfo,
          qrCode: qrCodeUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLocalPdfUrl(data.pdfUrl);
        toast.success('تم إنشاء PDF بنجاح!');
        
        if (onGenerate) {
          onGenerate();
        }
      } else {
        toast.error('فشل في إنشاء PDF');
      }
    } catch (error) {
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (localPdfUrl) {
      window.open(localPdfUrl, '_blank');
      toast.success('تم فتح PDF');
    }
  };

  const handleShareWhatsApp = () => {
    if (localPdfUrl) {
      const message = encodeURIComponent(
        `كتالوج ${offer.title}\n\n${localPdfUrl}`
      );
      window.open(`https://wa.me/?text=${message}`, '_blank');
      toast.success('تم فتح واتساب');
    }
  };

  const handleShareEmail = () => {
    if (localPdfUrl) {
      const subject = encodeURIComponent(`كتالوج ${offer.title}`);
      const body = encodeURIComponent(
        `مرحباً،\n\nإليك كتالوج ${offer.title}\n\nيمكنك تحميله من:\n${localPdfUrl}\n\nمع تحياتي،\n${sellerInfo.name}`
      );
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      toast.success('تم فتح البريد الإلكتروني');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#01411C]" />
          كتالوج PDF
        </h3>
        {localPdfUrl && (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            جاهز
          </Badge>
        )}
      </div>

      {/* معاينة محتوى PDF */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{offer.title}</h4>
              <p className="text-sm text-gray-600">كتالوج احترافي - جاهز للطباعة</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>{offer.images.length} صورة</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>التفاصيل الكاملة</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>معلومات التواصل</span>
            </div>
            {qrCodeUrl && (
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span>QR Code</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* الأزرار */}
      <div className="grid grid-cols-1 gap-3">
        {!localPdfUrl ? (
          <Button
            onClick={handleGeneratePDF}
            disabled={generating}
            className="w-full bg-[#01411C] hover:bg-[#01411C]/90"
            size="lg"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                جاري الإنشاء...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 ml-2" />
                إنشاء كتالوج PDF
              </>
            )}
          </Button>
        ) : (
          <>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Download className="w-5 h-5 ml-2" />
              تحميل PDF
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleShareWhatsApp}
                className="bg-green-500 hover:bg-green-600"
              >
                <Share2 className="w-4 h-4 ml-2" />
                واتساب
              </Button>

              <Button
                onClick={handleShareEmail}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Share2 className="w-4 h-4 ml-2" />
                بريد
              </Button>
            </div>

            <Button
              onClick={() => window.open(localPdfUrl, '_blank')}
              variant="secondary"
              className="w-full"
            >
              <Eye className="w-4 h-4 ml-2" />
              معاينة PDF
            </Button>
          </>
        )}
      </div>

      {/* ملاحظة */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <span className="font-bold">نصيحة:</span> الكتالوج يتضمن جميع الصور والتفاصيل
          ومعلومات التواصل و QR Code للمسح السريع
        </p>
      </div>
    </div>
  );
}
