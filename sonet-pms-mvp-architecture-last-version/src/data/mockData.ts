// ============================================================
// Sonet PMS — Complete Mock Data (aligned with mvp-development)
// ============================================================
import type { Patient, TestOrder, TestResult, Invoice, Notification, DashboardStats } from '../types';

export const mockPatients: Patient[] = [
  { id: 'P-1001', name: 'Ahmed Mohamed Ali', nameAr: 'أحمد محمد علي', age: 45, gender: 'male', phone: '010-1234-5678', nationalId: '12345678901234', status: 'active', lastVisit: '2025-04-28', totalOrders: 8, balance: 0 },
  { id: 'P-1002', name: 'Fatima Ibrahim Hassan', nameAr: 'فاطمة إبراهيم حسن', age: 34, gender: 'female', phone: '011-9876-5432', nationalId: '23456789012345', status: 'pending', lastVisit: '2025-04-30', totalOrders: 3, balance: 250 },
  { id: 'P-1003', name: 'Mohamed Hassan Karim', nameAr: 'محمد حسن كريم', age: 62, gender: 'male', phone: '012-5555-7777', nationalId: '34567890123456', status: 'active', lastVisit: '2025-04-29', totalOrders: 15, balance: 0 },
  { id: 'P-1004', name: 'Sara Youssef Nour', nameAr: 'سارة يوسف نور', age: 28, gender: 'female', phone: '015-3333-9999', nationalId: '45678901234567', status: 'active', lastVisit: '2025-04-30', totalOrders: 2, balance: 0 },
  { id: 'P-1005', name: 'Omar Khaled Farid', nameAr: 'عمر خالد فريد', age: 51, gender: 'male', phone: '016-7777-1111', nationalId: '56789012345678', status: 'completed', lastVisit: '2025-04-25', totalOrders: 5, balance: 150 },
  { id: 'P-1006', name: 'Nadia Mostafa Abdel', nameAr: 'نادية مصطفى عبد', age: 39, gender: 'female', phone: '017-4444-6666', nationalId: '67890123456789', status: 'active', lastVisit: '2025-04-30', totalOrders: 7, balance: 0 },
  { id: 'P-1007', name: 'Khaled Mahmoud Samir', nameAr: 'خالد محمود سمير', age: 55, gender: 'male', phone: '018-2222-8888', nationalId: '78901234567890', status: 'pending', lastVisit: '2025-04-30', totalOrders: 11, balance: 500 },
  { id: 'P-1008', name: 'Mona Ramadan Fouad', nameAr: 'منى رمضان فؤاد', age: 44, gender: 'female', phone: '019-6666-2222', nationalId: '89012345678901', status: 'active', lastVisit: '2025-04-29', totalOrders: 6, balance: 0 },
];

export const mockOrders: TestOrder[] = [
  { id: 'ORD-2025-001', patientId: 'P-1001', patientName: 'أحمد محمد علي', tests: ['CBC', 'Blood Sugar', 'Urine Analysis', 'Lipid Profile'], status: 'completed', createdAt: '2025-04-30T08:00', dueAt: '2025-04-30T12:00', totalAmount: 450, priority: 'normal', notes: 'فحص دوري شامل' },
  { id: 'ORD-2025-002', patientId: 'P-1002', patientName: 'فاطمة إبراهيم حسن', tests: ['Thyroid Panel (TSH, T3, T4)', 'CBC', 'Vitamin D'], status: 'in-progress', createdAt: '2025-04-30T09:30', dueAt: '2025-04-30T14:00', totalAmount: 780, priority: 'normal' },
  { id: 'ORD-2025-003', patientId: 'P-1007', patientName: 'خالد محمود سمير', tests: ['Troponin I', 'CK-MB', 'D-Dimer', 'PT/INR'], status: 'pending', createdAt: '2025-04-30T10:15', dueAt: '2025-04-30T11:00', totalAmount: 1200, priority: 'urgent', notes: 'حالة قلبية طارئة — أولوية عاجلة' },
  { id: 'ORD-2025-004', patientId: 'P-1004', patientName: 'سارة يوسف نور', tests: ['HCG', 'Progesterone', 'Estradiol'], status: 'in-progress', createdAt: '2025-04-30T10:45', dueAt: '2025-04-30T13:00', totalAmount: 550, priority: 'urgent' },
  { id: 'ORD-2025-005', patientId: 'P-1003', patientName: 'محمد حسن كريم', tests: ['HbA1c', 'Fasting Glucose', 'Kidney Function'], status: 'pending', createdAt: '2025-04-30T11:00', dueAt: '2025-04-30T15:00', totalAmount: 680, priority: 'normal', notes: 'متابعة داء السكري' },
  { id: 'ORD-2025-006', patientId: 'P-1006', patientName: 'نادية مصطفى عبد', tests: ['LFT', 'Hepatitis B', 'Hepatitis C Ab'], status: 'completed', createdAt: '2025-04-30T07:30', dueAt: '2025-04-30T10:30', totalAmount: 380, priority: 'normal' },
  { id: 'ORD-2025-007', patientId: 'P-1008', patientName: 'منى رمضان فؤاد', tests: ['Rheumatoid Factor', 'CRP', 'ESR', 'ANA'], status: 'pending', createdAt: '2025-04-30T11:30', dueAt: '2025-04-30T16:00', totalAmount: 520, priority: 'normal' },
];

