import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { CreateIntake } from "@/pages/CreateIntake";
import { Records } from "@/pages/Records";
import { ReviewConsole } from "@/pages/ReviewConsole";
import { AdminConfig } from "@/pages/AdminConfig";
import { ViewDraft } from "@/pages/ViewDraft";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Login />;
  }
  
  return <AppLayout>{children}</AppLayout>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/intake/new" element={
                <ProtectedRoute>
                  <CreateIntake />
                </ProtectedRoute>
              } />
              <Route path="/intake/:id" element={
                <ProtectedRoute>
                  <CreateIntake />
                </ProtectedRoute>
              } />
              <Route path="/draft/:id" element={
                <ProtectedRoute>
                  <ViewDraft />
                </ProtectedRoute>
              } />
              <Route path="/records" element={
                <ProtectedRoute>
                  <Records />
                </ProtectedRoute>
              } />
              <Route path="/records/all" element={
                <ProtectedRoute>
                  <Records />
                </ProtectedRoute>
              } />
              <Route path="/review" element={
                <ProtectedRoute>
                  <ReviewConsole />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminConfig />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
