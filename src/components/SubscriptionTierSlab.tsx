/*
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                  🎖️ SUBSCRIPTION TIER SLABS - سبائك الباقات الذهبية                      ║
║──────────────────────────────────────────────────────────────────────────────────────────────────────────────║
║  نظام متكامل لعرض الباقات كسبائك ذهبية وفضية مع تأثيرات ضوئية محسنة                                      ║
║  يدعم 4 أنواع × 4 مستويات = 16 تصميم مخصص                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/

import React from "react";
import { motion } from "motion/react";

// أنواع الحسابات
type AccountType = "individual" | "team" | "office" | "company";

// مستويات الباقات
type TierLevel = "bronze" | "silver" | "gold" | "platinum" | 
                 "dark" | "royal" | "golddark" | 
                 "copper" | "goldlight" | "platgold" |
                 "royalgold" | "blackplat";

interface SubscriptionTierSlabProps {
  accountType: AccountType;
  tierLevel: TierLevel;
  label: string;
  compact?: boolean;
  animated?: boolean;
  onClick?: () => void;
  className?: string;
}

// تعريف الألوان والتصاميم لكل باقة
const TIER_STYLES: Record<string, {
  gradient: string;
  border: string;
  textColor: string;
  shadow: string;
}> = {
  // Individual Plans
  "individual-bronze": {
    gradient: "linear-gradient(180deg, #B87333 0%, #A55F2D 100%)",
    border: "rgba(166,124,0,0.9)",
    textColor: "#ffffff",
    shadow: "0 6px 18px rgba(184, 115, 51, 0.3)"
  },
  "individual-silver": {
    gradient: "linear-gradient(180deg, #E9E9EA 0%, #CFCFCF 100%)",
    border: "rgba(255,255,255,0.3)",
    textColor: "#1f2937",
    shadow: "0 6px 18px rgba(207, 207, 207, 0.3)"
  },
  "individual-gold": {
    gradient: "linear-gradient(180deg, #FFD54A 0%, #D4AF37 100%)",
    border: "#A67C00",
    textColor: "#ffffff",
    shadow: "0 6px 18px rgba(212, 175, 55, 0.4)"
  },
  "individual-platinum": {
    gradient: "linear-gradient(180deg, #F4F6F8 0%, #E5E4E2 100%)",
    border: "rgba(212,175,55,0.5)",
    textColor: "#111827",
    shadow: "0 6px 18px rgba(229, 228, 226, 0.3)"
  },

  // Team Plans
  "team-dark": {
    gradient: "linear-gradient(180deg,#4b4b4b 0%, #3d3d3d 100%)",
    border: "rgba(255,255,255,0.06)",
    textColor: "#ffffff",
    shadow: "0 6px 18px rgba(75, 75, 75, 0.3)"
  },
  "team-royal": {
    gradient: "linear-gradient(180deg,#1A3E8C 0%, #16346f 100%)",
    border: "rgba(212,175,55,0.22)",
    textColor: "#ffffff",
    shadow: "0 6px 18px rgba(26, 62, 140, 0.4)"
  },
  "team-gold": {
    gradient: "linear-gradient(180deg,#D4AF37 0%, #B8860B 100%)",
    border: "#A67C00",
    textColor: "#ffffff",
    shadow: "0 6px 18px rgba(212, 175, 55, 0.4)"
  },
  "team-platinum": {
    gradient: "linear-gradient(180deg,#CFEFF0 0%, #BFE0E1 100%)",
    border: "rgba(212,175,55,0.25)",
    textColor: "#022",
    shadow: "0 6px 18px rgba(207, 239, 240, 0.3)"
  },

  // Office Plans
  "office-copper": {
    gradient: "linear-gradient(180deg,#B87333 0%, #9F5A23 100%)",
    border: "rgba(166,124,0,0.9)",
    textColor: "#ffffff",
    shadow: "0 6px 18px rgba(184, 115, 51, 0.3)"
  },
  "office-goldlight": {
    gradient: "linear-gradient(180deg,#FFE081 0%, #FFD15B 100%)",
    border: "rgba(212,175,55,0.6)",
    textColor: "#111",
    shadow: "0 6px 18px rgba(255, 224, 129, 0.4)"
  },
  "office-golddark": {
    gradient: "linear-gradient(180deg,#C99700 0%, #9C7600 100%)",
    border: "#A67C00",
    textColor: "#ffffff",
    shadow: "0 6px 18px rgba(201, 151, 0, 0.4)"
  },
  "office-platgold": {
    gradient: "linear-gradient(180deg,#EDE7E0 0%, #E1D6C4 100%)",
    border: "#A67C00",
    textColor: "#111",
    shadow: "0 6px 18px rgba(237, 231, 224, 0.3)"
  },

  // Company Plans
  "company-silver": {
    gradient: "linear-gradient(180deg,#D9D9D9 0%, #CFCFCF 100%)",
    border: "rgba(255,255,255,0.25)",
    textColor: "#111",
    shadow: "0 6px 18px rgba(217, 217, 217, 0.3)"
  },
  "company-gold": {
    gradient: "linear-gradient(180deg,#FFD54A 0%, #E6B800 100%)",
    border: "#A67C00",
    textColor: "#ffffff",
    shadow: "0 6px 18px rgba(255, 213, 74, 0.4)"
  },
  "company-royalgold": {
    gradient: "linear-gradient(180deg,#C99700 0%, #A67C00 100%)",
    border: "#A67C00",
    textColor: "#ffffff",
    shadow: "0 6px 18px rgba(201, 151, 0, 0.5)"
  },
  "company-blackplat": {
    gradient: "linear-gradient(180deg,#111111 0%, #2b2b2b 100%)",
    border: "#CFCFCF",
    textColor: "#EDEDED",
    shadow: "0 6px 18px rgba(17, 17, 17, 0.5)"
  }
};

export const SubscriptionTierSlab: React.FC<SubscriptionTierSlabProps> = ({
  accountType,
  tierLevel,
  label,
  compact = false,
  animated = true,
  onClick,
  className = ""
}) => {
  const styleKey = `${accountType}-${tierLevel}`;
  const style = TIER_STYLES[styleKey] || TIER_STYLES["individual-gold"];

  // تصميم السبيكة: مستطيل بحواف حادة بدون تدوير
  const baseClasses = compact 
    ? "px-4 py-2 text-xs min-h-[36px] min-w-[100px]"
    : "px-8 py-3 text-sm min-h-[52px] min-w-[140px]";

  const SlabContent = (
    <div
      className={`
        relative overflow-visible cursor-pointer
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        ${baseClasses}
        ${className}
      `}
      style={{
        background: style.gradient,
        // حواف بارزة ثلاثية الأبعاد (bevel)
        border: `3px solid ${style.border}`,
        borderTop: `4px solid ${style.border}`,
        borderBottom: `5px solid rgba(0,0,0,0.3)`,
        borderRight: `4px solid rgba(0,0,0,0.2)`,
        borderLeft: `3px solid ${style.border}`,
        color: style.textColor,
        // ظل متعدد الطبقات لإظهار البروز
        boxShadow: `
          inset 0 2px 4px rgba(255,255,255,0.3),
          inset 0 -2px 4px rgba(0,0,0,0.2),
          ${style.shadow},
          0 8px 16px rgba(0,0,0,0.3),
          0 2px 4px rgba(0,0,0,0.2)
        `,
        // حواف حادة بدون تدوير
        borderRadius: "2px",
        // تأثير معدني لامع
        backgroundImage: `
          ${style.gradient},
          linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)
        `,
        backgroundBlendMode: "overlay"
      }}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={label}
    >
      {/* طبقة اللمعان العلوية - لإظهار المعدن اللامع */}
      <div 
        className="absolute top-0 left-0 right-0 h-[40%] pointer-events-none z-10"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 70%, transparent 100%)",
          borderRadius: "1px 1px 0 0"
        }}
      />

      {/* طبقة الظل السفلية - لإظهار العمق */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none z-10"
        style={{
          background: "linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 100%)",
          borderRadius: "0 0 1px 1px"
        }}
      />

      {/* خط لامع متحرك - مثل انعكاس الضوء على السبيكة */}
      <div 
        className="absolute inset-0 pointer-events-none z-15 hover-shine"
        style={{
          background: "linear-gradient(110deg, transparent 0%, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "shine 3s ease-in-out infinite"
        }}
      />

      {/* النص */}
      <span 
        className="relative z-20 font-bold tracking-wide uppercase"
        style={{
          textShadow: `
            0 1px 0 rgba(255,255,255,0.3),
            0 2px 3px rgba(0,0,0,0.6),
            0 0 8px rgba(0,0,0,0.3)
          `,
          letterSpacing: "1px",
          fontWeight: 700
        }}
      >
        {label}
      </span>

      {/* حواف معدنية بارزة - Bevel Effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-5"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.5)",
          borderLeft: "1px solid rgba(255,255,255,0.3)",
          borderBottom: "1px solid rgba(0,0,0,0.4)",
          borderRight: "1px solid rgba(0,0,0,0.3)",
          borderRadius: "1px"
        }}
      />

      {/* زوايا بارزة محددة */}
      <div className="absolute top-0 left-0 w-2 h-2 pointer-events-none z-30" 
           style={{background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 100%)"}} />
      <div className="absolute top-0 right-0 w-2 h-2 pointer-events-none z-30" 
           style={{background: "linear-gradient(225deg, rgba(255,255,255,0.6) 0%, transparent 100%)"}} />
      <div className="absolute bottom-0 left-0 w-2 h-2 pointer-events-none z-30" 
           style={{background: "linear-gradient(45deg, rgba(0,0,0,0.4) 0%, transparent 100%)"}} />
      <div className="absolute bottom-0 right-0 w-2 h-2 pointer-events-none z-30" 
           style={{background: "linear-gradient(315deg, rgba(0,0,0,0.4) 0%, transparent 100%)"}} />

      {/* خطوط نقش على السطح - تفصيل واقعي */}
      <div className="absolute left-2 right-2 top-1 h-[1px] pointer-events-none z-25 opacity-30"
           style={{background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)"}} />
      <div className="absolute left-2 right-2 bottom-1 h-[1px] pointer-events-none z-25 opacity-30"
           style={{background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.6) 50%, transparent 100%)"}} />
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ 
          scale: 1.08,
          y: -8,
          rotateX: 5,
          boxShadow: `
            inset 0 3px 6px rgba(255,255,255,0.4),
            inset 0 -3px 6px rgba(0,0,0,0.3),
            0 12px 24px rgba(0,0,0,0.4),
            0 6px 12px rgba(0,0,0,0.3),
            0 0 20px rgba(212,175,55,0.3)
          `
        }}
        whileTap={{ 
          scale: 0.96,
          y: 0,
          boxShadow: `
            inset 0 2px 4px rgba(0,0,0,0.3),
            0 2px 4px rgba(0,0,0,0.2)
          `
        }}
        transition={{ 
          type: "spring",
          stiffness: 400,
          damping: 25
        }}
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d"
        }}
      >
        {SlabContent}
      </motion.div>
    );
  }

  return SlabContent;
};

