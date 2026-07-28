import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-800"></div>
      </div>
    );
  }

  // Si no hay usuario logueado, enviarlo al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta requiere admin y el usuario no lo es, enviarlo al home
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
