import { useFinancialData } from '../../data/financialContext';
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  AlertCircle,
  X
} from 'lucide-react';

export const ToastNotification = () => {
  const { toasts, removeToast } = useFinancialData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isInfo = toast.type === 'info';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto p-3 rounded-lg border shadow-xl flex items-start gap-3 bg-[#0E1524] border-[#1E2D48] text-xs animate-in slide-in-from-bottom-2 fade-in duration-200"
          >
            {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />}
            {isInfo && <Info className="w-4 h-4 text-[#38BDF8] flex-shrink-0 mt-0.5" />}
            {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />}

            <div className="flex-1 space-y-0.5">
              <div className="font-semibold text-slate-100">{toast.title}</div>
              <p className="text-[11px] text-slate-400 leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-slate-300 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastNotification;
