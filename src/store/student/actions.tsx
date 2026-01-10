import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import type { Enrollment } from "../../types/enrollments";

export const getStudentEnrollments = createAsyncThunk<{
    results:Enrollment[],
    next:string|null,
    count:number,
    previous:string|null
}>(
    'student/getEnrollments',
    async () => {
        const response = await api.get(endpoints.user.enrollments.list);
        return response.data;
    }
);