// ملف: components/share/QRCodeDisplay.tsx
// عرض QR Code مع خيارات التحميل والمشاركة

'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { QrCode, Download, Share2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface QRCodeDisplayProps {
  qrCodeUrl: string;
  url: string;
  offerTitle: string;
}

export function QRCodeDisplay({ qrCodeUrl, url, offerTitle }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-${offerTitle}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('تم تحميل QR Code');
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('تم نسخ الرابط');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('فشل نسخ الرابط');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${offerTitle}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              img {
                max-width: 400px;
                margin: 20px;
              }
              h2 {
                text-align: center;
                color: #01411C;
              }
              p {
                text-align: center;
                color: #666;
                margin: 10px;
              }
            </style>
          </head>
          <body>
            <h2>${offerTitle}</h2>
            <img src="${qrCodeUrl}" alt="QR Code" />
            <p>امسح QR Code للوصول المباشر</p>
            <p style="font-size: 12px; word-break: break-all;">${url}</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <QrCode className="w-5 h-5 text-[#01411C]" />
        رمز QR للمسح السريع
      </h3>

      {/* QR Code Display */}
      <div className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 rounded-xl">
        {qrCodeUrl ? (
          <div className="space-y-4">
            <div className="p-4 bg-white border-4 border-[#01411C] rounded-lg">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-64 h-64 object-contain"
              />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                امسح الكود للوصول الفوري
              </p>
              <p className="text-xs text-gray-500 mt-1 break-all max-w-xs">
                {url}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-8">
            <QrCode className="w-16 h-16 text-gray-300" />
            <p className="text-gray-500">جاري إنشاء QR Code...</p>
          </div>
        )}
      </div>

      {/* الأزرار */}
      {qrCodeUrl && (
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full"
          >
            <Download className="w-4 h-4 ml-2" />
            تحميل
          </Button>

          <Button
            onClick={handlePrint}
            variant="outline"
            className="w-full"
          >
            <Share2 className="w-4 h-4 ml-2" />
            طباعة
          </Button>

          <Button
            onClick={handleCopyUrl}
            variant="outline"
            className="col-span-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 ml-2" />
                تم النسخ
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 ml-2" />
                نسخ الرابط
              </>
            )}
          </Button>
        </div>
      )}

      {/* معلومات إضافية */}
      <div className="space-y-2">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <span className="font-bold">استخدامات QR Code:</span>
          </p>
          <ul className="text-xs text-blue-700 mt-2 space-y-1 mr-4">
            <li>• طباعة على البروشورات والإعلانات</li>
            <li>• مشاركة في وسائل التواصل الاجتماعي</li>
            <li>• عرض في المعارض والفعاليات</li>
            <li>• إضافة على بطاقات العمل</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
