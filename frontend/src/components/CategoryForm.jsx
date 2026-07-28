import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const CategoryForm = ({ onClose, onSuccess, categoryToEdit }) => {
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        name: categoryToEdit.name,
        description: categoryToEdit.description || ''
      });
    }
  }, [categoryToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = categoryToEdit 
      ? `http://localhost:5000/api/categories/${categoryToEdit._id}`
      : 'http://localhost:5000/api/categories';
      
    const method = categoryToEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(categoryToEdit ? 'Categoría actualizada' : 'Categoría creada');
        onSuccess();
      } else {
        toast.error(data.error || 'Error al guardar');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-brand-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-white">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-brand-900">
            {categoryToEdit ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <button onClick={onClose} className="p-2 bg-brand-50 hover:bg-brand-100 rounded-full text-brand-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-brand-800 uppercase tracking-widest mb-2">Nombre de la Categoría</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej: Mochilas" className="w-full px-4 py-3 border border-brand-200 rounded-xl bg-white/70 focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-brand-800 uppercase tracking-widest mb-2">Descripción (Opcional)</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Breve descripción de la categoría" className="w-full px-4 py-3 border border-brand-200 rounded-xl bg-white/70 focus:ring-2 focus:ring-brand-500 outline-none transition-all"></textarea>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-brand-100">
            <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-xs uppercase tracking-widest text-brand-600 hover:bg-brand-50 rounded-full transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-8 py-3 bg-brand-900 text-white rounded-full font-bold tracking-widest uppercase text-xs hover:bg-brand-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              {categoryToEdit ? 'Actualizar' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CategoryForm;
