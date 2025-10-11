import React from 'react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const MOODS = [
  'Energetic', 'Melancholic', 'Romantic', 'Aggressive',
  'Peaceful', 'Dark', 'Uplifting', 'Mysterious'
];

const MoodStep: React.FC = () => {
  const { onboardingData, updateData, nextStep } = useOnboarding();

  const handleSelect = (mood: string) => {
    updateData({ mood });
    setTimeout(() => nextStep(), 300);
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        What's the mood?
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Choose the feeling that best matches your music
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
        {MOODS.map((mood) => (
          <button
            key={mood}
            onClick={() => handleSelect(mood)}
            className={`group p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
              onboardingData.mood === mood
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
            }`}
          >
            <span className="text-sm font-semibold text-gray-900">{mood}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodStep;
