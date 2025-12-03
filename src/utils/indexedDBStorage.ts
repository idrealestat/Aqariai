/**
 * 💾 نظام تخزين IndexedDB للصور والفيديو
 * ────────────────────────────────────────────────────────────────
 * 📌 الهدف: تخزين الصور والفيديو بالحجم الكامل بدون ضغط
 * 📌 السبب: localStorage محدود (5-10 MB) لكن IndexedDB يدعم GB
 * ────────────────────────────────────────────────────────────────
 */

const DB_NAME = 'AqaryCRM_MediaStorage';
const DB_VERSION = 1;
const STORE_NAME = 'media';

interface MediaItem {
  id: string;
  offerId: string;
  type: 'image' | 'video';
  data: string; // Base64
  createdAt: string;
}

/**
 * فتح قاعدة البيانات
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('❌ [IndexedDB] فشل فتح قاعدة البيانات:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      console.log('✅ [IndexedDB] تم فتح قاعدة البيانات بنجاح');
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // إنشاء Store إذا لم يكن موجوداً
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('offerId', 'offerId', { unique: false });
        console.log('✅ [IndexedDB] تم إنشاء Object Store:', STORE_NAME);
      }
    };
  });
}

/**
 * حفظ صورة/فيديو في IndexedDB
 */
