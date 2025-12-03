// /utils/performance.ts
// Performance utilities - Debounce, Throttle, and optimization helpers

/**
 * Debounce function - يؤخر تنفيذ الدالة حتى تتوقف الاستدعاءات لمدة معينة
 * مفيد للبحث، الكتابة، تحديثات الحقول
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - يسمح بتنفيذ الدالة مرة واحدة فقط خلال فترة زمنية
 * مفيد للـ scroll events، resize، mouse move
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number = 300
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Deep comparison - مقارنة عميقة بين كائنين
 * مفيد لـ React.memo و shouldComponentUpdate
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== 'object' || obj1 === null ||
      typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Shallow comparison - مقارنة سطحية (أسرع)
 */
export function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== 'object' || obj1 === null ||
      typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
}

/**
 * Request Animation Frame wrapper - للتحديثات السلسة
 */
export function rafDebounce<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function executedFunction(...args: Parameters<T>) {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    
    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
}

/**
 * Batch updates - تجميع التحديثات
 */
export class BatchUpdater<T> {
  private queue: T[] = [];
  private timeout: NodeJS.Timeout | null = null;
  private callback: (items: T[]) => void;
  private delay: number;

  constructor(callback: (items: T[]) => void, delay: number = 100) {
    this.callback = callback;
    this.delay = delay;
  }

  add(item: T): void {
    this.queue.push(item);

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.flush();
    }, this.delay);
  }

  flush(): void {
    if (this.queue.length > 0) {
      this.callback([...this.queue]);
      this.queue = [];
    }
    this.timeout = null;
  }

  clear(): void {
    this.queue = [];
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}

/**
 * Memoize function - حفظ نتائج الدوال المكلفة
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = keyGenerator 
      ? keyGenerator(...args) 
      : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private marks = new Map<string, number>();

  start(label: string): void {
    this.marks.set(label, performance.now());
  }

  end(label: string, log: boolean = false): number {
    const start = this.marks.get(label);
    if (!start) {
      console.warn(`Performance mark "${label}" not found`);
      return 0;
    }

    const duration = performance.now() - start;
    this.marks.delete(label);

    if (log && process.env.NODE_ENV === 'development') {
      console.log(`⏱️ [Performance] ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  measure(label: string, callback: () => void): number {
    this.start(label);
    callback();
    return this.end(label);
  }
}

export const perfMonitor = new PerformanceMonitor();
