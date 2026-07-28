require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const messageRoutes = require('./routes/messageRoutes');
const Message = require('./models/Message');

// Para WebSockets
const { Server } = require('socket.io');
const http = require('http');

// Conectar a la base de datos
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);

// Servir la carpeta de subidas estáticamente
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Kalma - Tienda Online de Marroquinería');
});

// Lógica de Sockets para el Chat
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    if (userId) {
      socket.join(userId);
    }
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { sender, receiver, content } = data;
      
      const message = await Message.create({ sender, receiver, content });
      await message.populate([
        { path: 'sender', select: 'name email' },
        { path: 'receiver', select: 'name email' }
      ]);

      // Emitir mensaje a ambas salas (emisor y receptor)
      io.to(receiver).emit('receiveMessage', message);
      io.to(sender).emit('receiveMessage', message);
    } catch (error) {
      console.error('Error enviando mensaje via socket:', error);
    }
  });
});

// Inicio del servidor usando server.listen (para que incluya WebSockets)
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
