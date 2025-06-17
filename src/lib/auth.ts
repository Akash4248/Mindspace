import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  meditationStats: {
    totalSessions: number;
    totalMinutes: number;
    streakDays: number;
    currentLevel: number;
    favoriteEnvironment: string;
  };
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: boolean;
    reminderTime?: string;
  };
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateMeditationStats: (stats: Partial<User["meditationStats"]>) => void;
}

// Mock authentication functions - in production, these would connect to your backend
const mockAuthService = {
  async login(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock user data
    return {
      id: "1",
      email,
      name: email.split("@")[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      meditationStats: {
        totalSessions: 23,
        totalMinutes: 487,
        streakDays: 7,
        currentLevel: 3,
        favoriteEnvironment: "forest",
      },
      preferences: {
        theme: "light",
        notifications: true,
        reminderTime: "09:00",
      },
      createdAt: new Date("2024-01-15"),
    };
  },

  async signup(email: string, password: string, name: string): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      meditationStats: {
        totalSessions: 0,
        totalMinutes: 0,
        streakDays: 0,
        currentLevel: 1,
        favoriteEnvironment: "forest",
      },
      preferences: {
        theme: "light",
        notifications: true,
      },
      createdAt: new Date(),
    };
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const user = await mockAuthService.login(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const user = await mockAuthService.signup(email, password, name);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },

      updateMeditationStats: (stats: Partial<User["meditationStats"]>) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              meditationStats: { ...user.meditationStats, ...stats },
            },
          });
        }
      },
    }),
    {
      name: "mindspace-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
