import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { 
  ArrowRight, 
  Calculator, 
  Building, 
  Shield, 
  TrendingUp,
  DollarSign,
  Home,
  User,
  CreditCard,
  RefreshCw,
  ExternalLink,
  Info,
  Download,
  Send
} from "lucide-react";
import { downloadVCard } from '../utils/vcardGenerator';
import { toast } from 'sonner';

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

const sectorTypes = ["حكومي", "خاص", "عسكري", "تقاعد", "أعمال حرة"];

const militaryRanks = [
  "جندي", "جندي أول", "عريف", "وكيل رقيب", "رقيب", "رقيب أول", "رئيس رقباء",
  "ملازم", "ملازم أول", "نقيب", "رائد", "مقدم", "عقيد", "عميد", "لواء", "فريق", "فريق أول"
];

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

interface FinanceCalculatorPublicProps {
  linkId?: string;
}

export function FinanceCalculatorPublic({ linkId }: FinanceCalculatorPublicProps) {
  const [bankRates] = useState(defaultBankRates);
  const [selectedBank, setSelectedBank] = useState<string>("مصرف الراجحي");
  const [loanType, setLoanType] = useState<"realEstate" | "mixed">("realEstate");
  const [currentTab, setCurrentTab] = useState("links");
  const [lastUpdate] = useState<Date>(new Date());

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

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // حفظ البيانات في localStorage مع معرف الرابط
    if (linkId) {
      localStorage.setItem(`finance_link_${linkId}`, JSON.stringify({
        formData,
        selectedBank,
        loanType,
        submittedAt: new Date().toISOString()
      }));
      
      alert('✅ تم إرسال البيانات بنجاح! سيتواصل معك الوسيط قريباً.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-[#ffffff]" dir="rtl">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-[#D4AF37] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <h1 className="text-xl font-bold text-[#01411C]">حاسبة التمويل العقاري</h1>
            <p className="text-sm text-gray-600">احسب أهليتك للتمويل مع جميع البنوك السعودية</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6" dir="rtl">
          <TabsList className="grid w-full grid-cols-3 bg-white border-2 border-[#D4AF37] rounded-lg">
            <TabsTrigger value="links" className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
              الخدمات الحكومية
            </TabsTrigger>
            <TabsTrigger value="application" className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
              بيانات الطلب
            </TabsTrigger>
            <TabsTrigger value="calculator" className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
              حاسبة التمويل
            </TabsTrigger>
          </TabsList>

          <TabsContent value="links" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Button asChild className="w-full bg-[#01411C] hover:bg-[#065f41] text-white">
                    <a href="https://sama.gov.sa" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 ml-2" />
                      زيارة موقع ساما
                    </a>
                  </Button>
                </CardContent>
              </Card>

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
                  <Button asChild className="w-full bg-[#01411C] hover:bg-[#065f41] text-white">
                    <a href="https://sakani.sa/app/authentication/login?returnUrl=%2Feligibility%2Fcheck" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 ml-2" />
                      التحقق من الاستحقاق
                    </a>
                  </Button>
                </CardContent>
              </Card>

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
                  <Button asChild className="w-full bg-[#01411C] hover:bg-[#065f41] text-white">
                    <a href="https://www.gosi.gov.sa/ar" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 ml-2" />
                      موقع التأمينات
                    </a>
                  </Button>
                </CardContent>
              </Card>

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
                        {lastUpdate.toLocaleString('ar-SA')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="application" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                </CardContent>
              </Card>

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
                onClick={() => setCurrentTab("calculator")}
                className="px-8 py-3 bg-[#01411C] hover:bg-[#065f41] text-white"
              >
                <Calculator className="w-5 h-5 ml-2" />
                التالي
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* زر إرسال الطلب */}
                    <Button 
                      onClick={handleSubmit}
                      className="h-14 bg-gradient-to-r from-[#01411C] to-[#065f41] hover:from-[#065f41] hover:to-[#01411C] text-white text-lg"
                    >
                      <Send className="w-5 h-5 ml-2" />
                      إرسال الطلب
                    </Button>

                    {/* زر حفظ vCard */}
                    <Button
                      type="button"
                      onClick={() => {
                        if (!formData.name || !formData.phone) {
                          toast.error('يرجى إدخال الاسم ورقم الجوال أولاً');
                          return;
                        }
                        downloadVCard({
                          name: formData.name,
                          phone: formData.phone,
                          email: '',
                          company: '',
                          jobTitle: 'طالب تمويل',
                          website1: '',
                          website2: '',
                          whatsapp: formData.phone
                        }, formData.name);
                        toast.success('✅ تم تحميل بطاقة الاتصال!');
                      }}
                      className="h-14 bg-purple-500 hover:bg-purple-600 text-white text-lg"
                    >
                      <Download className="w-5 h-5 ml-2" />
                      حفظ بطاقة الاتصال
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-yellow-400 bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                  <div className="text-sm text-yellow-800 leading-relaxed">
                    <p className="font-medium mb-2">☆ تنبيه مهم:</p>
                    <p>
                      بعد إرسال الطلب، سيتواصل معك وسيطنا العقاري لاستكمال الإجراءات وحساب التمويل المناسب لك.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default FinanceCalculatorPublic;