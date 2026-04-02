'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  sender: string;
  message: string;
}

export default function Home() {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:3001');
    }

    const socket = socketRef.current;

    socket.on('newMessage', (payload: Message) => {
      console.log('Received message:', payload);
      setMessages((prev) => [...prev, payload]);
    });

    return () => {
      socket.off('newMessage');
      // Chúng ta không đóng socket ở đây để giữ kết nối ổn định khi re-render
      // Chỉ khi component unmount hẳn mới cần (nhưng socket-io client sẽ tự handle khá tốt)
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = () => {
    if (userName.trim()) {
      setIsJoined(true);
    }
  };

  const handleSendMessage = () => {
    if (socketRef.current && inputValue.trim()) {
      socketRef.current.emit('sendMessage', {
        sender: userName,
        message: inputValue,
      });
      setInputValue('');
    }
  };


  if (!isJoined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700 animate-in fade-in zoom-in duration-300">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Chào mừng đến với Chat Socket
          </h1>
          <p className="text-gray-400 mb-6 text-center">Nhập tên của bạn để bắt đầu trò chuyện</p>
          <input
            type="text"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-white"
            placeholder="Tên của bạn..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                handleJoin();
              }
            }}

          />
          <button
            onClick={handleJoin}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Tham gia ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h1 className="text-xl font-bold tracking-tight">Chat Room</h1>
          </div>
          <div className="text-sm font-medium text-gray-400 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
            Đang đăng nhập với: <span className="text-blue-400 font-bold">{userName}</span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 italic">
              <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === userName ? 'items-end' : 'items-start'} animate-in slide-in-from-${msg.sender === userName ? 'right' : 'left'}-4 duration-300`}
              >
                <div
                  className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-2 shadow-lg ${
                    msg.sender === userName
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700'
                  }`}
                >
                  <p className="text-xs font-bold opacity-70 mb-1">{msg.sender}</p>
                  <p className="text-sm md:text-base leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="bg-gray-900/80 backdrop-blur-md border-t border-gray-800 p-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto flex space-x-3">
          <input
            type="text"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder-gray-500"
            placeholder="Viết tin nhắn của bạn..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                handleSendMessage();
              }
            }}
          />

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center shadow-lg shadow-blue-900/20"
          >
            Gửi
            <svg className="w-5 h-5 ml-2 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
