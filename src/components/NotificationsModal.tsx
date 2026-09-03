import React from 'react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectNotification: (issueId?: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="notifications-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        id="notifications-modal-content"
        className="w-full sm:max-w-md bg-zinc-950 rounded-t-3xl sm:rounded-3xl max-h-[80vh] overflow-y-auto flex flex-col shadow-2xl border border-zinc-800 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-950/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400 text-[20px]">
              notifications
            </span>
            <h3 className="font-semibold text-base text-zinc-100">Campus Dispatch Alerts</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              type="button"
            >
              Mark Read
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onSelectNotification(n.issueId);
                onClose();
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                n.read
                  ? 'bg-zinc-900 border-zinc-800/80 opacity-70 hover:opacity-100'
                  : 'bg-zinc-900 border-blue-500/30 hover:border-blue-500/60'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                  n.type === 'dispatch'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : n.type === 'status_change'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {n.type === 'dispatch'
                    ? 'local_shipping'
                    : n.type === 'status_change'
                    ? 'check_circle'
                    : 'local_fire_department'}
                </span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-100 truncate">{n.title}</span>
                  <span className="text-[10px] text-zinc-500 shrink-0">{n.timeAgo}</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
