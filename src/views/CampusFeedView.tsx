import React from 'react';
import { CATEGORIES_CONFIG } from '../data/initialData';
import { CampusIssue, IssueCategory, IssueStatus } from '../types';
import { IssueCard } from '../components/IssueCard';

interface CampusFeedViewProps {
  issues: CampusIssue[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: IssueCategory | 'all';
  onSelectCategory: (cat: IssueCategory | 'all') => void;
  selectedStatus: IssueStatus | 'all';
  onSelectStatus: (status: IssueStatus | 'all') => void;
  onOpenFilter: () => void;
  onOpenReport: () => void;
  onSelectIssue: (issue: CampusIssue) => void;
  onUpvote: (id: string, e: React.MouseEvent) => void;
  onShare: (issue: CampusIssue, e: React.MouseEvent) => void;
  onOpenProfile: () => void;
}

export const CampusFeedView: React.FC<CampusFeedViewProps> = ({
  issues,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  onOpenFilter,
  onOpenReport,
  onSelectIssue,
  onUpvote,
  onShare,
  onOpenProfile,
}) => {
  // Counts calculation
  const underReviewCount = issues.filter((i) => i.status === 'under_review').length + 36;
  const inProgressCount = issues.filter((i) => i.status === 'in_progress').length + 12;
  const resolvedCount = issues.filter((i) => i.status === 'resolved').length + 181;

  // Filter issues for display
  const filteredIssues = issues.filter((issue) => {
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && issue.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(q) ||
        issue.location.toLowerCase().includes(q) ||
        issue.category.toLowerCase().includes(q) ||
        issue.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Greeting & Privacy Shield Banner */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
              Hello, Student{' '}
              <span className="inline-block hover:rotate-12 transition-transform duration-300 origin-bottom-right cursor-default text-xl">
                👋
              </span>
            </h1>
            <p className="text-xs text-zinc-400 font-medium">North Campus • Term II Session</p>
          </div>
          <button
            onClick={onOpenProfile}
            type="button"
            className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400 shadow-sm hover:border-zinc-700 transition-colors"
            aria-label="Verified user status"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
          </button>
        </div>

        {/* Anonymous Shield Notice */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">lock</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">
              Anonymous Shield Active
            </span>
            <p className="text-xs text-zinc-400 truncate">
              Your identity is strictly shielded from peers and campus staff.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Search Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-4 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all shadow-sm">
          <span className="material-symbols-outlined text-zinc-500 text-[20px]">search</span>
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search campus issues by hall, lab, or keyword..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-zinc-500 hover:text-zinc-200"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>
        <button
          id="filter-toggle-button"
          onClick={onOpenFilter}
          aria-label="Filter issues"
          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-all border ${
            selectedCategory !== 'all' || selectedStatus !== 'all'
              ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20'
              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
        </button>
      </div>

      {/* Prominent Bento Hero Action Card */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-xl flex flex-col justify-between">
        {/* Glow Element from Bento design */}
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1.5">
              <span className="w-fit bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Swift Resolution Engine
              </span>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 leading-tight mt-1">
                Spotted a campus issue?
              </h2>
              <p className="text-xs text-zinc-400 max-w-sm">
                Fast-track repairs with instant photo upload and automated GPS building tags.
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-blue-400 shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[24px]">add_a_photo</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 relative z-10">
            <button
              id="hero-report-button"
              onClick={onOpenReport}
              className="bg-white text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Report an Issue</span>
            </button>
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
              <span className="material-symbols-outlined text-[16px] text-blue-400">bolt</span>
              <span>Takes &lt; 45s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Status Pulse - Bento Grid Style */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Campus Status Pulse
          </span>
          <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Facilities Feed
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {/* Card 1: Under Review */}
          <div
            onClick={() => onSelectStatus(selectedStatus === 'under_review' ? 'all' : 'under_review')}
            className={`flex flex-col p-4 rounded-2xl bg-zinc-900 border transition-all cursor-pointer ${
              selectedStatus === 'under_review'
                ? 'border-amber-500/80 bg-zinc-800/80 ring-1 ring-amber-500'
                : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-base">
                ⏱️
              </div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                Review
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl md:text-3xl font-bold text-zinc-100">{underReviewCount}</p>
              <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">Under Review</p>
            </div>
          </div>

          {/* Card 2: In Progress */}
          <div
            onClick={() => onSelectStatus(selectedStatus === 'in_progress' ? 'all' : 'in_progress')}
            className={`flex flex-col p-4 rounded-2xl bg-zinc-900 border transition-all cursor-pointer ${
              selectedStatus === 'in_progress'
                ? 'border-blue-500/80 bg-zinc-800/80 ring-1 ring-blue-500'
                : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-base">
                ⚙️
              </div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                Active
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl md:text-3xl font-bold text-zinc-100">{inProgressCount}</p>
              <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">In Progress</p>
            </div>
          </div>

          {/* Card 3: Resolved */}
          <div
            onClick={() => onSelectStatus(selectedStatus === 'resolved' ? 'all' : 'resolved')}
            className={`flex flex-col p-4 rounded-2xl bg-zinc-900 border transition-all cursor-pointer ${
              selectedStatus === 'resolved'
                ? 'border-emerald-500/80 bg-zinc-800/80 ring-1 ring-emerald-500'
                : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-base">
                ✨
              </div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                Done
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl md:text-3xl font-bold text-zinc-100">{resolvedCount}</p>
              <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">Resolved (Mo)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Shortcuts */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Categories
            </span>
            {selectedCategory !== 'all' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                {selectedCategory}
              </span>
            )}
          </div>
          {selectedCategory !== 'all' ? (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-[11px] font-semibold text-blue-400 hover:underline"
              type="button"
            >
              Clear filter
            </button>
          ) : (
            <button
              onClick={onOpenFilter}
              className="text-[11px] font-semibold text-zinc-400 hover:text-zinc-200"
              type="button"
            >
              Explore all →
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES_CONFIG.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'all' : (cat.id as IssueCategory))}
                className={`flex flex-col items-center justify-center p-2.5 py-3 rounded-2xl transition-all group border ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 text-blue-400 shadow-md shadow-blue-900/20'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/50'
                }`}
                type="button"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                </div>
                <span className="text-[11px] font-semibold mt-1.5 truncate max-w-full">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Trending & Urgent Issues Section */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-zinc-100 tracking-tight uppercase tracking-wider">
              Urgent Community Attention
            </h2>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            LIVE FEED
          </span>
        </div>

        {/* Issue Cards */}
        {filteredIssues.length === 0 ? (
          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 text-center flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-4xl text-zinc-600">search_off</span>
            <p className="text-sm font-semibold text-zinc-100">No matching issues found</p>
            <p className="text-xs text-zinc-400">
              Try adjusting your search terms or clearing category filters.
            </p>
            <button
              onClick={() => {
                onSelectCategory('all');
                onSelectStatus('all');
                onSearchChange('');
              }}
              className="mt-2 text-xs font-semibold px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl hover:bg-zinc-700 transition-colors"
              type="button"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onUpvote={onUpvote}
                onShare={onShare}
                onSelect={onSelectIssue}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
