export default function About() {
  return (
    <section id="about" className="py-16 px-4 max-w-6xl mx-auto">
      <div className="space-y-16">
        
        {/* Why Choose Us */}
        <div id="why-choose-us" className="bg-slate-900/60 p-8 md:p-12 rounded-3xl border border-pink-500/20">
          <h2 className="text-3xl md:text-4xl font-bold text-pink-400 mb-6 flex items-center gap-3">
            <span>🌿</span> Why Choose Us?
          </h2>
          <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
            <p>
              People handle emotions in many ways—walking alone, listening to music, writing diaries, or distracting themselves with activities. These methods may help for a moment, but they don’t always solve what’s truly inside.
            </p>
            <p>
              You might feel better for a while, but the pain often returns—because it was never truly understood or expressed. Distractions can comfort you temporarily, but they don’t heal what’s inside.
            </p>
            <p>
              Real change begins when you talk to someone. When you open up, share your feelings, and receive genuine support, motivation, and guidance—that’s when true healing starts. Conversations give you clarity, strength, and the courage to face even the toughest moments in life.
            </p>
            <p className="font-semibold text-white">That’s exactly why this platform exists.</p>
            <p>
              Here, you are never alone. You’ll find people who listen, understand, and support you without judgment. This is more than just a space—it’s a safe place to express yourself, connect with others, and grow stronger every day.
            </p>
            <p>
              Choose this platform not just for comfort, but for real change. Because the right conversation at the right time can truly change everything.
            </p>
            <p className="text-pink-300 font-medium italic">
              We promise—this will be one of the most meaningful experiences you’ll ever have.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Our Services */}
          <div className="bg-slate-900/60 p-8 rounded-3xl border border-pink-500/20">
            <h2 className="text-2xl md:text-3xl font-bold text-pink-400 mb-6 flex items-center gap-3">
              <span>❤️</span> Our Services
            </h2>
            <ul className="space-y-4 text-gray-300 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-xl">🤝</span>
                <span><b>Real Conversations</b> – Talk to someone who genuinely listens</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">💬</span>
                <span><b>No Judgement Zone</b> – Express freely without fear</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🌱</span>
                <span><b>Emotional Support</b> – Get motivated and guided</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🔐</span>
                <span><b>Safe Space one-on-one</b> – Your feelings matter here</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🛡️</span>
                <span className="text-pink-300 font-semibold">100% safe and confidential</span>
              </li>
            </ul>
          </div>

          {/* Our Promise */}
          <div className="bg-slate-900/60 p-8 rounded-3xl border border-pink-500/20">
            <h2 className="text-2xl md:text-3xl font-bold text-pink-400 mb-6 flex items-center gap-3">
              <span>🚀</span> Our Promise
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              We are here to make sure you never feel alone in your hardest moments. We don’t just distract you from your pain—we help you face it, understand it, and grow beyond it.
            </p>
          </div>
        </div>

        {/* How we started */}
        <div className="bg-slate-900/60 p-8 md:p-12 rounded-3xl border border-pink-500/20">
          <h2 className="text-3xl md:text-4xl font-bold text-pink-400 mb-6">How we started?</h2>
          <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
            <p>
              There was a time when I often felt completely alone. On my hardest days, when I was sad or mentally exhausted, there was no one around to truly listen or understand me. I would keep all my emotions inside—stress, overthinking, pain—until one day it would all burst out, affecting both my mind and heart. Those moments made me realize how important it is to simply have someone who cares.
            </p>
            <p>
              Instead of waiting for someone to come into my life, I asked myself a simple question: "Why don’t I become that person for others?" That thought changed everything. I decided that if I could be there for someone else—listen to them, support them, and motivate them—maybe I could turn my pain into something meaningful.
            </p>
            <p>
              Helping others feel heard and valued started making me feel stronger and happier. I shared this idea with my friend, and without hesitation, she said, "Let’s do it." That’s how this journey began—two people with one goal: to make sure no one ever feels alone when they need someone the most.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
