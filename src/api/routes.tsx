export const endpoints = {
    user:{
        login:'/auth/login/',
        logout:'/auth/logout/',
        profile:'/auth/status/',
        changePassword:'/auth/password/change/',
        requestPasswordChange:'/auth/password/request-password-change/',
        enrollments:{
            list:'/enrollments/',
            getEnrollment:(id:number) => `/enrollments/${id}/`,
            addNote:'/enrollments/notes/add/',
            deleteNote:(id:number) => `/enrollments/notes/manage/${id}/`,
        }
    }
}
