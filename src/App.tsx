import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LandingPage } from './components/pages/LandingPage';
import { LoginSignup } from './components/pages/LoginSignup';
import { ClientDashboard } from './components/pages/ClientDashboard';
import { AdminDashboard } from './components/pages/AdminDashboard';
import { Messaging } from './components/pages/Messaging';
import { ContractBilling } from './components/pages/ContractBilling';
import { ResourceProfile } from './components/pages/ResourceProfile';
import { PostRequirement } from './components/pages/PostRequirement';
import { BrowseResources } from './components/pages/BrowseResources'; 
import { SimpleSearch } from './components/pages/SimpleSearch';

// Import the new components
import HRDashboard from './components/pages/dashboard/HRDashboard/HRDashboard';
import CandidateDashboard from './components/pages/dashboard/CandidateDashboard';
import Login from './components/pages/auth/Login';
import Register from './components/pages/auth/Register';
import ForgotPassword from './components/pages/auth/ForgotPassword';
import ResetPassword from './components/pages/auth/ResetPassword';
import VerifyEmail from './components/pages/auth/VerifyEmail';
import VerifyMobileOTP from './components/pages/auth/VerifyMobileOTP';
import UserManagement from './components/pages/admin/UserManagement';
import ProtectedRoute from './components/pages/auth/ProtectedRoute';
import ApplicationsList from './components/pages/dashboard/ApplicationsList';
import { SessionExpiryWarning } from './components/common/SessionExpiryWarning';

// Import new candidate components
import CandidateProfileEdit from './components/pages/dashboard/CandidateProfileEdit';
import CandidateJobs from './components/pages/dashboard/CandidateJobs';
import CandidateMessages from './components/pages/dashboard/CandidateMessages';
import CandidateAssessments from './components/pages/dashboard/CandidateAssessments';
import CandidateAnalytics from './components/pages/dashboard/CandidateAnalytics';
import CandidateSettings from './components/pages/dashboard/CandidateSettings';
import CandidateInterviews from './components/pages/dashboard/CandidateInterviews';

// Import AuthProvider
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import { useSessionPersistence } from './hooks/useSessionPersistence';

// AuthWrapper component for session persistence
function AuthWrapper() {
  useSessionPersistence();
  return null;
}

// RouteChangeHandler component for session checks on navigation
const RouteChangeHandler = () => {
  const location = useLocation();
  const { user, isAuthenticated, loading, restoreSession } = useAuth();

  useEffect(() => {
    // Skip if loading
    if (loading) return;

    // Check session on route change
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      // If we have tokens but no user in context, try to restore
      if (token && storedUser && (!user || !isAuthenticated)) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('RouteChange: Found stored user, attempting restoration...');
          
          // Try to restore session silently
          await restoreSession();
        } catch (error) {
          console.error('RouteChange session check failed:', error);
        }
      }
    };

    checkSession();
  }, [location.pathname, loading, user, isAuthenticated, restoreSession]);

  return null;
};

// Debug component (temporary - remove in production)
const DebugAuth = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log('Auth Debug:', {
      hasUser: !!user,
      userEmail: user?.email,
      userType: user?.userType,
      isAuthenticated,
      loading,
      currentPath: location.pathname,
      hasToken: !!localStorage.getItem('token'),
      localStorageUser: localStorage.getItem('user')
    });
  }, [user, isAuthenticated, loading, location]);
  
  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <SessionExpiryWarning />
        <DebugAuth /> {/* Remove this in production */}
        <RouteChangeHandler />
        <AuthWrapper />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<LoginSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-mobile-otp" element={<VerifyMobileOTP />} />
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Route>
          
          {/* HR Manager Routes */}
          <Route element={<ProtectedRoute roles={['HR_MANAGER']} />}>
            <Route path="/hr/dashboard/HRDashboard" element={<HRDashboard />} />
          </Route>
           
          {/* Candidate Routes */}
          <Route element={<ProtectedRoute roles={['CANDIDATE']} />}>
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="/candidate/applications" element={<ApplicationsList />} />
            <Route path="/candidate/profile/edit" element={<CandidateProfileEdit />} />
            <Route path="/candidate/jobs" element={<CandidateJobs />} />
            <Route path="/candidate/messages" element={<CandidateMessages />} />
            <Route path="/candidate/assessments" element={<CandidateAssessments />} />
            <Route path="/candidate/analytics" element={<CandidateAnalytics />} />
            <Route path="/candidate/settings" element={<CandidateSettings />} />
            <Route path="/candidate/interviews" element={<CandidateInterviews />} />
          </Route>
          
          {/* Client/General Routes (accessible by all authenticated users) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/resource/:id" element={<ResourceProfile />} />
            <Route path="/client/browse" element={<BrowseResources />} />
            <Route path="/client/messages" element={<Messaging />} />
            <Route path="/client/contracts" element={<ContractBilling />} />
            <Route path="/client/post-requirement" element={<PostRequirement />} />
            <Route path="/client/search" element={<SimpleSearch />} />
          </Route>
        
          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;