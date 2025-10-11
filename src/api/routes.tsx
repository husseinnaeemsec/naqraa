export const endpoints = {
    user:{
        login:'/users/login/',
        logout:'/users/logout/',
        profile:'/users/status/',
        changePassword:'/users/password/change/',
        requestPasswordChange:'/users/password/request-password-change/',
        organization:{
            updateOrganization:''
        },
        enrollments:{
            list:'/enrollments/',
            getEnrollment:(id:number) => `/enrollments/${id}/`,
            getLecture:(enrollment_id:number,lecture_id:number) => `/enrollments/get-lecture/${enrollment_id}/${lecture_id}/` ,
            addNote:'/enrollments/notes/add/',
            manage:(id:number) => `/enrollments/notes/manage/${id}/`,
            updateLastWatchedLecture:(enrollmentId:number,lectureId:number) => `/enrollments/update-last-watched-lecture/${enrollmentId}/${lectureId}/`,
            completeLecture:(enrollmentId:number,lectureId:number) => `/enrollments/complete-lecture/${enrollmentId}/${lectureId}/`,
            completeQuiz:(quiz_id:number)=> `/enrollments/complete-quiz/${quiz_id}/`,
        }
    },
    courses:{
        discussion:(course_id:number) => `/courses/discussion/${course_id}/`
    },
    organization:{
        exams:'/organizations/exams/',
        upcoming_exams:'/organizations/exams/upcoming/',
        upcoming_homework:'organizations/homework/upcoming/'
    },
    notifications:{
        list:'/notifications/',
        update:(notification_id:number) => `/notifications/update/${notification_id}/`,
        
    },
    productivity:{
        tasks:{
            list:'/productivity/tasks/',
        },
        collections:{
            list:'/productivity/tasks/collections/'
        }
    },
    chat:{
        list:'chats/',
        get:(chatId:number)=> `chats/${chatId}/`,
        getMessages:(chatId:number) => `chats/${chatId}/messages/`,
    }
}


export const ws_endpoints = {
    chat:(chatId:number)=> `ws://localhost:8000/ws/chat/${chatId}/` 
}