require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');
const User = require('./src/models/User');
const Order = require('./src/models/Order');

// Conectarse a MongoDB
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);

const seedData = async () => {
  try {
    // 1. Limpiar base de datos actual (para evitar duplicados al ejecutar múltiples veces)
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    console.log('🧹 Base de datos limpiada correctamente (Productos, Categorías, Usuarios, Órdenes).');

    // 2. Crear Categorías
    const catBolsos = await Category.create({ name: 'Bolsos de Cuero', description: 'Bolsos premium de grano superior' });
    const catMochilas = await Category.create({ name: 'Mochilas', description: 'Diseño ergonómico y elegante' });
    const catCarteras = await Category.create({ name: 'Carteras', description: 'Accesorios minimalistas' });

    console.log('📁 Categorías base creadas.');

    // 3. Crear Productos de Prueba
    const products = [
      {
        name: 'Bolso Tote Clásico',
        description: 'Bolso Tote de cuero vacuno. Amplio interior y diseño minimalista ideal para la oficina o el fin de semana.',
        price: 185000,
        category: catBolsos._id,
        stock: [
          { color: 'Negro', size: 'Único', quantity: 15 },
          { color: 'Suela', size: 'Único', quantity: 5 },
          { color: 'Verde Oliva', size: 'Único', quantity: 0 } // Sin stock intencionalmente para probar la UI
        ],
        images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800']
      },
      {
        name: 'Mochila Urbana Minimal',
        description: 'Mochila compacta de líneas puras. Correas ajustables y bolsillo frontal disimulado. Forrería de algodón peinado.',
        price: 240000,
        category: catMochilas._id,
        stock: [
          { color: 'Negro', size: 'Único', quantity: 8 },
          { color: 'Tostado', size: 'Único', quantity: 12 }
        ],
        images: ['https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&q=80&w=800']
      },
      {
        name: 'Cartera Bandolera Luna',
        description: 'Cartera cruzada con forma de media luna. Detalles en herrajes bañados en oro. Perfecta para salidas nocturnas.',
        price: 125000,
        category: catCarteras._id,
        stock: [
          { color: 'Negro', size: 'Único', quantity: 20 },
          { color: 'Crudo', size: 'Único', quantity: 3 }
        ],
        images: ['https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800']
      },
      {
        name: 'Maletín Ejecutivo',
        description: 'Elegancia atemporal. Espacio acolchado para notebook de 15" y múltiples organizadores internos.',
        price: 310000,
        category: catBolsos._id,
        stock: [
          { color: 'Marrón Oscuro', size: 'Único', quantity: 5 }
        ],
        images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800']
      }
    ];

    await Product.create(products);
    console.log('👜 Productos semilla creados con éxito.');

    // No creamos usuario intencionalmente para que el primer registro desde la web asuma el rol de admin
    console.log('👑 Recuerda: El primer usuario que se registre desde la web obtendrá permisos de Admin automáticamente.');

    process.exit();
  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    process.exit(1);
  }
};

seedData();
