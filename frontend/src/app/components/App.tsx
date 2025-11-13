import React from "react";
import { useAuth } from "../hooks/useAuth";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { Dashboard } from "./Dashboard";

type AppView = "login" | "register" | "dashboard";

export function App() {
  const { user, fetched } = useAuth();
  const [currentView, setCurrentView] = React.useState<AppView>("login");

  // Auto-switch to dashboard if user is logged in
  React.useEffect(() => {
    if (user) {
      setCurrentView("dashboard");
    } else if (fetched) {
      setCurrentView("login");
    }
  }, [user, fetched]);

  if (!fetched) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark dark:text-darkmode-dark">Loading...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if user is authenticated
  if (user) {
    return <Dashboard />;
  }

  // Handle view switching for unauthenticated users
  const handleSwitchToRegister = () => setCurrentView("register");
  const handleSwitchToLogin = () => setCurrentView("login");

  switch (currentView) {
    case "register":
      return <RegisterForm onSwitchToLogin={handleSwitchToLogin} />;
    case "login":
    default:
      return <LoginForm onSwitchToRegister={handleSwitchToRegister} />;
  }
}