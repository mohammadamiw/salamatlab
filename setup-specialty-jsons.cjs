/*
  Usage: node setup-specialty-jsons.cjs
  - Reads public/doctors.json
  - Groups by canonical category (using a minimal mapper replicated here)
  - Writes public/doctors/index.json and public/doctors/<slug>.json
*/

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const SRC_FILE = path.join(PUBLIC_DIR, 'doctors.json');
const OUT_DIR = path.join(PUBLIC_DIR, 'doctors');

const slugify = (s) =>
  s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\u200c‌]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]+/g, '')
    .replace(/\-+/g, '-')
    .replace(/^-+|-+$/g, '');

// Minimal strict mapper (keep in sync with src/lib/utils.ts)
function mapDoctorSpecialty(specialty) {
  const s = (specialty || '')
    .replace(/\u200c/g, ' ')
    .replace(/‌/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/ك/g, 'ک')
    .replace(/ي/g, 'ی')
    .trim();

  const hasPhrase = (text, phrase) => new RegExp(`(^|\u200c|\s)${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\s|\u200c|$)`).test(text);

  if (s === 'پزشک عمومی' || s === 'پزشک عمومى' || /(^|\s)پزشک\s+عمومی(\s|$)/.test(s)) return 'عمومی';

  const whitelist = {
    'زنان و زایمان': ['زنان و زایمان', 'متخصص زنان و زایمان'],
    'قلب و عروق': ['قلب و عروق', 'کاردیولوژی'],
    'ارتوپدی': ['ارتوپدی', 'ارتوپد'],
    'اطفال': ['اطفال', 'متخصص اطفال'],
    'اورولوژی': ['اورولوژی', 'ارولوژی', 'اورولوژي', 'متخصص اورولوژی', 'پزشک متخصص اورولوژی'],
    'ماما': ['ماما', 'مامایی'],
    'داخلی': ['داخلی', 'طب داخلی']
  };

  for (const [cat, phrases] of Object.entries(whitelist)) {
    for (const p of phrases) if (hasPhrase(s, p)) return cat;
  }
  return 'سایر';
}

function main() {
  if (!fs.existsSync(SRC_FILE)) {
    console.error('public/doctors.json not found');
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(SRC_FILE, 'utf8'));
  const doctors = Array.isArray(raw?.doctors) ? raw.doctors : [];

  const byCat = new Map();
  for (const d of doctors) {
    const cat = d.category || mapDoctorSpecialty(d.specialty);
    if (!byCat.has(cat)) byCat.set(cat, []);
    byCat.get(cat).push(d);
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const index = { categories: [] };
  for (const [cat, list] of byCat.entries()) {
    if (!list || list.length === 0) continue;
    const file = `${slugify(cat) || 'cat'}.json`;
    const outPath = path.join(OUT_DIR, file);
    fs.writeFileSync(outPath, JSON.stringify({ doctors: list }, null, 2), 'utf8');
    index.categories.push({ name: cat, file });
  }

  fs.writeFileSync(path.join(OUT_DIR, 'index.json'), JSON.stringify(index, null, 2), 'utf8');
  console.log(`Wrote ${index.categories.length} categories to public/doctors/`);
}

if (require.main === module) main();
