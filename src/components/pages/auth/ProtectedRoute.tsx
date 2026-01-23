import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom'; 
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner'; 

interface ProtectedRouteProps {
  children?: React.ReactNode;
  roles?: Array<'ADMIN' | 'HR_MANAGER' | 'CANDIDATE'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    // Check if we have tokens in localStorage that might need restoration
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      // We have tokens but auth context isn't initialized yet
      // This can happen on page reload
      console.log('ProtectedRoute: Found tokens, attempting session restoration...');
      
      // Return loading while session is restored
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3">Restoring session...</span>
        </div>
      );
    }
    
    // No tokens, redirect to login
    const redirectPath = location.pathname !== '/logout' ? location.pathname + location.search : '/';
    return <Navigate to="/login" state={{ from: redirectPath }} replace />;
  }

  // Check roles if specified
  if (roles && user && !roles.includes(user.userType)) {
    toast.error('You do not have permission to access this page');
    
    // Redirect based on user role to THEIR OWN dashboard
    if (user.userType === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.userType === 'HR_MANAGER') {
      return <Navigate to="/hr/dashboard" replace />;
    } else if (user.userType === 'CANDIDATE') {
      return <Navigate to="/candidate/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Clear any session timeout warning when accessing protected route
  const sessionWarning = document.getElementById('session-expiry-warning');
  if (sessionWarning) {
    sessionWarning.style.display = 'none';
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;