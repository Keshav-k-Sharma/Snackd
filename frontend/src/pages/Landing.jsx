import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Star, Zap, Gift } from 'lucide-react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import RestaurantCard from '../components/RestaurantCard';

// ... (skipping STATS and PERKS)

const STATS = [
  { icon: '🍽', value: '500+', label: 'Restaurants' },
  { icon: '⚡', value: '28 min', label: 'Avg. Delivery' },
  { icon: '😊', value: '4.8★', label: 'User Rating' },
  { icon: '🌆', value: '12', label: 'Cities' },
];

const PERKS = [
  { icon: <Clock size={20} />, title: 'Fast Delivery', desc: 'Real-time tracking from kitchen to your door.' },
  { icon: <Shield size={20} />, title: 'Safe & Hygienic', desc: 'Every partner restaurant is quality-certified.' },
  { icon: <Gift size={20} />, title: 'Loyalty Rewards', desc: 'Earn points on every order. Redeem for discounts.' },
  { icon: <Star size={20} />, title: 'Top-Rated Only', desc: 'We curate restaurants with 4+ stars only.' },
];

function Landing() {
  const [featured, setFeatured] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Categories
        const catRes = await fetch('http://localhost:8000/categories/');
        const cats = await catRes.json();
        setDbCategories(cats.map(c => ({
          id: c.Name.toLowerCase(),
          label: c.Name,
          emoji: c.Icon || '🍕'
        })));

        // Fetch Restaurants and filter for featured
        const resResponse = await fetch('http://localhost:8000/restaurants/');
        const allRes = await resResponse.json();
        const mapped = allRes.map(r => ({
          ...r,
          id: r.RestaurantID.toString(),
          name: r.Name,
          rating: r.Rating,
          reviewCount: 1200,
          deliveryFee: r.DeliveryFee,
          priceLevel: 2,
          tags: r.IsOpen ? ['Open Now'] : ['Closed'],
          promoted: r.Rating >= 4.5,
          isOpen: r.IsOpen,
          cuisineLabel: 'Italian · Pizza',
          deliveryTime: `${r.PrepTimeMins} min`,
          coverGradient: 'from-orange-900 via-red-900 to-rose-900',
        }));
        setFeatured(mapped.slice(0, 2)); 

        // Fetch Active Order
        const orderRes = await fetch('http://localhost:8000/users/1/orders/');
        const orders = await orderRes.json();
        if (orders && orders.length > 0) {
          const latest = orders[orders.length - 1];
          setActiveOrder({
            ...latest,
            restaurantName: latest.RestaurantID === 1 ? 'The Ember Kitchen' : 'Biryani Brotherhood'
          });
        }
      } catch (error) {
        console.error("Error fetching landing data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen" style={{ background:'#080B12' }}>
      <Navbar />

      {/* Active order banner */}
      {activeOrder && (
        <Link to="/orders" className="block">
          <div className="mx-4 mt-4 rounded-2xl px-5 py-3 flex items-center justify-between cursor-pointer
            transition-all hover:scale-[1.01]"
            style={{ background:'linear-gradient(135deg,rgba(255,87,34,0.15),rgba(255,140,0,0.08))',
                     border:'1px solid rgba(255,87,34,0.25)' }}>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full animate-ping-slow" style={{ background:'#FF5722' }} />
              <span className="text-sm font-semibold text-ink">Active Order — {activeOrder.restaurantName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold" style={{ color:'#FF8A65' }}>
              Track <ArrowRight size={13} />
            </div>
          </div>
        </Link>
      )}

      {/* Hero */}
      <HeroSection />

      {/* Stats strip */}
      <section className="px-6 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <p className="font-display text-xl font-bold text-ink">{value}</p>
                <p className="text-xs text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-ink mb-6">
            What are you craving?
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {dbCategories.map(cat => (
              <Link key={cat.id} to={`/restaurants?category=${cat.id}`}
                className="shrink-0 flex flex-col items-center gap-2 px-5 py-4 rounded-2xl glass-card
                  hover:border-white/15 hover:scale-105 transition-all duration-200 cursor-pointer min-w-[80px]">
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-medium text-muted">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured restaurants */}
      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">Featured Tonight</h2>
              <p className="text-sm text-muted mt-1">Hand-picked by our team</p>
            </div>
            <Link to="/restaurants"
              className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all"
              style={{ color:'#FF8A65' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featured.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-ink mb-8 text-center">
            Why Snackd?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PERKS.map(({ icon, title, desc }) => (
              <div key={title} className="glass-card rounded-2xl p-6 text-center hover:border-white/12
                transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4
                  group-hover:scale-110 transition-transform duration-200"
                  style={{ background:'rgba(255,87,34,0.12)', color:'#FF8A65' }}>
                  {icon}
                </div>
                <h3 className="font-semibold text-ink mb-2">{title}</h3>
                <p className="text-xs text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="px-6 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-10 text-center"
            style={{ background:'linear-gradient(135deg,rgba(255,87,34,0.15),rgba(255,140,0,0.08))',
                     border:'1px solid rgba(255,87,34,0.2)' }}>
            <div className="absolute inset-0 opacity-5"
              style={{ background:'radial-gradient(circle at 30% 50%, #FF5722, transparent 60%)' }} />
            <p className="text-4xl mb-4">🎉</p>
            <h2 className="font-display text-3xl font-bold text-ink mb-3">
              First order on us
            </h2>
            <p className="text-muted mb-6 text-sm">Use code <span className="font-bold" style={{ color:'#FF8A65' }}>FIRST50</span> to get ₹100 off your first order.</p>
            <Link to="/restaurants" className="btn-primary">
              Order Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 text-center text-xs text-muted">
        <p className="font-display text-sm font-bold text-ink mb-2">Snackd</p>
        <p>© 2025 Snackd Technologies Pvt Ltd · Made with ❤️ in Chennai</p>
      </footer>
    </div>
  );
}

export default Landing;
