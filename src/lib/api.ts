// Mock API service for MindSpace AR
// In production, these would be real API calls to your backend

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: "success" | "error";
}

export interface UserSession {
  id: string;
  userId: string;
  environmentId: string;
  duration: number;
  completedAt: Date;
  moodBefore: number;
  moodAfter: number;
  biometricData?: {
    avgHeartRate: number;
    stressLevel: number;
    breathingRate: number;
  };
  notes?: string;
}

export interface UserProgress {
  totalSessions: number;
  totalMinutes: number;
  streakDays: number;
  weeklyGoal: number;
  weeklyProgress: number;
  favoriteEnvironments: string[];
  moodTrend: Array<{
    date: string;
    mood: number;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    unlockedAt: Date;
  }>;
}

export interface AnalyticsData {
  sessionsThisWeek: number;
  minutesThisWeek: number;
  averageMood: number;
  moodImprovement: number;
  streakRecord: number;
  dailyActivity: Array<{
    date: string;
    sessions: number;
    minutes: number;
    mood: number;
  }>;
  environmentUsage: Array<{
    environmentId: string;
    name: string;
    sessions: number;
    averageRating: number;
  }>;
}

class ApiService {
  private baseUrl =
    process.env.REACT_APP_API_URL || "http://localhost:3001/api";
  private token: string | null = null;

  setAuthToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      // Return mock data for development
      return this.getMockResponse<T>(endpoint, options.method || "GET");
    }
  }

  private getMockResponse<T>(endpoint: string, method: string): ApiResponse<T> {
    // Mock responses for development
    const mockResponses: Record<string, any> = {
      "GET:/user/progress": {
        data: {
          totalSessions: 23,
          totalMinutes: 487,
          streakDays: 7,
          weeklyGoal: 5,
          weeklyProgress: 4,
          favoriteEnvironments: ["forest-sanctuary", "ocean-depths"],
          moodTrend: [
            { date: "2024-01-15", mood: 6 },
            { date: "2024-01-16", mood: 7 },
            { date: "2024-01-17", mood: 8 },
            { date: "2024-01-18", mood: 7 },
            { date: "2024-01-19", mood: 8 },
            { date: "2024-01-20", mood: 9 },
            { date: "2024-01-21", mood: 8 },
          ],
          achievements: [
            {
              id: "first-session",
              title: "First Steps",
              description: "Complete your first meditation session",
              unlockedAt: new Date("2024-01-15"),
            },
            {
              id: "7-day-streak",
              title: "7-Day Streak",
              description: "Meditate for 7 consecutive days",
              unlockedAt: new Date("2024-01-21"),
            },
          ],
        },
        message: "Progress retrieved successfully",
        status: "success",
      },
      "GET:/analytics": {
        data: {
          sessionsThisWeek: 5,
          minutesThisWeek: 95,
          averageMood: 7.5,
          moodImprovement: 15,
          streakRecord: 12,
          dailyActivity: [
            { date: "2024-01-15", sessions: 1, minutes: 15, mood: 7 },
            { date: "2024-01-16", sessions: 1, minutes: 20, mood: 8 },
            { date: "2024-01-17", sessions: 0, minutes: 0, mood: 0 },
            { date: "2024-01-18", sessions: 2, minutes: 30, mood: 8 },
            { date: "2024-01-19", sessions: 1, minutes: 15, mood: 7 },
            { date: "2024-01-20", sessions: 1, minutes: 10, mood: 8 },
            { date: "2024-01-21", sessions: 1, minutes: 25, mood: 9 },
          ],
          environmentUsage: [
            {
              environmentId: "forest-sanctuary",
              name: "Forest Sanctuary",
              sessions: 8,
              averageRating: 4.6,
            },
            {
              environmentId: "ocean-depths",
              name: "Ocean Depths",
              sessions: 6,
              averageRating: 4.8,
            },
            {
              environmentId: "zen-garden",
              name: "Zen Garden",
              sessions: 4,
              averageRating: 4.4,
            },
          ],
        },
        message: "Analytics retrieved successfully",
        status: "success",
      },
    };

    const key = `${method}:${endpoint}`;
    const mockData = mockResponses[key] || {
      data: {} as T,
      message: "Mock response",
      status: "success",
    };

    return mockData;
  }

  // User Management
  async getUserProgress(): Promise<ApiResponse<UserProgress>> {
    return this.request<UserProgress>("/user/progress");
  }

  async updateUserProfile(data: any): Promise<ApiResponse<any>> {
    return this.request<any>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Session Management
  async startSession(environmentId: string): Promise<ApiResponse<any>> {
    return this.request<any>("/sessions/start", {
      method: "POST",
      body: JSON.stringify({ environmentId }),
    });
  }

  async completeSession(
    sessionData: Partial<UserSession>,
  ): Promise<ApiResponse<UserSession>> {
    return this.request<UserSession>("/sessions/complete", {
      method: "POST",
      body: JSON.stringify(sessionData),
    });
  }

  async getSessionHistory(): Promise<ApiResponse<UserSession[]>> {
    return this.request<UserSession[]>("/sessions/history");
  }

  // Analytics
  async getAnalytics(): Promise<ApiResponse<AnalyticsData>> {
    return this.request<AnalyticsData>("/analytics");
  }

  async logMood(mood: number): Promise<ApiResponse<any>> {
    return this.request<any>("/mood/log", {
      method: "POST",
      body: JSON.stringify({ mood, timestamp: new Date() }),
    });
  }

  // Environment Management
  async getEnvironmentStats(environmentId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/environments/${environmentId}/stats`);
  }

  async rateEnvironment(
    environmentId: string,
    rating: number,
  ): Promise<ApiResponse<any>> {
    return this.request<any>(`/environments/${environmentId}/rate`, {
      method: "POST",
      body: JSON.stringify({ rating }),
    });
  }

  // Biometric Data
  async submitBiometricData(data: any): Promise<ApiResponse<any>> {
    return this.request<any>("/biometric", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Notifications
  async updateNotificationSettings(settings: any): Promise<ApiResponse<any>> {
    return this.request<any>("/notifications/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }

  // Premium Features
  async checkPremiumStatus(): Promise<
    ApiResponse<{ isPremium: boolean; expiresAt?: Date }>
  > {
    return this.request<{ isPremium: boolean; expiresAt?: Date }>(
      "/premium/status",
    );
  }

  async upgradeToPremuim(planId: string): Promise<ApiResponse<any>> {
    return this.request<any>("/premium/upgrade", {
      method: "POST",
      body: JSON.stringify({ planId }),
    });
  }
}

export const apiService = new ApiService();

// Utility functions for data processing
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${remainingMinutes}m`;
};

export const calculateWeeklyProgress = (
  sessionsThisWeek: number,
  weeklyGoal: number,
): number => {
  return Math.min((sessionsThisWeek / weeklyGoal) * 100, 100);
};

export const getMoodColor = (mood: number): string => {
  if (mood <= 3) return "#ef4444"; // red-500
  if (mood <= 5) return "#f97316"; // orange-500
  if (mood <= 7) return "#eab308"; // yellow-500
  if (mood <= 8) return "#84cc16"; // lime-500
  return "#22c55e"; // green-500
};

export const getStreakMessage = (streakDays: number): string => {
  if (streakDays === 0) return "Start your journey today!";
  if (streakDays < 7) return "Building momentum!";
  if (streakDays < 30) return "Great consistency!";
  if (streakDays < 100) return "Incredible dedication!";
  return "Meditation master!";
};
