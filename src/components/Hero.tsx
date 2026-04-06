import { Users, Clock, Globe2, HeartHandshake } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">VV Solutions</span>
        <br />
        <span className="text-2xl md:text-3xl text-pink-300 font-medium mt-2 block">(Valuable Voices)</span>
      </h1>
      
      <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto italic">
        "You don't have to go through it alone."
      </p>
      
      <p className="text-lg text-pink-200 mb-10 max-w-4xl mx-auto font-medium">
        Talk. Heal. Grow. Because the right conversation can change everything.
      </p>

      <p className="text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
        For people who are happy, sad, angry, confused, dispersed, or feeling alone. Want to talk with someone? 
        There will be no one to explain it. This pain comes out of tears, so we are here to take your tears out 
        and make you feel better. We make sure that someone is there who really cares for you. We are here to 
        motivate and try to solve the problems you are mentally facing.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-pink-500/20 backdrop-blur-sm">
          <Users className="w-8 h-8 text-pink-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">100+</div>
          <div className="text-sm text-gray-400">Happy Users</div>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-pink-500/20 backdrop-blur-sm">
          <Clock className="w-8 h-8 text-pink-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">24/7</div>
          <div className="text-sm text-gray-400">Always Open</div>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-pink-500/20 backdrop-blur-sm">
          <Globe2 className="w-8 h-8 text-pink-400 mx-auto mb-3" />
          <div className="text-xl font-bold text-white mb-1">5 Languages</div>
          <div className="text-xs text-gray-400">Kannada, English, Telugu, Tamil, Hindi</div>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-pink-500/20 backdrop-blur-sm">
          <HeartHandshake className="w-8 h-8 text-pink-400 mx-auto mb-3" />
          <div className="text-xl font-bold text-white mb-1">100% Free</div>
          <div className="text-xs text-gray-400">Founded in 2024</div>
        </div>
      </div>
    </section>
  );
}
