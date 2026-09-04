import { useFinancialData, type LiveTransactionEvent } from '../../data/financialContext';
import { Activity, Play, Pause, Zap, CheckCircle2 } from 'lucide-react';

interface LiveTransactionStreamProps {
  compact?: boolean;
  maxItems?: number;
}

export const LiveTransactionStream = ({ compact = false, maxItems = 6 }: LiveTransactionStreamProps) => {
  const {
    liveEvents,
    isStreamActive,
    toggleStream,
    simulateLiveIngestionSpike,
    stats,
    showToast
  } = useFinancialData();

  const displayedEvents = liveEvents.slice(0, maxItems);

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const getGatewayColor = (gw: string) => {
    if (gw.includes('Razorpay')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (gw.includes('HDFC')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (gw.includes('Stripe')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'settlement':
        return <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/30">SETTLEMENT</span>;
      case 'cbs_credit':
        return <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-700/30">CBS CREDIT</span>;
      case 'erp_sync':
        return <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-700/30">ERP POST</span>;
      default:
        return <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">PAYMENT</span>;
    }
  };

  if (compact) {
    return (
      <div className="bg-[#0E1420] border border-[#162033] rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isStreamActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Live Ingestion Stream</span>
            <span className="text-[10px] font-mono text-slate-400">({stats.tpsCurrent} txns/sec)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleStream}
              className="p-1 rounded bg-[#162033] hover:bg-[#1E293B] text-slate-300 hover:text-white transition-colors"
              title={isStreamActive ? 'Pause Stream' : 'Resume Stream'}
            >
              {isStreamActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
            </button>
            <button
              onClick={simulateLiveIngestionSpike}
              className="px-2 py-0.5 text-[11px] font-medium rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 flex items-center gap-1 transition-all"
              title="Simulate 250 Ingested Txns"
            >
              <Zap className="w-2.5 h-2.5" />
              Spike
            </button>
          </div>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {displayedEvents.map((evt: LiveTransactionEvent) => (
            <div
              key={evt.id}
              className="flex items-center justify-between text-xs py-1.5 px-2 rounded bg-[#090D14]/60 border border-[#162033]/60 hover:border-slate-700 transition-all animate-fadeIn"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-[10px] text-slate-400 truncate max-w-[90px]">{evt.referenceId}</span>
                {getTypeBadge(evt.type)}
                <span className="text-slate-300 text-[11px] truncate hidden sm:inline">{evt.gateway}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-mono font-medium text-slate-100 text-xs">{formatCurrency(evt.amount)}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0E1420] border border-[#162033] rounded-xl overflow-hidden shadow-xl">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-[#0A0E17] border-b border-[#162033] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white tracking-wide">Real-Time Ingestion & Settlement Stream</h3>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                isStreamActive 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isStreamActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                {isStreamActive ? 'LIVE ACTIVE' : 'STREAM PAUSED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Zero-latency event pipeline cross-verifying Razorpay, Stripe, and HDFC CBS Host-to-Host feeds
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-3 mr-2 px-3 py-1 rounded-lg bg-[#090D14] border border-[#162033]">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Throughput</span>
              <span className="text-xs font-mono font-semibold text-emerald-400">{stats.tpsCurrent} txns/sec</span>
            </div>
            <div className="h-6 w-px bg-[#162033]" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Match Rate</span>
              <span className="text-xs font-mono font-semibold text-blue-400">{stats.reconciliationRate}%</span>
            </div>
          </div>

          <button
            onClick={toggleStream}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
              isStreamActive
                ? 'bg-[#162033] hover:bg-[#1E293B] text-slate-200 border-slate-700'
                : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {isStreamActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                <span>Resume Stream</span>
              </>
            )}
          </button>

          <button
            onClick={simulateLiveIngestionSpike}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            title="Inject simulated 250-transaction settlement batch"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Recon Surge</span>
          </button>
        </div>
      </div>

      {/* Stream Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#162033] bg-[#090D14]/80 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-4">Event Ref</th>
              <th className="py-2.5 px-3">Gateway / Channel</th>
              <th className="py-2.5 px-3">Pipeline Type</th>
              <th className="py-2.5 px-3">Amount</th>
              <th className="py-2.5 px-3">Reconciliation Status</th>
              <th className="py-2.5 px-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#162033]/60 text-xs">
            {displayedEvents.map((evt: LiveTransactionEvent, idx: number) => (
              <tr 
                key={evt.id}
                className={`hover:bg-[#131B2A]/60 transition-colors ${idx === 0 ? 'bg-blue-500/5' : ''}`}
              >
                <td className="py-2.5 px-4 font-mono font-medium text-slate-200">
                  <div className="flex items-center gap-2">
                    <span 
                      onClick={() => {
                        navigator.clipboard.writeText(evt.referenceId);
                        showToast('Reference Copied', `Copied ${evt.referenceId} to clipboard.`, 'info');
                      }}
                      className="cursor-pointer hover:text-blue-400 transition-colors"
                      title="Click to copy reference"
                    >
                      {evt.referenceId}
                    </span>
                    {idx === 0 && (
                      <span className="text-[9px] font-sans font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        NEW
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${getGatewayColor(evt.gateway)}`}>
                    {evt.gateway}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  {getTypeBadge(evt.type)}
                </td>
                <td className="py-2.5 px-3 font-mono font-semibold text-slate-100">
                  {formatCurrency(evt.amount)}
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="font-mono text-[11px] text-slate-300">2-Way Verified</span>
                  </div>
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-[11px] text-slate-400">
                  {evt.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Status Bar */}
      <div className="px-4 py-2 bg-[#090D14] border-t border-[#162033] flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Webhook listeners active on <code className="text-slate-300 font-mono">/v2/webhooks/reconcile</code></span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span>Ingested: <strong className="text-slate-200">{stats.transactionsAnalyzed.toLocaleString()}</strong></span>
          <span>•</span>
          <span>Matched: <strong className="text-emerald-400">{stats.transactionsMatched.toLocaleString()}</strong></span>
        </div>
      </div>
    </div>
  );
};
