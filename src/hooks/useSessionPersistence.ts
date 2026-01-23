import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useSessionPersistence = () => {
  const { user, isAuthenticated, loading, restoreSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Skip if still loading
    if (loading) return;
    
    const publicRoutes = [
      '/',
      '/login', 
      '/register', 
      '/forgot-password',
      '/reset-password',
      '/verify-email',
      '/verify-mobile-otp',
      '/auth'
    ];
    
    const isPublicRoute = publicRoutes.includes(location.pathname) || 
                         location.pathname.startsWith('/verify-') ||
                         location.pathname.startsWith('/reset-password');

    // If user is authenticated and tries to access login/register, redirect to appropriate dashboard
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
      if (user?.userType === 'CANDIDATE') {
        navigate('/candidate/dashboard');
      } else if (user?.userType === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user?.userType === 'HR_MANAGER') {
        navigate('/hr/dashboard');
      } else {
        navigate('/client/dashboard');
      }
      return;
    }

    // If not authenticated and trying to access protected route
    if (!isAuthenticated && !isPublicRoute) {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        // Attempt to restore session silently
        console.log('Attempting to restore session...');
        restoreSession()
          .then((restored) => {
            if (!restored) {
              // Restore failed, redirect to login
              navigate('/login', { 
                state: { from: location.pathname } 
              });
            }
          })
          .catch(() => {
            navigate('/login', { 
              state: { from: location.pathname } 
            });
          });
      } else {
        // No tokens found, redirect to login
        navigate('/login', { 
          state: { from: location.pathname } 
        });
      }
    }
  }, [location.pathname, isAuthenticated, user, loading, navigate, restoreSession]);

  return null;
};