import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { userAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Activity, CheckCircle2, Eye, Clock, Target } from "lucide-react";

interface CalendarDay {
  date: string;
  workoutType: string;
  workoutId?: string;
  isCompleted: boolean;
}

interface WorkoutDetails {
  _id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    weight?: number;
    restTime: number;
    muscleGroups: string[];
  }>;
}

interface WeeklySchedule {
  schedule: CalendarDay[];
  splitType: string;
  startDate: string;
}

const Calendar = () => {
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDetails | null>(null);
  const [showWorkoutDialog, setShowWorkoutDialog] = useState(false);
  const [loadingWorkout, setLoadingWorkout] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();

  const fetchWeeklySchedule = async (startDate: Date) => {
    if (!token) return;
    
    try {
      const response = await userAPI.getWeeklySchedule(token, startDate.toISOString());
      if (response.success && response.data) {
        setWeeklySchedule(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load weekly schedule",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkoutDetails = async (workoutId: string) => {
    if (!token) return;
    
    setLoadingWorkout(true);
    try {
      const response = await userAPI.getWorkoutById(token, workoutId);
      if (response.success && response.data) {
        setSelectedWorkout(response.data);
        setShowWorkoutDialog(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load workout details",
        variant: "destructive",
      });
    } finally {
      setLoadingWorkout(false);
    }
  };

  const handleDayClick = (daySchedule: CalendarDay) => {
    if (daySchedule.workoutId && daySchedule.workoutType !== 'rest') {
      fetchWorkoutDetails(daySchedule.workoutId);
    }
  };

  useEffect(() => {
    fetchWeeklySchedule(currentWeekStart);
  }, [currentWeekStart, token]);

  const getWeekDates = (startDate: Date) => {
    const dates = [];
    // Show 7 days ahead from today
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getDayNumber = (date: Date) => {
    return date.getDate();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getWorkoutTypeColor = (workoutType: string) => {
    const colors = {
      'push': 'bg-red-100 text-red-800',
      'pull': 'bg-blue-100 text-blue-800',
      'legs': 'bg-green-100 text-green-800',
      'upper': 'bg-purple-100 text-purple-800',
      'lower': 'bg-orange-100 text-orange-800',
      'full-body': 'bg-yellow-100 text-yellow-800',
      'custom': 'bg-gray-100 text-gray-800',
      'rest': 'bg-gray-50 text-gray-500'
    };
    return colors[workoutType as keyof typeof colors] || colors.custom;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    setCurrentWeekStart(startOfWeek);
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading calendar...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const weekDates = getWeekDates(currentWeekStart);
  const today = new Date();

  return (
    <Card className="bg-gradient-card border-0 shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-accent" />
            Weekly Workout Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToCurrentWeek}
              className="text-xs"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {weeklySchedule?.splitType.toUpperCase()} Split • Next 7 Days
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const daySchedule = weeklySchedule?.schedule.find(
              day => new Date(day.date).toDateString() === date.toDateString()
            );
            
            return (
              <div
                key={index}
                className={`p-3 rounded-lg border text-center cursor-pointer transition-colors hover:bg-accent/5 ${
                  isToday(date) 
                    ? 'border-accent bg-accent/10' 
                    : 'border-border'
                } ${daySchedule?.workoutId && daySchedule.workoutType !== 'rest' ? 'hover:border-accent' : ''}`}
                onClick={() => daySchedule && handleDayClick(daySchedule)}
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {getDayName(date)}
                </div>
                <div className={`text-lg font-semibold mb-2 ${
                  isToday(date) ? 'text-accent' : ''
                }`}>
                  {getDayNumber(date)}
                </div>
                
                {daySchedule ? (
                  <div className="space-y-1">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getWorkoutTypeColor(daySchedule.workoutType)}`}
                    >
                      {daySchedule.workoutType === 'rest' ? 'Rest Day' : daySchedule.workoutType}
                    </Badge>
                    {daySchedule.isCompleted && (
                      <div className="flex justify-center">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    No workout
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" />
              <span>Workouts this week:</span>
            </div>
            <Badge variant="outline">
              {weeklySchedule?.schedule.filter(day => day.workoutType !== 'rest').length || 0}
            </Badge>
          </div>
        </div>
      </CardContent>

      {/* Workout Details Dialog */}
      <Dialog open={showWorkoutDialog} onOpenChange={setShowWorkoutDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />
              {selectedWorkout?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedWorkout?.description}
            </DialogDescription>
          </DialogHeader>
          
          {loadingWorkout ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading workout details...</p>
            </div>
          ) : selectedWorkout ? (
            <div className="space-y-6">
              {/* Workout Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedWorkout.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline">{selectedWorkout.difficulty}</Badge>
                </div>
              </div>

              {/* Exercises */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Exercises</h3>
                <div className="space-y-3">
                  {selectedWorkout.exercises.map((exercise, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{exercise.name}</h4>
                        <Badge variant="secondary">
                          {exercise.sets} sets × {exercise.reps} reps
                        </Badge>
                      </div>
                      {exercise.weight && exercise.weight > 0 && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Weight: {exercise.weight} lbs
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mb-2">
                        Rest: {exercise.restTime} seconds
                      </p>
                      {exercise.muscleGroups.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {exercise.muscleGroups.map((muscle, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {muscle}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Calendar;
