import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = React.forwardRef<HTMLDivElement, ProtectedRouteProps>(
  ({ children }, ref) => {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/admin/login" replace />;
    }

    // Use a wrapper that can accept a ref without affecting layout.
    return (
      <div ref={ref} className="contents">
        {children}
      </div>
    );
  }
);
ProtectedRoute.displayName = 'ProtectedRoute';

