// /core/ai-cores/AI_NotificationsEnhancedCore.ts
// Enhanced Notifications Core - ربط الإشعارات مع المساعد الذكي (actions, analysis, context-actions)
// يعتمد على خدمات API موجودة في /services/apiClients.ts
// ويعرض واجهة للاشتراك receive/subscribe وcontext actions لتنفيذ UI-driven commands.

import Api from '../../services/apiClients';
import { sendToKernel } from '../kernel/useKernel'; // لإبلاغ النواة (optional)
import storageManager from '../../utils/storage'; // ✅ استخدام نظام التخزين المُحسّن
import { debounce } from '../../utils/performance'; // ✅ استخدام debouncing

// In-memory storage for notifications (short-term). In prod: use DB or sync with server.
const NOTIF_STORE_KEY = 'aqar_notifications';
type Notification = {
  id: string;
  source: string;      // e.g., 'customer_management', 'appointments', 'social_media'
  category: string;    // e.g., 'customer', 'appointment', 'social'
  type: string;        // e.g., 'created','updated','reminder'
  targetId?: string;   // e.g., customerId or appointmentId
  payload?: any;
  createdAt: string;   // ISO
  read?: boolean;
  severity?: 'info'|'warning'|'critical';
};

let subscribers: Array<(notif: Notification)=>void> = [];

// ✅ إضافة flags لمنع التكرار
let isInitialized = false;
let eventListenerAttached = false;
let lastNotificationId: string | null = null;

