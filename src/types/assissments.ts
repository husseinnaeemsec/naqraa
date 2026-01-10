import type { DifficultyLevel, MetaFields, SEOFields } from "./core";



// ============================================================================
// ENUMS
// ============================================================================

/**
 * Quiz creator type - defines the context in which a quiz was created
 */
export const CreatorType = {
    ORGANIZATION: 'organization_quiz',
    COURSE: 'course_quiz',
    SECTION: 'section_quiz',
    LECTURE: 'lecture_quiz',
    PLATFORM: 'platform',
    OFFICIAL: 'official',
    COMMUNITY: 'community',
    USER: 'user'
} as const;

export type CreatorType = (typeof CreatorType)[keyof typeof CreatorType];

/**
 * Quiz type - defines the purpose of the quiz
 */
export const QuizType = {
    QUIZ: 'QUIZ',
    EXAM: 'EXAM',
    PRACTICE: 'PRACTICE',
    MOCK: 'MOCK'
} as const;

export type QuizType = (typeof QuizType)[keyof typeof QuizType];

/**
 * Question type - defines how the question should be answered
 */
export const QuestionType = {
    MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
    TRUE_FALSE: 'TRUE_FALSE',
    SHORT_ANSWER: 'SHORT_ANSWER',
    LONG_ANSWER: 'LONG_ANSWER'
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

/**
 * Quiz attempt status
 */
export const AttemptStatus = {
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    PASSED: 'PASSED'
} as const;

export type AttemptStatus = (typeof AttemptStatus)[keyof typeof AttemptStatus];

/**
 * Homework type - defines the context of the homework
 */
export const HomeworkType = {
    ORGANIZATION: 'organization',
    COURSE: 'course',
    SECTION: 'section',
    LECTURE: 'lecture',
    PRACTICE: 'practice',
    ASSIGNMENT: 'assignment'
} as const;

export type HomeworkType = (typeof HomeworkType)[keyof typeof HomeworkType];

// ============================================================================
// QUIZ INTERFACES
// ============================================================================

/**
 * Quiz - Main quiz/exam entity
 * Includes SEO and metadata fields
 */
export interface Quiz extends SEOFields, MetaFields {
    id: number;
    created_at: string;
    updated_at: string;
    difficulty: DifficultyLevel;
    quiz_type: QuizType;
    creator_type: CreatorType;
    is_public: boolean;
    creator_object_id: number | null;
    title: string;
    description: string;
    slug: string;
    passing_score: number;
    mandatory: boolean;
    start_at: string | null;
    end_at: string | null;
    max_attempts: number;
}

// ============================================================================
// QUESTION INTERFACES
// ============================================================================

/**
 * Question - Individual question in a quiz
 */
export interface Question extends MetaFields {
    id: number;
    created_at: string;
    updated_at: string;
    question_type: QuestionType;
    title: string;
    difficulty: DifficultyLevel;
    order: number;
}

/**
 * Choice - Answer option for multiple choice/true-false questions
 */
export interface Choice extends MetaFields {
    id: number;
    created_at: string;
    updated_at: string;
    text: string;
    is_correct: boolean;
    order: number;
}

// ============================================================================
// QUIZ ATTEMPT INTERFACES
// ============================================================================

/**
 * QuizAttempt - Represents a user's attempt at taking a quiz
 */
export interface QuizAttempt extends MetaFields {
    id: number;
    created_at: string;
    updated_at: string;
    status: AttemptStatus;
    score: number;
    started_at: string;
    completed_at: string | null;
    attempt_number: number;
    time_spent: string | null; // ISO 8601 duration or "HH:MM:SS"
}

/**
 * UserAnswer - User's answer to a specific question
 */
export interface UserAnswer extends MetaFields {
    id: number;
    created_at: string;
    updated_at: string;
    text_answer: string | null;
    score: number;
    submitted_at: string;
}

// ============================================================================
// HOMEWORK INTERFACES
// ============================================================================

/**
 * Homework - Assignment/homework entity
 * Includes SEO and metadata fields
 */
export interface Homework extends SEOFields, MetaFields {
    id: number;
    created_at: string;
    updated_at: string;
    homework_type: HomeworkType;
    title: string;
    description: string;
    difficulty: DifficultyLevel;
    is_public: boolean;
    mandatory: boolean;
    creator_object_id: number | null;
    due_date: string; // YYYY-MM-DD
    start_date: string | null; // YYYY-MM-DD
    max_submissions: number;
    allow_late_submission: boolean;
    late_penalty_percentage: number;
    total_points: number;
    passing_score: number;
    attachment: string | null; // File URL
    instructions_file: string | null; // File URL
}

/**
 * HomeworkComputed - Computed properties for homework (frontend only)
 */
export interface HomeworkComputed {
    is_overdue: boolean;
    is_available: boolean;
}

/**
 * HomeworkWithComputed - Homework with computed properties
 */
export interface HomeworkWithComputed extends Homework, HomeworkComputed {}

// ============================================================================
// LEGACY/DEPRECATED TYPES (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use AttemptStatus instead
 */
export const QuizResultStatus = {
    PENDING: 'PENDING',
    PASSED: 'PASSED',
    FAILED: 'FAILED',
    IN_PROGRESS: 'IN_PROGRESS'
} as const;

export type QuizResultStatus = typeof QuizResultStatus[keyof typeof QuizResultStatus];

/**
 * @deprecated Use QuizAttempt instead
 */
export interface QuizResult {
    status: QuizResultStatus;
    score: number;
    started_at: string;
    completed_at?: string;
    attempt_number: number;
    time_spent: number;
}

/**
 * @deprecated Use UserAnswer instead
 */
export interface QuestionAnswer {
    selected_choices: number[];
    text_answer?: string;
}