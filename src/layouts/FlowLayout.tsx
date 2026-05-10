import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home, User as UserIcon, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FlowLayout() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm">
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
                <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <UserIcon size={16} className="text-pink-600" />
                  {profile?.name || 'User'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {user.email}
                </span>
                {user.emailVerified && (
                  <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
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
