import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import Dashboard from './components/dashboard/Dashboard';
import LandingPage from './components/landing/LandingPage';
import { SupabasePendingProjectsService } from './services/supabase-pending-projects';
import { SupabaseProjectsService } from './services/supabase-projects';
import { getOrCreateSessionId } from './contexts/OnboardingContext';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [showLanding, setShowLanding] = useState(!user);
  const [projectClaimed, setProjectClaimed] = useState(false);
  const claimingRef = React.useRef(false);

  useEffect(() => {
    const claimPendingProject = async () => {
      if (user && !projectClaimed && !claimingRef.current) {
        claimingRef.current = true;
        try {
          const sessionId = getOrCreateSessionId();
          console.log('Claiming project for session:', sessionId);

          const pendingProject = await SupabasePendingProjectsService.getPendingProjectBySession(sessionId);
          console.log('Pending project found:', pendingProject);

          if (pendingProject && pendingProject.status === 'completed' && pendingProject.generated_images) {
            console.log('Creating project from pending project:', pendingProject.id);

            const projectData = {
              user_id: user.id,
              title: pendingProject.song_title || 'Untitled Project',
              type: 'cover' as const,
              status: 'completed' as const,
              thumbnail_url: (pendingProject.generated_images as any[])[0]?.url || null,
              settings: {
                projectType: pendingProject.project_type,
                artistName: pendingProject.artist_name,
                genre: pendingProject.genre,
                mood: pendingProject.mood,
                lyrics: pendingProject.lyrics,
                visualStyle: pendingProject.visual_style,
                additionalPrompt: pendingProject.additional_prompt,
                generatedImages: pendingProject.generated_images
              }
            };

            const project = await SupabaseProjectsService.createProject(
              user.id,
              'cover',
              projectData.title
            );

            console.log('Project created:', project.id);

            await SupabaseProjectsService.updateProject(project.id, {
              status: 'completed',
              thumbnail_url: projectData.thumbnail_url,
              settings: projectData.settings
            });

            console.log('Project updated with settings');

            await SupabasePendingProjectsService.claimPendingProject(pendingProject.id, user.id);
            console.log('Pending project claimed');

            setProjectClaimed(true);
          } else {
            console.log('No pending project to claim or project not ready');
            claimingRef.current = false;
          }
        } catch (error) {
          console.error('Failed to claim pending project:', error);
          claimingRef.current = false;
        }
      }
    };

    if (user) {
      setShowLanding(false);
      claimPendingProject();
    } else {
      setShowLanding(true);
    }
  }, [user, projectClaimed]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  return (
    <ProjectProvider>
      <Dashboard projectClaimed={projectClaimed} />
    </ProjectProvider>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <AuthProvider>
        <OnboardingProvider>
          <AppContent />
        </OnboardingProvider>
      </AuthProvider>
    </div>
  );
}

export default App;