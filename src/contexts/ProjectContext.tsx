import React, { createContext, useContext, useState } from 'react';
import { SupabaseProjectsService, Project as SupabaseProject } from '../services/supabase-projects';
import { useAuth } from './AuthContext';

export type Project = SupabaseProject;

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  loading: boolean;
  createProject: (type: 'cover', title: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (project: Project | null) => void;
  duplicateProject: (id: string) => void;
  loadProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProjects = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userProjects = await SupabaseProjectsService.getUserProjects(user.id);
      setProjects(userProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (type: 'cover', title: string) => {
    if (!user) return;

    try {
      const newProject = await SupabaseProjectsService.createProject(user.id, type, title);
      setProjects(prev => [newProject, ...prev]);
      setActiveProject(newProject);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updatedProject = await SupabaseProjectsService.updateProject(id, updates);

      setProjects(prev => prev.map(p =>
        p.id === id ? updatedProject : p
      ));

      if (activeProject?.id === id) {
        setActiveProject(updatedProject);
      }
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await SupabaseProjectsService.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      if (activeProject?.id === id) {
        setActiveProject(null);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const duplicateProject = async (id: string) => {
    if (!user) return;

    try {
      const duplicate = await SupabaseProjectsService.duplicateProject(id, user.id);
      setProjects(prev => [duplicate, ...prev]);
    } catch (error) {
      console.error('Failed to duplicate project:', error);
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      activeProject,
      loading,
      createProject,
      updateProject,
      deleteProject,
      setActiveProject,
      duplicateProject,
      loadProjects
    }}>
      {children}
    </ProjectContext.Provider>
  );
};