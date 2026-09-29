import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Layers,
  Info,
  TrendingDown,
  Activity,
} from 'lucide-react';
import { FeasibilityData, RiskData, CurrencyCode } from '../types/travel';
import { formatCurrency } from '../utils/currency';

interface FeasibilityAndRiskProps {
  feasibility?: FeasibilityData;
  risk?: RiskData;
  currency: CurrencyCode;
}

export const FeasibilityAndRisk: React.FC<FeasibilityAndRiskProps> = ({
  feasibility,
  risk,
  currency,
}) => {
  if (!feasibility && !risk) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              SAFETY &amp; CONSISTENCY VERIFICATION
            </span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Autonomous Verification
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Feasibility Check &amp; Risk / Buffer Analysis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pre-execution validation of transit connection buffers, transfer timing, and cash buffer adequacy.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {feasibility && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                feasibility.status === 'feasible'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{feasibility.status === 'feasible' ? '✓ Fully Feasible' : 'Needs Adjustment'}</span>
            </span>
          )}

          {risk && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                risk.level === 'low'
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : risk.level === 'moderate'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="capitalize">{risk.level} Risk</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Feasibility Checkpoints */}
        {feasibility && (
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Feasibility Checkpoints
              </span>
              <span className="text-xs text-slate-400">
                {feasibility.checks.filter((c) => c.passed).length} of {feasibility.checks.length} Passed
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {feasibility.summary}
            </p>

            <div className="space-y-2">
              {feasibility.checks.map((chk, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5 text-xs hover:border-slate-300 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">{chk.name}</div>
                    <p className="text-slate-600 mt-0.5 text-[11px] leading-snug">
                      {chk.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right Column: Risk & Buffer Evaluation */}
        {risk && (
          <div className="lg:col-span-5 space-y-4 bg-slate-50/80 p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Risk &amp; Buffer Evaluation
              </span>
              <span className="text-xs font-mono font-bold text-slate-800">
                Risk Score: {risk.score}/100
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {risk.summary}
            </p>

            {/* Buffer Gauge */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Contingency Cash Cushion</span>
                <span className="font-mono font-bold text-emerald-700">
                  +{formatCurrency(risk.buffer_status.remaining_buffer, currency)}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, Math.max(5, risk.buffer_status.buffer_percentage * 8))}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Rating: <strong className="text-emerald-700 uppercase">{risk.buffer_status.buffer_rating}</strong></span>
                <span>{risk.buffer_status.buffer_percentage}% of total budget</span>
              </div>
            </div>

            {/* Risk Flags & Mitigations */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Identified Travel Factors &amp; Mitigations:
              </span>
              {risk.flags.map((flag, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      {flag.type}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        flag.severity === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : flag.severity === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {flag.severity}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{flag.message}</p>
                  {flag.mitigation && (
                    <div className="pt-1 text-[11px] text-emerald-700 font-medium">
                      ✓ Mitigation: {flag.mitigation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
