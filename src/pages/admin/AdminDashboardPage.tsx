import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { Users, Smile, Activity, Star, TrendingUp, RotateCcw } from 'lucide-react';

export default function AdminDashboardPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profilesRes, entriesRes] = await Promise.all([
          supabase.from('profiles').select('*'),
          supabase.from('entries').select('*')
        ]);
        
        if (profilesRes.data) setProfiles(profilesRes.data);
        if (entriesRes.data) setEntries(entriesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading admin dashboard...</div>;

  const totalUsers = profiles.length;
  const maleCount = profiles.filter(p => p.gender === 'Male').length;
  const femaleCount = profiles.filter(p => p.gender === 'Female').length;
  const otherCount = totalUsers - maleCount - femaleCount;

  // Calculate metrics
  const returningUsersCount = new Set(entries.filter(e => e.better_since_last_visit).map(e => e.user_id)).size;
  
  const averageRating = entries.length > 0 
    ? (entries.reduce((acc, curr) => acc + (curr.rating || 0), 0) / entries.length).toFixed(1)
    : '0';

  // Most common emotion today
  const today = new Date().toISOString().split('T')[0];
  const todaysEntries = entries.filter(e => e.created_at?.startsWith(today));
  
  let mostCommonEmotion = 'N/A';
  if (todaysEntries.length > 0) {
    const moodCounts = todaysEntries.reduce((acc: any, curr) => {
      acc[curr.mood] = (acc[curr.mood] || 0) + 1;
      return acc;
    }, {});
    mostCommonEmotion = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);
  }

  // Mood improvement rate (percentage of returning users who said 'Yes' or 'Slightly Better')
  const returningEntries = entries.filter(e => e.better_since_last_visit);
  let improvementRate = '0%';
  if (returningEntries.length > 0) {
    const improvedCount = returningEntries.filter(e => 
      e.better_since_last_visit === 'Yes' || e.better_since_last_visit === 'Slightly Better'
    ).length;
    improvementRate = Math.round((improvedCount / returningEntries.length) * 100) + '%';
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl">
            <Users size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Users</p>
            <p className="text-2xl font-bold text-slate-800">{totalUsers}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-pink-100 text-pink-600 rounded-2xl">
            <Smile size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Common Mood (Today)</p>
            <p className="text-2xl font-bold text-slate-800 truncate max-w-[120px]">{mostCommonEmotion}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl">
            <RotateCcw size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Returning Users</p>
            <p className="text-2xl font-bold text-slate-800">{returningUsersCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-2xl">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Improved</p>
            <p className="text-2xl font-bold text-slate-800">{improvementRate}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-4">Demographics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-2xl">
              <p className="text-2xl font-bold text-slate-800">{maleCount > 0 ? Math.round((maleCount/totalUsers)*100) : 0}%</p>
              <p className="text-sm text-slate-500">Male</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-2xl">
              <p className="text-2xl font-bold text-slate-800">{femaleCount > 0 ? Math.round((femaleCount/totalUsers)*100) : 0}%</p>
              <p className="text-sm text-slate-500">Female</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-2xl">
              <p className="text-2xl font-bold text-slate-800">{otherCount > 0 ? Math.round((otherCount/totalUsers)*100) : 0}%</p>
              <p className="text-sm text-slate-500">Other</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center">
            <div className="text-center">
               <div className="inline-flex p-4 bg-yellow-50 text-yellow-500 rounded-full mb-4">
                  <Star size={48} className="fill-current" />
               </div>
               <p className="text-5xl font-bold text-slate-800 mb-2">{averageRating}</p>
               <p className="text-slate-500 font-medium">Average Feedback Rating</p>
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <h2 className="text-xl font-bold mb-4">Latest Check-ins</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-sm font-bold text-slate-500">Date</th>
                <th className="py-3 px-4 text-sm font-bold text-slate-500">Name</th>
                <th className="py-3 px-4 text-sm font-bold text-slate-500">Contact</th>
                <th className="py-3 px-4 text-sm font-bold text-slate-500">Demographics</th>
                <th className="py-3 px-4 text-sm font-bold text-slate-500">Mood</th>
                <th className="py-3 px-4 text-sm font-bold text-slate-500">Rating</th>
                <th className="py-3 px-4 text-sm font-bold text-slate-500">Suggestions</th>
              </tr>
            </thead>
            <tbody>
              {entries.slice(-10).reverse().map(entry => {
                const userProfile = profiles.find(p => p.id === entry.user_id);
                const date = new Date(entry.created_at).toLocaleDateString();
                return (
                  <tr key={entry.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-slate-500 whitespace-nowrap">{date}</td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">{userProfile?.name || 'Unknown'}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">
                      <div>{userProfile?.phone_number || '-'}</div>
                      <div>{userProfile?.email || '-'}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">
                      {userProfile?.gender || '-'}, {userProfile?.age || '-'}, {userProfile?.language || '-'}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                       <span className="bg-slate-100 px-2 py-1 rounded-md text-xs">{entry.mood || userProfile?.emotion || '-'}</span>
                    </td>
                    <td className="py-3 px-4 text-yellow-500 font-medium">{entry.rating} ⭐</td>
                    <td className="py-3 px-4 text-sm text-slate-600 truncate max-w-[200px]">{entry.suggestions || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {entries.length === 0 && (
            <p className="text-center py-8 text-slate-500">No feedback entries yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
