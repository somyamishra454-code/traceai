import { useState, useRef, useEffect } from 'react';
import { useFinancialData } from '../../data/financialContext';
import {
  Bot,
  Sparkles,
  Send,
  X,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ArrowRight,
  RotateCw,
  Mail,
  Scale
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  text: string;
  thinkingSteps?: string[];
  citations?: { label: string; ref: string; type: string }[];
  actionButtons?: { label: string; action: () => void; icon?: any; variant?: 'primary' | 'secondary' | 'danger' }[];
}

export const ForensicAgentCopilot = () => {
  const { 
    activeCase, 
    approveResolution, 
    retriggerWebhook, 
    openEmailModal, 
    showToast 
  } = useFinancialData();

  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedThinkingId, setExpandedThinkingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-init-1',
      sender: 'agent',
      timestamp: 'Just now',
      text: `Hello, I am **TraceAI Forensic Copilot** (powered by FinBERT-Forensic-v4). I have loaded Case #${activeCase.id} (**${activeCase.title}**). 

I've cross-verified 12,487 transaction ledger lines across Razorpay Route, HDFC CBS statement, and Zoho Books ERP. How can I assist with this investigation?`,
      thinkingSteps: [
        'Ingested Razorpay payout batch #setl_RZP_48000_902 (₹48,000.00)',
        'Extracted HDFC Bank Host-to-Host MT940 feed UTR #HDFCR5202609040019284',
        'Scanned Zoho Books General Ledger Chart of Accounts #1150 (Clearing A/c)',
        'Synthesized root cause model: HTTP 504 Webhook Timeout during batch sync.'
      ],
      citations: [
        { label: 'Bank Credit', ref: 'UTR #HDFCR5202609040019284', type: 'bank' },
        { label: 'Settlement Batch', ref: 'setl_RZP_48000_902', type: 'gateway' },
        { label: 'Clearing Account', ref: 'Zoho Books #1150', type: 'erp' }
      ]
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'Where did the ₹48,000 go?',
    'Explain the HTTP 504 webhook break',
    'Draft CFO briefing memo with audit proof',
    'Simulate balancing journal vs webhook retry'
  ];

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let responseText = '';
      let thinking: string[] = [];
      let citations: { label: string; ref: string; type: string }[] = [];
      let actions: { label: string; action: () => void; icon?: any; variant?: 'primary' | 'secondary' }[] = [];

      const lower = textToSend.toLowerCase();

      if (lower.includes('where did the') || lower.includes('money go') || lower.includes('48,000') || lower.includes('variance')) {
        responseText = `### 🔍 Forensic Capital Tracing: Case #${activeCase.id}

The **₹48,000.00** gross settlement funds moved through the following custody chain:

1. **Captured by Gateway**: Razorpay aggregated 14 customer payments into batch \`#setl_RZP_48000_902\` with 0% MDR fee variance.
2. **Deposited into Bank**: HDFC Bank Current A/c •••• 8890 received the full **₹48,000.00** under UTR \`#HDFCR5202609040019284\` at 03:45:18 UTC.
3. **Broken at ERP Sync**: The ERP webhook connector \`/api/webhooks/razorpay/settlements\` failed with **HTTP 504 Gateway Timeout**.

**Conclusion**: The money is safely resting in your HDFC corporate bank account, but is missing from Zoho Books ERP clearing ledger.`;

        thinking = [
          'Evaluated bank credit feed MT940: Confirmed ₹48,000.00 in HDFC A/c 8890',
          'Checked Razorpay settlement batch: Status PROCESSED, ₹0 fee delta',
          'Identified zero ledger balance in Zoho Books ERP Account #1150',
          'Determined capital is not missing externally; internal ledger desynchronization isolated.'
        ];

        citations = [
          { label: 'HDFC Statement', ref: 'UTR #HDFCR5202609040019284', type: 'bank' },
          { label: 'Settlement Batch', ref: 'setl_RZP_48000_902', type: 'gateway' }
        ];

        actions = [
          {
            label: 'Post Balancing Journal Entry',
            action: () => {
              approveResolution(activeCase.id, 'Executed via AI Copilot');
              showToast('Journal Posted', 'Balanced ₹48k via Journal Entry #JE-2026-904', 'success');
            },
            icon: Scale,
            variant: 'primary'
          },
          {
            label: 'Email Audit Briefing',
            action: () => openEmailModal(activeCase),
            icon: Mail,
            variant: 'secondary'
          }
        ];
      } else if (lower.includes('webhook') || lower.includes('504') || lower.includes('root cause')) {
        responseText = `### ⚙️ Root Cause Analysis: Webhook Infrastructure Failure

- **Endpoint**: \`https://api.merchant.com/v2/webhooks/razorpay/settlements\`
- **HTTP Code**: \`504 Gateway Timeout\`
- **Retry Count**: 3 attempts (04:00:00, 04:00:30, 04:01:14 UTC)
- **Response Latency**: > 30,000ms threshold from ERP Connector microservice.

**Root Cause**: During the daily 04:00 AM batch sync, the Zoho Books API connector experienced transient thread saturation, causing Razorpay's webhook delivery to time out. The payload \`wh_evt_9918237418\` is intact and ready for idempotent replay.`;

        thinking = [
          'Queried gateway webhook logs for event settlement.processed',
          'Isolated timeout after 30s response ceiling on Zoho ERP connector',
          'Verified payload SHA-256 signature validity: Cryptographically authentic',
          'Confirmed idempotent replay is safe with zero risk of duplicate posting.'
        ];

        citations = [
          { label: 'Webhook Payload', ref: 'wh_evt_9918237418', type: 'api' },
          { label: 'Error Telemetry', ref: 'HTTP 504 Timeout', type: 'error' }
        ];

        actions = [
          {
            label: 'Replay Idempotent Webhook',
            action: async () => {
              await retriggerWebhook(activeCase.id);
            },
            icon: RotateCw,
            variant: 'primary'
          }
        ];
      } else if (lower.includes('cfo') || lower.includes('memo') || lower.includes('draft') || lower.includes('board')) {
        responseText = `### 📋 Executive Memorandum Draft

**TO**: Chief Financial Officer & Board Audit Committee  
**FROM**: Autonomous Reconciliation Engine (TraceAI)  
**DATE**: September 4, 2026  
**SUBJECT**: Settlement Discrepancy Clearance & Audit Sign-Off (#INV-1042)

**Executive Summary**:
A ₹48,000 settlement variance between Razorpay Route and Zoho Books General Ledger was autonomously detected at 04:14 UTC. Forensic investigation verified that all funds were credited to HDFC Bank A/c 8890 under UTR #HDFCR5202609040019284. The variance was caused by an HTTP 504 webhook timeout during automated nightly batch ingestion.

**Corrective Action**:
Journal Entry #JE-2026-904 balanced the ledger (DR HDFC Bank / CR Gateway Clearing). The incident has zero tax or cash impact.`;

        thinking = [
          'Aggregated audit timeline data from 03:30 AM to 04:14 AM',
          'Formatted GAAP/IFRS compliant financial memorandum',
          'Calculated zero net balance discrepancy.'
        ];

        actions = [
          {
            label: 'Email Memo to CFO & Board',
            action: () => openEmailModal(activeCase),
            icon: Mail,
            variant: 'primary'
          }
        ];
      } else {
        responseText = `### 🤖 Forensic Intelligence Report

I have analyzed your query regarding **Case #${activeCase.id}**. 

**Current Case Telemetry**:
- **Discrepancy Amount**: ₹${activeCase.amount.toLocaleString('en-IN')}.00 (${activeCase.currency})
- **Gateway**: ${activeCase.gateway}
- **Target Bank**: ${activeCase.bankAccount}
- **Accounting ERP**: ${activeCase.accountingSystem}
- **Autonomous Confidence**: ${activeCase.confidence}%
- **Current Status**: ${activeCase.state.toUpperCase().replace('_', ' ')}

Would you like to post the balancing journal entry, inspect the raw MT940 telemetry, or email the executive audit report?`;

        thinking = [
          'Evaluated general query parameters against active financial context',
          'Checked status: ' + activeCase.state
        ];

        actions = [
          {
            label: 'Open Resolution Center',
            action: () => approveResolution(activeCase.id, 'Actioned from Copilot'),
            icon: Scale,
            variant: 'primary'
          }
        ];
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: responseText,
        thinkingSteps: thinking,
        citations,
        actionButtons: actions
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1100);
  };

  return (
    <>
      {/* Floating Toggle Pill (Above mobile bottom bar, bottom-right on desktop) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 z-40 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-medium text-xs shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-blue-400/40 group cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="font-semibold tracking-wide text-[11px] sm:text-xs">AI Copilot</span>
          <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-white font-bold">
            94%
          </span>
        </button>
      )}

      {/* Slide-over Copilot Drawer (Full-width mobile bottom sheet, compact modal on desktop) */}
      {isOpen && (
        <div className="fixed bottom-16 sm:bottom-6 inset-x-2 sm:inset-x-auto sm:right-6 z-50 sm:w-full sm:max-w-lg h-[calc(100vh-130px)] sm:h-[640px] max-h-[640px] bg-[#0A0E18] border border-[#1E2D48] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="px-4 py-3 bg-[#0E1524] border-b border-[#1A263D] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white tracking-wide">
                    TraceAI Forensic Copilot
                  </h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    FinBERT-v4
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Case #{activeCase.id} • Autonomous Financial Reasoning
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setMessages(initialMessages);
                  showToast('Conversation Reset', 'Cleared Copilot chat history.', 'info');
                }}
                className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#162033] transition-colors"
                title="Reset Chat"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#162033] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#090D14]/90 text-xs">
            {messages.map((msg) => {
              const isAgent = msg.sender === 'agent';
              const isThinkingOpen = expandedThinkingId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-mono text-slate-500">
                      {isAgent ? 'TraceAI Agent' : 'You'} • {msg.timestamp}
                    </span>
                  </div>

                  <div
                    className={`max-w-[92%] p-3.5 rounded-xl text-xs leading-relaxed space-y-2.5 ${
                      isAgent
                        ? 'bg-[#0E1524] border border-[#1A263D] text-slate-200'
                        : 'bg-blue-600 text-white rounded-br-none shadow-md'
                    }`}
                  >
                    {/* Collapsible Thinking Steps */}
                    {isAgent && msg.thinkingSteps && msg.thinkingSteps.length > 0 && (
                      <div className="rounded-lg bg-[#070A10] border border-[#162033] overflow-hidden">
                        <button
                          onClick={() => setExpandedThinkingId(isThinkingOpen ? null : msg.id)}
                          className="w-full px-2.5 py-1.5 flex items-center justify-between text-[10px] font-mono text-slate-400 hover:text-slate-200 bg-[#0B0F18] border-b border-[#162033] transition-colors"
                        >
                          <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                            <Sparkles className="w-3 h-3" />
                            Agent Chain of Thought ({msg.thinkingSteps.length} steps)
                          </span>
                          {isThinkingOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        {isThinkingOpen && (
                          <div className="p-2 space-y-1 font-mono text-[10px] text-slate-400">
                            {msg.thinkingSteps.map((step, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <span className="text-blue-500 flex-shrink-0">›</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Markdown Text Body */}
                    <div className="space-y-1.5 whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* Cryptographic Evidence Citations */}
                    {isAgent && msg.citations && msg.citations.length > 0 && (
                      <div className="pt-2 border-t border-[#162033] flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] uppercase font-mono text-slate-500">Citations:</span>
                        {msg.citations.map((c, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#152033] text-blue-300 border border-blue-500/20 flex items-center gap-1"
                          >
                            <ShieldCheck className="w-2.5 h-2.5 text-blue-400" />
                            {c.ref}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    {isAgent && msg.actionButtons && msg.actionButtons.length > 0 && (
                      <div className="pt-2 border-t border-[#162033] flex items-center gap-2 flex-wrap">
                        {msg.actionButtons.map((btn, i) => {
                          const BtnIcon = btn.icon || ArrowRight;
                          return (
                            <button
                              key={i}
                              onClick={btn.action}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                                btn.variant === 'primary'
                                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                  : 'bg-[#162033] hover:bg-[#1E293B] text-slate-200 border border-slate-700'
                              }`}
                            >
                              <BtnIcon className="w-3 h-3" />
                              <span>{btn.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 bg-[#0E1524] border border-[#1A263D] p-3 rounded-xl max-w-[80%] animate-pulse">
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>FinBERT analyzing ledger telemetry & webhook traces...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-[#0C121E] border-t border-[#162033] flex items-center gap-1.5 overflow-x-auto">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isTyping}
                className="text-[11px] font-medium text-slate-300 hover:text-white px-2.5 py-1 rounded-full bg-[#152033] hover:bg-[#1E2D48] border border-[#1E2D48] whitespace-nowrap transition-all flex-shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#0A0E18] border-t border-[#162033]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask TraceAI (e.g., 'Why did the webhook fail?', 'Simulate balance')..."
                className="flex-1 px-3.5 py-2 bg-[#0E1524] border border-[#1E2D48] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ForensicAgentCopilot;
