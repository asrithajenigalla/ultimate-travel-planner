import React from 'react';
import {
  CheckCircle2,
  Clock,
  Loader2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Terminal,
  AlertCircle,
  Zap,
  Navigation,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { AgentStatusItem } from '../types/travel';

interface AgentStatusScreenProps {
  agents: AgentStatusItem[];
  currentStepIndex: number;
  origin: string;
  destination: string;
  duration: number;
  budget: number;
  currency: string;
  travelers?: number;
  onSkip?: () => void;
  isComplete: boolean;
}

export const AgentStatusScreen: React.FC<AgentStatusScreenProps> = ({
  agents,
  currentStepIndex,
  origin,
  destination,
  duration,
  budget,
  currency,
  travelers = 1,
  onSkip,
  isComplete,
}) => {
  const currentAgent = agents[currentStepIndex] || agents[agents.length - 1];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              <span>Multi-Agent Autonomous Pipeline</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex flex-wrap items-center gap-2">
              <span>Planning your complete journey...</span>
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1 font-bold text-white">
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                {origin}
              </span>
              <span className="text-slate-500">➔</span>
              <span className="flex items-center gap-1 font-bold text-white">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {destination}
              </span>
              <span className="text-slate-500">·</span>
              <span>{duration} Days</span>
              <span className="text-slate-500">·</span>
              <span>{travelers} Traveler{travelers > 1 ? 's' : ''}</span>
              <span className="text-slate-500">·</span>
              <span className="font-mono font-bold text-emerald-400">
                {currency === 'INR' ? '₹' : currency}{budget.toLocaleString('en-IN')} Budget Ceiling
              </span>
            </div>
          </div>

          {/* Fast-forward Button */}
          {onSkip && !isComplete && (
            <button
              onClick={onSkip}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer self-start md:self-auto"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Fast-forward to Final Plan</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Dynamic Agent Nodes + Live Communication Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Column: Specialist Agent Nodes */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Specialist Agents ({agents.length})
            </span>
            <span className="text-xs font-medium text-slate-500">
              {agents.filter((a) => a.status === 'completed').length} of {agents.length} Completed
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {agents.map((agent, index) => {
              const isRunning = agent.status === 'running';
              const isCompleted = agent.status === 'completed';
              const isFailed = agent.status === 'failed';
              const isPending = agent.status === 'pending';

              return (
                <div
                  key={agent.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isRunning
                      ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                      : isCompleted
                      ? 'bg-white border-slate-200'
                      : isFailed
                      ? 'bg-rose-50 border-rose-200'
                      : 'bg-slate-50/50 border-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Status indicator icon */}
                      <div className="mt-0.5 shrink-0">
                        {isRunning && (
                          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                        )}
                        {isCompleted && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                        {isFailed && (
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                        )}
                        {isPending && (
                          <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold ${
                              isRunning
                                ? 'text-blue-900 font-extrabold'
                                : isCompleted
                                ? 'text-slate-900'
                                : 'text-slate-600'
                            }`}
                          >
                            {agent.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            · {agent.role}
                          </span>
                        </div>
                        <p
                          className={`text-xs mt-0.5 ${
                            isRunning ? 'text-blue-700 font-medium' : 'text-slate-500'
                          }`}
                        >
                          {agent.message}
                        </p>
                      </div>
                    </div>

                    {/* Step tag */}
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      Step {index + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Terminal Stream & Optimization Focus */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50/70 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Agent Event Stream
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ● Live Event Feed
              </span>
            </div>

            {/* Terminal Window Box */}
            <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs space-y-2.5 shadow-inner border border-slate-800 h-[280px] overflow-y-auto">
              <div className="text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                [Orchestrator v2.5 · Origin: {origin} ➔ Dest: {destination}]
              </div>

              {agents.slice(0, currentStepIndex + 1).map((a, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="text-blue-400 flex items-center gap-1.5">
                    <span className="text-slate-500 text-[10px]">
                      {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span>&gt; [{a.name}]:</span>
                  </div>
                  <div className="text-slate-300 pl-4 text-[11px] leading-relaxed">
                    {a.outputSummary || a.message}
                  </div>
                </div>
              ))}

              {currentStepIndex < agents.length - 1 && (
                <div className="flex items-center gap-2 text-amber-400 text-[11px] pt-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Evaluating multimodal combinations &amp; budget replanning loop...</span>
                </div>
              )}
            </div>

            {/* Multi-agent Architecture Callout */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Transparent Multi-Agent Workflow</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                In this preview mode, agent execution reflects the exact routing topology and data
                structures that will be dispatched to n8n webhooks. Zero fake booking claims are made.
              </p>
            </div>
          </div>

          {/* Bottom Progress status */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
              <span>Optimization Progress</span>
              <span className="font-bold text-slate-900 font-mono">
                {Math.round(((currentStepIndex + 1) / agents.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${Math.round(((currentStepIndex + 1) / agents.length) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
