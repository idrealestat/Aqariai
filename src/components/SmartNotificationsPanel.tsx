// components/SmartNotificationsPanel.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react@0.487.0';
import useSmartNotifications from '../hooks/useSmartNotifications';

export default function SmartNotificationsPanel() {
  const { settings, setSettings } = useSmartNotifications();

  return (
    <Card className="border-2 border-[#D4AF37]">
      <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41]">
        <CardTitle className="text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#D4AF37]" />
          إعدادات الإشعارات الذكية
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* قنوات الإشعارات */}
        <div className="space-y-4">
          <h3 className="font-semibold text-[#01411C]">قنوات الإشعارات</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-600" />
              <Label htmlFor="email">البريد الإلكتروني</Label>
            </div>
            <Switch
              id="email"
              checked={settings.email}
              onCheckedChange={(checked) => setSettings({ ...settings, email: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-600" />
              <Label htmlFor="sms">الرسائل النصية</Label>
            </div>
            <Switch
              id="sms"
              checked={settings.sms}
              onCheckedChange={(checked) => setSettings({ ...settings, sms: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-gray-600" />
              <Label htmlFor="push">إشعارات النظام</Label>
            </div>
            <Switch
              id="push"
              checked={settings.push}
              onCheckedChange={(checked) => setSettings({ ...settings, push: checked })}
            />
          </div>
        </div>

        {/* توقيت التذكير */}
        <div className="space-y-4">
          <h3 className="font-semibold text-[#01411C]">توقيت التذكير</h3>
          
          <div>
            <Label htmlFor="client_time">تذكير العميل (دقيقة قبل الموعد)</Label>
            <Input
              id="client_time"
              type="number"
              min="5"
              max="120"
              value={settings.client_reminder_time}
              onChange={(e) => setSettings({ ...settings, client_reminder_time: parseInt(e.target.value) })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="agent_time">تذكير الوسيط (دقيقة قبل الموعد)</Label>
            <Input
              id="agent_time"
              type="number"
              min="5"
              max="120"
              value={settings.agent_reminder_time}
              onChange={(e) => setSettings({ ...settings, agent_reminder_time: parseInt(e.target.value) })}
              className="mt-2"
            />
          </div>
        </div>

        {/* إعادة الإرسال التلقائي */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="auto_resend">إعادة الإرسال التلقائي</Label>
            <p className="text-xs text-gray-500 mt-1">
              إعادة إرسال التذكير إذا لم يؤكد العميل
            </p>
          </div>
          <Switch
            id="auto_resend"
            checked={settings.auto_resend}
            onCheckedChange={(checked) => setSettings({ ...settings, auto_resend: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
