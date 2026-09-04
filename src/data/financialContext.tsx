import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type CaseSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type CaseState = 'detected' | 'investigating' | 'evidence_found' | 'root_cause_identified' | 'resolution_ready' | 'resolved';

export interface InvestigationStage {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  summary: string;
  timestamp?: string;
  durationMs?: number;
  details: string[];
}

export interface ChainNode {
  id: string;
  type: 'payment' | 'order' | 'settlement' | 'bank' | 'accounting';
  title: string;
  entity: string;
  referenceId: string;
  expectedAmount: number;
  actualAmount: number;
  status: 'ok' | 'break' | 'warning';
  timestamp: string;
  metadata: Record<string, string | number | boolean>;
  rawPayload?: Record<string, any>;
}

export interface JournalLine {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
}

export interface JournalEntry {
  entryNumber: string;
  date: string;
  reference: string;
  currency: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  status: 'draft' | 'approved' | 'posted';
}

export interface EmailDispatchPayload {
  caseId: string;
  recipient: string;
  recipientType: 'cfo' | 'ops' | 'gateway' | 'bank' | 'auditor';
  subject: string;
  notes?: string;
  attachEvidence: boolean;
  attachJournal: boolean;
}

export interface LiveTransactionEvent {
  id: string;
  timestamp: string;
  gateway: string;
  type: 'payment' | 'settlement' | 'cbs_credit' | 'erp_sync' | 'discrepancy';
  referenceId: string;
  amount: number;
  status: 'matched' | 'processing' | 'failed' | 'flagged';
  description: string;
}

export interface TimeTravelSnapshot {
  stepIndex: number;
  timestamp: string;
  title: string;
  description: string;
  gatewayState: string;
  bankState: string;
  accountingState: string;
  highlightNodeId: string;
  isBreakActive: boolean;
}

export interface FinancialCase {
  id: string;
  title: string;
  shortSummary: string;
  amount: number;
  currency: string;
  severity: CaseSeverity;
  category: string;
  gateway: string;
  bankAccount: string;
  accountingSystem: string;
  detectedAt: string;
  state: CaseState;
  currentStageIndex: number;
  confidence: number;
  rootCause: string;
  breakLocation: string;
  recommendedAction: string;
  resolutionType: string;
  stages: InvestigationStage[];
  chainNodes: ChainNode[];
  journalEntry: JournalEntry;
  webhookDetails: {
    endpoint: string;
    attempts: number;
    lastHttpCode: number;
    lastError: string;
    payloadId: string;
    retryEligible: boolean;
  };
  auditLogs: {
    id: string;
    timestamp: string;
    author: string;
    action: string;
    notes: string;
  }[];
  resolutionNotes?: string;
  resolvedAt?: string;
}

export interface PipelineStats {
  transactionsAnalyzed: number;
  transactionsMatched: number;
  unmatchedSettlements: number;
  totalInflowVolume: number;
  totalAtRiskAmount: number;
  reconciliationRate: number;
  lastSyncTimestamp: string;
  tpsCurrent: number;
}

