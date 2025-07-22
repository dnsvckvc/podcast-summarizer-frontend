interface TaskInfo {
  task_id: string;
  status:
    | "pending"
    | "downloading"
    | "transcribing"
    | "summarizing"
    | "completed"
    | "failed";
  progress: number;
  message: string;
  created_at: number;
  updated_at: number;
  result?: {
    title: string;
    summary: string;
    thumbnail?: string;
    channel?: string;
    duration_string?: string;
    release_date?: string;
  };
  error?: string;
}

interface UseTaskStatusReturn {
  taskInfo: TaskInfo | null;
  isLoading: boolean;
  error: string | null;
  startPolling: (taskId: string) => void;
  stopPolling: () => void;
}

interface Summary {
  title: string;
  content: string;
  thumbnail?: string;
  channel?: string;
  duration_string?: string;
  release_date?: string;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
  data?: {
    platform: string;
    video_id?: string;
    feed_title?: string;
    episode_count?: number;
    sample_episodes?: Array<{
      title: string;
      published: string;
    }>;
  };
}

interface UseUrlValidationReturn {
  validateUrl: (url: string, platform: string) => Promise<ValidationResult>;
  isValidating: boolean;
  lastValidation: ValidationResult | null;
}

interface User {
  username: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export type {
  Summary,
  TaskInfo,
  AuthState,
  ValidationResult,
  UseTaskStatusReturn,
  UseUrlValidationReturn,
};
