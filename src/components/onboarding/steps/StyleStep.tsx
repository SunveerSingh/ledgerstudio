import React from 'react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const STYLES = [
  'Cinematic', 'Minimalist', 'Vintage', 'Abstract',
  'Retro', 'Futuristic', 'Watercolor', 'Gothic',
  'Cyberpunk', 'Comic', 'GTA', 'Neon'
];

const StyleStep: React.FC = () => {
  const { onboardingData, updateData, nextStep } = useOnboarding();

  const handleSelect = (style: string) => {
    updateData({ visualStyle: style });
    setTimeout(() => nextStep(), 300);
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        Choose a visual style
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Pick the aesthetic that matches your vision
      </p>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
        {STYLES.map((style) => (
          <button
            key={style}
            onClick={() => handleSelect(style)}
            className={`group p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
              onboardingData.visualStyle === style
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
            }`}
          >
            <span className="text-sm font-semibold text-gray-900">{style}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleStep;
