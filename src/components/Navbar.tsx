import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  Layers,
  Settings,
  BookmarkCheck,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Navigation,
} from 'lucide-react';
import { getTravelAiMode } from '../services/travelPlannerService';

interface NavbarProps {
  currentView: 'planner' | 'trips' | 'architecture' | 'explore';
  onNavigate: (view: 'planner' | 'trips' | 'architecture' | 'explore') => void;
  onOpenArchitecture: () => void;
  onQuickDemo: (type: 'russia' | 'goa') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenArchitecture,
  onQuickDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const aiMode = getTravelAiMode();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('planner')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-600 transition-colors">
            <Compass className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-slate-900 text-lg leading-tight">
                ULTIMATE TRAVEL
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Agentic AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide">
              Autonomous Travel &amp; Transportation Optimization
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('planner')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentView === 'planner'
                ? 'text-blue-700 bg-blue-50/80 font-semibold'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Plan a Trip
          </button>
          <button
            onClick={() => onNavigate('trips')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'trips'
                ? 'text-blue-700 bg-blue-50/80 font-semibold'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            My Trips
          </button>
          <button
            onClick={() => onNavigate('explore')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'explore'
                ? 'text-blue-700 bg-blue-50/80 font-semibold'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Explore Routes
          </button>
          <button
            onClick={onOpenArchitecture}
            className="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 hover:text-slate-900 hover:bg-slate-50 text-slate-600"
          >
            <Layers className="w-4 h-4 text-blue-600" />
            AI Architecture &amp; n8n
          </button>
        </nav>

        {/* Right CTA & Mode Status */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Quick Demo Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Demo Scenarios
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {demoDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-left">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Origin ➔ Destination Scenarios
                </div>
                <button
                  onClick={() => {
                    onQuickDemo('goa');
                    setDemoDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-start gap-2.5 transition-colors cursor-pointer"
                >
                  <span className="text-base mt-0.5">🌴</span>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Hyderabad ➔ Goa · 7 Days
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Budget: ₹50,000 · Direct Flight + Scooter + Coastal Resort
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onQuickDemo('russia');
                    setDemoDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-start gap-2.5 transition-colors cursor-pointer"
                >
                  <span className="text-base mt-0.5">🇷🇺</span>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Hyderabad ➔ Russia · 7 Days
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Budget: ₹1,50,000 · Moscow &amp; St. Petersburg via Sapsan
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Mode Indicator & Settings Trigger */}
          <button
            onClick={onOpenArchitecture}
            title="Click to view n8n Multi-Agent Workflow and configure webhook"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                aiMode === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'
              }`}
            />
            <span className="capitalize">{aiMode} Mode</span>
            <Settings className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* User Profile Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-600 text-white font-semibold text-xs flex items-center justify-center border border-slate-200">
            TJ
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenArchitecture}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            title="n8n Architecture"
          >
            <Layers className="w-5 h-5 text-blue-600" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => {
              onNavigate('planner');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Plan a Trip
          </button>
          <button
            onClick={() => {
              onNavigate('trips');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            My Trips
          </button>
          <button
            onClick={() => {
              onNavigate('explore');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Explore Routes
          </button>
          <button
            onClick={() => {
              onOpenArchitecture();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            AI Architecture &amp; n8n Setup
          </button>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Demos:</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onQuickDemo('goa');
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-1 bg-slate-100 rounded text-slate-800 font-semibold"
              >
                🌴 Goa 7d
              </button>
              <button
                onClick={() => {
                  onQuickDemo('russia');
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-1 bg-slate-100 rounded text-slate-800 font-semibold"
              >
                🇷🇺 Russia 7d
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
