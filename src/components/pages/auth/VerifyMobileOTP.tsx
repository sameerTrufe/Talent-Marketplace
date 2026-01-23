// src/pages/auth/VerifyMobileOTP.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { UserService } from '../../../lib/api/UserService';
import { CheckCircle, Loader2, ArrowLeft, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface LocationState {
  mobileNumber: string;
}

const VerifyMobileOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [mobileNumber, setMobileNumber] = useState(state?.mobileNumber || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!mobileNumber) {
      navigate('/login');
    }
  }, [mobileNumber, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await UserService.verifyMobile(mobileNumber, otpString);
      toast.success('Mobile number verified successfully');
      navigate('/login', { state: { message: 'Mobile verified successfully' } });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setResendLoading(true);
    try {
      await UserService.sendMobileOTP(mobileNumber);
      setCountdown(60);
      setCanResend(false);
      toast.success('OTP sent successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

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
            Back
          </Button>
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Verify Mobile Number</CardTitle>
            <CardDescription>
              Enter the 6-digit OTP sent to {mobileNumber}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* OTP Inputs */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold"
                />
              ))}
            </div>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Didn't receive the code?
              </p>
              <Button
                variant="link"
                onClick={handleResendOTP}
                disabled={!canResend || resendLoading}
                className="h-auto p-0"
              >
                {resendLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4 mr-1" />
                )}
                {canResend ? 'Resend OTP' : `Resend in ${countdown}s`}
              </Button>
            </div>

            {/* Verify Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleVerify}
              disabled={loading || otp.join('').length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>

            {/* Help Text */}
            <p className="text-xs text-muted-foreground text-center">
              By verifying your mobile number, you agree to receive important updates and notifications.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyMobileOTP;