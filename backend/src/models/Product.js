const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: [true, 'El color es obligatorio para la variante'],
    trim: true
  },
  colorHex: {
    type: String,
    default: '#000000',
    trim: true
  },
  size: {
    type: String, 
    default: 'Único',
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'La cantidad en stock es obligatoria'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser menor a 0']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Referencia al futuro modelo de Categorías
    required: [true, 'La categoría es obligatoria']
  },
  stock: [variantSchema],
  images: [{
    type: String,
    required: [true, 'Debe proporcionar al menos la URL de una imagen']
  }]
}, {
  timestamps: true // Esto agregará automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('Product', productSchema);