export const mockResults: TestResult[] = [
  { id: 'RES-001', orderId: 'ORD-2025-001', patientId: 'P-1001', patientName: 'أحمد محمد علي', testName: 'CBC - Hemoglobin', value: '13.8', unit: 'g/dL', referenceRange: '13.0 – 17.0', status: 'normal', completedAt: '2025-04-30T11:30', reviewedBy: 'د. خالد الطيب' },
  { id: 'RES-002', orderId: 'ORD-2025-001', patientId: 'P-1001', patientName: 'أحمد محمد علي', testName: 'Blood Sugar (Fasting)', value: '127', unit: 'mg/dL', referenceRange: '70 – 100', status: 'abnormal', completedAt: '2025-04-30T11:30', reviewedBy: 'د. خالد الطيب' },
  { id: 'RES-003', orderId: 'ORD-2025-001', patientId: 'P-1001', patientName: 'أحمد محمد علي', testName: 'Total Cholesterol', value: '245', unit: 'mg/dL', referenceRange: '< 200', status: 'abnormal', completedAt: '2025-04-30T11:35', reviewedBy: 'د. خالد الطيب' },
  { id: 'RES-004', orderId: 'ORD-2025-003', patientId: 'P-1007', patientName: 'خالد محمود سمير', testName: 'Troponin I', value: '2.8', unit: 'ng/mL', referenceRange: '< 0.04', status: 'critical', completedAt: '2025-04-30T10:50', reviewedBy: 'د. سامي النجار' },
  { id: 'RES-005', orderId: 'ORD-2025-006', patientId: 'P-1006', patientName: 'نادية مصطفى عبد', testName: 'ALT (SGPT)', value: '38', unit: 'U/L', referenceRange: '7 – 45', status: 'normal', completedAt: '2025-04-30T10:00', reviewedBy: 'د. سامي النجار' },
  { id: 'RES-006', orderId: 'ORD-2025-006', patientId: 'P-1006', patientName: 'نادية مصطفى عبد', testName: 'Hepatitis C Ab', value: 'Reactive', unit: '', referenceRange: 'Non-Reactive', status: 'critical', completedAt: '2025-04-30T10:05', reviewedBy: 'د. سامي النجار' },
  { id: 'RES-007', orderId: 'ORD-2025-002', patientId: 'P-1002', patientName: 'فاطمة إبراهيم حسن', testName: 'TSH', value: 'Pending', unit: 'mIU/L', referenceRange: '0.4 – 4.0', status: 'pending', completedAt: '' },
];

