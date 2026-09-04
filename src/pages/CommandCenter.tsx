import { useNavigate } from 'react-router-dom';
import { useFinancialData } from '../data/financialContext';
import {
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  Zap,
  ArrowRight,
  Database,
  Mail,
  RefreshCw
} from 'lucide-react';
import { LiveTransactionStream } from '../components/shared/LiveTransactionStream';

export const CommandCenter = () => {
  const { cases, stats, setActiveCaseId, openEmailModal, showToast } = useFinancialData();
  const navigate = useNavigate();

  const primaryCase = cases.find(c => c.id === 'INV-1042') || cases[0];

  const handleOpenPrimary = () => {
    setActiveCaseId(primaryCase.id);
    navigate('/investigations');
  };

  const handleRefreshPipeline = () => {
    showToast('Recon Telemetry Refreshed', 'Synced latest MT940 and gateway settlement logs (0.2s ago).', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header & Connectivity Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#162033]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white">Reconciliation Command Center</h1>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● LIVE RECON RUNNING
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time multi-gateway settlement telemetry, CBS host-to-host feeds, and automated discrepancy discovery.
          </p>
        </div>

        {/* Integration Status Pills & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0E1524] border border-[#1A263D] text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-400">Razorpay Route:</span>
            <span className="font-mono text-slate-200">Connected</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0E1524] border border-[#1A263D] text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-400">HDFC CBS:</span>
            <span className="font-mono text-slate-200">Synced</span>
          </div>

          <button
            onClick={() => openEmailModal(primaryCase)}
            className="btn-secondary text-xs px-3 py-1 flex items-center gap-1.5 text-slate-200 hover:text-white"
          >
            <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Email Recon Report</span>
          </button>

          <button
            onClick={handleRefreshPipeline}
            className="btn-secondary text-xs px-2.5 py-1 flex items-center gap-1 text-slate-400 hover:text-slate-200"
            title="Refresh pipeline status"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Level Financial KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Volume */}
        <div
          onClick={() => showToast('Inflow Volume', '₹1,42,80,450.00 across 12,487 scanned items.', 'info')}
          className="fin-card p-4 space-y-2 cursor-pointer hover:border-slate-600 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>24h Inflow Volume</span>
            <Database className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white">
            ₹1,42,80,450<span className="text-xs text-slate-500 font-normal">.00</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <span className="text-emerald-400 font-semibold">{stats.transactionsAnalyzed.toLocaleString()}</span>
            <span>txns scanned</span>
          </div>
        </div>

        {/* Metric 2: Reconciled Match Rate */}
        <div
          onClick={() => showToast('Recon Match Rate', `${stats.reconciliationRate}% automated match rate with zero manual intervention.`, 'info')}
          className="fin-card p-4 space-y-2 cursor-pointer hover:border-slate-600 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Automated Match Rate</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-emerald-400">
            {stats.reconciliationRate}%
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <span>{stats.transactionsMatched.toLocaleString()} clean matches</span>
          </div>
        </div>

        {/* Metric 3: Capital At Risk */}
        <div
          onClick={() => { setActiveCaseId(primaryCase.id); navigate('/investigations'); }}
          className={`fin-card p-4 space-y-2 cursor-pointer transition-colors ${stats.totalAtRiskAmount > 0 ? 'border-rose-500/40 bg-[#140D14] hover:border-rose-400' : ''}`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Unreconciled Variance</span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-rose-400">
            ₹{stats.totalAtRiskAmount.toLocaleString('en-IN')}<span className="text-xs text-rose-400/70 font-normal">.00</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-rose-300 font-mono">
            <span>{stats.unmatchedSettlements} unresolved items</span>
          </div>
        </div>

        {/* Metric 4: AI Telemetry */}
        <div
          onClick={() => showToast('Autonomous Engine', 'Mean root cause detection latency: 42ms.', 'info')}
          className="fin-card p-4 space-y-2 cursor-pointer hover:border-slate-600 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Investigation Engine</span>
            <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white">
            42<span className="text-xs text-slate-500 font-normal">ms</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <span>Avg root cause latency</span>
          </div>
        </div>
      </div>

      {/* Primary Investigation Spotlight Hero */}
      <div className={`p-5 rounded-lg border transition-all ${
        primaryCase.state === 'resolved'
          ? 'bg-[#0E1815] border-emerald-500/30'
          : 'bg-[#150E18] border-rose-500/50'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                primaryCase.state === 'resolved'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {primaryCase.severity} • {primaryCase.state.toUpperCase().replace('_', ' ')}
              </span>
              <span className="text-xs font-mono text-slate-400">Case #{primaryCase.id}</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">Detected: {primaryCase.detectedAt}</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                ₹{primaryCase.amount.toLocaleString('en-IN')}
              </span>
              <h2 className="text-lg font-semibold text-slate-200">
                {primaryCase.title}
              </h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {primaryCase.shortSummary}
            </p>

            {/* Visual Forensic Chain Summary */}
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono flex-wrap">
              <span className="px-2 py-1 rounded bg-[#0A0F1A] border border-[#1E2D48] text-slate-300">
                Razorpay Batch: <strong className="text-white">₹48,000 (Succeeded)</strong>
              </span>
              <span className="text-slate-600">→</span>
              <span className="px-2 py-1 rounded bg-[#0A0F1A] border border-[#1E2D48] text-slate-300">
                HDFC Bank: <strong className="text-emerald-400">₹48,000 (Cleared)</strong>
              </span>
              <span className="text-rose-400 font-bold">↛</span>
              <span className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300">
                Zoho Books: <strong className="text-rose-400">₹0 (Missing Entry)</strong>
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-center gap-2 flex-shrink-0">
            <button
              onClick={handleOpenPrimary}
              className="w-full sm:w-auto btn-primary text-xs font-semibold py-2.5 px-4 flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Open Investigation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-400 text-right">
              Confidence Score: <strong className="text-[#38BDF8]">{primaryCase.confidence}%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Live Streaming Ingestion Pipeline */}
      <LiveTransactionStream />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Investigation Queue */}
        <div className="lg:col-span-2 fin-card overflow-hidden">
          <div className="p-4 border-b border-[#1A253A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Active Discrepancy Queue</h3>
              <span className="text-[11px] font-mono text-slate-400">({cases.length} total)</span>
            </div>
            <button
              onClick={() => navigate('/inbox')}
              className="text-xs text-[#38BDF8] hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <span>View full inbox</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="fin-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Discrepancy</th>
                  <th>Gateway</th>
                  <th>Amount</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cases.map(c => (
                  <tr
                    key={c.id}
                    className="cursor-pointer"
                    onClick={() => {
                      setActiveCaseId(c.id);
                      navigate('/investigations');
                    }}
                  >
                    <td className="font-mono text-xs text-[#38BDF8] font-medium">
                      #{c.id}
                    </td>
                    <td>
                      <div className="font-medium text-slate-200 text-xs truncate max-w-xs">{c.title}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-xs">{c.category}</div>
                    </td>
                    <td className="font-mono text-xs text-slate-400">
                      {c.gateway}
                    </td>
                    <td className="font-mono text-xs font-semibold text-white">
                      ₹{c.amount.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className={
                        c.severity === 'CRITICAL' ? 'badge-risk' :
                        c.severity === 'HIGH' ? 'badge-attention' : 'badge-neutral'
                      }>
                        {c.severity}
                      </span>
                    </td>
                    <td>
                      <span className={
                        c.state === 'resolved' ? 'badge-resolved' :
                        c.state === 'resolution_ready' ? 'badge-attention' : 'badge-risk'
                      }>
                        {c.state.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-[#38BDF8] hover:underline font-mono">
                        Inspect →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Settlement Pipeline Velocity */}
        <div className="fin-card p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1A253A] pb-3">
            <h3 className="text-sm font-semibold text-white">Settlement Pipeline</h3>
            <span className="text-[11px] font-mono text-slate-400">T+1 Cycle</span>
          </div>

          <div className="space-y-3 text-xs">
            <div
              onClick={() => showToast('Razorpay Pipeline', '₹64.2L processed in batch #90112 (99.2% match rate).', 'info')}
              className="p-3 rounded bg-[#0E1524] border border-[#1A263D] space-y-1.5 cursor-pointer hover:border-slate-600 transition-colors"
            >
              <div className="flex justify-between items-center text-slate-300">
                <span className="font-medium">Razorpay Route (T+1)</span>
                <span className="font-mono text-emerald-400 font-semibold">₹64.2L</span>
              </div>
              <div className="w-full bg-[#162033] h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[99.2%]" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>UTR Dispatched: 03:30 AM</span>
                <span>1 Error (#INV-1042)</span>
              </div>
            </div>

            <div
              onClick={() => showToast('Stripe Pipeline', '₹41.8L processed across credit cards and international checkouts.', 'info')}
              className="p-3 rounded bg-[#0E1524] border border-[#1A263D] space-y-1.5 cursor-pointer hover:border-slate-600 transition-colors"
            >
              <div className="flex justify-between items-center text-slate-300">
                <span className="font-medium">Stripe Direct (T+2)</span>
                <span className="font-mono text-slate-200 font-semibold">₹41.8L</span>
              </div>
              <div className="w-full bg-[#162033] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#3B82F6] h-full rounded-full w-[98.8%]" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>CBS Ingested</span>
                <span>1 Dup (#INV-1043)</span>
              </div>
            </div>

            <div
              onClick={() => showToast('ICICI Pipeline', '₹36.8L settled with rolling reserve audit active.', 'info')}
              className="p-3 rounded bg-[#0E1524] border border-[#1A263D] space-y-1.5 cursor-pointer hover:border-slate-600 transition-colors"
            >
              <div className="flex justify-between items-center text-slate-300">
                <span className="font-medium">ICICI PayDirect</span>
                <span className="font-mono text-slate-200 font-semibold">₹36.8L</span>
              </div>
              <div className="w-full bg-[#162033] h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[96.4%]" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Hold Audit Pending</span>
                <span>1 Hold (#INV-1045)</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded bg-[#121A28] border border-[#1E2D48] text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-200">Reconciliation Engine Policy</div>
            <p className="text-[10px] leading-normal text-slate-400">
              Autonomous matching tolerances: Exact UTR, &lt;24h timestamp delta, ₹0.00 fee tolerance on net settlement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
