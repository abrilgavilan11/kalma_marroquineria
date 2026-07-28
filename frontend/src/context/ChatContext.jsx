import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      newSocket.emit('join', user.id);

      // Listen for unread count updates implicitly when a new message arrives globally
      newSocket.on('receiveMessage', (message) => {
        if (message.sender._id !== user.id) {
          // If we receive a message and we are not the sender, increment unread
          // The actual chat components will also listen to receiveMessage to append the text
          setUnreadCount(prev => prev + 1);
        }
      });

      // Fetch initial unread count
      fetch('http://localhost:5000/api/messages/unread/count', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUnreadCount(data.data);
      })
      .catch(err => console.error(err));

      return () => {
        newSocket.disconnect();
      };
    } else {
      setSocket(null);
      setUnreadCount(0);
    }
  }, [user]);

  const sendMessage = (receiverId, content) => {
    if (socket && user) {
      socket.emit('sendMessage', {
        sender: user.id,
        receiver: receiverId,
        content
      });
    }
  };

  const markAsRead = async (senderId) => {
    if (user) {
      try {
        await fetch(`http://localhost:5000/api/messages/read/${senderId}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${user.token}` }
        });
        // We could fetch the count again, or just assume it decreases/clears
        // For simplicity, we just fetch again
        const res = await fetch('http://localhost:5000/api/messages/unread/count', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (data.success) setUnreadCount(data.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <ChatContext.Provider value={{ socket, unreadCount, setUnreadCount, sendMessage, markAsRead, isChatOpen, setIsChatOpen }}>
      {children}
    </ChatContext.Provider>
  );
};
