import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useToast } from '../hooks/use-toast';
import { Save, User, Target, Dumbbell, Calendar, AlertTriangle, RefreshCw } from 'lucide-react';

interface UserProfile {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  workoutDaysPerWeek: number;
  workoutSplit: 'ppl' | 'fb' | 'ul' | 'custom';
  timePerWorkout: number;
  dietaryRestrictions: string[];
  allergies: string[];
}

const Settings = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    age: 25,
    weight: 70,
    height: 170,
    gender: 'male',
    fitnessLevel: 'intermediate',
    goals: ['general-fitness'],
    workoutDaysPerWeek: 3,
    workoutSplit: 'custom',
    timePerWorkout: 60,
    dietaryRestrictions: [],
    allergies: []
  });

  useEffect(() => {
    if (user?.profile) {
      const newProfile = {
        age: user.profile.age || 25,
        weight: user.profile.weight || 70,
        height: user.profile.height || 170,
        gender: user.profile.gender || 'male',
        fitnessLevel: user.profile.fitnessLevel || 'intermediate',
        goals: user.profile.goals || ['general-fitness'],
        workoutDaysPerWeek: user.profile.workoutDaysPerWeek || 3,
        workoutSplit: user.profile.workoutSplit || 'custom',
        timePerWorkout: user.profile.timePerWorkout || 60,
        dietaryRestrictions: user.profile.dietaryRestrictions || [],
        allergies: user.profile.allergies || []
      };
      setProfile(newProfile);
      setOriginalProfile(newProfile);
    }
  }, [user]);

  const handleSave = async () => {
    if (!token) return;

    setLoading(true);
    try {
      await userAPI.updateProfile(token, profile);
      setOriginalProfile(profile);
      setHasChanges(false);
      toast({
        title: "Settings Updated",
        description: "Your profile has been updated successfully. All workouts and nutrition plans will be regenerated based on your new preferences.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    
    // Check if this change affects workout generation
    const workoutAffectingFields = ['age', 'weight', 'height', 'gender', 'fitnessLevel', 'goals', 'workoutDaysPerWeek', 'workoutSplit', 'timePerWorkout'];
    if (workoutAffectingFields.includes(field)) {
      setHasChanges(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <User className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="grid gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>
                Update your basic profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => updateProfile('age', parseInt(e.target.value))}
                    min="13"
                    max="80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profile.weight}
                    onChange={(e) => updateProfile('weight', parseFloat(e.target.value))}
                    min="35"
                    max="200"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.height}
                    onChange={(e) => updateProfile('height', parseInt(e.target.value))}
                    min="120"
                    max="220"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup value={profile.gender} onValueChange={(value) => updateProfile('gender', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Fitness Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Fitness Goals</span>
              </CardTitle>
              <CardDescription>
                Set your fitness objectives and training level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Fitness Level</Label>
                <Select value={profile.fitnessLevel} onValueChange={(value) => updateProfile('fitnessLevel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Primary Goal</Label>
                <Select value={profile.goals[0]} onValueChange={(value) => updateProfile('goals', [value])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="build-muscle">Build Muscle</SelectItem>
                    <SelectItem value="strength">Build Strength</SelectItem>
                    <SelectItem value="lose-weight">Lose Weight</SelectItem>
                    <SelectItem value="improve-endurance">Improve Endurance</SelectItem>
                    <SelectItem value="general-fitness">General Fitness</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Workout Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Dumbbell className="h-5 w-5" />
                <span>Workout Preferences</span>
              </CardTitle>
              <CardDescription>
                Customize your training schedule and split
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Workout Split</Label>
                  <Select value={profile.workoutSplit} onValueChange={(value) => updateProfile('workoutSplit', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ppl">PPL (Push/Pull/Legs)</SelectItem>
                      <SelectItem value="ul">Upper/Lower</SelectItem>
                      <SelectItem value="fb">Full Body</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Days per Week</Label>
                  <Select value={profile.workoutDaysPerWeek.toString()} onValueChange={(value) => updateProfile('workoutDaysPerWeek', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 days</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="4">4 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="6">6 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timePerWorkout">Time per Workout (minutes)</Label>
                <Input
                  id="timePerWorkout"
                  type="number"
                  value={profile.timePerWorkout}
                  onChange={(e) => updateProfile('timePerWorkout', parseInt(e.target.value))}
                  min="30"
                  max="120"
                />
              </div>
            </CardContent>
          </Card>

          {/* Warning Alert */}
          {hasChanges && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Important:</strong> Changes to your fitness level, goals, workout split, or schedule will regenerate all your workouts and nutrition plans. This may take a few moments to complete.
              </AlertDescription>
            </Alert>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={loading} className="flex items-center space-x-2">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Regenerating Plans...' : 'Save Changes'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
