import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = 'Cargando...' }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-2 py-10 text-ink-500"
    >
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
