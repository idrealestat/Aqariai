// hooks/useSmartNotifications.ts
import { useState, useEffect } from 'react';
import { CalendarEvent, NotificationSettings } from '../types/calendar';
import { toast } from 'sonner@2.0.3';

export default function useSmartNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    sms: true,
    push: true,
    client_reminder_time: 30,
    agent_reminder_time: 45,
    auto_resend: true,
  });

  const [scheduledNotifications, setScheduledNotifications] = useState<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    const saved = localStorage.getItem('notification_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notification_settings', JSON.stringify(settings));
  }, [settings]);

  function scheduleNotification(event: CalendarEvent) {
    const now = new Date().getTime();
    const startTime = new Date(event.start).getTime();

    if (event.priority === 'critical') {
      const clientNotificationTime = startTime - (settings.client_reminder_time * 60 * 1000);
      const agentNotificationTime = startTime - (settings.agent_reminder_time * 60 * 1000);

      if (clientNotificationTime > now) {
        const timeout = setTimeout(() => {
          sendClientNotification(event);
        }, clientNotificationTime - now);
        
        setScheduledNotifications(prev => ({
          ...prev,
          [`${event.id}_client`]: timeout
        }));
      }

      if (agentNotificationTime > now) {
        const timeout = setTimeout(() => {
          sendAgentNotification(event);
        }, agentNotificationTime - now);
        
        setScheduledNotifications(prev => ({
          ...prev,
          [`${event.id}_agent`]: timeout
        }));
      }
    }
  }

  function sendClientNotification(event: CalendarEvent) {
    const message = `
عميلنا العزيز،
لديك موعد ${event.title}:
${event.city ? event.city + ' / ' : ''}${event.district || ''}
في الساعة: ${new Date(event.start).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
نرجو تأكيد الحضور بالدخول على الرابط:
[رابط الحجز]
    `.trim();

    if (settings.push) {
      toast.info(message, {
        duration: 10000,
        action: {
          label: 'تأكيد الحضور',
          onClick: () => confirmClientAttendance(event.id)
        }
      });
    }

    if (settings.email) {
      sendEmail(event.client_email || '', 'تذكير بموعد', message);
    }

    if (settings.sms) {
      sendSMS(event.client_phone || '', message);
    }

    if (settings.auto_resend && !event.client_confirmed) {
      setTimeout(() => {
        if (!event.client_confirmed) {
          sendClientNotification(event);
        }
      }, 10 * 60 * 1000);
    }
  }

  function sendAgentNotification(event: CalendarEvent) {
    const message = `
عزيزي الوسيط،
لديك موعد مع العميل ${event.client_name || 'غير محدد'} بعد ${settings.agent_reminder_time} دقيقة.
يرجى تأكيد حضوره أو إرسال رسالة اعتذار أو تعديل موعد.
    `.trim();

    if (settings.push) {
      toast.warning(message, {
        duration: 15000,
        action: {
          label: 'خيارات',
          onClick: () => showAgentOptions(event.id)
        }
      });
    }

    if (settings.email) {
      sendEmail('agent@example.com', 'تذكير بموعد', message);
    }
  }

  function confirmClientAttendance(eventId: string) {
    toast.success('تم تأكيد حضورك بنجاح');
  }

  function showAgentOptions(eventId: string) {
    toast('خيارات الموعد', {
      action: {
        label: 'إدارة',
        onClick: () => {}
      }
    });
  }

  function sendEmail(to: string, subject: string, body: string) {
    console.log('Sending email:', { to, subject, body });
  }

  function sendSMS(to: string, message: string) {
    console.log('Sending SMS:', { to, message });
  }

  function cancelScheduledNotifications(eventId: string) {
    if (scheduledNotifications[`${eventId}_client`]) {
      clearTimeout(scheduledNotifications[`${eventId}_client`]);
    }
    if (scheduledNotifications[`${eventId}_agent`]) {
      clearTimeout(scheduledNotifications[`${eventId}_agent`]);
    }
    
    setScheduledNotifications(prev => {
      const newState = { ...prev };
      delete newState[`${eventId}_client`];
      delete newState[`${eventId}_agent`];
      return newState;
    });
  }

  return {
    settings,
    setSettings,
    scheduleNotification,
    cancelScheduledNotifications,
    sendClientNotification,
    sendAgentNotification
  };
}
