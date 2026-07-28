<div align="center">
  <img src="https://via.placeholder.com/150x150.png?text=Kalma+Logo" alt="Kalma Marroquinería Logo" width="150"/>
  <h1>👜 Kalma Marroquinería</h1>
  <p><strong>Una experiencia premium de e-commerce para productos de marroquinería de alta calidad.</strong></p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)
</div>

<br />

## 📖 Sobre el Proyecto

**Kalma Marroquinería** es una plataforma web Full-Stack desarrollada para ofrecer una experiencia de compra intuitiva, moderna y elegante. Especializada en la venta de productos de marroquinería, la aplicación permite a los usuarios explorar, añadir al carrito y comprar productos, al mismo tiempo que ofrece un completo panel de administración para gestionar el inventario y las órdenes. 

Además, integra comunicación en tiempo real a través de un chat en vivo para soporte al cliente.

---

## ✨ Características Principales

### 🛒 Para el Cliente
* **Exploración de Productos**: Catálogo completo con detalles, imágenes y categorías.
* **Carrito de Compras**: Gestión dinámica de productos en el carrito.
* **Autenticación Segura**: Registro e inicio de sesión de usuarios (JWT & Bcrypt).
* **Soporte en Tiempo Real**: Chat en vivo integrado para consultas y atención al cliente.
* **Diseño Responsive**: Interfaz adaptable a cualquier dispositivo móvil o de escritorio.

### ⚙️ Para el Administrador (Dashboard)
* **Gestión de Inventario**: Crear, editar y eliminar productos (`dnd-kit` para ordenamiento, `multer` para imágenes).
* **Gestión de Categorías**: Organización eficiente del catálogo.
* **Control de Órdenes**: Seguimiento y actualización del estado de las compras.
* **Atención al Cliente**: Panel de chat para responder a los clientes en tiempo real.

---

## 🛠️ Tecnologías y Herramientas

Este proyecto está construido con el stack **MERN** modernizado (MongoDB, Express, React con Vite, Node.js), asegurando alto rendimiento y escalabilidad.

### 🎨 Frontend
* **[React 19](https://react.dev/)** + **[Vite](https://vitejs.dev/)**: Framework y bundler ultrarrápido.
* **[Tailwind CSS](https://tailwindcss.com/)**: Estilos modernos, utilitarios y responsive.
* **[React Router DOM](https://reactrouter.com/)**: Manejo de rutas del lado del cliente.
* **[Socket.io-Client](https://socket.io/)**: Conexión bidireccional para el chat en vivo.
* **[Zustand / Context API]**: Manejo de estados globales (Carrito, Auth, Chat).
* **[Lucide React](https://lucide.dev/)**: Iconografía elegante.
* **[Dnd-kit](https://dndkit.com/)**: Funcionalidad drag-and-drop en el panel de administración.
* **[React Hot Toast](https://react-hot-toast.com/)**: Notificaciones de sistema atractivas.

### 🖥️ Backend
* **[Node.js](https://nodejs.org/)** & **[Express](https://expressjs.com/)**: Servidor y creación de API RESTful.
* **[MongoDB](https://www.mongodb.com/)** & **[Mongoose](https://mongoosejs.com/)**: Base de datos NoSQL y modelado de datos.
* **[Socket.io](https://socket.io/)**: WebSockets para la comunicación en tiempo real.
* **[JWT (JSON Web Tokens)](https://jwt.io/)**: Autenticación y autorización basada en tokens.
* **[Bcryptjs](https://www.npmjs.com/package/bcryptjs)**: Encriptación segura de contraseñas.
* **[Multer](https://github.com/expressjs/multer)**: Gestión de subida de archivos e imágenes.
* **[Cors & Dotenv]**: Seguridad y manejo de variables de entorno.

---

## 🚀 Instalación y Uso Local

Sigue estos pasos para correr el proyecto en tu entorno local.

### Prerrequisitos
* Node.js (v18 o superior)
* MongoDB (Local o Atlas)

### Pasos
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/abrilgavilan11/kalma_marroquineria.git
   cd kalma_marroquineria
   ```

2. **Configurar y levantar el Backend:**
   ```bash
   cd backend
   npm install
   ```
   *Crea un archivo `.env` en la carpeta `backend` con las siguientes variables:*
   ```env
   PORT=5000
   MONGO_URI=tu_cadena_de_conexion_mongodb
   JWT_SECRET=tu_secreto_super_seguro
   ```
   *Inicia el servidor:*
   ```bash
   npm run dev
   ```

3. **Configurar y levantar el Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```
   *Inicia la aplicación de React:*
   ```bash
   npm run dev
   ```

4. **¡Listo!** Abre `http://localhost:5173` en tu navegador.

---

## 📂 Estructura del Proyecto

```text
kalma_marroquineria/
├── backend/                  # Servidor Express & API REST
│   ├── src/
│   │   ├── config/           # Configuración de BD (MongoDB)
│   │   ├── controllers/      # Lógica de negocio (Auth, Products, Orders, Chat)
│   │   ├── middlewares/      # Middlewares (Autenticación, Multer)
│   │   ├── models/           # Esquemas de Mongoose
│   │   └── routes/           # Endpoints de la API
│   └── package.json
└── frontend/                 # Aplicación React + Vite
    ├── src/
    │   ├── components/       # Componentes reutilizables (Navbar, Cards, Chat, Forms)
    │   ├── context/          # Proveedores de estado global
    │   ├── hooks/            # Custom Hooks
    │   ├── pages/            # Vistas principales (Home, AdminDashboard, Checkout, etc.)
    │   └── index.css         # Estilos globales (Tailwind)
    └── package.json
```

---

<div align="center">
  <p>Desarrollado con ❤️ por Abril Gavilan.</p>
</div>


GitHub: [@abrilgavilan11](https://github.com/abrilgavilan11)</p>

