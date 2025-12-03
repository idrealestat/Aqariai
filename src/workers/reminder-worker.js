// workers/reminder-worker.js
/**
 * Worker للتحقق من المواعيد القادمة وإرسال التذكيرات
 * - يعمل كل دقيقة
 * - يتحقق من المواعيد التي تحتاج تذكير
 */

const cron = require('node-cron');

// تشغيل كل دقيقة
cron.schedule('* * * * *', async () => {
  console.log('Checking for upcoming appointments...');
  
  const now = new Date();
  
  // جلب المواعيد من قاعدة البيانات
  const appointments = await db.query(
    `SELECT * FROM appointments 
     WHERE start_at > $1 
     AND start_at <= $2
     AND reminder_sent = false`,
    [now, new Date(now.getTime() + 35 * 60 * 1000)] // القادمة خلال 35 دقيقة
  );
  
  for (const appointment of appointments.rows) {
    const appointmentTime = new Date(appointment.start_at);
    const timeDiff = appointmentTime.getTime() - now.getTime();
    const minutesUntil = Math.floor(timeDiff / (1000 * 60));
    
    // إرسال تذكير قبل 30 دقيقة
    if (minutesUntil <= 30 && minutesUntil > 0) {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: appointment.created_by,
          appointment_id: appointment.id,
          type: 'reminder',
          payload: {
            message: `موعدك "${appointment.title}" خلال ${minutesUntil} دقيقة`
          }
        })
      });
      
      // تحديث حالة الإرسال
      await db.query(
        'UPDATE appointments SET reminder_sent = true WHERE id = $1',
        [appointment.id]
      );
    }
  }
});

module.exports = { start: () => console.log('Reminder worker started') };
