import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth.tsx';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAuth();
  
  const storedToken = localStorage.getItem('token');
  const isAuthenticated = token || storedToken;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

