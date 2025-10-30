import React, { useState, useRef, useEffect } from 'react';
import { ChatIcon, XIcon, SendIcon, SparklesIcon } from './icons/Icons';
import * as api from '../services/api';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: 'ai', text: "Hello! How can I help you manage your CRM data today?" }]);
    }
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (input.trim() === '') return;
    
    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const aiResponseText = await api.postChatMessage(input);
        const aiMessage: Message = { sender: 'ai', text: aiResponseText };
        setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
        const errorMessage: Message = { sender: 'ai', text: "Sorry, I'm having trouble connecting right now." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-lg shadow-primary/40 hover:scale-110 transition-transform z-50"
        aria-label="Open AI Assistant"
      >
        {isOpen ? <XIcon className="w-6 h-6" /> : <ChatIcon className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-[90vw] md:max-w-md bg-card rounded-2xl shadow-2xl border border-border flex flex-col h-[60vh] z-40">
          <div className="p-4 border-b border-border flex items-center bg-transparent rounded-t-lg">
            <SparklesIcon className="w-6 h-6 text-primary mr-3" />
            <h3 className="font-semibold font-display text-lg text-foreground">AI Assistant</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-xs ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-muted-foreground rounded-bl-none'}`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-2xl bg-muted rounded-bl-none">
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-75"></span>
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-300"></span>
                        </div>
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder="Ask anything..."
                className="w-full px-4 py-2 bg-background border border-input rounded-full focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
              <button onClick={handleSend} disabled={isLoading} className="bg-primary text-primary-foreground p-3 rounded-full hover:opacity-90 disabled:bg-primary/50 disabled:cursor-not-allowed transition">
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatAssistant;
