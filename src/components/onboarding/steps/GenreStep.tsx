import React from 'react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const GENRES = [
  'Hip-Hop', 'Trap', 'Punjabi Pop', 'Lo-Fi', 'EDM', 'Indie',
  'Rock', 'R&B', 'Pop', 'Country', 'Jazz', 'Electronic'
];

const GenreStep: React.FC = () => {
  const { onboardingData, updateData, nextStep } = useOnboarding();

  const handleSelect = (genre: string) => {
    updateData({ genre });
    setTimeout(() => nextStep(), 300);
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        What genre is it?
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        This helps us create the perfect vibe
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => handleSelect(genre)}
            className={`group p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
              onboardingData.genre === genre
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
            }`}
          >
            <span className="text-base font-semibold text-gray-900">{genre}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreStep;
