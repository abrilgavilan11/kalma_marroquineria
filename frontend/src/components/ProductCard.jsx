import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  const availableVariants = product.stock.filter(variant => variant.quantity > 0);
  const isOutOfStock = availableVariants.length === 0;

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(product.price);

  return (
    <div className="glass-panel group overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl flex flex-col h-full border border-white/40 relative bg-white/30">
      <Link to={`/product/${product._id}`} className="relative aspect-[4/5] overflow-hidden bg-brand-100/50 block">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-white/90 text-brand-900 font-bold tracking-[0.2em] uppercase text-xs px-6 py-2 rounded-full shadow-lg">
              Agotado
            </span>
          </div>
        )}
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3 gap-4">
          <Link to={`/product/${product._id}`} className="font-serif text-2xl font-bold text-brand-900 leading-tight hover:text-brand-700 transition-colors">
            {product.name}
          </Link>
          <span className="font-sans font-semibold text-brand-700 whitespace-nowrap text-lg">
            {formattedPrice}
          </span>
        </div>
        
        <p className="text-sm text-brand-600/80 font-light line-clamp-2 mb-6 flex-grow">
          {product.description}
        </p>

        <Link 
          to={`/product/${product._id}`}
          className="w-full py-3.5 flex items-center justify-center gap-2 rounded-full font-medium tracking-widest uppercase text-sm transition-all transform hover:-translate-y-0.5 bg-brand-900 text-white hover:bg-brand-800 hover:shadow-[0_8px_20px_rgba(44,30,26,0.3)] border border-transparent"
        >
          <Eye className="w-4 h-4" />
          Ver Detalles
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
