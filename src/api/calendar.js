// api/calendar.js (Express)
const express = require("express");
const router = express.Router();

// افترض وجود اتصال بـ DB (مثال Postgres)
// جدول: appointments (see schema below)

router.get("/events", async (req, res) => {
  // استرجاع جميع الأحداث
  const events = await db.query("SELECT * FROM appointments ORDER BY start_at");
  res.json(events.rows);
});

router.post("/events", async (req, res) => {
  const { title, description, start_at, end_at, type, reminder_minutes } = req.body;
  const result = await db.query(
    `INSERT INTO appointments (title, description, start_at, end_at, type, reminder_minutes)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [title, description, start_at, end_at, type, reminder_minutes]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/events/:id", async (req, res) => {
  const id = req.params.id;
  const { title, description, start_at, end_at, type, reminder_minutes } = req.body;
  const result = await db.query(
    `UPDATE appointments SET title=$1, description=$2, start_at=$3, end_at=$4, type=$5, reminder_minutes=$6 WHERE id=$7 RETURNING *`,
    [title, description, start_at, end_at, type, reminder_minutes, id]
  );
  res.json(result.rows[0]);
});

router.delete("/events/:id", async (req, res) => {
  const id = req.params.id;
  await db.query("DELETE FROM appointments WHERE id = $1", [id]);
  res.status(204).send();
});

module.exports = router;
