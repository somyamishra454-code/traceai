import { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancialData } from '../data/financialContext';
import {
  ArrowRight,
  AlertOctagon,
  FileCode,
  Lock,
  Mail,
  Copy,
  Download,
  Check
} from 'lucide-react';
import { FlowCanvasRail } from '../components/shared/FlowCanvasRail';
import { InvestigationWorkflowStepper } from '../components/shared/InvestigationWorkflowStepper';

export const EvidenceGraphPage = () => {
  const { activeCase, openEmailModal, showToast } = useFinancialData();
  const navigate = useNavigate();

  // Selected node for deep inspection
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-5'); // default to broken accounting node
  const [copied, setCopied] = useState(false);

  const nodes = activeCase.chainNodes.length > 0 ? activeCase.chainNodes : [
    {
      id: 'node-1',
      type: 'payment' as const,
      title: 'Customer Payments',
      entity: 'Razorpay Gateway',
      referenceId: 'batch_90112 (14 txns)',
      expectedAmount: 48000,
      actualAmount: 48000,
      status: 'ok' as const,
      timestamp: '2026-09-03 23:45:00 UTC',
      metadata: {
        'Transactions': '14 items',
        'Status': 'Captured',
        'Gross Volume': '₹48,000.00'
      }
    },
    {
      id: 'node-2',
      type: 'order' as const,
      title: 'Merchant Orders',
      entity: 'Commerce Platform',
      referenceId: 'ord_992104881',
      expectedAmount: 48000,
      actualAmount: 48000,
      status: 'ok' as const,
      timestamp: '2026-09-03 23:50:12 UTC',
      metadata: {
        'Fulfillment': 'Fulfilled',
        'Invoice': 'INV-2026-8819'
      }
    },
    {
      id: 'node-3',
      type: 'settlement' as const,
      title: 'Settlement Batch',
      entity: 'Razorpay Payouts',
      referenceId: 'setl_RZP_48000_902',
      expectedAmount: 48000,
      actualAmount: 48000,
      status: 'ok' as const,
      timestamp: '2026-09-04 03:30:00 UTC',
      metadata: {
        'Settlement Status': 'Processed',
        'MDR Fee': '₹0.00'
      }
    },
    {
      id: 'node-4',
      type: 'bank' as const,
      title: 'Bank Deposit',
      entity: 'HDFC Bank CBS',
      referenceId: 'UTR: HDFCR5202609040019284',
      expectedAmount: 48000,
      actualAmount: 48000,
      status: 'ok' as const,
      timestamp: '2026-09-04 03:45:18 UTC',
      metadata: {
        'Account': 'Current A/c 8890',
        'CBS Status': 'CLEARED'
      }
    },
    {
      id: 'node-5',
      type: 'accounting' as const,
      title: 'Accounting General Ledger',
      entity: 'Zoho Books ERP',
      referenceId: 'UNPOSTED / MISSING',
      expectedAmount: 48000,
      actualAmount: 0,
      status: 'break' as const,
      timestamp: '2026-09-04 04:00:00 UTC (FAILED)',
      metadata: {
        'Journal Entry': 'None Found',
        'Sync Status': 'FAILED (HTTP 504)'
      }
    }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[nodes.length - 1];

  const handleCopyPayload = () => {
    const text = JSON.stringify(selectedNode.rawPayload || selectedNode.metadata, null, 2);
    navigator.clipboard?.writeText(text);
    setCopied(true);
    showToast('Payload Copied', `Copied ${selectedNode.title} JSON payload to clipboard.`, 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportAuditBundle = () => {
    showToast(
      'Audit Package Exported',
      `Exported forensic evidence bundle for Case #${activeCase.id} with SHA-256 hash.`,
      'success'
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 6-Stage Investigation Lifecycle Stepper */}
      <InvestigationWorkflowStepper />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#162033]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#38BDF8]">
              FORENSIC EVIDENCE GRAPH • CASE #{activeCase.id}
            </span>
            <span className={activeCase.state === 'resolved' ? 'badge-resolved' : 'badge-risk'}>
              {activeCase.state === 'resolved' ? 'RECONCILED' : 'DISCREPANCY ISOLATED'}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1">
            End-to-End Financial Flow Chain & Break Analysis
          </h1>
          <p className="text-xs text-slate-400">
            Cryptographic tracing of money movement from customer payment capture to ERP general ledger posting.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => openEmailModal(activeCase)}
            className="btn-secondary text-xs font-medium px-3.5 py-2 flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Email Evidence Package</span>
          </button>

          <button
            onClick={handleExportAuditBundle}
            className="btn-secondary text-xs font-medium px-3.5 py-2 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Bundle</span>
          </button>

          <button
            onClick={() => navigate('/resolution')}
            className="btn-primary text-xs font-semibold px-4 py-2 flex items-center gap-2"
          >
            <span>Open Resolution Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Flow Canvas Rail */}
      <FlowCanvasRail />

      {/* Main Forensic Workspace: Left Interactive Flow + Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT (7 COLS): THE EVIDENCE CHAIN ================= */}
        <div className="lg:col-span-7 space-y-4">
          <div className="fin-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A253A] pb-3">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Transaction Lifecycle Flow
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Click any node to inspect raw audit telemetry
              </span>
            </div>

            {/* Vertical Flow with Explicit Break Marker */}
            <div className="space-y-3 relative">
              {nodes.map((node, index) => {
                const isSelected = node.id === selectedNodeId;
                const isBreak = node.status === 'break';
                const isPrevToBreak = index === nodes.length - 2;

                return (
                  <Fragment key={node.id}>
                    {/* Node Card */}
                    <div
                      onClick={() => {
                        setSelectedNodeId(node.id);
                        showToast(`Selected Node: ${node.title}`, `${node.entity} • ${node.referenceId}`, 'info');
                      }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#3B82F6] bg-[#152033] shadow-lg ring-1 ring-[#3B82F6]'
                          : isBreak
                          ? 'border-rose-500/50 bg-[#150D15] hover:bg-[#1A101A]'
                          : 'border-[#1A263D] bg-[#0E1524] hover:bg-[#121B2C]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#0A0F1A] border border-[#1E2D48] text-slate-400">
                              Step {index + 1}: {node.type}
                            </span>
                            <span className="font-semibold text-slate-200 text-xs">{node.title}</span>
                          </div>
                          <div className="text-xs text-slate-300 font-mono font-medium">
                            {node.entity} • <span className="text-slate-400">{node.referenceId}</span>
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="font-mono text-sm font-bold text-white">
                            {isBreak ? (
                              <span className="text-rose-400">₹{node.actualAmount.toLocaleString('en-IN')} (Missing)</span>
                            ) : (
                              <span>₹{node.actualAmount.toLocaleString('en-IN')}.00</span>
                            )}
                          </div>
                          <span className={isBreak ? 'badge-risk text-[9px]' : 'badge-resolved text-[9px]'}>
                            {isBreak ? 'FAIL / BREAK' : 'VERIFIED OK'}
                          </span>
                        </div>
                      </div>

                      {/* Quick Node Metadata Summary */}
                      <div className="mt-3 pt-2 border-t border-[#162033] grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                        <div>Time: <span className="text-slate-300">{node.timestamp}</span></div>
                        <div className="text-right">Expected: <span className="text-slate-300">₹{node.expectedAmount.toLocaleString('en-IN')}</span></div>
                      </div>
                    </div>

                    {/* Arrow or Break Marker */}
                    {index < nodes.length - 1 && (
                      <div className="flex items-center justify-center my-1">
                        {isPrevToBreak ? (
                          <div className="w-full flex items-center justify-center gap-3 py-1 bg-rose-500/10 border border-rose-500/30 rounded text-rose-300 text-[11px] font-mono font-semibold">
                            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                            <span>FORENSIC BREAK DETECTED HERE (HTTP 504 Webhook Timeout)</span>
                          </div>
                        ) : (
                          <div className="w-0.5 h-4 bg-[#1E2D48]" />
                        )}
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>

          {/* Ledger State Comparison Matrix */}
          <div className="fin-card p-4 space-y-3">
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              Reconciliation Variance Matrix
            </span>
            <div className="overflow-x-auto">
              <table className="fin-table">
                <thead>
                  <tr>
                    <th>Ledger / Entity</th>
                    <th>Expected Balance</th>
                    <th>Actual Balance</th>
                    <th>Variance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-mono text-xs text-slate-300">Razorpay Payout Pool</td>
                    <td className="font-mono text-xs text-slate-200">₹48,000.00</td>
                    <td className="font-mono text-xs text-slate-200">₹48,000.00</td>
                    <td className="font-mono text-xs text-slate-400">₹0.00</td>
                    <td><span className="badge-resolved text-[9px]">Matched</span></td>
                  </tr>
                  <tr>
                    <td className="font-mono text-xs text-slate-300">HDFC Bank CBS A/c 8890</td>
                    <td className="font-mono text-xs text-slate-200">₹48,000.00</td>
                    <td className="font-mono text-xs text-emerald-400 font-bold">₹48,000.00</td>
                    <td className="font-mono text-xs text-slate-400">₹0.00</td>
                    <td><span className="badge-resolved text-[9px]">Credited</span></td>
                  </tr>
                  <tr className="bg-[#180D14]">
                    <td className="font-mono text-xs text-rose-300 font-bold">Zoho Books Clearing #1150</td>
                    <td className="font-mono text-xs text-slate-200">₹48,000.00</td>
                    <td className="font-mono text-xs text-rose-400 font-bold">₹0.00</td>
                    <td className="font-mono text-xs text-rose-400 font-bold">-₹48,000.00</td>
                    <td><span className="badge-risk text-[9px]">Missing</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ================= RIGHT (5 COLS): DEEP NODE INSPECTOR ================= */}
        <div className="lg:col-span-5 fin-card p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A253A] pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  Deep Node Inspector
                </span>
                <h3 className="text-sm font-bold text-white">{selectedNode.title}</h3>
              </div>
              <span className={selectedNode.status === 'break' ? 'badge-risk' : 'badge-resolved'}>
                {selectedNode.status === 'break' ? 'BREAK IDENTIFIED' : 'INTEGRITY VERIFIED'}
              </span>
            </div>

            {/* Entity & Metadata Table */}
            <div className="p-3 rounded bg-[#0A0E18] border border-[#1A263D] space-y-2 text-xs">
              <div className="text-slate-400 font-semibold">Node Telemetry Attributes</div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between py-0.5 border-b border-[#141C2C]">
                  <span className="text-slate-500">Entity:</span>
                  <span className="text-slate-200">{selectedNode.entity}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#141C2C]">
                  <span className="text-slate-500">Reference ID:</span>
                  <span className="text-[#38BDF8]">{selectedNode.referenceId}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#141C2C]">
                  <span className="text-slate-500">Expected Value:</span>
                  <span className="text-slate-200">₹{selectedNode.expectedAmount.toLocaleString('en-IN')}.00</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#141C2C]">
                  <span className="text-slate-500">Recorded Value:</span>
                  <span className={selectedNode.status === 'break' ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                    ₹{selectedNode.actualAmount.toLocaleString('en-IN')}.00
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Ingestion Timestamp:</span>
                  <span className="text-slate-300">{selectedNode.timestamp}</span>
                </div>
              </div>
            </div>

            {/* Raw JSON Payload Viewer with Copy Button */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold">
                  <FileCode className="w-3.5 h-3.5 text-slate-500" />
                  Raw Ingested Payload (JSON)
                </span>
                <button
                  type="button"
                  onClick={handleCopyPayload}
                  className="flex items-center gap-1 text-[10px] font-mono text-[#38BDF8] hover:text-white px-1.5 py-0.5 rounded bg-[#131C2E] border border-[#22314D]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-3 rounded bg-[#070A10] border border-[#1A253A] font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56 leading-relaxed">
                {JSON.stringify(selectedNode.rawPayload || selectedNode.metadata, null, 2)}
              </pre>
            </div>

            {/* Cryptographic Proof Card */}
            <div className="p-3 rounded bg-[#0E1524] border border-[#1A263D] space-y-1.5 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Lock className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Forensic Chain of Custody Proof</span>
              </div>
              <div className="text-[10px] text-slate-400 break-all leading-tight">
                Hash: <span className="text-slate-300">0x8f2d991b402e88a14c9902f3014aef729910d94410a8b9e0</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-2 border-t border-[#1A253A] space-y-2">
            <button
              onClick={() => openEmailModal(activeCase)}
              className="w-full btn-secondary text-xs py-2 font-medium flex items-center justify-center gap-2 text-slate-200 hover:text-white"
            >
              <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Email Proof to Razorpay & HDFC Support</span>
            </button>

            <button
              onClick={() => navigate('/resolution')}
              className="w-full btn-primary text-xs py-2.5 font-semibold flex items-center justify-center gap-2"
            >
              <span>Execute Balancing Correction</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceGraphPage;
