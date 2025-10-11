import React from 'react';
import {
  Home,
  Palette,
  Settings,
  ChevronLeft,
  Menu,
  LogOut
} from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: any) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isCollapsed, onToggleCollapse }) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'projects', label: 'Projects', icon: Home },
    { id: 'cover-studio', label: 'Cover Studio', icon: Palette },
    { id: 'profile', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} flex flex-col transition-all duration-300 flex-shrink-0 bg-white border-r border-gray-200`}>

      {/* Logo */}
      <div className={`${isCollapsed ? 'p-4' : 'p-6'} border-b border-gray-200`}>
        {isCollapsed ? (
          <div className="flex justify-center">
            <Logo size="sm" showText={false} />
          </div>
        ) : (
          <Logo size="md" />
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${isCollapsed ? 'p-3' : 'p-6'} overflow-y-auto`}>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-3 py-3' : 'gap-3 px-4 py-3'} rounded-lg transition-all duration-200 font-medium ${
                    isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout & Toggle Buttons */}
      <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-t border-gray-200 space-y-2`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>

        <button
          onClick={onToggleCollapse}
          className={`w-full flex items-center justify-center ${isCollapsed ? 'p-3' : 'p-3'} text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 group`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5 group-hover:scale-110 transition-transform" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;