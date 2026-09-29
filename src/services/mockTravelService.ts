import {
  TripRequest,
  TripResult,
  AgentStatusItem,
  AlternativePlan,
  DailyItinerary,
  ActivityItem,
  AccommodationItem,
  TravelRequirement,
  OptimizationStep,
  OptimizationIteration,
  ExplainableDecision,
  FeasibilityData,
  RiskData,
  AgentRoutingInfo,
  MapPoint,
  MapRoute,
  AgentId,
} from '../types/travel';
import { MOCK_RUSSIA_TRIP, MOCK_GOA_TRIP } from '../data/mockTrips';

export function isDomesticTravel(origin: string, destination: string): boolean {
  const normOrigin = origin.toLowerCase().trim();
  const normDest = destination.toLowerCase().trim();

  const isOriginIndia =
    normOrigin.includes('india') ||
    normOrigin.includes('hyderabad') ||
    normOrigin.includes('delhi') ||
    normOrigin.includes('mumbai') ||
    normOrigin.includes('bengaluru') ||
    normOrigin.includes('bangalore') ||
    normOrigin.includes('chennai') ||
    normOrigin.includes('kolkata') ||
    normOrigin.includes('visakhapatnam') ||
    normOrigin.includes('vizag') ||
    normOrigin.includes('pune') ||
    normOrigin.includes('goa') ||
    normOrigin.includes('kerala');

  const isDestIndia =
    normDest.includes('india') ||
    normDest.includes('goa') ||
    normDest.includes('kerala') ||
    normDest.includes('manali') ||
    normDest.includes('hyderabad') ||
    normDest.includes('mumbai') ||
    normDest.includes('delhi') ||
    normDest.includes('bengaluru') ||
    normDest.includes('bangalore') ||
    normDest.includes('jaipur') ||
    normDest.includes('rajasthan') ||
    normDest.includes('agra') ||
    normDest.includes('kashmir') ||
    normDest.includes('ladakh') ||
    normDest.includes('varanasi') ||
    normDest.includes('shimla') ||
    normDest.includes('rishikesh') ||
    normDest.includes('udaipur') ||
    normDest.includes('pondicherry') ||
    normDest.includes('chennai') ||
    normDest.includes('kolkata') ||
    normDest.includes('ooty') ||
    normDest.includes('coorg') ||
    normDest.includes('munnar') ||
    normDest.includes('hampi') ||
    normDest.includes('darjeeling');

  return isOriginIndia && isDestIndia;
}

export function detectHub(locationName: string): { hubName: string; hubCode: string; transferRequired: boolean; mode: string } {
  const norm = locationName.toLowerCase().trim();

  if (norm.includes('hyderabad')) {
    return { hubName: 'Rajiv Gandhi International (HYD) / Secunderabad Rail (SC)', hubCode: 'HYD', transferRequired: true, mode: 'Express Cab / Metro' };
  }
  if (norm.includes('delhi')) {
    return { hubName: 'Indira Gandhi International (DEL) / New Delhi Rail (NDLS)', hubCode: 'DEL', transferRequired: true, mode: 'Airport Express Metro' };
  }
  if (norm.includes('mumbai') || norm.includes('bombay')) {
    return { hubName: 'Chhatrapati Shivaji Maharaj (BOM) / Mumbai Central', hubCode: 'BOM', transferRequired: true, mode: 'Suburban Rail / Cab' };
  }
  if (norm.includes('bengaluru') || norm.includes('bangalore')) {
    return { hubName: 'Kempegowda International (BLR) / KSR Bengaluru Rail', hubCode: 'BLR', transferRequired: true, mode: 'Vayu Vajra Express Coach' };
  }
  if (norm.includes('visakhapatnam') || norm.includes('vizag')) {
    return { hubName: 'Visakhapatnam Airport (VTZ) / Vizag Central Station', hubCode: 'VTZ', transferRequired: true, mode: 'City Cab' };
  }
  if (norm.includes('goa')) {
    return { hubName: 'Manohar Mopa International (GOX) / Thivim Rail', hubCode: 'GOX', transferRequired: true, mode: 'Pre-paid Airport Cab' };
  }

  // Default inference for arbitrary small town/city
  return {
    hubName: `Regional Departure Terminal (${locationName})`,
    hubCode: 'REG',
    transferRequired: true,
    mode: 'Regional Transit Link',
  };
}

// Cost baselines per traveler in INR
function getCostBaselines(destination: string, isDomestic: boolean) {
  if (isDomestic) {
    return {
      flightOrTrainBase: 7000, // roundtrip per person
      stayPerNight: 2800,
      dailyFood: 1100,
      dailyLocalTransit: 550,
      dailyActivities: 450,
      dailyMisc: 250,
    };
  }

  const norm = destination.toLowerCase();
  const isHighCost =
    norm.includes('switzerland') ||
    norm.includes('london') ||
    norm.includes('uk') ||
    norm.includes('usa') ||
    norm.includes('america') ||
    norm.includes('japan') ||
    norm.includes('tokyo') ||
    norm.includes('paris') ||
    norm.includes('france') ||
    norm.includes('norway');

  if (isHighCost) {
    return {
      flightOrTrainBase: 58000,
      stayPerNight: 8500,
      dailyFood: 3500,
      dailyLocalTransit: 1400,
      dailyActivities: 2200,
      dailyMisc: 1000,
    };
  }

  // Moderate international (Russia, Thailand, Vietnam, Bali, Dubai, Turkey, etc.)
  return {
    flightOrTrainBase: 42000,
    stayPerNight: 5200,
    dailyFood: 2200,
    dailyLocalTransit: 900,
    dailyActivities: 1500,
    dailyMisc: 700,
  };
}

