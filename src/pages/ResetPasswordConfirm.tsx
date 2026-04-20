
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Logo from '@/assets/logo.svg';

const ResetPasswordConfirm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  const location = useLocation();
  
  // Parse token from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get('token');
    setToken(tokenParam);
  }, [location]);
  
  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  }, [password]);
  
  const getStrengthText = () => {
    if (passwordStrength === 0) return "Empty";
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };
  
  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-muted";
    if (passwordStrength <= 25) return "bg-bearish";
    if (passwordStrength <= 50) return "bg-warning";
    if (passwordStrength <= 75) return "bg-info";
    return "bg-bullish";
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (passwordStrength < 50) {
      setError("Please use a stronger password");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (token) {
        setResetSuccess(true);
      } else {
        setError("Invalid or expired reset token");
      }
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <Link to="/" className="flex items-center gap-2">
              <img src={Logo} alt="ProfitPilot" className="h-10 w-10" />
              <span className="font-bold text-xl">ProfitPilot</span>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {!resetSuccess ? "Create new password" : "Password reset successful"}
          </CardTitle>
          <CardDescription className="text-center">
            {!resetSuccess 
              ? "Your new password must be different from previously used passwords" 
              : "Your password has been successfully reset"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!resetSuccess ? (
            <>
              {error && (
                <div className="p-3 bg-bearish/10 border border-bearish/20 rounded-md text-bearish text-sm flex items-start">
                  <XCircle className="h-4 w-4 mt-0.5 mr-2 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              {!token && (
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-md text-warning text-sm">
                  This reset link appears to be invalid or expired. Please request a new password reset.
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={!token || loading}
                      className="pr-10"
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  <div className="space-y-1 mt-1">
                    <div className="flex justify-between text-xs">
                      <span>Password strength:</span>
                      <span className={
                        passwordStrength === 0 ? "text-muted-foreground" :
                        passwordStrength <= 25 ? "text-bearish" :
                        passwordStrength <= 50 ? "text-warning" :
                        passwordStrength <= 75 ? "text-info" :
                        "text-bullish"
                      }>
                        {getStrengthText()}
                      </span>
                    </div>
                    <Progress value={passwordStrength} className={`h-1 ${getStrengthColor()}`} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!token || loading}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!token || loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center text-center space-y-4 py-6">
              <div className="h-12 w-12 rounded-full bg-bullish/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-bullish" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Password Successfully Reset</h3>
                <p className="text-sm text-muted-foreground">
                  Your password has been changed. You can now login with your new credentials.
                </p>
              </div>
              
              <Button className="mt-4">
                <Link to="/">Login to your account</Link>
              </Button>
            </div>
          )}
        </CardContent>
        {!resetSuccess && (
          <CardFooter>
            <div className="w-full flex justify-center">
              <Link to="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to login
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ResetPasswordConfirm;
