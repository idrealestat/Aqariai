import { useEffect, useRef, useState, useCallback, createContext, useContext } from 'react';

// تعريف أنواع الأحداث المختلفة
export type RealtimeEventType = 
  | 'lead:new' 
  | 'lead:updated' 
  | 'lead:deleted'
  | 'task:created'
  | 'task:updated' 
  | 'task:completed'
  | 'task:deleted'
  | 'contact:updated'
  | 'activity:new'
  | 'notification:new'
  | 'user:joined'
  | 'user:left'
  | 'workspace:updated';

// تعريف بنية البيانات للأحداث
export interface RealtimeEvent {
  id: string;
  type: RealtimeEventType;
  payload: any;
  workspace_id: string;
  user_id: string;
  timestamp: Date;
  metadata?: {
    source?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    expires_at?: Date;
  };
}

// تعريف حالة الاتصال
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting';

// تعريف إعدادات الـ Real-time
interface RealtimeConfig {
  enableMockMode: boolean;
  mockEventInterval: number;
  retryAttempts: number;
  retryDelay: number;
  heartbeatInterval: number;
}

// تعريف السياق
interface RealtimeContextType {
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  lastEventTimestamp: Date | null;
  eventHistory: RealtimeEvent[];
  subscribe: (eventType: RealtimeEventType, callback: (event: RealtimeEvent) => void) => () => void;
  emit: (eventType: RealtimeEventType, payload: any) => void;
  clearHistory: () => void;
  getEventsByType: (eventType: RealtimeEventType) => RealtimeEvent[];
  config: RealtimeConfig;
}

// إنشاء السياق
const RealtimeContext = createContext<RealtimeContextType | null>(null);

// مولد البيانات المزيفة للتطوير
class MockRealtimeEngine {
  private eventSubscribers: Map<RealtimeEventType, Set<(event: RealtimeEvent) => void>> = new Map();
  private eventHistory: RealtimeEvent[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  // بيانات مزيفة للتجربة
  private mockData = {
    leads: [
      { name: 'أحمد محمد', phone: '0551234567', property: 'فيلا في الرياض', budget: '1,200,000 ريال' },
      { name: 'فاطمة العلي', phone: '0501234567', property: 'شقة في جدة', budget: '800,000 ريال' },
      { name: 'محمد السلمان', phone: '0561234567', property: 'أرض في الدمام', budget: '2,500,000 ريال' },
      { name: 'نورا الزهراني', phone: '0521234567', property: 'دوبلكس في مكة', budget: '950,000 ريال' },
      { name: 'خالد الشمري', phone: '0531234567', property: 'فيلا في المدينة', budget: '1,800,000 ريال' }
    ],
    tasks: [
      { title: 'متابعة عميل أحمد محمد', priority: 'high', dueDate: 'اليوم' },
      { title: 'جولة عقارية مع فاطمة', priority: 'medium', dueDate: 'غداً' },
      { title: 'إعداد عرض سعر للسيد محمد', priority: 'urgent', dueDate: 'اليوم' },
      { title: 'مراجعة المستندات القانونية', priority: 'low', dueDate: 'الأسبوع القادم' },
      { title: 'إتمام عملية البيع', priority: 'urgent', dueDate: 'اليوم' }
    ],
    activities: [
      'تم إضافة عميل جديد',
      'تم تحديث معلومات العقار',
      'تم إنجاز مهمة مهمة',
      'تم استلام استفسار جديد',
      'تم حجز موعد جولة عقارية'
    ]
  };

  start(config: RealtimeConfig) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.generateMockEvent();
    }, config.mockEventInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  subscribe(eventType: RealtimeEventType, callback: (event: RealtimeEvent) => void) {
    if (!this.eventSubscribers.has(eventType)) {
      this.eventSubscribers.set(eventType, new Set());
    }
    this.eventSubscribers.get(eventType)!.add(callback);

    return () => {
      this.eventSubscribers.get(eventType)?.delete(callback);
    };
  }

