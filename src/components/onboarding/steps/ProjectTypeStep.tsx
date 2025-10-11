import React from 'react';
import { Disc } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const ProjectTypeStep: React.FC = () => {
  const { updateData, nextStep } = useOnboarding();

  const handleSelect = () => {
    updateData({ projectType: 'single' });
    setTimeout(() => nextStep(), 300);
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        What are you creating today?
      </h1>
      <p className="text-lg text-gray-600 mb-10">
        Create stunning cover art for your single
      </p>

      <div className="max-w-md mx-auto">
        <button
          onClick={handleSelect}
          className="group w-full p-8 rounded-xl border-2 transition-all duration-300 hover:scale-105 border-blue-600 bg-blue-50 shadow-lg shadow-blue-200"
        >
          <Disc className="h-12 w-12 mx-auto mb-4 text-gray-900 group-hover:rotate-12 transition-transform" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Single</h3>
          <p className="text-gray-600 text-sm">
            Create cover art for one song
          </p>
        </button>
      </div>
    </div>
  );
};

export default ProjectTypeStep;
