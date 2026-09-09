export type CategoryIconName = "Cpu" | "ShieldAlert" | "Atom" | "Zap" | "Server" | "Sigma" | "Scale" | "BookOpen";

export interface CategoryTheme {
  text: string;
  hoverText: string;
  groupHoverText: string;
  bg: string;
  border: string;
  iconName: CategoryIconName;
}

export interface CategoryDefinition {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  isHorizontal?: boolean;
  theme: CategoryTheme;
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: "AI_GEOPOLITICS",
    slug: "ai-geopolitics",
    title: "الذكاء الاصطناعي والجيوبوليتكس",
    titleEn: "AI & Geopolitics",
    description: "تحليلات معمقة في الصراع التكنولوجي الدولي، سلاسل إمداد السيليكون، وتوازنات القوة القائمة على نماذج الذكاء الاصطناعي الفائقة.",
    isHorizontal: false,
    theme: {
      text: "text-slate-700",
      hoverText: "hover:text-slate-700",
      groupHoverText: "group-hover:text-slate-700",
      bg: "bg-slate-50",
      border: "border-slate-200",
      iconName: "Cpu"
    }
  },
  {
    id: "CYBERSECURITY",
    slug: "cybersecurity",
    title: "الأمن السيبراني",
    titleEn: "Cybersecurity",
    description: "تفكيك منظومات الحرب السيبرانية، حماية البنى التحتية الحيوية، وحروب الثغرات الصفرية على مستوى الفاعلين السياديين.",
    isHorizontal: false,
    theme: {
      text: "text-rose-700",
      hoverText: "hover:text-rose-700",
      groupHoverText: "group-hover:text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-200",
      iconName: "ShieldAlert"
    }
  },
  {
    id: "QUANTUM_COMPUTING",
    slug: "quantum-computing",
    title: "الحوسبة الكمية",
    titleEn: "Quantum Computing",
    description: "استشراف التحول نحو التشفير ما بعد الكمي (PQC)، سباق التفوق الكمي وتأثيراته على السيادة الرقمية وفك الشفرات.",
    isHorizontal: false,
    theme: {
      text: "text-indigo-700",
      hoverText: "hover:text-indigo-700",
      groupHoverText: "group-hover:text-indigo-700",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      iconName: "Atom"
    }
  },
  {
    id: "ENERGY",
    slug: "energy",
    title: "الطاقة",
    titleEn: "Energy",
    description: "اقتصاديات الطاقة لمراكز البيانات الفائقة، المفاعلات النمطية الصغيرة (SMRs)، والجيوبوليتكس المحيطة بتغذية الثورة الحاسوبية.",
    isHorizontal: false,
    theme: {
      text: "text-orange-700",
      hoverText: "hover:text-orange-700",
      groupHoverText: "group-hover:text-orange-700",
      bg: "bg-orange-50",
      border: "border-orange-200",
      iconName: "Zap"
    }
  },
  {
    id: "DIGITAL_INFRASTRUCTURE",
    slug: "digital-infrastructure",
    title: "الهندسة والبنية التحتية الرقمية",
    titleEn: "Engineering & Digital Infrastructure",
    description: "هندسة الكابلات البحرية، مراكز البيانات السيادية، شبكات الأقمار الصناعية المنخفضة، ومسارات الحوسبة الموزعة.",
    isHorizontal: false,
    theme: {
      text: "text-teal-700",
      hoverText: "hover:text-teal-700",
      groupHoverText: "group-hover:text-teal-700",
      bg: "bg-teal-50",
      border: "border-teal-200",
      iconName: "Server"
    }
  },
  {
    id: "APPLIED_MODELING",
    slug: "applied-modeling",
    title: "رياضيات ونمذجة تطبيقية",
    titleEn: "Mathematics & Applied Modeling",
    description: "النماذج الرياضية ونظرية الألعاب والأنظمة المعقدة الموجهة لفهم الأسواق الاحتكارية وسلوك المنصات الرقمية.",
    isHorizontal: false,
    theme: {
      text: "text-emerald-700",
      hoverText: "hover:text-emerald-700",
      groupHoverText: "group-hover:text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      iconName: "Sigma"
    }
  },
  {
    id: "FIQH_AL_WAQI",
    slug: "fiqh-al-waqi",
    title: "فقه الواقع",
    titleEn: "Fiqh Al-Waqi'",
    description: "تجسير الفكر الحضاري الإسلامي والهوية العربية مع التحولات التقنية المعاصرة — باستلهام مناهج مالك بن نبي وعبد الوهاب المسيري في تشريح التشيؤ والفاعلية الحضارية.",
    isHorizontal: false,
    theme: {
      text: "text-yellow-800",
      hoverText: "hover:text-yellow-800",
      groupHoverText: "group-hover:text-yellow-800",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      iconName: "Scale"
    }
  },
  {
    id: "BOOKS",
    slug: "books",
    title: "الكتب",
    titleEn: "Books & Contemporary Ideas",
    description: "تصنيف أفقي مستقل يقدم مراجعات نقدية تحليلية لكتب تأسيسية ومؤثرة، مقترنة بقسم دائم: 'الفكرة في زمننا' لربط أطروحة الكتاب بحدث تكنولوجي أو جيوسياسي معاصر.",
    isHorizontal: true,
    theme: {
      text: "text-amber-800",
      hoverText: "hover:text-amber-800",
      groupHoverText: "group-hover:text-amber-800",
      bg: "bg-[#FBF6EC]",
      border: "border-amber-200",
      iconName: "BookOpen"
    }
  },
];

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
