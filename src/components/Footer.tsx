import React from 'react';
import {
  Compass,
  Layers,
  ShieldCheck,
  Globe,
  ExternalLink,
  Sparkles,
  Navigation,
} from 'lucide-react';

interface FooterProps {
  onOpenArchitecture: () => void;
  onSelectPreset: (origin: string, destination: string, days: number, budget: number) => void;
  onNavigate: (view: 'planner' | 'trips' | 'architecture' | 'explore') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenArchitecture,
  onSelectPreset,
  onNavigate,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight">
                ULTIMATE TRAVEL
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Agentic AI-powered end-to-end travel planning and transportation optimization platform.
              The traveler specifies starting location, destination, duration, and budget; the agents orchestrate the journey.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] text-blue-400 bg-blue-950/60 px-2 py-1 rounded border border-blue-900">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                n8n Webhook Architecture Ready
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>
                <button
                  onClick={() => onNavigate('planner')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Plan a Journey
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('trips')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  My Saved Trips
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Explore Curated Routes
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenArchitecture}
                  className="hover:text-white transition-colors cursor-pointer text-blue-400"
                >
                  AI Architecture &amp; n8n
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Curated Demo Presets */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Demo Scenarios
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>
                <button
                  onClick={() => onSelectPreset('Hyderabad, India', 'Goa, India', 7, 50000)}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>🌴 Hyd ➔ Goa · 7d · ₹50,000</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPreset('Hyderabad, India', 'Russia (Moscow & St. Petersburg)', 7, 150000)}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>🇷🇺 Hyd ➔ Russia · 7d · ₹1,50,000</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPreset('Visakhapatnam, India', 'Bengaluru, India', 5, 35000)}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>🚄 Vizag ➔ Bengaluru · 5d · ₹35,000</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Guarantee & Truth */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Autonomous Integrity
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              No simulated chatbot fake text. In mock mode, deterministic multi-agent plans reflect
              realistic schedules. In live mode, requests pipe directly to n8n webhooks.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[10px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Doorstep-to-doorstep round-trip optimization</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Ultimate Travel &amp; Transportation. Built for Agentic AI.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenArchitecture} className="hover:text-slate-300 cursor-pointer">
              Configure Webhook
            </button>
            <span>·</span>
            <span>Client API v2.5</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
