import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Bills from './pages/Bills';
import Friends from './pages/Friends';
import Layout from './components/Layout';

const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router>
        <AuthProvider>
          <Routes>
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthRoute>
                  <Signup />
                </AuthRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path='dashboard' element={<Dashboard />} />
              <Route path="bills" element={<Bills />} />
              <Route path="friends" element={<Friends />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

// Protect routes that require auth
function ProtectedRoute({ children }) {
  const path = useLocation().pathname;
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Redirect if user is already logged in
function AuthRoute({ children }) {
  const path = useLocation().pathname;
  const { currentUser } = useAuth();
  if (currentUser && path !== '/login') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default App;
