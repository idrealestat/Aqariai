/*
 * ==================================================================================
 * EnhancedBrokerCRM-with-back.tsx
 * ==================================================================================
 * 
 * اسم الملف: EnhancedBrokerCRM-with-back.tsx
 * آخر تحديث: الإثنين 20 أكتوبر 2025
 * 
 * 📋 الميزات:
 * 1. نظام السحب والإفلات الكامل (DnD)
 * 2. نظام التاقات المؤقتة والمخصصة (localStorage + CustomEvent)
 * 3. بطاقة العملاء المحسّنة (حجم خط الاسم 14px)
 * 4. نظام الألوان المتقدم (13 لون - دوائر)
 * 5. التكامل مع المكالمات والإشعارات
 * 6. إدارة الفريق والتعيينات
 * 7. البحث والفلترة المتقدمة
 * 
 * ==================================================================================
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import UnifiedMainHeader from './layout/UnifiedMainHeader';
import RightSliderComplete from './RightSliderComplete-fixed';
import LeftSliderComplete from './LeftSliderComplete';
import { MiniUserCard } from './layout/DynamicHeader';
// ❌ إزالة import CustomerDetailsWithSlides from './CustomerDetailsWithSlides-Enhanced';
import { CRMBottomBar, getTagColor, getColorByName } from './crm-bottom-bar';
import { CallSyncButton } from './CallSyncButton';
import { NotificationsPanel } from './NotificationsPanel';
import { mergeCallsWithCRM, type RecentCall } from '../utils/phoneCallSync';
import { getAllCustomers, deleteCustomer } from '../utils/customersManager';
import { 
  getTeamMembers, 
  getCustomerAssignment, 
  assignCustomerToTeamMember, 
  unassignCustomer 
} from '../utils/teamAssignment';
import { isCustomerUnread, getUnreadNotificationsCount, markCustomerAsRead } from '../utils/notificationsSystem';
import { 
  ArrowRight, Plus, Settings, Users, Search, Filter, 
  Phone, MessageSquare, Mail, MoreVertical, Star,
  MapPin, Building2, Briefcase, Calendar, FileText,
  Share2, ChevronDown, ChevronUp, Tag, Archive,
  Home, DollarSign, Key, X, AlertTriangle, Bell, Menu, PanelLeft, GripVertical,
  UserPlus, ListPlus, SlidersHorizontal, UserCheck, Trash2, Edit, Copy, Send,
  Upload, CheckCircle, UserMinus, Badge as BadgeIcon
} from 'lucide-react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, DragOverEvent, PointerSensor, TouchSensor, MouseSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDashboardContext } from '../context/DashboardContext';

// ============================================================
// 📊 TYPES & INTERFACES
// 🔒 محمي - لا تعدل بدون إذن
// ============================================================

type CustomerType = 'seller' | 'buyer' | 'lessor' | 'tenant' | 'finance' | 'other';
type InterestLevel = 'passionate' | 'interested' | 'moderate' | 'limited' | 'not-interested';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  position?: string;
  image?: string;
  profileImage?: string; // صورة بطاقة العمل للوسطاء المشتركين
  type?: CustomerType; // ✅ اختياري لأنه قد يأتي من customersManager بدون type
  category?: string; // ✅ من customersManager (عربي: 'مالك', 'مشتري', ...)
  interestLevel?: InterestLevel; // ✅ اختياري لأنه قد لا يكون موجوداً
  tags: string[];
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  activities: Activity[];
  activityLogs?: ActivityLog[]; // 🆕 سجل النشاط التلقائي
  financingRequest?: FinancingRequest;
  propertyOffer?: PropertyOffer;
  propertyRequest?: PropertyRequest;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  date: Date;
  icon: string;
}

// 🆕 واجهات سجل النشاط التلقائي
type ActivityLogType = 'call' | 'message' | 'edit' | 'document' | 'meeting' | 'task' | 'tag';

interface ActivityLog {
  id: string;
  type: ActivityLogType;
  action: string;
  details: string;
  timestamp: Date;
  metadata?: {
    callDirection?: 'incoming' | 'outgoing';
    duration?: number;
    documentName?: string;
    fieldChanged?: string;
    oldValue?: string;
    newValue?: string;
  };
}

interface FinancingRequest {
  amount: string;
  type: string;
  duration: string;
  monthlyIncome: string;
  propertyType: string;
  location: string;
  notes: string;
  documents: string[];
}

interface PropertyOffer {
  propertyType: string;
  location: string;
  price: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  features: string[];
  images: string[];
  listingDate: Date;
}

interface PropertyRequest {
  requestType: 'buy' | 'rent';
  budget: string;
  preferredAreas: string[];
  propertyType: string;
  area: string;
  bedrooms: number;
  requirements: string[];
  requestDate: Date;
  priority: 'high' | 'medium' | 'low';
}

interface Column {
  id: string;
  title: string;
  customerIds: string[];
}

interface User {
  id?: string;
  name: string;
  email?: string;
  phone: string;
  type: "individual" | "team" | "office" | "company";
}

interface EnhancedBrokerCRMProps {
  user: User | null;
  onNavigate: (page: string) => void;
}

// ============================================================
// 🎨 CUSTOMER TYPE COLORS (خط علوي) - حسب البرومبت
// ============================================================

const CUSTOMER_TYPE_COLORS: Record<CustomerType, { border: string; bg: string; label: string }> = {
  seller: { border: 'border-t-4 border-t-[#1E90FF]', bg: 'bg-[#1E90FF]/10', label: 'بائع' },
  buyer: { border: 'border-t-4 border-t-[#32CD32]', bg: 'bg-[#32CD32]/10', label: 'مشتري' },
  lessor: { border: 'border-t-4 border-t-[#FF8C00]', bg: 'bg-[#FF8C00]/10', label: 'مؤجر' },
  tenant: { border: 'border-t-4 border-t-[#FFD700]', bg: 'bg-[#FFD700]/10', label: 'مستأجر' },
  finance: { border: 'border-t-4 border-t-[#9370DB]', bg: 'bg-[#9370DB]/10', label: 'تمويل' },
  other: { border: 'border-t-4 border-t-[#A9A9A9]', bg: 'bg-[#A9A9A9]/10', label: 'أخرى' }
};

// ============================================================
// ❤️ INTEREST LEVEL COLORS (خط سفلي) - حسب البرومبت
// ============================================================

const INTEREST_LEVEL_COLORS: Record<InterestLevel, { border: string; bg: string; label: string }> = {
  'passionate': { border: 'border-b-4 border-b-[#DC143C]', bg: 'bg-[#DC143C]/10', label: 'شغوف' },
  'interested': { border: 'border-b-4 border-b-[#8B4513]', bg: 'bg-[#8B4513]/10', label: 'مهتم' },
  'moderate': { border: 'border-b-4 border-b-[#800020]', bg: 'bg-[#800020]/10', label: 'معتدل' },
  'limited': { border: 'border-b-4 border-b-[#7B3F00]', bg: 'bg-[#7B3F00]/10', label: 'محدود' },
  'not-interested': { border: 'border-b-4 border-b-[#000000]', bg: 'bg-[#000000]/10', label: 'غير مهتم' }
};

// ============================================================
// ⚠️ REPORT TYPES - 23 نوع حسب البرومبت
// ============================================================

const REPORT_TYPES = [
  { id: '1', label: '🚫 وسيط غير مرخص', value: 'unlicensed-broker' },
  { id: '2', label: '🆔 انتحال الهوية أو ال��خصية', value: 'identity-theft' },
  { id: '3', label: '👥 الحسابات الوهمية', value: 'fake-accounts' },
  { id: '4', label: '📝 تزوير معلومات', value: 'information-forgery' },
  { id: '5', label: '🔒 انتهاك الخصوصية', value: 'privacy-violation' },
  { id: '6', label: '🤥 التضليل أو الخداع', value: 'misleading-deception' },
  { id: '7', label: '💰 عمليات الاحتيال والنصب', value: 'fraud-scam' },
  { id: '8', label: '📄 المعلومات المضللة أو المزيفة', value: 'fake-information' },
  { id: '9', label: '🚫 المحتوى أو السلوك المسيء', value: 'abusive-content' },
  { id: '10', label: '🚫 التحرش', value: 'harassment' },
  { id: '11', label: '💬 خطاب الكراهية', value: 'hate-speech' },
  { id: '12', label: '👊 التنمر الإلكتروني', value: 'cyberbullying' },
  { id: '13', label: '🚫 المحتوى غير اللائق', value: 'inappropriate-content' },
  { id: '14', label: '🔞 المحتوى الجنسي الصريح', value: 'explicit-content' },
  { id: '15', label: '⚔️ التحريض على العنف', value: 'violence-incitement' },
  { id: '16', label: '📩 النشاط غير المرغوب فيه أو البريد المزعج', value: 'spam' },
  { id: '17', label: '🤖 البوتات', value: 'bots' },
  { id: '18', label: '🔄 الإرسال المتكرر', value: 'repeated-posting' },
  { id: '19', label: '🖥️ انتحال منصة', value: 'platform-impersonation' },
  { id: '20', label: '⚖️ النشاط غير القانوني', value: 'illegal-activity' },
  { id: '21', label: '🆔 انتحال الهوية', value: 'impersonation' },
  { id: '22', label: '📢 إعلانات غير مصرح بها', value: 'unauthorized-ads' },
  { id: '23', label: '🔗 روابط ضارة', value: 'malicious-links' }
];

// ============================================================
// 🌐 PORTAL DROPDOWN MENU - قائمة منبثقة خارج العمود (مع Portal حقيقي)
// ============================================================

interface PortalMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

function PortalMenu({ isOpen, onClose, triggerRef, children, position = 'bottom' }: PortalMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  
  // حساب موقع القائمة بناءً على موقع الزر
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    
    const buttonRect = triggerRef.current.getBoundingClientRect();
    const menuHeight = 200; // تقدير تقريبي
    const menuWidth = 200;
    
    let top = 0;
    let left = 0;
    
    switch (position) {
      case 'top':
        top = buttonRect.top - menuHeight - 8;
        left = buttonRect.left;
        break;
      case 'bottom':
        top = buttonRect.bottom + 8;
        left = buttonRect.left;
        break;
      case 'left':
        top = buttonRect.top;
        left = buttonRect.left - menuWidth - 8;
        break;
      case 'right':
        top = buttonRect.top;
        left = buttonRect.right + 8;
        break;
      default:
        top = buttonRect.bottom + 8;
        left = buttonRect.left;
    }
    
    // تأكد من عدم خروج القائمة من الشاشة
    const maxTop = window.innerHeight - menuHeight - 16;
    const maxLeft = window.innerWidth - menuWidth - 16;
    
    top = Math.max(16, Math.min(top, maxTop));
    left = Math.max(16, Math.min(left, maxLeft));
    
    setMenuPosition({ top, left });
  }, [isOpen, triggerRef, position]);
  
  // Click outside handler
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current && 
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    };
    
    // تأخير بسيط لتجنب الإغلاق الفوري
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }, 100);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);
  
  if (!isOpen) return null;
  
  // استخدام Portal لإخراج القائمة من سياق العمود
  return createPortal(
    <div
      ref={menuRef}
      className="fixed bg-white border-2 border-[#D4AF37] rounded-lg shadow-2xl p-2 min-w-[180px] animate-fade-in-scale"
      style={{
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
        zIndex: 999999,
        maxHeight: '400px',
        overflowY: 'auto',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  );
}

// ============================================================
// 🃏 SORTABLE CUSTOMER CARD COMPONENT - مع السحب من الاسم
// ============================================================

function SortableCustomerCard({ 
  customer, 
  onExpand, 
  expanded,
  onUpdate,
  onReport,
  onShowDetails,
  onAssignToModal,
  onDelete
}: { 
  customer: Customer; 
  onExpand: () => void;
  expanded: boolean;
  onUpdate: (customer: Customer) => void;
  onReport: (customerId: string) => void;
  onShowDetails?: (customerId: string) => void;
  onAssignToModal?: () => void;
  onDelete?: (customerId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: customer.id });

  const [showActions, setShowActions] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isUnread, setIsUnread] = useState(() => isCustomerUnread(customer.id));
  
  // Refs للأزرار
  const actionsButtonRef = useRef<HTMLButtonElement>(null);
  const actionsMenuButtonRef = useRef<HTMLButtonElement>(null);
  const shareMenuButtonRef = useRef<HTMLButtonElement>(null);
  
  // Modals states
  const [showMoveToModal, setShowMoveToModal] = useState(false);
  const [showAssignToModal, setShowAssignToModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  
  // حالة التعيين من teamAssignment
  const [currentAssignment, setCurrentAssignment] = useState(() => 
    getCustomerAssignment(customer.id)
  );
  const [teamMembers, setTeamMembers] = useState(() => getTeamMembers());
  
  // 🔒 التاقات المحددة لهذا العميل فقط - منفصلة تماماً عن العملاء الآخرين
  const [customerTags, setCustomerTags] = useState<string[]>(customer.tags || []);
  
  // التاقات المخصصة من localStorage (مشتركة للألوان فقط)
  const [customTags, setCustomTags] = useState<Array<{name: string, color: string}>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crm-custom-tags');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  // الاستماع لتحديثات التاقات الخاصة بهذا العميل فقط
  useEffect(() => {
    const handleTagsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { customerId, selectedTags } = customEvent.detail;
      
      // ✅ تحديث العلامات فقط إذا كانت للعميل الحالي
      if (customerId === customer.id) {
        setCustomerTags(selectedTags);
        
        // تحد��ث العميل
        onUpdate({ ...customer, tags: selectedTags });
      }
    };
    
    // تحديث التاقات المخصصة عند التغيير (الألوان فقط - مشتركة)
    const handleCustomTagsUpdate = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('crm-custom-tags');
        if (saved) {
          setCustomTags(JSON.parse(saved));
        }
      }
    };
    
    window.addEventListener('crm-tags-updated', handleTagsUpdate);
    window.addEventListener('storage', handleCustomTagsUpdate);
    
    return () => {
      window.removeEventListener('crm-tags-updated', handleTagsUpdate);
      window.removeEventListener('storage', handleCustomTagsUpdate);
    };
  }, [customer, onUpdate]);
  
  // 🔄 تحديث customerTags عند تغيير customer.tags من الخارج
  useEffect(() => {
    setCustomerTags(customer.tags || []);
  }, [customer.tags]);
  
  // 🔴 تحديث حالة غير المشاهد
  useEffect(() => {
    const handleUnreadChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.customerId === customer.id) {
        setIsUnread(customEvent.detail.unread);
      }
    };

    window.addEventListener('customerUnreadStatusChanged', handleUnreadChange);

    return () => {
      window.removeEventListener('customerUnreadStatusChanged', handleUnreadChange);
    };
  }, [customer.id]);

  // 🔄 إغلاق القائمة المنبثقة عند النقر خارجها
  useEffect(() => {
    if (!showAssignToModal) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.assignment-dropdown-container')) {
        setShowAssignToModal(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showAssignToModal]);

  // 🔄 تحديث التعيين عند التغيير
  useEffect(() => {
    const handleAssignmentUpdate = () => {
      setCurrentAssignment(getCustomerAssignment(customer.id));
    };
    
    const handleTeamUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.members) {
        setTeamMembers(customEvent.detail.members);
      } else {
        setTeamMembers(getTeamMembers());
      }
    };
    
    window.addEventListener('customer-assignments-updated', handleAssignmentUpdate);
    window.addEventListener('team-members-updated', handleTeamUpdate);
    
    return () => {
      window.removeEventListener('customer-assignments-updated', handleAssignmentUpdate);
      window.removeEventListener('team-members-updated', handleTeamUpdate);
    };
  }, [customer.id]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : (showActions || showActionsMenu || showShareMenu ? 100 : 'auto'),
  };

  // ✅ التحقق من وجود type و interestLevel قبل الاستخدام
  const typeColors = customer.type && CUSTOMER_TYPE_COLORS[customer.type] 
    ? CUSTOMER_TYPE_COLORS[customer.type] 
    : CUSTOMER_TYPE_COLORS['other']; // fallback إلى 'other' إذا كان type غير موجود
  
  const interestColors = customer.interestLevel && INTEREST_LEVEL_COLORS[customer.interestLevel]
    ? INTEREST_LEVEL_COLORS[customer.interestLevel]
    : INTEREST_LEVEL_COLORS['moderate']; // fallback إلى 'moderate' إذا كان interestLevel غير موجود

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onExpand}
      className={`
        crm-card
        bg-white rounded-lg p-4 mb-3 relative
        shadow-sm hover:shadow-md transition-all cursor-pointer
        ${typeColors.border} ${interestColors.border}
        ${expanded ? 'ring-2 ring-blue-500' : ''}
      `}
    >
      {/* الصف الأول: الصورة + المعلومات (قابلة للسحب من الاسم) + أيقونات التواصل */}
      <div className="flex items-start gap-3 mb-3">
        {/* الصورة */}
        <div className="relative w-12 h-12 shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#01411C] to-[#065f41] flex items-center justify-center text-white overflow-hidden">
            {(customer.profileImage || customer.image) ? (
              <img src={customer.profileImage || customer.image} alt={customer.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-lg">{customer.name.charAt(0)}</span>
            )}
          </div>
          {/* 🔴 الدائرة الحمراء النابضة */}
          {isUnread && (
            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          )}
        </div>

        {/* المعلومات الأساسية - قابلة للسحب من الاسم */}
        <div className="flex-1 min-w-0">
          <h3 
            {...attributes}
            {...listeners}
            className="text-xs font-bold text-[#01411C] truncate cursor-grab active:cursor-grabbing flex items-center gap-2"
          >
            {customer.name}
            <GripVertical className="w-4 h-4 text-gray-400" />
          </h3>
          <p className="text-xs text-gray-600 truncate text-right">{customer.position || 'لا توجد وظيفة'}</p>
          <p className="text-xs text-gray-500 truncate text-right">{customer.company || customer.phone}</p>
        </div>

        {/* أيقونات التواصل + قائمة الإبلاغ */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <div className="flex gap-1">
            <button 
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-green-600" />
            </button>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>
          <div>
            <button 
              ref={actionsButtonRef}
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            
            {/* قائمة الإبلاغ - باستخدام Portal */}
            <PortalMenu 
              isOpen={showActions} 
              onClose={() => setShowActions(false)}
              triggerRef={actionsButtonRef}
              position="bottom"
            >
              <button
                onClick={() => {
                  setShowActions(false);
                  onReport(customer.id);
                }}
                className="w-full text-right px-3 py-2 hover:bg-red-50 rounded flex items-center gap-2 text-red-600"
              >
                <AlertTriangle className="w-4 h-4" />
                الإبلاغ عن عميل
              </button>
              <button
                onClick={() => setShowActions(false)}
                className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                تعديل
              </button>
              <button
                onClick={() => {
                  if (confirm(`هل تريد حذف ${customer.name} نهائياً؟\n\nسيتم حذف:\n• جميع معلومات العميل\n• جميع الإعلانات المرتبطة\n• السجل الكامل للتواصل\n\nهذا الإجراء لا يمكن التراجع عنه!`)) {
                    if (onDelete) {
                      onDelete(customer.id);
                    } else {
                      deleteCustomer(customer.id);
                    }
                    setShowActions(false);
                  }
                }}
                className="w-full text-right px-3 py-2 hover:bg-red-50 text-red-600 rounded flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                حذف نهائياً
              </button>
            </PortalMenu>
          </div>
        </div>
      </div>

      {/* صف نوع العميل ودرجة الاهتمام (يسار) والتاقات (يمين) */}
      <div className="flex items-start gap-3 mb-2">
        {/* العمود الأيمن: التاقات */}
        <div className="flex-1 min-w-0">
          {!expanded ? (
            /* وضع مطوي: صفين من التاقات أو رسالة */
            customerTags.length === 0 ? (
              <div className="text-xs text-gray-400 italic text-right">
                لا توجد علامات
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-wrap gap-0.5">
                  {customerTags.slice(0, 4).map((tag, idx) => {
                    const colors = getTagColor(tag, customTags);
                    return (
                      <Badge key={idx} variant="outline" className={`text-[10px] px-1.5 py-0 h-5 leading-tight ${colors.bg} ${colors.border} ${colors.text}`}>
                        {tag}
                      </Badge>
                    );
                  })}
                  {customerTags.length > 4 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 leading-tight bg-gray-100 border-gray-300 text-gray-700">
                      +{customerTags.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            )
          ) : (
            /* وضع موسع: جميع التاقات على 3 صفوف + زر إضافة */
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-wrap gap-0.5" style={{ maxHeight: '4.5rem', overflowY: 'auto' }}>
                {customerTags.map((tag, idx) => {
                  const colors = getTagColor(tag, customTags);
                  return (
                    <Badge key={idx} variant="outline" className={`text-[10px] px-1.5 py-0 h-5 leading-tight ${colors.bg} ${colors.border} ${colors.text}`}>
                      {tag}
                    </Badge>
                  );
                })}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // ✅ إرسال Event لفتح بانل العلامات مع بيانات العميل
                    window.dispatchEvent(new CustomEvent('crm-open-tags-panel', {
                      detail: {
                        customerId: customer.id,
                        customerTags: customerTags
                      }
                    }));
                  }}
                  className="px-1.5 py-0 h-5 border border-dashed border-[#D4AF37] rounded text-[10px] hover:bg-[#fffef7] text-[#01411C] transition-colors whitespace-nowrap leading-tight"
                >
                  + أضف علامة
                </button>
              </div>
              {customerTags.length === 0 && (
                <p className="text-xs text-gray-400 italic mt-1 text-right">
                  اضغط "أضف علامة" لاختيار العلامات من الشريط السفلي
                </p>
              )}
            </div>
          )}
        </div>

        {/* العمود الأيسر: نوع العميل ودرجة الاهتمام */}
        <div className="flex flex-col gap-2 shrink-0">
          {/* نوع العميل */}
          <div className={`inline-block px-2 py-1 rounded text-xs ${typeColors.bg} text-gray-700 whitespace-nowrap`}>
            {typeColors.label}
          </div>

          {/* درجة الاهتمام */}
          <div className={`inline-block px-2 py-1 rounded text-xs ${interestColors.bg} text-gray-700 whitespace-nowrap`}>
            ❤️ {interestColors.label}
          </div>
        </div>
      </div>

      {/* شريط "معين لـ" الشفاف - يظهر دائماً إذا كان معيّن */}
      {currentAssignment && (
        <div className="relative mb-2 assignment-dropdown-container">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAssignToModal(!showAssignToModal);
            }}
            className="flex items-center gap-2 text-xs text-gray-500 px-2 py-1 bg-gray-50/50 rounded hover:bg-gray-100 transition-colors w-full justify-center"
          >
            <span>معين لـ: {currentAssignment.assignedToName}</span>
          </button>

          {/* القائمة المنبثقة البسيطة */}
          {showAssignToModal && (
            <div 
              className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#D4AF37] rounded-lg shadow-2xl z-40 max-h-64 overflow-y-auto assignment-dropdown-container"
              onClick={(e) => e.stopPropagation()}
            >
              {/* إزالة التعيين - أول خيار */}
              {currentAssignment && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    unassignCustomer(customer.id);
                    setCurrentAssignment(null);
                    setShowAssignToModal(false);
                  }}
                  className="w-full text-right px-3 py-2 hover:bg-red-50 text-red-600 transition-colors border-b border-gray-200"
                >
                  إزالة التعيين
                </button>
              )}

              {/* قائمة الزملاء - أسماء فقط */}
              {teamMembers.length === 0 ? (
                <div className="px-3 py-4 text-center text-gray-500 text-xs">
                  لا يوجد زملاء
                </div>
              ) : (
                teamMembers.filter(m => m.active).map(member => (
                  <button
                    key={member.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      assignCustomerToTeamMember(
                        customer.id,
                        member.id,
                        member.name,
                        'current-user'
                      );
                      setCurrentAssignment({
                        customerId: customer.id,
                        assignedToId: member.id,
                        assignedToName: member.name,
                        assignedBy: 'current-user',
                        assignedAt: new Date()
                      });
                      setShowAssignToModal(false);
                    }}
                    className={`w-full text-right px-3 py-2 hover:bg-gray-50 transition-colors text-sm ${
                      currentAssignment?.assignedToId === member.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {member.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* زر التعيين - يظهر فقط عند التوسع وعندما لا يكون معيّن */}
      {!currentAssignment && expanded && (
        <div className="relative mb-2 assignment-dropdown-container">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAssignToModal(!showAssignToModal);
            }}
            className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 px-2 py-1 border border-dashed border-blue-300 rounded hover:bg-blue-50 transition-colors w-full justify-center"
          >
            <UserPlus className="w-3 h-3" />
            <span>تعيين لزميل</span>
          </button>

          {/* القائمة المنبثقة البسيطة */}
          {showAssignToModal && (
            <div 
              className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#D4AF37] rounded-lg shadow-2xl z-40 max-h-64 overflow-y-auto assignment-dropdown-container"
              onClick={(e) => e.stopPropagation()}
            >
              {/* قائمة الزملاء - أسماء فقط */}
              {teamMembers.length === 0 ? (
                <div className="px-3 py-4 text-center text-gray-500 text-xs">
                  لا يوجد زملاء
                </div>
              ) : (
                teamMembers.filter(m => m.active).map(member => (
                  <button
                    key={member.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      assignCustomerToTeamMember(
                        customer.id,
                        member.id,
                        member.name,
                        'current-user'
                      );
                      setCurrentAssignment({
                        customerId: customer.id,
                        assignedToId: member.id,
                        assignedToName: member.name,
                        assignedBy: 'current-user',
                        assignedAt: new Date()
                      });
                      setShowAssignToModal(false);
                    }}
                    className="w-full text-right px-3 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                  >
                    {member.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* التفاصيل الموسعة */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
          {/* الملاحظات */}
          {customer.notes && (
            <div className="text-sm">
              <div className="font-bold text-gray-700 mb-1 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                ملاحظات
              </div>
              <p className="text-gray-600 bg-yellow-50 p-2 rounded">{customer.notes.split('\n')[0]}</p>
            </div>
          )}

          {/* النشاطات الأخيرة - مربوطة بسجل النشاط التلقائي */}
          {(() => {
            // تحويل activityLogs إلى activities
            const getActivityIcon = (type: string) => {
              switch (type) {
                case 'call': return '📞';
                case 'message': return '💬';
                case 'edit': return '✏️';
                case 'document': return '📎';
                case 'meeting': return '📅';
                case 'task': return '✅';
                case 'tag': return '🏷️';
                default: return '📋';
              }
            };

            const latestActivities = customer.activityLogs 
              ? customer.activityLogs
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .slice(0, 3)
                  .map(log => ({
                    id: log.id,
                    type: log.type,
                    description: log.action + (log.details ? ` - ${log.details}` : ''),
                    date: log.timestamp,
                    icon: getActivityIcon(log.type)
                  }))
              : customer.activities || [];

            return latestActivities.length > 0 ? (
              <div className="text-sm">
                <div className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  آخر النشاطات (آخر 3)
                </div>
                {latestActivities.slice(0, 3).map((activity) => {
                  const firstLine = activity.description.split('\n')[0];
                  return (
                    <div key={activity.id} className="text-xs text-gray-600 flex items-start gap-2 bg-gray-50 p-2 rounded mb-1">
                      <span>{activity.icon}</span>
                      <div className="flex-1">
                        <span className="block">{firstLine}</span>
                        <span className="text-[10px] text-gray-400 text-left">
                          {new Date(activity.date).toLocaleDateString('ar-SA', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null;
          })()}

          {/* الشريط السفلي - 3 أزرار */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {/* زر الإجراءات مع القائمة المنبثقة */}
            <div className="relative">
              <button
                type="button"
                ref={actionsMenuButtonRef}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowActionsMenu(!showActionsMenu);
                }}
                className="w-full flex flex-col items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
              >
                <Settings className="w-4 h-4" />
                الإجراءات
              </button>
              
              <PortalMenu
                isOpen={showActionsMenu}
                onClose={() => setShowActionsMenu(false)}
                triggerRef={actionsMenuButtonRef}
                position="top"
              >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowActionsMenu(false);
                      setShowAssignToModal(true);
                    }}
                    className="w-full text-right px-3 py-2 hover:bg-blue-50 rounded flex items-center gap-2 text-sm text-blue-600"
                  >
                    <UserPlus className="w-4 h-4" />
                    معين لي
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowActionsMenu(false);
                      setShowMoveToModal(true);
                    }}
                    className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-sm"
                  >
                    <ArrowRight className="w-4 h-4" />
                    نقل إلى
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowActionsMenu(false);
                      setShowAssignToModal(true);
                    }}
                    className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-sm"
                  >
                    <UserCheck className="w-4 h-4" />
                    معين لـ
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowActionsMenu(false);
                      setShowAddNoteModal(true);
                    }}
                    className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    إضافة ملاحظة
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowActionsMenu(false);
                      setShowAddTagModal(true);
                    }}
                    className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-sm"
                  >
                    <Tag className="w-4 h-4" />
                    إضافة علامة
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowActionsMenu(false);
                      setShowAddFileModal(true);
                    }}
                    className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-sm"
                  >
                    <Upload className="w-4 h-4" />
                    إضافة ملف
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowActionsMenu(false);
                      // فتح صفحة السندات بوضع سند قبض
                      window.dispatchEvent(new CustomEvent('openFinancialDocument', {
                        detail: {
                          type: 'receipt',
                          client: { name: customer.name, phone: customer.phone, company: customer.company }
                        }
                      }));
                    }}
                    className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-sm"
                  >
                    <DollarSign className="w-4 h-4" />
                    إضافة سند قبض
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowActionsMenu(false);
                      // فتح صفحة السندات بوضع عرض سعر
                      window.dispatchEvent(new CustomEvent('openFinancialDocument', {
                        detail: {
                          type: 'quotation',
                          client: { name: customer.name, phone: customer.phone, company: customer.company }
                        }
                      }));
                    }}
                    className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    إضافة عرض سعر
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowActionsMenu(false);
                      // فتح صفحة المهام
                      window.dispatchEvent(new CustomEvent('navigateToPage', { detail: 'tasks-management' }));
                    }}
                    className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    إضافة مهمة
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowActionsMenu(false);
                      // إرسال بيانات العميل لإدارة المواعيد
                      window.dispatchEvent(new CustomEvent('scheduleAppointmentFromCRM', {
                        detail: {
                          clientName: customer.name,
                          clientPhone: customer.phone,
                          clientWhatsapp: customer.whatsapp || customer.phone,
                          clientId: customer.id
                        }
                      }));
                      // فتح صفحة التقويم
                      window.dispatchEvent(new CustomEvent('navigateToPage', { detail: 'calendar-system-complete' }));
                    }}
                    className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    إضافة موعد
                  </button>
              </PortalMenu>
            </div>

            {/* زر التفاصيل - يفتح صفحة التفاصيل الكاملة */}
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onShowDetails && onShowDetails(customer.id);
              }}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition-colors"
            >
              <FileText className="w-4 h-4" />
              التفاصيل
            </button>

            {/* زر المشاركة مع القائمة المنبثقة */}
            <div className="relative">
              <button
                type="button"
                ref={shareMenuButtonRef}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowShareMenu(!showShareMenu);
                }}
                className="w-full flex flex-col items-center justify-center gap-1 px-3 py-2 bg-[#01411C] hover:bg-[#065f41] text-white rounded text-xs transition-colors"
              >
                <Share2 className="w-4 h-4" />
                مشاركة
              </button>
              
              <PortalMenu
                isOpen={showShareMenu}
                onClose={() => setShowShareMenu(false)}
                triggerRef={shareMenuButtonRef}
                position="top"
              >
                  <button
                    onClick={() => {
                      setShowShareMenu(false);
                      navigator.clipboard.writeText(`${window.location.origin}/customer/${customer.id}`);
                    }}
                    className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    نسخ الرابط
                  </button>
                  <button
                    onClick={() => {
                      setShowShareMenu(false);
                      const text = `العميل: ${customer.name}\nالهاتف: ${customer.phone}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    واتساب أعمال
                  </button>
                  <button
                    onClick={() => {
                      setShowShareMenu(false);
                      const text = `العميل: ${customer.name}\nالهاتف: ${customer.phone}`;
                      window.open(`sms:?body=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-sm"
                  >
                    <Send className="w-4 h-4" />
                    رسائل نصية
                  </button>
                  <button
                    onClick={() => {
                      setShowShareMenu(false);
                      if (navigator.share) {
                        navigator.share({
                          title: customer.name,
                          text: `العميل: ${customer.name}\nالهاتف: ${customer.phone}`,
                          url: `${window.location.origin}/customer/${customer.id}`
                        });
                      }
                    }}
                    className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    اختر تطبيق
                  </button>
              </PortalMenu>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {/* Move To Modal */}
      {showMoveToModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" onClick={() => setShowMoveToModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">نقل العميل إلى</h3>
              <button onClick={() => setShowMoveToModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">اختر العمود المراد نقل العميل إليه</p>
            <div className="space-y-2">
              {['new', 'follow-up', 'completed'].map(col => (
                <button
                  key={col}
                  onClick={() => {
                    // تنفيذ النقل
                    setShowMoveToModal(false);
                  }}
                  className="w-full text-right px-4 py-3 hover:bg-gray-50 rounded-lg border border-gray-200"
                >
                  {col === 'new' ? '🆕 عملاء جدد' : col === 'follow-up' ? '🔄 قيد المتابعة' : '✅ صفقات مكتملة'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ✅ Modal محذوف - تم استبداله بقائمة منبثقة بسيطة في البطاقة نفسها */}

      {/* Add Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" onClick={() => setShowAddNoteModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">إضافة ملاحظة</h3>
              <button onClick={() => setShowAddNoteModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              placeholder="اكتب ملاحظتك هنا..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg min-h-[120px] mb-4"
              defaultValue={customer.notes || ''}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddNoteModal(false)}>إلغاء</Button>
              <Button 
                onClick={() => {
                  const note = (document.querySelector('textarea') as HTMLTextAreaElement)?.value;
                  onUpdate({ ...customer, notes: note });
                  setShowAddNoteModal(false);
                }}
                className="bg-[#01411C] text-white"
              >
                حفظ
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tag Modal */}
      {showAddTagModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" onClick={() => setShowAddTagModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">إضافة علامة</h3>
              <button onClick={() => setShowAddTagModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <Input 
              placeholder="اسم العلامة..." 
              className="mb-4"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const newTag = (e.target as HTMLInputElement).value;
                  if (newTag && !customer.tags.includes(newTag)) {
                    onUpdate({ ...customer, tags: [...customer.tags, newTag] });
                    setShowAddTagModal(false);
                  }
                }
              }}
            />
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">العلامات الحالية:</p>
              <div className="flex flex-wrap gap-2">
                {customer.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500">اضغط Enter لإضافة العلامة</p>
          </div>
        </div>
      )}

      {/* Add File Modal */}
      {showAddFileModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" onClick={() => setShowAddFileModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">إضافة ملف</h3>
              <button onClick={() => setShowAddFileModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">اسحب الملف هنا أو انقر للاختيار</p>
              <input type="file" className="hidden" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddFileModal(false)}>إلغاء</Button>
              <Button className="bg-[#01411C] text-white">رفع الملف</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 📋 SORTABLE KANBAN COLUMN COMPONENT - قابل للسحب من رأس العمود
// ============================================================

function SortableKanbanColumn({ 
  column, 
  customers,
  onAddCustomer,
  expandedCustomerId,
  onExpandCustomer,
  onUpdateCustomer,
  isDragOverColumn,
  isAnyDragging,
  dragOverCardIndex,
  onReport,
  onShowDetails,
  onDelete
}: { 
  column: Column;
  customers: Customer[];
  onAddCustomer: (columnId: string) => void;
  expandedCustomerId: string | null;
  onExpandCustomer: (customerId: string | null) => void;
  onUpdateCustomer: (customer: Customer) => void;
  isDragOverColumn: boolean;
  isAnyDragging: boolean;
  dragOverCardIndex?: number | null;
  onReport: (customerId: string) => void;
  onShowDetails?: (customerId: string) => void;
  onAssign?: (customerId: string) => void;
  onDelete?: (customerId: string) => void;
}) {
  // ✅ حماية عمود الاتصالات الأخيرة من السحب
  const isRecentCallsColumn = column.id === 'recent-calls';
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: column.id,
    data: { type: 'column' },
    disabled: isRecentCallsColumn // ✅ منع سحب عمود الاتصالات
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isOtherColumn = !isDragging && !isDragOverColumn && isAnyDragging;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        zIndex: isDragging ? 1000 : 'auto',
        overflow: 'visible',
        minHeight: '500px',
      }}
      data-column-id={column.id}
      className={`
        kanban-column bg-gray-100 rounded-xl p-4 min-w-[320px] max-w-[320px] flex flex-col
        border-2 shadow-lg transition-all duration-300 relative
        ${isDragOverColumn ? 'border-green-500 bg-green-50' : 'border-[#D4AF37]'}
        ${isDragging ? 'opacity-50' : ''}
        ${isOtherColumn ? 'scale-95 opacity-70' : ''}
        ${isRecentCallsColumn ? 'ring-2 ring-blue-400' : ''}
      `}
    >
      {/* رأس العمود - قابل للسحب إلا عمود الاتصالات */}
      <div 
        {...(isRecentCallsColumn ? {} : attributes)}
        {...(isRecentCallsColumn ? {} : listeners)}
        className={`flex items-center justify-between mb-4 bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-all ${
          isRecentCallsColumn ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
        }`}
      >
        {isRecentCallsColumn && (
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg">
            ثابت
          </div>
        )}
        <div className="flex items-center gap-2">
          <GripVertical className="w-5 h-5 text-gray-400" />
          <h3 className="font-bold text-gray-800">{column.title}</h3>
          <Badge variant="secondary" className="text-xs">
            {column.customerIds.length}
          </Badge>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddCustomer(column.id);
          }}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* قائمة العملاء */}
      <SortableContext items={column.customerIds} strategy={verticalListSortingStrategy}>
        <div className="flex-1" style={{ 
          overflowY: 'auto',
          overflowX: 'visible',
          position: 'relative'
        }}>
          {column.customerIds.map((customerId, index) => {
            const customer = customers.find(c => c.id === customerId);
            if (!customer) {
              console.warn(`⚠️ [RENDER] عميل غير موجود في column "${column.title}": ID="${customerId}"`);
              return null;
            }

            // ✅ خط أخضر ملكي بدلاً من التوسع
            const showGreenLineBefore = dragOverCardIndex === index && isDragOverColumn;

            return (
              <React.Fragment key={customer.id}>
                {/* ✅ خط أخضر ملكي بسيط */}
                {showGreenLineBefore && (
                  <div className="relative my-2" style={{ height: '4px' }}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#01411C] via-[#22c55e] to-[#01411C] shadow-lg animate-pulse" style={{
                      boxShadow: '0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(1, 65, 28, 0.6)'
                    }} />
                    {/* دوائر في البداية والنهاية */}
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-[#01411C]" style={{
                      boxShadow: '0 0 12px rgba(34, 197, 94, 0.9)'
                    }} />
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-[#01411C]" style={{
                      boxShadow: '0 0 12px rgba(34, 197, 94, 0.9)'
                    }} />
                  </div>
                )}
                
                <div style={{ marginBottom: '8px' }}>
                  <SortableCustomerCard
                    customer={customer}
                    expanded={expandedCustomerId === customer.id}
                    onExpand={() => onExpandCustomer(expandedCustomerId === customer.id ? null : customer.id)}
                    onUpdate={onUpdateCustomer}
                    onReport={onReport}
                    onShowDetails={onShowDetails}
                    onDelete={onDelete}
                    onAssignToModal={() => {
                      setSelectedCustomerId(customer.id);
                      setShowAssignModal(true);
                    }}
                  />
                </div>
              </React.Fragment>
            );
          })}
          
          {/* ✅ خط أخضر في النهاية */}
          {isDragOverColumn && dragOverCardIndex === column.customerIds.length && (
            <div className="relative my-2" style={{ height: '4px' }}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#01411C] via-[#22c55e] to-[#01411C] shadow-lg animate-pulse" style={{
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(1, 65, 28, 0.6)'
              }} />
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-[#01411C]" style={{
                boxShadow: '0 0 12px rgba(34, 197, 94, 0.9)'
              }} />
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-[#01411C]" style={{
                boxShadow: '0 0 12px rgba(34, 197, 94, 0.9)'
              }} />
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// ============================================================
// 🏠 MAIN CRM COMPONENT
// ============================================================

export default function EnhancedBrokerCRM({ user, onNavigate }: EnhancedBrokerCRMProps) {
  const { leftSidebarOpen, setLeftSidebarOpen } = useDashboardContext();
  // STATE MANAGEMENT
  const [columns, setColumns] = useState<Column[]>(() => {
    // تحميل الأعمدة من localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crm-kanban-columns');
      if (saved) {
        try {
          const loadedColumns = JSON.parse(saved);
          
          // ✅ تنظيف التكرارات عند التحميل
          const seenIds = new Set<string>();
          const cleanedColumns = loadedColumns.map((col: Column) => ({
            ...col,
            customerIds: col.customerIds.filter(id => {
              if (seenIds.has(id)) {
                console.warn(`⚠️ تم تجاهل تكرار عند التحميل: ${id} في عمود ${col.id}`);
                return false;
              }
              seenIds.add(id);
              return true;
            })
          }));
          
          console.log('✅ تم تحميل الأعمدة من localStorage (بعد التنظيف)');
          return cleanedColumns;
        } catch (e) {
          console.error('خطأ في تحميل الأعمدة:', e);
        }
      }
    }
    // القيم الافتراضية
    const defaultColumns = [
      { id: 'recent-calls', title: '📞 الاتصالات الأخيرة', customerIds: [] },
      { id: 'new', title: '🆕 عملاء جدد', customerIds: ['1', '2'] },
      { id: 'follow-up', title: '🔄 قيد المتابعة', customerIds: ['3'] },
      { id: 'completed', title: '✅ صفقات مكتملة', customerIds: [] },
    ];
    
    console.log('📊 [INIT] استخدام الأعمدة الافتراضية');
    
    // ✅ حفظ في localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('crm-kanban-columns', JSON.stringify(defaultColumns));
    }
    
    return defaultColumns;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    // تحميل من localStorage أولاً
    let loadedCustomers: Customer[] = [];
    
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crm_customers');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.length > 0) {
            console.log('✅ تم تحميل العملاء من localStorage:', parsed.length);
            console.log('📋 معرفات العملاء المحملة:', parsed.map((c: any) => c.id));
            
            // ✅ تحويل التواريخ من string إلى Date
            loadedCustomers = parsed.map((c: any) => ({
              ...c,
              createdAt: c.createdAt ? (typeof c.createdAt === 'string' ? new Date(c.createdAt) : c.createdAt) : new Date(),
              activities: c.activities || []
            }));
          }
        } catch (e) {
          console.error('❌ خطأ في تحميل العملاء من localStorage:', e);
        }
      } else {
        console.log('⚠️ localStorage فارغ - لا توجد بيانات محفوظة');
      }
    }
    
    // إذا لم يكن هناك عملاء محفوظين، استخدم البيانات التجريبية
    if (loadedCustomers.length === 0) {
      console.log('📦 استخدام البيانات التجريبية (3 عملاء)');
      loadedCustomers = [
        {
          id: '1',
          name: 'أحمد محمد السعيد',
          phone: '0501234567',
          email: 'ahmed@example.com',
          company: 'شركة العقارات الذكية',
          position: 'مدير مبيعات',
          type: 'buyer',
          interestLevel: 'passionate',
          tags: [], // التاقات تأتي من الاختيار في الشريط السفلي
          assignedTo: 'محمد الأحمد',
          createdAt: new Date(),
          activities: [
            { id: 'a1', type: 'call', description: 'اتصال هاتفي - مهتم بعقار في حي النرجس', date: new Date(), icon: '📞' },
            { id: 'a2', type: 'meeting', description: 'اجتماع في المكتب - ناقشنا الخيارات المتاحة', date: new Date(), icon: '🤝' },
          ]
        },
        {
          id: '2',
          name: 'فاطمة عبدالله الزهراني',
          phone: '0557654321',
          position: 'ربة منزل',
          type: 'seller',
          interestLevel: 'interested',
          tags: [], // التاقات تأتي من الاختيار في الشريط السفلي
          createdAt: new Date(),
          activities: [
            { id: 'a3', type: 'note', description: 'تريد بيع فيلا في حي الملقا', date: new Date(), icon: '📝' },
          ]
        },
        {
          id: '3',
          name: 'عبدالرحمن ناصر القحطاني',
          phone: '0509876543',
          company: 'مؤسسة التطوير العقاري',
          position: 'مستثمر',
          type: 'finance',
          interestLevel: 'moderate',
          tags: [], // التاقات تأتي من الاختيار في الشريط السفلي
          createdAt: new Date(),
          activities: [
            { id: 'a4', type: 'email', description: 'طلب معلومات عن المشاريع القادمة', date: new Date(), icon: '📧' },
          ]
        },
      ];
    }
    
    console.log('📊 [INIT] إجمالي العملاء المُحمّلين:', loadedCustomers.length);
    console.log('📋 [INIT] معرفات العملاء:', loadedCustomers.map(c => c.id));
    
    // ✅ حفظ في localStorage مباشرة إذا كانت البيانات التجريبية
    if (typeof window !== 'undefined' && loadedCustomers.length > 0) {
      const saved = localStorage.getItem('crm_customers');
      if (!saved) {
        console.log('💾 [INIT] حفظ البيانات التجريبية في localStorage');
        localStorage.setItem('crm_customers', JSON.stringify(loadedCustomers));
      }
    }
    
    return loadedCustomers;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<CustomerType | 'all'>('all');
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [dragType, setDragType] = useState<'column' | 'card' | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingCustomerId, setReportingCustomerId] = useState<string | null>(null);
  
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  // ❌ إزالة const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [archivedCustomers, setArchivedCustomers] = useState<Customer[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // ✅ تم نقل حفظ العملاء التجريبية إلى useState مباشرة
  // ✅ تم إيقاف الحفظ التلقائي في localStorage لتجنب التعارض مع customersManager
  // customersManager سيقوم بالحفظ تلقائياً عند إنشاء/تحديث/حذف العملاء

  // ✅ تنظيف وتحديث الأعمدة بناءً على العملاء الموجودين
  useEffect(() => {
    if (customers.length === 0) return;
    
    console.log('🔧 [SYNC] بدء مزامنة الأعمدة مع العملاء...');
    
    // الحصول على جميع معرفات العملاء الموجودين
    const existingCustomerIds = new Set(customers.map(c => c.id));
    console.log('📋 [SYNC] معرفات العملاء الموجودة:', Array.from(existingCustomerIds));
    
    setColumns(prevColumns => {
      // الحصول على جميع معرفات العملاء في الأعمدة
      const customerIdsInColumns = new Set<string>();
      prevColumns.forEach(col => {
        col.customerIds.forEach(id => customerIdsInColumns.add(id));
      });
      console.log('📋 [SYNC] معرفات العملاء في الأعمدة:', Array.from(customerIdsInColumns));
      
      // تحديث الأعمدة
      let needsUpdate = false;
      
      // ✅ تتبع المعرفات المستخدمة لمنع التكرار عبر الأعمدة
      const usedIds = new Set<string>();
      
      const updatedColumns = prevColumns.map(col => {
        // إزالة المعرفات غير الموجودة
        const validIds = col.customerIds.filter(id => {
          const isValid = existingCustomerIds.has(id);
          if (!isValid) {
            console.warn(`⚠️ [SYNC] إزالة معرف غير موجود من "${col.title}": ${id}`);
            needsUpdate = true;
          }
          return isValid;
        });
        
        // ✅ إزالة التكرارات داخل العمود
        const uniqueIds = [...new Set(validIds)];
        if (uniqueIds.length !== validIds.length) {
          console.warn(`⚠️ [SYNC] تم إزالة ${validIds.length - uniqueIds.length} تكرار من "${col.title}"`);
          needsUpdate = true;
        }
        
        // ✅ إزالة التكرارات عبر الأعمدة (عميل في أكثر من عمود)
        const finalIds = uniqueIds.filter(id => {
          if (usedIds.has(id)) {
            console.warn(`⚠️ [SYNC] إزالة معرف مكرر عبر الأعمدة من "${col.title}": ${id}`);
            needsUpdate = true;
            return false;
          }
          usedIds.add(id);
          return true;
        });
        
        return {
          ...col,
          customerIds: finalIds
        };
      });
      
      // إضافة العملاء الجدد (غير الموجودين في أي عمود) إلى "عملاء جدد"
      const newCustomers = customers.filter(c => !customerIdsInColumns.has(c.id));
      if (newCustomers.length > 0) {
        console.log(`✨ [SYNC] وجدت ${newCustomers.length} عميل جديد، إضافتهم لعمود "عملاء جدد"`);
        console.log('📋 [SYNC] معرفات العملاء الجدد:', newCustomers.map(c => c.id));
        
        const newColumnIndex = updatedColumns.findIndex(col => col.id === 'new');
        if (newColumnIndex !== -1) {
          // ✅ استخدام Set لإزالة التكرار
          const existingIdsInNewColumn = new Set(updatedColumns[newColumnIndex].customerIds);
          const trulyNewIds = newCustomers.map(c => c.id).filter(id => !existingIdsInNewColumn.has(id));
          
          if (trulyNewIds.length > 0) {
            console.log(`✅ [SYNC] إضافة ${trulyNewIds.length} معرف جديد فريد لعمود "عملاء جدد"`);
            updatedColumns[newColumnIndex] = {
              ...updatedColumns[newColumnIndex],
              customerIds: [
                ...updatedColumns[newColumnIndex].customerIds,
                ...trulyNewIds
              ]
            };
            needsUpdate = true;
          } else {
            console.log('ℹ️ [SYNC] جميع العملاء الجدد موجودون بالفعل في عمود "عملاء جدد"');
          }
        }
      }
      
      if (needsUpdate) {
        console.log('✅ [SYNC] تم تحديث الأعمدة');
        return updatedColumns;
      } else {
        console.log('✅ [SYNC] الأعمدة متزامنة بالفعل');
        return prevColumns;
      }
    });
  }, [customers]);

  // ✅ حفظ الأعمدة في localStorage عند تغييرها - مع debounce لتجنب re-render المستمر
  useEffect(() => {
    if (typeof window !== 'undefined' && columns.length > 0) {
      // ✅ استخدام setTimeout للتأخير وتجنب التحديث المستمر
      const timeoutId = setTimeout(() => {
        localStorage.setItem('crm-kanban-columns', JSON.stringify(columns));
        console.log('💾 تم حفظ الأعمدة في localStorage');
      }, 500); // تأخير 500ms
      
      return () => clearTimeout(timeoutId);
    }
  }, [columns]);

  // تحميل التعيينات من localStorage عند بدء التشغيل
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const assignments = JSON.parse(localStorage.getItem('crm-customer-assignments') || '[]');
      
      setCustomers(prev => prev.map(customer => {
        const assignment = assignments.find((a: any) => a.customerId === customer.id);
        if (assignment) {
          return { ...customer, assignedTo: assignment.assignedToName };
        }
        return customer;
      }));
    }
  }, []);

  // 🔗 تحميل العملاء من نظام customersManager (دمج مع البيانات الموجودة)
  useEffect(() => {
    const loadCustomersFromManager = () => {
      const savedCustomers = getAllCustomers();
      
      if (savedCustomers.length > 0) {
        setCustomers(prev => {
          // دمج العملاء المحفوظين مع العملاء الموجودين
          const existingIds = prev.map(c => c.id);
          const newCustomers = savedCustomers.filter(c => !existingIds.includes(c.id));
          
          console.log(`✅ تم تحميل ${newCustomers.length} عميل جديد من customersManager`);
          console.log(`📊 إجمالي العملاء قبل الدمج: ${prev.length}`);
          console.log(`📊 إجمالي العملاء في customersManager: ${savedCustomers.length}`);
          
          // ✅ إضافة العملاء الجدد إلى عمود "عملاء جدد" تلقائياً - مع التحقق من عدم التكرار
          if (newCustomers.length > 0) {
            setColumns(prevColumns => {
              // ✅ جمع جميع معرفات العملاء الموجودة في جميع الأعمدة
              const allExistingCustomerIds = prevColumns.flatMap(col => col.customerIds);
              
              // ✅ فلترة العملاء الجدد - استبعاد من هم موجودين بالفعل في أي عمود
              const trulyNewCustomerIds = newCustomers
                .map(c => c.id)
                .filter(id => !allExistingCustomerIds.includes(id));
              
              console.log(`🔍 فحص التكرار: ${newCustomers.length} عملاء جدد، ${trulyNewCustomerIds.length} غير موجودين مسبقاً`);
              
              // ✅ إضافة فقط العملاء غير الموجودين في أي عمود
              if (trulyNewCustomerIds.length > 0) {
                console.log(`✅ إضافة ${trulyNewCustomerIds.length} عميل جديد إلى عمود "عملاء جدد"`);
                return prevColumns.map(col => 
                  col.id === 'new' 
                    ? { ...col, customerIds: [...col.customerIds, ...trulyNewCustomerIds] }
                    : col
                );
              }
              
              console.log('ℹ️ جميع العملاء موجودين مسبقاً - لا حاجة للإضافة');
              return prevColumns;
            });
          }
          
          const mergedCustomers = [...prev, ...newCustomers.map(c => {
            const convertedType = (c.category === 'مالك' || c.category === 'بائع') ? 'seller' as CustomerType : 
                  c.category === 'مشتري' ? 'buyer' as CustomerType :
                  c.category === 'مؤجر' ? 'lessor' as CustomerType :
                  c.category === 'مستأجر' ? 'tenant' as CustomerType :
                  c.category === 'تمويل' ? 'finance' as CustomerType : 
                  c.category === 'آخر' ? 'other' as CustomerType :
                  'other' as CustomerType; // fallback نهائي
            
            console.log(`✅ تحويل عميل: ${c.name} - category: "${c.category}" → type: "${convertedType}"`);
            
            return {
              ...c,
              type: convertedType,
              interestLevel: c.interestLevel || 'moderate' as InterestLevel,
              activities: c.activities || []
            };
          })];
          
          console.log(`📊 إجمالي العملاء بعد الدمج: ${mergedCustomers.length}`);
          
          return mergedCustomers;
        });
      }
    };
    
    loadCustomersFromManager();
    
    // الاستماع لتحديثات العملاء
    const handleCustomersUpdated = () => {
      console.log('🔔 تم استقبال حدث customersUpdated');
      loadCustomersFromManager();
    };
    
    window.addEventListener('customersUpdated', handleCustomersUpdated);
    
    return () => {
      window.removeEventListener('customersUpdated', handleCustomersUpdated);
    };
  }, []);

  // 🔗 الاستماع لحدث openCustomerByPhone - فتح بطاقة العميل برقم الجوال
  useEffect(() => {
    const handleOpenCustomerByPhone = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { phone } = customEvent.detail;
      
      if (!phone) return;
      
      // البحث عن العميل برقم الجوال
      const customer = customers.find(c => {
        const customerCleanPhone = c.phone.replace(/[\s\-\(\)]/g, '');
        const searchCleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return customerCleanPhone === searchCleanPhone || 
               customerCleanPhone.endsWith(searchCleanPhone.slice(-9)) ||
               searchCleanPhone.endsWith(customerCleanPhone.slice(-9));
      });
      
      if (customer) {
        // فتح بطاقة العميل
        setSelectedCustomerId(customer.id);
        onNavigate(`customer-details/${customer.id}`);
        console.log('✅ تم التنقل لصفحة العميل:', customer.name);
      } else {
        console.log('⚠️ لم يتم العثور على عميل برقم الجوال:', phone);
      }
    };
    
    window.addEventListener('openCustomerByPhone', handleOpenCustomerByPhone);
    
    return () => {
      window.removeEventListener('openCustomerByPhone', handleOpenCustomerByPhone);
    };
  }, [customers]);

  // 🔔 الاستماع لحدث navigateToCustomer - الانتقال من الإشعارات
  useEffect(() => {
    const handleNavigateToCustomer = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { customerId, customerPhone } = customEvent.detail;
      
      // محاولة البحث بالـ ID أولاً
      let customer = customers.find(c => c.id === customerId);
      
      // إذا لم نجد بالـ ID، نبحث برقم الجوال
      if (!customer && customerPhone) {
        customer = customers.find(c => {
          const customerCleanPhone = c.phone.replace(/[\s\-\(\)]/g, '');
          const searchCleanPhone = customerPhone.replace(/[\s\-\(\)]/g, '');
          return customerCleanPhone === searchCleanPhone || 
                 customerCleanPhone.endsWith(searchCleanPhone.slice(-9)) ||
                 searchCleanPhone.endsWith(customerCleanPhone.slice(-9));
        });
      }
      
      if (customer) {
        // فتح بطاقة العميل
        setSelectedCustomerId(customer.id);
        onNavigate(`customer-details/${customer.id}`);
        console.log('🔔 تم التنقل لصفحة العميل من الإشعار:', customer.name);
      } else {
        console.log('⚠️ لم يتم العثور على عميل:', { customerId, customerPhone });
      }
    };
    
    window.addEventListener('navigateToCustomer', handleNavigateToCustomer);
    
    return () => {
      window.removeEventListener('navigateToCustomer', handleNavigateToCustomer);
    };
  }, [customers]);

  // 💾 حفظ الأعمدة في localStorage عند تغييرها - مع إزالة التكرارات
  useEffect(() => {
    if (typeof window !== 'undefined' && columns.length > 0) {
      // ✅ إزالة التكرارات من كل عمود قبل الحفظ
      const cleanedColumns = columns.map(col => ({
        ...col,
        customerIds: [...new Set(col.customerIds)] // إزالة التكرارات
      }));
      
      // ✅ التحقق من عدم وجود نفس العميل في أكثر من عمود
      const allCustomerIds = cleanedColumns.flatMap(col => col.customerIds);
      const uniqueCustomerIds = new Set(allCustomerIds);
      
      if (allCustomerIds.length !== uniqueCustomerIds.size) {
        console.warn('⚠️ تم اكتشاف تكرارات في الأعمدة! سيتم تنظيفها...');
        
        // إزالة التكرارات: إذا كان العميل في أكثر من عمود، نبقيه في أول عمود فقط
        const seenIds = new Set<string>();
        const finalColumns = cleanedColumns.map(col => ({
          ...col,
          customerIds: col.customerIds.filter(id => {
            if (seenIds.has(id)) {
              console.log(`🧹 إزالة تكرار: ${id} من عمود ${col.id}`);
              return false;
            }
            seenIds.add(id);
            return true;
          })
        }));
        
        localStorage.setItem('crm-kanban-columns', JSON.stringify(finalColumns));
      } else {
        localStorage.setItem('crm-kanban-columns', JSON.stringify(cleanedColumns));
      }
    }
  }, [columns]);

  // 🔔 تحديث عدد الإشعارات غير المقروءة
  useEffect(() => {
    const updateNotificationsCount = () => {
      const count = getUnreadNotificationsCount();
      setUnreadNotificationsCount(count);
      console.log('🔔 تم تحديث عدد الإشعارات:', count);
    };

    // تحديث أولي
    updateNotificationsCount();

    // الاستماع لتحديثات الإشعارات
    const handleNotificationsUpdate = () => {
      updateNotificationsCount();
    };

    window.addEventListener('notificationsUpdated', handleNotificationsUpdate);

    return () => {
      window.removeEventListener('notificationsUpdated', handleNotificationsUpdate);
    };
  }, []);

  // ✅ نظام التمرير التلقائي
  useEffect(() => {
    if (!activeId) return;

    let animationFrameId: number;
    const scrollSpeed = 10;
    const threshold = 100;

    const handleAutoScroll = (e: MouseEvent | TouchEvent) => {
      const container = document.querySelector('.kanban-columns-container') as HTMLElement;
      if (!container) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const rect = container.getBoundingClientRect();

      // تمرير أفقي (للأعمدة)
      if (clientX < rect.left + threshold) {
        container.scrollLeft -= scrollSpeed;
      } else if (clientX > rect.right - threshold) {
        container.scrollLeft += scrollSpeed;
      }

      // تمرير عمودي (للبطاقات)
      if (clientY < rect.top + threshold) {
        container.scrollTop -= scrollSpeed;
      } else if (clientY > rect.bottom - threshold) {
        container.scrollTop += scrollSpeed;
      }

      animationFrameId = requestAnimationFrame(() => handleAutoScroll(e));
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      cancelAnimationFrame(animationFrameId);
      handleAutoScroll(e);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeId]);

  // إعدادات السحب والإفلات - دعم الفأرة واللمس
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // بكسل قبل بدء السحب
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // مللي ثانية قبل بدء السحب (للسماح بالتمرير)
        tolerance: 8, // تحمل الحركة قبل إلغاء السحب
      },
    })
  );

  // FILTERING & SEARCH
  const filteredCustomers = useMemo(() => {
    const filtered = customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           customer.phone.includes(searchQuery) ||
                           (customer.tags && customer.tags.some(tag => tag.includes(searchQuery)));
      
      // ✅ التحقق من type أو category (لأن customersManager يستخدم category)
      const matchesFilter = filterType === 'all' || 
                           customer.type === filterType || 
                           (customer.category && customer.category !== '');
      
      return matchesSearch && matchesFilter;
    });
    
    console.log('🔍 [FILTER] عدد العملاء قبل الفلترة:', customers.length);
    console.log('🔍 [FILTER] عدد العملاء بعد الفلترة:', filtered.length);
    console.log('🔍 [FILTER] نوع الفلتر:', filterType);
    console.log('🔍 [FILTER] نص البحث:', searchQuery);
    
    return filtered;
  }, [customers, searchQuery, filterType]);

  // DRAG & DROP HANDLERS
  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id as string;
    setActiveId(activeId);
    
    // تحديد نوع السحب (عمود أو بطاقة)
    const isColumn = columns.some(col => col.id === activeId);
    setDragType(isColumn ? 'column' : 'card');
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event;
    const overId = over?.id as string || null;
    setOverId(overId);
    
    if (!over || !active) {
      setDragOverIndex(null);
      setDragOverColumnId(null);
      return;
    }

    // حساب مؤشر التوسع
    if (dragType === 'column') {
      // توسع بين الأعمدة
      const overIndex = columns.findIndex(col => col.id === overId);
      if (overIndex !== -1) {
        setDragOverIndex(overIndex);
      }
    } else if (dragType === 'card') {
      // ✅ توسع بين البطاقات - إصلاح الخط الأخضر
      const activeId = active.id as string;
      
      // البحث عن العمود الذي يحتوي البطاقة المسحوبة فوقها
      const columnIndex = columns.findIndex(col => 
        col.id === overId || col.customerIds.includes(overId)
      );
      
      if (columnIndex !== -1) {
        const column = columns[columnIndex];
        setDragOverColumnId(column.id);
        
        // إذا كنا فوق بطاقة، احسب موضعها
        const cardIndex = column.customerIds.indexOf(overId);
        if (cardIndex !== -1) {
          setDragOverIndex(cardIndex);
        } else if (column.id === overId) {
          // إذا كنا فوق العمود نفسه (منطقة فارغة)
          setDragOverIndex(column.customerIds.length);
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    setDragOverIndex(null);
    setDragOverColumnId(null);
    setDragType(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeData = active.data.current;
    const overData = over.data.current;

    // سحب الأعمدة
    if (activeData?.type === 'column' || columns.some(col => col.id === activeId)) {
      const oldIndex = columns.findIndex(col => col.id === activeId);
      const newIndex = columns.findIndex(col => col.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setColumns(arrayMove(columns, oldIndex, newIndex));
      }
      return;
    }

    // سحب البطاقات
    const activeColumnIndex = columns.findIndex(col => col.customerIds.includes(activeId));
    const overColumnIndex = columns.findIndex(col => col.id === overId || col.customerIds.includes(overId));

    if (activeColumnIndex === -1 || overColumnIndex === -1) return;

    if (activeColumnIndex !== overColumnIndex) {
      // نقل بين الأعمدة
      setColumns(cols => {
        const newCols = [...cols];
        newCols[activeColumnIndex].customerIds = newCols[activeColumnIndex].customerIds.filter(id => id !== activeId);
        
        if (overData?.type === 'column') {
          newCols[overColumnIndex].customerIds = [activeId, ...newCols[overColumnIndex].customerIds];
        } else {
          const overCardIndex = newCols[overColumnIndex].customerIds.indexOf(overId);
          newCols[overColumnIndex].customerIds.splice(overCardIndex + 1, 0, activeId);
        }
        
        return newCols;
      });
    } else {
      // إعادة ترتيب داخل نفس العمود
      setColumns(cols => {
        const newCols = [...cols];
        const columnCustomers = [...newCols[activeColumnIndex].customerIds];
        const oldIndex = columnCustomers.indexOf(activeId);
        const newIndex = columnCustomers.indexOf(overId);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          newCols[activeColumnIndex].customerIds = arrayMove(columnCustomers, oldIndex, newIndex);
        }
        
        return newCols;
      });
    }
  };

  const totalCustomers = customers.length;

  // معالج الإبلاغ
  const handleReport = (customerId: string) => {
    setReportingCustomerId(customerId);
    setShowReportModal(true);
  };

  // معالج التفاصيل
  const handleShowDetails = (customerId: string) => {
    setSelectedCustomerId(customerId);
    
    // 🔴 إزالة علامة غير المشاهد عند فتح التفاصيل
    markCustomerAsRead(customerId);
    
    onNavigate(`customer-details/${customerId}`);
  };

  // ✅ معالج الحذف
  const handleDelete = (customerId: string) => {
    deleteCustomer(customerId);
    // تحديث القائمة بعد الحذف
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  // معالج الأرشيف
  const handleArchiveCustomer = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setArchivedCustomers([...archivedCustomers, customer]);
      setCustomers(customers.filter(c => c.id !== customerId));
      // تحديث الأعمدة
      setColumns(columns.map(col => ({
        ...col,
        customerIds: col.customerIds.filter(id => id !== customerId)
      })));
    }
  };

  // معالج الاستعادة من الأرشيف
  const handleRestoreCustomer = (customerId: string) => {
    const customer = archivedCustomers.find(c => c.id === customerId);
    if (customer) {
      setCustomers([...customers, customer]);
      setArchivedCustomers(archivedCustomers.filter(c => c.id !== customerId));
      // إضافة للعمود الأول
      if (columns.length > 0) {
        setColumns(columns.map((col, index) => 
          index === 0 
            ? { ...col, customerIds: [...col.customerIds, customerId] }
            : col
        ));
      }
    }
  };

  // 📞 معالج استيراد المكالمات من الجهاز
  const handleCallsImported = (calls: RecentCall[]) => {
    // دمج المكالمات مع العملاء الموجودين
    const mergedCustomers = mergeCallsWithCRM(calls, customers);
    setCustomers(mergedCustomers);

    // تحديث عمود "الاتصالات الأخيرة"
    const recentCallsColumn = columns.find(col => col.id === 'recent-calls');
    if (recentCallsColumn) {
      // الحصول على IDs الجدد فقط (الذين تم إضافتهم من المكالمات)
      const newCustomerIds = mergedCustomers
        .filter(c => calls.some(call => call.id === c.id))
        .map(c => c.id);

      setColumns(columns.map(col => 
        col.id === 'recent-calls'
          ? { ...col, customerIds: [...new Set([...newCustomerIds, ...col.customerIds])] }
          : col
      ));

      alert(`✅ تم استيراد ${calls.length} اتصال بنجاح!`);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300" 
      dir="rtl"
      style={{
        marginLeft: leftSidebarOpen ? "350px" : "0"
      }}
    >
      {/* Header - نسخة طبق الأصل من SimpleDashboard */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#01411C] via-[#065f41] to-[#01411C] backdrop-blur-md border-b-2 border-[#D4AF37] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          {/* الصف الأول - الأزرار والشعار */}
          <div className="flex items-center justify-between mb-3">
            {/* Right: Back Button + Burger Menu */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => onNavigate("dashboard")}
                className="flex items-center gap-2 text-white hover:text-[#D4AF37] hover:bg-white/10"
              >
                <ArrowRight className="w-5 h-5" />
                <span className="hidden sm:inline">العودة</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setRightMenuOpen(true)}
                className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all bg-white/10 text-white"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            {/* Center: Logo */}
            <div className="flex-1 text-center">
              <div className="inline-flex items-center gap-3 bg-white/10 text-white px-6 py-2 rounded-full shadow-lg border-2 border-[#D4AF37] backdrop-blur-sm">
                <Users className="w-6 h-6" />
                <span className="font-bold text-lg">إدارة العملاء</span>
              </div>
            </div>

            {/* Left: Left Sidebar Icon + Bell */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLeftSidebarOpen(true)}
                className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all bg-white/10 text-white"
              >
                <PanelLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setNotificationsOpen(true)}
                className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all relative bg-white/10 text-white"
              >
                <Bell className="w-5 h-5" />
                {/* عداد الإشعارات الجديدة */}
                {unreadNotificationsCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse px-1">
                    <span className="text-white text-xs font-bold">
                      {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                    </span>
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* الصف ال��اني - البطاقة المصغرة مع السبيكة */}
          {user && (
            <div className="flex items-center justify-center">
              <MiniUserCard 
                currentUser={user} 
                onClick={() => setRightMenuOpen(true)}
              />
            </div>
          )}
        </div>
      </header>

      {/* شريط الأدوات العلوي - فوق الكانبان */}
      <div className="bg-white border-b-2 border-[#D4AF37] shadow-md sticky top-[72px] z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2 w-full pb-2">
            {/* عداد العملاء */}
            <div className="px-4 py-2 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-lg flex items-center gap-2 shrink-0">
              <Users className="w-4 h-4" />
              <span className="font-bold">{totalCustomers}</span>
              <span className="text-xs">عميل</span>
            </div>

            {/* أزرار التصفية */}
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
              className="shrink-0"
            >
              الكل
            </Button>
            <Button
              variant={filterType === 'buyer' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('buyer')}
              className="shrink-0"
            >
              مشتري
            </Button>
            <Button
              variant={filterType === 'seller' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('seller')}
              className="shrink-0"
            >
              بائع
            </Button>

            {/* زر مزامنة الاتصالات */}
            <CallSyncButton
              onCallsImported={handleCallsImported}
              onError={(error) => alert(error)}
            />

            {/* زر إضافة عميل */}
            <Button
              variant="default"
              size="sm"
              className="bg-[#01411C] hover:bg-[#065f41] shrink-0"
            >
              <UserPlus className="w-4 h-4 ml-1" />
              إضافة عميل
            </Button>

            {/* زر إضافة قائمة */}
            <Button
              variant="outline"
              size="sm"
              className="border-[#D4AF37] text-[#01411C] shrink-0"
            >
              <ListPlus className="w-4 h-4 ml-1" />
              إضافة قائمة
            </Button>

            {/* ز�� الإعدادات */}
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>

            {/* زر المعين إليه */}
            {user?.type !== 'individual' && (
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0"
              >
                <UserCheck className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* شريط البحث الذهبي */}
          <div className="flex gap-2 mt-3">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="ابحث عن عميل بالاسم، الهاتف، أو العلامات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 border-2 border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            <Button variant="outline" className="border-[#D4AF37]">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* منطقة الكانبان */}
      <div className="container mx-auto px-4 py-6 pb-24">
        
        <DndContext 
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <SortableContext items={columns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
            <div className="kanban-columns-container flex overflow-x-auto pb-4" style={{ gap: '16px' }}>
              {columns.map((column, index) => {
                // ✅ خط أخضر ملكي عمودي بدلاً من التوسع
                const showGreenLineBefore = dragType === 'column' && dragOverIndex === index && activeId !== column.id;
                
                // حساب drag over card index للعمود الحالي
                const columnDragOverCardIndex = dragType === 'card' && dragOverColumnId === column.id ? dragOverIndex : null;

                return (
                  <React.Fragment key={column.id}>
                    {/* مساف�� توسع ديناميكية بين الأعمدة */}
                    {showGreenLineBefore && (
                      <div className="relative shrink-0" style={{ width: '6px', minHeight: '500px' }}>
                        <div 
                        className="absolute inset-0 rounded-full bg-gradient-to-b from-[#01411C] via-[#22c55e] to-[#01411C] shadow-lg animate-pulse"
                        style={{
                          boxShadow: '0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(1, 65, 28, 0.6)'
                        }} />
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#22c55e] border-2 border-[#01411C]" style={{
                          boxShadow: '0 0 12px rgba(34, 197, 94, 0.9)'
                        }} />
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#22c55e] border-2 border-[#01411C]" style={{
                          boxShadow: '0 0 12px rgba(34, 197, 94, 0.9)'
                        }} />
                      </div>
                    )}
                    
                    <SortableKanbanColumn
                      column={column}
                      customers={filteredCustomers}
                      onAddCustomer={(columnId) => console.log('إضافة عميل:', columnId)}
                      expandedCustomerId={expandedCustomerId}
                      onExpandCustomer={setExpandedCustomerId}
                      onUpdateCustomer={(customer) => {
                        setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
                      }}
                      isDragOverColumn={dragOverColumnId === column.id}
                      isAnyDragging={activeId !== null}
                      dragOverCardIndex={columnDragOverCardIndex}
                      onReport={handleReport}
                      onShowDetails={handleShowDetails}
                      onDelete={handleDelete}
                      onAssign={(customerId) => {
                        setSelectedCustomerId(customerId);
                        setShowAssignModal(true);
                      }}
                    />
                  </React.Fragment>
                );
              })}

              {/* ✅ خط أخضر في النهاية */}
              {dragType === 'column' && dragOverIndex === columns.length && (
                <div className="relative shrink-0" style={{ width: '6px', minHeight: '500px' }}>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#01411C] via-[#22c55e] to-[#01411C] shadow-lg animate-pulse" style={{
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(1, 65, 28, 0.6)'
                  }} />
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#22c55e] border-2 border-[#01411C]" style={{
                    boxShadow: '0 0 12px rgba(34, 197, 94, 0.9)'
                  }} />
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#22c55e] border-2 border-[#01411C]" style={{
                    boxShadow: '0 0 12px rgba(34, 197, 94, 0.9)'
                  }} />
                </div>
              )}

              {/* زر إضافة عمود */}
              <button className="min-w-[280px] h-[120px] border-2 border-dashed border-gray-300 rounded-xl hover:border-[#D4AF37] hover:bg-[#fffef7] transition-all flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-[#01411C] shrink-0">
                <Plus className="w-8 h-8" />
                <span className="font-bold">إضافة عمود جديد</span>
              </button>
            </div>
          </SortableContext>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeId && columns.some(col => col.id === activeId) ? (
              <div className="bg-gray-100 rounded-xl p-4 min-w-[320px] border-2 border-[#D4AF37] shadow-2xl opacity-80">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <h3 className="font-bold text-gray-800">
                    {columns.find(col => col.id === activeId)?.title}
                  </h3>
                </div>
              </div>
            ) : activeId ? (
              <div className="bg-white rounded-lg p-4 shadow-2xl border-2 border-blue-500 opacity-80">
                <p className="font-bold">
                  {customers.find(c => c.id === activeId)?.name}
                </p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* نموذج الإبلاغ */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-red-600">الإبلاغ عن عميل</h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* اختيار نوع الإبلاغ */}
            <div className="mb-4">
              <label className="font-bold text-gray-700 mb-2 block">نوع الإبلاغ</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">اختر نوع الإبلاغ</option>
                {REPORT_TYPES.map(type => (
                  <option key={type.id} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* سبب الإبلاغ */}
            <div className="mb-4">
              <label className="font-bold text-gray-700 mb-2 block">سبب الإبلاغ</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[100px]"
                placeholder="اكتب سبب الإبلاغ بالتفصيل..."
              />
            </div>

            {/* رفع الصور */}
            <div className="mb-4">
              <label className="font-bold text-gray-700 mb-2 block">رفع صور كإثبات (حد أقصى 7 صور)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input type="file" multiple accept="image/*" className="hidden" id="report-images" />
                <label htmlFor="report-images" className="cursor-pointer">
                  <div className="text-gray-400 mb-2">
                    <FileText className="w-12 h-12 mx-auto" />
                  </div>
                  <p className="text-gray-600">انقر لرفع الصور</p>
                </label>
              </div>
            </div>

            {/* التحذير القانوني */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  <span className="font-bold">تحذير قانوني:</span> سيتم إرسال معلوماتك تلقائياً مع الإبلاغ. يجب أن لا يكون أمر الإبلاغ اتهاماً باطلاً أو زائفاً وستكون عرضة للمساءلة القانونية.
                </p>
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="flex gap-2">
              <Button
                onClick={() => setShowReportModal(false)}
                variant="outline"
                className="flex-1"
              >
                إلغاء
              </Button>
              <Button
                onClick={() => {
                  // معالجة الإبلاغ
                  setShowReportModal(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Send className="w-4 h-4 ml-2" />
                إرسال الإبلاغ
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* الشريط الجانبي الأيمن */}
      <RightSliderComplete
        isOpen={rightMenuOpen}
        onClose={() => setRightMenuOpen(false)}
        currentUser={user}
        onNavigate={onNavigate}
      />

      {/* ا��شريط الجانبي الأيسر */}
      <LeftSliderComplete
        isOpen={leftSidebarOpen}
        onClose={() => setLeftSidebarOpen(false)}
        currentUser={user}
        onNavigate={onNavigate}
        mode="tools"
      />

      {/* ❌ إزالة نظام التفاصيل الكاملة مع السلايدات - تم التحويل لصفحة كاملة */}

      {/* Modal تعيين العميل لزميل */}
      {showAssignModal && selectedCustomerId && (
        <AssignToTeamMemberModal
          customer={customers.find(c => c.id === selectedCustomerId)!}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedCustomerId(null);
          }}
          onAssign={(teamMemberId, teamMemberName) => {
            // تحديث العميل بالتعيين الجديد
            setCustomers(customers.map(c =>
              c.id === selectedCustomerId
                ? { ...c, assignedTo: teamMemberName }
                : c
            ));
            setShowAssignModal(false);
            setSelectedCustomerId(null);
          }}
        />
      )}

      {/* لوحة الإشعارات */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => {
          setNotificationsOpen(false);
          // تحديث عدد الإشعارات بعد الإغلاق
          const count = getUnreadNotificationsCount();
          setUnreadNotificationsCount(count);
        }}
      />

      {/* الشريط السفلي لإدارة الأعمال */}
      <CRMBottomBar
        onNavigate={(section) => {
          console.log('التنقل إلى:', section);
        }}
      />
    </div>
  );
}

// ============================================================
// 📋 ASSIGN TO TEAM MEMBER MODAL
// ============================================================

interface AssignToTeamMemberModalProps {
  customer: Customer;
  onClose: () => void;
  onAssign: (teamMemberId: string, teamMemberName: string) => void;
}

function AssignToTeamMemberModal({ customer, onClose, onAssign }: AssignToTeamMemberModalProps) {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  
  useEffect(() => {
    // تحميل الزملاء من localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crm-team-members');
      if (saved) {
        const members = JSON.parse(saved);
        setTeamMembers(members.filter((m: any) => m.active));
      } else {
        // بيانات تجريبية إذا لم يوجد زملاء محفوظين
        const defaultMembers = [
          {
            id: "1",
            name: "أحمد محمد الأحمد",
            email: "ahmed@example.com",
            phone: "0501234567",
            role: "مدير فرع",
            active: true
          },
          {
            id: "2",
            name: "فاطمة سالم الزهراني",
            email: "fatima@example.com",
            phone: "0507654321",
            role: "وسيط عقاري",
            active: true
          },
          {
            id: "3",
            name: "محمد عبدالله الشهري",
            email: "mohammed@example.com",
            phone: "0509876543",
            role: "مساعد وسيط",
            active: true
          }
        ];
        setTeamMembers(defaultMembers);
        localStorage.setItem('crm-team-members', JSON.stringify(defaultMembers));
      }
      
      // تحميل التعيين الحالي إذا كان موجوداً
      const assignments = JSON.parse(localStorage.getItem('crm-customer-assignments') || '[]');
      const currentAssignment = assignments.find((a: any) => a.customerId === customer.id);
      if (currentAssignment) {
        setSelectedMemberId(currentAssignment.assignedToId);
      }
    }
  }, [customer.id]);
  
  const handleAssign = () => {
    if (!selectedMemberId) {
      alert('الرجاء اختيار زميل');
      return;
    }
    
    const member = teamMembers.find(m => m.id === selectedMemberId);
    if (!member) return;
    
    // حفظ التعيين في localStorage
    const assignments = JSON.parse(localStorage.getItem('crm-customer-assignments') || '[]');
    const filteredAssignments = assignments.filter((a: any) => a.customerId !== customer.id);
    filteredAssignments.push({
      customerId: customer.id,
      assignedToId: member.id,
      assignedToName: member.name,
      assignedBy: 'current-user',
      assignedAt: new Date().toISOString()
    });
    localStorage.setItem('crm-customer-assignments', JSON.stringify(filteredAssignments));
    
    onAssign(member.id, member.name);
  };
  
  const handleUnassign = () => {
    // حذف التعيين من localStorage
    const assignments = JSON.parse(localStorage.getItem('crm-customer-assignments') || '[]');
    const filteredAssignments = assignments.filter((a: any) => a.customerId !== customer.id);
    localStorage.setItem('crm-customer-assignments', JSON.stringify(filteredAssignments));
    
    onAssign('', '');
  };
  
  // Modal التعيين مفتوح
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" 
      onClick={onClose}
      dir="rtl"
      style={{
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      {/* Modal Container - مقسم إلى 3 أقسام واضحة */}
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1️⃣ HEADER - ثابت في الأعلى */}
        <div className="flex items-center justify-between p-6 pb-4 border-b-2 border-[#D4AF37] bg-white shrink-0">
          <div className="flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-[#01411C]" />
            <h3 className="text-xl font-bold text-gray-800">تعيين العميل</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 hover:bg-gray-100 rounded-lg transition-all active:scale-90"
            style={{
              minHeight: '44px',
              minWidth: '44px',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* 2️⃣ CONTENT - قابل للتمرير */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* معلومات العميل */}
          <div className="bg-gradient-to-br from-[#fffef7] to-[#f0fdf4] border-2 border-[#D4AF37] rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#01411C] to-[#065f41] flex items-center justify-center text-white shrink-0">
                <span className="text-lg">{customer.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 truncate">{customer.name}</p>
                <p className="text-sm text-gray-600">{customer.phone}</p>
                {customer.assignedTo && (
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    معين حالياً لـ: {customer.assignedTo}
                  </p>
                )}
              </div>
            </div>
          </div>
        
          {/* قائمة الزملاء */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              اختر الزميل:
            </label>
            
            {teamMembers.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">لا يوجد زملاء مضافين</p>
                <p className="text-sm text-gray-500">
                  يمكنك إضافة زملاء من الإعدادات المتقدمة
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => {
                      setSelectedMemberId(member.id);
                    }}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedMemberId === member.id
                        ? 'bg-gradient-to-br from-[#01411C] to-[#065f41] text-white border-[#D4AF37] shadow-lg scale-105'
                        : 'bg-white border-gray-200 hover:border-[#D4AF37] hover:bg-gray-50 active:scale-95'
                    }`}
                    style={{ 
                      minHeight: '88px',
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation'
                    }}
                  >
                    <p className={`text-xl font-bold mb-2 ${
                      selectedMemberId === member.id ? 'text-white' : 'text-gray-900'
                    }`}>
                      {member.name}
                    </p>
                    <p className={`text-base ${
                      selectedMemberId === member.id ? 'text-white/90' : 'text-gray-600'
                    }`}>
                      {member.role}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* 3️⃣ FOOTER - ثابت في الأسفل */}
        <div className="p-6 pt-4 bg-white border-t-2 border-[#D4AF37] shrink-0">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-16 text-xl border-2 border-gray-300 hover:bg-gray-100 active:bg-gray-200 font-bold rounded-xl transition-all active:scale-95"
              style={{ 
                minHeight: '64px',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              إلغاء
            </button>
            
            <button
              type="button"
              onClick={handleAssign}
              disabled={!selectedMemberId || teamMembers.length === 0}
              className="flex-1 h-16 text-xl bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:from-[#065f41] hover:to-[#01411C] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-bold border-2 border-[#D4AF37] rounded-xl transition-all"
              style={{ 
                minHeight: '64px',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              تم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
