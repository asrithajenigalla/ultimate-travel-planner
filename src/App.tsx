import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TripPlanner } from './components/TripPlanner';
import { AgentStatusScreen } from './components/AgentStatusScreen';
import { TripSummaryHeader } from './components/TripSummaryHeader';
import { BudgetOverview } from './components/BudgetOverview';
import { OptimizationLoopVisualizer } from './components/OptimizationLoopVisualizer';
import { AssumptionsBox } from './components/AssumptionsBox';
import { FeasibilityAndRisk } from './components/FeasibilityAndRisk';
import { AlternativePlans } from './components/AlternativePlans';
import { TransportationSummary } from './components/TransportationSummary';
import { AccommodationSummary } from './components/AccommodationSummary';
import { ItineraryTimeline } from './components/ItineraryTimeline';
import { FoodAndExpenses } from './components/FoodAndExpenses';
import { ActivitiesList } from './components/ActivitiesList';
import { TravelRequirements } from './components/TravelRequirements';
import { TripMap } from './components/TripMap';
import { AgentWorkflowVisualizer } from './components/AgentWorkflowVisualizer';
import { MyTripsView } from './components/MyTripsView';
import { ExploreDestinationsView } from './components/ExploreDestinationsView';
import { N8nArchitectureModal } from './components/N8nArchitectureModal';
import { ErrorState } from './components/ErrorState';
import { Footer } from './components/Footer';

import {
  TripRequest,
  TripResult,
  AgentStatusItem,
  SavedTripSummary,
  CurrencyCode,
} from './types/travel';
import {
  planTrip,
  switchTripAlternative,
  getTravelAiMode,
} from './services/travelPlannerService';
import {
  MOCK_RUSSIA_TRIP,
  MOCK_GOA_TRIP,
  INITIAL_SAVED_TRIPS,
} from './data/mockTrips';

