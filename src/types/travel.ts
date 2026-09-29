export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export type DataMode = 'live' | 'estimated' | 'demo';

export interface TripRequest {
  trip_id?: string;
  job_id?: string;
  origin: string; // MANDATORY Starting Location
  destination: string; // MANDATORY Destination
  stops?: string[]; // Optional intermediate cities for future multi-city support
  duration_days: number;
  budget: number;
  currency: CurrencyCode;
  travel_date?: string | null; // Optional travel date
  travelers?: number; // Optional number of travelers (default 1)
}

export type AgentId =
  | 'orchestrator'
  | 'origin_analysis'
  | 'destination_analysis'
  | 'router'
  | 'flight'
  | 'train'
  | 'bus'
  | 'road'
  | 'ferry'
  | 'local_transport'
  | 'accommodation'
  | 'expense'
  | 'activity'
  | 'requirements'
  | 'feasibility'
  | 'risk'
  | 'optimization'
  | 'itinerary'
  | 'synthesis';

export type AgentStatusState = 'pending' | 'running' | 'completed' | 'failed' | 'optimized' | 'skipped';

export interface AgentStatusItem {
  id: AgentId;
  name: string;
  role: string;
  status: AgentStatusState;
  message: string;
  timestamp?: string;
  duration_ms?: number;
  outputSummary?: string;
  source?: 'n8n' | 'mock';
  selectionReason?: string;
}

export interface AgentRoutingInfo {
  trip_type: 'domestic' | 'international';
  is_multimodal: boolean;
  is_multi_city: boolean;
  selected_agents: AgentId[];
  agent_reasons: Record<string, string>;
  origin_analysis: {
    origin_name: string;
    origin_country: string;
    nearest_major_hub: string;
    hub_transfer_required: boolean;
    hub_transfer_mode?: string;
  };
  destination_analysis: {
    destination_name: string;
    destination_country: string;
    arrival_hub: string;
    geography_type: 'coastal' | 'metropolis' | 'mountain' | 'historic' | 'island' | 'general';
  };
}

export interface TransportSegment {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'metro' | 'taxi' | 'ferry' | 'car' | 'walking';
  provider: string;
  carrierCode?: string;
  departureStation: string;
  arrivalStation: string;
  departureTime?: string;
  arrivalTime?: string;
  duration: string;
  duration_minutes?: number;
  transfers: number;
  transferDetails?: string;
  estimatedCost: number;
  currency: CurrencyCode;
  classOrType?: string;
  baggageAllowance?: string;
  isConfirmedBooking?: boolean;
  source?: 'live' | 'estimated' | 'demo';
  availability_status?: 'live' | 'estimated' | 'demo';
}

export interface LocalTransportOption {
  day: number;
  route: string;
  modes: ('metro' | 'bus' | 'taxi' | 'walking' | 'train' | 'ferry' | 'car')[];
  description: string;
  estimatedCost: number;
  currency: CurrencyCode;
  recommendedPass?: string;
}

export interface TransportationData {
  outbound: TransportSegment;
  return: TransportSegment;
  firstMileTransfer?: TransportSegment; // Starting location to departure hub
  lastMileTransfer?: TransportSegment; // Arrival hub back to starting location
  intercity?: TransportSegment[];
  local: LocalTransportOption[];
}

export interface AccommodationItem {
  id: string;
  name: string;
  type: 'Hotel' | 'Hostel' | 'Resort' | 'Homestay' | 'Serviced Apartment' | 'Boutique Stay';
  location: string;
  neighborhood: string;
  nights: number;
  pricePerNight: number;
  estimatedTotal: number;
  currency: CurrencyCode;
  rating: number;
  reviewCount: number;
  amenities: string[];
  whySelected: string;
  distanceFromMajorActivities: string;
  imageUrl?: string;
  isEcoCertified?: boolean;
}

export interface ExpenseItem {
  category: 'Food & Dining' | 'Local Transport' | 'Activities & Tickets' | 'Miscellaneous & Buffer' | 'Intercity Travel' | 'Accommodation';
  estimatedCost: number;
  isConfirmed: boolean;
  notes: string;
}

export interface DailyExpenses {
  dailyFoodEstimate: number;
  dailyLocalTransport: number;
  dailyMisc: number;
  totalFood: number;
  totalLocalTransport: number;
  totalActivities: number;
  totalMiscBuffer: number;
  currency: CurrencyCode;
  breakdown: ExpenseItem[];
}

export interface ActivityItem {
  id: string;
  day: number;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Full Day';
  name: string;
  category: 'Sightseeing' | 'Museum' | 'Cultural' | 'Nature & Adventure' | 'Culinary' | 'Historic Landmark';
  location: string;
  durationHours: number;
  estimatedCost: number;
  currency: CurrencyCode;
  includedInPlan: boolean;
  description: string;
  bookingRequired: boolean;
}

export interface ItineraryStop {
  time?: string;
  title: string;
  description: string;
  location: string;
  transportToNext?: string;
  estimatedCost?: number;
  costCategory?: 'Food' | 'Activity' | 'Transport' | 'Stay' | 'Free';
  iconType?: 'plane' | 'hotel' | 'food' | 'landmark' | 'metro' | 'walk' | 'camera';
}

