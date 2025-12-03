import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, Plus, Search, Download, Printer, Eye, Edit, Trash2,
  DollarSign, FileText, Calendar, User, Building2, Hash, X,
  CheckCircle, Clock, AlertCircle, Filter, Phone, Mail
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useDashboardContext } from '../context/DashboardContext';

// ============================================================
// 📊 TYPES
// ============================================================

type DocumentType = 'receipt' | 'quotation';
type DocumentStatus = 'paid' | 'pending' | 'cancelled';

interface FinancialDocument {
  id: string;
  type: DocumentType;
  number: string;
  date: Date;
  clientName: string;
  clientPhone?: string;
  clientCompany?: string;
  amount: number;
  vat: number;
  total: number;
  status: DocumentStatus;
  description: string;
  items: DocumentItem[];
  paymentMethod?: string;
  notes?: string;
  createdBy: string;
}

interface DocumentItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface BrokerInfo {
  id: string;
  name: string;
  companyName?: string;
  licenseNumber?: string;
  phone: string;
  email?: string;
  logoImage?: string;
  signature?: string;
  commercialRegistration?: string;
}

interface FinancialDocumentsProps {
  onBack: () => void;
  prefilledClient?: {
    name: string;
    phone?: string;
    company?: string;
  };
  defaultType?: DocumentType;
  brokerInfo?: BrokerInfo; // 🆕 معلومات الوسيط من بطاقة الأعمال
}

// ============================================================
// 🎨 DOCUMENT TYPE CONFIG
// ============================================================

const DOCUMENT_CONFIG = {
  receipt: {
    label: 'سند قبض',
    icon: DollarSign,
    color: '#10b981',
    bgColor: 'from-green-50 to-green-100',
    borderColor: 'border-green-500',
  },
  quotation: {
    label: 'عرض سعر',
    icon: FileText,
    color: '#3b82f6',
    bgColor: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-500',
  },
};

const STATUS_CONFIG = {
  paid: { label: 'مدفوع', color: 'bg-green-100 text-green-700' },
  pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-700' },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-700' },
};

// ============================================================
// 📄 MAIN COMPONENT
// ============================================================

