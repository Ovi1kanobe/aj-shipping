import PocketBase from "pocketbase";
import { POCKETBASE_URL } from "./pburl";
import { type TypedPocketBase } from "../pocketbase-types";

// PocketBase instance - singleton pattern
// Replace with your actual PocketBase URL

/**
 * Create a new PocketBase instance
 * This is the main instance you'll use throughout your app
 */
export const pb = new PocketBase(POCKETBASE_URL) as TypedPocketBase;

/**
 * Helper: Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

/**
 * Helper: Get current user
 */
export function getCurrentUser() {
  return pb.authStore.record;
}

/**
 * Helper: Login with email and password
 */
export async function login(email: string, password: string) {
  try {
    const authData = await pb.collection("users").authWithPassword(email, password);
    return { success: true, user: authData.record };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error };
  }
}

/**
 * Helper: Logout
 */
export function logout() {
  pb.authStore.clear();
}

/**
 * Helper: Register new user
 */
export async function register(email: string, password: string, passwordConfirm: string, name?: string) {
  try {
    const data = {
      email,
      password,
      passwordConfirm,
      name: name || email.split("@")[0],
    };

    const record = await pb.collection("users").create(data);

    // Auto-login after registration
    await login(email, password);

    return { success: true, user: record };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error };
  }
}

// Export the PocketBase instance as default
export default pb;
