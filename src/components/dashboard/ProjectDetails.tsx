import React from 'react';
import { ArrowLeft, Download, Share2, Edit, Trash2, Palette, Music } from 'lucide-react';
import { useProjects } from '../../contexts/ProjectContext';

interface ProjectDetailsProps {
  onNavigate: (view: string) => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ onNavigate }) => {
  const { activeProject, deleteProject } = useProjects();

  if (!activeProject) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">No project selected</p>
          <button
            onClick={() => onNavigate('projects')}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const generatedImages = activeProject.settings?.generatedImages || [];

  const handleEdit = () => {
    onNavigate(activeProject.type === 'cover' ? 'cover-studio' : 'visualizer-studio');
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(activeProject.id);
      onNavigate('projects');
    }
  };

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${activeProject.title}-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => onNavigate('projects')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Projects</span>
        </button>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{activeProject.title}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {activeProject.type === 'cover' ? 'Album Cover' : 'Visualizer'}
                </span>
              </div>
              <p className="text-gray-600">
                Created {new Date(activeProject.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all text-sm font-medium"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all text-sm font-medium"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>

          {activeProject.settings && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {activeProject.settings.artistName && (
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Artist</p>
                  <p className="font-semibold text-gray-900">{activeProject.settings.artistName}</p>
                </div>
              )}
              {activeProject.settings.genre && (
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Genre</p>
                  <p className="font-semibold text-gray-900">{activeProject.settings.genre}</p>
                </div>
              )}
              {activeProject.settings.mood && (
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Mood</p>
                  <p className="font-semibold text-gray-900">{activeProject.settings.mood}</p>
                </div>
              )}
              {activeProject.settings.visualStyle && (
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Style</p>
                  <p className="font-semibold text-gray-900">{activeProject.settings.visualStyle}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {generatedImages.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Generated Artwork</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedImages.map((image: any, index: number) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden group hover:shadow-xl hover:border-gray-300 transition-all"
                >
                  <div className="aspect-square relative">
                    <img
                      src={image.url}
                      alt={`Generated artwork ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDownload(image.url, index)}
                        className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="Download"
                      >
                        <Download className="h-5 w-5 text-gray-900" />
                      </button>
                    </div>
                  </div>
                  {image.prompt && (
                    <div className="p-3 border-t-2 border-gray-200">
                      <p className="text-xs text-gray-600 line-clamp-2">{image.prompt}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white border-2 border-gray-200 rounded-lg">
            <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No artwork yet</h3>
            <p className="text-gray-600 mb-6">Generate some cover art to see it here</p>
            <button
              onClick={handleEdit}
              className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-all"
            >
              Start Creating
            </button>
          </div>
        )}

        {activeProject.settings?.lyrics && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Lyrics</h2>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                {activeProject.settings.lyrics}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
