import { Plus, Minus, Flame, Star, Leaf, TrendingUp } from 'lucide-react';
import { useCart } from '../context/CartContext';

function FoodCard({ item, restaurantId, restaurantName }) {
  const { addItem, updateQty, getQty } = useCart();
  const qty = getQty(item.id);

  const handleAdd = () => addItem(item, restaurantId, restaurantName);
  const handleInc = () => updateQty(item.id, qty + 1);
  const handleDec = () => updateQty(item.id, qty - 1);

  const hasDynamicPrice = item.price !== item.basePrice;

  return (
    <div className={`glass-card rounded-2xl p-5 flex gap-4 transition-all duration-300
      hover:border-white/12 group ${!item.available ? 'opacity-50' : ''}`}>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Veg / Non-veg dot */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center shrink-0
            ${item.veg ? 'border-green-500' : 'border-red-500'}`}>
            <div className={`w-2 h-2 rounded-full ${item.veg ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>

          {item.popular && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background:'rgba(255,87,34,0.15)', color:'#FF8A65', border:'1px solid rgba(255,87,34,0.25)' }}>
              <TrendingUp size={9} /> Bestseller
            </div>
          )}

          {item.spicy && (
            <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background:'rgba(239,68,68,0.12)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)' }}>
              <Flame size={9} /> Spicy
            </div>
          )}
        </div>

        <h3 className="font-semibold text-ink text-sm leading-snug mb-1 group-hover:text-primary-light
          transition-colors duration-200 line-clamp-2">{item.name}</h3>

        <p className="text-xs text-muted leading-relaxed mb-3 line-clamp-2">{item.desc}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star size={10} fill="#FFB800" stroke="none" />
          <span className="text-xs font-medium" style={{ color:'#ffd740' }}>{item.rating}</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-ink">₹{item.price}</span>
          {hasDynamicPrice && (
            <span className="text-xs text-muted line-through">₹{item.basePrice}</span>
          )}
        </div>
      </div>

      {/* Right: emoji + add control */}
      <div className="flex flex-col items-center gap-3 shrink-0">
        <div className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl
          transition-transform duration-300 group-hover:scale-110"
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
          {item.image}
        </div>

        {!item.available ? (
          <span className="text-[10px] text-muted font-medium px-3 py-1 rounded-full"
            style={{ background:'rgba(255,255,255,0.05)' }}>
            Unavailable
          </span>
        ) : qty === 0 ? (
          <button onClick={handleAdd}
            className="flex items-center gap-1 px-4 py-1.5 rounded-xl text-sm font-semibold text-white
              transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background:'linear-gradient(135deg,#FF5722,#FF8C00)', boxShadow:'0 2px 12px rgba(255,87,34,0.3)' }}>
            <Plus size={14} /> Add
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-xl px-1 py-1"
            style={{ background:'rgba(255,87,34,0.12)', border:'1px solid rgba(255,87,34,0.25)' }}>
            <button onClick={handleDec}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
              style={{ color:'#FF8A65' }}>
              <Minus size={13} />
            </button>
            <span className="text-sm font-bold w-4 text-center text-ink">{qty}</span>
            <button onClick={handleInc}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
              style={{ color:'#FF8A65' }}>
              <Plus size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodCard;
