import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCartItems = localStorage.getItem('cartItems');
      const parsedItems = storedCartItems ? JSON.parse(storedCartItems) : [];
      
      return parsedItems.map(item => ({
        ...item,
        precio: typeof item.precio === 'string' ? parseFloat(item.precio) : item.precio
      }));
    } catch (error) {
      console.error("Error al cargar el carrito de localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage:", error);
    }
  }, [cartItems]);

  const addToCart = useCallback((product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.idProducto === product.idProducto);
      const priceAsNumber = typeof product.precio === 'string' ? parseFloat(product.precio) : product.precio;

      if (existingItem) {
        return prevItems.map((item) =>
          item.idProducto === product.idProducto ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1, precio: priceAsNumber }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.idProducto === productId);

      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map((item) =>
          item.idProducto === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prevItems.filter((item) => item.idProducto !== productId);
      }
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const removeItemCompletely = useCallback((productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.idProducto !== productId));
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartTotal = cartItems.reduce((acc, item) => {
    const itemPrice = typeof item.precio === 'number' ? item.precio : 0;
    return acc + (itemPrice * item.quantity);
  }, 0);

  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    removeItemCompletely,
    cartTotal,
    cartCount,
  };

  return (
    <CarritoContext.Provider value={contextValue}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (context === undefined) {
    throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
  }
  return context;
};