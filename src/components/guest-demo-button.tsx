import React from "react";
import { motion } from "motion/react";
import { Eye, Zap } from "lucide-react";

interface GuestDemoButtonProps {
  onClick: () => void;
}

export function GuestDemoButton({ onClick }: GuestDemoButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-4"
    >
      <motion.button
        onClick={onClick}
        className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 bg-white hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl touch-manipulation btn-touch group"
        style={{
          borderColor: '#D4AF37',
          color: '#01411C'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] text-white shadow-md group-hover:shadow-lg transition-all">
          <Eye className="w-4 h-4" />
        </div>
        <span className="font-bold text-sm">تجربة سريعة بدون تسجيل</span>
        <Zap className="w-4 h-4 text-[#D4AF37] animate-pulse" />
      </motion.button>
      <p className="text-xs text-gray-500 mt-2 font-medium">
        👁️ استكشف المنصة فوراً مع بيانات تجريبية
      </p>
    </motion.div>
  );
}