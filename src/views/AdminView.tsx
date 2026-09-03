import React, { useState } from 'react';
import { CampusIssue, IssueStatus } from '../types';

interface AdminViewProps {
  issues: CampusIssue[];
  onUpdateStatus: (
    issueId: string,
    newStatus: IssueStatus,
    etaNotice?: string,
    technician?: string
  ) => void;
  onSelectIssue: (issue: CampusIssue) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  issues,
  onUpdateStatus,
  onSelectIssue,
}) => {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [customEta, setCustomEta] = useState('');
  const [technician, setTechnician] = useState('HVAC Unit 4 (Tech: M. Davies)');
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'all'>('all');

  const filtered = issues.filter((i) => {
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    return true;
  });

  const handleDispatch = (issueId: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const eta = customEta.trim() || `ETA: Facilities tech team dispatched at ${timeStr}`;
    onUpdateStatus(issueId, 'in_progress', eta, technician);
    setSelectedIssueId(null);
    setCustomEta('');
  };

  const handleResolve = (issueId: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    onUpdateStatus(
      issueId,
      'resolved',
      `Resolved: Work verified at ${timeStr}`,
      technician
    );
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400 text-[24px]">
              shield_person
            </span>
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">
              Facilities Operations
            </h1>
          </div>
          <p className="text-xs text-zinc-400">
            North Campus Maintenance &amp; Dispatch Console
          </p>
        </div>

        <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold px-3 py-1 rounded-full">
          Operational Admin
        </span>
      </div>

      {/* Facilities KPI Metrics */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg text-center">
          <span className="text-xl font-bold text-zinc-100">2.4 hrs</span>
          <p className="text-[10px] text-zinc-400 mt-0.5">Avg. Response Time</p>
        </div>
        <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg text-center">
          <span className="text-xl font-bold text-amber-400">5 Crews</span>
          <p className="text-[10px] text-zinc-400 mt-0.5">Active In Field</p>
        </div>
        <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg text-center">
          <span className="text-xl font-bold text-emerald-400">94%</span>
          <p className="text-[10px] text-zinc-400 mt-0.5">30-Day Clearance</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        {(['all', 'under_review', 'in_progress', 'resolved'] as const).map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              filterStatus === st
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Issues Management List */}
      <div className="flex flex-col gap-3">
        {filtered.map((issue) => {
          const isSelected = selectedIssueId === issue.id;
          return (
            <div
              key={issue.id}
              className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col gap-3.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-400 uppercase">
                      {issue.category}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
                      {issue.priorityScore} P-SCORE
                    </span>
                  </div>
                  <h3
                    onClick={() => onSelectIssue(issue)}
                    className="text-base font-semibold text-zinc-100 hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    {issue.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-zinc-400">
                    <span className="material-symbols-outlined text-[15px] text-zinc-500">location_on</span>
                    <span>{issue.location}</span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 border ${
                    issue.status === 'resolved'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : issue.status === 'in_progress'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  }`}
                >
                  {issue.status.replace('_', ' ')}
                </span>
              </div>

              {/* Current Status Info */}
              {issue.etaNotice && (
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-blue-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">build_circle</span>
                  <span>{issue.etaNotice}</span>
                </div>
              )}

              {/* Action Controls */}
              <div className="flex items-center justify-between pt-1 border-t border-zinc-800 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  {issue.status !== 'in_progress' && issue.status !== 'resolved' && (
                    <button
                      type="button"
                      onClick={() => setSelectedIssueId(isSelected ? null : issue.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                      <span>Dispatch Crew</span>
                    </button>
                  )}

                  {issue.status === 'in_progress' && (
                    <button
                      type="button"
                      onClick={() => handleResolve(issue.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Mark Resolved</span>
                    </button>
                  )}

                  {issue.status === 'resolved' && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(issue.id, 'in_progress', 'Re-opened for secondary check')}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold hover:bg-zinc-700 transition-colors"
                    >
                      Re-open Ticket
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectIssue(issue)}
                  className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  View Full Report →
                </button>
              </div>

              {/* Dispatch Drawer Subform */}
              {isSelected && (
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col gap-3 mt-2 animate-in fade-in duration-150">
                  <span className="text-xs font-bold text-zinc-100">
                    Dispatch Crew &amp; Issue Public ETA
                  </span>

                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">Assigned Crew</label>
                    <select
                      value={technician}
                      onChange={(e) => setTechnician(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="HVAC Unit 4 (Tech: M. Davies)" className="bg-zinc-900 text-zinc-200">
                        HVAC Unit 4 (Tech: M. Davies)
                      </option>
                      <option value="Plumbing Rapid Unit (Tech: K. Patel)" className="bg-zinc-900 text-zinc-200">
                        Plumbing Rapid Unit (Tech: K. Patel)
                      </option>
                      <option value="Campus IT Network Ops" className="bg-zinc-900 text-zinc-200">Campus IT Network Ops</option>
                      <option value="Electrical Repair Squad #2" className="bg-zinc-900 text-zinc-200">
                        Electrical Repair Squad #2
                      </option>
                      <option value="Campus Facilities Janitorial Team" className="bg-zinc-900 text-zinc-200">
                        Campus Facilities Janitorial Team
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">
                      Public ETA Announcement
                    </label>
                    <input
                      type="text"
                      value={customEta}
                      onChange={(e) => setCustomEta(e.target.value)}
                      placeholder="e.g. ETA: Facilities tech team dispatched at 10:15 AM"
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedIssueId(null)}
                      className="px-3.5 py-1.5 rounded-xl border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDispatch(issue.id)}
                      className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-colors cursor-pointer"
                    >
                      Confirm Dispatch
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
