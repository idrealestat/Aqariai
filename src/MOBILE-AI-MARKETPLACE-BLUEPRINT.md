# 📱 **Mobile App + AI Marketplace Blueprint - Nova CRM**
## **From Web Platform to Mobile-First Experience**

---

## 📋 **MOBILE + MARKETPLACE OVERVIEW**

```
┌─────────────────────────────────────────────────────────────┐
│           NOVA MOBILE + AI MARKETPLACE ECOSYSTEM             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Mobile App:       React Native (iOS + Android)             │
│  State:            Zustand + React Query                    │
│  Offline:          WatermelonDB + Sync Engine               │
│  Real-time:        Socket.io + WebRTC                       │
│  AI Integration:   Embedded AI Assistant                    │
│  Marketplace:      Plugin ecosystem + Revenue share         │
│                                                              │
│  Timeline: 6 months                                          │
│  Investment: $300K-$600K                                    │
│  Expected Impact: +300% user engagement, +$1M ARR           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 **1. MOBILE APP ARCHITECTURE**

### **1.1: Technology Stack**

```typescript
// package.json
{
  "name": "nova-mobile",
  "version": "1.0.0",
  "main": "expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "submit:android": "eas submit -p android",
    "submit:ios": "eas submit -p ios",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    // Core
    "react": "18.2.0",
    "react-native": "0.74.0",
    "expo": "~51.0.0",
    
    // Navigation
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11",
    
    // State Management
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.17.0",
    
    // Offline Database
    "@nozbe/watermelondb": "^0.27.0",
    
    // Real-time
    "socket.io-client": "^4.6.1",
    
    // UI Components
    "react-native-paper": "^5.11.3",
    "nativewind": "^4.0.1",
    "react-native-reanimated": "~3.8.0",
    
    // Communication
    "@react-native-firebase/messaging": "^19.0.0",
    "react-native-webrtc": "^118.0.0",
    
    // AI
    "openai": "^4.26.0",
    
    // Media
    "expo-image-picker": "~15.0.0",
    "expo-camera": "~15.0.0",
    "expo-location": "~17.0.0",
    
    // Maps
    "react-native-maps": "1.14.0",
    
    // Payments
    "@stripe/stripe-react-native": "^0.35.0",
    
    // Analytics
    "@segment/analytics-react-native": "^2.18.0",
    "expo-tracking-transparency": "~4.0.0"
  },
  "devDependencies": {
    "@types/react": "~18.2.45",
    "@types/react-native": "~0.73.0",
    "typescript": "^5.3.0",
    "jest": "^29.7.0",
    "@testing-library/react-native": "^12.4.0"
  }
}
```

---

### **1.2: Project Structure**

```
mobile/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx              # Dashboard
│   │   ├── customers.tsx
│   │   ├── properties.tsx
│   │   ├── marketplace.tsx        # AI Marketplace
│   │   └── profile.tsx
│   ├── customers/
│   │   ├── [id].tsx               # Customer details
│   │   ├── add.tsx
│   │   └── edit/[id].tsx
│   ├── properties/
│   │   ├── [id].tsx
│   │   ├── add.tsx
│   │   └── edit/[id].tsx
│   ├── chat/
│   │   ├── index.tsx
│   │   └── [id].tsx
│   ├── video/
│   │   └── [callId].tsx
│   ├── ai-assistant/
│   │   └── index.tsx
│   ├── marketplace/
│   │   ├── index.tsx              # Browse plugins
│   │   ├── [pluginId].tsx         # Plugin details
│   │   └── my-plugins.tsx         # Installed plugins
│   └── _layout.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Avatar.tsx
│   │   └── LoadingSpinner.tsx
│   ├── customer/
│   │   ├── CustomerCard.tsx
│   │   ├── CustomerList.tsx
│   │   └── CustomerForm.tsx
│   ├── property/
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyList.tsx
│   │   └── PropertyForm.tsx
│   ├── chat/
│   │   ├── MessageBubble.tsx
│   │   ├── ChatInput.tsx
│   │   └── AIQuickReplies.tsx
│   ├── marketplace/
│   │   ├── PluginCard.tsx
│   │   ├── PluginList.tsx
│   │   └── PluginInstaller.tsx
│   └── shared/
│       ├── Header.tsx
│       ├── TabBar.tsx
│       └── SearchBar.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useCustomers.ts
│   ├── useProperties.ts
│   ├── useChat.ts
│   ├── useOffline.ts
│   ├── useSync.ts
│   ├── useAI.ts
│   └── useMarketplace.ts
├── services/
│   ├── api/
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── customers.ts
│   │   ├── properties.ts
│   │   ├── chat.ts
│   │   └── marketplace.ts
│   ├── database/
│   │   ├── schema.ts
│   │   ├── models/
│   │   │   ├── Customer.ts
│   │   │   ├── Property.ts
│   │   │   └── Message.ts
│   │   └── sync/
│   │       ├── SyncEngine.ts
│   │       └── ConflictResolver.ts
│   ├── socket/
│   │   └── SocketManager.ts
│   ├── ai/
│   │   ├── AIAssistant.ts
│   │   └── SmartReply.ts
│   ├── notifications/
│   │   └── PushNotifications.ts
│   └── analytics/
│       └── AnalyticsTracker.ts
├── store/
│   ├── authStore.ts
│   ├── customerStore.ts
│   ├── propertyStore.ts
│   ├── chatStore.ts
│   └── marketplaceStore.ts
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   └── helpers.ts
├── constants/
│   ├── Colors.ts
│   ├── Sizes.ts
│   └── Config.ts
├── types/
│   ├── index.ts
│   ├── customer.ts
│   ├── property.ts
│   ├── chat.ts
│   └── marketplace.ts
└── app.json
```

---

### **1.3: Offline-First Architecture**

```typescript
// services/database/schema.ts
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'customers',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'phone', type: 'string', isIndexed: true },
        { name: 'email', type: 'string', isOptional: true },
        { name: 'type', type: 'string' },
        { name: 'budget_min', type: 'number', isOptional: true },
        { name: 'budget_max', type: 'number', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'synced', type: 'boolean' },
        { name: 'deleted', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'properties',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'type', type: 'string' },
        { name: 'price', type: 'number' },
        { name: 'area', type: 'number' },
        { name: 'bedrooms', type: 'number', isOptional: true },
        { name: 'bathrooms', type: 'number', isOptional: true },
        { name: 'city', type: 'string' },
        { name: 'district', type: 'string' },
        { name: 'latitude', type: 'number', isOptional: true },
        { name: 'longitude', type: 'number', isOptional: true },
        { name: 'images', type: 'string' }, // JSON array
        { name: 'synced', type: 'boolean' },
        { name: 'deleted', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'messages',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true },
        { name: 'customer_id', type: 'string', isIndexed: true },
        { name: 'content', type: 'string' },
        { name: 'sender', type: 'string' }, // 'user' | 'customer' | 'ai'
        { name: 'type', type: 'string' }, // 'text' | 'image' | 'voice'
        { name: 'read', type: 'boolean' },
        { name: 'synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'sync_queue',
      columns: [
        { name: 'table_name', type: 'string' },
        { name: 'record_id', type: 'string' },
        { name: 'action', type: 'string' }, // 'create' | 'update' | 'delete'
        { name: 'data', type: 'string' }, // JSON
        { name: 'attempts', type: 'number' },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});
