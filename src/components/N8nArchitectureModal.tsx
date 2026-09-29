import React, { useState } from 'react';
import {
  X,
  Layers,
  ArrowRight,
  Check,
  Copy,
  Radio,
  Settings,
  Database,
  Globe,
  Zap,
  ShieldCheck,
  Code2,
  Workflow,
  Server,
  Terminal,
} from 'lucide-react';
import {
  getTravelAiMode,
  setTravelAiMode,
  getStoredWebhookUrl,
  setStoredWebhookUrl,
} from '../services/travelPlannerService';

interface N8nArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onModeChanged?: (mode: 'mock' | 'live') => void;
}

export const N8nArchitectureModal: React.FC<N8nArchitectureModalProps> = ({
  isOpen,
  onClose,
  onModeChanged,
}) => {
  const [currentMode, setCurrentMode] = useState<'mock' | 'live'>(getTravelAiMode());
  const [webhookUrl, setWebhookUrl] = useState<string>(getStoredWebhookUrl());
  const [copiedPayload, setCopiedPayload] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'workflow' | 'contract' | 'settings'>('workflow');

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setTravelAiMode(currentMode);
    setStoredWebhookUrl(webhookUrl);
    if (onModeChanged) onModeChanged(currentMode);
    setSaveFeedback('Settings successfully saved!');
    setTimeout(() => setSaveFeedback(null), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedPayload(label);
      setTimeout(() => setCopiedPayload(null), 2500);
    }
  };

  const sampleRequestContract = JSON.stringify(
    {
      trip_id: "trip_hyd_goa_01",
      job_id: "job_agentic_01",
      origin: "Hyderabad, India",
      destination: "Goa, India",
      stops: [],
      duration: 7,
      budget: 50000,
      currency: "INR",
      travel_date: null,
      travelers: 1
    },
    null,
    2
  );

  const sampleResponseContract = JSON.stringify(
    {
      trip_id: "trip_hyd_goa_01",
      job_id: "job_agentic_01",
      status: "success",
      data_mode: "live",
      trip: {
        origin: "Hyderabad, India",
        destination: "Goa, India",
        stops: [],
        duration_days: 7,
        budget: 50000,
        currency: "INR",
        travelers: 1,
        travel_date: null
      },
      routing: {
        trip_type: "domestic",
        is_multimodal: true,
        selected_agents: [
          "origin_analysis",
          "destination_analysis",
          "router",
          "flight",
          "train",
          "local_transport",
          "accommodation",
          "expense",
          "activity",
          "feasibility",
          "risk",
          "optimization",
          "itinerary",
          "synthesis"
        ]
      },
      summary: {
        estimated_total: 46800,
        remaining_budget: 3200,
        percent_allocated: 93.6
      },
      transportation: {
        firstMileTransfer: {
          type: "taxi",
          provider: "Hyderabad Airport Express",
          departureStation: "Starting Location (Hyderabad Central)",
          arrivalStation: "Rajiv Gandhi International (HYD)",
          estimatedCost: 600
        },
        outbound: {
          type: "flight",
          provider: "IndiGo Non-Stop",
          departureStation: "Rajiv Gandhi International (HYD)",
          arrivalStation: "Manohar International Airport (GOX / Mopa)",
          estimatedCost: 7800,
          duration: "1h 25m"
        },
        return: {
          type: "flight",
          provider: "IndiGo Non-Stop",
          departureStation: "Manohar International Airport (GOX)",
          arrivalStation: "Rajiv Gandhi International (HYD)",
          estimatedCost: 8000,
          duration: "1h 25m"
        },
        lastMileTransfer: {
          type: "taxi",
          provider: "Hyderabad Pre-Paid Cab",
          departureStation: "Rajiv Gandhi International (HYD)",
          arrivalStation: "Starting Location (Hyderabad Central)",
          estimatedCost: 600
        },
        local: []
      },
      accommodation: [],
      expenses: {
        dailyFoodEstimate: 828,
        totalFood: 5800
      },
      activities: [],
      feasibility: {
        status: "feasible",
        summary: "Zero timeline conflicts. Minimum connection times satisfied."
      },
      risk: {
        level: "low",
        score: 18,
        summary: "Healthy buffer and direct non-stop connections."
      },
      optimization: {
        selected_version: 3,
        total_cost_saved: 11200,
        reasoning_summary: "Selected Plan A balances non-stop transit and Candolim central lodging.",
        constraints_satisfied: true
      },
      itinerary: [],
      alternatives: [],
      assumptions: [
        "1 adult traveler assumed.",
        "Round-trip journey starting and ending at Hyderabad, India.",
        "Prices are realistic published estimates."
      ],
      agent_status: []
    },
    null,
    2
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-400/20">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Agentic AI Architecture &amp; n8n Integration</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Ready to Connect
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Autonomous multi-agent topology, dynamic routing, feasibility checking, and n8n webhook contracts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 border-b border-slate-200 bg-slate-50 flex items-center gap-4 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'workflow'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Workflow className="w-4 h-4" />
            <span>Agent Workflow Visualizer</span>
          </button>

          <button
            onClick={() => setActiveTab('contract')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'contract'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>n8n Normalized Webhook Contract</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Mode &amp; Webhook URL Settings</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: WORKFLOW GRAPH */}
          {activeTab === 'workflow' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Whole-Journey Architecture:</strong> The application plans the entire journey
                  starting from the user's explicit Starting Location to the destination and returning back
                  to the starting location. The Dynamic Router activates only the necessary specialist agents
                  (flights, trains, buses, local transit, lodging, consular requirements).
                </p>
              </div>

              {/* Visual Multi-Agent Diagram */}
              <div className="bg-slate-950 text-white rounded-xl p-6 font-mono text-xs space-y-4 border border-slate-800">
                <div className="text-center font-bold text-slate-400 uppercase tracking-widest text-[11px] pb-2 border-b border-slate-800">
                  Target n8n Multi-Agent Workflow
                </div>

                <div className="flex flex-col items-center space-y-3">
                  {/* Step 1: Webhook Trigger */}
                  <div className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold shadow-md text-center">
                    POST /webhook/travel-planner (Origin, Destination, Days, Budget, Travelers)
                  </div>
                  <div className="text-slate-500">↓</div>

                  {/* Step 2: Orchestrator */}
                  <div className="px-5 py-2.5 rounded-lg bg-slate-800 border border-blue-500/50 text-blue-300 font-bold text-center">
                    ORCHESTRATOR &amp; ORIGIN/DESTINATION ANALYZER
                    <div className="text-[10px] text-slate-400 font-normal">
                      Maps departure hubs &amp; destination geography; initializes trip context
                    </div>
                  </div>
                  <div className="text-slate-500">↓</div>

                  {/* Step 3: Dynamic Router */}
                  <div className="px-5 py-2 rounded-lg bg-indigo-950 border border-indigo-500/50 text-indigo-300 font-bold text-center">
                    DYNAMIC AGENT ROUTER
                    <div className="text-[10px] text-slate-400 font-normal">
                      Selects relevant specialist agents (Bypasses visa for domestic, activates Sapsan for Russia)
                    </div>
                  </div>
                  <div className="text-slate-500">↓</div>

                  {/* Step 4: Parallel Specialists */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full text-center">
                    <div className="p-2 bg-slate-900 border border-slate-700 rounded text-[11px]">
                      ✈️ Flight &amp; Rail Agents
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-700 rounded text-[11px]">
                      🏨 Accommodation Agent
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-700 rounded text-[11px]">
                      🚕 Local Mobility Agent
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-700 rounded text-[11px]">
                      🍛 Food &amp; Expense Agent
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-700 rounded text-[11px]">
                      🏛️ Activities Agent
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-700 rounded text-[11px]">
                      🛂 Requirements Agent
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-700 rounded text-[11px]">
                      ✓ Feasibility Agent
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-700 rounded text-[11px]">
                      ⚠ Risk &amp; Buffer Agent
                    </div>
                  </div>
                  <div className="text-slate-500">↓</div>

                  {/* Step 5: Optimization & Replanning Loop */}
                  <div className="p-3 bg-amber-950/60 border border-amber-500/60 rounded-xl text-center text-amber-200 font-bold w-full max-w-md">
                    WHOLE-JOURNEY OPTIMIZATION &amp; RE-PLANNING LOOP
                    <div className="text-[11px] text-amber-300/80 font-normal mt-0.5">
                      Prunes Candidate &gt; Budget ➔ Swaps components ➔ Generates Plan Versions
                    </div>
                  </div>
                  <div className="text-slate-500">↓</div>

                  {/* Step 6: Synthesis & Response */}
                  <div className="px-5 py-2.5 rounded-lg bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold text-center">
                    ITINERARY &amp; FINAL SYNTHESIS AGENTS
                    <div className="text-[10px] text-emerald-400/80 font-normal">
                      Packages complete doorstep-to-doorstep plan with explainable decisions
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTRACT SCHEMAS */}
          {activeTab === 'contract' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-700">
                    1. Webhook POST Request Payload (Sent by Frontend)
                  </span>
                  <button
                    onClick={() => copyToClipboard(sampleRequestContract, 'req')}
                    className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedPayload === 'req' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPayload === 'req' ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
                  {sampleRequestContract}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-700">
                    2. Webhook Expected Response Payload (Received by Frontend)
                  </span>
                  <button
                    onClick={() => copyToClipboard(sampleResponseContract, 'res')}
                    className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedPayload === 'res' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPayload === 'res' ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 max-h-[300px]">
                  {sampleResponseContract}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS & MODE TOGGLE */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Mode Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Active Application Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setCurrentMode('mock')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      currentMode === 'mock'
                        ? 'border-blue-600 bg-blue-50/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900">MOCK MODE</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        Default / Presentation
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Simulates the autonomous multi-agent pipeline and re-planning loop locally. Zero server requirements.
                    </p>
                  </div>

                  <div
                    onClick={() => setCurrentMode('live')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      currentMode === 'live'
                        ? 'border-emerald-600 bg-emerald-50/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900">LIVE n8n MODE</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Webhook Connected
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Dispatches live HTTP POST requests to your n8n workflow and renders real webhook responses.
                    </p>
                  </div>
                </div>
              </div>

              {/* Webhook URL Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  N8N Plan Trip Webhook URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-n8n-instance.com/webhook/travel-planner"
                    className="w-full px-4 py-3 text-xs sm:text-sm font-mono text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Configurable via environment variable: <code>VITE_N8N_PLAN_TRIP_WEBHOOK_URL</code>
                </p>
              </div>

              {saveFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveFeedback}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Active Mode: <strong className="uppercase text-slate-800">{currentMode}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
