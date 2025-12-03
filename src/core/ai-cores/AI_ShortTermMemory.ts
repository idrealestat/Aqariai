// /core/ai-cores/AI_ShortTermMemory.ts
// ذاكرة قصيرة للمحادثات — تحفظ آخر 5 جلسات فقط لكل مستخدم

export type ConversationEntry = {
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  context?: Record<string, any>;
};

type MemoryState = {
  userId: string;
  conversations: ConversationEntry[];
};

const STORE_KEY = 'aqar_shortterm_memory_v1';
let STATES: Record<string, MemoryState> = {};

function loadAll() {
  if (typeof window === 'undefined') return {};
  try { STATES = JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch { STATES = {}; }
}
function saveAll() {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORE_KEY, JSON.stringify(STATES)); } catch {}
}
loadAll();

export function getMemory(userId: string): MemoryState {
  STATES[userId] = STATES[userId] || { userId, conversations: [] };
  return STATES[userId];
}

export function pushMessage(userId: string, entry: ConversationEntry) {
  const state = getMemory(userId);
  state.conversations.push(entry);
  if (state.conversations.length > 5) state.conversations.shift(); // keep last 5
  saveAll();
}

export function getRecentContext(userId: string): Record<string, any> {
  const state = getMemory(userId);
  const recentUserMsgs = state.conversations.filter(e => e.role === 'user').slice(-3);
  const ctx: Record<string, any> = {};
  for (const msg of recentUserMsgs) {
    if (/عبدالله/i.test(msg.text)) ctx.lastCustomer = 'عبدالله';
    if (/موعد/i.test(msg.text)) ctx.lastTopic = 'appointment';
  }
  return ctx;
}

// ✅ دالة جديدة: إرجاع المحادثات كـ array لـ OpenAI
export function getConversationHistory(userId: string): ConversationEntry[] {
  const state = getMemory(userId);
  return state.conversations || [];
}

export function clearMemory(userId: string) {
  delete STATES[userId];
  saveAll();
}

export default { getMemory, pushMessage, getRecentContext, getConversationHistory, clearMemory };