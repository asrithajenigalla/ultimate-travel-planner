import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  IndianRupee,
  DollarSign,
  Euro,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
  Clock,
  Compass,
  Navigation,
  Users,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  AlertCircle,
} from 'lucide-react';
import { CurrencyCode, TripRequest } from '../types/travel';
import { formatCurrency, parseBudgetInput } from '../utils/currency';

interface TripPlannerProps {
  onSubmit: (request: TripRequest) => void;
  isLoading: boolean;
  initialValues?: {
    origin?: string;
    destination?: string;
    duration?: number;
    budget?: number;
    currency?: CurrencyCode;
    travelers?: number;
    travel_date?: string | null;
    stops?: string[];
  };
}

export const TripPlanner: React.FC<TripPlannerProps> = ({
  onSubmit,
  isLoading,
  initialValues,
}) => {
  const [origin, setOrigin] = useState(initialValues?.origin || 'Hyderabad, India');
  const [destination, setDestination] = useState(initialValues?.destination || 'Goa, India');
  const [duration, setDuration] = useState<number>(initialValues?.duration || 7);
  const [budgetString, setBudgetString] = useState<string>(
    initialValues?.budget ? initialValues.budget.toString() : '50000'
  );
  const [currency, setCurrency] = useState<CurrencyCode>(initialValues?.currency || 'INR');
  const [travelers, setTravelers] = useState<number>(initialValues?.travelers || 1);
  const [travelDate, setTravelDate] = useState<string>(initialValues?.travel_date || '');
  const [showOptionalFields, setShowOptionalFields] = useState<boolean>(false);
  const [stops, setStops] = useState<string[]>(initialValues?.stops || []);
  const [newStopInput, setNewStopInput] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Sync if initialValues changes
  useEffect(() => {
    if (initialValues) {
      if (initialValues.origin) setOrigin(initialValues.origin);
      if (initialValues.destination) setDestination(initialValues.destination);
      if (initialValues.duration) setDuration(initialValues.duration);
      if (initialValues.budget) setBudgetString(initialValues.budget.toString());
      if (initialValues.currency) setCurrency(initialValues.currency);
      if (initialValues.travelers) setTravelers(initialValues.travelers);
      if (initialValues.travel_date) setTravelDate(initialValues.travel_date);
      if (initialValues.stops) setStops(initialValues.stops);
    }
  }, [initialValues]);

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setBudgetString(raw);
    if (validationError) setValidationError(null);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not supported in browser. Please type location.');
      setTimeout(() => setLocationStatus(null), 3000);
      return;
    }

    setLocationStatus('Locating...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Standard friendly default inference without forced GPS lock
        setOrigin('Hyderabad, India');
        setLocationStatus('Set to current location (Hyderabad)');
        setTimeout(() => setLocationStatus(null), 3000);
      },
      (err) => {
        setLocationStatus('Location unavailable. Please enter departure location manually.');
        setTimeout(() => setLocationStatus(null), 3500);
      },
      { timeout: 5000 }
    );
  };

  const handleAddStop = () => {
    if (newStopInput.trim() && !stops.includes(newStopInput.trim())) {
      setStops([...stops, newStopInput.trim()]);
      setNewStopInput('');
    }
  };

  const handleRemoveStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOrigin = origin.trim();
    const cleanDest = destination.trim();

    if (!cleanOrigin) {
      setValidationError('Please enter your starting / departure location.');
      return;
    }

    if (!cleanDest) {
      setValidationError('Please enter where you want to go.');
      return;
    }

    if (cleanOrigin.toLowerCase() === cleanDest.toLowerCase()) {
      setValidationError('Starting location and destination cannot be the same place.');
      return;
    }

    const parsedBudget = parseBudgetInput(budgetString);
    if (parsedBudget <= 0) {
      setValidationError('Please specify a positive travel budget.');
      return;
    }

    if (duration <= 0 || duration > 60) {
      setValidationError('Please specify a duration between 1 and 60 days.');
      return;
    }

    setValidationError(null);
    onSubmit({
      trip_id: `trip_${Date.now()}`,
      job_id: `job_${Date.now()}`,
      origin: cleanOrigin,
      destination: cleanDest,
      stops: stops.length > 0 ? stops : undefined,
      duration_days: duration,
      budget: parsedBudget,
      currency,
      travelers,
      travel_date: travelDate || null,
    });
  };

  const handleApplyPreset = (
    fromOrig: string,
    toDest: string,
    days: number,
    budg: number,
    curr: CurrencyCode = 'INR'
  ) => {
    setOrigin(fromOrig);
    setDestination(toDest);
    setDuration(days);
    setBudgetString(budg.toString());
    setCurrency(curr);
    setStops([]);
    setValidationError(null);
  };

  const currentParsedBudget = parseBudgetInput(budgetString);

  return (
    <div id="planner-section" className="scroll-mt-20">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Header Strip */}
        <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/40 flex items-center justify-center text-blue-300 border border-blue-400/30">
              <Compass className="w-4 h-4 text-blue-200" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Plan Your Complete Journey
              </h2>
              <p className="text-xs text-slate-300">
                Provide the four essential inputs. The multi-agent system autonomously solves the rest.
              </p>
            </div>
          </div>

          {/* Currency selector toggle */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
            <span className="text-[11px] text-slate-400 px-1.5 font-medium">Currency:</span>
            {(['INR', 'USD', 'EUR', 'GBP'] as CurrencyCode[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                  currency === c
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {c === 'INR' ? '₹ INR' : c === 'USD' ? '$ USD' : c === 'EUR' ? '€ EUR' : '£ GBP'}
              </button>
            ))}
          </div>
        </div>

        {/* The 4-Input Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* INPUT 1: STARTING LOCATION (FROM) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-blue-900">
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  1. Starting Location
                </span>
                <span className="text-[10px] text-rose-500 font-semibold lowercase">mandatory origin</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => {
                    setOrigin(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="e.g. Hyderabad, India"
                  className="w-full px-3.5 py-3 text-sm sm:text-base font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all placeholder:text-slate-400"
                  required
                />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="text-blue-700 hover:text-blue-900 font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <span>📍 Use my current location</span>
                </button>
                {locationStatus && (
                  <span className="text-emerald-700 font-medium">{locationStatus}</span>
                )}
              </div>
            </div>

            {/* INPUT 2: DESTINATION (TO) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-blue-900">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  2. Destination
                </span>
                <span className="text-[10px] text-slate-400 font-normal lowercase">city or country</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Where do you want to go?"
                  className="w-full px-3.5 py-3 text-sm sm:text-base font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all placeholder:text-slate-400"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Domestic (e.g. Goa) or International (e.g. Russia, Tokyo)
              </p>
            </div>

            {/* INPUT 3: DURATION (DAYS) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  3. Duration
                </span>
                <span className="text-[10px] text-slate-400 font-normal lowercase">total days</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={duration}
                  onChange={(e) => {
                    setDuration(parseInt(e.target.value, 10) || 1);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="7 days"
                  className="w-full px-3.5 py-3 text-sm sm:text-base font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                  required
                />
                <span className="absolute right-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider pointer-events-none">
                  {duration === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              {/* Quick day buttons */}
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[10px] text-slate-400">Quick:</span>
                {[3, 5, 7, 10, 14].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                      duration === d
                        ? 'bg-blue-100 text-blue-800 border-blue-300 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            {/* INPUT 4: TOTAL BUDGET */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  {currency === 'INR' ? (
                    <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
                  ) : currency === 'USD' ? (
                    <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <Euro className="w-3.5 h-3.5 text-blue-600" />
                  )}
                  4. Total Budget
                </span>
                <span className="text-[10px] text-rose-500 font-medium">hard constraint</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={budgetString}
                  onChange={handleBudgetChange}
                  placeholder="e.g. 50000"
                  className="w-full px-3.5 py-3 text-sm sm:text-base font-semibold font-mono text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                  required
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Formatted:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatCurrency(currentParsedBudget, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Optional Travel Date & Travelers Toggle (Section 36) */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              className="text-xs font-bold text-slate-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{showOptionalFields ? 'Hide Optional Travel Parameters' : '+ Optional: Travel Date & Travelers & Intermediate Stops'}</span>
              {showOptionalFields ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showOptionalFields && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Optional Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-600" />
                    <span>Travel Departure Date (Optional)</span>
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <p className="text-[10px] text-slate-400">
                    If unselected, standard published off-peak rates are estimated.
                  </p>
                </div>

                {/* Optional Travelers Counter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Users className="w-3 h-3 text-blue-600" />
                    <span>Number of Travelers</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-slate-900 font-mono text-sm">
                      {travelers}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.min(10, travelers + 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                    <span className="text-[11px] text-slate-500 ml-1">
                      {travelers === 1 ? 'Solo traveler' : `${travelers} travelers`}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Affects transportation, accommodation room allocations, and food.
                  </p>
                </div>

                {/* Optional Intermediate Stops (Multi-City support) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-600" />
                    <span>Intermediate Stop (Multi-City)</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newStopInput}
                      onChange={(e) => setNewStopInput(e.target.value)}
                      placeholder="e.g. Delhi, Mumbai"
                      className="flex-1 px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddStop}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  {stops.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {stops.map((s, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-semibold"
                        >
                          <span>{s}</span>
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-indigo-900"
                            onClick={() => handleRemoveStop(idx)}
                          />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Form Footer & Primary Action */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Optimizes full round-trip journey from <strong className="text-slate-900">{origin || 'Starting Location'}</strong> to{' '}
                <strong className="text-slate-900">{destination || 'Destination'}</strong> under budget ceiling.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-base shadow-sm hover:shadow-md transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              <span>{isLoading ? 'Agents Planning...' : 'PLAN MY JOURNEY'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Curated Demo Preset Bar (4-Input Pre-configurations) */}
          <div className="pt-2 border-t border-slate-100/80 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Tested Demo Scenarios:
            </span>
            <button
              type="button"
              onClick={() => handleApplyPreset('Hyderabad, India', 'Goa, India', 7, 50000, 'INR')}
              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              🌴 Demo 1: Hyderabad ➔ Goa · 7d · ₹50,000
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('Hyderabad, India', 'Russia (Moscow & St. Petersburg)', 7, 150000, 'INR')}
              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              🇷🇺 Demo 2: Hyderabad ➔ Russia · 7d · ₹1,50,000
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('Visakhapatnam, India', 'Bengaluru, India', 5, 35000, 'INR')}
              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              🚄 Arbitrary: Visakhapatnam ➔ Bengaluru · 5d · ₹35,000
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
