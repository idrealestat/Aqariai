// ملف: components/share/EnhancedShareModal.tsx
// Modal مشاركة محسّن مع جميع الميزات

'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Share2,
  Check,
  MessageCircle,
  Mail,
  FileText,
  QrCode,
  Users,
  Settings,
  Calendar,
  BarChart3,
  Download,
  Image as ImageIcon,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';

// Sub-components
import { WatermarkSettings } from './WatermarkSettings';
import { PDFGenerator } from './PDFGenerator';
import { QRCodeDisplay } from './QRCodeDisplay';
import { BulkShareModal } from './BulkShareModal';
import { ShareAnalytics } from './ShareAnalytics';
import { ContactsManager } from './ContactsManager';
import { ScheduleShare } from './ScheduleShare';
import { TouchToCopy } from './TouchToCopy';

interface EnhancedShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: {
    id: string;
    title: string;
    description: string;
    price: number;
    sku: string;
    images: string[];
    video?: string;
  };
  sellerInfo: {
    name: string;
    phone: string;
    email: string;
    logo?: string;
  };
}

export function EnhancedShareModal({
  isOpen,
  onClose,
  offer,
  sellerInfo,
}: EnhancedShareModalProps) {
  const [activeTab, setActiveTab] = useState('quick');
  const [shareUrl, setShareUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [shareCount, setShareCount] = useState(0);

  // State للميزات المختلفة
  const [showWatermarkSettings, setShowWatermarkSettings] = useState(false);
  const [showBulkShare, setShowBulkShare] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    if (isOpen) {
      initializeShare();
    }
  }, [isOpen]);

  const initializeShare = async () => {
    // إنشاء رابط المشاركة
    const url = `${window.location.origin}/offers/${offer.id}`;
    setShareUrl(url);

    // طلب QR Code من Backend
    try {
      const response = await fetch('/api/share/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, offerId: offer.id }),
      });
      const data = await response.json();
      setQrCodeUrl(data.qrCodeUrl);
    } catch (error) {
      console.error('QR generation failed:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('تم نسخ الرابط!');
      trackShare('DIRECT_LINK');
    } catch (error) {
      toast.error('فشل نسخ الرابط');
    }
  };

  const trackShare = async (platform: string) => {
    try {
      await fetch('/api/share/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: offer.id,
          platform,
          shareUrl,
        }),
      });
      setShareCount((prev) => prev + 1);
    } catch (error) {
      console.error('Share tracking failed:', error);
    }
  };

  const handleWhatsAppShare = async (withSettings: boolean = false) => {
    if (withSettings) {
      setShowWatermarkSettings(true);
    } else {
      const text = `
${offer.title}

${offer.description}

💰 ${offer.price.toLocaleString()} ريال

🔗 ${shareUrl}
      `.trim();

      window.open(
        `https://wa.me/?text=${encodeURIComponent(text)}`,
        '_blank'
      );
      trackShare('WHATSAPP');
    }
  };

  const handleGeneratePDF = async () => {
    try {
      toast.info('جاري إنشاء PDF...');

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
      setPdfUrl(data.pdfUrl);
      toast.success('تم إنشاء PDF بنجاح!');
      
      // فتح PDF
      window.open(data.pdfUrl, '_blank');
      trackShare('PDF');
    } catch (error) {
      toast.error('فشل إنشاء PDF');
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(offer.title);
    const body = encodeURIComponent(`
شاهد هذا العرض الرائع:

${offer.title}
${offer.description}

السعر: ${offer.price.toLocaleString()} ريال

للمزيد:
${shareUrl}
    `);

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    trackShare('EMAIL');
  };

  const handleSMSShare = () => {
    const message = encodeURIComponent(`${offer.title}\n${shareUrl}`);
    window.location.href = `sms:?body=${message}`;
    trackShare('SMS');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Share2 className="w-6 h-6 text-[#01411C]" />
            مشاركة العرض
            {shareCount > 0 && (
              <Badge variant="secondary" className="mr-auto">
                {shareCount} مشاركة
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="quick">
              <Share2 className="w-4 h-4 ml-2" />
              سريع
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Settings className="w-4 h-4 ml-2" />
              متقدم
            </TabsTrigger>
            <TabsTrigger value="bulk">
              <Users className="w-4 h-4 ml-2" />
              جماعي
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Calendar className="w-4 h-4 ml-2" />
              جدولة
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 ml-2" />
              إحصائيات
            </TabsTrigger>
          </TabsList>

          {/* 1️⃣ المشاركة السريعة */}
          <TabsContent value="quick" className="space-y-6 mt-6">
            {/* Touch to Copy Link */}
            <TouchToCopy url={shareUrl} onCopy={handleCopyLink} />

            {/* أزرار المشاركة السريعة */}
            <div className="grid grid-cols-4 gap-4">
              {/* WhatsApp */}
              <Button
                onClick={() => handleWhatsAppShare(false)}
                className="flex flex-col items-center gap-2 h-auto py-4 bg-green-500 hover:bg-green-600"
              >
                <MessageCircle className="w-6 h-6" />
                واتساب
              </Button>

              {/* WhatsApp مع إعدادات */}
              <Button
                onClick={() => handleWhatsAppShare(true)}
                className="flex flex-col items-center gap-2 h-auto py-4 bg-green-600 hover:bg-green-700"
              >
                <Settings className="w-6 h-6" />
                واتساب +
              </Button>

              {/* Email */}
              <Button
                onClick={handleEmailShare}
                className="flex flex-col items-center gap-2 h-auto py-4 bg-blue-500 hover:bg-blue-600"
              >
                <Mail className="w-6 h-6" />
                بريد
              </Button>

              {/* SMS */}
              <Button
                onClick={handleSMSShare}
                className="flex flex-col items-center gap-2 h-auto py-4 bg-purple-500 hover:bg-purple-600"
              >
                <MessageCircle className="w-6 h-6" />
                رسالة
              </Button>

              {/* PDF */}
              <Button
                onClick={handleGeneratePDF}
                className="flex flex-col items-center gap-2 h-auto py-4 bg-red-500 hover:bg-red-600"
              >
                <FileText className="w-6 h-6" />
                PDF
              </Button>

              {/* QR Code */}
              <Button
                onClick={() => setActiveTab('advanced')}
                className="flex flex-col items-center gap-2 h-auto py-4 bg-gray-700 hover:bg-gray-800"
              >
                <QrCode className="w-6 h-6" />
                QR Code
              </Button>

              {/* صور */}
              <Button
                onClick={() => setShowWatermarkSettings(true)}
                className="flex flex-col items-center gap-2 h-auto py-4 bg-orange-500 hover:bg-orange-600"
              >
                <ImageIcon className="w-6 h-6" />
                صور
              </Button>

              {/* تحميل PDF */}
              {pdfUrl && (
                <Button
                  onClick={() => window.open(pdfUrl, '_blank')}
                  className="flex flex-col items-center gap-2 h-auto py-4 bg-teal-500 hover:bg-teal-600"
                >
                  <Download className="w-6 h-6" />
                  تحميل PDF
                </Button>
              )}
            </div>
          </TabsContent>

          {/* 2️⃣ المشاركة المتقدمة */}
          <TabsContent value="advanced" className="space-y-6 mt-6">
            {/* QR Code Display */}
            <QRCodeDisplay
              qrCodeUrl={qrCodeUrl}
              url={shareUrl}
              offerTitle={offer.title}
            />

            {/* Watermark Settings */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">إعدادات العلامة المائية</h3>
              <Button
                onClick={() => setShowWatermarkSettings(true)}
                variant="outline"
                className="w-full"
              >
                <Settings className="w-4 h-4 ml-2" />
                تخصيص العلامة المائية
              </Button>
            </div>

            {/* PDF Generator */}
            <PDFGenerator
              offer={offer}
              sellerInfo={sellerInfo}
              qrCodeUrl={qrCodeUrl}
              onGenerate={handleGeneratePDF}
              pdfUrl={pdfUrl}
            />
          </TabsContent>

          {/* 3️⃣ المشاركة الجماعية */}
          <TabsContent value="bulk" className="space-y-6 mt-6">
            <ContactsManager
              offerId={offer.id}
              shareUrl={shareUrl}
              onBulkShare={() => setShowBulkShare(true)}
            />
          </TabsContent>

          {/* 4️⃣ الجدولة */}
          <TabsContent value="schedule" className="space-y-6 mt-6">
            <ScheduleShare
              offerId={offer.id}
              shareUrl={shareUrl}
              onSchedule={() => toast.success('تم جدولة المشاركة')}
            />
          </TabsContent>

          {/* 5️⃣ الإحصائيات */}
          <TabsContent value="analytics" className="space-y-6 mt-6">
            <ShareAnalytics offerId={offer.id} />
          </TabsContent>
        </Tabs>

        {/* Modals */}
        {showWatermarkSettings && (
          <WatermarkSettings
            isOpen={showWatermarkSettings}
            onClose={() => setShowWatermarkSettings(false)}
            offer={offer}
            sellerInfo={sellerInfo}
          />
        )}

        {showBulkShare && (
          <BulkShareModal
            isOpen={showBulkShare}
            onClose={() => setShowBulkShare(false)}
            offerId={offer.id}
            shareUrl={shareUrl}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
