export interface CategoryDefinition {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  isHorizontal?: boolean;
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: "AI_GEOPOLITICS",
    slug: "ai-geopolitics",
    title: "الذكاء الاصطناعي والجيوبوليتكس",
    titleEn: "AI & Geopolitics",
    description: "تحليلات معمقة في الصراع التكنولوجي الدولي، سلاسل إمداد السيليكون، وتوازنات القوة القائمة على نماذج الذكاء الاصطناعي الفائقة.",
    isHorizontal: false,
  },
  {
    id: "CYBERSECURITY",
    slug: "cybersecurity",
    title: "الأمن السيبراني",
    titleEn: "Cybersecurity",
    description: "تفكيك منظومات الحرب السيبرانية، حماية البنى التحتية الحيوية، وحروب الثغرات الصفرية على مستوى الفاعلين السياديين.",
    isHorizontal: false,
  },
  {
    id: "QUANTUM_COMPUTING",
    slug: "quantum-computing",
    title: "الحوسبة الكمية",
    titleEn: "Quantum Computing",
    description: "استشراف التحول نحو التشفير ما بعد الكمي (PQC)، سباق التفوق الكمي وتأثيراته على السيادة الرقمية وفك الشفرات.",
    isHorizontal: false,
  },
  {
    id: "ENERGY",
    slug: "energy",
    title: "الطاقة",
    titleEn: "Energy",
    description: "اقتصاديات الطاقة لمراكز البيانات الفائقة، المفاعلات النمطية الصغيرة (SMRs)، والجيوبوليتكس المحيطة بتغذية الثورة الحاسوبية.",
    isHorizontal: false,
  },
  {
    id: "DIGITAL_INFRASTRUCTURE",
    slug: "digital-infrastructure",
    title: "الهندسة والبنية التحتية الرقمية",
    titleEn: "Engineering & Digital Infrastructure",
    description: "هندسة الكابلات البحرية، مراكز البيانات السيادية، شبكات الأقمار الصناعية المنخفضة، ومسارات الحوسبة الموزعة.",
    isHorizontal: false,
  },
  {
    id: "APPLIED_MODELING",
    slug: "applied-modeling",
    title: "رياضيات ونمذجة تطبيقية",
    titleEn: "Mathematics & Applied Modeling",
    description: "النماذج الرياضية ونظرية الألعاب والأنظمة المعقدة الموجهة لفهم الأسواق الاحتكارية وسلوك المنصات الرقمية.",
    isHorizontal: false,
  },
  {
    id: "FIQH_AL_WAQI",
    slug: "fiqh-al-waqi",
    title: "فقه الواقع",
    titleEn: "Fiqh Al-Waqi'",
    description: "تجسير الفكر الحضاري الإسلامي والهوية العربية مع التحولات التقنية المعاصرة — باستلهام مناهج مالك بن نبي وعبد الوهاب المسيري في تشريح التشيؤ والفاعلية الحضارية.",
    isHorizontal: false,
  },
  {
    id: "BOOKS",
    slug: "books",
    title: "الكتب",
    titleEn: "Books & Contemporary Ideas",
    description: "تصنيف أفقي مستقل يقدم مراجعات نقدية تحليلية لكتب تأسيسية ومؤثرة، مقترنة بقسم دائم: 'الفكرة في زمننا' لربط أطروحة الكتاب بحدث تكنولوجي أو جيوسياسي معاصر.",
    isHorizontal: true,
  },
];

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
