import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { StripeService, SUBSCRIPTION_PLANS } from '../../services/stripe';
import { useAuth } from '../../contexts/AuthContext';

const SubscriptionManager: React.FC = () => {
  const { user, profile } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadSubscriptionData();
  }, [user]);

  const loadSubscriptionData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [subData, payments] = await Promise.all([
        StripeService.getUserSubscription(user.id),
        StripeService.getPaymentHistory(user.id)
      ]);

      setSubscription(subData);
      setPaymentHistory(payments);
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    if (!user) return;

    setActionLoading(true);
    try {
      const portalUrl = await StripeService.createBillingPortalSession(
        user.id,
        window.location.href
      );
      window.location.href = portalUrl;
    } catch (error: any) {
      console.error('Failed to open billing portal:', error);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const currentPlan = SUBSCRIPTION_PLANS[profile?.subscription_tier || 'free'];
  const isActive = StripeService.isSubscriptionActive(subscription?.status || 'canceled');

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Current Plan</h3>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-2xl font-bold text-white">{currentPlan?.name}</h4>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isActive
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {StripeService.getSubscriptionStatusLabel(subscription?.status || 'canceled')}
              </span>
            </div>

            {currentPlan && currentPlan.id !== 'free' && (
              <p className="text-gray-400 text-lg mb-4">
                ${currentPlan.price}/{currentPlan.interval}
              </p>
            )}

            <ul className="space-y-2 mb-4">
              {currentPlan?.features.map((feature, index) => (
                <li key={index} className="text-gray-300 text-sm">
                  • {feature}
                </li>
              ))}
            </ul>

            {subscription && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>
                  {subscription.cancel_at_period_end
                    ? `Cancels on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                    : `Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`}
                </span>
              </div>
            )}
          </div>

          {currentPlan?.id !== 'free' && (
            <button
              onClick={handleManageBilling}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Manage Billing
                  <ExternalLink className="h-3 w-3" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {subscription?.cancel_at_period_end && (
        <div className="bg-amber-900/20 border border-amber-600 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-amber-400 font-medium mb-1">Subscription Canceling</h4>
            <p className="text-amber-200 text-sm">
              Your subscription will end on {new Date(subscription.current_period_end).toLocaleDateString()}.
              You'll still have access until then.
            </p>
          </div>
        </div>
      )}

      {paymentHistory.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Payment History</h3>

          <div className="space-y-3">
            {paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    payment.status === 'succeeded'
                      ? 'bg-green-900/30'
                      : 'bg-red-900/30'
                  }`}>
                    <CreditCard className={`h-4 w-4 ${
                      payment.status === 'succeeded'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`} />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {StripeService.formatPrice(payment.amount, payment.currency)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  payment.status === 'succeeded'
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-red-900/30 text-red-400'
                }`}>
                  {payment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;
