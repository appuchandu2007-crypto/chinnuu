import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';
import { User, Phone, Calendar, Globe, ThumbsUp, MessageSquare, ArrowLeft, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserProfilePage() {
  const { profile, user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error(error);
        } else if (data) {
          setFeedbacks(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [user]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in">
      <Link to="/app" className="inline-flex items-center text-pink-600 font-medium mb-6 hover:text-pink-700 transition">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-6">
            <div className="w-24 h-24 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              {profile?.name?.charAt(0) || 'U'}
            </div>
            <h1 className="text-2xl font-bold text-center text-slate-800 mb-1">{profile?.name || 'User'}</h1>
            <p className="text-center text-slate-500 text-sm mb-6">{user?.email}</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-5 h-5 text-slate-400" />
                <span className="text-sm">{profile?.phone_number || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar className="w-5 h-5 text-slate-400" />
                <span className="text-sm">{profile?.dob || 'Not provided'} (Age: {profile?.age || '--'})</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Globe className="w-5 h-5 text-slate-400" />
                <span className="text-sm">{profile?.language || 'English'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <User className="w-5 h-5 text-slate-400" />
                <span className="text-sm">{profile?.gender || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ThumbsUp className="w-6 h-6 text-pink-500" /> Your Feedback History
            </h2>
            
            {loading ? (
              <p className="text-slate-500">Loading history...</p>
            ) : feedbacks.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No feedback history yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedbacks.map((f, i) => (
                  <div key={`fb-${f.id || i}-${i}`} className="p-4 border border-slate-100 rounded-2xl bg-slate-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, j) => (
                          <Star key={`star-${f.id || i}-${i}-${j}`} className={`w-4 h-4 ${j < (f.rating || 0) ? 'fill-current text-yellow-500' : 'fill-slate-200 text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{new Date(f.created_at).toLocaleDateString()}</span>
                    </div>
                    {f.suggestions && <p className="text-sm text-slate-700 italic">"{f.suggestions}"</p>}
                    {(f.follow_up === 'Yes, please' || f.follow_up === 'Yes') && (
                      <div className="mt-3 text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full inline-block font-medium">
                        Follow-up scheduled{f.schedule_time ? ` at ${new Date(f.schedule_time).toLocaleString()}` : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
