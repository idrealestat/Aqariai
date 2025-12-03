import { useState } from 'react';
import { Percent, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface CommissionCalculatorProps {
  onNavigate: (page: string) => void;
}

export default function CommissionCalculator({ onNavigate }: CommissionCalculatorProps) {
  const [price, setPrice] = useState('');
  const [commissionRate, setCommissionRate] = useState('');
  const [isDivided, setIsDivided] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState('');

  const calculateCommission = () => {
    const priceNum = parseFloat(price) || 0;
    const rateNum = parseFloat(commissionRate) || 0;
    const totalCommission = (priceNum * rateNum) / 100;
    return totalCommission;
  };

  const calculatePerPerson = () => {
    const total = calculateCommission();
    const people = parseInt(numberOfPeople) || 1;
    return total / people;
  };

  const totalCommission = calculateCommission();
  const commissionPerPerson = isDivided ? calculatePerPerson() : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => onNavigate('quick-calculator')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-5 h-5 ml-2" />
            العودة
          </Button>
          
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
              <Percent className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">حساب العمولة</h1>
            <p className="text-blue-700">احسب عمولتك بدقة وسهولة</p>
          </div>
        </div>

        {/* Calculator Card */}
        <Card className="border-2 border-blue-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="text-center">أدخل البيانات</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* السعر */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-lg font-bold text-blue-900">
                السعر (ريال)
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="أدخل السعر"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="text-lg border-2 border-blue-300 focus:border-blue-500"
              />
            </div>

            {/* نسبة العمولة */}
            <div className="space-y-2">
              <Label htmlFor="commission" className="text-lg font-bold text-blue-900">
                نسبة العمولة (%)
              </Label>
              <Input
                id="commission"
                type="number"
                placeholder="أدخل نسبة العمولة"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="text-lg border-2 border-blue-300 focus:border-blue-500"
              />
            </div>

            {/* هل العمولة مقسمة؟ */}
            <div className="space-y-3">
              <Label className="text-lg font-bold text-blue-900">
                هل العمولة مقسمة؟
              </Label>
              <div className="flex gap-4">
                <Button
                  onClick={() => setIsDivided(true)}
                  className={`flex-1 h-12 ${
                    isDivided
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-white text-blue-900 border-2 border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  نعم
                </Button>
                <Button
                  onClick={() => {
                    setIsDivided(false);
                    setNumberOfPeople('');
                  }}
                  className={`flex-1 h-12 ${
                    !isDivided
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-white text-blue-900 border-2 border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  لا
                </Button>
              </div>
            </div>

            {/* عدد الأشخاص (يظهر فقط إذا كانت العمولة مقسمة) */}
            {isDivided && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top">
                <Label htmlFor="people" className="text-lg font-bold text-blue-900">
                  عدد الأشخاص
                </Label>
                <Input
                  id="people"
                  type="number"
                  placeholder="أدخل عدد الأشخاص"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(e.target.value)}
                  className="text-lg border-2 border-blue-300 focus:border-blue-500"
                  min="1"
                />
              </div>
            )}

            {/* النتائج */}
            {price && commissionRate && (
              <div className="space-y-4 pt-6 border-t-2 border-blue-200 animate-in fade-in">
                {/* نسبة العمولة الإجمالية */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="text-sm mb-2 opacity-90">نسبة العمولة الإجمالية</div>
                  <div className="text-3xl font-bold">
                    {totalCommission.toLocaleString('ar-SA', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} ريال
                  </div>
                </div>

                {/* نسبة العمولة لكل شخص */}
                {isDivided && numberOfPeople && parseInt(numberOfPeople) > 0 && (
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="text-sm mb-2 opacity-90">نسبة العمولة لكل شخص</div>
                    <div className="text-3xl font-bold">
                      {commissionPerPerson.toLocaleString('ar-SA', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} ريال
                    </div>
                    <div className="text-sm mt-2 opacity-90">
                      ({numberOfPeople} أشخاص)
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
