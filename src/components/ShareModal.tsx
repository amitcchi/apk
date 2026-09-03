import React, { useState } from 'react';
import { CampusIssue } from '../types';

interface ShareModalProps {
  issue: CampusIssue | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ issue, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !issue) return null;

  const issueUrl = `${window.location.origin}/#issue-${issue.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${issue.title} - ${issue.location} | CampusVoice: ${issueUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="share-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        id="share-modal-content"
        className="w-full sm:max-w-md bg-zinc-950 rounded-t-3xl sm:rounded-3xl p-5 flex flex-col gap-4 shadow-2xl border border-zinc-800 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-semibold text-base text-zinc-100">Share Campus Issue</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
          <span className="text-xs font-bold text-blue-400">{issue.category}</span>
          <span className="text-sm font-semibold text-zinc-100 line-clamp-1">{issue.title}</span>
          <span className="text-xs text-zinc-400">{issue.location}</span>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={issueUrl}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 select-all focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/30'
            }`}
          >
            {copied ? 'Copied! ✓' : 'Copy Link'}
          </button>
        </div>

        {/* Quick Social / Group Channels */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-medium text-zinc-200 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-blue-400 text-[20px]">forum</span>
            <span>Campus Discord</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-medium text-zinc-200 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-emerald-400 text-[20px]">chat</span>
            <span>Class WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-medium text-zinc-200 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-amber-400 text-[20px]">mail</span>
            <span>Email Rep</span>
          </button>
        </div>
      </div>
    </div>
  );
};
