import { Outlet, useNavigate, Link, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Layout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    setActiveNav(path);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Bills', icon: FileText, path: '/bills' },
    { name: 'Friends', icon: Users, path: '/friends' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out lg:translate-x-0`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between p-2 mb-8">
            <h1 className="text-xl font-bold text-primary">FairShare</h1>
          </div>
          
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
                  activeNav === item.path.split('/')[1] || (activeNav === 'dashboard' && item.path === '/')
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto p-2">
            <div className="flex items-center p-3 rounded-lg bg-gray-50">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{currentUser?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{currentUser?.email || ''}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              className="w-full justify-start mt-2 text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
