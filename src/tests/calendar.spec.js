// tests/calendar.spec.js
const { createEvent, updateEvent, deleteEvent } = require("../api/calendarService");

test("create event with valid dates", async () => {
  const ev = await createEvent({ title: "Test", start_at: "2025-10-20T10:00:00Z", end_at: "2025-10-20T11:00:00Z" });
  expect(ev.id).toBeDefined();
});

test("reject overlapping event", async () => {
  await createEvent({ title: "A", start_at: "2025-10-20T10:00:00Z", end_at: "2025-10-20T11:00:00Z" });
  await expect(createEvent({ title: "B", start_at: "2025-10-20T10:30:00Z", end_at: "2025-10-20T11:30:00Z" })).rejects.toThrow();
});
