import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Calendar from "@/components/Calendar";
import WorkoutProgress from "@/components/WorkoutProgress";
import { useAuth } from "@/contexts/AuthContext";
import { userAPI, DashboardData, Workout, Meal } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Target, 
  Zap, 
  Trophy, 
  Activity,
  Apple,
  Droplets,
  ChefHat,
  Play,
  CheckCircle2,
  Loader2,
  RefreshCw,
  X,
  RotateCcw
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [comprehensivePlan, setComprehensivePlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const { user, token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      
      try {
        const response = await userAPI.getDashboard(token);
        if (response.success && response.data) {
          setDashboardData(response.data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchComprehensivePlanData = async () => {
      if (!token) return;
      
      try {
        const response = await userAPI.getComprehensivePlan(token);
        if (response.success && response.data) {
          setComprehensivePlan(response.data);
        }
      } catch (error) {
        console.error('Failed to load comprehensive plan:', error);
        // Don't show error toast for this as it's not critical
      }
    };

    fetchDashboardData();
    fetchComprehensivePlanData();
  }, [token, toast]);

  const fetchComprehensivePlan = async (regenerate = false) => {
    if (!token) return;
    
    setIsLoadingPlan(true);
    try {
      const response = await userAPI.getComprehensivePlan(token, regenerate);
      if (response.success && response.data) {
        setComprehensivePlan(response.data);
        if (regenerate) {
          toast({
            title: "Plan Overview Updated!",
            description: "Your comprehensive fitness plan has been regenerated with detailed breakdowns.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load comprehensive plan",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const handleCompleteWorkout = async (workoutId: string) => {
    if (!token) return;
    
    try {
      const response = await userAPI.completeWorkout(token, workoutId);
      if (response.success) {
        toast({
          title: "Workout Completed! 🎉",
          description: "Great job on finishing your workout! Check out tomorrow's preview below.",
        });
        
        // Show tomorrow's workout preview if available
        if (response.data.tomorrowWorkoutPreview) {
          toast({
            title: "Tomorrow's Workout Preview",
            description: `${response.data.tomorrowWorkoutPreview.name} - ${response.data.tomorrowWorkoutPreview.exercises.length} exercises`,
            duration: 5000,
          });
        }
        
        // Refresh dashboard data
        const dashboardResponse = await userAPI.getDashboard(token);
        if (dashboardResponse.success && dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
        }
      } else {
        // Handle specific error messages from backend
        toast({
          title: "Cannot Start Workout",
          description: response.message || "This workout is not available yet",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete workout",
        variant: "destructive",
      });
    }
  };

  const handleReplaceExercise = async (workoutId: string, exerciseIndex: number, reason: string) => {
    if (!token) return;
    
    try {
      const response = await userAPI.replaceExercise(token, {
        workoutId,
        exerciseIndex,
        reason
      });
      if (response.success) {
        toast({
          title: "Exercise Replaced!",
          description: "AI has generated a new exercise for you.",
        });
        // Refresh dashboard data
        const dashboardResponse = await userAPI.getDashboard(token);
        if (dashboardResponse.success && dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to replace exercise",
        variant: "destructive",
      });
    }
  };

  const handleReplaceMeal = async (mealId: string, reason: string) => {
    if (!token) return;
    
    try {
      const response = await userAPI.replaceMeal(token, {
        mealId,
        reason
      });
      if (response.success) {
        toast({
          title: "Meal Replaced!",
          description: "AI has generated a new meal for you.",
        });
        // Refresh dashboard data
        const dashboardResponse = await userAPI.getDashboard(token);
        if (dashboardResponse.success && dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to replace meal",
        variant: "destructive",
      });
    }
  };

  const handleRegenerateDailyWorkout = async () => {
    if (!token) return;
    
    try {
      const response = await userAPI.regenerateDailyWorkout(token);
      if (response.success) {
        toast({
          title: "New Workout Created!",
          description: "A fresh workout has been created for tomorrow.",
        });
        // Refresh dashboard data
        const dashboardResponse = await userAPI.getDashboard(token);
        if (dashboardResponse.success && dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate workout",
        variant: "destructive",
      });
    }
  };

  const handleRegenerateDailyNutrition = async () => {
    if (!token) return;
    
    try {
      const response = await userAPI.regenerateDailyNutrition(token);
      if (response.success) {
        toast({
          title: "Nutrition Plan Regenerated!",
          description: "Your daily nutrition plan has been refreshed with new meals.",
        });
        // Refresh dashboard data
        const dashboardResponse = await userAPI.getDashboard(token);
        if (dashboardResponse.success && dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate nutrition plan",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No data available</h2>
            <p className="text-muted-foreground">Complete your onboarding to see your personalized dashboard.</p>
            <Button className="mt-4" onClick={() => window.location.href = '/onboarding'}>
              Complete Onboarding
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { todaysWorkout, activeNutritionPlan, stats } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <Navigation />

      <div className="container px-4 py-8 mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.firstName}! 💪
              </h1>
              <p className="text-muted-foreground">
                Ready to crush today's workout? You're on a {stats.workoutStreak}-day streak!
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRegenerateDailyWorkout}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Start New Workout
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRegenerateDailyNutrition}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                New Meals
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.workoutStreak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
              <div className="text-xs text-muted-foreground">Workouts Done</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <Activity className="h-6 w-6 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.weeklyGoal}</div>
              <div className="text-xs text-muted-foreground">Weekly Goal</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {Math.round((stats.totalWorkouts / stats.weeklyGoal) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Goal Progress</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Today's Plan</TabsTrigger>
            <TabsTrigger value="workout">Workout</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="plan-overview">Plan Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Today's Workout Card */}
            {todaysWorkout && (
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-accent" />
                    Today's Workout
                  </CardTitle>
                  <CardDescription>
                    {todaysWorkout.name} • {todaysWorkout.duration} min • {todaysWorkout.difficulty}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Exercises</span>
                      <Badge variant="secondary">{todaysWorkout.exercises.length} exercises</Badge>
                    </div>
                    <div className="space-y-2">
                      {todaysWorkout.exercises.slice(0, 3).map((exercise, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{exercise.name}</span>
                          <span className="text-muted-foreground">
                            {exercise.sets} sets × {exercise.reps} reps
                          </span>
                        </div>
                      ))}
                      {todaysWorkout.exercises.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          +{todaysWorkout.exercises.length - 3} more exercises
                        </div>
                      )}
                    </div>
                    <Button 
                      className="w-full bg-gradient-hero text-white hover:opacity-90"
                      onClick={() => handleCompleteWorkout(todaysWorkout._id)}
                      disabled={todaysWorkout.isCompleted}
                    >
                      {todaysWorkout.isCompleted ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Workout Completed
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Workout
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nutrition Overview */}
            {activeNutritionPlan && (
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Apple className="h-5 w-5 text-accent" />
                    Today's Nutrition
                  </CardTitle>
                  <CardDescription>
                    Daily target: {activeNutritionPlan.dailyCalorieTarget} calories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-accent">
                          {activeNutritionPlan.macroTargets.protein}g
                        </div>
                        <div className="text-xs text-muted-foreground">Protein</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">
                          {activeNutritionPlan.macroTargets.carbs}g
                        </div>
                        <div className="text-xs text-muted-foreground">Carbs</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">
                          {activeNutritionPlan.macroTargets.fat}g
                        </div>
                        <div className="text-xs text-muted-foreground">Fat</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {activeNutritionPlan.meals.length} meals planned for today
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="workout" className="space-y-6">
            {todaysWorkout ? (
              <WorkoutProgress 
                workout={todaysWorkout} 
                onWorkoutComplete={() => {
                  // Refresh dashboard data when workout is completed
                  const refreshDashboard = async () => {
                    if (!token) return;
                    try {
                      const dashboardResponse = await userAPI.getDashboard(token);
                      if (dashboardResponse.success && dashboardResponse.data) {
                        setDashboardData(dashboardResponse.data);
                      }
                    } catch (error) {
                      console.error('Failed to refresh dashboard:', error);
                    }
                  };
                  refreshDashboard();
                }}
              />
            ) : (
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardContent className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No workout scheduled</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have a workout scheduled for today.
                  </p>
                  <Button onClick={() => window.location.href = '/workouts'}>
                    Browse Workouts
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            {activeNutritionPlan ? (
              <div className="space-y-6">
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle>Daily Nutrition Target</CardTitle>
                    <CardDescription>
                      {activeNutritionPlan.dailyCalorieTarget} calories per day
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-accent">
                          {activeNutritionPlan.macroTargets.protein}g
                        </div>
                        <div className="text-sm text-muted-foreground">Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-accent">
                          {activeNutritionPlan.macroTargets.carbs}g
                        </div>
                        <div className="text-sm text-muted-foreground">Carbohydrates</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-accent">
                          {activeNutritionPlan.macroTargets.fat}g
                        </div>
                        <div className="text-sm text-muted-foreground">Fat</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4">
                  <h3 className="text-lg font-semibold">Today's Meals</h3>
                  {activeNutritionPlan.meals.map((meal, index) => (
                    <Card key={index} className="bg-gradient-card border-0 shadow-card">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{meal.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{meal.mealType}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReplaceMeal(meal._id, "User preference")}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{meal.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Calories:</span> {meal.calories}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Protein:</span> {meal.protein}g
                          </div>
                          <div>
                            <span className="text-muted-foreground">Carbs:</span> {meal.carbs}g
                          </div>
                          <div>
                            <span className="text-muted-foreground">Fat:</span> {meal.fat}g
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-sm text-muted-foreground">Prep time:</span> {meal.prepTime} min
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardContent className="text-center py-8">
                  <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No nutrition plan</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete your onboarding to get a personalized nutrition plan.
                  </p>
                  <Button onClick={() => window.location.href = '/onboarding'}>
                    Complete Onboarding
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Calendar />
          </TabsContent>

          <TabsContent value="plan-overview" className="space-y-6">
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  Your Comprehensive Fitness Plan
                </CardTitle>
                <CardDescription>
                  AI-generated explanation of your personalized workout and nutrition strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!comprehensivePlan ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading your comprehensive plan overview...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {comprehensivePlan.planExplanation}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => fetchComprehensivePlan(false)}
                        disabled={isLoadingPlan}
                      >
                        {isLoadingPlan ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Refreshing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh Overview
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => fetchComprehensivePlan(true)}
                        disabled={isLoadingPlan}
                      >
                        {isLoadingPlan ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Target className="h-4 w-4 mr-2" />
                            Generate Detailed Overview
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
