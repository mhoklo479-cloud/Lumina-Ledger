import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Bot, User, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import { generateFinancialAdvice } from '../services/geminiService';
import { TRANSLATIONS } from '../types';
import ReactMarkdown from 'react-markdown';

const AIFinancialAdvisor = () => {
  const { invoices, products, language, chatHistory, addChatMessage, clearChat } = useStore();
  const t = TRANSLATIONS[language];
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRTL = language === 'ar';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setIsLoading(true);

    // Add User Message
    addChatMessage({
      id: Date.now().toString(),
      role: 'user',
      text: userMsg,
      timestamp: Date.now()
    });

    // Get AI Response
    const response = await generateFinancialAdvice(userMsg, chatHistory, invoices, products, language);

    // Add AI Message
    addChatMessage({
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: response,
      timestamp: Date.now()
    });

    setIsLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
       <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <Sparkles className="text-white w-6 h-6" />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.aiInsights}</h1>
                <p className="text-xs text-slate-500">Powered by Gemini 2.5 Flash</p>
             </div>
          </div>
          {chatHistory.length > 0 && (
             <button 
              onClick={clearChat}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Clear History"
             >
                <Trash2 size={20} />
             </button>
          )}
       </div>

       {/* Chat Area */}
       <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col relative">
          
          {chatHistory.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-60">
                <Bot size={64} className="text-indigo-300 dark:text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">How can I help you today?</h3>
                <p className="text-slate-500 max-w-sm">Ask about your revenue, top selling products, pending invoices, or general financial advice.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-lg">
                   {['Analyze my revenue', 'Who owes me money?', 'Which product is low stock?', 'Draft a polite payment reminder'].map(q => (
                      <button 
                        key={q} 
                        onClick={() => { setInput(q); }}
                        className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
                      >
                         {q}
                      </button>
                   ))}
                </div>
             </div>
          ) : (
             <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {chatHistory.map((msg) => (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     key={msg.id} 
                     className={`flex gap-4 ${msg.role === 'user' ? (isRTL ? 'flex-row' : 'flex-row-reverse') : (isRTL ? 'flex-row-reverse' : 'flex-row')}`}
                   >
                      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-indigo-600 text-white'}`}>
                         {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                      </div>
                      <div className={`max-w-[80%] px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-sm
                         ${msg.role === 'user' 
                           ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tr-none' // User bubble
                           : 'bg-indigo-50 dark:bg-indigo-900/20 text-slate-800 dark:text-indigo-100 rounded-tl-none border border-indigo-100 dark:border-indigo-900/30' // AI Bubble
                         }
                      `}>
                         <ReactMarkdown className="prose dark:prose-invert prose-sm max-w-none">
                            {msg.text}
                         </ReactMarkdown>
                      </div>
                   </motion.div>
                ))}
                {isLoading && (
                   <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                         <Bot size={20} />
                      </div>
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 px-5 py-4 rounded-3xl rounded-tl-none flex gap-1">
                         <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                         <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                         <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                   </div>
                )}
                <div ref={messagesEndRef} />
             </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
             <form onSubmit={handleSend} className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.chatPlaceholder}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-6 pr-14 py-4 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white shadow-inner"
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className={`absolute ${isRTL ? 'left-2' : 'right-2'} p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md`}
                >
                   <Send size={20} className={isRTL ? 'rotate-180' : ''} />
                </button>
             </form>
             <div className="text-center mt-2">
                <p className="text-[10px] text-slate-400">{t.aiDisclaimer}</p>
             </div>
          </div>
       </div>
    </div>
  );
};

export default AIFinancialAdvisor;