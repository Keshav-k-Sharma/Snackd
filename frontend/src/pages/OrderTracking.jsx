import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Star, Bike, MapPin, Clock, Package, CheckCircle2,
         ChefHat, Home, ArrowLeft, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import OrderTimeline from '../components/OrderTimeline';
import { mockOrders } from '../data/mockData';

function ETACountdown({ estimatedDelivery }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, Math.floor((new Date(estimatedDelivery) - Date.now()) / 1000));
      setRemaining(diff);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [estimatedDelivery]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const totalSecs = 30 * 60;
  const progress = Math.max(0, Math.min(100, ((totalSecs - remaining) / totalSecs) * 100));
  const circumference = 2 * Math.PI * 44;
  const offset = circumference * (1 - progress / 100);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SVG ring */}
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <circle cx="50" cy="50" r="44" fill="none"
            stroke="url(#etaGrad)" strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease' }} />
          <defs>
            <linearGradient id="etaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF5722" />
              <stop offset="100%" stopColor="#FF8C00" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {remaining > 0 ? (
            <>
              <span className="font-display text-2xl font-bold text-ink">
                {mins}:{secs.toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] text-muted">remaining</span>
            </>
          ) : (
            <span className="text-2xl">🎉</span>
          )}
        </div>
      </div>
      <div className="text-center">
        <p className="font-semibold text-ink text-sm">
          {remaining > 0 ? 'Arriving in' : 'Delivered!'}
        </p>
        {remaining > 0 && (
          <p className="text-xs text-muted mt-0.5">{mins} min {secs}s</p>
        )}
      </div>
    </div>
  );
}

/* Simulated map with animated driver dot */
function DeliveryMap({ driverName }) {
  const [pos, setPos] = useState({ x: 30, y: 55 });
  const dest = { x: 72, y: 35 };

  useEffect(() => {
    const id = setInterval(() => {
      setPos(p => ({
        x: p.x + (dest.x - p.x) * 0.02 + (Math.random() - 0.5) * 0.5,
        y: p.y + (dest.y - p.y) * 0.02 + (Math.random() - 0.5) * 0.5,
      }));
    }, 600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-48 rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#0F1525,#131928)' }}>
      {/* Fake grid / road pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        {[20, 40, 60, 80].map(y => (
          <line key={`h${y}`} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`}
            stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        ))}
        {[15, 30, 50, 70, 85].map(x => (
          <line key={`v${x}`} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%"
            stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        ))}
        {/* Highlighted roads */}
        <line x1="0" y1="40%" x2="100%" y2="40%" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      </svg>

      {/* Destination pin */}
      <div className="absolute flex flex-col items-center" style={{ left: `${dest.x}%`, top: `${dest.y}%`, transform: 'translate(-50%,-100%)' }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(34,197,94,0.9)', boxShadow: '0 0 12px rgba(34,197,94,0.5)' }}>
          <Home size={13} className="text-white" />
        </div>
        <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent"
          style={{ borderTopColor: 'rgba(34,197,94,0.9)' }} />
      </div>

      {/* Driver dot */}
      <div className="absolute" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%,-50%)', transition: 'left 0.6s ease, top 0.6s ease' }}>
        <div className="relative">
          <div className="absolute inset-0 w-8 h-8 rounded-full animate-ping opacity-30"
            style={{ background: '#FF5722' }} />
          <div className="w-8 h-8 rounded-full flex items-center justify-center relative z-10"
            style={{ background: 'linear-gradient(135deg,#FF5722,#FF8C00)', boxShadow: '0 0 16px rgba(255,87,34,0.6)' }}>
            <Bike size={14} className="text-white" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-white"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
          <Bike size={11} style={{ color: '#FF8A65' }} />
          {driverName} is on the way
        </div>
        <div className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs text-muted"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
          <div className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
          Your location
        </div>
      </div>
    </div>
  );
}

function OrderTracking() {
  const order = mockOrders[0];
  const [showHistory, setShowHistory] = useState(false);

  if (!order) {
    return (
      <div className="min-h-screen" style={{ background: '#080B12' }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center px-6">
          <p className="text-5xl mb-4">📦</p>
          <h2 className="text-xl font-bold text-ink mb-2">No active orders</h2>
          <p className="text-muted text-sm mb-6">Place an order and track it live here.</p>
          <Link to="/restaurants" className="btn-primary">Order Now</Link>
        </div>
      </div>
    );
  }

  const { driver } = order;

  return (
    <div className="min-h-screen" style={{ background: '#080B12' }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-ink hover:bg-white/5 transition-all">
            <ArrowLeft size={17} />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-ink">Live Tracking</h1>
            <p className="text-xs text-muted mt-0.5">Order #{order.id}</p>
          </div>
          <div className="tag tag-primary animate-pulse-slow">● Live</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left column */}
          <div className="space-y-5">
            {/* Map */}
            <div className="glass-card rounded-2xl p-4">
              <DeliveryMap driverName={driver.name} />
            </div>

            {/* Driver card */}
            <div className="glass-card rounded-2xl p-5">
              <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-4">Your Delivery Partner</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0"
                  style={{ background: 'linear-gradient(135deg,rgba(255,87,34,0.2),rgba(255,140,0,0.1))', color: '#FF8A65' }}>
                  {driver.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink">{driver.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={11} fill="#FFB800" stroke="none" />
                    <span className="text-xs font-semibold" style={{ color: '#ffd740' }}>{driver.rating}</span>
                    <span className="text-xs text-muted">· {driver.totalDeliveries.toLocaleString()} deliveries</span>
                  </div>
                  <p className="text-xs text-muted mt-1">{driver.vehicle}</p>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${driver.phone}`}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition hover:scale-110"
                    style={{ background: 'rgba(255,87,34,0.12)', color: '#FF8A65', border: '1px solid rgba(255,87,34,0.25)' }}>
                    <Phone size={16} />
                  </a>
                  <button
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition hover:scale-110"
                    style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <MessageCircle size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Order items summary */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-muted uppercase tracking-wider font-semibold">Your Order</p>
                <span className="text-xs text-muted">{order.restaurantName}</span>
              </div>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted">×{item.qty} {item.name}</span>
                    <span className="text-ink font-medium">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/5 mt-3 pt-3 flex justify-between text-sm font-bold">
                <span className="text-ink">Total Paid</span>
                <span style={{ color: '#FF8A65' }}>₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* ETA */}
            <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center">
              <ETACountdown estimatedDelivery={order.estimatedDelivery} />
              <div className="mt-4 flex items-center gap-1.5 text-xs text-muted">
                <MapPin size={11} />
                <span>Anna Nagar West, Chennai</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="glass-card rounded-2xl p-5">
              <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-5">Order Progress</p>
              <OrderTimeline statusHistory={order.statusHistory} currentStatus={order.status} />
            </div>

            {/* Payment info */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Payment</span>
                <span className="font-semibold text-ink flex items-center gap-1.5">
                  📱 {order.paymentMethod} · <span style={{ color: '#4ade80' }}>Paid</span>
                </span>
              </div>
              {order.promoApplied && (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted">Promo</span>
                  <span className="font-semibold" style={{ color: '#4ade80' }}>
                    {order.promoApplied} applied
                  </span>
                </div>
              )}
            </div>

            {/* Support */}
            <div className="glass-card rounded-2xl p-4 text-center">
              <p className="text-xs text-muted mb-3">Having an issue?</p>
              <button className="btn-ghost text-sm w-full justify-center py-2">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
