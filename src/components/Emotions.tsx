import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, onSnapshot, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { MessageCircle } from 'lucide-react';

type Emotion = 'Sad' | 'Happy' | 'Guilty' | 'Fear' | 'Shock' | 'Confused' | 'Angry' | 'Lonely' | 'Stressed' | 'Tired' | 'Heartbroken' | 'Numb';

const emotionsData: Record<Emotion, { emoji: string; color: string; message: string; tips: string[] }> = {
  Sad: {
    emoji: '🌧️',
    color: 'from-blue-500 to-blue-700',
    message: "I’m sorry you’re carrying this right now.\nYou don’t have to hide your sadness here.\nIt’s okay to feel low sometimes.\nI’m with you, one step at a time.\nBetter days can come again.",
    tips: ["Message or call one person you trust.", "Cry if you need to—release helps.", "Step outside for fresh air and sunlight.", "Write one thing hurting you.", "Eat and drink something nourishing.", "Remember: this feeling can pass."]
  },
  Happy: {
    emoji: '☀️',
    color: 'from-yellow-400 to-orange-500',
    message: "I’m really glad you’re feeling this joy.\nYou deserve this happiness.\nKeep enjoying this moment fully.\nYour smile matters more than you know.\nI’m happy for you.",
    tips: ["Share your joy with someone.", "Take a photo or note the moment.", "Thank yourself for reaching here.", "Use the energy to do something meaningful.", "Spread kindness while you feel strong."]
  },
  Guilty: {
    emoji: '😔',
    color: 'from-slate-500 to-slate-700',
    message: "Making a mistake doesn’t make you a bad person.\nThe fact that you care shows your heart.\nYou can learn, repair, and grow from this.\nBe gentle with yourself too.\nYou still deserve kindness.",
    tips: ["Ask: Did I make a mistake, or am I punishing myself too hard?", "If needed, apologize sincerely.", "Learn the lesson, don’t become the lesson.", "Fix what you can today.", "Self-forgiveness is growth."]
  },
  Fear: {
    emoji: '😨',
    color: 'from-violet-500 to-purple-700',
    message: "It makes sense that you feel scared right now.\nYou don’t have to face it all at once.\nI’m here with you through this moment.\nTake it one breath, one step at a time.\nYou’re stronger than fear thinks.",
    tips: ["Name what scares you clearly.", "Take 5 slow deep breaths.", "Focus only on the next small step.", "Check facts vs imagined worst-case thoughts.", "Courage means moving while afraid."]
  },
  Shock: {
    emoji: '😳',
    color: 'from-orange-400 to-red-500',
    message: "That sounds like a lot to take in.\nIt’s okay if this feels unreal right now.\nYou don’t need to process everything immediately.\nGive yourself a moment to breathe.\nI’m here while you take it in.",
    tips: ["Sit down and breathe slowly.", "Don’t force decisions immediately.", "Drink water.", "Repeat: “I need a moment.”", "Give your mind time to catch up."]
  },
  Confused: {
    emoji: '😕',
    color: 'from-teal-500 to-emerald-700',
    message: "It’s okay not to have all the answers yet.\nConfusion doesn’t mean failure.\nWe can sort this out one step at a time.\nYou’re allowed to take time to understand.\nClarity often comes slowly.",
    tips: ["Pause and simplify the problem.", "Write what you know vs don’t know.", "Ask one trusted person for perspective.", "Choose one next step, not the whole path.", "Confusion often comes before clarity."]
  },
  Angry: {
    emoji: '😡',
    color: 'from-red-600 to-rose-800',
    message: "I can hear how frustrated and hurt you feel.\nYour feelings matter, even now.\nLet’s slow it down before reacting.\nThere may be pain underneath this anger too.\nYou deserve peace, not just release.",
    tips: ["Step away before reacting.", "Move your body: walk, stretch, shake tension out.", "Ask what hurt is under the anger.", "Respond later, not instantly.", "Protect peace over proving points."]
  },
  Lonely: {
    emoji: '😞',
    color: 'from-indigo-400 to-blue-600',
    message: "You’re not invisible here.\nI’m glad you reached out.\nFeeling lonely hurts, and I’m sorry it does.\nYou matter more than you realize.\nConnection can begin with moments like this.",
    tips: ["Reach out first, even with one text.", "Go where people are: park, class, café, temple, etc.", "Be kind to yourself like a friend.", "Connection grows from small repeated steps."]
  },
  Stressed: {
    emoji: '😩',
    color: 'from-amber-600 to-red-600',
    message: "You’re carrying a lot right now.\nAnyone in your place might feel overwhelmed.\nYou don’t need to solve everything today.\nOne small step is enough for now.\nYou’re doing better than you think.",
    tips: ["Do one task only.", "Breathe out longer than you breathe in.", "Lower noise/screens for 10 minutes.", "Make a tiny plan for today only."]
  },
  Tired: {
    emoji: '😴',
    color: 'from-zinc-400 to-slate-600',
    message: "You sound exhausted.\nRest is a need, not a weakness.\nYou don’t have to push beyond your limit.\nBe kind to your body today.\nIt’s okay to pause.",
    tips: ["Rest before forcing productivity.", "Drink water.", "Eat something balanced.", "Take a short walk or stretch.", "Sleep is not laziness."]
  },
  Heartbroken: {
    emoji: '💔',
    color: 'from-pink-600 to-red-700',
    message: "I’m sorry this hurts so much.\nLove and loss can feel heavy.\nMissing someone is human.\nHealing won’t be instant, but it can happen.\nYou are still whole, even hurting.",
    tips: ["Remove reminders for now if needed.", "Let yourself grieve.", "Don’t beg for what left.", "Rebuild routines slowly.", "Love returning to yourself matters too."]
  },
  Numb: {
    emoji: '😐',
    color: 'from-gray-300 to-gray-500',
    message: "Feeling nothing can also be a feeling.\nSometimes the mind goes quiet to protect itself.\nYou don’t need to force emotions right now.\nSmall gentle steps still count.\nI’m here with you in the quiet too.",
    tips: ["Touch something cold/warm.", "Notice 5 things you can see.", "Take a shower or walk outside.", "Start with tiny actions.", "Feeling can return gradually."]
  }
};

