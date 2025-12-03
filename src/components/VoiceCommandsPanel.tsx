// components/VoiceCommandsPanel.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Mic, MicOff, Volume2 } from 'lucide-react@0.487.0';
import useVoiceCommands from '../hooks/useVoiceCommands';

export default function VoiceCommandsPanel() {
  const { enabled, language, isListening, setLanguage, toggleEnabled } = useVoiceCommands();

  const commands = [
    { ar: 'عقاري أي آي أكد موعد يوم [التاريخ] الساعة [الوقت]', en: 'Aqari AI confirm appointment on [date] at [time]' },
    { ar: 'عقاري أي آي ألغِ موعد يوم [التاريخ] الساعة [الوقت]', en: 'Aqari AI cancel appointment on [date] at [time]' },
    { ar: 'عقاري أي آي اقترح موعد جديد للعميل', en: 'Aqari AI suggest new appointment' },
    { ar: 'عقاري أي آي أنشئ موعد جديد', en: 'Aqari AI create new appointment' },
    { ar: 'عقاري أي آي اقرأ الإشعارات', en: 'Aqari AI read notifications' }
  ];

  return (
    <Card className="border-2 border-[#D4AF37]">
      <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41]">
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            {isListening ? <Mic className="w-5 h-5 text-[#D4AF37] animate-pulse" /> : <MicOff className="w-5 h-5 text-[#D4AF37]" />}
            الأوامر الصوتية
          </span>
          {isListening && (
            <Badge className="bg-red-500 text-white animate-pulse">
              جاري الاستماع...
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* التفعيل */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-[#01411C]" />
            <div>
              <Label htmlFor="voice_enabled" className="font-semibold">تفعيل الأوامر الصوتية</Label>
              <p className="text-xs text-gray-500 mt-1">
                الكلمة المفتاحية: "عقاري أي آي"
              </p>
            </div>
          </div>
          <Switch
            id="voice_enabled"
            checked={enabled}
            onCheckedChange={toggleEnabled}
          />
        </div>

        {/* اختيار اللغة */}
        <div className="space-y-2">
          <Label>اللغة</Label>
          <div className="flex gap-2">
            <Button
              variant={language === 'ar' ? 'default' : 'outline'}
              className={language === 'ar' ? 'bg-[#01411C] text-white' : ''}
              onClick={() => setLanguage('ar')}
            >
              العربية
            </Button>
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              className={language === 'en' ? 'bg-[#01411C] text-white' : ''}
              onClick={() => setLanguage('en')}
            >
              English
            </Button>
          </div>
        </div>

        {/* قائمة الأوامر */}
        <div className="space-y-3">
          <h3 className="font-semibold text-[#01411C]">الأوامر المتاحة</h3>
          <div className="space-y-2">
            {commands.map((cmd, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 font-mono">
                  {language === 'ar' ? cmd.ar : cmd.en}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* حالة الاستماع */}
        {enabled && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-700">
                {isListening ? 'النظام الصوتي نشط وجاهز لاستقبال الأوامر' : 'جاري تجهيز النظام الصوتي...'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
