import type { UpdateUserData, User } from "../../../types";
import api from "../../api/client";
import { endpoints } from "../../api/routes";

export class UserManager{
    
    user:User|null;
    
    constructor(user:User|null){
        this.user = user;
    }

    updateProfile(data:UpdateUserData){
        return api.post(endpoints.user.profile,data)
    }
}