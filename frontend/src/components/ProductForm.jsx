import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Trash2, Upload, Link as LinkIcon, Star, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableImage = ({ imgObj, index, removeImage }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: imgObj.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`relative group rounded-xl overflow-hidden aspect-square border-2 cursor-grab active:cursor-grabbing touch-none ${index === 0 ? 'border-brand-500 shadow-md' : 'border-transparent'}`}
    >
      <img src={imgObj.url} alt="Preview" className="w-full h-full object-cover pointer-events-none" />
      
      {/* Overlay controls */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
        <div className="flex justify-between">
          {index === 0 ? (
            <span className="bg-brand-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-2 h-2" /> Portada
            </span>
          ) : (
            <span></span>
          )}
          <button 
            type="button" 
            onPointerDown={(e) => e.stopPropagation()} // Importante: previene que se active el drag
            onClick={(e) => { e.stopPropagation(); removeImage(imgObj.id); }} 
            className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm z-50 cursor-pointer" 
            title="Eliminar"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductForm = ({ onClose, onSuccess, productToEdit }) => {
  const { user } = useContext(AuthContext);
  
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: [{ color: 'Negro', colorHex: '#000000', size: 'Único', quantity: 10 }]
  });

  const [imagesList, setImagesList] = useState([]);
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' | 'file'
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Configurar sensores para PC y Móvil
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requiere mover 5px para activar el drag (ayuda a evitar clicks accidentales)
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Requiere mantener presionado 250ms en móvil para empezar a arrastrar
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/categories');
        const json = await res.json();
        if (json.success) {
          setCategories(json.data);
          if (!productToEdit && json.data.length > 0) {
            setFormData(prev => ({ ...prev, category: json.data[0]._id }));
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchCategories();

    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        price: productToEdit.price,
        description: productToEdit.description,
        category: productToEdit.category?._id || productToEdit.category,
        stock: productToEdit.stock || []
      });
      if (productToEdit.images) {
        setImagesList(productToEdit.images.map(url => ({ id: Math.random().toString(36).substr(2, 9), url })));
      }
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStockChange = (index, field, value) => {
    const newStock = [...formData.stock];
    newStock[index][field] = field === 'quantity' ? parseInt(value) || 0 : value;
    setFormData(prev => ({ ...prev, stock: newStock }));
  };

  const addStockRow = () => {
    setFormData(prev => ({
      ...prev,
      stock: [...prev.stock, { color: '', colorHex: '#000000', size: 'Único', quantity: 1 }]
    }));
  };

  const removeStockRow = (index) => {
    const newStock = [...formData.stock];
    newStock.splice(index, 1);
    setFormData(prev => ({ ...prev, stock: newStock }));
  };

  // --- MÉTODOS DE GALERÍA ---
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImagesList(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), url: newImageUrl.trim() }]);
    setNewImageUrl('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setIsUploading(true);
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: data
      });
      const json = await res.json();
      if (json.success) {
        setImagesList(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), url: json.url }]);
        toast.success('Imagen subida correctamente');
      } else {
        toast.error(json.error || 'Error al subir la imagen');
      }
    } catch (error) {
      toast.error('Error de conexión al subir la imagen');
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const removeImage = (idToRemove) => {
    setImagesList(prev => prev.filter(img => img.id !== idToRemove));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setImagesList((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // ----------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (imagesList.length === 0) {
      toast.error('Debes agregar al menos una imagen');
      return;
    }

    const payload = {
      ...formData,
      images: imagesList.map(img => img.url)
    };

    const url = productToEdit 
      ? `http://localhost:5000/api/products/${productToEdit._id}`
      : 'http://localhost:5000/api/products';
      
    const method = productToEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(productToEdit ? 'Producto actualizado' : 'Producto creado');
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
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-brand-900">
            {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="p-2 bg-brand-50 hover:bg-brand-100 rounded-full text-brand-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-[10px] font-bold text-brand-800 uppercase tracking-widest mb-2">Nombre del Bolso</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-brand-200 rounded-xl bg-white/70 focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <label className="block text-[10px] font-bold text-brand-800 uppercase tracking-widest mb-2">Precio (ARS)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-3 border border-brand-200 rounded-xl bg-white/70 focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
            </div>
            
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-brand-800 uppercase tracking-widest mb-2">Categoría</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-3 border border-brand-200 rounded-xl bg-white/70 focus:ring-2 focus:ring-brand-500 outline-none transition-all">
                <option value="">Selecciona una categoría</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-brand-800 uppercase tracking-widest mb-2">Descripción</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="w-full px-4 py-3 border border-brand-200 rounded-xl bg-white/70 focus:ring-2 focus:ring-brand-500 outline-none transition-all"></textarea>
            </div>
          </div>

          {/* GALERÍA DE IMÁGENES */}
          <div className="bg-brand-50/50 p-6 rounded-2xl border border-brand-100">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-5 h-5 text-brand-700" />
              <h3 className="text-sm font-bold text-brand-900 tracking-widest uppercase">Galería de Imágenes</h3>
            </div>

            <div className="flex bg-white rounded-lg p-1 border border-brand-200 w-full sm:w-max mb-4">
              <button 
                type="button" 
                onClick={() => setUploadMethod('url')}
                className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${uploadMethod === 'url' ? 'bg-brand-100 text-brand-900 shadow-sm border border-brand-200' : 'text-brand-500 hover:text-brand-700 border border-transparent'}`}
              >
                <LinkIcon className="w-3 h-3" /> Añadir URL
              </button>
              <button 
                type="button" 
                onClick={() => setUploadMethod('file')}
                className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${uploadMethod === 'file' ? 'bg-brand-100 text-brand-900 shadow-sm border border-brand-200' : 'text-brand-500 hover:text-brand-700 border border-transparent'}`}
              >
                <Upload className="w-3 h-3" /> Subir
              </button>
            </div>

            <div className="mb-6">
              {uploadMethod === 'url' ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="url" 
                    placeholder="https://ejemplo.com/imagen.jpg" 
                    value={newImageUrl} 
                    onChange={(e) => setNewImageUrl(e.target.value)} 
                    className="flex-1 px-4 py-3 border border-brand-200 rounded-xl bg-white/70 focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm" 
                  />
                  <button type="button" onClick={handleAddImageUrl} className="px-6 py-3 bg-brand-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-800 transition-colors">
                    Añadir
                  </button>
                </div>
              ) : (
                <div className="relative border-2 border-dashed border-brand-300 rounded-xl p-8 text-center bg-white/50 hover:bg-white transition-colors">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                  />
                  <div className="flex flex-col items-center justify-center text-brand-600">
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-800 mb-2"></div>
                    ) : (
                      <Upload className="w-8 h-8 mb-2 opacity-50" />
                    )}
                    <span className="text-sm font-bold">{isUploading ? 'Subiendo...' : 'Haz clic para buscar o arrastra una imagen'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {imagesList.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={imagesList.map(i => i.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagesList.map((imgObj, index) => (
                      <SortableImage key={imgObj.id} imgObj={imgObj} index={index} removeImage={removeImage} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <p className="text-sm text-brand-500 text-center py-4">No hay imágenes. La primera imagen que añadas será la portada.</p>
            )}
          </div>

          <div className="bg-brand-50/50 p-6 rounded-2xl border border-brand-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-brand-900 tracking-widest uppercase">Variantes de Stock</h3>
              <button type="button" onClick={addStockRow} className="text-xs bg-brand-200 hover:bg-brand-300 text-brand-800 px-3 py-1.5 rounded-full font-bold flex items-center gap-1 transition-colors">
                <Plus className="w-3 h-3" /> Agregar Variante
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.stock.map((item, index) => (
                <div key={index} className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-white p-3 rounded-xl border border-brand-100 shadow-sm">
                  <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-brand-200 shrink-0 shadow-sm">
                      <input 
                        type="color" 
                        value={item.colorHex || '#000000'} 
                        onChange={(e) => handleStockChange(index, 'colorHex', e.target.value)}
                        className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer border-0 p-0"
                        title="Elegir color visual"
                      />
                    </div>
                    <input type="text" placeholder="Nombre (ej: Suela)" value={item.color} onChange={(e) => handleStockChange(index, 'color', e.target.value)} required className="w-full px-3 py-2 text-sm border border-brand-200 rounded-lg outline-none focus:border-brand-500" />
                  </div>
                  <input type="text" placeholder="Talle" value={item.size} onChange={(e) => handleStockChange(index, 'size', e.target.value)} required className="w-20 px-3 py-2 text-sm border border-brand-200 rounded-lg outline-none focus:border-brand-500" />
                  <input type="number" placeholder="Cant." value={item.quantity} onChange={(e) => handleStockChange(index, 'quantity', e.target.value)} required min="0" className="w-20 px-3 py-2 text-sm border border-brand-200 rounded-lg outline-none focus:border-brand-500" />
                  {formData.stock.length > 1 && (
                    <button type="button" onClick={() => removeStockRow(index)} className="text-red-400 hover:text-red-600 p-2 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-brand-100">
            <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-xs uppercase tracking-widest text-brand-600 hover:bg-brand-50 rounded-full transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-8 py-3 bg-brand-900 text-white rounded-full font-bold tracking-widest uppercase text-xs hover:bg-brand-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              {productToEdit ? 'Actualizar Producto' : 'Guardar en Inventario'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ProductForm;
