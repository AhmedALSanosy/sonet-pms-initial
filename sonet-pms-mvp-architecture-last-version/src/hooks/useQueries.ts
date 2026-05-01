// ============================================================
// Sonet PMS — TanStack Query Hooks
// ============================================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type { DashboardStats } from '../types';

// ─── Patients ───
export function usePatients(search?: string) {
  return useQuery({
    queryKey: ['patients', search],
    queryFn: async () => { const res = await api.getPatients({ search }); return res; },
    placeholderData: (prev) => prev,
  });
}

// ─── Orders ───
export function useOrders(status?: string) {
  return useQuery({
    queryKey: ['orders', status],
    queryFn: async () => { const res = await api.getOrders({ status }); return res; },
    placeholderData: (prev) => prev,
  });
}

// ─── Results ───
export function useResults(patientId?: string, status?: string) {
  return useQuery({
    queryKey: ['results', patientId, status],
    queryFn: async () => { const res = await api.getResults({ patientId, status }); return res; },
  });
}

// ─── Invoices ───
export function useInvoices(status?: string) {
  return useQuery({
    queryKey: ['invoices', status],
    queryFn: async () => { const res = await api.getInvoices({ status }); return res; },
  });
}

// ─── Dashboard Stats ───
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => { const res = await api.getDashboardStats(); return res as DashboardStats; },
    refetchInterval: 30000,
  });
}

// ─── Voice Process ───
export function useVoiceProcess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (transcript: string) => {
      const res = await api.processVoice({ transcript });
      return res;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['patients'] }); queryClient.invalidateQueries({ queryKey: ['orders'] }); },
  });
}
