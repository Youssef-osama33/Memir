"use client";

import { useEffect, useState, useRef } from "react";
import { Twitter, Copy, Check } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

export default function TextHighlighter({ articleUrl }: { articleUrl: string }) {
  const [selectedText, setSelectedText] = useState("");
  const [position, setPosition] = useState<Position | null>(null);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (text && text.length > 5) {
          // Check if selection is inside article content to avoid triggering on menus/footers
          const range = selection?.getRangeAt(0);
          const rect = range?.getBoundingClientRect();
          const isInsideArticle = range?.startContainer?.parentElement?.closest('.article-content');

          if (rect && isInsideArticle) {
            setSelectedText(text);
            setPosition({
              x: rect.left + rect.width / 2,
              y: rect.top - 10 + window.scrollY, // Position above the selection
            });
          } else {
            setPosition(null);
            setSelectedText("");
          }
        } else {
          setPosition(null);
          setSelectedText("");
          setCopied(false);
        }
      }, 50);
    };

    document.addEventListener("mouseup", handleMouseUp);
    
    // Also clear on mousedown if clicking outside
    const handleMouseDown = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPosition(null);
        setSelectedText("");
        setCopied(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  if (!position) return null;

  const handleShareTwitter = () => {
    const shareText = `"${selectedText}"\n\n— عبر منصة مِعمار`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(articleUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
    setPosition(null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`"${selectedText}"\n\n— عبر منصة مِعمار: ${articleUrl}`);
      setCopied(true);
      setTimeout(() => {
        setPosition(null);
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <div
      ref={popoverRef}
      className="absolute z-50 flex items-center gap-1 bg-[#111] text-white px-2 py-1.5 rounded-md shadow-xl transition-all duration-200 animate-in fade-in zoom-in-95 pointer-events-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -100%)", // Center horizontally, place above
      }}
      dir="rtl"
    >
      <button
        onClick={handleShareTwitter}
        className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-sm transition-colors text-xs font-sans font-medium"
        title="شارك عبر X"
      >
        <Twitter size={14} className="text-[#1DA1F2]" />
        <span>شارك</span>
      </button>
      
      <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
      
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-sm transition-colors text-xs font-sans font-medium"
        title="نسخ النص"
      >
        {copied ? (
          <>
            <Check size={14} className="text-green-400" />
            <span className="text-green-400">تم النسخ</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span>نسخ</span>
          </>
        )}
      </button>
      
      {/* Downward pointing triangle/arrow */}
      <div 
        className="absolute w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#111]"
        style={{
          bottom: "-8px",
          left: "50%",
          transform: "translateX(-50%)"
        }}
      ></div>
    </div>
  );
}
