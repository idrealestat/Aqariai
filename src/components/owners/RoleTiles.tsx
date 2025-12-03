import { motion } from "motion/react";
import { OwnerRole } from "../../types/owners";
import { Home, Search, Building, Users } from "lucide-react";

interface RoleTilesProps {
  onRoleSelect: (role: OwnerRole) => void;
}

interface RoleTileData {
  role: OwnerRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: {
    from: string;
    to: string;
    border: string;
    hover: string;
  };
}

const roles: RoleTileData[] = [
  {
    role: 'seller',
    title: 'بائع أو مؤجر',
    description: 'عرض عقارك للبيع والتواصل مع المشترين',
    icon: <Home className="w-8 h-8" />,
    color: {
      from: 'from-green-100',
      to: 'to-green-200',
      border: 'border-green-300',
      hover: 'hover:border-green-300'
    }
  },
  {
    role: 'buyer',
    title: 'مشتري أو مستأجر', 
    description: 'ابحث عن العقار المناسب وتواصل مع البائعين',
    icon: <Search className="w-8 h-8" />,
    color: {
      from: 'from-blue-100',
      to: 'to-blue-200',
      border: 'border-blue-300',
      hover: 'hover:border-blue-300'
    }
  }
];

export function RoleTiles({ onRoleSelect }: RoleTilesProps) {
  return (
    <div className="space-y-8">
      
      {/* العنوان الرئيسي */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-[#01411C] mb-4"
        >
          اختر دورك في النظام
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#065f41] text-lg"
        >
          حدد نوع الخدمة التي تحتاجها لنقوم بتخصيص التجربة لك
        </motion.p>
      </div>

      {/* الشبكة المتجاوبة للبطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {roles.map((roleData, index) => (
          <motion.div
            key={roleData.role}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
            <button
              onClick={() => onRoleSelect(roleData.role)}
              className={`
                role-tile w-full p-6 rounded-2xl border-2 transition-all duration-300
                bg-gradient-to-br ${roleData.color.from} ${roleData.color.to}
                ${roleData.color.border} ${roleData.color.hover}
                hover:shadow-xl hover:scale-102 focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/30
                group-hover:border-opacity-100
              `}
            >
              
              {/* الأيقونة */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center group-hover:bg-white transition-colors">
                  <div className="text-[#01411C] group-hover:scale-110 transition-transform">
                    {roleData.icon}
                  </div>
                </div>
              </div>

              {/* العنوان */}
              <h3 className="text-xl font-bold text-[#01411C] mb-3 group-hover:text-[#065f41] transition-colors">
                {roleData.title}
              </h3>

              {/* الوصف */}
              <p className="text-[#065f41] text-sm leading-relaxed group-hover:text-[#01411C] transition-colors">
                {roleData.description}
              </p>

              {/* مؤشر التفاعل */}
              <div className="mt-4 flex justify-center">
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "60%" }}
                  transition={{ duration: 0.3 }}
                  className="h-1 bg-[#D4AF37] rounded-full"
                />
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* معلومات إضافية */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto border border-[#D4AF37]/20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* للبائعين والمؤجرين */}
          <div className="text-center">
            <div className="w-12 h-12 bg-[#01411C] rounded-full flex items-center justify-center mx-auto mb-3">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-[#01411C] mb-2">
              لأصحاب العقارات
            </h4>
            <p className="text-[#065f41] text-sm">
              عرض عقاراتك، استقبال عروض من الوسطاء المختصين، وإدارة عملية البيع أو التأجير بسهولة
            </p>
          </div>

          {/* للمشترين والمستأجرين */}
          <div className="text-center">
            <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-[#01411C]" />
            </div>
            <h4 className="text-lg font-semibold text-[#01411C] mb-2">
              للباحثين عن عقار
            </h4>
            <p className="text-[#065f41] text-sm">
              أرسل طلبك بالمواصفات المطلوبة، استقبل عروض مخصصة من الوسطاء، واعثر على العقار المثالي
            </p>
          </div>
        </div>

        {/* الميزات المشتركة */}
        <div className="mt-6 pt-6 border-t border-[#D4AF37]/20">
          <h5 className="text-center text-[#01411C] font-semibold mb-4">
            ميزات النظام المشتركة
          </h5>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'تكامل الخرائط',
              'اقتراح الأسعار',
              'الذكاء الاصطناعي',
              'نظام CRM متكامل',
              'تواصل مباشر مع الوسطاء',
              'إدارة العقود'
            ].map((feature, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#f0fdf4] text-[#01411C] text-sm rounded-full border border-[#D4AF37]/30"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* دعوة للعمل */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="text-center"
      >
        <p className="text-[#065f41] text-lg mb-4">
          جاهز للبدء؟ اختر دورك أعلاه لتخصيص تجربتك
        </p>
        <div className="flex justify-center">
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-2xl">⬆️</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}