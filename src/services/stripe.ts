import { supabase } from '../config/supabase';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    projects: number;
    exports: number;
    aiGenerations: number;
  };
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '3 AI cover generations per month',
      '2 projects max',
      'Basic export options',
      'Community support'
    ],
    limits: {
      projects: 2,
      exports: 10,
      aiGenerations: 3
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 19,
    interval: 'month',
    features: [
      'Unlimited AI generations',
      'Unlimited projects',
      'HD exports',
      'Priority support',
      'Advanced visualizer features'
    ],
    limits: {
      projects: -1,
      exports: -1,
      aiGenerations: -1
    }
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 49,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Custom branding',
      'API access',
      'White-label exports',
      'Dedicated support',
      'Early access to features'
    ],
    limits: {
      projects: -1,
      exports: -1,
      aiGenerations: -1
    }
  }
};

export class StripeService {
  static async createCheckoutSession(
    userId: string,
    planId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          userId,
          planId,
          successUrl,
          cancelUrl
        }
      });

      if (error) throw error;

      return data.sessionUrl;
    } catch (error: any) {
      console.error('Create checkout session error:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  static async createBillingPortalSession(
    userId: string,
    returnUrl: string
  ): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('create-billing-portal', {
        body: {
          userId,
          returnUrl
        }
      });

      if (error) throw error;

      return data.portalUrl;
    } catch (error: any) {
      console.error('Create billing portal error:', error);
      throw new Error('Failed to create billing portal session');
    }
  }

  static async getUserSubscription(userId: string) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Get subscription error:', error);
      return null;
    }
  }

  static async getPaymentHistory(userId: string) {
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error('Get payment history error:', error);
      return [];
    }
  }

  static async cancelSubscription(userId: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: { userId }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Cancel subscription error:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  static async resumeSubscription(userId: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('resume-subscription', {
        body: { userId }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Resume subscription error:', error);
      throw new Error('Failed to resume subscription');
    }
  }

  static getPlanDetails(planId: string): SubscriptionPlan | null {
    return SUBSCRIPTION_PLANS[planId] || null;
  }

  static canPerformAction(
    currentPlan: string,
    action: 'createProject' | 'export' | 'aiGeneration',
    currentUsage: { projects: number; exports: number; aiGenerations: number }
  ): boolean {
    const plan = SUBSCRIPTION_PLANS[currentPlan];
    if (!plan) return false;

    switch (action) {
      case 'createProject':
        return plan.limits.projects === -1 || currentUsage.projects < plan.limits.projects;
      case 'export':
        return plan.limits.exports === -1 || currentUsage.exports < plan.limits.exports;
      case 'aiGeneration':
        return plan.limits.aiGenerations === -1 || currentUsage.aiGenerations < plan.limits.aiGenerations;
      default:
        return false;
    }
  }

  static formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(price / 100);
  }

  static isSubscriptionActive(status: string): boolean {
    return ['active', 'trialing'].includes(status);
  }

  static getSubscriptionStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      active: 'Active',
      trialing: 'Trial',
      past_due: 'Past Due',
      canceled: 'Canceled',
      unpaid: 'Unpaid',
      incomplete: 'Incomplete',
      incomplete_expired: 'Expired'
    };

    return labels[status] || status;
  }
}
