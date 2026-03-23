import type { Governorate } from "./core";

export interface UserPreference {
    language:'ar'|'en'|'ku';
    theme:'dark'|'light';
}



export interface UpdateUserResponse{
    data:UserType;
}


export interface UserType {
    role:'student'|'teacher'|'user';
    gender:'male'|'female';
    governorate:Governorate;
    first_name:string;
    last_name:string;
    username:string;
    email:string;
    avatar:string|null;
    language:'ar'|'en'|'ku';
    theme:'dark'|'light';
    account_provider:'local'|'google'|'facebook';
}

export interface InitialAuthStateProps {
    user:UserType|AnonUser;
    isAuthenticated:boolean;
    loadingUser:boolean;

}



export type AnonUser = null;