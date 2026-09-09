'use client';

import { useEffect, useState } from 'react';

interface HeadingInfo {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<HeadingInfo[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Small delay to ensure content is rendered
    const timeout = setTimeout(() => {
      const elements = Array.from(document.querySelectorAll('.article-content h2, .article-content h3'));
      const headingData = elements.map((el, index) => {
        // Ensure element has an ID
        if (!el.id) {
          el.id = `heading-${index}`;
        }
        return {
          id: el.id,
          text: el.textContent || '',
          level: el.tagName === 'H2' ? 2 : 3,
        };
      });
      setHeadings(headingData);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="hidden lg:block sticky top-24 mr-8 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="mb-4 text-xs font-bold font-mono tracking-widest text-neutral-400 uppercase">
        فهرس المقال
      </div>
      <nav className="space-y-2 border-r border-neutral-200 pr-4">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`block text-xs font-serif transition-colors leading-relaxed ${
              heading.level === 3 ? 'pr-3' : ''
            } ${
              activeId === heading.id 
                ? 'text-[#C86A00] font-bold' 
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
