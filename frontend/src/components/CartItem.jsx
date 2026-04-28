import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

function CartItem({ cartEntry }) {
  const { item, qty } = cartEntry;
  const { updateQty, removeItem } = useCart();

  return (
    <div className="glass-card rounded-2xl p-4 flex items-center gap-4 transition-all duration-300
      hover:border-white/10 group">

      {/* Emoji thumbnail */}
      <div className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center text-2xl"
        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
        {item.image}
      </div>

      {/* Name + price */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-ink leading-snug line-clamp-1">{item.name}</h4>
        <p className="text-xs text-muted mt-0.5">₹{item.price} per item</p>
        <p className="text-sm font-bold mt-1" style={{ color:'#FF8A65' }}>₹{item.price * qty}</p>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-xl px-1 py-1"
          style={{ background:'rgba(255,87,34,0.1)', border:'1px solid rgba(255,87,34,0.2)' }}>
          <button onClick={() => updateQty(item.id, qty - 1)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition hover:bg-white/10"
            style={{ color:'#FF8A65' }}>
            <Minus size={12} />
          </button>
          <span className="w-5 text-center text-sm font-bold text-ink">{qty}</span>
          <button onClick={() => updateQty(item.id, qty + 1)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition hover:bg-white/10"
            style={{ color:'#FF8A65' }}>
            <Plus size={12} />
          </button>
        </div>

        <button onClick={() => removeItem(item.id)}
          className="w-8 h-8 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100
            transition-all duration-200 hover:bg-red-500/15"
          style={{ color:'#f87171' }}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default CartItem;
