const jwt = require('jsonwebtoken');

// Middleware para verificar la autenticación del usuario mediante JWT
exports.protect = async (req, res, next) => {
  let token;

  // 1. Extraer el token de la cabecera (formato "Bearer <token>")
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Si no hay token, denegar el acceso
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'No estás autorizado. Por favor, inicia sesión para obtener un token.' 
    });
  }

  try {
    // 3. Verificar y decodificar el token usando nuestra clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Inyectar los datos del usuario en el Request (req.user)
    // Asumimos que al hacer login, el token contendrá el { id, role } del usuario
    req.user = decoded;

    // Pasar al siguiente middleware o controlador
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Token inválido o expirado. Inicia sesión nuevamente.' 
    });
  }
};

// Middleware para validar que el usuario tenga el rol de 'admin'
exports.admin = (req, res, next) => {
  // Primero debe haber pasado por protect(), por lo que req.user ya debería existir
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      error: 'Acceso denegado. Se requieren privilegios de administrador para esta acción.' 
    });
  }
};
