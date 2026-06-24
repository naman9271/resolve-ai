/**
 * API Client for Resolve AI Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Types
export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: "student" | "mentor" | "admin";
  is_email_verified: boolean;
  is_phone_verified: boolean;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface StudentProfile {
  id: number;
  user_id: number;
  category: "11th" | "12th" | "dropper" | "partial_dropper";
  school_type: "dummy" | "regular";
  target_year: number;
  target_exam: string;
  current_score?: number;
  target_score?: number;
  is_premium: boolean;
  subscription_end?: string;
  streak_days: number;
  total_questions_solved: number;
  whatsapp_verified: boolean;
  created_at: string;
  is_profile_complete: boolean;
}

export interface MentorProfile {
  id: number;
  user_id: number;
  display_name: string;
  profile_photo_url?: string;
  college_name: string;
  college_tier: "tier_1" | "iit";
  branch: string;
  year_of_study: number;
  jee_advanced_qualified: boolean;
  verification_status: "pending" | "approved" | "rejected";
  rejection_reason?: string;
  bio?: string;
  expertise_subjects?: string;
  session_rate_30_min: number;
  session_rate_1_hour: number;
  is_available: boolean;
  available_slots?: string;
  total_sessions: number;
  total_earnings: number;
  pending_earnings: number;
  rating: number;
  total_reviews: number;
  phone_number?: string;
  phone_verified: boolean;
  created_at: string;
}

export interface MentorSession {
  id: number;
  mentor_id: number;
  student_id: number;
  session_type: string;
  scheduled_at: string;
  duration_minutes: number;
  amount: number;
  status: string;
  meeting_link?: string;
  notes?: string;
  student_rating?: number;
  student_feedback?: string;
  payment_status: string;
  created_at: string;
  student_name?: string;
  mentor_name?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role?: "student" | "mentor";
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiError {
  detail: string;
}

// Token management
const TOKEN_KEY = "resolve_ai_access_token";
const REFRESH_TOKEN_KEY = "resolve_ai_refresh_token";

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: "An error occurred",
    }));
    
    // Handle FastAPI validation errors (422)
    if (Array.isArray(errorData.detail)) {
      const messages = errorData.detail.map((err: { loc: string[]; msg: string }) => {
        const field = err.loc[err.loc.length - 1];
        return `${field}: ${err.msg}`;
      });
      throw new Error(messages.join(", "));
    }
    
    throw new Error(errorData.detail || "An error occurred");
  }

  return response.json();
}

// ============== Auth API ==============

export const authApi = {
  register: async (data: RegisterData): Promise<TokenResponse> => {
    const response = await apiRequest<TokenResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setTokens(response.access_token, response.refresh_token);
    return response;
  },

  login: async (data: LoginData): Promise<TokenResponse> => {
    const response = await apiRequest<TokenResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setTokens(response.access_token, response.refresh_token);
    return response;
  },

  logout: async (): Promise<void> => {
    try {
      await apiRequest("/api/v1/auth/logout", { method: "POST" });
    } finally {
      clearTokens();
    }
  },

  getMe: async (): Promise<User> => {
    return apiRequest<User>("/api/v1/auth/me");
  },

  refreshToken: async (): Promise<TokenResponse> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");

    const response = await apiRequest<TokenResponse>("/api/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify(refreshToken),
    });
    setTokens(response.access_token, response.refresh_token);
    return response;
  },

  getGoogleAuthUrl: (role: string = "student"): string => {
    return `${API_BASE_URL}/api/v1/auth/google?role=${role}`;
  },
};

// ============== User API ==============

export const userApi = {
  getProfile: async (): Promise<User> => {
    return apiRequest<User>("/api/v1/users/me");
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    return apiRequest<User>("/api/v1/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

// ============== Student API ==============

export const studentApi = {
  createProfile: async (data: {
    category: string;
    school_type: string;
    target_year: number;
    target_exam?: string;
    target_score?: number;
    whatsapp_number?: string;
  }): Promise<StudentProfile> => {
    return apiRequest<StudentProfile>("/api/v1/users/student/profile", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getProfile: async (): Promise<StudentProfile> => {
    return apiRequest<StudentProfile>("/api/v1/users/student/profile");
  },

  updateProfile: async (
    data: Partial<StudentProfile>
  ): Promise<StudentProfile> => {
    return apiRequest<StudentProfile>("/api/v1/users/student/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

// ============== Mentor API ==============

export const mentorApi = {
  // Profile Management
  createProfile: async (data: {
    display_name: string;
    college_name: string;
    college_tier: string;
    branch: string;
    year_of_study: number;
    jee_advanced_qualified?: boolean;
    jee_roll_number?: string;
    jee_rank?: number;
    date_of_birth?: string;
    phone_number?: string;
    bio?: string;
    expertise_subjects?: string;
    profile_photo_url?: string;
  }): Promise<MentorProfile> => {
    return apiRequest<MentorProfile>("/api/v1/mentors/profile", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getProfile: async (): Promise<MentorProfile> => {
    return apiRequest<MentorProfile>("/api/v1/mentors/profile");
  },

  updateProfile: async (
    data: Partial<MentorProfile>
  ): Promise<MentorProfile> => {
    return apiRequest<MentorProfile>("/api/v1/mentors/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  updateBankingInfo: async (data: {
    bank_account_holder?: string;
    bank_account_number?: string;
    bank_ifsc_code?: string;
    upi_id?: string;
  }): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>("/api/v1/mentors/profile/banking", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Public Mentor Routes (for students)
  listMentors: async (
    skip = 0,
    limit = 20,
    availableOnly = true,
    branch?: string,
    collegeTier?: string
  ): Promise<MentorProfile[]> => {
    let url = `/api/v1/mentors/list?skip=${skip}&limit=${limit}&available_only=${availableOnly}`;
    if (branch) url += `&branch=${encodeURIComponent(branch)}`;
    if (collegeTier) url += `&college_tier=${collegeTier}`;
    return apiRequest<MentorProfile[]>(url);
  },

  getMentor: async (mentorId: number): Promise<MentorProfile> => {
    return apiRequest<MentorProfile>(`/api/v1/mentors/${mentorId}`);
  },

  // Session Management
  getSessions: async (statusFilter?: string): Promise<MentorSession[]> => {
    let url = "/api/v1/mentors/sessions/list";
    if (statusFilter) url += `?status_filter=${statusFilter}`;
    return apiRequest<MentorSession[]>(url);
  },

  getUpcomingSessions: async (): Promise<MentorSession[]> => {
    return apiRequest<MentorSession[]>("/api/v1/mentors/sessions/upcoming");
  },

  completeSession: async (sessionId: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/api/v1/mentors/sessions/${sessionId}/complete`, {
      method: "PATCH",
    });
  },

  cancelSession: async (sessionId: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/api/v1/mentors/sessions/${sessionId}/cancel`, {
      method: "PATCH",
    });
  },

  // Earnings
  getEarnings: async (): Promise<{
    total_earnings: number;
    pending_earnings: number;
    total_sessions: number;
    completed_sessions: number;
    this_month_earnings: number;
    last_payout_date?: string;
    next_payout_estimate: number;
  }> => {
    return apiRequest("/api/v1/mentors/earnings");
  },

  // Book a session (for students)
  bookSession: async (data: {
    mentor_id: number;
    session_type: string;
    scheduled_at: string;
    notes?: string;
  }): Promise<MentorSession> => {
    return apiRequest<MentorSession>("/api/v1/mentors/sessions/book", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// ============== Chat API (for AI) ==============

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  stream?: boolean;
}

export interface PYQQuestion {
  id: string;
  year: number;
  exam_type: string;
  subject: string;
  chapter: string;
  topic: string;
  question: string;
  options: string[];
  difficulty: string;
  hint?: string;
}

export interface PYQQuestionWithSolution extends PYQQuestion {
  correct_answer: number;
  solution: string;
}

export interface PYQRequest {
  subject?: string;
  chapter?: string;
  topic?: string;
  difficulty?: string;
  exam_type?: string;
  year?: number;
  limit?: number;
}

export const chatApi = {
  /**
   * Send a message to the AI and get a streaming response
   * Returns an async generator that yields response chunks
   */
  sendMessageStream: async function* (
    message: string,
    history?: ChatMessage[]
  ): AsyncGenerator<string, void, unknown> {
    const url = `${API_BASE_URL}/api/v1/ai/message`;
    const token = getAccessToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message,
        history,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "AI Error" }));
      throw new Error(error.detail || "Failed to get AI response");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const lines = text.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.chunk) {
              yield data.chunk;
            }
            if (data.done) {
              return;
            }
            if (data.error) {
              throw new Error(data.error);
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }
    }
  },

  /**
   * Send a message to the AI and get a complete response (non-streaming)
   */
  sendMessage: async (
    message: string,
    history?: ChatMessage[]
  ): Promise<{ response: string }> => {
    return apiRequest<{ response: string }>("/api/v1/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, history, stream: false }),
    });
  },
};

