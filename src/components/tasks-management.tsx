import { useState } from 'react';
import { Plus, Calendar, Clock, User, AlertCircle, CheckCircle2, Circle, Trash2, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';

interface TasksManagementProps {
  onNavigate: (page: string) => void;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'in-progress' | 'completed' | 'overdue';
  clientName?: string;
  dueDate: Date;
  reminderTime?: '5min' | '15min' | '1hour' | 'custom';
  customReminderMinutes?: number;
  createdAt: Date;
}

export function TasksManagement({ onNavigate }: TasksManagementProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'متابعة عميل مهتم بشقة في الرياض',
      description: 'الاتصال بالعميل محمد أحمد لمتابعة اهتمامه بالشقة في حي النرجس',
      priority: 'high',
      status: 'new',
      clientName: 'محمد أحمد',
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
      reminderTime: '15min',
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'إعداد عقد إيجار',
      description: 'تحضير عقد الإيجار للشقة في حي الملقا',
      priority: 'medium',
      status: 'in-progress',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      reminderTime: '1hour',
      createdAt: new Date()
    }
  ]);

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    clientName: '',
    dueDate: '',
    reminderTime: '15min' as Task['reminderTime']
  });

  const priorityConfig = {
    high: {
      label: 'عالي',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: <AlertCircle className="w-4 h-4" />
    },
    medium: {
      label: 'متوسط',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: <Clock className="w-4 h-4" />
    },
    low: {
      label: 'منخفض',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: <Circle className="w-4 h-4" />
    }
  };

  const statusConfig = {
    new: {
      label: 'جديد',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    'in-progress': {
      label: 'قيد التنفيذ',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    completed: {
      label: 'مكتمل',
      color: 'bg-gray-100 text-gray-800 border-gray-200'
    },
    overdue: {
      label: 'متأخر',
      color: 'bg-red-100 text-red-800 border-red-200'
    }
  };

  const reminderOptions = [
    { value: '5min', label: '5 دقائق' },
    { value: '15min', label: '15 دقيقة' },
    { value: '1hour', label: 'ساعة' },
    { value: 'custom', label: 'تخصيص' }
  ];

  const handleAddTask = () => {
    if (!newTask.title.trim() || !newTask.dueDate) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      priority: newTask.priority,
      status: 'new',
      clientName: newTask.clientName.trim() || undefined,
      dueDate: new Date(newTask.dueDate),
      reminderTime: newTask.reminderTime,
      createdAt: new Date()
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      clientName: '',
      dueDate: '',
      reminderTime: '15min'
    });
    setIsAddTaskOpen(false);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: task.status === 'completed' ? 'new' : 'completed'
        };
      }
      return task;
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (task: Task) => {
    return task.status !== 'completed' && new Date() > task.dueDate;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7] p-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={() => onNavigate("dashboard")}
          variant="outline" 
          className="border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-[#01411C]"
        >
          العودة
        </Button>
        <h1 className="text-2xl font-bold text-[#01411C]">المهام والتذكيرات</h1>
        
        {/* زر إضافة مهمة جديدة */}
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#01411C] hover:bg-[#065f41] text-white">
              <Plus className="w-4 h-4 ml-2" />
              مهمة جديدة
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-[#01411C] text-xl">إضافة مهمة جديدة</DialogTitle>
              <DialogDescription className="text-gray-600">
                أنشئ مهمة جديدة مع تحديد الأولوية والتذكير
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* عنوان المهمة */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[#01411C] font-medium">
                  عنوان المهمة *
                </Label>
                <Input
                  id="title"
                  placeholder="اكتب عنوان المهمة"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="border-[#D4AF37] focus:ring-[#D4AF37]"
                />
              </div>

              {/* وصف المهمة */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#01411C] font-medium">
                  وصف المهمة
                </Label>
                <Textarea
                  id="description"
                  placeholder="اكتب وصف تفصيلي للمهمة"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  className="border-[#D4AF37] focus:ring-[#D4AF37] min-h-[80px]"
                />
              </div>

              {/* اسم العميل */}
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-[#01411C] font-medium">
                  اسم العميل (اختياري)
                </Label>
                <Input
                  id="clientName"
                  placeholder="اسم العميل المرتبط بالمهمة"
                  value={newTask.clientName}
                  onChange={(e) => setNewTask(prev => ({ ...prev, clientName: e.target.value }))}
                  className="border-[#D4AF37] focus:ring-[#D4AF37]"
                />
              </div>

              {/* الأولوية */}
              <div className="space-y-2">
                <Label className="text-[#01411C] font-medium">درجة الأولوية</Label>
                <Select value={newTask.priority} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="border-[#D4AF37] focus:ring-[#D4AF37]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>عالي</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span>متوسط</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>منخفض</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* تاريخ الاستحقاق */}
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-[#01411C] font-medium">
                  تاريخ ووقت الاستحقاق *
                </Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="border-[#D4AF37] focus:ring-[#D4AF37]"
                />
              </div>

              {/* وقت التذكير */}
              <div className="space-y-2">
                <Label className="text-[#01411C] font-medium">وقت التذكير</Label>
                <Select value={newTask.reminderTime} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, reminderTime: value }))}>
                  <SelectTrigger className="border-[#D4AF37] focus:ring-[#D4AF37]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reminderOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* أزرار الحفظ والإلغاء */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddTask}
                  className="flex-1 bg-[#01411C] hover:bg-[#065f41] text-white"
                  disabled={!newTask.title.trim() || !newTask.dueDate}
                >
                  إضافة المهمة
                </Button>
                <Button
                  onClick={() => setIsAddTaskOpen(false)}
                  variant="outline"
                  className="flex-1 border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-[#01411C]"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-[#D4AF37] p-4 text-center">
          <div className="text-2xl font-bold text-[#01411C]">{getTasksByStatus('new').length}</div>
          <div className="text-sm text-gray-600">مهام جديدة</div>
        </div>
        <div className="bg-white rounded-lg border border-[#D4AF37] p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{getTasksByStatus('in-progress').length}</div>
          <div className="text-sm text-gray-600">قيد التنفيذ</div>
        </div>
        <div className="bg-white rounded-lg border border-[#D4AF37] p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{getTasksByStatus('completed').length}</div>
          <div className="text-sm text-gray-600">مكتملة</div>
        </div>
        <div className="bg-white rounded-lg border border-[#D4AF37] p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{tasks.filter(isOverdue).length}</div>
          <div className="text-sm text-gray-600">متأخرة</div>
        </div>
      </div>

      {/* قائمة المهام */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-500">لا توجد مهام</p>
            <p className="text-sm text-gray-400 mt-2">ابدأ بإضافة مهمة جديدة</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow ${
                isOverdue(task) ? 'border-red-300 bg-red-50' : 'border-[#D4AF37]'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className={`mt-1 ${
                      task.status === 'completed' 
                        ? 'text-green-600' 
                        : 'text-gray-400 hover:text-[#01411C]'
                    }`}
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      task.status === 'completed' 
                        ? 'line-through text-gray-500' 
                        : 'text-[#01411C]'
                    }`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                    )}
                    {task.clientName && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                        <User className="w-4 h-4" />
                        <span>{task.clientName}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={priorityConfig[task.priority].color}>
                    {priorityConfig[task.priority].icon}
                    <span className="ml-1">{priorityConfig[task.priority].label}</span>
                  </Badge>
                  
                  <Badge className={statusConfig[task.status].color}>
                    {statusConfig[task.status].label}
                  </Badge>
                  
                  {isOverdue(task) && (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      متأخر
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}