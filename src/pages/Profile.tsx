import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Calendar, 
  Target, 
  Activity,
  LogOut,
  Loader2,
  Edit,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      
      try {
        const response = await authAPI.getProfile(token);
        if (response.success && response.data) {
          setUserProfile(response.data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, toast]);

  const handleLogout = async () => {
    try {
      if (token) {
        await authAPI.logout(token);
      }
      logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      // Even if logout API fails, we should still clear local state
      logout();
      toast({
        title: "Logged Out",
        description: "You have been logged out.",
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
              <p className="text-muted-foreground">Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <Navigation />

      <div className="container px-4 py-8 mx-auto max-w-4xl">
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and view your fitness information.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Personal Information */}
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-accent" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your basic account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">First Name</label>
                  <p className="text-lg font-semibold">{userProfile?.firstName || user?.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                  <p className="text-lg font-semibold">{userProfile?.lastName || user?.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {userProfile?.email || user?.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                  <div className="flex items-center gap-2">
                    <Badge variant={userProfile?.isActive ? "default" : "secondary"}>
                      {userProfile?.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fitness Profile */}
          {userProfile?.profile && (
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-accent" />
                  Fitness Profile
                </CardTitle>
                <CardDescription>
                  Your fitness goals and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Age</label>
                    <p className="text-lg font-semibold">{userProfile.profile.age} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gender</label>
                    <p className="text-lg font-semibold capitalize">{userProfile.profile.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Weight</label>
                    <p className="text-lg font-semibold">{userProfile.profile.weight} kg</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Height</label>
                    <p className="text-lg font-semibold">{userProfile.profile.height} cm</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fitness Level</label>
                    <Badge variant="outline" className="capitalize">
                      {userProfile.profile.fitnessLevel}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Workout Days/Week</label>
                    <p className="text-lg font-semibold">{userProfile.profile.workoutDaysPerWeek} days</p>
                  </div>
                </div>
                
                {userProfile.profile.goals && userProfile.profile.goals.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fitness Goals</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {userProfile.profile.goals.map((goal: string, index: number) => (
                        <Badge key={index} variant="secondary" className="capitalize">
                          {goal.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {userProfile.profile.availableEquipment && userProfile.profile.availableEquipment.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Available Equipment</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {userProfile.profile.availableEquipment.map((equipment: string, index: number) => (
                        <Badge key={index} variant="outline" className="capitalize">
                          {equipment.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Account Actions */}
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogOut className="h-5 w-5 text-accent" />
                Account Actions
              </CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => window.location.href = '/onboarding'}
                >
                  <Edit className="h-4 w-4" />
                  Update Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  asChild
                >
                  <Link to="/settings">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
