import React, { useState } from 'react';
import { ArrowRight, Sparkles, Zap, Shield, TrendingUp, Music, Play, Check } from 'lucide-react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import OnboardingModal from '../onboarding/OnboardingModal';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const { openOnboarding } = useOnboarding();

  const handleGetStarted = () => {
    openOnboarding();
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Covers',
      description: 'Generate stunning album covers with advanced AI in seconds'
    },
    {
      icon: Play,
      title: 'Dynamic Visualizers',
      description: 'Create mesmerizing audio visualizers that sync with your music'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Export high-quality content instantly, no waiting required'
    },
    {
      icon: Shield,
      title: 'Professional Quality',
      description: 'Studio-grade outputs ready for streaming platforms'
    }
  ];

  const stats = [
    { label: 'Artists', value: '10K+' },
    { label: 'Covers Created', value: '100K+' },
    { label: 'Countries', value: '120+' }
  ];

  const benefits = [
    'Unlimited project storage',
    'HD export quality',
    'Custom brand colors',
    'Priority support',
    'Advanced AI features',
    'Commercial license'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Ledger Studio
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Pricing
            </a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              About
            </a>
          </div>

          <button
            onClick={handleGetStarted}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-full font-medium transition-all hover:scale-105 shadow-lg shadow-gray-900/10"
          >
            Get Started
          </button>
        </div>
      </nav>

      <section className="relative pt-20 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/30 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full mb-8">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-semibold">AI-Powered Music Visuals</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Create Stunning
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Album Art in Seconds
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Professional-grade album covers and audio visualizers powered by AI.
            Perfect for musicians, producers, and content creators.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={handleGetStarted}
              className="group bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2 shadow-xl shadow-gray-900/20"
            >
              Start Creating Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="text-gray-700 hover:text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition-colors border-2 border-gray-300 hover:border-gray-400 bg-white">
              Watch Demo
            </button>
          </div>

          <div className="flex items-center justify-center gap-12 flex-wrap">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-gray-600 text-lg">Powerful tools designed for modern music creators</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`group p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  hoveredFeature === index
                    ? 'bg-blue-50 border-blue-300 scale-105 shadow-xl shadow-blue-100'
                    : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-lg'
                }`}
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 transition-colors ${
                  hoveredFeature === index ? 'bg-blue-600' : 'bg-gray-100'
                }`}>
                  <feature.icon className={`h-6 w-6 ${hoveredFeature === index ? 'text-white' : 'text-gray-700'}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Built for Professional Musicians
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Whether you're releasing your first single or managing a full catalog,
                Ledger Studio gives you the tools to create visuals that match your sound.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl border-2 border-blue-200 flex items-center justify-center shadow-2xl">
                <TrendingUp className="h-32 w-32 text-blue-600 opacity-60" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl blur-2xl opacity-20 -z-10" />
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 text-lg mb-16">Start free, upgrade when you're ready</p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-start gap-2 text-gray-600">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>3 AI generations/month</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>2 projects max</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Basic exports</span>
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Get Started
              </button>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 relative scale-105 shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$19</span>
                <span className="text-gray-300">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-start gap-2 text-gray-100">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Unlimited AI generations</span>
                </li>
                <li className="flex items-start gap-2 text-gray-100">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Unlimited projects</span>
                </li>
                <li className="flex items-start gap-2 text-gray-100">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>HD exports</span>
                </li>
                <li className="flex items-start gap-2 text-gray-100">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Upgrade to Pro
              </button>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$49</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-start gap-2 text-gray-600">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Custom branding</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>API access</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>White-label exports</span>
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Music Visuals?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Join thousands of artists creating professional content with Ledger Studio
          </p>
          <button
            onClick={handleGetStarted}
            className="group bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 inline-flex items-center gap-2 shadow-xl shadow-gray-900/20"
          >
            Start Creating Free
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <OnboardingModal />

      <footer className="border-t-2 border-gray-200 py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Music className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Ledger Studio
              </span>
            </div>

            <div className="flex gap-8 text-gray-600 text-sm font-medium">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
            </div>

            <div className="text-gray-500 text-sm">
              © 2024 Ledger Studio. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
