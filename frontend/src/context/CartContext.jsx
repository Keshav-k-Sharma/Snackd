import { createContext, useContext, useReducer, useCallback } from 'react';
import { promoCodes } from '../data/mockData';

const CartContext = createContext(null);

const initialState = {
  items: [],
  restaurantId: null,
  restaurantName: '',
  promoCode: '',
  promoDiscount: 0,
  promoError: '',
  _conflict: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item, restaurantId, restaurantName } = action.payload;
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return { ...state, _conflict: true };
      }
      const exists = state.items.find(i => i.item.id === item.id);
      return {
        ...state,
        _conflict: false,
        restaurantId,
        restaurantName,
        items: exists
          ? state.items.map(i => i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i)
          : [...state.items, { item, qty: 1 }],
      };
    }
    case 'REMOVE_ITEM': {
      const updated = state.items.filter(i => i.item.id !== action.payload);
      return {
        ...state,
        items: updated,
        ...(updated.length === 0 ? { restaurantId: null, restaurantName: '', promoCode: '', promoDiscount: 0 } : {}),
      };
    }
    case 'UPDATE_QTY': {
      const { id, qty } = action.payload;
      if (qty < 1) {
        const updated = state.items.filter(i => i.item.id !== id);
        return {
          ...state,
          items: updated,
          ...(updated.length === 0 ? { restaurantId: null, restaurantName: '', promoCode: '', promoDiscount: 0 } : {}),
        };
      }
      return { ...state, items: state.items.map(i => i.item.id === id ? { ...i, qty } : i) };
    }
    case 'CLEAR_CART':
      return { ...initialState };
    case 'APPLY_PROMO': {
      const code = action.payload.toUpperCase();
      const promo = promoCodes[code];
      if (!promo) return { ...state, promoError: 'Invalid promo code', promoCode: '', promoDiscount: 0 };
      const subtotal = state.items.reduce((s, i) => s + i.item.price * i.qty, 0);
      const discount = promo.type === 'flat'
        ? promo.discount
        : Math.min(Math.round(subtotal * promo.discount / 100), 80);
      return { ...state, promoCode: code, promoDiscount: discount, promoError: '' };
    }
    case 'REMOVE_PROMO':
      return { ...state, promoCode: '', promoDiscount: 0, promoError: '' };
    case 'CLEAR_CONFLICT':
      return { ...state, _conflict: false };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem     = useCallback((item, restaurantId, restaurantName) =>
    dispatch({ type: 'ADD_ITEM', payload: { item, restaurantId, restaurantName } }), []);
  const removeItem  = useCallback(id => dispatch({ type: 'REMOVE_ITEM', payload: id }), []);
  const updateQty   = useCallback((id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } }), []);
  const clearCart   = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const applyPromo  = useCallback(code => dispatch({ type: 'APPLY_PROMO', payload: code }), []);
  const removePromo = useCallback(() => dispatch({ type: 'REMOVE_PROMO' }), []);
  const clearConflict = useCallback(() => dispatch({ type: 'CLEAR_CONFLICT' }), []);
  const getQty      = useCallback(id => state.items.find(i => i.item.id === id)?.qty ?? 0, [state.items]);

  const subtotal   = state.items.reduce((s, i) => s + i.item.price * i.qty, 0);
  const deliveryFee = subtotal === 0 ? 0 : 29;
  const taxes      = Math.round(subtotal * 0.05);
  const total      = Math.max(0, subtotal + deliveryFee + taxes - state.promoDiscount);
  const totalItems = state.items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{
      ...state, addItem, removeItem, updateQty, clearCart,
      applyPromo, removePromo, clearConflict, getQty,
      subtotal, deliveryFee, taxes, total, totalItems,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
