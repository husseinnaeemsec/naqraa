
export type LectureTab = 'resources'|'content'|'quizzes'|'notes'|'discussion'

export interface CurrentLecture extends Lecture {
    quizzes:EnrollmentQuiz[],
    notes:LectureNote[],
    resources:LectureResource[],
    content:string;
    video:string;
}   



export interface EnrollmentState {
    enrollment:Enrollment|null;
    completed_lectures:number[];
    completed_sections:number[];
    completed_quizzes:number[];
    lectures:EnrollmentLecture[];
    sections:EnrollmentSection[];
    activeLecture:EnrollmentLecture|null;
    currentLecture:CurrentLecture|null;
    nextLecture:EnrollmentLecture|null;
    quizzes:Quiz[];
    notes:LectureNote[];
    resources:LectureResource[],
    progress:number;
    completed:boolean;
    discussions:CourseDiscussionMessage[],
    
}

export interface ChatProps{
    id:number;
    user_id:number;
    chat_name:string;
    user_avatar:string|null;
    created_at:string;
    updated_at:string;
    last_msg:{
        text:string
    }|null
}

export interface ChatMessageProps {
    id:number;
    text:string;
    type:'chat_message'|'initial_data'|'active_users_update';
    active_users?:number[];
    created_at:string;
    me:boolean;
    sender:{
        first_name:string;
        last_name:string;
        username:string;
        profile_picture:string|null;
    }
}

export interface InitialWSData {
    type:'initial_data'|'chat_message';
    active_users:number[];
}

export interface PushNotification{
    title:string;
    content:string;
    group:"public"|string;
    link:string|null
    id?:string
}

export interface Profile {
    theme: string;
    lang: string;
    profile_picture: string;
    email_notifications: boolean;
    push_notifications: boolean;
    organization: Organization | null;
    newsletter_notifications: boolean;
    study_reminders: boolean;
    reminder_frequency: 'daily' | 'monthly' | 'weekly';
    organization_request_sent: boolean;
}

export interface Notification {
    id:number;
    type:'system'|'org'|'user';
    title:string|null;
    content:string;
    read:boolean;
    sneder:string;
    profile_picture:string|null;
    created_at:string|null;
}

export type QuizAttemptEvent =
    | "start"
    | "answer"
    | "finish"
    | "timeout"
    | "leaved";

export interface Grade {
    number: number;
    name: string;
    level: Level;
}

export interface Level {
    name: string;
    slug: string;
}

export interface Subject {
    id:number;
    name: string;
    image?:string;
    description: string;
}

export interface Level {
    name: string;
    slug: string;
}

export interface Grade {
    id:number;
    level: Level;
    number: number;
    name: string;
}

export interface SubscriptionPlan {
    id:number;
    name:string;
    code:string;
    price:number;
    is_free:boolean;
}

export interface Subscription {
    plan:SubscriptionPlan;
    start_date:string;
    end_date:string;
    is_active:boolean;
    remaining_days:number;
}

export interface Course {
    id: number;
    title: string;
    description: string;
    slug: string;
    cover: string;
    subject: Subject;
    featured: boolean;
    available_in: SubscriptionPlan[];
    instructor: Instructor;
    level: string;
    grades: number[];
    rating:number;
    average_rating:number;
    total_reviews:number;
}

export interface CourseReview{
    id:number;
    user:{
        first_name:string;
        last_name:string;
        profile_picture:string;
    };
    comment:string|null;
    created_at:string;
    rating:number;
}

export interface Instructor{
    first_name:string;
    last_name:string;
    profile_picture:string;
    username:string;
}

export interface EnrollmentCourse extends Course {
    sections: EnrollmentSection[];
}

export interface Section {
    id: number;
    title: string;
    description: string;
    slug: string;
    order: number;
}

export interface EnrollmentSection extends Section {
    lectures: EnrollmentLecture[]
}

export interface Quiz {
    id: number;
    title: string;
    description: string;
    slug: string;
    order: number;
    mandatory: boolean;

}

export interface EnrollmentQuiz extends Quiz {
    questions: QuizQuestion[];
    score:number;
}

interface QuizQuestionOption {
    id: number;
    text: string;
}

