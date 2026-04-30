// ============================================================
// Sonet PMS — Type Definitions
// ============================================================

export type NavSection =
  | 'dashboard'
  | 'patients'
  | 'orders'
  | 'results'
  | 'invoices'
  | 'reports'
  | 'settings';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export type PatientStatus = 'active' | 'pending' | 'completed' | 'cancelled';
export type OrderStatus = 'pending' | 'in-progress' | 'completed' | 'urgent';
export type ResultStatus = 'normal' | 'abnormal' | 'critical' | 'pending';

// ---- Patient ----
export interface Patient {
  id: string;
  name: string;
  nameAr: string;
  age: number;
  gender: 'male' | 'female';
  phone: string;
  nationalId: string;
  status: PatientStatus;
  lastVisit: string;
  totalOrders: number;
  balance: number;
}

// ---- Test Order ----
export interface TestOrder {
  id: string;
  patientId: string;
  patientName: string;
  tests: string[];
  status: OrderStatus;
  createdAt: string;
  dueAt: string;
  totalAmount: number;
  technicianId?: string;
  notes?: string;
  priority: 'normal' | 'urgent';
}

// ---- Test Result ----
export interface TestResult {
  id: string;
  orderId: string;
  patientId: string;
  patientName: string;
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: ResultStatus;
  completedAt: string;
  reviewedBy?: string;
}

// ---- Invoice ----
export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  orderId: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  remaining: number;
  status: 'paid' | 'partial' | 'unpaid';
  createdAt: string;
  paymentMethod?: 'cash' | 'card' | 'insurance';
}

export interface InvoiceItem {
  testName: string;
  price: number;
  qty: number;
}

// ---- Voice Message ----
export interface VoiceMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

// ---- Notification ----
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// ---- Dashboard Stats ----
export interface DashboardStats {
  totalPatients: number;
  todayOrders: number;
  pendingResults: number;
  todayRevenue: number;
  completionRate: number;
  urgentCases: number;
}
