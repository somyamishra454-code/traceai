// Dynamic mock data generator for TracePay AI
// Numbers change on every page load for a realistic feel

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function formatINR(num: number): string {
  const str = Math.round(num).toString();
  if (str.length <= 3) return '₹' + str;
  let lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== '') lastThree = ',' + lastThree;
  return '₹' + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
}

// Generate base financial data
const totalPayments = rand(800000, 1500000);
const mdrRate = randFloat(1.5, 2.5);
const mdrFees = Math.round(totalPayments * mdrRate / 100);
const gstOnMDR = Math.round(mdrFees * 0.18);
const refundAmount = rand(30000, 70000);
const chargebackAmount = rand(8000, 25000);
const otherDeductions = rand(1000, 3000);
const totalDeductions = mdrFees + gstOnMDR + refundAmount + chargebackAmount + otherDeductions;
const expectedSettlement = totalPayments - refundAmount - chargebackAmount;
const actualSettlement = totalPayments - totalDeductions;
const missingAmount = expectedSettlement - actualSettlement;
const integrityScore = rand(58, 82);
const confidenceScore = rand(85, 96);
const transactionsAnalyzed = rand(3200, 6500);
const evidenceRecords = rand(800, 2000);
const affectedOrders = rand(1200, 2500);
const supportingRecords = rand(150, 350);
const correlationScore = randFloat(0.82, 0.96);
const historicalMatches = rand(8, 22);
const refundIncrease = rand(15, 45);
const chargebackIncrease = rand(80, 200);
const futureLossEstimate = rand(35000, 80000);
const expectedSavings = rand(20000, 50000);
const codReturns = rand(2000, 8000);
const productIssues = rand(1000, 4000);
const affectedCustomers = rand(60, 200);

// Sparkline generators
function generateSparkline(base: number, variance: number, points = 12): number[] {
  return Array.from({ length: points }, () => base + rand(-variance, variance));
}

export const dynamicData = {
  integrityScore,
  confidenceScore,
  transactionsAnalyzed,
  evidenceRecords,
  missingAmount,
  totalPayments,
  actualSettlement,
  expectedSettlement,
  mdrFees,
  gstOnMDR,
  refundAmount,
  chargebackAmount,
  otherDeductions,
  totalDeductions,
  refundIncrease,
  chargebackIncrease,
  futureLossEstimate,
  expectedSavings,
  affectedOrders,
  supportingRecords,
  correlationScore,
  historicalMatches,
  codReturns,
  productIssues,
  affectedCustomers,
};