export const mockInvoices: Invoice[] = [
  { id: 'INV-2025-001', patientId: 'P-1001', patientName: 'أحمد محمد علي', orderId: 'ORD-2025-001', items: [{ testName: 'CBC', price: 80, qty: 1 }, { testName: 'Blood Sugar', price: 40, qty: 1 }, { testName: 'Urine Analysis', price: 50, qty: 1 }, { testName: 'Lipid Profile', price: 280, qty: 1 }], subtotal: 450, discount: 45, total: 405, paid: 405, remaining: 0, status: 'paid', createdAt: '2025-04-30T08:05', paymentMethod: 'card' },
  { id: 'INV-2025-002', patientId: 'P-1002', patientName: 'فاطمة إبراهيم حسن', orderId: 'ORD-2025-002', items: [{ testName: 'Thyroid Panel', price: 480, qty: 1 }, { testName: 'CBC', price: 80, qty: 1 }, { testName: 'Vitamin D', price: 220, qty: 1 }], subtotal: 780, discount: 0, total: 780, paid: 530, remaining: 250, status: 'partial', createdAt: '2025-04-30T09:35', paymentMethod: 'cash' },
  { id: 'INV-2025-003', patientId: 'P-1007', patientName: 'خالد محمود سمير', orderId: 'ORD-2025-003', items: [{ testName: 'Troponin I', price: 350, qty: 1 }, { testName: 'CK-MB', price: 200, qty: 1 }, { testName: 'D-Dimer', price: 350, qty: 1 }, { testName: 'PT/INR', price: 300, qty: 1 }], subtotal: 1200, discount: 0, total: 1200, paid: 0, remaining: 1200, status: 'unpaid', createdAt: '2025-04-30T10:20' },
  { id: 'INV-2025-004', patientId: 'P-1003', patientName: 'محمد حسن كريم', orderId: 'ORD-2025-005', items: [{ testName: 'HbA1c', price: 120, qty: 1 }, { testName: 'Fasting Glucose', price: 40, qty: 1 }, { testName: 'Kidney Function', price: 280, qty: 1 }], subtotal: 440, discount: 0, total: 440, paid: 440, remaining: 0, status: 'paid', createdAt: '2025-04-30T11:05', paymentMethod: 'insurance' },
  { id: 'INV-2025-005', patientId: 'P-1006', patientName: 'نادية مصطفى عبد', orderId: 'ORD-2025-006', items: [{ testName: 'LFT', price: 180, qty: 1 }, { testName: 'Hepatitis B', price: 100, qty: 1 }, { testName: 'Hepatitis C Ab', price: 100, qty: 1 }], subtotal: 380, discount: 0, total: 380, paid: 380, remaining: 0, status: 'paid', createdAt: '2025-04-30T07:35', paymentMethod: 'cash' },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'error', title: '⚠️ نتيجة حرجة', message: 'خالد محمود سمير — Troponin I: 2.8 ng/mL (حرج!)', timestamp: new Date(Date.now() - 180000), read: false },
  { id: 'n2', type: 'error', title: '⚠️ نتيجة حرجة', message: 'نادية مصطفى — Hepatitis C Ab: Reactive', timestamp: new Date(Date.now() - 300000), read: false },
  { id: 'n3', type: 'warning', title: 'نتيجة غير طبيعية', message: 'أحمد محمد علي — Blood Sugar: 127 mg/dL', timestamp: new Date(Date.now() - 600000), read: false },
  { id: 'n4', type: 'warning', title: 'نتيجة غير طبيعية', message: 'أحمد محمد علي — Cholesterol: 245 mg/dL', timestamp: new Date(Date.now() - 900000), read: true },
  { id: 'n5', type: 'success', title: 'أوردر مكتمل', message: 'ORD-2025-006 — نادية مصطفى عبد (LFT + Hepatitis)', timestamp: new Date(Date.now() - 1800000), read: true },
  { id: 'n6', type: 'info', title: 'مريض جديد', message: 'تم تسجيل سارة يوسف نور — P-1004', timestamp: new Date(Date.now() - 3600000), read: true },
];

export const mockStats: DashboardStats = {
  totalPatients: 1247,
  todayOrders: 7,
  pendingResults: 3,
  todayRevenue: 3215,
  completionRate: 94,
  urgentCases: 2,
};
