import React from 'react';
import { MapPin, Mail, MessageCircle, ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="nosotros" className="bg-brand-900 text-brand-100 pt-20 pb-10 relative z-20 overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-800 rounded-full mix-blend-screen filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & About */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h2 className="text-3xl font-serif font-bold text-white tracking-widest mb-6">KALMA</h2>
            <p className="text-brand-300 font-light leading-relaxed mb-6 text-sm">
              Marroquinería de Mari diseñada para perdurar. Materiales nobles, trabajo ético y un compromiso absoluto con la elegancia atemporal en cada detalle.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-brand-700 flex items-center justify-center text-brand-300 hover:text-white hover:border-white hover:bg-brand-800 transition-all font-bold text-xs">
                IG
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-brand-700 flex items-center justify-center text-brand-300 hover:text-white hover:border-white hover:bg-brand-800 transition-all font-bold text-xs">
                FB
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h4 className="font-bold text-white mb-6 tracking-widest uppercase text-sm">Descubre</h4>
            <ul className="space-y-4 font-light text-brand-200">
              <li><Link to="/nosotros" className="hover:text-white transition-colors">Nuestra Historia</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Nueva Colección</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Cuidado del Cuero</Link></li>
            </ul>
          </div>

          {/* Ayuda y Contacto */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Asistencia</h3>
            <ul className="space-y-4 text-sm font-light text-brand-300">
              <li><Link to="/" className="hover:text-white transition-colors">Envíos y Devoluciones</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>

          {/* Contacto Directo */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Contacto</h3>
            <ul className="space-y-4 text-sm font-light text-brand-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 text-brand-500" />
                <span>Av. Libertador 1234, Palermo<br/>Buenos Aires, Argentina</span>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 shrink-0 text-brand-500" />
                <a href="https://wa.me/5491112345678" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">WhatsApp: +54 9 11 1234-5678</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0 text-brand-500" />
                <a href="mailto:hola@kalma.com" className="hover:text-white transition-colors">hola@kalma.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-brand-800 pt-10 pb-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-white font-medium mb-2">Suscríbete a nuestro newsletter</h3>
            <p className="text-brand-400 text-sm font-light">Recibe acceso anticipado a nuevas colecciones y beneficios exclusivos.</p>
          </div>
          <form className="w-full md:w-auto flex max-w-md">
            <input 
              type="email" 
              placeholder="Tu dirección de email" 
              className="bg-brand-800/50 border border-brand-700 text-white px-4 py-3 rounded-l-full outline-none focus:border-brand-500 w-full md:w-64 text-sm"
              required
            />
            <button type="submit" className="bg-white text-brand-900 px-6 py-3 rounded-r-full font-bold uppercase tracking-widest text-xs hover:bg-brand-100 transition-colors flex items-center gap-2">
              Suscribirse <ArrowRight className="w-3 h-3" />
            </button>
          </form>
        </div>

        {/* Copyright */}
        <div className="border-t border-brand-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-brand-500">
          <p>© {new Date().getFullYear()} KALMA Marroquinería. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <span>Pagos seguros procesados vía Mercado Pago</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
