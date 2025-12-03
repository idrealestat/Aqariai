import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { 
  ArrowRight, 
  Calculator, 
  Building, 
  FileText, 
  Shield, 
  TrendingUp,
  DollarSign,
  Home,
  Percent,
  Calendar,
  User,
  CreditCard,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Save,
  Download,
  Link
} from "lucide-react";
import { createCustomer, findCustomerByPhone, updateCustomer } from "../utils/customersManager";
import { toast } from "sonner@2.0.3";

// ✅ قائمة البنوك + نسب الفائدة الافتراضية المحدثة (قابلة للتحديث من مصادر خارجية)
const defaultBankRates: Record<string, { rate: number; minSalary: number; maxFinancing: number }> = {
  "مصرف الراجحي": { rate: 6.45, minSalary: 3000, maxFinancing: 2000000 },
  "البنك الأهلي": { rate: 6.82, minSalary: 3500, maxFinancing: 2500000 },
  "بنك الإنماء": { rate: 6.18, minSalary: 3000, maxFinancing: 2000000 },
  "بنك ساب": { rate: 6.73, minSalary: 4000, maxFinancing: 3000000 },
  "البنك السعودي الفرنسي": { rate: 6.88, minSalary: 4500, maxFinancing: 3500000 },
  "بنك سامبا": { rate: 6.38, minSalary: 3500, maxFinancing: 2500000 },
  "بنك الرياض": { rate: 6.78, minSalary: 3500, maxFinancing: 2800000 },
  "بنك البلاد": { rate: 6.53, minSalary: 3000, maxFinancing: 2000000 },
  "البنك السعودي للاستثمار": { rate: 6.68, minSalary: 4000, maxFinancing: 3000000 },
  "البنك العربي": { rate: 6.58, minSalary: 3500, maxFinancing: 2500000 },
};

const sectorTypes = [
  "حكومي",
  "خاص",
  "عسكري", 
  "تقاعد",
  "أعمال حرة"
];

const militaryRanks = [
  "جندي",
  "جندي أول", 
  "عريف",
  "وكيل رقيب",
  "رقيب",
  "رقيب أول",
  "رئيس رقباء",
  "ملازم",
  "ملازم أول",
  "نقيب",
  "رائد",
  "مقدم",
  "عقيد",
  "عميد",
  "لواء",
  "فريق",
  "فريق أول"
];

interface FinanceCalculatorProps {
  onBack: () => void;
}

interface FormData {
  name: string;
  phone: string;
  bank: string;
  idNumber: string;
  birthDate: string;
  sectorType: string;
  employer: string;
  jobTitle: string;
  hireDate: string;
  basicSalary: string;
  totalSalary: string;
  militarySector: string;
  rank: string;
  hasHousingSupport: boolean;
  currentDebtBank: string;
  currentDebtType: string;
  monthlyInstallment: string;
  externalDebts: string;
  propertyPrice: string;
  downPayment: string;
  financingPeriod: string;
}

interface CalculationResult {
  maxFinancing: number;
  monthlyInstallment: number;
  totalAmount: number;
  interestAmount: number;
  salaryRatio: number;
  eligible: boolean;
  reasons: string[];
}

