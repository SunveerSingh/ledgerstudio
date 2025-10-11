import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const LyricsStep: React.FC = () => {
  const { onboardingData, updateData, nextStep } = useOnboarding();
  const [value, setValue] = useState(onboardingData.lyrics || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      updateData({ lyrics: value.trim() });
      nextStep();
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        Paste your lyrics
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        AI will analyze your lyrics to create matching visuals
      </p>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste your song lyrics here...&#10;&#10;AI will understand the themes, emotions, and imagery to create the perfect cover art."
          className="w-full px-4 py-4 text-base bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all resize-none shadow-sm focus:shadow-md"
          rows={10}
        />

        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>{value.length} characters</span>
          <span>The more detail, the better the results</span>
        </div>

        <button
          type="submit"
          disabled={!value.trim()}
          className="mt-6 px-8 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white disabled:text-gray-500 rounded-full font-semibold transition-all disabled:cursor-not-allowed flex items-center gap-2 mx-auto group"
        >
          Continue
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};

export default LyricsStep;
