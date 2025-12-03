/**
 * نظام إدارة الزملاء والتعيينات
 * ==============================
 * 
 * هذا النظام يربط بين:
 * - الزملاء المضافين في الإعدادات المتقدمة (settings-advanced.tsx)
 * - تعيين العملاء للزملاء في نظام CRM (EnhancedBrokerCRM-with-back.tsx)
 * - عرض العملاء المعينين حسب المستخدم الحالي
 */

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  permissions: string[];
  joinDate: string;
  active: boolean;
}

export interface CustomerAssignment {
  customerId: string;
  assignedToId: string;
  assignedToName: string;
  assignedBy: string; // ID المسؤول الذي قام بالتعيين
  assignedAt: Date;
}

/**
 * الحصول على قائمة الزملاء من localStorage
 */
export function getTeamMembers(): TeamMember[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const saved = localStorage.getItem('crm-team-members');
    if (!saved) {
      // بيانات تجريبية افتراضية
      return [
        {
          id: "1",
          name: "أحمد محمد الأحمد",
          email: "ahmed@example.com",
          phone: "0501234567",
          role: "مدير فرع",
          permissions: ["إدارة العقارات", "إدارة العملاء", "التقارير"],
          joinDate: "2024-01-15",
          active: true
        },
        {
          id: "2",
          name: "فاطمة سالم الزهراني",
          email: "fatima@example.com",
          phone: "0507654321",
          role: "وسيط عقاري",
          permissions: ["إدارة العقارات", "إدارة العملاء"],
          joinDate: "2024-02-01",
          active: true
        },
        {
          id: "3",
          name: "محمد عبدالله الشهري",
          email: "mohammed@example.com",
          phone: "0509876543",
          role: "مساعد وسيط",
          permissions: ["إدارة العقارات"],
          joinDate: "2024-02-15",
          active: true
        }
      ];
    }
    return JSON.parse(saved);
  } catch (error) {
    console.error('خطأ في تحميل الزملاء:', error);
    return [];
  }
}

/**
 * حفظ قائمة الزملاء في localStorage
 */
export function saveTeamMembers(members: TeamMember[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('crm-team-members', JSON.stringify(members));
    
    // إرسال event للتحديث
    window.dispatchEvent(new CustomEvent('team-members-updated', {
      detail: { members }
    }));
  } catch (error) {
    console.error('خطأ في حفظ الزملاء:', error);
  }
}

/**
 * الحصول على التعيينات من localStorage
 */
export function getCustomerAssignments(): CustomerAssignment[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const saved = localStorage.getItem('crm-customer-assignments');
    if (!saved) return [];
    
    const assignments = JSON.parse(saved);
    // تحويل التواريخ من string إلى Date
    return assignments.map((a: any) => ({
      ...a,
      assignedAt: new Date(a.assignedAt)
    }));
  } catch (error) {
    console.error('خطأ في تحميل التعيينات:', error);
    return [];
  }
}

/**
 * حفظ التعيينات في localStorage
 */
export function saveCustomerAssignments(assignments: CustomerAssignment[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('crm-customer-assignments', JSON.stringify(assignments));
    
    // إرسال event للتحديث
    window.dispatchEvent(new CustomEvent('customer-assignments-updated', {
      detail: { assignments }
    }));
  } catch (error) {
    console.error('خطأ في حفظ التعيينات:', error);
  }
}

/**
 * تعيين عميل لزميل
 */
export function assignCustomerToTeamMember(
  customerId: string,
  teamMemberId: string,
  teamMemberName: string,
  assignedBy: string
): void {
  const assignments = getCustomerAssignments();
  
  // إزالة أي تعيين سابق لهذا العميل
  const filteredAssignments = assignments.filter(a => a.customerId !== customerId);
  
  // إضافة التعيين الجديد
  const newAssignment: CustomerAssignment = {
    customerId,
    assignedToId: teamMemberId,
    assignedToName: teamMemberName,
    assignedBy,
    assignedAt: new Date()
  };
  
  filteredAssignments.push(newAssignment);
  saveCustomerAssignments(filteredAssignments);
}

/**
 * إلغاء تعيين عميل
 */
export function unassignCustomer(customerId: string): void {
  const assignments = getCustomerAssignments();
  const filteredAssignments = assignments.filter(a => a.customerId !== customerId);
  saveCustomerAssignments(filteredAssignments);
}

/**
 * الحصول على تعيين عميل محدد
 */
export function getCustomerAssignment(customerId: string): CustomerAssignment | null {
  const assignments = getCustomerAssignments();
  return assignments.find(a => a.customerId === customerId) || null;
}

/**
 * الحصول على العملاء المعينين لزميل محدد
 */
export function getCustomersAssignedTo(teamMemberId: string): string[] {
  const assignments = getCustomerAssignments();
  return assignments
    .filter(a => a.assignedToId === teamMemberId)
    .map(a => a.customerId);
}

/**
 * التحقق من صلاحيات الزميل
 */
export function hasPermission(teamMemberId: string, permission: string): boolean {
  const members = getTeamMembers();
  const member = members.find(m => m.id === teamMemberId);
  if (!member) return false;
  return member.permissions.includes(permission) && member.active;
}

/**
 * الحصول على الزملاء النشطين فقط
 */
export function getActiveTeamMembers(): TeamMember[] {
  return getTeamMembers().filter(m => m.active);
}

/**
 * تصفية العملاء حسب المستخدم الحالي
 * @param allCustomerIds - جميع معرفات العملاء
 * @param currentUserId - معرف المستخدم الحالي
 * @param isAdmin - هل المستخدم مسؤول؟
 * @returns قائمة معرفات العملاء المسموح بعرضها
 */
export function filterCustomersByUser(
  allCustomerIds: string[],
  currentUserId: string | null,
  isAdmin: boolean = true
): string[] {
  // المسؤول يرى جميع العملاء
  if (isAdmin || !currentUserId) {
    return allCustomerIds;
  }
  
  // الزميل يرى فقط العملاء المعينين له
  const assignedCustomers = getCustomersAssignedTo(currentUserId);
  return allCustomerIds.filter(id => assignedCustomers.includes(id));
}

/**
 * مزامنة التعيينات مع قائمة العملاء
 * (للتأكد من عدم وجود تعيينات لعملاء محذوفين)
 */
export function syncAssignmentsWithCustomers(validCustomerIds: string[]): void {
  const assignments = getCustomerAssignments();
  const syncedAssignments = assignments.filter(a => 
    validCustomerIds.includes(a.customerId)
  );
  
  if (syncedAssignments.length !== assignments.length) {
    saveCustomerAssignments(syncedAssignments);
  }
}

/**
 * الحصول على إحصائيات التعيينات
 */
export function getAssignmentStats(): {
  totalAssignments: number;
  assignmentsByMember: Record<string, number>;
  unassignedCustomers: number;
  totalCustomers: number;
} {
  const assignments = getCustomerAssignments();
  
  const assignmentsByMember: Record<string, number> = {};
  assignments.forEach(a => {
    if (!assignmentsByMember[a.assignedToId]) {
      assignmentsByMember[a.assignedToId] = 0;
    }
    assignmentsByMember[a.assignedToId]++;
  });
  
  return {
    totalAssignments: assignments.length,
    assignmentsByMember,
    unassignedCustomers: 0, // يحسب من خارج هذه الدالة
    totalCustomers: 0 // يحسب من خارج هذه الدالة
  };
}
