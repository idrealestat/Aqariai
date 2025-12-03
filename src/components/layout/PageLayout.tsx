import React from 'react';
import { SharedHeader } from './SharedHeader';
import LeftSliderComplete from '../LeftSliderComplete';
import { useDashboardContext } from '../../context/DashboardContext';

interface PageLayoutProps {
  children: React.ReactNode;
  user?: any;
  onNavigate?: (page: string) => void;
  currentPage?: string;
  showHeader?: boolean; // للتحكم اليدوي في إظهار الهيدر
}

/**
 * Layout موحد لجميع الصفحات
 * يضيف الهيدر تلقائياً ما عدا الصفحات المستثناة
 * 
 * الصفحات المستثناة (بدون هيدر):
 * - business-card-profile (بطاقة الأعمال الرقمية)
 * - business-card-edit (تحرير بطاقة الأعمال)
 * - home-owners (اطلب وسيطك)
 * - registration (التسجيل)
 * - pricing (الأسعار)
 * - dashboard (لديها هيدر خاص بها)
 */
export function PageLayout({ 
  children, 
  user, 
  onNavigate, 
  currentPage,
  showHeader 
}: PageLayoutProps) {
  const { leftSidebarOpen } = useDashboardContext();

  // قائمة الصفحات المستثناة من الهيدر
  const pagesWithoutHeader = [
    'business-card-profile',
    'business-card-edit',
    'home-owners',
    'registration',
    'pricing',
    'dashboard' // الصفحة الرئيسية لديها هيدر خاص
  ];

  // تحديد إذا كان يجب إظهار الهيدر
  const shouldShowHeader = showHeader !== undefined 
    ? showHeader 
    : currentPage ? !pagesWithoutHeader.includes(currentPage) : true;

  return (
    <>
      {/* الهيدر المشترك */}
      {shouldShowHeader && (
        <SharedHeader user={user} onNavigate={onNavigate} />
      )}

      {/* Left Slider - موجود في كل الصفحات */}
      <LeftSliderComplete
        isOpen={leftSidebarOpen}
        onClose={() => {}}
        currentUser={user}
        onNavigate={onNavigate}
        mode="tools"
      />

      {/* المحتوى */}
      <div
        className="transition-all duration-300"
        style={{
          marginLeft: leftSidebarOpen ? "350px" : "0",
          marginTop: shouldShowHeader ? "0" : "0" // يمكن تعديله إذا احتجنا margin
        }}
      >
        {children}
      </div>
    </>
  );
}
