import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import AuthView from "./views/AuthView";
import DashboardView from "./views/DashboardView";
import DotacionView from "./views/DotacionView";
import UserProfile from "./views/UserProfile";
import type { ViewName } from "./types";

function AppRoutes() {
  const { session, logout } = useAuth();
  const [view, setView] = useState<ViewName>("dashboard");

  const handleLogout = () => {
    logout();
    setView("dashboard");
  };

  if (!session) {
    return <AuthView />;
  }

  if (view === "dotacion") {
    return <DotacionView onBack={() => setView("dashboard")} />;
  }

  if (view === "perfil") {
    return <UserProfile onBack={() => setView("dashboard")} onLogout={handleLogout} />;
  }

  return <DashboardView onNavigate={setView} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
