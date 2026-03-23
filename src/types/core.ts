
// class DifficultyLevel(models.TextChoices):
//         EASY = 'EASY', _("Easy")
//         MEDIUM = 'MEDIUM', _("Medium")
//         HARD = 'HARD', _("Hard")

const DifficultyLevel = {
    EASY: 'EASY',
    MEDIUM: 'MEDIUM',
    HARD: 'HARD'
} as const;

export type DifficultyLevel = (typeof DifficultyLevel)[keyof typeof DifficultyLevel];

export const OGType = {
        WEBSITE : 'website',
        ARTICLE : 'article',
        PROFILE : 'profile',
        VIDEO : 'video',
} as const;

export type OGType = (typeof OGType)[keyof typeof OGType];

export interface SEOFields {
    seo_title:string|null;
    seo_description:string|null;
    seo_keywords:string|null
    seo_canonical:string|null


    og_title:string|null
    og_description:string|null
    og_image:string|null
    og_type : OGType|null;
    og_url:string|null;

    twitter_card : 'summary_large_image'|'summary'|null
    twitter_title : string|null; 
    twitter_description : string | null;
    twitter_image : string | null;

}

export interface MetaFields {
  created_at:string;
  updated_at:string;
}

export const GovernorateValues = {
  BAGHDAD: "BGH",
  BASRA: "BAS",
  ARBIL: "ARB",
  SULAYMANIYAH: "SUL",
  DUHOK: "DUH",
  NINAWA: "NIN",
  ANBAR: "ANB",
  KIRKUK: "KIR",
  DIYALA: "DIY",
  SALAH_AL_DIN: "SAL",
  NAJAF: "NAJ",
  KARBALA: "KAR",
  BABYLON: "BAB",
  WASIT: "WAS",
  MAYSAN: "MAY",
  DHI_QAR: "DHI",
  MUTHANNA: "MUT",
  QADISIYYAH: "QAD",
  HALABJA: "HAL",
} as const;

export interface Governorate {
    id:number;
    code:GovernorateValues;
    name:string;
}

export interface District {
  governorate?:Governorate;
  name:string;
  code:string;
}

export interface Subdistrict{
  district?:District;
  name:string;
  code:string;
}


export type GovernorateValues = (typeof GovernorateValues)[keyof typeof GovernorateValues];

export const WeekDay = {
        SUN : 'Sunday',
        MON : 'Monday',
        TUE : 'Tuesday',
        WED : 'Wednesday',
        THU : 'Thursday',
        FRI : 'Friday',
        SAT : 'Saturday',
} as const

export type WeekDay = (typeof WeekDay)[keyof typeof WeekDay];

export interface Tag {
  name:string;
  description:string;
  slug:string;
}

export interface Event {
    title:string;
    due_date:string|null;
    description:string|null;
    event_type:'exam'|'quiz'|'other'
}