import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from '@/hooks/use-toast';
import { verifyEmailOtp, resendVerificationOtp } from '@/lib/auth';
import { Droplets, ArrowLeft, Mail } from 'lucide-react';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || '';
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }
    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));

    const result = verifyEmailOtp(email, otp);
    if (result.success) {
      toast({ title: 'Email verified!', description: result.message });
      navigate('/login');
    } else {
      toast({ title: 'Verification failed', description: result.message, variant: 'destructive' });
      setOtp('');
    }
    setIsLoading(false);
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setResendCooldown(60);

    const result = resendVerificationOtp(email);
    if (result.success) {
      toast({ title: 'Code resent', description: result.message });
      if (result.otp) {
        toast({ title: 'Demo: New verification code', description: `Code: ${result.otp}` });
      }
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }

    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary via-background to-secondary/50 p-4">
      <div className="flex w-full max-w-md items-start gap-3">
        <button
          onClick={() => navigate(-1)}
          className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full water-gradient">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to <strong>{email}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button onClick={handleVerify} className="w-full" disabled={otp.length !== 6 || isLoading}>
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={!canResend}
              className="text-sm"
            >
              {canResend ? 'Resend Code' : `Resend in ${resendCooldown}s`}
            </Button>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
