import React, { useState, useEffect } from 'react';
import { Star, Search, ThumbsUp, HelpCircle } from 'lucide-react';
import { supabase } from '../supabase';

export default function Reviews() {
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Submit state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newText, setNewText] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (data) {
      setAllReviews(data);
      setReviews(data);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (!term) {
      setReviews(allReviews);
      return;
    }
    setReviews(allReviews.filter(r => 
      r.name.toLowerCase().includes(term) || 
      r.text.toLowerCase().includes(term) ||
      (r.role && r.role.toLowerCase().includes(term))
    ));
  };

  const handleSubmit = async () => {
    if (!newName || !newText || rating === 0 || isSubmitting) return;
    setIsSubmitting(true);
    const { error } = await supabase.from('reviews').insert([{
      name: newName,
      role: newRole || 'User',
      text: newText,
      rating,
      likes: 0
    }]);
    
    if (!error) {
      setNewName('');
      setNewRole('');
      setNewText('');
      setRating(0);
      fetchReviews();
    }
    setIsSubmitting(false);
  };

  return (
    <section id="reviews" className="py-20 px-6 max-w-6xl mx-auto bg-slate-50/50">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">User Reviews</h2>
        
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search reviews by name, role, or keyword..." 
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 bg-white"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr,2fr] gap-8">
        
        {/* Write a Review Section */}
        <div className="bg-pink-50/50 p-6 rounded-3xl border border-pink-100 h-fit">
          <h3 className="text-xl font-bold text-pink-600 mb-6">Write a Review</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Name</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} type="text" placeholder="Your Name" className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-pink-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Role (Optional)</label>
              <input value={newRole} onChange={e => setNewRole(e.target.value)} type="text" placeholder="e.g. Student, User" className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-pink-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1 flex items-center gap-2">Rating</label>
              <div className="flex gap-1 text-slate-300">
                {[1, 2, 3, 4, 5].map(star => (
                   <Star 
                     key={star} 
                     className={`w-8 h-8 cursor-pointer transition-colors ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-200 text-slate-200'}`} 
                     onClick={() => setRating(star)} 
                   />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Feedback</label>
              <textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="Share your experience..." rows={4} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-pink-500 resize-none bg-white"></textarea>
            </div>
            <button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700 transition-colors disabled:opacity-50">
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="grid sm:grid-cols-2 gap-4">
          {reviews.map((review, i) => (
            <div key={`review-${review.id || i}-${i}`} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-bold text-slate-800">{review.name}</div>
                  <div className="text-xs text-pink-500 font-medium bg-pink-50 px-2 py-0.5 rounded-full inline-block mt-1">{review.role}</div>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, j) => (
                    <Star key={`star-${review.id || i}-${i}-${j}`} className={`w-4 h-4 ${j < review.rating ? 'fill-current text-yellow-400' : 'fill-slate-200 text-slate-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 mb-6 flex-grow text-sm leading-relaxed">"{review.text}"</p>
              <div className="flex justify-end gap-1 items-center text-slate-400 text-xs">
                <ThumbsUp size={14} className="cursor-pointer hover:text-slate-600" />
                <span>{review.likes}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
      
      <div className="fixed bottom-6 right-6 hidden">
         <button className="bg-red-500 text-white rounded-full p-4 flex items-center justify-center gap-2 font-bold shadow-lg shadow-red-200">
            <HelpCircle size={20} /> Help
         </button>
      </div>
    </section>
  );
}
