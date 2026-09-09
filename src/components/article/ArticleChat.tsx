"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ArticleChat({ slug, articleTitle }: { slug: string; articleTitle: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `مرحباً، أنا مساعد "مِعمار" الذكي. يمكنك سؤالي عن أي جزء غير واضح أو طلب تلخيص لنقاط معينة في مقال "${articleTitle}". كيف يمكنني مساعدتك؟`,
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    
    const newMessages: Message[] = [
      ...messages,
      { id: Date.now().toString(), role: "user", content: userMsg }
    ];
    
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/articles/${slug}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMessages.map(m => ({ role: m.role, content: m.content })) 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("يرجى تسجيل الدخول لاستخدام هذه الميزة.");
        }
        throw new Error(data.error || "تعذر الاتصال بالمساعد الذكي.");
      }

      setMessages([
        ...newMessages,
        { id: (Date.now() + 1).toString(), role: "assistant", content: data.text }
      ]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        { id: (Date.now() + 1).toString(), role: "assistant", content: `❌ ${err.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-[#111] text-white p-4 rounded-full shadow-2xl hover:bg-[#C86A00] transition-colors flex items-center justify-center group"
        title="اسأل المساعد الذكي عن هذا المقال"
      >
        <Sparkles size={24} className="group-hover:animate-pulse" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full sm:w-[450px] h-[85vh] sm:h-[600px] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300" dir="rtl">
            
            {/* Header */}
            <div className="bg-[#111] text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C86A00] flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm">مساعد مِعمار الاستراتيجي</h3>
                  <p className="text-[10px] text-neutral-400 font-sans opacity-80">مدعوم بنماذج Gemini الذكية</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FCFBF9] font-serif text-sm">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-1 text-white text-xs"
                         style={{ backgroundColor: msg.role === 'user' ? '#888' : '#C86A00' }}>
                      {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                    </div>
                    <div 
                      className={`p-3 rounded-xl leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user' 
                          ? 'bg-neutral-200 text-neutral-900 rounded-tr-none' 
                          : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-end">
                  <div className="flex gap-2 max-w-[85%] flex-row">
                    <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-1 bg-[#C86A00] text-white text-xs">
                      <Bot size={12} />
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-neutral-200 rounded-tl-none shadow-sm flex items-center gap-2 text-neutral-500">
                      <Loader2 size={14} className="animate-spin" />
                      <span className="text-xs">جاري التفكير...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-neutral-200 shrink-0">
              <form onSubmit={handleSubmit} className="flex items-end gap-2 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="اسأل عن أي جزء في المقال..."
                  className="w-full bg-[#FCFBF9] border border-neutral-300 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-none min-h-[44px] max-h-[120px]"
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute left-2 bottom-2 w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:bg-neutral-400"
                >
                  <Send size={14} className="mr-0.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