```

---

### **1.4: Sync Engine**

```typescript
// services/database/sync/SyncEngine.ts
import { database } from '../database';
import { Q } from '@nozbe/watermelondb';
import { apiClient } from '../../api/client';

export class SyncEngine {
  private isSyncing = false;
  private syncInterval: NodeJS.Timeout | null = null;

  async startAutoSync(intervalMs: number = 30000) {
    // Sync every 30 seconds
    this.syncInterval = setInterval(() => {
      this.sync();
    }, intervalMs);

    // Initial sync
    await this.sync();
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async sync() {
    if (this.isSyncing) return;

    try {
      this.isSyncing = true;

      // 1. Push local changes to server
      await this.pushChanges();

      // 2. Pull server changes
      await this.pullChanges();

      // 3. Resolve conflicts
      await this.resolveConflicts();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  private async pushChanges() {
    const syncQueue = await database.collections
      .get('sync_queue')
      .query(Q.sortBy('created_at', Q.asc))
      .fetch();

    for (const item of syncQueue) {
      try {
        const data = JSON.parse(item.data);

        switch (item.action) {
          case 'create':
            await apiClient.post(`/${item.table_name}`, data);
            break;
          case 'update':
            await apiClient.put(`/${item.table_name}/${item.record_id}`, data);
            break;
          case 'delete':
            await apiClient.delete(`/${item.table_name}/${item.record_id}`);
            break;
        }

        // Mark as synced and remove from queue
        await item.markAsDeleted();
      } catch (error) {
        // Increment attempts
        await database.write(async () => {
          await item.update((record) => {
            record.attempts += 1;
          });
        });

        // If too many attempts, mark as failed
        if (item.attempts >= 5) {
          console.error(`Failed to sync ${item.table_name} ${item.record_id} after 5 attempts`);
          // Could store in a failed queue for manual review
        }
      }
    }
  }

  private async pullChanges() {
    const lastSync = await this.getLastSyncTimestamp();

    // Pull changes from server
    const response = await apiClient.get('/sync/changes', {
      params: { since: lastSync },
    });

    const { customers, properties, messages } = response.data;

    await database.write(async () => {
      // Update customers
      for (const customer of customers) {
        await this.upsertRecord('customers', customer);
      }

      // Update properties
      for (const property of properties) {
        await this.upsertRecord('properties', property);
      }

      // Update messages
      for (const message of messages) {
        await this.upsertRecord('messages', message);
      }
    });

    // Update last sync timestamp
    await this.setLastSyncTimestamp(Date.now());
  }

  private async upsertRecord(tableName: string, data: any) {
    const collection = database.collections.get(tableName);
    
    // Try to find existing record
    const existingRecords = await collection
      .query(Q.where('server_id', data.id))
      .fetch();

    if (existingRecords.length > 0) {
      // Update existing
      const record = existingRecords[0];
      await record.update((r: any) => {
        Object.keys(data).forEach((key) => {
          if (key !== 'id' && r[key] !== undefined) {
            r[key] = data[key];
          }
        });
        r.synced = true;
        r.updated_at = Date.now();
      });
    } else {
      // Create new
      await collection.create((record: any) => {
        record.server_id = data.id;
        Object.keys(data).forEach((key) => {
          if (key !== 'id' && record[key] !== undefined) {
            record[key] = data[key];
          }
        });
        record.synced = true;
        record.created_at = Date.now();
        record.updated_at = Date.now();
      });
    }
  }

  private async resolveConflicts() {
    // Get records with conflicts (updated locally and on server)
    // For now, server wins (can be customized)
  }

  private async getLastSyncTimestamp(): Promise<number> {
    // Store in AsyncStorage or similar
    return 0; // Placeholder
  }

  private async setLastSyncTimestamp(timestamp: number) {
    // Store in AsyncStorage or similar
  }

  async addToSyncQueue(
    tableName: string,
    recordId: string,
    action: 'create' | 'update' | 'delete',
    data: any
  ) {
    const syncQueue = database.collections.get('sync_queue');
    
    await database.write(async () => {
      await syncQueue.create((record: any) => {
        record.table_name = tableName;
        record.record_id = recordId;
        record.action = action;
        record.data = JSON.stringify(data);
        record.attempts = 0;
        record.created_at = Date.now();
      });
    });
  }
}

export const syncEngine = new SyncEngine();
```

---

## 🎨 **2. MOBILE UI SCREENS**

### **2.1: Authentication Screen**

```typescript
// app/(auth)/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(phone, password);
      router.replace('/(tabs)');
    } catch (error) {
      // Show error
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>نوڤا CRM</Text>
        <Text style={styles.subtitle}>نظام إدارة العملاء الذكي</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="رقم الجوال"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          textAlign="right"
        />
        
        <TextInput
          style={styles.input}
          placeholder="كلمة المرور"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textAlign="right"
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => router.push('/(auth)/forgot-password')}
        >
          <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
        </TouchableOpacity>
      </View>

      {/* Register */}
      <View style={styles.register}>
        <Text style={styles.registerText}>ليس لديك حساب؟ </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.registerLink}>سجّل الآن</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#01411C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  form: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
  },
  loginButton: {
    backgroundColor: '#01411C',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#666666',
    fontSize: 14,
  },
  register: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#666666',
    fontSize: 14,
  },
  registerLink: {
    color: '#01411C',
    fontSize: 14,
    fontWeight: '600',
  },
});
```

---

### **2.2: Dashboard Screen**

```typescript
// app/(tabs)/index.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiClient.get('/dashboard/stats'),
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => apiClient.get('/dashboard/recent-activity'),
  });

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>مرحباً بك 👋</Text>
        <TouchableOpacity onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color="#01411C" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
          <Ionicons name="people" size={32} color="#2E7D32" />
          <Text style={styles.statValue}>{stats?.totalCustomers || 0}</Text>
          <Text style={styles.statLabel}>العملاء</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
          <Ionicons name="home" size={32} color="#1565C0" />
          <Text style={styles.statValue}>{stats?.totalProperties || 0}</Text>
          <Text style={styles.statLabel}>العقارات</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
          <Ionicons name="link" size={32} color="#E65100" />
          <Text style={styles.statValue}>{stats?.totalMatches || 0}</Text>
          <Text style={styles.statLabel}>المطابقات</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#FCE4EC' }]}>
          <Ionicons name="calendar" size={32} color="#C2185B" />
          <Text style={styles.statValue}>{stats?.todayAppointments || 0}</Text>
          <Text style={styles.statLabel}>المواعيد اليوم</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/customers/add')}
          >
            <Ionicons name="person-add" size={24} color="#01411C" />
            <Text style={styles.actionText}>عميل جديد</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/properties/add')}
          >
            <Ionicons name="add-circle" size={24} color="#01411C" />
            <Text style={styles.actionText}>عقار جديد</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/ai-assistant')}
          >
            <Ionicons name="sparkles" size={24} color="#D4AF37" />
            <Text style={styles.actionText}>مساعد ذكي</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/marketplace')}
          >
            <Ionicons name="apps" size={24} color="#01411C" />
            <Text style={styles.actionText}>السوق</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>النشاط الأخير</Text>
        {recentActivity?.map((activity: any) => (
          <TouchableOpacity key={activity.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons
                name={activity.icon}
                size={20}
                color="#01411C"
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#01411C',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#000000',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  section: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 8,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  activityTime: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
});
```

---

## 🤖 **3. AI MARKETPLACE SYSTEM**

### **3.1: Plugin Architecture**

```typescript
// types/marketplace.ts
export interface AIPlugin {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: PluginCategory;
  price: number;
  pricing_model: 'free' | 'one_time' | 'subscription' | 'usage_based';
  
  // Capabilities
  capabilities: PluginCapability[];
  
  // Integration
  endpoint?: string;
  webhook_url?: string;
  api_key_required: boolean;
  
  // Metadata
  developer: {
    id: string;
    name: string;
    website?: string;
  };
  
  // Stats
  installs: number;
  rating: number;
  reviews_count: number;
  
  // Status
  status: 'active' | 'pending' | 'suspended';
  verified: boolean;
  
  created_at: Date;
  updated_at: Date;
}

export enum PluginCategory {
  AI_ASSISTANT = 'ai_assistant',
  ANALYTICS = 'analytics',
  COMMUNICATION = 'communication',
  MARKETING = 'marketing',
  AUTOMATION = 'automation',
  INTEGRATION = 'integration',
  PRODUCTIVITY = 'productivity',
}

export enum PluginCapability {
  PROPERTY_DESCRIPTION = 'property_description',
  PRICE_PREDICTION = 'price_prediction',
  MARKET_ANALYSIS = 'market_analysis',
  LEAD_SCORING = 'lead_scoring',
  EMAIL_CAMPAIGN = 'email_campaign',
  SMS_AUTOMATION = 'sms_automation',
  SOCIAL_MEDIA = 'social_media',
  TRANSLATION = 'translation',
  IMAGE_ENHANCEMENT = 'image_enhancement',
  VIRTUAL_TOUR = 'virtual_tour',
}

export interface InstalledPlugin {
  id: string;
  user_id: string;
  plugin_id: string;
  plugin: AIPlugin;
  
  config: Record<string, any>;
  enabled: boolean;
  
  usage: {
    calls_this_month: number;
    total_calls: number;
    last_used_at?: Date;
  };
  
  subscription?: {
    status: 'active' | 'cancelled' | 'expired';
    current_period_start: Date;
    current_period_end: Date;
    cancel_at?: Date;
  };
  
  installed_at: Date;
}
```

---

### **3.2: Marketplace Backend**

```typescript
// backend/src/modules/marketplace/marketplace-manager.ts
export class MarketplaceManager {
  async listPlugins(filters?: {
    category?: PluginCategory;
    search?: string;
    verified?: boolean;
    priceMax?: number;
  }): Promise<AIPlugin[]> {
    const where: any = { status: 'active' };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.verified !== undefined) {
      where.verified = filters.verified;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.priceMax !== undefined) {
      where.price = { lte: filters.priceMax };
    }

    const plugins = await prisma.aiPlugin.findMany({
      where,
      include: {
        developer: {
          select: {
            id: true,
            name: true,
            website: true,
          },
        },
      },
      orderBy: [
        { verified: 'desc' },
        { rating: 'desc' },
        { installs: 'desc' },
      ],
    });

    return plugins;
  }

  async getPlugin(pluginId: string): Promise<AIPlugin | null> {
    const plugin = await prisma.aiPlugin.findUnique({
      where: { id: pluginId },
      include: {
        developer: true,
        reviews: {
          take: 10,
          orderBy: { created_at: 'desc' },
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
      },
    });

    return plugin;
  }

  async installPlugin(userId: string, pluginId: string): Promise<InstalledPlugin> {
    const plugin = await this.getPlugin(pluginId);
    if (!plugin) throw new Error('Plugin not found');

    // Check if already installed
    const existing = await prisma.installedPlugin.findFirst({
      where: { user_id: userId, plugin_id: pluginId },
    });

    if (existing) {
      throw new Error('Plugin already installed');
    }

    // Create installation
    const installation = await prisma.installedPlugin.create({
      data: {
        user_id: userId,
        plugin_id: pluginId,
        enabled: true,
        config: {},
        usage: {
          calls_this_month: 0,
          total_calls: 0,
        },
      },
      include: { plugin: true },
    });

    // Handle payment if required
    if (plugin.price > 0) {
      await this.processPluginPayment(userId, plugin);
    }

    // Track installation
    await prisma.aiPlugin.update({
      where: { id: pluginId },
      data: { installs: { increment: 1 } },
    });

    // Send welcome email/notification
    await this.sendPluginWelcome(userId, plugin);

    return installation;
  }

  async uninstallPlugin(userId: string, pluginId: string) {
    const installation = await prisma.installedPlugin.findFirst({
      where: { user_id: userId, plugin_id: pluginId },
    });

    if (!installation) {
      throw new Error('Plugin not installed');
    }

    // Cancel subscription if active
    if (installation.subscription?.status === 'active') {
      await this.cancelPluginSubscription(installation.id);
    }

    // Remove installation
    await prisma.installedPlugin.delete({
      where: { id: installation.id },
    });

    // Decrement install count
    await prisma.aiPlugin.update({
      where: { id: pluginId },
      data: { installs: { decrement: 1 } },
    });
  }

  async callPlugin(
    userId: string,
    pluginId: string,
    capability: PluginCapability,
    input: any
  ): Promise<any> {
    // Get installation
    const installation = await prisma.installedPlugin.findFirst({
      where: {
        user_id: userId,
        plugin_id: pluginId,
        enabled: true,
      },
      include: { plugin: true },
    });

    if (!installation) {
      throw new Error('Plugin not installed or disabled');
    }

    const plugin = installation.plugin;

    // Check if plugin supports capability
    if (!plugin.capabilities.includes(capability)) {
      throw new Error(`Plugin does not support ${capability}`);
    }

    // Check usage limits
    await this.checkUsageLimits(installation);

    // Call plugin endpoint
    const response = await fetch(plugin.endpoint!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Plugin-ID': plugin.id,
        'X-User-ID': userId,
        'X-API-Key': installation.config.api_key || '',
      },
      body: JSON.stringify({
        capability,
        input,
        config: installation.config,
      }),
    });

    const result = await response.json();

    // Track usage
    await this.trackPluginUsage(installation.id);

    return result;
  }

  private async checkUsageLimits(installation: InstalledPlugin) {
    const plugin = installation.plugin;

    if (plugin.pricing_model === 'usage_based') {
      const limit = installation.config.monthly_limit || 100;
      
      if (installation.usage.calls_this_month >= limit) {
        throw new Error('Monthly usage limit exceeded');
      }
    }
  }

  private async trackPluginUsage(installationId: string) {
    await prisma.installedPlugin.update({
      where: { id: installationId },
      data: {
        usage: {
          calls_this_month: { increment: 1 },
          total_calls: { increment: 1 },
          last_used_at: new Date(),
        },
      },
    });
  }

  private async processPluginPayment(userId: string, plugin: AIPlugin) {
    // Create payment intent
    // Process payment through payment gateway
    // Create subscription if needed
  }

  private async cancelPluginSubscription(installationId: string) {
    await prisma.installedPlugin.update({
      where: { id: installationId },
      data: {
        subscription: {
          status: 'cancelled',
          cancel_at: new Date(),
        },
      },
    });
  }

  private async sendPluginWelcome(userId: string, plugin: AIPlugin) {
    await prisma.notification.create({
      data: {
        userId,
        title: `تم تثبيت ${plugin.name}`,
        message: `يمكنك الآن استخدام ${plugin.name} في نوڤا CRM`,
        type: 'SYSTEM',
      },
    });
  }

  async ratePlugin(
    userId: string,
    pluginId: string,
    rating: number,
    review?: string
  ) {
    // Create review
    await prisma.pluginReview.create({
      data: {
        user_id: userId,
        plugin_id: pluginId,
        rating,
        review,
      },
    });

    // Update plugin rating
    const reviews = await prisma.pluginReview.findMany({
      where: { plugin_id: pluginId },
    });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.aiPlugin.update({
      where: { id: pluginId },
      data: {
        rating: avgRating,
        reviews_count: reviews.length,
      },
    });
  }
}
```

---

### **3.3: Marketplace Mobile UI**

```typescript
// app/(tabs)/marketplace.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MarketplaceScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: plugins, isLoading } = useQuery({
    queryKey: ['marketplace-plugins', selectedCategory],
    queryFn: () =>
      apiClient.get('/marketplace/plugins', {
        params: { category: selectedCategory },
      }),
  });

  const { data: myPlugins } = useQuery({
    queryKey: ['my-plugins'],
    queryFn: () => apiClient.get('/marketplace/my-plugins'),
  });

  const categories = [
    { id: 'all', name: 'الكل', icon: 'apps' },
    { id: 'ai_assistant', name: 'مساعد ذكي', icon: 'sparkles' },
    { id: 'analytics', name: 'تحليلات', icon: 'analytics' },
    { id: 'communication', name: 'تواصل', icon: 'chatbubbles' },
    { id: 'marketing', name: 'تسويق', icon: 'megaphone' },
    { id: 'automation', name: 'أتمتة', icon: 'flash' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>سوق الإضافات</Text>
        <TouchableOpacity onPress={() => router.push('/marketplace/my-plugins')}>
          <View style={styles.myPluginsButton}>
            <Ionicons name="cube" size={20} color="#01411C" />
            <Text style={styles.myPluginsText}>
              إضافاتي ({myPlugins?.length || 0})
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() =>
              setSelectedCategory(
                category.id === 'all' ? null : category.id
              )
            }
          >
            <Ionicons
              name={category.icon as any}
              size={20}
              color={
                selectedCategory === category.id ? '#FFFFFF' : '#01411C'
              }
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured Plugins */}
      {!selectedCategory && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 إضافات مميزة</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {plugins?.featured?.map((plugin: any) => (
              <TouchableOpacity
                key={plugin.id}
                style={styles.featuredCard}
                onPress={() =>
                  router.push(`/marketplace/${plugin.id}`)
                }
              >
                <Image source={{ uri: plugin.icon }} style={styles.pluginIcon} />
                <Text style={styles.pluginName}>{plugin.name}</Text>
                <Text style={styles.pluginCategory}>
                  {plugin.category}
                </Text>
                <View style={styles.pluginRating}>
                  <Ionicons name="star" size={14} color="#D4AF37" />
                  <Text style={styles.ratingText}>{plugin.rating}</Text>
                  <Text style={styles.installsText}>
                    ({plugin.installs} تثبيت)
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* All Plugins */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>جميع الإضافات</Text>
        <FlatList
          data={plugins?.data || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item: plugin }) => (
            <TouchableOpacity
              style={styles.pluginCard}
              onPress={() => router.push(`/marketplace/${plugin.id}`)}
            >
              <Image
                source={{ uri: plugin.icon }}
                style={styles.pluginCardIcon}
              />
              <View style={styles.pluginCardContent}>
                <View style={styles.pluginCardHeader}>
                  <Text style={styles.pluginCardName}>{plugin.name}</Text>
                  {plugin.verified && (
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  )}
                </View>
                <Text style={styles.pluginCardDescription} numberOfLines={2}>
                  {plugin.description}
                </Text>
                <View style={styles.pluginCardFooter}>
                  <View style={styles.pluginCardRating}>
                    <Ionicons name="star" size={14} color="#D4AF37" />
                    <Text style={styles.pluginCardRatingText}>
                      {plugin.rating}
                    </Text>
                  </View>
                  <Text style={styles.pluginCardPrice}>
                    {plugin.price === 0
                      ? 'مجاني'
                      : `${plugin.price} ر.س`}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>لا توجد إضافات</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#01411C',
  },
  myPluginsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  myPluginsText: {
    fontSize: 14,
    color: '#01411C',
    fontWeight: '500',
  },
  categoriesScroll: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#01411C',
  },
  categoryText: {
    fontSize: 14,
    color: '#01411C',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  section: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
  },
  featuredScroll: {
    gap: 12,
  },
  featuredCard: {
    width: 140,
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    alignItems: 'center',
  },
  pluginIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 8,
  },
  pluginName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  pluginCategory: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  pluginRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  installsText: {
    fontSize: 10,
    color: '#999999',
  },
  pluginCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 8,
  },
  pluginCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  pluginCardContent: {
    flex: 1,
  },
  pluginCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  pluginCardName: {
    fontSize: 16,
    fontWeight: '600',
  },
  pluginCardDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  pluginCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pluginCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pluginCardRatingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pluginCardPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#01411C',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999999',
    marginTop: 32,
  },
});
```

---

## 📊 **4. DEPLOYMENT & DISTRIBUTION**

### **4.1: App Configuration**

```json
// app.json
{
  "expo": {
    "name": "Nova CRM",
    "slug": "nova-crm",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#01411C"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.novacrm.app",
      "buildNumber": "1.0.0",
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses the camera to take photos of properties.",
        "NSPhotoLibraryUsageDescription": "This app accesses your photos to upload property images.",
        "NSLocationWhenInUseUsageDescription": "This app uses your location to find nearby properties."
      },
      "config": {
        "googleMapsApiKey": "YOUR_GOOGLE_MAPS_IOS_KEY"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#01411C"
      },
      "package": "com.novacrm.app",
      "versionCode": 1,
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ],
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_ANDROID_KEY"
        }
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/messaging",
      "expo-camera",
      "expo-location",
      [
        "expo-tracking-transparency",
        {
          "userTrackingPermission": "This app uses tracking to provide personalized real estate recommendations."
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

---

### **4.2: EAS Build Configuration**

```json
// eas.json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-asc-app-id",
        "appleTeamId": "YOUR_TEAM_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./service-account-key.json",
        "track": "production"
      }
    }
  }
}
```

---

## 📈 **5. DEPLOYMENT ROADMAP**

```markdown
═══════════════════════════════════════════════════════════════
           📅 6-MONTH MOBILE + MARKETPLACE ROADMAP
═══════════════════════════════════════════════════════════════

🎯 MONTH 1-2: CORE MOBILE DEVELOPMENT
├─ Week 1-2: Setup & Architecture
│  ├─ Initialize React Native project
│  ├─ Setup offline database (WatermelonDB)
│  ├─ Implement sync engine
│  └─ Configure navigation
│
├─ Week 3-4: Authentication & Core Screens
│  ├─ Login/Register screens
│  ├─ Dashboard
│  ├─ Customer list/detail
│  └─ Property list/detail
│
├─ Week 5-6: Real-time Features
│  ├─ Socket.io integration
│  ├─ Chat functionality
│  ├─ Push notifications
│  └─ Real-time sync
│
└─ Week 7-8: AI Integration
   ├─ Embedded AI assistant
   ├─ Smart reply
   ├��� Voice commands
   └─ Image recognition

🎯 MONTH 3-4: MARKETPLACE DEVELOPMENT
├─ Week 9-10: Marketplace Backend
│  ├─ Plugin architecture
│  ├─ Developer API
│  ├─ Payment integration
│  └─ Usage tracking
│
├─ Week 11-12: Marketplace UI
│  ├─ Browse plugins
│  ├─ Plugin details
│  ├─ Install/uninstall
│  └─ My plugins dashboard
│
├─ Week 13-14: First Party Plugins
│  ├─ Property description AI
│  ├─ Price prediction AI
│  ├─ Market analysis AI
│  └─ Translation plugin
│
└─ Week 15-16: Developer Portal
   ├─ Documentation
   ├─ SDK
   ├─ Testing tools
   └─ Analytics dashboard

🎯 MONTH 5: TESTING & OPTIMIZATION
├─ Week 17-18: Beta Testing
│  ├─ Internal testing (50 users)
│  ├─ Bug fixes
│  ├─ Performance optimization
│  └─ UX improvements
│
└─ Week 19-20: App Store Preparation
   ├─ App Store screenshots
   ├─ Descriptions (AR/EN)
   ├─ Privacy policy
   └─ Review submission

🎯 MONTH 6: LAUNCH & GROWTH
├─ Week 21-22: Soft Launch
│  ├─ Saudi Arabia only
│  ├─ 500 beta users
│  ├─ Monitor metrics
│  └─ Gather feedback
│
├─ Week 23: Full Launch
│  ├─ GCC countries
│  ├─ Marketing campaign
│  ├─ PR & media
│  └─ Influencer partnerships
│
└─ Week 24: Post-Launch
   ├─ 24/7 support
   ├─ Crash monitoring
   ├─ Usage analytics
   └─ Feature iterations

═══════════════════════════════════════════════════════════════
🎯 END OF 6 MONTHS:
├─ iOS + Android apps live
├─ 5,000+ downloads
├─ AI Marketplace (20+ plugins)
├─ Developer ecosystem active
├─ $200K+ additional ARR from mobile
═══════════════════════════════════════════════════════════════
```

---

📄 **File:** `/MOBILE-AI-MARKETPLACE-BLUEPRINT.md`  
🎯 **Purpose:** Mobile app + AI marketplace  
⏱️ **Timeline:** 6 months  
💰 **Investment:** $300K-$600K  
📱 **Target:** 5K+ downloads, $200K+ ARR
