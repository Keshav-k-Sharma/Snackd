import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Bike, Search, ChevronRight, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import FoodCard from '../components/FoodCard';
import { SkeletonFoodCard } from '../components/SkeletonLoader';
import { useCart } from '../context/CartContext';

function Menu() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState(null);
  const { totalItems, total, _conflict, clearConflict, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [showConflict, setShowConflict] = useState(false);
  const categoryRefs = useRef({});

  useEffect(() => {
    const fetchMenuAndRestaurant = async () => {
      try {
        setLoading(true);
        // Fetch Restaurant details
        const resResponse = await fetch(`http://localhost:8000/restaurants/`);
        const allRes = await resResponse.json();
        const found = allRes.find(r => r.RestaurantID.toString() === id);
        
        if (found) {
          setRestaurant({
            ...found,
            id: found.RestaurantID.toString(),
            cuisineLabel: 'Italian · Pizza',
            reviewCount: 1200,
            deliveryTime: `${found.PrepTimeMins} min`,
            coverGradient: 'from-orange-900 via-red-900 to-rose-900',
          });
        }

        // Fetch Menu Items
        const menuResponse = await fetch(`http://localhost:8000/restaurants/${id}/food-items/`);
        const data = await menuResponse.json();
        
        const groupedMenu = {
          categories: ["Bestsellers"],
          items: data.map(item => ({
            ...item,
            id: item.FoodID.toString(),
            restaurantId: id,
            category: "Bestsellers",
            image: item.ImageURL,
            price: item.DynamicPrice || item.BasePrice,
            veg: item.IsVeg,
            available: item.IsAvailable
          }))
        };
        setMenu(groupedMenu);
        if (groupedMenu) setActiveCategory(groupedMenu.categories[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    if (id) fetchMenuAndRestaurant();
  }, [id]);

  useEffect(() => {
    if (_conflict) { setShowConflict(true); clearConflict(); }
  }, [_conflict]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: '#080B12' }}>
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <SkeletonFoodCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant || !menu) {
    return (
      <div className="min-h-screen" style={{ background: '#080B12' }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center px-6">
          <p className="text-5xl mb-4">🍽</p>
          <h2 className="text-xl font-bold text-ink mb-2">Menu not available</h2>
          <p className="text-muted text-sm mb-6">This restaurant hasn't set up their menu yet.</p>
          <Link to="/restaurants" className="btn-primary">Browse Restaurants</Link>
        </div>
      </div>
    );
  }

  const scrollToCategory = (cat) => {
    setActiveCategory(cat);
    categoryRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filteredItems = (catItems) => catItems.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    const matchVeg = !vegOnly || item.veg;
    return matchSearch && matchVeg;
  });

  return (
    <div className="min-h-screen" style={{ background: '#080B12' }}>
      <Navbar />

      {/* Conflict modal */}
      {showConflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center">
            <p className="text-4xl mb-4">🛒</p>
            <h3 className="text-lg font-bold text-ink mb-2">Start a new cart?</h3>
            <p className="text-sm text-muted mb-6">
              Your cart has items from another restaurant. Clear it to add from <strong className="text-ink">{restaurant.name}</strong>.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConflict(false)} className="btn-ghost flex-1">Keep Cart</button>
              <button onClick={() => { clearCart(); setShowConflict(false); }} className="btn-primary flex-1">Clear & Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Restaurant hero */}
      <div className={`relative h-48 bg-gradient-to-br ${restaurant.coverGradient} overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl drop-shadow-2xl">
            {restaurant.cuisineLabel.includes('Pizza') ? '🍕'
              : restaurant.cuisineLabel.includes('Biryani') ? '🍛'
              : restaurant.cuisineLabel.includes('Burger') ? '🍔'
              : restaurant.cuisineLabel.includes('Sushi') ? '🍣'
              : '🍽'}
          </span>
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #080B12 0%, transparent 60%)' }} />
        <Link to="/restaurants"
          className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center text-white transition hover:bg-white/20"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
          <ArrowLeft size={18} />
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Info bar */}
        <div className="-mt-6 relative z-10 glass-card rounded-2xl p-5 mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">{restaurant.name}</h1>
            <p className="text-sm text-muted mt-0.5">{restaurant.cuisineLabel}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Star size={14} fill="#FFB800" stroke="none" />
              <span className="font-bold text-ink">{restaurant.rating}</span>
              <span className="text-muted">({restaurant.reviewCount.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted">
              <Clock size={13} /><span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted">
              <Bike size={13} />
              <span>{restaurant.deliveryFee === 0
                ? <span style={{ color: '#4ade80' }}>Free delivery</span>
                : `₹${restaurant.deliveryFee} delivery`}</span>
            </div>
          </div>
        </div>

        {/* Offer banner */}
        {restaurant.offer && (
          <div className="mb-6 px-5 py-3 rounded-2xl flex items-center gap-3"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <span className="text-lg">🎁</span>
            <span className="text-sm font-semibold" style={{ color: '#4ade80' }}>{restaurant.offer}</span>
          </div>
        )}

        {/* Search + Veg toggle */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input-field pl-9 h-11 text-sm" placeholder="Search in menu…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setVegOnly(v => !v)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${vegOnly ? '' : 'text-muted'}`}
            style={vegOnly
              ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }
              : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            🥗 Veg Only
          </button>
        </div>

        {/* Category nav */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 sticky top-16 z-20 py-3"
          style={{ background: 'rgba(8,11,18,0.95)', backdropFilter: 'blur(12px)' }}>
          {menu.categories.map(cat => (
            <button key={cat} onClick={() => scrollToCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeCategory === cat ? 'text-white' : 'text-muted hover:text-ink'}`}
              style={activeCategory === cat
                ? { background: 'linear-gradient(135deg,#FF5722,#FF8C00)' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Menu sections */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <SkeletonFoodCard key={i} />)}
          </div>
        ) : (
          <div className="space-y-10 pb-32">
            {menu.categories.map(cat => {
              const items = filteredItems(menu.items.filter(item => item.category === cat));
              if (items.length === 0) return null;
              return (
                <div key={cat} ref={el => categoryRefs.current[cat] = el}>
                  <h2 className="font-display text-lg font-bold text-ink mb-4 flex items-center gap-2">
                    {cat}
                    <span className="text-xs font-normal text-muted px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {items.length}
                    </span>
                  </h2>
                  <div className="space-y-3">
                    {items.map(item => (
                      <FoodCard key={item.id} item={item}
                        restaurantId={restaurant.id}
                        restaurantName={restaurant.name} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky cart bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-6">
          <Link to="/cart"
            className="flex items-center justify-between w-full px-6 py-4 rounded-2xl text-white font-semibold text-sm
              transition-all hover:scale-[1.02] active:scale-95"
            style={{ background: 'linear-gradient(135deg,#FF5722,#FF8C00)', boxShadow: '0 8px 32px rgba(255,87,34,0.5)' }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold">
                {totalItems}
              </div>
              <span>View Cart</span>
            </div>
            <div className="flex items-center gap-1">
              <span>₹{total}</span>
              <ChevronRight size={16} />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Menu;
