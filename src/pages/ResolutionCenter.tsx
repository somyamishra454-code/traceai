import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancialData } from '../data/financialContext';
import {
  CheckCircle2,
  Send,
  RotateCw,
  ArrowRight,
  ShieldCheck,
  FileText,
  Mail
} from 'lucide-react';
export const ResolutionCenter = () => {
  const { activeCase, approveResolution, retriggerWebhook, openEmailModal } = useFinancialData();
  const navigate = useNavigate();

  const [approvalNotes, setApprovalNotes] = useState<string>(
    'Verified against HDFC Bank CBS statement UTR #HDFCR5202609040019284. Authorizing automated balancing journal entry.'
  );
  const [isReplayingWebhook, setIsReplayingWebhook] = useState<boolean>(false);
  const [webhookSuccess, setWebhookSuccess] = useState<boolean>(activeCase.webhookDetails.lastHttpCode === 200);

  const handleReplayWebhook = async () => {
    setIsReplayingWebhook(true);
    const success = await retriggerWebhook(activeCase.id);
    setWebhookSuccess(success);
    setIsReplayingWebhook(false);
  };

  const handleExecuteApproval = () => {
    approveResolution(activeCase.id, approvalNotes);
  };

  const handleNavigateToReport = () => {
    navigate('/reports');
  };

  const isResolved = activeCase.state === 'resolved';

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#162033]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#38BDF8]">
              RESOLUTION CENTER • CASE #{activeCase.id}
            </span>
            <span className={isResolved ? 'badge-resolved' : 'badge-attention'}>
              {isResolved ? 'RESOLVED & RECONCILED' : 'READY FOR APPROVAL'}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1">
            Balancing Journal Entry & ERP Sync Authorization
          </h1>
          <p className="text-xs text-slate-400">
            Authorize automated ledger balancing adjustments and trigger idempotent webhook replay to clear discrepancies.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => openEmailModal(activeCase)}
            className="btn-secondary text-xs font-medium px-3.5 py-2 flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Email Sign-off Memo</span>
          </button>

          {isResolved && (
            <button
              onClick={handleNavigateToReport}
              className="btn-primary text-xs font-semibold px-4 py-2 flex items-center gap-2"
            >
              <span>View Executive Audit Storyboard</span>
              <FileText className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Resolution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT (7 COLS): PROPOSED BALANCING JOURNAL ENTRY ================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Double-Entry Journal Viewer */}
          <div className="fin-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A253A] pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  Proposed General Ledger Correction
                </span>
                <h3 className="text-sm font-bold text-white">
                  Journal Entry #{activeCase.journalEntry.entryNumber}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Date: {activeCase.journalEntry.date}
              </span>
            </div>

            {/* Journal Table */}
            <div className="overflow-x-auto">
              <table className="fin-table">
                <thead>
                  <tr>
                    <th>Account Code & Name</th>
                    <th>Debit (INR)</th>
                    <th>Credit (INR)</th>
                    <th>Memo / Description</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCase.journalEntry.lines.map((line, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="font-semibold text-slate-200 text-xs font-mono">
                          {line.accountCode}
                        </div>
                        <div className="text-[11px] text-slate-400">{line.accountName}</div>
                      </td>
                      <td className="font-mono text-xs font-bold text-emerald-400">
                        {line.debit > 0 ? `₹${line.debit.toLocaleString('en-IN')}.00` : '—'}
                      </td>
                      <td className="font-mono text-xs font-bold text-slate-300">
                        {line.credit > 0 ? `₹${line.credit.toLocaleString('en-IN')}.00` : '—'}
                      </td>
                      <td className="text-[11px] text-slate-400 max-w-[200px]">
                        {line.description}
                      </td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="bg-[#0B101A] font-bold border-t-2 border-[#1E2D48]">
                    <td className="text-xs font-mono text-white">TOTALS (BALANCED)</td>
                    <td className="font-mono text-xs text-emerald-400">
                      ₹{activeCase.journalEntry.totalDebit.toLocaleString('en-IN')}.00
                    </td>
                    <td className="font-mono text-xs text-slate-200">
                      ₹{activeCase.journalEntry.totalCredit.toLocaleString('en-IN')}.00
                    </td>
                    <td className="text-[10px] font-mono text-emerald-400">
                      Zero Variance (₹0.00)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded bg-[#0A0E18] border border-[#1A263D] text-[11px] text-slate-400 flex items-center justify-between">
              <span>ERP Target: <strong>{activeCase.accountingSystem}</strong></span>
              <span className="font-mono text-slate-300">Ref: {activeCase.journalEntry.reference}</span>
            </div>
          </div>

          {/* Webhook Replay Simulator */}
          <div className="fin-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A253A] pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  ERP Webhook Replay Tool
                </span>
                <h3 className="text-sm font-bold text-white">Idempotent Settlement Sync Re-trigger</h3>
              </div>
              <span className={webhookSuccess ? 'badge-resolved' : 'badge-attention'}>
                {webhookSuccess ? 'HTTP 200 OK' : 'HTTP 504 PENDING'}
              </span>
            </div>

            <div className="p-3 rounded bg-[#0A0E18] border border-[#1A263D] space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="text-slate-300 truncate max-w-sm">{activeCase.webhookDetails.endpoint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payload Token:</span>
                <span className="text-[#38BDF8]">{activeCase.webhookDetails.payloadId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Idempotency Key:</span>
                <span className="text-slate-300">idem_setl_RZP_48k_v2</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400">
                Replay dispatches signed HMAC payload with replay header to prevent duplicate settlement credit.
              </span>
              <button
                onClick={handleReplayWebhook}
                disabled={isReplayingWebhook || webhookSuccess}
                className="btn-secondary text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5 flex-shrink-0"
              >
                {isReplayingWebhook ? (
                  <>
                    <RotateCw className="w-3 h-3 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : webhookSuccess ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Replay Verified</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    <span>Replay Webhook</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT (5 COLS): AUTHORIZATION & SIGN-OFF ================= */}
        <div className="lg:col-span-5 fin-card p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A253A] pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  Controller Sign-off
                </span>
                <h3 className="text-sm font-bold text-white">Authorization & Audit Log</h3>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>

            {/* Financial Summary */}
            <div className="p-3.5 rounded bg-[#0E1524] border border-[#1A263D] space-y-2">
              <span className="text-xs text-slate-400 font-medium">Reconciliation Recovery Amount</span>
              <div className="text-2xl font-extrabold font-mono text-white">
                ₹{activeCase.amount.toLocaleString('en-IN')}.00
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-[#162033]">
                <span>Risk Exposure:</span>
                <span className="text-emerald-400 font-semibold">100% Recoverable</span>
              </div>
            </div>

            {/* Sign-off Notes Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Controller Sign-off Notes & Audit Memo</span>
                <span className="text-[10px] font-mono text-slate-500">Immutable</span>
              </label>
              <textarea
                rows={4}
                value={approvalNotes}
                onChange={e => setApprovalNotes(e.target.value)}
                disabled={isResolved}
                className="w-full bg-[#0A0E18] border border-[#1A263D] rounded p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] font-mono leading-relaxed"
              />
            </div>

            {/* Audit Trail Preview */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">Case Audit Trail</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {activeCase.auditLogs.map((log, i) => (
                  <div key={log.id || i} className="p-2 rounded bg-[#0A0E18] border border-[#141C2C] text-[10px] font-mono text-slate-400 space-y-0.5">
                    <div className="flex justify-between text-slate-300 font-semibold">
                      <span>{log.author}</span>
                      <span className="text-slate-500">{log.timestamp}</span>
                    </div>
                    <div className="text-slate-300">{log.action}: {log.notes}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Approval Buttons */}
          <div className="pt-3 border-t border-[#1A253A] space-y-2">
            {!isResolved ? (
              <button
                onClick={handleExecuteApproval}
                className="w-full btn-success text-xs py-3 font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Resolution & Post Ledger Entry</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center text-xs font-mono font-bold">
                  ✓ RESOLUTION APPROVED & EXECUTED
                </div>
                <button
                  onClick={handleNavigateToReport}
                  className="w-full btn-primary text-xs py-2.5 font-semibold flex items-center justify-center gap-2"
                >
                  <span>Generate Executive Forensic Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResolutionCenter;
