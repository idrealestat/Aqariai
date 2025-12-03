import { Calculator, Percent, Ruler, Building, Grid } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface QuickCalculatorProps {
  onNavigate: (page: string) => void;
}

export default function QuickCalculator({ onNavigate }: QuickCalculatorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7] p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#01411C] to-[#065f41] flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl font-bold text-[#01411C] mb-2">الحاسبة السريعة</h1>
          <p className="text-gray-600">اختر نوع الحساب الذي تريده</p>
        </div>

        {/* Calculator Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* حساب العمولة */}
          <Card 
            onClick={() => onNavigate('commission-calculator')}
            className="border-2 border-[#D4AF37] bg-gradient-to-br from-blue-50 to-blue-100 hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group"
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Percent className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">حساب العمولة</h3>
              <p className="text-sm text-blue-700">احسب عمولتك بسهولة مع إمكانية التقسيم</p>
            </CardContent>
          </Card>

          {/* حساب المتر المربع للأرض */}
          <Card 
            onClick={() => onNavigate('land-calculator')}
            className="border-2 border-[#D4AF37] bg-gradient-to-br from-green-50 to-green-100 hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group"
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Ruler className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-2">حساب المتر المربع للأرض</h3>
              <p className="text-sm text-green-700">احسب سعر المتر ومساحة الأرض</p>
            </CardContent>
          </Card>

          {/* حساب مسطح البناء */}
          <Card 
            onClick={() => onNavigate('building-area-calculator')}
            className="border-2 border-[#D4AF37] bg-gradient-to-br from-purple-50 to-purple-100 hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group"
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-900 mb-2">حساب مسطح البناء</h3>
              <p className="text-sm text-purple-700">احسب المساحة الإجمالية للبناء</p>
            </CardContent>
          </Card>

          {/* آلة حاسبة عادية */}
          <Card 
            onClick={() => onNavigate('standard-calculator')}
            className="border-2 border-[#D4AF37] bg-gradient-to-br from-orange-50 to-orange-100 hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group"
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Grid className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-orange-900 mb-2">آلة حاسبة عادية</h3>
              <p className="text-sm text-orange-700">حاسبة قياسية للعمليات الحسابية</p>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => onNavigate('dashboard')}
            variant="outline"
            className="border-2 border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4]"
          >
            العودة للرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
}
