const API_BASE_URL = 'http://localhost:3001/api/v1';

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'coach' | 'admin';
  isActive: boolean;
  profile?: UserProfile;
  preferences?: UserPreferences;
  coachProfile?: CoachProfile;
}

export interface CoachProfile {
  specialization: string[];
  experience: number;
  bio: string;
  clients: string[];
}

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  availableEquipment: string[];
  timePerWorkout: number;
  workoutDaysPerWeek: number;
  workoutSplit: 'ppl' | 'fb' | 'ul' | 'custom';
  dietaryRestrictions: string[];
  allergies: string[];
}

export interface UserPreferences {
  workoutTime: 'morning' | 'afternoon' | 'evening';
  preferredExercises: string[];
  dislikedExercises: string[];
  notifications: {
    email: boolean;
    push: boolean;
    workoutReminders: boolean;
  };
}

export interface Workout {
  _id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  scheduledDate: string;
  completedAt?: string;
  isCompleted: boolean;
  workoutType: 'push' | 'pull' | 'legs' | 'upper' | 'lower' | 'full-body' | 'custom';
  currentExerciseIndex: number;
}

export interface Exercise {
  name: string;
  description: string;
  sets: number;
  reps: string;
  weight?: number;
  duration?: number;
  restTime: number;
  muscleGroups: string[];
  equipment: string[];
  instructions: string[];
  tips: string[];
  type: 'warmup' | 'exercise' | 'cooldown';
  exerciseType: 'compound' | 'accessory' | 'isolation' | 'warmup' | 'cooldown' | 'core';
  isCompleted?: boolean;
  completedAt?: string;
}

export interface Meal {
  _id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  servings: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  dietaryTags: string[];
}

export interface NutritionPlan {
  _id: string;
  dailyCalorieTarget: number;
  macroTargets: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: Meal[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Progress {
  _id: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  measurements: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  notes: string;
  photos?: string[];
}

export interface DashboardData {
  todaysWorkout?: Workout;
  activeNutritionPlan?: NutritionPlan;
  activeWorkoutPlan?: any;
  recentProgress: Progress[];
  stats: {
    workoutStreak: number;
    totalWorkouts: number;
    weeklyGoal: number;
  };
}

// Auth API functions
export const authAPI = {
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<ApiResponse<{ user: User; tokens: { accessToken: string; refreshToken: string } }>> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; tokens: { accessToken: string; refreshToken: string } }>> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  loginWithRole: async (credentials: {
    email: string;
    password: string;
    role: string;
  }): Promise<ApiResponse<{ user: User; tokens: { accessToken: string; refreshToken: string } }>> => {
    const response = await fetch(`${API_BASE_URL}/auth/login-with-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  getProfile: async (token: string): Promise<ApiResponse<{ user: User }>> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  updateProfile: async (token: string, profileData: any): Promise<ApiResponse<{ user: User }>> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    return response.json();
  },

  changePassword: async (token: string, passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });
    return response.json();
  },

  logout: async (token: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

// User API functions
export const userAPI = {
  completeOnboarding: async (token: string, onboardingData: {
    profile: UserProfile;
    preferences: UserPreferences;
  }): Promise<ApiResponse<{
    user: User;
    nutritionPlan: NutritionPlan;
    workoutPlan: any;
  }>> => {
    const response = await fetch(`${API_BASE_URL}/user/onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(onboardingData),
    });
    return response.json();
  },

