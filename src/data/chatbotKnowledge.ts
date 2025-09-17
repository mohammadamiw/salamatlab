// Knowledge base for SalamatLab AI Assistant
// This file contains all the information about SalamatLab services, doctors, and policies

export const SALAMAT_LAB_KNOWLEDGE = {
  // Company Information
  company: {
    name: "آزمایشگاه تشخیص پزشکی سلامت",
    englishName: "SalamatLab Medical Diagnostic Laboratory",
    description: "آزمایشگاه سلامت پیشرو در ارائه خدمات تشخیص پزشکی با بالاترین کیفیت و دقت",
    location: "شهرقدس، میدان مصلی",
    phones: ["021-46833010", "021-46833011"],
    instagram: "@salamatlab",
    website: "https://www.salamatlab.com",
    labSystem: "http://93.114.111.53:8086/Login",
    mapLocation: "https://nshn.ir/87_bvX81VxB9-K"
  },

  // Laboratory Services
  services: {
    hematology: {
      name: "هماتولوژی",
      englishName: "Hematology",
      description: "آزمایش‌های خون و سلول‌های خونی",
      itemCount: 18,
      tests: [
        "CBC (Complete Blood Count)",
        "ESR (Erythrocyte Sedimentation Rate)",
        "Hemoglobin Electrophoresis",
        "Reticulocyte Count",
        "Blood Smear Examination",
        "Platelet Function Tests",
        "Bone Marrow Aspiration",
        "Iron Studies",
        "Vitamin B12 & Folate",
        "G6PD Deficiency Test"
      ]
    },
    coagulation: {
      name: "انعقاد خون",
      englishName: "Coagulation",
      description: "آزمایش‌های انعقاد و فاکتورهای خونی",
      itemCount: 18,
      tests: [
        "PT (Prothrombin Time)",
        "PTT (Partial Thromboplastin Time)",
        "INR (International Normalized Ratio)",
        "Fibrinogen Level",
        "D-Dimer",
        "Factor Assays",
        "Protein C & S",
        "Antithrombin III",
        "Bleeding Time",
        "Clotting Time"
      ]
    },
    biochemistry: {
      name: "بیوشیمی",
      englishName: "Biochemistry",
      description: "آزمایش‌های بیوشیمیایی عمومی و تخصصی",
      tests: [
        "Glucose (Blood Sugar)",
        "HbA1c (Glycated Hemoglobin)",
        "Lipid Profile",
        "Liver Function Tests",
        "Kidney Function Tests",
        "Cardiac Markers",
        "Thyroid Function Tests",
        "Electrolytes",
        "Protein Studies",
        "Enzyme Tests"
      ]
    },
    microbiology: {
      name: "میکروبیولوژی",
      englishName: "Microbiology",
      description: "کشت و شناسایی میکروارگانیسم‌ها",
      itemCount: 6,
      tests: [
        "Blood Culture",
        "Urine Culture",
        "Stool Culture",
        "Wound Culture",
        "Throat Culture",
        "Sputum Culture",
        "Antibiotic Sensitivity Testing"
      ]
    },
    immunology: {
      name: "ایمونولوژی و آلرژی",
      englishName: "Immunology & Allergy",
      description: "آزمایش‌های ایمنی و حساسیت",
      itemCount: 120,
      tests: [
        "Allergy Panel",
        "Autoimmune Markers",
        "Immunoglobulins",
        "Complement Studies",
        "Viral Serology",
        "Tumor Markers",
        "Hormonal Assays"
      ]
    },
    cytology: {
      name: "سیتولوژی",
      englishName: "Cytology",
      description: "بررسی سلول‌ها و بافت‌ها",
      itemCount: 16,
      tests: [
        "Pap Smear",
        "Fine Needle Aspiration",
        "Body Fluid Cytology",
        "Cervical Cytology",
        "Thyroid FNA",
        "Breast FNA"
      ]
    },
    molecular: {
      name: "تشخیص مولکولی",
      englishName: "Molecular Diagnosis",
      description: "آزمایش‌های PCR و ژنتیک",
      itemCount: 12,
      tests: [
        "PCR Tests",
        "Real-time PCR",
        "DNA Sequencing",
        "Genetic Testing",
        "Viral Load Testing",
        "Mutation Analysis"
      ]
    },
    flowCytometry: {
      name: "فلوسایتومتری",
      englishName: "Flow Cytometry",
      description: "ایمونوفنوتایپینگ سلول‌ها",
      itemCount: 216,
      tests: [
        "Immunophenotyping",
        "Leukemia/Lymphoma Panel",
        "CD4/CD8 Count",
        "Cell Cycle Analysis",
        "Apoptosis Studies"
      ]
    },
    toxicology: {
      name: "سم شناسی",
      englishName: "Toxicology",
      description: "تشخیص مواد سمی و دارویی",
      tests: [
        "Drug Screening",
        "Therapeutic Drug Monitoring",
        "Heavy Metal Testing",
        "Poison Detection"
      ]
    },
    research: {
      name: "تحقیقات",
      englishName: "Research",
      description: "پروژه‌های تحقیقاتی و مطالعات علمی",
      tests: [
        "Clinical Trials Support",
        "Research Protocols",
        "Special Investigations"
      ]
    }
  },

  // Doctor Specialties
  doctors: {
    specialties: [
      {
        name: "عمومی",
        englishName: "General Practice",
        description: "ویزیت، معاینه و تشخیص اولیه بیماری‌های شایع",
        icon: "👨‍⚕️"
      },
      {
        name: "اورولوژی",
        englishName: "Urology",
        description: "درمان بیماری‌های کلیه، مثانه و دستگاه ادراری تناسلی",
        icon: "🔬",
        conditions: ["سنگ کلیه", "پروستات", "عفونت ادراری"]
      },
      {
        name: "ارتوپدی",
        englishName: "Orthopedics",
        description: "درمان شکستگی، آسیب‌های ورزشی و بیماری‌های استخوان",
        icon: "🦴",
        conditions: ["شکستگی", "ستون فقرات", "مفاصل"]
      },
      {
        name: "زنان و زایمان",
        englishName: "Obstetrics & Gynecology",
        description: "مراقبت‌های زنان، بارداری و زایمان",
        icon: "👶",
        conditions: ["بارداری", "زایمان", "مراقبت زنان"]
      },
      {
        name: "قلب و عروق",
        englishName: "Cardiology",
        description: "تشخیص و درمان بیماری‌های قلب و عروق",
        icon: "❤️",
        conditions: ["فشار خون", "آریتمی", "نارسایی قلبی"]
      },
      {
        name: "اطفال",
        englishName: "Pediatrics",
        description: "مراقبت‌های تخصصی کودکان و نوزادان",
        icon: "🧸"
      },
      {
        name: "ماما",
        englishName: "Midwifery",
        description: "مراقبت‌های مامایی و بارداری",
        icon: "🤱"
      },
      {
        name: "داخلی",
        englishName: "Internal Medicine",
        description: "تشخیص و درمان بیماری‌های داخلی",
        icon: "🏥"
      }
    ]
  },

  // Services Offered
  mainServices: [
    {
      name: "آزمایشات آزمایشگاهی",
      description: "انجام کلیه آزمایشات تشخیص پزشکی با دقت بالا"
    },
    {
      name: "نمونه‌گیری در منزل",
      description: "خدمات نمونه‌گیری در محل زندگی شما",
      link: "https://www.salamatlab.com/sample-at-home"
    },
    {
      name: "درخواست چکاپ",
      description: "بسته‌های چکاپ سلامت جامع",
      link: "/checkups/request"
    },
    {
      name: "دریافت جواب آزمایش",
      description: "دسترسی آنلاین به نتایج آزمایشات",
      link: "http://93.114.111.53:8086/Login"
    },
    {
      name: "نوبت‌دهی آنلاین پزشکان",
      description: "رزرو نوبت با پزشکان متخصص شهرقدس"
    }
  ],

  // Common Questions and Answers
  faq: [
    {
      question: "ساعات کاری آزمایشگاه چیست؟",
      answer: "آزمایشگاه سلامت از شنبه تا پنج‌شنبه از ساعت 7 صبح تا 7 عصر فعال است."
    },
    {
      question: "چگونه می‌توانم نتیجه آزمایش خود را دریافت کنم؟",
      answer: "شما می‌توانید از طریق سیستم آنلاین آزمایشگاه به آدرس http://93.114.111.53:8086/Login وارد شده و با کد پیگیری خود نتایج را مشاهده کنید."
    },
    {
      question: "آیا نمونه‌گیری در منزل انجام می‌دهید؟",
      answer: "بله، ما خدمات نمونه‌گیری در منزل ارائه می‌دهیم. برای اطلاعات بیشتر به بخش نمونه‌گیری در منزل مراجعه کنید."
    },
    {
      question: "چگونه می‌توانم نوبت پزشک بگیرم؟",
      answer: "شما می‌توانید از طریق سایت ما با پزشکان مختلف در تخصص‌های مختلف در شهرقدس نوبت بگیرید."
    },
    {
      question: "آیا آزمایشات اورژانسی انجام می‌دهید؟",
      answer: "بله، برای موارد اورژانسی با شماره‌های 021-46833010 یا 021-46833011 تماس بگیرید."
    }
  ],

  // Articles and Educational Content
  articles: [
    {
      title: "اگر همیشه خسته‌ایم، چه آزمایش تیروئید انجام دهیم؟",
      category: "آموزشی",
      summary: "راهنمای کامل آزمایشات تیروئید برای تشخیص علت خستگی"
    },
    {
      title: "تست CPK چیست؟",
      category: "آزمایشات",
      summary: "آشنایی با آزمایش CPK و کاربردهای آن در تشخیص بیماری‌های عضلانی و قلبی"
    },
    {
      title: "آزمایش ادرار + تفسیر",
      category: "آزمایشات",
      summary: "راهنمای کامل تفسیر آزمایش ادرار و نحوه تهیه نمونه"
    }
  ],

  // Contact and Support
  support: {
    phone: ["021-46833010", "021-46833011"],
    instagram: "@salamatlab",
    address: "شهرقدس، میدان مصلی",
    workingHours: "شنبه تا پنج‌شنبه، 7 صبح تا 7 عصر",
    emergencyContact: "برای موارد اورژانسی با شماره‌های فوق تماس بگیرید"
  }
};

