'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReplyForm({ postId }: { postId: string }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await fetch(`/api/community/${postId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل في إضافة الرد');
      
      setContent('');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FFFDF5] border border-amber-800/20 p-6 rounded-xs mt-8 shadow-sm">
      <h3 className="font-serif font-bold text-amber-900 mb-4">إضافة رد</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xs">{error}</div>}
        
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-32 bg-white border border-amber-800/20 p-4 rounded-xs text-sm focus:outline-none focus:border-amber-800 transition-colors resize-y leading-relaxed font-serif"
          placeholder="اكتب ردك أو تعليقك هنا..."
          required
        />
        
        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="bg-[#111111] text-white px-8 py-3 rounded-xs text-xs font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرد'}
          </button>
        </div>
      </form>
    </div>
  );
}
