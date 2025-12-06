import React, { useState, useEffect } from "react";
import {
  Users,
  Mail,
  Target,
  Activity,
  Calendar,
  UtensilsCrossed,
  MessageSquare,
  Edit,
  X,
  ChevronLeft,
} from "lucide-react";
import { coachAPI, getAuthToken } from "../../services/api";
import DashboardHeader from "../../Components/common/DashboardHeader";

const CoachDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clientLoading, setClientLoading] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      const token = getAuthToken();
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      try {
        const stats = await coachAPI.getDashboardStats(token);
        const clientsRes = await coachAPI.getClients(token);

        if (stats.success && clientsRes.success) {
          setDashboardData({
            ...stats.data,
            clients: clientsRes.data,
          });
        } else {
          setError("Failed to load coach dashboard");
        }
      } catch (err) {
        setError("An error occurred while loading dashboard");
        console.error("Coach dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleClientClick = async (clientData) => {
    try {
      setClientLoading(true);
      setError("");

      const token = getAuthToken();
      const client = clientData.client || clientData;
      const clientId = client._id;

      const response = await coachAPI.getClientDetails(token, clientId);

      if (response.success && response.data) {
        setSelectedClient(response.data);
      } else {
        setError(response.message || "Failed to load client details");
      }
    } catch (err) {
      console.error("Error loading client details:", err);
      setError("An error occurred while loading client details");
    } finally {
      setClientLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedClient(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16">
        <DashboardHeader />
        <div className="p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16">
        <DashboardHeader />
        <div className="p-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Error</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16">
        <DashboardHeader />
        <div className="p-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Not Authenticated</h1>
            <p className="text-muted-foreground">
              Please sign in to access the coach dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedClient) {
    return (
      <ClientDetailView
        client={selectedClient}
        onBack={handleBackToList}
        onClientUpdated={setSelectedClient}
      />
    );
  }

  const clients = dashboardData.clients || [];
  const coach = dashboardData.coach || {};

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <DashboardHeader />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 px-3 py-2 bg-red-900/30 text-red-300 rounded text-sm border border-red-800">
              {error}
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Coach Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {coach.firstName} {coach.lastName}
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Clients ({clients.length})
              </h2>
            </div>

            {clientLoading && (
              <div className="px-6 py-2 text-sm text-muted-foreground">
                Loading client details...
              </div>
            )}

            {clients.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No clients assigned yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Fitness Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Goals
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Active Plans
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Workouts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {clients.map((clientData) => {
                      const client = clientData.client || clientData;
                      const activePlans =
                        clientData.activePlansCount ??
                        (clientData.nutritionPlans || []).filter(
                          (p) => p.isActive
                        ).length;

                      const totalWorkouts =
                        clientData.workoutCounts?.total ??
                        (clientData.workouts || []).length;

                      const completedWorkouts =
                        clientData.workoutCounts?.completed ??
                        (clientData.workouts || []).filter(
                          (w) => w.isCompleted
                        ).length;

                      return (
                        <tr
                          key={client._id}
                          onClick={() => handleClientClick(clientData)}
                          className="hover:bg-muted cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-foreground">
                                  {client.firstName} {client.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {client.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-900/30 text-blue-300 capitalize">
                              {client.profile?.fitnessLevel || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {(client.profile?.goals || [])
                                .slice(0, 2)
                                .map((goal) => (
                                  <span
                                    key={goal}
                                    className="px-2 py-1 text-xs rounded-full bg-purple-900/30 text-primary capitalize"
                                  >
                                    {goal.replace("-", " ")}
                                  </span>
                                ))}
                              {(client.profile?.goals || []).length > 2 && (
                                <span className="px-2 py-1 text-xs text-muted-foreground">
                                  +
                                  {(client.profile?.goals || []).length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <UtensilsCrossed className="w-4 h-4" />
                              {activePlans} active
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Activity className="w-4 h-4" />
                              {completedWorkouts}/{totalWorkouts}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                client.isActive
                                  ? "bg-green-900/30 text-accent"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {client.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientDetailView = ({ client, onBack, onClientUpdated }) => {
  // client is the full clientData object from getClientDetails
  const clientData = client;

  const clientUser = clientData.client || clientData;
  const clientId = clientUser._id;

  const workouts = clientData.workouts || [];
  const completedWorkouts = workouts.filter((w) => w.isCompleted);
  const upcomingWorkouts = workouts.filter((w) => !w.isCompleted);
  const meals = clientData.meals || [];

  const activePlan =
    (clientData.nutritionPlans || []).find((p) => p.isActive) ||
    clientData.nutritionPlan ||
    null;

  const getWorkoutTitle = (workout) => {
    if (workout.name && workout.name.toLowerCase() !== "custom workout") {
      return workout.name;
    }
    if (workout.focusArea) {
      return workout.focusArea;
    }
    return "Workout";
  };

  const getWorkoutSubtitle = (workout) => {
    // Prefer duration if available
    if (workout.duration) {
      return `${workout.duration} min`;
    }

    // Otherwise, use first exercise's sets x reps
    if (workout.exercises && workout.exercises.length > 0) {
      const first = workout.exercises[0];
      const sets = first.sets || 0;
      const reps = first.reps || "";
      return `${sets} x ${reps} ${first.name}`;
    }

    // Fallback to workout type
    return workout.workoutType || "";
  };

  // ----- Actions & modal state -----
  const profile = clientUser.profile || {};

  const [editPlanOpen, setEditPlanOpen] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [editPlanLoading, setEditPlanLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const [editDaysPerWeek, setEditDaysPerWeek] = useState(
    profile.workoutDaysPerWeek || 3
  );
  const [editTimePerWorkout, setEditTimePerWorkout] = useState(
    profile.timePerWorkout || 60
  );
  const [editWorkoutSplit, setEditWorkoutSplit] = useState(
    profile.workoutSplit || "fb"
  );

  const [commentTarget, setCommentTarget] = useState("workout"); // "workout" | "meal"
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(
    workouts[0]?._id || ""
  );
  const [selectedExerciseId, setSelectedExerciseId] = useState(
    workouts[0]?.exercises?.[0]?._id || ""
  );
  const [selectedMealId, setSelectedMealId] = useState(meals[0]?._id || "");
  const [commentText, setCommentText] = useState("");

  const handleOpenEditPlan = () => {
    const p = clientUser.profile || {};
    setEditDaysPerWeek(p.workoutDaysPerWeek || 3);
    setEditTimePerWorkout(p.timePerWorkout || 60);
    setEditWorkoutSplit(p.workoutSplit || "fb");
    setActionError("");
    setActionSuccess("");
    setEditPlanOpen(true);
  };

  const handleOpenCommentModal = () => {
    const workoutsList = workouts || [];
    const mealsList = meals || [];

    if (workoutsList.length === 0 && mealsList.length === 0) {
      setActionError(
        "There are no workouts or meals for this client yet to comment on."
      );
      return;
    }

    if (workoutsList.length > 0) {
      setCommentTarget("workout");
      setSelectedWorkoutId(workoutsList[0]._id);
      const firstExercise =
        workoutsList[0].exercises && workoutsList[0].exercises[0];
      setSelectedExerciseId(firstExercise ? firstExercise._id : "");
    } else {
      setCommentTarget("meal");
    }

    if (mealsList.length > 0) {
      setSelectedMealId(mealsList[0]._id);
    } else {
      setSelectedMealId("");
    }

    setCommentText("");
    setActionError("");
    setActionSuccess("");
    setCommentModalOpen(true);
  };

  const handleWorkoutChange = (e) => {
    const newWorkoutId = e.target.value;
    setSelectedWorkoutId(newWorkoutId);

    const w = workouts.find((wk) => wk._id === newWorkoutId);
    const firstExercise = w && w.exercises && w.exercises[0];
    setSelectedExerciseId(firstExercise ? firstExercise._id : "");
  };

  const refreshClientDetails = async () => {
    try {
      const token = getAuthToken();
      if (!token || !clientId || !onClientUpdated) return;

      const res = await coachAPI.getClientDetails(token, clientId);
      if (res.success && res.data) {
        onClientUpdated(res.data);
      }
    } catch (err) {
      console.error("Failed to refresh client details:", err);
    }
  };

  const handleSavePlan = async () => {
    try {
      setEditPlanLoading(true);
      setActionError("");
      setActionSuccess("");

      const token = getAuthToken();
      if (!token) {
        setActionError("Not authenticated. Please log in again.");
        return;
      }

      const currentProfile = clientUser.profile || {};

      // IMPORTANT: include all profile fields so we don't overwrite them with undefined
      const profileData = {
        age: currentProfile.age,
        weight: currentProfile.weight,
        height: currentProfile.height,
        gender: currentProfile.gender,
        fitnessLevel: currentProfile.fitnessLevel,
        goals: currentProfile.goals || [],
        workoutDaysPerWeek: Number(editDaysPerWeek),
        workoutSplit: editWorkoutSplit,
        timePerWorkout: Number(editTimePerWorkout),
        dietaryRestrictions: currentProfile.dietaryRestrictions || [],
        allergies: currentProfile.allergies || [],
      };

      const res = await coachAPI.updateClientProfile(
        token,
        clientId,
        profileData
      );

      if (!res.success) {
        setActionError(res.message || "Failed to update workout plan.");
        return;
      }

      setActionSuccess("Workout plan updated successfully.");
      await refreshClientDetails();
      setEditPlanOpen(false);
    } catch (err) {
      console.error("Error updating client workout plan:", err);
      setActionError(err.message || "Failed to update workout plan.");
    } finally {
      setEditPlanLoading(false);
    }
  };

  const handleRegeneratePlan = async () => {
    try {
      setRegenerating(true);
      setActionError("");
      setActionSuccess("");

      const token = getAuthToken();
      if (!token) {
        setActionError("Not authenticated. Please log in again.");
        return;
      }

      const currentProfile = clientUser.profile || {};

      const res = await coachAPI.regenerateClientPlan(token, clientId, {
        goals: currentProfile.goals || [],
        workoutSplit: currentProfile.workoutSplit,
        fitnessLevel: currentProfile.fitnessLevel,
        timePerWorkout: currentProfile.timePerWorkout,
      });

      if (!res.success) {
        setActionError(res.message || "Failed to regenerate client plan.");
        return;
      }

      setActionSuccess("Client plan regenerated successfully.");
      await refreshClientDetails();
    } catch (err) {
      console.error("Error regenerating client plan:", err);
      setActionError(err.message || "Failed to regenerate client plan.");
    } finally {
      setRegenerating(false);
    }
  };

  const handleSubmitComment = async () => {
    try {
      setCommentLoading(true);
      setActionError("");
      setActionSuccess("");

      const token = getAuthToken();
      if (!token) {
        setActionError("Not authenticated. Please log in again.");
        return;
      }

      const trimmed = commentText.trim();
      if (!trimmed) {
        setActionError("Please enter a comment before submitting.");
        return;
      }

      let res;
      if (commentTarget === "workout") {
        if (!selectedWorkoutId || !selectedExerciseId) {
          setActionError(
            "Please select a workout and exercise to attach your comment to."
          );
          return;
        }

        res = await coachAPI.addExerciseComment(
          token,
          clientId,
          selectedWorkoutId,
          selectedExerciseId,
          trimmed
        );
      } else {
        if (!selectedMealId) {
          setActionError("Please select a meal to attach your comment to.");
          return;
        }

        res = await coachAPI.addMealComment(
          token,
          clientId,
          selectedMealId,
          trimmed
        );
      }

      if (!res.success) {
        setActionError(res.message || "Failed to add comment.");
        return;
      }

      setActionSuccess("Comment added successfully.");
      setCommentModalOpen(false);
      setCommentText("");

      await refreshClientDetails();
    } catch (err) {
      console.error("Error adding coach comment:", err);
      setActionError(err.message || "Failed to add comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <DashboardHeader />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Clients
          </button>

          {actionError && (
            <div className="mb-4 px-3 py-2 bg-red-900/30 text-red-300 rounded text-sm border border-red-800">
              {actionError}
            </div>
          )}

          {actionSuccess && (
            <div className="mb-4 px-3 py-2 bg-emerald-900/30 text-emerald-300 rounded text-sm border border-emerald-800">
              {actionSuccess}
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {clientUser.firstName} {clientUser.lastName}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {clientUser.email}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Profile Card */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Profile
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age</span>
                  <span className="text-foreground">
                    {clientUser.profile?.age || "N/A"} years
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="text-foreground">
                    {clientUser.profile?.weight || "N/A"} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Height</span>
                  <span className="text-foreground">
                    {clientUser.profile?.height || "N/A"} cm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender</span>
                  <span className="text-foreground capitalize">
                    {clientUser.profile?.gender || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fitness Level</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-900/30 text-blue-300 capitalize">
                    {clientUser.profile?.fitnessLevel || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Goals & Preferences */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Goals & Preferences
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Goals</p>
                  <div className="flex flex-wrap gap-2">
                    {(clientUser.profile?.goals || []).map((goal) => (
                      <span
                        key={goal}
                        className="px-2 py-1 text-xs rounded-full bg-purple-900/30 text-primary capitalize"
                      >
                        {goal.replace("-", " ")}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Equipment
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(clientUser.profile?.availableEquipment || []).map(
                      (eq) => (
                        <span
                          key={eq}
                          className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground capitalize"
                        >
                          {eq.replace("-", " ")}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Workout Time: </span>
                  <span className="text-foreground capitalize">
                    {clientUser.preferences?.workoutTime || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition Plan */}
          {activePlan && (
            <div className="bg-card rounded-lg p-6 border border-border mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5" />
                  Active Nutrition Plan
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Daily Calories</p>
                  <p className="text-lg font-semibold">
                    {activePlan.dailyCalorieTarget}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="text-lg font-semibold">
                    {activePlan.macroTargets.protein}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Carbs</p>
                  <p className="text-lg font-semibold">
                    {activePlan.macroTargets.carbs}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fat</p>
                  <p className="text-lg font-semibold">
                    {activePlan.macroTargets.fat}g
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Meals ({(clientData.meals || []).length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {(clientData.meals || []).map((meal) => (
                    <span
                      key={meal._id}
                      className="px-3 py-1 text-sm rounded-lg bg-muted text-muted-foreground capitalize"
                    >
                      {meal.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Workouts */}
          <div className="bg-card rounded-lg p-6 border border-border mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Workouts
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total Workouts</p>
                <p className="text-2xl font-bold">{workouts.length}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-400">
                  {completedWorkouts.length}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold text-primary">
                  {upcomingWorkouts.length}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {workouts.slice(0, 5).map((workout) => (
                <div
                  key={workout._id}
                  className="flex items-center justify-between p-3 bg-muted/80 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{getWorkoutTitle(workout)}</p>
                    <p className="text-sm text-muted-foreground">
                      {getWorkoutSubtitle(workout)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        workout.isCompleted
                          ? "bg-green-900/30 text-accent"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {workout.isCompleted ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleOpenEditPlan}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={editPlanLoading || regenerating || commentLoading}
              >
                <Edit className="w-4 h-4" />
                {editPlanLoading ? "Saving..." : "Edit Workout Plan"}
              </button>

              <button
                type="button"
                onClick={handleOpenCommentModal}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={regenerating || editPlanLoading || commentLoading}
              >
                <MessageSquare className="w-4 h-4" />
                Add Comment
              </button>

              <button
                type="button"
                onClick={handleRegeneratePlan}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={regenerating || editPlanLoading || commentLoading}
              >
                <Activity className="w-4 h-4" />
                {regenerating ? "Regenerating..." : "Regenerate Plan"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Workout Plan Modal */}
      {editPlanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Workout Plan</h3>
              <button
                type="button"
                onClick={() => setEditPlanOpen(false)}
                className="p-1 rounded-full hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Adjust this client&apos;s high-level workout preferences. Saving
              will update their profile and keep future plans aligned.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Workout days per week
                </label>
                <input
                  type="number"
                  min={1}
                  max={7}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={editDaysPerWeek}
                  onChange={(e) =>
                    setEditDaysPerWeek(Number(e.target.value) || 1)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Time per workout (minutes)
                </label>
                <input
                  type="number"
                  min={15}
                  max={180}
                  step={5}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={editTimePerWorkout}
                  onChange={(e) =>
                    setEditTimePerWorkout(Number(e.target.value) || 30)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Workout split
                </label>
                <select
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={editWorkoutSplit}
                  onChange={(e) => setEditWorkoutSplit(e.target.value)}
                >
                  <option value="fb">Full body</option>
                  <option value="ppl">Push / Pull / Legs</option>
                  <option value="ul">Upper / Lower</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditPlanOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted"
                disabled={editPlanLoading || regenerating || commentLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePlan}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                disabled={editPlanLoading || regenerating || commentLoading}
              >
                {editPlanLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Comment Modal */}
      {commentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Coach Comment</h3>
              <button
                type="button"
                onClick={() => setCommentModalOpen(false)}
                className="p-1 rounded-full hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              Attach a note to either a specific workout exercise or a meal for
              this client.
            </p>

            <div className="mb-4 flex gap-3 text-sm">
              <button
                type="button"
                onClick={() => setCommentTarget("workout")}
                className={`px-3 py-1 rounded-full border text-xs ${
                  commentTarget === "workout"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                Workout
              </button>
              <button
                type="button"
                onClick={() => setCommentTarget("meal")}
                className={`px-3 py-1 rounded-full border text-xs ${
                  commentTarget === "meal"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                Meal
              </button>
            </div>

            {commentTarget === "workout" ? (
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Workout
                  </label>
                  <select
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={selectedWorkoutId}
                    onChange={handleWorkoutChange}
                  >
                    {workouts.map((w) => (
                      <option key={w._id} value={w._id}>
                        {getWorkoutTitle(w)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Exercise
                  </label>
                  <select
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={selectedExerciseId}
                    onChange={(e) => setSelectedExerciseId(e.target.value)}
                  >
                    {(workouts.find((w) => w._id === selectedWorkoutId)
                      ?.exercises || []
                    ).map((ex) => (
                      <option key={ex._id} value={ex._id}>
                        {ex.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Meal
                </label>
                <select
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={selectedMealId}
                  onChange={(e) => setSelectedMealId(e.target.value)}
                >
                  {meals.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Comment
              </label>
              <textarea
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm min-h-[120px] resize-y"
                placeholder="Write a brief coaching note..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCommentModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted"
                disabled={commentLoading || regenerating || editPlanLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitComment}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                disabled={
                  commentLoading ||
                  regenerating ||
                  editPlanLoading ||
                  !commentText.trim()
                }
              >
                {commentLoading ? "Saving..." : "Add Comment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachDashboard;
