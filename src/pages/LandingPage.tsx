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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-pink-200">
      <TermsPopup />
      <QuotesTicker position="top" />
      <Navbar />
      
      <main>
        <Hero />

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
