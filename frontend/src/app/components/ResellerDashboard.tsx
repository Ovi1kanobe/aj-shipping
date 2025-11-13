import React from "react";

interface ResellerDashboardProps {
  userName: string;
}

export function ResellerDashboard({ userName }: ResellerDashboardProps) {
  return (
    <div className="section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="mb-8">
              <h1 className="mb-2 text-h2">Welcome, {userName}!</h1>
              <p className="text-dark dark:text-darkmode-dark mb-4">Role: Reseller</p>
              <p className="text-dark/70 dark:text-darkmode-dark/70">
                Your reseller dashboard will be available soon. Stay tuned for updates!
              </p>
            </div>

            <div className="rounded-lg bg-theme-light p-8 shadow-lg dark:bg-darkmode-theme-light border border-border dark:border-darkmode-border text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-h4 mb-2">Coming Soon</h3>
              <p className="text-dark/70 dark:text-darkmode-dark/70">
                We're working on exciting features for resellers. Check back soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}