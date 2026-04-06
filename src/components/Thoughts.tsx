import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Edit2, Trash2, MessageSquareQuote } from 'lucide-react';

interface Thought {
  id: string;
  author: string;
  content: string;
  date: string;
}

export default function Thoughts() {
  const [thoughts, setThoughts] = useLocalStorage<Thought[]>('vv_thoughts', []);
  const [formData, setFormData] = useState({ author: '', content: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author || !formData.content) return;

    if (editingId) {
      setThoughts(thoughts.map(t => t.id === editingId ? { ...t, ...formData, date: new Date().toISOString() } : t));
      setEditingId(null);
    } else {
      const newThought: Thought = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString(),
      };
      setThoughts([newThought, ...thoughts]);
    }
    setFormData({ author: '', content: '' });
  };

  const handleEdit = (thought: Thought) => {
    setFormData({ author: thought.author, content: thought.content });
    setEditingId(thought.id);
    document.getElementById('thoughts-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this thought?')) {
      setThoughts(thoughts.filter(t => t.id !== id));
    }
  };

  return (
    <section id="thoughts" className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <MessageSquareQuote className="text-pink-500" /> Share Your Thoughts
        </h2>
        <p className="text-gray-400">A safe space to express what's on your mind. Your words might help someone else.</p>
      </div>

      <div id="thoughts-form" className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-pink-500/30 mb-12 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="text" 
              required
              value={formData.author}
              onChange={e => setFormData({...formData, author: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
              placeholder="Your Name or Alias"
            />
          </div>
          <div>
            <textarea 
              required
              rows={4}
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 resize-none"
              placeholder="What's on your mind? Share your feelings, a quote, or a story..."
            />
          </div>
          <div className="flex justify-end gap-3">
            {editingId && (
              <button 
                type="button"
                onClick={() => { setEditingId(null); setFormData({ author: '', content: '' }); }}
                className="px-6 py-2 rounded-lg font-medium text-gray-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            )}
            <button 
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-8 rounded-lg transition-colors"
            >
              {editingId ? 'Update Thought' : 'Share Thought'}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {thoughts.map(thought => (
          <div key={thought.id} className="bg-slate-900/40 p-6 rounded-2xl border-l-4 border-pink-500 relative group">
            <MessageSquareQuote className="absolute top-6 right-6 w-8 h-8 text-slate-800" />
            <p className="text-gray-200 text-lg italic mb-4 pr-10">"{thought.content}"</p>
            <div className="flex items-center justify-between text-sm">
              <div className="text-pink-400 font-medium">— {thought.author}</div>
              <div className="flex items-center gap-4 text-gray-500">
                <span>{new Date(thought.date).toLocaleDateString()}</span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(thought)} className="hover:text-blue-400"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(thought.id)} className="hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {thoughts.length === 0 && (
          <div className="text-center py-12 text-gray-500 italic">
            No thoughts shared yet. Be the first to share!
          </div>
        )}
      </div>
    </section>
  );
}
