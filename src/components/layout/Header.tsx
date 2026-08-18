"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Bell,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export interface NavLink {
  name: string;
  href: string;
}

export interface HeaderProps {
  navLinks?: NavLink[];
  showNotifications?: boolean;
  className?: string;
}

// Preset navigation link sets for different app sections
const publicNavLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Psychologists", href: "/psychologists" },
  { name: "Blog", href: "/blogs" },
  { name: "Contact Us", href: "/contact" },
];

export default function Header({
  navLinks: navLinksProp,
  showNotifications: showNotificationsProp,
  className = "",
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Do NOT render top Header on Auth pages (/login, /register, /therapist/login, /admin/login, /admin/signup, /set-password)
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/therapist/login" ||
    pathname === "/admin/login" ||
    pathname === "/admin/signup" ||
    pathname === "/set-password";
  if (isAuthRoute) return null;

  // Check route types
  const isLandingPage = pathname === "/";
  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/therapist") ||
    pathname.startsWith("/admin");

  const isPublicPage = !isDashboardRoute;

  // Nav links are rendered on all public pages (Home, Blog, Psychologists, etc.)
  const activeNavLinks: NavLink[] =
    navLinksProp !== undefined
      ? navLinksProp
      : isPublicPage
        ? publicNavLinks
        : [];

  const showNotifications = showNotificationsProp !== undefined ? showNotificationsProp : isDashboardRoute;

  return (
    <header className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-black/[0.04] ${className}`}>
      <div className="site-container h-16 sm:h-20 flex items-center justify-between">

        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              MentalCare
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        {activeNavLinks.length > 0 && (
          <nav className="hidden md:flex items-center gap-6">
            {activeNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition-colors py-2 px-1 ${
                    isActive
                      ? "font-bold text-secondary"
                      : "font-medium text-foreground/80 hover:text-secondary"
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Side: Actions & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {showNotifications && user && (
            <button
              aria-label="Notifications"
              className="p-2.5 rounded-full text-slate-500 hover:text-primary hover:bg-slate-100 transition relative cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500"></span>
            </button>
          )}

          {/* Public Pages: Show 'Book a Session' button */}
          {isPublicPage && (
            <Link
              href="/book"
              className="hidden sm:flex h-10 sm:h-11 items-center justify-center gap-2 rounded-full bg-primary hover:bg-secondary px-5 sm:px-6 text-xs sm:text-sm font-semibold text-white transition-colors shadow-xs"
            >
              <CalendarDays className="h-4 w-4 text-tertiary" />
              <span>Book a Session</span>
            </Link>
          )}

          {/* User Avatar with Dropdown when logged in (Only shown on Dashboard routes) */}
          {isDashboardRoute && user && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 p-1 hover:opacity-80 transition cursor-pointer focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-[#0A4D34]/10 text-[#0A4D34] font-bold text-xs flex items-center justify-center border border-[#0A4D34]/20 shrink-0">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">{user.name}</div>
                  <div className="text-[10px] text-[#0A4D34] capitalize leading-tight">{user.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Avatar Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-medium transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu toggle */}
          {activeNavLinks.length > 0 && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-[#0E2F29] rounded-lg focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && activeNavLinks.length > 0 && (
        <div className="md:hidden bg-white border-b border-slate-200/80 px-6 py-6 space-y-4 shadow-lg animate-fade-in-up">
          <nav className="flex flex-col space-y-3">
            {activeNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base py-2 transition-colors border-b border-slate-100 ${
                    isActive
                      ? "font-bold text-[#0A4D34]"
                      : "font-medium text-slate-800 hover:text-[#0A4D34]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 space-y-2">
            {isPublicPage && (
              <Link
                href="/book"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-white hover:bg-secondary transition-colors shadow-sm"
              >
                <CalendarDays className="h-5 w-5 text-tertiary" />
                Book a Session
              </Link>
            )}
            {isDashboardRoute && user && (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="flex w-full h-11 items-center justify-center gap-2 rounded-full bg-rose-50 text-rose-700 font-semibold text-sm border border-rose-200 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
