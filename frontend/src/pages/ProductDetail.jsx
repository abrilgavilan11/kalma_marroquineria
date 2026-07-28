import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const json = await res.json();
        
        if (json.success) {
          setProduct(json.data);
          
          // Pre-seleccionar la primera variante disponible
          const available = json.data.stock.filter(v => v.quantity > 0);
          if (available.length > 0) {
            setSelectedColor(available[0].color);
            setSelectedSize(available[0].size);
          }
        } else {
          setError('Producto no encontrado');
        }
      } catch (err) {
        setError('Error de conexión al cargar producto');
      } finally {
        setLoading(false);
      }
    };
    
    // Scrollear arriba al cargar la nueva página
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-[#fdfaf6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-800"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center bg-[#fdfaf6] text-brand-900">
        <h2 className="text-3xl font-serif mb-4">Oops!</h2>
        <p className="mb-8 text-brand-600 font-medium">{error || 'No pudimos encontrar este producto.'}</p>
        <Link to="/" className="px-6 py-3 bg-brand-900 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-800 transition-colors">Volver al catálogo</Link>
      </div>
    );
  }

  const availableVariants = product.stock.filter(variant => variant.quantity > 0);
  const isOutOfStock = availableVariants.length === 0;

  // Extraer colores únicos con sus respectivos hexadecimale (o default negro)
  const colorsMap = new Map();
  product.stock.forEach(v => {
    if (v.quantity > 0 && !colorsMap.has(v.color)) {
      colorsMap.set(v.color, v.colorHex || '#000000');
    }
  });
  const colors = Array.from(colorsMap.entries()).map(([name, hex]) => ({ name, hex }));

  // Extraer talles disponibles para el color seleccionado actual
  const sizesForSelectedColor = product.stock
    .filter(v => v.color === selectedColor && v.quantity > 0)
    .map(v => v.size);

  const handleColorChange = (colorName) => {
    setSelectedColor(colorName);
    const validSizes = product.stock
      .filter(v => v.color === colorName && v.quantity > 0)
      .map(v => v.size);
    if (!validSizes.includes(selectedSize)) {
      setSelectedSize(validSizes[0] || '');
    }
  };

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(product.price);

  const handleAdd = () => {
    addToCart(product, selectedColor, selectedSize);
    toast.success('Agregado a la bolsa');
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] pt-32 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-900 transition-colors font-bold text-xs uppercase tracking-widest mb-10">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Lado Izquierdo: Galería */}
          <div className="sticky top-32 space-y-4">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-brand-100/50 aspect-[4/5] shadow-2xl border border-white transition-all duration-500">
              <img 
                src={product.images[activeImage] || product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover mix-blend-multiply transition-opacity duration-500"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center">
                  <span className="bg-white text-brand-900 font-bold tracking-[0.2em] uppercase text-xl px-10 py-4 rounded-full shadow-2xl">
                    Agotado
                  </span>
                </div>
              )}
            </div>

            {/* Miniaturas de la galería */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative w-20 h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImage === index ? 'border-brand-900 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lado Derecho: Detalles */}
          <div className="flex flex-col justify-center py-6 md:py-12">
            <span className="text-brand-500 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              {product.category?.name || 'Marroquinería'}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-900 mb-6 leading-tight">
              {product.name}
            </h1>
            <p className="text-3xl text-brand-800 font-medium font-sans tracking-tight mb-8">
              {formattedPrice}
            </p>
            
            <p className="text-brand-700/80 leading-relaxed font-medium text-lg mb-12">
              {product.description}
            </p>

            {!isOutOfStock && (
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 space-y-8">
                
                {/* Selector de Color (Burbujas Visuales) */}
                {colors.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-xs font-bold text-brand-800 uppercase tracking-widest">Tonalidad</span>
                      <span className="text-sm text-brand-600 font-bold">{selectedColor}</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {colors.map(color => {
                        // Cálculo simple de contraste para que el icono check se vea bien sobre colores claros/oscuros
                        const hex = color.hex.replace('#', '');
                        const r = parseInt(hex.substr(0, 2), 16);
                        const g = parseInt(hex.substr(2, 2), 16);
                        const b = parseInt(hex.substr(4, 2), 16);
                        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                        const textColorClass = yiq >= 128 ? 'text-black' : 'text-white';

                        return (
                          <button 
                            key={color.name}
                            onClick={() => handleColorChange(color.name)}
                            className={`relative w-14 h-14 rounded-full transition-transform duration-300 flex items-center justify-center shadow-md border border-black/10 ${
                              selectedColor === color.name ? 'scale-110 ring-4 ring-offset-4 ring-brand-900 z-10' : 'hover:scale-110 opacity-90 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          >
                            {selectedColor === color.name && (
                              <Check className={`w-6 h-6 ${textColorClass}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Selector de Talle */}
                {sizesForSelectedColor.length > 0 && sizesForSelectedColor[0] !== 'Único' && (
                  <div className="pt-8 border-t border-brand-200/50">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-xs font-bold text-brand-800 uppercase tracking-widest">Talle</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {sizesForSelectedColor.map(size => (
                        <button 
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-8 py-4 text-sm rounded-2xl border transition-all duration-300 font-bold ${
                            selectedSize === size 
                              ? 'border-brand-900 bg-brand-900 text-white shadow-lg' 
                              : 'border-brand-200 bg-white/60 text-brand-700 hover:border-brand-500 hover:bg-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button 
              disabled={isOutOfStock}
              onClick={handleAdd}
              className={`w-full py-5 flex items-center justify-center gap-3 rounded-[2rem] font-bold tracking-[0.15em] uppercase text-sm transition-all transform hover:-translate-y-1 ${
                isOutOfStock 
                  ? 'bg-brand-100 text-brand-400 border border-brand-200 cursor-not-allowed'
                  : 'bg-brand-900 text-white hover:bg-brand-800 shadow-[0_15px_30px_rgba(44,30,26,0.2)] hover:shadow-[0_20px_40px_rgba(44,30,26,0.3)] border border-transparent'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {isOutOfStock ? 'Agotado' : 'Añadir a la Bolsa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