export default function Emotions() {
  const [counts, setCounts] = useState<Record<Emotion, number>>({
    Sad: 0, Happy: 0, Guilty: 0, Fear: 0, Shock: 0, Confused: 0, Angry: 0, Lonely: 0, Stressed: 0, Tired: 0, Heartbroken: 0, Numb: 0
  });
  const [activeEmotion, setActiveEmotion] = useState<Emotion | null>(null);

  useEffect(() => {
    const emotionRef = doc(db, 'status', 'emotions_v2'); // migrated to v2 for new schema
    const unsubscribe = onSnapshot(emotionRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCounts({
          Sad: data.Sad || 0,
          Happy: data.Happy || 0,
          Guilty: data.Guilty || 0,
          Fear: data.Fear || 0,
          Shock: data.Shock || 0,
          Confused: data.Confused || 0,
          Angry: data.Angry || 0,
          Lonely: data.Lonely || 0,
          Stressed: data.Stressed || 0,
          Tired: data.Tired || 0,
          Heartbroken: data.Heartbroken || 0,
          Numb: data.Numb || 0
        });
      } else {
         setDoc(emotionRef, {
           Sad: 0, Happy: 0, Guilty: 0, Fear: 0, Shock: 0, Confused: 0, Angry: 0, Lonely: 0, Stressed: 0, Tired: 0, Heartbroken: 0, Numb: 0
         }).catch(err => {
            handleFirestoreError(err, OperationType.CREATE, 'status/emotions_v2');
         });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'status/emotions_v2');
    });

    return () => unsubscribe();
  }, []);

  const handleEmotionClick = async (emotion: Emotion) => {
    setActiveEmotion(emotion);
    try {
      await updateDoc(doc(db, 'status', 'emotions_v2'), {
        [emotion]: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'status/emotions_v2');
    }
  };

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How are you feeling today?</h2>
      <p className="text-slate-600 mb-10">Click on the emotion that best describes your current state.</p>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {(Object.keys(emotionsData) as Emotion[]).map((emotion) => (
          <button
            key={emotion}
            onClick={() => handleEmotionClick(emotion)}
            className={`flex flex-col items-center p-3 sm:p-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-sm min-w-[100px] ${
              activeEmotion === emotion ? 'bg-pink-50 ring-2 ring-pink-500 shadow-md' : 'bg-white border border-pink-100 hover:bg-pink-50 hover:shadow-md'
            }`}
          >
            <span className="text-4xl sm:text-5xl mb-2 filter drop-shadow-lg">{emotionsData[emotion].emoji}</span>
            <span className="text-slate-800 font-medium mb-1 text-sm sm:text-base">{emotion}</span>
            <span className="text-xs text-pink-600 bg-pink-100 px-2 py-1 rounded-full">
              {counts[emotion] || 0} clks
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
            className="max-w-3xl mx-auto overflow-hidden rounded-3xl bg-white border border-pink-100 shadow-xl text-left"
          >
            <div className={`p-8 md:p-10 text-white bg-gradient-to-br ${emotionsData[activeEmotion].color}`}>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="text-3xl">{emotionsData[activeEmotion].emoji}</span>
                Here for you
              </h3>
              <p className="text-lg md:text-xl whitespace-pre-line font-medium leading-relaxed opacity-95">
                {emotionsData[activeEmotion].message}
              </p>
            </div>
            
            <div className="p-8 md:p-10 bg-slate-50">
              <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span>💡</span> Quick tips that help
              </h4>
              <ul className="space-y-4 mb-8">
                {emotionsData[activeEmotion].tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm font-bold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-slate-700">{tip}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-6 border-t border-slate-200">
                <a 
                  href="https://wa.me/917411837814" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-200 w-full sm:w-auto"
                >
                  <MessageCircle size={20} />
                  WhatsApp chat for more
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
