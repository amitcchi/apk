import React, { useState, useRef } from 'react';
import { CAMPUS_ZONES, CATEGORIES_CONFIG } from '../data/initialData';
import { CampusIssue, IssueCategory, IssuePriority } from '../types';

interface ReportIssueViewProps {
  onSubmitIssue: (newIssue: Omit<CampusIssue, 'id' | 'timestamp' | 'upvotes' | 'comments'>) => void;
  onCancel: () => void;
}

const SAMPLE_PRESETS = [
  {
    label: 'Broken AC / Heat',
    title: 'Faulty AC unit blowing warm air in study hall',
    category: 'Electricity' as IssueCategory,
    zone: 'Central Library',
    location: 'Main Library, Reading Room 2B',
    priority: 'high' as IssuePriority,
    priorityScore: 92,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCo6mI_SjKCsFb3rhWFLpHIdKOhEWoP0Rlq_LyRKLxyP2wwCClT4YGhB4Da-Oyy9DJWwwnOw3NT_6cC9c5ciBAJEOI6iSQcnNJ1wmNxlRkj1yaOQ7Qbidbir9lU8xB75OsrQdhg4csrRVJ3UAJrOyoFNtiVXvG5Ct6_lzE17nSUXi-74i-zvGhq5dgv6EoZwUzi3UYtJ_dBmvjqryb7y6nQjviiFI16BQ_lOxzdj7-UC81g4fFO7Yww',
  },
  {
    label: 'Water Leak',
    title: 'Water pooling on corridor floor near lab entrance',
    category: 'Water' as IssueCategory,
    zone: 'Science Block C',
    location: 'Science Block C, 1st Floor Corridor',
    priority: 'high' as IssuePriority,
    priorityScore: 88,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDGEvYh8gB9ct5y7wPqyO2rJRC0UbnV6Pd3wllMEJEwnrsMh6WJtLFwIbBW3vVs4Wdn8cWa3QEjdv3EjQd0C5vm9POUK_ZJOlzyXQQ3juQCm9WGqxR4sIfvQToC__3EFvykFQjGIfs27QPJ4ma7gHr0R6ZAaKXOuJ9VXfQD2jOz4aSibWCnV5J2D5O7WkVG7LwDon-3Cekp6Nzogc9dIw1agO37ud5yCEOhRxvddwj6EZW1yrP8WyQl',
  },
  {
    label: 'Wi-Fi Outage',
    title: 'Campus Eduroam signal dropping in auditorium',
    category: 'Wi-Fi' as IssueCategory,
    zone: 'Engineering Quad',
    location: 'Auditorium 101, Rows A-F',
    priority: 'medium' as IssuePriority,
    priorityScore: 75,
    imageUrl:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
  },
];

