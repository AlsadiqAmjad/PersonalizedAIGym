import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import Navigation from "@/components/Navigation";
import { 
  Search, 
  Users, 
  Activity, 
  TrendingUp, 
  Shield,
  UserCheck,
  UserX,
  Eye,
  MoreVertical
} from "lucide-react";

// Mock data for admin dashboard
const mockStats = {
  totalUsers: 12547,
  activeUsers: 8932,
  totalWorkouts: 45231,
  averageRating: 4.7,
  newUsersToday: 127,
  workoutsToday: 892,
};

const mockUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    status: "active",
    plan: "Premium",
    joinDate: "2024-01-15",
    lastActive: "2024-01-20",
    workouts: 45,
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@example.com",
    status: "active",
    plan: "Free",
    joinDate: "2024-01-10",
    lastActive: "2024-01-19",
    workouts: 23,
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    email: "emma@example.com",
    status: "inactive",
    plan: "Premium",
    joinDate: "2024-01-05",
    lastActive: "2024-01-18",
    workouts: 67,
  },
  {
    id: 4,
    name: "Alex Thompson",
    email: "alex@example.com",
    status: "suspended",
    plan: "Free",
    joinDate: "2024-01-12",
    lastActive: "2024-01-17",
    workouts: 12,
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa@example.com",
    status: "active",
    plan: "Premium",
    joinDate: "2024-01-08",
    lastActive: "2024-01-20",
    workouts: 89,
  },
];

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    return plan === "Premium" 
      ? <Badge className="bg-accent text-accent-foreground">Premium</Badge>
      : <Badge variant="outline">Free</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container px-4 py-8 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-accent" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Manage users, monitor system performance, and view analytics
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                  <div className="text-xs text-success mt-1">+{mockStats.newUsersToday} today</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-card">
                <CardContent className="p-6 text-center">
                  <UserCheck className="h-8 w-8 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold">{mockStats.activeUsers.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.round((mockStats.activeUsers / mockStats.totalUsers) * 100)}% of total
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-card">
                <CardContent className="p-6 text-center">
                  <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{mockStats.totalWorkouts.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Workouts</div>
                  <div className="text-xs text-success mt-1">+{mockStats.workoutsToday} today</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-card">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-warning mx-auto mb-2" />
                  <div className="text-2xl font-bold">{mockStats.averageRating}</div>
                  <div className="text-sm text-muted-foreground">Avg Rating</div>
                  <div className="text-xs text-success mt-1">+0.2 this month</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
                <CardDescription>Latest user activities and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { user: "Sarah Johnson", action: "Completed workout", time: "2 minutes ago", type: "workout" },
                    { user: "New User", action: "Account created", time: "5 minutes ago", type: "signup" },
                    { user: "Mike Chen", action: "Updated profile", time: "12 minutes ago", type: "profile" },
                    { user: "Emma Rodriguez", action: "Started premium trial", time: "1 hour ago", type: "upgrade" },
                    { user: "System", action: "Daily backup completed", time: "2 hours ago", type: "system" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === "workout" ? "bg-success" :
                          activity.type === "signup" ? "bg-accent" :
                          activity.type === "profile" ? "bg-warning" :
                          activity.type === "upgrade" ? "bg-primary" :
                          "bg-muted-foreground"
                        }`} />
                        <div>
                          <p className="font-medium">{activity.user}</p>
                          <p className="text-sm text-muted-foreground">{activity.action}</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Search and Actions */}
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Export Users</Button>
                <Button className="bg-gradient-hero text-white hover:opacity-90">
                  Add User
                </Button>
              </div>
            </div>

            {/* Users Table */}
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts, view activity, and control access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Workouts</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>{getPlanBadge(user.plan)}</TableCell>
                        <TableCell>{user.workouts}</TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Switch 
                              checked={user.status === "active"} 
                              className="data-[state=checked]:bg-success"
                            />
                            <Button size="sm" variant="ghost">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New user registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    📈 Chart visualization would go here
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Workout Completion</CardTitle>
                  <CardDescription>Daily workout completion rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    📊 Chart visualization would go here
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Popular Workouts</CardTitle>
                  <CardDescription>Most completed workout types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "HIIT Cardio", completions: 1250, percentage: 85 },
                      { name: "Upper Body Strength", completions: 980, percentage: 72 },
                      { name: "Core Workout", completions: 756, percentage: 58 },
                      { name: "Yoga Flow", completions: 623, percentage: 45 },
                      { name: "Lower Body Power", completions: 445, percentage: 32 },
                    ].map((workout, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{workout.name}</span>
                          <span className="text-muted-foreground">{workout.completions}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-gradient-hero h-2 rounded-full" 
                            style={{ width: `${workout.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                  <CardDescription>Average session duration and frequency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent">24.5</div>
                      <div className="text-sm text-muted-foreground">Avg Session (min)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-success">3.2</div>
                      <div className="text-sm text-muted-foreground">Sessions/Week</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-warning">78%</div>
                      <div className="text-sm text-muted-foreground">Completion Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">92%</div>
                      <div className="text-sm text-muted-foreground">User Satisfaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;