export function App() {
  const [currentView, setCurrentView] = useState<'planner' | 'trips' | 'architecture' | 'explore'>('planner');
  const [plannerState, setPlannerState] = useState<'idle' | 'planning' | 'results' | 'error'>('results');
  const [activeTrip, setActiveTrip] = useState<TripResult>(MOCK_GOA_TRIP);
  const [agentStatusList, setAgentStatusList] = useState<AgentStatusItem[]>(MOCK_GOA_TRIP.agent_status);
  const [currentAgentStep, setCurrentAgentStep] = useState<number>(MOCK_GOA_TRIP.agent_status.length - 1);
  const [isSkipRequested, setIsSkipRequested] = useState<boolean>(false);
  const skipRef = useRef<boolean>(false);

  // Saved trips persisted in localStorage
  const [savedTrips, setSavedTrips] = useState<SavedTripSummary[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('utt_saved_trips');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return INITIAL_SAVED_TRIPS;
        }
      }
    }
    return INITIAL_SAVED_TRIPS;
  });

  const [architectureModalOpen, setArchitectureModalOpen] = useState(false);
  const [plannerFormValues, setPlannerFormValues] = useState<{
    origin: string;
    destination: string;
    duration: number;
    budget: number;
    currency: CurrencyCode;
    travelers?: number;
    travel_date?: string | null;
    stops?: string[];
  }>({
    origin: 'Hyderabad, India',
    destination: 'Goa, India',
    duration: 7,
    budget: 50000,
    currency: 'INR',
    travelers: 1,
    travel_date: null,
    stops: [],
  });

  // Sync savedTrips to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('utt_saved_trips', JSON.stringify(savedTrips));
    }
  }, [savedTrips]);

  const handlePlanTrip = async (request: TripRequest) => {
    setPlannerFormValues({
      origin: request.origin,
      destination: request.destination,
      duration: request.duration_days,
      budget: request.budget,
      currency: request.currency,
      travelers: request.travelers || 1,
      travel_date: request.travel_date || null,
      stops: request.stops || [],
    });

    setPlannerState('planning');
    skipRef.current = false;
    setIsSkipRequested(false);

    // Initial agent list placeholder
    const initialAgents: AgentStatusItem[] = [
      { id: 'orchestrator', name: 'Orchestrator Agent', role: 'Workflow Coordination', status: 'running', message: `Analyzing ${request.origin} ➔ ${request.destination} trip request...` },
      { id: 'origin_analysis', name: 'Origin Analyzer', role: 'Departure Hub Analysis', status: 'pending', message: 'Determining nearest departure terminals...' },
      { id: 'destination_analysis', name: 'Destination Analyzer', role: 'Geography & Arrival Gateway', status: 'pending', message: 'Evaluating destination geography...' },
      { id: 'router', name: 'Dynamic Agent Router', role: 'Specialist Agent Dispatcher', status: 'pending', message: 'Identifying required specialist agents...' },
      { id: 'flight', name: 'Transportation Agents', role: 'Aviation & Rail Routing', status: 'pending', message: 'Discovering outbound & return routes...' },
      { id: 'accommodation', name: 'Accommodation Agent', role: 'Lodging Selection', status: 'pending', message: 'Evaluating stay proximity & tariffs...' },
      { id: 'local_transport', name: 'Local Transport Agent', role: 'Urban Mobility', status: 'pending', message: 'Planning internal movement...' },
      { id: 'expense', name: 'Food & Expense Agent', role: 'Living Cost Estimation', status: 'pending', message: 'Calculating daily per-diem allowances...' },
      { id: 'activity', name: 'Activities Agent', role: 'Experience Curation', status: 'pending', message: 'Selecting landmark admissions...' },
      { id: 'feasibility', name: 'Feasibility Agent', role: 'Consistency & Conflict Check', status: 'pending', message: 'Checking connections & transfer timing...' },
      { id: 'risk', name: 'Risk & Buffer Agent', role: 'Buffer & Vulnerability Check', status: 'pending', message: 'Analyzing buffer adequacy...' },
      { id: 'optimization', name: 'Whole-Journey Optimization Agent', role: 'Combinatorial Solver', status: 'pending', message: 'Enforcing budget hard constraint...' },
      { id: 'itinerary', name: 'Itinerary Agent', role: 'Timeline Synthesizer', status: 'pending', message: 'Sequencing chronological timeline...' },
      { id: 'synthesis', name: 'Final Synthesis Agent', role: 'Package Finalizer', status: 'pending', message: 'Packaging complete journey...' },
    ];

    setAgentStatusList(initialAgents);
    setCurrentAgentStep(0);

    // Scroll to status screen
    const element = document.getElementById('planning-status-anchor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      const result = await planTrip(request, {
        simulateAgentProgression: true,
        onAgentStatusUpdate: (updatedAgents, stepIndex) => {
          if (!skipRef.current) {
            setAgentStatusList(updatedAgents);
            setCurrentAgentStep(stepIndex);
          }
        },
      });

      setActiveTrip(result);

      if (result.status === 'budget_violation') {
        setPlannerState('error');
      } else {
        setPlannerState('results');
      }

      // Scroll to results anchor
      setTimeout(() => {
        const resultsEl = document.getElementById('results-dashboard');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Trip planning error:', err);
      const errTrip: TripResult = {
        ...MOCK_GOA_TRIP,
        status: 'error',
        errorMessage: err.message || 'Service temporarily unavailable.',
      };
      setActiveTrip(errTrip);
      setPlannerState('error');
    }
  };

  const handleSkipAgentProgression = () => {
    skipRef.current = true;
    setIsSkipRequested(true);
    if (activeTrip) {
      setAgentStatusList(activeTrip.agent_status);
      setCurrentAgentStep(activeTrip.agent_status.length - 1);
      setPlannerState(activeTrip.status === 'budget_violation' ? 'error' : 'results');
    }
  };

  const handleQuickDemo = (type: 'russia' | 'goa') => {
    setCurrentView('planner');
    if (type === 'goa') {
      handlePlanTrip({
        origin: 'Hyderabad, India',
        destination: 'Goa, India',
        duration_days: 7,
        budget: 50000,
        currency: 'INR',
        travelers: 1,
      });
    } else {
      handlePlanTrip({
        origin: 'Hyderabad, India',
        destination: 'Russia (Moscow & St. Petersburg)',
        duration_days: 7,
        budget: 150000,
        currency: 'INR',
        travelers: 1,
      });
    }
  };

  const handleSelectPreset = (
    origin: string,
    destination: string,
    days: number,
    budget: number
  ) => {
    setCurrentView('planner');
    handlePlanTrip({
      origin,
      destination,
      duration_days: days,
      budget,
      currency: 'INR',
      travelers: 1,
    });
  };

  const handleSwitchAlternative = (altId: 'balanced' | 'budget' | 'comfort') => {
    if (!activeTrip) return;
    const updated = switchTripAlternative(activeTrip, altId);
    setActiveTrip(updated);
  };

  const handleSaveTrip = (tripToSave: TripResult) => {
    const newSummary: SavedTripSummary = {
      id: tripToSave.id,
      trip_id: tripToSave.trip_id,
      title: `${tripToSave.trip.origin.split(',')[0]} ➔ ${tripToSave.trip.destination.split(',')[0]} (${tripToSave.trip.duration_days} Days)`,
      destination: tripToSave.trip.destination,
      origin: tripToSave.trip.origin,
      duration_days: tripToSave.trip.duration_days,
      budget: tripToSave.trip.budget,
      estimated_total: tripToSave.summary.estimated_total,
      currency: tripToSave.trip.currency,
      travelers: tripToSave.trip.travelers,
      status: 'AI Plan Ready',
      createdAt: new Date().toISOString(),
      category: 'Upcoming',
      imageUrl: tripToSave.accommodation?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      transportSummary: `${tripToSave.transportation.outbound?.provider || 'Flights'} + Transit`,
      staySummary: tripToSave.accommodation?.[0]?.name || 'Curated Boutique Stay',
    };

    setSavedTrips((prev) => {
      const filtered = prev.filter((t) => t.id !== newSummary.id);
      return [newSummary, ...filtered];
    });
  };

  const handleDeleteSavedTrip = (id: string) => {
    setSavedTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const handleViewSavedTrip = (id: string) => {
    if (id.includes('russia')) {
      setActiveTrip(MOCK_RUSSIA_TRIP);
    } else {
      setActiveTrip(MOCK_GOA_TRIP);
    }
    setPlannerState('results');
    setCurrentView('planner');
    setTimeout(() => {
      const el = document.getElementById('results-dashboard');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenArchitecture={() => setArchitectureModalOpen(true)}
        onQuickDemo={handleQuickDemo}
      />

      <main className="flex-1">
        {/* VIEW 1: MY TRIPS VIEW */}
        {currentView === 'trips' && (
          <MyTripsView
            savedTrips={savedTrips}
            onViewTrip={handleViewSavedTrip}
            onDeleteTrip={handleDeleteSavedTrip}
            onPlanNewTrip={() => {
              setCurrentView('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW 2: EXPLORE ROUTES VIEW */}
        {currentView === 'explore' && (
          <ExploreDestinationsView onSelectRoute={handleSelectPreset} />
        )}

        {/* VIEW 3: MAIN TRIP PLANNER VIEW */}
        {currentView === 'planner' && (
          <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <Hero
              onPlanTripClick={() => {
                const el = document.getElementById('planner-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreArchitecture={() => setArchitectureModalOpen(true)}
              onSelectPreset={handleSelectPreset}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              {/* Primary 4-Input Planner Section */}
              <TripPlanner
                onSubmit={handlePlanTrip}
                isLoading={plannerState === 'planning'}
                initialValues={plannerFormValues}
              />

              {/* Anchor for auto-scroll */}
              <div id="planning-status-anchor" />

              {/* State: Planning / Agent Status Screen */}
              {plannerState === 'planning' && (
                <AgentStatusScreen
                  agents={agentStatusList}
                  currentStepIndex={currentAgentStep}
                  origin={plannerFormValues.origin}
                  destination={plannerFormValues.destination}
                  duration={plannerFormValues.duration}
                  budget={plannerFormValues.budget}
                  currency={plannerFormValues.currency}
                  travelers={plannerFormValues.travelers}
                  onSkip={handleSkipAgentProgression}
                  isComplete={false}
                />
              )}

              {/* State: Error / Budget Constraint Violation */}
              {plannerState === 'error' && (
                <ErrorState
                  trip={activeTrip}
                  onModifyInputs={() => {
                    const el = document.getElementById('planner-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onIncreaseBudget={(newBudget) => {
                    handlePlanTrip({
                      ...plannerFormValues,
                      duration_days: plannerFormValues.duration,
                      budget: newBudget,
                    });
                  }}
                />
              )}

              {/* State: Successful Results Dashboard (Section 30 Hierarchy) */}
              {plannerState === 'results' && activeTrip && activeTrip.status === 'success' && (
                <div id="results-dashboard" className="space-y-10 scroll-mt-20">
                  {/* 1. Trip Summary Header & Actions */}
                  <TripSummaryHeader
                    trip={activeTrip}
                    onEditTrip={() => {
                      const el = document.getElementById('planner-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    onSaveTrip={handleSaveTrip}
                    isSaved={savedTrips.some((t) => t.id === activeTrip.id)}
                  />

                  {/* 2. Budget Overview & Utilization Dashboard */}
                  <BudgetOverview trip={activeTrip} />

                  {/* 3. Whole-Journey Optimization Result with Versioning & Replanning Loop */}
                  <OptimizationLoopVisualizer
                    optimization={activeTrip.optimization}
                    budget={activeTrip.trip.budget}
                    finalCost={activeTrip.summary.estimated_total}
                    currency={activeTrip.trip.currency}
                  />

                  {/* 4. Explicit Assumptions Box (Section 36 C & M) */}
                  <AssumptionsBox assumptions={activeTrip.assumptions} />

                  {/* 5. Feasibility & Risk / Buffer Analysis (Sections 12 & 13) */}
                  <FeasibilityAndRisk
                    feasibility={activeTrip.feasibility}
                    risk={activeTrip.risk}
                    currency={activeTrip.trip.currency}
                  />

                  {/* 6. Complete Alternative Plans (Plan A Balanced, B Budget, C Comfort) */}
                  <AlternativePlans
                    alternatives={activeTrip.alternatives}
                    selectedId={activeTrip.selectedAlternativeId}
                    onSelectAlternative={handleSwitchAlternative}
                    currency={activeTrip.trip.currency}
                    budget={activeTrip.trip.budget}
                    origin={activeTrip.trip.origin}
                    destination={activeTrip.trip.destination}
                  />

                  {/* 7. Geospatial Route & Transit Hub Visualization */}
                  <TripMap
                    points={activeTrip.mapData?.points}
                    routes={activeTrip.mapData?.routes}
                    originName={activeTrip.trip.origin}
                    destinationName={activeTrip.trip.destination}
                  />

                  {/* 8. Multimodal Transportation Summary (Doorstep to Doorstep) */}
                  <TransportationSummary
                    transportation={activeTrip.transportation}
                    currency={activeTrip.trip.currency}
                  />

                  {/* 9. Accommodation Summary */}
                  <AccommodationSummary
                    accommodations={activeTrip.accommodation}
                    currency={activeTrip.trip.currency}
                  />

                  {/* 10. Daily Itinerary Timeline (From Origin departure to Return home) */}
                  <ItineraryTimeline
                    itinerary={activeTrip.itinerary}
                    currency={activeTrip.trip.currency}
                  />

                  {/* 11. Food & Estimated Daily Living Expenses */}
                  <FoodAndExpenses
                    expenses={activeTrip.expenses}
                    currency={activeTrip.trip.currency}
                    durationDays={activeTrip.trip.duration_days}
                  />

                  {/* 12. Planned Activities & Sightseeing */}
                  <ActivitiesList
                    activities={activeTrip.activities}
                    currency={activeTrip.trip.currency}
                  />

                  {/* 13. Travel Requirements & Official Formalities (Conditional) */}
                  <TravelRequirements
                    requirements={activeTrip.requirements}
                    destination={activeTrip.trip.destination}
                  />

                  {/* 14. AI Agent Workflow Topology & Dynamic Routing Graph */}
                  <AgentWorkflowVisualizer
                    routing={activeTrip.routing}
                    agents={activeTrip.agent_status}
                    origin={activeTrip.trip.origin}
                    destination={activeTrip.trip.destination}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenArchitecture={() => setArchitectureModalOpen(true)}
        onSelectPreset={handleSelectPreset}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Architecture & n8n Integration Modal */}
      <N8nArchitectureModal
        isOpen={architectureModalOpen}
        onClose={() => setArchitectureModalOpen(false)}
        onModeChanged={(newMode) => {
          // Trigger re-render
        }}
      />
    </div>
  );
}

export default App;
