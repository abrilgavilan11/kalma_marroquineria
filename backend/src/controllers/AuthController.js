const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper para firmar tokens
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Contar usuarios para asignar el rol
    const userCount = await User.countDocuments();
    const assignedRole = userCount === 0 ? 'admin' : 'cliente';

    // El middleware pre('save') de Mongoose encriptará la contraseña automáticamente
    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole
    });

    const token = generateToken(user);

    res.status(201).json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Login de usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Por favor provea un email y contraseña' });
    }

    // Al definir select: false en el modelo, debemos agregar select('+password') para poder compararla
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    // Verificar si la contraseña coincide
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    // Login exitoso, generamos el JWT
    const token = generateToken(user);

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
