/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import QuotesTicker from './components/QuotesTicker';
import Hero from './components/Hero';
import Emotions from './components/Emotions';
import About from './components/About';
import Reviews from './components/Reviews';
import Thoughts from './components/Thoughts';
import Emergency from './components/Emergency';
import PrivacyTerms from './components/PrivacyTerms';
import Footer from './components/Footer';
import TermsPopup from './components/TermsPopup';
import Chatbot from './components/Chatbot';
import HelpButton from './components/HelpButton';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-pink-500/30">
      <TermsPopup />
      <QuotesTicker position="top" />
      <Navbar />
      
      <main>
        <Hero />
        <Emotions />
        <About />
        <Reviews />
        <Thoughts />
        <PrivacyTerms />
        <Emergency />
      </main>

      <Footer />
      <QuotesTicker position="bottom" />
      <Chatbot />
      <HelpButton />
    </div>
  );
}
