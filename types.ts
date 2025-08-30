export interface Profile{
    theme:string;
    lang:string;
    profile_picture:string;
    email_notifications:boolean;
    push_notifications:boolean;
    newsletter_notifications:boolean;
    study_reminders:boolean;
    reminder_frequency:'daily'|'monthly'|'weekly';


}

export type QuizAttemptEvent =
  | "start"
  | "answer"
  | "finish"
  | "timeout"
  | "leaved";

export interface Grade{
    number:number;
    name:string;
    level:Level;
}

export interface Level{
    name:string;
    slug:string;
}

export interface Subject{
    name:string;
    description:string;
}

export interface Level{
    name:string;
    slug:string;
}

export interface Grade{
    level:Level;
    number:number;
    name:string;
}

export interface Course {
    title:string;
    description:string;
    slug:string;
    cover:string;
    subject:Subject;
    featured:boolean;
    available_in:number[];
    instructor:User;
    level:string;
    grades:number[];
}

export interface EnrollmentCourse extends Course{
    sections:EnrollmentSection[];
}

export interface Section {
    id:number;
    title:string;
    description:string;
    slug:string;
    cover:string;
    intro:string;
    order:number;
}

export interface EnrollmentSection extends Section {
    lectures:EnrollmentLecture[]
}

export interface Quiz {
    id:number;
    title:string;
    description:string;
    slug:string;
    order:number;
}

export interface EnrollmentQuiz extends Quiz{
    questions:QuizQuestion[];
}

interface QuizQuestionOption {
    id:number;
    text:string;
}

export interface QuizQuestion {
    id:number;
    question_type:'MC'|"TF";
    order:number;
    mandatory:boolean;
    text:string;
    choices:QuizQuestionOption[]
}

export interface Lecture {
    id:number;
    title:string;
    description:string;
    content:string;
    slug:string;
    cover:string;
    video:string;
    is_free:boolean;
    order:number;
    duration:number;
}

export interface LectureResource {
    id:number;
    name:string|null;
    description:string|null;
    file_name:string;
    file_type:'video'|"document"|"image";
    file:string;
    file_extension:'.jpg'|'.jpeg'|'.png'|'.pdf'|'.docx'|'.mp4'|'.webm';
    file_size:number;
}

export interface LectureNote {
    id:number;
    title:string;
    text:string;
    color:string;
    timestamp:string|null;
    created_at:string;
}

export interface EnrollmentLecture  extends Lecture{
    quizzes:EnrollmentQuiz[];
    resources:LectureResource[];
    notes:LectureNote[];
}

export interface Enrollment {
    id:number;
    course:EnrollmentCourse;
    completed_sections:number[];
    completed_lectures:number[];
    last_watched_section:number|null;
    last_watched_lecture:number|null;
    lecture_progresses:number[];
}



export interface User {
    first_name:string;
    username:string;
    last_name:string|null;
    email:string;
    role:'organization'|'user'|'student';
    profile:Profile|null;
    date_joined:string;
    grade:Grade|null;
}

export interface InitialAuthState{
    user:User|null;
    isAuthenticated:boolean;
    loadingUser:boolean;
    authError:string[]
    enrollments:Enrollment[]
}

export interface UserStatusResponse extends User {}



export interface UpdateUserData {
    first_name:string;
    last_name:string;
    email:string;
    profile?:Profile;
}