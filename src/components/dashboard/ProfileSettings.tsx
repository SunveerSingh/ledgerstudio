import React, { useState } from 'react';
import { Save, User, Mail, Music, Palette, Shield, CreditCard, Crown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SubscriptionManager from '../subscription/SubscriptionManager';
import SubscriptionPlans from '../subscription/SubscriptionPlans';

const GENRES = [
  'Hip-Hop', 'Pop', 'Rock', 'Electronic', 'R&B', 'Country', 'Jazz', 'Classical', 
  'Reggae', 'Blues', 'Folk', 'Punk', 'Metal', 'Indie', 'Alternative', 'Other'
];

const COLOR_PALETTES = [
  { name: 'Purple Dreams', colors: ['#8B5CF6', '#A855F7', '#C084FC'] },
  { name: 'Ocean Vibes', colors: ['#06B6D4', '#0891B2', '#0E7490'] },
  { name: 'Sunset Fire', colors: ['#F59E0B', '#F97316', '#EF4444'] },
  { name: 'Forest Night', colors: ['#10B981', '#059669', '#047857'] },
  { name: 'Rose Gold', colors: ['#EC4899', '#DB2777', '#BE185D'] },
  { name: 'Midnight Blue', colors: ['#3B82F6', '#2563EB', '#1D4ED8'] }
];

const ProfileSettings: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'billing'>('profile');
  const [formData, setFormData] = useState({
    artist_name: profile?.artist_name || '',
    email: profile?.email || '',
    primary_genre: profile?.primary_genre || 'Pop',
    brand_colors: profile?.brand_colors || COLOR_PALETTES[0].colors,
    explicit_content: profile?.explicit_content || false
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (profile) {
      setFormData({
        artist_name: profile.artist_name,
        email: profile.email,
        primary_genre: profile.primary_genre,
        brand_colors: profile.brand_colors,
        explicit_content: profile.explicit_content
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(formData);
      // Could add a success toast here
    } catch (error) {
      console.error('Profile update failed:', error);
      // Could add an error toast here
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account, subscription, and preferences</p>
        </div>

        <div className="flex gap-6 mb-8 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-2 font-medium transition-colors border-b-2 ${
              activeTab === 'profile'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`pb-4 px-2 font-medium transition-colors border-b-2 ${
              activeTab === 'subscription'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Subscription
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`pb-4 px-2 font-medium transition-colors border-b-2 ${
              activeTab === 'billing'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Billing
          </button>
        </div>

        {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Artist Information */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <User className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Artist Information</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    value={formData.artist_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, artist_name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                    placeholder="Your stage name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                    placeholder="artist@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Genre
                  </label>
                  <select
                    value={formData.primary_genre}
                    onChange={(e) => setFormData(prev => ({ ...prev, primary_genre: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                  >
                    {GENRES.map(genre => (
                      <option key={genre} value={genre} className="bg-white">
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.explicit_content}
                      onChange={(e) => setFormData(prev => ({ ...prev, explicit_content: e.target.checked }))}
                      className="w-4 h-4 text-gray-900 bg-white border-gray-300 rounded focus:ring-gray-300 focus:ring-2"
                    />
                    <span className="text-gray-700">I create explicit content</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Brand Colors */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Brand Colors</h2>
              </div>

              <div className="space-y-4">
                {COLOR_PALETTES.map((palette) => (
                  <div
                    key={palette.name}
                    onClick={() => setFormData(prev => ({ ...prev, brand_colors: palette.colors }))}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      JSON.stringify(formData.brand_colors) === JSON.stringify(palette.colors)
                        ? 'border-gray-900 bg-gray-100'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium">{palette.name}</span>
                      <div className="flex gap-2">
                        {palette.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-gray-900">Pro Plan</h3>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Credits remaining</span>
                  <span className="text-gray-900 font-medium">47</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next billing</span>
                  <span className="text-gray-900 font-medium">Feb 15, 2024</span>
                </div>
              </div>

              <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm shadow-lg shadow-gray-900/10">
                Manage Subscription
              </button>
            </div>

            {/* Usage Stats */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4">This Month</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Cover Generation</span>
                    <span className="text-gray-900 font-medium">23/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Video Exports</span>
                    <span className="text-gray-900 font-medium">8/50</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-cyan-600 h-2 rounded-full" style={{ width: '16%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Security</h3>
              </div>

              <div className="space-y-3">
                <button className="w-full text-left p-3 hover:bg-gray-100 rounded-lg text-gray-900 transition-colors text-sm">
                  Change Password
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-100 rounded-lg text-gray-900 transition-colors text-sm">
                  Two-Factor Authentication
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-100 rounded-lg text-gray-900 transition-colors text-sm">
                  Connected Accounts
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'subscription' && (
          <SubscriptionPlans currentPlan={profile?.subscription_tier} />
        )}

        {activeTab === 'billing' && (
          <SubscriptionManager />
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;