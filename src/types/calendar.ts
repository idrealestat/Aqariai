// types/calendar.ts
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type: 'meeting' | 'showing' | 'call' | 'custom' | 'short_followup';
  priority: 'normal' | 'critical';
  reminder?: number;
  status: 'مجدول' | 'مؤكد' | 'مكتمل' | 'ملغي';
  property_id?: string;
  client_id?: string;
  agent_id?: string;
  client_name?: string;
  client_phone?: string;
  client_email?: string;
  location?: string;
  city?: string;
  district?: string;
  cancellable_by_client?: boolean;
  notification_sent?: boolean;
  verification_sent?: boolean;
  client_confirmed?: boolean;
  agent_confirmed?: boolean;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  client_reminder_time: number;
  agent_reminder_time: number;
  auto_resend: boolean;
}

export interface VoiceCommand {
  hotword: string;
  enabled: boolean;
  language: 'ar' | 'en';
}

export interface AppointmentAnalytics {
  total_appointments: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  attendance_rate: number;
  cancellation_rate: number;
  avg_response_time: number;
  peak_hours: string[];
  client_behavior: Record<string, any>;
}
