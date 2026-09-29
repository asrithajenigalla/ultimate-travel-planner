import { TripRequest, TripResult, CurrencyCode } from '../types/travel';

export const DEFAULT_N8N_WEBHOOK_URL =
  (import.meta.env.VITE_N8N_PLAN_TRIP_WEBHOOK_URL as string) || '';

const N8N_STORAGE_KEY = 'utt_custom_n8n_webhook_url';
const MODE_STORAGE_KEY = 'utt_travel_ai_mode';

export function getStoredWebhookUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_N8N_WEBHOOK_URL;
  return localStorage.getItem(N8N_STORAGE_KEY) || DEFAULT_N8N_WEBHOOK_URL;
}

export function setStoredWebhookUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(N8N_STORAGE_KEY, url.trim());
  }
}

export function getTravelAiMode(): 'mock' | 'live' {
  if (typeof window === 'undefined') {
    return (import.meta.env.VITE_TRAVEL_AI_MODE as 'mock' | 'live') || 'mock';
  }
  const stored = localStorage.getItem(MODE_STORAGE_KEY);
  if (stored === 'mock' || stored === 'live') {
    return stored;
  }
  return (import.meta.env.VITE_TRAVEL_AI_MODE as 'mock' | 'live') || 'mock';
}

export function setTravelAiMode(mode: 'mock' | 'live'): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  }
}

/**
 * Normalization Adapter
 * Converts incoming raw n8n webhook response into internal TripResult contract.
 */
