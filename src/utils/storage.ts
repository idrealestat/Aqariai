// /utils/storage.ts
// Unified storage system with IndexedDB + localStorage fallback

const DB_NAME = 'AqaryDB';
const DB_VERSION = 1;
const NOTIFICATIONS_STORE = 'notifications';

type StorageType = 'indexeddb' | 'localstorage';

class StorageManager {
  private db: IDBDatabase | null = null;
  private storageType: StorageType = 'localstorage';
  private initPromise: Promise<void> | null = null;
  private isInitializing = false;

  /**
   * Initialize storage - يحاول IndexedDB أولاً، ثم localStorage
   */
  async initialize(): Promise<void> {
    // منع تهيئة متعددة
    if (this.initPromise) {
      return this.initPromise;
    }

    if (this.isInitializing) {
      return;
    }

    this.isInitializing = true;

    this.initPromise = new Promise<void>(async (resolve) => {
      try {
        // محاولة استخدام IndexedDB
        if (typeof window !== 'undefined' && 'indexedDB' in window) {
          await this.initIndexedDB();
          this.storageType = 'indexeddb';
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Storage: Using IndexedDB');
          }
        } else {
          throw new Error('IndexedDB not available');
        }
      } catch (error) {
        // Fallback إلى localStorage
        this.storageType = 'localstorage';
        if (process.env.NODE_ENV === 'development') {
          console.log('⚠️ Storage: Falling back to localStorage', error);
        }
      } finally {
        this.isInitializing = false;
        resolve();
      }
    });

