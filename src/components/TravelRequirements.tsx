import React from 'react';
import {
  FileText,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  CreditCard,
  HeartPulse,
  Info,
} from 'lucide-react';
import { TravelRequirement } from '../types/travel';

interface TravelRequirementsProps {
  requirements: TravelRequirement[];
  destination: string;
}

export const TravelRequirements: React.FC<TravelRequirementsProps> = ({
  requirements,
  destination,
}) => {
  if (!requirements || requirements.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              OFFICIAL COMPLIANCE
            </span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Requirements Agent
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Travel Requirements &amp; Formalities
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified consular, immigration, and border prerequisites for {destination}.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>Mandatory Checklist</span>
        </div>
      </div>

      {/* Requirements Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requirements.map((req, idx) => (
          <div
            key={idx}
            className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {req.title}
                </h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 uppercase tracking-wider ${
                    req.status === 'Mandatory'
                      ? 'bg-rose-100 text-rose-800'
                      : req.status === 'Required'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {req.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {req.details}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate max-w-[240px]">Source: {req.sourceNote}</span>

              {req.actionUrl && (
                <a
                  href={req.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 shrink-0"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Official Sourcing Notice:</strong> The future Requirements Agent fetches authoritative
          guidelines from official embassy and civil aviation portals. Always re-verify validity prior to
          international departure.
        </p>
      </div>
    </div>
  );
};
