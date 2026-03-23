// Task Types

export type TaskPriorityType = "low" | "medium" | "high" | "urgent";
export type TaskRecurringType = "daily" | "weekly" | "monthly" | "none";
export type TaskStatusType = "pending" | "completed" | "in_progress";
export interface TaskType {
  id: number;
  name: string;
  description: string;
  priority: TaskPriorityType;
  recurring: TaskRecurringType;
  due_date: string | null;   // ISO date string (YYYY-MM-DD)
  due_time: string | null;   // HH:MM:SS or null
  category: number | null;   // لأنك راجع ID أو null
  status: TaskStatusType;
  created_at:string;
  updated_at:string;
}

// Task Collection Types
export interface TaskCollection {
  id: number;
  name: string;
  description: string | null;
  user: number;
  tasks: Task[];
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
}

// For creating a new task (write operations)
export interface CreateTaskPayload {
  title: string;
  content?: string;
  completed?: boolean;
  priority?: TaskPriority;
  collection?: number | null;
  due_date?: string | null;
  app_label?: string;
  model_name?: string;
  object_id?: number;
}

// For creating a new collection (write operations)
export interface CreateTaskCollectionPayload {
  name: string;
  description?: string;
}

// API Response types
export interface TaskListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}

export interface TaskCollectionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TaskCollection[];
}