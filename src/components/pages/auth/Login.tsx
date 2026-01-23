import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Mail, Lock, ArrowRight } from 'lucide-react';
// Change the import path

import { AuthService } from '@/lib/api/AuthService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get redirect path from location state or default
  const from = location.state?.from?.pathname || '/';

  

// Login.tsx - Simplified handleSubmit
// Login.tsx - Updated handleSubmit with debugging
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  console.log('=== LOGIN DEBUG START ===');
  console.log('Email:', email);
  console.log('Password length:', password.length);

  try {
    console.log('1. Calling AuthService.login...');
    const response = await AuthService.login({ email, password });
    console.log('2. AuthService.login response:', response);
    
    console.log('3. Checking localStorage after AuthService:');
    console.log('   Token:', localStorage.getItem('token'));
    console.log('   Refresh Token:', localStorage.getItem('refreshToken'));
    console.log('   User:', localStorage.getItem('user'));
    
    console.log('4. Calling AuthContext.login...');
    await login(email, password);
    
    console.log('5. Checking localStorage after AuthContext:');
    console.log('   Token:', localStorage.getItem('token'));
    console.log('   Refresh Token:', localStorage.getItem('refreshToken'));
    console.log('   User:', localStorage.getItem('user'));
    
    toast.success('Logged in successfully!');
    
    console.log('6. Getting user from localStorage for redirect...');
    const userStr = localStorage.getItem('user');
    console.log('   Raw user string:', userStr);
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('   Parsed user:', user);
        console.log('   User type:', user.userType);
        
        // Force a small delay and check URL
        setTimeout(() => {
          console.log('7. Current URL before redirect:', window.location.href);
          
          if (user.userType === 'ADMIN') {
            console.log('   Redirecting to ADMIN dashboard');
            navigate('/admin/dashboard');
          } else if (user.userType === 'HR_MANAGER') {
            console.log('   Redirecting to HR dashboard');
            navigate('/hr/dashboard');
          } else if (user.userType === 'CANDIDATE') {
            console.log('   Redirecting to CANDIDATE dashboard');
            navigate('/candidate/dashboard');
          } else {
            console.log('   Redirecting to default dashboard');
            navigate('/');
          }
        }, 100);
      } catch (parseError) {
        console.error('Error parsing user JSON:', parseError);
      }
    } else {
      console.error('No user found in localStorage!');
    }
    
  } catch (err: any) {
    console.error('Login error:', err);
    
    let errorMessage = 'Invalid email or password';
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    console.log('Error details:', {
      response: err.response?.data,
      status: err.response?.status,
      message: err.message
    });
    
    setError(errorMessage);
    toast.error(errorMessage);
    
    // Clear any partial data
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  } finally {
    console.log('=== LOGIN DEBUG END ===');
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            TalentHub Login
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="you@example.com"
                  className="pl-10"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
          
          {/* Demo credentials hint - Remove in production */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600 text-center">
              Note: Your backend must be running on http://localhost:8080
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;