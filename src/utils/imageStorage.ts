/**
 * نظام تخزين الصور باستخدام IndexedDB
 * يحل مشكلة QuotaExceededError في localStorage
 * 
 * المنهجية:
 * - من: تخزين الصور كـ Base64 في localStorage (يسبب QuotaExceededError)
 * - إلى: تخزين الصور في IndexedDB بالحجم الكامل (بدون ضغط)
 * 
 * ⚠️ تحديث: تم إيقاف الضغط التلقائي - الصور تُحفظ بالحجم الكامل
 */

const DB_NAME = 'BusinessCardImagesDB';
const DB_VERSION = 1;
const STORE_NAME = 'images';

/**
 * فتح قاعدة بيانات IndexedDB
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('فشل فتح قاعدة البيانات'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // إنشاء المخزن إذا لم يكن موجوداً
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * ضغط الصورة قبل الحفظ
 * ⚠️ هذه الدالة معطلة حالياً - الصور تُحفظ بالحجم الكامل
 * - من: صورة بحجم كامل (قد تصل إلى عدة MB)
 * - إلى: صورة مضغوطة (أقل من 500KB)
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.7
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onerror = () => reject(new Error('فشل قراءة الملف'));
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onerror = () => reject(new Error('فشل تحميل الصورة'));
      
      img.onload = () => {
        // حساب الأبعاد الجديدة مع الحفاظ على النسبة
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }
        
        // إنشاء canvas للضغط
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('فشل إنشاء سياق الرسم'));
          return;
        }
        
        // رسم الصورة المضغوطة
        ctx.drawImage(img, 0, 0, width, height);
        
        // تحويل إلى Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('فشل ضغط الصورة'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * حفظ الصورة في IndexedDB بالحجم الكامل (بدون ضغط)
 * - من: localStorage.setItem (محدود بـ 5-10MB)
 * - إلى: IndexedDB (يدعم أحجام أكبر بكثير)
 * - التحديث: حفظ الصورة بالحجم الكامل بدون ضغط
 */
export async function saveImage(
  userId: string,
  imageType: 'cover' | 'logo' | 'profile',
  file: File
): Promise<string> {
  try {
    // حفظ الصورة بالحجم الكامل بدون ضغط
    const imageBlob = file;
    
    // فتح قاعدة البيانات
    const db = await openDatabase();
    
    // إنشاء معرف فريد
    const imageId = `${userId}_${imageType}`;
    
    // حفظ الصورة
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const imageData = {
      id: imageId,
      blob: imageBlob,
      type: imageType,
      timestamp: Date.now()
    };
    
    await new Promise<void>((resolve, reject) => {
      const request = store.put(imageData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('فشل حفظ الصورة'));
    });
    
    db.close();
    
    // إرجاع URL مؤقت للعرض
    return URL.createObjectURL(imageBlob);
    
  } catch (error) {
    console.error('خطأ في حفظ الصورة:', error);
    throw error;
  }
}

/**
 * استرجاع الصورة من IndexedDB
 * - من: قراءة Base64 من localStorage
 * - إلى: قراءة Blob من IndexedDB
 * ✅ محسّن: معالجة سلسة عند عدم وجود صور
 */
export async function getImage(
  userId: string,
  imageType: 'cover' | 'logo' | 'profile'
): Promise<string | null> {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    const imageId = `${userId}_${imageType}`;
    
    const imageData = await new Promise<any>((resolve, reject) => {
      const request = store.get(imageId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('فشل استرجاع الصورة'));
    });
    
    db.close();
    
    if (imageData && imageData.blob) {
      const objectUrl = URL.createObjectURL(imageData.blob);
      console.log(`✅ تم تحميل الصورة: ${imageType}`);
      return objectUrl;
    }
    
    // 🆕 لا توجد صورة - هذا طبيعي
    console.log(`ℹ️ لا توجد صورة محفوظة: ${imageType} (سيتم استخدام placeholder)`);
    return null;
    
  } catch (error) {
    // 🆕 معالجة محسّنة للأخطاء - لا نطبع خطأ إذا كانت قاعدة البيانات فارغة
    const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
    
    // إذا كانت قاعدة البيانات غير موجودة أو فارغة، هذا طبيعي
    if (errorMessage.includes('not found') || errorMessage.includes('No such')) {
      console.log(`ℹ️ لا توجد صورة محفوظة: ${imageType}`);
    } else {
      console.warn(`⚠️ تحذير عند تحميل ${imageType}:`, errorMessage);
    }
    
    return null;
  }
}

/**
 * حذف الصورة من IndexedDB
 */
export async function deleteImage(
  userId: string,
  imageType: 'cover' | 'logo' | 'profile'
): Promise<void> {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const imageId = `${userId}_${imageType}`;
    
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(imageId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('فشل حذف الصورة'));
    });
    
    db.close();
    
  } catch (error) {
    console.error('خطأ في حذف الصورة:', error);
    throw error;
  }
}

/**
 * حذف جميع الصور للمستخدم
 */
export async function deleteAllUserImages(userId: string): Promise<void> {
  try {
    await deleteImage(userId, 'cover');
    await deleteImage(userId, 'logo');
    await deleteImage(userId, 'profile');
  } catch (error) {
    console.error('خطأ في حذف الصور:', error);
    throw error;
  }
}

/**
 * الحصول على حجم التخزين المستخدم
 */
export async function getStorageSize(): Promise<number> {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    }
    return 0;
  } catch (error) {
    console.error('خطأ في الحصول على حجم التخزين:', error);
    return 0;
  }
}

/**
 * التحقق من توفر مساحة كافية
 */
export async function hasEnoughSpace(requiredBytes: number = 10 * 1024 * 1024): Promise<boolean> {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const available = (estimate.quota || 0) - (estimate.usage || 0);
      return available >= requiredBytes;
    }
    return true; // افترض أن هناك مساحة كافية إذا لم يكن API متاحاً
  } catch (error) {
    console.error('خطأ في التحقق من المساحة:', error);
    return true;
  }
}
