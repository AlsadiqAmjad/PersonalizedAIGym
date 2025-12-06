import React, { useState, useEffect } from "react";
import MemberHeader from "../../Components/common/MemberHeader";
import {
  User,
  Mail,
  Edit,
  Save,
  X,
  Target,
  Activity,
  Calendar,
  Settings,
  Flame,
  TrendingUp,
  Weight,
  Ruler,
  Clock,
} from "lucide-react";
import { authAPI, userAPI, getAuthToken } from "../../services/api";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [streak, setStreak] = useState(0);
  const [profile, setProfile] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedStreak = parseInt(localStorage.getItem("streak")) || 0;
    setStreak(savedStreak);

    // Load user data from API
    const loadProfile = async () => {
      const token = getAuthToken();
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getProfile(token);
        if (response.success && response.data?.user) {
          const user = response.data.user;
          const userProfile = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.profile?.age || 0,
            weight: user.profile?.weight || 0,
            height: user.profile?.height || 0,
            gender: user.profile?.gender || "",
            fitnessLevel: user.profile?.fitnessLevel || "",
            goals: user.profile?.goals || [],
            availableEquipment: user.profile?.availableEquipment || [],
            workoutTime: user.preferences?.workoutTime || "",
            workoutDaysPerWeek: user.profile?.workoutDaysPerWeek || 0,
            sessionLength: user.profile?.timePerWorkout || 0,
          };
          setProfile(userProfile);
          setEditForm(userProfile);
        } else {
          setError(response.message || "Failed to load profile");
        }
      } catch (err) {
        setError("An error occurred while loading profile");
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    const savedStreak = parseInt(localStorage.getItem("streak")) || 0;
    setStreak(savedStreak);
  }, []);

  useEffect(() => {
    setEditForm(profile);
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(profile);
  };

  const handleSave = async () => {
    const token = getAuthToken();
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // Update profile via API
      const profileData = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        profile: {
          age: Number(editForm.age),
          weight: Number(editForm.weight),
          height: Number(editForm.height),
          gender: editForm.gender,
          fitnessLevel: editForm.fitnessLevel,
          goals: editForm.goals,
          availableEquipment: editForm.availableEquipment,
          workoutDaysPerWeek: Number(editForm.workoutDaysPerWeek),
          timePerWorkout: Number(editForm.sessionLength),
        },
        preferences: {
          workoutTime: editForm.workoutTime,
        },
      };

      const response = await userAPI.updateProfile(token, profileData);
      
      if (response.success) {
        setProfile(editForm);
        setIsEditing(false);
        // Update localStorage username
        localStorage.setItem("username", `${editForm.firstName} ${editForm.lastName}`);
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred while updating profile");
      console.error("Profile update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const toggleGoal = (goal) => {
    const currentGoals = editForm.goals || [];
    if (currentGoals.includes(goal)) {
      setEditForm({
        ...editForm,
        goals: currentGoals.filter((g) => g !== goal),
      });
    } else {
      setEditForm({
        ...editForm,
        goals: [...currentGoals, goal],
      });
    }
  };

  const toggleEquipment = (equipment) => {
    const currentEquipment = editForm.availableEquipment || [];
    if (currentEquipment.includes(equipment)) {
      setEditForm({
        ...editForm,
        availableEquipment: currentEquipment.filter((e) => e !== equipment),
      });
    } else {
      setEditForm({
        ...editForm,
        availableEquipment: [...currentEquipment, equipment],
      });
    }
  };

  const availableGoals = [
    "lose-weight",
    "build-muscle",
    "general-fitness",
    "improve-endurance",
    "flexibility",
  ];

  const availableEquipment = [
    "bodyweight",
    "dumbbells",
    "barbell",
    "full-gym-access",
    "resistance-bands",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16">
        <MemberHeader />
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16">
        <MemberHeader />
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="px-3 py-2 bg-red-900/30 text-red-300 rounded text-sm border border-red-800">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || !editForm) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <MemberHeader />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <User className="w-8 h-8" />
              Profile
            </h1>
            <p className="text-muted-foreground">Manage your profile and preferences</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                  <p className="text-3xl font-bold text-yellow-400 flex items-center gap-2">
                    <Flame className="w-6 h-6" />
                    {streak} days
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Workout Days</p>
                  <p className="text-3xl font-bold text-primary flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    {profile.workoutDaysPerWeek}/week
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Session Length</p>
                  <p className="text-3xl font-bold text-green-400 flex items-center gap-2">
                    <Clock className="w-6 h-6" />
                    {profile.sessionLength} min
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Profile Information Card */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </h2>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center gap-1 transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">First Name</span>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, firstName: e.target.value })
                      }
                      className="w-48 px-3 py-1 bg-muted text-foreground rounded border border-border"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Last Name</span>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, lastName: e.target.value })
                      }
                      className="w-48 px-3 py-1 bg-muted text-foreground rounded border border-border"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Email</span>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="w-48 px-3 py-1 bg-muted text-foreground rounded border border-border"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Age</span>
                    <input
                      type="number"
                      value={editForm.age}
                      onChange={(e) =>
                        setEditForm({ ...editForm, age: e.target.value })
                      }
                      className="w-48 px-3 py-1 bg-muted text-foreground rounded border border-border"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Weight (kg)</span>
                    <input
                      type="number"
                      value={editForm.weight}
                      onChange={(e) =>
                        setEditForm({ ...editForm, weight: e.target.value })
                      }
                      className="w-48 px-3 py-1 bg-muted text-foreground rounded border border-border"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Height (cm)</span>
                    <input
                      type="number"
                      value={editForm.height}
                      onChange={(e) =>
                        setEditForm({ ...editForm, height: e.target.value })
                      }
                      className="w-48 px-3 py-1 bg-muted text-foreground rounded border border-border"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Gender</span>
                    <select
                      value={editForm.gender}
                      onChange={(e) =>
                        setEditForm({ ...editForm, gender: e.target.value })
                      }
                      className="w-48 px-3 py-1 bg-muted text-foreground rounded border border-border"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Fitness Level</span>
                    <select
                      value={editForm.fitnessLevel}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          fitnessLevel: e.target.value,
                        })
                      }
                      className="w-48 px-3 py-1 bg-muted text-foreground rounded border border-border"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="text-foreground">
                      {profile.firstName} {profile.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="text-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {profile.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age</span>
                    <span className="text-foreground">{profile.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight</span>
                    <span className="text-foreground flex items-center gap-1">
                      <Weight className="w-3 h-3" />
                      {profile.weight} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Height</span>
                    <span className="text-foreground flex items-center gap-1">
                      <Ruler className="w-3 h-3" />
                      {profile.height} cm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gender</span>
                    <span className="text-foreground capitalize">
                      {profile.gender}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fitness Level</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-900/30 text-blue-300 capitalize">
                      {profile.fitnessLevel}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Goals & Preferences Card */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Goals & Preferences
                </h2>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Goals</p>
                    <div className="flex flex-wrap gap-2">
                      {availableGoals.map((goal) => (
                        <button
                          key={goal}
                          onClick={() => toggleGoal(goal)}
                          className={`px-2 py-1 text-xs rounded-full capitalize transition-colors ${
                            editForm.goals?.includes(goal)
                              ? "bg-purple-900/30 text-primary border border-purple-500"
                              : "bg-muted text-muted-foreground hover:bg-secondary"
                          }`}
                        >
                          {goal.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Equipment</p>
                    <div className="flex flex-wrap gap-2">
                      {availableEquipment.map((eq) => (
                        <button
                          key={eq}
                          onClick={() => toggleEquipment(eq)}
                          className={`px-2 py-1 text-xs rounded-full capitalize transition-colors ${
                            editForm.availableEquipment?.includes(eq)
                              ? "bg-secondary text-foreground border border-border"
                              : "bg-muted text-muted-foreground hover:bg-secondary"
                          }`}
                        >
                          {eq.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Workout Time: </span>
                    <select
                      value={editForm.workoutTime}
                      onChange={(e) =>
                        setEditForm({ ...editForm, workoutTime: e.target.value })
                      }
                      className="ml-2 px-3 py-1 bg-muted text-foreground rounded border border-border"
                    >
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Goals</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.goals.map((goal) => (
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
                    <p className="text-sm text-muted-foreground mb-2">Equipment</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.availableEquipment.map((eq) => (
                        <span
                          key={eq}
                          className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground capitalize"
                        >
                          {eq.replace("-", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Workout Time: </span>
                    <span className="text-foreground capitalize">
                      {profile.workoutTime}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 px-3 py-2 bg-red-900/30 text-red-300 rounded text-sm border border-red-800">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Actions
              </h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-4 py-2 bg-secondary hover:bg-muted disabled:bg-card disabled:cursor-not-allowed text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
