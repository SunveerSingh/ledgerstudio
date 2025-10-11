import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          artist_name: string;
          primary_genre: string;
          brand_colors: string[];
          explicit_content: boolean;
          avatar_url: string | null;
          subscription_tier: string;
          subscription_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          artist_name?: string;
          primary_genre?: string;
          brand_colors?: string[];
          explicit_content?: boolean;
          avatar_url?: string | null;
          subscription_tier?: string;
          subscription_status?: string;
        };
        Update: {
          email?: string;
          artist_name?: string;
          primary_genre?: string;
          brand_colors?: string[];
          explicit_content?: boolean;
          avatar_url?: string | null;
          subscription_tier?: string;
          subscription_status?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          type: 'cover' | 'visualizer';
          status: 'draft' | 'processing' | 'completed' | 'failed';
          thumbnail_url: string | null;
          settings: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          type: 'cover' | 'visualizer';
          status?: 'draft' | 'processing' | 'completed' | 'failed';
          thumbnail_url?: string | null;
          settings?: Record<string, any>;
        };
        Update: {
          title?: string;
          type?: 'cover' | 'visualizer';
          status?: 'draft' | 'processing' | 'completed' | 'failed';
          thumbnail_url?: string | null;
          settings?: Record<string, any>;
        };
      };
      project_exports: {
        Row: {
          id: string;
          project_id: string;
          format: string;
          resolution: string;
          file_url: string;
          file_size: number;
          created_at: string;
        };
        Insert: {
          project_id: string;
          format: string;
          resolution: string;
          file_url: string;
          file_size?: number;
        };
        Update: {
          format?: string;
          resolution?: string;
          file_url?: string;
          file_size?: number;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string | null;
          plan_id: string;
          status: string;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id?: string | null;
          plan_id?: string;
          status?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
        };
        Update: {
          stripe_subscription_id?: string | null;
          plan_id?: string;
          status?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
        };
      };
      payment_history: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string | null;
          stripe_payment_intent_id: string;
          amount: number;
          currency: string;
          status: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          subscription_id?: string | null;
          stripe_payment_intent_id: string;
          amount: number;
          currency?: string;
          status: string;
        };
        Update: {
          status?: string;
        };
      };
    };
  };
};
