import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import UnifiedMainHeader from "../layout/UnifiedMainHeader";
import RightSliderComplete from "../RightSliderComplete-fixed";
import LeftSliderComplete from "../LeftSliderComplete";
import { MiniUserCard } from "../layout/DynamicHeader";
import { NotificationsPanel } from "../NotificationsPanel";
import { 
  ArrowLeft, Filter, Building, MapPin, Search, TrendingUp, Home, Briefcase, Star,
  Bell, Menu, PanelLeft, Users, X, ChevronDown, MoreVertical, Phone, MessageSquare,
  Calendar, FileText
} from "lucide-react";
import { MarketplaceOffer, MarketplaceFilters, TransactionType, PropertyCategory } from "../../types/marketplace";
import { BrokerResponseForm } from "./BrokerResponseForm";

interface MarketplacePageProps {
  userPlan: string;
  onBack: () => void;
}

export function MarketplacePage({ userPlan, onBack }: MarketplacePageProps) {
  const [activeTab, setActiveTab] = useState<'offers' | 'requests'>('offers');
  const [offers, setOffers] = useState<MarketplaceOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<MarketplaceOffer[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<MarketplaceOffer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const cities = ['الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الخبر', 'الطائف', 'تبوك', 'أبها'];
  const propertyTypes = ['شقة', 'فيلا', 'دبلكس', 'دور', 'أرض', 'عمارة', 'محل', 'مكتب', 'مستودع'];

  // Get current user
  const user = (() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aqary-crm-user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  })();

  useEffect(() => {
    loadOffers();
  }, [activeTab]);

  useEffect(() => {
    applyFilters();
  }, [filters, offers, searchQuery]);

  const loadOffers = () => {
    const stored = localStorage.getItem('marketplace-offers');
    if (stored) {
      const allOffers: MarketplaceOffer[] = JSON.parse(stored);
      const filtered = allOffers.filter(offer => 
        offer.type === (activeTab === 'offers' ? 'offer' : 'request') &&
        offer.status === 'active'
      );
      setOffers(filtered);
    }
  };

  const applyFilters = () => {
    let result = [...offers];

    if (searchQuery) {
      result = result.filter(o => 
        o.propertyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.city) {
      result = result.filter(o => o.city === filters.city);
    }
    if (filters.district) {
      result = result.filter(o => o.district === filters.district);
    }
    if (filters.propertyType) {
      result = result.filter(o => o.propertyType === filters.propertyType);
    }
    if (filters.transactionType) {
      result = result.filter(o => o.transactionType === filters.transactionType);
    }
    if (filters.propertyCategory) {
      result = result.filter(o => o.propertyCategory === filters.propertyCategory);
    }

    setFilteredOffers(result);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(price);
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      seller: 'بائع',
      lessor: 'مؤجر',
      buyer: 'مشتري',
      tenant: 'مستأجر'
    };
    return labels[role] || role;
  };

  const totalOffers = filteredOffers.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - نفس تصميم إدارة العملاء */}
      <header className="bg-gradient-to-l from-[#01411C] to-[#065f41] border-b-4 border-[#D4AF37] shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          {/* الصف الأول - 3 أقسام */}
          <div className="flex items-center justify-between mb-3">
            {/* Right: Back Button + Right Menu Icon */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={onBack}
                className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all bg-white/10 text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setRightMenuOpen(true)}
                className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all bg-white/10 text-white"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            {/* Center: Logo */}
            <div className="flex-1 text-center">
              <div className="inline-flex items-center gap-3 bg-white/10 text-white px-6 py-2 rounded-full shadow-lg border-2 border-[#D4AF37] backdrop-blur-sm">
                <TrendingUp className="w-6 h-6" />
                <span className="font-bold text-lg">العروض والطلبات</span>
              </div>
            </div>

            {/* Left: Left Sidebar Icon + Bell */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLeftSidebarOpen(true)}
                className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all bg-white/10 text-white"
              >
                <PanelLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setNotificationsOpen(true)}
                className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all relative bg-white/10 text-white"
              >
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* الصف الثاني - البطاقة المصغرة مع السبيكة */}
          {user && (
            <div className="flex items-center justify-center">
              <MiniUserCard 
                currentUser={user} 
                onClick={() => setRightMenuOpen(true)}
              />
            </div>
          )}
        </div>
      </header>

      {/* شريط الأدوات العلوي - فوق المحتوى */}
      <div className="bg-white border-b-2 border-[#D4AF37] shadow-md sticky top-[72px] z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2 w-full pb-2">
            {/* عداد العروض/الطلبات */}
            <div className="px-4 py-2 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-lg flex items-center gap-2 shrink-0">
              <TrendingUp className="w-4 h-4" />
              <span className="font-bold">{totalOffers}</span>
              <span className="text-xs">{activeTab === 'offers' ? 'عرض' : 'طلب'}</span>
            </div>

            {/* أزرار التبويب */}
            <Button
              variant={activeTab === 'offers' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('offers')}
              className={`shrink-0 ${activeTab === 'offers' ? 'bg-[#01411C] hover:bg-[#065f41]' : ''}`}
            >
              <Building className="w-4 h-4 ml-1" />
              العروض
            </Button>
            <Button
              variant={activeTab === 'requests' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('requests')}
              className={`shrink-0 ${activeTab === 'requests' ? 'bg-[#01411C] hover:bg-[#065f41]' : ''}`}
            >
              <Search className="w-4 h-4 ml-1" />
              الطلبات
            </Button>

            {/* زر الفلاتر */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="border-[#D4AF37] text-[#01411C] shrink-0"
            >
              <Filter className="w-4 h-4 ml-1" />
              فلاتر
            </Button>
          </div>

          {/* شريط البحث الذهبي */}
          <div className="flex gap-2 mt-3">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="ابحث عن عقار بالنوع، المدينة، أو الحي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 border-2 border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg border-2 border-[#D4AF37]">
                  <select
                    value={filters.city || ''}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value || undefined })}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#01411C] focus:border-transparent"
                  >
                    <option value="">جميع المدن</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>

                  <select
                    value={filters.propertyType || ''}
                    onChange={(e) => setFilters({ ...filters, propertyType: e.target.value || undefined })}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#01411C] focus:border-transparent"
                  >
                    <option value="">جميع الأنواع</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  <select
                    value={filters.transactionType || ''}
                    onChange={(e) => setFilters({ ...filters, transactionType: e.target.value as TransactionType || undefined })}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#01411C] focus:border-transparent"
                  >
                    <option value="">بيع / إيجار</option>
                    <option value="sale">للبيع</option>
                    <option value="rent">للإيجار</option>
                  </select>

                  <select
                    value={filters.propertyCategory || ''}
                    onChange={(e) => setFilters({ ...filters, propertyCategory: e.target.value as PropertyCategory || undefined })}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#01411C] focus:border-transparent"
                  >
                    <option value="">سكني / تجاري</option>
                    <option value="residential">سكني</option>
                    <option value="commercial">تجاري</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* منطقة المحتوى */}
      <div className="container mx-auto px-4 py-6 pb-24">
        {filteredOffers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
              {activeTab === 'offers' ? (
                <Building className="w-10 h-10 text-gray-400" />
              ) : (
                <Search className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <h3 className="text-xl text-gray-900 mb-2">لا توجد {activeTab === 'offers' ? 'عروض' : 'طلبات'} حالياً</h3>
            <p className="text-gray-600">تحقق لاحقاً أو جرب تغيير الفلاتر</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOffers.map((offer) => {
              const isExpanded = expandedOfferId === offer.id;
              
              return (
                <div
                  key={offer.id}
                  className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-[#D4AF37] hover:shadow-lg transition-all"
                >
                  {/* Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          offer.propertyCategory === 'residential' ? 'bg-blue-100' : 'bg-purple-100'
                        }`}>
                          {offer.propertyCategory === 'residential' ? (
                            <Home className="w-6 h-6 text-blue-600" />
                          ) : (
                            <Briefcase className="w-6 h-6 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{offer.propertyType}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{offer.city}</span>
                            {offer.district && <span>• {offer.district}</span>}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedOfferId(isExpanded ? null : offer.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          offer.transactionType === 'sale'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {offer.transactionType === 'sale' ? 'للبيع' : 'للإيجار'}
                        </span>
                        <span className="text-xs text-gray-500">{getRoleLabel(offer.userRole)}</span>
                      </div>
                    </div>

                    {/* Details Preview */}
                    <div className="space-y-2">
                      {offer.area && (
                        <p className="text-sm text-gray-600">المساحة: {offer.area} م²</p>
                      )}
                      {(offer.priceFrom || offer.priceTo) && (
                        <p className="text-sm text-gray-900 font-medium">
                          السعر: {offer.priceFrom && formatPrice(offer.priceFrom)}
                          {offer.priceFrom && offer.priceTo && ' - '}
                          {offer.priceTo && formatPrice(offer.priceTo)}
                        </p>
                      )}
                      {offer.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{offer.description}</p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t mt-4">
                      <div className="text-xs text-gray-500">
                        {offer.responsesCount} رد من الوسطاء
                      </div>
                      <button
                        onClick={() => setSelectedOffer(offer)}
                        className="px-4 py-2 bg-[#01411C] text-white rounded-lg hover:bg-[#065f41] text-sm font-medium transition-all"
                      >
                        قدم عرضك
                      </button>
                    </div>
                  </div>

                  {/* التفاصيل الموسعة */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-3 border-t border-gray-200 space-y-3">
                      {/* الوصف الكامل */}
                      {offer.description && (
                        <div className="text-sm">
                          <div className="font-bold text-gray-700 mb-1 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            الوصف الكامل
                          </div>
                          <p className="text-gray-600 bg-yellow-50 p-2 rounded">{offer.description}</p>
                        </div>
                      )}

                      {/* الميزات */}
                      {offer.features && offer.features.length > 0 && (
                        <div className="text-sm">
                          <div className="font-bold text-gray-700 mb-1">الميزات:</div>
                          <div className="flex flex-wrap gap-1">
                            {offer.features.map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* تاريخ النشر */}
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>تم النشر: {new Date(offer.createdAt).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Broker Response Modal */}
      {selectedOffer && (
        <BrokerResponseForm
          offer={selectedOffer}
          onClose={() => {
            setSelectedOffer(null);
            loadOffers();
          }}
          userPlan={userPlan}
        />
      )}

      {/* Right Menu - RightSliderComplete */}
      <RightSliderComplete
        isOpen={rightMenuOpen}
        onClose={() => setRightMenuOpen(false)}
        currentUser={user}
        onNavigate={(page) => {
          setRightMenuOpen(false);
          if (page === 'dashboard') {
            onBack();
          }
        }}
      />

      {/* Left Sidebar - LeftSliderComplete */}
      <LeftSliderComplete
        isOpen={leftSidebarOpen}
        onClose={() => setLeftSidebarOpen(false)}
        onNavigate={(page) => {
          setLeftSidebarOpen(false);
          if (page === 'dashboard') {
            onBack();
          }
        }}
        onOpenSettings={() => {}}
      />

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
}
