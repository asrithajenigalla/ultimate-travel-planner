import React from 'react';
import {
  Check,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  MapPin,
  Plane,
  Hotel,
} from 'lucide-react';
import { AlternativePlan, CurrencyCode } from '../types/travel';
import { formatCurrency } from '../utils/currency';

interface AlternativePlansProps {
  alternatives: AlternativePlan[];
  selectedId: 'balanced' | 'budget' | 'comfort';
  onSelectAlternative: (id: 'balanced' | 'budget' | 'comfort') => void;
  currency: CurrencyCode;
  budget: number;
  origin?: string;
  destination?: string;
}

export const AlternativePlans: React.FC<AlternativePlansProps> = ({
  alternatives,
  selectedId,
  onSelectAlternative,
  currency,
  budget,
  origin,
  destination,
}) => {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              COMPLETE STRATEGY COMPARISON
            </span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Whole-Journey Alternatives
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Complete Journey Alternatives
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The Optimization Agent synthesized complete round-trip strategies within your{' '}
            <strong className="text-slate-800 font-mono">{formatCurrency(budget, currency)}</strong> budget.
          </p>
        </div>

        <span className="text-xs text-slate-400 italic">
          Select any strategy to adopt its parameters
        </span>
      </div>

      {/* Alternative Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {alternatives.map((alt) => {
          const isSelected = alt.id === selectedId;

          return (
            <div
              key={alt.id}
              onClick={() => onSelectAlternative(alt.id)}
              className={`relative rounded-xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/20 shadow-md ring-2 ring-blue-500/10'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Badge if recommended or selected */}
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    alt.id === 'balanced'
                      ? 'bg-blue-100 text-blue-800'
                      : alt.id === 'budget'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {alt.label}
                </span>

                {isSelected && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    <Check className="w-3.5 h-3.5" />
                    Active Plan
                  </span>
                )}
              </div>

              {/* Title & Cost */}
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-900">
                  {alt.name}
                </h3>
                <div className="text-2xl font-black font-mono text-slate-900">
                  {formatCurrency(alt.estimatedTotal, currency)}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Transit: {alt.travelTimeDiff}</span>
                  <span>·</span>
                  <span className="font-medium text-slate-700">{alt.comfortLevel}</span>
                </div>
              </div>

              {/* Component Summaries */}
              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {alt.outboundSummary && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Plane className="w-3 h-3 text-blue-600 shrink-0" />
                    <span className="truncate">Outbound: {alt.outboundSummary}</span>
                  </div>
                )}
                {alt.returnSummary && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Plane className="w-3 h-3 text-teal-600 shrink-0" />
                    <span className="truncate">Return: {alt.returnSummary}</span>
                  </div>
                )}
                {alt.accommodationSummary && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Hotel className="w-3 h-3 text-indigo-600 shrink-0" />
                    <span className="truncate">Stay: {alt.accommodationSummary}</span>
                  </div>
                )}
              </div>

              {/* Tradeoff Explanation */}
              <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-100 shadow-2xs">
                {alt.tradeoffSummary}
              </p>

              {/* Highlights List */}
              <div className="space-y-1.5 pt-1 border-t border-slate-100 text-xs text-slate-600">
                {alt.highlights?.map((h, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-[11px]">{h}</span>
                  </div>
                ))}
              </div>

              {/* Selection Button */}
              <button
                type="button"
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                {isSelected ? 'Currently Selected' : 'Adopt this Strategy'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs text-slate-400 italic">
        * Estimates reflect planned component pricing. Live reservation is completed upon final checkout confirmation.
      </div>
    </div>
  );
};
