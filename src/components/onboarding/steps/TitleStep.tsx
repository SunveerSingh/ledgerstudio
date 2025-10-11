import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const TitleStep: React.FC = () => {
  const { onboardingData, updateData, nextStep } = useOnboarding();
  const [value, setValue] = useState(onboardingData.songTitle || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      updateData({ songTitle: value.trim() });
      nextStep();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      handleSubmit(e);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        What's the song title?
      </h1>
      <p className="text-lg text-gray-600 mb-10">
        Enter your song title
      </p>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., Summer Nights"
          className="w-full px-5 py-4 text-2xl font-semibold text-center bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all shadow-sm focus:shadow-md"
        />

        <button
          type="submit"
          disabled={!value.trim()}
          className="mt-6 px-8 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white disabled:text-gray-500 rounded-full font-semibold transition-all disabled:cursor-not-allowed flex items-center gap-2 mx-auto group"
        >
          Continue
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-gray-500 text-sm mt-4">
          Press Enter to continue
        </p>
      </form>
    </div>
  );
};

export default TitleStep;
