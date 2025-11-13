import React from "react";
import { useAuth } from "../hooks/useAuth";
import { OAuthButton } from "./auth/OAuthButton";
import type { AuthMethodsList } from "pocketbase";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { loginWithPassword, loginWithOAuth, fetchAuthMethods } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [authMethods, setAuthMethods] = React.useState<AuthMethodsList | null>(null);

  // Fetch auth methods on component mount
  React.useEffect(() => {
    fetchAuthMethods(
      (error) => {
        console.error("Failed to fetch auth methods:", error);
      },
      (methods) => {
        setAuthMethods(methods);
      }
    );
  }, [fetchAuthMethods]);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    loginWithPassword(
      email,
      password,
      (error: any) => {
        setError(error.response?.message || error.message || "Login failed");
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
  };

  const handleOAuthLogin = (provider: string) => {
    setLoading(true);
    setError("");

    loginWithOAuth(
      provider,
      (error: any) => {
        setError(error.response?.message || error.message || "OAuth login failed");
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

          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
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
              {loading ? "Logging in..." : "Login with Email"}
            </button>
          </form>

          {/* OAuth Providers - only show if available */}
          {authMethods?.oauth2?.providers && authMethods.oauth2.providers.length > 0 && (
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border dark:border-darkmode-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-theme-light dark:bg-darkmode-theme-light px-2 text-dark dark:text-darkmode-dark">
                    Or continue with
                  </span>
                </div>
              </div>

              {authMethods.oauth2.providers.map((provider) => (
                <OAuthButton
                  key={provider.name}
                  provider={provider.name}
                  onClick={() => handleOAuthLogin(provider.name)}
                  disabled={loading}
                />
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-dark dark:text-darkmode-dark">
              Don't have an account?{" "}
              <button
                onClick={() => onSwitchToRegister?.()}
                className="text-primary hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}