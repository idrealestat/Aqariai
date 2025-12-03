import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { 
  ArrowRight,
  Search,
  Plus,
  FileText,
  MessageCircle,
  Construction
} from "lucide-react";

interface OffersRequestsPlaceholderProps {
  title: string;
  description: string;
  onBack: () => void;
  icon?: "search" | "plus" | "file" | "message";
}

export function OffersRequestsPlaceholder({ 
  title, 
  description, 
  onBack, 
  icon = "search" 
}: OffersRequestsPlaceholderProps) {
  
  const getIcon = () => {
    switch (icon) {
      case "search": return Search;
      case "plus": return Plus;
      case "file": return FileText;
      case "message": return MessageCircle;
      default: return Search;
    }
  };

  const IconComponent = getIcon();

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-white to-[#fef3c7] py-8 px-4"
      dir="rtl"
    >
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl bg-gradient-to-r from-blue-500 to-blue-600 border-4 border-white">
            <IconComponent className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-blue-700 mb-4">
            {title}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            {description}
          </p>
        </div>

        <Card className="border-2 border-blue-400 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
              <Construction className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              قيد التطوير
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              نعمل حالياً على تطوير هذه الصفحة لتقديم أفضل تجربة ممكنة. 
              سيتم إضافة المزيد من الميزات والخدمات قريباً.
            </p>

            <div className="space-y-4">
              <div className="text-right">
                <h3 className="font-bold text-blue-700 mb-2">الميزات القادمة:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• تصفح متقدم للعروض</li>
                  <li>• إضافة الطلبات بسهولة</li>
                  <li>• التواصل المباشر مع الوسطاء</li>
                  <li>• تتبع حالة الطلبات</li>
                  <li>• نظام تنبيهات ذكي</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <Button
            onClick={onBack}
            size="lg"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            العودة للوحة التحكم
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            شكراً لصبركم معنا بينما نطور هذه الخدمة
          </p>
        </div>
      </div>
    </div>
  );
}