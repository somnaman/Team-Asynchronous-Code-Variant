import { useMemo, useState } from 'react';
import {
  Archive,
  ArrowRight,
  Cpu,
  RefreshCw,
  Sparkles,
  Terminal,
  Wrench,
  Workflow,
} from 'lucide-react';
import { SectionHeader } from '@/views/Dashboard';
import { StatusBadgeLookup } from '@/components/Badges';
import { DropZone } from '@/components/DropZone';
import {
  ALL_PATHWAYS,
  FRICTION_META,
  type Pathway,
  type Project,
} from '@/data';
import { useDrag } from '@/drag/DragContext';

interface RevivalProps {
  projects: Project[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onSetPathway: (id: string, p: Pathway) => void;
}

const PATHWAY_ICON: Record<Pathway, typeof RefreshCw> = {
  Restart: RefreshCw,
  Continue: Workflow,
  ChangeIdea: ArrowRight,
  Repurpose: Wrench,
  Archive: Archive,
};

const PATHWAY_ACCENT: Record<Pathway, 'cyan' | 'emerald' | 'amber' | 'purple' | 'rose'> = {
  Restart: 'cyan',
  Continue: 'emerald',
  ChangeIdea: 'amber',
  Repurpose: 'purple',
  Archive: 'rose',
};

export function Revival({ projects, activeId, onSelect, onSetPathway }: RevivalProps) {
  const active = projects.find((p) => p.id === activeId) ?? projects[0];
  const [analyzing, setAnalyzing] = useState(false);
  const { tappedId, tap } = useDrag();

  const analysis = useMemo(() => analyze(active), [active]);

  if (!active) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <Sparkles size={28} className="mx-auto text-gray-600" />
        <p className="mt-3 text-sm text-gray-500">Import a project to run the revival engine.</p>
      </div>
    );
  }

  const runAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 1800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      <SectionHeader
        icon={Sparkles}
        title="AI Revival Engine"
        subtitle="A mock analyzer reads completion + friction, then you drag the token into a pathway."
      />

      {/* project selector */}
      <div className="flex flex-wrap gap-2">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={[
              'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-all',
              active.id === p.id
                ? 'border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan'
                : 'border-border text-gray-400 hover:text-gray-200',
            ].join(' ')}
          >
            {p.name}
            {p.pathway && (
              <span className="text-[10px] font-mono text-gray-500">→ {p.pathway}</span>
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* terminal analyzer */}
        <div className="card-surface rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-base-800/80 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Terminal size={15} className="text-accent-emerald" />
              <span className="font-mono text-xs text-gray-400">revival-engine@graveyard</span>
            </div>
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-accent-rose/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent-amber/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent-emerald/70" />
            </div>
          </div>
          <div className="relative p-4 font-mono text-[13px] leading-relaxed bg-[#0B0F1A] min-h-[280px]">
            {analyzing && (
              <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-accent-cyan/15 to-transparent animate-scan" />
            )}
            <TerminalLine prompt>$ analyze --project="{active.name}"</TerminalLine>
            <TerminalLine dim>› reading completion ratio…</TerminalLine>
            <TerminalLine>
              <span className="text-gray-500">completion:</span>{' '}
              <span className="text-accent-emerald">{active.completion}%</span>{' '}
              <span className="text-gray-600">|</span>{' '}
              <span className="text-gray-500">stagnant:</span>{' '}
              <span className="text-accent-rose">{100 - active.completion}%</span>
            </TerminalLine>
            <TerminalLine dim>› scanning friction signatures…</TerminalLine>
            {active.friction.length === 0 ? (
              <TerminalLine dim>› no friction tags recorded</TerminalLine>
            ) : (
              active.friction.map((f) => (
                <TerminalLine key={f}>
                  <span className="text-accent-amber">found</span>{' '}
                  <span className="text-gray-300">{FRICTION_META[f].label}</span>
                </TerminalLine>
              ))
            )}
            <TerminalLine dim>› computing optimal pathway…</TerminalLine>
            {analyzing ? (
              <TerminalLine cyan>
                processing<span className="animate-blink">_</span>
              </TerminalLine>
            ) : (
              <>
                <TerminalLine>
                  <span className="text-accent-cyan">recommendation:</span>{' '}
                  <span className="text-accent-cyan font-bold">{analysis.recommended}</span>
                </TerminalLine>
                <TerminalLine dim>rationale:</TerminalLine>
                <TerminalLine dim wrapped>
                  {analysis.rationale}
                </TerminalLine>
                <TerminalLine dim>› drag the project token into a pathway zone →</TerminalLine>
                <TerminalLine>
                  <span className="text-accent-emerald">$</span>{' '}
                  <span className="animate-blink">▋</span>
                </TerminalLine>
              </>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-border bg-base-800/60 px-4 py-2.5">
            <span className="text-[11px] text-gray-500 font-mono">
              status: <StatusBadgeLookup status={active.status} />
            </span>
            <button
              onClick={runAnalyze}
              className="inline-flex items-center gap-1.5 rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1.5 text-xs text-accent-cyan hover:bg-accent-cyan/20 transition-all"
            >
              <Cpu size={13} />
              Re-run analyzer
            </button>
          </div>
        </div>

        {/* draggable project token */}
        <div className="space-y-4">
          <div className="card-surface rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest text-gray-600 font-mono mb-3">
              Project Token
            </div>
            <ProjectToken
              project={active}
              isTapped={tappedId === active.id}
              onTap={() => tap(active.id)}
            />
            <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
              On desktop: drag this token into a pathway zone. On touch: tap the token, then tap a
              pathway zone.
            </p>
            {active.pathway && (
              <div className="mt-3 rounded-lg border border-accent-emerald/30 bg-accent-emerald/10 px-3 py-2 text-xs text-accent-emerald">
                Pathway selected: <strong>{active.pathway}</strong>
              </div>
            )}
          </div>
          <div className="card-surface rounded-2xl p-4">
            <div className="text-xs uppercase tracking-widest text-gray-600 font-mono mb-2">
              AI Recommendation
            </div>
            <div className="font-rog text-lg font-bold text-accent-cyan">
              {analysis.recommended}
            </div>
            <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">{analysis.rationale}</p>
          </div>
        </div>
      </div>

      {/* 5 pathway drop zones */}
      <section>
        <SectionHeader
          icon={Workflow}
          title="5 Revival Pathways"
          subtitle="Drag the project token into exactly one pathway to commit."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {ALL_PATHWAYS.map((pw) => {
            const Icon = PATHWAY_ICON[pw.id];
            const accent = PATHWAY_ACCENT[pw.id];
            const selected = active.pathway === pw.id;
            return (
              <DropZone
                key={pw.id}
                zoneId={`pw-${pw.id}`}
                onDrop={(id) => onSetPathway(id, pw.id)}
                title={pw.title}
                subtitle={pw.desc}
                icon={<Icon size={18} />}
                accent={accent}
                compact
              >
                {selected && (
                  <div className={`rounded-lg ${accentBg(accent)} px-2 py-1 text-[11px] font-mono ${accentText(accent)} text-center`}>
                    ✓ pathway committed
                  </div>
                )}
              </DropZone>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ProjectToken({
  project,
  isTapped,
  onTap,
}: {
  project: Project;
  isTapped: boolean;
  onTap: () => void;
}) {
  const { setDrag, draggingId } = useDrag();
  return (
    <div
      draggable
      onClick={onTap}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', project.id);
        e.dataTransfer.effectAllowed = 'move';
        setDrag({ type: 'project', id: project.id });
      }}
      onDragEnd={() => setDrag(null)}
      className={[
        'relative cursor-grab active:cursor-grabbing rounded-xl border-2 p-4 transition-all',
        draggingId === project.id
          ? 'dragging-source border-accent-cyan'
          : isTapped
            ? 'border-accent-cyan glow-cyan'
            : 'border-accent-cyan/40 hover:border-accent-cyan hover:glow-cyan',
      ].join(' ')}
    >
      <div className="flex items-center gap-2.5">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent-cyan/15 text-accent-cyan">
          <Sparkles size={18} />
        </div>
        <div className="min-w-0">
          <div className="font-rog text-sm font-bold text-gray-100 truncate">{project.name}</div>
          <div className="text-[10px] font-mono text-gray-500">token · {project.completion}% built</div>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {project.friction.slice(0, 3).map((f) => (
          <span key={f} className="text-[10px] font-mono text-gray-500">
            {FRICTION_META[f].label}
          </span>
        ))}
      </div>
      <div className="absolute -top-2 -right-2 rounded-full bg-accent-cyan text-base-900 text-[9px] font-mono font-bold px-1.5 py-0.5">
        DRAG
      </div>
    </div>
  );
}

function analyze(p: Project): { recommended: string; rationale: string } {
  if (!p) return { recommended: '—', rationale: 'No project.' };
  const done = p.checklist.filter((c) => c.done).length;
  const total = p.checklist.length;
  const auditPct = total ? done / total : 0;
  const hasBug = p.friction.includes('ComplexBug');
  const hasTeamLoss = p.friction.includes('TeamLoss');
  const hasExams = p.friction.includes('CollegeExams');
  const hasNoTime = p.friction.includes('NoTime');

  if (p.completion >= 70) {
    return {
      recommended: 'Continue',
      rationale:
        'High completion ratio — most of the scope is already built. Pick up the remaining checklist items rather than restarting.',
    };
  }
  if (p.completion <= 20) {
    return {
      recommended: 'Restart',
      rationale:
        'Very little is built. A fresh stack and modern tooling will cost less than salvaging the existing scaffolding.',
    };
  }
  if (hasBug && p.completion < 55) {
    return {
      recommended: 'Repurpose',
      rationale:
        'A complex bug is blocking the main flow but the individual modules still have value. Extract the reusable parts.',
    };
  }
  if ((hasTeamLoss || hasExams || hasNoTime) && auditPct >= 0.4) {
    return {
      recommended: 'ChangeIdea',
      rationale:
        'Resource constraints make the original scope unrealistic. A narrower pivot can ship using what already works.',
    };
  }
  if (p.completion < 35) {
    return {
      recommended: 'Archive',
      rationale:
        'Low completion and limited remaining capacity. Document what was learned and archive the rest.',
    };
  }
  return {
    recommended: 'Continue',
    rationale: 'Balanced completion and friction — continue with a focused remaining checklist.',
  };
}

function accentBg(a: string) {
  return {
    cyan: 'bg-accent-cyan/10',
    emerald: 'bg-accent-emerald/10',
    amber: 'bg-accent-amber/10',
    purple: 'bg-accent-purple/10',
    rose: 'bg-accent-rose/10',
  }[a];
}
function accentText(a: string) {
  return {
    cyan: 'text-accent-cyan',
    emerald: 'text-accent-emerald',
    amber: 'text-accent-amber',
    purple: 'text-accent-purple',
    rose: 'text-accent-rose',
  }[a];
}

function TerminalLine({
  children,
  dim,
  cyan,
  wrapped,
  prompt,
}: {
  children: React.ReactNode;
  dim?: boolean;
  cyan?: boolean;
  wrapped?: boolean;
  prompt?: boolean;
}) {
  return (
    <div
      className={[
        wrapped ? 'whitespace-pre-wrap' : 'whitespace-nowrap overflow-hidden text-ellipsis',
        dim ? 'text-gray-600' : cyan ? 'text-accent-cyan' : 'text-gray-300',
      ].join(' ')}
    >
      {prompt && <span className="text-accent-emerald">$</span>} {children}
    </div>
  );
}
