import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Compass,
  DollarSign,
  ShieldAlert,
  Navigation,
  MapPin,
} from 'lucide-react';
import { TripResult } from '../types/travel';
import { formatCurrency } from '../utils/currency';

interface ErrorStateProps {
  trip: TripResult;
  onModifyInputs: () => void;
  onIncreaseBudget?: (newBudget: number) => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  trip,
  onModifyInputs,
  onIncreaseBudget,
}) => {
  const { origin, destination, duration_days, budget, currency, travelers = 1 } = trip.trip;
  const resolution = trip.errorResolution;
  const deficit = resolution?.requiredAdditionalBudget || 25000;
  const recommendedBudget = budget + deficit;

  return (
    <div className="bg-white rounded-2xl border border-rose-200 shadow-xl overflow-hidden p-6 sm:p-10 space-y-6 max-w-3xl mx-auto">
      {/* Alert Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold uppercase tracking-wider">
            Hard Budget Constraint Violation
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Unable to generate a complete plan within {formatCurrency(budget, currency)}
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600">
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <Navigation className="w-3.5 h-3.5 text-blue-600" />
              {origin}
            </span>
            <span>➔</span>
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              {destination}
            </span>
            <span>·</span>
            <span>{duration_days} Days</span>
            <span>·</span>
            <span>{travelers} Traveler{travelers > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Analysis Details */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4 text-xs">
        <div>
          <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Constraint Causation Factor
          </span>
          <p className="text-slate-800 font-medium">
            {resolution?.causeComponent || 'Baseline roundtrip transportation and minimum certified lodging tariffs exceed total allowance.'}
          </p>
        </div>

        {resolution?.consideredAlternatives && (
          <div>
            <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Optimization Alternatives Attempted by Agents
            </span>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              {resolution.consideredAlternatives.map((alt, i) => (
                <li key={i}>{alt}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-mono">
          <span className="text-slate-600">Minimum Estimated Feasibility Budget:</span>
          <span className="text-sm font-extrabold text-slate-900">
            {formatCurrency(recommendedBudget, currency)}
          </span>
        </div>
      </div>

      {/* Recommended Next Actions */}
      <div className="pt-2 flex flex-wrap items-center gap-3">
        {onIncreaseBudget && (
          <button
            onClick={() => onIncreaseBudget(recommendedBudget)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Increase Budget to {formatCurrency(recommendedBudget, currency)}</span>
          </button>
        )}

        <button
          onClick={onModifyInputs}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span>Adjust Duration, Origin, or Destination</span>
        </button>
      </div>
    </div>
  );
};
