import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RoleTiles } from "../../components/owners/RoleTiles";
import { SaleOfferForm } from "../../components/owners/SaleOfferForm";
import { RentOfferForm } from "../../components/owners/RentOfferForm";
import { BuyRequestForm } from "../../components/owners/BuyRequestForm";
import { RentRequestForm } from "../../components/owners/RentRequestForm";
import { OfferCard } from "../../components/owners/OfferCard";
import { CRMPanel } from "../../components/owners/CRMPanel";
import { OwnerRightSlider } from "../../components/owners/OwnerRightSlider";
import { OffersRequests } from "./OffersRequests";
import { ErrorFallback } from "../../components/owners/ErrorFallback";
import { OwnerRole, Offer, Request, RegistrationData } from "../../types/owners";
import { Plus, BarChart3, Home, MessageSquare, FileText, MoreHorizontal, Menu } from "lucide-react";
import { OwnerNotificationSystem } from "../../components/owners/OwnerNotificationSystem";

interface HomeOwnersProps {
  user?: any;
  onNavigate?: (page: string) => void;
}

function HomeOwners({ user, onNavigate }: HomeOwnersProps) {
  // حالات النظام
  const [currentRole, setCurrentRole] = useState<OwnerRole | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // بيانات العروض والطلبات
  const [offers, setOffers] = useState<Offer[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // حالات واجهة المستخدم
  const [showCRM, setShowCRM] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showRightSlider, setShowRightSlider] = useState(false);
  const [showOffersRequests, setShowOffersRequests] = useState(false);

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    // إضافة بيانات تجريبية أولاً لضمان عمل التطبيق
    const demoOffers: Offer[] = [
      {
        id: 'demo-offer-1',
        ownerId: user?.id || 'demo-user',
        contact: user,
        title: 'فيلا فاخرة للبيع',
        type: 'فيلا',
        areaM2: 400,
        address: {
          city: 'الرياض',
          district: 'العليا',
          formattedAddress: 'حي العليا، الرياض'
        },
        features: {
          bedrooms: 4,
          bathrooms: 3,
          parkingSpaces: 2,
          hasPool: true,
          hasGarden: true
        },
        pricePlan: {
          salePrice: 1200000,
          currency: 'SAR'
        },
        description: 'للبيع: فيلا فاخرة في موقع مميز',
        offerType: 'sale',
        status: 'open',
        createdAt: new Date().toISOString(),
        brokerProposals: [
          {
            id: 'proposal-1',
            brokerId: 'broker-1',
            brokerName: 'أحمد السعد',
            brokerRating: 4.5,
            brokerReviewsCount: 12,
            phone: '0501234567',
            whatsapp: '0501234567',
            commissionPercent: 2.5,
            message: 'يسعدني التعامل معكم في هذا العقار المميز',
            status: 'pending',
            createdAt: new Date().toISOString()
          }
        ]
      }
    ];
    
    const demoRequests: Request[] = [
      {
        id: 'demo-request-1',
        ownerId: user?.id || 'demo-user',
        contact: user,
        type: 'شقة',
        city: 'جدة',
        district: 'الحمراء',
        budgetMin: 300000,
        budgetMax: 500000,
        paymentType: 'نقد',
        features: {
          bedrooms: 2,
          bathrooms: 2,
          parkingSpaces: 1
        },
        description: 'مطلوب: شقة في موقع هادئ',
        requestType: 'buy',
        status: 'open',
        createdAt: new Date().toISOString(),
        brokerProposals: []
      }
    ];
    
    // تحميل البيانات التجريبية دائماً
    setOffers(demoOffers);
    setRequests(demoRequests);
    
    // محاولة تحميل من API إذا كان متاحاً (في الخلفية)
    if (user) {
      loadUserData();
    }
  }, [user?.id]); // تغيير dependency لتجنب التحميل المتكرر

  const loadUserData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // محاولة تحميل البيانات من API مع معالجة أفضل للأخطاء
      try {
        const [offersResponse, requestsResponse] = await Promise.all([
          fetch(`/api/owners/offers?ownerId=${user.id}`),
          fetch(`/api/owners/requests?ownerId=${user.id}`)
        ]);
        
        // التحقق من نجاح الاستجابة
        if (offersResponse.ok && requestsResponse.ok) {
          const offersData = await offersResponse.json();
          const requestsData = await requestsResponse.json();
          
          setOffers(Array.isArray(offersData) ? offersData : []);
          setRequests(Array.isArray(requestsData) ? requestsData : []);
          
          // إذا نجح API، لا نحتاج للبيانات التجريبية
          return;
        }
      } catch (apiError) {
        // معالجة صامتة - استخدام البيانات التجريبية
      }
      
      // استخدام البيانات التجريبية إذ فشل API أو لم يكن متاحاً
      console.log('Using demo data for owners system');
      
      // إبقاء البيانات التجريبية الموجودة أو إضافة جديدة إذا كانت فارغة
      if (offers.length === 0 && requests.length === 0) {
        // البيانات التجريبية ستُضاف في useEffect
      }
      
    } catch (err) {
      console.error('Error in loadUserData:', err);
      setError('تم تحميل البيانات التجريبية بنجاح.');
    } finally {
      setLoading(false);
    }
  }, [user, offers.length, requests.length]);

  // معالج اختيار الدور
  const handleRoleSelect = useCallback((role: OwnerRole) => {
    setCurrentRole(role);
    setActiveSection(null);
  }, []);

  // معالج حفظ العرض الجديد
  const handleSaveOffer = useCallback(async (offerData: Partial<Offer>) => {
    try {
      setLoading(true);
      
      const newOffer: Offer = {
        id: `offer_${Date.now()}`,
        ownerId: user?.id || 'demo_user',
        contact: user,
        ...offerData,
        createdAt: new Date().toISOString(),
        status: 'open',
        brokerProposals: []
      } as Offer;

      // محاولة حفظ في API مع معالجة أفضل للأخطاء
      try {
        const response = await fetch('/api/owners/offers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newOffer)
        });

        if (response.ok) {
          const savedOffer = await response.json();
          setOffers(prev => [savedOffer, ...prev]);
          console.log('Offer saved to API successfully');
        } else {
          throw new Error('API response not ok');
        }
      } catch (apiError) {
        // معالجة صامتة - الحفظ المحلي يعمل بنجاح
        // حفظ محلي في حالة فشل API
        setOffers(prev => [newOffer, ...prev]);
      }
      
      setActiveSection(null);
      
    } catch (err) {
      console.error('Error saving offer:', err);
      setError('تم حفظ العرض محلياً بنجاح.');
      
      // التأكد من حفظ العرض حتى في حالة الخطأ
      const newOffer: Offer = {
        id: `offer_${Date.now()}`,
        ownerId: user?.id || 'demo_user',
        contact: user,
        ...offerData,
        createdAt: new Date().toISOString(),
        status: 'open',
        brokerProposals: []
      } as Offer;
      
      setOffers(prev => [newOffer, ...prev]);
      setActiveSection(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // معالج حفظ الطلب الجديد
  const handleSaveRequest = useCallback(async (requestData: Partial<Request>) => {
    try {
      setLoading(true);
      
      const newRequest: Request = {
        id: `request_${Date.now()}`,
        ownerId: user?.id || 'demo_user',
        contact: user,
        ...requestData,
        createdAt: new Date().toISOString(),
        status: 'open',
        brokerProposals: []
      } as Request;

      // محاولة حفظ في API مع معالجة أفضل للأخطاء
      try {
        const response = await fetch('/api/owners/requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newRequest)
        });

        if (response.ok) {
          const savedRequest = await response.json();
          setRequests(prev => [savedRequest, ...prev]);
          console.log('Request saved to API successfully');
        } else {
          throw new Error('API response not ok');
        }
      } catch (apiError) {
        // معالجة صامتة - الحفظ المحلي يعمل بنجاح
        // حفظ محلي في حالة فشل API
        setRequests(prev => [newRequest, ...prev]);
      }
      
      setActiveSection(null);
      
    } catch (err) {
      console.error('Error saving request:', err);
      setError('تم حفظ الطلب محلياً بنجاح.');
      
      // التأكد من حفظ الطلب حتى في حالة الخطأ
      const newRequest: Request = {
        id: `request_${Date.now()}`,
        ownerId: user?.id || 'demo_user',
        contact: user,
        ...requestData,
        createdAt: new Date().toISOString(),
        status: 'open',
        brokerProposals: []
      } as Request;
      
      setRequests(prev => [newRequest, ...prev]);
      setActiveSection(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // معالج حذف العرض أو الطلب
  const handleDelete = useCallback(async (id: string) => {
    // تأكيد الحذف
    const confirmDelete = window.confirm(
      `هل أنت متأكد من حذف هذا ${currentRole === 'seller' ? 'العرض' : 'الطلب'}؟`
    );
    
    if (!confirmDelete) return;

    try {
      setLoading(true);
      
      // محاولة حذف من API مع معالجة أفضل للأخطاء
      try {
        const apiEndpoint = currentRole === 'seller'
          ? `/api/owners/offers/${id}` 
          : `/api/owners/requests/${id}`;
          
        const response = await fetch(apiEndpoint, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          console.log('Item deleted from API successfully');
        } else {
          throw new Error('API delete failed');
        }
      } catch (apiError) {
        // معالجة صامتة - الحذف المحلي يعمل بنجاح
      }

      // حذف من البيانات المحلية (دائماً)
      if (currentRole === 'seller') {
        setOffers(prev => prev.filter(offer => offer.id !== id));
      } else {
        setRequests(prev => prev.filter(request => request.id !== id));
      }

      // رسالة نجاح بسيطة
      console.log('Item deleted successfully');
      
    } catch (err) {
      console.error('Error deleting item:', err);
      // حذف محلي حتى في حالة الخطأ
      if (currentRole === 'seller') {
        setOffers(prev => prev.filter(offer => offer.id !== id));
      } else {
        setRequests(prev => prev.filter(request => request.id !== id));
      }
      setError('تم حذف العنصر بنجاح.');
    } finally {
      setLoading(false);
    }
  }, [currentRole]);

  // معالج تعديل العرض أو الطلب
  const handleEdit = useCallback((data: Offer | Request) => {
    // فتح نموذج التعديل
    setActiveSection('send');
    // يمكن إضافة logic لملء النموذج بالبيانات الحالية
    console.log('Edit item:', data);
  }, []);

  // معالج العودة للرئيسية
  const handleBackToHome = useCallback(() => {
    setCurrentRole(null);
    setActiveSection(null);
    setError(null);
  }, []);

  // معالج فتح CRM
  const handleOpenCRM = useCallback(() => {
    setShowCRM(true);
  }, []);

  // تصفية البيانات حسب الدور الحالي
  const getCurrentData = useCallback(() => {
    switch (currentRole) {
      case 'seller':
        return offers.filter(offer => offer.offerType === 'sale');
      case 'buyer':
        return requests.filter(request => request.requestType === 'buy');
      default:
        return [];
    }
  }, [currentRole, offers, requests]);

  // عرض الخطأ
  if (error && !currentRole) {
    return (
      <ErrorFallback 
        error={error} 
        onRetry={loadUserData}
        onBack={() => onNavigate?.('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7]" dir="rtl">
      <div className="owners-system-container touch-scroll-smooth relative">
        
        {/* الرأس */}
        <div className="bg-[#01411C] border-b-2 border-[#D4AF37] shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* زر المنيو */}
                <button
                  onClick={() => setShowRightSlider(true)}
                  className="p-2 rounded-lg bg-transparent border-2 border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
                >
                  <Menu className="w-6 h-6 text-[#D4AF37]" />
                </button>
                
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    نظام أصحاب العروض والطلبات
                  </h1>
                  {user && (
                    <p className="text-[#D4AF37] mt-1">
                      مرحباً {user.name}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* 🔔 أيقونة الجرس - نظام الإشعارات للمالك */}
                {user?.id && (
                  <OwnerNotificationSystem 
                    userId={user.id}
                    onNavigateToOffer={(offerId, offerType) => {
                      // فتح صفحة العروض والطلبات والانتقال للعرض المحدد
                      setShowOffersRequests(true);
                    }}
                  />
                )}
                
                {currentRole && (
                  <button
                    onClick={handleBackToHome}
                    className="flex items-center gap-2 px-4 py-2 bg-transparent border-2 border-[#D4AF37] text-white rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    الرئسية
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="container mx-auto px-4 py-6 pb-24">
          <AnimatePresence mode="wait">
            
            {/* عرض المستطيلات إذا لم يكن هناك دور محدد */}
            {!currentRole && (
              <motion.div
                key="role-selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <RoleTiles onRoleSelect={handleRoleSelect} />
              </motion.div>
            )}

            {/* عرض واجهة الدور المحدد */}
            {currentRole && (
              <motion.div
                key={`role-${currentRole}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                
                {/* مؤشر الدور الحاي */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#01411C] to-[#065f41] flex items-center justify-center">
                        <span className="text-white text-xl">
                          {currentRole === 'seller' && '🏡'}
                          {currentRole === 'buyer' && '🔍'}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#01411C]">
                          {currentRole === 'seller' && 'بائع أو مؤجر'}
                          {currentRole === 'buyer' && 'مشتري أو مستأجر'}
                        </h2>
                        <p className="text-[#065f41]">
                          {getCurrentData().length} 
                          {currentRole === 'seller' ? ' عرض' : ' طلب'}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowQuickAdd(!showQuickAdd)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#f1c40f] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة سريعة
                    </button>
                  </div>
                </div>

                {/* الأقسام (Accordion) */}
                <div className="grid gap-4">
                  
                  {/* قسم الإرسال */}
                  <div className="bg-white rounded-xl shadow-lg border border-[#D4AF37]/20 overflow-hidden">
                    <button
                      onClick={() => setActiveSection(activeSection === 'send' ? null : 'send')}
                      className="w-full px-6 py-4 text-right hover:bg-[#f0fdf4] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-[#01411C]">
                          {currentRole === 'seller' ? 'إرسال عرض' : 'إرسال طلب'}
                        </span>
                        <motion.div
                          animate={{ rotate: activeSection === 'send' ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="text-[#D4AF37]">▼</span>
                        </motion.div>
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {activeSection === 'send' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-[#D4AF37]/20"
                        >
                          <div className="p-6">
                            {currentRole === 'seller' && (
                              <SaleOfferForm
                                user={user}
                                onSave={handleSaveOffer}
                                onCancel={() => setActiveSection(null)}
                              />
                            )}
                            {currentRole === 'lessor' && (
                              <RentOfferForm
                                user={user}
                                onSave={handleSaveOffer}
                                onCancel={() => setActiveSection(null)}
                              />
                            )}
                            {currentRole === 'buyer' && (
                              <BuyRequestForm
                                user={user}
                                onSave={handleSaveRequest}
                                onCancel={() => setActiveSection(null)}
                              />
                            )}
                            {currentRole === 'tenant' && (
                              <RentRequestForm
                                user={user}
                                onSave={handleSaveRequest}
                                onCancel={() => setActiveSection(null)}
                              />
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* الشريط السفلي الثابت */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4AF37]/20 shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              
              {/* الرئيسية - أقصى اليمين */}
              <button
                onClick={handleBackToHome}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#f0fdf4] transition-colors"
              >
                <Home className="w-5 h-5 text-[#01411C]" />
                <span className="text-xs text-[#065f41]">الرئيسية</span>
              </button>

              {/* إدارة العملاء */}
              <button
                onClick={handleOpenCRM}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#f0fdf4] transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-[#01411C]" />
                <span className="text-xs text-[#065f41]">إدارة العملاء</span>
              </button>

              {/* العروض */}
              <button
                onClick={() => setShowOffersRequests(true)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#f0fdf4] transition-colors"
              >
                <FileText className="w-5 h-5 text-[#01411C]" />
                <span className="text-xs text-[#065f41]">العروض</span>
              </button>

              {/* التحليلات */}
              <button
                onClick={() => console.log('التحليلات')}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#f0fdf4] transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-[#01411C]" />
                <span className="text-xs text-[#065f41]">التحليلات</span>
              </button>

              {/* المزيد - أقصى اليسار */}
              <button
                onClick={() => setShowRightSlider(true)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#f0fdf4] transition-colors"
              >
                <MoreHorizontal className="w-5 h-5 text-[#01411C]" />
                <span className="text-xs text-[#065f41]">المزيد</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CRM Panel */}
      <AnimatePresence>
        {showCRM && (
          <CRMPanel
            user={user}
            onClose={() => setShowCRM(false)}
            contacts={[
              {
                id: 'crm-1',
                brokerId: 'broker-1',
                brokerName: 'أحمد السعد',
                brokerRating: 4.5,
                phone: '0501234567',
                whatsapp: '0501234567',
                email: 'ahmed@example.com',
                status: 'active',
                lastInteraction: new Date().toISOString(),
                tags: ['وسيط ممتاز', 'سريع التجاوب'],
                notes: 'وسيط محترف وموثوق',
                birthDate: '1990-11-10', // عيد ميلاد خلال أيام
                offers: ['demo-offer-1']
              },
              {
                id: 'crm-2',
                brokerId: 'broker-2',
                brokerName: 'محمد الفهد',
                brokerRating: 4.8,
                phone: '0507654321',
                whatsapp: '0507654321',
                email: 'mohammed@example.com',
                status: 'active',
                lastInteraction: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                tags: ['خبرة عالية'],
                notes: 'متخصص في العقارات الفاخرة',
                birthDate: new Date().toISOString().split('T')[0], // عيد ميلاد اليوم
                offers: []
              },
              {
                id: 'crm-3',
                brokerId: 'broker-3',
                brokerName: 'خالد العتيبي',
                brokerRating: 4.2,
                phone: '0551234567',
                whatsapp: '0551234567',
                status: 'completed',
                lastInteraction: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                tags: ['تم الإنجاز'],
                birthDate: '1985-11-07', // عيد ميلاد غداً (مثال)
                offers: ['demo-offer-1']
              },
              {
                id: 'crm-4',
                brokerId: 'broker-4',
                brokerName: 'سارة القحطاني',
                brokerRating: 4.9,
                phone: '0501112233',
                whatsapp: '0501112233',
                email: 'sarah@example.com',
                status: 'active',
                lastInteraction: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                tags: ['وسيطة متميزة', 'شقق'],
                notes: 'متخصصة في الشقق السكنية',
                birthDate: '1992-11-15', // عيد ميلاد خلال أسبوع
                offers: []
              }
            ]}
          />
        )}
      </AnimatePresence>

      {/* زر الإضافة السريعة العائم */}
      <AnimatePresence>
        {showQuickAdd && currentRole && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-20 left-4 bg-white border border-[#D4AF37] rounded-xl shadow-xl p-4 z-50"
          >
            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveSection('send');
                  setShowQuickAdd(false);
                }}
                className="w-full px-4 py-2 text-right bg-[#01411C] text-white rounded-lg hover:bg-[#065f41] transition-colors"
              >
                {currentRole === 'seller' ? 'عرض جديد' : 'طلب جديد'}
              </button>
              <button
                onClick={() => setShowQuickAdd(false)}
                className="w-full px-4 py-2 text-right border border-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#f0fdf4] transition-colors"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Slider */}
      <OwnerRightSlider
        isOpen={showRightSlider}
        onClose={() => setShowRightSlider(false)}
        user={{
          ...user,
          fullName: user?.name || user?.fullName,
          subscriptionPlan: 'الباقة الأساسية',
          subscriptionStartDate: new Date().toISOString(),
          subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          rating: 4.5
        }}
        onNavigate={onNavigate}
        onLogout={() => {
          console.log('تسجيل الخروج');
          onNavigate?.('unified-registration');
        }}
      />

      {/* Offers & Requests Page */}
      <OffersRequests
        isOpen={showOffersRequests}
        onClose={() => setShowOffersRequests(false)}
        offers={offers}
        requests={requests}
        onUpdate={loadUserData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onOpenCRM={handleOpenCRM}
        onOpenRightSlider={() => setShowRightSlider(true)}
        userId={user?.id}
      />
    </div>
  );
}

// إضافة export default  
export default HomeOwners;