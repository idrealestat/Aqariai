import React from 'react';
import { cn } from './utils';

// مكون للحاوي المتجاوب الرئيسي
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}

export function ResponsiveContainer({ 
  children, 
  className, 
  maxWidth = 'lg',
  padding = true 
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      'mx-auto w-full',
      maxWidthClasses[maxWidth],
      padding && 'px-4 md:px-6 lg:px-8',
      className
    )} dir="rtl">
      {children}
    </div>
  );
}

// مكون للشبكة المتجاوبة المحسنة
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
}

export function ResponsiveGrid({ 
  children, 
  className, 
  cols = { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 4 
}: ResponsiveGridProps) {
  return (
    <div className={cn(
      'grid',
      `gap-${gap}`,
      cols.xs && `grid-cols-${cols.xs}`,
      cols.sm && `sm:grid-cols-${cols.sm}`,
      cols.md && `md:grid-cols-${cols.md}`,
      cols.lg && `lg:grid-cols-${cols.lg}`,
      cols.xl && `xl:grid-cols-${cols.xl}`,
      className
    )}>
      {children}
    </div>
  );
}

// مكون للنص المتجاوب
interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
}

export function ResponsiveText({ 
  children, 
  size = 'base',
  weight = 'normal',
  className,
  as: Component = 'p'
}: ResponsiveTextProps) {
  const sizeClasses = {
    xs: 'text-xs md:text-sm',
    sm: 'text-sm md:text-base',
    base: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl',
    xl: 'text-xl md:text-2xl',
    '2xl': 'text-2xl md:text-3xl',
    '3xl': 'text-3xl md:text-4xl'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <Component className={cn(
      sizeClasses[size],
      weightClasses[weight],
      'rtl-container',
      className
    )}>
      {children}
    </Component>
  );
}

// مكون للأزرار المحسنة للمس
interface TouchFriendlyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function TouchFriendlyButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className,
  type = 'button'
}: TouchFriendlyButtonProps) {
  const baseClasses = cn(
    'inline-flex items-center justify-center',
    'rounded-lg font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'touch-manipulation', // تحسين اللمس
    fullWidth ? 'w-full' : 'w-auto'
  );

  const variantClasses = {
    primary: cn(
      'bg-[#01411C] text-white border-2 border-[#D4AF37]',
      'hover:shadow-lg hover:scale-105 active:scale-95',
      'focus:ring-[#D4AF37]'
    ),
    secondary: cn(
      'bg-[#f0fdf4] text-[#01411C] border-2 border-[#D4AF37]',
      'hover:bg-[#D4AF37] hover:text-[#01411C]',
      'focus:ring-[#D4AF37]'
    ),
    outline: cn(
      'bg-transparent text-[#01411C] border-2 border-[#D4AF37]',
      'hover:bg-[#D4AF37] hover:text-[#01411C]',
      'focus:ring-[#D4AF37]'
    ),
    ghost: cn(
      'bg-transparent text-[#01411C] border-2 border-transparent',
      'hover:bg-[#f0fdf4] hover:border-[#D4AF37]',
      'focus:ring-[#D4AF37]'
    )
  };

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-base sm:h-10 sm:text-sm md:h-11 md:text-base',
    lg: 'h-12 px-6 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
    >
      {children}
    </button>
  );
}

// مكون للحقول المحسنة للموبايل
interface MobileOptimizedInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
  label?: string;
}

export function MobileOptimizedInput({
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  className,
  label
}: MobileOptimizedInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[#01411C]">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={cn(
          'w-full px-3 py-3 text-base rounded-lg border-2 border-[#D4AF37]',
          'bg-white/90 text-[#01411C] placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // منع الزووم في iOS
          'text-[16px] sm:text-sm',
          className
        )}
      />
    </div>
  );
}

// مكون للبطاقات المتجاوبة المحسنة
interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  shadow?: boolean;
}

export function ResponsiveCard({
  children,
  className,
  hover = true,
  padding = 'md',
  border = true,
  shadow = true
}: ResponsiveCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  return (
    <div className={cn(
      'bg-white rounded-lg',
      border && 'border-2 border-[#D4AF37]',
      shadow && 'shadow-sm',
      hover && 'transition-all duration-200 hover:shadow-lg hover:scale-[1.02]',
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}

// Hook محسن للكشف عن حجم الشاشة
export function useResponsiveBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('xs');

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1280) setBreakpoint('xl');
      else if (width >= 1024) setBreakpoint('lg');
      else if (width >= 768) setBreakpoint('md');
      else if (width >= 640) setBreakpoint('sm');
      else setBreakpoint('xs');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'xs',
    isTablet: breakpoint === 'sm' || breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl',
    isSmall: breakpoint === 'xs' || breakpoint === 'sm',
    isLarge: breakpoint === 'lg' || breakpoint === 'xl'
  };
}

// مكون للتنقل السفلي في الموبايل
interface MobileBottomNavProps {
  items: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    active?: boolean;
  }>;
  className?: string;
}

export function MobileBottomNav({ items, className }: MobileBottomNavProps) {
  const { isMobile } = useResponsiveBreakpoint();

  if (!isMobile) return null;

  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 z-50',
      'bg-white border-t-2 border-[#D4AF37]',
      'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5',
      'safe-area-inset-bottom', // دعم iPhone X وما بعده
      className
    )}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={item.onClick}
          className={cn(
            'flex flex-col items-center justify-center py-3 px-2',
            'text-xs font-medium transition-colors duration-200',
            'min-h-[64px] touch-manipulation',
            item.active 
              ? 'text-[#01411C] bg-[#f0fdf4]' 
              : 'text-gray-600 hover:text-[#01411C] hover:bg-[#f0fdf4]'
          )}
        >
          <item.icon className={cn(
            'w-6 h-6 mb-1',
            item.active ? 'text-[#D4AF37]' : 'text-current'
          )} />
          <span className="truncate">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}