import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Share2,
  Bookmark,
  BookmarkCheck,
  Printer,
  Sparkles,
  ArrowLeft,
  Check,
  ShieldCheck,
  TrendingDown,
  Navigation,
  Users,
  Clock,
} from 'lucide-react';
import { TripResult } from '../types/travel';
import { formatCurrency } from '../utils/currency';

interface TripSummaryHeaderProps {
  trip: TripResult;
  onEditTrip: () => void;
  onSaveTrip: (trip: TripResult) => void;
  isSaved?: boolean;
}

export const TripSummaryHeader: React.FC<TripSummaryHeaderProps> = ({
  trip,
  onEditTrip,
  onSaveTrip,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [savedLocally, setSavedLocally] = useState(isSaved);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSave = () => {
    onSaveTrip(trip);
    setSavedLocally(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const { origin, destination, duration_days, budget, currency, travelers = 1, travel_date } = trip.trip;
  const { estimated_total, remaining_budget, percent_allocated } = trip.summary;
  const dataMode = trip.data_mode || (trip.mode === 'live' ? 'live' : 'demo');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Top Meta Line & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start sm:items-center gap-3">
          <button
            onClick={onEditTrip}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors mt-0.5 sm:mt-0"
            title="Modify trip parameters"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                COMPLETE ROUND-TRIP JOURNEY
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  dataMode === 'live'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : dataMode === 'estimated'
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {dataMode === 'live' ? '● Verified Live' : dataMode === 'estimated' ? 'Estimated Tariffs' : 'Demo Plan'}
              </span>
            </div>

            {/* Prominent Origin -> Destination Flow (Section 28) */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold text-lg sm:text-2xl">
                <Navigation className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{origin}</span>
              </div>
              <span className="text-slate-400 font-black text-lg">➔</span>
              <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-lg sm:text-2xl">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{destination}</span>
              </div>
              <span className="text-slate-400 font-black text-lg hidden sm:inline">➔</span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                (Returns to {origin.split(',')[0]})
              </span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleSave}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              savedLocally
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {savedLocally ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                <span>Saved to My Trips</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save Journey</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Copy share link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Print or export PDF"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* 5 Stat Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Stat 1: Duration & Travelers */}
        <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/60">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Duration &amp; Party</span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-slate-900">
            {duration_days} Days
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-400" />
            <span>{travelers} Traveler{travelers > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Stat 2: Total Budget Ceiling */}
        <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/60">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Total Budget Ceiling</span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold font-mono text-slate-900">
            {formatCurrency(budget, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Hard traveler limit
          </div>
        </div>

        {/* Stat 3: Estimated Optimized Cost */}
        <div className="bg-blue-50/60 rounded-xl p-3.5 border border-blue-200/70">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-800 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Optimized Total Cost</span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold font-mono text-blue-900">
            {formatCurrency(estimated_total, currency)}
          </div>
          <div className="text-[11px] text-blue-700 font-medium mt-0.5">
            {percent_allocated}% of budget used
          </div>
        </div>

        {/* Stat 4: Remaining Buffer */}
        <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-200/70">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Retained Cash Buffer</span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold font-mono text-emerald-900">
            +{formatCurrency(remaining_budget, currency)}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
            Unallocated emergency cushion
          </div>
        </div>

        {/* Stat 5: Feasibility & Risk Score */}
        <div className="col-span-2 md:col-span-1 bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/60">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Feasibility &amp; Risk</span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-emerald-700 uppercase">
            {trip.feasibility?.status === 'feasible' ? '✓ Feasible' : 'Needs Adjust'}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 capitalize">
            Risk: {trip.risk?.level || 'Low'}
          </div>
        </div>
      </div>
    </div>
  );
};
