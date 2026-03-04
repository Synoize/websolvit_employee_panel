import { Toaster as ToastSonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AppProvider, useAppStore } from "@/context/AppContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEmployees from "./pages/admin/AdminEmployees";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminExpenses from "./pages/admin/AdminExpenses";
import AdminLeaves from "./pages/admin/AdminLeaves";
import AdminEmployeeProfile from "./pages/admin/AdminEmployeeProfile";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeAttendance from "./pages/employee/EmployeeAttendance";
import EmployeeExpenses from "./pages/employee/EmployeeExpenses";
import EmployeeLeaves from "./pages/employee/EmployeeLeaves";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { initializeAuth, setInitializing, logout } = useAppStore();

  // Initialize auth on app mount
  useEffect(() => {
    const init = async () => {
      try {
        setInitializing(true);
        await initializeAuth();
      } catch (error) {
        console.error("Auth initialization error:", error);
        logout();
      } finally {
        setInitializing(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employees"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminEmployees />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/expenses"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminExpenses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/leaves"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLeaves />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employees/:employeeId"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminEmployeeProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee"
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/attendance"
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/expenses"
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeExpenses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/leaves"
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeLeaves />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeProfile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ToastSonner />
      <BrowserRouter>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
