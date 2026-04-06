import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const quotes = [
  "Miracle happens when you replace tears with prayers and fear with faith",
  "They say us teachers are like god but not all some teachers do personal targets and all but be strong",
  "Success success every one talks about it but the real success is what you are doing and are you liking doing it",
  "Believe you can and you're halfway there.",
  "Your present circumstances don't determine where you can go; they merely determine where you start.",
  "It is never too late to be what you might have been.",
  "You are stronger than you think.",
  "Every day is a second chance.",
  "Fall seven times, stand up eight.",
  "The best way out is always through.",
  "You don't have to control your thoughts. You just have to stop letting them control you.",
  "Healing takes time, and asking for help is a courageous step.",
  "There is hope, even when your brain tells you there isn't.",
  "Sometimes the people around you won't understand your journey. They don't need to, it's not for them.",
  "You matter. Your story matters.",
  "Tough times never last, but tough people do.",
  "Don't let your struggle become your identity.",
  "One small positive thought in the morning can change your whole day.",
  "Be gentle with yourself, you're doing the best you can.",
  "Growth is painful. Change is painful. But nothing is as painful as staying stuck somewhere you don't belong.",
  "Breathe. It's just a bad day, not a bad life.",
  "You are not your mistakes.",
  "Start where you are. Use what you have. Do what you can.",
  "The only time you run out of chances is when you stop taking them.",
  "Your mental health is a priority. Your happiness is an essential. Your self-care is a necessity.",
  "Stars can't shine without darkness.",
  "Out of difficulties grow miracles.",
  "You are enough just as you are.",
  "Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying, 'I will try again tomorrow.'",
  "The sun will rise and we will try again."
];

export default function QuotesTicker({ position = 'top' }: { position?: 'top' | 'bottom' }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`w-full bg-pink-900/50 border-y border-pink-500/30 overflow-hidden h-10 flex items-center justify-center relative z-40 ${position === 'top' ? 'sticky top-0' : ''}`}>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-pink-200 text-sm md:text-base font-medium text-center px-4 absolute w-full"
        >
          "{quotes[index]}"
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