export function generateDynamicTripPlan(request: TripRequest): TripResult {
  const normOrigin = request.origin.toLowerCase().trim();
  const normDest = request.destination.toLowerCase().trim();
  const travelers = Math.max(1, request.travelers || 1);
  const days = Math.max(2, Math.min(30, request.duration_days));
  const userBudget = request.budget;

  // 1. Check if user is requesting curated flagship Goa demo
  if (
    (normOrigin.includes('hyderabad') || normOrigin.includes('hyd')) &&
    normDest.includes('goa') &&
    days === 7 &&
    userBudget === 50000
  ) {
    return {
      ...MOCK_GOA_TRIP,
      id: `trip-goa-${Date.now()}`,
      trip_id: request.trip_id || `trip_goa_${Date.now()}`,
      job_id: request.job_id || `job_goa_${Date.now()}`,
      createdAt: new Date().toISOString(),
      trip: {
        ...MOCK_GOA_TRIP.trip,
        origin: request.origin,
        destination: request.destination,
        duration_days: days,
        budget: userBudget,
        currency: request.currency,
        travelers: travelers,
        travel_date: request.travel_date || null,
        stops: request.stops || [],
      },
    };
  }

  // 2. Check if user is requesting curated flagship Russia demo
  if (
    (normOrigin.includes('hyderabad') || normOrigin.includes('delhi') || normOrigin.includes('india')) &&
    (normDest.includes('russia') || normDest.includes('moscow') || normDest.includes('petersburg')) &&
    days === 7 &&
    userBudget >= 140000
  ) {
    return {
      ...MOCK_RUSSIA_TRIP,
      id: `trip-russia-${Date.now()}`,
      trip_id: request.trip_id || `trip_russia_${Date.now()}`,
      job_id: request.job_id || `job_russia_${Date.now()}`,
      createdAt: new Date().toISOString(),
      trip: {
        ...MOCK_RUSSIA_TRIP.trip,
        origin: request.origin,
        destination: request.destination,
        duration_days: days,
        budget: userBudget,
        currency: request.currency,
        travelers: travelers,
        travel_date: request.travel_date || null,
        stops: request.stops || [],
      },
    };
  }

  // 3. Dynamic Generator for ANY arbitrary origin and destination
  const isDomestic = isDomesticTravel(request.origin, request.destination);
  const originHub = detectHub(request.origin);
  const destHub = detectHub(request.destination);
  const baseline = getCostBaselines(request.destination, isDomestic);

  // Minimum required budget calculation factoring in number of travelers
  const transportMin = baseline.flightOrTrainBase * travelers;
  const stayMin = baseline.stayPerNight * (days - 1);
  const foodMin = baseline.dailyFood * days * travelers * 0.7;
  const minimumViableBudget = Math.round(transportMin + stayMin + foodMin);

  // Dynamic Agent Router Execution
  const selectedAgents: AgentId[] = [
    'orchestrator',
    'origin_analysis',
    'destination_analysis',
    'router',
    'flight',
    'train',
    'road',
    'local_transport',
    'accommodation',
    'expense',
    'activity',
    'feasibility',
    'risk',
    'optimization',
    'itinerary',
    'synthesis',
  ];

  if (!isDomestic) {
    selectedAgents.push('requirements');
  }

  const agentReasons: Record<string, string> = {
    origin_analysis: `Analyzed starting location "${request.origin}". Identified primary departure hub: ${originHub.hubName}.`,
    destination_analysis: `Analyzed destination "${request.destination}". Identified arrival gateway: ${destHub.hubName}.`,
    router: `Evaluated ${isDomestic ? 'domestic' : 'international'} routing matrix. Dispatched ${selectedAgents.length} specialist agents.`,
    flight: `Screened aviation schedules between ${originHub.hubCode} and ${destHub.hubCode}.`,
    train: isDomestic ? 'Evaluated express rail and sleeper train alternatives.' : 'Screened high-speed intercity rail links.',
    road: isDomestic ? 'Calculated highway coach and regional road connectivity.' : 'Assessed local regional road transit.',
    local_transport: `Planned internal destination mobility across metro, rideshare, and transit cards for ${request.destination}.`,
    accommodation: `Evaluated verified lodging in ${request.destination} with proximity-to-transport optimization.`,
    expense: `Estimated realistic daily per-diem dining allowances for ${travelers} traveler(s).`,
    activity: `Curated cultural sights, museums, and attractions in ${request.destination}.`,
    feasibility: 'Executed pre-optimization journey feasibility and connection timing verification.',
    risk: 'Assessed transfer tightness, travel dependencies, and emergency buffer rating.',
    optimization: `Solved combinatorial journey matrices enforcing the ${userBudget.toLocaleString('en-IN')} hard constraint.`,
  };

  if (!isDomestic) {
    agentReasons['requirements'] = `Verified mandatory international passport validity, tourist visas, and travel insurance for ${request.destination}.`;
  }

  const routingInfo: AgentRoutingInfo = {
    trip_type: isDomestic ? 'domestic' : 'international',
    is_multimodal: true,
    is_multi_city: (request.stops && request.stops.length > 0) || false,
    selected_agents: selectedAgents,
    agent_reasons: agentReasons,
    origin_analysis: {
      origin_name: request.origin,
      origin_country: isDomestic ? 'India' : 'Origin Country',
      nearest_major_hub: originHub.hubName,
      hub_transfer_required: originHub.transferRequired,
      hub_transfer_mode: originHub.mode,
    },
    destination_analysis: {
      destination_name: request.destination,
      destination_country: isDomestic ? 'India' : 'Destination Country',
      arrival_hub: destHub.hubName,
      geography_type: isDomestic ? 'coastal' : 'metropolis',
    },
  };

  // Hard Budget Constraint Failure State (Sections 19, 26 & 32)
  if (userBudget < minimumViableBudget) {
    return {
      id: `trip-err-${Date.now()}`,
      trip_id: request.trip_id || `trip_err_${Date.now()}`,
      job_id: request.job_id || `job_err_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'budget_violation',
      mode: 'mock',
      data_mode: 'estimated',
      trip: {
        origin: request.origin,
        destination: request.destination,
        stops: request.stops || [],
        duration_days: days,
        budget: userBudget,
        currency: request.currency,
        travelers: travelers,
        travel_date: request.travel_date || null,
      },
      routing: routingInfo,
      summary: {
        estimated_total: minimumViableBudget,
        remaining_budget: userBudget - minimumViableBudget,
        percent_allocated: 100,
        transportTotal: transportMin,
        accommodationTotal: stayMin,
        localTransportTotal: baseline.dailyLocalTransit * days,
        foodTotal: foodMin,
        activitiesTotal: baseline.dailyActivities * days * travelers,
        miscTotal: baseline.dailyMisc * days,
      },
      transportation: {
        outbound: {} as any,
        return: {} as any,
        local: [],
      },
      accommodation: [],
      expenses: {
        dailyFoodEstimate: baseline.dailyFood * travelers,
        dailyLocalTransport: baseline.dailyLocalTransit,
        dailyMisc: baseline.dailyMisc,
        totalFood: foodMin,
        totalLocalTransport: baseline.dailyLocalTransit * days,
        totalActivities: baseline.dailyActivities * days * travelers,
        totalMiscBuffer: baseline.dailyMisc * days,
        currency: request.currency,
        breakdown: [],
      },
      activities: [],
      itinerary: [],
      alternatives: [],
      selectedAlternativeId: 'balanced',
      optimization: {
        reasoning_summary: `Budget constraint violation: The requested journey from ${request.origin} to ${request.destination} for ${days} days (${travelers} traveler${travelers > 1 ? 's' : ''}) requires at least ₹${minimumViableBudget.toLocaleString('en-IN')} for baseline round-trip transit and verified lodging.`,
        constraints_satisfied: false,
        optimization_steps: [],
        keySelectionFactors: [],
      },
      requirements: [],
      agent_status: [
        {
          id: 'orchestrator',
          name: 'Orchestrator Agent',
          role: 'Workflow Coordinator',
          status: 'completed',
          message: `Parsed constraints: From ${request.origin} to ${request.destination}, ${days} days, ₹${userBudget.toLocaleString('en-IN')}.`,
          outputSummary: 'Dispatched to Feasibility & Optimization Agents.',
          source: 'mock',
        },
        {
          id: 'feasibility',
          name: 'Feasibility Agent',
          role: 'Consistency Check',
          status: 'failed',
          message: `Hard budget constraint breached. Required minimum is ₹${minimumViableBudget.toLocaleString('en-IN')}.`,
          outputSummary: 'Infeasible under current financial parameters.',
          source: 'mock',
        },
        {
          id: 'optimization',
          name: 'Whole-Journey Optimization Agent',
          role: 'Combinatorial Solver',
          status: 'failed',
          message: `Replanning iterations exhausted. Unable to construct a complete round-trip within ₹${userBudget.toLocaleString('en-IN')}.`,
          outputSummary: 'Feasible plan could not be produced.',
          source: 'mock',
        },
      ],
      errorMessage: `Unable to generate a complete plan within the specified budget of ₹${userBudget.toLocaleString('en-IN')}.`,
      errorResolution: {
        causeComponent: isDomestic
          ? `Round-trip intercity transit between ${request.origin} and ${request.destination} plus ${days - 1} nights lodging tariff`
          : `Mandatory international aviation from ${request.origin} and certified lodging standards in ${request.destination}`,
        consideredAlternatives: [
          'Switching to overnight sleeper rail or regional express bus',
          'Reducing duration by 2–3 days',
          'Opting for high-rated guesthouse or hostel dormitories',
          'Scheduling during shoulder / off-peak seasons',
        ],
        requiredAdditionalBudget: Math.round(minimumViableBudget - userBudget),
      },
    };
  }

  // Budget is Feasible! Target ~93% allocation to preserve an emergency buffer
  const targetTotal = Math.round(userBudget * 0.935);
  const remainingBuffer = userBudget - targetTotal;

  // Split target across components
  const transportTotal = Math.round(targetTotal * 0.40);
  const accommodationTotal = Math.round(targetTotal * 0.31);
  const localTransportTotal = Math.round(targetTotal * 0.07);
  const foodTotal = Math.round(targetTotal * 0.13);
  const activitiesTotal = Math.round(targetTotal * 0.06);
  const miscTotal = targetTotal - (transportTotal + accommodationTotal + localTransportTotal + foodTotal + activitiesTotal);

  const outboundFlightCost = Math.round(transportTotal * 0.47);
  const returnFlightCost = Math.round(transportTotal * 0.47);
  const firstMileCost = Math.round(transportTotal * 0.03);
  const lastMileCost = Math.round(transportTotal * 0.03);

  const nights = Math.max(1, days - 1);
  const pricePerNight = Math.round(accommodationTotal / nights);
  const dailyFood = Math.round(foodTotal / days);

  // Accommodations with proximity rationale
  const accommodation: AccommodationItem[] = [
    {
      id: 'acc-dyn-01',
      name: `Grand Central ${request.destination} Heritage Boutique Stay`,
      type: isDomestic ? 'Resort' : 'Hotel',
      location: `Central Historic Quarter, ${request.destination}`,
      neighborhood: 'Central Transit & Sightseeing District',
      nights: nights,
      pricePerNight: pricePerNight,
      estimatedTotal: accommodationTotal,
      currency: request.currency,
      rating: 4.6,
      reviewCount: 780,
      amenities: ['High-Speed Wi-Fi', 'Complimentary Breakfast', 'Climate Control', 'Concierge & Baggage Drop', 'Transit Access'],
      whySelected: `Selected by Proximity Engine: Positioned within 450m of main transit line in ${request.destination}, saving approximately 1.5 hours daily and reducing local taxi fares by 35%.`,
      distanceFromMajorActivities: `1.2 km to historic center, 4 min walk to rapid transit`,
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // Daily Itinerary starting at user's Origin on Day 1 and returning to Origin on Final Day
  const itinerary: DailyItinerary[] = [];
  const activities: ActivityItem[] = [];

  for (let i = 1; i <= days; i++) {
    const isFirst = i === 1;
    const isLast = i === days;

    const dayTheme = isFirst
      ? `Journey Begins: Departure from ${request.origin} ➔ Arrival in ${request.destination}`
      : isLast
      ? `Journey Return: Departure from ${request.destination} ➔ Arrival back at ${request.origin}`
      : `Day ${i}: Cultural Discovery & Exploration of ${request.destination}`;

    const act1: ActivityItem = {
      id: `act-${i}-1`,
      day: i,
      timeSlot: isFirst ? 'Evening' : 'Morning',
      name: isFirst
        ? `Orientation Stroll & Welcome Dinner in ${request.destination}`
        : isLast
        ? `Last Morning Souvenir Promenade in ${request.destination}`
        : `Curated Heritage & Landmark Tour of ${request.destination} (Sector ${i})`,
      category: isFirst ? 'Sightseeing' : isLast ? 'Cultural' : 'Historic Landmark',
      location: `District ${i}, ${request.destination}`,
      durationHours: 2.5,
      estimatedCost: Math.round(activitiesTotal / (days * 1.5)),
      currency: request.currency,
      includedInPlan: true,
      description: `Curated cultural highlight with verified opening hours and walk-in/ticket accessibility.`,
      bookingRequired: !isFirst && !isLast,
    };
    activities.push(act1);

    itinerary.push({
      day: i,
      title: isFirst
        ? `Day 1: ${request.origin} ➔ ${request.destination}`
        : isLast
        ? `Day ${days}: ${request.destination} ➔ Return to ${request.origin}`
        : `Day ${i}: Highlights of ${request.destination}`,
      theme: dayTheme,
      highlights: [
        isFirst ? `Departure from ${request.origin}` : isLast ? `Arrival back at ${request.origin}` : act1.name,
        isFirst ? 'Hotel Check-in' : isLast ? 'Terminal Transit' : 'Local Gastronomy',
      ],
      estimatedDayCost: Math.round(targetTotal / days),
      stops: [
        {
          time: isFirst ? '06:30 AM' : '09:30 AM',
          title: isFirst
            ? `Departure from Starting Location (${request.origin})`
            : isLast
            ? `Hotel Check-out & Transfer to Terminal`
            : `Morning Cultural Landmark`,
          description: isFirst
            ? `First-mile transfer from your starting location to ${originHub.hubName} for outbound journey.`
            : isLast
            ? `Luggage handover and transfer to ${destHub.hubName} for return trip.`
            : `Explore world-class exhibitions and architectural marvels.`,
          location: isFirst ? request.origin : request.destination,
          costCategory: isFirst || isLast ? 'Transport' : 'Activity',
          iconType: isFirst || isLast ? 'plane' : 'landmark',
        },
        {
          time: '01:30 PM',
          title: isFirst ? `Arrival at ${request.destination} & Check-in` : `Authentic Local Cuisine Lunch`,
          description: isFirst
            ? `Disembark at ${destHub.hubName}, transfer to boutique stay, drop luggage.`
            : `Enjoy regional delicacies and street cafe lunch recommended by Food Agent.`,
          location: request.destination,
          costCategory: isFirst ? 'Stay' : 'Food',
          estimatedCost: Math.round(dailyFood * 0.45),
          iconType: isFirst ? 'hotel' : 'food',
        },
        {
          time: isLast ? '08:30 PM' : '06:00 PM',
          title: isLast
            ? `Arrival Back at Starting Location (${request.origin})`
            : `Evening Scenic Promenade & Dinner`,
          description: isLast
            ? `Complete round-trip journey completed. Safely arrived back at starting location in ${request.origin}.`
            : `Golden hour walking tour through pedestrian avenues with sit-down dinner.`,
          location: isLast ? request.origin : request.destination,
          costCategory: isLast ? 'Transport' : 'Activity',
          iconType: isLast ? 'hotel' : 'walk',
        },
      ],
    });
  }

  // Replanning Loop & Versioning
  const initialCost = Math.round(userBudget * 1.18);
  const iterations: OptimizationIteration[] = [
    {
      version: 1,
      totalCost: initialCost,
      status: 'over_budget',
      costDelta: 0,
      actionsTaken: ['Initial candidate generated with direct peak-season premium transport + 5-star lodging.'],
      rationale: `Initial unconstrained candidate exceeded user budget by ₹${(initialCost - userBudget).toLocaleString('en-IN')}.`,
    },
    {
      version: 2,
      totalCost: Math.round(userBudget * 1.05),
      status: 'over_budget',
      costDelta: -Math.round(initialCost - userBudget * 1.05),
      actionsTaken: ['Swapped peak carrier for optimized schedule tier.', 'Reallocated to 4.5-star central boutique stay.'],
      rationale: 'Substantial savings achieved, closing in on budget ceiling.',
    },
    {
      version: 3,
      totalCost: targetTotal,
      status: 'feasible',
      costDelta: -(Math.round(userBudget * 1.05) - targetTotal),
      actionsTaken: ['Locked integrated ground transit passes.', `Established safe ₹${remainingBuffer.toLocaleString('en-IN')} emergency contingency buffer.`],
      rationale: `Hard constraint satisfied. Total planned cost ₹${targetTotal.toLocaleString('en-IN')} is within ₹${userBudget.toLocaleString('en-IN')} limit.`,
    },
  ];

  const explainableDecisions: ExplainableDecision[] = [
    {
      component: 'Starting Location & Hub Link',
      decision: `Budgeted first-mile and last-mile transfers connecting ${request.origin} with ${originHub.hubName}.`,
      whySelected: 'Guarantees the journey is complete from doorstep to doorstep, preventing unexpected out-of-pocket costs.',
      tradeOff: 'Allocates a small fraction of the transit budget for dedicated airport/station transfers.',
    },
    {
      component: 'Accommodation Selection',
      decision: `Selected central boutique stay in ${request.destination} near rapid transit nodes.`,
      whySelected: 'Saves an estimated ₹3,500 in point-to-point taxi fares over peripheral hotel options.',
      tradeOff: 'Slightly higher room tariff offset entirely by ground mobility savings.',
    },
    {
      component: 'Multimodal Transit Balance',
      decision: 'Coordinated scheduled intercity transit with pre-purchased local mobility smart passes.',
      whySelected: 'Maximizes active destination hours while keeping total journey cost within the hard budget limit.',
      tradeOff: 'Standard economy routing rather than flexible open-ended business fares.',
    },
  ];

  const optimizationSteps: OptimizationStep[] = [
    {
      step: 1,
      action: 'Candidate Generation',
      component: 'Unconstrained Baseline',
      previousCost: initialCost,
      costDelta: 0,
      newCost: initialCost,
      rationale: `Initial candidate exceeded budget limit by ₹${(initialCost - userBudget).toLocaleString('en-IN')}.`,
    },
    {
      step: 2,
      action: 'Transportation Optimization',
      component: 'Aviation / Rail Route Balancing',
      previousCost: initialCost,
      costDelta: -Math.round((initialCost - targetTotal) * 0.5),
      newCost: initialCost - Math.round((initialCost - targetTotal) * 0.5),
      rationale: 'Swapped peak non-stop carrier with optimized connection tier, trimming fare without significant layover delay.',
    },
    {
      step: 3,
      action: 'Lodging Proximity Rationalization',
      component: 'Accommodation Optimizer',
      previousCost: initialCost - Math.round((initialCost - targetTotal) * 0.5),
      costDelta: -Math.round((initialCost - targetTotal) * 0.35),
      newCost: targetTotal + Math.round((initialCost - targetTotal) * 0.15),
      rationale: 'Reallocated to 4-star boutique stay near rapid transit nodes, slashing premium room rates by 22%.',
    },
    {
      step: 4,
      action: 'Local Pass Locking & Buffer Verification',
      component: 'Intra-City Ground Mobility & Contingency',
      previousCost: targetTotal + Math.round((initialCost - targetTotal) * 0.15),
      costDelta: -Math.round((initialCost - targetTotal) * 0.15),
      newCost: targetTotal,
      rationale: `Locked integrated transit smart passes and secured a safety buffer of ₹${remainingBuffer.toLocaleString('en-IN')}.`,
    },
  ];

  const alternatives: AlternativePlan[] = [
    {
      id: 'balanced',
      name: 'Plan A — Balanced Journey (Selected)',
      label: 'Recommended Optimization',
      estimatedTotal: targetTotal,
      currency: request.currency,
      savingsOrPremium: 0,
      travelTimeDiff: 'Optimal transit speed',
      comfortLevel: 'Standard',
      tradeoffSummary: `Harmonious blend of prime location lodging, streamlined transit from ${request.origin}, and ₹${remainingBuffer.toLocaleString('en-IN')} emergency contingency buffer.`,
      highlights: ['Optimal location near major sights', 'Pre-allocated contingency buffer', 'Doorstep-to-doorstep journey beginning and ending at origin'],
      outboundSummary: `${request.origin} ➔ ${originHub.hubCode} ➔ ${destHub.hubCode}`,
      returnSummary: `${destHub.hubCode} ➔ ${originHub.hubCode} ➔ ${request.origin}`,
      accommodationSummary: `Grand Central ${request.destination} Boutique Stay (${nights}N)`,
    },
    {
      id: 'budget',
      name: 'Plan B — Lower Cost Saver',
      label: 'Maximum Savings',
      estimatedTotal: Math.round(targetTotal * 0.88),
      currency: request.currency,
      savingsOrPremium: -Math.round(targetTotal * 0.12),
      travelTimeDiff: '+2.5 hrs transit connection',
      comfortLevel: 'Budget Saver',
      tradeoffSummary: 'Uses economy serviced studios and saver transit slots, freeing up extra discretionary cash.',
      highlights: [`Saves additional ₹${Math.round(targetTotal * 0.12).toLocaleString('en-IN')}`, 'Cozy studios with kitchenette', 'Maximum savings'],
      outboundSummary: `Economy Saver Route from ${request.origin}`,
      returnSummary: `Economy Saver Return to ${request.origin}`,
      accommodationSummary: `Serviced Studios ${request.destination} (${nights}N)`,
    },
    {
      id: 'comfort',
      name: 'Plan C — Premium Comfort',
      label: 'Max Leisure & Comfort',
      estimatedTotal: Math.min(userBudget, Math.round(targetTotal * 1.04)),
      currency: request.currency,
      savingsOrPremium: Math.round(targetTotal * 0.04),
      travelTimeDiff: 'Fastest direct routing',
      comfortLevel: 'Premium Comfort',
      tradeoffSummary: 'Upgrades to executive boutique room tier and premium airport direct chauffeur transfers.',
      highlights: ['Full daily buffet breakfasts included', 'Private chauffeur airport transfers', 'Strictly within user budget limit'],
      outboundSummary: `Priority Express Route from ${request.origin}`,
      returnSummary: `Priority Express Return to ${request.origin}`,
      accommodationSummary: `Executive Suites ${request.destination} (${nights}N)`,
    },
  ];

  const feasibility: FeasibilityData = {
    status: 'feasible',
    summary: `Complete journey from ${request.origin} to ${request.destination} and back verified across all checkpoints.`,
    checks: [
      { name: 'Starting Location Departure Buffer', passed: true, details: `Transfer from ${request.origin} to ${originHub.hubName} scheduled with 2h 15m buffer prior to departure.` },
      { name: 'Outbound Transit Consistency', passed: true, details: `Arrival at ${destHub.hubName} matches local hotel check-in time windows.` },
      { name: 'Accommodation Check-in Window', passed: true, details: 'Early luggage drop verified; room ready for afternoon check-in.' },
      { name: 'Activity Geographic Clustering', passed: true, details: 'Daily activities grouped by sector to prevent long transit transfers.' },
      { name: 'Return Journey Buffer', passed: true, details: 'Return terminal transfer departs 3h before scheduled flight/train.' },
      { name: 'Return to Starting Location', passed: true, details: `Last-mile transit returns traveler safely to ${request.origin}.` },
    ],
  };

  const risk: RiskData = {
    level: isDomestic ? 'low' : 'moderate',
    score: isDomestic ? 16 : 32,
    summary: isDomestic
      ? 'Low risk profile. Verified direct transit connections and healthy cash buffer.'
      : 'Moderate risk profile due to international transit requirements. Mitigated by comprehensive buffer.',
    flags: [
      {
        type: 'Transit Schedule Buffer',
        severity: 'low',
        message: 'Departure connection includes sufficient scheduled transfer buffer.',
        mitigation: 'Traveler notified of 2-hour recommended terminal check-in window.',
      },
    ],
    buffer_status: {
      remaining_buffer: remainingBuffer,
      buffer_percentage: Math.round((remainingBuffer / userBudget) * 100),
      buffer_rating: 'healthy',
    },
  };

  const assumptions: string[] = [
    `${travelers} adult traveler${travelers > 1 ? 's' : ''} assumed in pricing calculations.`,
    request.travel_date ? `Travel date specified: ${request.travel_date}` : 'Exact travel date not specified; standard published route tariffs utilized.',
    `Complete round-trip journey starting and ending at ${request.origin}.`,
    'Standard economy transportation and certified 4-star boutique lodging assumed.',
    'All prices are estimated living allowances and indicative route fares pending live booking.',
  ];

  const requirements: TravelRequirement[] = isDomestic
    ? [
        {
          type: 'domestic_id',
          title: 'Valid Government Photo ID',
          status: 'Mandatory',
          details: 'Aadhaar Card, Passport, or Driving License required for airport check-in and hotel registration.',
          sourceNote: 'Bureau of Civil Aviation Security (BCAS) India',
        },
        {
          type: 'insurance',
          title: 'Domestic Travel & Medical Insurance',
          status: 'Recommended',
          details: 'Covers unexpected flight cancellations, baggage delays, and emergency outpatient care.',
          sourceNote: 'General Insurance Council',
        },
      ]
    : [
        {
          type: 'passport',
          title: 'Passport Validity (Min 6 Months)',
          status: 'Mandatory',
          details: `Passport must possess at least 6 months validity beyond your scheduled departure date from ${request.destination} with at least 2 blank pages.`,
          sourceNote: 'ICAO / International Immigration Standards',
        },
        {
          type: 'visa',
          title: `Entry Visa / Tourist Authorization for ${request.destination}`,
          status: 'Mandatory',
          details: `Verify e-Visa or visa-on-arrival eligibility through the official consular portal of ${request.destination} prior to booking.`,
          sourceNote: 'Official Ministry of Foreign Affairs / Consular Affairs',
        },
        {
          type: 'insurance',
          title: 'Comprehensive International Travel Health Insurance',
          status: 'Mandatory',
          details: 'Mandatory minimum medical coverage ($50,000 / €30,000) including medical repatriation and trip delay protection.',
          sourceNote: 'World Travel Advisory & Border Regulations',
        },
      ];

  const agent_status: AgentStatusItem[] = [
    {
      id: 'orchestrator',
      name: 'Orchestrator Agent',
      role: 'Trip Context & Coordination',
      status: 'completed',
      message: `Parsed request: From ${request.origin} ➔ To ${request.destination}, ${days} Days, ₹${userBudget.toLocaleString('en-IN')}, ${travelers} traveler(s).`,
      outputSummary: `Triaged as ${isDomestic ? 'Domestic Journey' : 'International Journey'}. Initialized trip context.`,
      source: 'mock',
    },
    {
      id: 'origin_analysis',
      name: 'Origin Analyzer',
      role: 'Starting Location & Hub Analysis',
      status: 'completed',
      message: `Analyzed ${request.origin}. Identified primary departure hub: ${originHub.hubName}.`,
      outputSummary: 'First-mile transit and check-in buffers calculated.',
      source: 'mock',
    },
    {
      id: 'destination_analysis',
      name: 'Destination Analyzer',
      role: 'Geography & Hub Identification',
      status: 'completed',
      message: `Analyzed ${request.destination}. Identified arrival hub: ${destHub.hubName}.`,
      outputSummary: 'Destination sector topology mapped.',
      source: 'mock',
    },
    {
      id: 'router',
      name: 'Dynamic Agent Router',
      role: 'Specialist Agent Dispatcher',
      status: 'completed',
      message: `Selected ${selectedAgents.length} specialist agents based on trip geography and duration.`,
      outputSummary: 'Dynamic agent routing matrix executed.',
      source: 'mock',
    },
    {
      id: 'flight',
      name: 'Transportation Agents',
      role: 'Intercity Aviation & Rail Routing',
      status: 'completed',
      message: `Identified optimal roundtrip options connecting ${request.origin} and ${request.destination}.`,
      outputSummary: `Allocated ₹${transportTotal.toLocaleString('en-IN')} for inbound/outbound transit.`,
      source: 'mock',
    },
    {
      id: 'accommodation',
      name: 'Accommodation Agent',
      role: 'Lodging Selection & Proximity Engine',
      status: 'completed',
      message: `Screened certified stays in ${request.destination} within walking distance of central transit.`,
      outputSummary: `Selected 4-star boutique stay at ₹${pricePerNight.toLocaleString('en-IN')}/night.`,
      source: 'mock',
    },
    {
      id: 'local_transport',
      name: 'Local Transport Agent',
      role: 'Intra-City Ground Mobility',
      status: 'completed',
      message: `Calculated multi-modal combination of metro smart passes, rideshare, and walking routes in ${request.destination}.`,
      outputSummary: `Configured daily ground transit budget at ₹${localTransportTotal.toLocaleString('en-IN')}.`,
      source: 'mock',
    },
    {
      id: 'expense',
      name: 'Food & Expense Agent',
      role: 'Daily Living Cost Estimation',
      status: 'completed',
      message: `Estimated authentic dining options, meal allowances, and discretionary buffer for ${travelers} traveler(s).`,
      outputSummary: `Allocated ₹${foodTotal.toLocaleString('en-IN')} dining and ₹${miscTotal.toLocaleString('en-IN')} contingency cushion.`,
      source: 'mock',
    },
    {
      id: 'activity',
      name: 'Activities & Sightseeing Agent',
      role: 'Curated Itinerary Experiences',
      status: 'completed',
      message: `Curated ${activities.length} prime cultural experiences grouped by geographic proximity.`,
      outputSummary: `Optimized attraction admissions at ₹${activitiesTotal.toLocaleString('en-IN')}.`,
      source: 'mock',
    },
    {
      id: 'feasibility',
      name: 'Feasibility Agent',
      role: 'Consistency Check',
      status: 'completed',
      message: 'Validated 6 journey checkpoints: connections, check-in, transfer buffers, and return times.',
      outputSummary: 'Journey marked FEASIBLE. Zero timeline conflicts.',
      source: 'mock',
    },
    {
      id: 'risk',
      name: 'Risk & Buffer Agent',
      role: 'Vulnerability Analysis',
      status: 'completed',
      message: `Evaluated transfer dependencies and budget buffer. ${risk.level.toUpperCase()} risk profile assigned.`,
      outputSummary: `Healthy buffer: ₹${remainingBuffer.toLocaleString('en-IN')} emergency cushion retained.`,
      source: 'mock',
    },
    {
      id: 'optimization',
      name: 'Whole-Journey Optimization Agent',
      role: 'Hard Budget Combinatorial Solver',
      status: 'completed',
      message: `Pruned candidate cost from ₹${initialCost.toLocaleString('en-IN')} down to ₹${targetTotal.toLocaleString('en-IN')} across 3 iterations.`,
      outputSummary: `Hard constraint satisfied: ${Math.round((targetTotal / userBudget) * 1000) / 10}% allocated. Remaining buffer: ₹${remainingBuffer.toLocaleString('en-IN')}.`,
      source: 'mock',
    },
    {
      id: 'itinerary',
      name: 'Itinerary Agent',
      role: 'Chronological Synthesizer',
      status: 'completed',
      message: `Synthesized ${days}-day timeline starting at ${request.origin} and returning to ${request.origin}.`,
      outputSummary: 'Doorstep-to-doorstep chronological flow finalized.',
      source: 'mock',
    },
    {
      id: 'synthesis',
      name: 'Final Synthesis Agent',
      role: 'Journey Package Finalizer',
      status: 'completed',
      message: 'Packaged complete journey with explainable decision rationale and verified assumptions.',
      outputSummary: 'Plan ready for traveler inspection.',
      source: 'mock',
    },
  ];

  return {
    id: `trip-${Date.now()}`,
    trip_id: request.trip_id || `trip_${Date.now()}`,
    job_id: request.job_id || `job_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'success',
    mode: 'mock',
    data_mode: 'estimated',
    trip: {
      origin: request.origin,
      destination: request.destination,
      stops: request.stops || [],
      duration_days: days,
      budget: userBudget,
      currency: request.currency,
      travelers: travelers,
      travel_date: request.travel_date || null,
    },
    routing: routingInfo,
    feasibility,
    risk,
    assumptions,
    summary: {
      estimated_total: targetTotal,
      remaining_budget: remainingBuffer,
      percent_allocated: Math.round((targetTotal / userBudget) * 1000) / 10,
      outboundTransportTotal: outboundFlightCost + firstMileCost,
      returnTransportTotal: returnFlightCost + lastMileCost,
      transportTotal,
      accommodationTotal,
      localTransportTotal,
      foodTotal,
      activitiesTotal,
      miscTotal,
    },
    transportation: {
      firstMileTransfer: {
        id: 'dyn-trans-first',
        type: 'taxi',
        provider: `${request.origin} City Transit Link`,
        departureStation: `Starting Location (${request.origin})`,
        arrivalStation: originHub.hubName,
        departureTime: '06:00 AM (Day 1)',
        arrivalTime: '07:00 AM (Day 1)',
        duration: '1h 00m',
        transfers: 0,
        estimatedCost: firstMileCost,
        currency: request.currency,
        classOrType: 'First-Mile City Transfer',
        source: 'estimated',
        availability_status: 'estimated',
      },
      outbound: {
        id: 'dyn-trans-out',
        type: 'flight',
        provider: isDomestic ? 'IndiGo / Vistara Express' : 'Optimized Aviation Partner Route',
        carrierCode: isDomestic ? '6E-512' : 'AI-184 / EK-501',
        departureStation: originHub.hubName,
        arrivalStation: destHub.hubName,
        departureTime: '08:30 AM (Day 1)',
        arrivalTime: '11:45 AM (Day 1)',
        duration: isDomestic ? '2h 15m (Direct)' : '7h 45m (1 quick layover)',
        duration_minutes: isDomestic ? 135 : 465,
        transfers: isDomestic ? 0 : 1,
        transferDetails: isDomestic ? undefined : '1h 30m hub transit',
        estimatedCost: outboundFlightCost,
        currency: request.currency,
        classOrType: 'Economy Saver',
        baggageAllowance: isDomestic ? '15kg check-in + 7kg cabin' : '25kg check-in + 7kg cabin',
        isConfirmedBooking: false,
        source: 'estimated',
        availability_status: 'estimated',
      },
      return: {
        id: 'dyn-trans-ret',
        type: 'flight',
        provider: isDomestic ? 'IndiGo / Air India' : 'International Partner Airlines',
        carrierCode: isDomestic ? '6E-892' : 'AI-185 / EK-502',
        departureStation: destHub.hubName,
        arrivalStation: originHub.hubName,
        departureTime: `03:15 PM (Day ${days})`,
        arrivalTime: `06:30 PM (Day ${days})`,
        duration: isDomestic ? '2h 15m (Direct)' : '7h 15m (1 quick layover)',
        duration_minutes: isDomestic ? 135 : 435,
        transfers: isDomestic ? 0 : 1,
        estimatedCost: returnFlightCost,
        currency: request.currency,
        classOrType: 'Economy Regular',
        baggageAllowance: isDomestic ? '15kg check-in + 7kg cabin' : '25kg check-in + 7kg cabin',
        isConfirmedBooking: false,
        source: 'estimated',
        availability_status: 'estimated',
      },
      lastMileTransfer: {
        id: 'dyn-trans-last',
        type: 'taxi',
        provider: `${request.origin} Return Chauffeur`,
        departureStation: originHub.hubName,
        arrivalStation: `Starting Location (${request.origin})`,
        departureTime: `07:15 PM (Day ${days})`,
        arrivalTime: `08:15 PM (Day ${days})`,
        duration: '1h 00m',
        transfers: 0,
        estimatedCost: lastMileCost,
        currency: request.currency,
        classOrType: 'Last-Mile Return Home',
        source: 'estimated',
        availability_status: 'estimated',
      },
      local: [
        {
          day: 1,
          route: `${destHub.hubName} ➔ Central ${request.destination} Hotel`,
          modes: ['train', 'metro'],
          description: `Airport express rail directly into city center station + ${days}-day multi-modal transit pass`,
          estimatedCost: Math.round(localTransportTotal * 0.35),
          currency: request.currency,
          recommendedPass: `${request.destination} Multi-Ride Transit Pass`,
        },
        {
          day: 2,
          route: `Central Historic & Cultural Quarter Loop in ${request.destination}`,
          modes: ['metro', 'walking'],
          description: 'Subway transit and scenic pedestrian promenade navigation',
          estimatedCost: Math.round(localTransportTotal * 0.2),
          currency: request.currency,
        },
        {
          day: 3,
          route: `Outer District Attractions & Panoramic Vista Points in ${request.destination}`,
          modes: ['bus', 'taxi'],
          description: 'Regional express bus connection and evening on-demand rideshare return',
          estimatedCost: Math.round(localTransportTotal * 0.25),
          currency: request.currency,
        },
      ],
    },
    accommodation,
    expenses: {
      dailyFoodEstimate: dailyFood,
      dailyLocalTransport: Math.round(localTransportTotal / days),
      dailyMisc: Math.round(miscTotal / days),
      totalFood: foodTotal,
      totalLocalTransport: localTransportTotal,
      totalActivities: activitiesTotal,
      totalMiscBuffer: miscTotal,
      currency: request.currency,
      breakdown: [
        {
          category: 'Intercity Travel',
          estimatedCost: transportTotal,
          isConfirmed: true,
          notes: `Round-trip aviation/rail fares between ${originHub.hubName} and ${destHub.hubName} plus doorstep transfers to ${request.origin}.`,
        },
        {
          category: 'Accommodation',
          estimatedCost: accommodationTotal,
          isConfirmed: true,
          notes: `${nights} nights at high-rated 4-star boutique stay in ${request.destination} with breakfast.`,
        },
        {
          category: 'Food & Dining',
          estimatedCost: foodTotal,
          isConfirmed: false,
          notes: `Estimated ₹${dailyFood.toLocaleString('en-IN')}/day for lunch, sit-down dinners, and artisanal refreshments for ${travelers} traveler(s).`,
        },
        {
          category: 'Local Transport',
          estimatedCost: localTransportTotal,
          isConfirmed: false,
          notes: 'Multi-day transit cards, airport connections, and rideshare.',
        },
        {
          category: 'Activities & Tickets',
          estimatedCost: activitiesTotal,
          isConfirmed: false,
          notes: 'Pre-reserved admission to major historic landmarks and exhibitions.',
        },
        {
          category: 'Miscellaneous & Buffer',
          estimatedCost: miscTotal,
          isConfirmed: false,
          notes: 'Mobile connectivity (eSIM/physical SIM), lockers, and emergency cushion.',
        },
      ],
    },
    activities,
    itinerary,
    alternatives,
    selectedAlternativeId: 'balanced',
    optimization: {
      reasoning_summary: `Plan A was selected as the optimal journey because it successfully satisfied the ₹${userBudget.toLocaleString('en-IN')} hard constraint from ${request.origin} to ${request.destination} while maximizing proximity to prime sights, saving an estimated 1.5 hours in daily commuting time.`,
      constraints_satisfied: true,
      initialCandidateCost: initialCost,
      total_cost_saved: initialCost - targetTotal,
      selected_version: 3,
      iterations,
      explainable_decisions: explainableDecisions,
      optimization_steps: optimizationSteps,
      keySelectionFactors: [
        `Strict adherence to ₹${userBudget.toLocaleString('en-IN')} hard constraint (leaves ₹${remainingBuffer.toLocaleString('en-IN')} buffer)`,
        `Doorstep-to-doorstep journey starts and ends at ${request.origin}`,
        'Centrally positioned boutique stay eliminates unnecessary transfer costs',
        'Smart transit pass integration reduces individual point-to-point fares by 28%',
        'Curated activities grouped into tight geographical zones',
      ],
    },
    requirements,
    agent_status,
    mapData: {
      points: [
        { id: 'p-orig-door', name: `Starting Location (${request.origin})`, type: 'origin', latitude: 17.3850, longitude: 78.4867, description: 'Traveler Departure & Return Point' },
        { id: 'p-orig-hub', name: originHub.hubName, type: 'hub', latitude: 17.2403, longitude: 78.4294, description: 'Origin Transit Hub' },
        { id: 'p-dest-hub', name: destHub.hubName, type: 'hub', latitude: 15.7533, longitude: 73.8647, description: 'Destination Transit Hub' },
        { id: 'p-hotel', name: `Boutique Stay, ${request.destination}`, type: 'hotel', latitude: 15.5178, longitude: 73.7656, description: `Base Stay for ${nights} Nights` },
        { id: 'p-sight', name: `Historic District, ${request.destination}`, type: 'activity', latitude: 15.4989, longitude: 73.8278, description: 'Main Cultural Sector' },
      ],
      routes: [
        { from: `Starting Location (${request.origin})`, to: originHub.hubName, mode: 'car', label: 'First-Mile City Transfer' },
        { from: originHub.hubName, to: destHub.hubName, mode: 'flight', label: 'Outbound Intercity Transit' },
        { from: destHub.hubName, to: `Boutique Stay, ${request.destination}`, mode: 'car', label: 'Destination Terminal Transfer' },
        { from: `Boutique Stay, ${request.destination}`, to: `Historic District, ${request.destination}`, mode: 'metro', label: 'Local Transit Line' },
        { from: destHub.hubName, to: originHub.hubName, mode: 'flight', label: 'Return Intercity Transit' },
        { from: originHub.hubName, to: `Starting Location (${request.origin})`, mode: 'car', label: 'Last-Mile Return Home' },
      ],
    },
  };
}
