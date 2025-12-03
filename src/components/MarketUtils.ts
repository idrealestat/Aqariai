/**
 * MarketUtils.ts - دوال مقارنة الأسعار مع السوق
 * جزء من منصة عقاري AI Aqari - CRM للعقارات
 */

export interface MarketRange {
  min: number;
  max: number;
  average: number;
  currency: string;
}

/**
 * جلب نطاق الأسعار التقديري للعقار بناءً على الموقع والنوع
 */
export function getMarketRange(
  city: string, 
  district: string, 
  propertyType: string,
  dealType: "بيع" | "إيجار" = "بيع"
): MarketRange | null {
  
  // بيانات وهمية للأسعار - يمكن ربطها بـ API حقيقية لاحقاً
  const marketData: Record<string, Record<string, Record<string, { sale: MarketRange; rent: MarketRange }>>> = {
    "الرياض": {
      "الياسمين": {
        "شقة": {
          sale: { min: 450000, max: 650000, average: 550000, currency: "ريال" },
          rent: { min: 35000, max: 55000, average: 45000, currency: "ريال/سنوياً" }
        },
        "فيلا": {
          sale: { min: 1800000, max: 2500000, average: 2150000, currency: "ريال" },
          rent: { min: 80000, max: 120000, average: 100000, currency: "ريال/سنوياً" }
        },
        "أرض": {
          sale: { min: 1200000, max: 1800000, average: 1500000, currency: "ريال" },
          rent: { min: 0, max: 0, average: 0, currency: "غير متاح" }
        }
      },
      "الملز": {
        "شقة": {
          sale: { min: 380000, max: 580000, average: 480000, currency: "ريال" },
          rent: { min: 30000, max: 45000, average: 37500, currency: "ريال/سنوياً" }
        },
        "محل": {
          sale: { min: 600000, max: 1200000, average: 900000, currency: "ريال" },
          rent: { min: 60000, max: 100000, average: 80000, currency: "ريال/سنوياً" }
        }
      },
      "العليا": {
        "شقة": {
          sale: { min: 500000, max: 750000, average: 625000, currency: "ريال" },
          rent: { min: 40000, max: 65000, average: 52500, currency: "ريال/سنوياً" }
        },
        "مكتب": {
          sale: { min: 800000, max: 1500000, average: 1150000, currency: "ريال" },
          rent: { min: 70000, max: 120000, average: 95000, currency: "ريال/سنوياً" }
        }
      }
    },
    "جدة": {
      "الشاطئ": {
        "شقة": {
          sale: { min: 420000, max: 680000, average: 550000, currency: "ريال" },
          rent: { min: 32000, max: 50000, average: 41000, currency: "ريال/سنوياً" }
        },
        "فيلا": {
          sale: { min: 1600000, max: 2400000, average: 2000000, currency: "ريال" },
          rent: { min: 75000, max: 110000, average: 92500, currency: "ريال/سنوياً" }
        },
        "أرض": {
          sale: { min: 900000, max: 1400000, average: 1150000, currency: "ريال" },
          rent: { min: 0, max: 0, average: 0, currency: "غير متاح" }
        }
      },
      "البلد": {
        "محل": {
          sale: { min: 500000, max: 900000, average: 700000, currency: "ريال" },
          rent: { min: 45000, max: 75000, average: 60000, currency: "ريال/سنوياً" }
        }
      }
    },
    "الدمام": {
      "النخيل": {
        "شقة": {
          sale: { min: 350000, max: 520000, average: 435000, currency: "ريال" },
          rent: { min: 28000, max: 42000, average: 35000, currency: "ريال/سنوياً" }
        },
        "دبلكس": {
          sale: { min: 480000, max: 720000, average: 600000, currency: "ريال" },
          rent: { min: 38000, max: 58000, average: 48000, currency: "ريال/سنوياً" }
        }
      },
      "الشاطئ": {
        "فيلا": {
          sale: { min: 1400000, max: 2100000, average: 1750000, currency: "ريال" },
          rent: { min: 65000, max: 95000, average: 80000, currency: "ريال/سنوياً" }
        }
      }
    },
    "الخبر": {
      "الحمراء": {
        "شقة": {
          sale: { min: 380000, max: 580000, average: 480000, currency: "ريال" },
          rent: { min: 30000, max: 46000, average: 38000, currency: "ريال/سنوياً" }
        },
        "تربلكس": {
          sale: { min: 650000, max: 950000, average: 800000, currency: "ريال" },
          rent: { min: 52000, max: 78000, average: 65000, currency: "ريال/سنوياً" }
        }
      },
      "الكورنيش": {
        "فيلا": {
          sale: { min: 1500000, max: 2200000, average: 1850000, currency: "ريال" },
          rent: { min: 70000, max: 100000, average: 85000, currency: "ريال/سنوياً" }
        }
      }
    },
    "مكة المكرمة": {
      "العزيزية": {
        "شقة": {
          sale: { min: 400000, max: 600000, average: 500000, currency: "ريال" },
          rent: { min: 32000, max: 48000, average: 40000, currency: "ريال/سنوياً" }
        }
      },
      "النسيم": {
        "فيلا": {
          sale: { min: 1600000, max: 2300000, average: 1950000, currency: "ريال" },
          rent: { min: 75000, max: 105000, average: 90000, currency: "ريال/سنوياً" }
        }
      }
    },
    "المدينة المنورة": {
      "قباء": {
        "شقة": {
          sale: { min: 320000, max: 480000, average: 400000, currency: "ريال" },
          rent: { min: 25000, max: 38000, average: 31500, currency: "ريال/سنوياً" }
        }
      },
      "العيون": {
        "فيلا": {
          sale: { min: 1200000, max: 1800000, average: 1500000, currency: "ريال" },
          rent: { min: 55000, max: 80000, average: 67500, currency: "ريال/سنوياً" }
        }
      }
    }
  };

  // البحث في البيانات
  const cityData = marketData[city];
  if (!cityData) return null;

  const districtData = cityData[district];
  if (!districtData) return null;

  const propertyData = districtData[propertyType];
  if (!propertyData) return null;

  // إرجاع البيانات بناءً على نوع الصفقة
  return dealType === "بيع" ? propertyData.sale : propertyData.rent;
}