// ============== PYQ API ==============

export const pyqApi = {
  getSubjects: async (): Promise<{ subjects: string[] }> => {
    return apiRequest<{ subjects: string[] }>("/api/v1/ai/pyq/subjects");
  },

  getChapters: async (subject?: string): Promise<{ chapters: string[] }> => {
    const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
    return apiRequest<{ chapters: string[] }>(`/api/v1/ai/pyq/chapters${query}`);
  },

  getTopics: async (
    subject?: string,
    chapter?: string
  ): Promise<{ topics: string[] }> => {
    const params = new URLSearchParams();
    if (subject) params.append("subject", subject);
    if (chapter) params.append("chapter", chapter);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<{ topics: string[] }>(`/api/v1/ai/pyq/topics${query}`);
  },

  getQuestions: async (
    filters: PYQRequest
  ): Promise<{ questions: PYQQuestion[]; total: number }> => {
    return apiRequest<{ questions: PYQQuestion[]; total: number }>(
      "/api/v1/ai/pyq/questions",
      {
        method: "POST",
        body: JSON.stringify(filters),
      }
    );
  },

  getQuestionById: async (
    questionId: string,
    showSolution = false
  ): Promise<PYQQuestion | PYQQuestionWithSolution> => {
    return apiRequest(`/api/v1/ai/pyq/question/${questionId}?show_solution=${showSolution}`);
  },

  checkAnswer: async (
    questionId: string,
    userAnswer: number
  ): Promise<{
    correct: boolean;
    correct_answer: number;
    solution: string;
    hint: string;
  }> => {
    return apiRequest(
      `/api/v1/ai/pyq/check-answer?question_id=${questionId}&user_answer=${userAnswer}`,
      { method: "POST" }
    );
  },

  /**
   * Get AI explanation for a PYQ (streaming)
   */
  explainQuestionStream: async function* (
    questionId: string
  ): AsyncGenerator<string, void, unknown> {
    const url = `${API_BASE_URL}/api/v1/ai/pyq/explain/${questionId}?stream=true`;
    const token = getAccessToken();

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to get explanation");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const lines = text.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.chunk) {
              yield data.chunk;
            }
            if (data.done) {
              return;
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  },
};

