import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { User, Mail, Lock, Phone, ArrowRight, Check } from 'lucide-react';
import { AuthService } from '../../../lib/api/AuthService'; // FIXED IMPORT PATH
import { toast } from 'sonner';

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '', 
    userType: 'CANDIDATE' as 'CANDIDATE' | 'HR_MANAGER' | 'CLIENT',
    mobileNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach(error => toast.error(error));
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare registration data for backend
      const registrationData = {
        username: formData.username,
        email: formData.email,
        mobileNumber: formData.mobileNumber || undefined,
        userType: formData.userType,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };
      
      // Call register API
      const response = await AuthService.register(registrationData);
      
      toast.success('Account created successfully! Please check your email for verification.');
      
      // Redirect to login page
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please verify your email before logging in.' 
        } 
      });
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.errors?.[0] || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      
      // Handle specific errors
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const toggleUserType = () => {
    setFormData(prev => ({
      ...prev,
      userType: prev.userType === 'CANDIDATE' ? 'HR_MANAGER' : 'CANDIDATE'
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Join our talent marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* User Type Toggle */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Signing up as:</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleUserType}
                className="gap-2"
              >
                {formData.userType === 'CANDIDATE' ? 'Candidate' : 'HR Manager'}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${formData.userType === 'CANDIDATE' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                onClick={() => setFormData({...formData, userType: 'CANDIDATE'})}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Candidate</h4>
                  {formData.userType === 'CANDIDATE' && <Check className="h-5 w-5 text-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">
                  Looking for work opportunities
                </p>
              </div>
              
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${formData.userType === 'HR_MANAGER' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                onClick={() => setFormData({...formData, userType: 'HR_MANAGER'})}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">HR Manager</h4>
                  {formData.userType === 'HR_MANAGER' && <Check className="h-5 w-5 text-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">
                  Looking to hire talent
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username *</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="johndoe"
                  className={`pl-10 ${errors.username ? 'border-red-500' : ''}`} // FIXED: Removed duplicate className
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="you@example.com"
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="+1 (555) 123-4567"
                  className="pl-10"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">At least 8 characters with numbers, uppercase, lowercase, and special characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register; 