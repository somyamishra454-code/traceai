import { useFinancialData } from '../data/financialContext';
import {
  Printer,
  Mail,
  Share2
} from 'lucide-react';

export const ExecutiveStoryboard = () => {
  const { activeCase, openEmailModal, showToast } = useFinancialData();

  const handlePrint = () => {
    showToast('Exporting PDF', 'Opening print/PDF export dialog for CFO Report...', 'info');
    window.print();
  };

  const handleShareReport = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Report Link Copied', 'Shareable secure audit memorandum link copied to clipboard.', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn py-2">
      {/* Header with Export & Email Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#162033] no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#38BDF8]">
              EXECUTIVE AUDIT STORYBOARD
            </span>
            <span className="badge-resolved">
              AUDIT CERTIFIED
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1">
            Forensic Incident & Reconciliation Report
          </h1>
          <p className="text-xs text-slate-400">
            Formal post-incident documentation prepared for CFO review, audit compliance, and general ledger reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => openEmailModal(activeCase)}
            className="btn-secondary text-xs font-medium px-3.5 py-2 flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Email Report to Board / CFO</span>
          </button>

          <button
            onClick={handleShareReport}
            className="btn-secondary text-xs font-medium px-3 py-2 flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Copy Link</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-primary text-xs font-semibold px-4 py-2 flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export to PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div className="fin-card p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 print:p-0 print:border-0 bg-[#0E1524] text-slate-200">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#1E2D48] pb-4 sm:pb-6 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#2563EB] flex items-center justify-center font-bold text-white text-xs">
                T
              </div>
              <span className="font-bold text-base sm:text-lg text-white tracking-tight">TraceAI Forensics Engine</span>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-mono">
              CONFIDENTIAL FINANCIAL AUDIT MEMORANDUM
            </div>
          </div>

          <div className="text-left sm:text-right text-[11px] sm:text-xs font-mono space-y-0.5 sm:space-y-1 text-slate-400">
            <div>Report ID: <span className="text-slate-200">REP-INV-1042-2026</span></div>
            <div>Generated: <span className="text-slate-200">2026-09-04 09:30:00 UTC</span></div>
            <div>Entity: <span className="text-slate-200">Acme Payments Corp</span></div>
          </div>
        </div>

        {/* Executive Summary Spotlight */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 rounded bg-[#0A0E18] border border-[#1A263D]">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Incident Case</span>
            <div className="font-bold text-xs sm:text-sm text-white font-mono">#{activeCase.id}</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">{activeCase.category}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Discrepancy Amount</span>
            <div className="font-bold text-sm sm:text-lg font-mono text-white">₹{activeCase.amount.toLocaleString('en-IN')}</div>
            <div className="text-[10px] sm:text-[11px] text-emerald-400">100% Reconciled</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">MTTR</span>
            <div className="font-bold text-xs sm:text-sm text-white font-mono">5.2 Seconds</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400">Automated Forensics</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Financial Loss</span>
            <div className="font-bold text-sm sm:text-lg font-mono text-emerald-400">₹0.00</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">Zero Leakage</div>
          </div>
        </div>

        {/* Narrative Forensic Summary */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1E2D48] pb-1">
            1. Executive Forensic Summary
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            On September 4, 2026, during the automated 04:00 AM daily reconciliation cycle, TraceAI identified a variance in Settlement <strong>#{activeCase.id}</strong> amounting to <strong>₹48,000.00</strong>.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Razorpay payout was successfully executed and cleared into the company's <strong>HDFC Bank Current Account •••• 8890</strong> under UTR reference <code>HDFCR5202609040019284</code>. However, an infrastructure gateway timeout (HTTP 504) on the webhook connector prevented the transaction from posting to the <strong>Zoho Books General Ledger Clearing Account (#1150)</strong>.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            TraceAI autonomously matched the UTR, validated the zero fee variance, generated balancing Journal Entry <strong>#{activeCase.journalEntry.entryNumber}</strong>, and restored general ledger parity with zero financial leakage.
          </p>
        </div>

        {/* Forensic Timeline */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1E2D48] pb-1">
            2. Chronological Forensics Timeline
          </h2>
          <div className="overflow-x-auto">
            <table className="fin-table">
              <thead>
                <tr>
                  <th>Timestamp (UTC)</th>
                  <th>Stage</th>
                  <th>Entity</th>
                  <th>Forensic Finding / Action</th>
                  <th>Verdict</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-mono text-xs">2026-09-04 03:30:00</td>
                  <td className="font-mono text-xs text-slate-300">Payout</td>
                  <td className="text-xs">Razorpay Payouts</td>
                  <td className="text-xs text-slate-300">Settlement batch #setl_RZP_48k generated for ₹48,000.00</td>
                  <td><span className="badge-resolved text-[9px]">Captured</span></td>
                </tr>
                <tr>
                  <td className="font-mono text-xs">2026-09-04 03:45:18</td>
                  <td className="font-mono text-xs text-slate-300">CBS Ingestion</td>
                  <td className="text-xs">HDFC Bank Host-to-Host</td>
                  <td className="text-xs text-slate-300">MT940 statement confirms cleared credit of ₹48,000.00 (UTR: HDFCR5202609040019284)</td>
                  <td><span className="badge-resolved text-[9px]">Credited</span></td>
                </tr>
                <tr className="bg-rose-500/5">
                  <td className="font-mono text-xs text-rose-300">2026-09-04 04:01:14</td>
                  <td className="font-mono text-xs text-rose-300">Webhook Fail</td>
                  <td className="text-xs">Zoho ERP Connector</td>
                  <td className="text-xs text-rose-300">HTTP 504 Gateway Timeout after 3 retries; journal creation aborted</td>
                  <td><span className="badge-risk text-[9px]">Break</span></td>
                </tr>
                <tr>
                  <td className="font-mono text-xs">2026-09-04 04:14:22</td>
                  <td className="font-mono text-xs text-slate-300">Autonomous Recon</td>
                  <td className="text-xs">TraceAI Engine</td>
                  <td className="text-xs text-slate-300">Detected gap, ingested telemetry, and formulated 94% confidence root cause</td>
                  <td><span className="badge-evidence text-[9px]">Correlated</span></td>
                </tr>
                <tr>
                  <td className="font-mono text-xs">2026-09-04 04:14:29</td>
                  <td className="font-mono text-xs text-slate-300">Resolution</td>
                  <td className="text-xs">Controller Auth</td>
                  <td className="text-xs text-slate-300">Posted Journal Entry #{activeCase.journalEntry.entryNumber} to balance ledger</td>
                  <td><span className="badge-resolved text-[9px]">Reconciled</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Balancing Journal Certificate */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1E2D48] pb-1">
            3. Executed Balancing General Ledger Adjustment
          </h2>
          <div className="p-4 rounded bg-[#0A0E18] border border-[#1A263D] space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-400 border-b border-[#162033] pb-2">
              <span>Journal Entry: <strong>#{activeCase.journalEntry.entryNumber}</strong></span>
              <span>Effective Date: <strong>{activeCase.journalEntry.date}</strong></span>
            </div>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between text-emerald-400">
                <span>DR 1020 - HDFC Bank Current A/c 8890</span>
                <span>₹48,000.00</span>
              </div>
              <div className="flex justify-between text-slate-300 pl-4">
                <span>CR 1150 - Payment Gateway Clearing Account</span>
                <span>₹48,000.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preventive Recommendations */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1E2D48] pb-1">
            4. Preventative System Controls
          </h2>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>Increase Zoho Books webhook connector timeout threshold from 30s to 60s during peak batch cycles.</li>
            <li>Configure automated dead-letter queue (DLQ) with exponential backoff for ERP sync retries.</li>
            <li>Enforce idempotency hash validation across all incoming settlement callbacks.</li>
          </ul>
        </div>

        {/* Signatures Block */}
        <div className="pt-6 sm:pt-8 border-t border-[#1E2D48] grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-xs font-mono text-slate-400">
          <div className="space-y-1 sm:space-y-2">
            <div className="text-slate-300 font-semibold">Prepared By:</div>
            <div className="text-slate-400">TraceAI Autonomous Financial Forensics Agent</div>
            <div className="text-[10px] text-slate-500 break-all">Hash: 0x8f2d991b402e88a14c9902f3014aef729910d944</div>
          </div>

          <div className="space-y-1 sm:space-y-2 sm:text-right">
            <div className="text-slate-300 font-semibold">Certified & Approved By:</div>
            <div className="text-emerald-400 font-semibold">Senior Finance Controller / CFO Desk</div>
            <div className="text-[10px] text-slate-500">Status: Formally Signed & Reconciled</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveStoryboard;
