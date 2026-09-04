import { useState, useEffect } from 'react';
import { useFinancialData, type TimeTravelSnapshot } from '../../data/financialContext';
import { Clock, SkipBack, SkipForward, Play, Pause, AlertOctagon, CheckCircle } from 'lucide-react';

export const TimeTravelScrubber = () => {
  const { timeTravelStep, setTimeTravelStep, timeTravelSnapshots, showToast } = useFinancialData();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const currentSnapshot = timeTravelSnapshots[timeTravelStep] || timeTravelSnapshots[0];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeTravelStep((prev: number) => {
        if (prev >= timeTravelSnapshots.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2800);

    return () => clearInterval(timer);
  }, [isPlaying, timeTravelSnapshots.length, setTimeTravelStep]);

  const handleSelectStep = (stepIdx: number) => {
    setIsPlaying(false);
    setTimeTravelStep(stepIdx);
    showToast(
      `Time Travel: ${timeTravelSnapshots[stepIdx].timestamp}`,
      timeTravelSnapshots[stepIdx].title,
      'info'
    );
  };

  const handleNext = () => {
    if (timeTravelStep < timeTravelSnapshots.length - 1) {
      handleSelectStep(timeTravelStep + 1);
    }
  };

  const handlePrev = () => {
    if (timeTravelStep > 0) {
      handleSelectStep(timeTravelStep - 1);
    }
  };

  return (
    <div className="bg-[#0E1420] border border-[#162033] rounded-xl overflow-hidden shadow-lg mb-6">
      {/* Top Header */}
      <div className="px-4 py-3 bg-[#0A0E17] border-b border-[#162033] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Forensic Ledger Time-Travel
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#162033] text-blue-300 border border-blue-500/20">
                Step {timeTravelStep + 1} of {timeTravelSnapshots.length}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Scrub across event timestamps to pinpoint the exact millisecond of ledger breakdown
            </p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            disabled={timeTravelStep === 0}
            className="p-1.5 rounded-lg bg-[#162033] hover:bg-[#1E293B] text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
            title="Previous Step"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
              isPlaying
                ? 'bg-amber-600/20 text-amber-300 border-amber-500/40'
                : 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border-blue-500/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Autoplay</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-blue-300" />
                <span>Play Sequence</span>
              </>
            )}
          </button>
          <button
            onClick={handleNext}
            disabled={timeTravelStep === timeTravelSnapshots.length - 1}
            className="p-1.5 rounded-lg bg-[#162033] hover:bg-[#1E293B] text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
            title="Next Step"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleSelectStep(2)}
            className="ml-2 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 flex items-center gap-1 transition-all"
            title="Jump to Break Point (04:01 AM Webhook Timeout)"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Jump to Break</span>
          </button>
        </div>
      </div>

      {/* Scrubber Track */}
      <div className="p-4 bg-[#090D14]/80">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
          {timeTravelSnapshots.map((snap: TimeTravelSnapshot, idx: number) => {
            const isSelected = idx === timeTravelStep;
            const isPast = idx < timeTravelStep;
            const isBreak = snap.isBreakActive;

            return (
              <button
                key={snap.stepIndex}
                onClick={() => handleSelectStep(idx)}
                className={`text-left p-3 rounded-xl border transition-all relative overflow-hidden group ${
                  isSelected
                    ? isBreak
                      ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/50 ring-1 ring-rose-500/50'
                      : 'bg-blue-950/40 border-blue-500/60 shadow-lg shadow-blue-950/50 ring-1 ring-blue-500/50'
                    : isPast
                    ? 'bg-[#0E1420] border-[#1E293B] opacity-80 hover:opacity-100 hover:border-slate-600'
                    : 'bg-[#0A0E17] border-[#162033] opacity-50 hover:opacity-80 hover:border-slate-700'
                }`}
              >
                {/* Step indicator bar */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`font-mono text-[11px] font-semibold ${
                    isSelected ? (isBreak ? 'text-rose-300' : 'text-blue-300') : 'text-slate-400'
                  }`}>
                    {snap.timestamp}
                  </span>
                  {isBreak ? (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  ) : idx === 4 ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  ) : (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-400' : 'bg-slate-600'}`} />
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-200 group-hover:text-white line-clamp-1 mb-1">
                  {snap.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                  {snap.description}
                </div>

                {isSelected && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    isBreak ? 'bg-rose-500' : 'bg-blue-500'
                  }`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Current State Inspector Pill Box */}
        <div className="mt-4 pt-3 border-t border-[#162033] grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Gateway State */}
          <div className="p-3 rounded-lg bg-[#0E1420] border border-[#162033]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">1. Razorpay Gateway State</span>
              <span className="text-[10px] font-mono text-blue-400 font-semibold">SETTLED</span>
            </div>
            <p className="text-xs text-slate-200 font-mono">
              {currentSnapshot.gatewayState}
            </p>
          </div>

          {/* Bank State */}
          <div className="p-3 rounded-lg bg-[#0E1420] border border-[#162033]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">2. HDFC CBS Host-to-Host</span>
              <span className={`text-[10px] font-mono font-semibold ${timeTravelStep >= 1 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {timeTravelStep >= 1 ? 'CREDITED' : 'PENDING'}
              </span>
            </div>
            <p className="text-xs text-slate-200 font-mono">
              {currentSnapshot.bankState}
            </p>
          </div>

          {/* ERP State */}
          <div className={`p-3 rounded-lg border transition-all ${
            currentSnapshot.isBreakActive 
              ? 'bg-rose-950/20 border-rose-500/40 text-rose-200' 
              : timeTravelStep === 4 
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
              : 'bg-[#0E1420] border-[#162033]'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">3. Zoho Books ERP Ledger</span>
              {currentSnapshot.isBreakActive ? (
                <span className="text-[10px] font-mono text-rose-400 font-bold flex items-center gap-1">
                  <AlertOctagon className="w-3 h-3" /> HTTP 504 BREAK
                </span>
              ) : timeTravelStep === 4 ? (
                <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> RECONCILED
                </span>
              ) : (
                <span className="text-[10px] font-mono text-slate-400">UNSYNCED</span>
              )}
            </div>
            <p className="text-xs font-mono">
              {currentSnapshot.accountingState}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
