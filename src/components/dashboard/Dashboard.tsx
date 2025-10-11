import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ProjectsView from './ProjectsView';
import ProjectDetails from './ProjectDetails';
import CoverStudio from '../studio/CoverStudio';
import ProfileSettings from './ProfileSettings';
import { useProjects } from '../../contexts/ProjectContext';

type View = 'projects' | 'project-details' | 'cover-studio' | 'profile';

interface DashboardProps {
  projectClaimed?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ projectClaimed }) => {
  const [currentView, setCurrentView] = useState<View>('projects');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { activeProject } = useProjects();

  const renderContent = () => {
    switch (currentView) {
      case 'projects':
        return <ProjectsView onNavigate={setCurrentView} projectClaimed={projectClaimed} />;
      case 'project-details':
        return <ProjectDetails onNavigate={setCurrentView} />;
      case 'cover-studio':
        return <CoverStudio onNavigate={setCurrentView} />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <ProjectsView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;