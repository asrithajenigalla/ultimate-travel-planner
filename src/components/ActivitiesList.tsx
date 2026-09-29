import React from 'react';
import {
  Ticket,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  Sparkles,
  Bookmark,
} from 'lucide-react';
import { ActivityItem, CurrencyCode } from '../types/travel';
import { formatCurrency } from '../utils/currency';

interface ActivitiesListProps {
  activities: ActivityItem[];
  currency: CurrencyCode;
}

export const ActivitiesList: React.FC<ActivitiesListProps> = ({
  activities,
  currency,
}) => {
  if (!activities || activities.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              CURATED EXPERIENCES
            </span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
              Activities Agent
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Planned Activities &amp; Sights
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key cultural landmarks, architectural explorations, and timed admissions.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
          <Ticket className="w-3.5 h-3.5 text-rose-600" />
          <span>{activities.length} Planned Sights</span>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((act) => (
          <div
            key={act.id}
            className="bg-slate-50/70 hover:bg-slate-50 rounded-xl p-4 border border-slate-200/80 transition-colors flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Day {act.day} · {act.timeSlot}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {act.category}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {act.estimatedCost === 0 ? 'Free Entry' : formatCurrency(act.estimatedCost, currency)}
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {act.name}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed">
                {act.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500" />
                <span className="truncate max-w-[180px]">{act.location}</span>
              </span>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {act.durationHours} hrs
                </span>
                {act.bookingRequired ? (
                  <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-medium border border-amber-200">
                    Pre-booking Advised
                  </span>
                ) : (
                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-medium border border-emerald-200">
                    Walk-in Accessible
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
