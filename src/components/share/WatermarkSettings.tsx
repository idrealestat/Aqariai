// ملف: components/share/WatermarkSettings.tsx
// إعدادات العلامة المائية مع معاينة مباشرة

'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { toast } from 'sonner@2.0.3';
import { Settings, Image as ImageIcon, Type, DollarSign, Hash, User, Upload } from 'lucide-react';

interface WatermarkSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  offer: {
    title: string;
    price: number;
    sku: string;
    images: string[];
  };
  sellerInfo: {
    name: string;
    logo?: string;
  };
  onConfirm?: (settings: WatermarkConfig) => void;
}

interface WatermarkConfig {
  showTitle: boolean;
  showPrice: boolean;
  showSKU: boolean;
  showSellerName: boolean;
  addLogo: boolean;
  logoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  customText: string;
  textColor: string;
  backgroundColor: string;
  opacity: number;
}

export function WatermarkSettings({
  isOpen,
  onClose,
  offer,
  sellerInfo,
  onConfirm,
}: WatermarkSettingsProps) {
  const [config, setConfig] = useState<WatermarkConfig>({
    showTitle: true,
    showPrice: true,
    showSKU: true,
    showSellerName: true,
    addLogo: true,
    logoPosition: 'bottom-right',
    customText: '',
    textColor: '#FFFFFF',
    backgroundColor: '#000000',
    opacity: 0.7,
  });

  const [previewImage, setPreviewImage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && offer.images.length > 0) {
      generatePreview();
    }
  }, [isOpen, config]);

  const generatePreview = async () => {
    // في الإنتاج، سيتم استدعاء API لإنشاء معاينة حقيقية
    // هنا نستخدم الصورة الأصلية كمعاينة
    setPreviewImage(offer.images[0]);
  };

  const handleApplyWatermark = async () => {
    setLoading(true);
    
    try {
      // استدعاء API لإضافة العلامة المائية
      const response = await fetch('/api/share/watermark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: offer.images,
          config,
          offerData: {
            title: offer.title,
            price: offer.price,
            sku: offer.sku,
            sellerName: sellerInfo.name,
            logo: sellerInfo.logo,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('تم إضافة العلامة المائية بنجاح!');
        
        if (onConfirm) {
          onConfirm(config);
        }
        
        onClose();
      } else {
        toast.error('فشل في إضافة العلامة المائية');
      }
    } catch (error) {
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Settings className="w-6 h-6 text-[#01411C]" />
            إعدادات العلامة المائية
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* الإعدادات */}
          <div className="space-y-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">المحتوى</TabsTrigger>
                <TabsTrigger value="style">التنسيق</TabsTrigger>
                <TabsTrigger value="position">الموضع</TabsTrigger>
              </TabsList>

              {/* تبويب المحتوى */}
              <TabsContent value="content" className="space-y-4 mt-4">
                {/* عرض العنوان */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Type className="w-5 h-5 text-[#01411C]" />
                    <Label>عرض العنوان</Label>
                  </div>
                  <Switch
                    checked={config.showTitle}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, showTitle: checked })
                    }
                  />
                </div>

                {/* عرض السعر */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                    <Label>عرض السعر</Label>
                  </div>
                  <Switch
                    checked={config.showPrice}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, showPrice: checked })
                    }
                  />
                </div>

                {/* عرض رقم الإعلان */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-gray-600" />
                    <Label>عرض رقم الإعلان</Label>
                  </div>
                  <Switch
                    checked={config.showSKU}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, showSKU: checked })
                    }
                  />
                </div>

                {/* عرض اسم البائع */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <Label>عرض اسم البائع</Label>
                  </div>
                  <Switch
                    checked={config.showSellerName}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, showSellerName: checked })
                    }
                  />
                </div>

                {/* إضافة الشعار */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-gray-600" />
                    <Label>إضافة الشعار</Label>
                  </div>
                  <Switch
                    checked={config.addLogo}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, addLogo: checked })
                    }
                  />
                </div>

                {/* نص مخصص */}
                <div className="space-y-2">
                  <Label>نص مخصص (اختياري)</Label>
                  <Input
                    value={config.customText}
                    onChange={(e) =>
                      setConfig({ ...config, customText: e.target.value })
                    }
                    placeholder="أضف نصاً مخصصاً..."
                  />
                </div>
              </TabsContent>

              {/* تبويب التنسيق */}
              <TabsContent value="style" className="space-y-4 mt-4">
                {/* لون النص */}
                <div className="space-y-2">
                  <Label>لون النص</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={config.textColor}
                      onChange={(e) =>
                        setConfig({ ...config, textColor: e.target.value })
                      }
                      className="w-20 h-10"
                    />
                    <Input
                      value={config.textColor}
                      onChange={(e) =>
                        setConfig({ ...config, textColor: e.target.value })
                      }
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                {/* لون الخلفية */}
                <div className="space-y-2">
                  <Label>لون الخلفية</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) =>
                        setConfig({ ...config, backgroundColor: e.target.value })
                      }
                      className="w-20 h-10"
                    />
                    <Input
                      value={config.backgroundColor}
                      onChange={(e) =>
                        setConfig({ ...config, backgroundColor: e.target.value })
                      }
                      placeholder="#000000"
                    />
                  </div>
                </div>

                {/* الشفافية */}
                <div className="space-y-2">
                  <Label>الشفافية: {Math.round(config.opacity * 100)}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={config.opacity}
                    onChange={(e) =>
                      setConfig({ ...config, opacity: parseFloat(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>
              </TabsContent>

              {/* تبويب الموضع */}
              <TabsContent value="position" className="space-y-4 mt-4">
                <Label>موضع الشعار</Label>
                <RadioGroup
                  value={config.logoPosition}
                  onValueChange={(value: any) =>
                    setConfig({ ...config, logoPosition: value })
                  }
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="top-left" id="top-left" />
                      <Label htmlFor="top-left" className="cursor-pointer">
                        أعلى اليسار
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="top-right" id="top-right" />
                      <Label htmlFor="top-right" className="cursor-pointer">
                        أعلى اليمين
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="bottom-left" id="bottom-left" />
                      <Label htmlFor="bottom-left" className="cursor-pointer">
                        أسفل اليسار
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="bottom-right" id="bottom-right" />
                      <Label htmlFor="bottom-right" className="cursor-pointer">
                        أسفل اليمين
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </TabsContent>
            </Tabs>
          </div>

          {/* المعاينة */}
          <div className="space-y-4">
            <Label className="text-lg font-bold">المعاينة</Label>
            
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
              {previewImage ? (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="معاينة"
                    className="w-full h-auto"
                  />
                  
                  {/* محاكاة العلامة المائية */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-4"
                    style={{
                      backgroundColor: config.backgroundColor,
                      opacity: config.opacity,
                    }}
                  >
                    <div className="space-y-1" style={{ color: config.textColor }}>
                      {config.showTitle && (
                        <p className="font-bold text-lg">{offer.title}</p>
                      )}
                      {config.showPrice && (
                        <p className="font-bold text-[#D4AF37]">
                          {offer.price.toLocaleString()} ريال
                        </p>
                      )}
                      {config.showSKU && (
                        <p className="text-sm">رقم: {offer.sku}</p>
                      )}
                      {config.showSellerName && (
                        <p className="text-sm">{sellerInfo.name}</p>
                      )}
                      {config.customText && (
                        <p className="text-sm">{config.customText}</p>
                      )}
                    </div>
                  </div>

                  {/* الشعار */}
                  {config.addLogo && sellerInfo.logo && (
                    <div
                      className={`absolute w-20 h-20 ${
                        config.logoPosition === 'top-left'
                          ? 'top-2 left-2'
                          : config.logoPosition === 'top-right'
                          ? 'top-2 right-2'
                          : config.logoPosition === 'bottom-left'
                          ? 'bottom-20 left-2'
                          : 'bottom-20 right-2'
                      }`}
                    >
                      <img
                        src={sellerInfo.logo}
                        alt="شعار"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <Upload className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 text-center">
              المعاينة تقريبية - الشكل النهائي قد يختلف قليلاً
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            onClick={handleApplyWatermark}
            disabled={loading}
            className="bg-[#01411C] hover:bg-[#01411C]/90"
          >
            {loading ? 'جاري التطبيق...' : 'تطبيق وإرسال'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
