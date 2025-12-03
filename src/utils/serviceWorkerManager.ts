// /utils/serviceWorkerManager.ts
// Service Worker Registration Manager - Safe and graceful

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private isSupported = false;
  private isRegistered = false;

  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
  }

  /**
   * Register service worker
   */
  async register(): Promise<boolean> {
    // Skip if already registered
    if (this.isRegistered) {
      return true;
    }

    // Check support
    if (!this.isSupported) {
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Service Worker not supported in this browser');
      }
      return false;
    }

    // Check if we're on localhost or HTTPS
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    const isHTTPS = window.location.protocol === 'https:';

    if (!isLocalhost && !isHTTPS) {
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Service Worker requires HTTPS (except on localhost)');
      }
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      this.isRegistered = true;

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Service Worker registered:', this.registration.scope);
      }

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              if (process.env.NODE_ENV === 'development') {
                console.log('🔄 New Service Worker available');
              }
              
              // Dispatch custom event for app to handle
              window.dispatchEvent(new CustomEvent('sw:update-available'));
            }
          });
        }
      });

      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Service Worker registration failed:', error);
      }
      return false;
    }
  }

  /**
   * Unregister service worker
   */
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const success = await this.registration.unregister();
      
      if (success) {
        this.isRegistered = false;
        this.registration = null;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Service Worker unregistered');
        }
      }
      
      return success;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Service Worker unregister failed:', error);
      }
      return false;
    }
  }

  /**
   * Request push notification permission
   */
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!this.isSupported || !('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔔 Notification permission:', permission);
      }
      
      return permission;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Notification permission request failed:', error);
      }
      return 'denied';
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(vapidPublicKey?: string): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.register();
    }

    if (!this.registration) {
      return null;
    }

    try {
      // Check if already subscribed
      const existingSubscription = await this.registration.pushManager.getSubscription();
      
      if (existingSubscription) {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Already subscribed to push notifications');
        }
        return existingSubscription;
      }

      // Request permission
      const permission = await this.requestNotificationPermission();
      
      if (permission !== 'granted') {
        if (process.env.NODE_ENV === 'development') {
          console.log('⚠️ Notification permission not granted');
        }
        return null;
      }

      // Subscribe to push
      const options: PushSubscriptionOptionsInit = {
        userVisibleOnly: true
      };

      // Add VAPID key if provided
      if (vapidPublicKey) {
        options.applicationServerKey = this.urlBase64ToUint8Array(vapidPublicKey);
      }

      const subscription = await this.registration.pushManager.subscribe(options);

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Subscribed to push notifications:', subscription);
      }

      return subscription;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Push subscription failed:', error);
      }
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      
      if (!subscription) {
        return true;
      }

      const success = await subscription.unsubscribe();
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Unsubscribed from push notifications');
      }
      
      return success;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Push unsubscribe failed:', error);
      }
      return false;
    }
  }

  /**
   * Show a local notification (without push)
   */
  async showNotification(title: string, options?: NotificationOptions): Promise<boolean> {
    if (!this.registration) {
      await this.register();
    }

    if (!this.registration) {
      return false;
    }

    try {
      const permission = await this.requestNotificationPermission();
      
      if (permission !== 'granted') {
        return false;
      }

      await this.registration.showNotification(title, {
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        ...options
      });

      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Show notification failed:', error);
      }
      return false;
    }
  }

  /**
   * Get current service worker state
   */
  getState(): {
    supported: boolean;
    registered: boolean;
    permissionGranted: boolean;
  } {
    return {
      supported: this.isSupported,
      registered: this.isRegistered,
      permissionGranted: typeof Notification !== 'undefined' && Notification.permission === 'granted'
    };
  }

  /**
   * Update service worker
   */
  async update(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      await this.registration.update();
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Service Worker updated');
      }
      
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Service Worker update failed:', error);
      }
      return false;
    }
  }

  /**
   * Helper: Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
}

// Singleton instance
export const swManager = new ServiceWorkerManager();

// Export for convenience
export default swManager;

// Auto-register on import (optional - can be disabled)
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'development') {
  window.addEventListener('load', () => {
    swManager.register().catch(() => {
      // Silent fail - service worker is optional
    });
  });
}
