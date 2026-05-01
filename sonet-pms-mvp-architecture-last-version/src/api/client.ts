// ============================================================
// Sonet PMS — API Client Layer
// ============================================================
import type { ApiResponse, VoiceProcessRequest, VoiceProcessResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ─── Health ───
  health() {
    return this.request<{ status: string }>('/health');
  }

  // ─── Patients ───
  getPatients(params?: { search?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    return this.request<ApiResponse<import('../types').Patient[]>>(`/patients?${query}`);
  }

  getPatient(id: string) {
    return this.request<import('../types').Patient>(`/patients/${id}`);
  }

  createPatient(data: Omit<import('../types').Patient, 'id' | 'code' | 'createdAt' | 'totalTests' | 'lastVisit'>) {
    return this.request<import('../types').Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ─── Orders ───
  getOrders(params?: { status?: string; page?: number }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.page) query.set('page', String(params.page));
    return this.request<ApiResponse<import('../types').TestOrder[]>>(`/orders?${query}`);
  }

  // ─── Results ───
  getResults(params?: { patientId?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.patientId) query.set('patient_id', params.patientId);
    if (params?.status) query.set('status', params.status);
    return this.request<ApiResponse<import('../types').TestResult[]>>(`/results?${query}`);
  }

  // ─── Invoices ───
  getInvoices(params?: { status?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    return this.request<ApiResponse<import('../types').Invoice[]>>(`/invoices?${query}`);
  }

  // ─── Reports ───
  getDashboardStats() {
    return this.request<import('../types').DashboardStats>('/reports/summary');
  }

  // ─── Voice ───
  processVoice(data: VoiceProcessRequest) {
    return this.request<VoiceProcessResponse>('/voice/process', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getVoiceStatus() {
    return this.request<{ stt: { status: string }; llm: { status: string }; tts: { status: string } }>('/voice/status');
  }
}

export const api = new ApiClient(API_BASE);
