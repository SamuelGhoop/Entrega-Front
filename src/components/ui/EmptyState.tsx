import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink-300 bg-white px-6 py-12 text-center">
      <div className="text-ink-500" aria-hidden="true">
        {icon ?? <Inbox className="h-10 w-10" />}
      </div>
      <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-ink-500">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
