# ⚛️ **FRONTEND - Execution Prompt**
## **Nova CRM - React Frontend**

---

## 🎯 **OBJECTIVE**

Build a complete, production-ready React frontend for Nova CRM with:
- Next.js 14 App Router
- TypeScript for type safety
- TailwindCSS v4 for styling
- shadcn/ui components
- Real-time updates
- Full RTL support
- Responsive design (Mobile, Tablet, Desktop)

---

## 🏗️ **TECH STACK**

```yaml
Framework: Next.js 14 (App Router)
Language: TypeScript 5.x
Styling: TailwindCSS v4
UI Components: shadcn/ui + Radix UI
State Management: Zustand
Data Fetching: React Query / SWR
Forms: React Hook Form + Zod
Animation: Framer Motion
Icons: Lucide React
Charts: Recharts
Calendar: React Big Calendar
Drag & Drop: react-beautiful-dnd
Real-time: Socket.io Client
Storage: IndexedDB (idb)
Testing: Jest + React Testing Library + Playwright
```

---

## 📦 **PROJECT SETUP**

### **1. Initialize Project:**

```bash
# Create Next.js app
npx create-next-app@latest nova-crm-frontend --typescript --tailwind --app --src-dir

cd nova-crm-frontend

# Install dependencies
npm install zustand
npm install @tanstack/react-query
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react
npm install recharts
npm install framer-motion
npm install socket.io-client
npm install idb
npm install date-fns
npm install react-beautiful-dnd
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install class-variance-authority clsx tailwind-merge

# Install dev dependencies
npm install -D @types/react-beautiful-dnd
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
npm install -D eslint-config-prettier prettier
```

### **2. Project Structure:**

```
nova-crm-frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── verify/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx (Dashboard)
│   │   │   │
│   │   │   ├── crm/
│   │   │   │   ├── page.tsx (Customer List)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx (Customer Details)
│   │   │   │
│   │   │   ├── business-card/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── smart-matches/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── calendar/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── my-platform/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── tasks/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── team/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── homeowners/
│   │   │   └── page.tsx
│   │   │
│   │   ├── api/ (if using route handlers)
│   │   │
│   │   ├── layout.tsx (Root layout)
│   │   ├── globals.css
│   │   └── providers.tsx
│   │
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── select.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   └── ... (20+ components)
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── RightSidebar.tsx
│   │   │   └── PageLayout.tsx
│   │   │
│   │   ├── crm/
│   │   │   ├── CustomerCard.tsx
│   │   │   ├── CustomerGrid.tsx
│   │   │   ├── CustomerForm.tsx
│   │   │   ├── CustomerDetails.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   └── CustomerFilters.tsx
│   │   │
│   │   ├── smart-matches/
│   │   │   ├── MatchCard.tsx
│   │   │   ├── SwipeContainer.tsx
│   │   │   ├── SplitView.tsx
│   │   │   ├── MatchScore.tsx
│   │   │   └── AcceptedMatches.tsx
│   │   │
│   │   ├── calendar/
│   │   │   ├── CalendarView.tsx
│   │   │   ├── AppointmentForm.tsx
│   │   │   ├── AppointmentCard.tsx
│   │   │   ├── WorkingHours.tsx
│   │   │   └── UpcomingAppointments.tsx
│   │   │
│   │   ├── properties/
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyForm.tsx
│   │   │   ├── PropertyGrid.tsx
│   │   │   └── ImageUploader.tsx
│   │   │
│   │   ├── tasks/
│   │   │   ├── TaskBoard.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   └── TaskFilters.tsx
│   │   │
│   │   └── shared/
│   │       ├── DataTable.tsx
│   │       ├── Modal.tsx
│   │       ├── Toast.tsx
│   │       ├── EmptyState.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── customers.ts
│   │   │   ├── properties.ts
│   │   │   ├── smart-matches.ts
│   │   │   ├── appointments.ts
│   │   │   ├── tasks.ts
│   │   │   └── analytics.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts (className utility)
│   │   │   ├── date.ts
│   │   │   ├── format.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── routes.ts
│   │   │   ├── config.ts
│   │   │   └── enums.ts
│   │   │
│   │   └── socket.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCustomers.ts
│   │   ├── useProperties.ts
│   │   ├── useSmartMatches.ts
│   │   ├── useAppointments.ts
│   │   ├── useTasks.ts
│   │   ├── useNotifications.ts
│   │   ├── useRealtime.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── customerStore.ts
│   │   ├── notificationStore.ts
│   │   └── uiStore.ts
│   │
│   ├── types/
│   │   ├── api.ts
│   │   ├── user.ts
│   │   ├── customer.ts
│   │   ├── property.ts
│   │   ├── smartMatch.ts
│   │   ├── appointment.ts
│   │   └── task.ts
│   │
│   └── styles/
│       └── globals.css
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎨 **TAILWIND CONFIGURATION**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#01411C',
          50: '#E6F6E6',
          100: '#CDEDCD',
          200: '#9BDBAB',
          300: '#69C98A',
          400: '#37B769',
          500: '#05A548',
          600: '#048C3D',
          700: '#037332',
          800: '#025A27',
          900: '#01411C',
        },
        secondary: {
          DEFAULT: '#D4AF37',
          50: '#FDFCF5',
          100: '#FAF7EB',
          200: '#F4EFD7',
          300: '#ECE0AF',
          400: '#E4D087',
          500: '#DCC05F',
          600: '#D4AF37',
          700: '#BE9C30',
          800: '#A58628',
          900: '#8C7020',
        },
        success: {
          DEFAULT: '#198754',
          900: '#0F5132',
          500: '#198754',
          100: '#D1E7DD',
        },
        danger: {
          DEFAULT: '#DC3545',
          900: '#58151C',
          500: '#DC3545',
          100: '#F8D7DA',
        },
        warning: {
          DEFAULT: '#FFC107',
          900: '#664D03',
          500: '#FFC107',
          100: '#FFF3CD',
        },
        info: {
          DEFAULT: '#0DCAF0',
          900: '#055160',
          500: '#0DCAF0',
          100: '#CFF4FC',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      },
      spacing: {
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
        '7': '64px',
        '8': '80px',
        '9': '96px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

### **Global Styles:**

```css
/* src/styles/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 10%;
    
    --border: 0 0% 80%;
    --input: 0 0% 90%;
    --ring: 142 95% 13%;
    
    --radius: 0.5rem;
  }
  
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
    direction: rtl;
  }
  
  /* RTL Support */
  [dir="rtl"] {
    direction: rtl;
  }
}

