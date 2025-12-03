/**
 * 🎯 مكون الخيارات المتعددة القابل لإعادة الاستخدام
 * =============================================
 * 
 * مكون أنيق للاختيار المتعدد مع:
 * - تصميم فاخر (أخضر ملكي + ذهبي)
 * - تأثيرات حركية سلسة
 * - زر إضافة خيار جديد
 * - RTL Support
 * 
 * @example
 * <MultiSelectOptions
 *   options={['خيار 1', 'خيار 2', 'خيار 3']}
 *   selectedOptions={selected}
 *   onToggle={(option) => handleToggle(option)}
 *   onAddNew={(newOption) => handleAdd(newOption)}
 *   label="اختر الخيارات"
 * />
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { PlusCircle } from 'lucide-react';

interface MultiSelectOptionsProps {
  /** قائمة الخيارات المتاحة */
  options: string[];
  
  /** الخيارات المحددة حالياً */
  selectedOptions: string[];
  
  /** دالة تُستدعى عند تحديد/إلغاء تحديد خيار */
  onToggle: (option: string) => void;
  
  /** دالة تُستدعى عند إضافة خيار جديد (اختياري) */
  onAddNew?: (newOption: string) => void;
  
  /** النص التوضيحي (اختياري) */
  label?: string;
  
  /** عدد الأعمدة في الشبكة */
  columns?: {
    sm: number;  // شاشات صغيرة
    md: number;  // شاشات متوسطة
    lg: number;  // شاشات كبيرة
  };
  
  /** إظهار/إخفاء زر "إضافة خيار جديد" */
  showAddButton?: boolean;
  
  /** نص زر الإضافة */
  addButtonText?: string;
  
  /** className إضافي للحاوية */
  className?: string;
}

export function MultiSelectOptions({
  options,
  selectedOptions,
  onToggle,
  onAddNew,
  label,
  columns = { sm: 2, md: 3, lg: 4 },
  showAddButton = true,
  addButtonText = 'إضافة خيار',
  className = ''
}: MultiSelectOptionsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newOptionValue, setNewOptionValue] = useState('');

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleAddSubmit = () => {
    if (newOptionValue.trim() && onAddNew) {
      onAddNew(newOptionValue.trim());
      setNewOptionValue('');
      setIsAdding(false);
    }
  };

  const handleAddCancel = () => {
    setNewOptionValue('');
    setIsAdding(false);
  };

  const gridCols = `grid-cols-${columns.sm} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg}`;

  return (
    <div className={`space-y-2 ${className}`} dir="rtl">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Grid الخيارات */}
      <div className={`grid ${gridCols} gap-2`}>
        {/* الخيارات الموجودة */}
        {options.map((option) => (
          <motion.label
            key={option}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
              selectedOptions.includes(option)
                ? 'bg-[#01411C] text-white shadow-md'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => onToggle(option)}
              className="hidden"
            />
            <span className="text-xs">{option}</span>
          </motion.label>
        ))}

        {/* زر إضافة خيار جديد */}
        {showAddButton && onAddNew && !isAdding && (
          <motion.button
            type="button"
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer transition-all bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/20 border-2 border-dashed border-[#D4AF37] hover:from-[#D4AF37]/20 hover:to-[#D4AF37]/30 hover:border-solid text-[#01411C]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-medium">{addButtonText}</span>
          </motion.button>
        )}

        {/* حقل إدخال الخيار الجديد */}
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-2 flex gap-2"
          >
            <input
              type="text"
              value={newOptionValue}
              onChange={(e) => setNewOptionValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddSubmit();
                if (e.key === 'Escape') handleAddCancel();
              }}
              placeholder="أدخل الخيار الجديد..."
              className="flex-1 px-3 py-2 text-xs border-2 border-[#D4AF37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              autoFocus
            />
            <button
              type="button"
              onClick={handleAddSubmit}
              className="px-3 py-2 bg-[#01411C] text-white rounded-lg hover:bg-[#065f41] transition-colors"
            >
              ✓
            </button>
            <button
              type="button"
              onClick={handleAddCancel}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ✕
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/**
 * ========================================
 * 📚 أمثلة الاستخدام:
 * ========================================
 */

// مثال 1: استخدام بسيط
/*
import { MultiSelectOptions } from './components/MultiSelectOptions';

function MyComponent() {
  const [selected, setSelected] = useState<string[]>([]);
  const options = ['مصعد', 'موقف سيارات', 'حديقة', 'مسبح'];

  const handleToggle = (option: string) => {
    setSelected(prev => 
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  return (
    <MultiSelectOptions
      options={options}
      selectedOptions={selected}
      onToggle={handleToggle}
      label="المميزات"
    />
  );
}
*/

// مثال 2: مع إضافة خيارات جديدة
/*
function MyComponent() {
  const [options, setOptions] = useState(['خيار 1', 'خيار 2']);
  const [selected, setSelected] = useState<string[]>([]);

  const handleAddNew = (newOption: string) => {
    setOptions(prev => [...prev, newOption]);
    setSelected(prev => [...prev, newOption]); // تحديد الخيار الجديد تلقائياً
  };

  return (
    <MultiSelectOptions
      options={options}
      selectedOptions={selected}
      onToggle={handleToggle}
      onAddNew={handleAddNew}
      label="الأحياء المفضلة"
      addButtonText="إضافة حي"
    />
  );
}
*/

// مثال 3: بدون زر إضافة
/*
<MultiSelectOptions
  options={fixedOptions}
  selectedOptions={selected}
  onToggle={handleToggle}
  showAddButton={false}
  label="الخيارات الثابتة"
/>
*/

// مثال 4: تخصيص عدد الأعمدة
/*
<MultiSelectOptions
  options={options}
  selectedOptions={selected}
  onToggle={handleToggle}
  columns={{ sm: 1, md: 2, lg: 3 }}
  label="شبكة مخصصة"
/>
*/
