// أنواع مشتركة للملاك والمشترين (غير الوسطاء)
export type RoleType = "owner" | "buyer" | "lessor" | "tenant"; // أدوار المالكين والمشترين والمستأجرين
export type AccountType = "individual" | "team" | "office" | "company"; // أنواع حسابات الوسطاء العقاريين

export interface RegistrationData {
  id: string;
  accountType: AccountType; // نوع الحساب (للوسطاء العقاريين)
  role: RoleType; // الدور المختار بعد التسجيل (للمالكين والمشترين)
  firstName: string;
  lastName?: string;
  nationalId?: string;
  birthDate?: string;
  email?: string;
  phone?: string;
  phoneVerified?: boolean;
  whatsapp?: string;
  city?: string;
  district?: string;
  plan?: string;
}

export type PropertyType =
  | "apartment"
  | "villa"
  | "land"
  | "duplex"
  | "triplex"
  | "shop"
  | "hotel"
  | "other";

export interface PropertyFeatures {
  pool?: boolean;
  frontYard?: boolean;
  backYard?: boolean;
  balconies?: number;
  storages?: number;
  privateEntrance?: number;
  apartmentsCount?: number;
  playground?: boolean;
  externalMajlis?: boolean;
  annex?: boolean;
  internalGarden?: boolean;
  fountain?: boolean;
  modernDesign?: boolean;
  elevator?: boolean;
  twoEntrances?: boolean;
  oneEntrance?: boolean;
  openKitchen?: boolean;
  closedKitchen?: boolean;
  dirtyKitchen?: boolean;
  stairs?: boolean;
  furnished?: boolean;
  fittedKitchen?: boolean;
  appliancesIncluded?: boolean;
  curtains?: boolean;
}

export interface PropertyForm {
  id: string;
  ownerId: string;
  title: string;
  city: string;
  district: string;
  propertyType: PropertyType;
  deedNumber?: string;
  deedDate?: string;
  commission?: number; // %
  rooms?: number;
  floors?: number;
  bathrooms?: number;
  kitchens?: number;
  majlis?: number;
  livingRooms?: number;
  area?: number;
  price?: number;
  priceMarketRange?: string; // e.g. "400,000 - 600,000"
  priceStatus?: string; // "مبالغ" | "معقول" | "فرصة" | "قد تكون بها عيوب"
  guarantees?: string;
  features?: PropertyFeatures;
  description?: string;
  descriptionMode?: "manual" | "ai";
  createdAt?: string;
  paymentOptions?: PaymentOptions | null;
}

export type PaymentOptionType = "single" | "two" | "four" | "monthly" | "monthly_rais" | "monthly_tajir";
export interface PaymentOptions {
  option: PaymentOptionType;
  splits?: number[]; // split amounts
  collaborateRais?: boolean;
  collaborateTajir?: boolean;
}

// بيانات الخطط
export interface PlanData {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  popular?: boolean;
  freeOffers?: number;
}