// مكون مساعد لعرض جميع السبائك للنوع المحدد
interface TierSlabGridProps {
  accountType: AccountType;
  onTierSelect?: (tier: TierLevel) => void;
  currentTier?: TierLevel;
}

export const TierSlabGrid: React.FC<TierSlabGridProps> = ({
  accountType,
  onTierSelect,
  currentTier
}) => {
  const getTiersForAccountType = (type: AccountType): Array<{level: TierLevel, label: string}> => {
    switch (type) {
      case "individual":
        return [
          { level: "bronze" as TierLevel, label: "مبتدئ" },
          { level: "silver" as TierLevel, label: "محترف" },
          { level: "gold" as TierLevel, label: "خبير" },
          { level: "platinum" as TierLevel, label: "خبير مخصص" }
        ];
      case "team":
        return [
          { level: "dark" as TierLevel, label: "قائد" },
          { level: "royal" as TierLevel, label: "قائد تنفيذي" },
          { level: "gold" as TierLevel, label: "رائد اعمال" },
          { level: "platinum" as TierLevel, label: "رائد مخصص" }
        ];
      case "office":
        return [
          { level: "copper" as TierLevel, label: "الابداع" },
          { level: "goldlight" as TierLevel, label: "التميز" },
          { level: "golddark" as TierLevel, label: "الريادة" },
          { level: "platgold" as TierLevel, label: "الرياده مخصص" }
        ];
      case "company":
        return [
          { level: "silver" as TierLevel, label: "رواد" },
          { level: "gold" as TierLevel, label: "رجال الاعمال" },
          { level: "royalgold" as TierLevel, label: "مستثمر" },
          { level: "blackplat" as TierLevel, label: "مؤسس مخصص" }
        ];
    }
  };

  const tiers = getTiersForAccountType(accountType);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiers.map((tier) => (
        <SubscriptionTierSlab
          key={tier.level}
          accountType={accountType}
          tierLevel={tier.level}
          label={tier.label}
          onClick={() => onTierSelect?.(tier.level)}
          className={currentTier === tier.level ? "ring-4 ring-[#D4AF37] ring-offset-2" : ""}
        />
      ))}
    </div>
  );
};

