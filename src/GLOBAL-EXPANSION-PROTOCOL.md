# 🌍 **Global Expansion Protocol - Nova CRM**
## **From Regional Success to Global Platform**

---

## 📋 **GLOBAL TRANSFORMATION OVERVIEW**

```
┌─────────────────────────────────────────────────────────────┐
│              NOVA GLOBAL EXPANSION ENGINE                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Current State:  Saudi Arabia focused                       │
│  Target State:   Global real estate platform (30+ markets)  │
│                                                              │
│  Transformation Timeline: 18 months                          │
│  Investment Required: $500K-$1.5M                           │
│  Expected ROI: 10x within 36 months                         │
│                                                              │
│  Target Markets:                                             │
│  ├─ Phase 1: GCC (6 countries)                              │
│  ├─ Phase 2: MENA (8 countries)                             │
│  ├─ Phase 3: Turkey & Europe                                │
│  └─ Phase 4: Global (Americas, Asia)                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗣️ **1. INTERNATIONALIZATION (i18n) SYSTEM**

### **1.1: Multi-Language Architecture**

```typescript
// backend/src/modules/i18n/language-manager.ts
export enum SupportedLanguage {
  AR = 'ar',          // Arabic
  EN = 'en',          // English
  FR = 'fr',          // French
  ES = 'es',          // Spanish
  TR = 'tr',          // Turkish
  UR = 'ur',          // Urdu
  FA = 'fa',          // Persian
  HI = 'hi',          // Hindi
}

export enum TextDirection {
  LTR = 'ltr',
  RTL = 'rtl',
}

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: TextDirection;
  dateFormat: string;
  numberFormat: string;
  currencyPosition: 'before' | 'after';
  enabled: boolean;
}

