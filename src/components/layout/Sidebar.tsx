'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { LogOut, ChevronRight, PanelLeftOpen, PanelLeftClose } from 'lucide-react';

export interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export interface SidebarProps {
  items: SidebarItem[];
  className?: string;
}

export default function Sidebar({
  items,
  className = '',
}: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const closeMobile = () => setIsExpanded(false);

  return (
    <>
      {/* Popover Backdrop for Mobile Overlay when Expanded */}
      {isExpanded && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 top-16 sm:top-20 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Fixed Popover Sidebar Container */}
      <aside
        className={`fixed top-16 sm:top-20 bottom-0 left-0 z-50 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 ease-in-out lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] lg:w-64 shrink-0 overflow-hidden ${
          isExpanded ? 'w-64 shadow-2xl' : 'w-16 lg:shadow-none'
        } ${className}`}
      >
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          <div>
            {/* Top Toggle Button for Small / Mobile Screens */}
            <div className="h-16 flex items-center justify-center lg:hidden border-b border-slate-100 px-3">
              <button
                onClick={toggleExpand}
                className="w-10 h-10 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-slate-600 flex items-center justify-center hover:bg-slate-100 hover:text-foreground transition cursor-pointer"
                title={isExpanded ? 'Collapse menu' : 'Expand menu'}
              >
                {isExpanded ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
              </button>
            </div>

            {/* Navigation Items List */}
            <nav className="p-2 sm:p-4 space-y-2 overflow-hidden">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={item.name}
                    onClick={closeMobile}
                    className={`group relative flex items-center gap-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
                      isExpanded
                        ? 'px-4 py-3.5 justify-start'
                        : 'p-3 justify-center lg:justify-start lg:px-4 lg:py-3.5'
                    } ${
                      isActive
                        ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-foreground'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-secondary'
                      }`}
                    />
                    <span className={`${isExpanded ? 'inline' : 'hidden lg:inline'} truncate`}>
                      {item.name}
                    </span>

                    {item.badge !== undefined && (
                      <span
                        className={`${isExpanded ? 'inline' : 'hidden lg:inline'} ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-secondary/10 text-secondary'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sign Out Footer */}
          <div className="p-2 sm:p-4 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={logout}
              title="Sign Out"
              className={`w-full flex items-center gap-2 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-100 transition cursor-pointer bg-white ${
                isExpanded
                  ? 'justify-between px-4 py-3'
                  : 'justify-center p-3 lg:justify-between lg:px-4 lg:py-3'
              }`}
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4 shrink-0" />
                <span className={`${isExpanded ? 'inline' : 'hidden lg:inline'}`}>Sign Out</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isExpanded ? 'inline' : 'hidden lg:inline'}`} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
