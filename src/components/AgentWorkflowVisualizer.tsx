import React, { useState } from 'react';
import {
  Workflow,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Compass,
  Navigation,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AgentRoutingInfo, AgentStatusItem } from '../types/travel';

interface AgentWorkflowVisualizerProps {
  routing?: AgentRoutingInfo;
  agents: AgentStatusItem[];
  origin: string;
  destination: string;
}

export const AgentWorkflowVisualizer: React.FC<AgentWorkflowVisualizerProps> = ({
  routing,
  agents,
  origin,
  destination,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              AGENTIC PIPELINE TOPOLOGY
            </span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Dynamic Router
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            AI Agent Workflow &amp; Dynamic Routing
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            How the Orchestrator analyzed {origin} and {destination}, routed specialist agents, checked feasibility, and optimized the whole journey.
          </p>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>{expanded ? 'Collapse Architecture Graph' : 'Inspect Agent Graph & Routing'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Dynamic Agent Router Table (Section 2 & 29) */}
      {routing && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Dynamic Agent Selection &amp; Activation Rationale
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Trip Category: <strong className="uppercase text-slate-900">{routing.trip_type}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(routing.agent_reasons).map(([agentKey, reason], idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-1.5 font-bold text-slate-900 capitalize">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{agentKey.replace(/_/g, ' ')} Agent</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deep-dive Architecture Graph */}
      {expanded && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-950 text-white rounded-xl p-6 font-mono text-xs space-y-4 border border-slate-800">
            <div className="text-center font-bold text-slate-400 uppercase tracking-widest text-[11px] pb-2 border-b border-slate-800">
              Autonomous Agent Execution Graph
            </div>

            <div className="flex flex-col items-center space-y-3">
              {/* Node 1 */}
              <div className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-center shadow-md">
                USER GOAL: {origin} ➔ {destination} (Budget &amp; Duration)
              </div>
              <div className="text-slate-500">↓</div>

              {/* Node 2 */}
              <div className="px-5 py-2.5 rounded-lg bg-slate-900 border border-blue-500/50 text-blue-300 font-bold text-center">
                ORCHESTRATOR AGENT
                <div className="text-[10px] text-slate-400 font-normal">
                  Analyzes starting hub &amp; destination geography, initializes context
                </div>
              </div>
              <div className="text-slate-500">↓</div>

              {/* Node 3 */}
              <div className="px-5 py-2.5 rounded-lg bg-indigo-950 border border-indigo-500/50 text-indigo-300 font-bold text-center">
                DYNAMIC AGENT ROUTER
                <div className="text-[10px] text-slate-400 font-normal">
                  Selects only relevant specialist agents (domestic vs international)
                </div>
              </div>
              <div className="text-slate-500">↓</div>

              {/* Node 4: Specialists */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full text-center text-[11px]">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded text-slate-300">
                  ✈️ Flight &amp; Rail Agents
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded text-slate-300">
                  🏨 Accommodation Agent
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded text-slate-300">
                  🚕 Local Transport Agent
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded text-slate-300">
                  🍛 Food / Expense Agent
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded text-slate-300">
                  🏛️ Activities Agent
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded text-slate-300">
                  🛂 Travel Requirements Agent
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded text-slate-300">
                  ✓ Feasibility Agent
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded text-slate-300">
                  ⚠ Risk &amp; Buffer Agent
                </div>
              </div>
              <div className="text-slate-500">↓</div>

              {/* Node 5: Whole-Journey Optimizer */}
              <div className="p-3 bg-amber-950/70 border border-amber-500/60 rounded-xl text-center text-amber-200 font-bold w-full max-w-md">
                WHOLE-JOURNEY OPTIMIZATION &amp; RE-PLANNING LOOP
                <div className="text-[10px] text-amber-300/80 font-normal mt-0.5">
                  Scope: Origin ➔ Outbound ➔ Stay ➔ Transit ➔ Sights ➔ Food ➔ Return ➔ Origin
                </div>
              </div>
              <div className="text-slate-500">↓</div>

              {/* Node 6: Final Synthesis */}
              <div className="px-5 py-2.5 rounded-lg bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold text-center">
                ITINERARY &amp; FINAL SYNTHESIS AGENTS
                <div className="text-[10px] text-emerald-400/80 font-normal">
                  Doorstep-to-doorstep timeline packaged with explainable decision rationale
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
