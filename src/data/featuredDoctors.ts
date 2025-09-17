// Shared data source for featured doctors
// This data is used in both CityDoctors component and AllDoctors page

export interface Doctor {
  name: string;
  specialty: string;
  description: string;
  licenseNumber: string;
  address: string;
  workingHours: string;
  phones: string[];
  image: string;
  rating: number;
  isFeatured?: boolean;
  category?: string;
}

export const featuredDoctors: Doctor[] = [
  {
    name: "دکتر قاسم مشهدی اسماعیل",
    specialty: "پزشک عمومی",
    description: "پزشک عمومی",
    licenseNumber: "57486",
    address: "قدس میدان آزادی ابتدای خ امام ره نبش کوچه شهید قره پلاک ۱ واحد ۱",
    workingHours: "صبح: 10 تا 13 | عصر: 16 تا 20",
    phones: ["۴۶۸۴۱۸۰۲", "۴۶۸۵۵۰۰۸"],
    image: "👨‍⚕️",
    rating: 4.8,
    isFeatured: true
  },
  {
    name: "دکتر محمد انصاری",
    specialty: "پزشک عمومی",
    description: "پزشک عمومی",
    licenseNumber: "48746",
    address: "تقاطع جمهوری - بلوار تولیدگران - روبروی مرکز خرید ابریشم پ 188 - ط 2",
    workingHours: "شنبه تا چهارشنبه | ساعت 16 تا 20",
    phones: ["46823765"],
    image: "👨‍⚕️",
    rating: 4.7,
    isFeatured: true
  },
  {
    name: "دکتر سارا احمدی",
    specialty: "پزشک عمومی",
    description: "پزشک عمومی",
    licenseNumber: "190456",
    address: "شهرک کاووسیه،خ طالقانی،نبش کوچه شهید حاج جعفری، طبقه زیرین داروخانه دکتر برومند | آدرس دوم:درمانگاه 13 رجب | آدرس سوم :هشت متری شورا-مرکز نیمه شعبان",
    workingHours: "یک شنبه و پنجشنبه 16 تا 20 | صبح تا 16",
    phones: ["46814228"],
    image: "👩‍⚕️",
    rating: 4.8,
    isFeatured: true
  },
  {
    name: "دکتر احمد حسینی",
    specialty: "متخصص قلب و عروق",
    description: "متخصص قلب و عروق با ۲۰ سال سابقه",
    licenseNumber: "42158",
    address: "تهران، بیمارستان پارسیان، طبقه سوم",
    workingHours: "صبح: 9 تا 12 | عصر: 17 تا 20",
    phones: ["۲۱۵۶۷۸۹۰", "۲۱۵۶۷۸۹۱"],
    image: "👨‍⚕️",
    rating: 4.9,
    isFeatured: true
  },
  {
    name: "دکتر سارا محمدی",
    specialty: "متخصص زنان و زایمان",
    description: "متخصص زنان و زایمان با تجربه در جراحی‌های تخصصی",
    licenseNumber: "38574",
    address: "تهران، کلینیک بانوان، طبقه دوم",
    workingHours: "صبح: 10 تا 14 | عصر: 16 تا 19",
    phones: ["۲۲۴۵۶۷۸۹", "۲۲۴۵۶۷۹۰"],
    image: "👩‍⚕️",
    rating: 4.8,
    isFeatured: true
  },
  {
    name: "دکتر علی رضوی",
    specialty: "متخصص ارتوپدی",
    description: "متخصص ارتوپدی و جراح استخوان",
    licenseNumber: "45632",
    address: "تهران، بیمارستان عرفان، بخش ارتوپدی",
    workingHours: "صبح: 8 تا 12 | عصر: 16 تا 19",
    phones: ["۲۱۹۸۷۶۵۴", "۲۱۹۸۷۶۵۵"],
    image: "👨‍⚕️",
    rating: 4.9,
    isFeatured: true
  },
  {
    name: "دکتر زهرا کریمی",
    specialty: "پزشک عمومی",
    description: "پزشک عمومی با تخصص در پزشکی خانواده",
    licenseNumber: "52987",
    address: "تهران، مطب شخصی، خیابان ولیعصر",
    workingHours: "صبح: 9 تا 13 | عصر: 17 تا 21",
    phones: ["۲۱۳۴۵۶۷۸", "۲۱۳۴۵۶۷۹"],
    image: "👩‍⚕️",
    rating: 4.7,
    isFeatured: true
  },
  {
    name: "دکتر محمد صادقی",
    specialty: "متخصص اطفال",
    description: "متخصص اطفال و نوزادان",
    licenseNumber: "39874",
    address: "تهران، بیمارستان کودکان، بخش اطفال",
    workingHours: "صبح: 10 تا 14 | عصر: 16 تا 20",
    phones: ["۲۱۶۵۴۳۲۱", "۲۱۶۵۴۳۲۲"],
    image: "👨‍⚕️",
    rating: 4.8,
    isFeatured: true
  }
];