export interface ToastInfo {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface FinancialContextType {
  cases: FinancialCase[];
  activeCase: FinancialCase;
  activeCaseId: string;
  stats: PipelineStats;
  isInvestigatingLive: boolean;
  investigationLog: string[];
  toasts: ToastInfo[];
  emailModalCase: FinancialCase | null;
  autoEmailOnCritical: boolean;
  liveEvents: LiveTransactionEvent[];
  isStreamActive: boolean;
  investigationSpeed: 1 | 2 | 10;
  timeTravelStep: number;
  timeTravelSnapshots: TimeTravelSnapshot[];
  setActiveCaseId: (id: string) => void;
  runInvestigation: (caseId?: string) => Promise<void>;
  approveResolution: (caseId: string, notes?: string) => void;
  markResolved: (caseId: string) => void;
  retriggerWebhook: (caseId: string) => Promise<boolean>;
  resetDemoCase: () => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  openEmailModal: (financialCase?: FinancialCase) => void;
  closeEmailModal: () => void;
  sendEvidenceEmail: (payload: EmailDispatchPayload) => Promise<boolean>;
  setAutoEmailOnCritical: (val: boolean) => void;
  toggleStream: () => void;
  setInvestigationSpeed: (speed: 1 | 2 | 10) => void;
  setTimeTravelStep: React.Dispatch<React.SetStateAction<number>>;
  simulateLiveIngestionSpike: () => void;
}

const INITIAL_PRIMARY_CASE: FinancialCase = {
  id: 'INV-1042',
  title: '₹48,000 Settlement Mismatch',
  shortSummary: 'Razorpay daily batch settlement deposited in HDFC Bank but missing in Zoho Books general ledger due to webhook timeout.',
  amount: 48000,
  currency: 'INR',
  severity: 'CRITICAL',
  category: 'Missing Accounting Sync',
  gateway: 'Razorpay Route',
  bankAccount: 'HDFC Bank Current A/c •••• 8890',
  accountingSystem: 'Zoho Books Enterprise',
  detectedAt: '2026-09-04 04:14:22 UTC',
  state: 'detected',
  currentStageIndex: 0,
  confidence: 94,
  breakLocation: 'Between HDFC Bank Deposit and Zoho Books ERP Posting',
  rootCause: 'Webhook endpoint /api/webhooks/razorpay/settlements timed out after 3 retries (HTTP 504 Gateway Timeout during automated 04:00 AM batch sync). Funds settled in HDFC Bank ledger under UTR #HDFCR5202609040019284 but remained unrecorded in Zoho Books Clearing Account.',
  recommendedAction: 'Post Balancing Journal Entry #JE-2026-904 to debit HDFC Bank (1020) and credit Gateway Clearing (1150), then re-trigger webhook to update ERP settlement status to reconciled.',
  resolutionType: 'Automated Ledger Balancing & Webhook Replay',
  webhookDetails: {
    endpoint: 'https://api.merchant.com/v2/webhooks/razorpay/settlements',
    attempts: 3,
    lastHttpCode: 504,
    lastError: 'Gateway Timeout (Response time > 30000ms from Zoho ERP Connector)',
    payloadId: 'wh_evt_9918237418',
    retryEligible: true
  },
  stages: [
    {
      id: 'stage-1',
      name: 'Detect',
      status: 'completed',
      summary: 'Settlement anomaly detected in automated 04:00 AM reconciliation run',
      timestamp: '04:14:22 UTC',
      durationMs: 420,
      details: [
        'Scanned 12,487 transaction ledger lines across Razorpay, Stripe, and HDFC Host-to-Host feeds',
        'Flagged variance: Settlement setl_RZP_48000_902 (₹48,000.00) unmapped in Zoho Books General Ledger'
      ]
    },
    {
      id: 'stage-2',
      name: 'Collect',
      status: 'pending',
      summary: 'Ingest raw telemetry, bank MT940 statement, and webhook event payloads',
      details: [
        'Fetched Razorpay Settlement Report payload #setl_RZP_48000_902',
        'Retrieved HDFC Bank Host-to-Host CBS statement UTR #HDFCR5202609040019284',
        'Queried Zoho Books Chart of Accounts #1150 (Clearing) and #1020 (Bank)',
        'Extracted gateway webhook dispatch logs for event settlement.processed'
      ]
    },
    {
      id: 'stage-3',
      name: 'Correlate',
      status: 'pending',
      summary: 'Cross-reference transaction IDs, UTR references, timestamps, and fees',
      details: [
        'Confirmed exact match on ₹48,000.00 amount between Razorpay gross settlement and HDFC credit',
        'Validated 14 customer payments aggregated within batch #batch_90112 (all status: captured)',
        'Zero fee variance detected (Promotional 0% MDR applied on merchant tier)'
      ]
    },
    {
      id: 'stage-4',
      name: 'Investigate',
      status: 'pending',
      summary: 'Trace failure point across payment gateway, bank pipe, and ERP API',
      details: [
        'Isolated break: Webhook failed with HTTP 504 Gateway Timeout on 3rd retry at 04:01:14 UTC',
        'Confirmed HDFC Bank statement already reflects cleared funds in account •••• 8890',
        'Verified absence of duplicate journal entries in Zoho Books for UTR #HDFCR5202609040019284'
      ]
    },
    {
      id: 'stage-5',
      name: 'Explain',
      status: 'pending',
      summary: 'Generate deterministic forensic explanation and calculate risk exposure',
      details: [
        'Risk Category: Understated cash asset on balance sheet & overstated accounts receivable',
        'Root Cause: Infrastructure timeout prevented automated journal creation upon settlement event',
        'Confidence Score calculated at 94% based on exact UTR match and verifiable bank credit'
      ]
    },
    {
      id: 'stage-6',
      name: 'Resolve',
      status: 'pending',
      summary: 'Formulate balancing double-entry journal diff and ERP sync replay',
      details: [
        'Constructed draft Journal Entry #JE-2026-904 with perfect debit/credit balance (₹48,000.00)',
        'Prepared idempotent ERP webhook replay payload to prevent duplicate posting risk',
        'Queued for finance controller authorization'
      ]
    }
  ],
  chainNodes: [
    {
      id: 'node-1',
      type: 'payment',
      title: 'Customer Payments',
      entity: 'Razorpay Gateway',
      referenceId: 'batch_90112 (14 txns)',
      expectedAmount: 48000,
      actualAmount: 48000,
      status: 'ok',
      timestamp: '2026-09-03 23:45:00 UTC',
      metadata: {
        'Transactions Aggregated': 14,
        'Gateway Status': 'Captured',
        'Gross Amount': '₹48,000.00',
        'Currency': 'INR',
        'Primary Txn ID': 'pay_Nx89K294101'
      },
      rawPayload: {
        batch_id: 'batch_90112',
        item_count: 14,
        currency: 'INR',
        gross_amount_cents: 4800000,
        status: 'processed'
      }
    },
    {
      id: 'node-2',
      type: 'order',
      title: 'Merchant Orders',
      entity: 'Commerce Platform',
      referenceId: 'ord_992104881',
      expectedAmount: 48000,
      actualAmount: 48000,
      status: 'ok',
      timestamp: '2026-09-03 23:50:12 UTC',
      metadata: {
        'Order Fulfillment': 'Fulfilled',
        'Invoice Generated': 'INV-2026-8819',
        'Customer Risk Score': '0.02 (Low)',
        'Tax (GST 18%)': '₹7,322.03'
      },
      rawPayload: {
        order_ref: 'ord_992104881',
        fulfillment_status: 'fulfilled',
        tax_lines: [{ rate: 0.18, code: 'IGST' }]
      }
    },
    {
      id: 'node-3',
      type: 'settlement',
      title: 'Gateway Settlement Batch',
      entity: 'Razorpay Payouts',
      referenceId: 'setl_RZP_48000_902',
      expectedAmount: 48000,
      actualAmount: 48000,
      status: 'ok',
      timestamp: '2026-09-04 03:30:00 UTC',
      metadata: {
        'Settlement Status': 'Processed',
        'MDR Fee Deducted': '₹0.00 (Tier 1)',
        'Net Payout': '₹48,000.00',
        'Bank Route': 'HDFC_CMS_NEFT'
      },
      rawPayload: {
        id: 'setl_RZP_48000_902',
        status: 'processed',
        fees: 0,
        tax: 0,
        utr: 'HDFCR5202609040019284',
        dispatched_at: 1788502200
      }
    },
    {
      id: 'node-4',
      type: 'bank',
      title: 'HDFC Bank Account Deposit',
      entity: 'HDFC Bank Core Banking',
      referenceId: 'UTR: HDFCR5202609040019284',
      expectedAmount: 48000,
      actualAmount: 48000,
      status: 'ok',
      timestamp: '2026-09-04 03:45:18 UTC',
      metadata: {
        'Account': 'Current A/c •••• 8890',
        'Credit Status': 'CLEARED',
        'Bank Ref': 'CMS/90218844/RAZORPAY',
        'Available Balance': '₹1,42,80,450.00'
      },
      rawPayload: {
        txn_id: 'HDFC_CMS_90218844',
        cbs_posting_time: '2026-09-04T03:45:18Z',
        credit: 48000.00,
        balance: 14280450.00,
        utr: 'HDFCR5202609040019284'
      }
    },
    {
      id: 'node-5',
      type: 'accounting',
      title: 'Accounting Ledger Entry',
      entity: 'Zoho Books ERP',
      referenceId: 'UNPOSTED / MISSING',
      expectedAmount: 48000,
      actualAmount: 0,
      status: 'break',
      timestamp: '2026-09-04 04:00:00 UTC (FAILED)',
      metadata: {
        'Journal Entry': 'None Found',
        'Sync Status': 'FAILED (HTTP 504)',
        'Clearing Discrepancy': '₹48,000.00 Unbalanced',
        'Variance': '-₹48,000.00'
      },
      rawPayload: {
        error: 'WebhookDeliveryFailed',
        http_code: 504,
        attempts: 3,
        exception: 'Connection timed out after 30000ms connecting to Zoho Books API'
      }
    }
  ],
  journalEntry: {
    entryNumber: 'JE-2026-904',
    date: '2026-09-04',
    reference: 'SETTLEMENT-RECON-RZP-48000-902',
    currency: 'INR',
    lines: [
      {
        accountCode: '1020',
        accountName: 'HDFC Bank Current A/c 8890',
        debit: 48000,
        credit: 0,
        description: 'Razorpay Daily Settlement setl_RZP_48000_902 (UTR: HDFCR5202609040019284)'
      },
      {
        accountCode: '1150',
        accountName: 'Payment Gateway Clearing Account',
        debit: 0,
        credit: 48000,
        description: 'Balance settlement payout against daily captured receivables'
      }
    ],
    totalDebit: 48000,
    totalCredit: 48000,
    status: 'draft'
  },
  auditLogs: [
    {
      id: 'log-1',
      timestamp: '2026-09-04 04:14:22 UTC',
      author: 'TraceAI Autonomous Engine',
      action: 'Anomaly Detected',
      notes: 'Unmatched settlement identified during daily scheduled reconciliation cycle #901.'
    },
    {
      id: 'log-2',
      timestamp: '2026-09-04 04:14:23 UTC',
      author: 'TraceAI Data Pipeline',
      action: 'Evidence Ingestion',
      notes: 'Pulled MT940 bank statement and verified ₹48,000 credit against Razorpay payout ID.'
    }
  ]
};

const SECONDARY_CASES: FinancialCase[] = [
  {
    id: 'INV-1043',
    title: '₹12,500 Duplicate Refund on Stripe',
    shortSummary: 'Customer refund ref_1M90k executed twice across concurrent API retry threads during payment microservice restart.',
    amount: 12500,
    currency: 'INR',
    severity: 'HIGH',
    category: 'Duplicate Refund Execution',
    gateway: 'Stripe Direct',
    bankAccount: 'ICICI Bank Current A/c •••• 4412',
    accountingSystem: 'Zoho Books Enterprise',
    detectedAt: '2026-09-04 06:22:10 UTC',
    state: 'investigating',
    currentStageIndex: 3,
    confidence: 88,
    breakLocation: 'Stripe API Gateway Idempotency Layer',
    rootCause: 'Idempotency key header was omitted on the second retry request sent by frontend checkout worker after initial socket hangup, causing Stripe to charge merchant balance twice for a single customer return.',
    recommendedAction: 'Initiate Stripe balance adjustment chargeback clawback against customer account or issue manual ledger debit on Merchant Receivables.',
    resolutionType: 'Merchant Clawback & Idempotency Patch',
    webhookDetails: {
      endpoint: 'https://api.merchant.com/v2/webhooks/stripe/refunds',
      attempts: 1,
      lastHttpCode: 200,
      lastError: 'None (Duplicate event generated via separate idempotency hash)',
      payloadId: 'evt_stripe_refund_dup_9012',
      retryEligible: false
    },
    stages: [
      { id: 's1', name: 'Detect', status: 'completed', summary: 'Duplicate refund alert triggered', timestamp: '06:22:10 UTC', details: ['Identified 2 refund events of ₹12,500 for order #ord_77189'] },
      { id: 's2', name: 'Collect', status: 'completed', summary: 'Ingested Stripe refund audit logs', timestamp: '06:22:12 UTC', details: ['Fetched ref_1M90kA and ref_1M90kB from Stripe API'] },
      { id: 's3', name: 'Correlate', status: 'completed', summary: 'Confirmed matching customer & timestamp', timestamp: '06:22:15 UTC', details: ['Both refunds tied to single customer email with 380ms delta'] },
      { id: 's4', name: 'Investigate', status: 'in_progress', summary: 'Analyzing API idempotency headers', details: ['Verifying server retry logs from checkout pod #4'] },
      { id: 's5', name: 'Explain', status: 'pending', summary: 'Formulate recovery plan', details: [] },
      { id: 's6', name: 'Resolve', status: 'pending', summary: 'Clawback or journal adjustment', details: [] }
    ],
    chainNodes: [],
    journalEntry: {
      entryNumber: 'JE-2026-905',
      date: '2026-09-04',
      reference: 'STRIPE-DUP-REFUND-1043',
      currency: 'INR',
      lines: [
        { accountCode: '1160', accountName: 'Receivables from Customer', debit: 12500, credit: 0, description: 'Duplicate refund recovery claim' },
        { accountCode: '1030', accountName: 'Stripe Settlement Escrow', debit: 0, credit: 12500, description: 'Adjust duplicate debit from Stripe payout balance' }
      ],
      totalDebit: 12500,
      totalCredit: 12500,
      status: 'draft'
    },
    auditLogs: [
      { id: 'al-1', timestamp: '2026-09-04 06:22:10 UTC', author: 'TraceAI Rule Engine', action: 'Duplicate Flag', notes: 'Detected 2x refund on same original authorization ID.' }
    ]
  },
  {
    id: 'INV-1044',
    title: '₹8,740 Unmatched Payout on Razorpay Route',
    shortSummary: 'Vendor payout pout_8819 marked as pending on gateway dashboard but already debited from bank escrow account.',
    amount: 8740,
    currency: 'INR',
    severity: 'MEDIUM',
    category: 'Escrow Payout Variance',
    gateway: 'Razorpay Route',
    bankAccount: 'Yes Bank Nodal A/c •••• 1109',
    accountingSystem: 'Zoho Books Enterprise',
    detectedAt: '2026-09-04 07:11:05 UTC',
    state: 'resolution_ready',
    currentStageIndex: 5,
    confidence: 96,
    breakLocation: 'Gateway Status Callback Sync',
    rootCause: 'Nodal bank processed IMPS debit successfully at 06:45 AM, but Razorpay Route webhook state remained in pending status due to transient callback drop.',
    recommendedAction: 'Force status sync on Razorpay Route via API query, then clear pending liability in Vendor Accounts Payable.',
    resolutionType: 'Gateway Status Re-poll & AP Clearance',
    webhookDetails: {
      endpoint: 'https://api.merchant.com/v2/webhooks/razorpay/payouts',
      attempts: 2,
      lastHttpCode: 200,
      lastError: 'Callback payload delayed by 180 minutes',
      payloadId: 'pout_evt_990118',
      retryEligible: true
    },
    stages: [
      { id: 's1', name: 'Detect', status: 'completed', summary: 'Payout status mismatch identified', timestamp: '07:11:05 UTC', details: ['Bank debited ₹8,740 while gateway status remained PENDING'] },
      { id: 's2', name: 'Collect', status: 'completed', summary: 'Fetched Yes Bank Nodal statement', timestamp: '07:11:08 UTC', details: ['IMPS RRN #6289110488 confirmed settled'] },
      { id: 's3', name: 'Correlate', status: 'completed', summary: 'Matched Vendor ID #VEND-401', timestamp: '07:11:10 UTC', details: ['Confirmed invoice #INV-9021 balance cleared'] },
      { id: 's4', name: 'Investigate', status: 'completed', summary: 'Isolated webhook callback drop', timestamp: '07:11:14 UTC', details: ['Gateway API confirms payout was indeed SUCCESSFUL'] },
      { id: 's5', name: 'Explain', status: 'completed', summary: 'Zero financial loss, UI state lag only', timestamp: '07:11:18 UTC', details: ['Requires manual or automated state refresh'] },
      { id: 's6', name: 'Resolve', status: 'completed', summary: 'Resolution ready for execution', timestamp: '07:11:20 UTC', details: ['Auto-clear vendor liability journal created'] }
    ],
    chainNodes: [],
    journalEntry: {
      entryNumber: 'JE-2026-906',
      date: '2026-09-04',
      reference: 'RZP-ROUTE-PAYOUT-8740',
      currency: 'INR',
      lines: [
        { accountCode: '2010', accountName: 'Accounts Payable - Vendors', debit: 8740, credit: 0, description: 'Clear vendor invoice #INV-9021' },
        { accountCode: '1040', accountName: 'Yes Bank Nodal Escrow A/c', debit: 0, credit: 8740, description: 'Record settled IMPS payout' }
      ],
      totalDebit: 8740,
      totalCredit: 8740,
      status: 'draft'
    },
    auditLogs: [
      { id: 'al-2', timestamp: '2026-09-04 07:11:05 UTC', author: 'TraceAI Engine', action: 'Case Opened', notes: 'Escrow variance detected.' }
    ]
  },
  {
    id: 'INV-1045',
    title: '₹24,300 Rolling Reserve Hold Variance',
    shortSummary: 'Payment gateway withheld 7.5% reserve deduction instead of contractually agreed 5.0% on monthly settlement batch.',
    amount: 24300,
    currency: 'INR',
    severity: 'MEDIUM',
    category: 'Reserve Fee Miscalculation',
    gateway: 'ICICI PayDirect',
    bankAccount: 'ICICI Bank Current A/c •••• 4412',
    accountingSystem: 'Zoho Books Enterprise',
    detectedAt: '2026-09-04 08:00:15 UTC',
    state: 'detected',
    currentStageIndex: 0,
    confidence: 91,
    breakLocation: 'Gateway Settlement Fee Deduction Calculation',
    rootCause: 'Merchant agreement amendment v3.2 specified 5.0% rolling reserve effective Sept 1, but gateway settlement billing profile still applied deprecated 7.5% tier.',
    recommendedAction: 'Generate contractual discrepancy dispute letter with attached agreement PDF and trigger automated dispute ticket via ICICI Merchant Desk.',
    resolutionType: 'Automated Merchant Dispute Ticket',
    webhookDetails: {
      endpoint: 'https://api.merchant.com/v2/webhooks/icici/settlements',
      attempts: 1,
      lastHttpCode: 200,
      lastError: 'None',
      payloadId: 'icici_st_994101',
      retryEligible: false
    },
    stages: [
      { id: 's1', name: 'Detect', status: 'completed', summary: 'Reserve variance detected', timestamp: '08:00:15 UTC', details: ['Calculated 7.5% deduction vs expected 5.0% contractual rate'] },
      { id: 's2', name: 'Collect', status: 'pending', summary: 'Ingest merchant contract terms', details: [] },
      { id: 's3', name: 'Correlate', status: 'pending', summary: 'Calculate exact excess withholding', details: [] },
      { id: 's4', name: 'Investigate', status: 'pending', summary: 'Validate billing tier configuration', details: [] },
      { id: 's5', name: 'Explain', status: 'pending', summary: 'Summarize financial impact', details: [] },
      { id: 's6', name: 'Resolve', status: 'pending', summary: 'Draft dispute claim', details: [] }
    ],
    chainNodes: [],
    journalEntry: {
      entryNumber: 'JE-2026-907',
      date: '2026-09-04',
      reference: 'ICICI-RESERVE-DISPUTE',
      currency: 'INR',
      lines: [
        { accountCode: '1170', accountName: 'Gateway Reserve Receivable', debit: 24300, credit: 0, description: 'Excess reserve withheld by ICICI PayDirect' },
        { accountCode: '1150', accountName: 'Payment Gateway Clearing Account', debit: 0, credit: 24300, description: 'Reclassify excess fee hold' }
      ],
      totalDebit: 24300,
      totalCredit: 24300,
      status: 'draft'
    },
    auditLogs: [
      { id: 'al-3', timestamp: '2026-09-04 08:00:15 UTC', author: 'TraceAI Contract Auditor', action: 'Tier Mismatch', notes: 'Identified 2.5% reserve rate discrepancy.' }
    ]
  }
];

const INITIAL_TIME_TRAVEL_SNAPSHOTS: TimeTravelSnapshot[] = [
  {
    stepIndex: 0,
    timestamp: '03:30:00 UTC',
    title: 'Payout Dispatched by Razorpay',
    description: 'Razorpay settlement batch setl_RZP_48k (₹48,000.00) aggregated 14 customer payments and scheduled NEFT transfer.',
    gatewayState: 'SETTLED (Dispatched)',
    bankState: 'PENDING_INWARD',
    accountingState: 'AWAITING_WEBHOOK',
    highlightNodeId: 'node-3',
    isBreakActive: false
  },
  {
    stepIndex: 1,
    timestamp: '03:45:18 UTC',
    title: 'Funds Credited to HDFC Bank CBS',
    description: 'HDFC Host-to-Host CBS posted cleared credit under UTR #HDFCR5202609040019284. Bank ledger confirmed ₹48,000.00 available.',
    gatewayState: 'COMPLETED',
    bankState: 'CLEARED_CREDIT',
    accountingState: 'AWAITING_WEBHOOK',
    highlightNodeId: 'node-4',
    isBreakActive: false
  },
  {
    stepIndex: 2,
    timestamp: '04:01:14 UTC',
    title: 'Webhook HTTP 504 Timeout (THE BREAK)',
    description: 'Razorpay webhook callback to Zoho Books timed out after 3 retries (30,000ms limit). General ledger entry creation failed.',
    gatewayState: 'WEBHOOK_FAILED (HTTP 504)',
    bankState: 'CLEARED_CREDIT',
    accountingState: 'MISSING / UNPOSTED',
    highlightNodeId: 'node-5',
    isBreakActive: true
  },
  {
    stepIndex: 3,
    timestamp: '04:14:22 UTC',
    title: 'Autonomous Anomaly Isolation by TraceAI',
    description: 'TraceAI scheduled recon engine correlated CBS MT940 statement against Zoho COA, flagged ₹48,000 gap, and isolated HTTP 504 root cause.',
    gatewayState: 'VERIFIED',
    bankState: 'VERIFIED',
    accountingState: 'DISCREPANCY_FLAGGED',
    highlightNodeId: 'node-5',
    isBreakActive: true
  },
  {
    stepIndex: 4,
    timestamp: '04:14:29 UTC',
    title: 'Balancing Journal Entry & Resolution',
    description: 'Draft Journal Entry #JE-2026-904 generated and webhook replay validated. Ledger parity restored.',
    gatewayState: 'RECONCILED',
    bankState: 'RECONCILED',
    accountingState: 'BALANCED (JE-2026-904)',
    highlightNodeId: 'node-5',
    isBreakActive: false
  }
];

const INITIAL_LIVE_EVENTS: LiveTransactionEvent[] = [
  { id: 'evt-1', timestamp: 'Just now', gateway: 'Razorpay Route', type: 'payment', referenceId: 'pay_Nx99A104', amount: 4850, status: 'matched', description: 'Customer checkout #ord_9941 matched to ledger' },
  { id: 'evt-2', timestamp: '2s ago', gateway: 'HDFC Host-to-Host', type: 'cbs_credit', referenceId: 'UTR: HDFCR5202609040089', amount: 142000, status: 'matched', description: 'Batch payout credit confirmed in CBS A/c 8890' },
  { id: 'evt-3', timestamp: '5s ago', gateway: 'Stripe Direct', type: 'payment', referenceId: 'ch_3M90A81K', amount: 12400, status: 'matched', description: 'Captured USD conversion at 84.12 INR rate' },
  { id: 'evt-4', timestamp: '8s ago', gateway: 'Zoho Books ERP', type: 'erp_sync', referenceId: 'JE-2026-902', amount: 38200, status: 'matched', description: 'Automated settlement clearing posted' },
  { id: 'evt-5', timestamp: '12s ago', gateway: 'Razorpay Route', type: 'settlement', referenceId: 'setl_RZP_48000_902', amount: 48000, status: 'flagged', description: 'Missing general ledger entry in Zoho Books (#INV-1042)' }
];

const INITIAL_STATS: PipelineStats = {
  transactionsAnalyzed: 12487,
  transactionsMatched: 11932,
  unmatchedSettlements: 3,
  totalInflowVolume: 14280450,
  totalAtRiskAmount: 69240,
  reconciliationRate: 99.78,
  lastSyncTimestamp: '2 mins ago',
  tpsCurrent: 48.2
};

const FinancialDataContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialDataProvider = ({ children }: { children: ReactNode }) => {
  const [cases, setCases] = useState<FinancialCase[]>([INITIAL_PRIMARY_CASE, ...SECONDARY_CASES]);
  const [activeCaseId, setActiveCaseId] = useState<string>('INV-1042');
  const [stats, setStats] = useState<PipelineStats>(INITIAL_STATS);
  const [isInvestigatingLive, setIsInvestigatingLive] = useState<boolean>(false);
  const [investigationLog, setInvestigationLog] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [emailModalCase, setEmailModalCase] = useState<FinancialCase | null>(null);
  const [autoEmailOnCritical, setAutoEmailOnCritical] = useState<boolean>(true);
  
  // Real-time dynamic states
  const [liveEvents, setLiveEvents] = useState<LiveTransactionEvent[]>(INITIAL_LIVE_EVENTS);
  const [isStreamActive, setIsStreamActive] = useState<boolean>(true);
  const [investigationSpeed, setInvestigationSpeed] = useState<1 | 2 | 10>(1);
  const [timeTravelStep, setTimeTravelStep] = useState<number>(2); // Default to break step
  const [timeTravelSnapshots] = useState<TimeTravelSnapshot[]>(INITIAL_TIME_TRAVEL_SNAPSHOTS);

  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0];

