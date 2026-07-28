const User = require('../models/User');

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Actualizar el rol de un usuario
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['admin', 'cliente'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Rol inválido' });
    }

    // No permitir que el propio admin se quite sus permisos si es el único
    if (req.user.id === req.params.id && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, error: 'No puedes degradarte a cliente si eres el único administrador del sistema.' });
      }
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    user.role = role;
    const updatedUser = await user.save();
    
    // Ocultar la contraseña de la respuesta
    updatedUser.password = undefined;

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Obtener un administrador para el chat
// @route   GET /api/users/admin
// @access  Public (necesita token pero cualquier rol)
exports.getAdminUser = async (req, res) => {
  try {
    const adminUser = await User.findOne({ role: 'admin' }).select('-password');
    res.json({ success: true, data: adminUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
