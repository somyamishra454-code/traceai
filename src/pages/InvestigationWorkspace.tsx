import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancialData } from '../data/financialContext';
import {
  Play,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Zap,
  Layers,
  Mail,
  Send,
  Gauge
} from 'lucide-react';
import { TimeTravelScrubber } from '../components/shared/TimeTravelScrubber';
import { FlowCanvasRail } from '../components/shared/FlowCanvasRail';

export const InvestigationWorkspace = () => {
  const {
    activeCase,
    runInvestigation,
    isInvestigatingLive,
    investigationLog,
    markResolved,
    openEmailModal,
    showToast,
    investigationSpeed,
    setInvestigationSpeed
  } = useFinancialData();

  const navigate = useNavigate();
  const [activeCenterTab, setActiveCenterTab] = useState<'activity' | 'flow' | 'telemetry'>('activity');
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);

  const handleRunSimulation = async () => {
    await runInvestigation(activeCase.id);
  };

  const handleNavigateToEvidence = () => {
    navigate('/evidence');
  };

  const handleNavigateToResolution = () => {
    navigate('/resolution');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Workspace Top Header */}
      <div className="fin-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#162033]">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#38BDF8]">
                CASE #{activeCase.id}
              </span>
              <span className={
                activeCase.severity === 'CRITICAL' ? 'badge-risk' :
                activeCase.severity === 'HIGH' ? 'badge-attention' : 'badge-neutral'
              }>
                {activeCase.severity}
              </span>
              <span className={
                activeCase.state === 'resolved' ? 'badge-resolved' :
                activeCase.state === 'resolution_ready' ? 'badge-attention' : 'badge-risk'
              }>
                {activeCase.state.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
              <span>{activeCase.title}</span>
              <span className="text-base font-mono text-slate-400 font-normal">
                (₹{activeCase.amount.toLocaleString('en-IN')})
              </span>
            </h1>
          </div>
        </div>

        {/* Action Toolbar & Speed Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-[#0E1524] border border-[#1A263D] p-1 rounded-lg">
            <span className="text-[10px] font-mono text-slate-400 px-1.5 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-slate-400" />
              Speed:
            </span>
            {([1, 2, 10] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  setInvestigationSpeed(spd);
                  showToast('Speed Updated', `Investigation execution speed set to ${spd === 10 ? 'Instant' : `${spd}x`}.`, 'info');
                }}
                className={`px-2 py-0.5 text-[11px] font-mono font-semibold rounded transition-all ${
                  investigationSpeed === spd
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#162033]'
                }`}
              >
                {spd === 10 ? 'Instant' : `${spd}x`}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/inbox')}
            className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Discrepancy Inbox</span>
          </button>

          <button
            onClick={() => openEmailModal(activeCase)}
            className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5 text-slate-200 hover:text-white"
          >
            <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Email Forensic Report</span>
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={isInvestigatingLive}
            className={`btn-primary text-xs font-semibold px-4 py-2 flex items-center gap-2 shadow-md ${
              isInvestigatingLive ? 'opacity-70 animate-pulse' : ''
            }`}
          >
            {isInvestigatingLive ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Investigating Live...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{activeCase.state === 'resolved' ? 'Re-run Investigation' : 'Run AI Investigation'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleNavigateToEvidence}
            className="btn-secondary text-xs px-3 py-2"
          >
            <span>Evidence Graph</span>
          </button>

          <button
            onClick={handleNavigateToResolution}
            className="btn-secondary text-xs px-3 py-2"
          >
            <span>Resolution</span>
          </button>
        </div>
      </div>

      {/* Interactive Time-Travel Scrubber */}
      <TimeTravelScrubber />

      {/* 3-ZONE INVESTIGATOR WORKSTATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ================= ZONE 1 (LEFT, 3 Cols): INVESTIGATION STAGES ================= */}
        <div className="lg:col-span-3 fin-card p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#1A253A] pb-2">
              <span className="text-xs font-semibold text-white tracking-wider uppercase">
                Investigation Stages
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {activeCase.stages.filter(s => s.status === 'completed').length}/6 Complete
              </span>
            </div>

            {/* Stages Stepper */}
            <div className="space-y-1.5">
              {activeCase.stages.map((stage, idx) => {
                const isCurrent = idx === activeCase.currentStageIndex;
                const isPassed = stage.status === 'completed';
                const isSelected = selectedStageIndex === idx;

                return (
                  <div
                    key={stage.id}
                    onClick={() => {
                      setSelectedStageIndex(idx);
                      showToast(`Stage ${idx + 1}: ${stage.name}`, stage.summary, 'info');
                    }}
                    className={`p-2.5 rounded text-xs cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-[#152033] border-[#3B82F6]'
                        : isPassed
                        ? 'bg-[#0E1524] border-[#1A263D] hover:border-slate-600'
                        : 'bg-[#0A0E18] border-[#141C2C] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isPassed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        ) : isCurrent && isInvestigatingLive ? (
                          <RotateCw className="w-3.5 h-3.5 text-[#38BDF8] animate-spin flex-shrink-0" />
                        ) : (
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono text-[9px] ${
                            isSelected ? 'bg-[#3B82F6] text-white' : 'bg-[#1C273D] text-slate-400'
                          }`}>
                            {idx + 1}
                          </div>
                        )}
                        <span className={`font-semibold tracking-wide ${
                          isSelected ? 'text-white' : isPassed ? 'text-slate-200' : 'text-slate-400'
                        }`}>
                          {stage.name}
                        </span>
                      </div>

                      {stage.timestamp && (
                        <span className="text-[10px] font-mono text-slate-500">
                          {stage.durationMs ? `${stage.durationMs}ms` : stage.timestamp}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                      {stage.summary}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Stage Detail Drawer */}
          <div className="p-3 rounded bg-[#0A0E18] border border-[#1A263D] space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span>Stage {selectedStageIndex + 1}: {activeCase.stages[selectedStageIndex]?.name} Details</span>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
              {activeCase.stages[selectedStageIndex]?.details.length > 0 ? (
                activeCase.stages[selectedStageIndex].details.map((d, i) => (
                  <li key={i} className="leading-tight">{d}</li>
                ))
              ) : (
                <li className="italic text-slate-600">Pending execution in investigation runner.</li>
              )}
            </ul>
          </div>
        </div>

        {/* ================= ZONE 2 (CENTER, 6 Cols): EVIDENCE & INVESTIGATION ACTIVITY ================= */}
        <div className="lg:col-span-6 fin-card p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Center Tab Header */}
            <div className="flex items-center justify-between border-b border-[#1A253A] pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveCenterTab('activity')}
                  className={`text-xs font-semibold px-3 py-1 rounded transition-colors ${
                    activeCenterTab === 'activity'
                      ? 'bg-[#1A263D] text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Investigation Activity
                </button>
                <button
                  onClick={() => setActiveCenterTab('flow')}
                  className={`text-xs font-semibold px-3 py-1 rounded transition-colors ${
                    activeCenterTab === 'flow'
                      ? 'bg-[#1A263D] text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Transaction Flow Chain
                </button>
                <button
                  onClick={() => setActiveCenterTab('telemetry')}
                  className={`text-xs font-semibold px-3 py-1 rounded transition-colors ${
                    activeCenterTab === 'telemetry'
                      ? 'bg-[#1A263D] text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Raw Telemetry & Webhook
                </button>
              </div>

              {isInvestigatingLive && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#38BDF8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
                  <span>EXECUTING STAGES</span>
                </div>
              )}
            </div>

            {/* TAB CONTENT: Activity Stream */}
            {activeCenterTab === 'activity' && (
              <div className="space-y-3">
                {/* Live Console Output during simulation */}
                {investigationLog.length > 0 && (
                  <div className="p-3 rounded bg-[#070A10] border border-[#1E2D48] font-mono text-[11px] text-slate-300 space-y-1 max-h-44 overflow-y-auto">
                    <div className="text-slate-500 font-semibold border-b border-[#1A263D] pb-1 flex justify-between">
                      <span>TRACEAI EXECUTION TELEMETRY</span>
                      <span className="text-emerald-400">STATUS: RUNNING</span>
                    </div>
                    {investigationLog.map((log, i) => (
                      <div key={i} className="text-slate-300 leading-normal">
                        {log}
                      </div>
                    ))}
                  </div>
                )}

                {/* Chain of Verification Milestones */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Deterministic Evidence Milestones</span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded bg-[#0E1524] border border-[#1A263D] space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-200">1. Bank Statement Credit Confirmed</span>
                        <span className="badge-resolved text-[10px]">VERIFIED</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        HDFC Host-to-Host MT940 feed received ₹48,000.00 under UTR #HDFCR5202609040019284 at 03:45:18 UTC.
                      </p>
                    </div>

                    <div className="p-3 rounded bg-[#0E1524] border border-[#1A263D] space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-200">2. Gateway Settlement Aggregation Matched</span>
                        <span className="badge-resolved text-[10px]">VERIFIED</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Razorpay batch #setl_RZP_48000_902 matches 14 captured merchant transactions exactly with ₹0 fee delta.
                      </p>
                    </div>

                    <div className="p-3 rounded bg-[#140D14] border border-rose-500/40 space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-rose-300">3. Accounting Ledger Gap Detected</span>
                        <span className="badge-risk text-[10px]">BREAK DETECTED</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Zoho Books ERP general ledger clearing account #1150 is missing journal entry. Webhook retry failed with HTTP 504.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Visual Money Flow Chain */}
            {activeCenterTab === 'flow' && (
              <div className="space-y-4 py-1">
                <FlowCanvasRail />
              </div>
            )}

            {/* TAB CONTENT: Telemetry */}
            {activeCenterTab === 'telemetry' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded bg-[#070A10] border border-[#1A263D] space-y-2">
                  <div className="text-slate-400 font-semibold text-[11px]">WEBHOOK DISPATCH TELEMETRY</div>
                  <div className="text-slate-300 text-[11px] space-y-1">
                    <div><span className="text-slate-500">Endpoint:</span> {activeCase.webhookDetails.endpoint}</div>
                    <div><span className="text-slate-500">Payload ID:</span> {activeCase.webhookDetails.payloadId}</div>
                    <div><span className="text-slate-500">HTTP Status:</span> <span className="text-rose-400 font-bold">{activeCase.webhookDetails.lastHttpCode} Gateway Timeout</span></div>
                    <div><span className="text-slate-500">Retry Attempts:</span> 3 of 3 (Exhausted)</div>
                    <div><span className="text-slate-500">Error Msg:</span> {activeCase.webhookDetails.lastError}</div>
                  </div>
                </div>

                <div className="p-3 rounded bg-[#070A10] border border-[#1A263D] space-y-2">
                  <div className="text-slate-400 font-semibold text-[11px]">CBS STATEMENT METADATA</div>
                  <div className="text-slate-300 text-[11px] space-y-1">
                    <div><span className="text-slate-500">Account:</span> {activeCase.bankAccount}</div>
                    <div><span className="text-slate-500">UTR Reference:</span> {activeCase.chainNodes[3]?.referenceId}</div>
                    <div><span className="text-slate-500">Booking Time:</span> 2026-09-04 03:45:18 UTC</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar within Center Zone */}
          <div className="pt-3 border-t border-[#1A253A] flex items-center justify-between text-xs text-slate-400">
            <span>Deterministic verification based on cryptographic CBS statement hash</span>
            <button
              onClick={handleNavigateToEvidence}
              className="text-[#38BDF8] hover:text-white flex items-center gap-1 font-medium"
            >
              <span>Explore deep evidence nodes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ================= ZONE 3 (RIGHT, 3 Cols): AI FINDINGS & ACTIONS ================= */}
        <div className="lg:col-span-3 fin-card p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A253A] pb-2">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                AI Findings & Root Cause
              </span>
              <span className="badge-evidence text-[10px]">
                {activeCase.confidence}% Confidence
              </span>
            </div>

            {/* Root Cause Card */}
            <div className="p-3 rounded bg-[#0A0E18] border border-[#1A263D] space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Identified Root Cause</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {activeCase.rootCause}
              </p>
            </div>

            {/* Financial Impact */}
            <div className="p-3 rounded bg-[#0E1524] border border-[#1A263D] space-y-1.5 text-xs">
              <span className="text-slate-400 font-medium">Financial Balance Sheet Impact</span>
              <div className="text-lg font-bold font-mono text-white">
                ₹{activeCase.amount.toLocaleString('en-IN')}.00
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Understated cash balance on general ledger; clearing account variance requires balancing double-entry.
              </p>
            </div>

            {/* Recommended Action */}
            <div className="p-3 rounded bg-[#111A2E] border border-[#1E3054] space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-[#38BDF8] font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>Recommended Action</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {activeCase.recommendedAction}
              </p>
            </div>
          </div>

          {/* Action Execution CTAs */}
          <div className="space-y-2 pt-2 border-t border-[#1A253A]">
            <button
              onClick={() => openEmailModal(activeCase)}
              className="w-full btn-secondary text-xs py-2 font-medium flex items-center justify-center gap-2 text-slate-200 hover:text-white"
            >
              <Send className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Email Forensic Proof Package</span>
            </button>

            <button
              onClick={handleNavigateToResolution}
              className="w-full btn-primary text-xs py-2.5 font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Proceed to Resolution Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {activeCase.state !== 'resolved' ? (
              <button
                onClick={() => markResolved(activeCase.id)}
                className="w-full btn-success text-xs py-2 font-medium flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Reconciled & Resolved</span>
              </button>
            ) : (
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center text-xs font-mono font-semibold">
                ✓ Case Resolved & Reconciled
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationWorkspace;
