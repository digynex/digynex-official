/* 
 * AUTH SERVICE (Modular V1.0 - Commercial SaaS Architecture)
 * Responsible for interfacing with Supabase Auth Engine.
 * Ensures clean separation of credentials and session logic from UI components.
 */
import { supabase } from '../lib/supabase';

export const authService = {
  /**
   * Retrieves the current authenticated user.
   */
  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  /**
   * Terminates the current user session.
   */
  async signOut() {
    return await supabase.auth.signOut();
  },

  /**
   * Retrieves the current active session.
   */
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  /**
   * Registers a new user identity.
   */
  async signUp(email, password, fullName) {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: fullName,
          display_name: fullName 
        }
      }
    });
  },

  /**
   * Authenticates a user with password.
   */
  async signInWithPassword(email, password) {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  },

  /**
   * Initiates social SSO flow.
   */
  async signInWithOAuth(provider) {
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin
      }
    });
  }
};
