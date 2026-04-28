import { Link } from 'react-router-dom';
import { Star, Clock, Bike, ChevronRight, Zap } from 'lucide-react';

function PriceLevel({ level }) {
  return (
    <span className="text-xs text-muted">
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} style={{ color: i < level ? '#FF8A65' : '#334155' }}>₹</span>
      ))}
    </span>
  );
}

function RestaurantCard({ restaurant }) {
  const { id, name, cuisineLabel, rating, reviewCount, deliveryTime,
          deliveryFee, priceLevel, tags, promoted, offer,
          coverGradient, accentColor, isOpen } = restaurant;

  return (
    <Link to={`/menu/${id}`} className="block group">
      <div className={`glass-card rounded-2xl overflow-hidden transition-all duration-300
        hover:scale-[1.02] hover:shadow-float cursor-pointer
        ${!isOpen ? 'opacity-60' : ''}`}>

        {/* Cover strip */}
        <div className={`relative h-36 bg-gradient-to-br ${coverGradient} flex items-center justify-center overflow-hidden`}>
          {/* Decorative orb */}
          <div className="absolute w-32 h-32 rounded-full opacity-20 blur-2xl"
            style={{ background: accentColor, top: '-16px', right: '-16px' }} />

          {/* Emoji icon */}
          <span className="text-5xl drop-shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-300">
            {cuisineLabel.includes('Pizza') ? '🍕'
              : cuisineLabel.includes('Sushi') ? '🍣'
              : cuisineLabel.includes('Biryani') ? '🍛'
              : cuisineLabel.includes('Burger') ? '🍔'
              : cuisineLabel.includes('Dessert') || cuisineLabel.includes('Bakery') ? '🍰'
              : cuisineLabel.includes('Vegan') ? '🥗'
              : '🍽'}
          </span>

          {/* Promoted badge */}
          {promoted && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-white"
              style={{ background:'linear-gradient(135deg,#FF5722,#FF8C00)', boxShadow:'0 2px 12px rgba(255,87,34,0.4)' }}>
              <Zap size={9} fill="white" />
              PROMOTED
            </div>
          )}

          {/* Offer badge */}
          {offer && (
            <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg text-[10px] font-bold"
              style={{ background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.25)' }}>
              🎁 {offer}
            </div>
          )}

          {/* Closed overlay */}
          {!isOpen && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-xs font-semibold text-white/60 tracking-widest uppercase">Currently Closed</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-ink text-base leading-snug">{name}</h3>
            <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-lg"
              style={{ background:'rgba(255,184,0,0.12)', border:'1px solid rgba(255,184,0,0.2)' }}>
              <Star size={11} fill="#FFB800" stroke="none" />
              <span className="text-xs font-bold" style={{ color:'#ffd740' }}>{rating}</span>
            </div>
          </div>

          <p className="text-xs text-muted mb-3 leading-relaxed">{cuisineLabel}</p>

          {/* Tags row */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.map(tag => (
                <span key={tag} className="tag tag-primary text-[10px] py-0.5 px-2">{tag}</span>
              ))}
            </div>
          )}

          {/* Footer stats */}
          <div className="flex items-center justify-between text-xs text-muted border-t border-white/5 pt-3">
            <div className="flex items-center gap-1">
              <Clock size={11} />
              <span>{deliveryTime}</span>
            </div>
            <PriceLevel level={priceLevel} />
            <div className="flex items-center gap-1">
              <Bike size={11} />
              <span>{deliveryFee === 0 ? <span style={{color:'#4ade80'}}>Free</span> : `₹${deliveryFee}`}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default RestaurantCard;
