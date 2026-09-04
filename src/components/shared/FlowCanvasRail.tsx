import { useState } from 'react';
import { useFinancialData } from '../../data/financialContext';
import { 
  CreditCard, 
  Layers, 
  Landmark, 
  FileSpreadsheet, 
  AlertTriangle, 
  Zap, 
  Code2,
  Copy
} from 'lucide-react';

interface FlowCanvasRailProps {
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string;
}

export const FlowCanvasRail = ({ onSelectNode, selectedNodeId: externalSelectedNodeId }: FlowCanvasRailProps) => {
  const { activeCase, showToast } = useFinancialData();
  const [internalSelectedNode, setInternalSelectedNode] = useState<string>('node-webhook');
  const [isPulseActive, setIsPulseActive] = useState<boolean>(true);

  const selectedNodeId = externalSelectedNodeId || internalSelectedNode;

  const nodes = [
    {
      id: 'node-charges',
      name: 'Customer Charges',
      entity: 'Razorpay Gateway',
      ref: '14 Captured Txns',
      amount: '₹48,000.00',
      status: 'ok',
      icon: CreditCard,
      color: 'blue'
    },
    {
      id: 'node-settlement',
      name: 'Batch Settlement',
      entity: 'Razorpay Route',
      ref: 'setl_RZP_48000_902',
      amount: '₹48,000.00',
      status: 'ok',
      icon: Layers,
      color: 'blue'
    },
    {
      id: 'node-bank',
      name: 'Host-to-Host Deposit',
      entity: 'HDFC Bank CBS',
      ref: 'UTR #HDFCR52026...',
      amount: '₹48,000.00',
      status: 'ok',
      icon: Landmark,
      color: 'emerald'
    },
    {
      id: 'node-webhook',
      name: 'ERP Webhook Sync',
      entity: 'API Dispatcher',
      ref: 'wh_evt_9918237418',
      amount: 'HTTP 504 Timeout',
      status: 'break',
      icon: AlertTriangle,
      color: 'rose'
    },
    {
      id: 'node-erp',
      name: 'General Ledger',
      entity: 'Zoho Books Enterprise',
      ref: 'Clearing A/c 1150',
      amount: activeCase.state === 'resolved' ? '₹48,000.00 (Balanced)' : '₹0.00 (Missing)',
      status: activeCase.state === 'resolved' ? 'ok' : 'warning',
      icon: FileSpreadsheet,
      color: activeCase.state === 'resolved' ? 'emerald' : 'amber'
    }
  ];

  const handleNodeClick = (id: string) => {
    setInternalSelectedNode(id);
    if (onSelectNode) onSelectNode(id);
    showToast('Node Selected', `Inspecting pipeline node: ${id}`, 'info');
  };

  const triggerPacketPulse = () => {
    setIsPulseActive(false);
    setTimeout(() => setIsPulseActive(true), 50);
    showToast('Telemetry Packet Fired', 'Tracing live synthetic payload across settlement chain.', 'info');
  };

  return (
    <div className="bg-[#0E1420] border border-[#162033] rounded-xl overflow-hidden shadow-xl mb-6">
      {/* Header */}
      <div className="px-4 py-3 bg-[#0A0E17] border-b border-[#162033] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Forensic Custody Flow Rail
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                1 DISRUPTION DETECTED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive telemetry rails visualizing fund flow and the precise HTTP 504 break location
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerPacketPulse}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#162033] hover:bg-[#1E293B] text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
            title="Send test telemetry packet through flow rail"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Trace Packet Pulse</span>
          </button>
        </div>
      </div>

      {/* Interactive Flow Canvas */}
      <div className="p-6 bg-[#080C14] overflow-x-auto">
        <div className="min-w-[780px] flex items-center justify-between relative py-4">
          {/* Animated SVG Connector Rail Behind Nodes */}
          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-slate-800 z-0 rounded-full overflow-hidden">
            {/* Moving glowing particle packet */}
            {isPulseActive && (
              <div className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-packetFlow" />
            )}
            {/* Broken segment at right side */}
            <div className="absolute right-[20%] w-[18%] top-0 bottom-0 bg-gradient-to-r from-rose-500/80 to-rose-600 animate-pulse" />
          </div>

          {/* Node Cards */}
          {nodes.map((node, index) => {
            const isSelected = selectedNodeId === node.id;
            const Icon = node.icon;
            const isBreak = node.status === 'break';
            const isWarning = node.status === 'warning';

            return (
              <div key={node.id} className="relative z-10 flex flex-col items-center">
                <button
                  onClick={() => handleNodeClick(node.id)}
                  className={`w-44 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? isBreak
                        ? 'bg-rose-950/50 border-rose-500 shadow-lg shadow-rose-950/80 ring-2 ring-rose-500/50 scale-105'
                        : 'bg-blue-950/50 border-blue-500 shadow-lg shadow-blue-950/80 ring-2 ring-blue-500/50 scale-105'
                      : isBreak
                      ? 'bg-[#150F18] border-rose-500/60 hover:border-rose-400 hover:scale-102'
                      : isWarning
                      ? 'bg-[#18150F] border-amber-500/50 hover:border-amber-400 hover:scale-102'
                      : 'bg-[#0E1420] border-[#1E293B] hover:border-slate-500 hover:scale-102'
                  }`}
                >
                  {/* Node Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-1.5 rounded-lg ${
                      isBreak 
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isBreak ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                        BREAK
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        VERIFIED
                      </span>
                    )}
                  </div>

                  {/* Title & Entity */}
                  <div className="font-semibold text-xs text-white truncate mb-0.5">
                    {node.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mb-2">
                    {node.entity}
                  </div>

                  {/* Amount / Status */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400 truncate max-w-[70px]">
                      {node.ref}
                    </span>
                    <span className={`font-mono text-xs font-bold ${
                      isBreak ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-slate-100'
                    }`}>
                      {node.amount}
                    </span>
                  </div>
                </button>

                {/* Node sequence number pill */}
                <div className="mt-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#162033] text-slate-400 border border-slate-700">
                  Node 0{index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Inspector Drawer */}
      <div className="px-4 py-3 bg-[#0A0E17] border-t border-[#162033] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <Code2 className="w-4 h-4 text-blue-400" />
          <div>
            <span className="text-slate-400 font-mono text-[11px] uppercase mr-2">Inspecting:</span>
            <strong className="text-white font-mono">{selectedNodeId}</strong>
            {selectedNodeId === 'node-webhook' && (
              <span className="ml-2 text-rose-400 text-xs font-mono">
                [HTTP 504 Gateway Timeout: Response exceeded 30000ms threshold]
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const samplePayload = {
                caseId: 'INV-1042',
                node: selectedNodeId,
                utr: 'HDFCR5202609040019284',
                settlementAmount: 48000.0,
                status: selectedNodeId === 'node-webhook' ? 504 : 200,
                timestamp: '2026-09-04T04:14:22.000Z'
              };
              navigator.clipboard.writeText(JSON.stringify(samplePayload, null, 2));
              showToast('Raw Payload Copied', 'Copied node telemetry JSON to clipboard.', 'info');
            }}
            className="px-2.5 py-1 rounded bg-[#162033] hover:bg-[#1E293B] text-slate-300 hover:text-white border border-[#1E293B] flex items-center gap-1 transition-colors text-[11px] font-mono"
          >
            <Copy className="w-3 h-3" />
            Copy Node Telemetry JSON
          </button>
        </div>
      </div>
    </div>
  );
};
