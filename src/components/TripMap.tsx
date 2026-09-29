import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Plane,
  Train,
  Car,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
} from 'lucide-react';
import { MapPoint, MapRoute } from '../types/travel';

interface TripMapProps {
  points?: MapPoint[];
  routes?: MapRoute[];
  originName?: string;
  destinationName: string;
}

export const TripMap: React.FC<TripMapProps> = ({
  points = [],
  routes = [],
  originName = 'Origin Hub',
  destinationName,
}) => {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(points[0] || null);
  const [mapLayer, setMapLayer] = useState<'carto' | 'satellite' | 'transit'>('carto');

  // Fallback points if none provided
  const activePoints: MapPoint[] = points.length > 0 ? points : [
    { id: '1', name: `Starting Point (${originName})`, type: 'origin', latitude: 17.3850, longitude: 78.4867, description: 'Traveler Departure & Return Doorstep' },
    { id: '2', name: `${originName} Departure Hub`, type: 'hub', latitude: 17.2403, longitude: 78.4294, description: 'Origin Air/Rail Terminal' },
    { id: '3', name: `${destinationName} Arrival Hub`, type: 'hub', latitude: 15.7533, longitude: 73.8647, description: 'Destination Transit Gateway' },
    { id: '4', name: `Central Stay (${destinationName})`, type: 'hotel', latitude: 15.5178, longitude: 73.7656, description: 'Base Stay' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              GEOSPATIAL TOPOLOGY
            </span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Origin ➔ Destination ➔ Origin
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Whole-Journey Route &amp; Transit Hubs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographic path mapped from <strong className="text-slate-800">{originName}</strong> to{' '}
            <strong className="text-slate-800">{destinationName}</strong> and returning back to origin.
          </p>
        </div>

        {/* Map Layers */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs self-start sm:self-auto">
          {(['carto', 'transit', 'satellite'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setMapLayer(layer)}
              className={`px-2.5 py-1 rounded-md font-semibold capitalize transition-colors ${
                mapLayer === layer
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-[#0F172A] min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-6">
        {/* SVG Vector Background Grid & Flight Arcs */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.75" />
            </pattern>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Curved Outbound & Return Paths */}
          <path
            d="M 120,320 Q 340,90 620,160 T 920,240"
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
          <path
            d="M 920,260 Q 640,360 120,340"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.7"
          />
        </svg>

        {/* Map Top Overlay Controls */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl text-white text-xs font-medium flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
            <span>Complete Round-Trip Network ({routes.length || activePoints.length} Legs)</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-1 rounded-xl text-white">
            <button className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white" title="Zoom In">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white" title="Zoom Out">
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Coordinate Nodes */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto">
          {activePoints.map((pt, i) => {
            const isSelected = selectedPoint?.id === pt.id;

            return (
              <div
                key={pt.id || i}
                onClick={() => setSelectedPoint(pt)}
                className={`p-3 rounded-xl border backdrop-blur-md cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-900/80 border-blue-400 text-white shadow-lg ring-2 ring-blue-500/40'
                    : 'bg-slate-900/75 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      pt.type === 'origin'
                        ? 'bg-blue-400'
                        : pt.type === 'destination'
                        ? 'bg-emerald-400'
                        : pt.type === 'hotel'
                        ? 'bg-indigo-400'
                        : 'bg-amber-400'
                    }`}
                  />
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {pt.type === 'origin' ? 'Starting Point' : pt.type}
                  </span>
                </div>
                <div className="text-xs font-bold text-white truncate">{pt.name}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {pt.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Bottom Legend / Active Inspector */}
        <div className="relative z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3.5 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Origin Doorstep
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Transit Hub (Air/Rail)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Lodging Base
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Destination Sights
            </span>
          </div>

          <div className="text-[10px] text-slate-400 font-mono">
            {routes.length > 0 ? `${routes.length} Verified Transit Segments Mapped` : 'Estimated Topological Arcs'}
          </div>
        </div>
      </div>
    </div>
  );
};