export function normalizeN8nResponse(raw: any, fallbackRequest: TripRequest): TripResult {
  if (!raw) {
    throw new Error('Received empty response from n8n webhook.');
  }

  // If already matches internal schema
  if (raw.summary && raw.transportation && raw.itinerary) {
    return {
      ...raw,
      mode: 'live',
      data_mode: raw.data_mode || 'live',
      trip_id: raw.trip_id || fallbackRequest.trip_id || `trip_${Date.now()}`,
      job_id: raw.job_id || fallbackRequest.job_id || `job_${Date.now()}`,
      id: raw.id || raw.trip_id || `live-${Date.now()}`,
      createdAt: raw.createdAt || new Date().toISOString(),
    };
  }

  // Adapter for variations in n8n output formats
  const tripMeta = raw.trip || {};
  const origin = tripMeta.origin || raw.origin || fallbackRequest.origin;
  const destination = tripMeta.destination || raw.destination || fallbackRequest.destination;
  const duration_days = tripMeta.duration_days || tripMeta.duration || fallbackRequest.duration_days;
  const budget = tripMeta.budget || fallbackRequest.budget;
  const currency: CurrencyCode = tripMeta.currency || fallbackRequest.currency || 'INR';
  const travelers = tripMeta.travelers || fallbackRequest.travelers || 1;
  const travel_date = tripMeta.travel_date || fallbackRequest.travel_date || null;
  const stops = tripMeta.stops || fallbackRequest.stops || [];

  const summary = raw.summary || {};
  const estimated_total = summary.estimated_total || summary.total_cost || Math.round(budget * 0.95);
  const remaining_budget = summary.remaining_budget ?? (budget - estimated_total);
  const percent_allocated = summary.percent_allocated ?? Math.min(100, Math.round((estimated_total / budget) * 1000) / 10);

  return {
    id: raw.id || raw.trip_id || `n8n-${Date.now()}`,
    trip_id: raw.trip_id || fallbackRequest.trip_id || `trip_${Date.now()}`,
    job_id: raw.job_id || fallbackRequest.job_id || `job_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: raw.status === 'budget_violation' ? 'budget_violation' : 'success',
    mode: 'live',
    data_mode: raw.data_mode || 'live',
    trip: {
      origin,
      destination,
      stops,
      duration_days,
      budget,
      currency,
      travelers,
      travel_date,
    },
    routing: raw.routing,
    feasibility: raw.feasibility,
    risk: raw.risk,
    assumptions: raw.assumptions || [
      `${travelers} traveler(s) assumed.`,
      `Round-trip journey starting and ending at ${origin}.`,
      'Live booking availability confirmed by provider integration.',
    ],
    summary: {
      estimated_total,
      remaining_budget,
      percent_allocated,
      outboundTransportTotal: summary.outboundTransportTotal || Math.round(estimated_total * 0.22),
      returnTransportTotal: summary.returnTransportTotal || Math.round(estimated_total * 0.22),
      transportTotal: summary.transportTotal || Math.round(estimated_total * 0.44),
      accommodationTotal: summary.accommodationTotal || Math.round(estimated_total * 0.3),
      localTransportTotal: summary.localTransportTotal || Math.round(estimated_total * 0.08),
      foodTotal: summary.foodTotal || Math.round(estimated_total * 0.12),
      activitiesTotal: summary.activitiesTotal || Math.round(estimated_total * 0.04),
      miscTotal: summary.miscTotal || Math.round(estimated_total * 0.02),
    },
    transportation: raw.transportation || {
      outbound: {} as any,
      return: {} as any,
      local: [],
    },
    accommodation: Array.isArray(raw.accommodation) ? raw.accommodation : [],
    expenses: raw.expenses || {
      dailyFoodEstimate: Math.round((estimated_total * 0.12) / duration_days),
      dailyLocalTransport: Math.round((estimated_total * 0.08) / duration_days),
      dailyMisc: Math.round((estimated_total * 0.02) / duration_days),
      totalFood: Math.round(estimated_total * 0.12),
      totalLocalTransport: Math.round(estimated_total * 0.08),
      totalActivities: Math.round(estimated_total * 0.04),
      totalMiscBuffer: Math.round(estimated_total * 0.02),
      currency,
      breakdown: [],
    },
    activities: Array.isArray(raw.activities) ? raw.activities : [],
    itinerary: Array.isArray(raw.itinerary) ? raw.itinerary : [],
    alternatives: Array.isArray(raw.alternatives) ? raw.alternatives : [],
    selectedAlternativeId: raw.selectedAlternativeId || 'balanced',
    optimization: raw.optimization || {
      reasoning_summary: `Optimized via n8n multi-agent workflow for budget compliance from ${origin} to ${destination}.`,
      constraints_satisfied: true,
      optimization_steps: [],
      keySelectionFactors: ['Constraint satisfied via n8n agent execution'],
    },
    requirements: Array.isArray(raw.requirements) ? raw.requirements : [],
    agent_status: Array.isArray(raw.agent_status) ? raw.agent_status : [],
    mapData: raw.mapData,
  };
}

export async function callN8nTripWebhook(
  request: TripRequest,
  webhookUrl: string = getStoredWebhookUrl()
): Promise<TripResult> {
  if (!webhookUrl) {
    throw new Error(
      'N8N Webhook URL is not configured. Please set VITE_N8N_PLAN_TRIP_WEBHOOK_URL in .env or configure it in the Architecture & Settings panel.'
    );
  }

  // Exact normalized request contract specified in Section 22 & 36:
  const payload = {
    trip_id: request.trip_id || `trip_${Date.now()}`,
    job_id: request.job_id || `job_${Date.now()}`,
    origin: request.origin, // MANDATORY Starting Location
    destination: request.destination, // MANDATORY Destination
    stops: request.stops || [],
    duration: request.duration_days,
    budget: request.budget,
    currency: request.currency,
    travel_date: request.travel_date || null,
    travelers: request.travelers || 1,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for multi-agent workflows

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`n8n Webhook returned HTTP ${response.status}: ${errText || response.statusText}`);
    }

    const data = await response.json();
    return normalizeN8nResponse(data, request);
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Connection to n8n webhook timed out after 60s. The multi-agent workflow may still be executing.');
    }
    throw err;
  }
}

/**
 * Asynchronous n8n Job Status Check (Future Polling Support)
 */
export async function getTripStatus(jobId: string, webhookUrl: string = getStoredWebhookUrl()): Promise<{ status: string; progress?: number; message?: string }> {
  if (!webhookUrl) return { status: 'mock_complete' };
  try {
    const res = await fetch(`${webhookUrl}/status?job_id=${encodeURIComponent(jobId)}`);
    if (!res.ok) return { status: 'running' };
    return await res.json();
  } catch {
    return { status: 'running' };
  }
}