export const ReportIssueView: React.FC<ReportIssueViewProps> = ({
  onSubmitIssue,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Electricity');
  const [zone, setZone] = useState('Central Library');
  const [location, setLocation] = useState('Reading Hall B');
  const [priorityLevel, setPriorityLevel] = useState<IssuePriority>('high');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCo6mI_SjKCsFb3rhWFLpHIdKOhEWoP0Rlq_LyRKLxyP2wwCClT4YGhB4Da-Oyy9DJWwwnOw3NT_6cC9c5ciBAJEOI6iSQcnNJ1wmNxlRkj1yaOQ7Qbidbir9lU8xB75OsrQdhg4csrRVJ3UAJrOyoFNtiVXvG5Ct6_lzE17nSUXi-74i-zvGhq5dgv6EoZwUzi3UYtJ_dBmvjqryb7y6nQjviiFI16BQ_lOxzdj7-UC81g4fFO7Yww'
  );
  const [gpsTagging, setGpsTagging] = useState(false);
  const [gpsDetected, setGpsDetected] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApplyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setZone(preset.zone);
    setLocation(preset.location);
    setPriorityLevel(preset.priority);
    setImageUrl(preset.imageUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectGPS = () => {
    setGpsTagging(true);
    setTimeout(() => {
      setGpsTagging(false);
      setGpsDetected(true);
      setZone('Central Library');
      setLocation('Main Library (GPS Verified ±3m)');
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    setSubmitting(true);
    const score = priorityLevel === 'critical' ? 98 : priorityLevel === 'high' ? 88 : 65;

    setTimeout(() => {
      onSubmitIssue({
        title: title.trim(),
        description:
          description.trim() ||
          'Reported by on-site campus student via Swift Resolution Engine.',
        category,
        secondaryTag: category,
        priorityLevel,
        priorityScore: score,
        status: 'under_review',
        location: location.trim(),
        zone,
        imageUrl: imageUrl || undefined,
        reportedBy: isAnonymous ? 'Anonymous Student' : 'Verified Student #NC-884',
        isAnonymous,
        reportedTimeAgo: 'Just now',
      });
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onCancel}
            type="button"
            className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Report an Issue</h1>
            <p className="text-xs text-zinc-400">Swift Resolution Engine • Takes &lt; 45s</p>
          </div>
        </div>

        <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">bolt</span>
          <span>Fast Track</span>
        </span>
      </div>

      {/* Quick Autofill Presets */}
      <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            Quick Fill Demo Scenarios
          </span>
          <span className="text-[10px] text-blue-400 font-semibold">Tap to load</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SAMPLE_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 shrink-0 border border-zinc-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Photo Evidence Section */}
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-blue-400">add_a_photo</span>
              <span>Photo Evidence (Recommended)</span>
            </label>
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="text-xs text-rose-400 hover:underline"
              >
                Remove Photo
              </button>
            )}
          </div>

          {imageUrl ? (
            <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 group">
              <img src={imageUrl} alt="Uploaded evidence" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white text-xs font-bold text-black shadow"
                >
                  Change Photo
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-950 hover:bg-zinc-800/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 text-zinc-400"
            >
              <span className="material-symbols-outlined text-3xl text-blue-400">
                add_photo_alternate
              </span>
              <span className="text-xs font-semibold text-zinc-300">Click to snap photo or upload image</span>
              <span className="text-[10px] text-zinc-500">JPEG, PNG, HEIC up to 10MB</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Category Picker */}
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col gap-3">
          <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
            Issue Category
          </label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES_CONFIG.map((c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id as IssueCategory)}
                  className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 text-center transition-all border ${
                    active
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700/80 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{c.icon}</span>
                  <span className="text-[11px] font-semibold truncate max-w-full">{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title & Description */}
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col gap-3.5">
          <div>
            <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1.5 block">
              Issue Headline *
            </label>
            <input
              id="report-title-input"
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Broken AC & Extreme Heat in Central Library 2nd Floor"
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1.5 block">
              Additional Details (Optional)
            </label>
            <textarea
              id="report-description-input"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact room number, floor, or immediate hazard..."
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Location & GPS Geo-tag */}
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
              Location &amp; Geo-tag
            </label>
            <button
              type="button"
              onClick={handleDetectGPS}
              className="text-xs font-semibold text-blue-400 flex items-center gap-1 hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">my_location</span>
              <span>{gpsTagging ? 'Detecting...' : gpsDetected ? 'GPS Locked ✓' : 'Auto GPS'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <span className="text-[11px] text-zinc-400 mb-1 block font-medium">Campus Zone</span>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 focus:outline-none focus:border-blue-500"
              >
                {CAMPUS_ZONES.filter((z) => z !== 'All Zones').map((z) => (
                  <option key={z} value={z} className="bg-zinc-900 text-zinc-200">
                    {z}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 mb-1 block font-medium">Room / Hallway Detail</span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Reading Hall B, Floor 2"
                className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Urgency & Anonymous Controls */}
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col gap-3.5">
          <div>
            <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1.5 block">
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'medium', label: 'Medium', desc: 'Needs fix' },
                { id: 'high', label: 'High Priority 🔥', desc: 'Active hindrance' },
                { id: 'critical', label: 'Critical 🚨', desc: 'Safety hazard' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriorityLevel(p.id as IssuePriority)}
                  className={`p-2.5 rounded-2xl text-center flex flex-col border transition-all ${
                    priorityLevel === p.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700/80 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold">{p.label}</span>
                  <span className="text-[10px] opacity-85">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Anonymous toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-blue-400 text-[22px]">
                verified_user
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-100">Anonymous Reporting</span>
                <span className="text-[11px] text-zinc-400">
                  Shield student identity from faculty &amp; peers
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="w-1/3 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            Cancel
          </button>
          <button
            id="submit-issue-btn"
            type="submit"
            disabled={submitting || !title.trim()}
            className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
            <span>{submitting ? 'Dispatching...' : 'Submit Report (< 45s)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
