// /hooks/useDynamicIntents.ts
// 🎯 Hook لفهم أوامر المستخدم وتنفيذها (Dynamic Intents)

import { useCallback } from 'react';
import AI_ConsciousAssistantCore from '../core/ai-cores/AI_ConsciousAssistantCore';

export function useDynamicIntents(userId: string, setMessages?: any) {
  
  // ✅ معالجة نية المستخدم (Intent)
  const processIntent = useCallback(async (userInput: string, context: any) => {
    if (!userId || !userInput) return null;

    try {
      // استخدام المساعد الواعي لمعالجة النية
      await AI_ConsciousAssistantCore.handleUserInput(
        userId,
        userInput,
        context,
        setMessages
      );

      return {
        success: true,
        processed: true
      };
    } catch (error) {
      console.error('Error processing intent:', error);
      return {
        success: false,
        error
      };
    }
  }, [userId, setMessages]);

  // ✅ تحليل النية من النص
  const analyzeIntent = useCallback((text: string) => {
    const lowerText = text.toLowerCase();

    // أنماط شائعة
    if (lowerText.includes('افتح') || lowerText.includes('اعرض')) {
      return { type: 'navigate', confidence: 0.9 };
    }

    if (lowerText.includes('احجز') || lowerText.includes('موعد')) {
      return { type: 'schedule', confidence: 0.9 };
    }

    if (lowerText.includes('ابحث') || lowerText.includes('اعثر')) {
      return { type: 'search', confidence: 0.9 };
    }

    if (lowerText.includes('إشعار') || lowerText.includes('تنبيه')) {
      return { type: 'notification', confidence: 0.8 };
    }

    return { type: 'general', confidence: 0.5 };
  }, []);

  // ✅ تنفيذ الإجراء بناءً على النية
  const executeAction = useCallback((intent: any, params: any) => {
    switch (intent.type) {
      case 'navigate':
        // التنقل
        if (params.page) {
          window.location.hash = `#/${params.page}`;
        }
        break;

      case 'schedule':
        // الحجز
        if (params.date) {
          window.dispatchEvent(new CustomEvent('aqar:navigate:calendar', {
            detail: { date: params.date }
          }));
        }
        break;

      case 'search':
        // البحث
        if (params.query) {
          window.dispatchEvent(new CustomEvent('aqar:search', {
            detail: { query: params.query }
          }));
        }
        break;

      default:
        console.log('Unknown intent type:', intent.type);
    }
  }, []);

  return {
    processIntent,
    analyzeIntent,
    executeAction
  };
}
