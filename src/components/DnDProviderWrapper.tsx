import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

// تحديد نوع الجهاز
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || 'ontouchstart' in window;
};

interface DnDProviderWrapperProps {
  children: React.ReactNode;
}

export const DnDProviderWrapper: React.FC<DnDProviderWrapperProps> = ({ children }) => {
  const backend = isMobile() ? TouchBackend : HTML5Backend;
  
  const backendOptions = isMobile() ? {
    enableMouseEvents: true,
    delayTouchStart: 500, // تأخير للسماح بالتمرير
    touchSlop: 5 // المسافة المسموحة قبل بدء السحب
  } : {};

  return (
    <DndProvider backend={backend} options={backendOptions}>
      {children}
    </DndProvider>
  );
};

export default DnDProviderWrapper;