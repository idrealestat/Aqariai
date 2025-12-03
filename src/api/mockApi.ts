import { RegistrationData, PropertyForm } from "../types/crm";
import { Offer, OfferFilter, OfferStats } from "../types/offers";

const STORAGE_KEY = "waseeti:crm:data_v1";

export async function saveRegistration(data: RegistrationData) {
  try {
    // هنا يمكنك استدعاء API خارجي بدل التخزين المحلي
    const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    db.registrations = db.registrations || [];
    db.registrations.push(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    // محاكاة رد API
    return { ok: true, id: data.id };
  } catch (error) {
    console.error("خطأ في حفظ التسجيل:", error);
    return { ok: false, error: "فشل في حفظ البيانات" };
  }
}

export async function saveProperty(form: PropertyForm) {
  try {
    const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    db.properties = db.properties || [];
    db.properties.push(form);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return { ok: true, id: form.id };
  } catch (error) {
    console.error("خطأ في حفظ العقار:", error);
    return { ok: false, error: "فشل في حفظ العقار" };
  }
}

export async function getMarketRange(city: string, district: string, propertyType?: string) {
  // mock: يمكنك هنا ربط API خارجي لاستخراج نطاق السوق الفعلي
  // نرجع نطاقًا متعدد القيم لتقديم خيارات (low, avg, high)
  await new Promise(resolve => setTimeout(resolve, 100)); // تقليل التأخير
  
  const basePrice = propertyType === "land" ? 300000 : 
                   propertyType === "villa" ? 800000 :
                   propertyType === "apartment" ? 400000 : 500000;
  
  const cityMultiplier = city === "الرياض" ? 1.3 :
                        city === "جدة" ? 1.2 :
                        city === "الدمام" ? 1.1 : 1.0;
  
  const low = Math.round(basePrice * cityMultiplier * 0.8);
  const avg = Math.round(basePrice * cityMultiplier);
  const high = Math.round(basePrice * cityMultiplier * 1.2);
  
  return {
    low,
    avg,
    high,
    rangeLabel: `${low.toLocaleString()} - ${high.toLocaleString()} ريال`
  };
}

export async function analyzePriceStatus(price: number, marketRange: any) {
  if (!marketRange || !price) return "غير محدد";
  
  if (price < marketRange.low * 0.9) return "قد تكون بها عيوب";
  if (price < marketRange.avg * 0.95) return "فرصة ممتازة";
  if (price <= marketRange.avg * 1.05) return "سعر معقول";
  return "مبالغ فيه";
}

export async function generateAIDescription(propertyData: any) {
  // محاكاة API للذكاء الاصطناعي - تقليل التأخير
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const { title, city, district, propertyType, area, rooms, bathrooms, features, price } = propertyData;
  
  let description = `${title || (propertyType === "land" ? "أرض سكنية مميزة" : "عقار فاخر")} في منطقة ${district} بمدينة ${city}. `;
  
  if (area) description += `تبلغ المساحة ${area} متر مربع، `;
  if (rooms && propertyType !== "land") description += `تحتوي على ${rooms} غرف نوم، `;
  if (bathrooms && propertyType !== "land") description += `${bathrooms} دورات مياه، `;
  
  // إضافة الميزات
  if (features?.pool) description += "مسبح خاص، ";
  if (features?.playground) description += "منطقة ألعاب أطفال، ";
  if (features?.modernDesign) description += "تصميم عصري، ";
  if (features?.elevator) description += "مصعد، ";
  if (features?.furnished) description += "مفروشة بالكامل، ";
  
  description += `موقع استراتيجي قريب من الخدمات والمرافق الأساسية. `;
  
  if (price) {
    description += `السعر المطلوب ${price.toLocaleString()} ريال. `;
  }
  
  description += "للجادين فقط.";
  
  return description;
}

export async function getRegistrationById(id: string): Promise<RegistrationData | null> {
  const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  return db.registrations?.find((reg: RegistrationData) => reg.id === id) || null;
}

export async function getPropertiesByOwner(ownerId: string): Promise<PropertyForm[]> {
  const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  return db.properties?.filter((prop: PropertyForm) => prop.ownerId === ownerId) || [];
}

// ============ دوال العروض ============

// البيانات التجريبية للعروض
const SAMPLE_OFFERS: Offer[] = [
  {
    id: "offer-1",
    title: "شقة فاخرة مفروشة بالكامل في حي الياسمين",
    type: "sale",
    propertyType: "apartment",
    price: 650000,
    originalPrice: 700000,
    area: 150,
    location: {
      city: "الرياض",
      district: "الياسمين",
      address: "شارع الملك فهد"
    },
    features: {
      rooms: 3,
      bathrooms: 2,
      kitchens: 1,
      parking: true,
      elevator: true,
      furnished: true,
      airConditioning: true
    },
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800"
    ],
    description: "شقة فاخرة مفروشة بالكامل، تقع في موقع مميز بحي الياسمين. تتميز بالتصميم العصري والتشطيبات الفاخرة.",
    contact: {
      name: "أحمد محمد",
      phone: "+966501234567",
      email: "ahmed@example.com",
      whatsapp: "+966501234567"
    },
    agent: {
      id: "agent-1",
      name: "مكتب العقارات المتميز",
      company: "العقارات المتميزة",
      phone: "+966501234567",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
    },
    status: "active",
    priority: "high",
    tags: ["مفروش", "مصعد", "موقف سيارة"],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    views: 245,
    favorites: 18,
    isPromoted: true,
    isVerified: true,
    commission: 2.5,
    negotiable: true,
    marketValue: {
      min: 600000,
      max: 720000,
      status: "market_price"
    }
  },
  {
    id: "offer-2",
    title: "فيلا راقية مع مسبح خاص في حي العليا",
    type: "sale",
    propertyType: "villa",
    price: 1250000,
    area: 400,
    location: {
      city: "الرياض",
      district: "العليا",
      address: "شارع التحلية"
    },
    features: {
      rooms: 5,
      bathrooms: 4,
      kitchens: 2,
      parking: true,
      pool: true,
      garden: true,
      security: true
    },
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ],
    description: "فيلا راقية بتصميم معماري فريد، تحتوي على مسبح خاص وحديقة واسعة. موقع مميز في قلب حي العليا.",
    contact: {
      name: "خالد السعود",
      phone: "+966502345678",
      whatsapp: "+966502345678"
    },
    status: "active",
    priority: "high",
    tags: ["مسبح", "حديقة", "أمن وحراسة"],
    createdAt: "2024-01-14T15:30:00Z",
    updatedAt: "2024-01-14T15:30:00Z",
    views: 312,
    favorites: 25,
    isPromoted: true,
    isVerified: true,
    commission: 3,
    negotiable: true,
    marketValue: {
      min: 1150000,
      max: 1350000,
      status: "market_price"
    }
  },
  {
    id: "offer-3",
    title: "شقة للإيجار في حي الملز - 3 غرف",
    type: "rent",
    propertyType: "apartment",
    price: 35000,
    area: 120,
    location: {
      city: "الرياض",
      district: "الملز"
    },
    features: {
      rooms: 3,
      bathrooms: 2,
      kitchens: 1,
      parking: true,
      elevator: true
    },
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
    ],
    description: "شقة مريحة للإيجار في موقع ممتاز بحي الملز، قريبة من المدارس والمراكز التجارية.",
    contact: {
      name: "فاطمة أحمد",
      phone: "+966503456789"
    },
    status: "active",
    priority: "medium",
    tags: ["إيجار سنوي", "قريب من المدارس"],
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
    views: 156,
    favorites: 8,
    isPromoted: false,
    isVerified: true,
    negotiable: true,
    marketValue: {
      min: 32000,
      max: 38000,
      status: "market_price"
    }
  },
  {
    id: "offer-4",
    title: "أرض تجارية على شارع رئيسي",
    type: "sale",
    propertyType: "land",
    price: 2500000,
    area: 1000,
    location: {
      city: "جدة",
      district: "الصفا"
    },
    features: {
      parking: true
    },
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"
    ],
    description: "أرض تجارية في موقع استراتيجي على شارع رئيسي، مثالية للاس��ثمار التجاري.",
    contact: {
      name: "محمد العتيبي",
      phone: "+966504567890"
    },
    status: "active",
    priority: "high",
    tags: ["استثمار", "شارع رئيسي", "تجاري"],
    createdAt: "2024-01-12T14:20:00Z",
    updatedAt: "2024-01-12T14:20:00Z",
    views: 89,
    favorites: 12,
    isPromoted: false,
    isVerified: false,
    commission: 2,
    negotiable: true,
    marketValue: {
      min: 2200000,
      max: 2800000,
      status: "market_price"
    }
  },
  {
    id: "offer-5",
    title: "محل تجاري في مجمع تجاري حديث",
    type: "rent",
    propertyType: "shop",
    price: 120000,
    area: 85,
    location: {
      city: "الدمام",
      district: "النخيل"
    },
    features: {
      parking: true,
      airConditioning: true
    },
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
    ],
    description: "محل تجاري في مجمع حديث بموقع حيوي، مناسب لجميع الأنشطة التجارية.",
    contact: {
      name: "سارة الغامدي",
      phone: "+966505678901"
    },
    status: "active",
    priority: "medium",
    tags: ["تجاري", "مجمع حديث", "موقع حيوي"],
    createdAt: "2024-01-11T11:45:00Z",
    updatedAt: "2024-01-11T11:45:00Z",
    views: 167,
    favorites: 6,
    isPromoted: true,
    isVerified: true,
    negotiable: false,
    marketValue: {
      min: 110000,
      max: 130000,
      status: "market_price"
    }
  }
];

