import { X } from 'lucide-react';
import { FRICTION_META, STATUS_META, type FrictionTag, type Status } from '@/data';

const COLOR: Record<string, string> = {
  cyan: 'bg-accent-cyan/12 text-accent-cyan border-accent-cyan/30',
  purple: 'bg-accent-purple/12 text-accent-purple border-accent-purple/30',
  emerald: 'bg-accent-emerald/12 text-accent-emerald border-accent-emerald/30',
  amber: 'bg-accent-amber/12 text-accent-amber border-accent-amber/30',
  rose: 'bg-accent-rose/12 text-accent-rose border-accent-rose/30',
};

export function StatusBadge({ color, label }: { color: string; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${COLOR[color]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function StatusBadgeLookup({ status }: { status: Status }) {
  const m = STATUS_META[status];
  return <StatusBadge color={m.color} label={m.label} />;
}

export function FrictionChip({
  tag,
  color,
  active,
  onClick,
}: {
  tag: FrictionTag;
  color: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const meta = FRICTION_META[tag];
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-mono transition-all',
        active ? `${COLOR[color]} scale-105` : `${COLOR[color]} opacity-70 hover:opacity-100`,
        onClick ? 'cursor-pointer' : 'cursor-default',
      ].join(' ')}
    >
      {onClick && !active && <X size={10} className="opacity-60" />}
      {meta.label}
    </button>
  );
}
