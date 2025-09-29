import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Activity,
  Plus,
  Eye,
  Edit,
  Send,
  User,
  Clock,
  Target
} from 'lucide-react';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profile?: {
    age: number;
    weight: number;
    height: number;
    gender: string;
    fitnessLevel: string;
    goals: string[];
  };
  isActive: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  recentWorkouts: number;
  coachProfile: {
    specialization: string[];
    experience: number;
    bio: string;
  };
}

interface WorkoutSchedule {
  workouts: any[];
  splitType: string;
  schedule: Array<{
    date: string;
    workoutType: string;
    isCompleted: boolean;
    workoutId: string;
  }>;
}

interface NutritionPlan {
  meals: any[];
  dailyCalorieTarget: number;
  macroTargets: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

const CoachDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientWorkoutSchedule, setClientWorkoutSchedule] = useState<WorkoutSchedule | null>(null);
  const [clientNutritionPlan, setClientNutritionPlan] = useState<NutritionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [commentForm, setCommentForm] = useState({
    type: 'exercise', // 'exercise' or 'meal'
    workoutId: '',
    exerciseId: '',
    mealId: '',
    comment: ''
  });

  const { user, token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load coach stats and clients
      const response = await fetch('http://localhost:3001/api/v1/coach/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      }

      // Load clients
      const clientsResponse = await fetch('http://localhost:3001/api/v1/coach/clients', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        if (clientsData.success) {
          // Map _id to id for frontend compatibility
          const mappedClients = clientsData.data.map((client: any) => ({
            ...client,
            id: client._id
          }));
          setClients(mappedClients);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadClientDetails = async (clientId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/coach/clients/${clientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Map _id to id for frontend compatibility
          const mappedClient = {
            ...data.data.client,
            id: data.data.client._id
          };
          setSelectedClient(mappedClient);
          setClientWorkoutSchedule(data.data.workoutSchedule);
          setClientNutritionPlan(data.data.nutritionPlan);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load client details",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async () => {
    try {
      const endpoint = commentForm.type === 'exercise' 
        ? `http://localhost:3001/api/v1/coach/clients/${selectedClient?.id}/workouts/${commentForm.workoutId}/exercises/${commentForm.exerciseId}/comments`
        : `http://localhost:3001/api/v1/coach/clients/${selectedClient?.id}/meals/${commentForm.mealId}/comments`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: commentForm.comment }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Comment added successfully",
        });
        setShowCommentDialog(false);
        setCommentForm({ type: 'exercise', workoutId: '', exerciseId: '', mealId: '', comment: '' });
        // Reload client details to show new comment
        if (selectedClient) {
          loadClientDetails(selectedClient.id);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to add comment",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const updateClientWorkoutSchedule = async () => {
    if (!selectedClient || !clientWorkoutSchedule) return;

    try {
      const response = await fetch(`http://localhost:3001/api/v1/coach/clients/${selectedClient.id}/workout-schedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ workouts: clientWorkoutSchedule.workouts }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Workout schedule updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update workout schedule",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update workout schedule",
        variant: "destructive",
      });
    }
  };

  const updateClientNutritionPlan = async () => {
    if (!selectedClient || !clientNutritionPlan) return;

    try {
      const response = await fetch(`http://localhost:3001/api/v1/coach/clients/${selectedClient.id}/nutrition-plan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ meals: clientNutritionPlan.meals }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Nutrition plan updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update nutrition plan",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update nutrition plan",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading coach dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Coach Dashboard</h1>
          <p className="text-gray-600">Manage your clients and their fitness journeys</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClients}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeClients} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Workouts</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentWorkouts}</div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Experience</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.coachProfile.experience}</div>
                <p className="text-xs text-muted-foreground">
                  years experience
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clients List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Clients</CardTitle>
                <CardDescription>Select a client to view their details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedClient?.id === client.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => loadClientDetails(client.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{client.firstName} {client.lastName}</p>
                          <p className="text-sm text-gray-600">{client.email}</p>
                        </div>
                        <Badge variant={client.isActive ? "default" : "secondary"}>
                          {client.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Client Details */}
          <div className="lg:col-span-2">
            {selectedClient ? (
              <Card>
                <CardHeader>
                  <CardTitle>Client Overview</CardTitle>
                  <CardDescription>{selectedClient.firstName} {selectedClient.lastName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="workouts">Workouts</TabsTrigger>
                      <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Email</Label>
                          <p className="text-sm text-gray-600">{selectedClient.email}</p>
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Badge variant={selectedClient.isActive ? "default" : "secondary"}>
                            {selectedClient.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        {selectedClient.profile && (
                          <>
                            <div>
                              <Label>Age</Label>
                              <p className="text-sm text-gray-600">{selectedClient.profile.age} years</p>
                            </div>
                            <div>
                              <Label>Fitness Level</Label>
                              <p className="text-sm text-gray-600 capitalize">{selectedClient.profile.fitnessLevel}</p>
                            </div>
                            <div>
                              <Label>Goals</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedClient.profile.goals.map((goal, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {goal.replace('-', ' ')}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="workouts">
                      <div className="space-y-4">
                        {clientWorkoutSchedule ? (
                          <>
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="text-lg font-semibold">Workout Schedule</h3>
                                <Badge variant="outline" className="mt-1">
                                  {clientWorkoutSchedule.splitType.toUpperCase()} Split
                                </Badge>
                              </div>
                              <Button onClick={updateClientWorkoutSchedule}>
                                <Edit className="h-4 w-4 mr-2" />
                                Update Schedule
                              </Button>
                            </div>
                            
                            <div className="space-y-3">
                              {clientWorkoutSchedule.schedule.map((day, index) => (
                                <Card key={index}>
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                      <div>
                                        <h4 className="font-medium">{new Date(day.date).toLocaleDateString()}</h4>
                                        <p className="text-sm text-gray-600 capitalize">{day.workoutType}</p>
                                      </div>
                                      <Badge variant={day.isCompleted ? "default" : "secondary"}>
                                        {day.isCompleted ? "Completed" : "Pending"}
                                      </Badge>
                                    </div>
                                    {day.workoutId && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setCommentForm({
                                            type: 'exercise',
                                            workoutId: day.workoutId,
                                            exerciseId: '',
                                            mealId: '',
                                            comment: ''
                                          });
                                          setShowCommentDialog(true);
                                        }}
                                      >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Add Comment
                                      </Button>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-600">No workout schedule available</p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="nutrition">
                      <div className="space-y-4">
                        {clientNutritionPlan ? (
                          <>
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="text-lg font-semibold">Nutrition Plan</h3>
                                <Badge variant="outline" className="mt-1">
                                  {clientNutritionPlan.dailyCalorieTarget} calories/day
                                </Badge>
                              </div>
                              <Button onClick={updateClientNutritionPlan}>
                                <Edit className="h-4 w-4 mr-2" />
                                Update Plan
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="text-center p-3 border rounded-lg">
                                <Label>Protein</Label>
                                <p className="text-lg font-semibold">{clientNutritionPlan.macroTargets.protein}g</p>
                              </div>
                              <div className="text-center p-3 border rounded-lg">
                                <Label>Carbs</Label>
                                <p className="text-lg font-semibold">{clientNutritionPlan.macroTargets.carbs}g</p>
                              </div>
                              <div className="text-center p-3 border rounded-lg">
                                <Label>Fat</Label>
                                <p className="text-lg font-semibold">{clientNutritionPlan.macroTargets.fat}g</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h4 className="font-medium">Meals</h4>
                              {clientNutritionPlan.meals.map((mealId, index) => (
                                <Card key={index}>
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <h5 className="font-medium">Meal {index + 1}</h5>
                                        <p className="text-sm text-gray-600">Meal ID: {mealId}</p>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setCommentForm({
                                            type: 'meal',
                                            workoutId: '',
                                            exerciseId: '',
                                            mealId: mealId,
                                            comment: ''
                                          });
                                          setShowCommentDialog(true);
                                        }}
                                      >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Add Comment
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-600">No nutrition plan available</p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="settings">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Client Settings</h3>
                        
                        {selectedClient.profile && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Current Weight (kg)</Label>
                              <Input 
                                type="number" 
                                defaultValue={selectedClient.profile.weight}
                                placeholder="Enter weight"
                              />
                            </div>
                            <div>
                              <Label>Height (cm)</Label>
                              <Input 
                                type="number" 
                                defaultValue={selectedClient.profile.height}
                                placeholder="Enter height"
                              />
                            </div>
                            <div>
                              <Label>Fitness Level</Label>
                              <select className="w-full p-2 border rounded-md">
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                              </select>
                            </div>
                            <div>
                              <Label>Workout Split</Label>
                              <select className="w-full p-2 border rounded-md">
                                <option value="ppl">Push/Pull/Legs</option>
                                <option value="ul">Upper/Lower</option>
                                <option value="fb">Full Body</option>
                                <option value="custom">Custom</option>
                              </select>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-end">
                          <Button>
                            <Edit className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Select a client to view their details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Comment Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>
              Add a personalized comment for your client
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Comment Type</Label>
              <select
                value={commentForm.type}
                onChange={(e) => setCommentForm({...commentForm, type: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="exercise">Exercise Comment</option>
                <option value="meal">Meal Comment</option>
              </select>
            </div>
            <div>
              <Label>Comment</Label>
              <Textarea
                value={commentForm.comment}
                onChange={(e) => setCommentForm({...commentForm, comment: e.target.value})}
                placeholder="Enter your comment..."
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddComment}>
                <Send className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoachDashboard;
