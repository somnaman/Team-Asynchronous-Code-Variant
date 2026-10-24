import { useMemo, useState } from 'react';
import { CheckCircle2, Circle, ListChecks, Microscope, Package } from 'lucide-react';
import { SectionHeader } from '@/views/Dashboard';
import { FrictionChip, StatusBadgeLookup } from '@/components/Badges';
import { ALL_FRICTION, FRICTION_META, type FrictionTag, type Project } from '@/data';

interface DiagnosticsProps {
  projects: Project[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onToggleFriction: (id: string, f: FrictionTag) => void;
  onToggleChecklist: (id: string, itemId: string) => void;
}

export function Diagnostics({
  projects,
  activeId,
  onSelect,
  onToggleFriction,
  onToggleChecklist,
}: DiagnosticsProps) {
  const active = projects.find((p) => p.id === activeId) ?? projects[0];
  const [filter, setFilter] = useState<FrictionTag | null>(null);

  const filteredProjects = useMemo(() => {
    if (!filter) return projects;
    return projects.filter((p) => p.friction.includes(filter));
  }, [projects, filter]);

  if (!active) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <Package size={28} className="mx-auto text-gray-600" />
        <p className="mt-3 text-sm text-gray-500">Import a project to begin diagnostics.</p>
      </div>
    );
  }

  const done = active.checklist.filter((c) => c.done).length;
  const pct = Math.round((done / active.checklist.length) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      <SectionHeader
        icon={Microscope}
        title="Friction Diagnostics"
        subtitle="Tag why each project stalled and audit what's already built."
      />

      {/* friction filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500 mr-1">Filter vault:</span>
        {ALL_FRICTION.map((f) => (
          <FrictionChip
            key={f}
            tag={f}
            color={FRICTION_META[f].color}
            active={filter === f}
            onClick={() => setFilter(filter === f ? null : f)}
          />
        ))}
        {filter && (
          <button
            onClick={() => setFilter(null)}
            className="text-[11px] text-gray-500 hover:text-gray-300 underline"
          >
            clear
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* project picker */}
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-widest text-gray-600 font-mono px-1">
            Select project
          </div>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin pr-1">
            {filteredProjects.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                className={[
                  'w-full text-left rounded-xl border p-3 transition-all',
                  active.id === p.id
                    ? 'border-accent-amber/50 bg-accent-amber/5 glow-amber'
                    : 'border-border bg-base-700/40 hover:border-border-glow/40',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-rog text-sm font-semibold text-gray-200 truncate">
                    {p.name}
                  </span>
                  <StatusBadgeLookup status={p.status} />
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {p.friction.length === 0 ? (
                    <span className="text-[10px] text-gray-600">No friction tagged</span>
                  ) : (
                    p.friction.slice(0, 3).map((f) => (
                      <span key={f} className="text-[10px] font-mono text-gray-500">
                        {FRICTION_META[f].label}
                      </span>
                    ))
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* detail panel */}
        <div className="space-y-5">
          {/* active project header */}
          <div className="card-surface rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-rog text-xl font-bold text-gray-100">{active.name}</h3>
                <p className="mt-1 text-sm text-gray-400 leading-relaxed">{active.summary}</p>
              </div>
              <StatusBadgeLookup status={active.status} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {active.techStack.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-base-600 px-2 py-0.5 text-[11px] text-gray-300 border border-border-soft"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* friction tagging */}
          <div className="card-surface rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-rog text-sm font-semibold text-gray-200">FRICTION CHIPS</span>
              <span className="text-[11px] text-gray-500">— click to toggle what blocked this project</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_FRICTION.map((f) => (
                <FrictionChip
                  key={f}
                  tag={f}
                  color={FRICTION_META[f].color}
                  active={active.friction.includes(f)}
                  onClick={() => onToggleFriction(active.id, f)}
                />
              ))}
            </div>
          </div>

          {/* audit checklist */}
          <div className="card-surface rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ListChecks size={16} className="text-accent-emerald" />
                <span className="font-rog text-sm font-semibold text-gray-200">AUDIT CHECKLIST</span>
              </div>
              <span className="font-mono text-xs text-gray-400">
                {done}/{active.checklist.length} · {pct}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-base-600 mb-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-emerald to-accent-cyan transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <ul className="space-y-1.5">
              {active.checklist.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onToggleChecklist(active.id, c.id)}
                    className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-base-700/60 transition-colors"
                  >
                    {c.done ? (
                      <CheckCircle2 size={18} className="text-accent-emerald shrink-0" />
                    ) : (
                      <Circle size={18} className="text-gray-600 shrink-0" />
                    )}
                    <span
                      className={[
                        'text-sm',
                        c.done ? 'text-gray-400 line-through' : 'text-gray-200',
                      ].join(' ')}
                    >
                      {c.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
