import { Users, Clock, Globe2, HeartHandshake, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">VV Solutions</span>
        <br />
        <span className="text-2xl md:text-3xl text-pink-500 font-medium mt-2 block">(Valuable Voices)</span>
      </h1>
      
      <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto italic">
        "You don't have to go through it alone."
      </p>

      <div className="flex justify-center mb-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => navigate('/login')}
          className="group px-8 py-4 bg-pink-600 text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-pink-700 transition-all hover:scale-105 hover:shadow-xl shadow-pink-600/30 w-full sm:w-auto"
        >
          Login to connect more 
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <p className="text-lg text-pink-600 mb-10 max-w-4xl mx-auto font-medium">
        Talk. Heal. Grow. Because the right conversation can change everything.
      </p>

      <p className="text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
        For people who are happy, sad, angry, confused, dispersed, or feeling alone. Want to talk with someone? 
        There will be no one to explain it. This pain comes out of tears, so we are here to take your tears out 
        and make you feel better. We make sure that someone is there who really cares for you. We are here to 
        motivate and try to solve the problems you are mentally facing.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xl shadow-pink-100/50">
          <Users className="w-8 h-8 text-pink-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-slate-800 mb-1">Since Founded</div>
          <div className="text-sm text-slate-500">in 2024</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xl shadow-pink-100/50">
          <Clock className="w-8 h-8 text-pink-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-slate-800 mb-1">24/7</div>
          <div className="text-sm text-slate-500">Always Open</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xl shadow-pink-100/50">
          <Globe2 className="w-8 h-8 text-pink-500 mx-auto mb-3" />
          <div className="text-sm font-bold text-slate-800 mb-1 leading-tight">We are available to speak in 5 languages</div>
          <div className="text-xs text-slate-500 mt-2">Kannada, English, Telugu, Tamil, Hindi</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xl shadow-pink-100/50">
          <HeartHandshake className="w-8 h-8 text-pink-500 mx-auto mb-3" />
          <div className="text-xl font-bold text-slate-800 mb-1">100% Free</div>
          <div className="text-xs text-slate-500">Consultation</div>
        </div>
      </div>
    </section>
  );
}
