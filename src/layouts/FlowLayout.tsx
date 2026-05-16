import { useState, useRef, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home, User as UserIcon, BadgeCheck, Phone, Calendar, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FlowLayout() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between sm:h-16 items-center py-3 sm:py-0 gap-4 sm:gap-0">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/app/wellness')}>
              <div className="w-8 h-8 flex items-center justify-center bg-pink-100 text-pink-600 rounded-xl">
                <span className="font-bold text-lg">VV</span>
              </div>
              <span className="font-bold text-slate-800 tracking-tight">Solutions</span>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <button onClick={() => navigate('/app/wellness')} className="hover:bg-slate-200 px-2 py-1 rounded-lg transition text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Home size={16} className="text-pink-600" />
                  Home
                </button>
                <button onClick={() => navigate('/app/dashboard')} className="hover:bg-slate-200 px-2 py-1 rounded-lg transition text-sm font-bold text-slate-800 flex items-center gap-2">
                  Summary
                </button>
                
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setShowProfile(!showProfile)} className="hover:bg-slate-200 px-2 py-1 rounded-lg transition text-sm font-bold text-slate-800 flex items-center gap-2">
                    <UserIcon size={16} className="text-pink-600" />
                    {profile?.name || 'Profile'}
                  </button>
                  
                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-4 px-5 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                        {profile?.name?.charAt(0) || 'U'}
                      </div>
                      <h3 className="text-lg font-bold text-center text-slate-800 mb-1">{profile?.name || 'User'}</h3>
                      <p className="text-center text-slate-500 text-xs mb-4">{user?.email}</p>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-3 text-slate-600">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-sm">{profile?.phone_number || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-sm">{profile?.dob || 'Not provided'} {profile?.age ? `(Age: ${profile.age})` : ''}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                          <Globe className="w-4 h-4 text-slate-400" />
                          <span className="text-sm">{profile?.language || 'English'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-sm">{profile?.gender || 'Not specified'}</span>
                        </div>
                      </div>
                      
                      <div className="border-t border-slate-100 pt-3">
                        <button 
                           onClick={() => { setShowProfile(false); navigate('/app/profile'); }}
                           className="w-full text-center text-sm font-semibold text-pink-600 hover:text-pink-700 transition"
                        >
                           View Full AI History
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-xs text-slate-500 font-medium hidden lg:inline-block">
                  {user.email}
                </span>
                {user.emailVerified && (
                  <span className="hidden lg:flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <BadgeCheck size={14} className="mr-1" />
                    Verified
                  </span>
                )}
              </div>
              <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
              <button 
                onClick={signOut}
                className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center mt-4 sm:mt-8">
        <Outlet />
      </main>
    </div>
  );
}