// Hook مساعد لاستخدام السبائك
export const useSubscriptionTier = (userType?: string, userPlan?: string) => {
  const getAccountType = (): AccountType => {
    if (!userType) return "individual";
    
    switch (userType.toLowerCase()) {
      case "team":
      case "فريق":
        return "team";
      case "office":
      case "مكتب":
        return "office";
      case "company":
      case "شركة":
        return "company";
      default:
        return "individual";
    }
  };

  const getTierLevel = (): TierLevel => {
    if (!userPlan) return "bronze";
    
    const plan = userPlan.toLowerCase();
    
    // Individual tiers
    if (plan.includes("برونز") || plan.includes("bronze")) return "bronze";
    if (plan.includes("فضي") || plan.includes("silver")) return "silver";
    if (plan.includes("ذهبي") || plan.includes("gold")) return "gold";
    if (plan.includes("بلاتين") || plan.includes("platinum")) return "platinum";
    
    // Team tiers
    if (plan.includes("أساسي") || plan.includes("dark")) return "dark";
    if (plan.includes("متقدم") || plan.includes("royal")) return "royal";
    
    // Office tiers
    if (plan.includes("نحاس") || plan.includes("copper")) return "copper";
    if (plan.includes("فاتح") || plan.includes("light")) return "goldlight";
    if (plan.includes("داكن") || plan.includes("dark")) return "golddark";
    
    // Company tiers
    if (plan.includes("ملكي") || plan.includes("royal")) return "royalgold";
    if (plan.includes("أسود") || plan.includes("black")) return "blackplat";
    
    return "bronze";
  };

  const getTierLabel = (): string => {
    const accountType = getAccountType();
    const tierLevel = getTierLevel();
    
    const labels: Record<string, string> = {
      "individual-bronze": "مبتدئ",
      "individual-silver": "محترف",
      "individual-gold": "خبير",
      "individual-platinum": "خبير مخصص",
      "team-dark": "قائد",
      "team-royal": "قائد تنفيذي",
      "team-gold": "رائد اعمال",
      "team-platinum": "رائد مخصص",
      "office-copper": "الابداع",
      "office-goldlight": "التميز",
      "office-golddark": "الريادة",
      "office-platgold": "الرياده مخصص",
      "company-silver": "رواد",
      "company-gold": "رجال الاعمال",
      "company-royalgold": "مستثمر",
      "company-blackplat": "مؤسس مخصص"
    };
    
    return labels[`${accountType}-${tierLevel}`] || "غير محدد";
  };

  return {
    accountType: getAccountType(),
    tierLevel: getTierLevel(),
    tierLabel: getTierLabel()
  };
};

export default SubscriptionTierSlab;
