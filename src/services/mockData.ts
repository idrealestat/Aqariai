// /services/mockData.ts
// بيانات وهمية بسيطة ومحاكيات بحث (استبدلها لاحقًا بالـ APIs الحقيقية)

type Customer = { id: string; name: string; phone?: string; email?: string };

const MOCK_CUSTOMERS: Customer[] = [
  { id: 'C001', name: 'عبدالله العسيري', phone: '+966500000001', email: 'abdullah@example.com' },
  { id: 'C002', name: 'سارة محمد', phone: '+966500000002', email: 'sara@example.com' },
  { id: 'C003', name: 'محمد عبدالله', phone: '+966500000003', email: 'mohammed@example.com' },
  { id: 'C004', name: 'عبدالله أحمد', phone: '+966500000004', email: 'abdullah.ahmed@example.com' },
];

export async function customersSearch(query: string | { name?: string }): Promise<Customer[]> {
  if (!query) return [];
  const q = typeof query === 'string' ? query.toLowerCase() : (query.name || '').toLowerCase();
  if (!q) return [];
  return MOCK_CUSTOMERS.filter(c => c.name.toLowerCase().includes(q) || (c.phone || '').includes(q));
}

export async function requestsSearch(q: any) {
  // mock
  if (typeof q === 'object' && q.urgent) {
    return [
      { id: 'R-UR-1', title: 'طلب عاجل - صيانة', priority: 'high' },
      { id: 'R-UR-2', title: 'طلب عاجل - استشارة', priority: 'high' }
    ];
  }
  
  // بحث عام
  if (typeof q === 'string') {
    return [
      { id: 'R001', title: 'طلب شراء شقة - الرياض', priority: 'medium' },
      { id: 'R002', title: 'طلب إيجار فيلا - جدة', priority: 'low' }
    ].filter(r => r.title.toLowerCase().includes(q.toLowerCase()));
  }
  
  return [];
}

export async function offersSearch(query: string) {
  const allOffers = [
    { id: 'O001', title: 'شقة 3 غرف - الرياض', price: 750000, type: 'sale' },
    { id: 'O002', title: 'فيلا 5 غرف - جدة', price: 1500000, type: 'sale' },
    { id: 'O003', title: 'شقة للإيجار - الدمام', price: 3000, type: 'rent' }
  ];
  
  if (!query) return allOffers;
  
  return allOffers.filter(o => 
    JSON.stringify(o).toLowerCase().includes((query || '').toLowerCase())
  );
}

export function mockCreateBusinessCard(userId: string, input: string) {
  return { 
    id: `BC-${userId}`, 
    userId, 
    displayName: input || 'اسم الوسيط', 
    createdAt: new Date().toISOString() 
  };
}
