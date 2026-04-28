import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Gift, ChevronRight, Edit3,
         Package, Heart, LogOut, Shield, Bell, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import { mockUser, orderHistory } from '../data/mockData';

const TIER_CONFIG = {
  Silver:   { color: '#94a3b8', glow: 'rgba(148,163,184,0.2)', next: 'Gold',     pointsToNext: 1000 },
  Gold:     { color: '#FFB800', glow: 'rgba(255,184,0,0.2)',   next: 'Platinum', pointsToNext: 2160 },
  Platinum: { color: '#a78bfa', glow: 'rgba(167,139,250,0.2)', next: null,       pointsToNext: 0    },
};

function LoyaltyRing({ points, tier }) {
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.Gold;
  const max = points + cfg.pointsToNext;
  const pct = Math.min(100, (points / max) * 100);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle cx="60" cy="60" r={r} fill="none"
            stroke={cfg.color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 8px ${cfg.glow})`, transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold" style={{ color: cfg.color }}>
            {points.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted">points</span>
        </div>
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Zap size={13} style={{ color: cfg.color }} />
          <span className="font-bold text-sm" style={{ color: cfg.color }}>{tier} Member</span>
        </div>
        {cfg.next && (
          <p className="text-[11px] text-muted">
            {cfg.pointsToNext.toLocaleString()} points to {cfg.next}
          </p>
        )}
      </div>
    </div>
  );
}

const STATUS_COLOR = {
  delivered: { bg: 'rgba(34,197,94,0.1)', text: '#4ade80', border: 'rgba(34,197,94,0.2)' },
  cancelled:  { bg: 'rgba(239,68,68,0.1)', text: '#f87171', border: 'rgba(239,68,68,0.2)' },
};

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/users/1');
        const data = await response.json();
        // Map DB user to component expected fields
        setUser({
          ...data,
          id: data.UserID.toString(),
          name: data.Name,
          email: data.Email,
          phone: data.Phone,
          loyaltyPoints: 2840,
          loyaltyTier: 'Gold',
          joinedAt: data.CreatedAt,
          addresses: [
            { id: 'a1', label: 'Home', address: '14/B, Anna Nagar West, Chennai 600040', default: true },
          ]
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading || !user) return <div className="min-h-screen" style={{ background: '#080B12' }}><Navbar /><div className="text-center py-20 text-muted">Loading profile...</div></div>;

  const initials = user.name.split(' ').map(n => n[0]).join('');

  const TABS = [
    { id: 'orders',    label: 'Orders' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'settings',  label: 'Settings' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#080B12' }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Profile hero card */}
        <div className="glass-card rounded-3xl p-8 mb-6 relative overflow-hidden">
          {/* Gradient blob */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none blur-3xl"
            style={{ background: 'radial-gradient(circle, #FF5722, transparent 70%)' }} />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center font-display text-3xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#FF5722,#FF8C00)', boxShadow: '0 0 32px rgba(255,87,34,0.35)' }}>
                {initials}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center
                transition hover:scale-110"
                style={{ background: '#1E2540', border: '2px solid rgba(255,255,255,0.08)' }}>
                <Edit3 size={13} className="text-muted" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-display text-2xl font-bold text-ink mb-1">{user.name}</h1>
              <p className="text-sm text-muted mb-1">{user.email}</p>
              <p className="text-sm text-muted mb-4">{user.phone}</p>
              <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                <span className="tag tag-gold text-xs">
                  ⭐ {user.loyaltyTier} Member
                </span>
                <span className="tag text-xs" style={{ background: 'rgba(255,255,255,0.05)', color: '#64748B' }}>
                  Since {new Date(user.joinedAt).getFullYear()}
                </span>
              </div>
            </div>

            {/* Loyalty ring */}
            <LoyaltyRing points={user.loyaltyPoints} tier={user.loyaltyTier} />
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: '📦', value: orderHistory.length + 3, label: 'Total Orders' },
            { icon: '⭐', value: user.loyaltyPoints.toLocaleString(), label: 'Loyalty Points' },
            { icon: '💰', value: `₹${orderHistory.reduce((s, o) => s + o.total, 0).toLocaleString()}`, label: 'Total Spent' },
          ].map(({ icon, value, label }) => (
            <div key={label} className="glass-card rounded-2xl p-4 text-center">
              <div className="text-2xl mb-2">{icon}</div>
              <p className="font-display text-lg font-bold text-ink">{value}</p>
              <p className="text-xs text-muted">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl mb-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${activeTab === tab.id ? 'text-white' : 'text-muted hover:text-ink'}`}
              style={activeTab === tab.id
                ? { background: 'linear-gradient(135deg,#FF5722,#FF8C00)' }
                : {}}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            {orderHistory.map(order => {
              const sc = STATUS_COLOR[order.status] || STATUS_COLOR.delivered;
              return (
                <div key={order.id} className="glass-card rounded-2xl p-5 hover:border-white/12 transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-ink">{order.restaurantName}</p>
                      <p className="text-xs text-muted mt-0.5">{order.date} · #{order.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                        {order.status === 'delivered' ? '✓ Delivered' : order.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted mb-3">{order.items.join(' · ')}</p>
                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-ink">₹{order.total}</span>
                      {order.pointsEarned > 0 && (
                        <span className="tag tag-gold text-[10px]">
                          +{order.pointsEarned} pts
                        </span>
                      )}
                    </div>
                    <button className="text-xs font-semibold transition hover:opacity-80"
                      style={{ color: '#FF8A65' }}>
                      Reorder
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="space-y-3">
            {user.addresses.map(addr => (
              <div key={addr.id} className="glass-card rounded-2xl p-5 flex items-start gap-4 hover:border-white/12 transition-all">
                <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-lg"
                  style={{ background: 'rgba(255,87,34,0.1)' }}>
                  {addr.label === 'Home' ? '🏠' : '🏢'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-ink text-sm">{addr.label}</p>
                    {addr.default && <span className="tag tag-success text-[10px]">Default</span>}
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{addr.address}</p>
                </div>
                <button className="text-muted hover:text-ink transition shrink-0">
                  <Edit3 size={14} />
                </button>
              </div>
            ))}
            <button className="w-full glass-card rounded-2xl p-5 flex items-center justify-center gap-2
              text-sm font-semibold text-muted hover:text-ink hover:border-white/12 transition-all border-dashed">
              + Add New Address
            </button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-2">
            {[
              { icon: <Bell size={16} />, label: 'Notifications', desc: 'Order updates, offers' },
              { icon: <Shield size={16} />, label: 'Privacy & Security', desc: 'Password, 2FA' },
              { icon: <Gift size={16} />, label: 'Referrals', desc: 'Invite friends, earn ₹50' },
              { icon: <Heart size={16} />, label: 'Favourites', desc: 'Saved restaurants' },
            ].map(({ icon, label, desc }) => (
              <button key={label}
                className="w-full glass-card rounded-2xl px-5 py-4 flex items-center gap-4 text-left
                  hover:border-white/12 transition-all duration-200 group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition group-hover:scale-110"
                  style={{ background: 'rgba(255,87,34,0.08)', color: '#FF8A65' }}>
                  {icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{label}</p>
                  <p className="text-xs text-muted">{desc}</p>
                </div>
                <ChevronRight size={15} className="text-muted group-hover:text-ink transition" />
              </button>
            ))}

            <button className="w-full glass-card rounded-2xl px-5 py-4 flex items-center gap-4 text-left
              hover:border-red-500/20 transition-all duration-200 group mt-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                <LogOut size={16} />
              </div>
              <p className="text-sm font-semibold" style={{ color: '#f87171' }}>Sign Out</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
