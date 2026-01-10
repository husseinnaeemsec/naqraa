import type { Governorate } from "./core";
import type { Enrollment } from "./enrollments";
import type { Student } from "./student";
import type { Subscription } from "./subscription";
import type { Notification } from "../../types";

export interface UserPreference {
    language:'ar'|'en'|'ku';
    theme:'dark'|'light';
}

export interface UserProfile {
    bio:string|null;
    avatar:string|null;
    email_notifications?:boolean;
    push_notifications?:boolean;
    study_reminders?:boolean;
    newsletter_notifications?:boolean;
    reminder_frequency?:string;
    lang?:'ar'|'en'|'ku';
    organization?:any;
}

export interface UpdateUserResponse{
    data:AuthUser;
}


export interface AuthUser {
    role:'student'|'teacher'|'user';
    gender:'male'|'female';
    governorate:Governorate;
    governorate_display:string;
    first_name:string;
    last_name:string;
    username:string;
    email:string;
    phone_number?:string;
    student:Student;
    profile:UserProfile|null;
    preferences:UserPreference|null;
    date_joined:string;
    subscription?:Subscription;
    enrolled_courses?:{
        course:number;
        enrollment:number;
    }[];
    organization?:any;
    organization_request_sent?:boolean;
}

export interface InitialAuthStateProps {
    user:AuthUser|AnonUser;
    isAuthenticated:boolean;
    loadingUser:boolean;
    enrollments:Enrollment[];
    notifications:Notification[];

}



export type AnonUser = null;