import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { SmilePlus, Mic } from 'lucide-react';
import VoiceAnalyzer from '../../components/VoiceAnalyzer';

const MOOD_SCORES: Record<string, number> = {
  'Happy': 100,
  'Calm': 80,
  'Other': 50,
  'Confused': 40,
  'Lonely': 30,
  'Tired': 30,
  'Stress': 20,
  'Anxiety': 20,
  'Guilty': 20,
  'Fear': 15,
  'Sad': 15,
  'Angry': 10,
  'Heartbroken': 10,
  'Overthinking': 10,
};

export default function WellnessDashboardPage() {
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVoiceAnalyzerOpen, setIsVoiceAnalyzerOpen] = useState(false);

  // If there's an ongoing check-in, the state will be populated
  const isMidFlow = !!location.state?.mood;

  useEffect(() => {
    if (!user) return;

    const fetchEntries = async () => {
      try {
        const { data, error } = await supabase
          .from('entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
          
        if (error) {
          throw error;
        }

        if (data) {
          let fetched = data.map(doc => ({
            id: doc.id,
            ...doc,
            date: format(new Date(doc.created_at), 'MMM dd'),
            score: MOOD_SCORES[doc.mood] || 50
          }));
          
          if (location.state?.mood) {
             fetched.push({
               id: 'current_uncommitted',
               mood: location.state.mood,
               reason_text: location.state.reasonText || location.state.reasonTag,
               date: format(new Date(), 'MMM dd'),
               score: MOOD_SCORES[location.state.mood] || 50
             });
          }
          setEntries(fetched);
        }
      } catch (error) {
        console.error('Error fetching entries from Supabase', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [user]);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  const latestEntry = entries[entries.length - 1];
  const previousEntry = entries[entries.length - 2];

  let improvementText = "Check in again tomorrow to track your progress!";
  if (latestEntry && previousEntry) {
    if (latestEntry.score > previousEntry.score) {
      improvementText = "You're doing better than your last visit. Keep it up! 🌟";
    } else if (latestEntry.score < previousEntry.score) {
      improvementText = "It's okay to have down days. We're here for you. 💙";
    } else {
      improvementText = "Holding steady. One step at a time. 🌱";
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-pink-100 p-3 rounded-2xl text-pink-600">
          <SmilePlus size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Your Wellness Journey</h2>
          <p className="text-slate-500">Welcome back, {profile?.name || 'Friend'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={() => setIsVoiceAnalyzerOpen(true)}
          className="col-span-1 md:col-span-2 bg-gradient-to-r from-pink-500 to-rose-500 p-6 rounded-3xl shadow-lg shadow-pink-500/20 text-white flex items-center justify-between group hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <Mic size={32} className="text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold mb-1">AI Voice Check-In</h3>
              <p className="text-pink-100 font-medium text-sm md:text-base">Speak your mind and let AI analyze your emotional tone.</p>
            </div>
          </div>
          <div className="hidden md:flex bg-white/20 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm backdrop-blur-sm group-hover:bg-white text-white group-hover:text-pink-600 transition-colors">
            Start Analysis
          </div>
        </button>

        {latestEntry && (
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Today's Mood</h3>
            <p className="text-2xl font-bold text-slate-800">{latestEntry.mood}</p>
            {latestEntry.reason_text && <p className="text-slate-500 mt-2 text-sm">{latestEntry.reason_text}</p>}
          </div>
        )}
        
        {previousEntry && (
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Last Visit</h3>
            <p className="text-xl font-bold text-slate-600">{previousEntry.mood}</p>
            <p className="text-slate-500 mt-2 text-sm font-medium">{improvementText}</p>
          </div>
        )}
      </div>

      {entries.length > 1 ? (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Mood Progress</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={entries} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                  formatter={(value: number, name: string, props: any) => [props.payload.mood, 'Mood']}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#db2777" 
                  strokeWidth={4}
                  dot={{ fill: '#db2777', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8 text-center">
          <p className="text-slate-500">More data is needed to show your mood progress chart. Check in again soon!</p>
        </div>
      )}

      {isMidFlow ? (
        <button
          onClick={() => navigate('/app/support', { state: location.state })}
          className="w-full bg-slate-900 text-white py-4 px-6 rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          Continue to Suggested Support
        </button>
      ) : (
        <Link 
          to="/app/profile-setup" 
          className="block text-center w-full bg-slate-900 text-white py-4 px-6 rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          Start New Check-in
        </Link>
      )}

      <VoiceAnalyzer isOpen={isVoiceAnalyzerOpen} onClose={() => setIsVoiceAnalyzerOpen(false)} />
    </div>
  );
}
