import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Layers } from 'lucide-react';

export function EnhancedKanbanView() {
  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-dashed border-[#D4AF37]" dir="rtl">
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#fffef7] to-[#f0fdf4]">
          <CardTitle className="flex items-center gap-2 text-[#01411C]">
            <Layers className="w-5 h-5 text-[#D4AF37]" />
            📊 عرض كانبان المحسن
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Layers className="w-16 h-16 mx-auto mb-4 text-[#01411C]" />
            <h3 className="text-xl font-bold text-[#01411C] mb-2">عرض كانبان</h3>
            <p className="text-gray-600">
              عرض المكونات في شكل لوحة كانبان منظمة
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EnhancedKanbanView;
