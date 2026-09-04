import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useFinancialData } from '../../data/financialContext';
import SendReportEmailModal from '../modals/SendReportEmailModal';
import ToastNotification from '../shared/ToastNotification';
import ForensicAgentCopilot from '../shared/ForensicAgentCopilot';
import {
  Activity,
  Layers,
  GitGraph,
  CheckCircle2,
  FileText,
  Settings,
  Search,
  RotateCcw,
  Building2,
  Mail
} from 'lucide-react';

export const AppLayout = () => {
  const { cases, activeCase, setActiveCaseId, stats, resetDemoCase, openEmailModal } = useFinancialData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const navigate = useNavigate();

  const unresolvedCount = cases.filter(c => c.state !== 'resolved').length;

  const filteredSearchResults = searchQuery.trim() === '' ? [] : cases.filter(c => 
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.amount.toString().includes(searchQuery)
  );

  const handleSelectSearchResult = (caseId: string) => {
    setActiveCaseId(caseId);
    setSearchQuery('');
    setShowSearchDropdown(false);
    navigate('/investigations');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090D14] text-[#F1F5F9] font-sans antialiased">
      {/* Left Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-[#0B0F19] border-r border-[#162033] flex flex-col justify-between select-none z-20">
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="h-14 px-5 flex items-center justify-between border-b border-[#162033]">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-[#2563EB] flex items-center justify-center font-bold text-white text-xs tracking-tighter">
                T
              </div>
              <div className="flex flex-col">
                <span className="font-semibold tracking-tight text-[14px] text-white leading-tight">
                  Trace<span className="text-[#3B82F6]">AI</span>
                </span>
                <span className="text-[10px] text-[#64748B] font-mono leading-none">
                  FINANCIAL FORENSICS
                </span>
              </div>
            </div>
            <span className="text-[9px] font-mono uppercase bg-[#141E30] text-[#94A3B8] px-1.5 py-0.5 rounded border border-[#1E2D48]">
              v2.4
            </span>
          </div>

          {/* Entity Selector */}
          <div className="px-3 py-2.5 border-b border-[#162033]/60 bg-[#090D14]/40">
            <div className="flex items-center justify-between px-2 py-1.5 rounded bg-[#0E1524] border border-[#1A263D] text-[12px]">
              <div className="flex items-center gap-2 truncate">
                <Building2 className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="font-medium text-slate-200 truncate">Acme Payments Corp</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#152033] text-white border-l-2 border-[#3B82F6]'
                    : 'text-[#94A3B8] hover:bg-[#0E1524] hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4" />
                <span>Command Center</span>
              </div>
            </NavLink>

            <NavLink
              to="/inbox"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#152033] text-white border-l-2 border-[#3B82F6]'
                    : 'text-[#94A3B8] hover:bg-[#0E1524] hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Investigation Inbox</span>
              </div>
              {unresolvedCount > 0 && (
                <span className="font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {unresolvedCount}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/investigations"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#152033] text-white border-l-2 border-[#3B82F6]'
                    : 'text-[#94A3B8] hover:bg-[#0E1524] hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4" />
                <span>Workspace</span>
              </div>
              {activeCase.state !== 'resolved' && (
                <span className="font-mono text-[9px] text-[#38BDF8]">
                  #{activeCase.id}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/evidence"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#152033] text-white border-l-2 border-[#3B82F6]'
                    : 'text-[#94A3B8] hover:bg-[#0E1524] hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <GitGraph className="w-4 h-4" />
                <span>Evidence Graph</span>
              </div>
            </NavLink>

            <NavLink
              to="/resolution"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#152033] text-white border-l-2 border-[#3B82F6]'
                    : 'text-[#94A3B8] hover:bg-[#0E1524] hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Resolution</span>
              </div>
              {activeCase.state === 'resolution_ready' && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#152033] text-white border-l-2 border-[#3B82F6]'
                    : 'text-[#94A3B8] hover:bg-[#0E1524] hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Executive Reports</span>
              </div>
            </NavLink>

            <div className="pt-3 border-t border-[#162033]/80 my-2"></div>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#152033] text-white border-l-2 border-[#3B82F6]'
                    : 'text-[#94A3B8] hover:bg-[#0E1524] hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </div>
            </NavLink>
          </nav>
        </div>

        {/* Persistent Bottom Agent Status & Quick Email Action */}
        <div className="p-3 border-t border-[#162033] bg-[#0A0E18] space-y-2">
          <button
            onClick={() => openEmailModal(activeCase)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded bg-[#131C2E] hover:bg-[#1A263D] border border-[#22314D] text-xs text-slate-200 hover:text-white font-medium transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Email Forensic Report</span>
          </button>

          <div className="p-2.5 rounded bg-[#0E1524] border border-[#1A263D] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">Agent Status</span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                Monitoring
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>{stats.transactionsAnalyzed.toLocaleString()} txns/cycle</span>
              <span>100% SLA</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Control Bar */}
        <header className="h-14 bg-[#0B0F19] border-b border-[#162033] px-6 flex items-center justify-between flex-shrink-0 z-10">
          {/* Global Search Bar */}
          <div className="relative w-96">
            <div className="flex items-center bg-[#0E1524] border border-[#1A263D] rounded px-3 py-1.5 focus-within:border-[#3B82F6] transition-colors">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by Case ID, UTR, Amount (₹48,000), Gateway..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
              />
              <span className="text-[10px] font-mono text-slate-500 bg-[#162033] px-1.5 py-0.5 rounded ml-2 flex-shrink-0">
                /
              </span>
            </div>

            {/* Search Dropdown */}
            {showSearchDropdown && filteredSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0E1524] border border-[#1E2D48] rounded shadow-xl py-1 z-50">
                <div className="px-3 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-[#1A263D]">
                  Matched Cases ({filteredSearchResults.length})
                </div>
                {filteredSearchResults.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectSearchResult(c.id)}
                    className="w-full text-left px-3 py-2 hover:bg-[#152033] flex items-center justify-between text-xs border-b border-[#1A263D]/40 last:border-0"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-200">{c.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">#{c.id} • {c.gateway}</span>
                    </div>
                    <span className="font-mono font-semibold text-rose-400">
                      ₹{c.amount.toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Context Indicators & Actions */}
          <div className="flex items-center gap-3">
            {/* Active Investigation Context Tag */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#0E1524] border border-[#1A263D] rounded text-xs">
              <span className="text-slate-400">Active Case:</span>
              <span className="font-mono font-medium text-[#38BDF8]">#{activeCase.id}</span>
              <span className="text-slate-500">•</span>
              <span className="font-mono font-semibold text-slate-200">
                ₹{activeCase.amount.toLocaleString('en-IN')}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                activeCase.state === 'resolved' 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : activeCase.state === 'resolution_ready'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-rose-500/20 text-rose-400'
              }`}>
                {activeCase.state.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Email Report Button in Header */}
            <button
              onClick={() => openEmailModal(activeCase)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] border border-[#3B82F6] rounded transition-colors shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Report</span>
            </button>

            {/* Quick Demo Reset */}
            <button
              onClick={resetDemoCase}
              title="Reset state to initial detected anomaly"
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 bg-[#0E1524] hover:bg-[#141E30] border border-[#1A263D] rounded transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto bg-[#090D14] p-6">
          <Outlet />
        </main>
      </div>

      {/* Global Modals, Notifications & AI Copilot */}
      <SendReportEmailModal />
      <ToastNotification />
      <ForensicAgentCopilot />
    </div>
  );
};

export default AppLayout;
