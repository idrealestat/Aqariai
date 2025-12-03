// /public/sw.js
// Simple Service Worker for Aqary CRM - Push Notifications Support
// Version: 1.0.0

const CACHE_NAME = 'aqary-crm-v1';
const CACHE_URLS = [
  '/',
  '/index.html'
];

// Install event - caching static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(CACHE_URLs);
    }).catch((error) => {
      console.error('[SW] Cache installation failed:', error);
    })
  );
  
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - cleaning up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  
  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone();
        
        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request);
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let notificationData = {
    title: 'عقاري CRM',
    body: 'لديك إشعار جديد',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: 'aqary-notification',
    requireInteraction: false
  };

  // Parse push data if available
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || data.message || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        tag: data.tag || notificationData.tag,
        data: data.payload || {},
        requireInteraction: data.severity === 'critical'
      };
    } catch (error) {
      console.error('[SW] Error parsing push data:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();

  // Get the URL to open (from notification data or default to app)
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if not already open
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background sync event (for offline functionality)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

// Sync notifications function
async function syncNotifications() {
  try {
    // Get pending notifications from IndexedDB
    const db = await openIndexedDB();
    const pendingNotifications = await getPendingNotifications(db);
    
    if (pendingNotifications.length > 0) {
      // Send to server
      await fetch('/api/notifications/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications: pendingNotifications })
      });
      
      // Clear pending notifications
      await clearPendingNotifications(db);
      
      console.log('[SW] Synced', pendingNotifications.length, 'notifications');
    }
  } catch (error) {
    console.error('[SW] Sync failed:', error);
    throw error; // Retry sync
  }
}

// IndexedDB helpers (minimal implementation)
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AqaryDB', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getPendingNotifications(db) {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(['notifications'], 'readonly');
      const store = transaction.objectStore('notifications');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    } catch (error) {
      resolve([]);
    }
  });
}

function clearPendingNotifications(db) {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(['notifications'], 'readwrite');
      const store = transaction.objectStore('notifications');
      store.clear();
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve();
    } catch (error) {
      resolve();
    }
  });
}

console.log('[SW] Service Worker loaded');
