import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Hi there! I am the VV Solutions AI assistant. How are you feeling today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      // Create a prompt that includes context about VV Solutions
      const prompt = `You are a compassionate, empathetic, and supportive AI assistant for "VV Solutions" (Valuable Voices). 
      VV Solutions is a free, 24/7 emotional support platform. 
      Your goal is to listen, validate feelings, and provide gentle motivation. 
      Do NOT provide medical advice. If someone is in severe distress, gently suggest they use the emergency helplines on the site.
      Keep responses relatively short and conversational.
      
      User says: "${userMsg}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || "I'm here for you." }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having a little trouble connecting right now, but please remember you can always reach out to us on WhatsApp!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-50 ${isOpen ? 'hidden' : ''}`}
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-slate-900 border border-pink-500/30 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden h-[500px] max-h-[80vh]">
          {/* Header */}
          <div className="bg-pink-600 p-4 flex justify-between items-center">
            <div className="text-white font-bold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> VV AI Assistant
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-pink-600 text-white rounded-tr-sm' : 'bg-slate-800 text-gray-200 border border-slate-700 rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-gray-400 p-3 rounded-2xl rounded-tl-sm border border-slate-700 flex gap-1">
                  <span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Link inside chat */}
          <div className="bg-slate-900 p-2 text-center border-t border-slate-800">
            <a href="https://wa.me/917411837814" target="_blank" rel="noopener noreferrer" className="text-xs text-pink-400 hover:underline">
              Need human support? Chat on WhatsApp
            </a>
          </div>

          {/* Input */}
          <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:border-pink-500"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
