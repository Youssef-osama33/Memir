export interface CountryCode {
  code: string;       // e.g. "EG"
  name: string;       // Arabic name e.g. "مصر"
  dialCode: string;   // e.g. "+20"
  flag: string;       // e.g. "🇪🇬"
  placeholder: string; // e.g. "1012345678"
}

export const COUNTRIES: CountryCode[] = [
  // Primary target audience: Egypt
  { code: "EG", name: "مصر", dialCode: "+20", flag: "🇪🇬", placeholder: "10 1234 5678" },

  // Arab League & GCC Countries
  { code: "SA", name: "المملكة العربية السعودية", dialCode: "+966", flag: "🇸🇦", placeholder: "50 123 4567" },
  { code: "AE", name: "الإمارات العربية المتحدة", dialCode: "+971", flag: "🇦🇪", placeholder: "50 123 4567" },
  { code: "QA", name: "قطر", dialCode: "+974", flag: "🇶🇦", placeholder: "3312 3456" },
  { code: "KW", name: "الكويت", dialCode: "+965", flag: "🇰🇼", placeholder: "9123 4567" },
  { code: "BH", name: "البحرين", dialCode: "+973", flag: "🇧🇭", placeholder: "3912 3456" },
  { code: "OM", name: "سلطنة عُمان", dialCode: "+968", flag: "🇴🇲", placeholder: "9123 4567" },
  { code: "JO", name: "الأردن", dialCode: "+962", flag: "🇯🇴", placeholder: "7 9123 4567" },
  { code: "LB", name: "لبنان", dialCode: "+961", flag: "🇱🇧", placeholder: "70 123 456" },
  { code: "IQ", name: "العراق", dialCode: "+964", flag: "🇮🇶", placeholder: "790 123 4567" },
  { code: "PS", name: "فلسطين", dialCode: "+970", flag: "🇵🇸", placeholder: "59 123 4567" },
  { code: "SY", name: "سوريا", dialCode: "+963", flag: "🇸🇾", placeholder: "933 123 456" },
  { code: "YE", name: "اليمن", dialCode: "+967", flag: "🇾🇪", placeholder: "771 234 567" },
  { code: "SD", name: "السودان", dialCode: "+249", flag: "🇸🇩", placeholder: "91 234 5678" },
  { code: "LY", name: "ليبيا", dialCode: "+218", flag: "🇱🇾", placeholder: "91 234 5678" },
  { code: "TN", name: "تونس", dialCode: "+216", flag: "🇹🇳", placeholder: "20 123 456" },
  { code: "DZ", name: "الجزائر", dialCode: "+213", flag: "🇩🇿", placeholder: "551 23 45 67" },
  { code: "MA", name: "المغرب", dialCode: "+212", flag: "🇲🇦", placeholder: "612 345 678" },
  { code: "MR", name: "موريتانيا", dialCode: "+222", flag: "🇲🇷", placeholder: "22 12 34 56" },
  { code: "SO", name: "الصومال", dialCode: "+252", flag: "🇸🇴", placeholder: "61 234 5678" },
  { code: "DJ", name: "جيبوتي", dialCode: "+253", flag: "🇩🇯", placeholder: "77 12 34 56" },

  // International
  { code: "TR", name: "تركيا", dialCode: "+90", flag: "🇹🇷", placeholder: "501 234 56 78" },
  { code: "GB", name: "المملكة المتحدة", dialCode: "+44", flag: "🇬🇧", placeholder: "7911 123456" },
  { code: "US", name: "الولايات المتحدة", dialCode: "+1", flag: "🇺🇸", placeholder: "202 555 0123" },
  { code: "CA", name: "كندا", dialCode: "+1", flag: "🇨🇦", placeholder: "416 555 0123" },
  { code: "DE", name: "ألمانيا", dialCode: "+49", flag: "🇩🇪", placeholder: "151 23456789" },
  { code: "FR", name: "فرنسا", dialCode: "+33", flag: "🇫🇷", placeholder: "6 12 34 56 78" },
  { code: "CH", name: "سويسرا", dialCode: "+41", flag: "🇨🇭", placeholder: "79 123 45 67" },
  { code: "MY", name: "ماليزيا", dialCode: "+60", flag: "🇲🇾", placeholder: "12 345 6789" },
  { code: "ID", name: "إندونيسيا", dialCode: "+62", flag: "🇮🇩", placeholder: "812 3456 7890" },
  { code: "NL", name: "هولندا", dialCode: "+31", flag: "🇳🇱", placeholder: "6 12345678" },
  { code: "SE", name: "السويد", dialCode: "+46", flag: "🇸🇪", placeholder: "70 123 45 67" },
  { code: "AU", name: "أستراليا", dialCode: "+61", flag: "🇦🇺", placeholder: "412 345 678" },
  { code: "ES", name: "إسبانيا", dialCode: "+34", flag: "🇪🇸", placeholder: "612 34 56 78" },
  { code: "IT", name: "إيطاليا", dialCode: "+39", flag: "🇮🇹", placeholder: "312 345 6789" },
  { code: "RU", name: "روسيا", dialCode: "+7", flag: "🇷🇺", placeholder: "912 345 67 89" },
  { code: "CN", name: "الصين", dialCode: "+86", flag: "🇨🇳", placeholder: "131 2345 6789" },
  { code: "JP", name: "اليابان", dialCode: "+81", flag: "🇯🇵", placeholder: "90 1234 5678" },
  { code: "KR", name: "كوريا الجنوبية", dialCode: "+82", flag: "🇰🇷", placeholder: "10 1234 5678" },
  { code: "IN", name: "الهند", dialCode: "+91", flag: "🇮🇳", placeholder: "98123 45678" },
  { code: "PK", name: "باكستان", dialCode: "+92", flag: "🇵🇰", placeholder: "301 2345678" },
  { code: "BR", name: "البرازيل", dialCode: "+55", flag: "🇧🇷", placeholder: "11 91234 5678" },
  { code: "ZA", name: "جنوب أفريقيا", dialCode: "+27", flag: "🇿🇦", placeholder: "71 234 5678" },
];

export const DEFAULT_COUNTRY = COUNTRIES[0]; // Egypt (+20)
