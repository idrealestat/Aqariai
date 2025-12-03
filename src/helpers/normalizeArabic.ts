// helpers/normalizeArabic.ts
export function normalizeArabic(input: string): string {
  if (!input) return "";
  let s = input.trim().toLowerCase();
  s = s.replace(/[\u064B-\u0652]/g, ""); // تشكيل
  s = s.replace(/[أإآ]/g, "ا");
  s = s.replace(/ى/g, "ي");
  s = s.replace(/ـ/g, "");
  s = s.replace(/\bال(?=[^\s])/g, "");
  s = s.replace(/[\u060C,\.\/#@!؟؛:\-()]/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}