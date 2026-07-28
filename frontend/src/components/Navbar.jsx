import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ChatContext } from '../context/ChatContext';
import { ShoppingBag, User as UserIcon, LogOut, Settings, Menu, X, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount, setIsCartOpen } = useContext(CartContext);
  const { unreadCount, setIsChatOpen } = useContext(ChatContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleScrollTo = (id) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="w-full relative z-40 glass-panel border-b-0 py-4 px-6 md:px-8 flex justify-between items-center sticky top-0 bg-white/40 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-brand-900 p-2 -ml-2 hover:bg-brand-100 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="text-2xl md:text-3xl font-serif font-bold text-brand-800 tracking-wider">KALMA</Link>
        </div>
        
        <div className="hidden md:flex space-x-10 text-sm font-medium tracking-widest items-center">
          <Link to="/" onClick={() => handleScrollTo('catalogo')} className="text-brand-900 hover:text-brand-500 transition-colors uppercase">Colección</Link>
          <Link to="/nosotros" className="text-brand-900 hover:text-brand-500 transition-colors uppercase">Nosotros</Link>
          <Link to="/faq" className="text-brand-900 hover:text-brand-500 transition-colors uppercase">FAQ</Link>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-2 text-accent hover:text-brand-900 transition-colors bg-white/50 px-4 py-2 rounded-full border border-white/60 shadow-sm font-semibold text-xs tracking-widest uppercase">
                    <Settings className="w-4 h-4" /> Admin
                  </Link>
                )}
                <button onClick={logout} className="text-brand-700 hover:text-red-500 transition-colors bg-white/50 p-2 rounded-full border border-white/60 shadow-sm" title="Cerrar sesión">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link to="/login" className="text-brand-700 hover:text-brand-900 transition-colors bg-white/50 p-2 rounded-full border border-white/60 shadow-sm" title="Iniciar sesión">
                <UserIcon className="w-5 h-5" />
              </Link>
            )}
          </div>
          
          {user && user.role === 'cliente' && (
            <button onClick={() => setIsChatOpen(prev => !prev)} className="relative text-brand-900 hover:text-brand-500 transition-colors">
              <MessageSquare className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative text-brand-900 hover:text-brand-600 transition-colors bg-white/80 p-2.5 md:p-3 rounded-full shadow-md hover:shadow-lg border border-white"
          >
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-800 text-white text-[9px] md:text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <div 
        className={`fixed inset-0 bg-brand-900/40 backdrop-blur-md z-[100] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div 
        className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-brand-50 z-[110] shadow-2xl transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 border-b border-brand-200 flex justify-between items-center bg-white/50">
          <Link to="/" className="text-2xl font-serif font-bold text-brand-900 tracking-wider">KALMA</Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-brand-600 hover:text-brand-900 bg-white rounded-full shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-white border-b border-brand-200">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xl uppercase shadow-inner">
                {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-brand-900 font-bold truncate">{user.name || 'Usuario'}</p>
                <p className="text-brand-500 text-xs truncate">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="flex-1 bg-brand-900 text-white py-3 rounded-full text-center text-xs font-bold tracking-widest uppercase shadow-md">Ingresar</Link>
              <Link to="/register" className="flex-1 bg-white text-brand-900 border border-brand-200 py-3 rounded-full text-center text-xs font-bold tracking-widest uppercase shadow-sm">Registro</Link>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <Link to="/" onClick={() => handleScrollTo('catalogo')} className="text-brand-800 font-bold tracking-widest uppercase p-4 hover:bg-brand-100/50 rounded-xl transition-colors">Colección</Link>
          <Link to="/nosotros" onClick={() => setIsMobileMenuOpen(false)} className="text-left text-brand-800 font-bold tracking-widest uppercase p-4 hover:bg-brand-100/50 rounded-xl transition-colors">Nosotros</Link>
          <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)} className="text-left text-brand-800 font-bold tracking-widest uppercase p-4 hover:bg-brand-100/50 rounded-xl transition-colors">FAQ</Link>
          
          {user && user.role === 'admin' && (
            <Link to="/admin" className="flex items-center gap-3 text-accent font-bold tracking-widest uppercase p-4 hover:bg-brand-100/50 rounded-xl transition-colors mt-4 border-t border-brand-200 pt-6">
              <Settings className="w-5 h-5" /> Panel Admin
            </Link>
          )}
        </div>

        {user && (
          <div className="p-6 bg-white border-t border-brand-200">
            <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full flex justify-center items-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-red-100 transition-colors">
              <LogOut className="w-4 h-4" /> Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
