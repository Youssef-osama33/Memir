const fs = require('fs');
const path = require('path');

const articles = [
  {
    slug: "semiconductor-future",
    title: "مستقبل أشباه الموصلات: صراع التايوان",
    excerpt: "تحليل للصراع الجيوسياسي حول صناعة الرقائق الدقيقة في تايوان وتأثيره على سباق الذكاء الاصطناعي.",
    content: "\nتلعب تايوان دوراً محورياً...\n\n<!-- PAYWALL_SPLIT -->\n\nهنا المحتوى الكامل...",
    author: "يوسف أسامة",
    category: "ai-geopolitics",
    date: "2024-01-01"
  },
  {
    slug: "zero-day-wars",
    title: "حروب الثغرات الصفرية: الجبهة الجديدة",
    excerpt: "كيف تستخدم الدول القومية الثغرات الصفرية كأسلحة دمار شامل سيبرانية في الحروب الحديثة.",
    content: "\nالأسلحة السيبرانية...\n\n<!-- PAYWALL_SPLIT -->\n\nهنا التفاصيل...",
    author: "م. خالد الأنصاري",
    category: "cybersecurity",
    date: "2024-01-05"
  },
  {
    slug: "post-quantum-crypto",
    title: "خوارزميات التشفير ما بعد الكمي",
    excerpt: "استعراض لأهم الخوارزميات المرشحة لحماية البيانات في حقبة ما بعد الحواسيب الكمية.",
    content: "\nالتشفير الكمي...\n\n<!-- PAYWALL_SPLIT -->\n\nالرياضيات وراءها...",
    author: "يوسف أسامة",
    category: "quantum-computing",
    date: "2024-01-10"
  },
  {
    slug: "smr-reactors-ai",
    title: "مفاعلات SMR ومستقبل الحوسبة",
    excerpt: "المفاعلات النووية المصغرة كحل مثالي لتشغيل مراكز بيانات الذكاء الاصطناعي.",
    content: "\nيحتاج الذكاء الاصطناعي...\n\n<!-- PAYWALL_SPLIT -->\n\nالتفاصيل الهندسية...",
    author: "م. خالد الأنصاري",
    category: "energy",
    date: "2024-01-15"
  },
  {
    slug: "subsea-cables-sovereignty",
    title: "أهمية الكابلات البحرية في السيادة الرقمية",
    excerpt: "الكابلات البحرية ليست مجرد أسلاك، بل هي شرايين الاقتصاد الرقمي العالمي.",
    content: "\nتعتمد الإنترنت...\n\n<!-- PAYWALL_SPLIT -->\n\nالخرائط الاستراتيجية...",
    author: "م. خالد الأنصاري",
    category: "digital-infrastructure",
    date: "2024-01-20"
  },
  {
    slug: "tech-monopoly-models",
    title: "نمذجة الأسواق الاحتكارية لشركات التكنولوجيا",
    excerpt: "تطبيق نظرية الألعاب لفهم كيفية تصرف شركات التقنية الكبرى كاحتكارات القلة.",
    content: "\nنماذج ناش...\n\n<!-- PAYWALL_SPLIT -->\n\nالمعادلات...",
    author: "يوسف أسامة",
    category: "applied-modeling",
    date: "2024-01-25"
  },
  {
    slug: "cognitive-colonization",
    title: "الاستعمار المعرفي في عصر الخوارزميات",
    excerpt: "قراءة لمالك بن نبي في عصر الذكاء الاصطناعي لفهم التبعية التكنولوجية.",
    content: "\nالتبعية لا تقتصر...\n\n<!-- PAYWALL_SPLIT -->\n\nالتحليل الفكري...",
    author: "د. عبد الرحمن الصالح",
    category: "fiqh-al-waqi",
    date: "2024-02-01"
  },
  {
    slug: "chip-war-book-review",
    title: "مراجعة كتاب: حرب الرقائق",
    excerpt: "كريس ميلر يقدم توثيقاً دقيقاً لكيفية تحول الرقائق الدقيقة إلى المورد الأكثر قيمة في العالم.",
    content: "\nتاريخ مذهل...\n\n<!-- PAYWALL_SPLIT -->\n\nالمراجعة الكاملة...",
    author: "أحمد بن يوسف",
    category: "books",
    date: "2024-02-05",
    bookAuthor: "كريس ميلر",
    ideaInOurTimeTitle: "احتكار التكنولوجيا كأداة للسياسة"
  }
];

const contentDir = path.join(__dirname, 'src/content/articles');
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

articles.forEach(a => {
  const filePath = path.join(contentDir, `${a.slug}.mdx`);
  const frontmatter = `---
title: "${a.title}"
excerpt: "${a.excerpt}"
author: "${a.author}"
category: "${a.category}"
isPremium: true
publishedAt: "${a.date}"
${a.bookAuthor ? `bookAuthor: "${a.bookAuthor}"` : ''}
${a.ideaInOurTimeTitle ? `ideaInOurTimeTitle: "${a.ideaInOurTimeTitle}"` : ''}
---
${a.content}
`;
  fs.writeFileSync(filePath, frontmatter, 'utf8');
});

console.log('Dummy MDX articles generated!');