export default function FinancialDocuments({
  onBack,
  prefilledClient,
  defaultType = 'receipt',
  brokerInfo // 🆕 معلومات الوسيط
}: FinancialDocumentsProps) {
  const { leftSidebarOpen } = useDashboardContext();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType>(defaultType);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<DocumentStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<DocumentType | 'all'>('all');

  // Sample documents
  const [documents, setDocuments] = useState<FinancialDocument[]>([
    {
      id: '1',
      type: 'receipt',
      number: 'RC-2024-001',
      date: new Date(),
      clientName: 'أحمد محمد السعيد',
      clientPhone: '0501234567',
      amount: 100000,
      vat: 15000,
      total: 115000,
      status: 'paid',
      description: 'دفعة أولى لشقة في حي النرجس',
      items: [
        { id: '1', description: 'دفعة أولى', quantity: 1, unitPrice: 100000, total: 100000 }
      ],
      paymentMethod: 'تحويل بنكي',
      createdBy: 'محمد الأحمد'
    }
  ]);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateDocument = () => {
    setShowCreateForm(true);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300" 
      dir="rtl"
      style={{
        marginLeft: leftSidebarOpen ? "350px" : "0"
      }}
    >
      {/* Header - محسّن مع معلومات الوسيط */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#01411C] via-[#065f41] to-[#01411C] backdrop-blur-md border-b-2 border-[#D4AF37] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* زر العودة */}
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-[#D4AF37] hover:bg-white/10"
            >
              <ArrowRight className="w-5 h-5" />
              <span>العودة</span>
            </Button>

            {/* العنوان مع معلومات الوسيط */}
            <div className="flex items-center gap-3">
              {brokerInfo?.logoImage ? (
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37]">
                  <img src={brokerInfo.logoImage} alt="Logo" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-[#D4AF37]">
                  <FileText className="w-6 h-6 text-[#D4AF37]" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-white">المستندات المالية</h1>
                <p className="text-sm text-white/80">
                  {brokerInfo?.companyName || 'نظام CRM العقاري'} • {documents.length} مستند
                </p>
              </div>
            </div>

            {/* زر إنشاء جديد */}
            <Button
              onClick={handleCreateDocument}
              className="bg-[#D4AF37] text-[#01411C] hover:bg-[#b8941f]"
            >
              <Plus className="w-5 h-5 ml-2" />
              مستند جديد
            </Button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b-2 border-[#D4AF37] shadow-md sticky top-[88px] z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="ابحث بالاسم أو رقم المستند..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 border-2 border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as DocumentType | 'all')}
              className="px-4 py-2 border-2 border-[#D4AF37] rounded-lg"
            >
              <option value="all">كل الأنواع</option>
              <option value="receipt">سندات القبض</option>
              <option value="quotation">عروض الأسعار</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as DocumentStatus | 'all')}
              className="px-4 py-2 border-2 border-[#D4AF37] rounded-lg"
            >
              <option value="all">كل الحالات</option>
              <option value="paid">مدفوع</option>
              <option value="pending">قيد الانتظار</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {documents.length === 0 ? 'لا توجد مستندات' : 'لا توجد نتائج'}
            </h3>
            <p className="text-gray-500 mb-4">
              {documents.length === 0
                ? 'ابدأ بإنشاء مستند مالي جديد'
                : 'جرب البحث بكلمات مختلفة'}
            </p>
            {documents.length === 0 && (
              <Button
                onClick={handleCreateDocument}
                className="bg-[#01411C] text-white hover:bg-[#065f41]"
              >
                <Plus className="w-5 h-5 ml-2" />
                إنشاء مستند جديد
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </div>

      {/* Create Form Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <DocumentFormModal
            type={selectedType}
            onClose={() => setShowCreateForm(false)}
            onSave={(doc) => {
              setDocuments([...documents, doc]);
              setShowCreateForm(false);
            }}
            prefilledClient={prefilledClient}
            brokerInfo={brokerInfo}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// 🃏 DOCUMENT CARD COMPONENT
// ============================================================

function DocumentCard({ document }: { document: FinancialDocument }) {
  const config = DOCUMENT_CONFIG[document.type];
  const statusConfig = STATUS_CONFIG[document.status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className={`border-2 ${config.borderColor} hover:shadow-lg transition-all`}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.bgColor} flex items-center justify-center`}>
                <Icon className="w-5 h-5" style={{ color: config.color }} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{config.label}</h3>
                <p className="text-xs text-gray-500">{document.number}</p>
              </div>
            </div>
            <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
          </div>

          {/* Client Info */}
          <div className="mb-3 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm mb-1">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-bold">{document.clientName}</span>
            </div>
            {document.clientPhone && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>{document.clientPhone}</span>
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold" style={{ color: config.color }}>
                {document.total.toLocaleString('ar-SA')}
              </span>
              <span className="text-sm text-gray-600">ريال</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{document.description}</p>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <Calendar className="w-3 h-3" />
            <span>{document.date.toLocaleDateString('ar-SA')}</span>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Eye className="w-3 h-3 ml-1" />
              عرض
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Printer className="w-3 h-3 ml-1" />
              طباعة
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Download className="w-3 h-3 ml-1" />
              تحميل
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================
// 📝 DOCUMENT FORM MODAL
// ============================================================

function DocumentFormModal({
  type,
  onClose,
  onSave,
  prefilledClient,
  brokerInfo
}: {
  type: DocumentType;
  onClose: () => void;
  onSave: (doc: FinancialDocument) => void;
  prefilledClient?: { name: string; phone?: string; company?: string };
  brokerInfo?: BrokerInfo;
}) {
  const config = DOCUMENT_CONFIG[type];
  const Icon = config.icon;

  const [formData, setFormData] = useState({
    clientName: prefilledClient?.name || '',
    clientPhone: prefilledClient?.phone || '',
    clientCompany: prefilledClient?.company || '',
    description: '',
    amount: '',
    vat: '15',
    paymentMethod: 'نقداً',
    notes: ''
  });

  const [items, setItems] = useState<DocumentItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const vat = subtotal * (parseFloat(formData.vat) / 100);
    return subtotal + vat;
  };

  const handleAddItem = () => {
    setItems([...items, { 
      id: Date.now().toString(), 
      description: '', 
      quantity: 1, 
      unitPrice: 0, 
      total: 0 
    }]);
  };

  const handleUpdateItem = (id: string, field: keyof DocumentItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSubmit = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const vat = subtotal * (parseFloat(formData.vat) / 100);
    
    const newDoc: FinancialDocument = {
      id: Date.now().toString(),
      type,
      number: `${type === 'receipt' ? 'RC' : 'QT'}-2024-${String(Date.now()).slice(-3)}`,
      date: new Date(),
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      clientCompany: formData.clientCompany,
      amount: subtotal,
      vat,
      total: subtotal + vat,
      status: type === 'receipt' ? 'paid' : 'pending',
      description: formData.description,
      items,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      createdBy: 'محمد الأحمد'
    };

    onSave(newDoc);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${config.bgColor} border-b-2 ${config.borderColor} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <Icon className="w-6 h-6" style={{ color: config.color }} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">إنشاء {config.label}</h2>
                <p className="text-sm text-gray-600">املأ البيانات المطلوبة</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} size="sm">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* 🆕 معلومات الوسيط من بطاقة الأعمال */}
            {brokerInfo && (
              <div className="bg-gradient-to-r from-[#fffef7] to-[#f0fdf4] rounded-lg p-6 border-2 border-[#D4AF37]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {brokerInfo.logoImage && (
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37]">
                        <img src={brokerInfo.logoImage} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-[#01411C]">
                        {brokerInfo.companyName || brokerInfo.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                        {brokerInfo.licenseNumber && (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            <span>فال: {brokerInfo.licenseNumber}</span>
                          </div>
                        )}
                        {brokerInfo.commercialRegistration && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            <span>س.ت: {brokerInfo.commercialRegistration}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span dir="ltr">{brokerInfo.phone}</span>
                        </div>
                        {brokerInfo.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{brokerInfo.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {brokerInfo.signature && (
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">التوقيع</p>
                      <img 
                        src={brokerInfo.signature} 
                        alt="Signature" 
                        className="h-16 w-auto"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Client Info */}
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                معلومات العميل
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    اسم العميل *
                  </label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="أدخل اسم العميل"
                    className="border-2 border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    رقم الجوال
                  </label>
                  <Input
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    placeholder="05xxxxxxxx"
                    className="border-2 border-gray-300"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الشركة/المؤسسة
                  </label>
                  <Input
                    value={formData.clientCompany}
                    onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                    placeholder="اسم الشركة (اختياري)"
                    className="border-2 border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  البنود
                </h3>
                <Button onClick={handleAddItem} size="sm" className="bg-[#01411C] text-white">
                  <Plus className="w-4 h-4 ml-1" />
                  إضافة بند
                </Button>
              </div>
              
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="bg-white rounded-lg p-3 border border-gray-300">
                    <div className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-12 md:col-span-5">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          الوصف
                        </label>
                        <Input
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                          placeholder="وصف البند"
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          الكمية
                        </label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          السعر
                        </label>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-3 md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          المجموع
                        </label>
                        <Input
                          value={item.total.toLocaleString('ar-SA')}
                          disabled
                          className="text-sm bg-gray-100"
                        />
                      </div>
                      <div className="col-span-1">
                        {items.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                تفاصيل الدفع
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    نسبة الضريبة (%)
                  </label>
                  <Input
                    type="number"
                    value={formData.vat}
                    onChange={(e) => setFormData({ ...formData, vat: e.target.value })}
                    className="border-2 border-gray-300"
                  />
                </div>
                {type === 'receipt' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      طريقة الدفع
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                    >
                      <option>نقداً</option>
                      <option>تحويل بنكي</option>
                      <option>شيك</option>
                      <option>بطاقة ائتمان</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                ملاحظات إضافية
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="أضف أي ملاحظات..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg min-h-[80px]"
              />
            </div>

            {/* Total Summary */}
            <div className={`bg-gradient-to-r ${config.bgColor} rounded-lg p-4 border-2 ${config.borderColor}`}>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold">
                    {items.reduce((sum, item) => sum + item.total, 0).toLocaleString('ar-SA')} ريال
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>ضريبة القيمة المضافة ({formData.vat}%):</span>
                  <span className="font-bold">
                    {(items.reduce((sum, item) => sum + item.total, 0) * (parseFloat(formData.vat) / 100)).toLocaleString('ar-SA')} ريال
                  </span>
                </div>
                <div className="flex justify-between text-lg border-t-2 border-gray-300 pt-2">
                  <span className="font-bold">المجموع الإجمالي:</span>
                  <span className="font-bold" style={{ color: config.color }}>
                    {calculateTotal().toLocaleString('ar-SA')} ريال
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-200 p-4 bg-gray-50 flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.clientName || items.some(i => !i.description)}
            className="bg-[#01411C] text-white hover:bg-[#065f41]"
          >
            <CheckCircle className="w-5 h-5 ml-2" />
            حفظ {config.label}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