  getDashboard: async (token: string): Promise<ApiResponse<DashboardData>> => {
    const response = await fetch(`${API_BASE_URL}/user/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getComprehensivePlan: async (token: string, regenerate = false): Promise<ApiResponse<any>> => {
    const url = regenerate 
      ? `${API_BASE_URL}/user/comprehensive-plan?regenerate=true`
      : `${API_BASE_URL}/user/comprehensive-plan`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getWorkoutHistory: async (token: string, params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<Workout[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/user/workouts/history?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  completeWorkout: async (token: string, workoutId: string): Promise<ApiResponse<{
    completedWorkout: Workout;
    tomorrowWorkoutPreview?: Workout;
  }>> => {
    const response = await fetch(`${API_BASE_URL}/user/workouts/${workoutId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  generateNewWorkoutPlan: async (token: string): Promise<ApiResponse<{ workoutPlan: any }>> => {
    const response = await fetch(`${API_BASE_URL}/user/workouts/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getNutritionPlan: async (token: string): Promise<ApiResponse<NutritionPlan>> => {
    const response = await fetch(`${API_BASE_URL}/user/nutrition/plan`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  addProgress: async (token: string, progressData: {
    weight?: number;
    bodyFat?: number;
    muscleMass?: number;
    measurements?: {
      chest?: number;
      waist?: number;
      hips?: number;
      arms?: number;
      thighs?: number;
    };
    notes?: string;
    photos?: string[];
  }): Promise<ApiResponse<Progress>> => {
    const response = await fetch(`${API_BASE_URL}/user/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(progressData),
    });
    return response.json();
  },

  getProgressHistory: async (token: string, params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<Progress[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/user/progress/history?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getWorkoutLibrary: async (token: string, params?: {
    category?: string;
    difficulty?: string;
    search?: string;
  }): Promise<ApiResponse<{
    workouts: any[];
    total: number;
    categories: string[];
    difficulties: string[];
  }>> => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params?.search) queryParams.append('search', params.search);

    const response = await fetch(`${API_BASE_URL}/user/workouts/library?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Exercise replacement
  replaceExercise: async (token: string, data: {
    workoutId: string;
    exerciseIndex: number;
    reason: string;
  }): Promise<ApiResponse<{
    workout: Workout;
    replacedExercise: any;
  }>> => {
    const response = await fetch(`${API_BASE_URL}/user/workouts/replace-exercise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Meal replacement
  replaceMeal: async (token: string, data: {
    mealId: string;
    reason: string;
  }): Promise<ApiResponse<{
    meal: Meal;
    replacedMeal: any;
  }>> => {
    const response = await fetch(`${API_BASE_URL}/user/meals/replace-meal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Regenerate daily workout
  getWorkoutById: async (token: string, workoutId: string): Promise<ApiResponse<Workout>> => {
    const response = await fetch(`${API_BASE_URL}/workouts/${workoutId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Regenerate daily workout
  regenerateDailyWorkout: async (token: string): Promise<ApiResponse<{
    workout: Workout;
  }>> => {
    const response = await fetch(`${API_BASE_URL}/user/workouts/regenerate-daily`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Regenerate daily nutrition
  regenerateDailyNutrition: async (token: string): Promise<ApiResponse<{
    nutritionPlan: NutritionPlan;
    meals: Meal[];
  }>> => {
    const response = await fetch(`${API_BASE_URL}/user/nutrition/regenerate-daily`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Update user profile
  updateProfile: async (token: string, profile: Partial<UserProfile>): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    return response.json();
  },

  // Calendar and schedule
  getWeeklySchedule: async (token: string, startDate?: string): Promise<ApiResponse<{
    schedule: Array<{
      date: string;
      workoutType: string;
      workoutId?: string;
      isCompleted: boolean;
    }>;
    splitType: string;
    startDate: string;
  }>> => {
    const url = startDate 
      ? `${API_BASE_URL}/user/schedule/weekly?startDate=${startDate}`
      : `${API_BASE_URL}/user/schedule/weekly`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  getTodaysWorkout: async (token: string): Promise<ApiResponse<Workout>> => {
    const response = await fetch(`${API_BASE_URL}/user/schedule/today`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  // Exercise progression
  completeCurrentExercise: async (token: string, workoutId: string): Promise<ApiResponse<{
    currentExercise: Exercise;
    progress: {
      completed: number;
      total: number;
      percentage: number;
    };
    isWorkoutCompleted: boolean;
  }>> => {
    const response = await fetch(`${API_BASE_URL}/user/workouts/${workoutId}/complete-exercise`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  getCurrentExercise: async (token: string, workoutId: string): Promise<ApiResponse<{
    currentExercise: Exercise;
    progress: {
      completed: number;
      total: number;
      percentage: number;
    };
    isWorkoutCompleted: boolean;
  }>> => {
    const response = await fetch(`${API_BASE_URL}/user/workouts/${workoutId}/current-exercise`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  getWorkoutProgress: async (token: string, workoutId: string): Promise<ApiResponse<{
    completed: number;
    total: number;
    percentage: number;
  }>> => {
    const response = await fetch(`${API_BASE_URL}/user/workouts/${workoutId}/progress`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
};

// Admin API functions
export const adminAPI = {
  getDashboardStats: async (token: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getStats: async (token: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getAllUsers: async (token: string, params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<User[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getUserById: async (token: string, userId: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  updateUserStatus: async (token: string, userId: string, isActive: boolean): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive }),
    });
    return response.json();
  },

  updateUserRole: async (token: string, userId: string, role: 'user' | 'admin'): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });
    return response.json();
  },

  deleteUser: async (token: string, userId: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getWorkoutAnalytics: async (token: string, params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/admin/analytics/workouts?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getSystemHealth: async (token: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/admin/health`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  createCoach: async (token: string, coachData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    specialization: string[];
    experience: number;
    bio: string;
  }): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/admin/coaches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(coachData),
    });
    return response.json();
  },

  createAdmin: async (token: string, adminData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/admin/admins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(adminData),
    });
    return response.json();
  },

  assignCoachToClient: async (token: string, data: {
    clientId: string;
    coachId: string;
  }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/admin/coaches/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  removeCoachFromClient: async (token: string, data: {
    clientId: string;
    coachId: string;
  }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/admin/coaches/unassign`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Utility functions
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

