import React, { useEffect, useState } from 'react';
import { RefreshCw, Lock, Sparkles, Download, CheckCircle } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { GeminiServiceInstance as GeminiService } from '../../../services/gemini';
import { SupabasePendingProjectsService } from '../../../services/supabase-pending-projects';
import { getOrCreateSessionId } from '../../../contexts/OnboardingContext';

const GeneratingStep: React.FC = () => {
  const {
    onboardingData,
    generatedImages,
    setGeneratedImages,
    isGenerating,
    setIsGenerating,
    error,
    setError,
    setPendingProjectId,
    nextStep
  } = useOnboarding();

  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const generateArt = async () => {
      setIsGenerating(true);
      setError(null);

      try {
        const sessionId = getOrCreateSessionId();

        const existingProject = await SupabasePendingProjectsService.getPendingProjectBySession(sessionId);

        let pendingProject;
        if (existingProject && existingProject.status === 'completed' && existingProject.generated_images) {
          pendingProject = existingProject;
          setGeneratedImages(existingProject.generated_images);
          setIsGenerating(false);
          setPendingProjectId(pendingProject.id);
          return;
        }

        pendingProject = await SupabasePendingProjectsService.createPendingProject(
          sessionId,
          onboardingData
        );

        setPendingProjectId(pendingProject.id);

        await SupabasePendingProjectsService.updatePendingProject(pendingProject.id, {
          status: 'generating'
        });

        const images = await GeminiService.generateMultipleVariations({
          lyrics: onboardingData.lyrics,
          additionalPrompt: onboardingData.additionalPrompt || '',
          genre: onboardingData.genre,
          style: onboardingData.visualStyle,
          mood: onboardingData.mood,
          songTitle: onboardingData.songTitle,
          artistName: onboardingData.artistName,
          numberOfImages: 4,
          size: '1024x1024',
          quality: 'hd',
          coverType: 'single'
        });

        setGeneratedImages(images);

        await SupabasePendingProjectsService.updatePendingProject(pendingProject.id, {
          status: 'completed',
          generated_images: images
        });

        setIsGenerating(false);
      } catch (err: any) {
        console.error('Generation error:', err);
        setError(err.message || 'Failed to generate cover art');
        setIsGenerating(false);
      }
    };

    if (generatedImages.length === 0 && !error) {
      generateArt();
    }
  }, []);

  const handleSignupClick = () => {
    nextStep();
  };

  if (isGenerating) {
    return (
      <div className="text-center">
        <div className="mb-8">
          <RefreshCw className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Creating your cover art...
          </h1>
          <p className="text-lg text-gray-600">
            AI is analyzing your lyrics and crafting unique designs
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
          <div className="space-y-3">
            {['Analyzing lyrics and themes', 'Generating visual concepts', 'Applying your style preferences', 'Finalizing artwork'].map((step, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center max-w-2xl mx-auto">
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Generation Failed
          </h1>
          <p className="text-red-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Your cover art is ready!
          </h1>
        </div>
        <p className="text-lg text-gray-600 mb-6">
          {generatedImages.length} variations created just for you
        </p>

        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-100 border-2 border-blue-400 rounded-full">
          <Lock className="h-4 w-4 text-blue-700" />
          <span className="text-blue-700 font-medium text-sm">Create account to download</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {generatedImages.map((image, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? 'border-blue-600 scale-105'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="aspect-square">
                <img
                  src={image.url}
                  alt={`Cover art variation ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Lock className="h-10 w-10 text-white" />
              </div>

              {selectedImage === index && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-xl mx-auto bg-white rounded-xl p-6 border-2 border-gray-300 shadow-md">
        <Sparkles className="h-10 w-10 text-blue-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Love what you see?
        </h3>
        <p className="text-gray-600 mb-6 text-sm">
          Create a free account to download your artwork and create unlimited projects
        </p>
        <button
          onClick={handleSignupClick}
          className="w-full px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-semibold transition-all flex items-center justify-center gap-2 group"
        >
          <Download className="h-5 w-5" />
          Sign Up to Download
        </button>
      </div>
    </div>
  );
};

export default GeneratingStep;
