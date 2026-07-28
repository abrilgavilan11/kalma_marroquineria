import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Send, User, MessageSquare } from 'lucide-react';

const AdminChat = () => {
  const { user } = useContext(AuthContext);
  const { socket, sendMessage } = useContext(ChatContext);
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/messages/conversations', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.success) {
        setConversations(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Escuchar mensajes globales
  useEffect(() => {
    if (socket) {
      const handleReceive = (message) => {
        // If the message belongs to the active conversation, append it
        if (activeUser && (message.sender._id === activeUser._id || message.receiver._id === activeUser._id)) {
          setMessages(prev => [...prev, message]);
        }
        // Always refresh conversations to update lastMessage and unreadCount
        fetchConversations();
      };
      socket.on('receiveMessage', handleReceive);
      return () => {
        socket.off('receiveMessage', handleReceive);
      };
    }
  }, [socket, activeUser]);

  const loadConversation = async (clientUser) => {
    setActiveUser(clientUser);
    try {
      // Mark as read
      await fetch(`http://localhost:5000/api/messages/read/${clientUser._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.token}` }
      });

      const res = await fetch(`http://localhost:5000/api/messages/${clientUser._id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
        fetchConversations(); // refresh unread count
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUser) return;
    sendMessage(activeUser._id, newMessage);
    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-brand-100 flex overflow-hidden h-[600px]">
      {/* Left Sidebar - Conversations */}
      <div className="w-1/3 border-r border-brand-100 flex flex-col bg-brand-50/30">
        <div className="p-6 border-b border-brand-100 bg-white">
          <h2 className="font-serif font-bold text-xl text-brand-900">Mensajes</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="p-6 text-sm text-brand-500 font-light text-center">No hay conversaciones aún.</p>
          ) : (
            conversations.map((conv) => (
              <div 
                key={conv.user._id} 
                onClick={() => loadConversation(conv.user)}
                className={`p-4 border-b border-brand-100 cursor-pointer flex gap-4 transition-colors ${activeUser?._id === conv.user._id ? 'bg-brand-100/50' : 'hover:bg-brand-50'}`}
              >
                <div className="w-10 h-10 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-brand-900 text-sm truncate">{conv.user.name}</h4>
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-500 truncate">{conv.lastMessage?.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Content - Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {activeUser ? (
          <>
            <div className="p-6 border-b border-brand-100 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-brand-900 text-brand-100 flex items-center justify-center shrink-0">
                  <span className="font-bold uppercase">{activeUser.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-brand-900">{activeUser.name}</h3>
                  <p className="text-xs text-brand-500">{activeUser.email}</p>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-brand-50/10 flex flex-col gap-4">
               {messages.length === 0 ? (
                 <p className="text-center text-brand-400 text-sm mt-10 font-light">Aún no hay mensajes. Escribe algo para iniciar la conversación.</p>
               ) : (
                 messages.map((msg, i) => {
                  const isMe = msg.sender === user.id || msg.sender?._id === user.id;
                  return (
                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-4 rounded-2xl text-sm shadow-sm ${
                        isMe 
                          ? 'bg-brand-900 text-white rounded-tr-sm' 
                          : 'bg-white text-brand-900 border border-brand-100 rounded-tl-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })
               )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-brand-100 flex gap-4 items-center bg-white">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="flex-1 bg-brand-50 border-none px-6 py-3 rounded-full outline-none focus:ring-1 focus:ring-brand-500 text-brand-900"
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="w-12 h-12 bg-brand-900 text-white rounded-full flex items-center justify-center hover:bg-brand-800 disabled:opacity-50 transition-colors shrink-0"
              >
                <Send className="w-5 h-5 -ml-1" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-brand-300">
            <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
            <p className="font-light">Selecciona una conversación para empezar a chatear.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
