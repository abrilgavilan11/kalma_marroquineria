import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Inicializamos el estado del carrito leyendo desde localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('kalma_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Estado para controlar la visibilidad del sidebar del carrito
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sincronizar siempre con localStorage
  useEffect(() => {
    localStorage.setItem('kalma_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, color, size) => {
    setCart(prev => {
      // Verificamos si ya existe EXACTAMENTE el mismo producto con la misma variante
      const existingItemIndex = prev.findIndex(
        item => item.product._id === product._id && item.color === color && item.size === size
      );

      if (existingItemIndex >= 0) {
        // Incrementamos su cantidad
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      } else {
        // Agregamos como nuevo ítem
        return [...prev, { product, color, size, quantity: 1 }];
      }
    });
    toast.success('Producto agregado a tu bolsa');
    setIsCartOpen(true); // Abrimos el sidebar automáticamente al agregar
  };

  const removeFromCart = (productId, color, size) => {
    setCart(prev => prev.filter(
      item => !(item.product._id === productId && item.color === color && item.size === size)
    ));
    toast.success('Producto removido');
  };

  const updateQuantity = (productId, color, size, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product._id === productId && item.color === color && item.size === size) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Derivados
  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, 
      cartTotal, cartCount, 
      isCartOpen, setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};
