import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { motion, AnimatePresence } from 'motion/react';

type Emotion = 'Happy' | 'Sad' | 'Angry' | 'Confused' | 'Scared';

const emotionsData: Record<Emotion, { emoji: string; message: string; color: string }> = {
  Sad: {
    emoji: '😔',
    color: 'from-blue-500 to-blue-700',
    message: "I’m really sorry you’re feeling this way 😔\nIt’s okay to feel sad sometimes.\nYou can talk to us freely 💙 We are here for you."
  },
  Angry: {
    emoji: '😡',
    color: 'from-red-500 to-red-700',
    message: "I understand you’re feeling angry 😡\nTake a deep breath… you’re not alone.\nLet’s talk and find a way to feel better 💙"
  },
  Confused: {
    emoji: '😕',
    color: 'from-purple-500 to-purple-700',
    message: "It’s okay to feel confused 😕\nLife can be overwhelming sometimes.\nWe are here to help you think clearly 💙"
  },
  Scared: {
    emoji: '😨',
    color: 'from-slate-500 to-slate-700',
    message: "You’re safe here 💙\nIt’s okay to feel fear sometimes.\nLet’s talk, we’ll get through this together 🤝"
  },
  Happy: {
    emoji: '😊',
    color: 'from-yellow-400 to-orange-500',
    message: "That’s amazing 😊✨\nWe’re happy to see you happy!\nKeep smiling and spreading positivity 💙"
  }
};

export default function Emotions() {
  const [counts, setCounts] = useLocalStorage<Record<Emotion, number>>('vv_emotion_counts', {
    Happy: 0, Sad: 0, Angry: 0, Confused: 0, Scared: 0
  });
  const [activeEmotion, setActiveEmotion] = useState<Emotion | null>(null);

  const handleEmotionClick = (emotion: Emotion) => {
    setCounts(prev => ({ ...prev, [emotion]: prev[emotion] + 1 }));
    setActiveEmotion(emotion);
  };

  return (
    <section className="py-16 px-4 max-w-5xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How are you feeling today?</h2>
      <p className="text-gray-400 mb-10">Click on the emotion that best describes your current state.</p>

      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {(Object.keys(emotionsData) as Emotion[]).map((emotion) => (
          <button
            key={emotion}
            onClick={() => handleEmotionClick(emotion)}
            className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:scale-110 ${
              activeEmotion === emotion ? 'bg-slate-800 ring-2 ring-pink-500' : 'bg-slate-900/50 hover:bg-slate-800'
            }`}
          >
            <span className="text-6xl mb-2 filter drop-shadow-lg">{emotionsData[emotion].emoji}</span>
            <span className="text-white font-medium mb-1">{emotion}</span>
            <span className="text-xs text-pink-400 bg-pink-500/10 px-2 py-1 rounded-full">
              {counts[emotion]} clicks
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeEmotion && (
          <motion.div
            key={activeEmotion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-br ${emotionsData[activeEmotion].color} shadow-2xl`}
          >
            <p className="text-white text-xl md:text-2xl whitespace-pre-line font-medium leading-relaxed">
              {emotionsData[activeEmotion].message}
            </p>
            <div className="mt-8">
              <a 
                href="https://wa.me/917411837814" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
              >
                💬 Chat with us on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
