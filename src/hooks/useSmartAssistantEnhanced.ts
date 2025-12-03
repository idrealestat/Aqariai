// /hooks/useSmartAssistantEnhanced.ts
// ✅ Hook لدمج الوعي + النقاش الحر + ذاكرة 5 محادثات + إشعارات حقيقية

import { useEffect, useRef, useCallback } from 'react';
import AwarenessTracker from '../core/ai-cores/AI_AwarenessTracker';
import ShortTermMemory from '../core/ai-cores/AI_ShortTermMemory';
import AI_ConsciousAssistantCore from '../core/ai-cores/AI_ConsciousAssistantCore';
import NotificationsCore from '../core/ai-cores/AI_NotificationsEnhancedCore';

interface UseSmartAssistantEnhancedProps {
  userId: string;
  currentPage: string;
  setMessages?: any;
}

export function useSmartAssistantEnhanced({
  userId,
  currentPage,
  setMessages
}: UseSmartAssistantEnhancedProps) {
  
  // ✅ 1. تهيئة نظام الوعي
  useEffect(() => {
    if (!userId) return;
    
    // تسجيل الصفحة الحالية في الوعي
    AwarenessTracker.setLastOpened(userId, currentPage, undefined);
  }, [userId, currentPage]);

  // ✅ 2. تهيئة نظام الإشعارات الحقيقية
  useEffect(() => {
    if (!userId || !setMessages) return;

    // تهيئة نظام الإشعارات
    NotificationsCore.initializeNotificationsIntegration();

    // الاشتراك في الإشعارات
    const unsubscribe = NotificationsCore.subscribeToNotifications((notification) => {
      // إضافة الإشعار كرسالة في المساعد
      const notificationMessage = {
        role: 'assistant' as const,
        text: `🔔 ${notification.payload?.title || 'إشعار جديد'}: ${notification.payload?.message || ''}`,
        timestamp: Date.now(),
        actions: notification.contextActions || []
      };

      setMessages((prev: any[]) => [...prev, notificationMessage]);
      
      // حفظ في الذاكرة القصيرة
      ShortTermMemory.pushMessage(userId, {
        role: 'assistant',
        text: notificationMessage.text,
        timestamp: new Date().toISOString()
      });
    });

    return () => {
      unsubscribe();
    };
  }, [userId, setMessages]);

  // ✅ 3. معالج إرسال الرسائل مع الوعي + النقاش الحر + الذاكرة
  const sendMessageWithContext = useCallback(async (
    text: string,
    context: any
  ) => {
    if (!userId || !setMessages) return;

    // 3.1 حفظ رسالة المستخدم في الذاكرة القصيرة
    ShortTermMemory.pushMessage(userId, {
      role: 'user',
      text,
      timestamp: new Date().toISOString()
    });

    // 3.2 استخدام المساعد الواعي للرد
    try {
      await AI_ConsciousAssistantCore.handleUserInput(
        userId,
        text,
        context,
        setMessages
      );
    } catch (error) {
      console.error('Error in AI_ConsciousAssistantCore:', error);
      
      // رسالة خطأ للمستخدم
      const errorMessage = {
        role: 'assistant' as const,
        text: 'عذراً، حدث خطأ. من فضلك حاول مرة أخرى.',
        timestamp: Date.now()
      };
      
      setMessages((prev: any[]) => [...prev, errorMessage]);
    }
  }, [userId, setMessages]);

  // ✅ 4. الحصول على السياق الحالي من الذاكرة
  const getCurrentContext = useCallback(() => {
    if (!userId) return {};
    
    return {
      ...ShortTermMemory.getRecentContext(userId),
      awarenessState: AwarenessTracker.getState(userId),
      currentPage
    };
  }, [userId, currentPage]);

  // ✅ 5. مسح الذاكرة القصيرة
  const clearMemory = useCallback(() => {
    if (!userId) return;
    ShortTermMemory.clearMemory(userId);
  }, [userId]);

  return {
    sendMessageWithContext,
    getCurrentContext,
    clearMemory,
    awarenessState: userId ? AwarenessTracker.getState(userId) : null,
    shortTermMemory: userId ? ShortTermMemory.getMemory(userId) : null
  };
}
