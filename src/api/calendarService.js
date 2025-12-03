// api/calendarService.js
/**
 * خدمة إدارة التقويم
 * - CRUD operations للمواعيد
 * - التحقق من التداخل
 * - validation للتواريخ
 */

const db = require('./db'); // اتصال قاعدة البيانات

async function createEvent(payload) {
  const { title, start_at, end_at, description, type, reminder_minutes } = payload;
  
  // التحقق من صحة التواريخ
  if (new Date(end_at) <= new Date(start_at)) {
    throw new Error('تاريخ النهاية يجب أن يكون بعد تاريخ البداية (422)');
  }
  
  // التحقق من التداخل
  const overlapping = await db.query(
    `SELECT * FROM appointments 
     WHERE start_at < $1 AND end_at > $2`,
    [end_at, start_at]
  );
  
  if (overlapping.rows.length > 0) {
    throw new Error('يوجد تعارض مع موعد آخر في نفس الوقت (400)');
  }
  
  // إنشاء الموعد
  const result = await db.query(
    `INSERT INTO appointments (title, description, start_at, end_at, type, reminder_minutes)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, description, start_at, end_at, type, reminder_minutes || 15]
  );
  
  return result.rows[0];
}

async function updateEvent(id, payload) {
  const { title, start_at, end_at, description, type, reminder_minutes } = payload;
  
  // التحقق من صحة التواريخ
  if (new Date(end_at) <= new Date(start_at)) {
    throw new Error('تاريخ النهاية يجب أن يكون بعد تاريخ البداية (422)');
  }
  
  // التحقق من التداخل (باستثناء الموعد الحالي)
  const overlapping = await db.query(
    `SELECT * FROM appointments 
     WHERE id != $1 AND start_at < $2 AND end_at > $3`,
    [id, end_at, start_at]
  );
  
  if (overlapping.rows.length > 0) {
    throw new Error('يوجد تعارض مع موعد آخر في نفس الوقت (400)');
  }
  
  const result = await db.query(
    `UPDATE appointments 
     SET title=$1, description=$2, start_at=$3, end_at=$4, type=$5, reminder_minutes=$6, updated_at=now()
     WHERE id=$7 RETURNING *`,
    [title, description, start_at, end_at, type, reminder_minutes, id]
  );
  
  return result.rows[0];
}

async function deleteEvent(id) {
  await db.query('DELETE FROM appointments WHERE id = $1', [id]);
}

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent
};
