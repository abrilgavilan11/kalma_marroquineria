import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { MessageSquare, X, Send } from 'lucide-react';

const ClientChatWidget = () => {
  const { user } = useContext(AuthContext);
  const { socket, unreadCount, markAsRead, sendMessage, isChatOpen, setIsChatOpen } = useContext(ChatContext);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [adminUser, setAdminUser] = useState(null); // The admin we are talking to
  const messagesEndRef = useRef(null);


  // Cargar historial al abrir
  useEffect(() => {
    if (isChatOpen) {
      if (adminUser) markAsRead(adminUser._id);
      fetchMessages();
    }
  }, [isChatOpen]);

  // Escuchar mensajes nuevos
  useEffect(() => {
    if (socket) {
      const handleReceive = (message) => {
        setMessages(prev => [...prev, message]);
        if (isChatOpen && message.sender._id !== user.id) {
          markAsRead(message.sender._id);
        }
      };
      socket.on('receiveMessage', handleReceive);
      return () => {
        socket.off('receiveMessage', handleReceive);
      };
    }
  }, [socket, isChatOpen]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen]);

  // Bloquear scroll de la página al abrir el chat
  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isChatOpen]);

  const fetchMessages = async () => {
    try {
      // Para simplificar, buscamos los admins y tomamos el primero, o el backend nos da los mensajes si llamamos a un endpoint especial.
      // Pero podemos usar un "admin genérico" si el admin responde. 
      // Sin embargo, getMessages espera el ID del otro usuario. 
      // Necesitamos una ruta para que el cliente obtenga sus mensajes con el admin.
      // Agregaremos una lógica rápida: el cliente obtiene mensajes enviando "admin" como ID, 
      // y el backend lo resolverá. Pero como no tenemos eso, hagamos fetch a los admins, o mejor, que el backend se encargue.
      // Modificaremos temporalmente fetch a un endpoint si hace falta.
      // Let's assume there's exactly one admin or we fetch the messages with the most recent admin.
      const res = await fetch(`http://localhost:5000/api/users/admin`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.success) {
        const admin = data.data;
        if (admin) {
          setAdminUser(admin);
          const msgRes = await fetch(`http://localhost:5000/api/messages/${admin._id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const msgData = await msgRes.json();
          if (msgData.success) {
            setMessages(msgData.data);
            markAsRead(admin._id);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !adminUser) return;
    
    sendMessage(adminUser._id, newMessage);
    setNewMessage('');
  };

  // Solo los clientes ven este widget
  if (!user || user.role !== 'cliente') return null;

  return (
    <>
      {/* Overlay difuminado estático */}
      {isChatOpen && (
        <div 
          className="fixed inset-0 bg-brand-900/10 backdrop-blur-[2px] z-40 transition-opacity animate-fade-in"
          onClick={() => setIsChatOpen(false)}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50">
        {/* Botón Flotante (oculto en móviles porque ya está en el navbar) */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`${isChatOpen ? 'flex' : 'hidden md:flex'} w-14 h-14 bg-brand-900 text-white rounded-full items-center justify-center shadow-2xl hover:bg-brand-800 transition-all hover:-translate-y-1 relative`}
      >
        {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isChatOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-brand-50">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Ventana de Chat */}
      {isChatOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-brand-100 flex flex-col overflow-hidden animate-slide-up" style={{ height: '500px', maxHeight: '80vh' }}>
          {/* Header */}
          <div className="bg-brand-900 text-brand-100 p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold tracking-widest uppercase text-sm text-white">Atención al Cliente</h3>
              <p className="text-xs text-brand-300 font-light">Normalmente responde en unos minutos</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-brand-50/50 flex flex-col gap-3">
            {messages.length === 0 ? (
              <p className="text-center text-brand-500 text-sm mt-10 font-light">Escríbenos, estamos aquí para ayudarte.</p>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.sender === user.id || msg.sender?._id === user.id;
                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                      isMe 
                        ? 'bg-brand-900 text-white rounded-tr-sm' 
                        : 'bg-white text-brand-800 border border-brand-100 rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-brand-100 flex gap-2">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-brand-50 border-none px-4 py-2 rounded-full text-sm outline-none focus:ring-1 focus:ring-brand-500 text-brand-900"
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="w-10 h-10 bg-brand-900 text-white rounded-full flex items-center justify-center hover:bg-brand-800 disabled:opacity-50 transition-colors shrink-0"
            >
              <Send className="w-4 h-4 -ml-0.5" />
            </button>
          </form>
        </div>
      )}
    </div>
    </>
  );
};

export default ClientChatWidget;
