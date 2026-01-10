
export const TIMEZONE = "Asia/Baghdad";

export class NaqraaArabicDate extends Date {
  constructor(){
    super();
    // TODO : this class should map to Asia/Baghdad timezone
    
  }
}

export const DAYS = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
]

export const TASK_REPEAT_DAYS = DAYS;

export const TASK_REPEAT_CHOICES = [
    "none",
    "daily",
    "weekly",
    "monthly",
    "yearly",
    "custom"
]

export const TASK_PRIORITIES = [
    'low',
    'medium',
    'high',
    'urgent'
]


interface Grade {
    display:string;
    code:string
}
export const grades:Grade[] = [
    {
        display:'الاول متوسط',
        code:'grade_1',
    },
    {
        display:'الثاني متوسط',
        code:'grade_2',
    },
    {
        display:'الثالث متوسط',
        code:'grade_3',
    },
    {
        display:'الرابع اعدادي',
        code:'grade_4',
    },
    {
        display:'الخامس اعدادي',
        code:'grade_5',
    },
    {
        display:'السادس اعدادي',
        code:'grade_6',
    },

]


export const subjects = [
    {
        display:'الرياضيات',
        code:'math',
    },
    {
        display:'الاحياء',
        code:'biolgy',
    },
    {
        display:'الفيزياء',
        code:'phyisics',
    },
    {
        display:'الكيمياء',
        code:'chemstry',
    },
    {
        display:'اللغة العربية',
        code:'arabic',
    },
    {
        display:'اللغة الانجليزية',
        code:'english',
    },
    {
        display:'التربية الاخلاقية',
        code:'ethics',
    },
    {
        display:'الحاسوب',
        code:'cs',
    },
    {
        display:'اللغة الفرنسية',
        code:'fr',
    },
]

interface Governorate {
    code: string;
    name: string;
    name_ar: string;
    name_en: string;
    name_ku: string;
}

export const governorates : Governorate[] = [
  {
    "code": "BGH",
    "name": "Baghdad",
    "name_ar": "بغداد",
    "name_en": "Baghdad",
    "name_ku": "بەغدا"
  },
  {
    "code": "BAS",
    "name": "Basra",
    "name_ar": "البصرة", 
    "name_en": "Basra",
    "name_ku": "بەسرە"
  },
  {
    "code": "ARB",
    "name": "Arbil",
    "name_ar": "أربيل",
    "name_en": "Arbil",
    "name_ku": "هەولێر"
  },
  {
    "code": "SUL",
    "name": "Sulaymaniyah",
    "name_ar": "السليمانية",
    "name_en": "Sulaymaniyah", 
    "name_ku": "سلێمانی"
  },
  {
    "code": "DUH",
    "name": "Duhok",
    "name_ar": "دهوك",
    "name_en": "Duhok",
    "name_ku": "دهۆک"
  },
  {
    "code": "NIN",
    "name": "Ninawa",
    "name_ar": "نينوى",
    "name_en": "Ninawa",
    "name_ku": "نەینەوا"
  },
  {
    "code": "ANB",
    "name": "Anbar",
    "name_ar": "الأنبار",
    "name_en": "Anbar",
    "name_ku": "ئەنبار"
  },
  {
    "code": "KIR",
    "name": "Kirkuk",
    "name_ar": "كركوك",
    "name_en": "Kirkuk",
    "name_ku": "کەرکووک"
  },
  {
    "code": "DIY",
    "name": "Diyala",
    "name_ar": "ديالى",
    "name_en": "Diyala",
    "name_ku": "دیالە"
  },
  {
    "code": "SAL",
    "name": "Salah al-Din",
    "name_ar": "صلاح الدين",
    "name_en": "Salah al-Din",
    "name_ku": "سەلاحەددین"
  },
  {
    "code": "NAJ",
    "name": "Najaf",
    "name_ar": "النجف",
    "name_en": "Najaf",
    "name_ku": "نەجەف"
  },
  {
    "code": "KAR",
    "name": "Karbala",
    "name_ar": "كربلاء",
    "name_en": "Karbala",
    "name_ku": "کەربەلا"
  },
  {
    "code": "BAB",
    "name": "Babylon",
    "name_ar": "بابل",
    "name_en": "Babylon",
    "name_ku": "بابل"
  },
  {
    "code": "WAS",
    "name": "Wasit",
    "name_ar": "واسط",
    "name_en": "Wasit",
    "name_ku": "واسیت"
  },
  {
    "code": "MAY",
    "name": "Maysan",
    "name_ar": "ميسان",
    "name_en": "Maysan",
    "name_ku": "مەیسان"
  },
  {
    "code": "DHI",
    "name": "Dhi Qar",
    "name_ar": "ذي قار",
    "name_en": "Dhi Qar",
    "name_ku": "زیقار"
  },
  {
    "code": "MUT",
    "name": "Al-Muthanna",
    "name_ar": "المثنى",
    "name_en": "Al-Muthanna",
    "name_ku": "موسەنا"
  },
  {
    "code": "QAD",
    "name": "Al-Qadisiyyah",
    "name_ar": "القادسية",
    "name_en": "Al-Qadisiyyah",
    "name_ku": "قادسیە"
  },
  {
    "code": "HAL",
    "name": "Halabja",
    "name_ar": "حلبجة",
    "name_en": "Halabja",
    "name_ku": "هەڵەبجە"
  }
]