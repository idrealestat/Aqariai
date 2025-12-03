import { useState, useEffect } from "react";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { ResponsiveContainer, ResponsiveCard, TouchFriendlyButton } from "./ui/responsive-utils";

interface SuccessMessageProps {
  message: string;
  onContinue: () => void;
  autoRedirect?: boolean;
  redirectDelay?: number;
}

export function SuccessMessage({ 
  message, 
  onContinue, 
  autoRedirect = true, 
  redirectDelay = 3000 
}: SuccessMessageProps) {
  const [countdown, setCountdown] = useState(Math.floor(redirectDelay / 1000));

  useEffect(() => {
    if (!autoRedirect) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRedirect, onContinue]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" dir="rtl" style={{
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 25%, #fffef7 100%)',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Cg fill-opacity=\'0.03\'%3E%3Cpath fill=\'%23D4AF37\' d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")'
    }}>
      <ResponsiveContainer maxWidth="md">
        <ResponsiveCard className="text-center shadow-2xl bg-white/95 backdrop-blur-sm">
          <div className="py-12 px-6">
            {/* Success Icon */}
            <div className="mb-8">
              <div className="relative mx-auto w-24 h-24">
                {/* Animated background */}
                <div className="absolute inset-0 rounded-full bg-green-100 animate-pulse"></div>
                <div 
                  className="absolute inset-2 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#01411C' }}
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                {/* Sparkles effect */}
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#D4AF37] animate-bounce" />
                <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-[#D4AF37] animate-bounce delay-300" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl md:text-3xl font-bold text-[#01411C] mb-4">
              تم التسجيل بنجاح! 🎉
            </h1>
            
            <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
              {message}
            </p>

            {/* Countdown or Continue Button */}
            {autoRedirect ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full border-4 border-[#D4AF37] border-t-transparent animate-spin"></div>
                  <span className="text-gray-600">
                    الانتقال خلال {countdown} ثواني...
                  </span>
                </div>
                
                <TouchFriendlyButton
                  variant="primary"
                  onClick={onContinue}
                  fullWidth
                  className="text-lg"
                >
                  المتابعة الآن
                  <ArrowRight className="w-5 h-5 mr-2" />
                </TouchFriendlyButton>
              </div>
            ) : (
              <TouchFriendlyButton
                variant="primary"
                onClick={onContinue}
                fullWidth
                className="text-lg"
              >
                المتابعة
                <ArrowRight className="w-5 h-5 mr-2" />
              </TouchFriendlyButton>
            )}

            {/* Additional Info */}
            <div className="mt-8 p-4 rounded-lg bg-[#f0fdf4] border border-[#D4AF37]">
              <p className="text-sm text-gray-600">
                ✨ أهلاً بك في منصة العقارات الذكية - ابدأ رحلتك نحو النجاح في العقارات
              </p>
            </div>
          </div>
        </ResponsiveCard>
      </ResponsiveContainer>
    </div>
  );
}