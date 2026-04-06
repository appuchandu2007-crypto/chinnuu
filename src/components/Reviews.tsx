import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Star, Search, Edit2, Trash2, ThumbsUp } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  role: string;
  feedback: string;
  rating: number;
  date: string;
  likes: number;
}

const initialReviews: Review[] = [
  { id: '1', name: 'Satish', role: 'User', feedback: 'This platform changed my life. I finally feel heard.', rating: 5, date: new Date().toISOString(), likes: 12 },
  { id: '2', name: 'Nagarathna', role: 'User', feedback: 'Amazing support and very confidential.', rating: 5, date: new Date().toISOString(), likes: 8 },
  { id: '3', name: 'Chandan', role: 'User', feedback: 'The best place to talk when you are feeling down.', rating: 5, date: new Date().toISOString(), likes: 15 },
  { id: '4', name: 'Lakshmi Devi', role: 'HOD', feedback: 'A wonderful initiative for mental health support.', rating: 5, date: new Date().toISOString(), likes: 20 },
  { id: '5', name: 'Vandana', role: 'Graduate', feedback: 'Helped me through my post-graduation stress.', rating: 5, date: new Date().toISOString(), likes: 5 },
  { id: '6', name: 'Vamshi', role: 'MLA', feedback: 'Great service to the community. Highly needed.', rating: 5, date: new Date().toISOString(), likes: 45 },
  { id: '7', name: 'Pallavi', role: 'Student', feedback: 'I use this whenever exam stress gets too much.', rating: 5, date: new Date().toISOString(), likes: 11 },
  { id: '8', name: 'Chethan', role: 'User', feedback: 'Very kind listeners.', rating: 5, date: new Date().toISOString(), likes: 3 },
  { id: '9', name: 'Pushpa', role: 'User', feedback: 'Thank you for being there.', rating: 5, date: new Date().toISOString(), likes: 7 },
  { id: '10', name: 'Sahana', role: 'User', feedback: 'I feel much better after talking here.', rating: 5, date: new Date().toISOString(), likes: 9 },
  { id: '11', name: 'Mamtha', role: 'User', feedback: 'Truly valuable voices.', rating: 5, date: new Date().toISOString(), likes: 6 },
  { id: '12', name: 'Suvarnamma', role: 'User', feedback: 'God bless this team.', rating: 5, date: new Date().toISOString(), likes: 14 },
  { id: '13', name: 'Swamy', role: 'User', feedback: 'Very helpful and supportive.', rating: 5, date: new Date().toISOString(), likes: 4 },
  { id: '14', name: 'Ganganna', role: 'User', feedback: 'Excellent platform for everyone.', rating: 5, date: new Date().toISOString(), likes: 10 },
];

export default function Reviews() {
  const [reviews, setReviews] = useLocalStorage<Review[]>('vv_reviews', initialReviews);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', role: '', feedback: '', rating: 5 });
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredReviews = reviews.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.role.toLowerCase().includes(search.toLowerCase()) ||
    r.feedback.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.feedback) return;

    if (editingId) {
      setReviews(reviews.map(r => r.id === editingId ? { ...r, ...formData, date: new Date().toISOString() } : r));
      setEditingId(null);
    } else {
      const newReview: Review = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString(),
        likes: 0
      };
      setReviews([newReview, ...reviews]);
    }
    setFormData({ name: '', role: '', feedback: '', rating: 5 });
  };

  const handleEdit = (review: Review) => {
    setFormData({ name: review.name, role: review.role, feedback: review.feedback, rating: review.rating });
    setEditingId(review.id);
    document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const handleLike = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
  };

  return (
    <section id="reviews" className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">User Reviews</h2>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div id="review-form" className="bg-slate-900 p-6 rounded-2xl border border-pink-500/30 sticky top-24">
            <h3 className="text-xl font-bold text-pink-400 mb-4">
              {editingId ? 'Edit Review' : 'Write a Review'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Role (Optional)</label>
                <input 
                  type="text" 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                  placeholder="e.g. Student, User"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({...formData, rating: star})}
                      className="focus:outline-none"
                    >
                      <Star className={`w-6 h-6 ${star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Feedback</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.feedback}
                  onChange={e => setFormData({...formData, feedback: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500 resize-none"
                  placeholder="Share your experience..."
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                {editingId ? 'Update Review' : 'Submit Review'}
              </button>
              {editingId && (
                <button 
                  type="button"
                  onClick={() => { setEditingId(null); setFormData({ name: '', role: '', feedback: '', rating: 5 }); }}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors mt-2"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search reviews by name, role, or keyword..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {filteredReviews.map(review => (
              <div key={review.id} className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 hover:border-pink-500/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-white font-bold">{review.name}</h4>
                    {review.role && <span className="text-xs text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full">{review.role}</span>}
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">"{review.feedback}"</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-slate-800 pt-3 mt-auto">
                  <span>{new Date(review.date).toLocaleDateString()} {new Date(review.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleLike(review.id)} className="flex items-center gap-1 hover:text-pink-400 transition-colors">
                      <ThumbsUp className="w-3 h-3" /> {review.likes}
                    </button>
                    <button onClick={() => handleEdit(review)} className="hover:text-blue-400 transition-colors">
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDelete(review.id)} className="hover:text-red-400 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredReviews.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">
                No reviews found.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
