import React from 'react';
import {
  Utensils,
  DollarSign,
  Info,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
} from 'lucide-react';
import { DailyExpenses, CurrencyCode } from '../types/travel';
import { formatCurrency } from '../utils/currency';

interface FoodAndExpensesProps {
  expenses: DailyExpenses;
  currency: CurrencyCode;
  durationDays: number;
}

export const FoodAndExpenses: React.FC<FoodAndExpensesProps> = ({
  expenses,
  currency,
  durationDays,
}) => {
  const {
    dailyFoodEstimate,
    dailyLocalTransport,
    dailyMisc,
    totalFood,
    totalLocalTransport,
    totalMiscBuffer,
    breakdown = [],
  } = expenses;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              DAILY LIVING ALLOWANCES
            </span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
              Gastronomy &amp; Expenses
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Food &amp; Estimated Daily Expenses
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Calibrated daily per-diem allowances covering authentic meals, transport, and discretionary items.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
          <Utensils className="w-3.5 h-3.5 text-teal-600" />
          <span>Realistic Per-Diem Model</span>
        </div>
      </div>

      {/* 3 Metric Cards for Daily Living */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Daily Food Index
          </span>
          <div className="text-xl font-extrabold font-mono text-slate-900">
            {formatCurrency(dailyFoodEstimate, currency)}
            <span className="text-xs font-normal text-slate-400"> / day</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Total {formatCurrency(totalFood, currency)} for {durationDays} days
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Daily Urban Mobility
          </span>
          <div className="text-xl font-extrabold font-mono text-slate-900">
            {formatCurrency(dailyLocalTransport, currency)}
            <span className="text-xs font-normal text-slate-400"> / day</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Total {formatCurrency(totalLocalTransport, currency)} for transit
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Contingency &amp; Buffer
          </span>
          <div className="text-xl font-extrabold font-mono text-slate-900">
            {formatCurrency(dailyMisc, currency)}
            <span className="text-xs font-normal text-slate-400"> / day</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Total {formatCurrency(totalMiscBuffer, currency)} safety cushion
          </p>
        </div>
      </div>

      {/* Breakdown Table with Confirmed vs Estimated Status */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Component Breakdown &amp; Valuation Status
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Expense Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Calculation Basis &amp; Agent Notes</th>
                <th className="p-3 text-right">Estimated Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {breakdown.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{item.category}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        item.isConfirmed
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {item.isConfirmed ? 'Route Tariff' : 'Estimated Living'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 text-[11px] max-w-md">
                    {item.notes}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(item.estimatedCost, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanatory note */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          All dining and discretionary allowances are calculated using cost-of-living purchasing power indices
          calibrated for destination restaurants and street cafes. No real-time surge pricing is fabricated.
        </p>
      </div>
    </div>
  );
};
