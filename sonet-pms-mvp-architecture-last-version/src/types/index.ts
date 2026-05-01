// ============================================================
// Sonet PMS — Complete Type Definitions (aligned with mvp-development)
// ============================================================

export type NavSection = 'dashboard' | 'patients' | 'orders' | 'results' | 'invoices' | 'reports' | 'settings';
export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';
export type PatientStatus = 'active' | 'pending' | 'completed';
export type OrderStatus = 'pending' | 'in-progress' | 'completed';
export type ResultStatus = 'normal' | 'abnormal' | 'critical' | 'pending';
export type InvoiceStatus = 'paid' | 'partial' | 'unpaid';
export type PaymentMethod = 'cash' | 'card' | 'insurance';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

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
  priority: 'normal' | 'urgent';
  notes?: string;
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
export interface InvoiceItem { testName: string; price: number; qty: number; }
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
  status: InvoiceStatus;
  createdAt: string;
  paymentMethod?: PaymentMethod;
}

// ---- Voice ----
export interface VoiceMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ---- Notification ----
export interface Notification {
  id: string;
  type: NotificationType;
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

// ---- API ----
export interface ApiResponse<T> { data: T; total?: number; page?: number; limit?: number; }
export interface VoiceProcessRequest { transcript: string; language?: string; }
export interface VoiceProcessResponse { transcript: string; intent: string; entities: Record<string, string>; response: string; confidence: number; }
