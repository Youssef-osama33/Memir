import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getAuthorByName, getAuthorInitials } from "../lib/authors";

interface AuthorBylineProps {
  authorName: string;
  publishDate?: string;
  readingTime?: string;
  size?: "sm" | "md" | "lg";
  showTitle?: boolean;
  className?: string;
}

export function AuthorByline({
  authorName,
  publishDate,
  readingTime,
  size = "md",
  showTitle = false,
  className = "",
}: AuthorBylineProps) {
  const author = getAuthorByName(authorName);
  const avatarImage = author.avatarUrl || author.avatar;
  const initials = getAuthorInitials(author.name);

  const avatarSizes = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-11 h-11 text-sm",
  };

  const nameSizes = {
    sm: "text-xs",
    md: "text-xs md:text-sm",
    lg: "text-sm md:text-base font-bold",
  };

  const isLinkable = Boolean(author?.slug);

  const AvatarContent = (
    <div
      className={`relative rounded-full overflow-hidden border border-[#D97706]/40 group-hover:border-[#C86A00] transition-colors ${avatarSizes[size]} bg-[#FAF7F0] flex items-center justify-center font-serif font-bold text-[#8C4B00]`}
    >
      {avatarImage ? (
        <Image
          src={avatarImage}
          alt={author.name}
          fill
          sizes="48px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );

  return (
    <div className={`flex items-center gap-2.5 font-sans select-none text-right ${className}`} dir="rtl">
      {/* Author Avatar with signature amber ring */}
      {isLinkable ? (
        <Link
          href={`/authors/${author.slug}`}
          className="relative group block flex-shrink-0"
          title={`الملف الفكري: ${author.name}`}
        >
          {AvatarContent}
        </Link>
      ) : (
        <div className="relative block flex-shrink-0">
          {AvatarContent}
        </div>
      )}

      {/* Author Name and details */}
      <div className="flex flex-col leading-tight min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          {isLinkable ? (
            <Link
              href={`/authors/${author.slug}`}
              className={`${nameSizes[size]} font-bold text-[#C86A00] hover:text-[#9A4E00] transition-colors truncate hover:underline`}
            >
              {author.name}
            </Link>
          ) : (
            <span className={`${nameSizes[size]} font-bold text-neutral-800 truncate`}>
              {author.name}
            </span>
          )}

          {showTitle && author.title && (
            <span className="text-[10px] text-neutral-500 hidden sm:inline truncate">
              • {author.title}
            </span>
          )}
        </div>

        {(publishDate || readingTime) && (
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono mt-0.5">
            {publishDate && <span>{publishDate}</span>}
            {publishDate && readingTime && <span>•</span>}
            {readingTime && <span>{readingTime}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
