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

interface Subject extends Grade{}
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