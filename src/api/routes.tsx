export const endpoints = {
    community:{
        detail:(community_id:number) => `/community/${community_id}/`,
        posts:(community_id:number) => `/community/${community_id}/posts/`,
        createPost:(community_id:number) => `/community/${community_id}/posts/create/`,
        join:(community_id:number) => `/community/${community_id}/join/`,
        approveUser:(community_id:number, membership_id:number) => `/community/${community_id}/memberships/${membership_id}/approve/`,
        postInteract:(community_id:number, post_id:number) => `/community/${community_id}/posts/${post_id}/interact/`,
        createComment:(post_id:number) => `/community/posts/${post_id}/comments/create/`
    },
    user:{
        login:'/users/login/',
        register:"/users/register/",
        logout:'/users/logout/',
        profile:'/users/profile/',
        status:"/users/check/",
        changePassword:(uid:string, token:string)=>`/users/password/reset/${uid}/${token}/`,
        changeEmail:'/users/change-email/',
        requestPasswordChange:'/users/password/request-reset/',
        studySession:'/users/study-time/',
        sendVerificationEmail:"/users/send-verification-email/",
        verification:{
            verify:(uid:string,token:string) => `/users/verify/${uid}/${token}/`,
            request:'/users/verify/request/',
        },
        organization:{
            updateOrganization:'',
            list:'/organizations/',
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
        },
        preferences: '/users/preferences/',
        completeOnboarding: '/users/preferences/complete-onboarding/'
    },
    courses:{
        list:'/courses/',
        details:(slug:string)=> `/courses/${slug}/`,
        discussion:(course_id:number) => `/courses/discussion/${course_id}/`,

    },
    organization:{
        exams:'/organizations/exams/',
        getExam:(examId:number|string)=>`/organizations/exams/${examId}/`,
        upcoming_exams:'/organizations/exams/upcoming/',
        upcoming_homework:'/organizations/homework/upcoming/',
        search:`/organizations/`,
        join:'/organizations/join/',
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
    academics:{
        subjects:`/academics/subjects/`,
        grades:'/academics/grades/'
    },
    content:{
        subjects:`/academics/subjects/`,
        grades:'/academics/grades/'
        
    },
    support:{
        contact:'/support/contact/',

    },
    subscriptions:{
        plans: '/subscriptions/plans/',
        createPaymentIntent:'/subscriptions/create-payment-intent/',
        createSubscription: '/subscriptions/create-subscription/',
        createCheckout: '/subscriptions/create-checkout-session/',
        status: '/subscriptions/status/',
        cancel:'/subscriptions/cancel/',
        webhook: '/subscriptions/webhook/',
        list: '/subscriptions/plans/',  // Alias for backward compatibility
        current: '/subscriptions/status/',  // Use status endpoint for current subscription
        history: '/subscriptions/history/'
    },
    resources:{
        list:'/resources/',
        detail:(resource_id:number) => `/resources/${resource_id}/`,
        search:'/resources/search/'
    }
}


export const ws_endpoints = {
    chat:(chatId:number)=> `ws://localhost:8000/ws/chat/${chatId}/` 
}