import type { DragEvent } from 'react';
import { Boxes, Clock, MoreHorizontal, Package, Tag } from 'lucide-react';
import { useDrag } from '@/drag/DragContext';
import { FRICTION_META, STATUS_META, type Project } from '@/data';
import { FrictionChip, StatusBadge } from '@/components/Badges';

interface ProjectCardProps {
  project: Project;
  onClick?: (p: Project) => void;
  onTagFriction?: (id: string) => void;
  compact?: boolean;
  draggable?: boolean;
  footer?: React.ReactNode;
}

export function ProjectCard({
  project,
  onClick,
  onTagFriction,
  compact = false,
  draggable = true,
  footer,
}: ProjectCardProps) {
  const { setDrag, draggingId, tap, tappedId, clearTap } = useDrag();
  const isDragging = draggingId === project.id;
  const isTapped = tappedId === project.id;

  const onDragStart = (e: DragEvent) => {
    e.dataTransfer.setData('text/plain', project.id);
    e.dataTransfer.effectAllowed = 'move';
    setDrag({ type: 'project', id: project.id });
  };

  const onDragEnd = () => setDrag(null);

  const remaining = 100 - project.completion;
  const doneCount = project.checklist.filter((c) => c.done).length;

  const accentForStatus = STATUS_META[project.status].color;

  return (
    <article
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => {
        if (draggable) tap(project.id);
        onClick?.(project);
      }}
      className={[
        'group card-surface rounded-2xl p-4 cursor-grab active:cursor-grabbing transition-all duration-200',
        'hover:border-border-glow/60 hover:-translate-y-0.5 hover:glow-cyan',
        isDragging ? 'dragging-source ring-2 ring-accent-cyan/50' : '',
        isTapped ? 'ring-2 ring-accent-cyan glow-cyan' : '',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-base-600 text-accent-cyan">
            <Package size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="font-rog text-[15px] font-semibold text-gray-100 truncate">
              {project.name}
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
              <Clock size={11} />
              <span>{timeAgo(project.createdAt)}</span>
            </div>
          </div>
        </div>
        <StatusBadge color={accentForStatus} label={STATUS_META[project.status].label} />
      </div>

      {!compact && (
        <p className="mt-3 text-sm text-gray-400 leading-relaxed line-clamp-3">
          {project.summary}
        </p>
      )}

      {/* progress */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-gray-400 font-mono">SCOPE</span>
          <span className="font-mono text-gray-300">
            <span className="text-accent-emerald">{project.completion}%</span>
            <span className="text-gray-600"> / </span>
            <span className="text-accent-rose">{remaining}%</span>
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-base-600 flex">
          <div
            className="h-full bg-gradient-to-r from-accent-emerald to-accent-cyan transition-all duration-500"
            style={{ width: `${project.completion}%` }}
          />
          <div
            className="h-full bg-accent-rose/40 transition-all duration-500"
            style={{ width: `${remaining}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] mt-1 text-gray-500">
          <span>Built</span>
          <span>Stagnant</span>
        </div>
      </div>

      {/* tech stack */}
      {!compact && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.techStack.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-md bg-base-600 px-2 py-0.5 text-[11px] text-gray-300 border border-border-soft"
            >
              <Tag size={9} className="text-accent-purple" />
              {t}
            </span>
          ))}
        </div>
      )}

      {/* friction chips */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.friction.length === 0 ? (
          <span className="text-[11px] text-gray-600 inline-flex items-center gap-1">
            <MoreHorizontal size={11} /> No friction tagged
          </span>
        ) : (
          project.friction.map((f) => (
            <FrictionChip
              key={f}
              tag={f}
              color={FRICTION_META[f].color}
              onClick={onTagFriction ? (e: React.MouseEvent) => {
                e.stopPropagation();
                onTagFriction(project.id);
              } : undefined}
            />
          ))
        )}
      </div>

      {/* checklist mini */}
      {!compact && (
        <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Boxes size={12} className="text-accent-cyan" />
            Audit
          </span>
          <span className="font-mono">
            {doneCount}/{project.checklist.length} done
          </span>
        </div>
      )}

      {footer}

      {(isDragging || isTapped) && (
        <div className="mt-3 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 px-2 py-1.5 text-[11px] font-mono text-accent-cyan text-center">
          {isDragging ? 'dragging…' : 'selected — tap a drop zone'}
        </div>
      )}
    </article>
  );
}

function timeAgo(ts: number) {
  const days = Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}
