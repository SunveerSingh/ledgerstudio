import React, { createContext, useContext, useState, useCallback } from 'react';

export interface OnboardingData {
  projectType: 'single';
  songTitle: string;
  artistName: string;
  featuring?: string;
  producer?: string;
  releaseYear: string;
  genre: string;
  mood: string;
  lyrics: string;
  visualStyle: string;
  additionalPrompt?: string;
  isExplicit: boolean;
}

export interface GeneratedImage {
  url: string;
  prompt?: string;
}

interface OnboardingContextType {
  isOpen: boolean;
  currentStep: number;
  onboardingData: OnboardingData;
  generatedImages: GeneratedImage[];
  isGenerating: boolean;
  error: string | null;
  pendingProjectId: string | null;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  updateData: (data: Partial<OnboardingData>) => void;
  setGeneratedImages: (images: GeneratedImage[]) => void;
  setIsGenerating: (generating: boolean) => void;
  setError: (error: string | null) => void;
  setPendingProjectId: (id: string | null) => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const INITIAL_DATA: OnboardingData = {
  projectType: 'single',
  songTitle: '',
  artistName: '',
  featuring: '',
  producer: '',
  releaseYear: new Date().getFullYear().toString(),
  genre: 'Hip-Hop',
  mood: 'Energetic',
  lyrics: '',
  visualStyle: 'Cinematic',
  additionalPrompt: '',
  isExplicit: false
};

const STORAGE_KEY = 'ledger_onboarding_data';
const SESSION_ID_KEY = 'ledger_session_id';

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_DATA;
    } catch {
      return INITIAL_DATA;
    }
  });
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);

  const openOnboarding = useCallback(() => {
    setIsOpen(true);
    setCurrentStep(1);
    setError(null);
  }, []);

  const closeOnboarding = useCallback(() => {
    setIsOpen(false);
    setError(null);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const updateData = useCallback((data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => {
      const updated = { ...prev, ...data };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save onboarding data:', err);
      }
      return updated;
    });
  }, []);

  const resetOnboarding = useCallback(() => {
    setOnboardingData(INITIAL_DATA);
    setGeneratedImages([]);
    setIsGenerating(false);
    setError(null);
    setPendingProjectId(null);
    setCurrentStep(1);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear onboarding data:', err);
    }
  }, []);

  const value: OnboardingContextType = {
    isOpen,
    currentStep,
    onboardingData,
    generatedImages,
    isGenerating,
    error,
    pendingProjectId,
    openOnboarding,
    closeOnboarding,
    nextStep,
    previousStep,
    goToStep,
    updateData,
    setGeneratedImages,
    setIsGenerating,
    setError,
    setPendingProjectId,
    resetOnboarding
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const getOrCreateSessionId = (): string => {
  try {
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};