/**
 * تحديد ما إذا كان السعر مرتفع أو منخفض أو عادل مقارنة بالسوق
 */
export function getPriceAnalysis(
  price: number, 
  marketRange: MarketRange | null
): { 
  status: "مرتفع" | "منخفض" | "عادل" | "غير محدد", 
  percentage: number,
  message: string 
} {
  if (!marketRange) {
    return { 
      status: "غير محدد", 
      percentage: 0, 
      message: "لا توجد بيانات سوقية متاحة" 
    };
  }

  const { min, max, average } = marketRange;
  
  if (price < min) {
    const percentage = Math.round(((min - price) / min) * 100);
    return { 
      status: "منخفض", 
      percentage, 
      message: `أقل من السوق بـ ${percentage}%` 
    };
  } else if (price > max) {
    const percentage = Math.round(((price - max) / max) * 100);
    return { 
      status: "مرتفع", 
      percentage, 
      message: `أعلى من السوق بـ ${percentage}%` 
    };
  } else {
    const percentage = Math.round(((price - average) / average) * 100);
    if (Math.abs(percentage) <= 5) {
      return { 
        status: "عادل", 
        percentage: 0, 
        message: "ضمن النطاق العادل للسوق" 
      };
    } else if (percentage > 0) {
      return { 
        status: "مرتفع", 
        percentage, 
        message: `أعلى من المتوسط بـ ${percentage}%` 
      };
    } else {
      return { 
        status: "منخفض", 
        percentage: Math.abs(percentage), 
        message: `أقل من المتوسط بـ ${Math.abs(percentage)}%` 
      };
    }
  }
}

/**
 * قائمة المدن السعودية الرئيسية
 */
export const saudiCities = [
  "الرياض",
  "جدة", 
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "الطائف",
  "بريدة",
  "تبوك",
  "خميس مشيط",
  "حائل",
  "الجبيل",
  "الخرج",
  "ينبع",
  "نجران",
  "الباحة",
  "عرعر",
  "سكاكا",
  "جازان",
  "أبها"
];

/**
 * قائمة الأحياء لكل مدينة
 */
export const cityDistricts: Record<string, string[]> = {
  "الرياض": [
    "الياسمين", "العليا", "الملز", "النرجس", "الورود", "الربوة", 
    "التعاون", "السليمانية", "المروج", "النهضة", "الغدير", "حي السفارات",
    "المحمدية", "الواحة", "الفلاح", "البديعة", "الصحافة", "الخزامى"
  ],
  "جدة": [
    "الشاطئ", "البلد", "الصفا", "الأندلس", "النعيم", "الروضة",
    "الزهراء", "أبحر", "الحمراء", "الربوة", "المرجان", "الواحة"
  ],
  "الدمام": [
    "النخيل", "الشاطئ", "الفردوس", "الجلوية", "البديع", "الضباب",
    "الأمانة", "الصناعية", "المباركية", "الروابي"
  ],
  "الخبر": [
    "الحمراء", "الكورنيش", "العقربية", "الثقبة", "الجسر", "البندرية",
    "الخالدية", "الراكة", "اللؤلؤ", "الحزام الأخضر"
  ],
  "مكة المكرمة": [
    "العزيزية", "النسيم", "الشرائع", "الهجرة", "الكعكية", "التنعيم",
    "المعابدة", "العوالي", "الزاهر", "ريع ذاخر"
  ],
  "المدينة المنورة": [
    "قباء", "العيون", "الحرة", "المطار", "التحلية", "السيح",
    "الدويمة", "العاقول", "الصديق", "الجمعة"
  ]
};

/**
 * أنواع العقارات المختلفة
 */
export const propertyTypes = [
  "شقة",
  "فيلا", 
  "أرض",
  "دبلكس",
  "عمارة",
  "فندق",
  "محل",
  "شقة بمدخل خاص",
  "شقة دبلكس",
  "شقة تربلكس",
  "ملحق",
  "دور أرضي",
  "دور علوي",
  "مكتب",
  "معرض",
  "مستودع",
  "قصر",
  "استراحة",
  "مزرعة",
  "شاليه"
];

/**
 * تصنيفات العقار
 */
export const propertyCategories = [
  "سكني",
  "تجاري", 
  "إداري",
  "صناعي",
  "زراعي",
  "ترفيهي"
];

/**
 * طرق الدفع المختلفة
 */
export const paymentMethods = [
  "دفعة واحدة",
  "دفعتين",
  "4 دفعات",
  "شهري",
  "شهري عبر رايز",
  "شهري عبر تأجير",
  "ربع سنوي",
  "نصف سنوي",
  "سنوي"
];

/**
 * أنواع السكن
 */
export const housingTypes = [
  "عزاب",
  "عوائل",
  "عزاب وعوائل",
  "مكاتب فقط",
  "تجاري فقط"
];