import { Users, Clock, Globe2, HeartHandshake, MessageCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <div className="mb-8 flex justify-center animate-fade-in">
        <a
          href="https://wa.me/917411837814"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#25D366]/10 text-slate-800 rounded-full border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-all hover:scale-105"
        >
          <div className="bg-[#25D366] text-white p-1.5 rounded-full">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          </div>
          <span className="font-medium text-sm sm:text-base">Someone is here to listen to you, talk freely.</span>
          <span className="bg-[#25D366] text-white text-xs font-bold px-2 py-1 rounded-full ml-1 hidden sm:inline-block">Chat on WhatsApp</span>
        </a>
      </div>

      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">VV Solutions</span>
        <br />
        <span className="text-2xl md:text-3xl text-pink-500 font-medium mt-2 block">(Valuable Voices)</span>
      </h1>
      
      <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto italic">
        "You don't have to go through it alone."
      </p>
      
      <p className="text-lg text-pink-600 mb-10 max-w-4xl mx-auto font-medium">
        Talk. Heal. Grow. Because the right conversation can change everything.
      </p>

      <p className="text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
        For people who are happy, sad, angry, confused, dispersed, or feeling alone. Want to talk with someone? 
        There will be no one to explain it. This pain comes out of tears, so we are here to take your tears out 
        and make you feel better. We make sure that someone is there who really cares for you. We are here to 
        motivate and try to solve the problems you are mentally facing.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xl shadow-pink-100/50">
          <Users className="w-8 h-8 text-pink-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-slate-800 mb-1">100+</div>
          <div className="text-sm text-slate-500">Happy Users</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xl shadow-pink-100/50">
          <Clock className="w-8 h-8 text-pink-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-slate-800 mb-1">24/7</div>
          <div className="text-sm text-slate-500">Always Open</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xl shadow-pink-100/50">
          <Globe2 className="w-8 h-8 text-pink-500 mx-auto mb-3" />
          <div className="text-xl font-bold text-slate-800 mb-1">5 Languages</div>
          <div className="text-xs text-slate-500">Kannada, English, Telugu, Tamil, Hindi</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xl shadow-pink-100/50">
          <HeartHandshake className="w-8 h-8 text-pink-500 mx-auto mb-3" />
          <div className="text-xl font-bold text-slate-800 mb-1">100% Free</div>
          <div className="text-xs text-slate-500">Founded in 2024</div>
        </div>
      </div>
    </section>
  );
}
