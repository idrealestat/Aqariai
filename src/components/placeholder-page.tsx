import { ArrowRight, Construction, Zap, Clock, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface PlaceholderPageProps {
  title: string;
  onBack: () => void;
  description?: string;
  icon?: string;
  features?: string[];
  comingSoon?: boolean;
}

export function PlaceholderPage({ 
  title, 
  onBack, 
  description,
  icon = "🚧",
  features = [],
  comingSoon = true
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7]" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b-2 border-[#D4AF37] shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 text-[#01411C] hover:text-[#D4AF37] hover:bg-[#f0fdf4]"
            >
              <ArrowRight className="w-5 h-5" />
              <span>العودة للرئيسية</span>
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold" style={{ color: "#01411C" }}>
                {title}
              </h1>
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-[#D4AF37] bg-white shadow-xl overflow-hidden">
            <CardContent className="p-8 text-center">
              {/* Icon */}
              <div className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center" 
                   style={{ 
                     background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)",
                     border: "3px solid #D4AF37"
                   }}>
                <span className="text-6xl">{icon}</span>
              </div>
              
              {/* Title & Status */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2" style={{ color: "#01411C" }}>
                  {title}
                </h2>
                
                {comingSoon && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                       style={{ backgroundColor: "#fff8e6", color: "#01411C", border: "1px solid #D4AF37" }}>
                    <Clock className="w-4 h-4" />
                    <span>قريباً جداً</span>
                  </div>
                )}
              </div>
              
              {/* Description */}
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                {description || `نعمل بجد على تطوير ${title} لتوفير أفضل تجربة ممكنة. هذه الميزة ستكون متاحة قريباً مع العديد من الإمكانيات المتقدمة.`}
              </p>
              
              {/* Features Preview */}
              {features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4" style={{ color: "#01411C" }}>
                    الميزات القادمة:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg" 
                           style={{ backgroundColor: "#f0fdf4" }}>
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={onBack}
                  className="px-8 py-3 font-medium"
                  style={{ backgroundColor: "#01411C", borderColor: "#D4AF37" }}
                >
                  العودة للرئيسية
                </Button>
                
                <Button
                  variant="outline"
                  className="px-8 py-3 font-medium border-2 border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4]"
                  onClick={() => {
                    // يمكن إضافة منطق لإرسال طلب ميزة أو اشتراك في التحديثات
                    console.log('Request feature:', title);
                  }}
                >
                  <Zap className="w-4 h-4 ml-2" />
                  طلب أولوية
                </Button>
              </div>
              
              {/* Footer Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Construction className="w-4 h-4" />
                  <span>نحن نعمل على هذه الميزة حالياً</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  سيتم إشعارك فور اكتمال التطوير
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}