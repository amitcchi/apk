import React, { useState } from 'react';
import { CAMPUS_ZONES, CATEGORIES_CONFIG } from '../data/initialData';
import { CampusIssue, IssueCategory, IssueStatus } from '../types';
import { IssueCard } from '../components/IssueCard';

interface ExploreViewProps {
  issues: CampusIssue[];
  onSelectIssue: (issue: CampusIssue) => void;
  onUpvote: (id: string, e: React.MouseEvent) => void;
  onShare: (issue: CampusIssue, e: React.MouseEvent) => void;
  onOpenReport: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  issues,
  onSelectIssue,
  onUpvote,
  onShare,
  onOpenReport,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | 'all'>('all');
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [selectedMapBuilding, setSelectedMapBuilding] = useState<string | null>(null);

  // Filter logic
  const filteredIssues = issues.filter((issue) => {
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && issue.status !== selectedStatus) return false;
    if (selectedZone !== 'All Zones' && issue.zone !== selectedZone) return false;
    if (selectedMapBuilding && issue.zone !== selectedMapBuilding) return false;
    return true;
  });

  const buildings = [
    { name: 'Central Library', x: 28, y: 35, issuesCount: 1, color: '#fd651e' },
    { name: 'Science Block C', x: 70, y: 30, issuesCount: 1, color: '#fd651e' },
    { name: 'Engineering Quad', x: 25, y: 72, issuesCount: 1, color: '#1e40af' },
    { name: 'Student Union', x: 65, y: 65, issuesCount: 1, color: '#1e40af' },
    { name: 'South Residential Quad', x: 48, y: 88, issuesCount: 1, color: '#00563a' },
  ];

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">
            Explore Campus Issues
          </h1>
          <p className="text-xs text-zinc-400">Interactive campus zone pulse &amp; hotspots</p>
        </div>

        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
          <button
            onClick={() => {
              setViewMode('list');
              setSelectedMapBuilding(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">view_list</span>
            <span>List</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'map'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">map</span>
            <span>Map</span>
          </button>
        </div>
      </div>

      {/* Interactive Map View */}
      {viewMode === 'map' && (
        <div className="flex flex-col gap-3">
          <div className="relative w-full h-72 sm:h-80 rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden p-4 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-bold text-blue-400 bg-zinc-900/90 border border-zinc-800 px-3 py-1 rounded-full shadow-sm">
                North Campus Spatial Grid
              </span>
              <span className="text-[11px] text-zinc-400 bg-zinc-900/90 border border-zinc-800 px-2.5 py-0.5 rounded-full shadow-sm">
                Tap building to filter
              </span>
            </div>

            {/* Campus SVG Layout */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="campus-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path
                    d="M 30 0 L 0 0 0 30"
                    fill="none"
                    stroke="#52525b"
                    strokeWidth="0.8"
                    strokeDasharray="2,2"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#campus-grid)" />
              {/* Campus Roads / Paths */}
              <path
                d="M 30 140 Q 150 120 380 160"
                stroke="#3b82f6"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 160 30 Q 180 180 190 320"
                stroke="#3b82f6"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            {/* Interactive Building Nodes */}
            <div className="absolute inset-0 z-10 pointer-events-auto">
              {buildings.map((b) => {
                const isSelected = selectedMapBuilding === b.name;
                return (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() =>
                      setSelectedMapBuilding(selectedMapBuilding === b.name ? null : b.name)
                    }
                    style={{ left: `${b.x}%`, top: `${b.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center cursor-pointer"
                  >
                    <div
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md transition-all ${
                        isSelected
                          ? 'scale-125 ring-4 ring-blue-500 ring-offset-2 ring-offset-zinc-950'
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: b.color }}
                    >
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-100 text-[9px] font-bold flex items-center justify-center shadow">
                        {b.issuesCount}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 whitespace-nowrap shadow-sm transition-all border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-zinc-900/95 text-zinc-300 border-zinc-800 group-hover:border-zinc-700'
                      }`}
                    >
                      {b.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Legend footer */}
            <div className="flex items-center gap-3 z-10 text-[10px] font-semibold bg-zinc-900/90 border border-zinc-800 p-2 rounded-xl backdrop-blur-md shadow-sm self-start">
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> High Urgency
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> In Review
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Resolved
              </span>
            </div>
          </div>

          {selectedMapBuilding && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <span>Filtering by zone: {selectedMapBuilding}</span>
              <button
                type="button"
                onClick={() => setSelectedMapBuilding(null)}
                className="underline hover:text-blue-300"
              >
                Reset Map
              </button>
            </div>
          )}
        </div>
      )}

      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
          }`}
          type="button"
        >
          All Categories
        </button>
        {CATEGORIES_CONFIG.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(active ? 'all' : (cat.id as IssueCategory))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors ${
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Status Filter Chips */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {(['all', 'under_review', 'in_progress', 'resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors border ${
                selectedStatus === st
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
              }`}
              type="button"
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="text-xs font-medium px-2.5 py-1 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-200 focus:outline-none focus:border-zinc-700"
        >
          {CAMPUS_ZONES.map((z) => (
            <option key={z} value={z} className="bg-zinc-900 text-zinc-200">
              {z}
            </option>
          ))}
        </select>
      </div>

      {/* Issues List */}
      <div className="flex flex-col gap-3">
        {filteredIssues.length === 0 ? (
          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 text-center flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-zinc-600">search_off</span>
            <p className="text-sm font-semibold text-zinc-100">
              No issues match current filters
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSelectedZone('All Zones');
                setSelectedMapBuilding(null);
              }}
              className="text-xs font-semibold px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500"
              type="button"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onUpvote={onUpvote}
              onShare={onShare}
              onSelect={onSelectIssue}
            />
          ))
        )}
      </div>
    </div>
  );
};
