import React, { useState } from 'react';
import { CampusIssue } from '../types';

interface MyReportsViewProps {
  issues: CampusIssue[];
  onSelectIssue: (issue: CampusIssue) => void;
  onOpenReport: () => void;
  onConfirmResolution?: (issueId: string) => void;
}

export const MyReportsView: React.FC<MyReportsViewProps> = ({
  issues,
  onSelectIssue,
  onOpenReport,
  onConfirmResolution,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  // We consider issues 1, 2, and any newly submitted user issues as "user's reports"
  const myReports = issues.filter((i) => {
    if (filter === 'active') return i.status !== 'resolved';
    if (filter === 'resolved') return i.status === 'resolved';
    return true;
  });

  const getStepState = (status: CampusIssue['status'], stepIndex: number) => {
    // 0: Submitted, 1: Under Review, 2: In Progress / Dispatched, 3: Resolved
    let currentStep = 1;
    if (status === 'under_review') currentStep = 1;
    if (status === 'in_progress') currentStep = 2;
    if (status === 'resolved') currentStep = 3;

    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">My Submitted Reports</h1>
          <p className="text-xs text-zinc-400">Track resolution timeline &amp; facilities ETA</p>
        </div>
        <button
          onClick={onOpenReport}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>New Report</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        {(['all', 'active', 'resolved'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              filter === tab
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            {tab} Reports
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {myReports.length === 0 ? (
          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 text-center flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-4xl text-zinc-600">
              assignment_turned_in
            </span>
            <p className="text-sm font-semibold text-zinc-100">No reports in this category</p>
            <p className="text-xs text-zinc-400">
              Submit your first campus issue in under 45 seconds.
            </p>
            <button
              type="button"
              onClick={onOpenReport}
              className="mt-2 text-xs font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md shadow-blue-600/30"
            >
              Report an Issue Now
            </button>
          </div>
        ) : (
          myReports.map((item, idx) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col gap-3.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      #CV-{(idx + 101).toString()}
                    </span>
                    <span className="text-xs font-bold text-zinc-400 uppercase">
                      {item.category}
                    </span>
                  </div>
                  <h3
                    onClick={() => onSelectIssue(item)}
                    className="text-base font-semibold text-zinc-100 cursor-pointer hover:text-blue-400 leading-snug transition-colors"
                  >
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-zinc-400">
                    <span className="material-symbols-outlined text-[15px] text-zinc-500">location_on</span>
                    <span>{item.location}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      item.status === 'resolved'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : item.status === 'in_progress'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    }`}
                  >
                    {item.status.replace('_', ' ')}
                  </span>
                  <div className="text-[10px] text-zinc-500 mt-1">{item.reportedTimeAgo}</div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="pt-2.5 pb-1 border-t border-zinc-800">
                <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400 mb-2">
                  <span>Tracking Resolution</span>
                  <span className="text-blue-400 font-semibold">{item.upvotes} Community Votes</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 relative">
                  {['Submitted', 'Under Review', 'Dispatched', 'Resolved'].map((label, stepIdx) => {
                    const state = getStepState(item.status, stepIdx);
                    return (
                      <div key={label} className="flex flex-col items-center gap-1.5">
                        <div
                          className={`w-full h-1.5 rounded-full ${
                            state === 'completed' || state === 'current'
                              ? state === 'completed'
                                ? 'bg-emerald-500'
                                : 'bg-blue-500'
                              : 'bg-zinc-800'
                          }`}
                        />
                        <span
                          className={`text-[10px] font-medium text-center truncate max-w-full ${
                            state === 'current'
                              ? 'text-blue-400 font-bold'
                              : state === 'completed'
                              ? 'text-emerald-400'
                              : 'text-zinc-500'
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ETA / Dispatch notification if available */}
              {item.etaNotice && (
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    <span>{item.etaNotice}</span>
                  </div>
                  {item.status !== 'resolved' && onConfirmResolution && (
                    <button
                      type="button"
                      onClick={() => onConfirmResolution(item.id)}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      Confirm Resolved
                    </button>
                  )}
                </div>
              )}

              {/* Action row */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => onSelectIssue(item)}
                  className="font-semibold text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>View Details &amp; Timeline</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
                <span className="text-zinc-500">
                  {item.comments.length} updates logged
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
