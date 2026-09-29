import React from 'react';
import {
  ArrowRight,
  Plane,
  Train,
  Hotel,
  ShieldCheck,
  CheckCircle2,
  Compass,
  ArrowUpRight,
  TrendingDown,
  Sparkles,
  Navigation,
  MapPin,
} from 'lucide-react';

interface HeroProps {
  onPlanTripClick: () => void;
  onExploreArchitecture: () => void;
  onSelectPreset: (origin: string, destination: string, days: number, budget: number) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onPlanTripClick,
  onExploreArchitecture,
  onSelectPreset,
}) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/70 bg-gradient-to-b from-white via-slate-50/50 to-[#FAFAFC]">
      {/* Subtle background route grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#0F172A_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Vision & Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status announcement badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-semibold text-blue-800">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Genuinely Agentic Architecture · Dynamic Router · Ready for n8n</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
              Your Journey.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600">
                Planned by AI.
              </span>
            </h1>

            {/* Core Tagline & Supporting Copy */}
            <div className="space-y-2">
              <p className="text-xl sm:text-2xl font-medium text-slate-800 tracking-tight">
                "Tell us where you want to go. We'll plan the journey."
              </p>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Provide only four essential inputs: <strong className="text-slate-800">Starting Location</strong>,{' '}
                <strong className="text-slate-800">Destination</strong>,{' '}
                <strong className="text-slate-800">Duration</strong>, and{' '}
                <strong className="text-slate-800">Total Budget</strong>. The system autonomously plans outbound
                transit from your starting point, lodging proximity, local mobility, activities, and return
                transit back to your origin under your hard financial constraint.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onPlanTripClick}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Plan My Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreArchitecture}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-sm sm:text-base border border-slate-300 shadow-2xs transition-all cursor-pointer"
              >
                <span>Explore Agent Workflow</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Philosophical Pillars */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200/80 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Doorstep-to-Doorstep</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Dynamic Agent Router</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Zero Chatbot Slop</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual - Hyderabad to Goa & Russia Journey Card */}
          <div className="lg:col-span-5 relative">
            {/* Card Frame */}
            <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-xl overflow-hidden p-6 space-y-5">
              {/* Header metadata */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Live Journey Preview
                  </span>
                  <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Feasible &amp; Optimized
                  </span>
                </div>
                <span className="text-xs font-mono font-medium text-slate-400">
                  ID: HYD-GOA-7D
                </span>
              </div>

              {/* Route Node Visualizer */}
              <div className="relative bg-slate-900 text-white rounded-xl p-5 overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        Starting Location
                      </div>
                      <div className="text-lg font-bold text-white flex items-center gap-1.5">
                        <Navigation className="w-4 h-4 text-blue-400" />
                        <span>Hyderabad</span>
                      </div>
                    </div>

                    {/* Transit Icon and Mode line */}
                    <div className="flex-1 mx-4 flex flex-col items-center">
                      <div className="flex items-center gap-1.5 text-[11px] text-blue-300 font-medium">
                        <Plane className="w-3.5 h-3.5 animate-pulse" />
                        <span>1h 25m</span>
                      </div>
                      <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 via-teal-400 to-indigo-400 my-1.5 relative">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white ring-2 ring-blue-500" />
                      </div>
                      <span className="text-[10px] text-slate-400">Non-Stop Direct Flight</span>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        Destination
                      </div>
                      <div className="text-lg font-bold text-white flex items-center gap-1.5 justify-end">
                        <MapPin className="w-4 h-4 text-rose-400" />
                        <span>Goa</span>
                      </div>
                    </div>
                  </div>

                  {/* Return transit callout */}
                  <div className="bg-slate-800/80 rounded-lg p-2.5 flex items-center justify-between text-xs border border-slate-700/60">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-teal-400" />
                      <div>
                        <div className="font-semibold text-slate-200">
                          Complete Round-Trip Loop
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Goa ➔ Returns to Hyderabad Starting Location
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-emerald-400 font-bold">
                      Included
                    </span>
                  </div>
                </div>

                <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none translate-x-8 translate-y-6">
                  <Compass className="w-48 h-48 text-blue-400" />
                </div>
              </div>

              {/* Hard Budget Metric Card */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-center">
                <div>
                  <div className="text-[11px] font-medium text-slate-500">Duration</div>
                  <div className="text-base font-bold text-slate-900">7 Days</div>
                  <div className="text-[10px] text-slate-400">1 Traveler</div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-slate-500">Total Budget</div>
                  <div className="text-base font-bold text-slate-900">₹50,000</div>
                  <div className="text-[10px] text-slate-400">Hard Constraint</div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-slate-500">Planned Cost</div>
                  <div className="text-base font-bold text-emerald-600">₹46,800</div>
                  <div className="text-[10px] text-emerald-700 font-medium">₹3,200 buffer</div>
                </div>
              </div>

              {/* Optimization Delta Notice */}
              <div className="flex items-center justify-between text-xs text-slate-600 bg-blue-50/60 rounded-lg px-3 py-2 border border-blue-100">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-blue-600" />
                  <span>
                    Initial candidate was <strong>₹58,000</strong>. AI trimmed ₹11,200.
                  </span>
                </div>
                <button
                  onClick={() => onSelectPreset('Hyderabad, India', 'Goa, India', 7, 50000)}
                  className="font-bold text-blue-700 hover:text-blue-900 underline underline-offset-2 shrink-0 ml-2"
                >
                  Load Demo
                </button>
              </div>

              {/* Fast presets pill bar */}
              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Try Preset:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectPreset('Hyderabad, India', 'Goa, India', 7, 50000)}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                  >
                    🌴 Hyd ➔ Goa (7d · ₹50k)
                  </button>
                  <button
                    onClick={() => onSelectPreset('Hyderabad, India', 'Russia (Moscow & St. Petersburg)', 7, 150000)}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                  >
                    🇷🇺 Hyd ➔ Russia (7d · ₹1.5L)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
