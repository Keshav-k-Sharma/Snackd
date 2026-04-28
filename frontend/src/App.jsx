import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Landing       from './pages/Landing';
import Restaurants   from './pages/Restaurants';
import Menu          from './pages/Menu';
import Cart          from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import Profile       from './pages/Profile';
import Reviews       from './pages/Reviews';

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen" style={{ background: '#080B12' }}>
        <Routes>
          <Route path="/"           element={<Landing />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/menu/:id"   element={<Menu />} />
          <Route path="/cart"       element={<Cart />} />
          <Route path="/orders"     element={<OrderTracking />} />
          <Route path="/profile"    element={<Profile />} />
          <Route path="/reviews"    element={<Reviews />} />
          <Route path="*"           element={<Landing />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
