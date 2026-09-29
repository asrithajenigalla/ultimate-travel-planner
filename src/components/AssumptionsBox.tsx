import React from 'react';
import { HelpCircle, CheckCircle2, ShieldCheck, Info } from 'lucide-react';

interface AssumptionsBoxProps {
  assumptions?: string[];
}

export const AssumptionsBox: React.FC<AssumptionsBoxProps> = ({ assumptions }) => {
  if (!assumptions || assumptions.length === 0) return null;

  return (
    <div className="bg-slate-50/90 rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
            <Info className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Planning Assumptions &amp; Modeling Baseline
          </h3>
        </div>
        <span className="text-[10px] text-slate-500 font-medium">
          Transparent Autonomous Decisions
        </span>
      </div>

      <p className="text-xs text-slate-600">
        To avoid complex questionnaires, the multi-agent system applied the following explicit assumptions:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
        {assumptions.map((assumption, i) => (
          <div
            key={i}
            className="flex items-start gap-2 p-2.5 rounded-lg bg-white border border-slate-200/80 text-slate-700"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{assumption}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
