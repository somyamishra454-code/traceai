import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancialData } from '../data/financialContext';
import {
  Search,
  ArrowRight,
  ExternalLink,
  Mail
} from 'lucide-react';

export const InvestigationInbox = () => {
  const { cases, activeCaseId, setActiveCaseId, openEmailModal, showToast } = useFinancialData();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<'all' | 'needs_action' | 'in_progress' | 'resolved'>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [gatewayFilter, setGatewayFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected case for quick side drawer preview
  const [drawerCaseId, setDrawerCaseId] = useState<string>(activeCaseId);

  const drawerCase = cases.find(c => c.id === drawerCaseId) || cases[0];

  const filteredCases = cases.filter(c => {
    // Status Filter
    if (statusFilter === 'needs_action' && (c.state === 'resolved' || c.state === 'investigating')) return false;
    if (statusFilter === 'in_progress' && c.state !== 'investigating') return false;
    if (statusFilter === 'resolved' && c.state !== 'resolved') return false;

    // Severity Filter
    if (severityFilter !== 'all' && c.severity !== severityFilter) return false;

    // Gateway Filter
    if (gatewayFilter !== 'all' && !c.gateway.toLowerCase().includes(gatewayFilter.toLowerCase())) return false;

    // Search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query) ||
        c.gateway.toLowerCase().includes(query) ||
        c.amount.toString().includes(query)
      );
    }

    return true;
  });

  const handleOpenWorkspace = (caseId: string) => {
    setActiveCaseId(caseId);
    navigate('/investigations');
  };

  const handleOpenEvidence = (caseId: string) => {
    setActiveCaseId(caseId);
    navigate('/evidence');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#162033]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Investigation Inbox
            <span className="text-xs font-mono font-normal text-slate-400">
              ({filteredCases.length} of {cases.length} records)
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Triage, investigate, and approve resolution workflows for all gateway, bank, and ledger discrepancies.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#0E1524] p-1 rounded-md border border-[#1A263D]">
          <button
            onClick={() => { setStatusFilter('all'); showToast('Filter Applied', 'Showing all investigation records.', 'info'); }}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              statusFilter === 'all'
                ? 'bg-[#1E2D48] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({cases.length})
          </button>
          <button
            onClick={() => { setStatusFilter('needs_action'); showToast('Filter Applied', 'Showing cases requiring action.', 'info'); }}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              statusFilter === 'needs_action'
                ? 'bg-[#1E2D48] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Needs Action ({cases.filter(c => c.state !== 'resolved' && c.state !== 'investigating').length})
          </button>
          <button
            onClick={() => { setStatusFilter('in_progress'); showToast('Filter Applied', 'Showing in-progress investigations.', 'info'); }}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              statusFilter === 'in_progress'
                ? 'bg-[#1E2D48] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            In Progress ({cases.filter(c => c.state === 'investigating').length})
          </button>
          <button
            onClick={() => { setStatusFilter('resolved'); showToast('Filter Applied', 'Showing resolved and reconciled cases.', 'info'); }}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              statusFilter === 'resolved'
                ? 'bg-[#1E2D48] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Resolved ({cases.filter(c => c.state === 'resolved').length})
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 fin-card p-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by ID, description, amount..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0E18] border border-[#1A263D] rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={severityFilter}
            onChange={e => { setSeverityFilter(e.target.value); showToast('Severity Filter', `Filtered to ${e.target.value}`, 'info'); }}
            className="bg-[#0A0E18] border border-[#1A263D] rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="all">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>

          <select
            value={gatewayFilter}
            onChange={e => { setGatewayFilter(e.target.value); showToast('Gateway Filter', `Filtered to ${e.target.value}`, 'info'); }}
            className="bg-[#0A0E18] border border-[#1A263D] rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="all">All Gateways</option>
            <option value="Razorpay">Razorpay</option>
            <option value="Stripe">Stripe</option>
            <option value="ICICI">ICICI</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Queue Table + Drawer Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table View (8 Cols) */}
        <div className="lg:col-span-8 fin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="fin-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Discrepancy Details</th>
                  <th>Amount</th>
                  <th>Gateway / Bank</th>
                  <th>Severity</th>
                  <th>Stage</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map(c => {
                  const isSelected = c.id === drawerCaseId;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => {
                        setDrawerCaseId(c.id);
                        showToast(`Selected Case #${c.id}`, `${c.title} (₹${c.amount.toLocaleString('en-IN')})`, 'info');
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#152033] border-l-2 border-l-[#3B82F6]' : ''
                      }`}
                    >
                      <td className="font-mono text-xs text-[#38BDF8] font-semibold whitespace-nowrap">
                        #{c.id}
                      </td>
                      <td>
                        <div className="font-semibold text-slate-200 text-xs">{c.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{c.shortSummary}</div>
                      </td>
                      <td className="font-mono text-xs font-bold text-white whitespace-nowrap">
                        ₹{c.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="text-xs text-slate-300 whitespace-nowrap">
                        <div className="font-mono text-[11px]">{c.gateway}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{c.bankAccount}</div>
                      </td>
                      <td>
                        <span className={
                          c.severity === 'CRITICAL' ? 'badge-risk' :
                          c.severity === 'HIGH' ? 'badge-attention' : 'badge-neutral'
                        }>
                          {c.severity}
                        </span>
                      </td>
                      <td className="font-mono text-[11px] text-slate-400">
                        {c.currentStageIndex + 1}/6 Stages
                      </td>
                      <td>
                        <span className={
                          c.state === 'resolved' ? 'badge-resolved' :
                          c.state === 'resolution_ready' ? 'badge-attention' : 'badge-risk'
                        }>
                          {c.state.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Incident Drawer Preview (4 Cols) */}
        <div className="lg:col-span-4 fin-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1A253A] pb-3">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Quick Inspector</span>
              <h3 className="text-sm font-bold text-white">Case #{drawerCase.id}</h3>
            </div>
            <span className={
              drawerCase.severity === 'CRITICAL' ? 'badge-risk' :
              drawerCase.severity === 'HIGH' ? 'badge-attention' : 'badge-neutral'
            }>
              {drawerCase.severity}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[11px] text-slate-400">Discrepancy Amount</span>
              <div className="text-2xl font-extrabold font-mono text-white">
                ₹{drawerCase.amount.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3 rounded bg-[#0A0E18] border border-[#1A263D] space-y-1.5 text-xs">
              <div className="text-slate-400 font-medium">Root Cause Preview</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {drawerCase.rootCause}
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between py-1 border-b border-[#162033]">
                <span className="text-slate-500">Detected At:</span>
                <span className="font-mono text-slate-300">{drawerCase.detectedAt}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#162033]">
                <span className="text-slate-500">Gateway:</span>
                <span className="font-mono text-slate-300">{drawerCase.gateway}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#162033]">
                <span className="text-slate-500">Break Location:</span>
                <span className="font-mono text-rose-400 text-right">{drawerCase.breakLocation}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">AI Confidence:</span>
                <span className="font-mono text-[#38BDF8] font-bold">{drawerCase.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => openEmailModal(drawerCase)}
              className="w-full btn-secondary text-xs py-2 font-medium flex items-center justify-center gap-2 text-slate-200 hover:text-white"
            >
              <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Email Forensic Brief</span>
            </button>

            <button
              onClick={() => handleOpenWorkspace(drawerCase.id)}
              className="w-full btn-primary text-xs py-2.5 font-semibold flex items-center justify-center gap-2"
            >
              <span>Open Investigation Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleOpenEvidence(drawerCase.id)}
              className="w-full btn-secondary text-xs py-2 font-medium flex items-center justify-center gap-2"
            >
              <span>View Forensic Evidence Graph</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationInbox;
