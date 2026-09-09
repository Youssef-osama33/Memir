import { PrismaClient } from '@prisma/client';
import { slugifyAuthor } from './src/lib/authors';

const db = new PrismaClient();

const dummyArticles = [
  {
    title: "مستقبل أشباه الموصلات: صراع التايوان",
    excerpt: "تحليل للصراع الجيوسياسي حول صناعة الرقائق الدقيقة في تايوان وتأثيره على سباق الذكاء الاصطناعي.",
    content: "## مقدمة\nتلعب تايوان دوراً محورياً...\n<!-- PAYWALL_SPLIT -->\nهنا المحتوى الكامل...",
    author: "يوسف أسامة",
    category: "AI_GEOPOLITICS",
  },
  {
    title: "حروب الثغرات الصفرية: الجبهة الجديدة",
    excerpt: "كيف تستخدم الدول القومية الثغرات الصفرية كأسلحة دمار شامل سيبرانية في الحروب الحديثة.",
    content: "## الأسلحة السيبرانية\nالـ Zero-day exploits أصبحت...\n<!-- PAYWALL_SPLIT -->\nهنا التفاصيل...",
    author: "م. خالد الأنصاري",
    category: "CYBERSECURITY",
  },
  {
    title: "خوارزميات التشفير ما بعد الكمي",
    excerpt: "استعراض لأهم الخوارزميات المرشحة لحماية البيانات في حقبة ما بعد الحواسيب الكمية.",
    content: "## التشفير الكمي\nالمعايير الجديدة...\n<!-- PAYWALL_SPLIT -->\nالرياضيات وراءها...",
    author: "يوسف أسامة",
    category: "QUANTUM_COMPUTING",
  },
  {
    title: "مفاعلات SMR ومستقبل الحوسبة",
    excerpt: "المفاعلات النووية المصغرة كحل مثالي لتشغيل مراكز بيانات الذكاء الاصطناعي.",
    content: "## الطاقة والحوسبة\nيحتاج الذكاء الاصطناعي...\n<!-- PAYWALL_SPLIT -->\nالتفاصيل الهندسية...",
    author: "م. خالد الأنصاري",
    category: "ENERGY",
  },
  {
    title: "أهمية الكابلات البحرية في السيادة الرقمية",
    excerpt: "الكابلات البحرية ليست مجرد أسلاك، بل هي شرايين الاقتصاد الرقمي العالمي ونقاط خنق سيادية.",
    content: "## البنية التحتية\nتعتمد الإنترنت...\n<!-- PAYWALL_SPLIT -->\nالخرائط الاستراتيجية...",
    author: "م. خالد الأنصاري",
    category: "DIGITAL_INFRASTRUCTURE",
  },
  {
    title: "نمذجة الأسواق الاحتكارية لشركات التكنولوجيا",
    excerpt: "تطبيق نظرية الألعاب لفهم كيفية تصرف شركات التقنية الكبرى كاحتكارات القلة.",
    content: "## نظرية الألعاب\nنماذج ناش...\n<!-- PAYWALL_SPLIT -->\nالمعادلات...",
    author: "يوسف أسامة",
    category: "APPLIED_MODELING",
  },
  {
    title: "الاستعمار المعرفي في عصر الخوارزميات",
    excerpt: "قراءة لمالك بن نبي في عصر الذكاء الاصطناعي لفهم التبعية التكنولوجية.",
    content: "## فقه الواقع\nالتبعية لا تقتصر على...\n<!-- PAYWALL_SPLIT -->\nالتحليل الفكري...",
    author: "د. عبد الرحمن الصالح",
    category: "FIQH_AL_WAQI",
  },
  {
    title: "مراجعة كتاب: حرب الرقائق",
    excerpt: "كريس ميلر يقدم توثيقاً دقيقاً لكيفية تحول الرقائق الدقيقة إلى المورد الأكثر قيمة في العالم.",
    content: "## الكتاب\nتاريخ مذهل...\n<!-- PAYWALL_SPLIT -->\nالمراجعة الكاملة...",
    author: "أحمد بن يوسف",
    category: "BOOKS",
    bookAuthor: "كريس ميلر",
    ideaInOurTimeTitle: "احتكار التكنولوجيا كأداة للسياسة",
  }
];

async function seed() {
  for (const a of dummyArticles) {
    const slug = a.title.replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Math.floor(Math.random() * 1000);
    const authorSlug = slugifyAuthor(a.author);
    await db.article.create({
      data: {
        title: a.title,
        slug,
        excerpt: a.excerpt,
        content: a.content,
        author: a.author,
        authorSlug,
        category: a.category as any,
        isPremium: true,
        draft: false,
        publishedAt: new Date(),
        bookAuthor: a.bookAuthor,
        ideaInOurTimeTitle: a.ideaInOurTimeTitle,
      }
    });
  }
  console.log("Seeding complete!");
}

seed().catch(console.error).finally(() => db.$disconnect());
