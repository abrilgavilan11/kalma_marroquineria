import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const formattedTotal = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(cartTotal);

  return (
    <>
      {/* Overlay Oscuro */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-brand-900/30 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white/80 backdrop-blur-2xl shadow-2xl z-[70] transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] border-l border-white/50 flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-brand-200/50 flex justify-between items-center bg-white/40">
          <h2 className="font-serif text-2xl font-bold text-brand-900 flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-brand-600" />
            Tu Bolsa
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 bg-white/50 hover:bg-white rounded-full shadow-sm transition-all text-brand-600 hover:text-brand-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-brand-400">
              <ShoppingBag className="w-20 h-20 mb-6 opacity-30 stroke-[1]" />
              <p className="text-xl font-serif text-brand-700 text-center">Tu bolsa está vacía.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-6 text-brand-800 font-semibold tracking-widest text-sm uppercase hover:text-brand-500 transition-colors"
              >
                Continuar explorando
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex gap-5 bg-white/70 p-4 rounded-3xl border border-white/60 shadow-sm relative group transition-all hover:shadow-md">
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.name} 
                  className="w-24 h-28 object-cover rounded-2xl bg-brand-50"
                />
                <button 
                  onClick={() => removeFromCart(item.product._id, item.color, item.size)}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-md text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity border border-gray-100"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <h4 className="font-bold text-brand-900 leading-tight pr-4">{item.product.name}</h4>
                    <p className="text-xs font-semibold text-brand-500 mt-1 uppercase tracking-wider">
                      {item.color} {item.size !== 'Único' && `| ${item.size}`}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-1 bg-white border border-brand-200/50 rounded-full px-1 py-1 shadow-sm">
                      <button 
                        onClick={() => updateQuantity(item.product._id, item.color, item.size, item.quantity - 1)}
                        className="text-brand-400 hover:text-brand-900 transition-colors p-1"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-brand-900 w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product._id, item.color, item.size, item.quantity + 1)}
                        className="text-brand-400 hover:text-brand-900 transition-colors p-1"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-brand-900">
                      {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-8 border-t border-brand-200/50 bg-white/60 backdrop-blur-md">
            <div className="flex justify-between items-end mb-6">
              <span className="text-sm font-semibold tracking-widest uppercase text-brand-600">Subtotal</span>
              <span className="text-3xl font-serif font-bold text-brand-900">{formattedTotal}</span>
            </div>
            <button 
              onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
              className="w-full py-4 rounded-full font-bold tracking-widest uppercase text-sm text-white bg-brand-900 hover:bg-brand-800 transition-all transform hover:-translate-y-1 shadow-lg shadow-brand-900/20"
            >
              Proceder al pago
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
