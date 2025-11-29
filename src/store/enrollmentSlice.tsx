import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CourseDiscussionMessage,
  CurrentLecture,
  Enrollment,
  EnrollmentLecture,
  EnrollmentSection,
  EnrollmentState,
} from "../../types";

const initialState: EnrollmentState = {
  completed_lectures: [],
  completed_sections: [],
  completed_quizzes: [],
  activeLecture: null,
  currentLecture: null,
  nextLecture: null,
  enrollment: null,
  notes: [],
  quizzes: [],
  resources: [],
  lectures: [],
  sections: [],
  progress: 0,
  completed:false,
  discussions:[],
};

const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState,
  reducers: {
    setEnrollment: (state, action: PayloadAction<Enrollment>) => {
      state.enrollment = action.payload;
      const flatLectures: EnrollmentLecture[] = [];
      state.sections = action.payload.course.sections.filter(s=>s.lectures.length >= 1);

      action.payload.course.sections.forEach((s) => {
        s.lectures.forEach((l) => flatLectures.push(l));
      });
      state.lectures = flatLectures;
      state.completed_lectures = action.payload.completed_lectures;
      state.completed_sections = action.payload.completed_sections;
      state.completed_quizzes = action.payload.completed_quizzes;
      state.completed = action.payload.completed;
    },

    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },

    setCompleted:(state,action:PayloadAction<boolean>)=>{
      state.completed = action.payload;
    },

    setDiscussions:(state,action:PayloadAction<CourseDiscussionMessage[]>)=>{
      state.discussions = action.payload;
    },
    setSections: (state, action: PayloadAction<EnrollmentSection[]>) => {
      const flatLectures: EnrollmentLecture[] = [];
      state.sections = action.payload;

      action.payload.forEach((s) => {
        s.lectures.forEach((l) => flatLectures.push(l));
      });

      state.lectures = flatLectures;
    },

    setLectures: (state, action: PayloadAction<EnrollmentLecture[]>) => {
      state.lectures = action.payload;
    },

    setActiveLecture: (state, action: PayloadAction<EnrollmentLecture | null>) => {
      state.activeLecture = action.payload;
    },

    setCurrentLecture: (state, action: PayloadAction<CurrentLecture | null>) => {
      state.currentLecture = action.payload;
    },
    setNextLecture: (state, action: PayloadAction<EnrollmentLecture | null>) => {
      state.nextLecture = action.payload;
    },

    setCompletedQuizzes: (state, action: PayloadAction<number[]>) => {
      state.completed_quizzes = action.payload;
    },

    setCompletedLectures: (state, action: PayloadAction<number[]>) => {
      state.completed_lectures = action.payload;
    },

    addToCompletedLectures: (state, action: PayloadAction<number>) => {
      const lecture_id = action.payload;
      if (!state.completed_lectures.includes(lecture_id)) {
        state.completed_lectures.push(lecture_id);
      }
    },

    removeFromCompletedLectures: (state, action: PayloadAction<number>) => {
      state.completed_lectures = state.completed_lectures.filter(
        (id) => id !== action.payload
      );
    },

    setCompletedSections: (state, action: PayloadAction<number[]>) => {
      state.completed_sections = action.payload;
    },

    addToCompletedSections: (state, action: PayloadAction<number>) => {
      const section_id = action.payload;
      if (!state.completed_sections.includes(section_id)) {
        state.completed_sections.push(section_id);
      }
    },

    removeFromCompletedSections: (state, action: PayloadAction<number>) => {
      state.completed_sections = state.completed_sections.filter(
        (id) => id !== action.payload
      );
    },

    setNotes: (state, action: PayloadAction<any[]>) => {
      state.notes = action.payload;
    },

    setResources: (state, action: PayloadAction<any[]>) => {
      state.resources = action.payload;
    },

    setQuizzes: (state, action: PayloadAction<any[]>) => {
      state.quizzes = action.payload;
    },
  },
});

export const {
  setEnrollment,
  setProgress,
  setSections,
  setLectures,
  setActiveLecture,
  setCurrentLecture,
  setNextLecture,
  setCompletedQuizzes,
  setCompletedLectures,
  addToCompletedLectures,
  removeFromCompletedLectures,
  setCompletedSections,
  addToCompletedSections,
  removeFromCompletedSections,
  setNotes,
  setResources,
  setQuizzes,
  setCompleted,
  setDiscussions,
} = enrollmentSlice.actions;

export default enrollmentSlice.reducer;
