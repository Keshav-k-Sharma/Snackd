import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, UtensilsCrossed, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

function Navbar() {
  const { totalItems } = useCart();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/',            label: 'Home' },
    { to: '/restaurants', label: 'Restaurants' },
    { to: '/orders',      label: 'Track Order' },
    { to: '/reviews',     label: 'Reviews' },
    { to: '/profile',     label: 'Profile' },
  ];

  const isActive = (to) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-white/5"
      style={{ backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)' }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background:'linear-gradient(135deg,#FF5722,#FF8C00)' }}>
            <UtensilsCrossed size={15} className="text-white" />
          </div>
          <span className="font-display text-lg font-bold text-ink tracking-tight">
            Snack<span style={{color:'#FF5722'}}>d</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive(to) ? 'text-ink' : 'text-muted hover:text-ink hover:bg-white/5'}`}
              style={isActive(to) ? { background:'rgba(255,255,255,0.07)', color:'#F1F5FC' } : {}}>
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
              ${isActive('/cart') ? '' : 'bg-white/5 hover:bg-white/10'}`}
              style={isActive('/cart') ? { background:'rgba(255,87,34,0.15)' } : {}}>
              <ShoppingBag size={18} style={{ color: isActive('/cart') ? '#FF8A65' : '#64748B' }} />
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold
                flex items-center justify-center text-white"
                style={{ background:'linear-gradient(135deg,#FF5722,#FF8C00)' }}>
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          <Link to="/profile">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
              bg-white/5 hover:bg-white/10 transition-all duration-200"
              style={{ color:'#FF8A65' }}>
              AM
            </div>
          </Link>

          <button className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-muted"
            onClick={() => setOpen(o => !o)}>
            {open ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 px-6 py-4 flex flex-col gap-1">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive(to) ? 'text-ink' : 'text-muted'}`}
              style={isActive(to) ? { background:'rgba(255,255,255,0.07)' } : {}}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
