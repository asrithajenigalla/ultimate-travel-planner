import React from 'react';
import {
  Hotel,
  Star,
  MapPin,
  CheckCircle2,
  Sparkles,
  Wifi,
  Coffee,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { AccommodationItem, CurrencyCode } from '../types/travel';
import { formatCurrency } from '../utils/currency';

interface AccommodationSummaryProps {
  accommodations: AccommodationItem[];
  currency: CurrencyCode;
}

export const AccommodationSummary: React.FC<AccommodationSummaryProps> = ({
  accommodations,
  currency,
}) => {
  if (!accommodations || accommodations.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              LODGING &amp; STAYS
            </span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Proximity Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Accommodation Summary
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hand-picked lodging balancing central access, safety, amenities, and budget constraints.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
          <Hotel className="w-3.5 h-3.5 text-indigo-600" />
          <span>{accommodations.length} Selected Stays</span>
        </div>
      </div>

      {/* Accommodation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accommodations.map((stay) => (
          <div
            key={stay.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            {/* Stay Image with badge */}
            <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
              <img
                src={stay.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                alt={stay.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                  {stay.type}
                </span>
                <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-2xs">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {stay.rating}
                  <span className="text-slate-400 font-normal">({stay.reviewCount})</span>
                </span>
              </div>

              <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-mono font-bold">
                {stay.nights} {stay.nights === 1 ? 'Night' : 'Nights'}
              </div>
            </div>

            {/* Stay Details */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {stay.name}
                  </h3>
                  <div className="text-right shrink-0">
                    <div className="text-base font-black font-mono text-slate-900">
                      {formatCurrency(stay.estimatedTotal, currency)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      ~{formatCurrency(stay.pricePerNight, currency)} / night
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{stay.location}</span>
                </div>

                {/* Proximity / Convenience metric */}
                <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-100/80 text-xs text-blue-900 flex items-start gap-2">
                  <Compass className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Proximity: </span>
                    <span>{stay.distanceFromMajorActivities}</span>
                  </div>
                </div>

                {/* Why Selected Rationale */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 space-y-0.5">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Why Selected:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    {stay.whySelected}
                  </p>
                </div>
              </div>

              {/* Amenities */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 text-[11px] text-slate-600">
                {stay.amenities.map((amenity, i) => (
                  <span
                    key={i}
                    className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
