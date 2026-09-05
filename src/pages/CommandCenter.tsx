import { useNavigate } from 'react-router-dom';
import { useFinancialData } from '../data/financialContext';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Cpu
} from 'lucide-react';

export const CommandCenter = () => {
  const { cases, setActiveCaseId, runInvestigation, isInvestigatingLive } = useFinancialData();
  const navigate = useNavigate();

  const primaryCase = cases.find(c => c.id === 'INV-1042') || cases[0];

  const handleRunInvestigationDirect = async () => {
    setActiveCaseId(primaryCase.id);
    navigate('/investigations');
    await runInvestigation(primaryCase.id);
  };

  const handleSelectCase = (caseId: string) => {
    setActiveCaseId(caseId);
    navigate('/investigations');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn py-2">
      {/* 1. FINANCIAL INTELLIGENCE HEADER */}
      <div className="space-y-1 pb-2">
        <div className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">
          FINANCIAL INTELLIGENCE
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Every unexplained rupee should have an explanation
        </h1>
      </div>

      {/* 2. AI INVESTIGATION SPOTLIGHT CARD */}
      <div className="bg-[#0E1420] border border-[#1A263D] rounded-xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                AI INVESTIGATION
              </span>
              <span className="text-xs font-mono text-slate-500">#{primaryCase.id}</span>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                ₹{primaryCase.amount.toLocaleString('en-IN')}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300 mt-0.5">
                Settlement mismatch
              </div>
            </div>

            <div className="text-[11px] sm:text-xs font-mono text-slate-400 flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-slate-200">Razorpay</span>
              <span className="text-slate-600">→</span>
              <span className="text-slate-200">HDFC Bank</span>
              <span className="text-slate-600">→</span>
              <span className="text-rose-400 font-semibold">Zoho Books</span>
            </div>
          </div>

          <div className="flex items-center sm:self-end w-full sm:w-auto">
            <button
              onClick={handleRunInvestigationDirect}
              disabled={isInvestigatingLive}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Cpu className="w-4 h-4" />
              <span>{isInvestigatingLive ? 'Investigating...' : 'Run Investigation'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. TRACEAI AGENT STATUS CARD */}
      <div className="bg-[#0E1420] border border-[#1A263D] rounded-xl p-4 sm:p-6 shadow-xl space-y-4">
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
            TRACEAI AGENT
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-200">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Currently investigating <strong>#{primaryCase.id}</strong></span>
          </div>
        </div>

        {/* 5 Clear Verification Checklist Items */}
        <div className="space-y-2 text-xs font-mono pt-1">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>13,690 transactions scanned</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Razorpay settlement verified</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>HDFC deposit verified</span>
          </div>

          <div className="flex items-center gap-2 text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span className="font-semibold">Zoho Books entry missing</span>
          </div>

          <div className="flex items-center gap-2 text-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping ml-1 mr-1" />
            <span>Determining root cause...</span>
          </div>
        </div>

        {/* Linear Stepper Track */}
        <div className="pt-3 border-t border-[#162033]">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono text-slate-400 font-semibold flex-wrap">
            <span className="text-emerald-400">DETECT ✓</span>
            <span className="text-slate-600">─</span>
            <span className="text-emerald-400">CORRELATE ✓</span>
            <span className="text-slate-600">─</span>
            <span className="text-emerald-400">TRACE ✓</span>
            <span className="text-slate-600">─</span>
            <span className="text-blue-400 font-bold animate-pulse">ROOT CAUSE ●</span>
          </div>
        </div>
      </div>

      {/* 4. EVIDENCE 3-WAY CUSTODY BREAKDOWN */}
      <div className="bg-[#0E1420] border border-[#1A263D] rounded-xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
          EVIDENCE
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-1">
          {/* Razorpay */}
          <div className="p-3.5 sm:p-4 rounded-lg bg-[#0A0E18] border border-[#162033] space-y-1.5 sm:space-y-2">
            <div className="text-xs font-semibold text-slate-400">Razorpay</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">₹48,000</div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Success</span>
            </div>
          </div>

          {/* HDFC Bank */}
          <div className="p-3.5 sm:p-4 rounded-lg bg-[#0A0E18] border border-[#162033] space-y-1.5 sm:space-y-2">
            <div className="text-xs font-semibold text-slate-400">HDFC Bank</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">₹48,000</div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Cleared</span>
            </div>
          </div>

          {/* Zoho Books */}
          <div className="p-3.5 sm:p-4 rounded-lg bg-[#140D14] border border-rose-500/40 space-y-1.5 sm:space-y-2">
            <div className="text-xs font-semibold text-slate-400">Zoho Books</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-rose-400">₹0</div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-rose-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Missing</span>
            </div>
          </div>
        </div>

        {/* Break Pointer Bar */}
        <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-rose-300">
            <span className="text-rose-400 font-bold">↑ BREAK DETECTED</span>
            <span className="text-slate-400 text-[11px] hidden md:inline">
              (HTTP 504 Webhook Timeout between HDFC Deposit and Zoho Books ERP)
            </span>
          </div>
          <button
            onClick={() => handleSelectCase(primaryCase.id)}
            className="text-xs text-blue-400 hover:text-white font-medium transition-colors cursor-pointer self-start sm:self-auto"
          >
            Investigate Break →
          </button>
        </div>
      </div>

      {/* 5. ACTIVE INVESTIGATIONS QUEUE */}
      <div className="bg-[#0E1420] border border-[#1A263D] rounded-xl p-4 sm:p-6 shadow-xl space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
          ACTIVE INVESTIGATIONS
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[480px]">
            <tbody className="divide-y divide-[#162033]/60">
              {cases.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => handleSelectCase(c.id)}
                  className="hover:bg-[#131B2A]/60 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-2 font-mono font-bold text-blue-400 w-20 sm:w-24">
                    #{c.id.replace('INV-', '')}
                  </td>
                  <td className="py-3 px-2 sm:px-3 font-mono font-semibold text-white w-28 sm:w-32">
                    ₹{c.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-slate-300 truncate max-w-[200px] sm:max-w-none">
                    {c.title}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-right">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
