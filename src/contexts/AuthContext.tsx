import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { SupabaseAuthService, UserProfile } from '../services/supabase-auth';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, artistData: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await SupabaseAuthService.getSession();
        if (session?.user) {
          const userProfile = await SupabaseAuthService.getUserProfile(session.user.id);
          setUser(session.user);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = SupabaseAuthService.onAuthStateChange((supabaseUser, session, userProfile) => {
      (async () => {
        setUser(supabaseUser);
        setProfile(userProfile);
      })();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: supabaseUser, profile: userProfile } = await SupabaseAuthService.signIn(email, password);
      setUser(supabaseUser);
      setProfile(userProfile);
    } catch (error: any) {
      throw error;
    }
  };

  const signup = async (email: string, password: string, artistData: Partial<UserProfile>) => {
    try {
      const { user: supabaseUser, profile: userProfile } = await SupabaseAuthService.signUp(email, password, artistData);
      setUser(supabaseUser);
      setProfile(userProfile);
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SupabaseAuthService.signOut();
      setUser(null);
      setProfile(null);
      try {
        sessionStorage.clear();
      } catch (err) {
        console.error('Failed to clear session storage:', err);
      }
    } catch (error: any) {
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (user && profile) {
      try {
        const updatedProfile = await SupabaseAuthService.updateProfile(user.id, data);
        if (updatedProfile) {
          setProfile(updatedProfile);
        }
      } catch (error: any) {
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      login,
      signup,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};