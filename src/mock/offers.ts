// بيانات تجريبية للعروض العقارية - للاستخدام في LeftSlider
export interface MockOffer {
  id: string;
  title: string;
  type: 'sale' | 'rent';
  price: number;
  location: string;
  description: string;
  status: 'open' | 'accepted' | 'rejected';
  createdAt: string;
}

export const mockOffers: MockOffer[] = [
  // العروض المتاحة
  {
    id: "1",
    title: "شقة للبيع - الرياض",
    type: "sale",
    price: 450000,
    location: "الرياض - حي الياسمين",
    description: "شقة 3 غرف وصالة، دور ثاني، تشطيب ممتاز",
    status: "open",
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    title: "فيلا للإيجار - جدة",
    type: "rent",
    price: 8000,
    location: "جدة - حي الروضة",
    description: "فيلا دوبلكس 5 غرف، حديقة، موقف سيارتين",
    status: "open",
    createdAt: "2024-01-14"
  },
  {
    id: "3",
    title: "محل تجاري للبيع",
    type: "sale", 
    price: 320000,
    location: "الدمام - الخبر",
    description: "محل على شارع تجاري رئيسي، مساحة 80 متر",
    status: "open",
    createdAt: "2024-01-13"
  },
  {
    id: "4",
    title: "شقة للإيجار - الرياض",
    type: "rent",
    price: 2500,
    location: "الرياض - حي النزهة", 
    description: "شقة غرفتين وصالة، مفروشة جزئياً",
    status: "open",
    createdAt: "2024-01-12"
  },
  {
    id: "5",
    title: "أرض للبيع - مكة",
    type: "sale",
    price: 280000,
    location: "مكة - العزيزية",
    description: "أرض سكنية 600 متر، زاوية شارعين",
    status: "open",
    createdAt: "2024-01-11"
  },
  {
    id: "6",
    title: "مكتب للإيجار - الرياض",
    type: "rent",
    price: 4500,
    location: "الرياض - العليا",
    description: "مكتب 4 غرف، استقبال، دور ثالث",
    status: "open",
    createdAt: "2024-01-10"
  },
  {
    id: "7",
    title: "شاليه للبيع - الطائف",
    type: "sale",
    price: 180000,
    location: "الطائف - الهدا",
    description: "شاليه خشبي مع إطلالة جبلية رائعة",
    status: "open",
    createdAt: "2024-01-09"
  },
  {
    id: "8",
    title: "استراحة للإيجار - الرياض",
    type: "rent",
    price: 1200,
    location: "الرياض - الخرج",
    description: "استراحة عائلية مع مسبح وملاعب",
    status: "open",
    createdAt: "2024-01-08"
  },

  // العروض المقبولة
  {
    id: "9",
    title: "بيت شعبي للبيع - الأحساء",
    type: "sale",
    price: 150000,
    location: "الأحساء - الهفوف",
    description: "بيت شعبي مجدد، فناء واسع، مواقف متعددة",
    status: "accepted",
    createdAt: "2024-01-07"
  },
  {
    id: "10",
    title: "مستودع للإيجار - الدمام",
    type: "rent", 
    price: 6000,
    location: "الدمام - المنطقة الصناعية",
    description: "مستودع 500 متر، رافعة شوكية، أمان عالي",
    status: "accepted",
    createdAt: "2024-01-06"
  },
  {
    id: "11",
    title: "عمارة للبيع - الرياض",
    type: "sale",
    price: 1200000,
    location: "الرياض - الملك فهد",
    description: "عمارة سكنية 8 شقق، دخل شهري 24 ألف",
    status: "accepted",
    createdAt: "2024-01-05"
  },

  // العروض المرفوضة
  {
    id: "12",
    title: "شقة قديمة للبيع",
    type: "sale",
    price: 120000,
    location: "جدة - حي قديم",
    description: "شقة تحتاج تجديد شامل، إطلالة محدودة",
    status: "rejected",
    createdAt: "2024-01-04"
  },
  {
    id: "13",
    title: "محل في موقع ضعيف",
    type: "rent",
    price: 1800,
    location: "الرياض - منطقة هادئة",
    description: "محل صغير، حركة قليلة، يحتاج تسويق قوي",
    status: "rejected",
    createdAt: "2024-01-03"
  },
  {
    id: "14",
    title: "فيلا بعيدة عن الخدمات",
    type: "sale",
    price: 380000,
    location: "خارج المدينة",
    description: "فيلا كبيرة لكن بعيدة عن المدارس والمستشفيات",
    status: "rejected",
    createdAt: "2024-01-02"
  }
];