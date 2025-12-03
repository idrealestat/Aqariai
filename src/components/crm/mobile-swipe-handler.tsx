import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'motion/react';

interface MobileSwipeHandlerProps {
  children: React.ReactNode[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  className?: string;
}

export const MobileSwipeHandler: React.FC<MobileSwipeHandlerProps> = ({
  children,
  currentIndex,
  onIndexChange,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    const threshold = 50; // الحد الأدنى للسحب لتغيير الصفحة
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    // تحديد الاتجاه بناءً على السحب والسرعة
    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      if (offset > 0 && currentIndex > 0) {
        // سحب من اليسار لليمين - الذهاب للصفحة السابقة
        onIndexChange(currentIndex - 1);
      } else if (offset < 0 && currentIndex < children.length - 1) {
        // سحب من اليمين لليسار - الذهاب للصفحة التالية
        onIndexChange(currentIndex + 1);
      }
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  return (
    <div 
      ref={constraintsRef}
      className={`overflow-hidden touch-pan-x ${className}`}
      style={{ 
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-x'
      }}
    >
      <motion.div
        className="flex"
        style={{
          width: `${children.length * 100}%`,
          x: `${-currentIndex * (100 / children.length)}%`
        }}
        animate={{
          x: `${-currentIndex * (100 / children.length)}%`
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8
        }}
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileDrag={{ 
          cursor: 'grabbing',
          scale: 0.98
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{ 
              width: `${100 / children.length}%`,
              userSelect: isDragging ? 'none' : 'auto',
              pointerEvents: isDragging ? 'none' : 'auto'
            }}
          >
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MobileSwipeHandler;