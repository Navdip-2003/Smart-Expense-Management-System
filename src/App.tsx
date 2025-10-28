import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from './state/useAppStore';

import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import NewExpense from './pages/NewExpense';
import ExpenseDetail from './pages/ExpenseDetail';
import Users from './pages/Users';
import Rules from './pages/Rules';
import Settings from './pages/Settings';
import CookieInspector from './pages/CookieInspector';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function DemoWarningModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 relative animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full">⚠️</div>
          <h2 className="text-lg font-semibold text-gray-900">
            Demo Version Notice
          </h2>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          This application is a <strong>demo version</strong> of the Expense Management System.
          Some backend features may not work because this demo uses
          <strong> localStorage</strong> and <strong>cookies</strong> to simulate data.
          <br />
          <br />
          It’s built for demonstration purposes only — your data will stay in your browser.
        </p>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isInitialized } = useAppStore();

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isInitialized } = useAppStore();

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { hydrate } = useAppStore();

  useEffect(() => {
    hydrate();

      alert(
        '⚠️ DEMO NOTICE:\n\nThis is a demo version of the Expense Management App. ' +
        'Some backend features may not work because it runs using local storage and cookies. ' +
        'This is for demonstration purposes only.'
      );
    
  }, [hydrate]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses/new"
            element={
              <ProtectedRoute>
                <NewExpense />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses/:id"
            element={
              <ProtectedRoute>
                <ExpenseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rules"
            element={
              <ProtectedRoute>
                <Rules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cookie-inspector"
            element={
              <ProtectedRoute>
                <CookieInspector />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
