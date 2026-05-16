import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';
import { Activity, MessageCircle, Star, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function UserDashboardPage() {
  const { user, profile } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchEntries = async () => {
      try {
        const { data, error } = await supabase
          .from('entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }

        if (data) {
          setEntries(data);
        }
      } catch (error) {
        console.error('Error fetching entries', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [user]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const latestEntry = entries[0];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      <button 
        onClick={() => navigate('/app/wellness')}
        className="absolute -top-12 left-0 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors"
      >
        <ArrowLeft size={20} /> Back to Hub
      </button>

      <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-8 mt-6">
        <div className="bg-pink-100 p-4 rounded-2xl text-pink-600">
          <Activity size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800">Check-in Summary</h2>
          <p className="text-slate-500 font-medium">Review your latest check-in details</p>
        </div>
      </div>

      {latestEntry ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} /> How you are feeling right now
            </h3>
            <p className="text-2xl font-bold text-slate-800">{latestEntry.mood || 'Not provided'}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <MessageCircle size={16} /> Why you feel this way
            </h3>
            <p className="text-lg font-medium text-slate-700">
              {latestEntry.reason_text || latestEntry.reason_tag || 'Not provided'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 md:col-span-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Past Mood Entries
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-sm text-slate-500">
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Mood</th>
                    <th className="py-3 px-4 font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, idx) => (
                    <tr key={`past-entry-${entry.id || idx}-${idx}`} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors text-sm">
                      <td className="py-3 px-4 text-slate-600">
                        {new Date(entry.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {entry.mood || 'Not provided'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={`p-star-${idx}-${i}`} size={14} className={i < (entry.rating || 0) ? 'fill-current' : 'text-slate-300'} />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {(latestEntry.better_since_last_visit || latestEntry.same_situation || latestEntry.previous_helpful || latestEntry.current_feeling) && (
          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 shadow-sm flex flex-col gap-4 md:col-span-2">
            {(latestEntry.better_since_last_visit || latestEntry.same_situation || latestEntry.previous_helpful) && (
              <>
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                  Have you visited VV Solutions before? (Follow-up)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  <div className="bg-white p-4 rounded-2xl">
                     <p className="text-xs font-bold text-slate-400 mb-1">Better Since Last Visit</p>
                     <p className="font-semibold text-slate-800">{latestEntry.better_since_last_visit || 'Not provided'}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl">
                     <p className="text-xs font-bold text-slate-400 mb-1">Same Situation</p>
                     <p className="font-semibold text-slate-800">{latestEntry.same_situation || 'Not provided'}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl">
                     <p className="text-xs font-bold text-slate-400 mb-1">Previous Conversation Helpful</p>
                     <p className="font-semibold text-slate-800">{latestEntry.previous_helpful || 'Not provided'}</p>
                  </div>
                </div>
              </>
            )}
            {latestEntry.current_feeling && (
               <div className="bg-white p-4 rounded-2xl mt-2">
                 <p className="text-xs font-bold text-slate-400 mb-1">Current Feeling</p>
                 <p className="font-semibold text-slate-800">{latestEntry.current_feeling}</p>
               </div>
            )}
          </div>
          )}

          <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100 shadow-sm flex flex-col gap-4 md:col-span-2">
            <h3 className="text-sm font-bold text-pink-500 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={16} /> Suggested support for you
            </h3>
            <p className="text-slate-700 font-medium whitespace-pre-line">
              Based on your overall check-in, we previously provided tailored exercises, grounding techniques, or recommended professional support. 
              {latestEntry.current_feeling && ` You mentioned currently feeling: ${latestEntry.current_feeling}.`}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 md:col-span-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Star size={16} /> How was your experience today
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              <div className="bg-slate-50 p-4 rounded-2xl">
                 <p className="text-xs font-bold text-slate-400 mb-1">Rating</p>
                 <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={`latest-star-${latestEntry.id || 'new'}-${i}`} size={16} className={i < (latestEntry.rating || 0) ? 'fill-current' : 'text-slate-300'} />
                    ))}
                 </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                 <p className="text-xs font-bold text-slate-400 mb-1">Did this help?</p>
                 <p className="font-semibold text-slate-800">{latestEntry.helpful || 'Not provided'}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                 <p className="text-xs font-bold text-slate-400 mb-1">Follow up tomorrow?</p>
                 <p className="font-semibold text-slate-800">{latestEntry.follow_up || 'Not provided'}</p>
              </div>
            </div>
            {latestEntry.suggestions && (
              <div className="mt-4 bg-slate-50 p-4 rounded-2xl">
                 <p className="text-xs font-bold text-slate-400 mb-1">Suggestions</p>
                 <p className="font-medium text-slate-700">{latestEntry.suggestions}</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 mb-4 font-medium">No check-in details found yet.</p>
        </div>
      )}
    </div>
  );
}
