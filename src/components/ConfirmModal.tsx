'use client';

import { useEffect } from 'react';

type ConfirmVariant = 'danger' | 'primary' | 'neutral';

export type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const variantClasses = (variant: ConfirmVariant) => {
  if (variant === 'danger') return 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800';
  if (variant === 'primary')
    return 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800';
  return 'from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800';
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'neutral',
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 text-white p-6 shadow-xl">
        <h3 id="confirm-modal-title" className="text-lg font-semibold">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-sm text-gray-300 whitespace-pre-line">{description}</p>
        )}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800"
            aria-label={cancelText}
            disabled={busy}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-lg text-white bg-gradient-to-r ${variantClasses(
              variant
            )} disabled:opacity-60`}
            aria-label={confirmText}
            disabled={busy}
          >
            {busy ? 'Procesando…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
