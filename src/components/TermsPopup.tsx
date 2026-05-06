import { useState } from 'react';

export default function TermsPopup() {
  const [isOpen, setIsOpen] = useState(true);
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white border-2 border-pink-200 p-6 md:p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl text-slate-800 shadow-2xl shadow-pink-200/50">
        <h2 className="text-2xl md:text-3xl font-bold text-pink-600 mb-4 flex items-center gap-2">
          <span>📜</span> Privacy Policy & Terms
        </h2>
        
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
          <b>⚠️ Please read carefully before using our platform.</b>
        </div>

        <div className="space-y-6 mb-8 text-sm md:text-base">
          <div>
            <h3 className="text-xl font-semibold text-pink-500 mb-4 sticky top-0 bg-white py-2">Privacy Policy</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">🔒 1. Information We Collect</h4>
                <p className="mb-1 text-slate-600">We may collect basic user information such as:</p>
                <ul className="list-disc pl-6 space-y-0.5 text-slate-600">
                  <li>Name</li>
                  <li>Age</li>
                  <li>Contact Number</li>
                  <li>Messages shared on the platform</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">📊 2. How We Use Your Information</h4>
                <p className="mb-1 text-slate-600">The collected data is used only to:</p>
                <ul className="list-disc pl-6 space-y-0.5 text-slate-600">
                  <li>Provide better emotional support</li>
                  <li>Improve user experience</li>
                  <li>Understand user needs and emotions</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">🛡️ 3. Data Protection</h4>
                <p className="text-slate-600">We ensure that all user information is handled securely. We do not share, sell, or misuse your personal data.</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">🤝 4. Confidentiality</h4>
                <p className="text-slate-600">Your conversations are treated with respect and confidentiality. Our goal is to provide a safe and non-judgmental environment.</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">🚫 5. No Third-Party Sharing</h4>
                <p className="text-slate-600">We do not share your personal data with third parties without your consent, except where required by law.</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">⚙️ 6. User Control</h4>
                <p className="mb-1 text-slate-600">Users have the right to:</p>
                <ul className="list-disc pl-6 space-y-0.5 text-slate-600">
                  <li>Choose what information to share</li>
                  <li>Stop using the platform at any time</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">🚨 7. Emergency Situations</h4>
                <p className="text-slate-600">If a user expresses serious distress, we may guide them toward official helpline services for professional support.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-pink-100">
            <h3 className="text-xl font-semibold text-pink-500 mb-4 sticky top-0 bg-white py-2">Terms & Conditions</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">🎯 8. Purpose of the Platform</h4>
                <p className="text-slate-600">VV Solutions is designed to provide emotional support and guidance. This platform is <strong>for emotional support only and not a replacement for professional help</strong>.</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">👤 9. User Responsibility</h4>
                <p className="mb-1 text-slate-600">By using this platform, you agree to:</p>
                <ul className="list-disc pl-6 space-y-0.5 text-slate-600">
                  <li>Provide accurate information</li>
                  <li>Use the platform responsibly and legally</li>
                  <li>Take responsibility for the content you share</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">⚠️ 10. Respectful Behavior</h4>
                <p className="mb-1 text-slate-600">Users must behave respectfully at all times. The following are strictly prohibited:</p>
                <ul className="list-disc pl-6 space-y-0.5 mb-1 text-slate-600">
                  <li>Abuse or harassment</li>
                  <li>Hate speech or discrimination</li>
                  <li>Any inappropriate or harmful behavior</li>
                </ul>
                <p className="text-slate-600">Violation may lead to account restriction or removal.</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">🧠 11. Emotional Support Disclaimer</h4>
                <p className="mb-1 text-slate-600">We do not provide:</p>
                <ul className="list-disc pl-6 space-y-0.5 mb-1 text-slate-600">
                  <li>Medical advice</li>
                  <li>Therapy or diagnosis</li>
                  <li>Emergency crisis services</li>
                </ul>
                <p className="text-slate-600">If you are facing serious issues, please contact a professional or official helpline.</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">⚖️ 12. Limitation of Liability</h4>
                <p className="mb-1 text-slate-600">VV Solutions is not responsible for:</p>
                <ul className="list-disc pl-6 space-y-0.5 text-slate-600">
                  <li>Decisions made based on platform interactions</li>
                  <li>Any emotional or personal outcomes from using the service</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">🔄 13. Changes to Policy</h4>
                <p className="text-slate-600">We may update this Privacy Policy & Terms from time to time. Continued use of the platform means you accept any changes.</p>
              </div>
            </div>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer mb-6 p-4 bg-pink-50 rounded-xl border border-pink-100 hover:border-pink-300 transition-colors">
          <input 
            type="checkbox" 
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="w-5 h-5 mt-0.5 text-pink-600 rounded border-pink-300 focus:ring-pink-500"
          />
          <span className="text-slate-700 font-medium">I have read and agree to the Privacy Policy & Terms</span>
        </label>

        <button 
          onClick={handleAccept}
          disabled={!accepted}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
            accepted 
              ? 'bg-pink-600 hover:bg-pink-700 text-white shadow-pink-200 cursor-pointer transform hover:-translate-y-0.5' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          I Understand & Continue
        </button>
      </div>
    </div>
  );
}
