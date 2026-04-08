import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StudySession {
  id: string;
  date: string; // ISO string
  durationMinutes: number;
  topic: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string;
}

export interface QuizResult {
  id: string;
  date: string;
  topic: string;
  score: number;
  total: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_lesson', title: 'First Steps', description: 'Complete your first lesson.', icon: 'Star' },
  { id: 'perfect_quiz', title: 'Flawless Victory', description: 'Get a 100% on a quiz.', icon: 'Trophy' },
  { id: 'five_lessons', title: 'Dedicated Scholar', description: 'Complete 5 lessons.', icon: 'BookOpen' },
  { id: 'texas_pride', title: 'Lone Star Learner', description: 'Start a TEKS-aligned module.', icon: 'Map' },
];

interface AppState {
  user: { name: string } | null;
  hasSeenOnboarding: boolean;
  learningProfile: { grade: string; subject: string } | null;
  sessions: StudySession[];
  tasks: Task[];
  quizResults: QuizResult[];
  achievements: Achievement[];
  settings: {
    darkMode: boolean;
    goalType: 'daily' | 'weekly';
    goalMinutes: number;
  };
  login: (name: string) => void;
  logout: () => void;
  completeOnboarding: () => void;
  updateLearningProfile: (profile: { grade: string; subject: string }) => void;
  addSession: (session: StudySession) => void;
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addQuizResult: (result: Omit<QuizResult, 'id' | 'date'>) => void;
  unlockAchievement: (id: string) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      hasSeenOnboarding: false,
      learningProfile: null,
      sessions: [],
      tasks: [],
      quizResults: [],
      achievements: DEFAULT_ACHIEVEMENTS,
      settings: {
        darkMode: true,
        goalType: 'daily',
        goalMinutes: 2, // Default 2 lessons
      },
      login: (name) => set({ user: { name } }),
      logout: () => set({ user: null, hasSeenOnboarding: false, learningProfile: null }),
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
      updateLearningProfile: (profile) => set({ learningProfile: profile }),
      addSession: (session) =>
        set((state) => {
          const newSessions = [...state.sessions, session];
          let newAchievements = state.achievements;
          
          if (newSessions.length === 5) {
            newAchievements = newAchievements.map((a) =>
              a.id === 'five_lessons' && !a.unlockedAt ? { ...a, unlockedAt: new Date().toISOString() } : a
            );
          }
          
          return { sessions: newSessions, achievements: newAchievements };
        }),
      addTask: (text) =>
        set((state) => ({
          tasks: [...state.tasks, { id: Date.now().toString(), text, completed: false }],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id 
              ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined } 
              : t
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      addQuizResult: (result) =>
        set((state) => {
          const newResult = { ...result, id: Date.now().toString(), date: new Date().toISOString() };
          return { quizResults: [...state.quizResults, newResult] };
        }),
      unlockAchievement: (id) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id && !a.unlockedAt ? { ...a, unlockedAt: new Date().toISOString() } : a
          ),
        })),
      updateSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),
    }),
    {
      name: 'study-app-storage',
    }
  )
);
