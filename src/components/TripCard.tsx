import React from 'react';
import {
  Calendar,
  IndianRupee,
  Plane,
  Hotel,
  Trash2,
  ArrowRight,
  Share2,
  BookmarkCheck,
  Navigation,
  MapPin,
  Users,
} from 'lucide-react';
import { SavedTripSummary } from '../types/travel';
import { formatCurrency } from '../utils/currency';

interface TripCardProps {
  trip: SavedTripSummary;
  onView: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onView, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
      {/* Card Header Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={trip.imageUrl}
          alt={trip.destination}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
            {trip.duration_days} Days
          </span>
          {trip.travelers && trip.travelers > 1 && (
            <span className="bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
              <Users className="w-3 h-3 text-blue-400" />
              <span>{trip.travelers}</span>
            </span>
          )}
          <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2 py-1 rounded-md">
            {trip.status}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-mono font-bold">
          {formatCurrency(trip.estimated_total, trip.currency)}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Navigation className="w-3 h-3 text-blue-600 shrink-0" />
            <span className="truncate">{trip.origin}</span>
            <span className="text-slate-400">➔</span>
            <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
            <span className="truncate font-bold text-slate-800">{trip.destination}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {trip.title}
          </h3>

          {/* Transportation summary */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Plane className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{trip.transportSummary}</span>
          </div>

          {/* Stay summary */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Hotel className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">{trip.staySummary}</span>
          </div>
        </div>

        {/* Budget comparison */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">
              Budget Constraint
            </span>
            <span className="font-bold text-slate-700 font-mono">
              {formatCurrency(trip.budget, trip.currency)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-emerald-600 font-medium block">
              Buffer Retained
            </span>
            <span className="font-bold text-emerald-700 font-mono">
              +{formatCurrency(trip.budget - trip.estimated_total, trip.currency)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {onDelete && (
            <button
              onClick={() => onDelete(trip.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Delete from My Trips"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onView(trip.id)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            <span>View Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
