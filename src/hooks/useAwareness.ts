// /hooks/useAwareness.ts
// 🧠 Hook لتفعيل النقاش السياقي (Contextual Awareness)

import { useEffect, useCallback } from 'react';
import AwarenessTracker from '../core/ai-cores/AI_AwarenessTracker';
import { useDashboardContext } from '../context/DashboardContext';

export function useAwareness(userId: string, currentPage: string) {
  const { activeCustomer, activeOffer, activeRequest, activePage } = useDashboardContext();

  // ✅ تسجيل الصفحة الحالية في الوعي
  useEffect(() => {
    if (!userId || !currentPage) return;
    
    AwarenessTracker.setLastOpened(userId, currentPage, undefined);
  }, [userId, currentPage]);

  // ✅ تسجيل العميل النشط
  useEffect(() => {
    if (!userId || !activeCustomer) return;
    
    AwarenessTracker.setLastOpened(userId, 'customer-details', activeCustomer.id);
  }, [userId, activeCustomer]);

  // ✅ الحصول على حالة الوعي الكاملة
  const getAwarenessState = useCallback(() => {
    if (!userId) return null;
    return AwarenessTracker.getState(userId);
  }, [userId]);

  // ✅ الحصول على السياق الحالي
  const getCurrentContext = useCallback(() => {
    return {
      currentPage,
      activeCustomer,
      activeOffer,
      activeRequest,
      activePage,
      awarenessState: getAwarenessState()
    };
  }, [currentPage, activeCustomer, activeOffer, activeRequest, activePage, getAwarenessState]);

  return {
    awarenessState: getAwarenessState(),
    getCurrentContext
  };
}
