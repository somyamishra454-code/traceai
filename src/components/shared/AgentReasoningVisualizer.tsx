import { useFinancialData } from '../../data/financialContext';
import { 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  Database,
  Fingerprint
} from 'lucide-react';

export const AgentReasoningVisualizer = () => {
  const { activeCase, showToast } = useFinancialData();

  const evidenceCitations = [
    {
      source: 'HDFC Bank CBS MT940 Statement',
      ref: 'UTR #HDFCR5202609040019284',
      amount: '₹48,000.00',
      hash: 'sha256:8f2a99c1d...4b82',
      status: 'VERIFIED_CREDITED',
      confidence: 100
    },
    {
      source: 'Razorpay Route Settlement Batch',
      ref: 'setl_RZP_48000_902 (14 txns)',
      amount: '₹48,000.00',
      hash: 'sha256:3d1e89a0f...91c4',
      status: 'VERIFIED_SETTLED',
      confidence: 100
    },
    {
      source: 'ERP API Webhook Listener',
      ref: 'wh_evt_9918237418',
      amount: 'HTTP 504 Timeout',
      hash: 'sha256:e7a914b2c...0041',
      status: 'FAILED_TIMEOUT',
      confidence: 96
    },
    {
      source: 'Zoho Books Chart of Accounts',
      ref: 'Clearing A/c #1150',
      amount: activeCase.state === 'resolved' ? '₹48,000.00 (Balanced)' : '₹0.00 (Gap)',
      hash: 'sha256:119cb4812...77da',
      status: activeCase.state === 'resolved' ? 'RECONCILED' : 'MISSING_ENTRY',
      confidence: 100
    }
  ];

  return (
    <div className="bg-[#0E1420] border border-[#162033] rounded-xl overflow-hidden shadow-xl space-y-4 p-5 mb-6">
      {/* Top Model Badge Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#162033]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 text-indigo-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Autonomous Forensic AI Reasoning Engine
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                FinBERT-Forensic-v4
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Deterministic multi-source correlation engine operating with zero-temperature financial verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Model Confidence</span>
            <span className="text-sm font-mono font-bold text-blue-400">{activeCase.confidence}% Deterministic</span>
          </div>
          <div className="h-8 w-px bg-[#162033]" />
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Inference Latency</span>
            <span className="text-sm font-mono font-bold text-emerald-400">42ms</span>
          </div>
        </div>
      </div>

      {/* Confidence Breakdown Bars */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
          Confidence Sub-Score Decomposition
        </span>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#162033] space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Gateway Batch Match</span>
              <span className="font-mono text-emerald-400 font-bold">100%</span>
            </div>
            <div className="w-full bg-[#162033] h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full w-full" />
            </div>
            <span className="text-[10px] text-slate-500 font-mono block">14/14 payments captured</span>
          </div>

          <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#162033] space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Bank CBS Credit Match</span>
              <span className="font-mono text-emerald-400 font-bold">100%</span>
            </div>
            <div className="w-full bg-[#162033] h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full w-full" />
            </div>
            <span className="text-[10px] text-slate-500 font-mono block">Exact UTR match in HDFC MT940</span>
          </div>

          <div className="p-3 rounded-lg bg-[#150D15] border border-rose-500/40 space-y-1.5">
            <div className="flex justify-between text-xs text-rose-300 font-medium">
              <span>ERP Sync Health</span>
              <span className="font-mono text-rose-400 font-bold">0% (Break)</span>
            </div>
            <div className="w-full bg-[#162033] h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full w-0" />
            </div>
            <span className="text-[10px] text-rose-400 font-mono block">HTTP 504 Webhook Timeout</span>
          </div>

          <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#162033] space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Balancing Safety</span>
              <span className="font-mono text-blue-400 font-bold">100%</span>
            </div>
            <div className="w-full bg-[#162033] h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full w-full" />
            </div>
            <span className="text-[10px] text-slate-500 font-mono block">Zero tax/cash duplication risk</span>
          </div>
        </div>
      </div>

      {/* Cryptographic Evidence Citation Table */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-blue-400" />
            Cryptographic Evidence Custody Chain
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Immutable SHA-256 Payload Hashes
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#162033]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0A0E17] border-b border-[#162033] text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Telemetry Source</th>
                <th className="py-2.5 px-3">Reference / UTR</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Audit Hash</th>
                <th className="py-2.5 px-3 text-right">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162033]/60 bg-[#090D14]/50">
              {evidenceCitations.map((cit, idx) => (
                <tr key={idx} className="hover:bg-[#131B2A]/50 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-200">
                    <div className="flex items-center gap-2">
                      <Database className="w-3 h-3 text-slate-500" />
                      <span>{cit.source}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">
                    {cit.ref}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-white">
                    {cit.amount}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(cit.hash);
                        showToast('Hash Copied', `Copied evidence SHA-256 hash for ${cit.source}`, 'info');
                      }}
                      className="hover:text-blue-400 transition-colors cursor-pointer"
                      title="Click to copy SHA-256 hash"
                    >
                      {cit.hash}
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {cit.status.includes('VERIFIED') || cit.status.includes('RECONCILED') ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {cit.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                        <AlertTriangle className="w-3 h-3" />
                        {cit.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentReasoningVisualizer;