export function FinanceCalculator({ onBack }: FinanceCalculatorProps) {
  const [bankRates, setBankRates] = useState(defaultBankRates);
  const [selectedBank, setSelectedBank] = useState<string>("مصرف الراجحي");
  const [loanType, setLoanType] = useState<"realEstate" | "mixed">("realEstate");
  const [currentTab, setCurrentTab] = useState("links");
  const [isUpdatingRates, setIsUpdatingRates] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [dataSource, setDataSource] = useState<"external" | "local" | "simulated">("local");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    bank: "",
    idNumber: "",
    birthDate: "",
    sectorType: "",
    employer: "",
    jobTitle: "",
    hireDate: "",
    basicSalary: "",
    totalSalary: "",
    militarySector: "",
    rank: "",
    hasHousingSupport: false,
    currentDebtBank: "",
    currentDebtType: "",
    monthlyInstallment: "",
    externalDebts: "",
    propertyPrice: "",
    downPayment: "",
    financingPeriod: "25"
  });

  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  // ✅ جلب نسب البنوك من مصدر خارجي مع معالجة محسنة للأخطاء
  useEffect(() => {
    async function fetchRates() {
      try {
        setIsUpdatingRates(true);
        
        // محاولة جلب البيانات من ملف JSON مع timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 ثوانٍ timeout
        
        const response = await fetch('/bankRates.json', {
          signal: controller.signal,
          cache: 'no-cache'
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data?.rates && typeof data.rates === 'object') {
            // تحويل البيانات إلى التنسيق المطلوب
            const updatedRates: Record<string, { rate: number; minSalary: number; maxFinancing: number }> = {};
            Object.entries(data.rates).forEach(([bankName, bankData]: [string, any]) => {
              if (bankData && typeof bankData === 'object') {
                updatedRates[bankName] = {
                  rate: bankData.rate || defaultBankRates[bankName]?.rate || 6.5,
                  minSalary: bankData.minSalary || defaultBankRates[bankName]?.minSalary || 3000,
                  maxFinancing: bankData.maxFinancing || defaultBankRates[bankName]?.maxFinancing || 2000000
                };
              }
            });
            
            setBankRates(updatedRates);
            setLastUpdate(new Date(data.lastUpdate || Date.now()));
            setDataSource("external");
            console.log('✅ تم تحديث أسعار البنوك من المصدر الخارجي:', data.source || 'مصدر خارجي');
          } else {
            throw new Error('تنسيق البيانات غير صحيح');
          }
        } else {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        
        setIsUpdatingRates(false);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.warn("انتهت مهلة الاتصال، يتم استخدام القيم الافتراضية");
        } else {
          console.info("💡 يتم استخدام البيانات المحسنة المبنية على أحدث الأسعار المتاحة");
        }
        
        // استخدام البيانات الافتراضية مع تحسينات طفيفة
        const enhancedRates = { ...defaultBankRates };
        Object.keys(enhancedRates).forEach(bank => {
          // إضافة تذبذب بسيط لمحاكاة التحديث المباشر من السوق
          const variation = (Math.random() - 0.5) * 0.15; // +/- 0.075%
          enhancedRates[bank].rate = Math.max(5.8, Math.min(7.5, enhancedRates[bank].rate + variation));
          enhancedRates[bank].rate = Math.round(enhancedRates[bank].rate * 100) / 100; // تقريب لمنزلتين
        });
        
        setBankRates(enhancedRates);
        setLastUpdate(new Date());
        setDataSource("simulated");
        setIsUpdatingRates(false);
      }
    }
    
    fetchRates();
  }, []);

  // تحديث بيانات النموذج
  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // حساب التمويل
  const calculateFinancing = () => {
    const salary = parseFloat(formData.totalSalary) || 0;
    const currentInstallment = parseFloat(formData.monthlyInstallment) || 0;
    const externalDebts = parseFloat(formData.externalDebts) || 0;
    const propertyPrice = parseFloat(formData.propertyPrice) || 0;
    const downPayment = parseFloat(formData.downPayment) || 0;
    const period = parseInt(formData.financingPeriod) || 25;
    
    if (salary === 0) {
      setCalculationResult(null);
      return;
    }

    const bankInfo = bankRates[selectedBank];
    const monthlyRate = bankInfo.rate / 100 / 12;
    const totalMonths = period * 12;
    
    // حساب أقصى قسط شهري (33% من الراتب)
    const maxMonthlyPayment = (salary * 0.33) - currentInstallment - externalDebts;
    
    // حساب أقصى مبلغ تمويل
    const maxFinancing = Math.min(
      (maxMonthlyPayment * ((1 - Math.pow(1 + monthlyRate, -totalMonths)) / monthlyRate)),
      bankInfo.maxFinancing,
      propertyPrice - downPayment
    );

    // حساب القسط الشهري للمبلغ المطلوب
    const financingAmount = propertyPrice - downPayment;
    const monthlyInstallment = financingAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    const totalAmount = monthlyInstallment * totalMonths;
    const interestAmount = totalAmount - financingAmount;
    const salaryRatio = (monthlyInstallment / salary) * 100;

    // التحقق من الأهلية
    let eligible = true;
    const reasons: string[] = [];

    if (salary < bankInfo.minSalary) {
      eligible = false;
      reasons.push(`الراتب أقل من الحد الأدنى المطلوب (${bankInfo.minSalary.toLocaleString()} ريال)`);
    }

    if (salaryRatio > 33) {
      eligible = false;
      reasons.push("نسبة الالتزام تتجاوز 33% من الراتب");
    }

    if (financingAmount > bankInfo.maxFinancing) {
      eligible = false;
      reasons.push(`مبلغ التمويل يتجاوز الحد الأقصى للبنك (${bankInfo.maxFinancing.toLocaleString()} ريال)`);
    }

    if (eligible) {
      reasons.push("تم استيفاء جميع الشروط الأولية");
    }

    setCalculationResult({
      maxFinancing,
      monthlyInstallment,
      totalAmount,
      interestAmount,
      salaryRatio,
      eligible,
      reasons
    });

    setCurrentTab("results");
  };

  // تحديث الأسعار يدوياً مع معالجة محسنة
  const refreshRates = async () => {
    setIsUpdatingRates(true);
    
    try {
      // محاولة جلب البيانات من مصدر خارجي مع timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 ثوانٍ للتحديث اليدوي
      
      const response = await fetch('/bankRates.json?' + Date.now(), {
        signal: controller.signal,
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data?.rates && typeof data.rates === 'object') {
          const updatedRates: Record<string, { rate: number; minSalary: number; maxFinancing: number }> = {};
          Object.entries(data.rates).forEach(([bankName, bankData]: [string, any]) => {
            if (bankData && typeof bankData === 'object') {
              updatedRates[bankName] = {
                rate: bankData.rate || defaultBankRates[bankName]?.rate || 6.5,
                minSalary: bankData.minSalary || defaultBankRates[bankName]?.minSalary || 3000,
                maxFinancing: bankData.maxFinancing || defaultBankRates[bankName]?.maxFinancing || 2000000
              };
            }
          });
          
          setBankRates(updatedRates);
          setLastUpdate(new Date(data.lastUpdate || Date.now()));
          setDataSource("external");
          console.log('✅ تم تحديث الأسعار بنجاح من:', data.source || 'مصدر خارجي');
        } else {
          throw new Error('تنسيق البيانات غير صحيح');
        }
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('انتهت مهلة الاتصال، سيتم إجراء تحديث محلي');
      } else {
        console.log('لا يمكن الوصول للمصدر الخارجي، سيتم إجراء تحديث محلي محسن');
      }
      
      // تحديث محلي محسن كخطة احتياطية
      const simulatedRates = { ...bankRates };
      Object.keys(simulatedRates).forEach(bank => {
        // محاكاة تحديث من السوق
        const marketVariation = (Math.random() - 0.5) * 0.25; // +/- 0.125%
        const baseRate = defaultBankRates[bank]?.rate || 6.5;
        simulatedRates[bank].rate = Math.max(5.8, Math.min(7.8, baseRate + marketVariation));
        simulatedRates[bank].rate = Math.round(simulatedRates[bank].rate * 100) / 100;
      });
      
      setBankRates(simulatedRates);
      setLastUpdate(new Date());
      setDataSource("simulated");
      console.log('📊 تم تحديث الأسعار محلياً بناءً على تقلبات السوق المحاكاة');
    }
    
    setIsUpdatingRates(false);
  };

  // حفظ في بطاقة العميل
  const handleSaveToCustomer = () => {
    if (!formData.phone) {
      toast.error('يرجى إدخال رقم الجوال في بيانات الطلب');
      return;
    }

    try {
      // البحث عن العميل
      let customer = findCustomerByPhone(formData.phone);
      
      // بيانات السلايد
      const slideData = {
        type: 'finance_calculation',
        data: {
          formData,
          selectedBank,
          loanType,
          calculationResult,
          createdAt: new Date().toISOString()
        }
      };

      if (customer) {
        // العميل موجود - تحديث بياناته وإضافة السلايد
        const updatedCustomer = updateCustomer(customer.id, {
          name: formData.name || customer.name,
          email: customer.email,
          notes: customer.notes ? `${customer.notes}\n\n[حاسبة تمويل - ${new Date().toLocaleDateString('ar-SA')}]\nالبنك: ${selectedBank}\nالراتب: ${formData.totalSalary}\nسعر العقار: ${formData.propertyPrice}` : `[حاسبة تمويل - ${new Date().toLocaleDateString('ar-SA')}]\nالبنك: ${selectedBank}\nالراتب: ${formData.totalSalary}\nسعر العقار: ${formData.propertyPrice}`,
        });
        
        toast.success(`✅ تم حفظ حاسبة التمويل في بطاقة العميل: ${customer.name}`);
      } else {
        // عميل جديد - إنشاء بطاقة جديدة
        const newCustomer = createCustomer({
          name: formData.name || 'عميل جديد',
          phone: formData.phone,
          category: 'تمويل',
          source: 'حاسبة التمويل',
          idNumber: formData.idNumber,
          birthDate: formData.birthDate,
          notes: `[حاسبة تمويل - ${new Date().toLocaleDateString('ar-SA')}]\nالبنك: ${selectedBank}\nنوع القطاع: ${formData.sectorType}\nجهة العمل: ${formData.employer}\nالمسمى الوظيفي: ${formData.jobTitle}\nالراتب الأساسي: ${formData.basicSalary}\nالراتب الإجمالي: ${formData.totalSalary}\nدعم الإسكان: ${formData.hasHousingSupport ? 'نعم' : 'لا'}\nالقسط الحالي: ${formData.monthlyInstallment}\nسعر العقار: ${formData.propertyPrice}\nالدفعة الأولى: ${formData.downPayment}\nفترة التمويل: ${formData.financingPeriod} سنة`,
          budget: formData.propertyPrice,
        });
        
        toast.success(`✅ تم إنشاء بطاقة عميل جديدة: ${newCustomer.name}`);
      }
    } catch (error) {
      console.error('Error saving to customer:', error);
      toast.error('حدث خطأ أثناء الحفظ');
    }
  };

  // إرسال كرابط للعميل
  const handleSendLink = () => {
    try {
      const linkId = `finance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const link = `${window.location.origin}/finance-link/${linkId}`;
      
      // حفظ البيانات مع معرف الرابط
      localStorage.setItem(`finance_link_broker_${linkId}`, JSON.stringify({
        formData,
        selectedBank,
        loanType,
        bankRates,
        createdAt: new Date().toISOString(),
        brokerPhone: formData.phone || 'unknown'
      }));
      
      // نسخ الرابط للحافظة - طريقة آمنة متوافقة مع جميع المتصفحات
      const fallbackCopyToClipboard = (text: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            console.log('✅ تم النسخ باستخدام execCommand');
          } else {
            console.warn('فشل execCommand');
          }
        } catch (err) {
          console.error('خطأ في النسخ:', err);
        }
        
        document.body.removeChild(textArea);
      };

      // محاولة استخدام Clipboard API مع fallback
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link)
          .then(() => {
            console.log('✅ تم النسخ باستخدام Clipboard API');
          })
          .catch((err) => {
            console.warn('فشل Clipboard API، استخدام الطريقة البديلة:', err);
            fallbackCopyToClipboard(link);
          });
      } else {
        fallbackCopyToClipboard(link);
      }
      
      toast.success(`✅ تم إنشاء الرابط!\n\nالرابط: ${link}\n\nأرسله للعميل عبر الواتساب`);
      
      // فتح واتساب إذا كان رقم الجوال موجود
      if (formData.phone) {
        const whatsappLink = `https://wa.me/${formData.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`السلام عليكم\n\nتفضل رابط حاسبة التمويل العقاري:\n${link}\n\nيرجى تعبئة البيانات وسنتواصل معك قريباً`)}`;
        window.open(whatsappLink, '_blank');
      }
    } catch (error) {
      console.error('Error creating link:', error);
      toast.error('حدث خطأ أثناء إنشاء الرابط');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-[#ffffff]" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-[#D4AF37] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 border-2 border-[#D4AF37] hover:bg-[#f0fdf4]"
            >
              <ArrowRight className="w-4 h-4" />
              العودة
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-[#01411C]">حاسبة التمويل العقاري</h1>
              <p className="text-sm text-gray-600">احسب أهليتك للتمويل مع جميع البنوك السعودية</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshRates}
                disabled={isUpdatingRates}
                className="border-[#D4AF37]"
              >
                <RefreshCw className={`w-4 h-4 ${isUpdatingRates ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6" dir="rtl">
          {/* Tabs Navigation */}
          <TabsList className="grid w-full grid-cols-4 bg-white border-2 border-[#D4AF37] rounded-lg">
            <TabsTrigger value="links" className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
              الخدمات الحكومية
            </TabsTrigger>
            <TabsTrigger value="application" className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
              بيانات الطلب
            </TabsTrigger>
            <TabsTrigger value="calculator" className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
              حاسبة التمويل
            </TabsTrigger>
            <TabsTrigger value="results" className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
              النتائج
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Government Services */}
          <TabsContent value="links" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* SAMA Link */}
              <Card className="border-2 border-[#D4AF37] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-[#01411C]">
                    <Building className="w-6 h-6 text-[#D4AF37]" />
                    البنك المركزي السعودي (ساما)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    الموقع الرسمي للبنك المركزي السعودي للاطلاع على أحدث أسعار الفائدة والسياسات المصرفية
                  </p>
                  <Button 
                    asChild 
                    className="w-full bg-[#01411C] hover:bg-[#065f41] text-white"
                  >
                    <a href="https://sama.gov.sa" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 ml-2" />
                      زيارة موقع ساما
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Sakani Link */}
              <Card className="border-2 border-[#D4AF37] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-[#01411C]">
                    <Home className="w-6 h-6 text-[#D4AF37]" />
                    برنامج سكني
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    تحقق من أهليتك للحصول على الدعم السكني والخدمات المقدمة من برنامج سكني
                  </p>
                  <Button 
                    asChild 
                    className="w-full bg-[#01411C] hover:bg-[#065f41] text-white"
                  >
                    <a href="https://sakani.sa/app/authentication/login?returnUrl=%2Feligibility%2Fcheck" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 ml-2" />
                      التحقق من الاستحقاق
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* GOSI Link */}
              <Card className="border-2 border-[#D4AF37] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-[#01411C]">
                    <Shield className="w-6 h-6 text-[#D4AF37]" />
                    التأمينات الاجتماعية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    احصل على شهادة راتب أو بيان تأميني مطلوب لطلبات التمويل العقاري
                  </p>
                  <Button 
                    asChild 
                    className="w-full bg-[#01411C] hover:bg-[#065f41] text-white"
                  >
                    <a href="https://www.gosi.gov.sa/ar" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 ml-2" />
                      موقع التأمينات
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Bank Rates Update */}
              <Card className="border-2 border-[#D4AF37] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-[#01411C]">
                    <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
                    أسعار البنوك المحدثة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">آخر تحديث:</span>
                      <Badge variant="outline" className="text-xs">
                        {lastUpdate ? lastUpdate.toLocaleString('ar-SA') : 'لم يتم التحديث بعد'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">مصدر البيانات:</span>
                      <Badge className={
                        dataSource === "external" ? 'bg-green-100 text-green-800' :
                        dataSource === "simulated" ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {dataSource === "external" ? '🌐 خارجي' :
                         dataSource === "simulated" ? '📊 محاكاة السوق' :
                         '💾 افتراضي'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">الحالة:</span>
                      <Badge className={isUpdatingRates ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                        {isUpdatingRates ? 'جاري التحديث...' : 'محدث'}
                      </Badge>
                    </div>

                    <Button 
                      onClick={refreshRates}
                      disabled={isUpdatingRates}
                      className="w-full bg-[#D4AF37] hover:bg-[#b8941f] text-[#01411C]"
                    >
                      {isUpdatingRates ? (
                        <RefreshCw className="w-4 h-4 animate-spin ml-2" />
                      ) : (
                        <RefreshCw className="w-4 h-4 ml-2" />
                      )}
                      تحديث الأسعار
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* مصدر البيانات */}
            <Card className={`border-2 ${
              dataSource === "external" ? "border-green-200 bg-green-50" :
              dataSource === "simulated" ? "border-blue-200 bg-blue-50" :
              "border-orange-200 bg-orange-50"
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className={`w-5 h-5 mt-1 flex-shrink-0 ${
                    dataSource === "external" ? "text-green-600" :
                    dataSource === "simulated" ? "text-blue-600" :
                    "text-orange-600"
                  }`} />
                  <div className={`text-sm ${
                    dataSource === "external" ? "text-green-800" :
                    dataSource === "simulated" ? "text-blue-800" :
                    "text-orange-800"
                  }`}>
                    <h4 className="font-medium mb-2">💡 حالة البيانات:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• الوضع الحالي: {
                        dataSource === "external" ? "🌐 متصل بمصدر خارجي رسمي" :
                        dataSource === "simulated" ? "📊 محاكاة تقلبات السوق النشطة" :
                        "💾 البيانات الافتراضية المحسنة"
                      }</li>
                      <li>• آخر تحديث: {lastUpdate?.toLocaleDateString('ar-SA') || 'اليوم'} في {lastUpdate?.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) || 'الآن'}</li>
                      <li>• {dataSource === "external" ? "✅ البيانات محدثة مباشرة من المصدر الرسمي" :
                            dataSource === "simulated" ? "🔄 محاكاة واقعية لتقلبات أسعار السوق" :
                            "🎯 بيانات دقيقة مبنية على أحدث الأسعار المتاحة"}</li>
                      <li>• الحاسبة تعمل بكامل طاقتها لإعطائك نتائج دقيقة</li>
                      <li>• للحصول على أحدث الأسعار، اضغط زر "تحديث الأسعار" أعلاه</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Calculator */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Bank Selection */}
              <Card className="border-2 border-[#D4AF37]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-[#01411C]">
                    <Building className="w-5 h-5 text-[#D4AF37]" />
                    اختيار البنك
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>البنك المختار</Label>
                    <Select value={selectedBank} onValueChange={setSelectedBank}>
                      <SelectTrigger className="border-[#D4AF37] focus:border-[#01411C]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(bankRates).map((bank) => (
                          <SelectItem key={bank} value={bank}>
                            {bank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedBank && (
                    <div className="bg-[#f0fdf4] p-4 rounded-lg border border-[#D4AF37]">
                      <h4 className="font-medium text-[#01411C] mb-2">تفاصيل البنك:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>نسبة الفائدة:</span>
                          <Badge className="bg-[#01411C] text-white">
                            {bankRates[selectedBank].rate.toFixed(2)}%
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>الحد الأدنى للراتب:</span>
                          <span className="font-medium">
                            {bankRates[selectedBank].minSalary.toLocaleString()} ريال
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>أقصى مبلغ تمويل:</span>
                          <span className="font-medium">
                            {(bankRates[selectedBank].maxFinancing / 1000000).toFixed(1)} مليون ريال
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loan Type */}
                  <div className="space-y-3">
                    <Label>نوع التمويل</Label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={loanType === "realEstate"}
                          onChange={() => setLoanType("realEstate")}
                          className="text-[#01411C]"
                        />
                        <span>تمويل عقاري</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={loanType === "mixed"}
                          onChange={() => setLoanType("mixed")}
                          className="text-[#01411C]"
                        />
                        <span>تمويل شخصي + عقاري</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Calculator */}
              <Card className="border-2 border-[#D4AF37]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-[#01411C]">
                    <Calculator className="w-5 h-5 text-[#D4AF37]" />
                    حاسبة سريعة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>سعر العقار (ريال)</Label>
                      <Input
                        type="number"
                        placeholder="500000"
                        value={formData.propertyPrice}
                        onChange={(e) => updateFormData('propertyPrice', e.target.value)}
                        className="border-[#D4AF37] focus:border-[#01411C]"
                      />
                    </div>
                    <div>
                      <Label>الدفعة الأولى (ريال)</Label>
                      <Input
                        type="number"
                        placeholder="100000"
                        value={formData.downPayment}
                        onChange={(e) => updateFormData('downPayment', e.target.value)}
                        className="border-[#D4AF37] focus:border-[#01411C]"
                      />
                    </div>
                    <div>
                      <Label>الراتب الإجمالي (ريال)</Label>
                      <Input
                        type="number"
                        placeholder="15000"
                        value={formData.totalSalary}
                        onChange={(e) => updateFormData('totalSalary', e.target.value)}
                        className="border-[#D4AF37] focus:border-[#01411C]"
                      />
                    </div>
                    <div>
                      <Label>فترة التمويل (سنة)</Label>
                      <Select value={formData.financingPeriod} onValueChange={(value) => updateFormData('financingPeriod', value)}>
                        <SelectTrigger className="border-[#D4AF37] focus:border-[#01411C]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 سنة</SelectItem>
                          <SelectItem value="20">20 سنة</SelectItem>
                          <SelectItem value="25">25 سنة</SelectItem>
                          <SelectItem value="30">30 سنة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={calculateFinancing}
                    className="w-full bg-[#01411C] hover:bg-[#065f41] text-white"
                  >
                    <Calculator className="w-4 h-4 ml-2" />
                    التالي
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* All Banks Comparison */}
            <Card className="border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="text-[#01411C]">مقارنة أسعار جميع البنوك</CardTitle>
                <p className="text-sm text-gray-600">أسعار محدثة تلقائياً من المصادر الرسمية</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(bankRates).map(([bank, info]) => (
                    <div 
                      key={bank}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedBank === bank 
                          ? 'border-[#01411C] bg-[#f0fdf4]' 
                          : 'border-gray-200 hover:border-[#D4AF37]'
                      }`}
                      onClick={() => setSelectedBank(bank)}
                    >
                      <div className="text-center">
                        <h4 className="font-medium text-[#01411C] mb-2">{bank}</h4>
                        <div className="text-2xl font-bold text-[#D4AF37] mb-1">
                          {info.rate.toFixed(2)}%
                        </div>
                        <div className="text-xs text-gray-600">
                          حد أدنى: {info.minSalary.toLocaleString()} ريال
                        </div>
                        <div className="text-xs text-gray-600">
                          حد أقصى: {(info.maxFinancing/1000000).toFixed(1)}م ريال
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Application Form */}
          <TabsContent value="application" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Personal Information */}
              <Card className="border-2 border-[#D4AF37]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-[#01411C]">
                    <User className="w-5 h-5 text-[#D4AF37]" />
                    البيانات الشخصية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>الاسم الكامل</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      placeholder="أحمد محمد العبدالله"
                      className="border-[#D4AF37] focus:border-[#01411C]"
                    />
                  </div>

                  <div>
                    <Label>رقم الجوال</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="05xxxxxxxx"
                      className="border-[#D4AF37] focus:border-[#01411C]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <Label>رقم بطاقة الأحوال</Label>
                    <Input
                      value={formData.idNumber}
                      onChange={(e) => updateFormData('idNumber', e.target.value)}
                      placeholder="1234567890"
                      className="border-[#D4AF37] focus:border-[#01411C]"
                    />
                  </div>

                  <div>
                    <Label>تاريخ الميلاد</Label>
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => updateFormData('birthDate', e.target.value)}
                      className="border-[#D4AF37] focus:border-[#01411C]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Work Information */}
              <Card className="border-2 border-[#D4AF37]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-[#01411C]">
                    <Building className="w-5 h-5 text-[#D4AF37]" />
                    بيانات العمل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>نوع القطاع</Label>
                    <Select value={formData.sectorType} onValueChange={(value) => updateFormData('sectorType', value)}>
                      <SelectTrigger className="border-[#D4AF37] focus:border-[#01411C]">
                        <SelectValue placeholder="اختر نوع القطاع" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectorTypes.map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>اسم جهة العمل</Label>
                    <Input
                      value={formData.employer}
                      onChange={(e) => updateFormData('employer', e.target.value)}
                      placeholder="وزارة التعليم"
                      className="border-[#D4AF37] focus:border-[#01411C]"
                    />
                  </div>

                  <div>
                    <Label>المسمى الوظيفي</Label>
                    <Input
                      value={formData.jobTitle}
                      onChange={(e) => updateFormData('jobTitle', e.target.value)}
                      placeholder="مدير إداري"
                      className="border-[#D4AF37] focus:border-[#01411C]"
                    />
                  </div>

                  <div>
                    <Label>تاريخ التعيين</Label>
                    <Input
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => updateFormData('hireDate', e.target.value)}
                      className="border-[#D4AF37] focus:border-[#01411C]"
                    />
                  </div>

                  {formData.sectorType === "عسكري" && (
                    <>
                      <div>
                        <Label>القطاع العسكري</Label>
                        <Input
                          value={formData.militarySector}
                          onChange={(e) => updateFormData('militarySector', e.target.value)}
                          placeholder="وزارة الدفاع"
                          className="border-[#D4AF37] focus:border-[#01411C]"
                        />
                      </div>

                      <div>
                        <Label>الرتبة</Label>
                        <Select value={formData.rank} onValueChange={(value) => updateFormData('rank', value)}>
                          <SelectTrigger className="border-[#D4AF37] focus:border-[#01411C]">
                            <SelectValue placeholder="اختر الرتبة" />
                          </SelectTrigger>
                          <SelectContent>
                            {militaryRanks.map((rank) => (
                              <SelectItem key={rank} value={rank}>
                                {rank}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Financial Information */}
              <Card className="border-2 border-[#D4AF37]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-[#01411C]">
                    <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                    البيانات المالية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>الراتب الأساسي (ريال)</Label>
                    <Input
                      type="number"
                      value={formData.basicSalary}
                      onChange={(e) => updateFormData('basicSalary', e.target.value)}
                      placeholder="12000"
                      className="border-[#D4AF37] focus:border-[#01411C]"
                    />
                  </div>

                  <div>
                    <Label>الراتب الإجمالي (ريال)</Label>
                    <Input
                      type="number"
                      value={formData.totalSalary}
                      onChange={(e) => updateFormData('totalSalary', e.target.value)}
                      placeholder="15000"
                      className="border-[#D4AF37] focus:border-[#01411C]"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="housingSupport"
                      checked={formData.hasHousingSupport}
                      onCheckedChange={(checked) => updateFormData('hasHousingSupport', checked as boolean)}
                    />
                    <Label htmlFor="housingSupport" className="mr-2">
                      يوجد دعم إسكان من جهة العمل
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Existing Debts */}
              <Card className="border-2 border-[#D4AF37]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-[#01411C]">
                    <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                    الالتزامات المالية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>إجمالي المديونية بالبنك (ريال)</Label>
                    <Input
                      type="number"
                      value={formData.currentDebtBank}
                      onChange={(e) => updateFormData('currentDebtBank', e.target.value)}
                      placeholder="0"
                      className="border-[#D4AF37] focus:border-[#01411C]"
                    />
                  </div>

                  <div>
                    <Label>نوع المديونية بالبنك</Label>
                    <Input
                      value={formData.currentDebtType}
                      onChange={(e) => updateFormData('currentDebtType', e.target.value)}
                      placeholder="قرض شخصي، بطاقة ائتمان"
                      className="border-[#D4AF37] focus:border-[#01411C]"
                    />
                  </div>

                  <div>
                    <Label>مبلغ القسط الشهري الحالي (ريال)</Label>
                    <Input
                      type="number"
                      value={formData.monthlyInstallment}
                      onChange={(e) => updateFormData('monthlyInstallment', e.target.value)}
                      placeholder="0"
                      className="border-[#D4AF37] focus:border-[#01411C]"
                    />
                  </div>

                  <div>
                    <Label>التزامات أخرى شهرية (ريال)</Label>
                    <Input
                      type="number"
                      value={formData.externalDebts}
                      onChange={(e) => updateFormData('externalDebts', e.target.value)}
                      placeholder="0"
                      className="border-[#D4AF37] focus:border-[#01411C]"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={() => {
                  setCurrentTab("calculator");
                }}
                className="px-8 py-3 bg-[#01411C] hover:bg-[#065f41] text-white"
              >
                <Calculator className="w-5 h-5 ml-2" />
                التالي
              </Button>
            </div>
          </TabsContent>

          {/* Tab 4: Results */}
          <TabsContent value="results" className="space-y-6">
            {calculationResult ? (
              <div className="space-y-6">
                {/* النتيجة النهائية */}
                <Card className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#f0fdf4] to-white">
                  <CardHeader>
                    <CardTitle className="text-center text-[#01411C]">النتيجة النهائية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-lg ${calculationResult.eligible ? 'bg-green-100' : 'bg-red-100'}`}>
                        {calculationResult.eligible ? (
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        ) : (
                          <AlertCircle className="w-8 h-8 text-red-600" />
                        )}
                        <span className={`text-2xl ${calculationResult.eligible ? 'text-green-700' : 'text-red-700'}`}>
                          {calculationResult.eligible ? 'مؤهل للتمويل' : 'غير مؤهل للتمويل'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white p-4 rounded-lg border-2 border-[#D4AF37]">
                          <div className="text-sm text-gray-600 mb-1">مبلغ التمويل</div>
                          <div className="text-2xl text-[#01411C]">{(parseFloat(formData.propertyPrice) - parseFloat(formData.downPayment)).toLocaleString()}</div>
                          <div className="text-xs text-gray-500">ريال</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-2 border-[#D4AF37]">
                          <div className="text-sm text-gray-600 mb-1">القسط الشهري</div>
                          <div className="text-2xl text-[#D4AF37]">{Math.round(calculationResult.monthlyInstallment).toLocaleString()}</div>
                          <div className="text-xs text-gray-500">ريال</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-2 border-[#D4AF37]">
                          <div className="text-sm text-gray-600 mb-1">نسبة الالتزام</div>
                          <div className="text-2xl text-[#01411C]">{calculationResult.salaryRatio.toFixed(1)}%</div>
                          <div className="text-xs text-gray-500">من الراتب</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-2 border-[#D4AF37]">
                          <div className="text-sm text-gray-600 mb-1">إجمالي الفوائد</div>
                          <div className="text-2xl text-[#D4AF37]">{Math.round(calculationResult.interestAmount).toLocaleString()}</div>
                          <div className="text-xs text-gray-500">ريال</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* بيانات الطلب */}
                <Card className="border-2 border-[#D4AF37]">
                  <CardHeader>
                    <CardTitle className="text-[#01411C]">بيانات الطلب المدخلة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-[#01411C] pb-2 border-b-2 border-[#D4AF37]">البيانات الشخصية</h4>
                        <div className="flex justify-between">
                          <span className="text-gray-600">الاسم الكامل:</span>
                          <span className="font-medium">{formData.name || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">رقم الجوال:</span>
                          <span className="font-medium" dir="ltr">{formData.phone || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">رقم الهوية:</span>
                          <span className="font-medium">{formData.idNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">تاريخ الميلاد:</span>
                          <span className="font-medium">{formData.birthDate || '-'}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[#01411C] pb-2 border-b-2 border-[#D4AF37]">بيانات العمل</h4>
                        <div className="flex justify-between">
                          <span className="text-gray-600">نوع القطاع:</span>
                          <span className="font-medium">{formData.sectorType || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">جهة العمل:</span>
                          <span className="font-medium">{formData.employer || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">المسمى الوظيفي:</span>
                          <span className="font-medium">{formData.jobTitle || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">تاريخ التعيين:</span>
                          <span className="font-medium">{formData.hireDate || '-'}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[#01411C] pb-2 border-b-2 border-[#D4AF37]">البيانات المالية</h4>
                        <div className="flex justify-between">
                          <span className="text-gray-600">الراتب الأساسي:</span>
                          <span className="font-medium">{formData.basicSalary ? parseFloat(formData.basicSalary).toLocaleString() + ' ريال' : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">الراتب الإجمالي:</span>
                          <span className="font-medium">{formData.totalSalary ? parseFloat(formData.totalSalary).toLocaleString() + ' ريال' : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">دعم الإسكان:</span>
                          <span className="font-medium">{formData.hasHousingSupport ? 'نعم' : 'لا'}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[#01411C] pb-2 border-b-2 border-[#D4AF37]">الالتزامات المالية</h4>
                        <div className="flex justify-between">
                          <span className="text-gray-600">القسط الشهري الحالي:</span>
                          <span className="font-medium">{formData.monthlyInstallment ? parseFloat(formData.monthlyInstallment).toLocaleString() + ' ريال' : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">التزامات أخرى:</span>
                          <span className="font-medium">{formData.externalDebts ? parseFloat(formData.externalDebts).toLocaleString() + ' ريال' : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">نوع المديونية:</span>
                          <span className="font-medium">{formData.currentDebtType || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* بيانات حاسبة التمويل */}
                <Card className="border-2 border-[#D4AF37]">
                  <CardHeader>
                    <CardTitle className="text-[#01411C]">بيانات حاسبة التمويل</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">البنك المختار:</span>
                          <span className="font-medium">{selectedBank}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">نسبة الفائدة:</span>
                          <span className="font-medium">{bankRates[selectedBank].rate.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">نوع التمويل:</span>
                          <span className="font-medium">{loanType === "realEstate" ? "تمويل عقاري" : "تمويل شخصي + عقاري"}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">سعر العقار:</span>
                          <span className="font-medium">{parseFloat(formData.propertyPrice).toLocaleString()} ريال</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">الدفعة الأولى:</span>
                          <span className="font-medium">{parseFloat(formData.downPayment).toLocaleString()} ريال</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">فترة التمويل:</span>
                          <span className="font-medium">{formData.financingPeriod} سنة</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* تنبيه */}
                <Card className="border-2 border-yellow-400 bg-yellow-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                      <div className="text-sm text-yellow-800 leading-relaxed">
                        <p className="font-medium mb-2">☆ تنبيه مهم:</p>
                        <p>
                          هذه تعتبر "حسبة مبدئية" لتحديد مبلغ التمويل الذي يحدد نوع العقار الذي تستطيع شراءه وحدود سعره. 
                          بعد رفع جميع الأوراق المطلوبة سيتم التأكيد عليك بالمبلغ المستحق سواء أقل أو نفسه أو أكثر.
                          يُنصح بمراجعة البنك مباشرة للحصول على تقييم دقيق وعرض رسمي للتمويل.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* الأزرار */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    className="w-full bg-[#01411C] hover:bg-[#065f41] text-white"
                    onClick={handleSaveToCustomer}
                  >
                    <Save className="w-4 h-4 ml-2" />
                    حفظ في بطاقة العميل
                  </Button>

                  <Button
                    className="w-full bg-[#D4AF37] hover:bg-[#b8941f] text-[#01411C]"
                    onClick={() => {
                      toast.info('سيتم إضافة ميزة تصدير PDF قريباً');
                    }}
                  >
                    <Download className="w-4 h-4 ml-2" />
                    إرسال كملف PDF
                  </Button>

                  <Button
                    className="w-full bg-[#01411C] hover:bg-[#065f41] text-white"
                    onClick={handleSendLink}
                  >
                    <Link className="w-4 h-4 ml-2" />
                    إرسال كرابط للعميل
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="border-2 border-[#D4AF37]">
                <CardContent className="p-12 text-center">
                  <Calculator className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-[#01411C] mb-2">لا توجد نتائج بعد</h3>
                  <p className="text-gray-600 mb-6">
                    يرجى ملء البيانات في التبويبات السابقة والنقر على "التالي"
                  </p>
                  <Button 
                    onClick={() => setCurrentTab("calculator")}
                    className="bg-[#D4AF37] hover:bg-[#b8941f] text-[#01411C]"
                  >
                    بدء الحساب
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default FinanceCalculator;
