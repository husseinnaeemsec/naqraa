import type { MetaFields, SEOFields } from "./core";

export const ExamTypes  = {
        ORGANIZATION : 'organization_exam',
        COURSE    :'course_exam',
        SECTION   : 'section_exam',
        LECTURE   : 'lecture_exam',
        PLATFORM  : 'platform_exam',
        OFFICIAL  : 'official_exam',
        COMMUNITY : 'community_exam',
        USER : 'user',

} as const

export type ExamTypes = (typeof ExamTypes)[keyof typeof ExamTypes];

export interface EducationYear extends SEOFields,MetaFields{
    name:string;
    description:string;
    notes:string;
    slug:string;
    starts_at:string;
    ends_at:string;
}

export interface Subject extends SEOFields,MetaFields{
    education_year:EducationYear;
    name:string;
    description:string;
    image:string;
}

export interface OfficialBook extends SEOFields,MetaFields{
    subject:Subject;
    education_year:EducationYear;
    name:string;
    slug:string;
    file:string;
}

export const GradeValues = {
        // # Middle School (المرحلة المتوسطة)
        FIRST_MIDDLE :"first_middle",
        SECOND_MIDDLE :"second_middle",
        THIRD_MIDDLE :"third_middle",

        // # High School (المرحلة الإعدادية)
        FOURTH_PREP :"fourth_prep",
        FIFTH_PREP :"fifth_prep",
        SIXTH_PREP :"sixth_prep",

        // # Vocational Education (التعليم المهني)
        FIRST_VOCATIONAL :"first_vocational",
        SECOND_VOCATIONAL :"second_vocational",

        // # Technical Colleges (الكليات التقنية)
        FIRST_TECHNICAL :"first_technical",
        SECOND_TECHNICAL :"second_technical",

        // # Universities (الجامعات)
        FIRST_UNIVERSITY :"first_university",
        SECOND_UNIVERSITY :"second_university",
        THIRD_UNIVERSITY :"third_university",
        FOURTH_UNIVERSITY :"fourth_university",
        MASTERS :"masters",
        PHD :"phd",

        // # Alternative naming for flexibility
        YEAR_1 :"year_1",
        YEAR_2 :"year_2",
        YEAR_3 :"year_3",
        YEAR_4 :"year_4",
        YEAR_5 :"year_5",
        YEAR_6 :"year_6",
} as const;

export type GradeValues = (typeof GradeValues)[keyof typeof GradeValues];


export interface Level extends SEOFields,MetaFields{
    name:string;
    slug:string;
}

export interface Grade extends SEOFields,MetaFields{
    level:Level;
    number:number;
    name:GradeValues;
}

export interface Chapter extends SEOFields,MetaFields {
    book?:OfficialBook;
    name:string;
    slug:string;
    file:string;
}

export interface ChapterSubject extends SEOFields,MetaFields {
    chapter?:Chapter;
    name:string;
    slug:string;
    file:string;
}


export interface TimeTableEntry {
  id: number;
  day: string;
  day_number:number;
  from_time: string; // Format: "HH:MM:SS"
  to_time: string;   // Format: "HH:MM:SS"
  subject: string;

}

export interface TimeTable {
  id: number;
  content_type: string; // Generic object - type based on content_type
  education_year: string; // slug format
  name: string;
  description: string;
  enable_reminders: boolean;
  is_default:boolean;
  entries: TimeTableEntry[];
}