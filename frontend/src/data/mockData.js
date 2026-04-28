// ═══════════════════════════════════════════════
//  MOCK DATA  —  replace with real API responses
//  Base API URL: http://localhost:5000/api
// ═══════════════════════════════════════════════

export const API_BASE = 'http://localhost:5000/api';

// ── Current User ────────────────────────────────
export const mockUser = {
  id: 'u-001',
  name: 'Arjun Mehta',
  email: 'arjun@snackd.app',
  phone: '+91 98765 43210',
  avatar: null, // null → initials fallback
  loyaltyPoints: 2840,
  loyaltyTier: 'Gold',   // Silver | Gold | Platinum
  joinedAt: '2023-06-01',
  addresses: [
    { id: 'a1', label: 'Home', address: '14/B, Anna Nagar West, Chennai 600040', default: true },
    { id: 'a2', label: 'Work', address: '3rd Floor, Tidel Park, OMR, Chennai 600096', default: false },
  ],
};

// ── Cuisine Categories ───────────────────────────
export const categories = [
  { id: 'all',    label: 'All',        emoji: '🌐' },
  { id: 'pizza',  label: 'Pizza',      emoji: '🍕' },
  { id: 'burger', label: 'Burgers',    emoji: '🍔' },
  { id: 'sushi',  label: 'Sushi',      emoji: '🍣' },
  { id: 'biryani',label: 'Biryani',    emoji: '🍛' },
  { id: 'pasta',  label: 'Pasta',      emoji: '🍝' },
  { id: 'salad',  label: 'Salads',     emoji: '🥗' },
  { id: 'dessert',label: 'Desserts',   emoji: '🍰' },
  { id: 'drinks', label: 'Drinks',     emoji: '🧋' },
];

// ── Restaurants ──────────────────────────────────
export const restaurants = [
  {
    id: 'r-001',
    name: "The Ember Kitchen",
    cuisine: ['pizza', 'pasta'],
    cuisineLabel: 'Italian · Pizza · Pasta',
    rating: 4.8,
    reviewCount: 2341,
    deliveryTime: '25-35 min',
    deliveryFee: 29,
    minOrder: 199,
    priceLevel: 2,           // 1–3 (₹ ₹₹ ₹₹₹)
    tags: ['Bestseller', 'Pure Veg'],
    promoted: true,
    offer: '50% off up to ₹100',
    coverGradient: 'from-orange-900 via-red-900 to-rose-900',
    accentColor: '#FF5722',
    isOpen: true,
  },
  {
    id: 'r-002',
    name: "SushiCraft Studio",
    cuisine: ['sushi'],
    cuisineLabel: 'Japanese · Sushi · Ramen',
    rating: 4.6,
    reviewCount: 1102,
    deliveryTime: '35-45 min',
    deliveryFee: 49,
    minOrder: 499,
    priceLevel: 3,
    tags: ['Premium'],
    promoted: false,
    offer: 'Free delivery above ₹600',
    coverGradient: 'from-blue-900 via-indigo-900 to-violet-900',
    accentColor: '#6366F1',
    isOpen: true,
  },
  {
    id: 'r-003',
    name: "Biryani Brotherhood",
    cuisine: ['biryani'],
    cuisineLabel: 'North Indian · Biryani · Kebabs',
    rating: 4.7,
    reviewCount: 3890,
    deliveryTime: '30-40 min',
    deliveryFee: 0,
    minOrder: 299,
    priceLevel: 2,
    tags: ['Top Rated', 'Free Delivery'],
    promoted: true,
    offer: 'Free delivery today',
    coverGradient: 'from-amber-900 via-yellow-900 to-orange-900',
    accentColor: '#F59E0B',
    isOpen: true,
  },
  {
    id: 'r-004',
    name: "Burger Republic",
    cuisine: ['burger'],
    cuisineLabel: 'American · Burgers · Fries',
    rating: 4.4,
    reviewCount: 876,
    deliveryTime: '20-30 min',
    deliveryFee: 19,
    minOrder: 149,
    priceLevel: 1,
    tags: ['Fast Delivery'],
    promoted: false,
    offer: 'Buy 2 get 1 free',
    coverGradient: 'from-lime-900 via-green-900 to-emerald-900',
    accentColor: '#22C55E',
    isOpen: true,
  },
  {
    id: 'r-005',
    name: "Sakura Garden",
    cuisine: ['salad', 'sushi'],
    cuisineLabel: 'Japanese · Vegan · Healthy',
    rating: 4.5,
    reviewCount: 654,
    deliveryTime: '30-40 min',
    deliveryFee: 39,
    minOrder: 399,
    priceLevel: 3,
    tags: ['Healthy', 'Vegan'],
    promoted: false,
    offer: null,
    coverGradient: 'from-pink-900 via-rose-900 to-fuchsia-900',
    accentColor: '#EC4899',
    isOpen: false,
  },
  {
    id: 'r-006',
    name: "Choco Noir Patisserie",
    cuisine: ['dessert', 'drinks'],
    cuisineLabel: 'Desserts · Coffee · Bakery',
    rating: 4.9,
    reviewCount: 512,
    deliveryTime: '20-25 min',
    deliveryFee: 29,
    minOrder: 249,
    priceLevel: 2,
    tags: ['Fan Favourite'],
    promoted: false,
    offer: '₹50 off on first order',
    coverGradient: 'from-stone-900 via-neutral-900 to-zinc-900',
    accentColor: '#A78BFA',
    isOpen: true,
  },
];

