import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import CalendarGrid from './CalendarGrid';
import useCalendar from '../hooks/useCalendar';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Filter,
  Download
} from 'lucide-react';

interface LeaderCRMSystemCompleteProps {
  onBack: () => void;
}

export default function LeaderCRMSystemComplete({ onBack }: LeaderCRMSystemCompleteProps) {
  const calendar = useCalendar();
  const [selectedView, setSelectedView] = useState<'calendar' | 'list' | 'team'>('calendar');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed'>('all');

  // Mock team data
  const teamMembers = [
    { id: '1', name: 'أحمد محمد', appointments: 12, completed: 10, upcoming: 2 },
    { id: '2', name: 'فاطمة علي', appointments: 8, completed: 6, upcoming: 2 },
    { id: '3', name: 'خالد سعيد', appointments: 15, completed: 12, upcoming: 3 }
  ];

  const filteredEvents = calendar.events.filter(event => {
    const now = new Date();
    const eventDate = new Date(event.start);
    const eventEnd = new Date(event.end);

    if (filterStatus === 'upcoming') return eventDate > now;
    if (filterStatus === 'completed') return eventEnd < now;
    return true;
  });

  const stats = {
    total: calendar.events.length,
    upcoming: calendar.events.filter(e => new Date(e.start) > new Date()).length,
    completed: calendar.events.filter(e => new Date(e.end) < new Date()).length,
    today: calendar.events.filter(e => {
      const today = new Date().toDateString();
      return new Date(e.start).toDateString() === today;
    }).length
  };

  const handlers = {
    ...calendar,
    openCreate: (date?: string) => {
      // Open appointment form
    },
    openEdit: (ev: any) => {
      // Open edit form
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-white p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-2 border-[#D4AF37] hover:bg-[#f0fdf4]"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          عودة
        </Button>

        <div className="text-center flex-1">
          <h1 className="text-2xl text-[#01411C]">نظام إدارة المواعيد للقادة</h1>
          <p className="text-sm text-gray-600">إدارة متقدمة لجميع مواعيد الفريق</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="border-[#D4AF37]">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#01411C] to-[#065f41] rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">إجمالي المواعيد</p>
                <p className="text-2xl text-[#01411C]">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#01411C] to-[#065f41] rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">المواعيد القادمة</p>
                <p className="text-2xl text-[#01411C]">{stats.upcoming}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#01411C] to-[#065f41] rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">المكتملة</p>
                <p className="text-2xl text-[#01411C]">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#01411C] to-[#065f41] rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">اليوم</p>
                <p className="text-2xl text-[#01411C]">{stats.today}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-2 border-[#D4AF37] shadow-xl">
        <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41]">
          <CardTitle className="text-white">إدارة المواعيد</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="calendar">عرض التقويم</TabsTrigger>
              <TabsTrigger value="list">عرض القائمة</TabsTrigger>
              <TabsTrigger value="team">أداء الفريق</TabsTrigger>
            </TabsList>

            {/* Calendar View */}
            <TabsContent value="calendar">
              <CalendarGrid events={calendar.events} handlers={handlers} />
            </TabsContent>

            {/* List View */}
            <TabsContent value="list">
              <div className="space-y-4">
                {/* Filter */}
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('all')}
                    className={filterStatus === 'all' ? 'bg-[#01411C]' : 'border-[#D4AF37]'}
                  >
                    الكل ({stats.total})
                  </Button>
                  <Button
                    variant={filterStatus === 'upcoming' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('upcoming')}
                    className={filterStatus === 'upcoming' ? 'bg-[#01411C]' : 'border-[#D4AF37]'}
                  >
                    القادمة ({stats.upcoming})
                  </Button>
                  <Button
                    variant={filterStatus === 'completed' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('completed')}
                    className={filterStatus === 'completed' ? 'bg-[#01411C]' : 'border-[#D4AF37]'}
                  >
                    المكتملة ({stats.completed})
                  </Button>
                </div>

                {/* Events List */}
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    لا توجد مواعيد
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <Card key={event.id} className="border-2 border-[#D4AF37]">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-[#01411C] mb-1">{event.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                            <div className="flex gap-3 text-xs text-gray-500">
                              <span>📅 {new Date(event.start).toLocaleDateString('ar-SA')}</span>
                              <span>🕐 {new Date(event.start).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                          <Badge className={new Date(event.end) < new Date() ? 'bg-green-500' : 'bg-[#01411C]'}>
                            {new Date(event.end) < new Date() ? 'مكتمل' : 'قادم'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Team View */}
            <TabsContent value="team">
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="border-2 border-[#D4AF37]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#01411C] to-[#065f41] rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-[#D4AF37]" />
                          </div>
                          <div>
                            <h4 className="text-[#01411C]">{member.name}</h4>
                            <p className="text-sm text-gray-600">إجمالي: {member.appointments} موعد</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="text-center">
                            <p className="text-2xl text-green-600">{member.completed}</p>
                            <p className="text-xs text-gray-500">مكتمل</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl text-[#01411C]">{member.upcoming}</p>
                            <p className="text-xs text-gray-500">قادم</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
