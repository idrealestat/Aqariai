import React from "react";
import { Badge } from "./ui/badge";

interface TextAnalysisPanelProps {
  description: string;
  extractCityFromText: (text: string) => string | null;
  extractPropertyType: (text: string) => string[];
  extractPropertyStatus: (text: string) => string[];
}

export function TextAnalysisPanel({ 
  description, 
  extractCityFromText, 
  extractPropertyType, 
  extractPropertyStatus 
}: TextAnalysisPanelProps) {
  if (description.length <= 10) return null;

  return (
    <div className="bg-[#f0fdf4] p-4 rounded-lg border border-[#D4AF37] space-y-3 mt-4">
      <h4 className="text-sm font-medium text-[#01411C] mb-2">🤖 تحليل النص الذكي:</h4>
      
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-600">🏙️ المدينة:</span>
        <Badge 
          variant="outline" 
          className={`text-xs ${
            extractCityFromText(description) 
              ? 'border-green-500 text-green-700 bg-green-50' 
              : 'border-red-500 text-red-700 bg-red-50'
          }`}
        >
          {extractCityFromText(description) || "غير محددة"}
        </Badge>
      </div>
      
      {extractPropertyType(description).length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-600">🏠 النوع:</span>
          <div className="flex gap-1">
            {extractPropertyType(description).map((type, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {extractPropertyStatus(description).length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-600">💰 الحالة:</span>
          <div className="flex gap-1">
            {extractPropertyStatus(description).map((status, index) => (
              <Badge key={index} variant="outline" className="text-xs border-blue-500 text-blue-700 bg-blue-50">
                {status}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        ✨ الهاشتاقات يتم توليدها بناءً على هذا التحليل
      </p>
    </div>
  );
}