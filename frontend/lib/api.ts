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
  display_name: string;
  college_tier: "tier_1" | "iit";
  branch: string;
  year_of_study: number;
  jee_advanced_qualified: boolean;
  verification_status: "pending" | "approved" | "rejected";
  bio?: string;
  expertise_subjects?: string;
  hourly_rate: number;
  is_available: boolean;
  total_sessions: number;
  rating: number;
  total_reviews: number;
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

  getGoogleAuthUrl: (): string => {
    return `${API_BASE_URL}/api/v1/auth/google`;
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
  createProfile: async (data: {
    display_name: string;
    college_name: string;
    college_tier: string;
    branch: string;
    year_of_study: number;
    jee_advanced_qualified?: boolean;
    jee_roll_number?: string;
    jee_rank?: number;
    bio?: string;
    expertise_subjects?: string;
  }): Promise<MentorProfile> => {
    return apiRequest<MentorProfile>("/api/v1/users/mentor/profile", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getProfile: async (): Promise<MentorProfile> => {
    return apiRequest<MentorProfile>("/api/v1/users/mentor/profile");
  },

  updateProfile: async (
    data: Partial<MentorProfile>
  ): Promise<MentorProfile> => {
    return apiRequest<MentorProfile>("/api/v1/users/mentor/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  listMentors: async (
    skip = 0,
    limit = 20,
    availableOnly = true
  ): Promise<MentorProfile[]> => {
    return apiRequest<MentorProfile[]>(
      `/api/v1/users/mentors?skip=${skip}&limit=${limit}&available_only=${availableOnly}`
    );
  },

  getMentor: async (mentorId: number): Promise<MentorProfile> => {
    return apiRequest<MentorProfile>(`/api/v1/users/mentors/${mentorId}`);
  },
};

// ============== Chat API (for AI) ==============

export const chatApi = {
  sendMessage: async (message: string): Promise<{ response: string }> => {
    // This will be connected to Naman's LLM engine later
    return apiRequest<{ response: string }>("/api/v1/chat/message", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },
};

export default {
  auth: authApi,
  user: userApi,
  student: studentApi,
  mentor: mentorApi,
  chat: chatApi,
};
