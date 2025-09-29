import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { userAPI, Workout, Exercise } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Target, 
  Activity,
  Loader2,
  RotateCcw
} from "lucide-react";

interface WorkoutProgressProps {
  workout: Workout;
  onWorkoutComplete?: () => void;
}

const WorkoutProgress = ({ workout, onWorkoutComplete }: WorkoutProgressProps) => {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 });
  const [isWorkoutCompleted, setIsWorkoutCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentExercise();
  }, [workout._id]);

  const fetchCurrentExercise = async () => {
    if (!token) return;
    
    try {
      const response = await userAPI.getCurrentExercise(token, workout._id);
      if (response.success && response.data) {
        setCurrentExercise(response.data.currentExercise);
        setProgress(response.data.progress);
        setIsWorkoutCompleted(response.data.isWorkoutCompleted);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load current exercise",
        variant: "destructive",
      });
    }
  };

  const handleCompleteExercise = async () => {
    if (!token || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await userAPI.completeCurrentExercise(token, workout._id);
      if (response.success && response.data) {
        setCurrentExercise(response.data.currentExercise);
        setProgress(response.data.progress);
        setIsWorkoutCompleted(response.data.isWorkoutCompleted);
        
        if (response.data.isWorkoutCompleted) {
          toast({
            title: "Workout Completed! 🎉",
            description: "Amazing job! You've finished your entire workout.",
          });
          onWorkoutComplete?.();
        } else {
          toast({
            title: "Exercise Completed!",
            description: "Great work! Moving to the next exercise.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete exercise",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getExerciseTypeIcon = (type: string) => {
    switch (type) {
      case 'warmup':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'cooldown':
        return <Activity className="h-4 w-4 text-green-500" />;
      default:
        return <Target className="h-4 w-4 text-accent" />;
    }
  };

  const getExerciseTypeColor = (type: string) => {
    switch (type) {
      case 'warmup':
        return 'bg-blue-100 text-blue-800';
      case 'cooldown':
        return 'bg-green-100 text-green-800';
      case 'compound':
        return 'bg-red-100 text-red-800';
      case 'accessory':
        return 'bg-orange-100 text-orange-800';
      case 'isolation':
        return 'bg-purple-100 text-purple-800';
      case 'core':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isWorkoutCompleted) {
    return (
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardContent className="p-6 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Workout Completed! 🎉</h3>
          <p className="text-muted-foreground mb-4">
            You've successfully completed all {progress.total} exercises.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-hero text-white hover:opacity-90"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Start New Workout
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentExercise) {
    return (
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading current exercise...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-0 shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getExerciseTypeIcon(currentExercise.type)}
            Current Exercise
          </CardTitle>
          <Badge className={getExerciseTypeColor(currentExercise.exerciseType)}>
            {currentExercise.exerciseType}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Exercise {progress.completed + 1} of {progress.total}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Workout Progress</span>
              <span>{progress.percentage}%</span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
          </div>

          {/* Current Exercise Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">{currentExercise.name}</h3>
              <p className="text-muted-foreground">{currentExercise.description}</p>
            </div>

            {/* Exercise Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentExercise.type === 'exercise' && (
                <>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold">{currentExercise.sets}</div>
                    <div className="text-xs text-muted-foreground">Sets</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold">{currentExercise.reps}</div>
                    <div className="text-xs text-muted-foreground">Reps</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold">{currentExercise.restTime}s</div>
                    <div className="text-xs text-muted-foreground">Rest</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold">{currentExercise.muscleGroups.length}</div>
                    <div className="text-xs text-muted-foreground">Muscles</div>
                  </div>
                </>
              )}
              {currentExercise.type !== 'exercise' && currentExercise.duration && (
                <div className="text-center p-3 bg-muted/50 rounded-lg col-span-2">
                  <div className="text-lg font-semibold">{Math.round(currentExercise.duration / 60)} min</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
              )}
            </div>

            {/* Muscle Groups */}
            {currentExercise.muscleGroups.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Target Muscles:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentExercise.muscleGroups.map((muscle, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Equipment */}
            {currentExercise.equipment.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Equipment:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentExercise.equipment.map((equipment, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {equipment}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {currentExercise.instructions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Instructions:</h4>
                <ol className="text-sm text-muted-foreground space-y-1">
                  {currentExercise.instructions.map((instruction, index) => (
                    <li key={index}>{index + 1}. {instruction}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Complete Exercise Button */}
          <Button
            onClick={handleCompleteExercise}
            disabled={isLoading}
            className="w-full bg-gradient-hero text-white hover:opacity-90 h-12 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Complete Exercise
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutProgress;
