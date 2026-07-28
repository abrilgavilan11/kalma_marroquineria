import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob pointer-events-none"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center text-brand-600 hover:text-brand-900 transition-colors mb-6 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la tienda
        </Link>
        <h2 className="text-center text-4xl font-serif font-bold text-brand-900 tracking-widest">KALMA</h2>
        <h3 className="mt-4 text-center text-2xl font-light text-brand-800">Crea tu cuenta</h3>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/60 backdrop-blur-xl py-10 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl sm:px-12 border border-white/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-brand-800">Nombre completo</label>
              <div className="mt-2">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-brand-200 rounded-xl shadow-sm placeholder-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white/70 transition-all"
                  placeholder="Tu nombre"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-800">Email</label>
              <div className="mt-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-brand-200 rounded-xl shadow-sm placeholder-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white/70 transition-all"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-800">Contraseña</label>
              <div className="mt-2">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-brand-200 rounded-xl shadow-sm placeholder-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white/70 transition-all"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-lg shadow-brand-900/20 text-sm font-bold tracking-widest uppercase text-white bg-brand-900 hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-900 transition-all transform hover:-translate-y-1"
              >
                Crear cuenta
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-brand-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-semibold text-brand-800 hover:text-brand-900 hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
