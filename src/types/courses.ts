import type { Chapter, ChapterSubject, Grade, OfficialBook, Subject } from "./academics";
import type { MetaFields, SEOFields } from "./core";

export interface CourseCategory {
    name:string;
    description:string|null;
}

export interface CourseInstructor{
    full_name:string;
    username:string;
    avatar:string;
}

export interface Course extends SEOFields,MetaFields {
    title:string;
    book:OfficialBook|null;
    description:string;
    slug:string;
    cover:string|null;
    is_published?:boolean;
    subject:Subject|null;
    featured:boolean;
    instructor:CourseInstructor;
    grade:Grade;
    intero:string;
    average_rating:number;
    total_reviews:number;
    rating?:number;
    sections?:CourseSection[];
}

export interface CourseSection extends SEOFields,MetaFields{
    course?:Course;
    chapter:Chapter|null;
    title:string;
    description:string;
    slug:string;
    cover:string|null;
    lectures?:CourseLecture[];
}

export interface CourseLecture {
    section?:CourseSection;
    chapter_subject:ChapterSubject|null;
    title:string;
    description:string;
    content:string;
    slug:string;
    cover:string|null;
    video:string;
    duration:number;
}

