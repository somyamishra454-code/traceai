import { useNavigate, useLocation } from 'react-router-dom';
import { useFinancialData } from '../../data/financialContext';
import { 
  Radio, 
  Search, 
  Cpu, 
  GitFork, 
  Scale, 
  FileCheck2,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export const InvestigationWorkflowStepper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeCase } = useFinancialData();

  const isResolved = activeCase.state === 'resolved';

  const steps = [
    {
      id: 'step-detect',
      number: 1,
      title: 'Detect',
      subtitle: 'Settlement Anomaly',
      path: '/',
      icon: Radio,
      status: 'completed'
    },
    {
      id: 'step-triage',
      number: 2,
      title: 'Triage',
      subtitle: 'Discrepancy Queue',
      path: '/inbox',
      icon: Search,
      status: 'completed'
    },
    {
      id: 'step-investigate',
      number: 3,
      title: 'Investigate',
      subtitle: '6-Stage AI Reasoning',
      path: '/investigations',
      icon: Cpu,
      status: activeCase.currentStageIndex >= 4 ? 'completed' : 'active'
    },
    {
      id: 'step-evidence',
      number: 4,
      title: 'Trace Evidence',
      subtitle: 'Chain of Custody',
      path: '/evidence',
      icon: GitFork,
      status: activeCase.currentStageIndex >= 4 ? 'completed' : 'pending'
    },
    {
      id: 'step-resolve',
      number: 5,
      title: 'Resolve',
      subtitle: 'Balancing & Replay',
      path: '/resolution',
      icon: Scale,
      status: isResolved ? 'completed' : 'active'
    },
    {
      id: 'step-certify',
      number: 6,
      title: 'Certify',
      subtitle: 'CFO Audit Sign-Off',
      path: '/reports',
      icon: FileCheck2,
      status: isResolved ? 'completed' : 'pending'
    }
  ];

  return (
    <div className="bg-[#0B0F19] border border-[#162033] rounded-xl p-3 mb-6 shadow-md overflow-x-auto">
      <div className="flex items-center justify-between min-w-[760px] gap-2">
        {steps.map((step, index) => {
          const isActive = location.pathname === step.path;
          const isPast = step.status === 'completed';
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => navigate(step.path)}
                className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-all w-full group cursor-pointer ${
                  isActive
                    ? 'bg-[#152033] border border-[#3B82F6] shadow-sm'
                    : isPast
                    ? 'hover:bg-[#0E1524] border border-transparent'
                    : 'opacity-60 hover:opacity-100 hover:bg-[#0E1524] border border-transparent'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isPast
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-[#162033] text-slate-400'
                }`}>
                  {isPast && !isActive ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[10px] text-slate-500">0{step.number}.</span>
                    <span className={`text-xs font-semibold truncate ${
                      isActive ? 'text-white' : isPast ? 'text-slate-200' : 'text-slate-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate leading-tight font-mono">
                    {step.subtitle}
                  </div>
                </div>
              </button>

              {index < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-700 flex-shrink-0 mx-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InvestigationWorkflowStepper;
