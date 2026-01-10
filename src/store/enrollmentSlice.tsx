import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { 
    Enrollment, 
    EnrollmentLecture, 
    CurrentLecture, 
    LectureNote, 
    CourseDiscussionMessage,
    EnrollmentState 
} from '../../types';

const initialState: EnrollmentState = {
    enrollment: null,
    completed_lectures: [],
    completed_sections: [],
    completed_quizzes: [],
    lectures: [],
    sections: [],
    activeLecture: null,
    currentLecture: null,
    nextLecture: null,
    quizzes: [],
    notes: [],
    resources: [],
    progress: 0,
    completed: false,
    discussions: []
};

const enrollmentSlice = createSlice({
    name: 'enrollment',
    initialState,
    reducers: {
        setEnrollment: (state, action: PayloadAction<Enrollment>) => {
            state.enrollment = action.payload;
            state.sections = action.payload.course.sections;
            state.completed_lectures = action.payload.completed_lectures || [];
            state.completed_sections = action.payload.completed_sections || [];
            state.completed_quizzes = action.payload.completed_quizzes || [];
            state.progress = action.payload.progress || 0;
            state.completed = action.payload.completed || false;
            
            // Flatten all lectures from sections
            const allLectures: EnrollmentLecture[] = [];
            action.payload.course.sections.forEach(section => {
                if (section.lectures) {
                    allLectures.push(...section.lectures);
                }
            });
            state.lectures = allLectures;
        },
        
        setActiveLecture: (state, action: PayloadAction<EnrollmentLecture | null>) => {
            state.activeLecture = action.payload;
            
            // Find next lecture
            if (action.payload && state.lectures.length > 0) {
                const currentIndex = state.lectures.findIndex(l => l.id === action.payload!.id);
                if (currentIndex !== -1 && currentIndex < state.lectures.length - 1) {
                    state.nextLecture = state.lectures[currentIndex + 1];
                } else {
                    state.nextLecture = null;
                }
            }
        },
        
        setCurrentLecture: (state, action: PayloadAction<CurrentLecture>) => {
            state.currentLecture = action.payload;
            state.quizzes = action.payload.quizzes || [];
            state.notes = action.payload.notes || [];
            state.resources = action.payload.resources || [];
        },
        
        setDiscussions: (state, action: PayloadAction<CourseDiscussionMessage[]>) => {
            state.discussions = action.payload;
        },
        
        addCompletedLecture: (state, action: PayloadAction<number>) => {
            if (!state.completed_lectures.includes(action.payload)) {
                state.completed_lectures.push(action.payload);
            }
        },
        
        addCompletedSection: (state, action: PayloadAction<number>) => {
            if (!state.completed_sections.includes(action.payload)) {
                state.completed_sections.push(action.payload);
            }
        },
        
        addCompletedQuiz: (state, action: PayloadAction<number>) => {
            if (!state.completed_quizzes.includes(action.payload)) {
                state.completed_quizzes.push(action.payload);
            }
        },
        
        updateProgress: (state, action: PayloadAction<number>) => {
            state.progress = action.payload;
        },
        
        setCompleted: (state, action: PayloadAction<boolean>) => {
            state.completed = action.payload;
        },
        
        addNote: (state, action: PayloadAction<LectureNote>) => {
            state.notes.push(action.payload);
        },
        
        updateNote: (state, action: PayloadAction<LectureNote>) => {
            const index = state.notes.findIndex(n => n.id === action.payload.id);
            if (index !== -1) {
                state.notes[index] = action.payload;
            }
        },
        
        deleteNote: (state, action: PayloadAction<number>) => {
            state.notes = state.notes.filter(n => n.id !== action.payload);
        },
        
        resetEnrollment: () => {
            return initialState;
        }
    }
});

export const {
    setEnrollment,
    setActiveLecture,
    setCurrentLecture,
    setDiscussions,
    addCompletedLecture,
    addCompletedSection,
    addCompletedQuiz,
    updateProgress,
    setCompleted,
    addNote,
    updateNote,
    deleteNote,
    resetEnrollment
} = enrollmentSlice.actions;

export default enrollmentSlice.reducer;
