import React from "react";
import { useAuth } from "../hooks/useAuth";

export function Dashboard() {
  const { user, logout } = useAuth();

  const quickActions = [
    {
      title: "Create Shipment",
      description: "Schedule a new package pickup",
      icon: "📦",
      action: () => console.log("Create shipment"),
    },
    {
      title: "Track Package",
      description: "Track your existing shipments",
      icon: "📍",
      action: () => console.log("Track package"),
    },
    {
      title: "Get Quote",
      description: "Get instant shipping rates",
      icon: "💰",
      action: () => console.log("Get quote"),
    },
    {
      title: "Shipping History",
      description: "View your past shipments",
      icon: "📋",
      action: () => console.log("View history"),
    },
  ];

  const recentShipments = [
    {
      id: "SHP001",
      destination: "New York, NY",
      status: "In Transit",
      date: "2025-11-10",
    },
    {
      id: "SHP002", 
      destination: "Los Angeles, CA",
      status: "Delivered",
      date: "2025-11-08",
    },
    {
      id: "SHP003",
      destination: "Chicago, IL", 
      status: "Processing",
      date: "2025-11-12",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "In Transit":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20";
      case "Processing":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="mb-2 text-h2">Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}!</h1>
                <p className="text-dark dark:text-darkmode-dark">
                  Manage your shipping requests and track packages.
                </p>
              </div>
              <button
                onClick={logout}
                className="rounded bg-red-600 px-4 py-3 text-white hover:bg-red-700 self-start"
              >
                Logout
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="mb-8">
              <h2 className="mb-4 text-h4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <div
                    key={index}
                    onClick={action.action}
                    className="rounded-lg bg-theme-light p-6 shadow-lg dark:bg-darkmode-theme-light hover:shadow-xl transition-shadow cursor-pointer border border-border dark:border-darkmode-border hover:border-primary dark:hover:border-primary"
                  >
                    <div className="text-3xl mb-3">{action.icon}</div>
                    <h3 className="mb-2 text-h6 text-dark dark:text-darkmode-dark">{action.title}</h3>
                    <p className="text-sm text-dark/70 dark:text-darkmode-dark/70">
                      {action.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Shipments */}
            <div className="mb-8">
              <h2 className="mb-4 text-h4">Recent Shipments</h2>
              <div className="rounded-lg bg-theme-light shadow-lg dark:bg-darkmode-theme-light border border-border dark:border-darkmode-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-border/10 dark:bg-darkmode-border/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-dark dark:text-darkmode-dark">
                          Shipment ID
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-dark dark:text-darkmode-dark">
                          Destination
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-dark dark:text-darkmode-dark">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-dark dark:text-darkmode-dark">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-dark dark:text-darkmode-dark">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border dark:divide-darkmode-border">
                      {recentShipments.map((shipment, index) => (
                        <tr key={index} className="hover:bg-border/5 dark:hover:bg-darkmode-border/5">
                          <td className="px-6 py-4 text-sm font-medium text-dark dark:text-darkmode-dark">
                            {shipment.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-dark dark:text-darkmode-dark">
                            {shipment.destination}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                              {shipment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-dark dark:text-darkmode-dark">
                            {shipment.date}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button className="text-primary hover:text-primary/80 font-medium">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-lg bg-theme-light p-6 shadow-lg dark:bg-darkmode-theme-light border border-border dark:border-darkmode-border">
                <h3 className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70 mb-2">
                  Total Shipments
                </h3>
                <div className="text-2xl font-bold text-dark dark:text-darkmode-dark">247</div>
              </div>
              
              <div className="rounded-lg bg-theme-light p-6 shadow-lg dark:bg-darkmode-theme-light border border-border dark:border-darkmode-border">
                <h3 className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70 mb-2">
                  In Transit
                </h3>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
              </div>
              
              <div className="rounded-lg bg-theme-light p-6 shadow-lg dark:bg-darkmode-theme-light border border-border dark:border-darkmode-border">
                <h3 className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70 mb-2">
                  Delivered This Month
                </h3>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">34</div>
              </div>
              
              <div className="rounded-lg bg-theme-light p-6 shadow-lg dark:bg-darkmode-theme-light border border-border dark:border-darkmode-border">
                <h3 className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70 mb-2">
                  Total Savings
                </h3>
                <div className="text-2xl font-bold text-primary">$1,247</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
