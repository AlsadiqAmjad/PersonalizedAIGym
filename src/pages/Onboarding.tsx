import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Zap, ArrowLeft, ArrowRight, User, Target, Clock, Dumbbell, Apple, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { userAPI, UserProfile, UserPreferences } from "@/services/api";

interface FormData {
  // Personal Info
  age: string;
  gender: string;
  height: string;
  weight: string;
  
  // Fitness Goals
  primaryGoal: string;
  fitnessLevel: string;
  
  // Availability & Equipment
  workoutDays: string;
  sessionDuration: string;
  workoutSplit: string;
  equipment: string[];
  
  // Health & Preferences
  injuries: string;
  preferences: string;
}

const STEPS = [
  { id: 1, title: "Personal Info", icon: User, description: "Tell us about yourself" },
  { id: 2, title: "Fitness Goals", icon: Target, description: "What do you want to achieve?" },
  { id: 3, title: "Schedule & Equipment", icon: Clock, description: "When and how will you train?" },
  { id: 4, title: "Health & Preferences", icon: Apple, description: "Any special considerations?" },
];

const EQUIPMENT_OPTIONS = [
  "Dumbbells",
  "Barbell",
  "Resistance Bands",
  "Kettlebells",
  "Pull-up Bar",
  "Bench",
  "Cable Machine",
  "Cardio Equipment",
  "Bodyweight Only",
  "Full Gym Access",
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    age: "",
    gender: "",
    height: "",
    weight: "",
    primaryGoal: "",
    fitnessLevel: "",
    workoutDays: "",
    sessionDuration: "",
    workoutSplit: "",
    equipment: [],
    injuries: "",
    preferences: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useAuth();

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleEquipment = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete onboarding",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert form data to API format
      const profile: UserProfile = {
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        gender: formData.gender as 'male' | 'female',
        fitnessLevel: formData.fitnessLevel as 'beginner' | 'intermediate' | 'advanced',
        goals: [formData.primaryGoal],
        availableEquipment: formData.equipment,
        timePerWorkout: parseInt(formData.sessionDuration),
        workoutDaysPerWeek: parseInt(formData.workoutDays),
        workoutSplit: formData.workoutSplit as 'ppl' | 'fb' | 'ul' | 'custom',
        dietaryRestrictions: [],
        allergies: [],
      };

      const preferences: UserPreferences = {
        workoutTime: 'morning',
        preferredExercises: [],
        dislikedExercises: [],
        notifications: {
          email: true,
          push: true,
          workoutReminders: true,
        },
      };

      const response = await userAPI.completeOnboarding(token, { profile, preferences });
      
      if (response.success) {
        toast({
          title: "🎉 Your personalized plan is ready!",
          description: "Welcome to your AI-powered fitness journey. Let's get started!",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Onboarding Failed",
          description: "Failed to create your personalized plan. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        title: "Onboarding Error",
        description: "An error occurred during onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentStepData = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => updateFormData("age", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={formData.height}
                  onChange={(e) => updateFormData("height", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={formData.weight}
                  onChange={(e) => updateFormData("weight", e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>What's your primary fitness goal?</Label>
              <RadioGroup value={formData.primaryGoal} onValueChange={(value) => updateFormData("primaryGoal", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lose-weight" id="lose-weight" />
                  <Label htmlFor="lose-weight">Lose weight</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="build-muscle" id="build-muscle" />
                  <Label htmlFor="build-muscle">Build muscle</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="improve-endurance" id="improve-endurance" />
                  <Label htmlFor="improve-endurance">Improve endurance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="general-fitness" id="general-fitness" />
                  <Label htmlFor="general-fitness">General fitness</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="strength" id="strength" />
                  <Label htmlFor="strength">Increase strength</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>What's your current fitness level?</Label>
              <RadioGroup value={formData.fitnessLevel} onValueChange={(value) => updateFormData("fitnessLevel", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner">Beginner (0-6 months experience)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate (6 months - 2 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced">Advanced (2+ years)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>How many days per week can you work out?</Label>
              <Select value={formData.workoutDays} onValueChange={(value) => updateFormData("workoutDays", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select days per week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 days</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="4">4 days</SelectItem>
                  <SelectItem value="5">5 days</SelectItem>
                  <SelectItem value="6">6 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>How long can each workout session be?</Label>
              <RadioGroup value={formData.sessionDuration} onValueChange={(value) => updateFormData("sessionDuration", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="15-30" id="15-30" />
                  <Label htmlFor="15-30">15-30 minutes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30-45" id="30-45" />
                  <Label htmlFor="30-45">30-45 minutes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="45-60" id="45-60" />
                  <Label htmlFor="45-60">45-60 minutes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="60+" id="60+" />
                  <Label htmlFor="60+">60+ minutes</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>What workout split do you prefer? (For weight training)</Label>
              <RadioGroup value={formData.workoutSplit} onValueChange={(value) => updateFormData("workoutSplit", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ppl" id="ppl" />
                  <Label htmlFor="ppl">PPL (Push/Pull/Legs) - 6 days/week</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fb" id="fb" />
                  <Label htmlFor="fb">Full Body - 3-4 days/week</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ul" id="ul" />
                  <Label htmlFor="ul">Upper/Lower - 4 days/week</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Let AI decide based on my schedule</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>What equipment do you have access to? (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2">
                {EQUIPMENT_OPTIONS.map((equipment) => (
                  <div key={equipment} className="flex items-center space-x-2">
                    <Checkbox
                      id={equipment}
                      checked={formData.equipment.includes(equipment)}
                      onCheckedChange={() => toggleEquipment(equipment)}
                    />
                    <Label htmlFor={equipment} className="text-sm">{equipment}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="injuries">
                Do you have any injuries or physical limitations we should know about?
              </Label>
              <Textarea
                id="injuries"
                placeholder="E.g., knee injury, lower back issues, etc. (optional)"
                value={formData.injuries}
                onChange={(e) => updateFormData("injuries", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferences">
                Any specific preferences or notes for your workout plan?
              </Label>
              <Textarea
                id="preferences"
                placeholder="E.g., prefer morning workouts, avoid certain exercises, etc. (optional)"
                value={formData.preferences}
                onChange={(e) => updateFormData("preferences", e.target.value)}
                rows={3}
              />
            </div>

            <div className="p-4 bg-accent/10 rounded-lg border">
              <h4 className="font-medium text-accent mb-2">🎯 What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• AI analyzes your profile and creates a personalized workout plan</li>
                <li>• You'll get customized nutrition recommendations</li>
                <li>• Your plan adapts based on your progress and feedback</li>
                <li>• Access to exercise demonstrations and form tips</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.age && formData.gender && formData.height && formData.weight;
      case 2:
        return formData.primaryGoal && formData.fitnessLevel;
      case 3:
        return formData.workoutDays && formData.sessionDuration && formData.equipment.length > 0;
      case 4:
        return true; // Optional fields
      default:
        return false;
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="bg-gradient-hero p-3 rounded-xl">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              AI Gym Trainer
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Let's Create Your Perfect Plan</h1>
          <p className="text-muted-foreground">
            Help us understand your goals so we can build a personalized workout and nutrition plan
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-between mb-8">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-smooth ${
                    isActive
                      ? "bg-gradient-hero text-white"
                      : isCompleted
                      ? "bg-success text-success-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <div className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(STEPS[currentStep - 1].icon, { className: "h-5 w-5 text-accent" })}
              {STEPS[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {STEPS[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {getCurrentStepData()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="bg-gradient-hero text-white hover:opacity-90 transition-smooth"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || isLoading}
              className="bg-gradient-hero text-white hover:opacity-90 transition-smooth"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Your Plan...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Create My Plan
                </>
              )}
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8 p-6 bg-gradient-hero/10 rounded-lg border border-accent/20">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <Dumbbell className="h-8 w-8 text-accent animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Creating Your Personalized Plan</h3>
                <p className="text-muted-foreground">
                  Our AI is analyzing your profile and generating the perfect workout and nutrition plan for you...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;