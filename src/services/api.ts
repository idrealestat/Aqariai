export const fetchListings = async () => {
  // استدعاء API لجلب العقارات
  return [
    {
      id: "1",
      title: "شقق للبيع - المنطقة الشرقية",
      mainImage: "https://via.placeholder.com/300",
      tags: ["سكني", "جديد"],
      area: 120,
      city: "الدمام",
    },
  ];
};

export const fetchClients = async () => {
  return [
    {
      id: "c1",
      name: "سامي العسيري",
      phone: "0500000000",
      email: "sami@example.com",
    },
  ];
};

export const publishListingAPI = async (id: string) => {
  console.log(`نشر العقار رقم ${id} على المنصات وربطه بـ "منصتي ولوحة التحكم"`);
  // استدعاء API للنشر على المنصات وربطه مع الزر الرئيسي
};
