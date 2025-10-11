import { supabase } from '../config/supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  artist_name: string;
  primary_genre: string;
  brand_colors: string[];
  explicit_content: boolean;
  avatar_url?: string;
  subscription_tier: string;
  subscription_status: string;
  created_at: string;
  updated_at: string;
}

export class SupabaseAuthService {
  static async signUp(email: string, password: string, artistData: Partial<UserProfile>) {
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            artist_name: artistData.artist_name || 'New Artist'
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('User creation failed');

      const userProfile: Omit<UserProfile, 'created_at' | 'updated_at'> = {
        id: authData.user.id,
        email: authData.user.email!,
        artist_name: artistData.artist_name || 'New Artist',
        primary_genre: artistData.primary_genre || 'Pop',
        brand_colors: artistData.brand_colors || ['#8B5CF6', '#06B6D4', '#F59E0B'],
        explicit_content: artistData.explicit_content || false,
        avatar_url: artistData.avatar_url,
        subscription_tier: 'free',
        subscription_status: 'active'
      };

      const { error: profileError } = await supabase
        .from('users')
        .insert(userProfile);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Failed to create user profile');
      }

      const profile = await this.getUserProfile(authData.user.id);

      return { user: authData.user, session: authData.session, profile };
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data.user) throw new Error('Login failed');

      const profile = await this.getUserProfile(data.user.id);

      return { user: data.user, session: data.session, profile };
    } catch (error: any) {
      console.error('Signin error:', error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Signout error:', error);
      throw new Error('Failed to sign out');
    }
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      const profile = await this.getUserProfile(userId);
      return profile;
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile');
    }
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  static async getSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  static async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Update password error:', error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  static onAuthStateChange(
    callback: (user: User | null, session: Session | null, profile: UserProfile | null) => void
  ) {
    return supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        const user = session?.user || null;
        const profile = user ? await this.getUserProfile(user.id) : null;
        callback(user, session, profile);
      })();
    });
  }

  private static getErrorMessage(error: any): string {
    if (error instanceof AuthError) {
      switch (error.message) {
        case 'Invalid login credentials':
          return 'Invalid email or password';
        case 'User already registered':
          return 'An account with this email already exists';
        case 'Email not confirmed':
          return 'Please verify your email address';
        default:
          return error.message;
      }
    }

    if (error.message) return error.message;
    return 'An error occurred. Please try again';
  }
}
