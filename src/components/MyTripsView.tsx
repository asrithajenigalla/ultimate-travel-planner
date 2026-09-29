import React, { useState } from 'react';
import {
  BookmarkCheck,
  Plus,
  Compass,
  Sparkles,
  Plane,
  Clock,
  Filter,
} from 'lucide-react';
import { SavedTripSummary } from '../types/travel';
import { TripCard } from './TripCard';

interface MyTripsViewProps {
  savedTrips: SavedTripSummary[];
  onViewTrip: (id: string) => void;
  onDeleteTrip: (id: string) => void;
  onPlanNewTrip: () => void;
}

export const MyTripsView: React.FC<MyTripsViewProps> = ({
  savedTrips,
  onViewTrip,
  onDeleteTrip,
  onPlanNewTrip,
}) => {
  const [filterTab, setFilterTab] = useState<'All' | 'Upcoming' | 'Saved' | 'Completed'>('All');

  const filteredTrips = savedTrips.filter((trip) => {
    if (filterTab === 'All') return true;
    return trip.category === filterTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              TRAVELER DASHBOARD
            </span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Saved Journeys
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            My Trips
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Your planned, optimized, and saved multi-agent travel itineraries.
          </p>
        </div>

        <button
          onClick={onPlanNewTrip}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Plan a New Journey</span>
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {(['All', 'Upcoming', 'Saved', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterTab === tab
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab}
            <span className="ml-1.5 text-[10px] opacity-75">
              (
              {tab === 'All'
                ? savedTrips.length
                : savedTrips.filter((t) => t.category === tab).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Trips Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onView={onViewTrip}
              onDelete={onDeleteTrip}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              No trips in this category
            </h3>
            <p className="text-xs text-slate-500">
              Plan your next adventure with our 3-input agentic travel engine.
            </p>
          </div>
          <button
            onClick={onPlanNewTrip}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Start Planning</span>
          </button>
        </div>
      )}
    </div>
  );
};
