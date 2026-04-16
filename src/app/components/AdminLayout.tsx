import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  CalendarPlus,
  Users,
  Mail,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from './ui/button';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Events', path: '/admin/events', icon: CalendarPlus },
  { label: 'Applications', path: '/admin/applications', icon: Users },
  { label: 'Messages', path: '/admin/messages', icon: Mail },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('mox-admin');
    if (!isAuth) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('mox-admin');
    navigate('/admin/login', { replace: true });
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0c1c3b] text-white flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg">
              M
            </div>
            <span className="text-xl font-bold">MoX Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            View Public Site →
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-sm text-white/60 hover:text-red-300 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="text-sm text-gray-500">
            {navItems.find((item) => isActive(item.path))?.label || 'Admin'}
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
