import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface ArticleMetadata {
  title: string;
  slug: string;
  excerpt: string;
  author: string; // The author's name, e.g. "د. طارق الحكيم" or specified in MDX frontmatter
  category: string; // e.g. "ai-geopolitics", "cybersecurity", "quantum-computing", "energy", "digital-infrastructure", "applied-modeling", "fiqh-al-waqi", "books"
  isPremium: boolean;
  publishedAt: string; // ISO 8601 String
  draft?: boolean;
  bookAuthor?: string;
  bookOriginalTitle?: string;
  ideaInOurTimeTitle?: string;
}

export interface ParsedArticle {
  metadata: ArticleMetadata;
  content: string; // Sanitized Markdown/MDX string
}

const ARTICLES_DIRECTORY = path.join(process.cwd(), "src/content/articles");

/**
 * Escapes characters that could be executed in an HTML context to block XSS attacks.
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Robust markdown paywall parser that slices content proportionally.
 * Extracts the first N% of paragraphs and appends a clean, styling-safe ellipsis.
 */
export function sliceContent(content: string, percentage: number = 20): string {
  if (!content) return "";

  // Check for explicit PAYWALL_SPLIT token first
  const splitToken = "<!-- PAYWALL_SPLIT -->";
  if (content.includes(splitToken)) {
    return content.split(splitToken)[0].trim() + "\n\n...";
  }

  // Fallback: Split content by paragraph double newlines to maintain structural blocks
  const paragraphs = content.split(/\n\s*\n/);
  const totalParagraphs = paragraphs.length;

  if (totalParagraphs <= 1) {
    const words = content.trim().split(/\s+/);
    const sliceCount = Math.max(5, Math.floor((words.length * percentage) / 100));
    return words.slice(0, sliceCount).join(" ") + " ...";
  }

  const paragraphSliceCount = Math.max(1, Math.floor((totalParagraphs * percentage) / 100));
  const slicedParagraphs = paragraphs.slice(0, paragraphSliceCount);

  return slicedParagraphs.join("\n\n") + "\n\n...";
}

/**
 * Normalizes category strings from frontmatter to standardized slug format
 */
export function normalizeCategorySlug(cat?: string): string {
  if (!cat) return "ai-geopolitics";
  const lower = cat.toLowerCase().trim();
  if (lower === "books" || lower === "الكتب" || lower === "كتاب") return "books";
  if (lower === "cybersecurity" || lower === "الأمن السيبراني" || lower === "أمن سيبراني") return "cybersecurity";
  if (lower === "quantum-computing" || lower === "الحوسبة الكمية" || lower === "حوسبة كمية") return "quantum-computing";
  if (lower === "energy" || lower === "الطاقة") return "energy";
  if (lower === "digital-infrastructure" || lower === "الهندسة والبنية التحتية الرقمية" || lower === "بنية تحتية") return "digital-infrastructure";
  if (lower === "applied-modeling" || lower === "رياضيات ونمذجة تطبيقية" || lower === "نمذجة") return "applied-modeling";
  if (lower === "fiqh-al-waqi" || lower === "فقه الواقع") return "fiqh-al-waqi";
  return "ai-geopolitics";
}

/**
 * Safely fetches an article from local src/content/articles utilizing slug
 */
export function getArticleBySlug(slug: string): ParsedArticle | null {
  try {
    const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "");
    const fullPath = path.join(ARTICLES_DIRECTORY, `${sanitizedSlug}.mdx`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const metadata: ArticleMetadata = {
      title: data.title || "Untitled Strategic Analysis",
      slug: sanitizedSlug,
      excerpt: data.excerpt || "",
      author: data.author?.trim() || "",
      category: normalizeCategorySlug(data.category),
      isPremium: data.isPremium !== undefined ? Boolean(data.isPremium) : true,
      publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : new Date().toISOString(),
      draft: Boolean(data.draft),
      bookAuthor: data.bookAuthor,
      bookOriginalTitle: data.bookOriginalTitle,
      ideaInOurTimeTitle: data.ideaInOurTimeTitle,
    };

    return {
      metadata,
      content,
    };
  } catch (error) {
    console.error(`[MDX_LOAD_FAIL] Slug: ${slug}. Exception:`, error);
    return null;
  }
}

/**
 * Scans directory to read all articles, sorted strictly descending by publication date.
 * Draft articles (marked with draft: true) are flagged and can be excluded.
 */
export function getAllArticles(includeDrafts: boolean = true): ParsedArticle[] {
  try {
    if (!fs.existsSync(ARTICLES_DIRECTORY)) {
      fs.mkdirSync(ARTICLES_DIRECTORY, { recursive: true });
      return [];
    }

    const files = fs.readdirSync(ARTICLES_DIRECTORY);
    const articles = files
      .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
      .map((file) => {
        const slug = file.replace(/\.mdx?$/, "");
        return getArticleBySlug(slug);
      })
      .filter((article): article is ParsedArticle => {
        if (!article) return false;
        if (!includeDrafts && article.metadata.draft) return false;
        return true;
      });

    return articles.sort((a, b) => {
      return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
    });
  } catch (error) {
    console.error("[ALL_MDX_LOAD_FAIL]", error);
    return [];
  }
}

/**
 * Returns strictly published, non-draft articles written by the author.
 */
export function getPublishedArticles(): ParsedArticle[] {
  return getAllArticles(false);
}

/**
 * Filters articles by category slug
 */
export function getArticlesByCategory(categorySlug: string): ParsedArticle[] {
  const all = getAllArticles();
  return all.filter((a) => a.metadata.category === categorySlug);
}
