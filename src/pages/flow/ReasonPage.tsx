import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const REASON_TAGS = [
  'Family issues',
  'Love breakup',
  'Career stress',
  'Studies',
  'Financial problem',
  'Health issue',
  'Friendship issue',
  'Life transition',
  'Unknown reason'
];

export default function ReasonPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const mood = location.state?.mood || 'this way';
  
  const [reasonText, setReasonText] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const handleNext = () => {
    navigate('/app/visit-history', { 
      state: { 
        ...location.state,
        reasonText,
        reasonTag: selectedTag
      } 
    });
  };

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Would you like to share why you feel {mood.toLowerCase()}?</h2>
      <p className="text-slate-500 mb-8">This helps us understand your situation better.</p>
      
      <div className="flex flex-wrap gap-3 mb-8">
        {REASON_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${selectedTag === tag ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-2">Tell us more details (Optional)</label>
        <textarea
          value={reasonText}
          onChange={(e) => setReasonText(e.target.value)}
          rows={5}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none resize-none"
          placeholder="Type here..."
        />
      </div>

      <button
        onClick={handleNext}
        className="w-full bg-pink-600 text-white py-4 px-6 rounded-xl font-bold hover:bg-pink-700 transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
