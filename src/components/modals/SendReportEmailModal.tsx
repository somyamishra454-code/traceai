import { useState } from 'react';
import { useFinancialData } from '../../data/financialContext';
import {
  Mail,
  X,
  Send,
  RotateCw,
  CheckCircle2,
  Paperclip,
  Lock
} from 'lucide-react';

export const SendReportEmailModal = () => {
  const { emailModalCase, closeEmailModal, sendEvidenceEmail } = useFinancialData();

  if (!emailModalCase) return null;

  const [recipientType, setRecipientType] = useState<'cfo' | 'ops' | 'gateway' | 'bank' | 'auditor'>('cfo');
  const [customEmail, setCustomEmail] = useState('');
  const [subject, setSubject] = useState(
    `[FORENSIC EVIDENCE] Case #${emailModalCase.id}: ₹${emailModalCase.amount.toLocaleString('en-IN')} Settlement Mismatch Break Isolated`
  );
  const [notes, setNotes] = useState(
    `Automated TraceAI Forensic report. The ₹${emailModalCase.amount.toLocaleString('en-IN')} settlement was credited in HDFC Bank CBS (UTR #HDFCR5202609040019284) but failed to post to Zoho Books due to HTTP 504 webhook timeout. Full audit trail and balancing journal attached.`
  );
  const [attachEvidence, setAttachEvidence] = useState(true);
  const [attachJournal, setAttachJournal] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const RECIPIENT_PRESETS = {
    cfo: 'cfo-desk@acmepayments.com (Chief Financial Officer)',
    ops: 'finance-controller@acmepayments.com (Operations & Reconciliation)',
    gateway: 'merchant-escalations@razorpay.com (Razorpay Priority Support)',
    bank: 'corporate-cms@hdfcbank.com (HDFC Bank Host-to-Host Team)',
    auditor: 'external-audit@kpmg-audit.com (Statutory Audit Partner)'
  };

  const activeEmailAddress = customEmail.trim() || RECIPIENT_PRESETS[recipientType].split(' ')[0];

  const handleSend = async () => {
    setIsSending(true);
    await sendEvidenceEmail({
      caseId: emailModalCase.id,
      recipient: activeEmailAddress,
      recipientType,
      subject,
      notes,
      attachEvidence,
      attachJournal
    });
    setIsSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0E1524] border border-[#1E2D48] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1A253A] flex items-center justify-between bg-[#0B101A]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#2563EB]/20 border border-[#3B82F6]/40 flex items-center justify-center text-[#38BDF8]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Dispatch Forensic Evidence Email</span>
                <span className="font-mono text-xs text-[#38BDF8]">#{emailModalCase.id}</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Send verifiable evidence package and cryptographic audit memo to company leadership or gateway desk.
              </p>
            </div>
          </div>

          <button
            onClick={closeEmailModal}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#152033] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 font-sans text-xs">
          {/* Recipient Preset Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center justify-between">
              <span>Recipient Group / Authority</span>
              <span className="text-[10px] font-mono text-slate-500">Encrypted Dispatch</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setRecipientType('cfo'); setCustomEmail(''); }}
                className={`p-2 rounded border text-left transition-all ${
                  recipientType === 'cfo' && !customEmail
                    ? 'border-[#3B82F6] bg-[#152033] text-white'
                    : 'border-[#1A263D] bg-[#0A0E18] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold text-[11px]">CFO & Board</div>
                <div className="text-[10px] text-slate-500 truncate">cfo-desk@acmepayments.com</div>
              </button>

              <button
                type="button"
                onClick={() => { setRecipientType('ops'); setCustomEmail(''); }}
                className={`p-2 rounded border text-left transition-all ${
                  recipientType === 'ops' && !customEmail
                    ? 'border-[#3B82F6] bg-[#152033] text-white'
                    : 'border-[#1A263D] bg-[#0A0E18] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold text-[11px]">Finance Controller</div>
                <div className="text-[10px] text-slate-500 truncate">finance-controller@...</div>
              </button>

              <button
                type="button"
                onClick={() => { setRecipientType('gateway'); setCustomEmail(''); }}
                className={`p-2 rounded border text-left transition-all ${
                  recipientType === 'gateway' && !customEmail
                    ? 'border-[#3B82F6] bg-[#152033] text-white'
                    : 'border-[#1A263D] bg-[#0A0E18] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold text-[11px]">Razorpay Escalation</div>
                <div className="text-[10px] text-slate-500 truncate">merchant-escalations@...</div>
              </button>

              <button
                type="button"
                onClick={() => { setRecipientType('bank'); setCustomEmail(''); }}
                className={`p-2 rounded border text-left transition-all ${
                  recipientType === 'bank' && !customEmail
                    ? 'border-[#3B82F6] bg-[#152033] text-white'
                    : 'border-[#1A263D] bg-[#0A0E18] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold text-[11px]">HDFC Corporate CMS</div>
                <div className="text-[10px] text-slate-500 truncate">corporate-cms@...</div>
              </button>

              <button
                type="button"
                onClick={() => { setRecipientType('auditor'); setCustomEmail(''); }}
                className={`p-2 rounded border text-left transition-all ${
                  recipientType === 'auditor' && !customEmail
                    ? 'border-[#3B82F6] bg-[#152033] text-white'
                    : 'border-[#1A263D] bg-[#0A0E18] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold text-[11px]">Statutory Auditor</div>
                <div className="text-[10px] text-slate-500 truncate">external-audit@kpmg...</div>
              </button>
            </div>
          </div>

          {/* Custom Email Input */}
          <div className="space-y-1">
            <label className="text-slate-400 text-[11px]">Or specify custom email recipient:</label>
            <input
              type="email"
              placeholder="e.g. vp-finance@acmepayments.com"
              value={customEmail}
              onChange={e => setCustomEmail(e.target.value)}
              className="w-full bg-[#0A0E18] border border-[#1A263D] rounded px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] font-mono"
            />
          </div>

          {/* Subject Line */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-[#0A0E18] border border-[#1A263D] rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] font-mono"
            />
          </div>

          {/* Controller Notes */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Forensic Memo & Executive Summary</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-[#0A0E18] border border-[#1A263D] rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] font-mono leading-relaxed"
            />
          </div>

          {/* Attached Evidence Package Checklist */}
          <div className="p-3 rounded bg-[#0A0E18] border border-[#1A263D] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-[#38BDF8]" />
                Attached Evidence Proof Package
              </span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 text-[11px] text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attachEvidence}
                    onChange={e => setAttachEvidence(e.target.checked)}
                    className="rounded bg-[#090D14] border-[#1E2D48] text-[#3B82F6] focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Evidence Telemetry</span>
                </label>
                <label className="flex items-center gap-1 text-[11px] text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attachJournal}
                    onChange={e => setAttachJournal(e.target.checked)}
                    className="rounded bg-[#090D14] border-[#1E2D48] text-[#3B82F6] focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Journal Entry</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">MT940 CBS Statement (UTR Reference)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">Razorpay Batch JSON (#setl_RZP_48k)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">HTTP 504 Webhook Telemetry Logs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">Balancing Journal #JE-2026-904 Diff</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1A253A] flex items-center justify-between bg-[#0B101A]">
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Target: <strong className="text-white">{activeEmailAddress}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeEmailModal}
              disabled={isSending}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={isSending}
              className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5 shadow-md"
            >
              {isSending ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Dispatching Email...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Email Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendReportEmailModal;
