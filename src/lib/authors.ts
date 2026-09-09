import { db } from "./db";

export interface AuthorProfile {
  id?: string;
  name: string;
  slug: string;
  title?: string;
  bio?: string;
  avatarUrl?: string | null;
  avatar?: string;
  createdAt?: string | Date;
}

/**
 * Standard dictionary of known authors in Me'mar, including the founder & strategic researchers.
 */
export const AUTHORS: Record<string, AuthorProfile> = {
  "يوسف أسامة": {
    name: "يوسف أسامة",
    slug: "youssef-osama",
    title: "مؤسس وباحث في الشؤون الاستراتيجية والتقنية",
    bio: "باحث في نظم الذكاء الاصطناعي وجيوسياسة التكنولوجيا وتحليل التحولات السيادية المعاصرة، يشرف على الأطر المنهجية لمنصة مِعمار.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=faces&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=faces&q=80",
  },
  "د. طارق الحكيم": {
    name: "د. طارق الحكيم",
    slug: "tariq-al-hakim",
    title: "كبير باحثي الجيوسياسة والذكاء الاصطناعي",
    bio: "باحث متخصص في تقاطعات الذكاء الاصطناعي مع توازنات القوى الدولية وحروب أشباه الموصلات. عمل مستشاراً في سياسات التقنية السيادية.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces&q=80",
  },
  "د. عبد الرحمن الصالح": {
    name: "د. عبد الرحمن الصالح",
    slug: "abdulrahman-al-saleh",
    title: "باحث في الفكر الحضاري وفلسفة التقنية",
    bio: "أكاديمي متخصص في دراسات الاستعمار المعرفي ونظريات مالك بن نبي، يبحث في أسئلة السيادة التقنية في ضوء فقه الواقع.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces&q=80",
  },
  "أحمد بن يوسف": {
    name: "أحمد بن يوسف",
    slug: "ahmed-bin-youssef",
    title: "محرر الشؤون الفكرية ومراجعات الكتب الاستراتيجية",
    bio: "كاتب ومترجم في مجالات الفلسفة السياسية والتاريخ التقني، يشرف على جناح مراجعات الكتب الكبرى في مِعمار.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces&q=80",
  },
  "م. خالد الأنصاري": {
    name: "م. خالد الأنصاري",
    slug: "khaled-al-ansari",
    title: "استشاري البنية التحتية والحروب السيبرانية",
    bio: "مهندس نظم ومحلل للبنى التحتية الحيوية، متخصص في كابلات الاتصالات البحرية وشبكات الطاقة والأنظمة الموزعة.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces&q=80",
  },
};

/**
 * Phonetic transliteration map from Arabic characters to Latin letters.
 */
const ARABIC_TO_LATIN: Record<string, string> = {
  "أ": "a", "إ": "i", "آ": "a", "ا": "a",
  "ب": "b", "ت": "t", "ث": "th", "ج": "j",
  "ح": "h", "خ": "kh", "د": "d", "ذ": "dh",
  "ر": "r", "ز": "z", "س": "s", "ش": "sh",
  "ص": "s", "ض": "d", "ط": "t", "ظ": "z",
  "ع": "a", "غ": "gh", "ف": "f", "ق": "q",
  "ك": "k", "ل": "l", "م": "m", "ن": "n",
  "ه": "h", "و": "w", "ي": "y", "ى": "a",
  "ة": "ah", "ء": "", "ئ": "y", "ؤ": "u",
  "لا": "la", "لإ": "li", "لأ": "la", "لآ": "la",
};

/**
 * Converts any author name into a clean, URL-friendly slug.
 */