// ============== Activity API (GitHub-style tracking) ==============

export interface DailyActivity {
  date: string;
  questions_solved: number;
  pyq_solved: number;
  study_minutes: number;
  chat_queries: number;
  activity_level: number;
}

export interface ActivityHeatmapData {
  activities: DailyActivity[];
  total_questions: number;
  current_streak: number;
  longest_streak: number;
  total_active_days: number;
}

export interface StreakMilestone {
  days: number;
  name: string;
  emoji: string;
  celebration_type: string;
  message: string;
}

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  current_milestone: StreakMilestone | null;
  next_milestone: StreakMilestone | null;
  days_to_next_milestone: number;
  is_new_milestone: boolean;
  encouragement: string;
}

export const activityApi = {
  logActivity: async (data: {
    questions_solved?: number;
    pyq_solved?: number;
    study_minutes?: number;
    chat_queries?: number;
  }): Promise<DailyActivity> => {
    return apiRequest<DailyActivity>("/api/v1/activity/log", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getHeatmap: async (days?: number): Promise<ActivityHeatmapData> => {
    const query = days ? `?days=${days}` : "";
    return apiRequest<ActivityHeatmapData>(`/api/v1/activity/heatmap${query}`);
  },

  getStreak: async (): Promise<StreakData> => {
    return apiRequest<StreakData>("/api/v1/activity/streak");
  },
};

export default {
  auth: authApi,
  user: userApi,
  student: studentApi,
  mentor: mentorApi,
  chat: chatApi,
  activity: activityApi,
  pyq: pyqApi,
};
