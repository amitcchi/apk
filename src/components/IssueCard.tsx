import React from 'react';
import { CampusIssue } from '../types';

interface IssueCardProps {
  issue: CampusIssue;
  onUpvote: (id: string, e: React.MouseEvent) => void;
  onShare: (issue: CampusIssue, e: React.MouseEvent) => void;
  onSelect: (issue: CampusIssue) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  onUpvote,
  onShare,
  onSelect,
}) => {
  const getStatusBadge = () => {
    switch (issue.status) {
      case 'in_progress':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            In Progress
          </span>
        );
      case 'under_review':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Under Review
          </span>
        );
      case 'resolved':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Resolved
          </span>
        );
    }
  };

  return (
    <article
      id={`issue-card-${issue.id}`}
      onClick={() => onSelect(issue)}
      className="group flex flex-col rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 p-5 shadow-lg relative overflow-hidden cursor-pointer"
    >
      <div className="flex flex-col gap-3">
        {/* Tags & Priority Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase tracking-wider">
              {issue.secondaryTag || issue.category}
            </span>

            {issue.priorityScore >= 70 && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_fire_department
                </span>
                <span>{issue.priorityScore} HIGH</span>
              </span>
            )}
          </div>

          {getStatusBadge()}
        </div>

        {/* Issue Title & Location */}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-zinc-100 tracking-tight leading-snug group-hover:text-blue-400 transition-colors">
            {issue.title}
          </h3>
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <span className="material-symbols-outlined text-[16px] text-zinc-500">
              location_on
            </span>
            <span className="truncate">{issue.location}</span>
          </div>
        </div>

        {/* Photo Evidence Attachment */}
        {issue.imageUrl && (
          <div className="w-full h-40 rounded-2xl overflow-hidden relative shadow-inner bg-zinc-950 border border-zinc-800/80">
            <img
              src={issue.imageUrl}
              alt={issue.imageAlt || issue.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-zinc-900/85 backdrop-blur-md text-zinc-200 border border-zinc-700/80 text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[14px] text-blue-400">photo_camera</span>
              <span>Student Evidence</span>
            </div>
          </div>
        )}

        {/* Live Status Bar / ETA Notice */}
        {issue.etaNotice && (
          <div className="p-2.5 px-3 rounded-xl bg-zinc-800/70 border border-zinc-700/50 flex items-center gap-2 text-zinc-200">
            <span className="material-symbols-outlined text-blue-400 text-[18px]">
              build_circle
            </span>
            <span className="text-xs font-medium truncate">{issue.etaNotice}</span>
          </div>
        )}

        {/* Footer / Community Action & Anonymity */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <span className="material-symbols-outlined text-[16px] text-zinc-500">
              account_circle
            </span>
            <span>
              {issue.isAnonymous ? 'Anonymous Student' : issue.reportedBy} •{' '}
              {issue.reportedTimeAgo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`upvote-btn-${issue.id}`}
              onClick={(e) => onUpvote(issue.id, e)}
              className={`h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                issue.hasUpvoted
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 hover:text-white'
              }`}
              type="button"
              aria-label={`Upvote issue, current votes ${issue.upvotes}`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{
                  fontVariationSettings: issue.hasUpvoted ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                arrow_upward
              </span>
              <span className="vote-count tabular-nums">{issue.upvotes}</span>
            </button>

            <button
              id={`share-btn-${issue.id}`}
              onClick={(e) => onShare(issue, e)}
              aria-label="Share or repost issue"
              className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">repeat</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
