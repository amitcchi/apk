import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  myReportsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  myReportsCount = 0,
}) => {
  return (
    <nav className="fixed bottom-0 w-full z-40 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800 shadow-[0_-4px_24px_rgba(0,0,0,0.5)] pb-safe">
      <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto h-20 px-2 flex items-center justify-around relative">
        {/* Home */}
        <button
          id="nav-home"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] h-12 gap-0.5 transition-colors ${
            activeTab === 'home'
              ? 'text-blue-400 font-semibold'
              : 'text-zinc-500 hover:text-zinc-200'
          }`}
          type="button"
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            home
          </span>
          <span className="text-[11px] font-medium tracking-wide">Home</span>
        </button>

        {/* Explore */}
        <button
          id="nav-explore"
          onClick={() => onSelectTab('explore')}
          className={`flex flex-col items-center justify-center min-w-[56px] h-12 gap-0.5 transition-colors ${
            activeTab === 'explore'
              ? 'text-blue-400 font-semibold'
              : 'text-zinc-500 hover:text-zinc-200'
          }`}
          type="button"
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: activeTab === 'explore' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            local_fire_department
          </span>
          <span className="text-[11px] font-medium tracking-wide">Explore</span>
        </button>

        {/* Elevated + Report Button */}
        <div className="relative flex flex-col items-center justify-center min-w-[64px]">
          <button
            id="nav-report"
            onClick={() => onSelectTab('report')}
            className={`-top-6 absolute w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all active:scale-95 ${
              activeTab === 'report'
                ? 'bg-blue-600 ring-4 ring-zinc-950 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white ring-4 ring-zinc-950'
            }`}
            type="button"
            aria-label="Report an issue"
          >
            <span className="material-symbols-outlined text-[28px]">add</span>
          </button>
          <span
            className={`text-[11px] mt-7 font-medium tracking-wide ${
              activeTab === 'report' ? 'text-blue-400 font-semibold' : 'text-zinc-500'
            }`}
          >
            + Report
          </span>
        </div>

        {/* My Reports */}
        <button
          id="nav-my-reports"
          onClick={() => onSelectTab('my-reports')}
          className={`relative flex flex-col items-center justify-center min-w-[56px] h-12 gap-0.5 transition-colors ${
            activeTab === 'my-reports'
              ? 'text-blue-400 font-semibold'
              : 'text-zinc-500 hover:text-zinc-200'
          }`}
          type="button"
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: activeTab === 'my-reports' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            fact_check
          </span>
          <span className="text-[11px] font-medium tracking-wide">My Reports</span>
          {myReportsCount > 0 && (
            <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
              {myReportsCount}
            </span>
          )}
        </button>

        {/* Admin */}
        <button
          id="nav-admin"
          onClick={() => onSelectTab('admin')}
          className={`flex flex-col items-center justify-center min-w-[56px] h-12 gap-0.5 transition-colors ${
            activeTab === 'admin'
              ? 'text-blue-400 font-semibold'
              : 'text-zinc-500 hover:text-zinc-200'
          }`}
          type="button"
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: activeTab === 'admin' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            shield_person
          </span>
          <span className="text-[11px] font-medium tracking-wide">Admin</span>
        </button>
      </div>
    </nav>
  );
};
