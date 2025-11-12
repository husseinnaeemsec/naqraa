export const endpoints = {
    user:{
        login:'/users/login/',
        register:"/users/register/",
        logout:'/users/logout/',
        profile:'/users/profile/',
        status:"/users/check/",
        changePassword:'/users/password/change/',
        requestPasswordChange:'/users/password/request-password-change/',
        studySession:'/users/study-time/',
        sendVerificationEmail:"/users/send-verification-email/",
        verification:{
            verify:(uid:string,token:string) => `/users/verify/${uid}/${token}/`,
            request:'/users/verify/request/',
        },
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
            enroll:( course_id:number )=> `/enrollments/enroll/${course_id}/`,
            status:(course_id:number)=>`/enrollments/status/${course_id}/`
        }
    },
    courses:{
        list:'/courses/',
        details:(slug:string)=> `/courses/${slug}/`,
        discussion:(course_id:number) => `/courses/discussion/${course_id}/`,

    },
    organization:{
        exams:'/organizations/exams/',
        upcoming_exams:'/organizations/exams/upcoming/',
        upcoming_homework:'/organizations/homework/upcoming/',
        search:`/organizations/`
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
        list:'/chats/',
        get:(chatId:number)=> `chats/${chatId}/`,
        getMessages:(chatId:number) => `chats/${chatId}/messages/`,
    },
    content:{
        subjects:`/academics/subjects/`,
        grades:'/academics/grades/'
        
    }
}


export const ws_endpoints = {
    chat:(chatId:number)=> `ws://localhost:8000/ws/chat/${chatId}/` 
}