// ── Menu Items (keyed by restaurant ID) ─────────
export const menuByRestaurant = {
  'r-001': {
    categories: ['Bestsellers', 'Pizzas', 'Pastas', 'Sides', 'Drinks'],
    items: [
      { id: 'f-001', category: 'Bestsellers', name: 'Truffle Mushroom Pizza', desc: 'Wild mushrooms, black truffle oil, fontina cheese, fresh thyme on a thin sourdough base.', price: 449, basePrice: 399, veg: true,  spicy: false, rating: 4.9, image: '🍕', popular: true,  available: true },
      { id: 'f-002', category: 'Bestsellers', name: 'Cacio e Pepe Pasta',    desc: 'Roman classic — pecorino romano, black pepper, spaghetti. Simple. Perfect.',              price: 349, basePrice: 299, veg: true,  spicy: false, rating: 4.8, image: '🍝', popular: true,  available: true },
      { id: 'f-003', category: 'Pizzas',      name: 'Margherita Classica',   desc: 'San Marzano tomatoes, fresh mozzarella, basil, EVOO.',                                      price: 329, basePrice: 299, veg: true,  spicy: false, rating: 4.7, image: '🍕', popular: false, available: true },
      { id: 'f-004', category: 'Pizzas',      name: 'Spicy Arrabbiata',      desc: 'Calabrian chilli, crushed tomatoes, garlic, olives, capers.',                               price: 399, basePrice: 369, veg: true,  spicy: true,  rating: 4.6, image: '🍕', popular: false, available: true },
      { id: 'f-005', category: 'Pizzas',      name: 'BBQ Chicken Supreme',   desc: 'Smoky BBQ base, grilled chicken, caramelised onions, jalapeños, cheddar.',                  price: 489, basePrice: 449, veg: false, spicy: true,  rating: 4.8, image: '🍕', popular: true,  available: true },
      { id: 'f-006', category: 'Pastas',      name: 'Burrata Pesto Rigatoni',desc: 'House-made basil pesto, rigatoni, burrata, sun-dried tomatoes, pine nuts.',                 price: 389, basePrice: 349, veg: true,  spicy: false, rating: 4.7, image: '🍝', popular: false, available: true },
      { id: 'f-007', category: 'Sides',       name: 'Garlic Focaccia',        desc: 'Wood-fired, rosemary, sea salt, roasted garlic.',                                          price: 149, basePrice: 129, veg: true,  spicy: false, rating: 4.8, image: '🍞', popular: false, available: true },
      { id: 'f-008', category: 'Drinks',      name: 'Limonata',              desc: 'Pressed lemon, soda, basil, a pinch of pink salt.',                                         price:  99, basePrice:  89, veg: true,  spicy: false, rating: 4.5, image: '🍋', popular: false, available: true },
    ],
  },
  'r-003': {
    categories: ['Chef\'s Special', 'Biryani', 'Kebabs', 'Breads', 'Desserts'],
    items: [
      { id: 'f-101', category: "Chef's Special", name: 'Dum Gosht Biryani',    desc: 'Slow-cooked mutton on the bone, aged basmati, saffron-milk crust, caramelised onion.',  price: 549, basePrice: 499, veg: false, spicy: true,  rating: 4.9, image: '🍛', popular: true,  available: true },
      { id: 'f-102', category: 'Biryani',         name: 'Veg Handi Biryani',    desc: 'Seasonal vegetables, kewra water, mint, whole spices, aged basmati.',                   price: 349, basePrice: 299, veg: true,  spicy: false, rating: 4.6, image: '🍛', popular: false, available: true },
      { id: 'f-103', category: 'Biryani',         name: 'Chicken Lucknowi',     desc: 'Awadhi-style, rose water, potli masala, tender chicken, golden fried onions.',           price: 449, basePrice: 399, veg: false, spicy: false, rating: 4.8, image: '🍛', popular: true,  available: true },
      { id: 'f-104', category: 'Kebabs',           name: 'Galouti Seekh Platter','desc': '6 pcs melt-in-mouth kebabs, mint chutney, pickled onion, roomali roti.',             price: 399, basePrice: 369, veg: false, spicy: true,  rating: 4.7, image: '🍢', popular: false, available: true },
    ],
  },
};

