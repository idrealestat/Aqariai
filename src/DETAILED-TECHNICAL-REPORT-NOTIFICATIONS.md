# 📊 **تقرير تفصيلي شامل: نظام الإشعارات (Notifications)**

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║          🔔 نظام الإشعارات - التقرير الكامل 🔔             ║
║                                                               ║
║  كل شيء بالتفصيل: المسارات، الدوال، الاستدعاءات،            ║
║  الربط، التعاريف، الأزرار، الحقول، طريقة العمل              ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 📋 **جدول المحتويات**

1. [نظرة عامة](#1-نظرة-عامة)
2. [المسارات والملفات](#2-المسارات-والملفات)
3. [التعاريف والأنواع](#3-التعاريف-والأنواع)
4. [الاستيرادات](#4-الاستيرادات)
5. [State Management](#5-state-management)
6. [الدوال الرئيسية](#6-الدوال-الرئيسية)
7. [استدعاءات API](#7-استدعاءات-api)
8. [الربط مع المكونات الأخرى](#8-الربط-مع-المكونات-الأخرى)
9. [واجهة المستخدم](#9-واجهة-المستخدم)
10. [أنواع الإشعارات](#10-أنواع-الإشعارات)
11. [سير العمل](#11-سير-العمل)

---

## 1️⃣ **نظرة عامة**

### **الغرض من نظام الإشعارات:**
نظام الإشعارات هو المسؤول عن:
- إعلام المستخدم بالأحداث المهمة في النظام
- عرض التنبيهات والتحديثات الفورية
- إدارة حالة قراءة/عدم قراءة الإشعارات
- التفاعل مع الإشعارات (قراءة، حذف، تنفيذ إجراء)
- الربط مع الأحداث في الوقت الفعلي (Real-time)

### **الموقع في النظام:**
- **المكون الرئيسي:** `NotificationSystem.tsx`
- **المكون الفرعي:** `NotificationSlider.tsx`
- **Hook:** `useNotifications.ts`
- **API:** `notifications-real.ts`
- **النوع:** نظام عام (Global System)
- **الوصول:** متاح في جميع الصفحات

---

## 2️⃣ **المسارات والملفات**

### **المسارات الفعلية:**

```
📁 Project Root
│
├── 📁 components/
│   │
│   ├── 📁 notifications/
│   │   │
│   │   ├── 📄 NotificationSystem.tsx
│   │   │   المسار: /components/notifications/NotificationSystem.tsx
│   │   │   الدور: النظام الرئيسي للإشعارات
│   │   │   المكونات:
│   │   │     - NotificationButton (زر الإشعارات)
│   │   │     - NotificationDropdown (القائمة المنسدلة)
│   │   │     - NotificationList (قائمة الإشعارات)
│   │   │     - NotificationItem (عنصر إشعار واحد)
│   │   │
│   │   ├── 📄 NotificationSlider.tsx
│   │   │   المسار: /components/notifications/NotificationSlider.tsx
│   │   │   الدور: لوحة جانبية للإشعارات
│   │   │   المكونات:
│   │   │     - Slider Container
│   │   │     - Notification Groups (مجموعات)
│   │   │     - Filter Tabs (تبويبات التصفية)
│   │   │     - Actions (إجراءات)
│   │   │
│   │   └── 📄 UnreadIndicator.tsx
│   │       المسار: /components/notifications/UnreadIndicator.tsx
│   │       الدور: مؤشر الإشعارات غير المقروءة (Badge)
│   │
│   └── 📄 SmartNotificationsPanel.tsx
│       المسار: /components/SmartNotificationsPanel.tsx
│       الدور: لوحة إشعارات ذكية متقدمة
│
├── 📁 hooks/
│   │
│   ├── 📄 useNotifications.ts
│   │   المسار: /hooks/useNotifications.ts
│   │   الدور: Hook مخصص لإدارة الإشعارات
│   │   الوظائف:
│   │     - addNotification() - إضافة إشعار
│   │     - removeNotification() - حذف إشعار
│   │     - markAsRead() - تحديد كمقروء
│   │     - markAllAsRead() - تحديد الكل كمقروء
│   │     - clearAll() - حذف الكل
│   │
│   └── 📄 useNotificationsAPI.ts
│       المسار: /hooks/useNotificationsAPI.ts
│       الدور: Hook للتفاعل مع API الإشعارات
│
├── 📁 api/
│   │
│   ├── 📄 notifications-real.ts
│   │   المسار: /api/notifications-real.ts
│   │   الدور: API الإشعارات الفعلي (يستخدم Supabase)
│   │   الوظائف:
│   │     - fetchNotifications()
│   │     - createNotification()
│   │     - markNotificationAsRead()
│   │     - deleteNotification()
│   │     - subscribeToNotifications()
│   │
│   └── 📄 notifications.js
│       المسار: /api/notifications.js
│       الدور: API احتياطي (Mock/Fallback)
│
├── 📁 types/
│   │
│   └── 📄 notifications.ts
│       المسار: /types/notifications.ts (يُنشأ حسب الحاجة)
│       الدور: تعاريف TypeScript للإشعارات
│
└── 📁 utils/
    │
    ├── 📄 notificationsSystem.ts
    │   المسار: /utils/notificationsSystem.ts
    │   الدور: Utilities للإشعارات
    │
    └── 📄 notificationsIntegration.ts
        المسار: /utils/notificationsIntegration.ts
        الدور: دمج الإشعارات مع أنظمة أخرى
```

---

## 3️⃣ **التعاريف والأنواع**

### **أنواع الإشعارات:**

```typescript
// ==========================================
// FILE: types/notifications.ts (أو في المكون)
// ==========================================

/**
 * نوع الإشعار
 */
export type NotificationType =
  | 'info'        // معلومات عامة
  | 'success'     // نجاح عملية
  | 'warning'     // تحذير
  | 'error'       // خطأ
  | 'reminder'    // تذكير
  | 'system'      // إشعار نظام
  | 'offer'       // إشعار متعلق بعرض
  | 'request'     // إشعار متعلق بطلب
  | 'appointment' // إشعار متعلق بموعد
  | 'message';    // رسالة جديدة

/**
 * أولوية الإشعار
 */
export type NotificationPriority =
  | 'low'       // منخفضة
  | 'medium'    // متوسطة
  | 'high'      // عالية
  | 'urgent';   // عاجلة

/**
 * حالة الإشعار
 */
export type NotificationStatus =
  | 'unread'    // غير مقروء
  | 'read'      // مقروء
  | 'archived'; // مؤرشف

/**
 * إجراء الإشعار
 */
export interface NotificationAction {
  // نص الزر
  label: string;
  
  // اللون (primary, secondary, success, danger)
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  
  // الدالة التي تُنفذ عند الضغط
  onClick: () => void | Promise<void>;
  
  // هل يغلق الإشعار بعد التنفيذ؟
  closeOnClick?: boolean;
}

/**
 * بيانات إضافية للإشعار
 */
export interface NotificationMetadata {
  // معرف العنصر المرتبط (عرض، طلب، موعد، إلخ)
  relatedId?: string;
  
  // نوع العنصر المرتبط
  relatedType?: 'offer' | 'request' | 'appointment' | 'user' | 'sale';
  
  // رابط للانتقال إليه عند الضغط
  link?: string;
  
  // صورة مرفقة
  image?: string;
  
  // أيقونة مخصصة
  icon?: string;
  
  // بيانات إضافية مخصصة
  customData?: Record<string, any>;
}

/**
 * واجهة الإشعار الكاملة
 */
export interface Notification {
  // المعرف الفريد
  id: string;
  
  // معرف المستخدم المستقبل
  userId: string;
  
  // النوع
  type: NotificationType;
  
  // الأولوية
  priority: NotificationPriority;
  
  // الحالة
  status: NotificationStatus;
  
  // العنوان
  title: string;
  
  // الرسالة
  message: string;
  
  // البيانات الإضافية
  metadata?: NotificationMetadata;
  
  // الإجراءات المتاحة
  actions?: NotificationAction[];
  
  // هل يمكن حذفه؟
  dismissible?: boolean;
  
  // هل يُعرض كـ Toast؟
  showAsToast?: boolean;
  
  // مدة عرض Toast (بالميلي ثانية)
  toastDuration?: number;
  
  // هل يُشغل صوت؟
  playSound?: boolean;
  
  // هل يُشغل اهتزاز؟
  vibrate?: boolean;
  
  // تاريخ الإنشاء
  createdAt: Date;
  
  // تاريخ القراءة
  readAt?: Date;
  
  // تاريخ الأرشفة
  archivedAt?: Date;
  
  // تاريخ الانتهاء
  expiresAt?: Date;
}

/**
 * مجموعة إشعارات
 */
export interface NotificationGroup {
  // اسم المجموعة
  name: string;
  
  // عنوان المجموعة
  title: string;
  
  // الإشعارات في المجموعة
  notifications: Notification[];
  
  // عدد الإشعارات غير المقروءة
  unreadCount: number;
}

/**
 * تفضيلات الإشعارات
 */
export interface NotificationPreferences {
  // هل الإشعارات مفعلة؟
  enabled: boolean;
  
  // إشعارات سطح المكتب
  desktopNotifications: boolean;
  
  // الأصوات
  soundEnabled: boolean;
  
  // الاهتزاز
  vibrationEnabled: boolean;
  
  // تفضيلات حسب النوع
  typePreferences: {
    [key in NotificationType]?: {
      enabled: boolean;
      showAsToast: boolean;
      playSound: boolean;
    };
  };
}

/**
 * إحصائيات الإشعارات
 */
export interface NotificationStats {
  // إجمالي الإشعارات
  total: number;
  
  // غير المقروءة
  unread: number;
  
  // المقروءة
  read: number;
  
  // المؤرشفة
  archived: number;
  
  // حسب النوع
  byType: {
    [key in NotificationType]?: number;
  };
  
  // حسب الأولوية
  byPriority: {
    [key in NotificationPriority]?: number;
  };
}
```

---

## 4️⃣ **الاستيرادات**

### **استيرادات المكون الرئيسي:**

```typescript
// ==========================================
// FILE: components/notifications/NotificationSystem.tsx
// ==========================================

// React Core
import React, { 
  useState, 
  useEffect, 
  useCallback, 
  useMemo,
  useRef 
} from 'react';

// UI Components (shadcn/ui)
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '../ui/popover';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

// Icons (lucide-react)
import {
  Bell,              // أيقونة الجرس
  BellOff,           // جرس مطفأ
  Check,             // علامة صح
  CheckCheck,        // علامتان صح (مقروء)
  X,                 // إغلاق
  Trash2,            // حذف
  Archive,           // أرشفة
  Settings,          // إعدادات
  Filter,            // تصفية
  ChevronDown,       // سهم لأسفل
  Circle,            // دائرة
  AlertCircle,       // دائرة تنبيه
  Info,              // معلومات
  CheckCircle,       // دائرة مع صح
  XCircle,           // دائرة مع X
  Clock,             // ساعة
  MessageSquare,     // رسالة
  Calendar,          // تقويم
  Home,              // منزل
  FileText,          // ملف نصي
  MoreVertical       // ثلاث نقاط عمودية
} from 'lucide-react';

// Toast Notifications
import { toast } from 'sonner';

// Custom Hooks
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';

// API
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  archiveNotification,
  subscribeToNotifications
} from '../../api/notifications-real';

// Types
import type {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  NotificationGroup,
  NotificationStats
} from '../../types/notifications';

// Utils
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
```

---

## 5️⃣ **State Management**

### **State المكون الرئيسي:**

```typescript
// ==========================================
// State في NotificationSystem
// ==========================================

export function NotificationSystem() {
  // ===== 1. بيانات الإشعارات =====
  
  /**
   * قائمة جميع الإشعارات
   */
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  /**
   * الإشعار المحدد حالياً (للعرض التفصيلي)
   */
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  
  /**
   * إحصائيات الإشعارات
   */
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    read: 0,
    archived: 0,
    byType: {},
    byPriority: {}
  });
  
  // ===== 2. حالة واجهة المستخدم =====
  
  /**
   * هل القائمة المنسدلة مفتوحة؟
   */
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  /**
   * الفلتر النشط
   * القيم: 'all' | 'unread' | 'read' | 'archived' | NotificationType
   */
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  /**
   * ترتيب العرض
   * القيم: 'newest' | 'oldest' | 'priority' | 'unread-first'
   */
  const [sortBy, setSortBy] = useState<string>('newest');
  
  /**
   * هل القائمة في وضع التحديد المتعدد؟
   */
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  
  /**
   * الإشعارات المحددة (في وضع التحديد المتعدد)
   */
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // ===== 3. حالة التحميل والمعالجة =====
  
  /**
   * هل يتم تحميل الإشعارات؟
   */
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  /**
   * هل يتم معالجة عملية؟
   */
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  /**
   * معرفات الإشعارات قيد المعالجة
   */
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  
  // ===== 4. Real-time Subscription =====
  
  /**
   * مرجع للاشتراك في الوقت الفعلي
   */
  const subscriptionRef = useRef<any>(null);
  
  /**
   * مرجع لصوت الإشعار
   */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // ===== 5. Custom Hooks =====
  
  /**
   * معلومات المستخدم
   */
  const { user } = useAuth();
  
  /**
   * Hook إدارة الإشعارات
   */
  const { 
    addNotification: addLocalNotification,
    notifications: localNotifications 
  } = useNotifications();
  
  // ===== 6. Computed Values =====
  
  /**
   * عدد الإشعارات غير المقروءة
   */
  const unreadCount = useMemo(() => {
    return notifications.filter(n => n.status === 'unread').length;
  }, [notifications]);
  
  /**
   * الإشعارات المفلترة
   */
  const filteredNotifications = useMemo(() => {
    let result = [...notifications];
    
    // تطبيق الفلتر
    switch (activeFilter) {
      case 'unread':
        result = result.filter(n => n.status === 'unread');
        break;
      case 'read':
        result = result.filter(n => n.status === 'read');
        break;
      case 'archived':
        result = result.filter(n => n.status === 'archived');
        break;
      case 'all':
        result = result.filter(n => n.status !== 'archived');
        break;
      default:
        // تصفية حسب النوع
        if (activeFilter as NotificationType) {
          result = result.filter(n => n.type === activeFilter);
        }
    }
    
    // تطبيق الترتيب
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'oldest':
        result.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'priority':
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        result.sort((a, b) => 
          priorityOrder[a.priority] - priorityOrder[b.priority]
        );
        break;
      case 'unread-first':
        result.sort((a, b) => {
          if (a.status === 'unread' && b.status !== 'unread') return -1;
          if (a.status !== 'unread' && b.status === 'unread') return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        break;
    }
    
    return result;
  }, [notifications, activeFilter, sortBy]);
  
  /**
   * الإشعارات مجمعة حسب التاريخ
   */
  const groupedNotifications = useMemo(() => {
    const groups: NotificationGroup[] = [];
    
    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    const thisWeek: Notification[] = [];
    const older: Notification[] = [];
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    
    filteredNotifications.forEach(notification => {
      const notifDate = new Date(notification.createdAt);
      
      if (notifDate >= todayStart) {
        today.push(notification);
      } else if (notifDate >= yesterdayStart) {
        yesterday.push(notification);
      } else if (notifDate >= weekStart) {
        thisWeek.push(notification);
      } else {
        older.push(notification);
      }
    });
    
    if (today.length > 0) {
      groups.push({
        name: 'today',
        title: 'اليوم',
        notifications: today,
        unreadCount: today.filter(n => n.status === 'unread').length
      });
    }
    
    if (yesterday.length > 0) {
      groups.push({
        name: 'yesterday',
        title: 'أمس',
        notifications: yesterday,
        unreadCount: yesterday.filter(n => n.status === 'unread').length
      });
    }
    
    if (thisWeek.length > 0) {
      groups.push({
        name: 'this-week',
        title: 'هذا الأسبوع',
        notifications: thisWeek,
        unreadCount: thisWeek.filter(n => n.status === 'unread').length
      });
    }
    
    if (older.length > 0) {
      groups.push({
        name: 'older',
        title: 'أقدم',
        notifications: older,
        unreadCount: older.filter(n => n.status === 'unread').length
      });
    }
    
    return groups;
  }, [filteredNotifications]);
}
```

---

## 6️⃣ **الدوال الرئيسية**

### **دوال جلب ومعالجة الإشعارات:**

```typescript
// ==========================================
// Notification Management Functions
// ==========================================

/**
 * جلب جميع الإشعارات
 */
const loadNotifications = useCallback(async () => {
  try {
    setIsLoading(true);
    
    // جلب من API
    const data = await fetchNotifications(user.id);
    
    // تحديث الـ State
    setNotifications(data);
    
    // حساب الإحصائيات
    const stats: NotificationStats = {
      total: data.length,
      unread: data.filter(n => n.status === 'unread').length,
      read: data.filter(n => n.status === 'read').length,
      archived: data.filter(n => n.status === 'archived').length,
      byType: {},
      byPriority: {}
    };
    
    // حساب حسب النوع
    data.forEach(n => {
      stats.byType[n.type] = (stats.byType[n.type] || 0) + 1;
      stats.byPriority[n.priority] = (stats.byPriority[n.priority] || 0) + 1;
    });
    
    setStats(stats);
    
  } catch (error) {
    console.error('Error loading notifications:', error);
    toast.error('فشل في تحميل الإشعارات');
  } finally {
    setIsLoading(false);
  }
}, [user.id]);

/**
 * تحديد إشعار كمقروء
 */
const handleMarkAsRead = useCallback(async (notificationId: string) => {
  try {
    // إضافة إلى قائمة المعالجة
    setProcessingIds(prev => new Set(prev).add(notificationId));
    
    // تحديث في قاعدة البيانات
    await markNotificationAsRead(notificationId);
    
    // تحديث الـ State المحلي
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId
          ? { ...n, status: 'read', readAt: new Date() }
          : n
      )
    );
    
  } catch (error) {
    console.error('Error marking as read:', error);
    toast.error('فشل في تحديث الإشعار');
  } finally {
    // إزالة من قائمة المعالجة
    setProcessingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(notificationId);
      return newSet;
    });
  }
}, []);

/**
 * تحديد جميع الإشعارات كمقروءة
 */
const handleMarkAllAsRead = useCallback(async () => {
  try {
    setIsProcessing(true);
    
    // جلب معرفات الإشعارات غير المقروءة
    const unreadIds = notifications
      .filter(n => n.status === 'unread')
      .map(n => n.id);
    
    if (unreadIds.length === 0) {
      toast.info('لا توجد إشعارات غير مقروءة');
      return;
    }
    
    // تحديث في قاعدة البيانات
    await markAllNotificationsAsRead(user.id);
    
    // تحديث الـ State المحلي
    setNotifications(prev =>
      prev.map(n =>
        n.status === 'unread'
          ? { ...n, status: 'read', readAt: new Date() }
          : n
      )
    );
    
    toast.success(`تم تحديد ${unreadIds.length} إشعار كمقروء`);
    
  } catch (error) {
    console.error('Error marking all as read:', error);
    toast.error('فشل في تحديث الإشعارات');
  } finally {
    setIsProcessing(false);
  }
}, [notifications, user.id]);

/**
 * حذف إشعار
 */
const handleDeleteNotification = useCallback(async (notificationId: string) => {
  try {
    setProcessingIds(prev => new Set(prev).add(notificationId));
    
    // حذف من قاعدة البيانات
    await deleteNotification(notificationId);
    
    // حذف من الـ State المحلي
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    
    toast.success('تم حذف الإشعار');
    
  } catch (error) {
    console.error('Error deleting notification:', error);
    toast.error('فشل في حذف الإشعار');
  } finally {
    setProcessingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(notificationId);
      return newSet;
    });
  }
}, []);

/**
 * أرشفة إشعار
 */
const handleArchiveNotification = useCallback(async (notificationId: string) => {
  try {
    setProcessingIds(prev => new Set(prev).add(notificationId));
    
    await archiveNotification(notificationId);
    
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId
          ? { ...n, status: 'archived', archivedAt: new Date() }
          : n
      )
    );
    
    toast.success('تم أرشفة الإشعار');
    
  } catch (error) {
    console.error('Error archiving notification:', error);
    toast.error('فشل في أرشفة الإشعار');
  } finally {
    setProcessingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(notificationId);
      return newSet;
    });
  }
}, []);

/**
 * حذف جميع الإشعارات المقروءة
 */
const handleClearRead = useCallback(async () => {
  const readIds = notifications
    .filter(n => n.status === 'read')
    .map(n => n.id);
  
  if (readIds.length === 0) {
    toast.info('لا توجد إشعارات مقروءة');
    return;
  }
  
  const confirmed = window.confirm(
    `هل تريد حذف ${readIds.length} إشعار مقروء؟`
  );
  
  if (!confirmed) return;
  
  try {
    setIsProcessing(true);
    
    // حذف من قاعدة البيانات
    await Promise.all(readIds.map(id => deleteNotification(id)));
    
    // حذف من الـ State المحلي
    setNotifications(prev => prev.filter(n => n.status !== 'read'));
    
    toast.success(`تم حذف ${readIds.length} إشعار`);
    
  } catch (error) {
    console.error('Error clearing read:', error);
    toast.error('فشل في حذف الإشعارات');
  } finally {
    setIsProcessing(false);
  }
}, [notifications]);

/**
 * التعامل مع الضغط على إشعار
 */
const handleNotificationClick = useCallback(async (notification: Notification) => {
  // تحديد كمقروء إذا لم يكن مقروءاً
  if (notification.status === 'unread') {
    await handleMarkAsRead(notification.id);
  }
  
  // تنفيذ الإجراء المخصص إذا وجد
  if (notification.metadata?.link) {
    window.location.href = notification.metadata.link;
  } else if (notification.metadata?.relatedId) {
    // الانتقال إلى الصفحة المرتبطة
    const type = notification.metadata.relatedType;
    switch (type) {
      case 'offer':
        window.location.href = `/offers/${notification.metadata.relatedId}`;
        break;
      case 'request':
        window.location.href = `/requests/${notification.metadata.relatedId}`;
        break;
      case 'appointment':
        window.location.href = `/calendar/${notification.metadata.relatedId}`;
        break;
      default:
        break;
    }
  }
  
  // إغلاق القائمة
  setIsOpen(false);
}, [handleMarkAsRead]);
```

---

**(يتبع في الملف التالي...)**
