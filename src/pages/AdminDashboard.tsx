import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  UserCheck, 
  UserX,
  Plus,
  Eye,
  Edit
} from 'lucide-react';
import { adminAPI } from '@/services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'coach' | 'admin';
  isActive: boolean;
  createdAt: string;
  coachProfile?: {
    specialization: string[];
    experience: number;
    bio: string;
    clients: any[];
  };
}

interface DashboardStats {
  totalUsers: number;
  totalCoaches: number;
  totalAdmins: number;
  activeUsers: number;
  activeCoaches: number;
  recentUsers: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateCoach, setShowCreateCoach] = useState(false);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [showAssignCoach, setShowAssignCoach] = useState(false);
  
  const { user, token } = useAuth();
  const { toast } = useToast();

  // Form states
  const [coachForm, setCoachForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    specialization: [] as string[],
    experience: 0,
    bio: ''
  });

  const [adminForm, setAdminForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const [assignForm, setAssignForm] = useState({
    clientId: '',
    coachId: ''
  });

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token, currentPage, searchTerm, roleFilter]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load stats
      const statsResponse = await adminAPI.getDashboardStats(token!);
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Load users
      const usersResponse = await adminAPI.getAllUsers(token!, {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        role: roleFilter === 'all' ? undefined : roleFilter
      });
      
      if (usersResponse.success) {
        // Map _id to id for frontend compatibility
        const mappedUsers = (usersResponse.data as any).users.map((user: any) => ({
          ...user,
          id: user._id
        }));
        setUsers(mappedUsers);
        setTotalPages((usersResponse.data as any).pagination.pages);
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

  const handleCreateCoach = async () => {
    try {
      const response = await adminAPI.createCoach(token!, coachForm);
      if (response.success) {
        toast({
          title: "Success",
          description: "Coach created successfully",
        });
        setShowCreateCoach(false);
        setCoachForm({ email: '', password: '', firstName: '', lastName: '', specialization: [], experience: 0, bio: '' });
        loadDashboardData();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create coach",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create coach",
        variant: "destructive",
      });
    }
  };

  const handleCreateAdmin = async () => {
    try {
      const response = await adminAPI.createAdmin(token!, adminForm);
      if (response.success) {
        toast({
          title: "Success",
          description: "Admin created successfully",
        });
        setShowCreateAdmin(false);
        setAdminForm({ email: '', password: '', firstName: '', lastName: '' });
        loadDashboardData();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create admin",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create admin",
        variant: "destructive",
      });
    }
  };

  const handleAssignCoach = async () => {
    try {
      const response = await adminAPI.assignCoachToClient(token!, assignForm);
      if (response.success) {
        toast({
          title: "Success",
          description: "Coach assigned to client successfully",
        });
        setShowAssignCoach(false);
        setAssignForm({ clientId: '', coachId: '' });
        loadDashboardData();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to assign coach",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign coach",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await adminAPI.deleteUser(token!, userId);
        if (response.success) {
          toast({
            title: "Success",
            description: "User deleted successfully",
          });
          loadDashboardData();
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to delete user",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await adminAPI.updateUserStatus(token!, userId, isActive);
      if (response.success) {
        toast({
          title: "Success",
          description: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        });
        loadDashboardData();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update user status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'coach': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const coaches = users.filter(user => user.role === 'coach');
  const regularUsers = users.filter(user => user.role === 'user');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, coaches, and system settings</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeUsers} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Coaches</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCoaches}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeCoaches} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAdmins}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Dialog open={showCreateCoach} onOpenChange={setShowCreateCoach}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Coach
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Coach</DialogTitle>
                <DialogDescription>
                  Add a new coach to the system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={coachForm.firstName}
                      onChange={(e) => setCoachForm({...coachForm, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={coachForm.lastName}
                      onChange={(e) => setCoachForm({...coachForm, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={coachForm.email}
                    onChange={(e) => setCoachForm({...coachForm, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={coachForm.password}
                    onChange={(e) => setCoachForm({...coachForm, password: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={coachForm.experience}
                    onChange={(e) => setCoachForm({...coachForm, experience: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={coachForm.bio}
                    onChange={(e) => setCoachForm({...coachForm, bio: e.target.value})}
                  />
                </div>
                <Button onClick={handleCreateCoach} className="w-full">
                  Create Coach
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateAdmin} onOpenChange={setShowCreateAdmin}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Create Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Admin</DialogTitle>
                <DialogDescription>
                  Add a new admin to the system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adminFirstName">First Name</Label>
                    <Input
                      id="adminFirstName"
                      value={adminForm.firstName}
                      onChange={(e) => setAdminForm({...adminForm, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="adminLastName">Last Name</Label>
                    <Input
                      id="adminLastName"
                      value={adminForm.lastName}
                      onChange={(e) => setAdminForm({...adminForm, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="adminEmail">Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="adminPassword">Password</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                  />
                </div>
                <Button onClick={handleCreateAdmin} className="w-full">
                  Create Admin
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showAssignCoach} onOpenChange={setShowAssignCoach}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Assign Coach
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Coach to Client</DialogTitle>
                <DialogDescription>
                  Assign a coach to manage a specific client
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientId">Client Email</Label>
                  <Input
                    id="clientId"
                    placeholder="client@example.com"
                    value={assignForm.clientId}
                    onChange={(e) => setAssignForm({...assignForm, clientId: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="coachId">Coach Email</Label>
                  <Input
                    id="coachId"
                    placeholder="coach@example.com"
                    value={assignForm.coachId}
                    onChange={(e) => setAssignForm({...assignForm, coachId: e.target.value})}
                  />
                </div>
                <Button onClick={handleAssignCoach} className="w-full">
                  Assign Coach
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all users, coaches, and admins</CardDescription>
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">Users</SelectItem>
                    <SelectItem value="coach">Coaches</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.id, !user.isActive)}
                        >
                          {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
