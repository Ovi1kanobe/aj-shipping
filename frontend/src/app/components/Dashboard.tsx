import React from "react";
import { useAuth } from "../hooks/useAuth";
import { UserDashboard } from "./UserDashboard";
import { ResellerDashboard } from "./ResellerDashboard";
import { ManagerDashboard } from "./ManagerDashboard";

export function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return null; // This shouldn't happen since we check for user in App.tsx
  }

  // Get the user's first name for the welcome message
  const userName = user.name?.split(' ')[0] || user.email?.split('@')[0] || 'User';

  // Common logout button that appears on all dashboards
  const LogoutButton = () => (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={logout}
        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 shadow-lg"
      >
        Logout
      </button>
    </div>
  );

  // Render the appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (user.role) {
      case 'manager':
        return <ManagerDashboard userName={userName} />;
      case 'reseller':
        return <ResellerDashboard userName={userName} />;
      default:
        // No role or regular user
        return <UserDashboard userName={userName} />;
    }
  };

  return (
    <>
      <LogoutButton />
      {renderDashboard()}
    </>
  );
}
