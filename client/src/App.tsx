import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import RoleSelection from "@/components/RoleSelection";
import StudentDashboard from "@/components/StudentDashboard";
import FacultyView from "@/components/FacultyView";
import AdminDashboard from "@/components/AdminDashboard";
import KioskView from "@/components/KioskView";
import NotFound from "@/pages/not-found";

function Router() {
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setCurrentRole(role);
    console.log(`Switched to ${role} role`);
  };

  const handleBackToRoleSelection = () => {
    setCurrentRole(null);
    console.log('Returned to role selection');
  };

  // Main role-based router
  if (currentRole === "student") {
    return <StudentDashboard onBack={handleBackToRoleSelection} />;
  }
  
  if (currentRole === "faculty") {
    return <FacultyView onBack={handleBackToRoleSelection} />;
  }
  
  if (currentRole === "admin") {
    return <AdminDashboard onBack={handleBackToRoleSelection} />;
  }
  
  if (currentRole === "kiosk") {
    return <KioskView onBack={handleBackToRoleSelection} />;
  }

  return (
    <Switch>
      <Route path="/" component={() => <RoleSelection onRoleSelect={handleRoleSelect} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;