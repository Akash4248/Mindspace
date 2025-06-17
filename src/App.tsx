import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Environments from "./pages/Environments";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/environments"
            element={
              <ProtectedRoute>
                <Environments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Placeholder routes for future implementation */}
          <Route
            path="/environments/:id"
            element={
              <ProtectedRoute>
                <div className="min-h-screen gradient-bg-dark flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-2xl font-bold mb-4">
                      Meditation Session
                    </h1>
                    <p className="text-gray-300 mb-6">
                      This page will contain the immersive 3D meditation
                      experience
                    </p>
                    <button
                      onClick={() => window.history.back()}
                      className="px-6 py-3 bg-gradient-to-r from-mindspace-500 to-violet-500 rounded-lg"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <div className="min-h-screen gradient-bg-dark flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-2xl font-bold mb-4">
                      Analytics Dashboard
                    </h1>
                    <p className="text-gray-300 mb-6">
                      Detailed progress tracking and insights coming soon
                    </p>
                    <button
                      onClick={() => window.history.back()}
                      className="px-6 py-3 bg-gradient-to-r from-mindspace-500 to-violet-500 rounded-lg"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
