import React, { useEffect } from 'react';

// مكون لتحسين التفاعل مع اللمس
export function TouchEnhancement() {
  useEffect(() => {
    // إضافة دعم أفضل للأجهزة اللمسية
    const addTouchSupport = () => {
      // منع الزوم المزدوج في iOS
      let lastTouchEnd = 0;
      document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      }, false);

      // تحسين التمرير على iOS
      document.addEventListener('touchmove', function(e) {
        if (e.scale !== 1) { 
          e.preventDefault(); 
        }
      }, { passive: false });

      // إضافة كلاسات CSS للعناصر القابلة للمس
      const touchableElements = document.querySelectorAll(
        'button, [role="button"], a, input, select, textarea, [tabindex], .cursor-pointer'
      );

      touchableElements.forEach(element => {
        element.classList.add('touch-manipulation');
        
        // إضافة تأثيرات اللمس
        element.addEventListener('touchstart', function() {
          this.style.transform = 'scale(0.98)';
          this.style.opacity = '0.9';
        }, { passive: true });

        element.addEventListener('touchend', function() {
          this.style.transform = '';
          this.style.opacity = '';
        }, { passive: true });

        element.addEventListener('touchcancel', function() {
          this.style.transform = '';
          this.style.opacity = '';
        }, { passive: true });
      });

      // تحسين الكروت القابلة للنقر
      const cards = document.querySelectorAll('[class*="card"], [class*="Card"]');
      cards.forEach(card => {
        if (card.style.cursor === 'pointer' || card.classList.contains('cursor-pointer')) {
          card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.99)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }, { passive: true });

          card.addEventListener('touchend', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
          }, { passive: true });
        }
      });

      // تحسين القوائم
      const menus = document.querySelectorAll('[class*="menu"], [class*="Menu"]');
      menus.forEach(menu => {
        menu.addEventListener('touchstart', function(e) {
          e.stopPropagation();
        }, { passive: true });
      });

      // إضافة تأثير الريبل للأزرار
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        button.addEventListener('touchend', function(e) {
          const ripple = document.createElement('span');
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.changedTouches[0].clientX - rect.left - size / 2;
          const y = e.changedTouches[0].clientY - rect.top - size / 2;
          
          ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
          `;

          this.style.position = 'relative';
          this.style.overflow = 'hidden';
          this.appendChild(ripple);

          setTimeout(() => {
            ripple.remove();
          }, 600);
        });
      });

      // إضافة CSS للريبل
      const style = document.createElement('style');
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        
        /* تحسينات خاصة بـ iOS */
        @supports (-webkit-overflow-scrolling: touch) {
          .touch-manipulation {
            -webkit-overflow-scrolling: touch;
          }
        }
        
        /* تحسينات للأندرويد */
        @media (hover: none) and (pointer: coarse) {
          .touch-manipulation:hover {
            background-color: inherit;
          }
          
          .touch-manipulation:active {
            transform: scale(0.98);
            opacity: 0.9;
          }
        }
      `;
      document.head.appendChild(style);
    };

    // تشغيل التحسينات بعد تحميل DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addTouchSupport);
    } else {
      addTouchSupport();
    }

    // إعادة تشغيل التحسينات عند تغيير المحتوى
    const observer = new MutationObserver(() => {
      setTimeout(addTouchSupport, 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // هذا المكون لا يعرض شيئاً
}

// Hook للتفاعل مع اللمس
export function useTouchInteraction() {
  const handleTouchStart = (callback?: () => void) => (e: React.TouchEvent) => {
    e.currentTarget.style.transform = 'scale(0.98)';
    e.currentTarget.style.opacity = '0.9';
    callback?.();
  };

  const handleTouchEnd = (callback?: () => void) => (e: React.TouchEvent) => {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.opacity = '';
    callback?.();
  };

  const handleTouchCancel = () => (e: React.TouchEvent) => {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.opacity = '';
  };

  return {
    handleTouchStart,
    handleTouchEnd,
    handleTouchCancel
  };
}

// مكون Wrapper للعناصر التفاعلية
interface TouchableProps {
  children: React.ReactNode;
  onTouch?: () => void;
  className?: string;
  disabled?: boolean;
}

export function Touchable({ children, onTouch, className = '', disabled = false }: TouchableProps) {
  const { handleTouchStart, handleTouchEnd, handleTouchCancel } = useTouchInteraction();

  return (
    <div
      className={`touch-manipulation ${className} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      onTouchStart={handleTouchStart(onTouch)}
      onTouchEnd={handleTouchEnd()}
      onTouchCancel={handleTouchCancel()}
      style={{
        transition: 'all 0.2s ease',
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      {children}
    </div>
  );
}

export default TouchEnhancement;