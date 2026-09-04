import { useNavigate } from 'react-router-dom';
import { useFinancialData } from '../data/financialContext';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Mail,
  RefreshCw,
  Cpu,
  Layers,
  Landmark,
  FileSpreadsheet,
  ArrowUpRight
} from 'lucide-react';
import { LiveTransactionStream } from '../components/shared/LiveTransactionStream';

export const CommandCenter = () => {
  const { cases, stats, setActiveCaseId, openEmailModal, showToast, runInvestigation, isInvestigatingLive } = useFinancialData();
  const navigate = useNavigate();

  const primaryCase = cases.find(c => c.id === 'INV-1042') || cases[0];

  const handleOpenPrimary = () => {
    setActiveCaseId(primaryCase.id);
    navigate('/investigations');
  };

  const handleRunInvestigationDirect = async () => {
    setActiveCaseId(primaryCase.id);
    navigate('/investigations');
    await runInvestigation(primaryCase.id);
  };

  const handleRefreshPipeline = () => {
    showToast('Recon Telemetry Refreshed', 'Synced latest MT940 statement and gateway settlement logs (0.2s ago).', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* 1. FINANCIAL INTELLIGENCE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#162033]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">
              FINANCIAL INTELLIGENCE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
              v2.4 Autonomous Engine
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Every unexplained rupee should have an explanation.
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous multi-gateway reconciliation, bank CBS host-to-host feeds, and automated discrepancy discovery.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E1524] border border-[#1A263D] text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Telemetry Stream:</span>
            <span className="font-mono text-slate-200 font-semibold">{stats.tpsCurrent} txns/sec</span>
          </div>

          <button
            onClick={() => openEmailModal(primaryCase)}
            className="px-3.5 py-1.5 rounded-lg bg-[#152033] hover:bg-[#1E293B] text-slate-200 hover:text-white border border-[#1E293B] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>Email Recon Report</span>
          </button>

          <button
            onClick={handleRefreshPipeline}
            className="p-1.5 rounded-lg bg-[#152033] hover:bg-[#1E293B] text-slate-400 hover:text-slate-200 border border-[#1E293D] transition-colors cursor-pointer"
            title="Refresh pipeline status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. AI INVESTIGATION SPOTLIGHT HERO & TRACEAI AGENT EXECUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT (7 COLS): AI INVESTIGATION CARD ================= */}
        <div className="lg:col-span-7 bg-[#140D14] border border-rose-500/50 rounded-2xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  AI INVESTIGATION ACTIVE
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Case #{primaryCase.id}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Severity: <strong className="text-rose-400">CRITICAL</strong>
              </span>
            </div>

            {/* Main Currency Amount & Title */}
            <div>
              <div className="text-4xl font-extrabold font-mono text-white tracking-tight flex items-baseline gap-2">
                <span>₹{primaryCase.amount.toLocaleString('en-IN')}</span>
                <span className="text-lg text-slate-400 font-normal">.00 INR</span>
              </div>
              <h2 className="text-lg font-bold text-slate-200 mt-1">
                Settlement mismatch detected in nightly batch
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Razorpay batch settlement deposited in HDFC Bank but missing in Zoho Books general ledger due to webhook timeout.
              </p>
            </div>

            {/* Fund Movement Flow Path */}
            <div className="p-3 rounded-xl bg-[#090D14]/80 border border-[#1E2D48] space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-semibold">
                Custody Chain Path:
              </span>
              <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
                <span className="px-2.5 py-1 rounded bg-[#152033] text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-blue-400" />
                  Razorpay Route
                </span>
                <span className="text-slate-500 font-bold">→</span>
                <span className="px-2.5 py-1 rounded bg-[#10241A] text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <Landmark className="w-3 h-3 text-emerald-400" />
                  HDFC Bank (8890)
                </span>
                <span className="text-rose-400 font-bold">↛</span>
                <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 font-bold">
                  <FileSpreadsheet className="w-3 h-3 text-rose-400" />
                  Zoho Books ERP (Clearing A/c #1150)
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-5 mt-4 border-t border-rose-500/20 flex flex-wrap items-center justify-between gap-3 relative z-10">
            <div className="text-xs font-mono text-slate-400">
              Deterministic Confidence: <strong className="text-blue-400 font-bold">94%</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenPrimary}
                className="px-3.5 py-2 rounded-lg bg-[#162033] hover:bg-[#1E293B] text-slate-200 hover:text-white border border-[#1E293B] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Inspect Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleRunInvestigationDirect}
                disabled={isInvestigatingLive}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Cpu className="w-4 h-4" />
                <span>{isInvestigatingLive ? 'Investigating...' : 'Run Investigation'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT (5 COLS): TRACEAI AGENT REAL-TIME REASONING ================= */}
        <div className="lg:col-span-5 bg-[#0E1420] border border-[#162033] rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Agent Status Header */}
            <div className="flex items-center justify-between border-b border-[#162033] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    TRACEAI AGENT
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Currently investigating #INV-1042</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#162033] text-slate-300 border border-slate-700">
                FinBERT-v4
              </span>
            </div>

            {/* Checklist of Verified Telemetry Steps */}
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#090D14]/60 border border-[#162033]/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-200 font-semibold">13,690 transactions scanned</span>
                  <span className="text-[11px] text-slate-500 block">Cross-referenced against Razorpay and HDFC feeds</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#090D14]/60 border border-[#162033]/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-200 font-semibold">Razorpay settlement verified</span>
                  <span className="text-[11px] text-slate-500 block">Batch #setl_RZP_48000_902 (14 charges captured)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#090D14]/60 border border-[#162033]/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-200 font-semibold">HDFC deposit verified</span>
                  <span className="text-[11px] text-emerald-400/80 block">UTR #HDFCR5202609040019284 • ₹48,000.00 credited</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#150D15] border border-rose-500/40">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-rose-300 font-bold">Zoho Books entry missing</span>
                  <span className="text-[11px] text-rose-400/80 block">Clearing A/c #1150 unposted (₹0.00 entry)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#0D1524] border border-blue-500/40">
                <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-blue-300 font-bold">Determining root cause...</span>
                  <span className="text-[11px] text-slate-400 block">HTTP 504 Webhook Timeout during nightly sync</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="pt-3 border-t border-[#162033]">
            <div className="p-2 rounded-lg bg-[#090D14] border border-[#162033] flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
              <span className="text-emerald-400">DETECT ✓</span>
              <span className="text-slate-600">─</span>
              <span className="text-emerald-400">CORRELATE ✓</span>
              <span className="text-slate-600">─</span>
              <span className="text-emerald-400">TRACE ✓</span>
              <span className="text-slate-600">─</span>
              <span className="text-blue-400 animate-pulse">ROOT CAUSE ●</span>
              <span className="text-slate-600">─</span>
              <span className="text-slate-500">RESOLVE ⭘</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. EVIDENCE 3-WAY CUSTODY BREAKDOWN (Exactly from wireframe) */}
      <div className="bg-[#0E1420] border border-[#162033] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#162033] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
              EVIDENCE • 3-WAY RECONCILIATION BREAKDOWN
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cryptographic cross-ledger balance verification across gateway pool, bank core banking statement, and ERP
            </p>
          </div>

          <button
            onClick={() => navigate('/evidence')}
            className="text-xs text-blue-400 hover:text-white flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <span>Full Evidence Graph</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Column Grid with Explicit Break Pointer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative py-2">
          {/* Card 1: Razorpay */}
          <div className="p-4 rounded-xl bg-[#0A0E18] border border-[#1A263D] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-slate-200">Razorpay Route</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                ✓ Success
              </span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">
              ₹48,000<span className="text-xs text-slate-500">.00</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 space-y-0.5 border-t border-white/5 pt-2">
              <div>Ref: <span className="text-slate-300">setl_RZP_48000_902</span></div>
              <div>Status: <span className="text-emerald-400">Captured (14 Payments)</span></div>
            </div>
          </div>

          {/* Card 2: HDFC Bank */}
          <div className="p-4 rounded-xl bg-[#0A0E18] border border-[#1A263D] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">HDFC Bank CBS</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                ✓ Cleared
              </span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-emerald-400">
              ₹48,000<span className="text-xs text-emerald-400/70">.00</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 space-y-0.5 border-t border-white/5 pt-2">
              <div>Account: <span className="text-slate-300">Current A/c •••• 8890</span></div>
              <div>UTR: <span className="text-emerald-400">HDFCR5202609040019284</span></div>
            </div>
          </div>

          {/* Card 3: Zoho Books */}
          <div className="p-4 rounded-xl bg-[#150D15] border border-rose-500/50 space-y-2 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-slate-200">Zoho Books ERP</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold">
                ✕ Missing
              </span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-rose-400">
              ₹0<span className="text-xs text-rose-400/70">.00</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 space-y-0.5 border-t border-rose-500/20 pt-2">
              <div>Account: <span className="text-slate-300">Clearing A/c #1150</span></div>
              <div>Sync: <span className="text-rose-400 font-bold">HTTP 504 Webhook Timeout</span></div>
            </div>
          </div>
        </div>

        {/* Prominent Break Marker Bar */}
        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>
              <strong>BREAK DETECTED</strong>: Webhook endpoint <code className="bg-black/40 px-1.5 py-0.5 rounded text-rose-200">/api/webhooks/razorpay/settlements</code> timed out after 3 retries (Response &gt; 30,000ms).
            </span>
          </div>
          <button
            onClick={() => navigate('/resolution')}
            className="px-3 py-1 rounded bg-rose-600/30 hover:bg-rose-600/40 text-rose-200 border border-rose-500/40 font-bold text-[11px] transition-colors cursor-pointer"
          >
            Authorize Balancing Journal →
          </button>
        </div>
      </div>

      {/* 4. ACTIVE INVESTIGATIONS QUEUE (From wireframe) */}
      <div className="bg-[#0E1420] border border-[#162033] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-[#0A0E18] border-b border-[#162033] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-wide font-mono uppercase">
              ACTIVE INVESTIGATIONS QUEUE
            </h3>
            <span className="text-[11px] font-mono text-slate-400">({cases.length} total cases)</span>
          </div>

          <button
            onClick={() => navigate('/inbox')}
            className="text-xs text-blue-400 hover:text-white flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <span>View all in Inbox</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#162033] bg-[#090D14] text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Case Ref</th>
                <th className="py-3 px-3">Discrepancy Category</th>
                <th className="py-3 px-3">Gateway / Channel</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162033]/60">
              {cases.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => {
                    setActiveCaseId(c.id);
                    navigate('/investigations');
                  }}
                  className="hover:bg-[#131B2A]/60 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono font-bold text-blue-400">
                    #{c.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-200">{c.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{c.category}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {c.gateway}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    ₹{c.amount.toLocaleString('en-IN')}.00
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      c.severity === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : c.severity === 'HIGH'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {c.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      c.state === 'resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}>
                      {c.state.toUpperCase().replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs font-mono font-semibold text-blue-400 hover:text-white transition-colors">
                      Open Investigation →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. LIVE TRANSACTION STREAM TICKER */}
      <LiveTransactionStream />
    </div>
  );
};

export default CommandCenter;
