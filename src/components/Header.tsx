import React from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const getSubtitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Campus Feed';
      case 'explore':
        return 'Explore & Trends';
      case 'report':
        return 'Report Issue';
      case 'my-reports':
        return 'My Submissions';
      case 'admin':
        return 'Facilities Operations';
      default:
        return 'Campus Feed';
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800/80 shadow-lg shadow-black/20">
      <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-md shadow-blue-600/30">
            CV
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg text-zinc-100 tracking-tight leading-none">
                CampusVoice
              </span>
              <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                North Campus
              </span>
            </div>
            <span className="text-[11px] font-medium text-zinc-400 leading-tight">
              {getSubtitle()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="notifications-button"
            aria-label="Notifications"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors active:scale-95 border border-transparent hover:border-zinc-700"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-zinc-950" />
            )}
          </button>

          <button
            id="profile-button"
            aria-label="Student Profile"
            onClick={onOpenProfile}
            className="w-9 h-9 flex items-center justify-center rounded-full ring-2 ring-zinc-800 hover:ring-blue-500 transition-all overflow-hidden active:scale-95 bg-zinc-800"
            type="button"
          >
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxR7-leKbDM7UHsZNH29nDkLRJSubdXCecv5MXZ8ArMD9u1JLG0cwiP2zwSVmCy58cr-FGwMaLAuFbuGGZcNpBylREnF6IPoS0HEwzRx4fpmxaEgg19Y-YLQLNv8ZVKnjcblMi6T63GP9qAgPJ6HodcC_DVWWsMRTyUsEQWZ-EE9F8mImSj-Wfo42A1jgUtcuosH4sIZ3F60O-41ffj7V9kjUbpxxmOyvQkxeOLwIGPihqQyUSDGIg"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
