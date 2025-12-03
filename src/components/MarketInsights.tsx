// components/MarketInsights.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useMarketInsights } from "../hooks/useMarketInsights";
import { normalizeArabic } from "../helpers/normalizeArabic";
import { SAUDI_CITIES, PROPERTY_TYPES, DEAL_TYPES } from "../types/market";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const citiesList = SAUDI_CITIES.slice(0, 5); // أول 5 مدن
const sampleDistrictsByCity: Record<string, string[]> = {
  "الخبر": ["الحمراء", "السلام", "العليا"],
  "الرياض": ["الملز", "النسيم", "العليا"],
  "جدة": ["الحمراء", "السلامة", "العزيزية"],
};

interface MarketInsightsProps {
  onBack: () => void;
  user?: any;
}

export function MarketInsights({ onBack, user }: MarketInsightsProps) {
  const [city, setCity] = useState<string>(citiesList[0]);
  const [customCity, setCustomCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [customDistrict, setCustomDistrict] = useState<string>("");
  const [districtSuggestions, setDistrictSuggestions] = useState<string[]>([]);
  const [propertyType, setPropertyType] = useState(PROPERTY_TYPES[0]);
  const [dealType, setDealType] = useState(DEAL_TYPES[0]);

  const finalCity = customCity.trim() !== "" ? customCity.trim() : city;
  const finalDistrict = customDistrict.trim() !== "" ? customDistrict.trim() : district;

  useEffect(() => {
    setDistrictSuggestions(sampleDistrictsByCity[city] || []);
  }, [city]);

  const filteredSuggestions = useMemo(() => {
    const query = normalizeArabic(customDistrict || district || "");
    if (!query) return districtSuggestions;
    return districtSuggestions.filter((d) => {
      const dn = normalizeArabic(d);
      return dn.includes(query);
    });
  }, [customDistrict, district, districtSuggestions]);

  const { loading, error, data } = useMarketInsights(finalCity, finalDistrict, propertyType, dealType);

  return (
    <div className="p-6 bg-white min-h-screen" dir="rtl">
      {/* الهيدر */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-[#01411C] hover:text-[#D4AF37] transition-colors"
        >
          ← العودة
        </button>
        <h1 className="text-2xl font-bold text-[#01411C]">🏘️ تحليلات السوق العقاري</h1>
        <div></div>
      </div>

      {/* إدخال المعطيات */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
        <h2 className="text-lg font-bold text-[#01411C] mb-4 flex items-center gap-2">
          🔍 معايير البحث
        </h2>
        
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
            <input 
              className="border border-gray-300 p-2 rounded-lg w-full mb-2" 
              value={customCity} 
              onChange={(e) => setCustomCity(e.target.value)} 
              placeholder="أدخل أو اختر" 
            />
            <select 
              className="border border-gray-300 p-2 rounded-lg w-full" 
              value={city} 
              onChange={(e) => setCity(e.target.value)}
            >
              {citiesList.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الحي</label>
            <input 
              className="border border-gray-300 p-2 rounded-lg w-full mb-2" 
              value={customDistrict} 
              onChange={(e) => setCustomDistrict(e.target.value)} 
              placeholder="اكتب أو اختر" 
            />
            {filteredSuggestions.length > 0 && (
              <div className="border bg-white rounded mt-1 max-h-32 overflow-y-auto">
                {filteredSuggestions.map((s) => (
                  <button 
                    key={s} 
                    className="block w-full text-right p-2 hover:bg-gray-100 text-sm" 
                    onClick={() => setDistrict(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع العقار</label>
            <select 
              className="border border-gray-300 p-2 rounded-lg w-full" 
              value={propertyType} 
              onChange={(e) => setPropertyType(e.target.value)}
            >
              {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الهدف</label>
            <select 
              className="border border-gray-300 p-2 rounded-lg w-full" 
              value={dealType} 
              onChange={(e) => setDealType(e.target.value)}
            >
              {DEAL_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        
        {/* مؤشر الاختيار الحالي */}
        <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className="text-green-700 font-medium">🎯 البحث الحالي:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
              {finalCity}
            </span>
            <span className="text-green-400">•</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
              {finalDistrict}
            </span>
            <span className="text-green-400">•</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
              {propertyType}
            </span>
            <span className="text-green-400">•</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
              {dealType}
            </span>
          </div>
        </div>
      </div>

      {/* النتائج */}
      {loading && <p className="text-gray-500">⏳ تحميل...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {data && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <StatCard title="متوسط السعر" value={`${data.avgPrice.toLocaleString()} ريال`} />
            <StatCard title="الطلب" value={`${data.demand}%`} />
          </div>

          {/* نطاقات الأسعار المحسنة */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg border border-blue-200">
            <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              📌 نطاقات الأسعار
            </h2>
            <div className="space-y-3">
              {data.priceRanges.map((r, i) => (
                <div key={i} className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#01411C]">{r.label}</span>
                    <span className="text-lg font-bold text-blue-700">
                      {r.min.toLocaleString()} - {r.max.toLocaleString()} ريال
                    </span>
                  </div>
                  {/* شريط النطاق السعري */}
                  <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full"
                      style={{ width: `${Math.max(20, Math.min(100, (r.max - r.min) / 10000))}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-blue-600 bg-blue-100 p-3 rounded-lg">
              💡 هذه النطاقات تعتمد على نوع العقار والمساحة المتوقعة في المنطقة المحددة
            </div>
          </div>

          {/* الرسم البياني المحسن */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-[#01411C] mb-4 flex items-center gap-2">
              📈 اتجاه السوق (آخر 12 شهر)
            </h2>
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data.trend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#666"
                    fontSize={12}
                    tick={{ fill: '#666' }}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    tick={{ fill: '#666' }}
                    tickFormatter={(value) => {
                      if (dealType === "إيجار") {
                        return `${value.toLocaleString()}`;
                      }
                      return value >= 1000000 
                        ? `${(value / 1000000).toFixed(1)}م`
                        : `${(value / 1000).toFixed(0)}ك`;
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      direction: 'rtl'
                    }}
                    formatter={(value: any) => [
                      `${value.toLocaleString()} ريال`, 
                      dealType === "إيجار" ? "الإيجار الشهري" : "سعر البيع"
                    ]}
                    labelStyle={{ color: '#01411C', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#01411C"
                    strokeWidth={3}
                    dot={{ fill: '#D4AF37', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: '#D4AF37' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ملاحظة تطوير مستقبلي */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 mt-8">
        <h3 className="text-lg font-semibold text-purple-800 mb-2 flex items-center gap-2">
          🚀 ميزات قادمة
        </h3>
        <p className="text-purple-600 mb-3">
          هذه الوحدة جاهزة للربط مع مصادر البيانات الحقيقية:
        </p>
        <ul className="text-sm text-purple-600 space-y-1 list-disc list-inside">
          <li>ربط مع وزارة العدل والمؤشرات العقارية الرسمية</li>
          <li>تكامل مع منصات التسويق العقاري السعودية (عقار، دوبيزل، مؤشر)</li>
          <li>إضافة تقارير PDF قابلة للتصدير والمشاركة</li>
          <li>تحليلات متقدمة مع الذكاء الاصطناعي لتنبؤات السوق</li>
          <li>مقارنات تفصيلية بين الأحياء والمدن</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center border border-gray-200 hover:shadow-lg transition-shadow">
      <h2 className="text-sm text-gray-500 mb-1">{title}</h2>
      <p className="text-lg font-semibold text-[#01411C]">{value}</p>
    </div>
  );
}