// 🧠 Core System Exports
// نقطة الدخول المركزية لجميع الأنظمة الأساسية

// Kernel (نواة الذكاء الصناعي)
export { useKernel } from './kernel/useKernel';
export type { 
  AIAwarenessPayload, 
  KernelResponse, 
  UseKernelReturn 
} from './kernel/useKernel';

// Hooks (الهوكات الأساسية)
export { 
  useAIAwareness, 
  useAIAwarenessWithDebounce 
} from './hooks/useAIAwareness';

// Context (سياقات النظام)
export { 
  DashboardProvider, 
  useDashboardContext 
} from '../context/DashboardContext';
export type { DashboardContextType } from '../context/DashboardContext';

// Identity (هوية عقاري AI)
export {
  SYSTEM_ID,
  SYSTEM_ALIASES,
  AQAR_AI_TEMPLATES,
  formatAqarAIReply,
  formatAqarAIReplyWithEmoji,
  isCallingAqarAI,
  getTimeBasedGreeting,
  getContextAwareMessage
} from './identity/AqarAIIdentity';
export { default as AqarAIIdentity } from './identity/AqarAIIdentity';