@layer components {
  .container {
    @apply mx-auto px-4 sm:px-6 lg:px-8;
  }
  
  .page-layout {
    @apply min-h-screen bg-background;
  }
  
  .card-hover {
    @apply transition-all duration-200 hover:shadow-lg;
  }
}
```

---

## 🏪 **STATE MANAGEMENT**

### **Auth Store:**

```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  subscription?: {
    plan: string;
    status: string;
    expiresAt: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      setUser: (user) => set({ user, isAuthenticated: true }),
      
      setToken: (token) => set({ token }),
      
      login: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
      }),
      
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### **Customer Store:**

```typescript
// src/store/customerStore.ts
import { create } from 'zustand';
import { Customer } from '@/types/customer';

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  filters: {
    search: string;
    category: string;
    interestLevel: string;
    tags: string[];
  };
  
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  setFilters: (filters: Partial<CustomerState['filters']>) => void;
  clearFilters: () => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  selectedCustomer: null,
  filters: {
    search: '',
    category: '',
    interestLevel: '',
    tags: [],
  },
  
  setCustomers: (customers) => set({ customers }),
  
  addCustomer: (customer) => set((state) => ({
    customers: [...state.customers, customer],
  })),
  
  updateCustomer: (id, updates) => set((state) => ({
    customers: state.customers.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    ),
  })),
  
  deleteCustomer: (id) => set((state) => ({
    customers: state.customers.filter((c) => c.id !== id),
  })),
  
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
  
  clearFilters: () => set({
    filters: {
      search: '',
      category: '',
      interestLevel: '',
      tags: [],
    },
  }),
}));
```

### **Notification Store:**

```typescript
// src/store/notificationStore.ts
import { create } from 'zustand';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface NotificationState {
  notifications: Notification[];
  
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(7);
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));
    
    // Auto remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, notification.duration || 5000);
    }
  },
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),
  
  clearNotifications: () => set({ notifications: [] }),
}));
```

---

## 🔌 **API CLIENT**

