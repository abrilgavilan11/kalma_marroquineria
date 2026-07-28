import React, { useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { CartContext } from './context/CartContext';
import Home from './pages/Home';
import About from './pages/About';
import FAQ from './pages/FAQ';
import useScrollReveal from './hooks/useScrollReveal';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import ProtectedRoute from './components/ProtectedRoute';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import ClientChatWidget from './components/ClientChatWidget';



function App() {
  const { user, logout } = useContext(AuthContext);
  const { cartCount, setIsCartOpen } = useContext(CartContext);
  useScrollReveal();

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col relative selection:bg-brand-500 selection:text-white overflow-x-clip">
      {/* Background Decorative Blobs */}
      <div className="fixed top-0 left-0 w-[40rem] h-[40rem] bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob pointer-events-none z-0"></div>
      <div className="fixed top-0 right-0 w-[40rem] h-[40rem] bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000 pointer-events-none z-0"></div>
      <div className="fixed -bottom-32 left-20 w-[40rem] h-[40rem] bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000 pointer-events-none z-0"></div>

      {/* Navigation */}
      <Navbar />

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Router Views */}
      <div className="relative z-10 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>

      <Footer />
      <ScrollToTop />
      <ClientChatWidget />
    </div>
  );
}

export default App;
