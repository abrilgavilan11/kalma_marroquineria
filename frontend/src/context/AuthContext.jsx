import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al cargar la app, revisamos si hay un token guardado
    const token = localStorage.getItem('kalma_token');
    if (token) {
      try {
        // Decodificamos el payload de JWT usando base64
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Verificamos si expiró (el tiempo en JWT viene en segundos, JS usa milisegundos)
        if (payload.exp * 1000 > Date.now()) {
          if (!payload.name) {
            // Token antiguo sin nombre: forzar cierre de sesión
            localStorage.removeItem('kalma_token');
          } else {
            setUser({ id: payload.id, role: payload.role, name: payload.name, email: payload.email, token });
          }
        } else {
          localStorage.removeItem('kalma_token');
        }
      } catch (e) {
        localStorage.removeItem('kalma_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('kalma_token', data.token);
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        setUser({ id: payload.id, role: payload.role, name: payload.name, email: payload.email, token: data.token });
        toast.success('¡Bienvenido de nuevo a Kalma!');
        return true;
      } else {
        toast.error(data.error || 'Error al iniciar sesión');
        return false;
      }
    } catch (error) {
      toast.error('Error de conexión con el servidor');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('kalma_token', data.token);
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        setUser({ id: payload.id, role: payload.role, name: payload.name, email: payload.email, token: data.token });
        toast.success('¡Cuenta creada exitosamente!');
        return true;
      } else {
        toast.error(data.error || 'Error al registrarse');
        return false;
      }
    } catch (error) {
      toast.error('Error de conexión con el servidor');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('kalma_token');
    setUser(null);
    toast.success('Sesión cerrada correctamente');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
