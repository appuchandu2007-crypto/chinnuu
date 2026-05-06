import React, { useState, useEffect } from 'react';
import { Star, Search, ThumbsUp } from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface Review {
  id: string;
  name: string;
  role: string;
  feedback: string;
  rating: number;
  date: string;
  likes: number;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', role: '', feedback: '', rating: 5 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'reviews'), (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      // Sort by date descending
      fetchedReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setReviews(fetchedReviews);
      setIsReady(true);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'reviews');
    });

    return () => unsubscribe();
  }, []);

  const filteredReviews = reviews.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.role.toLowerCase().includes(search.toLowerCase()) ||
    r.feedback.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.feedback) return;

    const newId = Date.now().toString();
    const newReview: Review = {
      id: newId,
      ...formData,
      date: new Date().toISOString(),
      likes: 0
    };

    try {
      await setDoc(doc(db, 'reviews', newId), {
        name: newReview.name,
        role: newReview.role,
        feedback: newReview.feedback,
        rating: newReview.rating,
        date: newReview.date,
        likes: newReview.likes
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews/' + newId);
    }
    
    setFormData({ name: '', role: '', feedback: '', rating: 5 });
  };

  const handleLike = async (id: string) => {
    try {
      await updateDoc(doc(db, 'reviews', id), {
        likes: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'reviews/' + id);
    }
  };

  return (
    <section id="reviews" className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">User Reviews</h2>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div id="review-form" className="bg-white p-6 rounded-2xl border border-pink-200 shadow-xl shadow-pink-100/50 sticky top-24">
            <h3 className="text-xl font-bold text-pink-600 mb-4">
              Write a Review
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Role (Optional)</label>
                <input 
                  type="text" 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  placeholder="e.g. Student, User"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({...formData, rating: star})}
                      className="focus:outline-none"
                    >
                      <Star className={`w-6 h-6 ${star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Feedback</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.feedback}
                  onChange={e => setFormData({...formData, feedback: e.target.value})}
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 resize-none"
                  placeholder="Share your experience..."
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md shadow-pink-200"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search reviews by name, role, or keyword..."
              className="w-full bg-white border border-pink-200 shadow-sm rounded-xl pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {filteredReviews.map(review => (
              <div key={review.id} className="bg-white p-5 rounded-xl border border-pink-100 shadow-md shadow-pink-100/30 hover:border-pink-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-slate-900 font-bold">{review.name}</h4>
                    {review.role && <span className="text-xs text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">{review.role}</span>}
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">"{review.feedback}"</p>
                
                <div className="flex items-center justify-end text-xs text-slate-500 border-t border-pink-50 pt-3 mt-auto">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleLike(review.id)} className="flex items-center gap-1 hover:text-pink-600 transition-colors">
                      <ThumbsUp className="w-3 h-3" /> {review.likes}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredReviews.length === 0 && (
              <div className="col-span-full text-center py-10 text-slate-500">
                No reviews found.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