  emit(eventType: RealtimeEventType, payload: any) {
    const event: RealtimeEvent = {
      id: this.generateId(),
      type: eventType,
      payload,
      workspace_id: 'mock-workspace-1',
      user_id: 'mock-user-1',
      timestamp: new Date(),
      metadata: {
        source: 'mock-engine',
        priority: 'medium'
      }
    };

    this.eventHistory.push(event);
    this.notifySubscribers(event);
  }

  private generateMockEvent() {
    const eventTypes: RealtimeEventType[] = ['lead:new', 'task:created', 'activity:new', 'notification:new'];
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    let payload;
    let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';

    switch (randomType) {
      case 'lead:new':
        const lead = this.mockData.leads[Math.floor(Math.random() * this.mockData.leads.length)];
        payload = {
          ...lead,
          id: this.generateId(),
          status: 'جديد',
          source: 'الموقع الإلكتروني',
          created_at: new Date()
        };
        priority = Math.random() > 0.7 ? 'high' : 'medium';
        break;

      case 'task:created':
        const task = this.mockData.tasks[Math.floor(Math.random() * this.mockData.tasks.length)];
        payload = {
          ...task,
          id: this.generateId(),
          status: 'قيد التنفيذ',
          created_at: new Date()
        };
        priority = task.priority as any;
        break;

      case 'activity:new':
        payload = {
          id: this.generateId(),
          description: this.mockData.activities[Math.floor(Math.random() * this.mockData.activities.length)],
          type: 'system',
          created_at: new Date()
        };
        break;

      case 'notification:new':
        payload = {
          id: this.generateId(),
          title: 'إشعار جديد',
          message: 'لديك عميل جديد في انتظار المتابعة',
          type: 'info',
          created_at: new Date()
        };
        priority = 'high';
        break;

      default:
        return;
    }

    const event: RealtimeEvent = {
      id: this.generateId(),
      type: randomType,
      payload,
      workspace_id: 'mock-workspace-1',
      user_id: 'mock-user-1',
      timestamp: new Date(),
      metadata: {
        source: 'mock-generator',
        priority
      }
    };

    this.eventHistory.push(event);
    if (this.eventHistory.length > 100) {
      this.eventHistory = this.eventHistory.slice(-50);
    }

    this.notifySubscribers(event);
  }

  private notifySubscribers(event: RealtimeEvent) {
    const subscribers = this.eventSubscribers.get(event.type);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in event subscriber:', error);
        }
      });
    }
  }

  private generateId(): string {
    return 'mock_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  getEventHistory(): RealtimeEvent[] {
    return [...this.eventHistory];
  }

  clearHistory() {
    this.eventHistory = [];
  }

  getEventsByType(eventType: RealtimeEventType): RealtimeEvent[] {
    return this.eventHistory.filter(event => event.type === eventType);
  }
}

