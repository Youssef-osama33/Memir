'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreatePostForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل في نشر الموضوع');
      
      setIsOpen(false);
      setTitle('');
      setContent('');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[#111111] text-[#FCFBF9] px-6 py-3 rounded-xs text-xs font-bold flex items-center gap-2 hover:bg-neutral-800 transition-colors shrink-0"
      >
        <Plus className="w-4 h-4" />
        <span>موضوع جديد</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-xs shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-serif font-bold">طرح موضوع جديد</h2>
              <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-black transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
              {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xs">{error}</div>}
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-700">عنوان الموضوع</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#FCFBF9] border border-neutral-200 p-3 rounded-xs text-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="اكتب عنواناً واضحاً..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-700">المحتوى</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-48 bg-[#FCFBF9] border border-neutral-200 p-3 rounded-xs text-sm focus:outline-none focus:border-black transition-colors resize-y leading-relaxed font-serif"
                  placeholder="تفاصيل الموضوع، يمكنك المشاركة بتحليل، سؤال، أو فكرة للنقاش..."
                  required
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-neutral-500 hover:text-black transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className="bg-[#C86A00] text-white px-6 py-2.5 rounded-xs text-xs font-bold hover:bg-[#8C4B00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'جاري النشر...' : 'نشر الموضوع'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
