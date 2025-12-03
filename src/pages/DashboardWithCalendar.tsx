// pages/DashboardWithCalendar.tsx
import React, { useState } from "react";
import CalendarButton from "../components/CalendarButton";
import CalendarModal from "../components/CalendarModal";
import useCalendar from "../hooks/useCalendar";

export default function DashboardWithCalendar() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const calendar = useCalendar();

  const handlers = {
    ...calendar,
    openCreate: (date?: string) => {
      // فتح الفورم مع تاريخ مُسبق
      setIsOpen(true);
      setEditingEvent(null);
      // invoke UI to prefill form
    },
    openEdit: (ev: any) => {
      setIsOpen(true);
      setEditingEvent(ev);
    },
    cancelEdit: () => {
      setEditingEvent(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-end">
        <CalendarButton onOpen={() => setIsOpen(true)} />
      </div>

      <CalendarModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingEvent(null);
        }}
        events={calendar.events}
        handlers={handlers}
        editingEvent={editingEvent}
      />
    </div>
  );
}
