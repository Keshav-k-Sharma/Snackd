import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Tag, X, ChevronRight, Bike, Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { promoCodes } from '../data/mockData';

const PAYMENT_METHODS = [
  { id: 'upi',  label: 'UPI',          icon: '📱' },
  { id: 'card', label: 'Credit/Debit', icon: '💳' },
  { id: 'cod',  label: 'Cash',         icon: '💵' },
];

function Cart() {
  const { items, restaurantName, subtotal, deliveryFee, taxes,
          promoCode, promoDiscount, promoError, total,
          applyPromo, removePromo, clearCart } = useCart();
  const [promoInput, setPromoInput] = useState('');
  const [payMethod, setPayMethod] = useState('upi');
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const navigate = useNavigate();

  const handleApplyPromo = () => {
    if (promoInput.trim()) applyPromo(promoInput.trim());
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const orderData = {
        UserID: 1, // Seeded Arjun Mehta
        RestaurantID: parseInt(items[0].item.restaurantId),
        AddressID: 1, // Seeded Home
        Status: "Pending",
        TotalAmount: total,
        DeliveryFee: deliveryFee,
        Discount: promoDiscount,
        items: items.map(entry => ({
          FoodID: parseInt(entry.item.id),
          Quantity: entry.qty,
          PriceAtOrder: entry.item.price
        }))
      };

      const response = await fetch('http://localhost:8000/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setPlacing(false);
        setPlaced(true);
        setTimeout(() => {
          clearCart();
          navigate('/orders');
        }, 1800);
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      setPlacing(false);
      alert("Error placing order. Is the backend running?");
    }
  };

  if (placed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#080B12' }}>
        <div className="text-center animate-bounce-in">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg,#FF5722,#FF8C00)', boxShadow: '0 0 40px rgba(255,87,34,0.4)' }}>
            <CheckCircle2 size={36} className="text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink mb-2">Order Placed!</h2>
          <p className="text-muted text-sm">Redirecting to tracking…</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: '#080B12' }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center px-6">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="font-display text-2xl font-bold text-ink mb-3">Your cart is empty</h2>
          <p className="text-muted text-sm mb-8 max-w-xs">Looks like you haven't added anything yet. Explore our restaurants and find something delicious.</p>
          <Link to="/restaurants" className="btn-primary">
            <ShoppingBag size={16} /> Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  const savings = promoDiscount;

  return (
    <div className="min-h-screen" style={{ background: '#080B12' }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/restaurants"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-ink transition-all hover:bg-white/5">
            <ArrowLeft size={17} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Your Cart</h1>
            <p className="text-xs text-muted mt-0.5">from {restaurantName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Left — items */}
          <div className="space-y-3">
            <div className="space-y-3">
              {items.map(entry => <CartItem key={entry.item.id} cartEntry={entry} />)}
            </div>

            {/* Promo code */}
            <div className="glass-card rounded-2xl p-5 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={15} style={{ color: '#FF8A65' }} />
                <span className="text-sm font-semibold text-ink">Promo Code</span>
              </div>
              {promoCode ? (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#4ade80' }}>{promoCode} applied!</p>
                    <p className="text-xs text-muted mt-0.5">{promoCodes[promoCode]?.description}</p>
                  </div>
                  <button onClick={removePromo} className="text-muted hover:text-ink transition">
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input className="input-field h-11 text-sm flex-1"
                    placeholder="Enter promo code (try FIRST50)"
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && handleApplyPromo()} />
                  <button onClick={handleApplyPromo}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                    style={{ background: 'rgba(255,87,34,0.15)', color: '#FF8A65', border: '1px solid rgba(255,87,34,0.25)' }}>
                    Apply
                  </button>
                </div>
              )}
              {promoError && <p className="text-xs mt-2" style={{ color: '#f87171' }}>{promoError}</p>}

              {/* Available codes hint */}
              {!promoCode && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {Object.entries(promoCodes).map(([code, promo]) => (
                    <button key={code} onClick={() => { setPromoInput(code); applyPromo(code); }}
                      className="text-[10px] px-2 py-1 rounded-lg font-semibold transition hover:scale-105"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#64748B', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {code}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Payment method */}
            <div className="glass-card rounded-2xl p-5">
              <p className="text-sm font-semibold text-ink mb-3">Payment Method</p>
              <div className="flex gap-3">
                {PAYMENT_METHODS.map(pm => (
                  <button key={pm.id} onClick={() => setPayMethod(pm.id)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-all ${payMethod === pm.id ? 'text-white' : 'text-muted hover:text-ink'}`}
                    style={payMethod === pm.id
                      ? { background: 'linear-gradient(135deg,rgba(255,87,34,0.25),rgba(255,140,0,0.15))', border: '1px solid rgba(255,87,34,0.4)' }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <span className="text-xl">{pm.icon}</span>
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — bill summary */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6 sticky top-20">
              <h2 className="font-display text-lg font-bold text-ink mb-5">Bill Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Item Total</span>
                  <span className="text-ink">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span className="flex items-center gap-1"><Bike size={12} /> Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-green-400 font-semibold' : 'text-ink'}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Taxes & Charges</span>
                  <span className="text-ink">₹{taxes}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between" style={{ color: '#4ade80' }}>
                    <span>Promo Discount</span>
                    <span>-₹{promoDiscount}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/8 mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-ink">Total</span>
                <div className="text-right">
                  <span className="font-display text-xl font-bold text-ink">₹{total}</span>
                  {savings > 0 && (
                    <p className="text-[11px] mt-0.5" style={{ color: '#4ade80' }}>
                      You save ₹{savings}!
                    </p>
                  )}
                </div>
              </div>

              <button onClick={handlePlaceOrder} disabled={placing}
                className="btn-primary w-full mt-5 justify-center text-base py-4 relative overflow-hidden">
                {placing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing Order…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Place Order · ₹{total} <ChevronRight size={16} />
                  </span>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted">
                <Shield size={11} />
                <span>100% secure payments</span>
              </div>
            </div>

            {/* Delivery address */}
            <div className="glass-card rounded-2xl p-4">
              <p className="text-xs text-muted mb-1 uppercase tracking-wider font-semibold">Delivering to</p>
              <p className="text-sm font-semibold text-ink">🏠 Home</p>
              <p className="text-xs text-muted mt-0.5">14/B, Anna Nagar West, Chennai 600040</p>
              <button className="text-xs mt-2 font-semibold transition hover:opacity-80"
                style={{ color: '#FF8A65' }}>
                Change address
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