// ── Active Orders ────────────────────────────────
export const mockOrders = [
  {
    id: 'ORD-2847',
    restaurantId: 'r-001',
    restaurantName: 'The Ember Kitchen',
    items: [
      { name: 'Truffle Mushroom Pizza', qty: 1, price: 449 },
      { name: 'Garlic Focaccia',         qty: 2, price: 149 },
    ],
    subtotal: 747,
    deliveryFee: 29,
    taxes: 68,
    discount: 100,
    total: 744,
    promoApplied: 'FIRST50',
    paymentMethod: 'UPI',
    placedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(), // 18 min ago
    estimatedDelivery: new Date(Date.now() + 12 * 60 * 1000).toISOString(), // 12 min from now
    status: 'out_for_delivery', // placed | confirmed | preparing | out_for_delivery | delivered
    statusHistory: [
      { status: 'placed',           label: 'Order Placed',         time: '7:42 PM', done: true  },
      { status: 'confirmed',        label: 'Restaurant Confirmed', time: '7:43 PM', done: true  },
      { status: 'preparing',        label: 'Preparing Your Food',  time: '7:48 PM', done: true  },
      { status: 'out_for_delivery', label: 'Out for Delivery',     time: '8:04 PM', done: true  },
      { status: 'delivered',        label: 'Delivered',            time: null,       done: false },
    ],
    driver: {
      id: 'd-01',
      name: 'Ravi Kumar',
      phone: '+91 98001 23456',
      rating: 4.8,
      totalDeliveries: 2340,
      vehicle: 'Activa 6G · TN09 AB 2341',
    },
    driverLocation: { lat: 13.0625, lng: 80.2505 }, // simulated
  },
];

// ── Order History ────────────────────────────────
export const orderHistory = [
  {
    id: 'ORD-2831',
    restaurantName: 'Biryani Brotherhood',
    date: '23 Apr 2025',
    total: 548,
    status: 'delivered',
    items: ['Dum Gosht Biryani', 'Garlic Naan ×2'],
    pointsEarned: 54,
  },
  {
    id: 'ORD-2799',
    restaurantName: 'Burger Republic',
    date: '19 Apr 2025',
    total: 329,
    status: 'delivered',
    items: ['Double Smash Burger', 'Loaded Fries', 'Coke'],
    pointsEarned: 32,
  },
  {
    id: 'ORD-2756',
    restaurantName: 'The Ember Kitchen',
    date: '14 Apr 2025',
    total: 899,
    status: 'delivered',
    items: ['BBQ Chicken Supreme', 'Cacio e Pepe Pasta', 'Limonata ×2'],
    pointsEarned: 89,
  },
];

// ── Reviews ──────────────────────────────────────
export const mockReviews = [
  {
    id: 'rev-001',
    restaurantId: 'r-001',
    restaurantName: 'The Ember Kitchen',
    user: { name: 'Priya S.', avatar: null },
    rating: 5,
    date: '24 Apr 2025',
    title: 'Absolutely divine!',
    body: 'The truffle mushroom pizza is unlike anything I\'ve had in Chennai. Thin crust, perfect char, generous truffle oil. Delivery was 8 minutes early and everything was piping hot.',
    images: [],
    helpful: 34,
    orderedItems: ['Truffle Mushroom Pizza', 'Garlic Focaccia'],
    verified: true,
  },
  {
    id: 'rev-002',
    restaurantId: 'r-001',
    restaurantName: 'The Ember Kitchen',
    user: { name: 'Karthik M.', avatar: null },
    rating: 4,
    date: '21 Apr 2025',
    title: 'Great pasta, slightly late delivery',
    body: 'Cacio e Pepe was 10/10 — creamy without being heavy. Knocked one star because delivery came 20 minutes late. But the food quality makes up for it.',
    images: [],
    helpful: 18,
    orderedItems: ['Cacio e Pepe Pasta'],
    verified: true,
  },
  {
    id: 'rev-003',
    restaurantId: 'r-003',
    restaurantName: 'Biryani Brotherhood',
    user: { name: 'Meena R.', avatar: null },
    rating: 5,
    date: '22 Apr 2025',
    title: 'Best biryani in South Chennai, no contest',
    body: 'Dum Gosht Biryani — every grain of rice was infused with flavour. The meat just fell off the bone. Have ordered 6 times in the last month.',
    images: [],
    helpful: 67,
    orderedItems: ['Dum Gosht Biryani', 'Galouti Seekh Platter'],
    verified: true,
  },
];

// ── Promos / Coupons ─────────────────────────────
export const promoCodes = {
  FIRST50: { discount: 100, type: 'flat', description: '₹100 off on first order' },
  EMBER20: { discount: 20,  type: 'percent', description: '20% off up to ₹80' },
  RUSH49:  { discount: 49,  type: 'flat', description: 'Free delivery (₹49 off)' },
};