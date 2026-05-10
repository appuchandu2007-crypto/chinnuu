import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResend = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: window.location.origin + "/login",
        }
      });
      if (error) throw error;
      
      setMessage('Verification email sent again. Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const checkVerificationStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email_confirmed_at) {
        navigate('/app/profile-setup');
    } else {
        setError("Your email is not verified yet. Please check your inbox.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-pink-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email address</h2>
        
        <p className="text-gray-600 mb-6">
          Verification email sent successfully. Please check inbox or spam folder.
        </p>

        {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">{error}</div>}
        {message && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md mb-4">{message}</div>}

        <div className="space-y-3 mt-6">
          <button
            onClick={checkVerificationStatus}
            className="w-full flex items-center justify-center bg-pink-600 text-white rounded-lg py-3 font-medium hover:bg-pink-700 transition"
          >
            Refresh Verification Status
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          
          <button
            onClick={handleResend}
            disabled={loading}
            className="w-full bg-white text-gray-700 rounded-lg py-3 font-medium hover:bg-slate-50 border border-gray-200 transition"
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
          
          <button
            onClick={handleSignOut}
            className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 mt-2"
          >
            Sign in with a different account
          </button>
        </div>
      </div>
    </div>
  );
}
