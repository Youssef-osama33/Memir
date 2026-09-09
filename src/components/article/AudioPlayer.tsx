"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export default function AudioPlayer({ textTitle, textContent }: { textTitle?: string, textContent?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const initUtterance = () => {
    if (!synthRef.current) return null;
    
    // Clean text: remove HTML tags if any, though it's better to pass plain text
    const cleanContent = textContent ? textContent.replace(/<[^>]+>/g, '') : '';
    const fullText = `${textTitle || ''}. ${cleanContent}`;
    
    if (!fullText.trim()) return null;

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'ar-SA'; // Arabic
    utterance.rate = 0.9; // Slightly slower for better comprehension of analysis
    
    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    utterance.onboundary = (event) => {
      // Very rough progress estimation based on character index
      if (event.name === 'word') {
        const percent = Math.min(100, (event.charIndex / fullText.length) * 100);
        setProgress(percent);
      }
    };

    utteranceRef.current = utterance;
    return utterance;
  };

  const togglePlay = () => {
    if (!synthRef.current || !isSupported) return;

    if (isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
    } else {
      if (synthRef.current.paused) {
        synthRef.current.resume();
      } else {
        const utterance = initUtterance();
        if (utterance) {
          if (isMuted) utterance.volume = 0;
          synthRef.current.speak(utterance);
        }
      }
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (utteranceRef.current) {
      utteranceRef.current.volume = isMuted ? 1 : 0;
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 bg-white border border-neutral-200 rounded-lg p-3 shadow-sm font-sans my-4" dir="rtl">
      <button 
        onClick={togglePlay}
        className="flex items-center justify-center w-10 h-10 bg-amber-800 text-white rounded-full hover:bg-amber-900 transition-colors shrink-0"
        aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} className="mr-1" />}
      </button>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex justify-between text-xs text-neutral-500 font-medium">
          <span>{isPlaying ? "جاري القراءة..." : "استمع للمقال"}</span>
          <span dir="ltr">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden relative">
          <div 
            className="bg-amber-800 h-full transition-all duration-300 absolute right-0"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <button 
        onClick={toggleMute}
        className="text-neutral-400 hover:text-neutral-600 transition-colors shrink-0"
        aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
}
