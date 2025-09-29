import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { userAPI, DashboardData } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  Target, 
  Zap, 
  Trophy, 
  Activity,
  Apple,
  Droplets,
  ChefHat,
  Play,
  CheckCircle2
} from "lucide-react";

// Mock data - in real app this would come from API
const mockUser = {
  name: "Alex Johnson",
  currentWeek: 2,
  streak: 7,
  weeklyGoal: 4,
  completedWorkouts: 2,
  calorieTarget: 2200,
  caloriesConsumed: 1850,
  waterGoal: 8,
  waterConsumed: 6,
};

const todayWorkout = {
  name: "Upper Body Strength",
  duration: "45 min",
  difficulty: "Intermediate",
  exercises: [
    { name: "Push-ups", sets: 3, reps: "12-15", completed: false },
    { name: "Dumbbell Rows", sets: 3, reps: "10-12", completed: false },
    { name: "Overhead Press", sets: 3, reps: "8-10", completed: false },
    { name: "Lat Pulldowns", sets: 3, reps: "10-12", completed: false },
    { name: "Bicep Curls", sets: 2, reps: "12-15", completed: false },
    { name: "Tricep Dips", sets: 2, reps: "10-12", completed: false },
  ]
};

const weeklyPlan = [
  { day: "Mon", workout: "Upper Body", completed: true, type: "strength" },
  { day: "Tue", workout: "Cardio HIIT", completed: true, type: "cardio" },
  { day: "Wed", workout: "Rest Day", completed: false, type: "rest" },
  { day: "Thu", workout: "Lower Body", completed: false, type: "strength" },
  { day: "Fri", workout: "Core & Flexibility", completed: false, type: "flexibility" },
  { day: "Sat", workout: "Full Body", completed: false, type: "strength" },
  { day: "Sun", workout: "Active Recovery", completed: false, type: "recovery" },
];

const mealSuggestions = [
  {
    meal: "Breakfast",
    name: "Protein Oatmeal Bowl",
    calories: 420,
    macros: { protein: 25, carbs: 45, fat: 12 },
    completed: true,
  },
  {
    meal: "Lunch",
    name: "Grilled Chicken Salad",
    calories: 520,
    macros: { protein: 35, carbs: 20, fat: 15 },
    completed: true,
  },
  {
    meal: "Snack",
    name: "Greek Yogurt & Berries",
    calories: 180,
    macros: { protein: 15, carbs: 20, fat: 8 },
    completed: false,
  },
  {
    meal: "Dinner",
    name: "Salmon with Quinoa",
    calories: 650,
    macros: { protein: 40, carbs: 35, fat: 22 },
    completed: false,
  },
];

const Dashboard = () => {
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container px-4 py-8 mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {mockUser.name}! 💪
          </h1>
          <p className="text-muted-foreground">
            Ready to crush today's workout? You're on a {mockUser.streak}-day streak!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">{mockUser.streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {mockUser.completedWorkouts}/{mockUser.weeklyGoal}
              </div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <Activity className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">Week {mockUser.currentWeek}</div>
              <div className="text-xs text-muted-foreground">Current</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {Math.round((mockUser.completedWorkouts / mockUser.weeklyGoal) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Progress</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="workout" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workout">Today's Workout</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="week">Week Plan</TabsTrigger>
          </TabsList>

          {/* Today's Workout Tab */}
          <TabsContent value="workout" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Workout Overview */}
              <div className="lg:col-span-2">
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-accent" />
                          {todayWorkout.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {todayWorkout.duration}
                          </span>
                          <Badge variant="secondary">{todayWorkout.difficulty}</Badge>
                        </CardDescription>
                      </div>
                      <Button className="bg-gradient-hero text-white hover:opacity-90">
                        <Play className="h-4 w-4 mr-2" />
                        Start Workout
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {todayWorkout.exercises.map((exercise, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border transition-smooth cursor-pointer ${
                          selectedExercise === index
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/50"
                        }`}
                        onClick={() => setSelectedExercise(index)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{exercise.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {exercise.sets} sets × {exercise.reps} reps
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {exercise.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Workout Tips */}
              <div className="space-y-6">
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Today's Focus</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-accent/10 rounded-lg">
                      <h4 className="font-medium text-accent mb-2">Mind-Muscle Connection</h4>
                      <p className="text-sm text-muted-foreground">
                        Focus on feeling each muscle work during today's upper body session. 
                        Quality over quantity!
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Quick Tips:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Warm up for 5-10 minutes</li>
                        <li>• Rest 60-90 seconds between sets</li>
                        <li>• Keep your core engaged</li>
                        <li>• Focus on controlled movements</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Progress Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Weekly Goal</span>
                          <span>{mockUser.completedWorkouts}/{mockUser.weeklyGoal}</span>
                        </div>
                        <Progress value={(mockUser.completedWorkouts / mockUser.weeklyGoal) * 100} />
                      </div>
                      <Button variant="outline" className="w-full">
                        View Full Progress
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChefHat className="h-5 w-5 text-accent" />
                      Today's Meal Plan
                    </CardTitle>
                    <CardDescription>
                      Personalized nutrition to support your fitness goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mealSuggestions.map((meal, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          meal.completed
                            ? "border-success/30 bg-success/5"
                            : "border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {meal.meal}
                              </Badge>
                              {meal.completed && (
                                <CheckCircle2 className="h-4 w-4 text-success" />
                              )}
                            </div>
                            <h4 className="font-medium mt-1">{meal.name}</h4>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{meal.calories} cal</div>
                          </div>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>P: {meal.macros.protein}g</span>
                          <span>C: {meal.macros.carbs}g</span>
                          <span>F: {meal.macros.fat}g</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Apple className="h-5 w-5 text-accent" />
                      Daily Targets
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Calories</span>
                        <span>{mockUser.caloriesConsumed}/{mockUser.calorieTarget}</span>
                      </div>
                      <Progress value={(mockUser.caloriesConsumed / mockUser.calorieTarget) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="flex items-center gap-1">
                          <Droplets className="h-4 w-4" />
                          Water (glasses)
                        </span>
                        <span>{mockUser.waterConsumed}/{mockUser.waterGoal}</span>
                      </div>
                      <Progress value={(mockUser.waterConsumed / mockUser.waterGoal) * 100} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Nutrition Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h4 className="font-medium text-primary mb-2">Pre-Workout Fuel</h4>
                      <p className="text-sm text-muted-foreground">
                        Have a light snack 30-60 minutes before your workout for optimal energy.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Week Plan Tab */}
          <TabsContent value="week" className="space-y-6">
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  This Week's Plan
                </CardTitle>
                <CardDescription>
                  Your AI-generated personalized workout schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {weeklyPlan.map((day, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border text-center transition-smooth ${
                        day.completed
                          ? "border-success bg-success/5"
                          : day.type === "rest"
                          ? "border-muted bg-muted/30"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <div className="font-medium text-sm mb-2">{day.day}</div>
                      <div className="text-xs text-muted-foreground mb-2">{day.workout}</div>
                      {day.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-success mx-auto" />
                      ) : day.type === "rest" ? (
                        <div className="h-5 w-5 mx-auto bg-muted rounded-full flex items-center justify-center">
                          <div className="h-2 w-2 bg-muted-foreground rounded-full" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 mx-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;