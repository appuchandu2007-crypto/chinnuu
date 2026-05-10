import { useState, useEffect } from 'react';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import { supabase } from '../supabase';

export default function Thoughts() {
  const [thoughts, setThoughts] = useState<any[]>([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchThoughts();
  }, []);

  const fetchThoughts = async () => {
    const { data } = await supabase.from('thoughts').select('*').order('created_at', { ascending: false });
    if (data) {
      setThoughts(data);
    }
  };

  const handleSubmit = async () => {
    if (!author || !text || isSubmitting) return;
    setIsSubmitting(true);
    const { error } = await supabase.from('thoughts').insert([{
      author,
      text,
      likes: 0
    }]);

    if (!error) {
      setAuthor('');
      setText('');
      fetchThoughts();
    }
    setIsSubmitting(false);
  };

  const handleLike = async (id: string, currentLikes: number) => {
    await supabase.from('thoughts').update({ likes: currentLikes + 1 }).eq('id', id);
    fetchThoughts();
  };

  return (
    <section id="thoughts" className="py-20 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 flex items-center gap-3">
             <MessageCircle className="text-pink-500" size={32} />
             Share Your Thoughts
          </h2>
          <p className="text-lg text-slate-600">
            A safe space to express what's on your mind. Your words might help someone else.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,1.5fr] gap-10">
          
          {/* Share Thought Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
            <div className="space-y-4">
              <div>
                <input 
                  type="text" 
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  placeholder="Your Name or Alias" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-pink-500 bg-slate-50/50" 
                />
              </div>
              <div>
                <textarea 
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="What's on your mind? Share your feelings, a quote, or a story..." 
                  rows={6} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-pink-500 resize-none bg-slate-50/50"
                ></textarea>
              </div>
              <button onClick={handleSubmit} disabled={isSubmitting} className="bg-pink-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-pink-700 transition-colors w-full sm:w-auto self-end float-right disabled:opacity-50">
                {isSubmitting ? 'Sharing...' : 'Share Thought'}
              </button>
            </div>
            <div className="clear-both"></div>
          </div>

          {/* Displayed Thoughts */}
          <div className="space-y-6">
            {thoughts.map((item, index) => (
              <div key={item.id || index} className="bg-white p-8 rounded-3xl border border-pink-100 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500"></div>
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line mb-6 font-medium italic">
                  "{item.text}"
                </p>
                <div className="flex justify-between items-center text-sm font-semibold text-pink-600">
                  <span>— {item.author}</span>
                  <div onClick={() => item.id && handleLike(item.id, item.likes)} className="flex items-center gap-1.5 text-slate-400 font-normal hover:text-slate-600 cursor-pointer transition-colors">
                    <ThumbsUp size={16} />
                    <span>{item.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
