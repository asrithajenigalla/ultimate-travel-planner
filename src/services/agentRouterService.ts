import {
  TripRequest,
  AgentId,
  AgentRoutingData,
  SelectedAgentDetail,
  AgentStatusItem,
} from '../types/travel';
import { isDomesticDestination } from './mockTravelService';

export function determineAgentRouting(request: TripRequest): AgentRoutingData {
  const isDomestic = isDomesticDestination(request.destination);
  const destNorm = request.destination.toLowerCase().trim();
  const isMultiCity =
    destNorm.includes('moscow & st') ||
    destNorm.includes('russia') ||
    destNorm.includes('japan') ||
    destNorm.includes('kerala') ||
    destNorm.includes('&') ||
    destNorm.includes('and');
  const isCoastalOrIsland =
    destNorm.includes('goa') ||
    destNorm.includes('bali') ||
    destNorm.includes('andaman') ||
    destNorm.includes('maldives') ||
    destNorm.includes('kerala');

  const selectedAgents: AgentId[] = [];
  const bypassedAgents: AgentId[] = [];
  const agentDetails: SelectedAgentDetail[] = [];

  // 1. Orchestrator - Always active
  selectedAgents.push('orchestrator');
  agentDetails.push({
    id: 'orchestrator',
    name: 'Orchestrator Agent',
    category: 'validation',
    reason: 'Initializes global context, decomposes constraints, and coordinates downstream specialist agents.',
    status: 'active',
  });

  // 2. Dynamic Router - Always active
  selectedAgents.push('router');
  agentDetails.push({
    id: 'router',
    name: 'Dynamic Agent Router',
    category: 'validation',
    reason: `Identified trip as ${isDomestic ? 'Domestic' : 'International'} (${isMultiCity ? 'Multi-hub' : 'Single-hub'}). Tailored specialist pipeline.`,
    status: 'active',
  });

  // 3. Flight Agent
  selectedAgents.push('flight');
  agentDetails.push({
    id: 'flight',
    name: 'Flight Specialist Agent',
    category: 'transit',
    reason: isDomestic
      ? 'Evaluates domestic rapid air routes (IndiGo, Air India, Akasa) to reduce transit days.'
      : 'Calculates international point-to-point and hub layover aviation matrices.',
    status: 'active',
  });

  // 4. Train Agent
  if (isDomestic || isMultiCity) {
    selectedAgents.push('train');
    agentDetails.push({
      id: 'train',
      name: 'Rail & Train Agent',
      category: 'transit',
      reason: isDomestic
        ? 'Evaluates Vande Bharat Express and AC sleeper trains as cost-effective flight alternatives.'
        : 'Evaluates high-speed intercity rail corridor (e.g., Sapsan bullet train) between journey hubs.',
      status: 'active',
    });
  } else {
    bypassedAgents.push('train');
    agentDetails.push({
      id: 'train',
      name: 'Rail & Train Agent',
      category: 'transit',
      reason: 'No intercity rail corridor required for single-hub international destination.',
      status: 'bypassed',
      bypassedReason: 'Single-destination hub; intercity rail bypassed in favor of local rapid transit.',
    });
  }

  // 5. Road / Bus / Car Agent
  if (isDomestic || isCoastalOrIsland) {
    selectedAgents.push('road');
    agentDetails.push({
      id: 'road',
      name: 'Road & Ground Vehicle Agent',
      category: 'transit',
      reason: isCoastalOrIsland
        ? 'Evaluates self-drive scooter, rental car, and pre-paid airport taxi dispatching.'
        : 'Evaluates intercity express Volvo coaches and private highway shuttles.',
      status: 'active',
    });
  } else {
    bypassedAgents.push('road');
    agentDetails.push({
      id: 'road',
      name: 'Road & Ground Vehicle Agent',
      category: 'transit',
      reason: 'Long-distance road transit not viable for direct international transit.',
      status: 'bypassed',
      bypassedReason: 'High transit distance makes highway driving non-viable.',
    });
  }

  // 6. Water / Ferry Agent
  if (isCoastalOrIsland || destNorm.includes('petersburg') || destNorm.includes('russia')) {
    selectedAgents.push('ferry');
    agentDetails.push({
      id: 'ferry',
      name: 'Ferry & Marine Agent',
      category: 'transit',
      reason: 'Discovers coastal ferries, river canal cruises, and hydrofoils (e.g. Peterhof Meteor boat / Goan backwater boats).',
      status: 'active',
    });
  } else {
    bypassedAgents.push('ferry');
    agentDetails.push({
      id: 'ferry',
      name: 'Ferry & Marine Agent',
      category: 'transit',
      reason: 'Landlocked destination; marine transport bypassed.',
      status: 'bypassed',
      bypassedReason: 'No navigable water transit required for this corridor.',
    });
  }

  // 7. Local Transport Agent - Always active
  selectedAgents.push('local_transport');
  agentDetails.push({
    id: 'local_transport',
    name: 'Local Transport & Mobility Agent',
    category: 'transit',
    reason: 'Synthesizes destination subways, integrated smart cards (Troika/Podorozhnik/Metro), rideshares, and walking clusters.',
    status: 'active',
  });

  // 8. Accommodation Agent - Always active
  selectedAgents.push('accommodation');
  agentDetails.push({
    id: 'accommodation',
    name: 'Accommodation & Proximity Agent',
    category: 'stay',
    reason: 'Evaluates lodging tariffs combined with daily local transport costs to find true total-cost minimums.',
    status: 'active',
  });

  // 9. Food & Expense Agent - Always active
  selectedAgents.push('expense');
  agentDetails.push({
    id: 'expense',
    name: 'Food & Daily Expense Agent',
    category: 'living',
    reason: 'Estimates daily breakfast, lunch, dinner, snacks, entrance fees, and contingency allowances.',
    status: 'active',
  });

  // 10. Activities Agent - Always active
  selectedAgents.push('activity');
  agentDetails.push({
    id: 'activity',
    name: 'Activities & Attractions Agent',
    category: 'living',
    reason: 'Curates geographically proximate landmarks with opening times and reservation slots.',
    status: 'active',
  });

  // 11. Travel Requirements Agent
  if (!isDomestic) {
    selectedAgents.push('requirements');
    agentDetails.push({
      id: 'requirements',
      name: 'International Travel Requirements Agent',
      category: 'validation',
      reason: 'Validates official consular portals for electronic visa (E-Visa), 6-month passport validity, and mandatory medical insurance.',
      status: 'active',
    });
  } else {
    bypassedAgents.push('requirements');
    agentDetails.push({
      id: 'requirements',
      name: 'International Travel Requirements Agent',
      category: 'validation',
      reason: 'Domestic destination does not require passport validity or visa clearance.',
      status: 'bypassed',
      bypassedReason: 'Bypassed: Domestic travel only requires valid Government Photo ID (Aadhaar / Driving License).',
    });
  }

  // 12. Feasibility Agent - Always active
  selectedAgents.push('feasibility');
  agentDetails.push({
    id: 'feasibility',
    name: 'Feasibility Verification Agent',
    category: 'validation',
    reason: 'Audits connection timing, hotel check-in buffers, activity overlap elimination, and realistic transit speeds.',
    status: 'active',
  });

  // 13. Risk & Buffer Agent - Always active
  selectedAgents.push('risk');
  agentDetails.push({
    id: 'risk',
    name: 'Risk & Buffer Assessment Agent',
    category: 'validation',
    reason: 'Detects tight layovers (<60 min), calculates contingency reserve health, and flags itinerary fragility.',
    status: 'active',
  });

  // 14. Whole-Journey Optimization Agent - Always active
  selectedAgents.push('optimization');
  agentDetails.push({
    id: 'optimization',
    name: 'Whole-Journey Optimization Agent',
    category: 'validation',
    reason: 'Evaluates entire journey combinatorial cost against the hard budget constraint.',
    status: 'active',
  });

  // 15. Automatic Re-planning Loop - Always active
  selectedAgents.push('replanning');
  agentDetails.push({
    id: 'replanning',
    name: 'Automatic Re-planning Loop Engine',
    category: 'validation',
    reason: 'Iteratively prunes component candidate costs if initial estimates breach the traveler budget ceiling.',
    status: 'active',
  });

  // 16. Itinerary Agent - Always active
  selectedAgents.push('itinerary');
  agentDetails.push({
    id: 'itinerary',
    name: 'Itinerary Timeline Agent',
    category: 'synthesis',
    reason: 'Synthesizes chronological timeline blocks with zero backtracking.',
    status: 'active',
  });

  // 17. Final Synthesis Agent - Always active
  selectedAgents.push('synthesis');
  agentDetails.push({
    id: 'synthesis',
    name: 'Final Synthesis Agent',
    category: 'synthesis',
    reason: 'Assembles validated JSON contract package ready for downstream n8n execution.',
    status: 'active',
  });

  const routingRationale = isDomestic
    ? `Configured Domestic Routing: Invoked Flight, Rail, and Road specialists while bypassing International Visa checks. Focus on fast intercity mobility and self-drive/cab flexibility.`
    : `Configured International Multi-Modal Routing: Activated Aviation, International Consular Requirements, and Intra-destination Rapid Transit. Bypassed long-distance highway coaches.`;

  return {
    trip_type: isDomestic ? 'domestic' : 'international',
    scope: isMultiCity ? 'multi-city' : 'single-city',
    selected_agents: selectedAgents,
    bypassed_agents: bypassedAgents,
    agent_details: agentDetails,
    routing_rationale: routingRationale,
  };
}

export function buildAgentStatusPipeline(routing: AgentRoutingData): AgentStatusItem[] {
  return routing.agent_details.map((detail) => ({
    id: detail.id,
    name: detail.name,
    role: detail.reason,
    status: detail.status === 'bypassed' ? 'bypassed' : 'pending',
    message: detail.status === 'bypassed' ? detail.bypassedReason || 'Bypassed for this trip type.' : 'Awaiting orchestrator dispatch...',
    outputSummary: detail.status === 'bypassed' ? detail.bypassedReason : undefined,
    bypassedReason: detail.bypassedReason,
  }));
}
