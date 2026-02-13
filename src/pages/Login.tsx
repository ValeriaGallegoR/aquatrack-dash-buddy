import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { loginSchema, loginUser, resendVerificationOtp } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { Droplets, Eye, EyeOff, ArrowLeft } from 'lucide-react';

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setUnverifiedEmail(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = loginUser(data.email, data.password);

    if (result.success) {
      toast({ title: 'Welcome back!', description: result.message });
      refreshUser();
      navigate('/dashboard');
    } else if (result.needsVerification) {
      setUnverifiedEmail(data.email.toLowerCase());
      toast({ title: 'Verification required', description: result.message, variant: 'destructive' });
    } else {
      toast({ title: 'Login failed', description: result.message, variant: 'destructive' });
    }

    setIsLoading(false);
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    const result = resendVerificationOtp(unverifiedEmail);
    if (result.success) {
      toast({ title: 'Code sent', description: result.message });
      if (result.otp) {
        toast({ title: 'Demo: Verification code', description: `Code: ${result.otp}` });
      }
      navigate('/verify-email', { state: { email: unverifiedEmail } });
    }
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
              <Droplets className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Welcome to AquaTrack</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {unverifiedEmail && (
                <div className="rounded-lg border border-primary/30 bg-secondary/50 p-3 text-sm">
                  <p className="text-foreground mb-2">Please verify your email before logging in.</p>
                  <Button type="button" variant="outline" size="sm" onClick={handleResendVerification}>
                    Resend verification code
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setValue('rememberMe', !!checked)}
                  />
                  <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Register
                </Link>
              </p>
            </CardFooter>
          </form>

          <div className="border-t px-6 py-4">
            <p className="text-xs text-muted-foreground text-center">
              Demo credentials: <strong>admin@aquatrack.com</strong> / <strong>Admin123!</strong>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