export const kpiData = {
  payments: {
    label: 'Total Payments',
    value: totalPayments,
    formatted: formatINR(totalPayments),
    trend: randFloat(3, 12),
    trendDirection: 'up' as const,
    sparkline: generateSparkline(totalPayments / 12, totalPayments / 30),
    details: {
      daily: Array.from({ length: 7 }, (_, i) => ({
        date: `Aug ${21 + i}`,
        amount: formatINR(rand(totalPayments / 9, totalPayments / 6)),
      })),
      weekly: Array.from({ length: 4 }, (_, i) => ({
        week: `Week ${i + 1}`,
        amount: formatINR(rand(totalPayments / 5, totalPayments / 3)),
      })),
      monthly: ['May', 'Jun', 'Jul', 'Aug'].map((month) => ({
        month,
        amount: formatINR(rand(totalPayments * 0.8, totalPayments * 1.1)),
      })),
      growthRate: `${randFloat(5, 12)}% MoM`,
    },
  },
  settlements: {
    label: 'Settlements',
    value: actualSettlement,
    formatted: formatINR(actualSettlement),
    trend: -randFloat(1, 5),
    trendDirection: 'down' as const,
    sparkline: generateSparkline(actualSettlement / 12, actualSettlement / 30),
    details: {
      history: Array.from({ length: 5 }, (_, i) => ({
        date: `Aug ${21 + i}`,
        amount: formatINR(rand(actualSettlement / 8, actualSettlement / 5)),
        status: i === 2 ? 'Delayed' : 'Settled',
      })),
      delays: [
        { id: `STL-${rand(2800, 2900)}`, amount: formatINR(rand(20000, 50000)), delay: `${rand(1, 3)} days`, reason: 'Bank Processing' },
        { id: `STL-${rand(2900, 2999)}`, amount: formatINR(rand(10000, 30000)), delay: `${rand(1, 2)} day`, reason: 'Holiday Queue' },
      ],
      breakdown: {
        'UPI Settlements': formatINR(rand(actualSettlement * 0.4, actualSettlement * 0.55)),
        'Card Settlements': formatINR(rand(actualSettlement * 0.2, actualSettlement * 0.35)),
        'Net Banking': formatINR(rand(actualSettlement * 0.1, actualSettlement * 0.2)),
        'Wallets': formatINR(rand(actualSettlement * 0.02, actualSettlement * 0.06)),
      },
    },
  },
  refunds: {
    label: 'Refunds',
    value: refundAmount,
    formatted: formatINR(refundAmount),
    trend: refundIncrease,
    trendDirection: 'up' as const,
    sparkline: generateSparkline(refundAmount / 12, refundAmount / 6),
    details: {
      categories: [
        { category: 'Customer Request', amount: formatINR(rand(refundAmount * 0.3, refundAmount * 0.45)), count: rand(8, 20) },
        { category: 'Product Issues', amount: formatINR(rand(refundAmount * 0.15, refundAmount * 0.3)), count: rand(5, 15) },
        { category: 'Duplicate Payment', amount: formatINR(rand(refundAmount * 0.1, refundAmount * 0.2)), count: rand(3, 8) },
        { category: 'Service Error', amount: formatINR(rand(refundAmount * 0.08, refundAmount * 0.15)), count: rand(2, 6) },
      ],
      trends: ['May', 'Jun', 'Jul', 'Aug'].map((month) => ({
        month,
        amount: rand(refundAmount * 0.6, refundAmount * 1.1),
      })),
      sources: [
        { source: 'UPI', percentage: rand(35, 50) },
        { source: 'Cards', percentage: rand(25, 40) },
        { source: 'Net Banking', percentage: rand(10, 22) },
        { source: 'Wallets', percentage: rand(3, 10) },
      ],
    },
  },
  disputes: {
    label: 'Disputes',
    value: chargebackAmount,
    formatted: formatINR(chargebackAmount),
    trend: rand(20, 45),
    trendDirection: 'up' as const,
    sparkline: generateSparkline(chargebackAmount / 12, chargebackAmount / 6),
    details: {
      status: [
        { status: 'Open', count: rand(5, 12), amount: formatINR(rand(chargebackAmount * 0.3, chargebackAmount * 0.5)) },
        { status: 'Under Review', count: rand(2, 6), amount: formatINR(rand(chargebackAmount * 0.15, chargebackAmount * 0.3)) },
        { status: 'Won', count: rand(1, 4), amount: formatINR(rand(chargebackAmount * 0.05, chargebackAmount * 0.15)) },
        { status: 'Lost', count: rand(1, 5), amount: formatINR(rand(chargebackAmount * 0.05, chargebackAmount * 0.15)) },
      ],
      trend: ['May', 'Jun', 'Jul', 'Aug'].map((month) => ({
        month,
        count: rand(3, 20),
      })),
      riskScore: rand(65, 90),
    },
  },
};

export const anomalyData = {
  expected: expectedSettlement,
  actual: actualSettlement,
  difference: missingAmount,
  expectedFormatted: formatINR(expectedSettlement),
  actualFormatted: formatINR(actualSettlement),
  differenceFormatted: formatINR(missingAmount),
  detectedAgo: `${rand(1, 5)} Hours Ago`,
  impact: formatINR(missingAmount),
};

export const moneyFlowData = [
  { label: 'Payments', value: formatINR(totalPayments), amount: totalPayments, color: '#7c5cfc' },
  { label: 'Refunds', value: formatINR(refundAmount), amount: refundAmount, color: '#f59e0b' },
  { label: 'Chargebacks', value: formatINR(chargebackAmount), amount: chargebackAmount, color: '#f43f5e' },
  { label: 'Settlement', value: formatINR(actualSettlement), amount: actualSettlement, color: '#10b981' },
];

