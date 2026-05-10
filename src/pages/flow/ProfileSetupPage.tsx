import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronRight } from 'lucide-react';

export default function ProfileSetupPage() {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (profile?.name && profile?.gender && profile?.dob && profile?.language && profile?.phone_number) {
      navigate('/app/mood-check');
    }
  }, [profile, navigate]);

  const [name, setName] = useState(profile?.name || '');
  const [gender, setGender] = useState(profile?.gender || '');
  const [genderSpecify, setGenderSpecify] = useState('');
  const [dob, setDob] = useState(profile?.dob || '');
  const [phone_number, setPhone_Number] = useState(profile?.phone_number || '');
  const [language, setLanguage] = useState(profile?.language || '');

  const LANGUAGES = ['English', 'Kannada', 'Hindi', 'Telugu', 'Tamil'];

  // If profile is already set up and not explicitly trying to edit, we can skip
  // But let's let them fill it if name or dob is missing.

  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateAge = (dobString: string) => {
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleNext = async () => {
    if (!name || !gender || !dob || !language || !phone_number) return;
    
    try {
      setIsSubmitting(true);
      const finalGender = gender === 'Other' ? genderSpecify : gender;

      await updateProfile({
        name,
        phone_number,
        gender: finalGender,
        dob,
        age: calculateAge(dob),
        language,
      });
      
    } catch (error: any) {
      console.error('Supabase profile update failed. Proceeding locally.', error);
    } finally {
      setIsSubmitting(false);
      navigate('/app/mood-check');
    }
  };

  return (
    <div className="w-full bg-white p-8 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Let's set up your profile</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">How should we call you? (Full Name)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={phone_number}
            onChange={(e) => setPhone_Number(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
            placeholder="Your phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Language for Consultation</label>
          <div className="flex flex-wrap gap-3">
            {LANGUAGES.map(lang => (
              <label key={lang} className={`flex-1 min-w-[80px] text-center px-4 py-3 rounded-xl border cursor-pointer transition-all ${language === lang ? 'bg-pink-50 border-pink-500 text-pink-700 font-medium' : 'border-slate-200 hover:border-pink-200 text-slate-600'}`}>
                <input type="radio" className="hidden" name="language" value={lang} checked={language === lang} onChange={() => setLanguage(lang)} />
                {lang}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
          <div className="flex flex-wrap gap-4">
            {['Male', 'Female', 'Other'].map(g => (
              <label key={g} className={`flex-1 min-w-[100px] text-center px-4 py-3 rounded-xl border cursor-pointer transition-all ${gender === g ? 'bg-pink-50 border-pink-500 text-pink-700 font-medium' : 'border-slate-200 hover:border-pink-200 text-slate-600'}`}>
                <input type="radio" className="hidden" name="gender" value={g} checked={gender === g} onChange={() => setGender(g)} />
                {g}
              </label>
            ))}
          </div>
        </div>

        {gender === 'Other' && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Please specify</label>
            <input
              type="text"
              value={genderSpecify}
              onChange={(e) => setGenderSpecify(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
              placeholder="Specify gender"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
          />
          {dob && (
             <p className="mt-2 text-sm text-pink-600 font-medium">Calculated Age: {calculateAge(dob)}</p>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!name || !gender || !dob || !language || !phone_number || (gender === 'Other' && !genderSpecify) || isSubmitting}
          className="w-full mt-8 flex items-center justify-center gap-2 bg-pink-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
