import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  User, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Settings,
  LogOut,
  Bell,
  BarChart,
  ClipboardCheck
} from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  role: 'candidate' | 'client' | 'admin' | 'hr';
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getNavItems = () => {
    switch (role) {
      case 'candidate':
        return [
          { path: '/candidate/dashboard', icon: Home, label: 'Dashboard' },
          { path: '/candidate/profile/edit', icon: User, label: 'My Profile' },
          { path: '/candidate/jobs', icon: Briefcase, label: 'Jobs' },
          { path: '/candidate/applications', icon: FileText, label: 'Applications' },
          { path: '/candidate/interviews', icon: ClipboardCheck, label: 'Interviews' },
          { path: '/candidate/messages', icon: MessageSquare, label: 'Messages' },
          { path: '/candidate/analytics', icon: BarChart, label: 'Analytics' },
          { path: '/candidate/settings', icon: Settings, label: 'Settings' },
        ];
      case 'client':
        return [
          { path: '/client/dashboard', icon: Home, label: 'Dashboard' },
          { path: '/client/browse', icon: Briefcase, label: 'Browse Talent' },
          { path: '/client/post-requirement', icon: FileText, label: 'Post Requirement' },
          { path: '/client/messages', icon: MessageSquare, label: 'Messages' },
          { path: '/client/contracts', icon: ClipboardCheck, label: 'Contracts' },
          { path: '/client/settings', icon: Settings, label: 'Settings' },
        ];
      default:
        return [];
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = getNavItems();

  return (
    <div className="h-screen w-64 bg-background border-r flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-primary">TalentHub</h1>
        <p className="text-sm text-muted-foreground capitalize">{role} Portal</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            {user?.image ? (
              <img src={user.image} alt={user.username} className="h-10 w-10 rounded-full" />
            ) : (
              <User className="h-5 w-5 text-primary" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">{user?.fullName || user?.username}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};