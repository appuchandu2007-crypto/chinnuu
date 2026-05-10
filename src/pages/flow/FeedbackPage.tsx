import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';

export default function FeedbackPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  
  const [rating, setRating] = useState(0);
  const [helpful, setHelpful] = useState<string | null>(null);
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || rating === 0) return;
    
    try {
      setIsSubmitting(true);
      
      const entryData = {
        user_id: user.id,
        mood: state?.mood || '',
        reason_tag: state?.reasonTag || '',
        reason_text: state?.reasonText || '',
        better_since_last_visit: state?.betterSinceLastVisit || '',
        same_situation: state?.sameSituation || '',
        previous_helpful: state?.previousHelpful || '',
        rating,
        helpful,
        follow_up: followUp,
        suggestions
      };

      // Save to Supabase
      const { error } = await supabase.from('entries').insert([entryData]);
      if (error) throw error;
      
      let message = 'user details:\n';
      const name = profile?.name || user.user_metadata?.full_name;
      if (name) message += `• Name: ${name}\n`;
      if (user.email) message += `• Email: ${user.email}\n`;
      if (profile?.phone_number) message += `• Phone: ${profile.phone_number}\n`;
      if (profile?.age) message += `• Age: ${profile.age}\n`;
      if (profile?.gender) message += `• Gender: ${profile.gender}\n`;
      if (profile?.language) message += `• Preferred Language: ${profile.language}\n`;
      
      message += '\nresponses:\n';
      if (state?.mood) message += `• Mood: ${state.mood}\n`;
      
      const reason = state?.reasonText || state?.reasonTag;
      if (reason) message += `• Reason: ${reason}\n`;
      
      if (state?.betterSinceLastVisit) message += `• Better since last visit: ${state.betterSinceLastVisit}\n`;
      if (state?.sameSituation) message += `• Same situation: ${state.sameSituation}\n`;
      if (state?.previousHelpful) message += `• Previous helpful: ${state.previousHelpful}\n`;
      if (state?.currentFeeling) message += `• Current feeling: ${state.currentFeeling}\n`;
      
      if (rating) message += `• Rating: ${rating} Stars\n`;
      if (helpful) message += `• Did this help: ${helpful}\n`;
      if (followUp) message += `• Follow up tomorrow: ${followUp}\n`;
      if (suggestions) message += `• Suggestions: ${suggestions}\n`;

      const whatsappUrl = `https://wa.me/917411837814?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      navigate('/app/wellness');
    } catch (err) {
      console.error(err);
      alert("Please ensure the entries table exists in Supabase. Check the SQL prompt the AI provided.");
      navigate('/app/wellness'); // let them pass anyway to see dashboard
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">How was your experience today?</h2>
      
      <div className="space-y-8">
        <div>
          <label className="block text-center text-sm font-bold text-slate-700 mb-4">Rate your experience</label>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-2 transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-slate-200'}`}
              >
                <Star size={48} className={rating >= star ? 'fill-current' : ''} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-4">Did this help you?</label>
          <div className="flex gap-3">
            {['Yes', 'No', 'A little'].map(opt => (
              <button
                key={opt}
                onClick={() => setHelpful(opt)}
                className={`flex-1 py-3 px-4 rounded-xl border font-medium transition-colors ${helpful === opt ? 'bg-pink-50 border-pink-500 text-pink-700' : 'border-slate-200 hover:border-pink-200 text-slate-600'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-4">Want follow-up tomorrow?</label>
          <div className="flex gap-3">
            {['Yes, please', 'No, thanks'].map(opt => (
              <button
                key={opt}
                onClick={() => setFollowUp(opt)}
                className={`flex-1 py-3 px-4 rounded-xl border font-medium transition-colors ${followUp === opt ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-slate-200 hover:border-indigo-200 text-slate-600'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
           <label className="block text-sm font-bold text-slate-700 mb-4">Any other suggestions?</label>
           <textarea
             value={suggestions}
             onChange={e => setSuggestions(e.target.value)}
             className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none resize-none"
             placeholder="Tell us how we can improve..."
             rows={3}
           />
        </div>

        <button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className="w-full bg-slate-900 text-white py-4 px-6 rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Submit & View Dashboard'}
        </button>
      </div>
    </div>
  );
}
