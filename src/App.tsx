import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import HomePage from './features/home/HomePage'
import DashboardPage from './features/dashboard/DashboardPage'
import CalculatorPage from './features/calculator/CalculatorPage'
import Layout from './components/Layout'
import { fetchAuthUser } from './utils/auth'

function useAuth() {
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    fetchAuthUser().then(user => {
      setAuthState(user ? 'authenticated' : 'unauthenticated');
    });
  }, []);

  return authState;
}

function RootRedirect() {
  const authState = useAuth();
  if (authState === 'loading') return null;
  return <Navigate to={authState === 'authenticated' ? '/dashboard' : '/home'} replace />;
}

function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const authState = useAuth();
  if (authState === 'loading') return null;
  if (authState === 'unauthenticated') return <Navigate to="/home" replace />;
  return element;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Layout><DashboardPage /></Layout>} />} />
        <Route path="/calculator" element={<Layout><CalculatorPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