export interface DailyItinerary {
  day: number;
  dateLabel?: string;
  title: string;
  theme: string;
  highlights: string[];
  stops: ItineraryStop[];
  estimatedDayCost: number;
}

export interface OptimizationStep {
  step: number;
  action: string;
  component: string;
  previousCost: number;
  costDelta: number;
  newCost: number;
  rationale: string;
}

export interface OptimizationIteration {
  version: number;
  totalCost: number;
  status: 'over_budget' | 'feasible';
  costDelta: number;
  actionsTaken: string[];
  rationale: string;
}

export interface ExplainableDecision {
  component: string;
  decision: string;
  whySelected: string;
  tradeOff: string;
}

export interface AlternativePlan {
  id: 'balanced' | 'budget' | 'comfort';
  name: string;
  label: string;
  estimatedTotal: number;
  currency: CurrencyCode;
  savingsOrPremium: number;
  travelTimeDiff: string;
  comfortLevel: 'Standard' | 'Budget Saver' | 'Premium Comfort';
  tradeoffSummary: string;
  highlights: string[];
  outboundSummary?: string;
  returnSummary?: string;
  accommodationSummary?: string;
}

export interface OptimizationData {
  reasoning_summary: string;
  constraints_satisfied: boolean;
  initialCandidateCost?: number;
  optimization_steps: OptimizationStep[];
  iterations?: OptimizationIteration[];
  selected_version?: number;
  total_cost_saved?: number;
  explainable_decisions?: ExplainableDecision[];
  keySelectionFactors: string[];
}

export interface FeasibilityCheck {
  name: string;
  passed: boolean;
  details: string;
}

export interface FeasibilityData {
  status: 'feasible' | 'needs_adjustment';
  summary: string;
  checks: FeasibilityCheck[];
  issues?: string[];
}

export interface RiskFlag {
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  mitigation?: string;
}

export interface RiskData {
  level: 'low' | 'moderate' | 'elevated';
  score: number; // 0-100
  summary: string;
  flags: RiskFlag[];
  buffer_status: {
    remaining_buffer: number;
    buffer_percentage: number;
    buffer_rating: 'healthy' | 'tight' | 'critical';
  };
}

export interface TravelRequirement {
  type: 'visa' | 'passport' | 'insurance' | 'health' | 'customs' | 'domestic_id';
  title: string;
  status: 'Required' | 'Recommended' | 'Mandatory' | 'Exempt';
  details: string;
  sourceNote: string;
  actionUrl?: string;
}

export interface MapPoint {
  id: string;
  name: string;
  type: 'origin' | 'destination' | 'hub' | 'hotel' | 'activity';
  latitude: number;
  longitude: number;
  description: string;
}

export interface MapRoute {
  from: string;
  to: string;
  mode: 'flight' | 'train' | 'car' | 'metro';
  label: string;
}

export interface TripResult {
  id: string;
  trip_id?: string;
  job_id?: string;
  createdAt: string;
  status: 'success' | 'budget_violation' | 'error';
  mode: 'mock' | 'live';
  data_mode?: DataMode; // 'live' | 'estimated' | 'demo'
  trip: {
    origin: string; // Starting location
    destination: string; // Destination
    stops?: string[]; // Intermediate stops
    duration_days: number;
    budget: number;
    currency: CurrencyCode;
    travelers: number;
    travel_date?: string | null;
  };
  routing?: AgentRoutingInfo;
  feasibility?: FeasibilityData;
  risk?: RiskData;
  assumptions?: string[];
  summary: {
    estimated_total: number;
    remaining_budget: number;
    percent_allocated: number;
    outboundTransportTotal?: number;
    returnTransportTotal?: number;
    transportTotal: number;
    accommodationTotal: number;
    localTransportTotal: number;
    foodTotal: number;
    activitiesTotal: number;
    miscTotal: number;
  };
  transportation: TransportationData;
  accommodation: AccommodationItem[];
  expenses: DailyExpenses;
  activities: ActivityItem[];
  itinerary: DailyItinerary[];
  alternatives: AlternativePlan[];
  selectedAlternativeId: 'balanced' | 'budget' | 'comfort';
  optimization: OptimizationData;
  requirements: TravelRequirement[];
  agent_status: AgentStatusItem[];
  mapData?: {
    points: MapPoint[];
    routes: MapRoute[];
  };
  errorMessage?: string;
  errorResolution?: {
    causeComponent: string;
    consideredAlternatives: string[];
    requiredAdditionalBudget: number;
  };
}

export interface SavedTripSummary {
  id: string;
  trip_id?: string;
  title: string;
  destination: string;
  origin: string;
  duration_days: number;
  budget: number;
  estimated_total: number;
  currency: CurrencyCode;
  status: 'AI Plan Ready' | 'Draft' | 'Confirmed';
  createdAt: string;
  category: 'Upcoming' | 'Completed' | 'Saved';
  imageUrl: string;
  transportSummary: string;
  staySummary: string;
  travelers?: number;
}
