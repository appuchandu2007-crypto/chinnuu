import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import FlowLayout from './layouts/FlowLayout';
import ProfileSetupPage from './pages/flow/ProfileSetupPage';
import MoodCheckPage from './pages/flow/MoodCheckPage';
import ReasonPage from './pages/flow/ReasonPage';
import VisitHistoryPage from './pages/flow/VisitHistoryPage';
import GoalSelectionPage from './pages/flow/GoalSelectionPage';
import SupportPage from './pages/flow/SupportPage';
import FeedbackPage from './pages/flow/FeedbackPage';
import WellnessDashboardPage from './pages/flow/WellnessDashboardPage';
import UserDashboardPage from './pages/flow/UserDashboardPage';
import UserProfilePage from './pages/flow/UserProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import { useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, profile } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Assuming a specific email for admin
  if (adminOnly && profile?.email !== 'appuchandu2007@gmail.com') {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      
      {/* User Flow */}
      <Route path="/app" element={<ProtectedRoute><FlowLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/app/wellness" />} />
        <Route path="profile-setup" element={<ProfileSetupPage />} />
        <Route path="mood-check" element={<MoodCheckPage />} />
        <Route path="reason" element={<ReasonPage />} />
        <Route path="visit-history" element={<VisitHistoryPage />} />
        <Route path="goal-selection" element={<GoalSelectionPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="wellness" element={<WellnessDashboardPage />} />
        <Route path="dashboard" element={<UserDashboardPage />} />
        <Route path="profile" element={<UserProfilePage />} />
      </Route>
      
      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboardPage /></ProtectedRoute>} />
    </Routes>
  );
}
