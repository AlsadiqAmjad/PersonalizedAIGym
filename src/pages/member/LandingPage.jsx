import React, { useState, useEffect } from "react";
import MemberHeader from "../../Components/common/MemberHeader";
import Streak from "./Streak";
import Menu from "./Menu";
import { Activity, CheckCircle, Flame, Calendar } from "lucide-react";
import { userAPI, getAuthToken } from "../../services/api";

const LandingPage = () => {
  const username = localStorage.getItem("username") || "Guest";
  const [streak, setStreak] = useState(0);
  const [lastCompleted, setLastCompleted] = useState(null);
  const [todaysWorkout, setTodaysWorkout] = useState(null);
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const token = getAuthToken();
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      try {
        // Load dashboard data to get streak, workout, and nutrition
        const dashboardResponse = await userAPI.getDashboard(token);
        if (dashboardResponse.success && dashboardResponse.data) {
          const data = dashboardResponse.data;
          const stats = data.stats || {};
          setStreak(stats.workoutStreak || 0);
          
          // Set today's workout from dashboard
          if (data.todaysWorkout) {
            setTodaysWorkout(data.todaysWorkout);
          }
          
          // Set nutrition plan from dashboard
          if (data.activeNutritionPlan) {
            setNutritionPlan(data.activeNutritionPlan);
          }
        }

        // Also try to load today's workout separately as fallback
        if (!todaysWorkout) {
          const workoutResponse = await userAPI.getTodaysWorkout(token);
          if (workoutResponse.success && workoutResponse.data) {
            // Handle both nested and direct data structure
            setTodaysWorkout(workoutResponse.data.workout || workoutResponse.data);
          }
        }
        
        // Also try to load nutrition plan separately if not in dashboard
        if (!nutritionPlan) {
          try {
            const nutritionResponse = await userAPI.getNutritionPlan(token);
            if (nutritionResponse.success && nutritionResponse.data) {
              setNutritionPlan(nutritionResponse.data);
            }
          } catch (err) {
            console.log('Nutrition plan load error:', err);
          }
        }

        // Load saved streak from localStorage as fallback
        const savedStreak = parseInt(localStorage.getItem("streak")) || 0;
        if (savedStreak > streak) {
          setStreak(savedStreak);
        }
        const savedLastCompleted = localStorage.getItem("lastCompleted");
        setLastCompleted(savedLastCompleted ? new Date(savedLastCompleted) : null);
      } catch (err) {
        setError("An error occurred while loading data");
        console.error("Landing page load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleComplete = async () => {
    const token = getAuthToken();
    if (!token) {
      setError("Not authenticated");
      return;
    }

    const now = new Date();
    if (
      !lastCompleted ||
      now - new Date(lastCompleted) >= 24 * 60 * 60 * 1000
    ) {
      if (!todaysWorkout || !todaysWorkout._id) {
        alert("No workout to complete");
        return;
      }

      try {
        const response = await userAPI.completeWorkout(token, todaysWorkout._id);
        if (response.success) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          setLastCompleted(now);
          localStorage.setItem("streak", newStreak);
          localStorage.setItem("lastCompleted", now.toISOString());
          
          // Update workout state
          if (response.data?.completedWorkout) {
            setTodaysWorkout(response.data.completedWorkout);
          }
        } else {
          alert(response.message || "Failed to complete workout");
        }
      } catch (err) {
        alert("An error occurred while completing workout");
        console.error("Complete workout error:", err);
      }
    } else {
      const hoursLeft = Math.ceil(
        (24 * 60 * 60 * 1000 - (now - new Date(lastCompleted))) /
          (1000 * 60 * 60)
      );
      alert(`You can complete the workout again in ${hoursLeft} hour(s)`);
    }
  };

  // Format workout exercises for display
  const formatWorkoutPlan = () => {
    if (!todaysWorkout || !todaysWorkout.exercises) {
      return [
        { phase: "No workout scheduled", exercise: "Check your schedule or contact your coach" },
      ];
    }

    return todaysWorkout.exercises.map((exercise, index) => {
      let phase = exercise.name;
      let details = "";
      
      if (exercise.type === "warmup") {
        details = `${exercise.duration / 60} min`;
      } else if (exercise.type === "cooldown") {
        details = `${exercise.duration / 60} min stretch`;
      } else {
        details = `${exercise.sets} sets x ${exercise.reps} reps`;
        if (exercise.weight > 0) {
          details += ` @ ${exercise.weight}kg`;
        }
      }
      
      return {
        phase: phase,
        exercise: details,
        type: exercise.type,
      };
    });
  };

  const workoutPlan = formatWorkoutPlan();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16">
        <MemberHeader />
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <MemberHeader />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 px-3 py-2 bg-red-900/30 text-red-300 rounded text-sm border border-red-800">
              {error}
            </div>
          )}
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Activity className="w-8 h-8" />
              Welcome back, {username}!
            </h1>
            <p className="text-gray-400 text-lg">
              Ready to crush today's workout? You are on{" "}
              <span className="inline-flex items-center gap-1 text-yellow-400 font-bold">
                <Flame className="w-5 h-5" />
                <Streak streak={streak} />
              </span>
              !
            </p>
          </div>

          {/* Stats Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Flame className="w-6 h-6 text-yellow-400" />
                  Your Streak
                </h2>
                <p className="text-3xl font-bold text-yellow-400">{streak} days</p>
              </div>
              <button
                onClick={handleComplete}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Complete Workout
              </button>
            </div>
          </div>

          {/* Menu Section */}
          <div className="mb-6">
            <Menu />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Workout Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Today's Workout
                </h2>
              </div>

              {todaysWorkout ? (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">
                    {todaysWorkout.name} • {todaysWorkout.duration} min
                  </p>
                  {todaysWorkout.description && (
                    <p className="text-sm text-gray-300 mb-4">{todaysWorkout.description}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 mb-4">No workout scheduled for today. Complete onboarding to get your personalized plan!</p>
              )}
              <div className="space-y-3">
                {workoutPlan.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                      item.type === "warmup"
                        ? "bg-green-900/20 border-green-700/50"
                        : item.type === "cooldown"
                        ? "bg-purple-900/20 border-purple-700/50"
                        : "bg-gray-700/50 border-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      item.type === "warmup"
                        ? "bg-green-600"
                        : item.type === "cooldown"
                        ? "bg-purple-600"
                        : "bg-blue-600"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-blue-400">
                        {item.phase}:
                      </span>{" "}
                      <span className="text-gray-300">{item.exercise}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Plan Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Activity className="w-6 h-6" />
                  Today's Nutrition
                </h2>
              </div>

              {nutritionPlan ? (
                <>
                  <div className="mb-4">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Calories</p>
                        <p className="text-lg font-bold text-yellow-400">{nutritionPlan.dailyCalorieTarget}</p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Protein</p>
                        <p className="text-lg font-bold text-blue-400">{nutritionPlan.macroTargets?.protein || 0}g</p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Carbs</p>
                        <p className="text-lg font-bold text-green-400">{nutritionPlan.macroTargets?.carbs || 0}g</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">Fat</p>
                      <p className="text-lg font-bold text-purple-400">{nutritionPlan.macroTargets?.fat || 0}g</p>
                    </div>
                  </div>
                  
                  {nutritionPlan.meals && nutritionPlan.meals.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Meals ({nutritionPlan.meals.length})</h3>
                      {nutritionPlan.meals.map((meal, index) => (
                        <div
                          key={meal._id || index}
                          className="bg-gray-700/50 rounded-lg p-3 border border-gray-600"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-blue-400 capitalize">{meal.name}</p>
                              <p className="text-xs text-gray-400 capitalize">{meal.mealType}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-yellow-400">{meal.calories} cal</p>
                              <p className="text-xs text-gray-400">{meal.protein}g P • {meal.carbs}g C • {meal.fat}g F</p>
                            </div>
                          </div>
                          {meal.description && (
                            <p className="text-xs text-gray-300 mt-2">{meal.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No meals planned yet</p>
                  )}
                </>
              ) : (
                <p className="text-gray-400">No nutrition plan available. Complete onboarding to get your personalized meal plan!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
