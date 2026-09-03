import React, { useState } from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  myReportsCount: number;
  totalUpvotesCount: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  myReportsCount,
  totalUpvotesCount,
}) => {
  const [shieldActive, setShieldActive] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      id="profile-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        id="profile-modal-content"
        className="w-full sm:max-w-md bg-zinc-950 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl border border-zinc-800 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-950/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400 text-[20px]">
              account_circle
            </span>
            <h3 className="font-semibold text-base text-zinc-100">Student Identity &amp; Privacy</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Avatar and Info */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
            <img
              alt="Student Avatar"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-zinc-700 shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxR7-leKbDM7UHsZNH29nDkLRJSubdXCecv5MXZ8ArMD9u1JLG0cwiP2zwSVmCy58cr-FGwMaLAuFbuGGZcNpBylREnF6IPoS0HEwzRx4fpmxaEgg19Y-YLQLNv8ZVKnjcblMi6T63GP9qAgPJ6HodcC_DVWWsMRTyUsEQWZ-EE9F8mImSj-Wfo42A1jgUtcuosH4sIZ3F60O-41ffj7V9kjUbpxxmOyvQkxeOLwIGPihqQyUSDGIg"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-zinc-100 text-base">North Campus Student</span>
                <span className="material-symbols-outlined text-blue-400 text-[18px]">
                  verified
                </span>
              </div>
              <span className="text-xs text-zinc-400">ID: #NC-2026-884 • Term II Session</span>
              <span className="text-[11px] text-zinc-500 mt-0.5">
                Role: Verified Student Reporter
              </span>
            </div>
          </div>

          {/* Privacy Shield Control */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-100">
                  Anonymous Shield Protection
                </span>
                <span className="text-[11px] text-zinc-400">
                  Cryptographically hashes student ID on reports
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShieldActive(!shieldActive)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                shieldActive ? 'bg-blue-600' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  shieldActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Student Contribution Impact */}
          <div>
            <span className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2 block">
              Campus Impact Footprint
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-2xl font-bold text-zinc-100">{myReportsCount}</span>
                <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Tickets Submitted</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-2xl font-bold text-blue-400">{totalUpvotesCount}</span>
                <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Community Upvotes</p>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-zinc-500 text-center leading-relaxed">
            CampusVoice North Campus Portal operates under University Student Senate Resolution
            #44-C. Reports directly sync to Campus Facilities dispatch.
          </div>
        </div>
      </div>
    </div>
  );
};
