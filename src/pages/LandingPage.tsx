import { useState } from 'react';
import Navbar from '../components/Navbar';
import QuotesTicker from '../components/QuotesTicker';
import Hero from '../components/Hero';
import About from '../components/About';
import Reviews from '../components/Reviews';
import Thoughts from '../components/Thoughts';
import Emergency from '../components/Emergency';
import PrivacyTerms from '../components/PrivacyTerms';
import Footer from '../components/Footer';
import TermsPopup from '../components/TermsPopup';
import HelpButton from '../components/HelpButton';
import WhatsAppButton from '../components/WhatsAppButton';
import VoiceAnalyzer from '../components/VoiceAnalyzer';
import { Mic } from 'lucide-react';

export default function LandingPage() {
  const [isVoiceAnalyzerOpen, setIsVoiceAnalyzerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-pink-200">
      <TermsPopup />
      <QuotesTicker position="top" />
      <Navbar />
      
      <main>
        <VoiceAnalyzer isOpen={isVoiceAnalyzerOpen} onClose={() => setIsVoiceAnalyzerOpen(false)} />
        <Hero />

        {/* Voice Analyzer Trigger Section */}
        <section className="py-8 px-4 max-w-4xl mx-auto text-center flex flex-col items-center">
          <button 
            onClick={() => setIsVoiceAnalyzerOpen(true)}
            className="group px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-slate-900/30 w-full md:w-auto"
          >
            <Mic className="w-6 h-6 animate-pulse" />
            Try our AI Voice Analyzer
          </button>
          <p className="mt-3 text-slate-500 text-sm italic">Analyze your voice tone & emotions instantly (Approximate only)</p>
        </section>

        <About />
        <Reviews />
        <Thoughts />
        <PrivacyTerms />
        <Emergency />
      </main>

      <Footer />
      <QuotesTicker position="bottom" />
      <WhatsAppButton />
      <HelpButton />
    </div>
  );
}