export async function getOffers(filter?: OfferFilter): Promise<Offer[]> {
  // محاكاة تأخير الشبكة
  await new Promise(resolve => setTimeout(resolve, 200));
  
  let offers = [...SAMPLE_OFFERS];
  
  if (!filter) return offers;
  
  // تطبيق الفلاتر
  if (filter.type) {
    offers = offers.filter(offer => offer.type === filter.type);
  }
  
  if (filter.propertyType?.length) {
    offers = offers.filter(offer => filter.propertyType!.includes(offer.propertyType));
  }
  
  if (filter.status?.length) {
    offers = offers.filter(offer => filter.status!.includes(offer.status));
  }
  
  if (filter.priceRange) {
    offers = offers.filter(offer => 
      offer.price >= filter.priceRange!.min && offer.price <= filter.priceRange!.max
    );
  }
  
  if (filter.areaRange) {
    offers = offers.filter(offer => 
      offer.area >= filter.areaRange!.min && offer.area <= filter.areaRange!.max
    );
  }
  
  if (filter.location?.cities?.length) {
    offers = offers.filter(offer => filter.location!.cities!.includes(offer.location.city));
  }
  
  if (filter.location?.districts?.length) {
    offers = offers.filter(offer => filter.location!.districts!.includes(offer.location.district));
  }
  
  if (filter.features) {
    const { minRooms, minBathrooms, furnished, parking, elevator, garden, pool } = filter.features;
    
    offers = offers.filter(offer => {
      if (minRooms && offer.features.rooms && offer.features.rooms < minRooms) return false;
      if (minBathrooms && offer.features.bathrooms && offer.features.bathrooms < minBathrooms) return false;
      if (furnished !== undefined && offer.features.furnished !== furnished) return false;
      if (parking !== undefined && offer.features.parking !== parking) return false;
      if (elevator !== undefined && offer.features.elevator !== elevator) return false;
      if (garden !== undefined && offer.features.garden !== garden) return false;
      if (pool !== undefined && offer.features.pool !== pool) return false;
      return true;
    });
  }
  
  if (filter.isPromoted !== undefined) {
    offers = offers.filter(offer => offer.isPromoted === filter.isPromoted);
  }
  
  if (filter.isVerified !== undefined) {
    offers = offers.filter(offer => offer.isVerified === filter.isVerified);
  }
  
  if (filter.tags?.length) {
    offers = offers.filter(offer => 
      filter.tags!.some(tag => offer.tags.includes(tag))
    );
  }
  
  return offers;
}

