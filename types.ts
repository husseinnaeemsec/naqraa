export interface StudySession {
    study_time_in_sec: number;
    is_today: boolean;
    date: string;
    day_info: {
        name: string;
        number: number;
    };
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
    lang: 'en'|'ar'|'ku';
    profile_picture: string;
    email_notifications: boolean;
    push_notifications: boolean;
    organization: Organization | null;
    newsletter_notifications: boolean;
    study_reminders: boolean;
    reminder_frequency: 'daily' | 'monthly' | 'weekly';
    organization_request_sent: boolean;
}

export interface UserPreference {
    id: number;
    subjects_to_improve: Subject[];
    subjects_to_improve_ids?: number[];
    preferred_study_type: 'reading' | 'watching' | 'listening' | 'interactive' | 'practice' | 'mixed';
    preferred_study_type_display: string;
    preferred_study_time: 'morning' | 'afternoon' | 'evening' | 'night' | 'flexible';
    preferred_study_time_display: string;
    preferred_difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
    preferred_difficulty_display: string;
    max_video_duration: number;
    max_reading_time: number;
    interested_in_communities: boolean;
    interested_in_study_groups: boolean;
    study_goal: string;
    weekly_study_hours_goal: number;
    receive_course_recommendations: boolean;
    receive_quiz_recommendations: boolean;
    receive_resource_recommendations: boolean;
    receive_community_recommendations: boolean;
    completed_onboarding: boolean;
    is_setup_complete: boolean;
    created_at: string;
    updated_at: string;
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

export interface Feature {
    id: number;
    code: string;
    name: string;
    description: string;
}

export interface SubscriptionPlan {
    id: number;
    name: string;
    name_ar: string;
    code: string;
    price: number;
    duration_days: number;
    duration_months: number;
    role: string;
    is_free: boolean;
    is_popular?: boolean;
    description: string;
    description_ar: string;
    features_list: string[];
    features_ar: string[];
    features: Feature[];
    is_recurring: boolean;
    stripe_price_id?: string;
    stripe_product_id?: string;
}

export interface Subscription {
    id: number;
    plan: SubscriptionPlan;
    start_date: string;
    end_date: string;
    is_active: boolean;
    auto_renew: boolean;
    remaining_days: number;
    is_active_subscription: boolean;
    stripe_subscription_id?: string;
    stripe_customer_id?: string;
}

export interface Payment {
    id: number;
    plan: SubscriptionPlan;
    amount: number;
    currency: string;
    status: string;
    payment_method: string;
    transaction_id: string;
    created_at: string;
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
    bio?:string|null;
}

export interface EnrollmentCourse extends Course {
    sections: EnrollmentSection[];
    instructor_name:string;
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

export interface MultipleChoiceQuestionChoice extends QuizQuestionOption {
}

export interface QuizQuestion {
    id: number;
    question_type: 'MC' | "TF" | 'LA' | 'SA' | 'OD' | 'MT' | 'LB' | 'TL'|'FB';
    order: number;
    mandatory: boolean;
    text: string;
    choices: QuizQuestionOption[] | string[] | string;
}

export interface MultipleChoiceQuestion extends QuizQuestion {
    choices:MultipleChoiceQuestion[]|['all'];
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

export interface EnrollmentLecture extends Lecture {
    quizzes: EnrollmentQuiz[];
}


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
    created_at:string;
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

export interface LastWatchedEnrollment {
        title:string;
        description:string;
        cover:string;
        id:number;
}

export interface UserProgress {
    last_watched_enrollment:LastWatchedEnrollment|null;
}



export interface AuthUser {
    id: number;
    first_name: string;
    username: string;
    last_name: string | null;
    email: string;
    role: 'organization' | 'user' | 'student';
    profile: Profile | null;
    preference: UserPreference | null;
    date_joined: string;
    class_room: ClassRoom | null;
    progress:UserProgress|null;
    week_study_time:StudyTimeWeek|null;
    subscription:Subscription|null;
    enrolled_courses:{ course:number,enrollment:number }[];
    organization:number | null;
    streak_days:number;
    study_time:number;
    today_study_time:number;
    completed_courses:number;
    reputation:{
        contribution: number;
        achievement: number;
        interaction: number;
        this_month:number;
        this_week:number;
        today:number;
        total:number;
    }
}

export interface PublicOrganizationProfile {
    id:number;
    name:string;
    username:string;
    bio?: string;
    governorate?: string;
    organization_type?: 'college' | 'school' | 'institute';
    students?: number;
}

export interface InitialAuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    loadingUser: boolean;
    authError: string[]
    enrollments: Enrollment[]
    ready_for_notifications?: boolean;
    notifications:Notification[];
    week_study_time:StudyTimeWeek|null;
}

export interface UserStatusResponse extends AuthUser { }

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

export interface HomeWorkResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: HomeWork[];
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

export type WeekDay = 'sunday'|'monday'|'tuesday'|'wednesday'|'thursday'|'friday'|'saturday'

export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string | null;
    profile_picture?: string;
}

export interface Tag {
    id: number;
    name: string;
}

export interface Topic {
    id: number;
    name: string;
    description: string;
}

export interface Comment {
    id: number;
    user: User;
    content: string;
    parent?: number;
    replies: Comment[];
    created_at: string;
    edited_at: string;
    is_reply: boolean;
}

export interface Post {
    id: number;
    user: User;
    title: string;
    content: string;
    post_type: 'text' | 'link' | 'image';
    link_url?: string;
    image?: string;
    tags: Tag[];
    topic?: Topic;
    is_approved: boolean;
    is_pinned: boolean;
    created_at: string;
    edited: string;
    likes_count: number;
    comments_count: number;
    views_count: number;
    total_interactions: number;
    comments: Comment[];
}

export interface CommunityMembership {
    id: number;
    user: User;
    status: 'pending' | 'active' | 'banned' | 'moderator';
    can_post: boolean;
    can_comment: boolean;
    can_moderate: boolean;
    joined_at: string;
}

export interface Community {
    id: number;
    name: string;
    description: string;
    visibility: 'public' | 'private';
    owner: User;
    created_at: string;
    posts_count: number;
    members_count: number;
    user_membership?: CommunityMembership;
}