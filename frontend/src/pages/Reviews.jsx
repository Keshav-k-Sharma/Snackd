import { useState } from 'react';
import { Star, Filter, ThumbsUp, Send, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import { ReviewCard, StarInput } from '../components/RatingComponent';
import { mockReviews, restaurants } from '../data/mockData';

const RATING_DIST = { 5: 67, 4: 20, 3: 8, 2: 3, 1: 2 };
const AVG_RATING  = 4.7;

function RatingBreakdown() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <p className="font-display text-5xl font-bold text-ink">{AVG_RATING}</p>
          <div className="flex justify-center mt-2 gap-0.5">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={14} fill={i <= Math.round(AVG_RATING) ? '#FFB800' : '#334155'} stroke="none" />
            ))}
          </div>
          <p className="text-xs text-muted mt-1">
            {mockReviews.length.toLocaleString()} reviews
          </p>
        </div>
        <div className="flex-1 space-y-2">
          {[5,4,3,2,1].map(star => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-muted w-4">{star}</span>
              <Star size={10} fill="#FFB800" stroke="none" className="shrink-0" />
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${RATING_DIST[star]}%`,
                           background: star >= 4 ? 'linear-gradient(90deg,#FF5722,#FF8C00)' : 'rgba(255,255,255,0.2)' }} />
              </div>
              <span className="text-xs text-muted w-8 text-right">{RATING_DIST[star]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WriteReview({ onClose }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [restaurant, setRestaurant] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!rating || !body || !restaurant) return;
    // API placeholder: POST /api/reviews
    setSubmitted(true);
    setTimeout(onClose, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center px-4 pb-4 md:pb-0"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="glass-card rounded-3xl p-8 w-full max-w-lg animate-slide-up">
        {submitted ? (
          <div className="text-center py-6">
            <p className="text-4xl mb-4">🎉</p>
            <h3 className="text-lg font-bold text-ink mb-2">Review submitted!</h3>
            <p className="text-sm text-muted">Thank you for your feedback.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-ink">Write a Review</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-ink hover:bg-white/5 transition">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Restaurant select */}
              <div>
                <label className="text-xs text-muted font-semibold uppercase tracking-wider block mb-1.5">
                  Restaurant
                </label>
                <select value={restaurant} onChange={e => setRestaurant(e.target.value)}
                  className="input-field text-sm">
                  <option value="">Select a restaurant…</option>
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              {/* Rating stars */}
              <div>
                <label className="text-xs text-muted font-semibold uppercase tracking-wider block mb-2">
                  Your Rating
                </label>
                <StarInput value={rating} onChange={setRating} size={28} />
              </div>

              {/* Title */}
              <div>
                <label className="text-xs text-muted font-semibold uppercase tracking-wider block mb-1.5">
                  Title
                </label>
                <input className="input-field text-sm" placeholder="Sum it up in a sentence…"
                  value={title} onChange={e => setTitle(e.target.value)} />
              </div>

              {/* Body */}
              <div>
                <label className="text-xs text-muted font-semibold uppercase tracking-wider block mb-1.5">
                  Your Experience
                </label>
                <textarea className="input-field text-sm h-28 resize-none"
                  placeholder="Tell others what you loved (or didn't)…"
                  value={body} onChange={e => setBody(e.target.value)} />
              </div>

              <button onClick={handleSubmit}
                className={`btn-primary w-full justify-center ${(!rating || !body || !restaurant) ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!rating || !body || !restaurant}>
                <Send size={15} /> Submit Review
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Reviews() {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showWrite, setShowWrite] = useState(false);

  const filtered = mockReviews
    .filter(r => filter === 'all' || r.restaurantId === filter)
    .sort((a, b) => sortBy === 'helpful' ? b.helpful - a.helpful : new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen" style={{ background: '#080B12' }}>
      <Navbar />
      {showWrite && <WriteReview onClose={() => setShowWrite(false)} />}

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">Reviews</h1>
            <p className="text-muted text-sm mt-1">Real experiences from real customers</p>
          </div>
          <button onClick={() => setShowWrite(true)} className="btn-primary">
            <Star size={15} /> Write Review
          </button>
        </div>

        {/* Rating breakdown */}
        <div className="mb-8">
          <RatingBreakdown />
        </div>

        {/* Filter + Sort row */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <div className="flex items-center gap-2 flex-1 overflow-x-auto">
            <button onClick={() => setFilter('all')}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all' ? 'text-white' : 'text-muted hover:text-ink'}`}
              style={filter === 'all'
                ? { background: 'linear-gradient(135deg,#FF5722,#FF8C00)' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              All
            </button>
            {restaurants.filter(r => mockReviews.some(rv => rv.restaurantId === r.id)).map(r => (
              <button key={r.id} onClick={() => setFilter(r.id)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === r.id ? 'text-white' : 'text-muted hover:text-ink'}`}
                style={filter === r.id
                  ? { background: 'linear-gradient(135deg,#FF5722,#FF8C00)' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {r.name.split(' ')[0]}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl outline-none text-muted cursor-pointer transition hover:text-ink shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {/* Review cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-muted">No reviews match this filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(review => <ReviewCard key={review.id} review={review} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reviews;
