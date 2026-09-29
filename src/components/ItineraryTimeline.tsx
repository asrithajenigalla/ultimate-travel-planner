import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Plane,
  Hotel,
  Utensils,
  Camera,
  Footprints,
  Train,
  ChevronDown,
  ChevronUp,
  Tag,
  Sparkles,
} from 'lucide-react';
import { DailyItinerary, CurrencyCode, ItineraryStop } from '../types/travel';
import { formatCurrency } from '../utils/currency';
import { formatDateLabel } from '../utils/formatting';

interface ItineraryTimelineProps {
  itinerary: DailyItinerary[];
  currency: CurrencyCode;
}

const getStopIcon = (type?: string) => {
  switch (type) {
    case 'plane':
      return Plane;
    case 'hotel':
      return Hotel;
    case 'food':
      return Utensils;
    case 'metro':
      return Train;
    case 'walk':
      return Footprints;
    case 'camera':
    case 'landmark':
    default:
      return Camera;
  }
};

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  itinerary,
  currency,
}) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [expandAll, setExpandAll] = useState<boolean>(false);

  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              SYNTHESIZED SCHEDULE
            </span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Chronological Flow
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Daily Itinerary Timeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographically grouped stops with zero transit backtracking.
          </p>
        </div>

        {/* View toggle */}
        <button
          onClick={() => setExpandAll(!expandAll)}
          className="text-xs font-semibold text-blue-700 hover:text-blue-900 self-start sm:self-auto cursor-pointer"
        >
          {expandAll ? 'Switch to Day Tabs' : 'View All Days Expanded'}
        </button>
      </div>

      {/* Day Selector Navigation Pills (When not expanded all) */}
      {!expandAll && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {itinerary.map((day) => (
            <button
              key={day.day}
              onClick={() => setActiveDay(day.day)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeDay === day.day
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Day {day.day}
              <span className="text-[10px] ml-1.5 opacity-70">
                ({formatDateLabel(day.day)})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Daily Cards Container */}
      <div className="space-y-6">
        {itinerary
          .filter((day) => expandAll || day.day === activeDay)
          .map((day) => (
            <div
              key={day.day}
              className="bg-slate-50/70 rounded-xl p-5 border border-slate-200/80 space-y-5"
            >
              {/* Day Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      Day {day.day}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {formatDateLabel(day.day)}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {day.title}
                  </h3>
                  <p className="text-xs text-slate-600 italic">"{day.theme}"</p>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-xs text-slate-400 font-medium">Estimated Day Cost</span>
                  <div className="text-base font-bold font-mono text-slate-900">
                    {formatCurrency(day.estimatedDayCost, currency)}
                  </div>
                </div>
              </div>

              {/* Day Timeline Stops */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {day.stops.map((stop, sIdx) => {
                  const Icon = getStopIcon(stop.iconType);

                  return (
                    <div key={sIdx} className="relative group">
                      {/* Timeline Node Icon */}
                      <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                        <Icon className="w-2.5 h-2.5 text-blue-600" />
                      </div>

                      {/* Stop Content Card */}
                      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {stop.time && (
                              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {stop.time}
                              </span>
                            )}
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              {stop.title}
                            </h4>
                          </div>

                          {stop.estimatedCost !== undefined && stop.estimatedCost > 0 && (
                            <span className="font-mono text-xs font-bold text-slate-900">
                              {formatCurrency(stop.estimatedCost, currency)}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {stop.description}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            {stop.location}
                          </span>

                          {stop.transportToNext && (
                            <span className="text-blue-700 bg-blue-50/60 px-2 py-0.5 rounded border border-blue-100 font-medium">
                              ➔ Next: {stop.transportToNext}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
