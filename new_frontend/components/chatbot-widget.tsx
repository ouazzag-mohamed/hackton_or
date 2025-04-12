'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { MessageCircle, Send, X, ThumbsUp, ThumbsDown, Maximize, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'fr' | 'ar'>('en');
  const [isFullPage, setIsFullPage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
    // Initialize with greeting message and set language from localStorage
  useEffect(() => {
    // Check for existing language preference
    const storedLanguage = localStorage.getItem('chatLanguage') as 'en' | 'fr' | 'ar';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    if (messages.length === 0) {
      const greetingMessages = {
        en: 'Hello! I am IRCHAD Assistant AI, your expert academic guidance counselor for Morocco. How can I help you today?',
        fr: 'Bonjour! Je suis IRCHAD Assistant AI, votre conseiller d\'orientation académique expert pour le Maroc. Comment puis-je vous aider aujourd\'hui?',
        ar: 'مرحبًا! أنا مساعد الإرشاد الذكي، مستشارك الخبير للتوجيه الأكاديمي في المغرب. كيف يمكنني مساعدتك اليوم؟'
      };
      
      setMessages([
        {
          sender: 'bot',
          text: greetingMessages[storedLanguage || 'en'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
    
    // Check for existing session in localStorage
    const storedSessionId = localStorage.getItem('chatSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Process text formatting for markdown-like elements
  const processTextFormatting = (text: string) => {
    // Convert URLs to links
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-emerald-500 underline">$1</a>');
    
    // Convert line breaks to <br>
    text = text.replace(/\n/g, '<br>');
    
    // Simple markdown for bold and italic
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    return text;
  };

  const sendMessage = async () => {
    if (message.trim() === '' || isLoading) return;
    
    const userMessage = {
      sender: 'user' as const,
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      // Get the backend URL - in dev it's likely localhost:3000, but in production it might be different
      // You may need to adjust this logic based on your deployment setup
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
      
      const response = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: userMessage.text,
          sessionId: sessionId
        })
      });
      
      const data = await response.json();
      
      // Store session ID if provided
      if (data.sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem('chatSessionId', data.sessionId);
      }
      
      const botMessage = {
        sender: 'bot' as const,
        text: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error communicating with the chatbot:', error);
        // Get more detailed error message to help with debugging
      console.log('Error details:', error);
      
      const errorMessage = {
        sender: 'bot' as const,
        text: 'I apologize for the inconvenience. It seems there\'s an issue connecting to the guidance service. Please check your network connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const clearChat = () => {
    const greetingMessages = {
      en: 'Chat history cleared. How can I help you today?',
      fr: 'Historique de conversation effacé. Comment puis-je vous aider aujourd\'hui?',
      ar: 'تم مسح سجل المحادثة. كيف يمكنني مساعدتك اليوم؟'
    };
    
    setMessages([
      {
        sender: 'bot',
        text: greetingMessages[language],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    
    // If we have a sessionId, clear the session on the server
    if (sessionId) {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
      fetch(`${backendUrl}/api/memory/clear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId })
      }).catch(error => {
        console.error('Error clearing chat memory:', error);
      });
    }
  };
  
  // Switch between languages
  const changeLanguage = (newLanguage: 'en' | 'fr' | 'ar') => {
    setLanguage(newLanguage);
    localStorage.setItem('chatLanguage', newLanguage);
    
    // Add a system message indicating language change
    const languageMessages = {
      en: 'Switched to English. How can I help you?',
      fr: 'Passé au français. Comment puis-je vous aider?',
      ar: 'تم التحويل إلى اللغة العربية. كيف يمكنني مساعدتك؟'
    };
    
    setMessages(prev => [
      ...prev,
      {
        sender: 'bot',
        text: languageMessages[newLanguage],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };
  
  // Toggle full page mode
  const toggleFullPageMode = () => {
    setIsFullPage(!isFullPage);
  };  // Messages for the rotating label in different languages
  const labelMessages = [
    { text: "Need guidance? Ask me! 🎓", lang: "en" },
    { text: "Besoin d'aide? Demandez-moi! 📚", lang: "fr" },
    { text: "تحتاج توجيه؟ اسألني! 🌟", lang: "ar" }
  ];
  const [labelIndex, setLabelIndex] = useState(0);
  
  // Auto-rotate languages in the label
  useEffect(() => {
    const interval = setInterval(() => {
      setLabelIndex((prevIndex) => (prevIndex + 1) % labelMessages.length);
    }, 3000); // Change every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Chatbot Icon with animated label above it */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        <div 
          className={cn(
            "bg-emerald-500 text-white px-3 py-1.5 rounded-lg mb-2 shadow-md text-sm font-medium transition-all duration-300",
            isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
          style={{ 
            direction: labelMessages[labelIndex].lang === "ar" ? "rtl" : "ltr",
            minWidth: "180px",
            textAlign: labelMessages[labelIndex].lang === "ar" ? "right" : "left"
          }}
        >
          <div className="animate-fadeIn">
            {labelMessages[labelIndex].text}
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "rounded-full shadow-lg transition-all duration-300",
            "bg-white border border-emerald-500 hover:scale-110",
            isOpen ? "opacity-0 pointer-events-none" : "opacity-100",
            "w-14 h-14 overflow-hidden p-0"
          )}
          aria-label="Open chat"
        >
          <Image 
            src="https://img.freepik.com/premium-vector/bot-icon-chatbot-icon-concept-vector-illustration_230920-1327.jpg"
            alt="IRCHAD Assistant AI"
            width={56}
            height={56}
            className="object-cover"
          />
        </button>
      </div>
        {/* Chatbot Window */}
      <div
        className={cn(
          "fixed z-50 flex flex-col bg-white rounded-2xl shadow-xl",
          "border border-gray-200 transition-all duration-300 overflow-hidden",
          isFullPage 
            ? "inset-4 md:inset-10 lg:inset-20" 
            : "bottom-5 right-5 w-full max-w-[350px] h-[500px]",
          isOpen ? "opacity-100 transform translate-y-0" : "opacity-0 pointer-events-none transform translate-y-4"
        )}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between p-3 bg-emerald-500 text-white">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full overflow-hidden">
              <Image 
                src="https://img.freepik.com/premium-vector/bot-icon-chatbot-icon-concept-vector-illustration_230920-1327.jpg" 
                alt="IRCHAD Assistant AI" 
                width={32} 
                height={32} 
                className="object-cover" 
              />
            </div>
            <h3 className="font-medium">IRCHAD Assistant AI</h3>
          </div>
          <div className="flex items-center space-x-2">
            {/* Language Switcher */}
            <div className="relative group">
              <button 
                className="p-1.5 rounded-full hover:bg-emerald-600 transition-colors"
                aria-label="Switch language"
              >
                <Globe size={18} />
              </button>
              <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button 
                  onClick={() => changeLanguage('en')}
                  className={cn("w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100", 
                    language === 'en' ? "text-emerald-500 font-medium" : "text-gray-700"
                  )}
                >
                  English
                </button>
                <button 
                  onClick={() => changeLanguage('fr')}
                  className={cn("w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100", 
                    language === 'fr' ? "text-emerald-500 font-medium" : "text-gray-700"
                  )}
                >
                  Français
                </button>
                <button 
                  onClick={() => changeLanguage('ar')}
                  className={cn("w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100", 
                    language === 'ar' ? "text-emerald-500 font-medium" : "text-gray-700"
                  )}
                >
                  العربية
                </button>
              </div>
            </div>
            
            {/* Full Page Toggle */}
            <button 
              onClick={toggleFullPageMode}
              className="p-1.5 rounded-full hover:bg-emerald-600 transition-colors"
              aria-label={isFullPage ? "Exit full page" : "Full page mode"}
            >
              <Maximize size={18} />
            </button>
            
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-emerald-600 transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "mb-4 max-w-[85%]",
                msg.sender === 'user' ? "ml-auto" : "mr-auto"
              )}
            >
              <div
                className={cn(
                  "p-3 rounded-2xl",
                  msg.sender === 'user' 
                    ? "bg-emerald-500 text-white rounded-br-none" 
                    : "bg-white border border-gray-200 rounded-bl-none"
                )}
              >
                <div 
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: processTextFormatting(msg.text) }}
                ></div>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">{msg.timestamp}</span>
                
                {/* Feedback buttons only for bot messages */}
                {msg.sender === 'bot' && (
                  <div className="flex space-x-1 ml-2">
                    <button className="text-gray-400 hover:text-emerald-500 transition" aria-label="Helpful">
                      <ThumbsUp size={12} />
                    </button>
                    <button className="text-gray-400 hover:text-red-500 transition" aria-label="Not helpful">
                      <ThumbsDown size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-center space-x-2 mb-4 max-w-[85%]">
              <div className="bg-white p-3 rounded-2xl border border-gray-200 rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your question here..."
              className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none overflow-hidden max-h-20"
              rows={1}
              style={{ height: 'auto' }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || message.trim() === ''}
              className={cn(
                "ml-2 w-10 h-10 rounded-full flex items-center justify-center transition",
                message.trim() === '' 
                  ? "bg-gray-200 text-gray-400" 
                  : "bg-emerald-500 text-white hover:bg-emerald-600"
              )}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
          
          {/* Additional controls */}
          <div className="flex justify-end mt-2">
            <button 
              onClick={clearChat}
              className="text-xs text-gray-500 hover:text-emerald-600"
            >
              Clear chat
            </button>
          </div>
        </div>
      </div>
    </>
  );
}