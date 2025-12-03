import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  ArrowRight, 
  Briefcase, 
  TrendingUp, 
  Users, 
  Star,
  Calendar,
  Clock,
  Target,
  Award,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  AlertCircle,
  Phone,
  MessageSquare,
  FileText,
  DollarSign
} from 'lucide-react';

interface WorkspaceProps {
  onBack: () => void;
}

interface WorkspaceStats {
  totalProperties: number;
  activeLeads: number;
  completedDeals: number;
  monthlyRevenue: number;
  conversionRate: number;
  averageResponseTime: number;
  customerSatisfaction: number;
  teamPerformance: number;
}

interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
  category: 'follow-up' | 'appointment' | 'documentation' | 'marketing';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

export function Workspace({ onBack }: WorkspaceProps) {
  const [currentTab, setCurrentTab] = useState('overview');

  const stats: WorkspaceStats = {
    totalProperties: 45,
    activeLeads: 23,
    completedDeals: 12,
    monthlyRevenue: 145000,
    conversionRate: 34,
    averageResponseTime: 2.5,
    customerSatisfaction: 4.7,
    teamPerformance: 87
  };

  const todayTasks: Task[] = [
    {
      id: '1',
      title: 'متابعة مع أحمد الزهراني - فيلا الملقا',
      priority: 'high',
      dueDate: '2024-01-15 10:00',
      completed: false,
      category: 'follow-up'
    },
    {
      id: '2',
      title: 'موعد معاينة - شقة النزهة',
      priority: 'high',
      dueDate: '2024-01-15 14:00',
      completed: false,
      category: 'appointment'
    },
    {
      id: '3',
      title: 'إنهاء عقد إيجار - محل العليا',
      priority: 'medium',
      dueDate: '2024-01-15 16:00',
      completed: true,
      category: 'documentation'
    },
    {
      id: '4',
      title: 'نشر إعلان - أرض الياسمين',
      priority: 'low',
      dueDate: '2024-01-15 18:00',
      completed: false,
      category: 'marketing'
    }
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'وسيط محترف',
      description: 'أكمل 10 صفقات بنجاح',
      icon: <Award className="w-6 h-6" />,
      unlocked: true,
      progress: 12,
      target: 10
    },
    {
      id: '2',
      title: 'نجم التواصل',
      description: 'احصل على تقييم 4.5+ من العملاء',
      icon: <Star className="w-6 h-6" />,
      unlocked: true,
      progress: 4.7,
      target: 4.5
    },
    {
      id: '3',
      title: 'سرعة البرق',
      description: 'متوسط رد أقل من 3 دقائق',
      icon: <Activity className="w-6 h-6" />,
      unlocked: true,
      progress: 2.5,
      target: 3
    },
    {
      id: '4',
      title: 'رائد الفريق',
      description: 'أضف 5 زملاء للفريق',
      icon: <Users className="w-6 h-6" />,
      unlocked: false,
      progress: 2,
      target: 5
    },
    {
      id: '5',
      title: 'المليونير',
      description: 'حقق مليون ريال من المبيعات',
      icon: <DollarSign className="w-6 h-6" />,
      unlocked: false,
      progress: 650000,
      target: 1000000
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'deal',
      message: 'تم إغلاق صفقة شقة في الملقا بقيمة 850,000 ريال',
      time: '2 ساعات مضت',
      icon: <CheckCircle className="w-4 h-4 text-green-600" />
    },
    {
      id: '2',
      type: 'lead',
      message: 'عميل جديد مهتم بفيلا في الياسمين',
      time: '4 ساعات مضت',
      icon: <Users className="w-4 h-4 text-blue-600" />
    },
    {
      id: '3',
      type: 'appointment',
      message: 'تم تأكيد موعد معاينة غداً الساعة 2 مساءً',
      time: '6 ساعات مضت',
      icon: <Calendar className="w-4 h-4 text-purple-600" />
    },
    {
      id: '4',
      type: 'message',
      message: 'رسالة جديدة من فاطمة العتيبي',
      time: '8 ساعات مضت',
      icon: <MessageSquare className="w-4 h-4 text-orange-600" />
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'follow-up': return <Phone className="w-4 h-4" />;
      case 'appointment': return <Calendar className="w-4 h-4" />;
      case 'documentation': return <FileText className="w-4 h-4" />;
      case 'marketing': return <TrendingUp className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const completedTasksCount = todayTasks.filter(task => task.completed).length;
  const completionPercentage = (completedTasksCount / todayTasks.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7] p-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button 
          onClick={onBack}
          variant="outline" 
          className="border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-[#01411C]"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة
        </Button>
        <h1 className="text-2xl font-bold text-[#01411C]">مساحة العمل</h1>
        <div className="w-20"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          {/* Tabs Navigation */}
          <TabsList className="grid w-full grid-cols-4 bg-white border-2 border-[#D4AF37] rounded-lg">
            <TabsTrigger 
              value="overview" 
              className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4 ml-2" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger 
              value="tasks" 
              className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white"
            >
              <CheckCircle className="w-4 h-4 ml-2" />
              المهام
            </TabsTrigger>
            <TabsTrigger 
              value="achievements" 
              className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white"
            >
              <Award className="w-4 h-4 ml-2" />
              الإنجازات
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="text-[#01411C] data-[state=active]:bg-[#01411C] data-[state=active]:text-white"
            >
              <PieChart className="w-4 h-4 ml-2" />
              التحليلات
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-2 border-[#D4AF37]">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-[#01411C]" />
                    <span className="text-2xl font-bold text-[#01411C]">{stats.totalProperties}</span>
                  </div>
                  <p className="text-sm text-gray-600">عقار نشط</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-600">{stats.activeLeads}</span>
                  </div>
                  <p className="text-sm text-gray-600">عميل محتمل</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">{stats.completedDeals}</span>
                  </div>
                  <p className="text-sm text-gray-600">صفقة مكتملة</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-yellow-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-yellow-600" />
                    <span className="text-lg font-bold text-yellow-600">
                      {stats.monthlyRevenue.toLocaleString()} ريال
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">إيرادات الشهر</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Progress */}
              <Card className="border-2 border-[#D4AF37]">
                <CardHeader>
                  <CardTitle className="text-[#01411C] flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    تقدم اليوم
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">إنجاز المهام</span>
                      <span className="text-sm text-gray-600">
                        {completedTasksCount}/{todayTasks.length}
                      </span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">معدل التحويل</span>
                      <span className="text-sm text-gray-600">{stats.conversionRate}%</span>
                    </div>
                    <Progress value={stats.conversionRate} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">أداء الفريق</span>
                      <span className="text-sm text-gray-600">{stats.teamPerformance}%</span>
                    </div>
                    <Progress value={stats.teamPerformance} className="h-2" />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{stats.averageResponseTime}</div>
                        <div className="text-xs text-gray-600">دقيقة متوسط رد</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600 flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current" />
                          {stats.customerSatisfaction}
                        </div>
                        <div className="text-xs text-gray-600">تقييم العملاء</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-[#01411C] flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    الأنشطة الأخيرة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="mt-1">{activity.icon}</div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <Card className="border-2 border-[#D4AF37] shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  مهام اليوم
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {todayTasks.map((task) => (
                    <Card key={task.id} className={`border transition-all ${task.completed ? 'bg-green-50 border-green-200' : 'border-gray-200 hover:shadow-md'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              task.completed 
                                ? 'bg-green-600 border-green-600' 
                                : 'border-gray-300 hover:border-[#D4AF37]'
                            }`}>
                              {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                            </div>
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(task.category)}
                              <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-[#01411C]'}`}>
                                {task.title}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority === 'high' ? 'عالي' : task.priority === 'medium' ? 'متوسط' : 'منخفض'}
                            </Badge>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.dueDate.split(' ')[1]}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      تم إنجاز {completedTasksCount} من {todayTasks.length} مهام
                    </div>
                    <Button className="bg-[#01411C] hover:bg-[#065f41] text-white">
                      إضافة مهمة جديدة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <Card className="border-2 border-[#D4AF37] shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <Award className="w-6 h-6" />
                  الإنجازات والجوائز
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.map((achievement) => (
                    <Card key={achievement.id} className={`border-2 transition-all ${
                      achievement.unlocked 
                        ? 'border-[#D4AF37] bg-[#f0fdf4] shadow-lg' 
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      <CardContent className="p-6 text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                          achievement.unlocked 
                            ? 'bg-[#D4AF37] text-[#01411C]' 
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {achievement.icon}
                        </div>
                        
                        <h3 className={`font-bold mb-2 ${
                          achievement.unlocked ? 'text-[#01411C]' : 'text-gray-600'
                        }`}>
                          {achievement.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                        
                        {achievement.progress !== undefined && achievement.target && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>التقدم</span>
                              <span>
                                {typeof achievement.progress === 'number' && achievement.progress > 100 
                                  ? achievement.progress.toLocaleString() 
                                  : achievement.progress
                                }
                                {' / '}
                                {typeof achievement.target === 'number' && achievement.target > 100 
                                  ? achievement.target.toLocaleString() 
                                  : achievement.target
                                }
                              </span>
                            </div>
                            <Progress 
                              value={Math.min((achievement.progress / achievement.target) * 100, 100)} 
                              className="h-2" 
                            />
                          </div>
                        )}
                        
                        {achievement.unlocked && (
                          <Badge className="bg-green-100 text-green-800 mt-3">
                            <CheckCircle className="w-3 h-3 ml-1" />
                            مكتمل
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2 border-[#D4AF37]">
                <CardHeader>
                  <CardTitle className="text-[#01411C] flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    أداء هذا الشهر
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                      <span>العقارات المضافة</span>
                      <span className="font-bold text-blue-600">+{stats.totalProperties}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span>الصفقات المكتملة</span>
                      <span className="font-bold text-green-600">+{stats.completedDeals}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                      <span>الإيرادات</span>
                      <span className="font-bold text-yellow-600">+{stats.monthlyRevenue.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                      <span>العملاء الجدد</span>
                      <span className="font-bold text-purple-600">+{stats.activeLeads}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-[#01411C] flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    معدلات الأداء
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">معدل التحويل</span>
                        <span className="text-sm font-bold text-[#01411C]">{stats.conversionRate}%</span>
                      </div>
                      <Progress value={stats.conversionRate} className="h-3" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">رضا العملاء</span>
                        <span className="text-sm font-bold text-[#01411C]">{stats.customerSatisfaction}/5.0</span>
                      </div>
                      <Progress value={(stats.customerSatisfaction / 5) * 100} className="h-3" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">سرعة الاستجابة</span>
                        <span className="text-sm font-bold text-[#01411C]">{stats.averageResponseTime} دقيقة</span>
                      </div>
                      <Progress value={Math.max(0, 100 - (stats.averageResponseTime * 10))} className="h-3" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">أداء الفريق</span>
                        <span className="text-sm font-bold text-[#01411C]">{stats.teamPerformance}%</span>
                      </div>
                      <Progress value={stats.teamPerformance} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}