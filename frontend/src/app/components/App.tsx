import React from "react";
import { useAuth } from "../hooks/useAuth";

export function App() {
  const { user, fetched, loginWithPassword, logout } = useAuth();

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

  if (!user) {
    return <LoginForm />;
  }

  return <Dashboard />;
}

function LoginForm() {
  const { loginWithPassword } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    loginWithPassword(
      email,
      password,
      (error: any) => {
        setError(error.response.message);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
  };

  return (
    <div className="section flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-theme-light p-8 shadow-lg dark:bg-darkmode-theme-light">
          <h1 className="mb-6 text-center text-h2">Login to Crev Shipping</h1>
          
          {error && (
            <div className="mb-4 rounded bg-red-100 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-darkmode-dark mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-body px-4 py-3 text-dark placeholder:text-dark/60 focus:border-primary focus:ring-0 dark:border-darkmode-border dark:bg-darkmode-body dark:text-darkmode-dark"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark dark:text-darkmode-dark mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-body px-4 py-3 text-dark placeholder:text-dark/60 focus:border-primary focus:ring-0 dark:border-darkmode-border dark:bg-darkmode-body dark:text-darkmode-dark"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-primary px-6 py-3 text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="mb-4 text-h2">Welcome, {user?.firstName || user?.email}</h1>
                <p className="text-dark dark:text-darkmode-dark">
                  Manage your shipping requests and track packages.
                </p>
              </div>
              <button
                onClick={logout}
                className="rounded bg-red-600 px-4 py-3 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>

            <div className="rounded-lg bg-theme-light p-6 shadow-lg dark:bg-darkmode-theme-light">
              <h3 className="mb-4 text-h5">Your Dashboard</h3>
              <p className="text-dark dark:text-darkmode-dark">
                Dashboard functionality will be implemented here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}