import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
 
// Replace the import with:
import { AuthService } from '@/lib/api/AuthService';
import { toast } from 'sonner';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await AuthService.forgotPassword(email);
      setEmailSent(true);
      toast.success('Password reset instructions sent to your email');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset instructions';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We've sent password reset instructions to your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Please check your inbox and follow the instructions to reset your password.
              The link will expire in 24 hours.
            </p>
            <div className="space-y-2">
              <Button className="w-full" onClick={() => navigate('/login')}>
                Return to Login
              </Button>
              <Button variant="outline" className="w-full" onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}>
                Try Another Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mb-2 w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email to receive password reset instructions
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
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

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>

            <div className="text-center text-sm">
              Remember your password?{' '}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;