// /core/ai-cores/nlu-utils.ts
// بسيط: يستخرج أشياء أساسية من النص (أسماء وأرقام وإيميلات وتواريخ بصيغة مبسطة)

export function extractEntitiesFromText(text: string) {
  const nameMatch = text.match(/([ء-يA-Za-z]{2,}\s?[ء-يA-Za-z]{0,})/i);
  const phoneMatch = text.match(/(\+?\d{7,15})/);
  const dateMatch = text.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
  return {
    name: nameMatch ? nameMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    date: dateMatch ? dateMatch[0] : null,
    email: emailMatch ? emailMatch[0] : null
  };
}
