/**
 * 🔴 مؤشر الردود الجديدة
 * ────────────────────────────────────────────────────────────────
 * 📌 الهدف: دائرة حمراء نابضة على العروض/الطلبات التي لها ردود جديدة
 * 📌 التصميم: دائرة حمراء مع animation نابض
 * ────────────────────────────────────────────────────────────────
 */

import { Badge } from '../ui/badge';

interface UnreadIndicatorProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'top-left' | 'inline';
  className?: string;
}

export function UnreadIndicator({ 
  count, 
  size = 'md',
  position = 'top-right',
  className = '' 
}: UnreadIndicatorProps) {
  if (count === 0) return null;

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const positionClasses = {
    'top-right': 'absolute -top-1 -right-1',
    'top-left': 'absolute -top-1 -left-1',
    'inline': 'inline-block'
  };

  // دائرة حمراء نابضة بسيطة
  if (count <= 3) {
    return (
      <div 
        className={`${sizeClasses[size]} ${positionClasses[position]} ${className}`}
        aria-label={`${count} رد جديد`}
      >
        {/* الدائرة الرئيسية */}
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse" />
          {/* الهالة النابضة */}
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
        </div>
      </div>
    );
  }

  // Badge مع عدد الردود
  return (
    <Badge 
      className={`${positionClasses[position]} bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center p-0 px-1.5 animate-pulse border-2 border-white ${className}`}
      aria-label={`${count} رد جديد`}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
}

/**
 * 🔴 دالة مساعدة: حساب عدد الردود الجديدة
 */
export function getUnreadResponsesCount(responses: any[]): number {
  if (!responses || !Array.isArray(responses)) return 0;
  return responses.filter(r => r.status === 'pending' && !r.ownerViewed).length;
}

/**
 * 🔴 دالة مساعدة: التحقق من وجود ردود جديدة
 */
export function hasUnreadResponses(offer: any): boolean {
  const responses = offer.responses || offer.brokerResponses || [];
  return getUnreadResponsesCount(responses) > 0;
}
