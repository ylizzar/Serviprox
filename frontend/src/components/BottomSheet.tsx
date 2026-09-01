import { useEffect, type ReactNode } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: ReactNode;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, title, subtitle, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`sheet-backdrop${open ? ' show' : ''}`}
        onClick={onClose}
        role="presentation"
      />
      <div
        className={`sheet${open ? ' show' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="handle" />
        {title && <h3>{title}</h3>}
        {subtitle && <p className="sub">{subtitle}</p>}
        {children}
      </div>
    </>
  );
}