    return this.initPromise;
  }

  private initIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window not available'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('IndexedDB failed to open'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // إنشاء object store للإشعارات
        if (!db.objectStoreNames.contains(NOTIFICATIONS_STORE)) {
          const objectStore = db.createObjectStore(NOTIFICATIONS_STORE, { 
            keyPath: 'id' 
          });
          
          // إنشاء indexes للبحث السريع
          objectStore.createIndex('source', 'source', { unique: false });
          objectStore.createIndex('category', 'category', { unique: false });
          objectStore.createIndex('createdAt', 'createdAt', { unique: false });
          objectStore.createIndex('read', 'read', { unique: false });
        }
      };
    });
  }

  /**
   * Get all notifications
   */
  async getNotifications(): Promise<any[]> {
    await this.initialize();

    if (this.storageType === 'indexeddb' && this.db) {
      return this.getFromIndexedDB();
    } else {
      return this.getFromLocalStorage();
    }
  }

  private getFromIndexedDB(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = this.db.transaction([NOTIFICATIONS_STORE], 'readonly');
        const objectStore = transaction.objectStore(NOTIFICATIONS_STORE);
        const request = objectStore.getAll();

        request.onsuccess = () => {
          resolve(request.result || []);
        };

        request.onerror = () => {
          // Fallback to localStorage on error
          resolve(this.getFromLocalStorage());
        };
      } catch (error) {
        resolve(this.getFromLocalStorage());
      }
    });
  }

  private getFromLocalStorage(): any[] {
    try {
      if (typeof window === 'undefined') return [];
      const stored = localStorage.getItem('aqar_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Save notifications
   */
  async saveNotifications(notifications: any[]): Promise<void> {
    await this.initialize();

    if (this.storageType === 'indexeddb' && this.db) {
      await this.saveToIndexedDB(notifications);
    } else {
      this.saveToLocalStorage(notifications);
    }
  }

  private saveToIndexedDB(notifications: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = this.db.transaction([NOTIFICATIONS_STORE], 'readwrite');
        const objectStore = transaction.objectStore(NOTIFICATIONS_STORE);

        // مسح البيانات القديمة
        objectStore.clear();

        // إضافة البيانات الجديدة
        notifications.forEach(notif => {
          objectStore.add(notif);
        });

        transaction.oncomplete = () => {
          resolve();
        };

        transaction.onerror = () => {
          // Fallback to localStorage on error
          this.saveToLocalStorage(notifications);
          resolve();
        };
      } catch (error) {
        this.saveToLocalStorage(notifications);
        resolve();
      }
    });
  }

  private saveToLocalStorage(notifications: any[]): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem('aqar_notifications', JSON.stringify(notifications));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to save to localStorage:', error);
      }
    }
  }

  /**
   * Add single notification
   */
  async addNotification(notification: any): Promise<void> {
    await this.initialize();

    if (this.storageType === 'indexeddb' && this.db) {
      await this.addToIndexedDB(notification);
    } else {
      this.addToLocalStorage(notification);
    }
  }

  private addToIndexedDB(notification: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = this.db.transaction([NOTIFICATIONS_STORE], 'readwrite');
        const objectStore = transaction.objectStore(NOTIFICATIONS_STORE);
        
        const request = objectStore.add(notification);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          // Fallback to localStorage
          this.addToLocalStorage(notification);
          resolve();
        };
      } catch (error) {
        this.addToLocalStorage(notification);
        resolve();
      }
    });
  }

  private addToLocalStorage(notification: any): void {
    try {
      const notifications = this.getFromLocalStorage();
      notifications.unshift(notification);
      this.saveToLocalStorage(notifications.slice(0, 1000)); // cap at 1000
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to add to localStorage:', error);
      }
    }
  }

  /**
   * Update notification
   */
  async updateNotification(id: string, updates: Partial<any>): Promise<void> {
    await this.initialize();

    if (this.storageType === 'indexeddb' && this.db) {
      await this.updateInIndexedDB(id, updates);
    } else {
      this.updateInLocalStorage(id, updates);
    }
  }

  private updateInIndexedDB(id: string, updates: Partial<any>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = this.db.transaction([NOTIFICATIONS_STORE], 'readwrite');
        const objectStore = transaction.objectStore(NOTIFICATIONS_STORE);
        
        const getRequest = objectStore.get(id);

        getRequest.onsuccess = () => {
          const notification = getRequest.result;
          if (notification) {
            const updated = { ...notification, ...updates };
            objectStore.put(updated);
          }
        };

        transaction.oncomplete = () => {
          resolve();
        };

        transaction.onerror = () => {
          this.updateInLocalStorage(id, updates);
          resolve();
        };
      } catch (error) {
        this.updateInLocalStorage(id, updates);
        resolve();
      }
    });
  }

  private updateInLocalStorage(id: string, updates: Partial<any>): void {
    try {
      const notifications = this.getFromLocalStorage();
      const index = notifications.findIndex(n => n.id === id);
      
      if (index >= 0) {
        notifications[index] = { ...notifications[index], ...updates };
        this.saveToLocalStorage(notifications);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to update in localStorage:', error);
      }
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(id: string): Promise<void> {
    await this.initialize();

    if (this.storageType === 'indexeddb' && this.db) {
      await this.deleteFromIndexedDB(id);
    } else {
      this.deleteFromLocalStorage(id);
    }
  }

  private deleteFromIndexedDB(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = this.db.transaction([NOTIFICATIONS_STORE], 'readwrite');
        const objectStore = transaction.objectStore(NOTIFICATIONS_STORE);
        
        objectStore.delete(id);

        transaction.oncomplete = () => {
          resolve();
        };

        transaction.onerror = () => {
          this.deleteFromLocalStorage(id);
          resolve();
        };
      } catch (error) {
        this.deleteFromLocalStorage(id);
        resolve();
      }
    });
  }

  private deleteFromLocalStorage(id: string): void {
    try {
      const notifications = this.getFromLocalStorage();
      const filtered = notifications.filter(n => n.id !== id);
      this.saveToLocalStorage(filtered);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to delete from localStorage:', error);
      }
    }
  }

  /**
   * Query notifications with filters
   */
  async queryNotifications(filter: {
    source?: string;
    category?: string;
    unreadOnly?: boolean;
    limit?: number;
  } = {}): Promise<any[]> {
    const notifications = await this.getNotifications();
    
    let filtered = notifications;

    if (filter.source) {
      filtered = filtered.filter(n => n.source === filter.source);
    }

    if (filter.category) {
      filtered = filtered.filter(n => n.category === filter.category);
    }

    if (filter.unreadOnly) {
      filtered = filtered.filter(n => !n.read);
    }

    // Sort by createdAt (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    if (filter.limit) {
      filtered = filtered.slice(0, filter.limit);
    }

    return filtered;
  }

  /**
   * Clear all notifications
   */
  async clearAll(): Promise<void> {
    await this.initialize();

    if (this.storageType === 'indexeddb' && this.db) {
      await this.clearIndexedDB();
    } else {
      this.clearLocalStorage();
    }
  }

  private clearIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = this.db.transaction([NOTIFICATIONS_STORE], 'readwrite');
        const objectStore = transaction.objectStore(NOTIFICATIONS_STORE);
        
        objectStore.clear();

        transaction.oncomplete = () => {
          resolve();
        };

        transaction.onerror = () => {
          this.clearLocalStorage();
          resolve();
        };
      } catch (error) {
        this.clearLocalStorage();
        resolve();
      }
    });
  }

  private clearLocalStorage(): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem('aqar_notifications');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to clear localStorage:', error);
      }
    }
  }

  /**
   * Migrate from localStorage to IndexedDB
   */
  async migrateToIndexedDB(): Promise<void> {
    if (this.storageType !== 'indexeddb') return;

    try {
      const localData = this.getFromLocalStorage();
      if (localData.length > 0) {
        await this.saveToIndexedDB(localData);
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Migrated ${localData.length} notifications to IndexedDB`);
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Migration failed:', error);
      }
    }
  }

  /**
   * Get storage type
   */
  getStorageType(): StorageType {
    return this.storageType;
  }

  /**
   * Get storage info
   */
  async getStorageInfo(): Promise<{
    type: StorageType;
    count: number;
    unreadCount: number;
  }> {
    const notifications = await this.getNotifications();
    return {
      type: this.storageType,
      count: notifications.length,
      unreadCount: notifications.filter(n => !n.read).length
    };
  }
}

// Singleton instance
export const storageManager = new StorageManager();

// Export for convenience
export default storageManager;
