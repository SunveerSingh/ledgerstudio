import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">Welcome back</h2>
        <p className="text-neutral-400">Sign in to your Ledger Studio account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="artist@example.com"
          icon={<Mail className="h-5 w-5" />}
          required
        />

        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Enter your password"
            icon={<Lock className="h-5 w-5" />}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[42px] text-neutral-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-neutral-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-surface-elevated"
            />
            <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors">Remember me</span>
          </label>
          <button
            type="button"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-600 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-surface-elevated text-neutral-500">New to Ledger Studio?</span>
          </div>
        </div>

        <Button
          type="button"
          onClick={onSwitchToSignup}
          variant="outline"
          size="lg"
          className="w-full"
        >
          Create an account
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;