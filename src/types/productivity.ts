// Task Types
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: number;
  title: string;
  content: string | null;
  completed: boolean;
  priority: TaskPriority;
  priority_display?: string;
  collection: number | null;
  due_date: string | null; // ISO 8601 format: "2025-12-10T14:00:00Z"
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
  object_id?: number;
  repeat_type?: string;
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