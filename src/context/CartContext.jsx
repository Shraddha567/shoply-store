import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const readItems = () => {
  try {
    return JSON.parse(localStorage.getItem("cart_items") || "[]");
  } catch {
    return [];
  }
};

const readWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem("wishlist_items") || "[]");
  } catch {
    return [];
  }
};

const readOrders = () => {
  try {
    return JSON.parse(localStorage.getItem("orders") || "[]");
  } catch {
    return [];
  }
};

function calcTotals(items) {
  const totalQty = items.reduce((s, it) => s + it.quantity, 0);
  const totalPrice = items.reduce((s, it) => s + it.quantity * it.price, 0);
  return { totalQty, totalPrice };
}

const initialState = {
  items: readItems(),
  wishlist: readWishlist(),
  orders: readOrders(),
  totalQty: 0,
  totalPrice: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const payload = action.payload;
      const existing = state.items.find((i) => i.id === payload.id);
      let items;
      if (existing) {
        items = state.items.map((i) =>
          i.id === payload.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        items = [...state.items, { ...payload, quantity: 1 }];
      }
      const totals = calcTotals(items);
      return { ...state, items, ...totals };
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter((i) => i.id !== action.payload);
      const totals = calcTotals(items);
      return { ...state, items, ...totals };
    }
    case "SET_QTY": {
      const { id, qty } = action.payload;
      let items = state.items
        .map((i) => (i.id === id ? { ...i, quantity: qty } : i))
        .filter((i) => i.quantity > 0);
      const totals = calcTotals(items);
      return { ...state, items, ...totals };
    }
    case "CLEAR_CART":
      return { ...state, items: [], totalQty: 0, totalPrice: 0 };
    case "RECALC":
      // used to recalc totals from persisted items
      return { ...state, ...calcTotals(state.items) };
    case "TOGGLE_WISHLIST": {
      const product = action.payload;
      const exists = state.wishlist.some((item) => item.id === product.id);
      const wishlist = exists
        ? state.wishlist.filter((item) => item.id !== product.id)
        : [...state.wishlist, product];
      return { ...state, wishlist };
    }
    case "ADD_ORDER": {
      const orders = [action.payload, ...state.orders];
      return { ...state, orders };
    }
    case "CANCEL_ORDER": {
      const orders = state.orders.map((order) =>
        order.id === action.payload ? { ...order, status: "Cancelled" } : order
      );
      return { ...state, orders };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // recalc totals on mount (in case persisted items exist)
  useEffect(() => {
    dispatch({ type: "RECALC" });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart_items", JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  useEffect(() => {
    try {
      localStorage.setItem("wishlist_items", JSON.stringify(state.wishlist));
    } catch {}
  }, [state.wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem("orders", JSON.stringify(state.orders));
    } catch {}
  }, [state.orders]);

  const addToCart = (item) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeFromCart = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const setQuantity = (id, qty) =>
    dispatch({ type: "SET_QTY", payload: { id, qty } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const toggleWishlist = (item) =>
    dispatch({ type: "TOGGLE_WISHLIST", payload: item });
  const addOrder = (order) => dispatch({ type: "ADD_ORDER", payload: order });
  const cancelOrder = (orderId) =>
    dispatch({ type: "CANCEL_ORDER", payload: orderId });

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        setQuantity,
        clearCart,
        toggleWishlist,
        addOrder,
        cancelOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  return useContext(CartContext);
};
