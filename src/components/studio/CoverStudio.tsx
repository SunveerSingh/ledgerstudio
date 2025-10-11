import React, { useState } from 'react';
import { ArrowLeft, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { useProjects } from '../../contexts/ProjectContext';
import { GeminiServiceInstance as GeminiService, GeneratedImage } from '../../services/gemini';

interface CoverStudioProps {
  onNavigate: (view: string) => void;
}

type Step = 'project-type' | 'song-info' | 'genre' | 'mood' | 'style' | 'lyrics' | 'additional' | 'generating' | 'results';

const CoverStudio: React.FC<CoverStudioProps> = ({ onNavigate }) => {
  const { activeProject, updateProject } = useProjects();
  const [currentStep, setCurrentStep] = useState<Step>('project-type');

  const [projectType, setProjectType] = useState<'single' | 'album-front'>('single');
  const [songTitle, setSongTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [albumTitle, setAlbumTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [style, setStyle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const genreOptions = ['Hip-Hop', 'Trap', 'Punjabi Pop', 'Lo-Fi', 'EDM', 'Indie', 'Rock', 'R&B'];
  const moodOptions = ['Energetic', 'Melancholic', 'Romantic', 'Aggressive', 'Peaceful', 'Dark', 'Uplifting', 'Mysterious'];
  const styleOptions = ['Cinematic', 'Minimalist', 'Vintage', 'Abstract', 'Retro', 'Futuristic', 'Watercolor', 'Gothic', 'Cyberpunk', 'Comic', 'GTA'];

  const handleGenerate = async () => {
    setCurrentStep('generating');
    setError(null);

    try {
      const images = await GeminiService.generateMultipleVariations({
        lyrics: lyrics.trim(),
        additionalPrompt: additionalPrompt.trim(),
        genre,
        style,
        mood,
        songTitle,
        artistName,
        numberOfImages: 4,
        size: '1024x1024',
        quality: 'hd',
        coverType: 'single',
      });

      setGeneratedImages(images);
      setCurrentStep('results');

      if (activeProject) {
        await updateProject(activeProject.id, {
          settings: {
            ...activeProject.settings,
            projectType,
            songTitle,
            artistName,
            albumTitle,
            genre,
            mood,
            visualStyle: style,
            lyrics,
            additionalPrompt,
            generatedImages: images
          },
          status: 'completed',
          thumbnail_url: images[0]?.url
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate cover art');
      setCurrentStep('additional');
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'project-type': return true;
      case 'song-info': return projectType === 'single' ? songTitle.trim() && artistName.trim() : albumTitle.trim() && artistName.trim();
      case 'genre': return genre.trim();
      case 'mood': return mood.trim();
      case 'style': return style.trim();
      case 'lyrics': return lyrics.trim();
      case 'additional': return true;
      default: return false;
    }
  };

  const nextStep = () => {
    if (!canProceed()) return;

    const steps: Step[] = ['project-type', 'song-info', 'genre', 'mood', 'style', 'lyrics', 'additional'];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      handleGenerate();
    }
  };

  const prevStep = () => {
    const steps: Step[] = ['project-type', 'song-info', 'genre', 'mood', 'style', 'lyrics', 'additional'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'project-type':
        return (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">What would you like to create?</h1>
            <p className="text-lg text-gray-600 mb-8">Choose your project type</p>

            <div className="space-y-4">
              {[
                { value: 'single', label: 'Single Cover', desc: 'Create artwork for a single track' },
                { value: 'album-front', label: 'Album Cover', desc: 'Create artwork with front and tracklist' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setProjectType(option.value as 'single' | 'album-front');
                    nextStep();
                  }}
                  className="w-full p-6 bg-white border-2 border-gray-300 rounded-xl text-left hover:border-gray-900 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-semibold text-gray-900 mb-1">{option.label}</p>
                      <p className="text-gray-600">{option.desc}</p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'song-info':
        return (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {projectType === 'single' ? "What's your song called?" : "What's your album called?"}
            </h1>
            <p className="text-lg text-gray-600 mb-8">Tell us about your music</p>

            <div className="space-y-6">
              {projectType === 'single' ? (
                <input
                  type="text"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  placeholder="Enter song title"
                  className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && canProceed() && nextStep()}
                />
              ) : (
                <input
                  type="text"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  placeholder="Enter album title"
                  className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && canProceed() && nextStep()}
                />
              )}

              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="Artist name"
                className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && canProceed() && nextStep()}
              />
            </div>
          </div>
        );

      case 'genre':
        return (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">What's your genre?</h1>
            <p className="text-lg text-gray-600 mb-8">Select one that fits your music</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {genreOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setGenre(option);
                    nextStep();
                  }}
                  className={`p-6 border-2 rounded-xl text-center font-semibold transition-all ${
                    genre === option
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-gray-900'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'mood':
        return (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">What's the mood?</h1>
            <p className="text-lg text-gray-600 mb-8">How should your artwork feel?</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {moodOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setMood(option);
                    nextStep();
                  }}
                  className={`p-6 border-2 rounded-xl text-center font-semibold transition-all ${
                    mood === option
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-gray-900'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'style':
        return (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Pick a visual style</h1>
            <p className="text-lg text-gray-600 mb-8">Choose the aesthetic for your artwork</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {styleOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setStyle(option);
                    nextStep();
                  }}
                  className={`p-6 border-2 rounded-xl text-center font-semibold transition-all ${
                    style === option
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-gray-900'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'lyrics':
        return (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Share some lyrics</h1>
            <p className="text-lg text-gray-600 mb-8">This helps the AI understand your song's vibe</p>

            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Paste a verse, chorus, or any lyrics from your song..."
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 transition-colors resize-none"
              rows={10}
              autoFocus
            />
          </div>
        );

      case 'additional':
        return (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Any additional details?</h1>
            <p className="text-lg text-gray-600 mb-8">Optional: Add specific elements or themes</p>

            <textarea
              value={additionalPrompt}
              onChange={(e) => setAdditionalPrompt(e.target.value)}
              placeholder="E.g., 'Include a city skyline at night' or 'Use warm orange tones'"
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 transition-colors resize-none"
              rows={6}
              autoFocus
            />
          </div>
        );

      case 'generating':
        return (
          <div className="max-w-2xl mx-auto text-center">
            <Sparkles className="h-16 w-16 text-blue-600 animate-pulse mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Creating your artwork...</h1>
            <p className="text-lg text-gray-600 mb-8">AI is analyzing your inputs and generating variations</p>

            <div className="bg-blue-50 rounded-xl p-8 border-2 border-blue-200">
              <div className="space-y-3">
                {['Analyzing lyrics and themes', 'Generating visual concepts', 'Applying style preferences', 'Finalizing artwork'].map((step, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'results':
        return (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Your artwork is ready!</h1>
            <p className="text-lg text-gray-600 mb-8">{generatedImages.length} variations created</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedImages.map((image, index) => (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all">
                  <img src={image.url} alt={`Variation ${index + 1}`} className="w-full aspect-square object-cover" />
                  <div className="p-4">
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = image.url;
                        link.download = `${songTitle || albumTitle}-${index + 1}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="w-full px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-all"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (currentStep === 'generating' || currentStep === 'results') {
    return (
      <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
          {renderStep()}

          {currentStep === 'results' && (
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t-2 border-gray-200">
              <div className="max-w-4xl mx-auto flex gap-4">
                <button
                  onClick={() => onNavigate('projects')}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-900 hover:border-gray-900 transition-all"
                >
                  Done
                </button>
                <button
                  onClick={() => {
                    setCurrentStep('project-type');
                    setGeneratedImages([]);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition-all"
                >
                  Generate More
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="min-h-screen flex flex-col">
        <div className="p-6">
          <button
            onClick={() => onNavigate('projects')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          {renderStep()}
        </div>

        <div className="p-6 bg-white border-t-2 border-gray-200">
          <div className="max-w-4xl mx-auto flex gap-4">
            {currentStep !== 'project-type' && (
              <button
                onClick={prevStep}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-900 hover:border-gray-900 transition-all flex items-center gap-2"
              >
                <ChevronLeft className="h-5 w-5" />
                Back
              </button>
            )}

            {currentStep !== 'project-type' && (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  canProceed()
                    ? 'bg-gray-900 hover:bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentStep === 'additional' ? (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Artwork
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed top-4 right-4 max-w-md p-4 bg-red-50 border-2 border-red-300 rounded-xl shadow-lg">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default CoverStudio;