export function slugifyAuthor(name: string): string {
  if (!name) return "editorial-team";
  const trimmed = name.trim();

  // 1. Direct dictionary match
  if (AUTHORS[trimmed]) {
    return AUTHORS[trimmed].slug;
  }

  // 2. Remove common Arabic honorific titles (e.g. د. / م. / أ. / الشيخ / المستشار)
  let cleaned = trimmed
    .replace(/^(د\.|م\.|أ\.|الدكتور|المهندس|الأستاذ)\s+/gi, "")
    .trim();

  // If match exists for cleaned name in AUTHORS
  for (const author of Object.values(AUTHORS)) {
    if (author.name.includes(cleaned) || cleaned.includes(author.name.replace(/^(د\.|م\.|أ\.)\s+/, ""))) {
      return author.slug;
    }
  }

  // 3. Transliterate Arabic characters
  let transliterated = "";
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (ARABIC_TO_LATIN[char] !== undefined) {
      transliterated += ARABIC_TO_LATIN[char];
    } else if (/[a-zA-Z0-9]/.test(char)) {
      transliterated += char.toLowerCase();
    } else if (/\s+/.test(char) || char === "-" || char === "_") {
      transliterated += "-";
    }
  }

  const slug = transliterated
    .toLowerCase()
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "author";
}

/**
 * Extracts initials from an author's name for fallback circular placeholder.
 * e.g. "يوسف أسامة" -> "ي أ"
 * e.g. "د. طارق الحكيم" -> "ط ح"
 */
export function getAuthorInitials(name: string): string {
  if (!name) return "م";
  const cleaned = name
    .replace(/^(د\.|م\.|أ\.|الدكتور|المهندس|الأستاذ)\s+/gi, "")
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return name.charAt(0);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0].charAt(0)} ${parts[parts.length - 1].charAt(0)}`;
}

/**
 * Returns author profile from DB or known dictionary.
 */
export async function getAuthorBySlug(slug: string): Promise<AuthorProfile | null> {
  const sanitizedSlug = slug?.toLowerCase()?.trim();
  if (!sanitizedSlug) return null;

  // 1. Try Prisma DB if DATABASE_URL is available
  if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
    try {
      const dbAuthor = await db.author.findUnique({
        where: { slug: sanitizedSlug },
      });
      if (dbAuthor) {
        return {
          id: dbAuthor.id,
          name: dbAuthor.name,
          slug: dbAuthor.slug,
          bio: dbAuthor.bio || undefined,
          avatarUrl: dbAuthor.avatarUrl || undefined,
          avatar: dbAuthor.avatarUrl || undefined,
          createdAt: dbAuthor.createdAt,
        };
      }
    } catch (err) {
      console.warn("[DB_AUTHOR_FETCH_WARN]", err);
    }
  }

  // 2. Check in-memory AUTHORS
  const found = Object.values(AUTHORS).find((a) => a.slug === sanitizedSlug);
  if (found) {
    return found;
  }

  return null;
}

/**
 * Returns author profile by name synchronously (from dictionary or generated slug).
 */
export function getAuthorByName(name: string): AuthorProfile {
  const trimmed = name?.trim();
  if (AUTHORS[trimmed]) {
    return AUTHORS[trimmed];
  }

  const generatedSlug = slugifyAuthor(trimmed);
  const foundBySlug = Object.values(AUTHORS).find((a) => a.slug === generatedSlug);
  if (foundBySlug) {
    return foundBySlug;
  }

  // Graceful fallback for dynamic author names specified in MDX frontmatter
  return {
    name: trimmed || "باحث في مِعمار",
    slug: generatedSlug,
    title: "باحث ومحلل استراتيجي",
    bio: `باحث في قضايا السيادة التقنية والفكر الاستراتيجي المعاصر، يساهم في أوراق تقدير الموقف والتحليلات المعمقة في منصة مِعمار.`,
    avatarUrl: null,
    avatar: undefined,
  };
}

/**
 * Returns all predefined authors.
 */
export function getAllAuthors(): AuthorProfile[] {
  return Object.values(AUTHORS);
}

/**
 * Automatically ensures default authors exist in Prisma if database is connected.
 */
export async function syncAuthorsToDb(): Promise<void> {
  if (!(process.env.DATABASE_URL || process.env.SQL_HOST)) return;

  try {
    for (const author of Object.values(AUTHORS)) {
      await db.author.upsert({
        where: { slug: author.slug },
        update: {
          name: author.name,
          bio: author.bio,
          avatarUrl: author.avatar || author.avatarUrl,
        },
        create: {
          slug: author.slug,
          name: author.name,
          bio: author.bio,
          avatarUrl: author.avatar || author.avatarUrl,
        },
      });
    }
  } catch (err) {
    console.warn("[AUTHOR_SYNC_DB_WARN]", err);
  }
}
