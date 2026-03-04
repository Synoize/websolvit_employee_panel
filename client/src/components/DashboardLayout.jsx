import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/context/AppContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  Wallet,
  CalendarDays,
  LogOut,
  CheckSquare,
  FileText,
  UserCircle2,
  Building2,
  Menu,
} from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { assets } from '../../assets/assets';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/employees', label: 'Employees', icon: Users },
  { to: '/admin/attendance', label: 'Attendance', icon: Clock },
  { to: '/admin/expenses', label: 'Expenses', icon: CheckSquare },
  { to: '/admin/leaves', label: 'Leaves', icon: FileText },
];

const employeeLinks = [
  { to: '/employee', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employee/attendance', label: 'Attendance', icon: Clock },
  { to: '/employee/expenses', label: 'Expenses', icon: Wallet },
  { to: '/employee/leaves', label: 'Leaves', icon: CalendarDays },
  { to: '/employee/profile', label: 'Profile', icon: UserCircle2 },
];

export default function DashboardLayout({ children }) {
  const { currentUser, logout } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const links = currentUser?.role === 'admin' ? adminLinks : employeeLinks;
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-sidebar flex-col shrink-0">
        <div className="px-5 py-3 border-b border-sidebar-border">
          <img src={assets.logo} alt="websolvit" className='h-12' />
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
              >
                <link.icon className="w-4.5 h-4.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-semibold text-sidebar-foreground">{currentUser?.name}</p>
            <p className="text-xs text-sidebar-muted capitalize">{currentUser?.role} • {currentUser?.id}</p>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-item sidebar-item-inactive w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside >

      {/* Mobile Top Bar */}
      <div className="flex flex-col flex-1 min-w-0" >
        <header className="md:hidden flex items-center justify-between px-4 py-5 h-16 bg-sidebar border-b border-sidebar-border shrink-0 safe-top">
          <div className="flex items-center gap-2">
            <img src={assets.logo_square} alt="websolvit" className='h-10' />
          </div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
                <Menu className="w-7 h-7 text-sidebar-foreground hover:bg-sidebar-accent" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-sidebar border-sidebar-border p-0">
              <SheetTitle className="sr-only">Mobile navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Open menu for navigation links and account actions.
              </SheetDescription>
              <div className="p-5 border-b border-sidebar-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-sidebar-foreground">{currentUser?.name}</p>
                    <p className="text-xs text-sidebar-muted capitalize">{currentUser?.role} • {currentUser?.id}</p>
                  </div>
                </div>
              </div>
              <nav className="p-3 space-y-1">
                {links.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setSheetOpen(false)}
                      className={`sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
                    >
                      <link.icon className="w-4.5 h-4.5" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-sidebar-border">
                <button
                  onClick={handleLogout}
                  className="sidebar-item sidebar-item-inactive w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background pb-20 md:pb-0">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-slide-in">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-bottom">
          <div className="flex items-center justify-around h-16">
            {links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                    }`}
                >
                  <link.icon className={`w-5 h-5 ${isActive ? 'text-accent' : ''}`} />
                  <span className="text-[10px] font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div >
    </div >
  );
}
