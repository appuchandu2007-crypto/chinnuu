import { useNavigate, useLocation } from 'react-router-dom';

export default function VisitHistoryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelect = (isFirstTime: boolean) => {
    if (isFirstTime) {
      navigate('/app/goal-selection', { state: location.state });
    } else {
      navigate('/app/support', { state: location.state });
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Have you visited VV Solutions before?</h2>
      
      <div className="flex flex-col gap-4">
        <button
          onClick={() => handleSelect(true)}
          className="w-full py-5 px-6 rounded-2xl border-2 border-slate-100 bg-white hover:border-pink-300 hover:bg-pink-50 transition-all font-semibold text-lg text-slate-700 flex flex-col items-center gap-2"
        >
          <span className="text-3xl">🌟</span>
          First Time Visitor
        </button>
        
        <button
          onClick={() => handleSelect(false)}
          className="w-full py-5 px-6 rounded-2xl border-2 border-slate-100 bg-white hover:border-indigo-300 hover:bg-indigo-50 transition-all font-semibold text-lg text-slate-700 flex flex-col items-center gap-2"
        >
          <span className="text-3xl">🔄</span>
          Returning User
        </button>
      </div>
    </div>
  );
}
