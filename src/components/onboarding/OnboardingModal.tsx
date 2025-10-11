import React, { useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import ProjectTypeStep from './steps/ProjectTypeStep';
import TitleStep from './steps/TitleStep';
import ArtistStep from './steps/ArtistStep';
import GenreStep from './steps/GenreStep';
import MoodStep from './steps/MoodStep';
import LyricsStep from './steps/LyricsStep';
import StyleStep from './steps/StyleStep';
import AdditionalStep from './steps/AdditionalStep';
import GeneratingStep from './steps/GeneratingStep';
import SignupStep from './steps/SignupStep';

const TOTAL_STEPS = 8;

const OnboardingModal: React.FC = () => {
  const { isOpen, closeOnboarding, currentStep, previousStep, generatedImages } = useOnboarding();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && currentStep <= TOTAL_STEPS) {
        closeOnboarding();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, currentStep, closeOnboarding]);

  if (!isOpen) return null;

  const showBackButton = currentStep > 1 && currentStep <= TOTAL_STEPS;
  const showCloseButton = currentStep <= TOTAL_STEPS;
  const showProgress = currentStep <= TOTAL_STEPS;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProjectTypeStep />;
      case 2:
        return <TitleStep />;
      case 3:
        return <ArtistStep />;
      case 4:
        return <GenreStep />;
      case 5:
        return <MoodStep />;
      case 6:
        return <LyricsStep />;
      case 7:
        return <StyleStep />;
      case 8:
        return <AdditionalStep />;
      case 9:
        return <GeneratingStep />;
      case 10:
        return <SignupStep />;
      default:
        return <ProjectTypeStep />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 animate-fadeIn">
      <div className="h-full flex flex-col">
        {showProgress && (
          <div className="w-full h-1 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-6">
            <div className="w-full max-w-2xl relative">
              {showBackButton && (
                <button
                  onClick={previousStep}
                  className="absolute left-0 -top-16 p-2.5 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
                  aria-label="Go back"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}

              {showCloseButton && (
                <button
                  onClick={closeOnboarding}
                  className="absolute right-0 -top-16 p-2.5 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              )}

              <div className="animate-slideUp">
                {renderStep()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
