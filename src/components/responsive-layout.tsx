import React from 'react';
import { cn } from './ui/utils';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'container' | 'grid' | 'flex';
  showSidebar?: boolean;
}

export function ResponsiveLayout({ 
  children, 
  className, 
  variant = 'container',
  showSidebar = false 
}: ResponsiveLayoutProps) {
  
  const baseClasses = "rtl-container";
  
  const variantClasses = {
    container: cn(
      "min-h-screen",
      "px-4 py-4",           // موبايل
      "md:px-6 md:py-6",     // تابلت
      "lg:px-8 lg:py-8",     // كمبيوتر
      showSidebar && "lg:mr-64" // مساحة للشريط الجانبي
    ),
    grid: cn(
      "grid gap-4",
      "grid-cols-1",         // موبايل
      "md:grid-cols-2",      // تابلت
      "lg:grid-cols-3",      // كمبيوتر
      "xl:grid-cols-4",      // شاشة كبيرة
      "2xl:grid-cols-6"      // شاشة كبيرة جداً
    ),
    flex: cn(
      "flex gap-4",
      "flex-col",            // موبايل
      "md:flex-col",         // تابلت
      "lg:flex-row"          // كمبيوتر
    )
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)} dir="rtl">
      {children}
    </div>
  );
}

// مكون للأزرار المتجاوبة
interface ResponsiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

export function ResponsiveButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  disabled = false
}: ResponsiveButtonProps) {
  
  const baseClasses = cn(
    "font-medium rounded-lg transition-all duration-200",
    "touch-friendly", // لمس مريح
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    disabled && "opacity-50 cursor-not-allowed"
  );

  const variantClasses = {
    primary: cn(
      "royal-green-bg text-white",
      "border-2 gold-border",
      "hover:shadow-lg hover:scale-105",
      "focus:ring-[#D4AF37]"
    ),
    secondary: cn(
      "bg-secondary text-secondary-foreground",
      "border-2 border-border",
      "hover:bg-secondary/80",
      "focus:ring-border"
    ),
    outline: cn(
      "bg-transparent royal-green",
      "border-2 gold-border",
      "hover:gold-bg hover:text-[#01411C]",
      "focus:ring-[#D4AF37]"
    )
  };

  const sizeClasses = {
    sm: "text-sm py-2 px-3",
    md: cn(
      "text-base py-3 px-4",      // مو��ايل
      "md:text-sm md:py-2 md:px-4", // تابلت
      "lg:text-sm lg:py-2 lg:px-6"  // كمبيوتر
    ),
    lg: "text-lg py-4 px-6"
  };

  const responsiveClasses = cn(
    fullWidth && "w-full",
    !fullWidth && cn(
      "w-full",           // موبايل دائماً عرض كامل
      "md:w-auto",        // تابلت عرض تلقائي
      "lg:w-auto"         // كمبيوتر عرض تلقائي
    )
  );

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], responsiveClasses, className)}
    >
      {children}
    </button>
  );
}

// مكون للبطاقات المتجاوبة
interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export function ResponsiveCard({
  children,
  className,
  hover = true,
  padding = 'md'
}: ResponsiveCardProps) {
  
  const paddingClasses = {
    sm: "p-3 md:p-4",
    md: "p-4 md:p-6",
    lg: "p-6 md:p-8"
  };

  return (
    <div className={cn(
      "bg-card rounded-lg border-2 gold-border",
      "transition-all duration-200",
      hover && "hover:shadow-lg hover:scale-[1.02]",
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}

// مكون للحالات الفارغة
interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("empty-state", className)}>
      {Icon && <Icon className="empty-state-icon royal-green" />}
      <h3 className="empty-state-text royal-green">{title}</h3>
      {description && (
        <p className="empty-state-description">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}

// مكون للشبكة المتجاوبة
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: number;
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
  className
}: ResponsiveGridProps) {
  
  const gridClasses = cn(
    "grid",
    `gap-${gap}`,
    `grid-cols-${cols.mobile || 1}`,
    cols.tablet && `md:grid-cols-${cols.tablet}`,
    cols.desktop && `lg:grid-cols-${cols.desktop}`,
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}

// Hook للكشف عن حجم الشاشة
export function useScreenSize() {
  const [screenSize, setScreenSize] = React.useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return screenSize;
}

// مكون للتنقل المتجاوب
interface ResponsiveNavigationProps {
  children: React.ReactNode;
  showOnMobile?: boolean;
  className?: string;
}

export function ResponsiveNavigation({
  children,
  showOnMobile = false,
  className
}: ResponsiveNavigationProps) {
  const screenSize = useScreenSize();
  
  if (screenSize === 'mobile' && !showOnMobile) {
    return null;
  }

  return (
    <nav className={cn(
      "transition-all duration-200",
      screenSize === 'mobile' ? "fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 gold-border" :
      screenSize === 'tablet' ? "sticky top-0 z-40" :
      "fixed right-0 top-0 h-full w-64 bg-white border-l-2 gold-border",
      className
    )}>
      {children}
    </nav>
  );
}