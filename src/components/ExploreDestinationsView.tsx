import React from 'react';
import {
  Compass,
  ArrowRight,
  Plane,
  Train,
  Clock,
  Sparkles,
  MapPin,
  ShieldCheck,
  Navigation,
} from 'lucide-react';
import { formatCurrency } from '../utils/currency';

interface ExploreDestinationsViewProps {
  onSelectRoute: (origin: string, destination: string, days: number, budget: number) => void;
}

export const ExploreDestinationsView: React.FC<ExploreDestinationsViewProps> = ({
  onSelectRoute,
}) => {
  const routes = [
    {
      id: 'goa',
      title: 'Coastal Goa & Heritage Latin Quarter Getaway',
      origin: 'Hyderabad, India',
      destination: 'Goa, India',
      duration: 7,
      budget: 50000,
      currency: 'INR' as const,
      type: 'Domestic Coastal',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      transport: 'Direct Non-Stop Flight + Self-Drive Scooter',
      highlights: ['Candolim Beach Shacks', 'Fontainhas Portuguese Villas', 'Chapora Clifftop'],
    },
    {
      id: 'ru',
      title: 'Imperial Russia Discovery: Moscow & St. Petersburg',
      origin: 'Hyderabad, India',
      destination: 'Russia (Moscow & St. Petersburg)',
      duration: 7,
      budget: 150000,
      currency: 'INR' as const,
      type: 'International Flagship',
      image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80',
      transport: 'Flight + Sapsan High-Speed Bullet Rail + Metro Pass',
      highlights: ['Red Square & Kremlin', 'Winter Palace Hermitage', 'Peterhof Fountains'],
    },
    {
      id: 'vizag-blr',
      title: 'Deccan Express: Visakhapatnam to Silicon Bengaluru',
      origin: 'Visakhapatnam, India',
      destination: 'Bengaluru, India',
      duration: 5,
      budget: 35000,
      currency: 'INR' as const,
      type: 'Domestic Intercity',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      transport: 'Direct Flight + Namma Metro Pass + City Cabs',
      highlights: ['Lalbagh Botanical Garden', 'Bangalore Palace', 'Indiranagar Cafes'],
    },
    {
      id: 'jp',
      title: 'Neon & Tradition: Tokyo & Mount Fuji Corridor',
      origin: 'Hyderabad, India',
      destination: 'Tokyo, Japan',
      duration: 6,
      budget: 180000,
      currency: 'INR' as const,
      type: 'International Cultural',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      transport: 'Flight + Shinkansen Bullet Train + Suica Pass',
      highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Fuji Five Lakes'],
    },
    {
      id: 'manali',
      title: 'Himalayan Ridge & Valley Escapes: Manali & Rohtang',
      origin: 'Mumbai, India',
      destination: 'Manali, Himachal',
      duration: 5,
      budget: 38000,
      currency: 'INR' as const,
      type: 'Domestic Mountain',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      transport: 'Flight to Chandigarh + Mountain 4x4 Cab',
      highlights: ['Solang Valley Gliders', 'Old Manali Cafes', 'Atal Tunnel Pass'],
    },
    {
      id: 'kerala',
      title: 'God’s Own Country: Munnar Tea Hills & Alleppey Waters',
      origin: 'Bengaluru, India',
      destination: 'Kerala',
      duration: 6,
      budget: 52000,
      currency: 'INR' as const,
      type: 'Domestic Nature',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      transport: 'Flight to Cochin + AC Chauffeur Car + Deluxe Houseboat',
      highlights: ['Munnar Misty Tea Gardens', 'Backwater Cruise', 'Kathakali Center'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            EXPLORE INSPIRATION
          </span>
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Tested Round-Trip Routes
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Curated Multimodal Journeys
        </h1>
        <p className="text-sm text-slate-500">
          Complete round-trip itineraries starting from user origins and optimized across multimodal transit agents.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => (
          <div
            key={route.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group"
          >
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src={route.image}
                alt={route.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                  {route.type}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-mono font-bold">
                {formatCurrency(route.budget, route.currency)}
              </div>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                  <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{route.origin}</span>
                  <span className="text-slate-400">➔</span>
                  <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="truncate text-slate-900 font-bold">{route.destination}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {route.title}
                </h3>

                <p className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
                  <Train className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{route.transport}</span>
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2 text-[11px] text-slate-600">
                  {route.highlights.map((h, i) => (
                    <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => onSelectRoute(route.origin, route.destination, route.duration, route.budget)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Plan This ({route.duration}d · {formatCurrency(route.budget, route.currency)})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
