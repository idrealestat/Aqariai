import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Filter, Building, MapPin, Search, TrendingUp, Home, Briefcase, Star } from "lucide-react";
import { MarketplaceOffer, MarketplaceFilters, TransactionType, PropertyCategory } from "../../types/marketplace";
import { BrokerResponseForm } from "./BrokerResponseForm";

interface MarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPlan: string;
}

export function MarketplaceModal({ isOpen, onClose, userPlan }: MarketplaceModalProps) {
  const [activeTab, setActiveTab] = useState<'offers' | 'requests'>('offers');
  const [offers, setOffers] = useState<MarketplaceOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<MarketplaceOffer[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<MarketplaceOffer | null>(null);
  
  const [filters, setFilters] = useState<MarketplaceFilters>({});

  const cities = ['الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الخبر', 'الطائف', 'تبوك', 'أبها'];
  const propertyTypes = ['شقة', 'فيلا', 'دبلكس', 'دور', 'أرض', 'عمارة', 'محل', 'مكتب', 'مستودع'];

  useEffect(() => {
    if (isOpen) {
      loadOffers();
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    applyFilters();
  }, [filters, offers]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-[#01411C] to-[#065f41] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#01411C]" />
              </div>
              <div>
                <h2 className="text-2xl text-white">العروض والطلبات</h2>
                <p className="text-sm text-white/80">تواصل مع الملاك والباحثين عن عقارات</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('offers')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'offers'
                  ? 'bg-white text-[#01411C]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Building className="w-5 h-5" />
                <span>العروض ({filteredOffers.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'requests'
                  ? 'bg-white text-[#01411C]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                <span>الطلبات ({filteredOffers.length})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b bg-gray-50">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-[#01411C] hover:text-[#065f41] mb-3"
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">فلاتر البحث</span>
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-[#D4AF37] hover:shadow-lg transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
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

                  {/* Details */}
                  <div className="space-y-2 mb-4">
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
                  <div className="flex items-center justify-between pt-4 border-t">
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
              ))}
            </div>
          )}
        </div>
      </motion.div>

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
    </div>
  );
}
