import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

// 🧠 سياق لوحة التحكم - يتتبع الحالة العامة للنظام
// يستخدمه useAIAwareness للمراقبة المستمرة

export interface DashboardContextType {
  // الصفحة النشطة
  activePage: string | null;
  setActivePage: (page: string | null) => void;

  // العميل النشط (عند فتح تفاصيل عميل)
  activeCustomer: any | null;
  setActiveCustomer: (customer: any | null) => void;

  // العرض النشط (عند فتح تفاصيل عرض)
  activeOffer: any | null;
  setActiveOffer: (offer: any | null) => void;

  // الطلب النشط (عند فتح تفاصيل طلب)
  activeRequest: any | null;
  setActiveRequest: (request: any | null) => void;

  // حالة إضافية (اختياري)
  activeTab: string | null;
  setActiveTab: (tab: string | null) => void;

  // معلومات المستخدم الحالي
  currentUser: any | null;
  setCurrentUser: (user: any | null) => void;

  // حالة Left Sidebar
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [activePage, setActivePage] = useState<string | null>('dashboard');
  const [activeCustomer, setActiveCustomer] = useState<any | null>(null);
  const [activeOffer, setActiveOffer] = useState<any | null>(null);
  const [activeRequest, setActiveRequest] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false);

  const value: DashboardContextType = useMemo(() => ({
    activePage,
    setActivePage,
    activeCustomer,
    setActiveCustomer,
    activeOffer,
    setActiveOffer,
    activeRequest,
    setActiveRequest,
    activeTab,
    setActiveTab,
    currentUser,
    setCurrentUser,
    leftSidebarOpen,
    setLeftSidebarOpen,
  }), [activePage, activeCustomer, activeOffer, activeRequest, activeTab, currentUser, leftSidebarOpen]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};