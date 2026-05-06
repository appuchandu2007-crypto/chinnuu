import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, ThumbsUp } from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface Thought {
  id: string;
  author: string;
  content: string;
  likes: number;
}

export default function Thoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [formData, setFormData] = useState({ author: '', content: '' });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'thoughts'), (snapshot) => {
      const fetchedThoughts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Thought[];
      // Sort by likes descending initially, or natural order
      fetchedThoughts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      setThoughts(fetchedThoughts);
      setIsReady(true);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'thoughts');
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author || !formData.content) return;

    const newId = Date.now().toString();
    const newThought = {
      author: formData.author,
      content: formData.content,
      likes: 0,
    };

    try {
      await setDoc(doc(db, 'thoughts', newId), newThought);
    } catch (error) {
       handleFirestoreError(error, OperationType.CREATE, 'thoughts/' + newId);
    }
    setFormData({ author: '', content: '' });
  };

  const handleLike = async (id: string) => {
    try {
      await updateDoc(doc(db, 'thoughts', id), {
        likes: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'thoughts/' + id);
    }
  };

  return (
    <section id="thoughts" className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
          <MessageSquareQuote className="text-pink-500" /> Share Your Thoughts
        </h2>
        <p className="text-slate-600">A safe space to express what's on your mind. Your words might help someone else.</p>
      </div>

      <div id="thoughts-form" className="bg-white p-6 md:p-8 rounded-2xl border border-pink-200 mb-12 shadow-xl shadow-pink-100/50">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="text" 
              required
              value={formData.author}
              onChange={e => setFormData({...formData, author: e.target.value})}
              className="w-full bg-pink-50/50 border border-pink-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              placeholder="Your Name or Alias"
            />
          </div>
          <div>
            <textarea 
              required
              rows={4}
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              className="w-full bg-pink-50/50 border border-pink-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 resize-none"
              placeholder="What's on your mind? Share your feelings, a quote, or a story..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button 
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-8 rounded-lg transition-colors shadow-md shadow-pink-200"
            >
              Share Thought
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {thoughts.map(thought => (
          <div key={thought.id} className="bg-white p-6 rounded-2xl border border-pink-100 border-l-4 border-l-pink-500 shadow-md shadow-pink-100/30 relative group">
            <MessageSquareQuote className="absolute top-6 right-6 w-8 h-8 text-pink-50" />
            <p className="text-slate-700 text-lg italic mb-4 pr-10 whitespace-pre-line">"{thought.content}"</p>
            <div className="flex items-center justify-between text-sm">
              <div className="text-pink-600 font-medium">— {thought.author}</div>
              <div className="flex items-center gap-4 text-slate-400">
                <button onClick={() => handleLike(thought.id)} className="flex items-center gap-1 hover:text-pink-600 transition-colors">
                  <ThumbsUp className="w-4 h-4" /> {thought.likes || 0}
                </button>
              </div>
            </div>
          </div>
        ))}
        {thoughts.length === 0 && (
          <div className="text-center py-12 text-slate-500 italic">
            No thoughts shared yet. Be the first to share!
          </div>
        )}
      </div>
    </section>
  );
}
