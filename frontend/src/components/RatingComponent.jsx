import { Star } from 'lucide-react';
import { useState } from 'react';

// Display-only star rating
export function StarDisplay({ rating, size = 14, showNumber = true }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f${i}`} size={size} fill="#FFB800" stroke="none" />
        ))}
        {half && (
          <span className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} fill="#334155" stroke="none" className="absolute inset-0" />
            <span className="absolute inset-0 overflow-hidden" style={{ width:'50%' }}>
              <Star size={size} fill="#FFB800" stroke="none" />
            </span>
          </span>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e${i}`} size={size} fill="#334155" stroke="none" />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold" style={{ color:'#ffd740' }}>{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

// Interactive star input
export function StarInput({ value, onChange, size = 22 }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = (hover || value) > i;
        return (
          <button key={i} type="button"
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(i + 1)}
            className="transition-transform duration-100 hover:scale-125 active:scale-110">
            <Star size={size} fill={filled ? '#FFB800' : '#334155'} stroke="none" />
          </button>
        );
      })}
    </div>
  );
}

// Full review card
export function ReviewCard({ review }) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted] = useState(false);

  const initials = review.user.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="glass-card rounded-2xl p-5 transition-all duration-300 hover:border-white/12">
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm"
          style={{ background:'linear-gradient(135deg,rgba(255,87,34,0.2),rgba(255,140,0,0.1))', color:'#FF8A65' }}>
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <p className="text-sm font-semibold text-ink">{review.user.name}</p>
            <p className="text-xs text-muted">{review.date}</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <StarDisplay rating={review.rating} size={12} showNumber={false} />
            {review.verified && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background:'rgba(34,197,94,0.1)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.2)' }}>
                ✓ Verified
              </span>
            )}
          </div>
        </div>
      </div>

      <h4 className="text-sm font-semibold text-ink mb-1.5">"{review.title}"</h4>
      <p className="text-sm text-muted leading-relaxed mb-3">{review.body}</p>

      {review.orderedItems?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {review.orderedItems.map(item => (
            <span key={item} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background:'rgba(255,255,255,0.05)', color:'#64748B' }}>
              {item}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 pt-3 border-t border-white/5">
        <span className="text-xs text-muted">Helpful?</span>
        <button onClick={() => { if (!voted) { setHelpful(h => h + 1); setVoted(true); } }}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl transition-all duration-200
            ${voted ? '' : 'hover:bg-white/5'}`}
          style={voted ? { background:'rgba(255,87,34,0.12)', color:'#FF8A65' } : { color:'#64748B' }}>
          👍 {helpful}
        </button>
      </div>
    </div>
  );
}

export default StarDisplay;
