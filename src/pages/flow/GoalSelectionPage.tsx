import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GOALS = [
  { icon: '🚀', label: 'Motivation' },
  { icon: '🧘', label: 'Calm mind' },
  { icon: '❤️', label: 'Relationship advice' },
  { icon: '😌', label: 'Stress help' },
  { icon: '🌬️', label: 'Anxiety help' },
  { icon: '💼', label: 'Career guidance' },
  { icon: '🗣️', label: 'Someone to talk' },
  { icon: '💖', label: 'Self-love help' },
];

export default function GoalSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedGoal, setSelectedGoal] = useState('');

  const handleNext = () => {
    navigate('/app/wellness', { 
      state: { 
        ...location.state,
        firstTimeSupport: selectedGoal
      } 
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">What support do you need today?</h2>
      <p className="text-slate-500 text-center mb-10">We are here to help you with whatever you need.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {GOALS.map(goal => (
          <button
            key={goal.label}
            onClick={() => setSelectedGoal(goal.label)}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${selectedGoal === goal.label ? 'border-pink-500 bg-pink-50 scale-105 shadow-md' : 'border-slate-100 bg-white hover:border-pink-100 hover:bg-slate-50'}`}
          >
            <span className="text-3xl mb-3">{goal.icon}</span>
            <span className="text-sm font-medium text-slate-700 text-center">{goal.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!selectedGoal}
        className="w-full bg-slate-900 text-white py-4 px-6 rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
}
