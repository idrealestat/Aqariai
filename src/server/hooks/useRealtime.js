// =======================================================
// React Hook للاتصال المباشر
// للاستخدام في Frontend React لاستقبال التحديثات المباشرة
// =======================================================

import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

// =======================================================
// الإعدادات الافتراضية
// =======================================================

const DEFAULT_OPTIONS = {
  serverUrl: process.env.REACT_APP_REALTIME_URL || 'http://localhost:4000',
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: true
};

// =======================================================
// Hook الاتصال المباشر
// =======================================================

export const useRealtime = (token, options = {}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);
  const [eventHistory, setEventHistory] = useState([]);
  
  const config = { ...DEFAULT_OPTIONS, ...options };
  const reconnectAttempts = useRef(0);
  const eventListeners = useRef(new Map());

  // =======================================================
  // إنشاء الاتصال
  // =======================================================

  const connect = useCallback(() => {
    if (!token) {
      console.warn('⚠️ Token مطلوب للاتصال المباشر');
      return;
    }

    try {
      console.log('🔌 محاولة الاتصال بخادم الإشعارات المباشرة...');

      const newSocket = io(config.serverUrl, {
        auth: { token },
        reconnection: config.reconnection,
        reconnectionAttempts: config.reconnectionAttempts,
        reconnectionDelay: config.reconnectionDelay,
        reconnectionDelayMax: config.reconnectionDelayMax,
        timeout: config.timeout,
        transports: ['websocket', 'polling']
      });

      // =======================================================
      // معالجات الأحداث الأساسية
      // =======================================================

      newSocket.on('connect', () => {
        console.log('✅ تم الاتصال بخادم الإشعارات المباشرة');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttempts.current = 0;
      });

      newSocket.on('disconnect', (reason) => {
        console.log('🔌 انقطع الاتصال:', reason);
        setIsConnected(false);
        
        if (reason === 'io server disconnect') {
          // الخادم قطع الاتصال، إعادة الاتصال يدوياً
          newSocket.connect();
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ خطأ في الاتصال:', error);
        setConnectionError(error.message);
        reconnectAttempts.current++;
        
        if (reconnectAttempts.current >= config.reconnectionAttempts) {
          console.error('❌ فشل في الاتصال بعد عدة محاولات');
          setConnectionError('فشل في الاتصال بالخادم');
        }
      });

      newSocket.on('error', (error) => {
        console.error('❌ خطأ في Socket:', error);
        setConnectionError(error.message || 'خطأ في الاتصال');
      });

      // =======================================================
      // معالجات الأحداث المخصصة
      // =======================================================

      // حالة الاتصال
      newSocket.on('connection_status', (data) => {
        console.log('📡 حالة الاتصال:', data);
        setLastEvent({
          type: 'connection_status',
          data,
          timestamp: new Date().toISOString()
        });
      });

      // الإشعارات
      newSocket.on('notification', (notification) => {
        console.log('🔔 إشعار جديد:', notification);
        const event = {
          type: 'notification',
          data: notification,
          timestamp: new Date().toISOString()
        };
        setLastEvent(event);
        setEventHistory(prev => [event, ...prev.slice(0, 49)]); // آخر 50 حدث
      });

      // عميل جديد
      newSocket.on('contact:new', (data) => {
        console.log('👤 عميل جديد:', data);
        const event = {
          type: 'new_contact',
          data,
          timestamp: new Date().toISOString()
        };
        setLastEvent(event);
        setEventHistory(prev => [event, ...prev.slice(0, 49)]);
      });

      // تحديث العميل
      newSocket.on('contact:updated', (data) => {
        console.log('👥 تم تحديث العميل:', data);
        const event = {
          type: 'contact_updated',
          data,
          timestamp: new Date().toISOString()
        };
        setLastEvent(event);
        setEventHistory(prev => [event, ...prev.slice(0, 49)]);
      });

      // مهمة جديدة
      newSocket.on('task:assigned', (data) => {
        console.log('📋 مهمة جديدة:', data);
        const event = {
          type: 'task_assigned',
          data,
          timestamp: new Date().toISOString()
        };
        setLastEvent(event);
        setEventHistory(prev => [event, ...prev.slice(0, 49)]);
      });

      // إكمال مهمة
      newSocket.on('task:completed', (data) => {
        console.log('✅ تم إكمال المهمة:', data);
        const event = {
          type: 'task_completed',
          data,
          timestamp: new Date().toISOString()
        };
        setLastEvent(event);
        setEventHistory(prev => [event, ...prev.slice(0, 49)]);
      });

      // مشاهدة عقار
      newSocket.on('property:viewed', (data) => {
        console.log('👁️ تم مشاهدة عقار:', data);
        const event = {
          type: 'property_viewed',
          data,
          timestamp: new Date().toISOString()
        };
        setLastEvent(event);
        setEventHistory(prev => [event, ...prev.slice(0, 49)]);
      });

      // حالة النشر
      newSocket.on('publish:status', (data) => {
        console.log('📤 حالة النشر:', data);
        const event = {
          type: 'publish_status',
          data,
          timestamp: new Date().toISOString()
        };
        setLastEvent(event);
        setEventHistory(prev => [event, ...prev.slice(0, 49)]);
      });

      // نشر مكتمل
      newSocket.on('publish:complete', (data) => {
        console.log('🎉 تم النشر بنجاح:', data);
        const event = {
          type: 'publish_complete',
          data,
          timestamp: new Date().toISOString()
        };
        setLastEvent(event);
        setEventHistory(prev => [event, ...prev.slice(0, 49)]);
      });

      // إحصائيات لوحة التحكم
      newSocket.on('dashboard:stats_update', (data) => {
        console.log('📊 تحديث الإحصائيات:', data);
        const event = {
          type: 'dashboard_stats',
          data,
          timestamp: new Date().toISOString()
        };
        setLastEvent(event);
      });

      setSocket(newSocket);

    } catch (error) {
      console.error('خطأ في إنشاء الاتصال:', error);
      setConnectionError(error.message);
    }
  }, [token, config]);

  // =======================================================
  // قطع الاتصال
  // =======================================================

  const disconnect = useCallback(() => {
    if (socket) {
      console.log('🔌 قطع الاتصال...');
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setConnectionError(null);
    }
  }, [socket]);

  // =======================================================
  // إرسال الأحداث
  // =======================================================

  const emit = useCallback((event, data) => {
    if (socket && isConnected) {
      console.log(`📤 إرسال حدث: ${event}`, data);
      socket.emit(event, data);
      return true;
    } else {
      console.warn('⚠️ لا يمكن إرسال الحدث: غير متصل');
      return false;
    }
  }, [socket, isConnected]);

  // =======================================================
  // إضافة مستمع حدث مخصص
  // =======================================================

  const addEventListener = useCallback((event, callback) => {
    if (socket) {
      socket.on(event, callback);
      eventListeners.current.set(event, callback);
      console.log(`👂 تم إضافة مستمع للحدث: ${event}`);
    }
  }, [socket]);

  // =======================================================
  // إزالة مستمع حدث
  // =======================================================

  const removeEventListener = useCallback((event) => {
    if (socket && eventListeners.current.has(event)) {
      const callback = eventListeners.current.get(event);
      socket.off(event, callback);
      eventListeners.current.delete(event);
      console.log(`🚫 تم إزالة مستمع الحدث: ${event}`);
    }
  }, [socket]);

  // =======================================================
  // طلب إحصائيات لوحة التحكم
  // =======================================================

  const requestDashboardStats = useCallback(() => {
    return emit('dashboard:stats');
  }, [emit]);

  // =======================================================
  // مشاهدة عقار
  // =======================================================

  const viewProperty = useCallback((propertyId) => {
    return emit('property:view', { property_id: propertyId });
  }, [emit]);

  // =======================================================
  // تحديث عميل
  // =======================================================

  const updateContact = useCallback((contactId, changes) => {
    return emit('contact:update', { contact_id: contactId, changes });
  }, [emit]);

  // =======================================================
  // إكمال مهمة
  // =======================================================

  const completeTask = useCallback((taskId) => {
    return emit('task:complete', { task_id: taskId });
  }, [emit]);

  // =======================================================
  // Effect للاتصال/قطع الاتصال
  // =======================================================

  useEffect(() => {
    if (config.autoConnect && token) {
      connect();
    }

    return () => {
      if (socket) {
        // تنظيف المستمعين
        eventListeners.current.forEach((callback, event) => {
          socket.off(event, callback);
        });
        eventListeners.current.clear();
        
        socket.disconnect();
      }
    };
  }, [connect, socket, token, config.autoConnect]);

  // =======================================================
  // Return Hook Values
  // =======================================================

  return {
    // حالة الاتصال
    isConnected,
    connectionError,
    socket,
    
    // الأحداث
    lastEvent,
    eventHistory,
    
    // دوال التحكم
    connect,
    disconnect,
    emit,
    addEventListener,
    removeEventListener,
    
    // دوال مساعدة
    requestDashboardStats,
    viewProperty,
    updateContact,
    completeTask,
    
    // معلومات إضافية
    reconnectAttempts: reconnectAttempts.current,
    serverUrl: config.serverUrl
  };
};

