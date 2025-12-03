import { useState } from 'react';
import { Building, ArrowLeft, Plus, Trash2, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';

interface BuildingAreaCalculatorProps {
  onNavigate: (page: string) => void;
}

interface Floor {
  id: number;
  name: string;
  length: string;
  width: string;
}

export default function BuildingAreaCalculator({ onNavigate }: BuildingAreaCalculatorProps) {
  const [landArea, setLandArea] = useState('');
  const [buildingPercentage, setBuildingPercentage] = useState('');
  
  // الطابق الأرضي
  const [groundFloorLength, setGroundFloorLength] = useState('');
  const [groundFloorWidth, setGroundFloorWidth] = useState('');
  
  // الأدوار العلوية
  const [floors, setFloors] = useState<Floor[]>([]);
  
  // البدروم
  const [hasBasement, setHasBasement] = useState(false);
  const [basementLength, setBasementLength] = useState('');
  const [basementWidth, setBasementWidth] = useState('');
  const [countBasement, setCountBasement] = useState(false);
  
  // البلكونات
  const [balconyArea, setBalconyArea] = useState('');

  const addFloor = () => {
    const newId = floors.length + 1;
    setFloors([
      ...floors,
      { id: newId, name: `الدور ${newId}`, length: '', width: '' }
    ]);
  };

  const removeFloor = (id: number) => {
    setFloors(floors.filter(floor => floor.id !== id));
  };

  const updateFloor = (id: number, field: 'name' | 'length' | 'width', value: string) => {
    setFloors(floors.map(floor => 
      floor.id === id ? { ...floor, [field]: value } : floor
    ));
  };

  const calculateAllowedBuildingArea = () => {
    const area = parseFloat(landArea) || 0;
    const percentage = parseFloat(buildingPercentage) || 0;
    return (area * percentage) / 100;
  };

  const calculateGroundFloorArea = () => {
    const l = parseFloat(groundFloorLength) || 0;
    const w = parseFloat(groundFloorWidth) || 0;
    return l * w;
  };

  const calculateFloorArea = (floor: Floor) => {
    const l = parseFloat(floor.length) || 0;
    const w = parseFloat(floor.width) || 0;
    return l * w;
  };

  const calculateUpperFloorsArea = () => {
    return floors.reduce((total, floor) => total + calculateFloorArea(floor), 0);
  };

  const calculateBasementArea = () => {
    if (!hasBasement || !countBasement) return 0;
    const l = parseFloat(basementLength) || 0;
    const w = parseFloat(basementWidth) || 0;
    return l * w;
  };

  const calculateBalconyContribution = () => {
    const area = parseFloat(balconyArea) || 0;
    return area * 0.5; // 50% من مساحة البلكونات
  };

  const calculateTotalBuildingArea = () => {
    const groundFloor = calculateGroundFloorArea();
    const upperFloors = calculateUpperFloorsArea();
    const basement = calculateBasementArea();
    const balcony = calculateBalconyContribution();
    
    return groundFloor + upperFloors + basement + balcony;
  };

  const allowedArea = calculateAllowedBuildingArea();
  const totalArea = calculateTotalBuildingArea();
  const remainingArea = allowedArea - totalArea;

  const groundFloorArea = calculateGroundFloorArea();
  const upperFloorsArea = calculateUpperFloorsArea();
  const basementArea = calculateBasementArea();
  const balconyContribution = calculateBalconyContribution();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-6" dir="rtl">
      <div className="max-w-3xl mx-auto">
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
            <div className="w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-4">
              <Building className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-purple-900 mb-2">حساب مسطح البناء</h1>
            <p className="text-purple-700">وفقاً للأنظمة السعودية المعتمدة</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* معلومات توضيحية */}
          <Card className="border-2 border-purple-300 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-purple-900 space-y-1">
                  <p className="font-bold text-right">المعادلة المعتمدة في السعودية:</p>
                  <p className="text-right">مسطح البناء = الطابق الأرضي + الأدوار العلوية + البدروم (إن يُحتسب) + (50% × البلكونات)</p>
                  <p className="text-xs text-purple-700 mt-2 text-right">
                    • البدروم: يُحتسب إذا كان للسكن أو تجاري، ولا يُحتسب إذا كان لمواقف أو خدمات فقط<br />
                    • البلكونات والشرفات: تُحتسب بنسبة 50% من مساحتها
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* معلومات الأرض */}
          <Card className="border-2 border-purple-300 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardTitle className="text-center">معلومات الأرض</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* مساحة الأرض */}
              <div className="space-y-2">
                <Label htmlFor="landArea" className="text-lg font-bold text-purple-900">
                  مساحة الأرض (م²)
                </Label>
                <Input
                  id="landArea"
                  type="number"
                  placeholder="أدخل مساحة الأرض"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  className="text-lg border-2 border-purple-300 focus:border-purple-500"
                />
              </div>

              {/* نسبة البناء المسموحة */}
              <div className="space-y-2">
                <Label htmlFor="buildingPercentage" className="text-lg font-bold text-purple-900">
                  نسبة البناء المسموحة (%)
                </Label>
                <Input
                  id="buildingPercentage"
                  type="number"
                  placeholder="مثال: 60%"
                  value={buildingPercentage}
                  onChange={(e) => setBuildingPercentage(e.target.value)}
                  className="text-lg border-2 border-purple-300 focus:border-purple-500"
                  max="100"
                />
              </div>

              {/* مساحة البناء المسموحة */}
              {landArea && buildingPercentage && (
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white animate-in fade-in">
                  <div className="text-sm mb-2 opacity-90">مساحة البناء المسموحة</div>
                  <div className="text-3xl font-bold">
                    {allowedArea.toLocaleString('ar-SA', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} م²
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* الطابق الأرضي */}
          <Card className="border-2 border-purple-300 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <CardTitle>الطابق الأرضي</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-purple-900">
                    الطول (م)
                  </Label>
                  <Input
                    type="number"
                    placeholder="الطول"
                    value={groundFloorLength}
                    onChange={(e) => setGroundFloorLength(e.target.value)}
                    className="border-2 border-purple-300 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-purple-900">
                    العرض (م)
                  </Label>
                  <Input
                    type="number"
                    placeholder="العرض"
                    value={groundFloorWidth}
                    onChange={(e) => setGroundFloorWidth(e.target.value)}
                    className="border-2 border-purple-300 focus:border-purple-500"
                  />
                </div>
              </div>

              {groundFloorLength && groundFloorWidth && (
                <div className="bg-purple-200 rounded p-3 text-center">
                  <div className="text-sm text-purple-700 mb-1">مساحة الطابق الأرضي</div>
                  <div className="text-xl font-bold text-purple-900">
                    {groundFloorArea.toLocaleString('ar-SA', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} م²
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* الأدوار العلوية */}
          <Card className="border-2 border-purple-300 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <div className="flex items-center justify-between">
                <CardTitle>الأدوار العلوية</CardTitle>
                <Button
                  onClick={addFloor}
                  size="sm"
                  className="bg-white text-purple-700 hover:bg-purple-50"
                >
                  <Plus className="w-4 h-4 ml-1" />
                  إضافة دور
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {floors.length === 0 ? (
                <div className="text-center text-purple-600 py-8">
                  اضغط "إضافة دور" لإضافة أدوار علوية
                </div>
              ) : (
                floors.map((floor) => (
                  <div 
                    key={floor.id} 
                    className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <Input
                        value={floor.name}
                        onChange={(e) => updateFloor(floor.id, 'name', e.target.value)}
                        className="flex-1 ml-2 font-bold text-purple-900 border-2 border-purple-300"
                        placeholder="اسم الدور"
                      />
                      <Button
                        onClick={() => removeFloor(floor.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-purple-900">
                          الطول (م)
                        </Label>
                        <Input
                          type="number"
                          placeholder="الطول"
                          value={floor.length}
                          onChange={(e) => updateFloor(floor.id, 'length', e.target.value)}
                          className="border-2 border-purple-300 focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-purple-900">
                          العرض (م)
                        </Label>
                        <Input
                          type="number"
                          placeholder="العرض"
                          value={floor.width}
                          onChange={(e) => updateFloor(floor.id, 'width', e.target.value)}
                          className="border-2 border-purple-300 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {floor.length && floor.width && (
                      <div className="bg-purple-200 rounded p-3 text-center">
                        <div className="text-sm text-purple-700 mb-1">مساحة الدور</div>
                        <div className="text-xl font-bold text-purple-900">
                          {calculateFloorArea(floor).toLocaleString('ar-SA', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })} م²
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              {upperFloorsArea > 0 && (
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
                  <div className="text-sm mb-1 opacity-90">إجمالي الأدوار العلوية</div>
                  <div className="text-2xl font-bold">
                    {upperFloorsArea.toLocaleString('ar-SA', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} م²
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* البدروم */}
          <Card className="border-2 border-purple-300 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <CardTitle>البدروم (الطابق السفلي)</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="hasBasement"
                  checked={hasBasement}
                  onCheckedChange={(checked) => setHasBasement(checked as boolean)}
                />
                <Label htmlFor="hasBasement" className="text-lg font-bold text-purple-900 cursor-pointer">
                  يوجد بدروم في المبنى
                </Label>
              </div>

              {hasBasement && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-purple-900">
                        الطول (م)
                      </Label>
                      <Input
                        type="number"
                        placeholder="الطول"
                        value={basementLength}
                        onChange={(e) => setBasementLength(e.target.value)}
                        className="border-2 border-purple-300 focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-purple-900">
                        العرض (م)
                      </Label>
                      <Input
                        type="number"
                        placeholder="العرض"
                        value={basementWidth}
                        onChange={(e) => setBasementWidth(e.target.value)}
                        className="border-2 border-purple-300 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                    <div className="flex items-center space-x-2 space-x-reverse mb-3">
                      <Checkbox
                        id="countBasement"
                        checked={countBasement}
                        onCheckedChange={(checked) => setCountBasement(checked as boolean)}
                      />
                      <Label htmlFor="countBasement" className="font-bold text-amber-900 cursor-pointer">
                        احتساب البدروم في مسطح البناء
                      </Label>
                    </div>
                    <p className="text-xs text-amber-800 mr-6">
                      ✓ يُحتسب إذا كان للسكن أو تجاري<br />
                      ✗ لا يُحتسب إذا كان للمواقف أو الخدمات فقط
                    </p>
                  </div>

                  {basementLength && basementWidth && (
                    <div className={`rounded p-3 text-center ${
                      countBasement 
                        ? 'bg-purple-200' 
                        : 'bg-gray-200'
                    }`}>
                      <div className={`text-sm mb-1 ${
                        countBasement ? 'text-purple-700' : 'text-gray-600'
                      }`}>
                        مساحة البدروم {countBasement ? '(محتسبة)' : '(غير محتسبة)'}
                      </div>
                      <div className={`text-xl font-bold ${
                        countBasement ? 'text-purple-900' : 'text-gray-700'
                      }`}>
                        {(parseFloat(basementLength) * parseFloat(basementWidth)).toLocaleString('ar-SA', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} م²
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* البلكونات */}
          <Card className="border-2 border-purple-300 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <CardTitle>البلكونات والشرفات</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="balconyArea" className="text-lg font-bold text-purple-900">
                  إجمالي مساحة البلكونات (م²)
                </Label>
                <Input
                  id="balconyArea"
                  type="number"
                  placeholder="أدخل إجمالي مساحة جميع البلكونات"
                  value={balconyArea}
                  onChange={(e) => setBalconyArea(e.target.value)}
                  className="text-lg border-2 border-purple-300 focus:border-purple-500"
                />
                <p className="text-xs text-purple-600">
                  تُحتسب البلكونات بنسبة 50% من مساحتها الإجمالية
                </p>
              </div>

              {balconyArea && parseFloat(balconyArea) > 0 && (
                <div className="bg-purple-200 rounded p-4">
                  <div className="text-sm text-purple-700 mb-2">التفصيل:</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-800">المساحة الكلية للبلكونات:</span>
                      <span className="font-bold text-purple-900">
                        {parseFloat(balconyArea).toLocaleString('ar-SA', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} م²
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-purple-300 pt-1">
                      <span className="text-purple-800">المحتسب (50%):</span>
                      <span className="font-bold text-purple-900">
                        {balconyContribution.toLocaleString('ar-SA', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} م²
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* النتائج النهائية */}
          {totalArea > 0 && (
            <Card className="border-2 border-purple-300 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-800 text-white">
                <CardTitle>النتائج النهائية</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* التفصيل */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="font-bold text-purple-900 mb-3">تفصيل المساحات:</div>
                  
                  {groundFloorArea > 0 && (
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="text-gray-700">الطابق الأرضي:</span>
                      <span className="font-bold text-purple-900">
                        {groundFloorArea.toLocaleString('ar-SA', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} م²
                      </span>
                    </div>
                  )}
                  
                  {upperFloorsArea > 0 && (
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="text-gray-700">الأدوار العلوية:</span>
                      <span className="font-bold text-purple-900">
                        {upperFloorsArea.toLocaleString('ar-SA', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} م²
                      </span>
                    </div>
                  )}
                  
                  {basementArea > 0 && (
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="text-gray-700">البدروم (محتسب):</span>
                      <span className="font-bold text-purple-900">
                        {basementArea.toLocaleString('ar-SA', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} م²
                      </span>
                    </div>
                  )}
                  
                  {balconyContribution > 0 && (
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="text-gray-700">البلكونات (50%):</span>
                      <span className="font-bold text-purple-900">
                        {balconyContribution.toLocaleString('ar-SA', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} م²
                      </span>
                    </div>
                  )}
                </div>

                {/* المساحة الإجمالية */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="text-sm mb-2 opacity-90">إجمالي مسطح البناء</div>
                  <div className="text-3xl font-bold">
                    {totalArea.toLocaleString('ar-SA', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} م²
                  </div>
                  <div className="text-xs mt-2 opacity-75">
                    وفقاً للأنظمة السعودية المعتمدة
                  </div>
                </div>

                {/* المساحة المتبقية */}
                {landArea && buildingPercentage && (
                  <div className={`rounded-lg p-6 text-white ${
                    remainingArea >= 0 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gradient-to-r from-red-500 to-red-600'
                  }`}>
                    <div className="text-sm mb-2 opacity-90">
                      {remainingArea >= 0 ? 'المساحة المتبقية المسموحة' : 'تجاوز المساحة المسموحة'}
                    </div>
                    <div className="text-3xl font-bold">
                      {Math.abs(remainingArea).toLocaleString('ar-SA', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} م²
                    </div>
                    {remainingArea < 0 && (
                      <div className="text-xs mt-2 opacity-90">
                        ⚠️ المبنى يتجاوز النسبة المسموحة
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
