import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to map doctor specialties consistently with strict rules
export function mapDoctorSpecialty(specialty: string): string {
  // Normalize common variations (Arabic vs Persian forms, zero-width chars, extra spaces)
  const s = (specialty || '')
    .replace(/\u200c/g, ' ')
    .replace(/‌/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/ك/g, 'ک')
    .replace(/ي/g, 'ی')
    .trim();

  // Helper: escape regex special characters
  const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Helper: check phrase as whole token(s) (space-delimited) in normalized string
  const hasPhrase = (text: string, phrase: string) => {
    const pattern = new RegExp(`(^|\u200c|\s)${escapeRegExp(phrase)}(\s|\u200c|$)`);
    return pattern.test(text);
  };

  // Strict whitelist of categories and their precise phrases/synonyms
  const whitelist: { [key: string]: string[] } = {
    'زنان و زایمان': ['زنان و زایمان', 'متخصص زنان و زایمان', 'پزشک متخصص زنان'],
    'قلب و عروق': ['قلب و عروق', 'کاردیولوژی'],
    'ارتوپدی': ['ارتوپدی', 'ارتوپد'],
    'اطفال': ['اطفال', 'متخصص اطفال'],
    'اورولوژی': ['اورولوژی', 'ارولوژی', 'اورولوژي', 'متخصص اورولوژی', 'پزشک متخصص اورولوژی'],
    'ماما': ['ماما', 'مامایی'],
    'داخلی': ['داخلی', 'طب داخلی']
  };

  // 1) General practitioner: must match the exact phrase 'پزشک عمومی' (not 'جراحی عمومی')
  if (s === 'پزشک عمومی' || s === 'پزشک عمومى' || /(^|\s)پزشک\s+عمومی(\s|$)/.test(s)) {
    return 'عمومی';
  }

  // 2) Specialists: match only against strict whitelist phrases
  for (const [category, phrases] of Object.entries(whitelist)) {
    for (const phrase of phrases) {
      if (hasPhrase(s, phrase)) {
        return category;
      }
    }
  }

  // 3) Fallback
  return 'سایر';
}
