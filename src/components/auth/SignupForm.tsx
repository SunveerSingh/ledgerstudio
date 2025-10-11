import React, { useState } from 'react';
import { Mail, Lock, User, Music, Palette, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const GENRES = [
  'Hip-Hop', 'Pop', 'Rock', 'Electronic', 'R&B', 'Country', 'Jazz', 'Classical', 
  'Reggae', 'Blues', 'Folk', 'Punk', 'Metal', 'Indie', 'Alternative', 'Other'
];

const COLOR_PALETTES = [
  { name: 'Ocean Blue', colors: ['#0699FF', '#0577CC', '#045599'] },
  { name: 'Emerald Fresh', colors: ['#00E68A', '#00B36B', '#00804D'] },
  { name: 'Sunset Fire', colors: ['#F59E0B', '#F97316', '#EF4444'] },
  { name: 'Royal Purple', colors: ['#8B5CF6', '#7C3AED', '#6D28D9'] },
  { name: 'Rose Gold', colors: ['#EC4899', '#DB2777', '#BE185D'] },
  { name: 'Deep Space', colors: ['#3B82F6', '#2563EB', '#1D4ED8'] }
];

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    artistName: '',
    primaryGenre: 'Pop',
    brandColors: COLOR_PALETTES[0].colors,
    explicitContent: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await signup(formData.email, formData.password, {
        artist_name: formData.artistName,
        primary_genre: formData.primaryGenre,
        brand_colors: formData.brandColors,
        explicit_content: formData.explicitContent
      });
    } catch (err: any) {
      console.error('Signup failed:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">Create your account</h2>
        <p className="text-neutral-400">Let's start with the basics</p>
      </div>

      <div className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="artist@example.com"
          icon={<Mail className="h-5 w-5" />}
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Create a strong password"
            helperText="Must be at least 8 characters"
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
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">Artist profile</h2>
        <p className="text-neutral-400">Tell us about your music</p>
      </div>

      <div className="space-y-6">
        <Input
          label="Artist or Band Name"
          type="text"
          value={formData.artistName}
          onChange={(e) => setFormData(prev => ({ ...prev, artistName: e.target.value }))}
          placeholder="Your stage name"
          icon={<User className="h-5 w-5" />}
          required
        />

        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-2">
            Primary Genre
          </label>
          <div className="relative">
            <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" />
            <select
              value={formData.primaryGenre}
              onChange={(e) => setFormData(prev => ({ ...prev, primaryGenre: e.target.value }))}
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-surface-elevated border border-neutral-700 focus:border-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            >
              {GENRES.map(genre => (
                <option key={genre} value={genre} className="bg-surface-elevated">
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer group p-4 rounded-lg hover:bg-surface-elevated transition-colors">
            <input
              type="checkbox"
              checked={formData.explicitContent}
              onChange={(e) => setFormData(prev => ({ ...prev, explicitContent: e.target.checked }))}
              className="w-5 h-5 text-blue-500 bg-surface-elevated border-neutral-700 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-neutral-300 group-hover:text-white transition-colors">I create explicit content</span>
          </label>
        </div>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">Brand colors</h2>
        <p className="text-neutral-400">Choose a palette that represents your style</p>
      </div>

      <div className="space-y-3">
        {COLOR_PALETTES.map((palette, index) => (
          <div
            key={palette.name}
            onClick={() => setFormData(prev => ({ ...prev, brandColors: palette.colors }))}
            className={`group p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 hover-lift ${
              JSON.stringify(formData.brandColors) === JSON.stringify(palette.colors)
                ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                : 'border-neutral-700 bg-surface-elevated hover:border-neutral-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors" />
                <span className="text-white font-medium">{palette.name}</span>
              </div>
              <div className="flex gap-2">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg border-2 border-neutral-800 shadow-md transition-transform group-hover:scale-110"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div>
      {/* Progress indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  s <= step
                    ? 'bg-gradient-primary text-white shadow-lg shadow-blue-500/30'
                    : 'bg-neutral-800 text-neutral-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1 mx-3 rounded-full transition-all duration-300 ${
                  s < step ? 'bg-gradient-primary' : 'bg-neutral-800'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {error && (
          <div className="mt-6 bg-red-900/20 border border-red-600 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="mt-8 flex gap-4">
          {step > 1 && (
            <Button
              type="button"
              onClick={() => setStep(step - 1)}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="flex-1"
            isLoading={loading}
          >
            {loading ? 'Creating...' : step === 3 ? 'Create Account' : 'Continue'}
          </Button>
        </div>

        {step === 1 && (
          <>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface-elevated text-neutral-500">Already have an account?</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={onSwitchToLogin}
              variant="ghost"
              size="lg"
              className="w-full"
            >
              Sign in instead
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default SignupForm;