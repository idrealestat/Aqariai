import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { 
  DollarSign, 
  Percent, 
  Users, 
  Star, 
  Award, 
  Gift, 
  Target, 
  TrendingUp,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Tag
} from 'lucide-react';

interface CustomerGroup {
  id: string;
  name: string;
  description: string;
  discountPercentage: number;
  color: string;
  memberCount: number;
}

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  targetGroup?: string;
}

interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  propertyId: string;
}

interface PricingManagementB2BProps {
  onBack: () => void;
}

export default function PricingManagementB2B({ onBack }: PricingManagementB2BProps) {
  const [activeTab, setActiveTab] = useState('customer-groups');
  const [customerGroups, setCustomerGroups] = useState<CustomerGroup[]>([
    {
      id: '1',
      name: 'المستثمرون الرئيسيون',
      description: 'عملاء VIP مع استثمارات كبيرة',
      discountPercentage: 15,
      color: 'gold',
      memberCount: 12
    },
    {
      id: '2',
      name: 'الشركات التجارية',
      description: 'شركات تبحث عن مكاتب ومحلات',
      discountPercentage: 10,
      color: 'blue',
      memberCount: 28
    },
    {
      id: '3',
      name: 'العملاء المتكررون',
      description: 'عملاء سابقون مع صفقات ناجحة',
      discountPercentage: 8,
      color: 'green',
      memberCount: 45
    },
    {
      id: '4',
      name: 'العملاء الجدد',
      description: 'عملاء جدد للتشجيع على الشراء',
      discountPercentage: 5,
      color: 'purple',
      memberCount: 67
    }
  ]);

  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: '1',
      code: 'RAMADAN2024',
      description: 'خصم رمضان الخاص',
      discountType: 'percentage',
      discountValue: 20,
      expiryDate: '2024-04-30',
      usageLimit: 100,
      usedCount: 45,
      isActive: true,
      targetGroup: 'المستثمرون الرئيسيون'
    },
    {
      id: '2',
      code: 'NEWCLIENT50',
      description: 'ترحيب بالعملاء الجدد',
      discountType: 'fixed',
      discountValue: 50000,
      expiryDate: '2024-12-31',
      usageLimit: 200,
      usedCount: 23,
      isActive: true,
      targetGroup: 'العملاء الجدد'
    },
    {
      id: '3',
      code: 'LOYALTY2024',
      description: 'مكافأة الولاء للعملاء المتكررين',
      discountType: 'percentage',
      discountValue: 12,
      expiryDate: '2024-06-30',
      usageLimit: 50,
      usedCount: 12,
      isActive: false,
      targetGroup: 'العملاء المتكررون'
    }
  ]);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      clientName: 'أحمد المحمد',
      rating: 5,
      comment: 'خدمة ممتازة وتعامل راقي. أنصح بالتعامل مع هذا المكتب العقاري.',
      date: '2024-01-15',
      status: 'pending',
      propertyId: 'prop-123'
    },
    {
      id: '2',
      clientName: 'فاطمة العلي',
      rating: 4,
      comment: 'تجربة جيدة جداً، العقار كان كما هو موصوف تماماً.',
      date: '2024-01-14',
      status: 'approved',
      propertyId: 'prop-124'
    },
    {
      id: '3',
      clientName: 'محمد السعد',
      rating: 2,
      comment: 'التعامل كان بطيء نوعاً ما ولكن النتيجة النهائية مرضية.',
      date: '2024-01-13',
      status: 'pending',
      propertyId: 'prop-125'
    }
  ]);

  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    discountPercentage: 0,
    color: 'blue'
  });

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    expiryDate: '',
    usageLimit: 100,
    targetGroup: ''
  });

  const handleAddGroup = () => {
    if (newGroup.name && newGroup.description) {
      const group: CustomerGroup = {
        id: Date.now().toString(),
        ...newGroup,
        memberCount: 0
      };
      setCustomerGroups([...customerGroups, group]);
      setNewGroup({ name: '', description: '', discountPercentage: 0, color: 'blue' });
    }
  };

  const handleAddCoupon = () => {
    if (newCoupon.code && newCoupon.description) {
      const coupon: Coupon = {
        id: Date.now().toString(),
        ...newCoupon,
        usedCount: 0,
        isActive: true
      };
      setCoupons([...coupons, coupon]);
      setNewCoupon({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        expiryDate: '',
        usageLimit: 100,
        targetGroup: ''
      });
    }
  };

  const handleReviewAction = (reviewId: string, action: 'approve' | 'reject') => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, status: action === 'approve' ? 'approved' : 'rejected' }
        : review
    ));
  };

  const getGroupColorClass = (color: string) => {
    const colors = {
      gold: 'from-yellow-50 to-yellow-100 border-yellow-200',
      blue: 'from-blue-50 to-blue-100 border-blue-200',
      green: 'from-green-50 to-green-100 border-green-200',
      purple: 'from-purple-50 to-purple-100 border-purple-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-[#ffffff]" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b-2 border-[#D4AF37] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="border-[#D4AF37] text-[#01411C]"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                عودة
              </Button>
              <div>
                <h1 className="text-xl font-bold text-[#01411C]">إدارة التسعير والعروض B2B</h1>
                <p className="text-sm text-gray-600">تحديد أسعار مختلفة لشرائح العملاء وإدارة القسائم</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#D4AF37] text-[#01411C]">نظام B2B</Badge>
              <DollarSign className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border-2 border-[#D4AF37]">
            <TabsTrigger value="customer-groups" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
              مجموعات العملاء
            </TabsTrigger>
            <TabsTrigger value="coupons" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
              إدارة القسائم
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
              مراجعة التقييمات
            </TabsTrigger>
          </TabsList>

          {/* Customer Groups Tab */}
          <TabsContent value="customer-groups" className="space-y-6 mt-6">
            {/* Add New Group */}
            <Card className="border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  إضافة مجموعة عملاء جديدة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="group-name">اسم المجموعة</Label>
                    <Input
                      id="group-name"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                      placeholder="مثل: العملاء المميزون"
                    />
                  </div>
                  <div>
                    <Label htmlFor="group-desc">الوصف</Label>
                    <Input
                      id="group-desc"
                      value={newGroup.description}
                      onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                      placeholder="وصف المجموعة"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount">نسبة الخصم (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={newGroup.discountPercentage}
                      onChange={(e) => setNewGroup({...newGroup, discountPercentage: Number(e.target.value)})}
                      min="0"
                      max="50"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleAddGroup}
                      className="w-full bg-gradient-to-r from-[#01411C] to-[#065f41] text-white"
                    >
                      إضافة المجموعة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Existing Groups */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customerGroups.map((group) => (
                <Card key={group.id} className={`bg-gradient-to-br ${getGroupColorClass(group.color)} border-2`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#01411C]" />
                        <h3 className="font-bold text-[#01411C]">{group.name}</h3>
                      </div>
                      <Badge className="bg-white text-[#01411C]">
                        {group.discountPercentage}% خصم
                      </Badge>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{group.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-[#01411C]" />
                        <span className="text-sm text-[#01411C]">{group.memberCount} عضو</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Coupons Tab */}
          <TabsContent value="coupons" className="space-y-6 mt-6">
            {/* Add New Coupon */}
            <Card className="border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  إنشاء قسيمة جديدة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="coupon-code">كود القسيمة</Label>
                    <Input
                      id="coupon-code"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                      placeholder="مثل: SUMMER2024"
                    />
                  </div>
                  <div>
                    <Label htmlFor="coupon-desc">الوصف</Label>
                    <Input
                      id="coupon-desc"
                      value={newCoupon.description}
                      onChange={(e) => setNewCoupon({...newCoupon, description: e.target.value})}
                      placeholder="وصف القسيمة"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiry-date">تاريخ الانتهاء</Label>
                    <Input
                      id="expiry-date"
                      type="date"
                      value={newCoupon.expiryDate}
                      onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="discount-value">قيمة الخصم</Label>
                    <Input
                      id="discount-value"
                      type="number"
                      value={newCoupon.discountValue}
                      onChange={(e) => setNewCoupon({...newCoupon, discountValue: Number(e.target.value)})}
                      placeholder={newCoupon.discountType === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="usage-limit">حد الاستخدام</Label>
                    <Input
                      id="usage-limit"
                      type="number"
                      value={newCoupon.usageLimit}
                      onChange={(e) => setNewCoupon({...newCoupon, usageLimit: Number(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleAddCoupon}
                      className="w-full bg-gradient-to-r from-[#01411C] to-[#065f41] text-white"
                    >
                      إنشاء القسيمة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Existing Coupons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((coupon) => (
                <Card key={coupon.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#D4AF37]" />
                        <span className="font-bold text-[#01411C]">{coupon.code}</span>
                      </div>
                      <Switch checked={coupon.isActive} />
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{coupon.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>الخصم:</span>
                        <span className="font-bold text-[#D4AF37]">
                          {coupon.discountType === 'percentage' 
                            ? `${coupon.discountValue}%` 
                            : `${coupon.discountValue.toLocaleString()} ريال`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>المستخدم:</span>
                        <span>{coupon.usedCount}/{coupon.usageLimit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ينتهي في:</span>
                        <span>{new Date(coupon.expiryDate).toLocaleDateString('ar-SA')}</span>
                      </div>
                      {coupon.targetGroup && (
                        <div className="flex justify-between">
                          <span>المجموعة المستهدفة:</span>
                          <span className="text-xs">{coupon.targetGroup}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Edit className="w-3 h-3 mr-1" />
                        تعديل
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Trash2 className="w-3 h-3 mr-1" />
                        حذف
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6 mt-6">
            <Card className="border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  مراجعة وموافقة التقييمات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="font-bold text-[#01411C]">{review.clientName}</h4>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 mr-2">({review.rating}/5)</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            review.status === 'approved' ? 'bg-green-100 text-green-700' :
                            review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }>
                            {review.status === 'approved' && 'موافق عليه'}
                            {review.status === 'rejected' && 'مرفوض'}
                            {review.status === 'pending' && 'في الانتظار'}
                          </Badge>
                          <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      <p className="text-xs text-gray-500 mb-3">العقار: {review.propertyId}</p>
                      
                      {review.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleReviewAction(review.id, 'approve')}
                            className="bg-green-600 text-white hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            موافقة
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReviewAction(review.id, 'reject')}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            رفض
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}