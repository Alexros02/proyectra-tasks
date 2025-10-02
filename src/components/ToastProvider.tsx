'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

export type ToastItem = {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
};

type ToastContextType = {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { ...toast, id }]);
    // Autocierre plegable a los 4s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const value = useMemo(
    () => ({ toasts, showToast, dismissToast }),
    [toasts, showToast, dismissToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* contenedor visual */}
      <div className="fixed bottom-4 right-4 z-[10000] flex flex-col gap-2 w-80">
        {toasts.map(t => (
          <details key={t.id} open className="group">
            <summary className="list-none">
              <div
                className={
                  'rounded-xl border p-3 shadow backdrop-blur flex items-start gap-3 ' +
                  (t.type === 'success'
                    ? 'bg-emerald-600/10 border-emerald-700 text-emerald-200'
                    : t.type === 'error'
                    ? 'bg-red-600/10 border-red-700 text-red-200'
                    : 'bg-blue-600/10 border-blue-700 text-blue-200')
                }
              >
                <div className="flex-1">
                  {t.title && <p className="text-sm font-semibold">{t.title}</p>}
                  <p className="text-sm">{t.message}</p>
                </div>
                <button
                  aria-label="Cerrar"
                  onClick={() => dismissToast(t.id)}
                  className="text-xs px-2 py-1 rounded-md border border-white/20 hover:bg-white/10"
                >
                  Cerrar
                </button>
              </div>
            </summary>
          </details>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

