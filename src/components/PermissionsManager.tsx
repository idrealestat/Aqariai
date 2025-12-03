// components/PermissionsManager.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Shield, User, Users, Crown } from 'lucide-react@0.487.0';

type UserRole = 'owner' | 'manager' | 'agent' | 'client';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'calendar' | 'voice' | 'notifications' | 'analytics' | 'system';
}

interface RolePermissions {
  role: UserRole;
  label: string;
  icon: React.ReactNode;
  color: string;
  permissions: Record<string, boolean>;
}

const allPermissions: Permission[] = [
  { id: 'calendar_view_all', name: 'عرض جميع المواعيد', description: 'مشاهدة مواعيد جميع المستخدمين', category: 'calendar' },
  { id: 'calendar_create', name: 'إنشاء المواعيد', description: 'إضافة مواعيد جديدة', category: 'calendar' },
  { id: 'calendar_edit_all', name: 'تعديل كل المواعيد', description: 'تعديل مواعيد أي مستخدم', category: 'calendar' },
  { id: 'calendar_delete_all', name: 'حذف كل المواعيد', description: 'حذف أي موعد', category: 'calendar' },
  { id: 'calendar_edit_own', name: 'تعديل مواعيدي', description: 'تعديل المواعيد الخاصة فقط', category: 'calendar' },
  
  { id: 'voice_enable', name: 'تفعيل الأوامر الصوتية', description: 'استخدام النظام الصوتي', category: 'voice' },
  { id: 'voice_manage', name: 'إدارة النظام الصوتي', description: 'التحكم في إعدادات الصوت', category: 'voice' },
  { id: 'voice_language', name: 'تغيير اللغة', description: 'اختيار لغة الأوامر', category: 'voice' },
  
  { id: 'notif_receive', name: 'استقبال الإشعارات', description: 'تلقي التذكيرات', category: 'notifications' },
  { id: 'notif_manage', name: 'إدارة الإشعارات', description: 'التحكم في إعدادات الإشعارات', category: 'notifications' },
  { id: 'notif_send', name: 'إرسال الإشعارات', description: 'إرسال تذكيرات للآخرين', category: 'notifications' },
  
  { id: 'analytics_view', name: 'عرض التحليلات', description: 'مشاهدة التقارير', category: 'analytics' },
  { id: 'analytics_export', name: 'تصدير التقارير', description: 'تحميل التحليلات', category: 'analytics' },
  { id: 'analytics_all', name: 'تحليلات شاملة', description: 'الوصول لكل البيانات', category: 'analytics' },
  
  { id: 'system_users', name: 'إدارة المستخدمين', description: 'إضافة وحذف المستخدمين', category: 'system' },
  { id: 'system_permissions', name: 'إدارة الصلاحيات', description: 'تعديل صلاحيات الأدوار', category: 'system' },
  { id: 'system_settings', name: 'الإعدادات العامة', description: 'التحكم في النظام', category: 'system' }
];

const defaultRoles: RolePermissions[] = [
  {
    role: 'owner',
    label: 'المالك',
    icon: <Crown className="w-4 h-4" />,
    color: 'bg-purple-500',
    permissions: {
      ...Object.fromEntries(allPermissions.map(p => [p.id, true]))
    }
  },
  {
    role: 'manager',
    label: 'المدير',
    icon: <Users className="w-4 h-4" />,
    color: 'bg-blue-500',
    permissions: {
      calendar_view_all: true,
      calendar_create: true,
      calendar_edit_all: true,
      calendar_delete_all: false,
      calendar_edit_own: true,
      voice_enable: true,
      voice_manage: true,
      voice_language: true,
      notif_receive: true,
      notif_manage: true,
      notif_send: true,
      analytics_view: true,
      analytics_export: true,
      analytics_all: true,
      system_users: true,
      system_permissions: false,
      system_settings: true
    }
  },
  {
    role: 'agent',
    label: 'الوسيط',
    icon: <User className="w-4 h-4" />,
    color: 'bg-green-500',
    permissions: {
      calendar_view_all: false,
      calendar_create: true,
      calendar_edit_all: false,
      calendar_delete_all: false,
      calendar_edit_own: true,
      voice_enable: true,
      voice_manage: false,
      voice_language: true,
      notif_receive: true,
      notif_manage: false,
      notif_send: false,
      analytics_view: true,
      analytics_export: false,
      analytics_all: false,
      system_users: false,
      system_permissions: false,
      system_settings: false
    }
  },
  {
    role: 'client',
    label: 'العميل',
    icon: <Shield className="w-4 h-4" />,
    color: 'bg-gray-500',
    permissions: {
      calendar_view_all: false,
      calendar_create: true,
      calendar_edit_all: false,
      calendar_delete_all: false,
      calendar_edit_own: true,
      voice_enable: false,
      voice_manage: false,
      voice_language: false,
      notif_receive: true,
      notif_manage: false,
      notif_send: false,
      analytics_view: false,
      analytics_export: false,
      analytics_all: false,
      system_users: false,
      system_permissions: false,
      system_settings: false
    }
  }
];

export default function PermissionsManager() {
  const [roles, setRoles] = useState<RolePermissions[]>(defaultRoles);

  const togglePermission = (roleIndex: number, permissionId: string) => {
    if (roles[roleIndex].role === 'owner') return;
    
    const newRoles = [...roles];
    newRoles[roleIndex].permissions[permissionId] = !newRoles[roleIndex].permissions[permissionId];
    setRoles(newRoles);
    
    localStorage.setItem('role_permissions', JSON.stringify(newRoles));
  };

  const categories = [
    { id: 'calendar', name: '📅 التقويم', color: 'border-blue-200' },
    { id: 'voice', name: '🎤 الأوامر الصوتية', color: 'border-purple-200' },
    { id: 'notifications', name: '🔔 الإشعارات', color: 'border-yellow-200' },
    { id: 'analytics', name: '📊 التحليلات', color: 'border-green-200' },
    { id: 'system', name: '⚙️ النظام', color: 'border-red-200' }
  ];

  return (
    <div className="space-y-6">
      {/* نظرة عامة */}
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41]">
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#D4AF37]" />
            إدارة الصلاحيات والأدوار
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            تحكم في صلاحيات كل دور في النظام. المالك لديه صلاحيات كاملة غير قابلة للتعديل.
          </p>
          
          {/* الأدوار */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {roles.map((role) => (
              <div key={role.role} className={`${role.color} text-white rounded-lg p-3 text-center`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  {role.icon}
                  <span className="font-semibold">{role.label}</span>
                </div>
                <div className="text-xs opacity-90">
                  {Object.values(role.permissions).filter(Boolean).length} / {allPermissions.length} صلاحية
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* جدول الصلاحيات */}
      {categories.map((category) => (
        <Card key={category.id} className={`border-2 ${category.color}`}>
          <CardHeader>
            <CardTitle className="text-[#01411C] text-lg">{category.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {allPermissions.filter(p => p.category === category.id).map((permission) => (
                <div key={permission.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <div className="mb-3">
                    <div className="font-semibold text-gray-700">{permission.name}</div>
                    <div className="text-xs text-gray-500">{permission.description}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {roles.map((role, roleIndex) => (
                      <div key={role.role} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <Label htmlFor={`${permission.id}-${role.role}`} className="text-sm flex items-center gap-2 cursor-pointer">
                          {role.icon}
                          {role.label}
                        </Label>
                        <Switch
                          id={`${permission.id}-${role.role}`}
                          checked={role.permissions[permission.id] || false}
                          onCheckedChange={() => togglePermission(roleIndex, permission.id)}
                          disabled={role.role === 'owner'}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
