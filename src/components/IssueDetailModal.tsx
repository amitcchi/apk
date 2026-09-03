import React, { useState } from 'react';
import { CampusIssue } from '../types';

interface IssueDetailModalProps {
  issue: CampusIssue | null;
  onClose: () => void;
  onUpvote: (id: string, e: React.MouseEvent) => void;
  onAddComment: (issueId: string, text: string) => void;
  onStatusChange?: (issueId: string, newStatus: CampusIssue['status']) => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  onClose,
  onUpvote,
  onAddComment,
  onStatusChange,
}) => {
  const [commentText, setCommentText] = useState('');

  if (!issue) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(issue.id, commentText.trim());
    setCommentText('');
  };

  const getStatusBadge = () => {
    switch (issue.status) {
      case 'in_progress':
        return (
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
            In Progress
          </span>
        );
      case 'under_review':
        return (
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
            Under Review
          </span>
        );
      case 'resolved':
        return (
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            Resolved
          </span>
        );
    }
  };

  return (
    <div
      id="issue-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="issue-detail-modal-content"
        className="w-full sm:max-w-lg bg-zinc-950 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl border border-zinc-800 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-md z-10 px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase">
              {issue.category}
            </span>
            {getStatusBadge()}
          </div>
          <button
            id="close-detail-modal-btn"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-4">
          {/* Photo Evidence */}
          {issue.imageUrl && (
            <div className="w-full h-56 rounded-2xl overflow-hidden relative shadow-md bg-zinc-900 border border-zinc-800">
              <img
                src={issue.imageUrl}
                alt={issue.imageAlt || issue.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800 text-zinc-200 text-xs font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-400">photo_camera</span>
                <span>Verified Evidence Photo</span>
              </div>
            </div>
          )}

          {/* Title & Location */}
          <div>
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight leading-snug">
              {issue.title}
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-zinc-400 mt-1">
              <span className="material-symbols-outlined text-[18px] text-blue-400">
                location_on
              </span>
              <span>{issue.location}</span>
            </div>
          </div>

          {/* ETA / Facilities Notice Box */}
          {issue.etaNotice ? (
            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-blue-400 text-[22px] shrink-0 mt-0.5">
                build_circle
              </span>
              <div className="flex flex-col text-xs">
                <span className="font-bold text-blue-400">Facilities Status</span>
                <span className="text-zinc-200 font-medium mt-0.5">{issue.etaNotice}</span>
                {issue.assignedTechnician && (
                  <span className="text-zinc-400 mt-1">
                    Assigned: {issue.assignedTechnician}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="material-symbols-outlined text-zinc-500 text-[18px]">
                  hourglass_top
                </span>
                <span>Pending Facilities Assignment</span>
              </div>
              {onStatusChange && (
                <button
                  onClick={() => onStatusChange(issue.id, 'in_progress')}
                  className="text-blue-400 font-semibold hover:underline"
                  type="button"
                >
                  Dispatch Tech
                </button>
              )}
            </div>
          )}

          {/* Description */}
          <div className="flex flex-col gap-1 text-sm text-zinc-300 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
            <span className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
              Issue Report Details
            </span>
            <p className="mt-1 leading-relaxed text-zinc-300">{issue.description}</p>
          </div>

          {/* Voting and Engagement Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-2">
              <button
                id={`modal-upvote-btn-${issue.id}`}
                onClick={(e) => onUpvote(issue.id, e)}
                className={`h-10 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
                  issue.hasUpvoted
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                }`}
                type="button"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{
                    fontVariationSettings: issue.hasUpvoted ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  arrow_upward
                </span>
                <span>{issue.upvotes} Upvotes</span>
              </button>
            </div>

            <span className="text-xs text-zinc-400">
              {issue.isAnonymous ? 'Shielded Anonymous Author' : issue.reportedBy}
            </span>
          </div>

          {/* Comments Section */}
          <div className="flex flex-col gap-2.5 pt-2">
            <h4 className="text-sm font-bold text-zinc-100 flex items-center justify-between">
              <span>Community Discussion &amp; Updates</span>
              <span className="text-xs font-normal text-zinc-400">
                {issue.comments.length} updates
              </span>
            </h4>

            <div className="flex flex-col gap-2">
              {issue.comments.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-3 text-center bg-zinc-900 rounded-xl border border-zinc-800">
                  No community comments yet. Be the first to share an update!
                </p>
              ) : (
                issue.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                        {comment.author}
                        {comment.isOfficial && (
                          <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Staff
                          </span>
                        )}
                      </span>
                      <span className="text-zinc-500 text-[11px]">{comment.timeAgo}</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{comment.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-2">
              <input
                id="comment-input"
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add verified update or note..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-blue-500 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
              />
              <button
                id="submit-comment-btn"
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-colors shrink-0 cursor-pointer"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
