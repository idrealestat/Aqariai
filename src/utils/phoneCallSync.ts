/**
 * 📞 نظام مزامنة الاتصالات الأخيرة
 * 
 * ملاحظة: في تطبيقات الويب، لا يمكن الوصول لسجل المكالمات مباشرة لأسباب الخصوصية.
 * هذا النظام يوفر طرق بديلة للمزامنة:
 * 1. الوصول لجهات الاتصال (Contact Picker API)
 * 2. تتبع الاتصالات داخل التطبيق
 * 3. المزامنة اليدوية
 * 4. استيراد من ملف
 */

export interface RecentCall {
  id: string;
  name: string;
  phone: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration?: number; // بالثواني
  timestamp: Date;
  notes?: string;
}

/**
 * ✅ الطريقة 1: استخدام Contact Picker API (Chrome 80+)
 * يسمح للمستخدم باختيار جهات اتصال من جهازه
 */
export async function pickContactsFromDevice(): Promise<RecentCall[]> {
  try {
    // التحقق من دعم Contact Picker API
    if (!('contacts' in navigator && 'ContactsManager' in window)) {
      console.warn('Contact Picker API غير مدعوم في هذا المتصفح');
      return [];
    }

    const contacts = await (navigator as any).contacts.select(
      ['name', 'tel'],
      { multiple: true }
    );

    // تحويل جهات الاتصال إلى مكالمات حديثة
    const recentCalls: RecentCall[] = contacts.map((contact: any, index: number) => ({
      id: `contact-${Date.now()}-${index}`,
      name: contact.name?.[0] || 'غير معروف',
      phone: contact.tel?.[0] || '',
      type: 'outgoing' as const,
      timestamp: new Date(),
      notes: 'تم الاستيراد من جهات الاتصال'
    }));

    // حفظ في localStorage
    saveRecentCallsToStorage(recentCalls);

    return recentCalls;
  } catch (error) {
    console.error('خطأ في استيراد جهات الاتصال:', error);
    return [];
  }
}

/**
 * ✅ الطريقة 2: تتبع الاتصالات داخل التطبيق
 */
export function logCall(call: Omit<RecentCall, 'id' | 'timestamp'>): RecentCall {
  const newCall: RecentCall = {
    ...call,
    id: `call-${Date.now()}`,
    timestamp: new Date()
  };

  // إضافة للمخزن المحلي
  const existingCalls = getRecentCallsFromStorage();
  const updatedCalls = [newCall, ...existingCalls].slice(0, 50); // حفظ آخر 50 مكالمة
  saveRecentCallsToStorage(updatedCalls);

  return newCall;
}

/**
 * ✅ الطريقة 3: الحصول على المكالمات المحفوظة
 */
export function getRecentCallsFromStorage(): RecentCall[] {
  try {
    const stored = localStorage.getItem('recentCalls');
    if (!stored) return [];

    const calls = JSON.parse(stored);
    // تحويل التواريخ من strings إلى Date objects
    return calls.map((call: any) => ({
      ...call,
      timestamp: new Date(call.timestamp)
    }));
  } catch (error) {
    console.error('خطأ في قراءة المكالمات:', error);
    return [];
  }
}

/**
 * ✅ حفظ المكالمات في localStorage
 */
function saveRecentCallsToStorage(calls: RecentCall[]): void {
  try {
    localStorage.setItem('recentCalls', JSON.stringify(calls));
  } catch (error) {
    console.error('خطأ في حفظ المكالمات:', error);
  }
}

/**
 * ✅ الطريقة 4: استيراد من ملف CSV
 */
export function parseCallsFromCSV(csvText: string): RecentCall[] {
  try {
    const lines = csvText.split('\n').filter(line => line.trim());
    const calls: RecentCall[] = [];

    // تخطي السطر الأول (العناوين)
    for (let i = 1; i < lines.length; i++) {
      const [name, phone, type, duration, timestamp] = lines[i].split(',').map(s => s.trim());
      
      calls.push({
        id: `csv-${Date.now()}-${i}`,
        name: name || 'غير معروف',
        phone: phone || '',
        type: (type as any) || 'outgoing',
        duration: parseInt(duration) || 0,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        notes: 'تم الاستيراد من ملف'
      });
    }

    // حفظ في localStorage
    saveRecentCallsToStorage(calls);

    return calls;
  } catch (error) {
    console.error('خطأ في تحليل ملف CSV:', error);
    return [];
  }
}

/**
 * ✅ الطريقة 5: إنشاء بيانات تجريبية
 */
