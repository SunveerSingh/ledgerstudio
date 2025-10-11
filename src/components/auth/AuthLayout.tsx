import React, { useState } from 'react';
import { Palette, Zap, Shield, Sparkles } from 'lucide-react';
import Logo from '../common/Logo';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthLayout: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 opacity-20 rounded-full blur-3xl" style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}></div>
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 opacity-20 rounded-full blur-3xl" style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 relative">
        <div className="relative z-10 flex flex-col justify-center px-16" style={{ color: '#f5f5f5' }}>
          <div className="mb-12 animate-in">
            <Logo size="lg" className="mb-8" />
            <h2 className="text-5xl font-bold mb-6 leading-tight text-gradient">
              Create Stunning
              <br />
              Visual Content
            </h2>
            <p className="text-xl mb-8 leading-relaxed max-w-xl" style={{ color: '#a1a1aa' }}>
              Professional AI-powered tools for music artists to generate album artwork and audio visualizers.
            </p>
          </div>

          <div className="space-y-6 animate-in">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-primary rounded-xl">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1" style={{ color: '#f5f5f5' }}>AI Cover Art</h3>
                <p className="text-sm" style={{ color: '#a1a1aa' }}>Generate professional album artwork instantly</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-primary rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1" style={{ color: '#f5f5f5' }}>Audio Visualizers</h3>
                <p className="text-sm" style={{ color: '#a1a1aa' }}>Create synced visuals for your music</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-primary rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1" style={{ color: '#f5f5f5' }}>Production Quality</h3>
                <p className="text-sm" style={{ color: '#a1a1aa' }}>4K exports ready for all platforms</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 lg:max-w-xl flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md animate-in">
          <div className="glass rounded-xl p-10 shadow-2xl">
            <div className="lg:hidden mb-8 flex justify-center">
              <Logo size="md" />
            </div>

            {mode === 'login' ? (
              <LoginForm onSwitchToSignup={() => setMode('signup')} />
            ) : (
              <SignupForm onSwitchToLogin={() => setMode('login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;