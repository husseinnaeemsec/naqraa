import type { MetaFields } from "./core";
import type { Enrollment } from "./enrollments";
import type { Classroom, Organization } from "./organization";

export const ReminderChoices = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
} as const;
export type ReminderChoicesType = typeof ReminderChoices[keyof typeof ReminderChoices];

export const StudyType = {
  READING: "reading",
  WATCHING: "watching",
  LISTENING: "listening",
  INTERACTIVE: "interactive",
  PRACTICE: "practice",
  MIXED: "mixed",
} as const;
export type StudyTypeType = typeof StudyType[keyof typeof StudyType];

export const StudyTime = {
  MORNING: "morning",
  AFTERNOON: "afternoon",
  EVENING: "evening",
  NIGHT: "night",
  FLEXIBLE: "flexible",
} as const;
export type StudyTimeType = typeof StudyTime[keyof typeof StudyTime];

export const DifficultyLevel = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
  MIXED: "mixed",
} as const;
export type DifficultyLevelType = typeof DifficultyLevel[keyof typeof DifficultyLevel];

export const StudyGoal = {
  IMPROVE_GRADES: "improve_grades",
  EXAM_PREPARATION: "exam_preparation",
  SKILL_DEVELOPMENT: "skill_development",
  CAREER_ADVANCEMENT: "career_advancement",
  PERSONAL_INTEREST: "personal_interest",
  CERTIFICATION: "certification",
  CATCH_UP: "catch_up",
  ADVANCE_LEARNING: "advance_learning",
  COMPETITION_PREP: "competition_prep",
  GENERAL_KNOWLEDGE: "general_knowledge",
} as const;
export type StudyGoalType = typeof StudyGoal[keyof typeof StudyGoal];


export interface StudentPreferences {
  study_reminders: boolean;
  reminder_frequency: ReminderChoicesType;

  subjects_to_improve: number[]; // IDs from ManyToMany (Subject IDs)

  preferred_study_type: StudyTypeType;
  preferred_study_time: StudyTimeType;
  preferred_difficulty: DifficultyLevelType;

  max_video_duration: number;  // minutes
  max_reading_time: number;    // minutes

  interested_in_communities: boolean;
  interested_in_study_groups: boolean;

  study_goal: StudyGoalType | null; // blank=True
  weekly_study_hours_goal: number;

  receive_course_recommendations: boolean;
  receive_quiz_recommendations: boolean;
  receive_resource_recommendations: boolean;
  receive_community_recommendations: boolean;
  completed_onboarding: boolean;
}
export interface StudentStreak{
    longest:number;
    current:number;
}

export interface StreakDay {
    streak?:StudentStreak;
    date:string;
}

export interface StudentProgress{
    last_watched_enrollment:Enrollment|null;
}
export interface StudySession extends MetaFields {
    total_seconds:number;
    date:string;
}

export interface Student{  
    classroom:Classroom|null;
    organization:Organization|null;
    progress:StudentProgress|null;
    preferences:StudentPreferences|null;
    streak:StudentStreak|null;
    weekly_study_time:{[key:string]:number}
}