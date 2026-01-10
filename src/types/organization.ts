import type { Chapter, ChapterSubject, EducationYear, ExamTypes, Grade, OfficialBook, Subject } from "./academics";
import type { Governorate, WeekDay } from "./core";
import type { Student } from "./student";

export interface Organization {
    organization_type:'college'|'school'|'institute';
    name:string;
    username:string;
    profile_picture:string;
    bio:string;
    governorate:Governorate;
}

export interface Classroom {
    education_year:EducationYear;
    name:string;
    organization?:Organization;
    grade:Grade;
}

export interface JoinInviteRequest {
    request_type:'join'|'invite';
    student?:Student;
    classroom?:Classroom|null;
    organization?:Organization;
    status:'pending'|'rejected'|'accepted';
    reason:string|null;
}

export interface Homework{
    classroom?:Classroom;
    title:string|null;
    description:string;
    is_public:boolean;
    book:OfficialBook|null;
    chapter:Chapter|null;
    chapter_subject:ChapterSubject|null;
    date:string;
    mandatory:boolean;
}

export interface Exam {
    type:ExamTypes;
    exam_type:'monthly'|'midterm'|'final'|'quiz';
    book:OfficialBook|null;
    chapter:Chapter|null;
    chapter_subject:ChapterSubject|null;
    classroom?:Classroom;
}
export const TimeTableType = {
        ORGANIZATION : 'organization',
        COURSE    : 'course',
        PLATFORM  : 'platform',
        OFFICIAL  : 'official',
        COMMUNITY : 'community',
        USER : 'user',
} as const 

export type TimeTableType = (typeof TimeTableType)[keyof typeof TimeTableType]

export interface OrganizationTimeTable {
    type:TimeTableType;
    classroom?:Classroom;
    education_year:EducationYear;
}

export interface OrganizationTimeTableSubject {
    subject:Subject;
    timetable?:OrganizationTimeTable;
    day:WeekDay;
    is_day_off:boolean;
    from_time:string;
    to_time:string;
}

