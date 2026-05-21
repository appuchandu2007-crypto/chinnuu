import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, HeartPulse, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';

export default function SupportPage() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const mood = (state.originalMood && state.originalMood !== 'Other' ? state.originalMood : state.mood)?.toLowerCase() || '';

  const [betterSinceLastVisit, setBetterSinceLastVisit] = useState('');
  const [sameSituation, setSameSituation] = useState('');
  const [previousHelpful, setPreviousHelpful] = useState('');
  const [currentFeeling, setCurrentFeeling] = useState('');
  const [otherFeeling, setOtherFeeling] = useState('');
  const [extraMessage, setExtraMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const isEmergencyInfo = mood.includes('hopeless') || 
                          mood.includes('self harm') || 
                          mood.includes('suicide') || 
                          mood.includes('severe');

  const handleSubmitFollowUp = async () => {
    if (!betterSinceLastVisit || !sameSituation || !previousHelpful || !currentFeeling || (currentFeeling === 'Other' && !otherFeeling)) {
      setShowError(true);
      return;
    }
    
    setShowError(false);
    setIsSubmitting(true);
    
    const finalFeeling = currentFeeling === 'Other' ? otherFeeling : currentFeeling;
    
    let waMessage = 'VV Solutions Follow-Up\n\n';
    const name = profile?.name || user?.user_metadata?.full_name;
    if (name) waMessage += `Name: ${name}\n`;
    if (user?.email) waMessage += `Email: ${user.email}\n`;

    waMessage += `\nBetter Since Last Visit: ${betterSinceLastVisit}\n`;
    waMessage += `Same Situation: ${sameSituation}\n`;
    waMessage += `Previous Conversation Helpful: ${previousHelpful}\n`;
    waMessage += `Current Feeling: ${finalFeeling}\n`;
    
    if (extraMessage) waMessage += `Extra Message: ${extraMessage}\n`;

    const now = new Date();
    waMessage += `\nDate: ${now.toLocaleDateString()}\n`;
    waMessage += `Time: ${now.toLocaleTimeString()}\n`;

    try {
      if (user) {
        // Prepare data to match new entries columns
       // Note: we can either strictly use state variables from previous questions here, 
       // but here we just update betterSinceLastVisit, sameSituation, etc.
        await supabase.from('entries').insert([{
           user_id: user.id,
           mood: state.mood || '',
           reason_text: state.reasonText || state.reasonTag || '',
           better_since_last_visit: betterSinceLastVisit,
           same_situation: sameSituation,
           previous_helpful: previousHelpful,
           current_feeling: finalFeeling,
           extra_message: extraMessage
        }]);
      }
      
      setIsSubmitting(false);
      setShowSuccess(true);
      
      const waText = encodeURIComponent(waMessage);
      const whatsappUrl = `https://wa.me/917411837814?text=${waText}`;
      window.open(whatsappUrl, '_blank');
      
      // Let success message show briefly before navigating to feedback
      setTimeout(() => {
        navigate('/app/feedback', { 
           state: { 
             ...state, 
             betterSinceLastVisit, 
             sameSituation, 
             previousHelpful,
             currentFeeling: finalFeeling
           } 
        });
      }, 1500);

    } catch (err) {
      console.error('Error saving follow-up:', err);
      setIsSubmitting(false);
    }
  };

  const renderSupportContent = () => {
    if (mood.includes('sad') || mood.includes('lonely') || mood.includes('heartbroken')) {
      return (
        <ul className="space-y-4">
          <li className="flex items-start gap-3"><CheckCircle2 className="text-pink-500 mt-1" size={20} /> <span className="text-lg">Try a simple 4-7-8 breathing exercise.</span></li>
          <li className="flex items-start gap-3"><CheckCircle2 className="text-pink-500 mt-1" size={20} /> <span className="text-lg">"You are stronger than this moment. It's okay to rest."</span></li>
          <li className="flex items-start gap-3"><CheckCircle2 className="text-pink-500 mt-1" size={20} /> <span className="text-lg">Talk to someone trusted, or chat with our assistant below.</span></li>
        </ul>
      );
    }
    if (mood.includes('angry')) {
      return (
        <ul className="space-y-4">
          <li className="flex items-start gap-3"><CheckCircle2 className="text-pink-500 mt-1" size={20} /> <span className="text-lg">Listen to calm, slow-tempo music.</span></li>
          <li className="flex items-start gap-3"><CheckCircle2 className="text-pink-500 mt-1" size={20} /> <span className="text-lg">Do a 10-second deep breathing countdown.</span></li>
          <li className="flex items-start gap-3"><CheckCircle2 className="text-pink-500 mt-1" size={20} /> <span className="text-lg">Write your feelings down on paper, then throw it away.</span></li>
        </ul>
      );
    }
    if (mood.includes('anx') || mood.includes('stress') || mood.includes('fear') || mood.includes('overthink')) {
      return (
        <ul className="space-y-4">
          <li className="flex items-start gap-3"><CheckCircle2 className="text-pink-500 mt-1" size={20} /> <span className="text-lg">Grounding exercise: Name 5 things you can see, 4 you can touch, 3 you hear.</span></li>
          <li className="flex items-start gap-3"><CheckCircle2 className="text-pink-500 mt-1" size={20} /> <span className="text-lg">Take a walk outside for 10 minutes without your phone.</span></li>
          <li className="flex items-start gap-3"><CheckCircle2 className="text-pink-500 mt-1" size={20} /> <span className="text-lg">We are here. You are safe. Take it one hour at a time.</span></li>
        </ul>
      );
    }
    
    // Default
    return (
        <ul className="space-y-4">
          <li className="flex items-start gap-3"><CheckCircle2 className="text-pink-500 mt-1" size={20} /> <span className="text-lg">Take a deep breath and acknowledge your feelings.</span></li>
          <li className="flex items-start gap-3"><CheckCircle2 className="text-pink-500 mt-1" size={20} /> <span className="text-lg">Drink a glass of water and stretch gently.</span></li>
          <li className="flex items-start gap-3"><CheckCircle2 className="text-pink-500 mt-1" size={20} /> <span className="text-lg">Remember that you are capable of navigating today.</span></li>
        </ul>
    );
  };

  return (
    <div className="w-full max-w-2xl">
      {isEmergencyInfo && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl mb-8 animate-in fade-in">
          <div className="flex items-center gap-3 mb-3">
             <HeartPulse className="text-red-500" size={28} />
             <h3 className="text-2xl font-bold text-red-900">You matter.</h3>
          </div>
          <p className="text-red-800 text-lg mb-4">
            Please reach out to trusted family, a local support person, or a professional counselor immediately. You do not have to struggle alone.
          </p>
          <div className="flex items-center gap-2 p-3 bg-red-100 rounded-xl max-w-max">
            <Phone className="text-red-600" />
            <a href="tel:112" className="text-red-700 font-bold hover:underline">Emergency: 112</a>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Suggested Support for You</h2>
        <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
           {renderSupportContent()}
        </div>

        {/* Follow Up Section */}
        <div className="mt-10 border-t border-slate-100 pt-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6">I Have Read - Follow Up</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">1. Are you feeling better since your last visit?</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Yes', 'Slightly Better', 'Same', 'Worse'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setBetterSinceLastVisit(opt)}
                    className={`py-2 px-3 rounded-xl border text-sm font-medium transition-colors ${betterSinceLastVisit === opt ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50 text-slate-600'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">2. Are you still in the same situation?</label>
              <div className="flex gap-2">
                {['Yes', 'No', 'Partially'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSameSituation(opt)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-sm font-medium transition-colors ${sameSituation === opt ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50 text-slate-600'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">3. Was our previous conversation helpful?</label>
              <div className="grid grid-cols-2 gap-2">
                {['Very Helpful', 'Helpful', 'Little Helpful', 'Not Helpful'].map(opt => (
                   <button
                   key={opt}
                   onClick={() => setPreviousHelpful(opt)}
                   className={`py-2 px-3 rounded-xl border text-sm font-medium transition-colors ${previousHelpful === opt ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50 text-slate-600'}`}
                 >
                   {opt}
                 </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">4. How are you feeling now?</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {['Happy 😊', 'Sad 😔', 'Angry 😡', 'Stress 😩', 'Anxiety 😰', 'Lonely 😞', 'Confused 😕', 'Better 🙂', 'Other'].map(e => (
                   <button
                   key={e}
                   onClick={() => {
                     setCurrentFeeling(e);
                     if (e !== 'Other') setOtherFeeling('');
                   }}
                   className={`p-2 rounded-xl border text-sm transition-colors flex items-center justify-center ${currentFeeling === e ? 'bg-indigo-50 border-indigo-500 shadow-sm font-bold text-indigo-700' : 'border-slate-200 bg-white hover:border-indigo-200 text-slate-600'}`}
                 >
                   {e}
                 </button>
                ))}
              </div>
              {currentFeeling === 'Other' && (
                <input 
                  type="text" 
                  value={otherFeeling}
                  onChange={e => setOtherFeeling(e.target.value)}
                  placeholder="Please specify..." 
                  className="w-full mt-3 px-4 py-3 rounded-xl border border-indigo-200 outline-none focus:border-indigo-500 bg-indigo-50/30" 
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">5. Would you like to share anything else?</label>
              <textarea 
                value={extraMessage}
                onChange={e => setExtraMessage(e.target.value)}
                placeholder="Optional message..." 
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 resize-none bg-white"
              />
            </div>

            {showError && (
              <div className="text-red-500 font-medium text-sm p-3 bg-red-50 rounded-lg border border-red-100">
                Please complete all required questions above (1-4).
              </div>
            )}

            {showSuccess && (
              <div className="text-green-600 font-bold text-sm p-4 bg-green-50 rounded-lg border border-green-200 flex items-center gap-2">
                <CheckCircle2 size={20} />
                Information submitted! Redirecting to WhatsApp...
              </div>
            )}

            <button
              onClick={handleSubmitFollowUp}
              disabled={isSubmitting || showSuccess}
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 px-6 rounded-xl font-bold hover:bg-[#128C7E] transition-colors shadow-lg shadow-green-200 disabled:opacity-70 mt-6"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-6 h-6 brightness-0 invert" />
              {isSubmitting ? 'Sending...' : 'Submit & Connect on WhatsApp'}
            </button>

            <button
              onClick={() => navigate('/app/feedback', { state })}
              className="w-full bg-slate-100 text-slate-600 py-3 px-6 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Skip Follow-Up & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
