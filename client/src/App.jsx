import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './hooks/useTheme';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Plan from './pages/Plan';
import Problems from './pages/Problems';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Applications from './pages/Applications';
import CompanyQuestions from './pages/CompanyQuestions';
import CommPrep from './pages/CommPrep';
import InterviewPrep from './pages/InterviewPrep';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import Toast from './components/Toast';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return (
    <div className="loading-screen">
      <div className="loading-logo">PlacementOS</div>
      <div className="loading-dots">
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
      </div>
    </div>
  );
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const AppLayout = ({ children }) => (
  <div className="app-wrapper">
    <Navbar />
    <div className="page-content">{children}</div>
    <MobileNav />
    <Toast />
  </div>
);

export default function App() {
  useTheme(); // initialise theme (reads localStorage, applies data-theme to <html>)
  const { token, loading } = useAuth();

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-logo">PlacementOS</div>
      <div className="loading-dots">
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
      </div>
    </div>
  );

  return (
    <>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/" replace /> : <Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={token ? <Navigate to="/" replace /> : <ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/plan" element={<ProtectedRoute><AppLayout><Plan /></AppLayout></ProtectedRoute>} />
        <Route path="/problems" element={<ProtectedRoute><AppLayout><Problems /></AppLayout></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AppLayout><Analytics /></AppLayout></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><AppLayout><Applications /></AppLayout></ProtectedRoute>} />
        <Route path="/company" element={<ProtectedRoute><AppLayout><CompanyQuestions /></AppLayout></ProtectedRoute>} />
        <Route path="/comm-prep" element={<ProtectedRoute><AppLayout><CommPrep /></AppLayout></ProtectedRoute>} />
        <Route path="/interview-prep" element={<ProtectedRoute><AppLayout><InterviewPrep /></AppLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
