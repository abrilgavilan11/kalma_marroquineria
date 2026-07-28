import React from 'react';
import ProductList from '../components/ProductList';
import { ArrowDown } from 'lucide-react';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <main className="relative z-10 p-6 min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          
          {/* Badge Animado */}
          <div className="reveal opacity-0 translate-y-12 transition-all duration-1000 ease-out">
            <span className="text-brand-600 bg-brand-100/50 backdrop-blur-sm px-6 py-2 rounded-full font-bold tracking-[0.3em] text-[10px] md:text-xs uppercase mb-8 inline-block shadow-sm border border-brand-200/30">
              Nueva Colección 2026
            </span>
          </div>
          
          {/* Título Principal Animado */}
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-brand-900 mb-8 leading-[1.1] drop-shadow-sm reveal opacity-0 translate-y-12 transition-all duration-1000 ease-out delay-200">
            Elegancia atemporal <br/>
            <span className="text-brand-600/90 italic font-light">en cada detalle.</span>
          </h2>
          
          {/* Subtítulo Animado */}
          <p className="text-lg md:text-xl text-brand-800 mb-12 max-w-2xl mx-auto font-light leading-relaxed reveal opacity-0 translate-y-12 transition-all duration-1000 ease-out delay-400">
            Descubre nuestra exclusiva selección de bolsos y accesorios de cuero. 
            Diseño minimalista, calidad premium y una confección dedicada para acompañarte toda la vida.
          </p>
          
          {/* Botón Animado */}
          <div className="reveal opacity-0 translate-y-12 transition-all duration-1000 ease-out delay-500">
            <a 
              href="#catalogo"
              className="group inline-flex items-center gap-4 bg-brand-900 text-white px-10 py-4 rounded-full font-medium tracking-widest text-sm uppercase transition-all duration-500 hover:bg-brand-800 hover:shadow-2xl shadow-brand-900/30 hover:-translate-y-1"
            >
              Explorar Catálogo
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
            </a>
          </div>

        </div>

        {/* Imágenes Flotantes (Solo Desktop) - Animadas */}
        <div className="hidden lg:block absolute left-10 top-1/4 w-48 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl -rotate-6 reveal opacity-0 -translate-x-12 transition-all duration-1000 ease-out delay-700">
          <img src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop" alt="Bolso destacado" className="w-full h-full object-cover" />
        </div>
        <div className="hidden lg:block absolute right-10 bottom-1/4 w-56 aspect-square rounded-full overflow-hidden shadow-2xl rotate-12 reveal opacity-0 translate-x-12 transition-all duration-1000 ease-out delay-1000">
          <img src="https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=600&auto=format&fit=crop" alt="Textura de cuero" className="w-full h-full object-cover" />
        </div>
      </main>

      {/* Product List Section */}
      <div id="catalogo" className="reveal opacity-0 translate-y-12 transition-all duration-1000 ease-out">
        <ProductList />
      </div>
    </>
  );
};

export default Home;
