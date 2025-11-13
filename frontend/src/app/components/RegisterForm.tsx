import React from "react";
import { useAuth } from "../hooks/useAuth";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register } = useAuth();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
  });
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate passwords match
    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    register(
      formData.email,
      formData.password,
      formData.passwordConfirm,
      (error: any) => {
        setError(error.response?.message || error.message || "Registration failed");
        setLoading(false);
      },
      () => {
        setSuccess("Registration successful! Please check your email to verify your account before logging in.");
        setLoading(false);
        // Reset form
        setFormData({
          email: "",
          password: "",
          passwordConfirm: "",
          name: "",
        });
      },
      undefined, // oneTimeCode
      formData.name // firstName parameter
    );
  };

  return (
    <div className="section flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-theme-light p-8 shadow-lg dark:bg-darkmode-theme-light">
          <h1 className="mb-6 text-center text-h2">Create Your Account</h1>
          
          {error && (
            <div className="mb-4 rounded bg-red-100 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded bg-green-100 px-4 py-3 text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-darkmode-dark mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-border bg-body px-4 py-3 text-dark placeholder:text-dark/60 focus:border-primary focus:ring-0 dark:border-darkmode-border dark:bg-darkmode-body dark:text-darkmode-dark"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-darkmode-dark mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-border bg-body px-4 py-3 text-dark placeholder:text-dark/60 focus:border-primary focus:ring-0 dark:border-darkmode-border dark:bg-darkmode-body dark:text-darkmode-dark"
                placeholder="Enter your email address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark dark:text-darkmode-dark mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={8}
                className="w-full rounded-lg border border-border bg-body px-4 py-3 text-dark placeholder:text-dark/60 focus:border-primary focus:ring-0 dark:border-darkmode-border dark:bg-darkmode-body dark:text-darkmode-dark"
                placeholder="Enter a strong password"
              />
              <p className="mt-1 text-xs text-dark/60 dark:text-darkmode-dark/60">
                Must be at least 8 characters long
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-darkmode-dark mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-border bg-body px-4 py-3 text-dark placeholder:text-dark/60 focus:border-primary focus:ring-0 dark:border-darkmode-border dark:bg-darkmode-body dark:text-darkmode-dark"
                placeholder="Confirm your password"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded bg-primary px-6 py-3 text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-dark dark:text-darkmode-dark">
              Already have an account?{" "}
              <button
                onClick={() => onSwitchToLogin?.()}
                className="text-primary hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-border dark:border-darkmode-border">
            <p className="text-xs text-dark/60 dark:text-darkmode-dark/60 text-center">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}