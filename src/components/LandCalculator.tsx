import { useState } from 'react';
import { Ruler, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LandCalculatorProps {
  onNavigate: (page: string) => void;
}

export default function LandCalculator({ onNavigate }: LandCalculatorProps) {
  const [landPrice, setLandPrice] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');

  const calculatePricePerMeter = () => {
    const price = parseFloat(landPrice) || 0;
    const area = parseFloat(totalArea) || 0;
    if (area === 0) return 0;
    return price / area;
  };

  const calculateArea = () => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    return l * w;
  };

  const pricePerMeter = calculatePricePerMeter();
  const calculatedArea = calculateArea();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-6" dir="rtl">
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
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
              <Ruler className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-900 mb-2">حساب المتر المربع للأرض</h1>
            <p className="text-green-700">احسب سعر المتر ومساحة الأرض</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* حساب سعر المتر المربع */}
          <Card className="border-2 border-green-300 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardTitle className="text-center">حساب سعر المتر المربع</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* سعر الأرض */}
              <div className="space-y-2">
                <Label htmlFor="landPrice" className="text-lg font-bold text-green-900">
                  سعر الأرض (ريال)
                </Label>
                <Input
                  id="landPrice"
                  type="number"
                  placeholder="أدخل سعر الأرض"
                  value={landPrice}
                  onChange={(e) => setLandPrice(e.target.value)}
                  className="text-lg border-2 border-green-300 focus:border-green-500"
                />
              </div>

              {/* مساحة الأرض الإجمالية */}
              <div className="space-y-2">
                <Label htmlFor="totalArea" className="text-lg font-bold text-green-900">
                  مساحة الأرض الإجمالية (م²)
                </Label>
                <Input
                  id="totalArea"
                  type="number"
                  placeholder="أدخل المساحة الإجمالية"
                  value={totalArea}
                  onChange={(e) => setTotalArea(e.target.value)}
                  className="text-lg border-2 border-green-300 focus:border-green-500"
                />
              </div>

              {/* النتيجة */}
              {landPrice && totalArea && parseFloat(totalArea) > 0 && (
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white animate-in fade-in">
                  <div className="text-sm mb-2 opacity-90">سعر المتر المربع</div>
                  <div className="text-3xl font-bold">
                    {pricePerMeter.toLocaleString('ar-SA', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} ريال/م²
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* حساب مساحة الأرض */}
          <Card className="border-2 border-green-300 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <CardTitle className="text-center">حساب مساحة الأرض</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* طول الأرض */}
              <div className="space-y-2">
                <Label htmlFor="length" className="text-lg font-bold text-green-900">
                  طول الأرض (م)
                </Label>
                <Input
                  id="length"
                  type="number"
                  placeholder="أدخل طول الأرض"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="text-lg border-2 border-green-300 focus:border-green-500"
                />
              </div>

              {/* عرض الأرض */}
              <div className="space-y-2">
                <Label htmlFor="width" className="text-lg font-bold text-green-900">
                  عرض الأرض (م)
                </Label>
                <Input
                  id="width"
                  type="number"
                  placeholder="أدخل عرض الأرض"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="text-lg border-2 border-green-300 focus:border-green-500"
                />
              </div>

              {/* النتيجة */}
              {length && width && (
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white animate-in fade-in">
                  <div className="text-sm mb-2 opacity-90">المساحة الإجمالية</div>
                  <div className="text-3xl font-bold">
                    {calculatedArea.toLocaleString('ar-SA', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} م²
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
