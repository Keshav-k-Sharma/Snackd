import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import RestaurantCard from '../components/RestaurantCard';
import SkeletonLoader from '../components/SkeletonLoader';
// Remove mock data imports since we use the database

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating',    label: 'Rating' },
  { value: 'delivery',  label: 'Delivery Time' },
  { value: 'price_asc', label: 'Price: Low to High' },
];

const RATING_FILTERS = ['4.5+', '4.0+', '3.5+'];

function Restaurants() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoriesList, setCategoriesList] = useState([{ id: 'all', label: 'All', emoji: '🌐' }]);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState('relevance');
  const [ratingFilter, setRatingFilter] = useState('');
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [vegsOnly, setVegsOnly] = useState(false);
  const [dbRestaurants, setDbRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurantsAndCategories = async () => {
      try {
        setLoading(true);
        // Fetch Categories first
        const catRes = await fetch('http://localhost:8000/categories/');
        const dbCats = await catRes.json();
        
        const mappedCats = [
          { id: 'all', label: 'All', emoji: '🌐' },
          ...dbCats.map(c => ({
            id: c.Name.toLowerCase(),
            label: c.Name,
            emoji: c.Icon || '🍕'
          }))
        ];
        setCategoriesList(mappedCats);
        // Fetch Restaurants
        const resResponse = await fetch('http://localhost:8000/restaurants/');
        const data = await resResponse.json();
        
        const mappedData = data.map(r => {
          const category = dbCats.find(c => c.CategoryID === r.CategoryID);
          const catId = category ? category.Name.toLowerCase() : 'all';
          
          return {
            ...r,
            id: r.RestaurantID.toString(),
            name: r.Name,
            rating: r.Rating,
            cuisine: [catId], 
            cuisineLabel: `${category ? category.Name : 'Food'}`,
            reviewCount: 1200,
            deliveryTime: `${r.PrepTimeMins} min`,
            deliveryFee: r.DeliveryFee,
            priceLevel: 2,
            tags: r.IsOpen ? ['Open Now'] : ['Closed'],
            promoted: r.Rating >= 4.5,
            isOpen: r.IsOpen,
            coverGradient: 'from-orange-900 via-red-900 to-rose-900',
          };
        });
        setDbRestaurants(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchRestaurantsAndCategories();
  }, []);

  const filtered = useMemo(() => {
    let list = [...dbRestaurants];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.cuisineLabel.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== 'all') {
      list = list.filter(r => r.cuisine.includes(activeCategory));
    }
    if (ratingFilter) {
      const min = parseFloat(ratingFilter);
      list = list.filter(r => r.rating >= min);
    }
    if (freeDelivery) {
      list = list.filter(r => r.deliveryFee === 0);
    }
    if (vegsOnly) {
      list = list.filter(r => r.tags.includes('Pure Veg'));
    }

    list.sort((a, b) => {
      if (sort === 'rating')    return b.rating - a.rating;
      if (sort === 'delivery')  return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
      if (sort === 'price_asc') return a.priceLevel - b.priceLevel;
      // relevance: promoted first, then rating
      if (a.promoted !== b.promoted) return b.promoted - a.promoted;
      return b.rating - a.rating;
    });

    return list;
  }, [search, activeCategory, sort, ratingFilter, freeDelivery, vegsOnly]);

  const clearFilters = () => {
    setSearch('');
    setActiveCategory('all');
    setSort('relevance');
    setRatingFilter('');
    setFreeDelivery(false);
    setVegsOnly(false);
  };

  const hasFilters = search || activeCategory !== 'all' || ratingFilter || freeDelivery || vegsOnly;

  return (
    <div className="min-h-screen" style={{ background:'#080B12' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-ink mb-1">Restaurants</h1>
          <p className="text-muted text-sm">
            {loading ? 'Finding the best spots…' : `${filtered.length} restaurant${filtered.length !== 1 ? 's' : ''} near you`}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input-field pl-11 pr-10 h-12 text-sm w-full max-w-md"
            placeholder="Search restaurants or cuisines…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categoriesList.map(cat => (
            <button key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                transition-all duration-200 ${activeCategory === cat.id
                  ? 'text-white'
                  : 'text-muted hover:text-ink'}`}
              style={activeCategory === cat.id
                ? { background:'linear-gradient(135deg,#FF5722,#FF8C00)', boxShadow:'0 2px 12px rgba(255,87,34,0.3)' }
                : { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Filters + Sort row */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2 text-xs text-muted">
            <SlidersHorizontal size={13} />
            <span className="font-semibold">Filters:</span>
          </div>

          {/* Sort */}
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl text-muted outline-none cursor-pointer transition hover:text-ink"
            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Rating filter */}
          {RATING_FILTERS.map(r => (
            <button key={r} onClick={() => setRatingFilter(ratingFilter === r ? '' : r)}
              className={`text-xs px-3 py-2 rounded-xl font-medium transition-all duration-200
                ${ratingFilter === r ? 'text-yellow-300' : 'text-muted hover:text-ink'}`}
              style={ratingFilter === r
                ? { background:'rgba(255,184,0,0.15)', border:'1px solid rgba(255,184,0,0.25)' }
                : { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
              ⭐ {r}
            </button>
          ))}

          <button onClick={() => setFreeDelivery(f => !f)}
            className={`text-xs px-3 py-2 rounded-xl font-medium transition-all duration-200
              ${freeDelivery ? 'text-green-400' : 'text-muted hover:text-ink'}`}
            style={freeDelivery
              ? { background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.2)' }
              : { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
            🚚 Free Delivery
          </button>

          <button onClick={() => setVegsOnly(v => !v)}
            className={`text-xs px-3 py-2 rounded-xl font-medium transition-all duration-200
              ${vegsOnly ? 'text-green-400' : 'text-muted hover:text-ink'}`}
            style={vegsOnly
              ? { background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.2)' }
              : { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
            🥗 Pure Veg
          </button>

          {hasFilters && (
            <button onClick={clearFilters}
              className="text-xs px-3 py-2 rounded-xl font-medium text-muted hover:text-ink transition-all"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <X size={11} className="inline mr-1" />Clear
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <SkeletonLoader type="card" count={6} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-lg font-semibold text-ink mb-2">No results found</h3>
            <p className="text-sm text-muted mb-6">Try a different search or clear your filters.</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default Restaurants;
