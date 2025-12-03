import React, { useState } from "react";
import { ArrowRight, Archive, Search, Filter, Calendar, FolderOpen, FileText, Trash2, Download, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ArchiveProps {
  onBack: () => void;
  user?: any;
}

export function Archive({ onBack, user }: ArchiveProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock archived data
  const archivedItems = [
    {
      id: 1,
      name: "عقد بيع فيلا الرياض",
      type: "contract",
      category: "العقود",
      date: "2024-01-15",
      size: "2.3 MB",
      description: "عقد بيع فيلا في حي الملقا",
      status: "مكتمل"
    },
    {
      id: 2,
      name: "تقرير مبيعات يناير 2024",
      type: "report",
      category: "التقارير",
      date: "2024-01-31",
      size: "1.8 MB",
      description: "تقرير شامل للمبيعات",
      status: "أرشيف"
    },
    {
      id: 3,
      name: "قائمة عملاء VIP",
      type: "list",
      category: "العملاء",
      date: "2024-01-10",
      size: "0.5 MB",
      description: "قائمة العملاء المميزين",
      status: "مؤرشف"
    },
    {
      id: 4,
      name: "صور عقار شقة النخيل",
      type: "images",
      category: "العقارات",
      date: "2024-01-05",
      size: "15.2 MB",
      description: "مجموعة صور للعقار",
      status: "مؤرشف"
    },
    {
      id: 5,
      name: "مراسلات عميل أحمد محمد",
      type: "messages",
      category: "المراسلات",
      date: "2023-12-28",
      size: "0.8 MB",
      description: "سجل المحادثات والمراسلات",
      status: "مؤرشف"
    }
  ];

  const categories = [
    { id: "all", name: "الكل", count: archivedItems.length },
    { id: "contracts", name: "العقود", count: 1 },
    { id: "reports", name: "التقارير", count: 1 },
    { id: "clients", name: "العملاء", count: 1 },
    { id: "properties", name: "العقارات", count: 1 },
    { id: "messages", name: "المراسلات", count: 1 }
  ];

  const getItemIcon = (type: string) => {
    switch (type) {
      case "contract": return "📄";
      case "report": return "📊";
      case "list": return "👥";
      case "images": return "🖼️";
      case "messages": return "💬";
      default: return "📁";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مكتمل": return "bg-green-100 text-green-800";
      case "أرشيف": return "bg-blue-100 text-blue-800";
      case "مؤرشف": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredItems = archivedItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           item.category.includes(categories.find(c => c.id === selectedCategory)?.name || "");
    return matchesSearch && matchesCategory;
  });

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
              <h1 className="text-2xl font-bold flex items-center justify-center gap-2" style={{ color: "#01411C" }}>
                <Archive className="w-6 h-6 text-[#D4AF37]" />
                الأرشيف
              </h1>
            </div>
            
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#f0fdf4] to-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">📁</div>
                <div className="text-2xl font-bold text-[#01411C]">{archivedItems.length}</div>
                <div className="text-sm text-gray-600">إجمالي العناصر</div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">💾</div>
                <div className="text-2xl font-bold text-[#01411C]">20.6 MB</div>
                <div className="text-sm text-gray-600">حجم البيانات</div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🗓️</div>
                <div className="text-2xl font-bold text-[#01411C]">30</div>
                <div className="text-sm text-gray-600">يوم آخر أرشفة</div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🔒</div>
                <div className="text-2xl font-bold text-[#01411C]">آمن</div>
                <div className="text-sm text-gray-600">حالة الحماية</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="البحث في الأرشيف..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    تصفية
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    التاريخ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="text-xs sm:text-sm"
                >
                  {category.name} ({category.count})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Archived Items */}
          <div className="space-y-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="border border-gray-200 hover:border-[#D4AF37] transition-all duration-200 hover:shadow-md"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards'
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-3xl">{getItemIcon(item.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-[#01411C]">{item.name}</h3>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {item.date}
                            </span>
                            <span>{item.size}</span>
                            <span>{item.category}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="p-2">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-2">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-2 text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="p-12 text-center">
                  <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    لا توجد عناصر مطابقة
                  </h3>
                  <p className="text-gray-500">
                    جرب تغيير معايير البحث أو الفلترة
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Archive Management Actions */}
          <Card className="mt-8 border-2 border-[#D4AF37] bg-gradient-to-br from-[#f0fdf4] to-white">
            <CardHeader>
              <CardTitle className="text-[#01411C] flex items-center gap-2">
                <Archive className="w-5 h-5" />
                إدارة الأرشيف
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4]"
                >
                  تصدير الأرشيف
                </Button>
                <Button 
                  variant="outline" 
                  className="border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4]"
                >
                  نسخ احتياطي
                </Button>
                <Button 
                  variant="outline" 
                  className="border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4]"
                >
                  تنظيف الأرشيف
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}