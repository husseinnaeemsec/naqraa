import type { Governorate } from "./core";
import type { Enrollment } from "./enrollments";
import type { Student } from "./student";
import type { Subscription } from "./subscription";

export interface UserPreference {
    language:'ar'|'en'|'ku';
    theme:'dark'|'light';
}

export interface UserProfile {
    bio:string|null;
    avatar:string|null;
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
    }[]
}

export interface InitialAuthStateProps {
    user:AuthUser|AnonUser;
    isAuthenticated:boolean;
    loadingUser:boolean;
    enrollments:Enrollment[];
    notifications:[];

}



export type AnonUser = null;