  // Dynamic live ticker stream simulation
  useEffect(() => {
    if (!isStreamActive) return;

    const interval = setInterval(() => {
      const randomAmounts = [1250, 4800, 18900, 3400, 6200, 89000, 14500, 2200];
      const randomGateways = ['Razorpay Route', 'HDFC Bank CBS', 'Stripe Direct', 'ICICI PayDirect'];
      const randomTypes: ('payment' | 'settlement' | 'cbs_credit' | 'erp_sync')[] = ['payment', 'cbs_credit', 'erp_sync', 'payment'];
      
      const randAmt = randomAmounts[Math.floor(Math.random() * randomAmounts.length)];
      const randGw = randomGateways[Math.floor(Math.random() * randomGateways.length)];
      const randType = randomTypes[Math.floor(Math.random() * randomTypes.length)];
      const randRef = `tx_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const newEvent: LiveTransactionEvent = {
        id: `evt-${Date.now()}`,
        timestamp: 'Just now',
        gateway: randGw,
        type: randType,
        referenceId: randRef,
        amount: randAmt,
        status: 'matched',
        description: `Automated 2-way match validated against CBS statement feed.`
      };

      setLiveEvents(prev => [newEvent, ...prev.slice(0, 14)]);
      setStats(prev => ({
        ...prev,
        transactionsAnalyzed: prev.transactionsAnalyzed + 1,
        transactionsMatched: prev.transactionsMatched + 1,
        totalInflowVolume: prev.totalInflowVolume + randAmt,
        tpsCurrent: Number((42 + Math.random() * 12).toFixed(1))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isStreamActive]);

  const toggleStream = () => {
    setIsStreamActive(prev => !prev);
    showToast(
      isStreamActive ? 'Live Stream Paused' : 'Live Stream Resumed',
      isStreamActive ? 'Paused simulated incoming transaction stream.' : 'Streaming incoming telemetry at 48 txns/sec.',
      'info'
    );
  };

  const simulateLiveIngestionSpike = () => {
    setStats(prev => ({
      ...prev,
      transactionsAnalyzed: prev.transactionsAnalyzed + 250,
      transactionsMatched: prev.transactionsMatched + 250,
      totalInflowVolume: prev.totalInflowVolume + 1850000,
      tpsCurrent: 184.6
    }));

    const spikeEvent: LiveTransactionEvent = {
      id: `spike-${Date.now()}`,
      timestamp: 'Just now',
      gateway: 'Razorpay Route (Batch Ingestion)',
      type: 'settlement',
      referenceId: 'batch_SPIKE_9921',
      amount: 1850000,
      status: 'matched',
      description: 'Ingested high-velocity settlement batch (250 txns matched in 18ms).'
    };

    setLiveEvents(prev => [spikeEvent, ...prev.slice(0, 14)]);
    showToast('Ingestion Surge Ingested', 'Processed 250 transactions (₹18.5L) with zero variance in 18ms.', 'success');
  };

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const newToast: ToastInfo = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      type
    };
    setToasts(prev => [newToast, ...prev].slice(0, 4));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openEmailModal = (financialCase?: FinancialCase) => {
    setEmailModalCase(financialCase || activeCase);
  };

  const closeEmailModal = () => {
    setEmailModalCase(null);
  };

  const sendEvidenceEmail = async (payload: EmailDispatchPayload): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 600));
    
    // Add entry into audit log
    const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    setCases(prev => prev.map(c => {
      if (c.id === payload.caseId) {
        return {
          ...c,
          auditLogs: [
            {
              id: `log-${Date.now()}`,
              timestamp: timestampStr,
              author: 'Automated Dispatcher (TraceAI)',
              action: 'Forensic Report Dispatched via Email',
              notes: `Evidence package emailed to ${payload.recipient} [Subject: ${payload.subject}]`
            },
            ...c.auditLogs
          ]
        };
      }
      return c;
    }));

    showToast(
      'Forensic Report Dispatched',
      `Evidence package and cryptographic audit memo sent to ${payload.recipient}`,
      'success'
    );
    closeEmailModal();
    return true;
  };

  const runInvestigation = async (caseId: string = activeCaseId) => {
    if (isInvestigatingLive) return;
    setIsInvestigatingLive(true);
    setInvestigationLog(['[00:00.000] Initializing TraceAI Autonomous Forensics Engine...', '[00:00.120] Loading transaction batch & ledger telemetry...']);

    const delay = (ms: number) => new Promise(r => setTimeout(r, Math.max(80, Math.floor(ms / investigationSpeed))));
    const targetCase = cases.find(c => c.id === caseId) || activeCase;
    
    // Stage 1: Detect
    await delay(500);
    setInvestigationLog(prev => [...prev, `[00:00.740] [STAGE 1: DETECT] Anomaly identified in Settlement #${targetCase.id}. Gross: ₹${targetCase.amount.toLocaleString('en-IN')}`]);
    
    // Stage 2: Collect
    await delay(600);
    setInvestigationLog(prev => [...prev, '[00:01.450] [STAGE 2: COLLECT] Ingesting MT940 statement from HDFC Bank CBS & Razorpay payout payload...', '[00:01.820] Ingested 4 data streams: Gateway API, CBS Feed, Zoho Books COA, Webhook logs']);
    
    setCases(prev => prev.map(c => {
      if (c.id === targetCase.id) {
        const updatedStages = [...c.stages];
        updatedStages[1] = { ...updatedStages[1], status: 'completed', timestamp: '04:14:24 UTC', durationMs: 620 };
        updatedStages[2] = { ...updatedStages[2], status: 'in_progress' };
        return { ...c, state: 'investigating', currentStageIndex: 2, stages: updatedStages };
      }
      return c;
    }));

    // Stage 3: Correlate
    await delay(650);
    setInvestigationLog(prev => [...prev, '[00:02.580] [STAGE 3: CORRELATE] Cross-referencing UTR #HDFCR5202609040019284 across all settlement ledgers...', '[00:02.910] Exact amount match confirmed (₹48,000.00). 14 underlying payment IDs verified.']);
    
    setCases(prev => prev.map(c => {
      if (c.id === targetCase.id) {
        const updatedStages = [...c.stages];
        updatedStages[2] = { ...updatedStages[2], status: 'completed', timestamp: '04:14:25 UTC', durationMs: 480 };
        updatedStages[3] = { ...updatedStages[3], status: 'in_progress' };
        return { ...c, state: 'evidence_found', currentStageIndex: 3, stages: updatedStages };
      }
      return c;
    }));

    // Stage 4: Investigate
    await delay(700);
    setInvestigationLog(prev => [...prev, '[00:03.720] [STAGE 4: INVESTIGATE] Tracing API telemetry... Webhook delivery failure isolated: HTTP 504 Gateway Timeout on port 443.', '[00:04.100] BREAK DETECTED: Bank received funds, but accounting ledger entry was never created.']);
    
    setCases(prev => prev.map(c => {
      if (c.id === targetCase.id) {
        const updatedStages = [...c.stages];
        updatedStages[3] = { ...updatedStages[3], status: 'completed', timestamp: '04:14:27 UTC', durationMs: 810 };
        updatedStages[4] = { ...updatedStages[4], status: 'in_progress' };
        return { ...c, state: 'root_cause_identified', currentStageIndex: 4, stages: updatedStages };
      }
      return c;
    }));

    // Stage 5 & 6: Explain & Resolve
    await delay(600);
    setInvestigationLog(prev => [...prev, '[00:04.850] [STAGE 5: EXPLAIN] Root cause formulated with 94% statistical confidence.', '[00:05.200] [STAGE 6: RESOLVE] Double-entry balancing Journal Entry #JE-2026-904 generated and ready for sign-off.']);

    setCases(prev => prev.map(c => {
      if (c.id === targetCase.id) {
        const updatedStages = [...c.stages];
        updatedStages[4] = { ...updatedStages[4], status: 'completed', timestamp: '04:14:28 UTC', durationMs: 510 };
        updatedStages[5] = { ...updatedStages[5], status: 'completed', timestamp: '04:14:29 UTC', durationMs: 340 };
        return {
          ...c,
          state: 'resolution_ready',
          currentStageIndex: 5,
          stages: updatedStages,
          auditLogs: [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
              author: 'TraceAI Autonomous Engine',
              action: 'Investigation Completed',
              notes: 'Full 6-stage forensics completed in 5.2s. Root cause confirmed and resolution generated.'
            },
            ...c.auditLogs
          ]
        };
      }
      return c;
    }));

    setIsInvestigatingLive(false);

    showToast(
      'Investigation Completed',
      `Identified HTTP 504 Webhook Timeout with 94% confidence. Resolution ready.`,
      'info'
    );
  };

  const approveResolution = (caseId: string, notes: string = 'Approved by Senior Finance Controller') => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          state: 'resolved',
          journalEntry: { ...c.journalEntry, status: 'approved' },
          resolvedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          resolutionNotes: notes,
          auditLogs: [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
              author: 'Finance Controller (Sign-off)',
              action: 'Resolution Approved & Ledger Reconciled',
              notes: notes
            },
            ...c.auditLogs
          ]
        };
      }
      return c;
    }));

    // Update global pipeline stats
    setStats(prev => ({
      ...prev,
      unmatchedSettlements: Math.max(0, prev.unmatchedSettlements - 1),
      transactionsMatched: prev.transactionsMatched + 14,
      totalAtRiskAmount: Math.max(0, prev.totalAtRiskAmount - (cases.find(c => c.id === caseId)?.amount || 0)),
      reconciliationRate: 99.98
    }));

    showToast(
      'Resolution Approved & Posted',
      `Balancing Journal Entry posted to General Ledger. Capital at risk restored to ₹0.00.`,
      'success'
    );
  };

  const markResolved = (caseId: string) => {
    approveResolution(caseId, 'Marked as resolved via Controller audit dashboard');
  };

  const retriggerWebhook = async (caseId: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 900));
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          webhookDetails: {
            ...c.webhookDetails,
            attempts: c.webhookDetails.attempts + 1,
            lastHttpCode: 200,
            lastError: 'None (Replay succeeded, HTTP 200 OK from Zoho Books)',
            retryEligible: false
          }
        };
      }
      return c;
    }));

    showToast(
      'Webhook Replay Verified',
      'HTTP 200 OK received from Zoho Books ERP Connector. Idempotency verified.',
      'success'
    );
    return true;
  };

  const resetDemoCase = () => {
    setCases([INITIAL_PRIMARY_CASE, ...SECONDARY_CASES]);
    setActiveCaseId('INV-1042');
    setStats(INITIAL_STATS);
    setInvestigationLog([]);
    setTimeTravelStep(2);
    showToast(
      'Scenario Reset',
      'Restored initial discrepancy state for Case #INV-1042 (₹48,000 Mismatch).',
      'info'
    );
  };

  return (
    <FinancialDataContext.Provider
      value={{
        cases,
        activeCase,
        activeCaseId,
        stats,
        isInvestigatingLive,
        investigationLog,
        toasts,
        emailModalCase,
        autoEmailOnCritical,
        liveEvents,
        isStreamActive,
        investigationSpeed,
        timeTravelStep,
        timeTravelSnapshots,
        setActiveCaseId,
        runInvestigation,
        approveResolution,
        markResolved,
        retriggerWebhook,
        resetDemoCase,
        showToast,
        removeToast,
        openEmailModal,
        closeEmailModal,
        sendEvidenceEmail,
        setAutoEmailOnCritical,
        toggleStream,
        setInvestigationSpeed,
        setTimeTravelStep,
        simulateLiveIngestionSpike
      }}
    >
      {children}
    </FinancialDataContext.Provider>
  );
};

export const useFinancialData = () => {
  const context = useContext(FinancialDataContext);
  if (!context) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
};
