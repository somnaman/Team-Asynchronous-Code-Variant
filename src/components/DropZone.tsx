import type { DragEvent, ReactNode } from 'react';
import { useDrag } from '@/drag/DragContext';

interface DropZoneProps {
  zoneId: string;
  onDrop: (projectId: string) => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  accent?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
  children?: ReactNode;
  className?: string;
  compact?: boolean;
}

const ACCENT: Record<string, { border: string; glow: string; text: string; bg: string }> = {
  cyan: {
    border: 'border-accent-cyan',
    glow: 'shadow-[0_0_30px_-8px_rgba(0,242,254,0.55)]',
    text: 'text-accent-cyan',
    bg: 'bg-accent-cyan/10',
  },
  purple: {
    border: 'border-accent-purple',
    glow: 'shadow-[0_0_30px_-8px_rgba(121,40,202,0.55)]',
    text: 'text-accent-purple',
    bg: 'bg-accent-purple/10',
  },
  emerald: {
    border: 'border-accent-emerald',
    glow: 'shadow-[0_0_30px_-8px_rgba(16,185,129,0.55)]',
    text: 'text-accent-emerald',
    bg: 'bg-accent-emerald/10',
  },
  amber: {
    border: 'border-accent-amber',
    glow: 'shadow-[0_0_30px_-8px_rgba(245,158,11,0.55)]',
    text: 'text-accent-amber',
    bg: 'bg-accent-amber/10',
  },
  rose: {
    border: 'border-accent-rose',
    glow: 'shadow-[0_0_30px_-8px_rgba(244,63,94,0.55)]',
    text: 'text-accent-rose',
    bg: 'bg-accent-rose/10',
  },
};

export function DropZone({
  zoneId,
  onDrop,
  title,
  subtitle,
  icon,
  accent = 'cyan',
  children,
  className = '',
  compact = false,
}: DropZoneProps) {
  const { payload, hoverZone, setDrag, setHover, tappedId, clearTap } = useDrag();
  const a = ACCENT[accent];
  const isActive = hoverZone === zoneId;
  const canAccept = payload !== null || tappedId !== null;

  const handleDrop = (projectId: string) => {
    onDrop(projectId);
    setDrag(null);
    clearTap();
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (hoverZone !== zoneId) setHover(zoneId);
  };

  const onDragLeave = () => {
    if (hoverZone === zoneId) setHover(null);
  };

  const onDropEvent = (e: DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || payload?.id || '';
    if (id) handleDrop(id);
    else setHover(null);
  };

  // touch fallback: tapping a zone while a card is tapped
  const onClickFallback = () => {
    if (tappedId) handleDrop(tappedId);
  };

  return (
    <div
      onClick={onClickFallback}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDropEvent}
      role="button"
      tabIndex={0}
      className={[
        'relative rounded-2xl border-2 border-dashed transition-all duration-200 select-none',
        compact ? 'p-3' : 'p-5',
        canAccept && !isActive ? 'border-border' : '',
        isActive ? `${a.border} ${a.bg} ${a.glow} scale-[1.01]` : 'border-border',
        canAccept ? 'cursor-copy' : 'cursor-default',
        className,
      ].join(' ')}
    >
      {isActive && (
        <div className={`pointer-events-none absolute inset-0 rounded-2xl ${a.bg} animate-pulse-glow`} />
      )}
      <div className="relative flex items-center gap-3">
        {icon && (
          <div
            className={[
              'grid place-items-center rounded-xl shrink-0',
              compact ? 'h-9 w-9' : 'h-11 w-11',
              isActive ? `${a.bg} ${a.text}` : 'bg-base-600 text-gray-400',
            ].join(' ')}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <div
            className={[
              'font-rog font-semibold tracking-wide truncate',
              compact ? 'text-sm' : 'text-base',
              isActive ? a.text : 'text-gray-200',
            ].join(' ')}
          >
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-gray-500 mt-0.5 leading-snug">{subtitle}</div>
          )}
        </div>
      </div>
      {children && <div className="relative mt-3">{children}</div>}
      {canAccept && (
        <div
          className={[
            'absolute top-2 right-3 text-[10px] font-mono uppercase tracking-widest',
            isActive ? a.text : 'text-gray-600',
          ].join(' ')}
        >
          {isActive ? 'release' : 'drop here'}
        </div>
      )}
    </div>
  );
}