// ✅ إضافة cache للـ localStorage (fallback فقط)
let cachedStore: Notification[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 1000; // 1 second

// ✅ Debounced save للتحسين
const debouncedSaveToStorage = debounce(async (notifications: Notification[]) => {
  try {
    await storageManager.saveNotifications(notifications);
  } catch (error) {
    // Fallback to localStorage
    saveStore(notifications);
  }
}, 300);

// helpers: local store (fallback فقط)
function loadStore(): Notification[] {
  try {
    if (typeof window === 'undefined') return [];
    
    // ✅ استخدام cache إذا كان حديثاً
    const now = Date.now();
    if (cachedStore && (now - cacheTimestamp) < CACHE_DURATION) {
      return cachedStore;
    }
    
    const raw = localStorage.getItem(NOTIF_STORE_KEY);
    const store = raw ? JSON.parse(raw) : [];
    
    // ✅ حفظ في cache
    cachedStore = store;
    cacheTimestamp = now;
    
    return store;
  } catch {
    return [];
  }
}

function saveStore(arr: Notification[]) {
  try {
    if (typeof window === 'undefined') return;
    
    // ✅ مقارنة قبل الحفظ
    const currentRaw = localStorage.getItem(NOTIF_STORE_KEY);
    const newRaw = JSON.stringify(arr);
    
    if (currentRaw === newRaw) {
      return; // لا تغيير، لا حاجة للحفظ
    }
    
    localStorage.setItem(NOTIF_STORE_KEY, newRaw);
    
    // ✅ تحديث cache
    cachedStore = arr;
    cacheTimestamp = Date.now();
  } catch {}
}

// push notification locally and notify subscribers
async function pushNotificationLocal(n: Notification) {
  // ✅ منع التكرار - التحقق من آخر ID
  if (n.id === lastNotificationId) {
    return; // تم إرسال هذا الإشعار مسبقاً
  }
  
  const store = loadStore();
  
  // ✅ التحقق من عدم وجود نفس الإشعار
  const exists = store.find(s => s.id === n.id);
  if (exists) {
    return; // الإشعار موجود بالفعل
  }
  
  store.unshift(n); // newest first
  saveStore(store.slice(0, 1000)); // cap
  
  // ✅ حفظ آخر ID
  lastNotificationId = n.id;
  
  // notify subscribers
  subscribers.forEach(cb => {
    try { cb(n); } catch (e) { 
      // ✅ تقليل console - فقط في حالة الأخطاء المهمة
      if (process.env.NODE_ENV === 'development') {
        console.error('⚠️ Notification subscriber error:', e);
      }
    }
  });
}

// Public API: subscribe/unsubscribe
export function subscribeToNotifications(cb: (notif: Notification)=>void) {
  // ✅ منع إضافة نفس subscriber مرتين
  if (subscribers.includes(cb)) {
    return () => { subscribers = subscribers.filter(x => x !== cb); };
  }
  
  subscribers.push(cb);
  
  // return unsubscribe
  return () => { subscribers = subscribers.filter(x => x !== cb); };
}

// Create notification on server (if supported) and push local copy
export async function createAINotification(payload: {
  source: string;
  category: string;
  type: string;
  targetId?: string;
  payload?: any;
  severity?: 'info'|'warning'|'critical';
}) {
  try {
    // try server endpoint (best-effort)
    const body = { ...payload };
    // If API exists, call it; otherwise we still push locally
    let serverRes = null;
    try {
      serverRes = await fetch('/api/notifications/create', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(r => r.ok ? r.json().catch(()=>null) : null);
    } catch { serverRes = null; }

    const notif: Notification = {
      id: (serverRes && serverRes.id) || `ai-${Date.now()}`,
      source: payload.source,
      category: payload.category,
      type: payload.type,
      targetId: payload.targetId,
      payload: payload.payload || {},
      createdAt: (new Date()).toISOString(),
      read: false,
      severity: payload.severity || 'info'
    };

    await pushNotificationLocal(notif);
    // optionally inform kernel (so DecisionCore/AI can reason about it)
    try { await sendToKernel('system', `notification_received:${notif.id}`); } catch {}
    return notif;
  } catch (err) {
    console.error('createAINotification error', err);
    throw err;
  }
}

// mark as read / unread
export function markNotificationRead(id: string, read = true) {
  const store = loadStore();
  const idx = store.findIndex(s => s.id === id);
  if (idx >= 0) {
    store[idx].read = read;
    saveStore(store);
  }
}

// query methods
export function listNotifications(filter: { unreadOnly?: boolean; source?: string; category?: string } = {}) {
  let store = loadStore();
  if (filter.unreadOnly) store = store.filter(s => !s.read);
  if (filter.source) store = store.filter(s => s.source === filter.source);
  if (filter.category) store = store.filter(s => s.category === filter.category);
  return store.slice(0, 200);
}

export function countUnread() {
  const store = loadStore();
  return store.filter(s => !s.read).length;
}

// --- Context actions (execute UI/flow actions based on notifications) ---
// These functions are small command shims the UI will call (or DecisionCore).
export async function contextAction_openCustomerCard(customerId: string, setMessages?: any) {
  if (!customerId) return;
  // fetch customer via API to display inline
  try {
    const cust = await Api.getCustomerByIdAPI(customerId);
    // push a message to assistant chat if setMessages provided
    if (setMessages) setMessages((prev:any[]) => [...prev, { from: 'ai', text: `📇 ${cust.name} — ${cust.phone || '-'} — ${cust.email || '-'}` }]);
    // navigate
    if (typeof window !== 'undefined') window.location.hash = `#/crm/customers/${customerId}`;
  } catch (err) {
    console.error('openCustomerCard error', err);
    if (setMessages) setMessages((prev:any[]) => [...prev, { from: 'ai', text: `ما قدرت أفتح بطاقة العميل — صار خطأ.` }]);
  }
}

export function contextAction_openCalendarAt(isoDate: string) {
  // navigate to calendar and (if available) highlight date
  if (typeof window !== 'undefined') {
    const dateParam = isoDate ? `?date=${encodeURIComponent(isoDate)}` : '';
    window.location.hash = `#/calendar${dateParam}`;
  }
}

// analyze notifications: summary counts and quick trends (local)
export function analyzeNotifications() {
  const store = loadStore();
  const summary = {
    total: store.length,
    unread: store.filter(s => !s.read).length,
    bySource: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    byType: {} as Record<string, number>,
    recent: store.slice(0,5)
  };
  store.forEach(s => {
    summary.bySource[s.source] = (summary.bySource[s.source] || 0) + 1;
    summary.byCategory[s.category] = (summary.byCategory[s.category] || 0) + 1;
    summary.byType[s.type] = (summary.byType[s.type] || 0) + 1;
  });
  return summary;
}

// internal: convert server payload (any) -> Notification normalized
function normalizeServerNotification(raw:any): Notification {
  return {
    id: raw.id || `notif-${Date.now()}`,
    source: raw.source || raw.module || 'system',
    category: raw.category || raw.type || 'general',
    type: raw.event || raw.action || 'updated',
    targetId: raw.targetId || raw.customerId || raw.appointmentId || null,
    payload: raw.payload || raw.data || {},
    createdAt: raw.createdAt || (new Date()).toISOString(),
    read: !!raw.read,
    severity: raw.severity || 'info'
  };
}

// handle incoming server event (use this for realtime websockets or polling)
export async function handleIncomingNotification(raw:any) {
  try {
    const notif = normalizeServerNotification(raw);
    await pushNotificationLocal(notif);

    // auto-handle: if customer update -> optionally open card or inform AI
    if (notif.category === 'customer' && notif.type === 'updated' && notif.targetId) {
      // inform kernel to reason (optional)
      try { await sendToKernel('system', `customer_updated:${notif.targetId}`); } catch {}
    }

    // if appointment reminder -> open calendar or push chat message
    if (notif.category === 'appointment' && (notif.type === 'reminder' || notif.type === 'created')) {
      try { await sendToKernel('system', `appointment_event:${notif.targetId || notif.id}`); } catch {}
    }

    return notif;
  } catch (err) {
    console.error('handleIncomingNotification error', err);
    throw err;
  }
}

// Realtime subscription: example to integrate with existing WebSocket/EventSource
export function initializeNotificationsRealtime(options: { socket?: WebSocket | null } = {}) {
  // ✅ منع إضافة مستمع مرتين
  if (eventListenerAttached && !options.socket) {
    return; // المستمع مُضاف بالفعل
  }
  
  // If socket passed, hook it; otherwise try EventSource / window events
  if (options.socket) {
    options.socket.addEventListener('message', ev => {
      try {
        const raw = JSON.parse(ev.data);
        handleIncomingNotification(raw).catch(()=>{});
      } catch {}
    });
    return;
  }

  // fallback: listen to window custom event "aqar:notification"
  if (typeof window !== 'undefined' && !eventListenerAttached) {
    const handler = (e:any) => {
      if (e && e.detail) handleIncomingNotification(e.detail).catch(()=>{});
    };
    
    window.addEventListener('aqar:notification', handler);
    eventListenerAttached = true;
    
    // ✅ إضافة cleanup function
    if (typeof window !== 'undefined') {
      (window as any).__aqarNotifCleanup = () => {
        window.removeEventListener('aqar:notification', handler);
        eventListenerAttached = false;
      };
    }
  }
}

// Convenience: boot integration - to call once from App.tsx or AI_BubbleAssistant
export function initializeNotificationsIntegration() {
  // ✅ منع تشغيل التهيئة مرتين
  if (isInitialized) {
    return;
  }
  
  isInitialized = true;
  
  // try to fetch recent notifications from server
  (async () => {
    try {
      const recent = await Api.searchArchiveAPI ? [] : []; // placeholder - if server has /notifications endpoint, call it
      // no-op if not available; rely on realtime events
    } catch {}
    // bind to realtime default (window event)
    initializeNotificationsRealtime({});
  })();
}

export default {
  subscribeToNotifications,
  createAINotification,
  markNotificationRead,
  listNotifications,
  countUnread,
  contextAction_openCustomerCard,
  contextAction_openCalendarAt,
  analyzeNotifications,
  handleIncomingNotification,
  initializeNotificationsIntegration
};

// ✅ إضافة دالة لإعادة تعيين النظام (للتطوير)
export function resetNotificationsSystem() {
  isInitialized = false;
  eventListenerAttached = false;
  lastNotificationId = null;
  cachedStore = null;
  cacheTimestamp = 0;
  subscribers = [];
  
  if (typeof window !== 'undefined' && (window as any).__aqarNotifCleanup) {
    (window as any).__aqarNotifCleanup();
  }
}