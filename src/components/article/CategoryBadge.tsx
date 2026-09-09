import React from "react";
import Link from "next/link";
import { getCategoryBySlug } from "../../lib/categories";
import CategoryIcon from "../CategoryIcon";

export default function CategoryBadge({
  categorySlug,
  className = "",
}: {
  categorySlug: string;
  className?: string;
}) {
  const cat = getCategoryBySlug(categorySlug);
  
  if (!cat) {
    return (
      <span className={`inline-block text-[10px] font-sans font-bold text-neutral-500 uppercase ${className}`}>
        {categorySlug}
      </span>
    );
  }

  const { theme, isHorizontal } = cat;

  return (
    <Link
      href={isHorizontal ? "/books" : `/categories/${cat.slug}`}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border ${theme.bg} ${theme.border} ${theme.text} hover:opacity-80 transition-opacity ${className}`}
      title={cat.title}
    >
      <CategoryIcon name={theme.iconName} className="w-3 h-3" />
      <span className="text-[10px] font-sans font-bold leading-none translate-y-[1px]">
        {cat.title}
      </span>
    </Link>
  );
}
