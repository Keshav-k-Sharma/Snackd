import { Search, MapPin, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/restaurants');
  };

  const foods = ['','','','','','','','',''];

  return (
    <section className="relative overflow-hidden pt-16 pb-20 px-6">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{ background:'radial-gradient(circle, #FF5722, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] right-[-40px] w-[300px] h-[300px] rounded-full opacity-8 blur-3xl"
          style={{ background:'radial-gradient(circle, #FF8C00, transparent 70%)' }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Location pill */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card cursor-pointer
            hover:border-white/15 transition-all group">
            <MapPin size={14} style={{ color:'#FF5722' }} />
            <span className="text-sm text-muted">Delivering to</span>
            <span className="text-sm font-semibold text-ink">Anna Nagar, Chennai</span>
            <ChevronDown size={14} className="text-muted group-hover:text-ink transition-colors" />
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-10">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-ink leading-[1.05] mb-4">
            Cravings<br />
            <span style={{
              background:'linear-gradient(135deg,#FF5722,#FF8C00)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>
              Delivered.
            </span>
          </h1>
          <p className="text-muted text-lg max-w-md mx-auto leading-relaxed">
            Top restaurants, blazing-fast delivery, and deals you actually want.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch}
          className="flex gap-3 max-w-xl mx-auto mb-12">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="input-field pl-11 pr-4 h-14 text-sm"
              placeholder="Search restaurants, cuisines, dishes…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary h-14 px-6 shrink-0">
            Search
          </button>
        </form>

        {/* Floating food emojis */}
        <div className="flex justify-center gap-4 flex-wrap">
          {foods.map((emoji, i) => (
            <div key={i} className="text-2xl cursor-default select-none"
              style={{
                animation: `float ${4 + i * 0.3}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.7 + (i % 3) * 0.1,
              }}>
              {emoji}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
