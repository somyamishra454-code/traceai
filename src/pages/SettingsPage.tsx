import { useState } from 'react';
import { useFinancialData } from '../data/financialContext';
import {
  CheckCircle2,
  Save,
  Mail,
  Send
} from 'lucide-react';

export const SettingsPage = () => {
  const { autoEmailOnCritical, setAutoEmailOnCritical, showToast, activeCase, openEmailModal } = useFinancialData();

  const [autoReconcile, setAutoReconcile] = useState(true);
  const [feeTolerance, setFeeTolerance] = useState('0.00');
  const [webhookTimeout, setWebhookTimeout] = useState('60');
  const [dualSignoff, setDualSignoff] = useState(true);
  const [cfoEmail, setCfoEmail] = useState('cfo-desk@acmepayments.com');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    showToast('Preferences Saved', 'Autonomous reconciliation policies and email dispatch triggers updated.', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSendTestEmail = () => {
    openEmailModal(activeCase);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#162033]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Reconciliation & Agent Settings
          </h1>
          <p className="text-xs text-slate-400">
            Configure autonomous investigation tolerances, automated email alerts to company leadership, and compliance audit policies.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn-primary text-xs font-semibold px-4 py-2 flex items-center gap-1.5"
        >
          {saved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saved ? 'Saved Successfully' : 'Save Preferences'}</span>
        </button>
      </div>

      {/* Automated Email Dispatch to Company Leadership */}
      <div className="fin-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1A253A] pb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              Automated Forensic Email Alerts to Company
            </span>
          </div>
          <button
            onClick={handleSendTestEmail}
            className="btn-secondary text-xs px-3 py-1 flex items-center gap-1.5 text-slate-200 hover:text-white"
          >
            <Send className="w-3 h-3 text-[#38BDF8]" />
            <span>Test Dispatch Email</span>
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-[#162033]">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-200">Auto-Email Forensic Report on Critical Detection</div>
              <div className="text-[11px] text-slate-400">
                Automatically dispatch verifiable evidence package (MT940 CBS statement + gateway payloads + break root cause) to company finance team when an anomaly is isolated.
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoEmailOnCritical}
              onChange={e => {
                setAutoEmailOnCritical(e.target.checked);
                showToast(
                  'Alert Policy Updated',
                  e.target.checked ? 'Auto-dispatch email on critical anomaly enabled.' : 'Auto-dispatch email disabled.',
                  'info'
                );
              }}
              className="rounded bg-[#0A0E18] border-[#1A263D] text-[#3B82F6] focus:ring-0 w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#162033]">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-200">Company Executive / CFO Email Endpoint</div>
              <div className="text-[11px] text-slate-400">Primary distribution mailbox for forensic audit memorandum dispatch.</div>
            </div>
            <div className="w-64">
              <input
                type="email"
                value={cfoEmail}
                onChange={e => setCfoEmail(e.target.value)}
                className="w-full bg-[#0A0E18] border border-[#1A263D] rounded px-2.5 py-1 text-xs text-slate-200 font-mono text-right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Integration Connectors */}
      <div className="fin-card p-5 space-y-4">
        <span className="text-xs font-semibold text-white uppercase tracking-wider">
          Financial Gateway & CBS Integrations
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded bg-[#0A0E18] border border-[#1A263D] flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-200">Razorpay Route (Production)</div>
              <div className="text-[11px] font-mono text-slate-400">Key: rzp_live_9921••••••••</div>
            </div>
            <span className="badge-resolved text-[9px]">Connected</span>
          </div>

          <div className="p-3 rounded bg-[#0A0E18] border border-[#1A263D] flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-200">HDFC Bank Host-to-Host (MT940)</div>
              <div className="text-[11px] font-mono text-slate-400">SFTP CBS Feed • Port 22</div>
            </div>
            <span className="badge-resolved text-[9px]">Active</span>
          </div>

          <div className="p-3 rounded bg-[#0A0E18] border border-[#1A263D] flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-200">Stripe Direct Payments</div>
              <div className="text-[11px] font-mono text-slate-400">Key: sk_live_51M••••••••</div>
            </div>
            <span className="badge-resolved text-[9px]">Connected</span>
          </div>

          <div className="p-3 rounded bg-[#0A0E18] border border-[#1A263D] flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-200">Zoho Books ERP Connector</div>
              <div className="text-[11px] font-mono text-slate-400">OAuth 2.0 • Org #60019284</div>
            </div>
            <span className="badge-attention text-[9px]">Latency Alert</span>
          </div>
        </div>
      </div>

      {/* Autonomous Reconciliation Tolerances */}
      <div className="fin-card p-5 space-y-4">
        <span className="text-xs font-semibold text-white uppercase tracking-wider">
          Reconciliation Engine Tolerances
        </span>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-[#162033]">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-200">Autonomous Reconcile & Match</div>
              <div className="text-[11px] text-slate-400">Automatically pair UTR bank statement credits with gateway settlement batches.</div>
            </div>
            <input
              type="checkbox"
              checked={autoReconcile}
              onChange={e => setAutoReconcile(e.target.checked)}
              className="rounded bg-[#0A0E18] border-[#1A263D] text-[#3B82F6] focus:ring-0 w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#162033]">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-200">Maximum Settlement Fee Tolerance (INR)</div>
              <div className="text-[11px] text-slate-400">Flag discrepancy if gateway MDR deduction deviates from contractual fee matrix.</div>
            </div>
            <div className="w-32">
              <input
                type="text"
                value={feeTolerance}
                onChange={e => setFeeTolerance(e.target.value)}
                className="w-full bg-[#0A0E18] border border-[#1A263D] rounded px-2.5 py-1 text-xs text-slate-200 font-mono text-right"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-200">ERP Webhook Timeout Limit (Seconds)</div>
              <div className="text-[11px] text-slate-400">Time allowed for general ledger API response before triggering investigation.</div>
            </div>
            <div className="w-32">
              <input
                type="text"
                value={webhookTimeout}
                onChange={e => setWebhookTimeout(e.target.value)}
                className="w-full bg-[#0A0E18] border border-[#1A263D] rounded px-2.5 py-1 text-xs text-slate-200 font-mono text-right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Audit & Compliance Controls */}
      <div className="fin-card p-5 space-y-4">
        <span className="text-xs font-semibold text-white uppercase tracking-wider">
          Compliance & Dual-Signoff Policy
        </span>

        <div className="flex items-center justify-between py-2 text-xs">
          <div className="space-y-0.5">
            <div className="font-semibold text-slate-200">Require Controller Sign-off on Ledger Adjustments</div>
            <div className="text-[11px] text-slate-400">Mandate senior controller authorization before posting balancing entries over ₹10,000.</div>
          </div>
          <input
            type="checkbox"
            checked={dualSignoff}
            onChange={e => setDualSignoff(e.target.checked)}
            className="rounded bg-[#0A0E18] border-[#1A263D] text-[#3B82F6] focus:ring-0 w-4 h-4"
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
