import { memo } from "react";
import { motion } from "motion/react";
import { Home, BarChart3, Building, PlusCircle, User, Star } from "lucide-react";

interface OffersRequestsBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const OffersRequestsBottomNav = memo(function OffersRequestsBottomNav({ currentPage, onNavigate }: OffersRequestsBottomNavProps) {
  const navItems = [
    {
      id: "offers-requests-dashboard",
      icon: Home,
      label: "الرئيسية",
      color: "text-blue-600"
    },
    {
      id: "offers-requests-stats", 
      icon: BarChart3,
      label: "الإحصائيات",
      color: "text-green-600"
    },
    {
      id: "add-property",
      icon: PlusCircle,
      label: "إضافة",
      color: "text-purple-600",
      isSpecial: true
    },
    {
      id: "sale-offers",
      icon: Building,
      label: "العروض",
      color: "text-orange-600"
    },
    {
      id: "enhanced-dashboard",
      icon: Star,
      label: "محسن",
      color: "text-gold-600",
      isSpecial: true
    },
    {
      id: "offers-requests-profile",
      icon: User,
      label: "الملف",
      color: "text-indigo-600"
    }
  ];

  const handleNavClick = (itemId: string) => {
    if (itemId === "add-property") {
      // يمكن إضافة modal هنا لاختيار نوع العقار أو الانتقال لصفحة الاختيار
      // مؤقتاً سننتقل لصفحة إضافة العقارات للبيع
      onNavigate("add-sale");
      return;
    }
    
    // معالجة زر "محسن" ليوجه للداشبورد الرئيسي
    if (itemId === "enhanced-dashboard") {
      onNavigate("offers-requests-dashboard");
      return;
    }
    
    onNavigate(itemId);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t shadow-2xl"
      dir="rtl"
    >
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          // معالجة خاصة لزر "محسن" ليكون نشطاً في نفس صفحة الداشبورد
          const isActive = currentPage === item.id || 
            (currentPage === "offers-requests-dashboard" && item.id === "enhanced-dashboard");
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                flex flex-col items-center justify-center gap-1 p-2 rounded-xl min-w-[60px]
                transition-all duration-200 relative
                ${isActive 
                  ? `${item.color} bg-gray-50` 
                  : 'text-gray-400 hover:text-gray-600'
                }
                ${item.isSpecial ? 'transform scale-110' : ''}
              `}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: item.isSpecial ? 1.15 : 1.05 }}
            >
              {/* Background for special button */}
              {item.isSpecial && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
                  layoutId="specialBg"
                />
              )}
              
              {/* Active indicator */}
              {isActive && !item.isSpecial && (
                <motion.div
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full"
                  layoutId="activeIndicator"
                />
              )}
              
              <Icon 
                className={`
                  w-6 h-6 relative z-10
                  ${item.isSpecial ? 'text-white' : ''}
                `}
              />
              <span 
                className={`
                  text-xs font-medium relative z-10
                  ${item.isSpecial ? 'text-white' : ''}
                `}
              >
                {item.label}
              </span>
              
              {/* Badge for notifications */}
              {item.id === "offers-requests-stats" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-[8px] text-white font-bold">!</span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Bottom safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white/95" />
    </motion.div>
  );
});

export { OffersRequestsBottomNav };