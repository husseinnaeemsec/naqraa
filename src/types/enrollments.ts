import type { Course, CourseLecture } from "./courses";

export interface Enrollment {
    id:number;
    course?:Course;
    completed_sections:[],
    completed_lectures:[],
    last_watched_lecture:CourseLecture|null;
    completed:boolean;
    progress:number;
}