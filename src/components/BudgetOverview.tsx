import React from 'react';
import {
  PieChart,
  ShieldCheck,
  TrendingDown,
  Info,
  Plane,
  Hotel,
  Car,
  Utensils,
  Ticket,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Navigation,
} from 'lucide-react';
import { TripResult } from '../types/travel';
import { formatCurrency } from '../utils/currency';

interface BudgetOverviewProps {
  trip: TripResult;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ trip }) => {
  const { budget, currency, travelers = 1 } = trip.trip;
  const {
    estimated_total,
    remaining_budget,
    percent_allocated,
    outboundTransportTotal,
    returnTransportTotal,
    transportTotal,
    accommodationTotal,
    localTransportTotal,
    foodTotal,
    activitiesTotal,
    miscTotal,
  } = trip.summary;

  const outboundVal = outboundTransportTotal || Math.round(transportTotal * 0.5);
  const returnVal = returnTransportTotal || Math.round(transportTotal * 0.5);

  const categories = [
    {
      name: 'Outbound Transit (Origin ➔ Dest)',
      amount: outboundVal,
      color: 'bg-blue-600',
      textColor: 'text-blue-700',
      icon: ArrowRight,
      isConfirmed: true,
      description: 'First-mile transfer, scheduled outbound flight/rail, terminal taxes',
    },
    {
      name: 'Return Transit (Dest ➔ Origin)',
      amount: returnVal,
      color: 'bg-cyan-600',
      textColor: 'text-cyan-700',
      icon: ArrowLeft,
      isConfirmed: true,
      description: 'Destination terminal transfer, scheduled return flight/rail, last-mile home',
    },
    {
      name: 'Accommodation',
      amount: accommodationTotal,
      color: 'bg-indigo-600',
      textColor: 'text-indigo-700',
      icon: Hotel,
      isConfirmed: true,
      description: 'Centrally located boutique lodging, room allocations, local taxes',
    },
    {
      name: 'Local Mobility',
      amount: localTransportTotal,
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      icon: Car,
      isConfirmed: false,
      description: 'Intra-destination transit passes, scooter/metro, airport cabs',
    },
    {
      name: 'Food & Daily Dining',
      amount: foodTotal,
      color: 'bg-teal-600',
      textColor: 'text-teal-700',
      icon: Utensils,
      isConfirmed: false,
      description: `Daily breakfast, lunch, cafe and sit-down dinners (${travelers} traveler${travelers > 1 ? 's' : ''})`,
    },
    {
      name: 'Activities & Attractions',
      amount: activitiesTotal,
      color: 'bg-rose-500',
      textColor: 'text-rose-700',
      icon: Ticket,
      isConfirmed: false,
      description: 'Curated entry admissions, museum tickets, and guided walks',
    },
    {
      name: 'Contingency & Misc',
      amount: miscTotal,
      color: 'bg-slate-400',
      textColor: 'text-slate-600',
      icon: HelpCircle,
      isConfirmed: false,
      description: 'SIM card data, lockers, local tips, discretionary reserve',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Title & Constraint Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Budget Allocation &amp; Hard Constraint</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Every route, hotel, and meal allocation was constrained by the traveler's financial limit.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Hard Constraint Satisfied ({percent_allocated}% Allocated)</span>
        </div>
      </div>

      {/* Main Budget Bar Visualizer */}
      <div className="space-y-3 bg-slate-50/80 rounded-xl p-5 border border-slate-200/70">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Budget Ceiling
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              {formatCurrency(budget, currency)}
            </div>
          </div>

          <div className="text-right space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Retained Emergency Buffer
            </span>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-700">
              +{formatCurrency(remaining_budget, currency)}
            </div>
          </div>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
            {categories.map((cat, idx) => {
              const widthPct = (cat.amount / budget) * 100;
              return (
                <div
                  key={idx}
                  title={`${cat.name}: ${formatCurrency(cat.amount, currency)} (${Math.round(widthPct)}%)`}
                  className={`h-full ${cat.color} transition-all duration-500`}
                  style={{ width: `${widthPct}%` }}
                />
              );
            })}
            {/* Unallocated buffer segment */}
            <div
              title={`Remaining Buffer: ${formatCurrency(remaining_budget, currency)}`}
              className="h-full bg-emerald-300/80 transition-all duration-500"
              style={{ width: `${Math.max(0, (remaining_budget / budget) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>
              <strong>{percent_allocated}%</strong> allocated (Total: {formatCurrency(estimated_total, currency)})
            </span>
            <span className="text-emerald-700 font-bold">
              {formatCurrency(remaining_budget, currency)} retained buffer (
              {Math.round((remaining_budget / budget) * 100)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          const pct = Math.round((cat.amount / estimated_total) * 100);

          return (
            <div
              key={index}
              className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg ${cat.color}/10 flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${cat.textColor}`} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{cat.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {pct}% of journey
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                    cat.isConfirmed
                      ? 'bg-slate-100 text-slate-700 border-slate-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {cat.isConfirmed ? 'Route Tariff' : 'Estimated Living'}
                </span>
              </div>

              <div className="text-base font-extrabold font-mono text-slate-900">
                {formatCurrency(cat.amount, currency)}
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">
                {cat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Distinction notice */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-800">Confirmed vs Estimated Distinction:</strong> Aviation,
          rail, and first-mile/last-mile transfer costs represent scheduled route tariffs. Daily dining,
          mobility passes, and activity allowances represent calibrated per-diem living indices.
        </p>
      </div>
    </div>
  );
};
