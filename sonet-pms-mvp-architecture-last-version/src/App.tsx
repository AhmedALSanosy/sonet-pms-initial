// ============================================================
// Sonet PMS — Root App (Auth Gate + Query Provider)
// ============================================================
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './components/auth/LoginPage';
import { useAuthStore } from './store/useAuthStore';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1, refetchOnWindowFocus: false } },
});

function AuthGate() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <LoginPage />;
  return <MainLayout />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
    </QueryClientProvider>
  );
}

export default App;
