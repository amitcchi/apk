import React from 'react';
import { CAMPUS_ZONES, CATEGORIES_CONFIG } from '../data/initialData';
import { IssueCategory, IssueStatus } from '../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: IssueCategory | 'all';
  onSelectCategory: (cat: IssueCategory | 'all') => void;
  selectedStatus: IssueStatus | 'all';
  onSelectStatus: (status: IssueStatus | 'all') => void;
  selectedZone: string;
  onSelectZone: (zone: string) => void;
  sortBy: 'urgency' | 'upvotes' | 'newest';
  onSelectSortBy: (sort: 'urgency' | 'upvotes' | 'newest') => void;
  onReset: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  selectedZone,
  onSelectZone,
  sortBy,
  onSelectSortBy,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="filter-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        id="filter-modal-content"
        className="w-full sm:max-w-md bg-zinc-950 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl border border-zinc-800 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-950/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400 text-[20px]">tune</span>
            <h3 className="font-semibold text-base text-zinc-100">Filter Campus Issues</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Status */}
          <div>
            <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2 block">
              Resolution Status
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['all', 'under_review', 'in_progress', 'resolved'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onSelectStatus(status)}
                  className={`py-2 px-1 text-xs font-semibold rounded-xl text-center capitalize transition-colors border ${
                    selectedStatus === status
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2 block">
              Sort By Priority
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'urgency', label: 'Urgency 🔥' },
                { id: 'upvotes', label: 'Top Voted ⬆' },
                { id: 'newest', label: 'Newest 🕒' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectSortBy(s.id as 'urgency' | 'upvotes' | 'newest')}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl text-center transition-colors border ${
                    sortBy === s.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Campus Zone */}
          <div>
            <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2 block">
              Campus Zone / Building
            </label>
            <select
              value={selectedZone}
              onChange={(e) => onSelectZone(e.target.value)}
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-200 focus:outline-none focus:border-blue-500"
            >
              {CAMPUS_ZONES.map((zone) => (
                <option key={zone} value={zone} className="bg-zinc-900 text-zinc-200">
                  {zone}
                </option>
              ))}
            </select>
          </div>

          {/* Categories */}
          <div>
            <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2 block">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES_CONFIG.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectCategory(c.id as IssueCategory)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 border ${
                    selectedCategory === c.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-colors cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