export const sourceBreakdown = [
  { name: 'MDR Fees', value: mdrFees, percentage: parseFloat(((mdrFees / missingAmount) * 100).toFixed(1)), color: '#7c5cfc' },
  { name: 'GST', value: gstOnMDR, percentage: parseFloat(((gstOnMDR / missingAmount) * 100).toFixed(1)), color: '#3b82f6' },
  { name: 'Refund Adjustments', value: Math.round(refundAmount * 0.12), percentage: parseFloat(((Math.round(refundAmount * 0.12) / missingAmount) * 100).toFixed(1)), color: '#f59e0b' },
  { name: 'Chargebacks', value: Math.round(chargebackAmount * 0.2), percentage: parseFloat(((Math.round(chargebackAmount * 0.2) / missingAmount) * 100).toFixed(1)), color: '#f43f5e' },
  { name: 'Other Deductions', value: otherDeductions, percentage: parseFloat(((otherDeductions / missingAmount) * 100).toFixed(1)), color: '#06b6d4' },
];

export const recentInvestigations = [
  {
    id: `INV-${rand(100, 999)}`,
    title: 'Settlement Difference Investigation',
    description: `Analyzing ${formatINR(missingAmount)} gap between expected and actual settlement`,
    status: 'critical' as const,
    progress: 100,
    date: 'Aug 27, 2026',
    amount: formatINR(missingAmount),
  },
  {
    id: `INV-${rand(100, 999)}`,
    title: 'Refund Spike Investigation',
    description: `Unusual refund activity detected — ${refundIncrease}% increase over last month`,
    status: 'warning' as const,
    progress: rand(60, 85),
    date: 'Aug 26, 2026',
    amount: formatINR(rand(8000, 20000)),
  },
  {
    id: `INV-${rand(100, 999)}`,
    title: 'Chargeback Investigation',
    description: `Chargebacks increased ${chargebackIncrease}% — fraud pattern suspected`,
    status: 'critical' as const,
    progress: rand(30, 55),
    date: 'Aug 25, 2026',
    amount: formatINR(rand(5000, 15000)),
  },
];

export const agentActivities = [
  { icon: '🤖', text: `Reading ${transactionsAnalyzed.toLocaleString('en-IN')} transactions`, duration: rand(800, 1200) },
  { icon: '🔍', text: 'Comparing expected vs actual settlements', duration: rand(600, 1000) },
  { icon: '📋', text: 'Matching refund records with original payments', duration: rand(700, 1100) },
  { icon: '⚠️', text: 'Analyzing chargeback history and dispute patterns', duration: rand(500, 900) },
  { icon: '💰', text: 'Calculating fee deductions (MDR, GST, platform)', duration: rand(600, 900) },
  { icon: '🔎', text: 'Detecting unusual patterns in transaction data', duration: rand(800, 1200) },
  { icon: '🕸️', text: 'Building financial relationship graph', duration: rand(700, 1100) },
  { icon: '📊', text: 'Estimating business impact and future risk', duration: rand(500, 800) },
  { icon: '🧠', text: 'Generating root cause hypothesis', duration: rand(900, 1400) },
  { icon: '✅', text: 'Root cause identified — Investigation complete', duration: rand(400, 600) },
];

export const aiObservations = [
  { id: 1, text: `Refund volume increased by ${refundIncrease}%`, severity: 'warning' as const },
  { id: 2, text: `Chargebacks increased by ${chargebackIncrease}%`, severity: 'critical' as const },
  { id: 3, text: 'Settlement deductions increased beyond normal thresholds', severity: 'warning' as const },
  { id: 4, text: 'Strong correlation detected between refund activity and settlement loss', severity: 'critical' as const },
  { id: 5, text: 'Financial leakage concentrated in COD transactions', severity: 'critical' as const },
];

export const aiThinkingSteps = [
  { step: 1, label: 'Data Ingested', detail: `${transactionsAnalyzed.toLocaleString('en-IN')} transactions loaded` },
  { step: 2, label: 'Transaction Matching Complete', detail: `${evidenceRecords.toLocaleString('en-IN')} records cross-referenced` },
  { step: 3, label: 'Settlement Variance Detected', detail: `${formatINR(missingAmount)} gap identified` },
  { step: 4, label: 'Root Cause Ranked', detail: `${aiObservations.length} observations generated` },
  { step: 5, label: 'Evidence Validated', detail: `Confidence: ${confidenceScore}%` },
  { step: 6, label: 'Recommendation Generated', detail: `Expected savings: ${formatINR(expectedSavings)}/mo` },
];