export function generateDemoRecentCalls(): RecentCall[] {
  const demoNames = [
    'أحمد محمد السعيد',
    'فاطمة عبدالله',
    'خالد العتيبي',
    'نورة الدوسري',
    'سعد المالكي',
    'ريم الشهري',
    'عبدالله القحطاني',
    'منى الزهراني'
  ];

  const calls: RecentCall[] = demoNames.map((name, index) => ({
    id: `demo-${Date.now()}-${index}`,
    name,
    phone: `05${Math.floor(Math.random() * 90000000 + 10000000)}`,
    type: ['incoming', 'outgoing', 'missed'][Math.floor(Math.random() * 3)] as any,
    duration: Math.floor(Math.random() * 600), // 0-10 دقائق
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // آخر 7 أيام
    notes: `مكالمة ${index + 1}`
  }));

  return calls;
}

/**
 * ✅ دمج المكالمات الحديثة مع قاعدة البيانات
 */
export function mergeCallsWithCRM(
  recentCalls: RecentCall[],
  existingCustomers: any[]
): any[] {
  const mergedCustomers = [...existingCustomers];

  for (const call of recentCalls) {
    // البحث عن العميل في القائمة الموجودة
    const existingIndex = mergedCustomers.findIndex(
      customer => customer.phone === call.phone
    );

    if (existingIndex >= 0) {
      // تحديث العميل الموجود
      const customer = mergedCustomers[existingIndex];
      customer.activities = [
        {
          id: `activity-${call.id}`,
          type: 'call',
          description: `${getCallTypeText(call.type)} - ${formatCallDuration(call.duration)}`,
          date: call.timestamp,
          icon: getCallTypeIcon(call.type)
        },
        ...(customer.activities || [])
      ];
    } else {
      // إضافة عميل جديد
      mergedCustomers.push({
        id: call.id,
        name: call.name,
        phone: call.phone,
        type: 'prospect',
        interestLevel: call.type === 'incoming' ? 'interested' : 'not-interested',
        tags: ['اتصال حديث'],
        createdAt: call.timestamp,
        activities: [
          {
            id: `activity-${call.id}`,
            type: 'call',
            description: `${getCallTypeText(call.type)} - ${formatCallDuration(call.duration)}`,
            date: call.timestamp,
            icon: getCallTypeIcon(call.type)
          }
        ]
      });
    }
  }

  return mergedCustomers;
}

/**
 * ✅ وظائف مساعدة
 */
function getCallTypeText(type: RecentCall['type']): string {
  const texts = {
    'incoming': 'مكالمة واردة',
    'outgoing': 'مكالمة صادرة',
    'missed': 'مكالمة فائتة'
  };
  return texts[type];
}

function getCallTypeIcon(type: RecentCall['type']): string {
  const icons = {
    'incoming': '📞',
    'outgoing': '📱',
    'missed': '❌'
  };
  return icons[type];
}

function formatCallDuration(seconds?: number): string {
  if (!seconds) return 'غير محدد';
  if (seconds < 60) return `${seconds} ثانية`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} دقيقة ${remainingSeconds > 0 ? `و ${remainingSeconds} ثانية` : ''}`;
}

/**
 * ✅ مسح المكالمات المحفوظة
 */
export function clearRecentCalls(): void {
  try {
    localStorage.removeItem('recentCalls');
  } catch (error) {
    console.error('خطأ في مسح المكالمات:', error);
  }
}

/**
 * ✅ التحقق من دعم Contact Picker API
 */
export function isContactPickerSupported(): boolean {
  return 'contacts' in navigator && 'ContactsManager' in window;
}

/**
 * ✅ طلب إذن الوصول للجهاز (للمستقبل)
 */
export async function requestPhonePermission(): Promise<boolean> {
  // في المستقبل، قد يتم إضافة API جديد للوصول لسجل المكالمات
  // حالياً، نعتمد على Contact Picker API فقط
  return isContactPickerSupported();
}

/**
 * ✅ تصدير المكالمات إلى CSV
 */
export function exportCallsToCSV(calls: RecentCall[]): string {
  const headers = 'الاسم,الهاتف,النوع,المدة,التاريخ\n';
  const rows = calls.map(call => 
    `${call.name},${call.phone},${call.type},${call.duration || 0},${call.timestamp.toISOString()}`
  ).join('\n');
  
  return headers + rows;
}

/**
 * ✅ تحميل ملف CSV
 */
export function downloadCallsCSV(calls: RecentCall[]): void {
  const csv = exportCallsToCSV(calls);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `recent-calls-${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
