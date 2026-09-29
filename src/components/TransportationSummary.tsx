import React from 'react';
import {
  Plane,
  Train,
  Car,
  Bus,
  Footprints,
  Compass,
  ArrowRight,
  Clock,
  Luggage,
  ShieldCheck,
  CreditCard,
  Ticket,
  Ship,
  Navigation,
  MapPin,
} from 'lucide-react';
import { TransportationData, CurrencyCode, TransportSegment } from '../types/travel';
import { formatCurrency } from '../utils/currency';

interface TransportationSummaryProps {
  transportation: TransportationData;
  currency: CurrencyCode;
}

const getModeIcon = (mode: string) => {
  switch (mode) {
    case 'flight':
      return Plane;
    case 'train':
      return Train;
    case 'car':
    case 'taxi':
      return Car;
    case 'bus':
      return Bus;
    case 'ferry':
      return Ship;
    default:
      return Footprints;
  }
};

export const TransportationSummary: React.FC<TransportationSummaryProps> = ({
  transportation,
  currency,
}) => {
  const { outbound, return: returnTrip, firstMileTransfer, lastMileTransfer, intercity = [], local = [] } = transportation;

  const renderSegment = (
    segment: TransportSegment,
    title: string,
    isFirstOrLastMile: boolean = false
  ) => {
    if (!segment || !segment.provider) return null;
    const Icon = getModeIcon(segment.type);

    return (
      <div
        className={`rounded-xl p-5 border space-y-4 transition-colors ${
          isFirstOrLastMile
            ? 'bg-blue-50/40 border-blue-200/80'
            : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isFirstOrLastMile ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {title}
              </span>
              <h4 className="text-sm font-bold text-slate-900">{segment.provider}</h4>
            </div>
          </div>

          <div className="text-right">
            <span className="text-base font-extrabold font-mono text-slate-900">
              {formatCurrency(segment.estimatedCost, currency)}
            </span>
            <div className="text-[10px] text-slate-400 capitalize">
              {segment.availability_status || 'Estimated'} Tariff
            </div>
          </div>
        </div>

        {/* Stations & Times */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
          <div className="sm:col-span-5 space-y-0.5">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              {isFirstOrLastMile && <Navigation className="w-3.5 h-3.5 text-blue-600" />}
              <span>{segment.departureTime || 'Scheduled Departure'}</span>
            </div>
            <div className="text-slate-600 font-medium">{segment.departureStation}</div>
          </div>

          <div className="sm:col-span-2 flex flex-col items-center justify-center py-1">
            <span className="text-[10px] text-slate-400 font-medium">{segment.duration}</span>
            <div className="w-full flex items-center gap-1 my-0.5">
              <div className="h-0.5 w-full bg-slate-300" />
              <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            </div>
            <span className="text-[10px] text-slate-500">
              {segment.transfers === 0 ? 'Direct' : `${segment.transfers} Transfer`}
            </span>
          </div>

          <div className="sm:col-span-5 sm:text-right space-y-0.5">
            <div className="font-bold text-slate-900 text-sm flex items-center justify-end gap-1.5">
              {isFirstOrLastMile && <MapPin className="w-3.5 h-3.5 text-rose-600" />}
              <span>{segment.arrivalTime || 'Scheduled Arrival'}</span>
            </div>
            <div className="text-slate-600 font-medium">{segment.arrivalStation}</div>
          </div>
        </div>

        {/* Transfer details & baggage */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/50 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            {segment.carrierCode && (
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                {segment.carrierCode}
              </span>
            )}
            {segment.classOrType && (
              <span className="font-medium text-slate-700">{segment.classOrType}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {segment.baggageAllowance && (
              <span className="flex items-center gap-1">
                <Luggage className="w-3.5 h-3.5 text-slate-400" />
                {segment.baggageAllowance}
              </span>
            )}
            {segment.transferDetails && (
              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {segment.transferDetails}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              COMPLETE MULTIMODAL MOBILITY
            </span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Doorstep-to-Doorstep
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Transportation Summary
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full round-trip transit explicitly beginning and ending at your starting location.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
          <Plane className="w-3.5 h-3.5 text-blue-600" />
          <span>Outbound + Return + Local Passes</span>
        </div>
      </div>

      {/* Outbound & Return Legs */}
      <div className="space-y-4">
        {/* First-Mile: Origin to Hub */}
        {firstMileTransfer && renderSegment(firstMileTransfer, '1. First-Mile Departure Transfer (Origin ➔ Hub)', true)}

        {/* Main Outbound Transit */}
        {renderSegment(outbound, '2. Outbound Intercity Transit (Departure Hub ➔ Destination Hub)')}

        {/* Intercity Segment (if applicable, e.g. Sapsan High-speed train) */}
        {intercity.map((seg, i) => (
          <div key={seg.id || i}>
            {renderSegment(seg, `3. Intercity Link: ${seg.provider}`)}
          </div>
        ))}

        {/* Main Return Transit */}
        {renderSegment(returnTrip, '4. Return Intercity Transit (Destination Hub ➔ Arrival Hub)')}

        {/* Last-Mile: Hub back to Origin */}
        {lastMileTransfer && renderSegment(lastMileTransfer, '5. Last-Mile Return Transfer (Arrival Hub ➔ Origin Doorstep)', true)}
      </div>

      {/* Local Urban Transportation Section */}
      {local.length > 0 && (
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Destination Local Mobility &amp; Transit Strategy
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Planned multimodal movement per day
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {local.map((loc, i) => (
              <div
                key={i}
                className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Day {loc.day}
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(loc.estimatedCost, currency)}
                  </span>
                </div>

                <div className="font-bold text-slate-800">{loc.route}</div>

                <p className="text-slate-600 leading-snug">{loc.description}</p>

                {loc.recommendedPass && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-50 text-emerald-800 font-semibold text-[11px] border border-emerald-200">
                    <Ticket className="w-3 h-3 text-emerald-600" />
                    <span>Recommended Pass: {loc.recommendedPass}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