```typescript
// src/lib/api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logout user
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
```

### **Auth API:**

```typescript
// src/lib/api/auth.ts
import { apiClient } from './client';

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (data: RegisterData) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  
  verifyOTP: async (phone: string, code: string) => {
    const response = await apiClient.post('/auth/verify-otp', { phone, code });
    return response.data;
  },
  
  sendOTP: async (phone: string) => {
    const response = await apiClient.post('/auth/send-otp', { phone });
    return response.data;
  },
  
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
  
  me: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
```

### **Customers API:**

```typescript
// src/lib/api/customers.ts
import { apiClient } from './client';
import { Customer, CreateCustomerData } from '@/types/customer';

export const customersAPI = {
  getAll: async (params?: {
    search?: string;
    category?: string;
    interestLevel?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get<{ customers: Customer[]; total: number }>(
      '/customers',
      { params }
    );
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get<{ customer: Customer }>(`/customers/${id}`);
    return response.data.customer;
  },
  
  create: async (data: CreateCustomerData) => {
    const response = await apiClient.post<{ customer: Customer }>('/customers', data);
    return response.data.customer;
  },
  
  update: async (id: string, data: Partial<CreateCustomerData>) => {
    const response = await apiClient.patch<{ customer: Customer }>(
      `/customers/${id}`,
      data
    );
    return response.data.customer;
  },
  
  delete: async (id: string) => {
    await apiClient.delete(`/customers/${id}`);
  },
  
  addActivity: async (id: string, activity: any) => {
    const response = await apiClient.post(`/customers/${id}/activities`, activity);
    return response.data;
  },
  
  uploadDocument: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(`/customers/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
```

---

## 🪝 **CUSTOM HOOKS**

### **useAuth:**

```typescript
// src/hooks/useAuth.ts
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout } = useAuthStore();
  const router = useRouter();
  
  const handleLogin = async (identifier: string, password: string) => {
    try {
      const data = await authAPI.login({ identifier, password });
      login(data.user, data.token);
      router.push('/');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };
  
  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      router.push('/login');
    }
  };
  
  return {
    user,
    token,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
  };
};
```

### **useCustomers:**

```typescript
// src/hooks/useCustomers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersAPI } from '@/lib/api/customers';
import { useCustomerStore } from '@/store/customerStore';

export const useCustomers = () => {
  const queryClient = useQueryClient();
  const { filters } = useCustomerStore();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['customers', filters],
    queryFn: () => customersAPI.getAll(filters),
  });
  
  const createMutation = useMutation({
    mutationFn: customersAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      customersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: customersAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
  
  return {
    customers: data?.customers || [],
    total: data?.total || 0,
    isLoading,
    error,
    createCustomer: createMutation.mutate,
    updateCustomer: updateMutation.mutate,
    deleteCustomer: deleteMutation.mutate,
  };
};
```

### **useRealtime:**

```typescript
// src/hooks/useRealtime.ts
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';

let socket: Socket | null = null;

export const useRealtime = (event: string, callback: (data: any) => void) => {
  const { token } = useAuthStore();
  
  useEffect(() => {
    if (!token) return;
    
    // Initialize socket if not exists
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_API_URL!, {
        auth: { token },
      });
      
      socket.on('connect', () => {
        console.log('Connected to socket');
      });
      
      socket.on('disconnect', () => {
        console.log('Disconnected from socket');
      });
    }
    
    // Subscribe to event
    socket.on(event, callback);
    
    // Cleanup
    return () => {
      socket?.off(event, callback);
    };
  }, [token, event, callback]);
  
  return socket;
};
```

---

## 🧩 **COMPONENTS**

### **Layout Components:**

```typescript
// src/components/layout/PageLayout.tsx
'use client';

import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { RightSidebar } from './RightSidebar';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: React.ReactNode;
  showRightSidebar?: boolean;
}

export const PageLayout = ({ children, showRightSidebar }: PageLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        
        <motion.main
          className="flex-1 p-6"
          animate={{
            marginRight: sidebarCollapsed ? '0' : '280px',
          }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
        
        {showRightSidebar && <RightSidebar />}
      </div>
    </div>
  );
};
```

### **Customer Card:**

```typescript
// src/components/crm/CustomerCard.tsx
'use client';

