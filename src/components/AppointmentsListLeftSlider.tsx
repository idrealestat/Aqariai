import React from "react";
import { X, Filter } from "lucide-react@0.487.0";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import AppointmentCard from "./AppointmentCard";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type?: string;
  status?: string;
  reminder?: number;
}

interface AppointmentsListLeftSliderProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  filterType: string;
  setFilterType: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filteredEvents: CalendarEvent[];
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

export default function AppointmentsListLeftSlider({
  isOpen,
  onClose,
  events,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  filteredEvents,
  onEdit,
  onDelete,
}: AppointmentsListLeftSliderProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slider من اليمين للعربية */}
      <div
        className={`
          fixed top-0 left-0 h-full w-[400px] max-w-[90vw] bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#01411C] to-[#065f41] p-4 flex items-center justify-between">
          <h2 className="text-xl text-white flex items-center gap-2">
            <Filter className="w-6 h-6 text-[#D4AF37]" />
            قائمة المواعيد
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[#D4AF37] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 h-[calc(100%-80px)] overflow-y-auto">
          {/* التصفية - مصغرة */}
          <Card className="mb-4 border border-[#D4AF37]">
            <CardContent className="p-3">
              <h3 className="text-sm font-semibold text-[#01411C] mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#D4AF37]" />
                تصفية المواعيد
              </h3>
              
              {/* تصفية حسب النوع */}
              <div className="mb-3">
                <label className="text-xs text-[#01411C] mb-1 block">النوع:</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#D4AF37] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#01411C]"
                >
                  <option value="all">الكل</option>
                  <option value="meeting">اجتماع</option>
                  <option value="showing">عرض عقار</option>
                  <option value="call">مكالمة</option>
                </select>
              </div>

              {/* تصفية حسب الحالة */}
              <div>
                <label className="text-xs text-[#01411C] mb-1 block">الحالة:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#D4AF37] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#01411C]"
                >
                  <option value="all">الكل</option>
                  <option value="upcoming">قادم</option>
                  <option value="ongoing">جاري</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* عرض المواعيد المفلترة */}
          <Card className="border-2 border-[#D4AF37]">
            <CardHeader className="bg-gradient-to-r from-[#f0fdf4] to-[#fffef7] border-b-2 border-[#D4AF37]">
              <CardTitle className="text-lg text-[#01411C]">
                📋 المواعيد ({filteredEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {filteredEvents.length === 0 ? (
                  <div className="text-center text-gray-500 py-8 text-sm">
                    لا توجد مواعيد مطابقة للتصفية
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <AppointmentCard
                      key={event.id}
                      event={event}
                      onEdit={() => onEdit(event)}
                      onDelete={() => onDelete(event.id)}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
