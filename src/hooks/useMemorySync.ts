// /hooks/useMemorySync.ts
// 🧠 Hook لتتبع آخر 5 محادثات (Memory Sync)

import { useEffect, useRef, useCallback } from 'react';
import ShortTermMemory from '../core/ai-cores/AI_ShortTermMemory';

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
}

export function useMemorySync(userId: string) {
  const conversationMemory = useRef<ConversationMessage[]>([]);

  // ✅ إضافة رسالة للذاكرة
  const addMessage = useCallback((message: ConversationMessage) => {
    if (!userId) return;
    
    conversationMemory.current.push(message);
    
    // حفظ في ShortTermMemory
    ShortTermMemory.pushMessage(userId, message);
    
    // حذف الأقدم إذا تجاوزت 5 رسائل
    if (conversationMemory.current.length > 5) {
      conversationMemory.current.shift();
    }
  }, [userId]);

  // ✅ الحصول على آخر 5 رسائل
  const getLastMessages = useCallback(() => {
    if (!userId) return [];
    return ShortTermMemory.getMemory(userId);
  }, [userId]);

  // ✅ الحصول على السياق الحالي
  const getContext = useCallback(() => {
    if (!userId) return {};
    return ShortTermMemory.getRecentContext(userId);
  }, [userId]);

  // ✅ مسح الذاكرة
  const clearMemory = useCallback(() => {
    if (!userId) return;
    conversationMemory.current = [];
    ShortTermMemory.clearMemory(userId);
  }, [userId]);

  return {
    addMessage,
    getLastMessages,
    getContext,
    clearMemory,
    memory: conversationMemory.current
  };
}
