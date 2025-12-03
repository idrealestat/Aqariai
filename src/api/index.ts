/*
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                         📡 API Index - فهرس جميع الـ APIs                            ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

📋 الوصف: تجميع وتصدير جميع الـ APIs في مكان واحد
📅 تاريخ الإنشاء: 4 نوفمبر 2025
🎯 الهدف: تسهيل الوصول لجميع الـ APIs
*/

// ============================================
// Main APIs
// ============================================

export { default as BusinessCardAPI } from './businessCard';
export { default as SocialMediaAPI } from './socialMedia';
export { default as ArchiveAPI } from './archive';
export { default as CalendarAPI, getTodayAppointments } from './calendar';

// 🆕 Process AI Intent - JSON Pure Response
export { processAIIntent, AIResponse } from './kernel/processAIIntent';

// ============================================
// Existing APIs
// ============================================

export * from './customers';
export * from './offers';
export * from './requests';
export * from './analytics';
export * from './finance';

// ============================================
// Types Exports
// ============================================

// Business Card Types
export type {
  BusinessCard,
  BusinessCardCreateRequest,
  BusinessCardUpdateRequest,
  BusinessCardShareData,
  BusinessCardStats
} from './businessCard';

// Social Media Types
export type {
  PlatformType,
  PostStatus,
  SocialPlatform,
  MediaFile,
  SocialPost,
  PostAnalytics,
  PublishRequest,
  PublishResult
} from './socialMedia';

// Archive Types
export type {
  ArchiveItemType,
  ArchiveCategory,
  ArchiveStatus,
  ArchiveItem,
  ArchiveFile,
  ArchiveCreateRequest,
  ArchiveSearchQuery,
  ArchiveStats
} from './archive';

// Calendar Types (re-export from types/calendar.ts)
export type {
  CalendarEvent,
  NotificationSettings,
  VoiceCommand,
  AppointmentAnalytics
} from '../types/calendar';

// ============================================
// Combined API Object
// ============================================

import BusinessCardAPI from './businessCard';
import SocialMediaAPI from './socialMedia';
import ArchiveAPI from './archive';
import CalendarAPI from './calendar';

export const API = {
  businessCard: BusinessCardAPI,
  socialMedia: SocialMediaAPI,
  archive: ArchiveAPI,
  calendar: CalendarAPI
};

export default API;
