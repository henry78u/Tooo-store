import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  ExternalLink,
  User,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Check,
  Package,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';
import { AdminRole } from '../../../types/admin';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenGlobalSearch: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileMenu,
  onOpenGlobalSearch,
}) => {
  const navigate = useNavigate();
  const {
    currentStaff,
    loginAsStaff,
    logoutAdmin,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAdminStore();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSwitch = (role: AdminRole) => {
    loginAsStaff(role);
    setIsProfileOpen(false);
  };

  const handleSignOut = () => {
    logoutAdmin();
    setIsProfileOpen(false);
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E9E7E3] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left zone: Mobile hamburger & search trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-1.5 -ml-1.5 text-neutral-800 hover:text-black"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search shortcut button */}
        <button
          onClick={onOpenGlobalSearch}
          className="flex items-center gap-2.5 bg-[#FAF8F5] hover:bg-[#F6F3ED] border border-[#E9E7E3] text-neutral-500 hover:text-neutral-900 px-3.5 py-1.5 text-xs transition-colors rounded-none"
        >
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden sm:inline">Search orders, products, customers...</span>
          <span className="sm:hidden">Search...</span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-neutral-200 text-neutral-400 rounded">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right zone: Notifications, View Store, Staff Menu */}
      <div className="flex items-center gap-3">
        {/* View Store button */}
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 border border-[#E9E7E3] bg-white px-3 py-1.5 transition-colors"
        >
          <span>View Store</span>
          <ExternalLink className="w-3 h-3 text-neutral-400" />
        </Link>

        {/* Operational Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 text-neutral-700 hover:text-neutral-900 border border-[#E9E7E3] bg-white transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8A4735] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E9E7E3] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="p-3.5 border-b border-[#E9E7E3] flex items-center justify-between bg-[#FAF8F5]">
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-xs text-neutral-900">
                    Operational Alerts
                  </span>
                  <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.2 font-bold">
                    {unreadCount} new
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-[#8A4735] hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#E9E7E3]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-neutral-500">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.link) {
                          setIsNotifOpen(false);
                          navigate(n.link);
                        }
                      }}
                      className={`p-3.5 text-xs cursor-pointer hover:bg-[#FAF8F5] transition-colors ${
                        !n.read ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-neutral-900">{n.title}</span>
                        <span className="text-[10px] text-neutral-400 tabular-nums">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 mt-1 leading-snug">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-[#E9E7E3] text-center bg-[#FAF8F5]">
                <Link
                  to="/admin/support/notifications"
                  onClick={() => setIsNotifOpen(false)}
                  className="text-xs text-neutral-700 hover:text-neutral-900 font-medium"
                >
                  View full notifications log
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Staff Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 border border-[#E9E7E3] bg-white hover:border-neutral-400 transition-colors"
          >
            <div className="w-7 h-7 bg-[#171717] text-white text-xs font-bold flex items-center justify-center">
              {currentStaff?.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left text-xs leading-none pr-1">
              <span className="font-semibold text-neutral-900 block truncate max-w-[120px]">
                {currentStaff?.name}
              </span>
              <span className="text-[10px] text-neutral-500">{currentStaff?.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E9E7E3] shadow-xl z-50 p-2 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="p-3 border-b border-[#E9E7E3] bg-[#FAF8F5] mb-2">
                <span className="font-bold text-neutral-900 block">{currentStaff?.name}</span>
                <span className="text-neutral-500 text-[11px] block">{currentStaff?.email}</span>
                <span className="inline-block mt-1 text-[10px] uppercase font-bold text-[#8A4735] border border-neutral-200 bg-white px-2 py-0.5">
                  Role: {currentStaff?.role}
                </span>
              </div>

              {/* Demo Role Switcher */}
              <div className="px-2 py-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Switch Demo Role:
              </div>
              <div className="space-y-0.5">
                {(['Owner', 'Store Manager', 'Fulfilment Staff', 'Support Staff'] as AdminRole[]).map(
                  (role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className={`w-full text-left px-2.5 py-1.5 flex items-center justify-between text-xs transition-colors ${
                        currentStaff?.role === role
                          ? 'bg-[#171717] text-white font-semibold'
                          : 'text-neutral-700 hover:bg-[#F6F3ED]'
                      }`}
                    >
                      <span>{role}</span>
                      {currentStaff?.role === role && <Check className="w-3.5 h-3.5" />}
                    </button>
                  )
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-[#E9E7E3]">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-2.5 py-2 text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Admin</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
