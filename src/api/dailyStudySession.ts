/**
 * Daily Study Session API Client
 * 
 * Simple API for tracking daily study time.
 * One session per student per day - tracks aggregate time across all lectures.
 * 
 * @author Development Team
 * @created December 2025
 */

import api from './client';

export interface DailyStudySessionData {
  id: number;
  student: number;
  date: string;
  study_time: number;
  study_time_formatted: string;
  pause_time: number;
  pause_time_formatted: string;
  total_time: number;
  efficiency_percentage: number;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
}

export interface StudyTimeUpdate {
  study_time_delta?: number;
  pause_time_delta?: number;
}

/**
 * Daily Study Session API
 */
export const dailyStudySessionAPI = {
  /**
   * Update today's study session
   * @param data - Time deltas to add
   * @returns Updated session data
   */
  track: (data: StudyTimeUpdate) =>
    api.post<DailyStudySessionData>('/enrollments/daily-session/track/', data),

  /**
   * Get today's study session
   * @returns Today's session or empty data
   */
  getToday: () =>
    api.get<DailyStudySessionData>('/enrollments/daily-session/today/'),

  /**
   * Get all daily study sessions
   * @returns Array of sessions
   */
  list: () =>
    api.get<DailyStudySessionData[]>('/enrollments/daily-session/'),

  /**
   * Get specific session by ID
   * @param id - Session ID
   * @returns Session data
   */
  get: (id: number) =>
    api.get<DailyStudySessionData>(`/enrollments/daily-session/${id}/`),
};

/**
 * Weekly Study Time API
 */
export const weeklyStudyTimeAPI = {
  /**
   * Get current week's study time
   * @returns Weekly data with daily breakdown
   */
  getCurrentWeek: () =>
    api.get('/enrollments/weekly-time/current/'),

  /**
   * Get recent weeks (last 4 weeks)
   * @returns Array of weekly records
   */
  getRecentWeeks: () =>
    api.get('/enrollments/weekly-time/recent/'),

  /**
   * Get all weekly records
   * @returns Array of weekly records
   */
  list: () =>
    api.get('/enrollments/weekly-time/'),
};
