"use client";

import React, { useState, useMemo } from "react";
import { Search, Mail, Calendar, User, MessageSquare, Inbox, Reply } from "lucide-react";

export interface ContactSubmissionItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface ContactSubmissionsListProps {
  initialSubmissions: ContactSubmissionItem[];
}

export default function ContactSubmissionsList({ initialSubmissions }: ContactSubmissionsListProps) {
  const [submissions] = useState<ContactSubmissionItem[]>(initialSubmissions);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredSubmissions = useMemo(() => {
    if (!search.trim()) return submissions;
    const q = search.toLowerCase().trim();
    return submissions.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.subject.toLowerCase().includes(q) ||
        s.message.toLowerCase().includes(q)
    );
  }, [submissions, search]);

  return (
    <div className="space-y-5" dir="rtl">
      {/* Summary KPI Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
        <span className="bg-white border border-[#E5E2DC] px-3 py-1.5 rounded-xs font-bold text-neutral-800">
          إجمالي الرسائل الواردة: <span className="font-mono text-[#C86A00]">{submissions.length}</span>
        </span>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#E5E2DC] p-4 rounded-sm shadow-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث في الرسائل، أسماء المرسلين، أو العناوين..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FCFBF9] border border-neutral-300 text-xs py-2 pr-8 pl-3 rounded-xs focus:outline-none focus:border-neutral-900"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-3" />
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-3">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white border border-[#E5E2DC] p-4 sm:p-5 rounded-sm shadow-xs hover:border-neutral-400 transition-colors space-y-3"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 font-sans text-sm">
                        {item.subject}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-sans mt-1">
                      <span className="font-bold text-neutral-800">{item.name}</span>
                      <span className="text-neutral-300">•</span>
                      <a
                        href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject)}`}
                        className="font-mono text-[11px] text-[#C86A00] hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        <span>{item.email}</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {new Date(item.createdAt).toLocaleString("ar-EG")}
                    </span>
                    <a
                      href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject)}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-xs transition-colors"
                    >
                      <Reply className="w-3 h-3" />
                      <span>رد مباشر</span>
                    </a>
                  </div>
                </div>

                {/* Message Body */}
                <div className="bg-[#FAF7F0] p-4 rounded-xs border border-neutral-100 text-xs font-serif text-neutral-800 leading-relaxed whitespace-pre-wrap">
                  {item.message}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-[#E5E2DC] p-12 text-center text-neutral-400 font-serif rounded-sm">
            <Inbox className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
            <p>لا توجد رسائل تواصل واردة مسجلة في الوقت الحالي.</p>
          </div>
        )}
      </div>
    </div>
  );
}
