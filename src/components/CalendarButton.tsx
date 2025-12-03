// components/CalendarButton.tsx
import React from "react";

/**
 * CalendarButton
 * - عند الضغط يفتح مودال التقويم (يستخدم prop openCalendar())
 * - الشكل: زر بسيط بحجم متوسط، أيقونة تقويم ونص "التقويم" (RTL-ready)
 * - يجب إدراجه في الواجهة الرئيسية (Header / Main).
 *
 * الاستخدام:
 * <CalendarButton onOpen={() => setIsCalendarOpen(true)} />
 */

export default function CalendarButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      aria-label="فتح التقويم"
      className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-sm hover:shadow-md focus:outline-none"
    >
      {/* أيقونة بسيطة — يمكن استبدالها بأيقونة من مكتبة lucide-react */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span className="text-sm font-medium">التقويم</span>
    </button>
  );
}