import { Customer } from '@/types/customer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { QuickActions } from './QuickActions';
import { Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface CustomerCardProps {
  customer: Customer;
  onClick?: () => void;
}

export const CustomerCard = ({ customer, onClick }: CustomerCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const getInterestLevelColor = (level: string) => {
    const colors = {
      'مهتم جداً': 'bg-success-500',
      'مهتم': 'bg-info-500',
      'محتمل': 'bg-warning-500',
      'بارد': 'bg-neutral-500',
    };
    return colors[level as keyof typeof colors] || 'bg-neutral-500';
  };
  
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="p-4 cursor-pointer hover:border-primary-500"
        onClick={onClick}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar>
            <AvatarFallback className="bg-primary-500 text-white">
              {getInitials(customer.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{customer.name}</h3>
              {customer.isVip && (
                <Badge className="bg-secondary-500">VIP</Badge>
              )}
            </div>
            <p className="text-sm text-neutral-600">{customer.category}</p>
          </div>
        </div>
        
        {/* Body */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-primary-600" />
            <span dir="ltr">{customer.phone}</span>
          </div>
          
          {customer.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-primary-600" />
              <span>{customer.email}</span>
            </div>
          )}
          
          {customer.preferredCities && customer.preferredCities.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary-600" />
              <span>{customer.preferredCities.join(', ')}</span>
            </div>
          )}
          
          {/* Budget */}
          {customer.budgetMin && customer.budgetMax && (
            <div className="text-sm text-neutral-600">
              الميزانية: {customer.budgetMin.toLocaleString()} - {customer.budgetMax.toLocaleString()} ريال
            </div>
          )}
          
          {/* Tags */}
          {customer.tags && customer.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {customer.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {customer.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{customer.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <QuickActions customerId={customer.id} />
        
        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <Badge className={getInterestLevelColor(customer.interestLevel || '')}>
            {customer.interestLevel}
          </Badge>
          
          <span className="text-xs text-neutral-500">
            {customer.lastContact
              ? `آخر تواصل: ${new Date(customer.lastContact).toLocaleDateString('ar-SA')}`
              : 'لم يتم التواصل'}
          </span>
        </div>
      </Card>
    </motion.div>
  );
};
```

### **Smart Match Card (Swipe):**

```typescript
// src/components/smart-matches/SwipeContainer.tsx
'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MatchCard } from './MatchCard';
import { SmartMatch } from '@/types/smartMatch';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SwipeContainerProps {
  matches: SmartMatch[];
  onAccept: (matchId: string) => void;
  onReject: (matchId: string) => void;
}

export const SwipeContainer = ({ matches, onAccept, onReject }: SwipeContainerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitX, setExitX] = useState(0);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  const currentMatch = matches[currentIndex];
  
  const handleDragEnd = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      setExitX(info.offset.x);
      
      if (info.offset.x > 0) {
        // Swipe right = Accept
        onAccept(currentMatch.id);
      } else {
        // Swipe left = Reject
        onReject(currentMatch.id);
      }
      
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setExitX(0);
      }, 300);
    }
  };
  
  if (!currentMatch) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px]">
        <p className="text-2xl mb-4">🎉 لا توجد فرص جديدة!</p>
        <p className="text-neutral-600">سنرسل لك إشعاراً عند توفر فرص جديدة</p>
      </div>
    );
  }
  
  return (
    <div className="relative w-full max-w-md mx-auto h-[600px]">
      {/* Match Card */}
      <motion.div
        className="absolute inset-0"
        style={{ x, rotate, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={exitX !== 0 ? { x: exitX * 2, opacity: 0 } : {}}
        transition={{ duration: 0.3 }}
      >
        <MatchCard match={currentMatch} />
      </motion.div>
      
      {/* Action Buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-16 h-16 border-2 border-danger-500 text-danger-500 hover:bg-danger-50"
          onClick={() => {
            setExitX(-200);
            onReject(currentMatch.id);
            setTimeout(() => {
              setCurrentIndex((prev) => prev + 1);
              setExitX(0);
            }, 300);
          }}
        >
          <X className="w-8 h-8" />
        </Button>
        
        <Button
          size="lg"
          className="rounded-full w-16 h-16 bg-success-500 hover:bg-success-600"
          onClick={() => {
            setExitX(200);
            onAccept(currentMatch.id);
            setTimeout(() => {
              setCurrentIndex((prev) => prev + 1);
              setExitX(0);
            }, 300);
          }}
        >
          <Check className="w-8 h-8" />
        </Button>
      </div>
      
      {/* Counter */}
      <div className="absolute top-4 left-0 right-0 text-center">
        <span className="text-sm text-neutral-600">
          {currentIndex + 1} من {matches.length}
        </span>
      </div>
    </div>
  );
};
```

---

## 📄 **PAGES**

### **Login Page:**

```typescript
// src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(identifier, password);
    
    if (!result.success) {
      setError(result.error || 'حدث خطأ');
    }
    
    setLoading(false);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-900">عقاري AI</h1>
          <p className="text-neutral-600 mt-2">تسجيل الدخول</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="identifier">البريد الإلكتروني أو رقم الجوال</Label>
            <Input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="example@domain.com أو 05xxxxxxxx"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          
          {error && (
            <div className="text-danger-500 text-sm text-center">{error}</div>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'جارٍ تسجيل الدخول...' : 'دخول'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <Link href="/register" className="text-primary-600 hover:underline">
            ليس لديك حساب؟ سجل الآن
          </Link>
        </div>
      </Card>
    </div>
  );
}
```

### **Dashboard Page:**

```typescript
// src/app/(dashboard)/page.tsx
'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/card';
import { Users, Building, Calendar, Target } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { title: 'إجمالي العملاء', value: 156, icon: Users, color: 'text-primary-600' },
    { title: 'العقارات النشطة', value: 42, icon: Building, color: 'text-secondary-600' },
    { title: 'المواعيد القادمة', value: 8, icon: Calendar, color: 'text-info-600' },
    { title: 'الفرص الذكية', value: 23, icon: Target, color: 'text-success-600' },
  ];
  
  return (
    <PageLayout showRightSidebar>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <stat.icon className={`w-12 h-12 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>
        
        {/* Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">إحصائيات الشهر</h2>
            {/* Add chart here */}
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">النشاط الأخير</h2>
            {/* Add activity list here */}
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
```

---

## 🧪 **TESTING**

```typescript
// tests/unit/CustomerCard.test.tsx
import { render, screen } from '@testing-library/react';
import { CustomerCard } from '@/components/crm/CustomerCard';

describe('CustomerCard', () => {
  const mockCustomer = {
    id: '1',
    name: 'أحمد محمد',
    phone: '0501234567',
    email: 'ahmed@example.com',
    category: 'مشتري',
    interestLevel: 'مهتم جداً',
    isVip: true,
    tags: ['جاد', 'سريع'],
    budgetMin: 500000,
    budgetMax: 800000,
  };
  
  it('renders customer name', () => {
    render(<CustomerCard customer={mockCustomer} />);
    expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
  });
  
  it('shows VIP badge when isVip is true', () => {
    render(<CustomerCard customer={mockCustomer} />);
    expect(screen.getByText('VIP')).toBeInTheDocument();
  });
});
```

---

## 📱 **RESPONSIVE DESIGN**

```typescript
// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  
  return matches;
};

// Usage:
// const isMobile = useMediaQuery('(max-width: 768px)');
```

---

## ✅ **CHECKLIST**

- [ ] Project setup complete
- [ ] TailwindCSS configured with RTL
- [ ] All UI components from shadcn/ui installed
- [ ] State management (Zustand) configured
- [ ] API client with interceptors
- [ ] Authentication flow complete
- [ ] All custom hooks created
- [ ] Page layouts (Auth, Dashboard)
- [ ] Customer management (Grid, Card, Form, Details)
- [ ] Smart Matches (Swipe, Split View)
- [ ] Calendar & Appointments
- [ ] Tasks (Kanban board)
- [ ] Real-time updates (Socket.io)
- [ ] Responsive design (Mobile, Tablet, Desktop)
- [ ] Unit tests
- [ ] E2E tests (Playwright)
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Accessibility (a11y)

---

📄 **File:** `/PROMPT-3-FRONTEND-EXECUTION.md`  
⚛️ **Type:** Frontend Development  
⏱️ **Estimated Time:** 100-120 hours  
👥 **Role:** Frontend Developer  
🎯 **Output:** Complete React app with 15+ pages

---

**🚀 Execute this prompt to build the complete Nova CRM frontend!**