// مزود الخدمة للـ Real-time
export function RealtimeProvider({ children, config }: { 
  children: React.ReactNode;
  config?: Partial<RealtimeConfig>;
}) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [lastEventTimestamp, setLastEventTimestamp] = useState<Date | null>(null);
  const [eventHistory, setEventHistory] = useState<RealtimeEvent[]>([]);
  
  const mockEngineRef = useRef<MockRealtimeEngine>(new MockRealtimeEngine());
  const subscribersRef = useRef<Map<RealtimeEventType, Set<(event: RealtimeEvent) => void>>>(new Map());

  const defaultConfig: RealtimeConfig = {
    enableMockMode: true, // تفعيل وضع التجربة
    mockEventInterval: 8000, // إنتاج حدث كل 8 ثوان
    retryAttempts: 3,
    retryDelay: 1000,
    heartbeatInterval: 30000,
    ...config
  };

  // تهيئة الاتصال
  useEffect(() => {
    if (defaultConfig.enableMockMode) {
      setConnectionStatus('connecting');
      
      // محاكاة تأخير الاتصال
      setTimeout(() => {
        setConnectionStatus('connected');
        mockEngineRef.current.start(defaultConfig);
        console.log('🔗 Real-time Mock Engine Started');
      }, 1000);

      return () => {
        mockEngineRef.current.stop();
        setConnectionStatus('disconnected');
        console.log('🔌 Real-time Mock Engine Stopped');
      };
    }
  }, []);

  // تحديث التاريخ عند تلقي الأحداث
  const handleEvent = useCallback((event: RealtimeEvent) => {
    setLastEventTimestamp(event.timestamp);
    setEventHistory(prev => {
      const updated = [...prev, event];
      return updated.slice(-50); // الاحتفاظ بآخر 50 حدث
    });
  }, []);

  // اشتراك في نوع حدث معين
  const subscribe = useCallback((
    eventType: RealtimeEventType, 
    callback: (event: RealtimeEvent) => void
  ) => {
    // إضافة callback لـ handler العام
    const wrappedCallback = (event: RealtimeEvent) => {
      handleEvent(event);
      callback(event);
    };

    if (!subscribersRef.current.has(eventType)) {
      subscribersRef.current.set(eventType, new Set());
    }
    subscribersRef.current.get(eventType)!.add(wrappedCallback);

    // اشتراك في Mock Engine
    const unsubscribeFromMock = mockEngineRef.current.subscribe(eventType, wrappedCallback);

    return () => {
      subscribersRef.current.get(eventType)?.delete(wrappedCallback);
      unsubscribeFromMock();
    };
  }, [handleEvent]);

  // إرسال حدث
  const emit = useCallback((eventType: RealtimeEventType, payload: any) => {
    mockEngineRef.current.emit(eventType, payload);
  }, []);

  // مسح التاريخ
  const clearHistory = useCallback(() => {
    setEventHistory([]);
    mockEngineRef.current.clearHistory();
  }, []);

  // الحصول على الأحداث حسب النوع
  const getEventsByType = useCallback((eventType: RealtimeEventType) => {
    return mockEngineRef.current.getEventsByType(eventType);
  }, []);

  const contextValue: RealtimeContextType = {
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    lastEventTimestamp,
    eventHistory,
    subscribe,
    emit,
    clearHistory,
    getEventsByType,
    config: defaultConfig
  };

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
    </RealtimeContext.Provider>
  );
}

// Hook لاستخدام Real-time
export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}

// Hook مخصص للاشتراك في نوع حدث معين
export function useRealtimeEvent<T = any>(
  eventType: RealtimeEventType,
  callback: (payload: T, event: RealtimeEvent) => void,
  deps: any[] = []
) {
  const { subscribe } = useRealtime();

  useEffect(() => {
    const unsubscribe = subscribe(eventType, (event) => {
      callback(event.payload, event);
    });

    return unsubscribe;
  }, [eventType, subscribe, ...deps]);
}

// Hook للإحصائيات المباشرة
export function useRealtimeStats() {
  const { eventHistory, connectionStatus, lastEventTimestamp } = useRealtime();

  const stats = {
    totalEvents: eventHistory.length,
    eventsByType: eventHistory.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<RealtimeEventType, number>),
    lastEventTime: lastEventTimestamp,
    connectionStatus,
    eventsInLastHour: eventHistory.filter(
      event => new Date().getTime() - event.timestamp.getTime() < 3600000
    ).length
  };

  return stats;
}

// Hook للإشعارات المباشرة
export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<RealtimeEvent[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useRealtimeEvent('notification:new', (payload, event) => {
    setNotifications(prev => [event, ...prev].slice(0, 20));
    setUnreadCount(prev => prev + 1);
  });

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
    markAsRead,
    clearNotifications
  };
}

// مكون عرض حالة الاتصال
export function RealtimeStatus() {
  const { connectionStatus, isConnected, lastEventTimestamp } = useRealtime();

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'reconnecting': return 'text-orange-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'متصل';
      case 'connecting': return 'جاري الاتصال...';
      case 'reconnecting': return 'إعادة الاتصال...';
      case 'error': return 'خطأ في الاتصال';
      default: return 'غير متصل';
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
      <span className={getStatusColor()}>{getStatusText()}</span>
      {lastEventTimestamp && (
        <span className="text-gray-500 text-xs">
          آخر تحديث: {lastEventTimestamp.toLocaleTimeString('ar-SA')}
        </span>
      )}
    </div>
  );
}

export default useRealtime;