export const LANGUAGE_CONFIGS: Record<SupportedLanguage, LanguageConfig> = {
  [SupportedLanguage.AR]: {
    code: SupportedLanguage.AR,
    name: 'Arabic',
    nativeName: 'العربية',
    direction: TextDirection.RTL,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '١٢٣٤٥٦٧٨٩٠',
    currencyPosition: 'after',
    enabled: true,
  },
  [SupportedLanguage.EN]: {
    code: SupportedLanguage.EN,
    name: 'English',
    nativeName: 'English',
    direction: TextDirection.LTR,
    dateFormat: 'MM/DD/YYYY',
    numberFormat: '1234567890',
    currencyPosition: 'before',
    enabled: true,
  },
  [SupportedLanguage.FR]: {
    code: SupportedLanguage.FR,
    name: 'French',
    nativeName: 'Français',
    direction: TextDirection.LTR,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1234567890',
    currencyPosition: 'after',
    enabled: true,
  },
  [SupportedLanguage.TR]: {
    code: SupportedLanguage.TR,
    name: 'Turkish',
    nativeName: 'Türkçe',
    direction: TextDirection.LTR,
    dateFormat: 'DD.MM.YYYY',
    numberFormat: '1234567890',
    currencyPosition: 'after',
    enabled: true,
  },
  // ... other languages
};
```

---

### **1.2: Translation Management System**

```typescript
// backend/src/modules/i18n/translation-manager.ts
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export class TranslationManager {
  private translations: Map<string, Map<string, string>> = new Map();
  private fallbackLanguage: SupportedLanguage = SupportedLanguage.EN;

  constructor() {
    this.loadAllTranslations();
  }

  private loadAllTranslations() {
    for (const lang of Object.values(SupportedLanguage)) {
      this.loadLanguage(lang);
    }
  }

  private loadLanguage(language: SupportedLanguage) {
    try {
      const filePath = join(__dirname, `../../locales/${language}.json`);
      const content = readFileSync(filePath, 'utf-8');
      const translations = JSON.parse(content);
      
      const translationMap = new Map<string, string>();
      this.flattenTranslations(translations, '', translationMap);
      
      this.translations.set(language, translationMap);
    } catch (error) {
      console.error(`Failed to load translations for ${language}:`, error);
    }
  }

  private flattenTranslations(
    obj: any,
    prefix: string,
    map: Map<string, string>
  ) {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string') {
        map.set(fullKey, value);
      } else if (typeof value === 'object') {
        this.flattenTranslations(value, fullKey, map);
      }
    }
  }

  translate(
    key: string,
    language: SupportedLanguage,
    params?: Record<string, any>
  ): string {
    const translations = this.translations.get(language);
    let text = translations?.get(key);

    // Fallback to English if translation not found
    if (!text) {
      const fallbackTranslations = this.translations.get(this.fallbackLanguage);
      text = fallbackTranslations?.get(key) || key;
    }

    // Replace parameters
    if (params && text) {
      for (const [param, value] of Object.entries(params)) {
        text = text.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
      }
    }

    return text;
  }

  async translateAI(
    text: string,
    fromLang: SupportedLanguage,
    toLang: SupportedLanguage
  ): Promise<string> {
    // Use AI for dynamic translations
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator specializing in real estate terminology. Translate from ${fromLang} to ${toLang}. Maintain professional tone and industry-specific terms.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  getMissingTranslations(language: SupportedLanguage): string[] {
    const referenceTranslations = this.translations.get(this.fallbackLanguage);
    const targetTranslations = this.translations.get(language);

    if (!referenceTranslations || !targetTranslations) {
      return [];
    }

    const missing: string[] = [];
    for (const key of referenceTranslations.keys()) {
      if (!targetTranslations.has(key)) {
        missing.push(key);
      }
    }

    return missing;
  }

  async autoFillMissingTranslations(language: SupportedLanguage) {
    const missing = this.getMissingTranslations(language);
    const referenceTranslations = this.translations.get(this.fallbackLanguage)!;
    const targetTranslations = this.translations.get(language)!;

    for (const key of missing) {
      const sourceText = referenceTranslations.get(key)!;
      const translated = await this.translateAI(
        sourceText,
        this.fallbackLanguage,
        language
      );
      
      targetTranslations.set(key, translated);
      
      // Save to file
      await this.saveTranslation(language, key, translated);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  private async saveTranslation(
    language: SupportedLanguage,
    key: string,
    value: string
  ) {
    const filePath = join(__dirname, `../../locales/${language}.json`);
    const content = readFileSync(filePath, 'utf-8');
    const translations = JSON.parse(content);

    // Set nested key
    const keys = key.split('.');
    let current = translations;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    writeFileSync(filePath, JSON.stringify(translations, null, 2));
  }
}
```

---

### **1.3: Translation Files Structure**

```json
// locales/ar.json
{
  "common": {
    "welcome": "مرحباً",
    "login": "تسجيل الدخول",
    "logout": "تسجيل الخروج",
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف",
    "edit": "تعديل",
    "search": "بحث",
    "filter": "تصفية",
    "export": "تصدير",
    "import": "استيراد"
  },
  "dashboard": {
    "title": "لوحة التحكم",
    "overview": "نظرة عامة",
    "statistics": "الإحصائيات",
    "recent_activity": "النشاط الأخير"
  },
  "customers": {
    "title": "العملاء",
    "add_customer": "إضافة عميل",
    "customer_name": "اسم العميل",
    "customer_phone": "رقم الهاتف",
    "customer_email": "البريد الإلكتروني",
    "customer_type": "نوع العميل",
    "buyer": "مشتري",
    "seller": "بائع",
    "both": "مشتري وبائع"
  },
  "properties": {
    "title": "العقارات",
    "add_property": "إضافة عقار",
    "property_type": "نوع العقار",
    "apartment": "شقة",
    "villa": "فيلا",
    "land": "أرض",
    "commercial": "تجاري",
    "price": "السعر",
    "area": "المساحة",
    "bedrooms": "غرف النوم",
    "bathrooms": "دورات المياه",
    "location": "الموقع",
    "city": "المدينة",
    "district": "الحي"
  },
  "ai": {
    "smart_reply": "الرد الذكي",
    "generating": "جاري الإنشاء...",
    "ask_ai": "اسأل المساعد الذكي",
    "ai_suggestion": "اقتراح ذكي",
    "ai_analysis": "تحليل ذكي"
  },
  "notifications": {
    "new_customer": "عميل جديد: {{name}}",
    "new_match": "مطابقة جديدة لعقارك",
    "appointment_reminder": "تذكير: موعد مع {{customer}} في {{time}}",
    "task_due": "مهمة مستحقة: {{task}}"
  },
  "emails": {
    "welcome": {
      "subject": "مرحباً بك في نوڤا CRM",
      "body": "نحن سعداء بانضمامك إلينا"
    },
    "trial_ending": {
      "subject": "باقي {{days}} أيام على انتهاء تجربتك المجانية",
      "body": "اشترك الآن للاستمرار في استخدام جميع المزايا"
    }
  }
}
```

```json
// locales/en.json
{
  "common": {
    "welcome": "Welcome",
    "login": "Login",
    "logout": "Logout",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "search": "Search",
    "filter": "Filter",
    "export": "Export",
    "import": "Import"
  },
  "dashboard": {
    "title": "Dashboard",
    "overview": "Overview",
    "statistics": "Statistics",
    "recent_activity": "Recent Activity"
  },
  "customers": {
    "title": "Customers",
    "add_customer": "Add Customer",
    "customer_name": "Customer Name",
    "customer_phone": "Phone Number",
    "customer_email": "Email Address",
    "customer_type": "Customer Type",
    "buyer": "Buyer",
    "seller": "Seller",
    "both": "Buyer & Seller"
  },
  // ... rest of translations
}
```

---

## 💰 **2. MULTI-CURRENCY SYSTEM**

### **2.1: Currency Manager**

```typescript
// backend/src/modules/currency/currency-manager.ts
export enum Currency {
  SAR = 'SAR',    // Saudi Riyal
  AED = 'AED',    // UAE Dirham
  KWD = 'KWD',    // Kuwaiti Dinar
  QAR = 'QAR',    // Qatari Riyal
  BHD = 'BHD',    // Bahraini Dinar
  OMR = 'OMR',    // Omani Rial
  EGP = 'EGP',    // Egyptian Pound
  JOD = 'JOD',    // Jordanian Dinar
  USD = 'USD',    // US Dollar
  EUR = 'EUR',    // Euro
  GBP = 'GBP',    // British Pound
  TRY = 'TRY',    // Turkish Lira
}

export interface CurrencyConfig {
  code: Currency;
  name: string;
  nativeName: string;
  symbol: string;
  decimals: number;
  position: 'before' | 'after';
  thousandsSeparator: string;
  decimalSeparator: string;
}

export const CURRENCY_CONFIGS: Record<Currency, CurrencyConfig> = {
  [Currency.SAR]: {
    code: Currency.SAR,
    name: 'Saudi Riyal',
    nativeName: 'ريال سعودي',
    symbol: 'ر.س',
    decimals: 2,
    position: 'after',
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.AED]: {
    code: Currency.AED,
    name: 'UAE Dirham',
    nativeName: 'درهم إماراتي',
    symbol: 'د.إ',
    decimals: 2,
    position: 'after',
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.KWD]: {
    code: Currency.KWD,
    name: 'Kuwaiti Dinar',
    nativeName: 'دينار كويتي',
    symbol: 'د.ك',
    decimals: 3,
    position: 'after',
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.USD]: {
    code: Currency.USD,
    name: 'US Dollar',
    nativeName: 'دولار أمريكي',
    symbol: '$',
    decimals: 2,
    position: 'before',
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  // ... other currencies
};

export class CurrencyManager {
  private exchangeRates: Map<string, number> = new Map();
  private baseCurrency: Currency = Currency.USD;

  constructor() {
    this.updateExchangeRates();
    // Update rates every 24 hours
    setInterval(() => this.updateExchangeRates(), 24 * 60 * 60 * 1000);
  }

  async updateExchangeRates() {
    try {
      // Use a free exchange rate API
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${this.baseCurrency}`
      );
      const data = await response.json();

      // Store rates
      for (const [currency, rate] of Object.entries(data.rates)) {
        this.exchangeRates.set(currency, rate as number);
      }

      // Save to database
      await prisma.exchangeRate.createMany({
        data: Object.entries(data.rates).map(([currency, rate]) => ({
          fromCurrency: this.baseCurrency,
          toCurrency: currency as Currency,
          rate: rate as number,
          date: new Date(),
        })),
        skipDuplicates: true,
      });
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
    }
  }

  convert(
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency
  ): number {
    if (fromCurrency === toCurrency) return amount;

    // Get rates relative to base currency
    const fromRate = this.exchangeRates.get(fromCurrency) || 1;
    const toRate = this.exchangeRates.get(toCurrency) || 1;

    // Convert through base currency
    const amountInBase = amount / fromRate;
    const amountInTarget = amountInBase * toRate;

    return amountInTarget;
  }

  format(amount: number, currency: Currency, locale?: string): string {
    const config = CURRENCY_CONFIGS[currency];
    
    // Format number with proper decimals and separators
    const formatted = new Intl.NumberFormat(locale || 'en-US', {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    }).format(amount);

    // Add currency symbol
    return config.position === 'before'
      ? `${config.symbol} ${formatted}`
      : `${formatted} ${config.symbol}`;
  }

  getRate(fromCurrency: Currency, toCurrency: Currency): number {
    if (fromCurrency === toCurrency) return 1;

    const fromRate = this.exchangeRates.get(fromCurrency) || 1;
    const toRate = this.exchangeRates.get(toCurrency) || 1;

    return toRate / fromRate;
  }

  async getHistoricalRate(
    fromCurrency: Currency,
    toCurrency: Currency,
    date: Date
  ): Promise<number> {
    const historicalRate = await prisma.exchangeRate.findFirst({
      where: {
        fromCurrency,
        toCurrency,
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
      orderBy: { date: 'desc' },
    });

    return historicalRate?.rate || 1;
  }
}
```

---

### **2.2: Multi-Currency Pricing**

```typescript
// backend/src/modules/pricing/regional-pricing.ts
export interface RegionalPrice {
  region: string;
  currency: Currency;
  monthlyPrice: number;
  yearlyPrice: number;
  discount: number;
}

export const REGIONAL_PRICING: Record<string, RegionalPrice> = {
  SA: {
    region: 'Saudi Arabia',
    currency: Currency.SAR,
    monthlyPrice: 299,
    yearlyPrice: 2990,
    discount: 16.7,
  },
  AE: {
    region: 'UAE',
    currency: Currency.AED,
    monthlyPrice: 299,
    yearlyPrice: 2990,
    discount: 16.7,
  },
  KW: {
    region: 'Kuwait',
    currency: Currency.KWD,
    monthlyPrice: 24,
    yearlyPrice: 240,
    discount: 16.7,
  },
  QA: {
    region: 'Qatar',
    currency: Currency.QAR,
    monthlyPrice: 299,
    yearlyPrice: 2990,
    discount: 16.7,
  },
  BH: {
    region: 'Bahrain',
    currency: Currency.BHD,
    monthlyPrice: 30,
    yearlyPrice: 300,
    discount: 16.7,
  },
  EG: {
    region: 'Egypt',
    currency: Currency.EGP,
    monthlyPrice: 1499,
    yearlyPrice: 14990,
    discount: 16.7,
  },
  US: {
    region: 'United States',
    currency: Currency.USD,
    monthlyPrice: 79,
    yearlyPrice: 790,
    discount: 16.7,
  },
  // ... other regions
};

export class RegionalPricing {
  constructor(private currencyManager: CurrencyManager) {}

  getPricing(countryCode: string): RegionalPrice {
    return REGIONAL_PRICING[countryCode] || REGIONAL_PRICING.US;
  }

  convertPricing(
    pricing: RegionalPrice,
    targetCurrency: Currency
  ): RegionalPrice {
    if (pricing.currency === targetCurrency) return pricing;

    const monthlyConverted = this.currencyManager.convert(
      pricing.monthlyPrice,
      pricing.currency,
      targetCurrency
    );
    const yearlyConverted = this.currencyManager.convert(
      pricing.yearlyPrice,
      pricing.currency,
      targetCurrency
    );

    return {
      ...pricing,
      currency: targetCurrency,
      monthlyPrice: Math.round(monthlyConverted),
      yearlyPrice: Math.round(yearlyConverted),
    };
  }

  async calculateLocalizedPrice(
    basePrice: number,
    baseCurrency: Currency,
    targetCountry: string
  ): Promise<number> {
    const regionalPricing = this.getPricing(targetCountry);
    const converted = this.currencyManager.convert(
      basePrice,
      baseCurrency,
      regionalPricing.currency
    );

    // Apply purchasing power parity adjustment
    const pppAdjustment = await this.getPPPAdjustment(targetCountry);
    return converted * pppAdjustment;
  }

  private async getPPPAdjustment(countryCode: string): Promise<number> {
    // Get purchasing power parity data
    const pppData: Record<string, number> = {
      SA: 1.0,
      AE: 1.0,
      KW: 0.9,
      EG: 1.5,
      US: 0.8,
      // ... other countries
    };

    return pppData[countryCode] || 1.0;
  }
}
```

---

## 🌐 **3. REGIONAL CONFIGURATION SYSTEM**

### **3.1: Country Configuration**

```typescript
// backend/src/modules/regions/country-config.ts
export interface CountryConfig {
  code: string;
  name: string;
  nativeName: string;
  languages: SupportedLanguage[];
  defaultLanguage: SupportedLanguage;
  currency: Currency;
  timezone: string;
  dateFormat: string;
  phoneFormat: string;
  addressFormat: {
    fields: string[];
    order: string[];
  };
  taxRate: number;
  taxName: string;
  enabled: boolean;
}

export const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  SA: {
    code: 'SA',
    name: 'Saudi Arabia',
    nativeName: 'المملكة العربية السعودية',
    languages: [SupportedLanguage.AR, SupportedLanguage.EN],
    defaultLanguage: SupportedLanguage.AR,
    currency: Currency.SAR,
    timezone: 'Asia/Riyadh',
    dateFormat: 'DD/MM/YYYY',
    phoneFormat: '+966 XX XXX XXXX',
    addressFormat: {
      fields: ['region', 'city', 'district', 'street', 'building'],
      order: ['building', 'street', 'district', 'city', 'region'],
    },
    taxRate: 15,
    taxName: 'VAT',
    enabled: true,
  },
  AE: {
    code: 'AE',
    name: 'United Arab Emirates',
    nativeName: 'الإمارات العربية المتحدة',
    languages: [SupportedLanguage.AR, SupportedLanguage.EN],
    defaultLanguage: SupportedLanguage.AR,
    currency: Currency.AED,
    timezone: 'Asia/Dubai',
    dateFormat: 'DD/MM/YYYY',
    phoneFormat: '+971 XX XXX XXXX',
    addressFormat: {
      fields: ['emirate', 'area', 'community', 'building'],
      order: ['building', 'community', 'area', 'emirate'],
    },
    taxRate: 5,
    taxName: 'VAT',
    enabled: true,
  },
  EG: {
    code: 'EG',
    name: 'Egypt',
    nativeName: 'مصر',
    languages: [SupportedLanguage.AR, SupportedLanguage.EN],
    defaultLanguage: SupportedLanguage.AR,
    currency: Currency.EGP,
    timezone: 'Africa/Cairo',
    dateFormat: 'DD/MM/YYYY',
    phoneFormat: '+20 XXX XXX XXXX',
    addressFormat: {
      fields: ['governorate', 'city', 'district', 'street', 'building'],
      order: ['building', 'street', 'district', 'city', 'governorate'],
    },
    taxRate: 14,
    taxName: 'VAT',
    enabled: true,
  },
  US: {
    code: 'US',
    name: 'United States',
    nativeName: 'United States',
    languages: [SupportedLanguage.EN, SupportedLanguage.ES],
    defaultLanguage: SupportedLanguage.EN,
    currency: Currency.USD,
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    phoneFormat: '+1 (XXX) XXX-XXXX',
    addressFormat: {
      fields: ['street', 'city', 'state', 'zipCode'],
      order: ['street', 'city', 'state', 'zipCode'],
    },
    taxRate: 0, // Varies by state
    taxName: 'Sales Tax',
    enabled: true,
  },
  // ... other countries
};

export class RegionManager {
  getCountryConfig(countryCode: string): CountryConfig {
    return COUNTRY_CONFIGS[countryCode] || COUNTRY_CONFIGS.US;
  }

  getEnabledCountries(): CountryConfig[] {
    return Object.values(COUNTRY_CONFIGS).filter(c => c.enabled);
  }

  async detectCountry(ipAddress: string): Promise<string> {
    try {
      // Use IP geolocation service
      const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
      const data = await response.json();
      return data.country_code || 'US';
    } catch (error) {
      console.error('Failed to detect country:', error);
      return 'US';
    }
  }

  formatAddress(address: any, countryCode: string): string {
    const config = this.getCountryConfig(countryCode);
    const parts: string[] = [];

    for (const field of config.addressFormat.order) {
      if (address[field]) {
        parts.push(address[field]);
      }
    }

    return parts.join(', ');
  }

  formatPhoneNumber(phone: string, countryCode: string): string {
    const config = this.getCountryConfig(countryCode);
    // Implementation depends on phone format library
    return phone; // Placeholder
  }

  calculateTax(amount: number, countryCode: string): number {
    const config = this.getCountryConfig(countryCode);
    return amount * (config.taxRate / 100);
  }
}
```

---

## 📞 **4. REGIONAL COMMUNICATION PROVIDERS**

### **4.1: SMS/Voice Routing**

```typescript
// backend/src/modules/communication/regional-providers.ts
export enum CommunicationProvider {
  TWILIO = 'TWILIO',
  STC = 'STC',
  MOBILY = 'MOBILY',
  ETISALAT = 'ETISALAT',
  VODAFONE = 'VODAFONE',
  SINCH = 'SINCH',
}

export interface ProviderConfig {
  provider: CommunicationProvider;
  countries: string[];
  capabilities: {
    sms: boolean;
    voice: boolean;
    whatsapp: boolean;
  };
  pricing: {
    smsPerMessage: number;
    voicePerMinute: number;
    whatsappPerMessage: number;
  };
  config: {
    apiKey?: string;
    apiSecret?: string;
    accountSid?: string;
    authToken?: string;
  };
}

export const PROVIDER_CONFIGS: ProviderConfig[] = [
  {
    provider: CommunicationProvider.STC,
    countries: ['SA'],
    capabilities: { sms: true, voice: true, whatsapp: false },
    pricing: {
      smsPerMessage: 0.05,
      voicePerMinute: 0.10,
      whatsappPerMessage: 0,
    },
    config: {
      apiKey: process.env.STC_API_KEY,
      apiSecret: process.env.STC_API_SECRET,
    },
  },
  {
    provider: CommunicationProvider.ETISALAT,
    countries: ['AE'],
    capabilities: { sms: true, voice: true, whatsapp: true },
    pricing: {
      smsPerMessage: 0.06,
      voicePerMinute: 0.12,
      whatsappPerMessage: 0.04,
    },
    config: {
      apiKey: process.env.ETISALAT_API_KEY,
    },
  },
  {
    provider: CommunicationProvider.TWILIO,
    countries: ['US', 'GB', 'CA', 'AU'],
    capabilities: { sms: true, voice: true, whatsapp: true },
    pricing: {
      smsPerMessage: 0.0075,
      voicePerMinute: 0.013,
      whatsappPerMessage: 0.005,
    },
    config: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    },
  },
  // ... other providers
];

export class CommunicationRouter {
  getProvider(countryCode: string, type: 'sms' | 'voice' | 'whatsapp'): ProviderConfig {
    // Find best provider for country
    const providers = PROVIDER_CONFIGS.filter(
      p => p.countries.includes(countryCode) && p.capabilities[type]
    );

    // Sort by pricing
    providers.sort((a, b) => {
      const priceA = type === 'sms' ? a.pricing.smsPerMessage :
                     type === 'voice' ? a.pricing.voicePerMinute :
                     a.pricing.whatsappPerMessage;
      const priceB = type === 'sms' ? b.pricing.smsPerMessage :
                     type === 'voice' ? b.pricing.voicePerMinute :
                     b.pricing.whatsappPerMessage;
      return priceA - priceB;
    });

    // Return cheapest provider, or fallback to Twilio
    return providers[0] || PROVIDER_CONFIGS.find(p => p.provider === CommunicationProvider.TWILIO)!;
  }

  async sendSMS(to: string, message: string, countryCode: string) {
    const provider = this.getProvider(countryCode, 'sms');

    switch (provider.provider) {
      case CommunicationProvider.TWILIO:
        return this.sendViaTwilio(to, message, provider);
      
      case CommunicationProvider.STC:
        return this.sendViaSTC(to, message, provider);
      
      case CommunicationProvider.ETISALAT:
        return this.sendViaEtisalat(to, message, provider);
      
      default:
        throw new Error(`Unsupported provider: ${provider.provider}`);
    }
  }

  private async sendViaTwilio(to: string, message: string, config: ProviderConfig) {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${config.config.accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(
            `${config.config.accountSid}:${config.config.authToken}`
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: process.env.TWILIO_PHONE_NUMBER!,
          Body: message,
        }),
      }
    );

    return response.json();
  }

  private async sendViaSTC(to: string, message: string, config: ProviderConfig) {
    // STC SMS API implementation
    const response = await fetch('https://api.stc.com.sa/sms/v1/send', {
      method: 'POST',
      headers: {
        'X-API-Key': config.config.apiKey!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        message,
        sender: 'Nova CRM',
      }),
    });

    return response.json();
  }

  private async sendViaEtisalat(to: string, message: string, config: ProviderConfig) {
    // Etisalat SMS API implementation
    const response = await fetch('https://api.etisalat.ae/sms/v1/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        text: message,
      }),
    });

    return response.json();
  }
}
```

---

## 💳 **5. REGIONAL PAYMENT GATEWAYS**

### **5.1: Payment Router**

```typescript
// backend/src/modules/payments/payment-router.ts
export enum PaymentGateway {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  TAP = 'TAP',
  HYPERPAY = 'HYPERPAY',
  PAYMOB = 'PAYMOB',
  STC_PAY = 'STC_PAY',
}

export interface PaymentGatewayConfig {
  gateway: PaymentGateway;
  countries: string[];
  currencies: Currency[];
  methods: ('card' | 'wallet' | 'bank_transfer')[];
  fees: {
    percentage: number;
    fixed: number;
    currency: Currency;
  };
  config: any;
}

export const PAYMENT_GATEWAYS: PaymentGatewayConfig[] = [
  {
    gateway: PaymentGateway.TAP,
    countries: ['SA', 'AE', 'KW', 'BH', 'QA', 'OM'],
    currencies: [Currency.SAR, Currency.AED, Currency.KWD, Currency.BHD, Currency.QAR, Currency.OMR],
    methods: ['card', 'wallet'],
    fees: { percentage: 2.5, fixed: 0, currency: Currency.SAR },
    config: {
      apiKey: process.env.TAP_API_KEY,
      secretKey: process.env.TAP_SECRET_KEY,
    },
  },
  {
    gateway: PaymentGateway.PAYMOB,
    countries: ['EG', 'SA', 'AE', 'JO'],
    currencies: [Currency.EGP, Currency.SAR, Currency.AED, Currency.JOD],
    methods: ['card', 'wallet', 'bank_transfer'],
    fees: { percentage: 2.75, fixed: 0, currency: Currency.EGP },
    config: {
      apiKey: process.env.PAYMOB_API_KEY,
    },
  },
  {
    gateway: PaymentGateway.STRIPE,
    countries: ['US', 'GB', 'CA', 'AU', 'EU'],
    currencies: [Currency.USD, Currency.EUR, Currency.GBP],
    methods: ['card'],
    fees: { percentage: 2.9, fixed: 0.30, currency: Currency.USD },
    config: {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY,
    },
  },
  // ... other gateways
];

export class PaymentRouter {
  getGateway(countryCode: string, currency: Currency): PaymentGatewayConfig {
    // Find suitable gateways
    const gateways = PAYMENT_GATEWAYS.filter(
      g => g.countries.includes(countryCode) && g.currencies.includes(currency)
    );

    // Sort by fees
    gateways.sort((a, b) => a.fees.percentage - b.fees.percentage);

    // Return cheapest gateway
    return gateways[0] || PAYMENT_GATEWAYS.find(g => g.gateway === PaymentGateway.STRIPE)!;
  }

  async createPayment(
    amount: number,
    currency: Currency,
    countryCode: string,
    metadata: any
  ) {
    const gateway = this.getGateway(countryCode, currency);

    switch (gateway.gateway) {
      case PaymentGateway.TAP:
        return this.createTapPayment(amount, currency, metadata, gateway);
      
      case PaymentGateway.STRIPE:
        return this.createStripePayment(amount, currency, metadata, gateway);
      
      case PaymentGateway.PAYMOB:
        return this.createPaymobPayment(amount, currency, metadata, gateway);
      
      default:
        throw new Error(`Unsupported gateway: ${gateway.gateway}`);
    }
  }

  private async createTapPayment(
    amount: number,
    currency: Currency,
    metadata: any,
    config: PaymentGatewayConfig
  ) {
    const response = await fetch('https://api.tap.company/v2/charges', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.config.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        customer: {
          email: metadata.email,
          phone: metadata.phone,
        },
        source: { id: 'src_all' },
        redirect: { url: metadata.returnUrl },
        metadata,
      }),
    });

    return response.json();
  }

  private async createStripePayment(
    amount: number,
    currency: Currency,
    metadata: any,
    config: PaymentGatewayConfig
  ) {
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.config.secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: String(Math.round(amount * 100)),
        currency: currency.toLowerCase(),
        'metadata[userId]': metadata.userId,
        'metadata[tenantId]': metadata.tenantId,
      }),
    });

    return response.json();
  }

  private async createPaymobPayment(
    amount: number,
    currency: Currency,
    metadata: any,
    config: PaymentGatewayConfig
  ) {
    // First, authenticate
    const authResponse = await fetch('https://accept.paymob.com/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: config.config.apiKey,
      }),
    });
    const { token } = await authResponse.json();

    // Create order
    const orderResponse = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: token,
        delivery_needed: false,
        amount_cents: Math.round(amount * 100),
        currency,
        items: [],
      }),
    });

    return orderResponse.json();
  }
}
```

---

## 🕐 **6. TIMEZONE MANAGEMENT**

### **6.1: Timezone Handler**

```typescript
// backend/src/modules/timezone/timezone-manager.ts
import { DateTime } from 'luxon';

export class TimezoneManager {
  convertToUserTimezone(date: Date, userTimezone: string): DateTime {
    return DateTime.fromJSDate(date).setZone(userTimezone);
  }

  convertToUTC(date: Date, fromTimezone: string): Date {
    return DateTime.fromJSDate(date, { zone: fromTimezone }).toUTC().toJSDate();
  }

  formatForUser(
    date: Date,
    userTimezone: string,
    userLanguage: SupportedLanguage
  ): string {
    const dt = this.convertToUserTimezone(date, userTimezone);
    
    const locales: Record<SupportedLanguage, string> = {
      [SupportedLanguage.AR]: 'ar-SA',
      [SupportedLanguage.EN]: 'en-US',
      [SupportedLanguage.FR]: 'fr-FR',
      [SupportedLanguage.TR]: 'tr-TR',
      [SupportedLanguage.ES]: 'es-ES',
      [SupportedLanguage.UR]: 'ur-PK',
      [SupportedLanguage.FA]: 'fa-IR',
      [SupportedLanguage.HI]: 'hi-IN',
    };

    return dt.setLocale(locales[userLanguage]).toLocaleString(DateTime.DATETIME_MED);
  }

  async scheduleAtLocalTime(
    scheduledTime: Date,
    userTimezone: string,
    callback: () => void
  ) {
    const now = DateTime.now().setZone(userTimezone);
    const scheduled = DateTime.fromJSDate(scheduledTime).setZone(userTimezone);
    const delay = scheduled.diff(now).milliseconds;

    if (delay > 0) {
      setTimeout(callback, delay);
    }
  }

  getBusinessHours(countryCode: string): { start: number; end: number } {
    // Business hours vary by country
    const businessHours: Record<string, { start: number; end: number }> = {
      SA: { start: 9, end: 18 },
      AE: { start: 9, end: 18 },
      US: { start: 9, end: 17 },
      EG: { start: 10, end: 19 },
      // ... other countries
    };

    return businessHours[countryCode] || { start: 9, end: 17 };
  }

  isBusinessHours(countryCode: string, timezone: string): boolean {
    const hours = this.getBusinessHours(countryCode);
    const now = DateTime.now().setZone(timezone);
    const hour = now.hour;

    return hour >= hours.start && hour < hours.end && now.weekday <= 5;
  }
}
```

---

## 🤖 **7. GLOBAL AI MODELS**

### **7.1: Region-Aware AI**

```typescript
// backend/src/modules/ai/global-ai.ts
export class GlobalAI {
  async generateSmartReply(
    message: string,
    context: any,
    userLanguage: SupportedLanguage,
    countryCode: string
  ): Promise<string> {
    const countryConfig = COUNTRY_CONFIGS[countryCode];
    
    const systemPrompt = `You are an AI assistant for a real estate CRM in ${countryConfig.name}.
Context:
- Language: ${userLanguage}
- Currency: ${countryConfig.currency}
- Local customs: Consider local real estate practices and regulations
- Tone: Professional and culturally appropriate for ${countryConfig.name}

Generate a professional reply in ${userLanguage} that:
1. Addresses the customer's inquiry
2. Uses local currency (${countryConfig.currency})
3. Follows local business etiquette
4. Is culturally sensitive and appropriate`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async analyzeMarket(
    propertyType: string,
    location: string,
    countryCode: string,
    language: SupportedLanguage
  ): Promise<any> {
    const countryConfig = COUNTRY_CONFIGS[countryCode];
    
    // Get market data for the country
    const marketData = await this.getMarketData(countryCode, location, propertyType);

    const prompt = `Analyze the real estate market for ${propertyType} in ${location}, ${countryConfig.name}.

Market Data:
${JSON.stringify(marketData, null, 2)}

Provide analysis in ${language} covering:
1. Current market trends
2. Price analysis (in ${countryConfig.currency})
3. Demand/supply dynamics
4. Investment outlook
5. Recommendations for agents

Format your response as JSON with sections: trends, pricing, demand, outlook, recommendations`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  async suggestPricing(
    property: any,
    countryCode: string
  ): Promise<{ min: number; max: number; recommended: number }> {
    const countryConfig = COUNTRY_CONFIGS[countryCode];
    
    // Get comparable properties
    const comparables = await this.getComparables(property, countryCode);

    const prompt = `You are a real estate pricing expert in ${countryConfig.name}.

Property Details:
${JSON.stringify(property, null, 2)}

Comparable Properties:
${JSON.stringify(comparables, null, 2)}

Suggest a price range in ${countryConfig.currency} based on:
1. Property features
2. Location
3. Market comparables
4. Current market conditions

Respond with JSON: { "min": number, "max": number, "recommended": number, "reasoning": "explanation" }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  private async getMarketData(
    countryCode: string,
    location: string,
    propertyType: string
  ): Promise<any> {
    // Fetch market data from database or external API
    return {
      averagePrice: 500000,
      pricePerSqm: 5000,
      inventory: 150,
      daysOnMarket: 45,
      // ... more data
    };
  }

  private async getComparables(property: any, countryCode: string): Promise<any[]> {
    // Find similar properties in the same market
    return [];
  }
}
```

---

## 📊 **8. GLOBAL EXPANSION ROADMAP**

```markdown
═══════════════════════════════════════════════════════════════
           📅 18-MONTH GLOBAL EXPANSION ROADMAP
═══════════════════════════════════════════════════════════════

🌍 PHASE 1: GCC DOMINATION (Months 1-6)
├─ Month 1-2: Saudi Arabia Optimization
│  ├─ Perfect Arabic UX/UI
│  ├─ STC/Mobily integration
│  ├─ Tap Payments
│  ├─ Saudi-specific features
│  └─ Target: 1,000 users in SA
│
├─ Month 3-4: UAE Launch
│  ├─ Dual language (AR/EN)
│  ├─ Etisalat/Du integration
│  ├─ AED currency
│  ├─ Dubai market features
│  └─ Target: 500 users in UAE
│
└─ Month 5-6: Kuwait, Qatar, Bahrain, Oman
   ├─ Local payment gateways
   ├─ Country-specific compliance
   ├─ Local partnerships
   └─ Target: 300 users across 4 countries

🌍 PHASE 2: MENA EXPANSION (Months 7-12)
├─ Month 7-8: Egypt Launch
│  ├─ EGP currency support
│  ├─ Vodafone/Orange integration
│  ├─ Paymob payment gateway
│  ├─ Cairo/Alexandria focus
│  └─ Target: 1,500 users
│
├─ Month 9-10: Jordan, Morocco, Iraq
│  ├─ Multi-currency support
│  ├─ Regional partnerships
│  ├─ Localized features
│  └─ Target: 500 users
│
└─ Month 11-12: Tunisia, Lebanon, Algeria
   ├─ French language support
   ├─ Local regulations
   └─ Target: 300 users

🌍 PHASE 3: TURKEY & EUROPE (Months 13-15)
├─ Month 13-14: Turkey
│  ├─ Turkish language
│  ├─ TRY currency
│  ├─ Local integrations
│  └─ Target: 800 users
│
└─ Month 15: UK, France, Spain
   ├─ EUR/GBP support
   ├─ GDPR compliance
   ├─ Stripe integration
   └─ Target: 400 users

🌍 PHASE 4: GLOBAL REACH (Months 16-18)
├─ Month 16: North America
│  ├─ US market entry
│  ├─ USD pricing
│  ├─ US-specific features
│  └─ Target: 500 users
│
├─ Month 17: Southeast Asia
│  ├─ Malaysia, Indonesia
│  ├─ Local currencies
│  └─ Target: 300 users
│
└─ Month 18: Latin America
   ├─ Spanish language
   ├─ Regional pricing
   └─ Target: 200 users

═══════════════════════════════════════════════════════════════
🎯 END OF 18 MONTHS:
├─ Countries: 30+
├─ Users: 10,000+
├─ Languages: 8
├─ Currencies: 12
├─ Revenue: $2M+ MRR
└─ Valuation: $100M+ (Series B ready)
═══════════════════════════════════════════════════════════════
```

---

## ✅ **GLOBALIZATION CHECKLIST**

```markdown
# Global Expansion Readiness Checklist

## Internationalization (i18n)
- [ ] Multi-language system (8+ languages)
- [ ] Translation management
- [ ] AI-powered translations
- [ ] RTL/LTR support
- [ ] Date/time localization
- [ ] Number formatting
- [ ] Dynamic content translation

## Localization (l10n)
- [ ] Country-specific configurations
- [ ] Address formats per country
- [ ] Phone number formats
- [ ] Local business hours
- [ ] Cultural customizations
- [ ] Local compliance

## Currency & Pricing
- [ ] Multi-currency support (12+ currencies)
- [ ] Real-time exchange rates
- [ ] Regional pricing
- [ ] PPP adjustments
- [ ] Multi-currency invoicing
- [ ] Historical exchange rates

## Payments
- [ ] Regional payment gateways
- [ ] GCC: Tap, HyperPay, STC Pay
- [ ] MENA: Paymob
- [ ] Global: Stripe, PayPal
- [ ] Multiple payment methods
- [ ] Subscription billing
- [ ] Tax calculation

## Communication
- [ ] SMS routing per country
- [ ] Voice providers per region
- [ ] WhatsApp Business API
- [ ] Email localization
- [ ] Push notifications (localized)

## Infrastructure
- [ ] Multi-region deployment
- [ ] CDN (global)
- [ ] Data residency compliance
- [ ] Low-latency routing
- [ ] Regional backups

## AI & Intelligence
- [ ] Multi-language AI models
- [ ] Country-aware responses
- [ ] Market intelligence per region
- [ ] Pricing AI (localized)
- [ ] Cultural sensitivity

## Compliance
- [ ] GDPR (Europe)
- [ ] Data protection laws per country
- [ ] Tax regulations
- [ ] Industry regulations
- [ ] Privacy policies (localized)

## Marketing
- [ ] Country-specific landing pages
- [ ] Localized SEO
- [ ] Regional partnerships
- [ ] Local influencers
- [ ] Market-specific campaigns

## Support
- [ ] Multi-language support
- [ ] Timezone coverage
- [ ] Local support teams
- [ ] Regional documentation

═══════════════════════════════════════════════════════════════
✅ ALL CHECKED = READY FOR GLOBAL LAUNCH
═══════════════════════════════════════════════════════════════
```

---

📄 **File:** `/GLOBAL-EXPANSION-PROTOCOL.md`  
🎯 **Purpose:** International expansion  
⏱️ **Timeline:** 18 months  
💰 **Investment:** $500K-$1.5M  
🌍 **Target:** 30+ countries, 10K+ users, $2M+ MRR
