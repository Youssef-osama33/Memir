"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="bg-black text-white text-[10px] font-bold px-3 py-1 hover:bg-neutral-800 transition-all flex items-center gap-1.5 cursor-pointer font-sans"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>تم النسخ!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>نسخ الرابط</span>
        </>
      )}
    </button>
  );
}
