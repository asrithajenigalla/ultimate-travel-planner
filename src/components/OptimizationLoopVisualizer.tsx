import React, { useState } from 'react';
import {
  GitCommit,
  TrendingDown,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { OptimizationData, CurrencyCode } from '../types/travel';
import { formatCurrency } from '../utils/currency';

interface OptimizationLoopVisualizerProps {
  optimization: OptimizationData;
  budget: number;
  finalCost: number;
  currency: CurrencyCode;
}

export const OptimizationLoopVisualizer: React.FC<OptimizationLoopVisualizerProps> = ({
  optimization,
  budget,
  finalCost,
  currency,
}) => {
  const [expanded, setExpanded] = useState(true);
  const iterations = optimization.iterations || [];
  const steps = optimization.optimization_steps || [];
  const explainableDecisions = optimization.explainable_decisions || [];
  const initialCost = optimization.initialCandidateCost || Math.round(budget * 1.15);
  const totalSaved = optimization.total_cost_saved || (initialCost - finalCost);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Title & Accordion toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              The Agentic Heart
            </span>
            <span className="text-xs text-slate-400 font-mono">Whole-Journey Solver v2.5</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Whole-Journey Optimization &amp; Re-Planning Loop
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The optimization scope covers Origin ➔ Outbound ➔ Stay ➔ Local Transit ➔ Activities ➔ Food ➔ Return ➔ Origin.
          </p>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>{expanded ? 'Collapse Loop' : 'Inspect Re-Planning Loop'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 text-white rounded-xl p-5">
        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Unconstrained Initial Candidate
          </span>
          <div className="text-2xl font-extrabold font-mono text-rose-400 mt-0.5">
            {formatCurrency(initialCost, currency)}
          </div>
          <span className="text-[11px] text-rose-300">
            Exceeded hard ceiling by {formatCurrency(initialCost - budget, currency)}
          </span>
        </div>

        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Replanning Loop Savings
          </span>
          <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-0.5">
            -{formatCurrency(totalSaved, currency)}
          </div>
          <span className="text-[11px] text-emerald-300">
            Achieved across {iterations.length || steps.length} optimization iterations
          </span>
        </div>

        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Final Optimized Cost
          </span>
          <div className="text-2xl font-extrabold font-mono text-white mt-0.5">
            {formatCurrency(finalCost, currency)}
          </div>
          <span className="text-[11px] text-blue-300">
            Within hard constraint ({formatCurrency(budget - finalCost, currency)} safety buffer)
          </span>
        </div>
      </div>

      {/* Plan Versioning & Replanning Iterations (Section 15 & 36 L) */}
      {expanded && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Optimization Plan Versions &amp; Iteration Trail
            </span>
            <span className="text-[10px] text-slate-400">
              Sensible iteration limit applied to prevent infinite loops
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {iterations.map((iter) => (
              <div
                key={iter.version}
                className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                  iter.status === 'feasible'
                    ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 uppercase tracking-wide">
                    Plan Version {iter.version}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      iter.status === 'feasible'
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {iter.status === 'feasible' ? '✓ Budget Satisfied' : '⚠ Over Budget'}
                  </span>
                </div>

                <div className="text-lg font-black font-mono text-slate-900">
                  {formatCurrency(iter.totalCost, currency)}
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {iter.rationale}
                </p>

                {iter.actionsTaken && (
                  <div className="pt-1 border-t border-slate-200/60 text-[10px] text-slate-500">
                    {iter.actionsTaken.join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sequential Step Timeline */}
          {steps.length > 0 && (
            <div className="pt-3 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Component Pruning Trace
              </span>
              <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {steps.map((step) => (
                  <div key={step.step} className="relative">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-blue-500 text-blue-600 flex items-center justify-center text-[10px] font-bold font-mono">
                      {step.step}
                    </div>

                    <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200 text-xs space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-bold text-slate-900">
                          {step.action} · <span className="text-slate-500 font-normal">{step.component}</span>
                        </div>
                        <div className="font-mono text-xs">
                          {step.costDelta !== 0 && (
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mr-2">
                              {formatCurrency(step.costDelta, currency)}
                            </span>
                          )}
                          <span className="font-bold text-slate-900">{formatCurrency(step.newCost, currency)}</span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-[11px]">{step.rationale}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* "WHY THIS PLAN?" Explainable Decisions Section (Section 16) */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Why this journey was selected (Explainable Decisions)
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed italic bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
          "{optimization.reasoning_summary}"
        </p>

        {/* Explainable Decision Cards */}
        {explainableDecisions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {explainableDecisions.map((dec, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-slate-900 text-xs">
                  {dec.component}
                </div>
                <div className="text-[11px] font-medium text-blue-900 bg-blue-50 p-1.5 rounded">
                  {dec.decision}
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  <strong>Why:</strong> {dec.whySelected}
                </p>
                <div className="text-[10px] text-slate-400">
                  Trade-off: {dec.tradeOff}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {optimization.keySelectionFactors?.map((factor, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{factor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
