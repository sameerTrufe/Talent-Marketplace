import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      verifyEmailToken(token);
    } else {
      setError('Invalid verification link');
      setLoading(false);
    }
  }, [token]);

  const verifyEmailToken = async (token: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVerified(true);
    } catch (err: any) {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    // In a real app, this would require the user's email
    // For now, redirect to login
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <CardTitle>Verifying Email</CardTitle>
            <CardDescription>
              Please wait while we verify your email address...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {verified ? (
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            ) : error ? (
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-yellow-600" />
              </div>
            )}
          </div>
          <CardTitle>
            {verified ? 'Email Verified!' : 'Verification Failed'}
          </CardTitle>
          <CardDescription>
            {verified 
              ? 'Your email has been successfully verified. You can now log in to your account.'
              : error || 'Unable to verify your email address.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verified ? (
              <>
                <p className="text-sm text-muted-foreground text-center">
                  Thank you for verifying your email. Your account is now active and ready to use.
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground text-center">
                  The verification link may have expired or is invalid.
                </p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleResendVerification}
                  >
                    Request New Verification Email
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={() => navigate('/login')}
                  >
                    Go to Login
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;