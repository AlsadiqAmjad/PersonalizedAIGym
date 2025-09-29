import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'coach' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is required and user doesn't have it, redirect to appropriate dashboard
  if (requiredRole && user?.role !== requiredRole) {
    const dashboardRoutes = {
      user: '/dashboard',
      coach: '/coach-dashboard',
      admin: '/admin-dashboard'
    };
    
    return <Navigate to={dashboardRoutes[user?.role as keyof typeof dashboardRoutes] || '/dashboard'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