export interface QuizQuestion {
    id: number;
    question_type: 'MC' | "TF";
    order: number;
    mandatory: boolean;
    text: string;
    choices: QuizQuestionOption[]
}

export interface Lecture {
    id: number;
    title: string;
    description: string;
    order: number;
    duration: number;
    cover:string;
}

export interface LectureResource {
    id: number;
    name: string | null;
    description: string | null;
    file_name: string;
    file_type: 'video' | "document" | "image";
    file: string;
    file_extension: '.jpg' | '.jpeg' | '.png' | '.pdf' | '.docx' | '.mp4' | '.webm';
    file_size: number;
}

export interface LectureNote {
    id: number;
    title: string;
    text: string;
    color: string;
    timestamp: string | null;
    created_at: string;
}

export interface LectureTimeline {
    id: number;
    start: number;
    end: number;
    title: string;
    description: string | null;
}

export interface EnrollmentLecture extends Lecture {}


export interface Enrollment {
    id: number;
    course: EnrollmentCourse;
    completed_sections: number[];
    completed_lectures: number[];
    last_watched_section: number | null;
    last_watched_lecture: EnrollmentLecture | null;
    lecture_progresses: number[];
    completed_quizzes:number[];
    completed:boolean;
    progress:number;
}

export interface TimeTableItem {
    id: number;
    subject: number;
    subject_name:string;
    day: string;
    from_time: string;
    to_time: string;
    is_day_off:boolean;
}

export interface Exam {
    id:number;
    title:string;
    description:string|null;
    subject_name:string;
    class_room_name:string;
    date:string;
    time:string;
}

export interface TimeTable {
    id: number;
    class_room: number;
    class_room_name: string;
    items:TimeTableItem[]
}

interface ClassRoom {
    id: number;
    name: string;
    grade: Grade;
    timetable:TimeTable|null;
}

export interface UserProgress {
    last_watched_enrollment:{
        title:string;
        description:string;
        cover:string;
        id:number;
    }|null;
}

export interface User {
    first_name: string;
    username: string;
    last_name: string | null;
    email: string;
    role: 'organization' | 'user' | 'student';
    profile: Profile | null;
    date_joined: string;
    class_room: ClassRoom | null;
    progress:UserProgress|null;
    week_study_time:StudyTimeWeek|null;
    subscription:Subscription|null;
}

export interface InitialAuthState {
    user: User | null;
    isAuthenticated: boolean;
    loadingUser: boolean;
    authError: string[]
    enrollments: Enrollment[]
    ready_for_notifications?: boolean;
    notifications:Notification[];
    week_study_time:StudyTimeWeek|null;
}

export interface UserStatusResponse extends User { }

export interface Organization {
    id: number;
    name: string;
    username: string;
}


export interface HomeWork {
    id:number;
    title:string|null;
    description:string;
    subject_name:string;
    class_room_name:string;
    date:string;
}

export interface Task {
  id: number;
  title: string;
  content?: string;
  completed: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  due_date?: string; // ISO string
  created_at?: string; // ISO string
  updated_at?: string; // ISO string
  repeat_type:'none'|'daily'|'weekly'|'monthly'|'yearly'|'custom'
  
}

export interface TaskCollection {
  id: number;
  name: string;
  description?: string;
  user: number; // User ID
  tasks?: Task[]; // Nested tasks
  created_at?: string; // ISO string
  updated_at?: string; // ISO string
}


export interface UpdateUserData {
    first_name: string;
    last_name: string;
    email: string;
    profile?: Profile;
}

export interface CourseDiscussionMessage {
    id: number;
    user: {
        username: string;
        first_name: string;
        last_name: string;
        profile_picture: string;
        id: number;
    };
    content: string;
    created_at: string;
    updated_at: string;
    children: CourseDiscussionMessage[];
}

export interface StudySession {
    study_time_in_sec:number;
    is_today:boolean;
    date:string;
    day_info:{
        name:string;
        number:number;
    }
}

export interface StudyTimeWeek {
  sunday: StudySession | null;
  monday: StudySession | null;
  tuesday: StudySession | null;
  wednesday: StudySession | null;
  thursday: StudySession | null;
  friday: StudySession | null;
  saturday: StudySession | null;
}
