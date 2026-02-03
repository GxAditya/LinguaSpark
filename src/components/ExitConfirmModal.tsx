import { AlertTriangle, X } from 'lucide-react';

interface ExitConfirmModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  cancelText?: string;
  confirmText?: string;
}

export default function ExitConfirmModal({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title = 'Leave Game?',
  message = 'Your progress will not be saved. Are you sure you want to exit?',
  cancelText = 'Keep Playing',
  confirmText = 'Exit Game',
}: ExitConfirmModalProps) {
  const handleClose = onCancel || onClose;
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-surface rounded-2xl shadow-float max-w-md w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-200 border border-default">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-default">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-soft rounded-xl border border-warning">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <h2 className="text-xl font-bold text-primary">{title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-surface-2 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-soft" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-muted">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 btn-secondary rounded-xl"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-warning text-white rounded-xl font-semibold hover:opacity-90 transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
