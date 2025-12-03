// /core/ai-cores/AI_DataPulseCore.ts
// تتبع التفاعلات، سياق المستخدم، وإحصاءات بسيطة (localStorage أمامياً)
// في الخادم استخدم DB بدلاً من localStorage

const STORAGE_KEY = 'ai_data_pulse_v1';

interface UserContext {
  userId: string;
  interactionCount: number;
  lastIntent?: string;
  lastUpdated?: string;
  metadata?: any;
}

class AI_DataPulseCore {
  static loadAll(): Record<string, UserContext> {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  static saveAll(state: Record<string, UserContext>) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  static async updateFromUserInput(userId: string, input: string, metadata?: any) {
    const state = AI_DataPulseCore.loadAll();
    if (!state[userId]) {
      state[userId] = { userId, interactionCount: 0, lastUpdated: new Date().toISOString(), metadata: {} };
    }
    state[userId].interactionCount += 1;
    state[userId].lastUpdated = new Date().toISOString();
    // metadata merge
    state[userId].metadata = { ...(state[userId].metadata || {}), ...(metadata || {}) };
    AI_DataPulseCore.saveAll(state);
    return { userId, interactionCount: state[userId].interactionCount, lastIntent: state[userId].lastIntent || null };
  }

  static async logIntent(userId: string, intent: string, confidence: number, rawInput?: string) {
    const state = AI_DataPulseCore.loadAll();
    if (!state[userId]) state[userId] = { userId, interactionCount: 0, lastUpdated: new Date().toISOString(), metadata: {} };
    state[userId].lastIntent = intent;
    state[userId].lastUpdated = new Date().toISOString();
    AI_DataPulseCore.saveAll(state);

    // optional: keep separate logs (for prod use DB)
    if (typeof window !== 'undefined') {
      const logsRaw = localStorage.getItem(`${STORAGE_KEY}_logs`);
      const logs = logsRaw ? JSON.parse(logsRaw) : [];
      logs.push({ id: `log_${Date.now()}`, userId, intent, confidence, rawInput, ts: new Date().toISOString() });
      localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(logs));
    }

    return { ok: true };
  }

  static getPulseStats(userId: string) {
    const state = AI_DataPulseCore.loadAll();
    return state[userId] || null;
  }
}

export default AI_DataPulseCore;
export { AI_DataPulseCore };
