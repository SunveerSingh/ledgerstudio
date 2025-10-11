import React, { useState } from 'react';
import { Check, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { SUBSCRIPTION_PLANS } from '../../../services/stripe';

const SignupStep: React.FC = () => {
  const { signup } = useAuth();
  const { onboardingData, closeOnboarding } = useOnboarding();
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'premium'>('free');
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlanSelect = (planId: 'free' | 'pro' | 'premium') => {
    setSelectedPlan(planId);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signup(email, password, {
        artist_name: onboardingData.artistName,
        primary_genre: onboardingData.genre,
        brand_colors: ['#8B5CF6', '#06B6D4', '#F59E0B'],
        explicit_content: onboardingData.isExplicit
      });

      closeOnboarding();
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Choose your plan
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Select the perfect plan to get started
        </p>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {Object.values(SUBSCRIPTION_PLANS).map((plan) => {
            const isPro = plan.id === 'pro';
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => handlePlanSelect(plan.id as 'free' | 'pro' | 'premium')}
                className={`relative rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                  isPro
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-600 shadow-xl scale-105 border-2 border-blue-400'
                    : isSelected
                    ? 'bg-white border-2 border-blue-600 scale-105 shadow-md'
                    : 'bg-white border-2 border-gray-300 hover:border-gray-400 hover:scale-105 hover:shadow-md'
                }`}
              >
                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                {isSelected && !isPro && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}

                <div className="text-center mb-5">
                  <h3 className="text-xl font-bold mb-2" style={{ color: isPro ? 'white' : '#111827' }}>{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold" style={{ color: isPro ? 'white' : '#111827' }}>${plan.price}</span>
                    <span className={isPro ? 'text-blue-100' : 'text-gray-500'}>/{plan.interval}</span>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isPro ? 'text-blue-200' : 'text-green-400'}`} />
                      <span className="text-sm" style={{ color: isPro ? 'white' : '#4B5563' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className={`text-center py-2.5 rounded-lg font-semibold text-sm ${
                  isPro
                    ? 'bg-white text-blue-600'
                    : 'bg-gray-900 text-white'
                }`}>
                  {isSelected ? 'Selected' : 'Select Plan'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center max-w-md mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        Create your account
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        {selectedPlan === 'free' ? 'Start creating for free' : `Get started with ${SUBSCRIPTION_PLANS[selectedPlan].name}`}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all shadow-sm focus:shadow-md"
            />
          </div>
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength={6}
              className="w-full pl-11 pr-12 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all shadow-sm focus:shadow-md"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">At least 6 characters</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-600 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white disabled:text-gray-500 rounded-full font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            `Create Account & Download`
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          Change plan
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-800">
        <p className="text-gray-400 text-sm">
          Already have an account?{' '}
          <button className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupStep;
