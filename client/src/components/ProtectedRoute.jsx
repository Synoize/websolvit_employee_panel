import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/context/AppContext';

/**
 * ProtectedRoute component that requires authentication
 * Optionally requires a specific role
 */
export function ProtectedRoute({ children, requiredRole }) {
  const { currentUser } = useAppStore();
  // Don't redirect during app initialization - auth state may not be loaded yet
  // Just render children and let parent component handle loading state

  // Check if user is authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

/**
 * Hook to check if user has specific role
 */
export function useHasRole(role) {
  const { currentUser } = useAppStore();
  return currentUser?.role === role;
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin() {
  return useHasRole('admin');
}

/**
 * Hook to check if user is employee
 */
export function useIsEmployee() {
  return useHasRole('employee');
}

/**
 * Hook to get current user
 */
export function useCurrentUser() {
  const { currentUser } = useAppStore();
  return currentUser;
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  const { currentUser } = useAppStore();
  return !!currentUser;
}