export async function getOfferById(id: string): Promise<Offer | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return SAMPLE_OFFERS.find(offer => offer.id === id) || null;
}

export async function saveOffer(offer: Offer): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    db.offers = db.offers || [];
    
    const existingIndex = db.offers.findIndex((o: Offer) => o.id === offer.id);
    if (existingIndex >= 0) {
      db.offers[existingIndex] = { ...offer, updatedAt: new Date().toISOString() };
    } else {
      db.offers.push({ ...offer, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return { ok: true, id: offer.id };
  } catch (error) {
    console.error("خطأ في حفظ العرض:", error);
    return { ok: false, error: "فشل في حفظ العرض" };
  }
}

export async function getOfferStats(filter?: OfferFilter): Promise<OfferStats> {
  const offers = await getOffers(filter);
  
  const stats: OfferStats = {
    total: offers.length,
    active: offers.filter(o => o.status === 'active').length,
    pending: offers.filter(o => o.status === 'pending').length,
    sold: offers.filter(o => o.status === 'sold').length,
    rented: offers.filter(o => o.status === 'rented').length,
    expired: offers.filter(o => o.status === 'expired').length,
    views: offers.reduce((sum, o) => sum + o.views, 0),
    favorites: offers.reduce((sum, o) => sum + o.favorites, 0),
    averagePrice: offers.length > 0 ? offers.reduce((sum, o) => sum + o.price, 0) / offers.length : 0,
    totalValue: offers.reduce((sum, o) => sum + o.price, 0)
  };
  
  return stats;
}

export async function incrementOfferViews(offerId: string): Promise<void> {
  try {
    const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    db.offers = db.offers || [];
    
    const offerIndex = db.offers.findIndex((o: Offer) => o.id === offerId);
    if (offerIndex >= 0) {
      db.offers[offerIndex].views = (db.offers[offerIndex].views || 0) + 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }
  } catch (error) {
    console.error("خطأ في تحديث المشاهدات:", error);
  }
}

export async function toggleOfferFavorite(offerId: string, isFavorite: boolean): Promise<void> {
  try {
    const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    db.offers = db.offers || [];
    
    const offerIndex = db.offers.findIndex((o: Offer) => o.id === offerId);
    if (offerIndex >= 0) {
      const currentFavorites = db.offers[offerIndex].favorites || 0;
      db.offers[offerIndex].favorites = isFavorite ? currentFavorites + 1 : Math.max(0, currentFavorites - 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }
  } catch (error) {
    console.error("خطأ في تحديث الإعجابات:", error);
  }
}