// System prompts for the AI assistant
export const CHATBOT_SYSTEM_PROMPT = `
شما دستیار هوشمند آزمایشگاه تشخیص پزشکی سلامت هستید. وظیفه شما کمک به بیماران و مراجعین در موارد زیر است:

1. ارائه اطلاعات دقیق درباره خدمات آزمایشگاه
2. راهنمایی برای انجام آزمایشات مختلف
3. توضیح نحوه دریافت نتایج آزمایشات
4. معرفی پزشکان متخصص موجود
5. ارائه اطلاعات تماس و آدرس
6. پاسخ به سوالات متداول

مهم: 
- همیشه اطلاعات دقیق و به‌روز ارائه دهید
- در صورت عدم اطمینان، مراجعین را به تماس مستقیم با آزمایشگاه هدایت کنید
- هرگز تشخیص پزشکی ارائه ندهید، فقط اطلاعات عمومی بدهید
- همیشه مودب، مفید و قابل فهم باشید
- به زبان فارسی پاسخ دهید

اطلاعات آزمایشگاه سلامت:
${JSON.stringify(SALAMAT_LAB_KNOWLEDGE, null, 2)}
`;

export const CHATBOT_WELCOME_MESSAGE = "سلام! من دستیار هوشمند آزمایشگاه سلامت هستم. چطور می‌تونم کمکتون کنم؟ 😊\n\nمن می‌تونم در موارد زیر بهتون کمک کنم:\n• اطلاعات درباره خدمات آزمایشگاه\n• راهنمایی برای آزمایشات\n• معرفی پزشکان متخصص\n• اطلاعات تماس و آدرس";
