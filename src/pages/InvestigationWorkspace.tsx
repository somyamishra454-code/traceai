import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancialData } from '../data/financialContext';
import {
  Play,
  RotateCw,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Mail,
  Scale,
  AlertTriangle,
  Code2,
  Copy
} from 'lucide-react';
import { FlowCanvasRail } from '../components/shared/FlowCanvasRail';
import { TimeTravelScrubber } from '../components/shared/TimeTravelScrubber';

export const InvestigationWorkspace = () => {
  const {
    activeCase,
    runInvestigation,
    isInvestigatingLive,
    investigationLog,
    openEmailModal,
    showToast,
    investigationSpeed,
    setInvestigationSpeed
  } = useFinancialData();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'reasoning' | 'flow' | 'telemetry'>('reasoning');
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(activeCase.currentStageIndex || 0);

  const handleRunSimulation = async () => {
    await runInvestigation(activeCase.id);
  };

  const handleNavigateToResolution = () => {
    navigate('/resolution');
  };

  const isResolved = activeCase.state === 'resolved';

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn py-2">
      {/* 1. CLEAN WORKSPACE HEADER */}
      <div className="bg-[#0E1420] border border-[#1A263D] rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-400">
              CASE #{activeCase.id}
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
              activeCase.severity === 'CRITICAL'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              {activeCase.severity}
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
              isResolved
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            }`}>
              {activeCase.state.toUpperCase().replace('_', ' ')}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-2">
            <span>{activeCase.title}</span>
            <span className="text-lg font-mono text-slate-400 font-normal">
              (₹{activeCase.amount.toLocaleString('en-IN')})
            </span>
          </h1>

          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {activeCase.shortSummary}
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap sm:self-center">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-[#0A0E18] border border-[#1A263D] p-1 rounded-lg text-xs">
            <span className="text-[10px] font-mono text-slate-400 px-1">Speed:</span>
            {([1, 2, 10] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  setInvestigationSpeed(spd);
                  showToast('Speed Updated', `Execution speed set to ${spd === 10 ? 'Instant' : `${spd}x`}.`, 'info');
                }}
                className={`px-2 py-0.5 text-[11px] font-mono rounded transition-all cursor-pointer ${
                  investigationSpeed === spd
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd === 10 ? 'Instant' : `${spd}x`}
              </button>
            ))}
          </div>

          <button
            onClick={() => openEmailModal(activeCase)}
            className="px-3.5 py-2 rounded-lg bg-[#152033] hover:bg-[#1E293B] text-slate-200 hover:text-white border border-[#1E293B] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>Email Report</span>
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={isInvestigatingLive}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isInvestigatingLive ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Investigating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isResolved ? 'Re-run AI Analysis' : 'Run AI Investigation'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN INVESTIGATION WORKSTATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT (4 COLS): 6 INVESTIGATION STAGES ================= */}
        <div className="lg:col-span-4 bg-[#0E1420] border border-[#1A263D] rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#162033] pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                INVESTIGATION STAGES
              </span>
              <span className="text-[10px] font-mono text-slate-500">
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
                    onClick={() => setSelectedStageIndex(idx)}
                    className={`p-3 rounded-lg text-xs cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-[#152033] border-blue-500 shadow-sm'
                        : isPassed
                        ? 'bg-[#0A0E18] border-[#162033] hover:border-slate-600'
                        : 'bg-[#090D14] border-[#141C2C] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {isPassed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : isCurrent && isInvestigatingLive ? (
                          <RotateCw className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
                        ) : (
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-[#162033] text-slate-400'
                          }`}>
                            {idx + 1}
                          </div>
                        )}
                        <span className={`font-semibold ${
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
          <div className="p-3 rounded-lg bg-[#0A0E18] border border-[#162033] space-y-1.5 text-xs font-mono">
            <div className="text-slate-300 font-bold">
              Stage {selectedStageIndex + 1}: {activeCase.stages[selectedStageIndex]?.name} Telemetry
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
              {activeCase.stages[selectedStageIndex]?.details.map((d, i) => (
                <li key={i} className="leading-tight">{d}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ================= RIGHT (8 COLS): EVIDENCE, ROOT CAUSE & ACTION ================= */}
        <div className="lg:col-span-8 bg-[#0E1420] border border-[#1A263D] rounded-xl p-5 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Tab Selector */}
            <div className="flex items-center justify-between border-b border-[#162033] pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('reasoning')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'reasoning'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white bg-[#0A0E18]'
                  }`}
                >
                  AI Forensic Findings
                </button>
                <button
                  onClick={() => setActiveTab('flow')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'flow'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white bg-[#0A0E18]'
                  }`}
                >
                  Custody Chain & Time-Travel
                </button>
                <button
                  onClick={() => setActiveTab('telemetry')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'telemetry'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white bg-[#0A0E18]'
                  }`}
                >
                  Raw Webhook Payload
                </button>
              </div>

              <div className="text-[10px] font-mono text-slate-400">
                Confidence: <strong className="text-blue-400">{activeCase.confidence}%</strong>
              </div>
            </div>

            {/* TAB 1: AI FORENSIC FINDINGS */}
            {activeTab === 'reasoning' && (
              <div className="space-y-4">
                {/* Live Console Output during execution */}
                {investigationLog.length > 0 && (
                  <div className="p-3 rounded-lg bg-[#070A10] border border-[#1E2D48] font-mono text-[11px] text-slate-300 space-y-1 max-h-36 overflow-y-auto">
                    <div className="text-slate-500 font-bold border-b border-[#162033] pb-1 flex justify-between">
                      <span>TRACEAI REAL-TIME EXECUTION LOGS</span>
                      <span className="text-emerald-400">STATUS: VERIFYING</span>
                    </div>
                    {investigationLog.map((log, i) => (
                      <div key={i} className="text-slate-300">
                        {log}
                      </div>
                    ))}
                  </div>
                )}

                {/* 3-Way Custody Breakdown Box */}
                <div className="p-4 rounded-xl bg-[#0A0E18] border border-[#162033] space-y-3">
                  <span className="text-xs font-bold text-slate-300 uppercase font-mono block">
                    3-WAY LEDGER CUSTODY TRACE
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-[#0E1524] border border-[#1A263D]">
                      <div className="text-[11px] text-slate-400">Razorpay Route</div>
                      <div className="text-lg font-bold font-mono text-white">₹48,000.00</div>
                      <div className="text-[10px] text-emerald-400 font-mono">✓ 14 Payments Captured</div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0E1524] border border-[#1A263D]">
                      <div className="text-[11px] text-slate-400">HDFC Bank CBS</div>
                      <div className="text-lg font-bold font-mono text-emerald-400">₹48,000.00</div>
                      <div className="text-[10px] text-emerald-400 font-mono">✓ Credited (UTR #HDFCR5...)</div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#150D15] border border-rose-500/40">
                      <div className="text-[11px] text-slate-400">Zoho Books ERP</div>
                      <div className="text-lg font-bold font-mono text-rose-400">₹0.00</div>
                      <div className="text-[10px] text-rose-400 font-mono font-bold">✕ Missing Journal Entry</div>
                    </div>
                  </div>
                </div>

                {/* Isolated Root Cause Box */}
                <div className="p-4 rounded-xl bg-[#140D14] border border-rose-500/50 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs font-mono">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>ISOLATED ROOT CAUSE (HTTP 504 GATEWAY TIMEOUT)</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-mono">
                    {activeCase.rootCause}
                  </p>
                </div>

                {/* Recommended Resolution Action */}
                <div className="p-4 rounded-xl bg-[#0B1424] border border-blue-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-blue-300 font-bold text-xs font-mono">
                    <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>RECOMMENDED RESOLUTION ACTION</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-mono">
                    {activeCase.recommendedAction}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: CUSTODY FLOW & TIME TRAVEL */}
            {activeTab === 'flow' && (
              <div className="space-y-4">
                <TimeTravelScrubber />
                <FlowCanvasRail />
              </div>
            )}

            {/* TAB 3: RAW TELEMETRY & PAYLOADS */}
            {activeTab === 'telemetry' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#090D14] border border-[#162033] space-y-2">
                  <div className="flex items-center justify-between border-b border-[#162033] pb-2">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-blue-400" />
                      Razorpay Webhook Payload (#wh_evt_9918237418)
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(activeCase.webhookDetails, null, 2));
                        showToast('JSON Copied', 'Copied raw webhook payload to clipboard.', 'info');
                      }}
                      className="text-[11px] text-blue-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      Copy JSON
                    </button>
                  </div>
                  <pre className="text-[11px] text-slate-400 bg-black/40 p-3 rounded overflow-x-auto">
{JSON.stringify({
  event: 'settlement.processed',
  account_id: 'acc_RZP_merchant_01',
  payload: {
    settlement: {
      entity: {
        id: 'setl_RZP_48000_902',
        amount: 4800000,
        currency: 'INR',
        status: 'processed',
        utr: 'HDFCR5202609040019284',
        fees: 0,
        tax: 0
      }
    }
  },
  attempts: 3,
  last_http_response: 504,
  error: 'Gateway Timeout (>30000ms)'
}, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-[#162033] flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              Target Ledger: <strong className="text-white">{activeCase.accountingSystem}</strong>
            </span>

            <button
              onClick={handleNavigateToResolution}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Scale className="w-4 h-4" />
              <span>Proceed to Resolution Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationWorkspace;