// =======================================================
// Hook مبسط للإشعارات فقط
// =======================================================

export const useRealtimeNotifications = (token) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const { lastEvent, isConnected } = useRealtime(token, {
    autoConnect: true
  });

  useEffect(() => {
    if (lastEvent && lastEvent.type === 'notification') {
      setNotifications(prev => [lastEvent.data, ...prev.slice(0, 99)]); // آخر 100 إشعار
      setUnreadCount(prev => prev + 1);
    }
  }, [lastEvent]);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    clearNotifications
  };
};

// =======================================================
// Hook لإحصائيات لوحة التحكم المباشرة
// =======================================================

export const useRealtimeDashboard = (token) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  
  const { lastEvent, isConnected, requestDashboardStats } = useRealtime(token);

  useEffect(() => {
    if (lastEvent && lastEvent.type === 'dashboard_stats') {
      setStats(lastEvent.data);
      setLoading(false);
    }
  }, [lastEvent]);

  useEffect(() => {
    if (isConnected) {
      // طلب الإحصائيات عند الاتصال
      requestDashboardStats();
      
      // طلب الإحصائيات كل 30 ثانية
      const interval = setInterval(requestDashboardStats, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, requestDashboardStats]);

  return {
    stats,
    loading,
    isConnected,
    refreshStats: requestDashboardStats
  };
};

export default useRealtime;