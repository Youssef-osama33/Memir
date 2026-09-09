'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle search (debounced)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.articles || []);
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4" dir="rtl">
      {/* Background click target */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="bg-white w-full max-w-3xl rounded-sm shadow-2xl relative flex flex-col max-h-[75vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Header */}
        <div className="relative flex items-center p-4 border-b border-neutral-100">
          <Search className="w-6 h-6 text-neutral-400 absolute right-6" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none py-4 pr-12 pl-14 text-xl font-serif text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-0"
            placeholder="ابحث في التحليلات، المقالات، والكُتاب..."
          />
          <button 
            onClick={onClose}
            className="absolute left-6 text-neutral-400 hover:text-black transition-colors p-1 bg-neutral-100 rounded-sm hover:bg-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto flex-grow p-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#C86A00]" />
              <p className="text-sm font-bold">جاري البحث...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col">
              {results.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  onClick={onClose}
                  className="flex flex-col p-4 rounded-sm hover:bg-[#FFFDF5] group transition-colors border-b border-neutral-50 last:border-0"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-neutral-900 group-hover:text-[#C86A00] transition-colors mb-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-neutral-500 font-serif leading-relaxed line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-mono">
                        <span className="font-bold text-[#8C4B00]">{article.category}</span>
                        <span>•</span>
                        <span>{article.author}</span>
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-neutral-300 group-hover:text-[#C86A00] transition-colors mt-2 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          ) : query.trim() !== '' ? (
            <div className="text-center py-20">
              <FileText className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
              <p className="text-neutral-500 font-bold font-serif">لم نجد أي مقالات مطابقة لبحثك.</p>
              <p className="text-xs text-neutral-400 mt-2">جرب استخدام كلمات مفتاحية أخرى أو أسماء كُتاب.</p>
            </div>
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center py-20 opacity-40">
              <div className="flex items-center justify-center gap-12">
                <div className="text-center">
                  <div className="bg-neutral-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-5 h-5 text-neutral-400" />
                  </div>
                  <span className="text-xs font-bold text-neutral-500 block">ابحث في الأرشيف</span>
                </div>
                <div className="text-center">
                  <div className="bg-neutral-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-neutral-400 font-serif text-lg leading-none">مِ</span>
                  </div>
                  <span className="text-xs font-bold text-neutral-500 block">اكتشف التحليلات</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-neutral-50 border-t border-neutral-100 p-3 flex justify-between items-center text-[10px] text-neutral-400 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="bg-white border border-neutral-200 px-1.5 py-0.5 rounded-xs font-sans">↑</kbd>
              <kbd className="bg-white border border-neutral-200 px-1.5 py-0.5 rounded-xs font-sans">↓</kbd>
              للتنقل
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-white border border-neutral-200 px-1.5 py-0.5 rounded-xs font-sans">Enter</kbd>
              للاختيار
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="bg-white border border-neutral-200 px-1.5 py-0.5 rounded-xs font-sans">ESC</kbd>
            للإغلاق
          </span>
        </div>
      </div>
    </div>
  );
}
