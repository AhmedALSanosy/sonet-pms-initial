// ============================================================
// Sonet PMS — Main App Store (Navigation + UI)
// ============================================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NavSection, Notification, DashboardStats } from '../types';
import { mockNotifications, mockStats } from '../data/mockData';

interface AppState {
  activeSection: NavSection;
  setActiveSection: (s: NavSection) => void;

  // Desktop sidebar collapse
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Mobile sidebar drawer
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;

  // Dashboard
  stats: DashboardStats;

  // Search
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeSection: 'dashboard',
      setActiveSection: (s) => set({ activeSection: s }),

      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      notifications: mockNotifications,
      unreadCount: mockNotifications.filter((n) => !n.read).length,
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
          unreadCount: Math.max(0, s.unreadCount - 1),
        })),

      stats: mockStats,

      globalSearch: '',
      setGlobalSearch: (q) => set({ globalSearch: q }),
    }),
    { name: 'sonet-app-store', partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }) }
  )
);
