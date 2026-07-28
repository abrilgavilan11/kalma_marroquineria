import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Search, Filter } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/categories');
        const json = await res.json();
        if (json.success) setCategories(json.data);
      } catch (err) {
        console.error('Error cargando categorías');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append('search', searchTerm);
        if (selectedCategory && selectedCategory !== 'all') queryParams.append('category', selectedCategory);

        const response = await fetch(`http://localhost:5000/api/products?${queryParams.toString()}`);
        const json = await response.json();
        
        if (json.success) {
          setProducts(json.data);
        } else {
          setError('Error al cargar el catálogo.');
        }
      } catch (err) {
        setError('No se pudo conectar al servidor. Asegúrate de que el backend esté corriendo.');
      } finally {
        setLoading(false);
      }
    };

    // Usar un debounce simple para que no haga fetch por cada letra que escribe el usuario instantáneamente
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  return (
    <section id="catalogo" className="w-full max-w-7xl mx-auto px-6 py-24 relative z-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-900 mb-6">Nuestra Colección</h2>
        <div className="w-24 h-1 bg-accent mx-auto opacity-70 mb-12"></div>
        
        {/* Barra de Herramientas (Filtros y Búsqueda) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/50 backdrop-blur-xl p-4 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          
          {/* Píldoras de Categorías */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${selectedCategory === 'all' ? 'bg-brand-900 text-white shadow-md' : 'bg-white/80 text-brand-700 hover:bg-white border border-brand-200'}`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button 
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${selectedCategory === cat._id ? 'bg-brand-900 text-white shadow-md' : 'bg-white/80 text-brand-700 hover:bg-white border border-brand-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Buscador */}
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Buscar bolso, mochila..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-brand-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm transition-all shadow-sm"
            />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-500" />
          </div>

        </div>
      </div>
      
      {loading ? (
        <div className="w-full py-24 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-800"></div>
        </div>
      ) : error ? (
        <div className="w-full py-24 flex justify-center items-center text-red-500">
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="w-full py-24 flex flex-col items-center justify-center text-brand-500">
          <Filter className="w-16 h-16 mb-6 opacity-30 stroke-[1]" />
          <p className="text-xl font-serif text-brand-700">No encontramos productos que coincidan con tu búsqueda.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
            className="mt-6 text-brand-800 font-bold uppercase text-xs tracking-widest hover:text-brand-500 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;
