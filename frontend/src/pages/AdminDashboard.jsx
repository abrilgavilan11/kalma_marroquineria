import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit, Trash2, Package, ListOrdered, Users, Layers, MessageSquare } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import CategoryForm from '../components/CategoryForm';
import AdminChat from '../components/AdminChat';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const json = await response.json();
      if (json.success) setProducts(json.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const json = await response.json();
      if (json.success) setOrders(json.data);
    } catch (error) {
      console.error('Error fetching orders', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const json = await response.json();
      if (json.success) setUsers(json.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const json = await response.json();
      if (json.success) setCategories(json.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (activeTab === 'products') await fetchProducts();
      else if (activeTab === 'orders') await fetchOrders();
      else if (activeTab === 'users') await fetchUsers();
      else if (activeTab === 'categories') await fetchCategories();
      setLoading(false);
    };
    loadData();
  }, [activeTab]);

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto permanentemente?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Producto eliminado');
        fetchProducts();
      } else {
        toast.error('Error al eliminar');
      }
    } catch (e) {
      toast.error('Error de red');
    }
  };

  const handleAddNewCategory = () => {
    setEditingCategory(null);
    setShowCategoryForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría? Asegúrate de que no haya productos asignados a ella.')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Categoría eliminada');
        fetchCategories();
      } else {
        toast.error(data.error || 'Error al eliminar');
      }
    } catch (e) {
      toast.error('Error de red');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Estado actualizado');
        fetchOrders();
      } else {
        toast.error('Error al actualizar estado');
      }
    } catch (e) {
      toast.error('Error de red');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Rol actualizado');
        fetchUsers();
      } else {
        toast.error(data.error || 'Error al actualizar rol');
      }
    } catch (e) {
      toast.error('Error de red');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-900">Panel de Administración</h1>
          <p className="text-brand-600 mt-2 font-medium">Gestiona el inventario, ventas y permisos</p>
        </div>
        
        {/* Tabs */}
        <div className="flex flex-wrap bg-white/50 backdrop-blur-md p-1 rounded-3xl lg:rounded-full border border-brand-200 gap-1">
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'products' ? 'bg-brand-900 text-white shadow-md' : 'text-brand-600 hover:bg-white'}`}
          >
            <Package className="w-4 h-4" /> Productos
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'categories' ? 'bg-brand-900 text-white shadow-md' : 'text-brand-600 hover:bg-white'}`}
          >
            <Layers className="w-4 h-4" /> Categorías
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-brand-900 text-white shadow-md' : 'text-brand-600 hover:bg-white'}`}
          >
            <ListOrdered className="w-4 h-4" /> Órdenes
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-brand-900 text-white shadow-md' : 'text-brand-600 hover:bg-white'}`}
          >
            <Users className="w-4 h-4" /> Usuarios
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'messages' ? 'bg-brand-900 text-white shadow-md' : 'text-brand-600 hover:bg-white'}`}
          >
            <MessageSquare className="w-4 h-4" /> Mensajes
          </button>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        
        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div>
            <div className="p-4 flex justify-end border-b border-brand-100">
              <button 
                onClick={handleAddNew}
                className="flex items-center justify-center gap-2 bg-brand-900 text-white px-6 py-3 rounded-full font-bold text-[10px] tracking-widest uppercase hover:bg-brand-800 transition-all shadow-md"
              >
                <Plus className="w-3 h-3" /> Nuevo Producto
              </button>
            </div>
            {loading ? (
              <div className="p-20 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div></div>
            ) : products.length === 0 ? (
              <div className="p-20 text-center text-brand-500">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-serif">No hay productos en el catálogo.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-100/30 text-brand-800 text-[10px] uppercase tracking-widest border-b border-brand-100">
                      <th className="p-5 font-bold">Producto</th>
                      <th className="p-5 font-bold">Categoría</th>
                      <th className="p-5 font-bold">Precio</th>
                      <th className="p-5 font-bold">Stock</th>
                      <th className="p-5 font-bold text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-100/50">
                    {products.map(product => (
                      <tr key={product._id} className="hover:bg-white/40 transition-colors">
                        <td className="p-5 flex items-center gap-4">
                          <img src={product.images[0]} alt={product.name} className="w-14 h-14 rounded-xl object-cover bg-brand-50 shadow-sm" />
                          <span className="font-bold text-brand-900">{product.name}</span>
                        </td>
                        <td className="p-5 text-brand-700 text-sm font-medium">{product.category?.name || 'N/A'}</td>
                        <td className="p-5 text-brand-900 font-bold">
                          ${new Intl.NumberFormat('es-AR').format(product.price)}
                        </td>
                        <td className="p-5">
                          <span className="bg-brand-100 text-brand-800 px-3 py-1 rounded-full text-xs font-bold">
                            {product.stock.reduce((total, v) => total + v.quantity, 0)} items
                          </span>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => handleEdit(product)} className="p-2 text-brand-500 hover:text-brand-900 bg-white rounded-xl shadow-sm border border-brand-100 transition-colors hover:shadow-md" title="Editar"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(product._id)} className="p-2 text-red-400 hover:text-red-600 bg-white rounded-xl shadow-sm border border-brand-100 transition-colors hover:shadow-md" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div>
            <div className="p-4 flex justify-end border-b border-brand-100">
              <button 
                onClick={handleAddNewCategory}
                className="flex items-center justify-center gap-2 bg-brand-900 text-white px-6 py-3 rounded-full font-bold text-[10px] tracking-widest uppercase hover:bg-brand-800 transition-all shadow-md"
              >
                <Plus className="w-3 h-3" /> Nueva Categoría
              </button>
            </div>
            {loading ? (
              <div className="p-20 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div></div>
            ) : categories.length === 0 ? (
              <div className="p-20 text-center text-brand-500">
                <Layers className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-serif">No hay categorías registradas.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-100/30 text-brand-800 text-[10px] uppercase tracking-widest border-b border-brand-100">
                      <th className="p-5 font-bold">Nombre</th>
                      <th className="p-5 font-bold">Descripción</th>
                      <th className="p-5 font-bold text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-100/50">
                    {categories.map(cat => (
                      <tr key={cat._id} className="hover:bg-white/40 transition-colors">
                        <td className="p-5 font-bold text-brand-900">{cat.name}</td>
                        <td className="p-5 text-sm text-brand-600">{cat.description || '-'}</td>
                        <td className="p-5">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => handleEditCategory(cat)} className="p-2 text-brand-500 hover:text-brand-900 bg-white rounded-xl shadow-sm border border-brand-100 transition-colors hover:shadow-md" title="Editar"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteCategory(cat._id)} className="p-2 text-red-400 hover:text-red-600 bg-white rounded-xl shadow-sm border border-brand-100 transition-colors hover:shadow-md" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            {loading ? (
              <div className="p-20 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div></div>
            ) : orders.length === 0 ? (
              <div className="p-20 text-center text-brand-500">
                <ListOrdered className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-serif">No hay órdenes de compra registradas aún.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-100/30 text-brand-800 text-[10px] uppercase tracking-widest border-b border-brand-100">
                      <th className="p-5 font-bold">Orden / Fecha</th>
                      <th className="p-5 font-bold">Cliente</th>
                      <th className="p-5 font-bold">Total</th>
                      <th className="p-5 font-bold">Estado</th>
                      <th className="p-5 font-bold">Actualizar Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-100/50">
                    {orders.map(order => (
                      <tr key={order._id} className="hover:bg-white/40 transition-colors">
                        <td className="p-5">
                          <span className="block text-xs font-mono text-brand-500 mb-1">#{order._id.slice(-6)}</span>
                          <span className="text-sm font-bold text-brand-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="p-5">
                          <span className="block text-sm font-bold text-brand-900">{order.shippingAddress.fullName}</span>
                          <span className="text-xs text-brand-500">{order.user?.email}</span>
                        </td>
                        <td className="p-5 text-brand-900 font-bold">
                          ${new Intl.NumberFormat('es-AR').format(order.totalPrice)}
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block border ${
                            order.status === 'Pendiente' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            order.status === 'Pagado' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            order.status === 'Enviado' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            order.status === 'Entregado' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-5">
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="bg-white/50 backdrop-blur-sm border border-brand-200 text-brand-800 text-xs font-bold tracking-wide rounded-xl focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 outline-none shadow-sm cursor-pointer hover:bg-white transition-colors"
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Pagado">Pagado</option>
                            <option value="Preparando">Preparando</option>
                            <option value="Enviado">Enviado</option>
                            <option value="Entregado">Entregado</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div>
            {loading ? (
              <div className="p-20 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div></div>
            ) : users.length === 0 ? (
              <div className="p-20 text-center text-brand-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-serif">No hay usuarios registrados.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-100/30 text-brand-800 text-[10px] uppercase tracking-widest border-b border-brand-100">
                      <th className="p-5 font-bold">Usuario</th>
                      <th className="p-5 font-bold">Email</th>
                      <th className="p-5 font-bold">Fecha de Registro</th>
                      <th className="p-5 font-bold">Permisos actuales</th>
                      <th className="p-5 font-bold">Cambiar Rol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-100/50">
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-white/40 transition-colors">
                        <td className="p-5 font-bold text-brand-900">{u.name}</td>
                        <td className="p-5 text-sm text-brand-600">{u.email}</td>
                        <td className="p-5 text-sm font-medium text-brand-900">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block border ${
                            u.role === 'admin' ? 'bg-brand-900 text-white border-brand-900' : 'bg-gray-100 text-gray-600 border-gray-200'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-5">
                          <select 
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            disabled={u._id === user.id}
                            className="bg-white/50 backdrop-blur-sm border border-brand-200 text-brand-800 text-xs font-bold tracking-wide rounded-xl focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 outline-none shadow-sm cursor-pointer hover:bg-white transition-colors disabled:opacity-50"
                          >
                            <option value="cliente">Cliente</option>
                            <option value="admin">Administrador</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Mensajes Tab */}
        {activeTab === 'messages' && (
          <div className="p-4 sm:p-8 animate-fade-in">
            <h2 className="text-3xl font-serif text-brand-900 mb-8">Centro de Mensajes</h2>
            <AdminChat />
          </div>
        )}
      </div>

      {showForm && (
        <ProductForm 
          onClose={() => setShowForm(false)} 
          onSuccess={() => {
            setShowForm(false);
            fetchProducts();
          }}
          productToEdit={editingProduct}
        />
      )}
      
      {showCategoryForm && (
        <CategoryForm 
          onClose={() => setShowCategoryForm(false)} 
          onSuccess={() => {
            setShowCategoryForm(false);
            fetchCategories();
          }}
          categoryToEdit={editingCategory}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
