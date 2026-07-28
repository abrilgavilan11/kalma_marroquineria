import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotal, clearCart, setIsCartOpen } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  // Ensure cart sidebar is closed
  React.useEffect(() => {
    setIsCartOpen(false);
  }, []);

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    setLoading(true);

    try {
      const orderItems = cart.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        image: item.product.images[0],
        price: item.product.price,
        color: item.color,
        size: item.size
      }));

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress,
          totalPrice: cartTotal
        })
      });

      const data = await res.json();
      
      if (data.success) {
        clearCart();
        setSuccess(true);
        toast.success('¡Orden recibida con éxito!');
      } else {
        toast.error(data.error || 'Error al procesar la orden');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center p-6 pt-24 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl p-12 rounded-3xl max-w-lg w-full text-center shadow-xl border border-white">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-brand-900 mb-4">¡Gracias por tu compra!</h2>
          <p className="text-brand-600 mb-8 leading-relaxed">
            Hemos recibido tu orden correctamente. Te enviaremos un email con los detalles del envío pronto.
          </p>
          <Link to="/" className="inline-block bg-brand-900 text-white px-8 py-4 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-brand-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50 pt-24 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-brand-600 hover:text-brand-900 mb-8 font-bold text-xs tracking-widest uppercase transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        
        <h1 className="text-4xl font-serif font-bold text-brand-900 mb-12">Finalizar Compra</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Formulario de Envío */}
          <div className="flex-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-sm">
              <h2 className="text-xl font-serif font-bold text-brand-900 mb-6 flex items-center gap-2">
                Datos de Envío
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-brand-800 uppercase tracking-widest mb-2">Nombre Completo</label>
                  <input type="text" name="fullName" value={shippingAddress.fullName} onChange={handleChange} required className="w-full px-4 py-3 border border-brand-200 rounded-xl bg-white/70 focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-brand-800 uppercase tracking-widest mb-2">Dirección de Entrega</label>
                    <input type="text" name="address" value={shippingAddress.address} onChange={handleChange} required placeholder="Calle, Número, Depto..." className="w-full px-4 py-3 border border-brand-200 rounded-xl bg-white/70 focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-brand-800 uppercase tracking-widest mb-2">Ciudad / Provincia</label>
                    <input type="text" name="city" value={shippingAddress.city} onChange={handleChange} required className="w-full px-4 py-3 border border-brand-200 rounded-xl bg-white/70 focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-brand-800 uppercase tracking-widest mb-2">Código Postal</label>
                    <input type="text" name="postalCode" value={shippingAddress.postalCode} onChange={handleChange} required className="w-full px-4 py-3 border border-brand-200 rounded-xl bg-white/70 focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-brand-800 uppercase tracking-widest mb-2">Teléfono de Contacto</label>
                    <input type="tel" name="phone" value={shippingAddress.phone} onChange={handleChange} required className="w-full px-4 py-3 border border-brand-200 rounded-xl bg-white/70 focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-brand-100">
                  <button 
                    type="submit" 
                    disabled={loading || cart.length === 0}
                    className="w-full bg-brand-900 text-white py-4 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-brand-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? 'Procesando...' : 'Confirmar Orden de Compra'}
                  </button>
                  <div className="flex items-center justify-center gap-2 mt-4 text-brand-500 text-xs">
                    <ShieldCheck className="w-4 h-4" /> Pago seguro y encriptado
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:w-[400px]">
            <div className="bg-brand-900 rounded-3xl p-8 text-white sticky top-28 shadow-xl">
              <h2 className="text-xl font-serif font-bold mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.length === 0 ? (
                  <p className="text-brand-400 text-sm">Tu carrito está vacío</p>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-xl bg-white overflow-hidden shrink-0">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm leading-tight">{item.product.name}</h4>
                        <p className="text-brand-300 text-xs mt-1">{item.color} | {item.size} x{item.quantity}</p>
                      </div>
                      <div className="font-bold text-sm whitespace-nowrap">
                        ${new Intl.NumberFormat('es-AR').format(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="border-t border-brand-800 pt-6 space-y-3 text-sm">
                <div className="flex justify-between text-brand-300">
                  <span>Subtotal</span>
                  <span>${new Intl.NumberFormat('es-AR').format(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-brand-300">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-brand-800">
                  <span>Total</span>
                  <span>${new Intl.NumberFormat('es-AR').format(cartTotal)} ARS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
