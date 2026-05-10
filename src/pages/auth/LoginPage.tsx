import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../supabase';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Email Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccessMsg('');
      setResendMsg('');
      setNeedsVerification(false);
      
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            setError("Your email is not verified yet. Please check your inbox.");
            setNeedsVerification(true);
          } else {
            setError(error.message);
          }
          setLoading(false);
          return;
        }
        if (data.user) {
          navigate('/app/profile-setup');
        }
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            }
          }
        });
        
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        if (data.user?.identities?.length === 0) {
           setError('This email is already in use. Please sign in instead.');
           setLoading(false);
           return;
        }

        if (data.session) {
           navigate('/app/profile-setup');
        } else {
           setSuccessMsg('Account created. If required by your database, please verify your email. Or you can try signing in now.');
           setTimeout(() => {
             setIsLogin(true);
           }, 2000);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === 'Failed to fetch') {
          setError('Network error: Failed to connect to the database. If you are using an Ad Blocker or Privacy extension (like Brave Shields), please disable it for this site. Also ensure your Supabase URL is correct.');
        } else {
          setError(err.message || 'Authentication failed. Please check your credentials.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address to reset password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/login",
      });
      if (error) throw error;
      setSuccessMsg('Password reset link sent to your email.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to send reset email');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (email) {
      try {
        setLoading(true);
        setError('');
        setResendMsg('');
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email,
          options: {
            emailRedirectTo: window.location.origin + "/login",
          }
        });
        if (error) throw error;
        setResendMsg('Verification email sent again. Please check your inbox.');
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Failed to resend verification email');
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please enter your email to resend verification link.');
    }
  };

  const handleRefreshStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email_confirmed_at) {
        setSuccessMsg('Email verified successfully. Welcome.');
        setError('');
        setResendMsg('');
        setNeedsVerification(false);
        navigate('/app/profile-setup');
    } else {
        setError("Your email is not verified yet. Please check your inbox.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center transform rotate-12">
             <Sparkles className="w-6 h-6 text-pink-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Welcome to VV solution (Valuable Voices)' : 'Create an account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your safe space for emotional wellness
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">

          <form className="space-y-6" onSubmit={handleEmailSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm font-medium text-pink-600 hover:text-pink-500"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</div>}
            {resendMsg && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">{resendMsg}</div>}
            {successMsg && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">{successMsg}</div>}

            {needsVerification && (
              <div className="flex flex-col space-y-3">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-pink-300 rounded-md shadow-sm text-sm font-medium text-pink-700 bg-pink-50 hover:bg-pink-100"
                >
                   {loading ? 'Sending...' : 'Resend Verification Email'}
                </button>
                <button
                  type="button"
                  onClick={handleRefreshStatus}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                   Refresh Verification Status
                </button>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
              >
                {loading ? 'Processing...' : isLogin ? 'Sign in with Email' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccessMsg('');
                setResendMsg('');
                setNeedsVerification(false);
              }}
              className="text-sm font-medium text-pink-600 hover:text-pink-500 disabled:opacity-50"
              disabled={loading}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
