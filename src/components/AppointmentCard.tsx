// components/AppointmentCard.tsx
import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

/**
 * AppointmentCard
 * - بطاقة عرض تفاصيل موعد واحد
 * - تستخدم في القوائم والعروض
 * - قابلة للنقر لفتح التفاصيل
 */

interface AppointmentCardProps {
  event: {
    id: string;
    title: string;
    description?: string;
    start: string;
    end: string;
    type?: string;
  };
  onClick?: () => void;
}

export default function AppointmentCard({ event, onClick }: AppointmentCardProps) {
  return (
    <Card
      className="border-2 border-[#D4AF37] cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="text-[#01411C] mb-1">{event.title}</h4>
            {event.description && (
              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
            )}
            <div className="flex gap-3 text-xs text-gray-500">
              <span>📅 {new Date(event.start).toLocaleDateString('ar-SA')}</span>
              <span>🕐 {new Date(event.start).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <Badge className="bg-[#01411C] text-white">
            {event.type || 'موعد'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
