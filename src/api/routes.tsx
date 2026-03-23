export const endpoints = {
    newsletter:{
        verify:'/newsletters/verify/',
        subscribe:'/newsletters/subscribe/'

    },
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
        account:{
            me:'/users/me/',
            update:'/users/me/update/'
        },
        login:'/users/login/',
        register:"/users/register/",
        logout:'/users/logout/',
        status:"/users/check/",
        changePassword:(uid:string, token:string)=>`/users/password/reset/${uid}/${token}/`,
        changeEmail:'/users/change-email/',
        requestPasswordChange:'/users/password/request-reset/',
        sendVerificationEmail:"/users/send-verification-email/",
        verification:{
            verify:(uid:string,token:string) => `/users/verify/${uid}/${token}/`,
            request:'/users/verify/request/',
        },
        organization:{
            updateOrganization:'',
            list:'/organization/',
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
            status:(course_id:number)=>`/enrollments/status/${course_id}/`,
        },
        preferences: '/users/preferences/',
        completeOnboarding: '/users/preferences/complete-onboarding/'
    },
    student:{
        me:'/student/me',
        preferences:'/student/me/preferences/',
        completeOnboarding:'/student/me/preferences/complete-onboarding/',
        upcomingEvents:'/student/events/upcoming/',
        authentication:{
            login:'/student/auth/login/',
            logout:'/student/auth/logout/',
            status:'/student/auth/status/',
        },
        timetable:{
            list:'/student/timetable/'
        },
        exams:'/student/exams',
        exam:(examId:number|string)=>`/student/exams/${examId}`
    },
    courses:{
        list:'/courses/',
        details:(slug:string)=> `/courses/${slug}/`,
        discussion:(course_id:number) => `/courses/discussion/${course_id}/`,

    },
    organization:{
        exams:'/organization/exams/',
        getExam:(examId:number|string)=>`/organization/exams/${examId}/`,
        upcoming_exams:'/organization/exams/upcoming/',
        upcoming_homework:'/organization/homework/upcoming/',
        search:`/organization/`,
        join:'/organization/join/',
    },
    assessments:{
        homework:{
            list:'/assessments/homework/',
            upcoming:'/assessments/homework/upcoming/',
        },
        quiz:{
            list:'/assessments/quiz/',
            upcoming:'/assessments/quiz/upcoming/',
            ended:'/assessments/quiz/ended/'
        }
    },
    notifications:{
        list:'/notifications/',
        update:(notification_id:number) => `/notifications/update/${notification_id}/`,
        subscription:{
            verify:'/notifications/verify-subscription/',
            subscribe:'/notifications/subscribe/'

        }
        
    },
    productivity:{
        tasks:{
            list:'/productivity/tasks/', // Returns only tasks with no collection
            create:'/productivity/tasks/create/',
            updateOrDelete:(taskId:number) => `/productivity/tasks/${taskId}/`,
            today:'/productivity/tasks/today/'
        },
        collections:{
            list:'/productivity/tasks/collections/' // Returns collections with their tasks
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
        plans: '/subscription/plans/',
        createPaymentIntent:'/subscription/create-payment-intent/',
        createSubscription: '/subscription/create-subscription/',
        createCheckout: '/subscription/create-checkout-session/',
        status: '/subscription/status/',
        cancel:'/subscription/cancel/',
        webhook: '/subscription/webhook/',
        list: '/subscription/plans/',  // Alias for backward compatibility
        current: '/subscription/status/',  // Use status endpoint for current subscription
        history: '/subscription/history/'
    },
    resources:{
        list:'/resources/',
        detail:(resource_id:number) => `/resources/${resource_id}/`,
        search:'/resources/search/'
    },

    core:{
        events:'/events/'
    }
}


export const ws_endpoints = {
    chat:(chatId:number)=> `${import.meta.env.VITE_WS_HOST}/chat/${chatId}/` 
}