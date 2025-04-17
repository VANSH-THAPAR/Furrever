import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaComments } from 'react-icons/fa';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data?.message?.role && data?.message?.content) {
        setMessages(prev => [...prev, data.message]);
      } else {
        console.error('Unexpected response:', data);
      }
    } catch (err) {
      console.error('Failed to fetch reply:', err);
    }
  };

  return (
    <div
      className={`chatbot-container fixed bottom-6 right-6 ${
        isOpen ? 'w-96' : 'w-16'
      } bg-white rounded-xl shadow-lg transition-all duration-500 ease-in-out`}
      style={{ zIndex: 999 }}
    >
      {/* Chat Window */}
      {isOpen ? (
        <motion.div
          className="messages p-4 space-y-4 max-h-80 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`message ${m.role} rounded-xl p-3 max-w-xs`}
              style={{
                backgroundColor: m.role === 'user' ? '#D1E7FF' : '#F3F4F6',
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <strong>{m.role === 'user' ? 'You' : 'Bot'}:</strong> {m.content}
            </motion.div>
          ))}
        </motion.div>
      ) : null}

      {/* Input Area */}
      {isOpen ? (
        <div className="input-area p-4 flex items-center space-x-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="w-full p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            className="px-4 py-2 bg-indigo-600 text-white rounded-full shadow-md"
          >
            Send
          </motion.button>
        </div>
      ) : null}

      {/* Close Button */}
      {isOpen ? (
        <motion.div
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-200 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(false)}
        >
          <span className="text-xl font-bold">×</span>
        </motion.div>
      ) : null}

      {/* Chat Icon Button */}
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        className="chat-toggle-btn fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full cursor-pointer shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaComments size={24} />
      </motion.div>
    </div>
  );
}
