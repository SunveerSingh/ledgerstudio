import React, { useState } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  Palette,
  Trash2,
  Copy
} from 'lucide-react';
import { useProjects } from '../../contexts/ProjectContext';
import { Project } from '../../contexts/ProjectContext';

interface ProjectsViewProps {
  onNavigate: (view: string) => void;
  projectClaimed?: boolean;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ onNavigate, projectClaimed }) => {
  const {
    projects,
    loading,
    createProject,
    duplicateProject,
    deleteProject,
    setActiveProject,
    loadProjects
  } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  React.useEffect(() => {
    loadProjects();
  }, []);

  React.useEffect(() => {
    if (projectClaimed) {
      loadProjects();
    }
  }, [projectClaimed]);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = () => {
    const title = 'New Album Cover';
    createProject('cover', title);
    setShowCreateMenu(false);
    onNavigate('cover-studio');
  };

  const handleOpenProject = (project: Project) => {
    setActiveProject(project);
    onNavigate('project-details');
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>

          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-900 hover:bg-gray-800 text-white transition-all text-sm shadow-lg shadow-gray-900/10"
            >
              <Plus className="h-4 w-4" />
              New
            </button>

            {showCreateMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                <div className="p-1.5">
                  <button
                    onClick={handleCreateProject}
                    className="w-full text-left p-2.5 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-md bg-blue-600">
                        <Palette className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">Album Cover</p>
                        <p className="text-xs text-gray-500">AI artwork</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar - Only show if there are projects */}
        {projects.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm bg-white text-gray-900 border-2 border-gray-200"
              />
            </div>
          </div>
        )}

        {/* Projects Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-32">
            <div className="inline-flex p-4 rounded-xl mb-4 bg-gray-100">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-900">
              {searchTerm ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              {searchTerm ? 'Try a different search' : 'Create your first project to get started'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateMenu(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-900 hover:bg-gray-800 text-white transition-all text-sm shadow-lg shadow-gray-900/10"
              >
                <Plus className="h-4 w-4" />
                New Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-xl hover:border-gray-300"
                onClick={() => handleOpenProject(project)}
              >
                {/* Project Thumbnail */}
                <div className="aspect-video relative bg-gray-100">
                  {project.thumbnailUrl ? (
                    <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Palette className="h-8 w-8 text-gray-400" />
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold bg-white/90 text-gray-900 shadow">
                    Cover
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-4">
                  <h3 className="font-medium mb-1 truncate text-gray-900 text-sm">
                    {project.title}
                  </h3>
                  <p className="text-xs truncate text-gray-500">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsView;