export const askAIQuestions = [
  {
    question: 'Why did settlement decrease?',
    answer: `Your settlement decreased because of ${formatINR(mdrFees)} in MDR fees, ${formatINR(gstOnMDR)} GST, and ${formatINR(refundAmount)} in refunds. The combined impact of these deductions resulted in ${formatINR(missingAmount)} less than expected. The primary driver is MDR charges which account for ${((mdrFees / missingAmount) * 100).toFixed(0)}% of the shortfall.`,
  },
  {
    question: `How was ${formatINR(missingAmount)} calculated?`,
    answer: `The missing amount was calculated by comparing your expected settlement (${formatINR(expectedSettlement)}) with the actual settlement (${formatINR(actualSettlement)}). The difference of ${formatINR(missingAmount)} comes from: MDR Fees (${formatINR(mdrFees)}), GST on MDR (${formatINR(gstOnMDR)}), and other platform deductions (${formatINR(otherDeductions)}).`,
  },
  {
    question: 'Which transactions caused the issue?',
    answer: `The investigation identified ${affectedOrders.toLocaleString('en-IN')} affected orders, primarily in the COD segment. ${formatINR(codReturns)} was lost to COD returns and ${formatINR(productIssues)} to product issue refunds. ${affectedCustomers} unique customers were involved in these transactions.`,
  },
  {
    question: 'What is the future risk?',
    answer: `Based on current trends, AI predicts a potential future loss of ${formatINR(futureLossEstimate)} over the next 30 days. Chargebacks have increased ${chargebackIncrease}% and if this trend continues, you may face cash-flow pressure. Risk level is classified as HIGH with ${confidenceScore}% confidence.`,
  },
  {
    question: 'What should I do next?',
    answer: `AI recommends: 1) Reduce COD exposure for high-return customers (estimated savings: ${formatINR(expectedSavings)}/month). 2) Implement 3D Secure for high-risk card transactions. 3) Set up automated refund triggers to prevent chargebacks. 4) Contact top ${rand(3, 8)} customers with pending disputes for resolution. Implementation difficulty is LOW with HIGH risk reduction.`,
  },
];

export const alertsData = [
  {
    id: 'ALT-001',
    type: 'critical' as const,
    title: 'Settlement Shortfall Detected',
    message: `${formatINR(missingAmount)} difference found between expected and actual settlement.`,
    timestamp: `${rand(1, 4)} hours ago`,
    read: false,
  },
  {
    id: 'ALT-002',
    type: 'warning' as const,
    title: 'Chargeback Spike',
    message: `Chargebacks increased ${chargebackIncrease}% compared to last month.`,
    timestamp: `${rand(3, 8)} hours ago`,
    read: false,
  },
  {
    id: 'ALT-003',
    type: 'info' as const,
    title: 'Settlement Processed',
    message: `Settlement STL-${rand(2800, 2900)} of ${formatINR(rand(100000, 200000))} has been processed.`,
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: 'ALT-004',
    type: 'warning' as const,
    title: 'Refund Trend Alert',
    message: `Refund rate is ${refundIncrease}% higher than the 30-day average.`,
    timestamp: '1 day ago',
    read: true,
  },
];

export const evidenceItems = [
  { label: 'Transactions', count: transactionsAnalyzed, icon: '📄' },
  { label: 'Settlements', count: rand(80, 200), icon: '🏦' },
  { label: 'Refund Records', count: rand(150, 400), icon: '🔄' },
  { label: 'Chargebacks', count: rand(20, 60), icon: '⚠️' },
  { label: 'Fee Records', count: rand(200, 600), icon: '💳' },
  { label: 'Historical Trends', count: rand(30, 90), icon: '📈' },
  { label: 'Merchant Activity Data', count: rand(100, 300), icon: '🏪' },
];
