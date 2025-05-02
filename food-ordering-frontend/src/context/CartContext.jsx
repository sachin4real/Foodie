// CartContext.js
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id && i.restaurantName === item.restaurantName);
      let updatedCart;

      if (existing) {
        updatedCart = prev.map(i =>
          i.id === item.id && i.restaurantName === item.restaurantName
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        updatedCart = [...prev, { ...item, quantity: 1 }];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (id, restaurantName) => {
    setCartItems(prev => {
      const updated = prev.filter(i => !(i.id === id && i.restaurantName === restaurantName));
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const increaseQty = (id, restaurantName) => {
    setCartItems(prev => {
      const updated = prev.map(i =>
        i.id === id && i.restaurantName === restaurantName
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const decreaseQty = (id, restaurantName) => {
    setCartItems(prev => {
      const updated = prev.map(i =>
        i.id === id && i.restaurantName === restaurantName && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        toggleCart,
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
