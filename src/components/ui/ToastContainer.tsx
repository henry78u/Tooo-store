import React from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#171717] text-white p-4 shadow-xl border border-neutral-700 flex items-start justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-start gap-2.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            ) : toast.type === 'accent' ? (
              <span className="w-2 h-2 rounded-full bg-[#8A4735] mt-1.5 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
            )}
            <div>
              <p className="text-xs font-semibold tracking-wide">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-neutral-300 mt-0.5 leading-snug">
                  {toast.description}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-neutral-400 hover:text-white p-0.5 transition-colors shrink-0"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
