// ملف: components/share/TouchToCopy.tsx
// مكون Touch to Copy للروابط المباشرة

'use client';

import React, { useState } from 'react';
import { Copy, Check, Share2, Link as LinkIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';

interface TouchToCopyProps {
  url: string;
  onCopy?: () => void;
}

export function TouchToCopy({ url, onCopy }: TouchToCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('✓ تم نسخ الرابط!');
      
      if (onCopy) {
        onCopy();
      }

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('فشل نسخ الرابط');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'مشاركة العرض',
          url: url,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className="space-y-3">
      <label className="block font-bold text-[#01411C]">
        <LinkIcon className="w-5 h-5 inline ml-2" />
        رابط العرض المباشر
      </label>

      {/* صندوق الرابط مع Touch to Copy */}
      <div
        onClick={handleCopy}
        className="relative group cursor-pointer bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-[#D4AF37] hover:shadow-lg transition-all duration-300"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#01411C]/5 to-[#D4AF37]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative flex items-center justify-between gap-3">
          {/* الرابط */}
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-mono text-gray-700 truncate">
              {url}
            </p>
          </div>

          {/* الأزرار */}
          <div className="flex items-center gap-2">
            {/* زر النسخ */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              variant="outline"
              size="icon"
              className={`transition-all ${
                copied
                  ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
                  : 'hover:border-[#D4AF37] hover:bg-[#fffef7]'
              }`}
            >
              {copied ? (
                <Check className="w-5 h-5 animate-in zoom-in" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </Button>

            {/* زر المشاركة الأصلي (للموبايل) */}
            {navigator.share && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNativeShare();
                }}
                variant="outline"
                size="icon"
                className="hover:border-[#D4AF37] hover:bg-[#fffef7]"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Touch to Copy Indicator */}
        <div className="relative mt-3 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
              copied
                ? 'bg-green-50 border-green-300 text-green-700'
                : 'bg-teal-50 border-teal-300 text-teal-700 group-hover:bg-teal-100 group-hover:border-teal-400'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 animate-in zoom-in" />
                <span className="text-sm font-bold">تم النسخ ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-bold">اضغط للنسخ</span>
              </>
            )}
          </div>
        </div>

        {/* تأثير الموجة عند النسخ */}
        {copied && (
          <div className="absolute inset-0 rounded-xl border-4 border-green-400 animate-ping opacity-75 pointer-events-none" />
        )}
      </div>

      {/* معلومات إضافية */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>✨ نسخة واحدة، مشاركة سريعة</span>
        <span>🔗 رابط دائم</span>
      </div>
    </div>
  );
}
