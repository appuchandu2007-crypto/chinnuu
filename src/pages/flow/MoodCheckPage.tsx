import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EMOTIONS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '😨', label: 'Fear' },
  { emoji: '😕', label: 'Confused' },
  { emoji: '😞', label: 'Lonely' },
  { emoji: '😣', label: 'Guilty' },
  { emoji: '😩', label: 'Stress' },
  { emoji: '😰', label: 'Anxiety' },
  { emoji: '💔', label: 'Heartbroken' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🤯', label: 'Overthinking' },
  { emoji: '🌑', label: 'Hopeless' },
  { emoji: '💔', label: 'Self harm' },
  { emoji: '🌧️', label: 'Severe depression' },
  { emoji: '✨', label: 'Other' },
];

export default function MoodCheckPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const handleNext = () => {
    const finalMood = selected === 'Other' ? otherReason : selected;
    if (!finalMood) return;
    
    // Pass it via state to the next route
    navigate('/app/reason', { state: { mood: finalMood, originalMood: selected } });
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">How are you feeling right now?</h2>
      <p className="text-slate-500 text-center mb-8">Take a moment to check in with yourself.</p>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8">
        {EMOTIONS.map(e => (
          <button
            key={e.label}
            onClick={() => setSelected(e.label)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${selected === e.label ? 'border-pink-500 bg-pink-50 scale-105 shadow-md' : 'border-slate-100 bg-white hover:border-pink-200'}`}
          >
            <span className="text-4xl mb-2">{e.emoji}</span>
            <span className="text-sm font-medium text-slate-700">{e.label}</span>
          </button>
        ))}
      </div>

      {selected === 'Other' && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-2">
          <input
            type="text"
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
            placeholder="Please specify your emotion..."
            autoFocus
          />
        </div>
      )}

      {selected && (
        <button
          onClick={handleNext}
          disabled={selected === 'Other' && !otherReason}
          className="w-full bg-slate-900 text-white py-4 px-6 rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          Continue
        </button>
      )}
    </div>
  );
}
