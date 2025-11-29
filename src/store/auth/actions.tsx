import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";
import { endpoints } from "../../api/routes";

export const loginUser = createAsyncThunk(
    "auth/login",
    async( { username,password } : { username:string;password:string }, { rejectWithValue } )=>{

        try{
            const response = await api.post(endpoints.user.login,{username,password});
            return response.data;
        }catch(error:any){

            return rejectWithValue(
                error.response?.data || 'Login failed.'
            )
        }

    }
)

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async({},{ rejectWithValue })=>{
        try{

            const response = await api.post(endpoints.user.logout);

            return response
            
        }catch(error:any){

            return rejectWithValue(
                error.response?.data || 'Logout failed.'
            )
        }
    }
)

