import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { SUBSCRIPTION_PLANS, StripeService } from '../../services/stripe';
import { useAuth } from '../../contexts/AuthContext';

interface SubscriptionPlansProps {
  currentPlan?: string;
  onSuccess?: () => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ currentPlan = 'free', onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (!user || planId === 'free') return;

    setLoading(planId);
    setError(null);

    try {
      const sessionUrl = await StripeService.createCheckoutSession(
        user.id,
        planId,
        `${window.location.origin}/dashboard?subscription=success`,
        `${window.location.origin}/dashboard?subscription=canceled`
      );

      window.location.href = sessionUrl;
    } catch (err: any) {
      console.error('Upgrade error:', err);
      setError(err.message || 'Failed to start checkout');
      setLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Choose Your Plan</h2>
        <p className="text-gray-400 text-lg">Select the perfect plan for your creative needs</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-900/20 border border-red-600 rounded-lg text-red-400 text-center">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {Object.values(SUBSCRIPTION_PLANS).map((plan) => {
          const isCurrentPlan = plan.id === currentPlan;
          const isPro = plan.id === 'pro';

          return (
            <div
              key={plan.id}
              className={`relative rounded-xl p-8 ${
                isPro
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl scale-105'
                  : 'bg-gray-900 border border-gray-800'
              }`}
            >
              {isPro && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400">/{plan.interval}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className={isPro ? 'text-white' : 'text-gray-300'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrentPlan || loading === plan.id || plan.id === 'free'}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  isCurrentPlan
                    ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                    : plan.id === 'free'
                    ? 'bg-gray-800 text-gray-400 cursor-default'
                    : isPro
                    ? 'bg-white text-purple-600 hover:bg-gray-100'
                    : 'bg-white text-black hover:bg-gray-100'
                } disabled:opacity-50`}
              >
                {loading === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : isCurrentPlan ? (
                  'Current Plan'
                ) : plan.id === 'free' ? (
                  'Free Forever'
                ) : (
                  'Upgrade Now'
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center text-gray-400 text-sm">
        <p>All plans include a 14-day money-back guarantee. Cancel anytime.</p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
