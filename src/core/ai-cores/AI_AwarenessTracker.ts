// /core/ai-cores/AI_AwarenessTracker.ts
// صغيرة، لكن أساسية: تدير الحالة السياقية القصيرة للمستخدِم (last 5 events).
type AwarenessState = {
  userId: string;
  lastIntent?: string;
  recentEntities: Array<{ type: string; id?: string; name?: string; ts: string }>;
  lastOpened?: { page: string; id?: string; ts: string };
};

const STORE_KEY = 'aqar_awareness_states_v1';
let STATES: Record<string, AwarenessState> = {};

function loadAll() {
  if (typeof window === 'undefined') return {};
  try { STATES = JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch { STATES = {}; }
  return STATES;
}
function saveAll() {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORE_KEY, JSON.stringify(STATES)); } catch {}
}
loadAll();

export function getState(userId: string): AwarenessState {
  STATES[userId] = STATES[userId] || { userId, recentEntities: [] };
  return STATES[userId];
}

export function pushEntity(userId: string, e: { type: string; id?: string; name?: string }) {
  const s = getState(userId);
  s.recentEntities.unshift({ ...e, ts: new Date().toISOString() });
  if (s.recentEntities.length > 10) s.recentEntities.pop();
  saveAll();
  return s;
}

export function setLastIntent(userId: string, intent: string) {
  const s = getState(userId);
  s.lastIntent = intent;
  saveAll();
}
export function setLastOpened(userId: string, page: string, id?: string) {
  const s = getState(userId);
  s.lastOpened = { page, id, ts: new Date().toISOString() };
  saveAll();
}

export function clearContext(userId: string) {
  delete STATES[userId];
  saveAll();
}

export default { getState, pushEntity, setLastIntent, setLastOpened, clearContext };
