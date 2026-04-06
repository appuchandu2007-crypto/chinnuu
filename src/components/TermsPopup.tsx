import { useState, useEffect } from 'react';

export default function TermsPopup() {
  const [accepted, setAccepted] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isAccepted = localStorage.getItem('vv_terms_accepted');
    if (isAccepted !== 'yes') {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    if (!checked) {
      alert("Please accept terms first");
      return;
    }
    localStorage.setItem('vv_terms_accepted', 'yes');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[1000] flex justify-center items-center p-4">
      <div className="bg-slate-900 border-2 border-pink-500 p-6 w-full max-w-2xl max-h-[80vh] overflow-auto rounded-xl text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]">
        <h2 className="text-2xl font-bold text-pink-500 mb-4">📜 Privacy Policy & Terms</h2>
        <p className="text-red-400 mb-4"><b>⚠️ Please read carefully before using our platform.</b></p>
        
        <h3 className="text-xl font-semibold text-pink-400 mt-4 mb-2">Privacy Policy</h3>
        <p className="text-gray-300 mb-4">
          We collect basic information like name, age, contact number, and messages only to provide better emotional support.
          Your data is kept secure and confidential. We do not sell or share your data with third parties.
        </p>

        <h3 className="text-xl font-semibold text-pink-400 mt-4 mb-2">Terms & Conditions</h3>
        <p className="text-gray-300 mb-2">
          This platform is for emotional support only and not a replacement for professional help.
          Users must behave respectfully. Any abuse, harassment, or inappropriate behavior is strictly prohibited.
          Strict action will be taken if rules are violated.
        </p>
        <p className="text-gray-300 mb-4">
          In case of serious emotional distress, users are encouraged to contact professional helplines immediately.
        </p>

        <p className="text-red-500 font-bold mb-6">⚠️ 100% Safe & Confidential Platform</p>

        <label className="flex items-center gap-3 cursor-pointer mb-6 p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-pink-500 transition-colors">
          <input 
            type="checkbox" 
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="w-5 h-5 accent-pink-500"
          />
          <span className="text-gray-200">I have read and agree to the Privacy Policy & Terms</span>
        </label>

        <button 
          onClick={handleAccept}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          I Understand & Continue
        </button>
      </div>
    </div>
  );
}