export async function saveMediaToIndexedDB(
  offerId: string,
  type: 'image' | 'video',
  dataUrl: string
): Promise<string> {
  try {
    const db = await openDB();
    const mediaId = `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const mediaItem: MediaItem = {
      id: mediaId,
      offerId,
      type,
      data: dataUrl,
      createdAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(mediaItem);

      request.onsuccess = () => {
        console.log(`✅ [IndexedDB] تم حفظ ${type}:`, mediaId);
        resolve(mediaId);
      };

      request.onerror = () => {
        console.error(`❌ [IndexedDB] فشل حفظ ${type}:`, request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('❌ [IndexedDB] خطأ في saveMediaToIndexedDB:', error);
    throw error;
  }
}

/**
 * حفظ عدة صور/فيديو دفعة واحدة
 */
export async function saveMultipleMediaToIndexedDB(
  offerId: string,
  items: { type: 'image' | 'video'; dataUrl: string }[]
): Promise<string[]> {
  try {
    const mediaIds: string[] = [];
    
    for (const item of items) {
      const mediaId = await saveMediaToIndexedDB(offerId, item.type, item.dataUrl);
      mediaIds.push(mediaId);
    }
    
    console.log(`✅ [IndexedDB] تم حفظ ${items.length} ملف لـ offerId:`, offerId);
    return mediaIds;
  } catch (error) {
    console.error('❌ [IndexedDB] خطأ في saveMultipleMediaToIndexedDB:', error);
    throw error;
  }
}

/**
 * جلب صورة/فيديو من IndexedDB
 */
export async function getMediaFromIndexedDB(mediaId: string): Promise<string | null> {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(mediaId);

      request.onsuccess = () => {
        const mediaItem = request.result as MediaItem | undefined;
        if (mediaItem) {
          console.log(`✅ [IndexedDB] تم جلب ${mediaItem.type}:`, mediaId);
          resolve(mediaItem.data);
        } else {
          console.warn(`⚠️ [IndexedDB] لم يتم العثور على media:`, mediaId);
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error('❌ [IndexedDB] فشل جلب media:', request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('❌ [IndexedDB] خطأ في getMediaFromIndexedDB:', error);
    return null;
  }
}

/**
 * جلب جميع الصور/الفيديو لعرض معين
 */
export async function getAllMediaForOffer(offerId: string): Promise<MediaItem[]> {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('offerId');
      const request = index.getAll(offerId);

      request.onsuccess = () => {
        const items = request.result as MediaItem[];
        console.log(`✅ [IndexedDB] تم جلب ${items.length} ملف لـ offerId:`, offerId);
        resolve(items);
      };

      request.onerror = () => {
        console.error('❌ [IndexedDB] فشل جلب media للعرض:', request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('❌ [IndexedDB] خطأ في getAllMediaForOffer:', error);
    return [];
  }
}

/**
 * جلب عدة صور/فيديو دفعة واحدة
 */
export async function getMultipleMediaFromIndexedDB(mediaIds: string[]): Promise<Record<string, string>> {
  try {
    const result: Record<string, string> = {};
    
    for (const mediaId of mediaIds) {
      const data = await getMediaFromIndexedDB(mediaId);
      if (data) {
        result[mediaId] = data;
      }
    }
    
    console.log(`✅ [IndexedDB] تم جلب ${Object.keys(result).length}/${mediaIds.length} ملف`);
    return result;
  } catch (error) {
    console.error('❌ [IndexedDB] خطأ في getMultipleMediaFromIndexedDB:', error);
    return {};
  }
}

/**
 * 🆕 جلب عدة صور/فيديو بتفاصيلها الكاملة (للعرض)
 * تستخدم في OfferDetailsPage لعرض الصور والفيديو
 */
export async function loadMediaFromIndexedDB(mediaIds: string[]): Promise<Array<{id: string, type: 'image' | 'video', dataUrl: string}>> {
  try {
    const db = await openDB();
    const results: Array<{id: string, type: 'image' | 'video', dataUrl: string}> = [];

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      let completedRequests = 0;
      const totalRequests = mediaIds.length;

      if (totalRequests === 0) {
        resolve([]);
        db.close();
        return;
      }

      mediaIds.forEach((mediaId) => {
        const request = store.get(mediaId);

        request.onsuccess = () => {
          const mediaItem = request.result as MediaItem | undefined;
          if (mediaItem) {
            results.push({
              id: mediaItem.id,
              type: mediaItem.type,
              dataUrl: mediaItem.data
            });
          } else {
            console.warn(`⚠️ [IndexedDB] لم يتم العثور على media:`, mediaId);
          }

          completedRequests++;
          if (completedRequests === totalRequests) {
            console.log(`✅ [IndexedDB] تم جلب ${results.length}/${totalRequests} ملف بالتفاصيل`);
            resolve(results);
          }
        };

        request.onerror = () => {
          console.error('❌ [IndexedDB] فشل جلب media:', mediaId, request.error);
          completedRequests++;
          if (completedRequests === totalRequests) {
            resolve(results);
          }
        };
      });

      transaction.oncomplete = () => {
        db.close();
      };

      transaction.onerror = () => {
        console.error('❌ [IndexedDB] خطأ في transaction:', transaction.error);
        reject(transaction.error);
        db.close();
      };
    });
  } catch (error) {
    console.error('❌ ❌ خطأ في تحميل الميديا:', error);
    return [];
  }
}

/**
 * حذف صورة/فيديو من IndexedDB
 */
export async function deleteMediaFromIndexedDB(mediaId: string): Promise<boolean> {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(mediaId);

      request.onsuccess = () => {
        console.log('✅ [IndexedDB] تم حذف media:', mediaId);
        resolve(true);
      };

      request.onerror = () => {
        console.error('❌ [IndexedDB] فشل حذف media:', request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('❌ [IndexedDB] خطأ في deleteMediaFromIndexedDB:', error);
    return false;
  }
}

/**
 * حذف جميع الصور/الفيديو لعرض معين
 */
export async function deleteAllMediaForOffer(offerId: string): Promise<boolean> {
  try {
    const mediaItems = await getAllMediaForOffer(offerId);
    
    for (const item of mediaItems) {
      await deleteMediaFromIndexedDB(item.id);
    }
    
    console.log(`✅ [IndexedDB] تم حذف ${mediaItems.length} ملف لـ offerId:`, offerId);
    return true;
  } catch (error) {
    console.error('❌ [IndexedDB] خطأ في deleteAllMediaForOffer:', error);
    return false;
  }
}

/**
 * مسح قاعدة البيانات بالكامل (للتطوير فقط)
 */
export async function clearAllMedia(): Promise<boolean> {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('✅ [IndexedDB] تم مسح جميع الملفات');
        resolve(true);
      };

      request.onerror = () => {
        console.error('❌ [IndexedDB] فشل مسح الملفات:', request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('❌ [IndexedDB] خطأ في clearAllMedia:', error);
    return false;
  }
}