import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Enrollment } from "../../types/enrollments";
import type { TimeTable } from "../../types/academics";
import type { Event } from "../../types/core";
import { getStudentEnrollments } from "./actions";


interface studentInitialState {

    enrollments:{
        loading:boolean;
        ids:number[];
        objects:Enrollment[];
        errors?:string[];
    },
    timetable:{
        loading:boolean;
        id:number|null;
        objects:TimeTable|null;
        errors?:string[];
    },
    events:{
        loading:boolean;
        ids:number[];
        objects:Event[];
        errors?:string[];
    },
    enrolled_courses:{
        loading:boolean;
        response:{
            course_id:number;
            enrollment_id:number;
        }[];
        errors?:string[];
    }
}

const initialState: studentInitialState = {
    enrollments:{
        loading:true,
        ids:[],
        objects:[]
    },
    timetable:{
        loading:true,
        id:null,
        objects:null
    },
    events:{
        loading:true,
        ids:[],
        objects:[]
    },
    enrolled_courses:{
        loading:true,
        response:[]
    },
}


const studentSlice = createSlice(
    {
        name:"student",
        initialState:initialState,
        reducers: {},
        extraReducers:(builder)=>{
            builder
            .addCase(getStudentEnrollments.pending,(state)=>{
                state.enrollments.loading = true;
            })
            .addCase(getStudentEnrollments.fulfilled,(state, action: PayloadAction< { results:Enrollment[],next: string | null, count: number , previous: string | null} >)=>{
                state.enrollments.objects = action.payload.results;
                state.enrollments.ids = action.payload.results.map(enrollment => enrollment.id);
                state.enrollments.loading = false;
            })
            .addCase(getStudentEnrollments.rejected,(state, action)=>{
                state.enrollments.errors = action.error.message ? [action.error.message] : [];
                state.enrollments.loading = false;

            })
        }
    }
);

export const studentActions = studentSlice.actions;
export default studentSlice.reducer;
