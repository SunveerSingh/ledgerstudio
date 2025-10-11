import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const AdditionalStep: React.FC = () => {
  const { onboardingData, updateData, nextStep } = useOnboarding();
  const [value, setValue] = useState(onboardingData.additionalPrompt || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({ additionalPrompt: value.trim() });
    nextStep();
  };

  const handleSkip = () => {
    updateData({ additionalPrompt: '' });
    nextStep();
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Sparkles className="h-6 w-6 text-blue-600" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Any specific requests?
        </h1>
      </div>
      <p className="text-lg text-gray-600 mb-8">
        Optional: Add specific colors, elements, or style preferences
      </p>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g., Dark purple and neon blue colors, city skyline at night, add vintage film grain..."
          className="w-full px-4 py-4 text-base bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all resize-none shadow-sm focus:shadow-md"
          rows={5}
        />

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={handleSkip}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-semibold transition-all"
          >
            Skip
          </button>

          <button
            type="submit"
            className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-semibold transition-all flex items-center gap-2 group"
          >
            Generate AI Art
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-4">
          This helps fine-tune your results, but it's completely optional
        </p>
      </form>
    </div>
  );
};

export default AdditionalStep;
