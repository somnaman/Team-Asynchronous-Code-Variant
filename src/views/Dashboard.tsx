import { useMemo, useState } from 'react';
import {
  Activity,
  Archive,
  Boxes,
  Flame,
  Microscope,
  Package,
  Search,
  Sparkles,
  Store,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { ProjectCard } from '@/components/ProjectCard';
import { DropZone } from '@/components/DropZone';
import type { Project, View } from '@/data';
import { useDrag } from '@/drag/DragContext';

interface DashboardProps {
  projects: Project[];
  onDiagnose: (id: string) => void;
  onRevive: (id: string) => void;
  onListBazaar: (id: string) => void;
  onSelect: (p: Project) => void;
  onNavigate: (v: View) => void;
}

export function Dashboard({
  projects,
  onDiagnose,
  onRevive,
  onListBazaar,
  onSelect,
  onNavigate,
}: DashboardProps) {
  const [query, setQuery] = useState('');
  const { tappedId } = useDrag();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q))
    );
  }, [projects, query]);

  const stats = useMemo(() => {
    const buried = projects.filter((p) => p.status === 'Buried').length;
    const avg = projects.length
      ? Math.round(projects.reduce((s, p) => s + p.completion, 0) / projects.length)
      : 0;
    const listed = projects.filter((p) => p.bazaar).length;
    return { buried, avg, listed, total: projects.length };
  }, [projects]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={Package} label="Projects in Vault" value={stats.total} accent="cyan" />
        <Stat icon={Flame} label="Still Buried" value={stats.buried} accent="rose" />
        <Stat icon={TrendingUp} label="Avg Completion" value={`${stats.avg}%`} accent="emerald" />
        <Stat icon={Store} label="On Bazaar" value={stats.listed} accent="purple" />
      </div>

      {/* action drop zones */}
      <section>
        <SectionHeader
          icon={Zap}
          title="Action Drop Zones"
          subtitle="Drag a project card into a zone to execute — no buttons, just drag."
        />
        <div className="grid gap-3 md:grid-cols-3">
          <DropZone
            zoneId="dz-diagnose"
            onDrop={onDiagnose}
            title="Drag Here to Diagnose"
            subtitle="Run friction diagnostics & audit checklist"
            icon={<Microscope size={20} />}
            accent="amber"
          />
          <DropZone
            zoneId="dz-revive"
            onDrop={onRevive}
            title="Drag Here for AI Revival"
            subtitle="Launch the AI decision wizard & pick a pathway"
            icon={<Sparkles size={20} />}
            accent="cyan"
          />
          <DropZone
            zoneId="dz-bazaar"
            onDrop={onListBazaar}
            title="Drag Here to List on Bazaar"
            subtitle="Flag as open for community takeover"
            icon={<Store size={20} />}
            accent="purple"
          />
        </div>
        {tappedId && (
          <p className="mt-3 text-center text-[11px] font-mono text-accent-cyan/80 animate-float-up">
            Card selected — tap any drop zone above to execute the action.
          </p>
        )}
      </section>

      {/* vault grid */}
      <section>
        <SectionHeader
          icon={Boxes}
          title="The Vault"
          subtitle="Every buried project. Drag a card to act on it, or click to open detail."
        >
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search vault…"
              className="w-full sm:w-64 rounded-lg border border-border bg-base-800 pl-9 pr-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-accent-cyan/50"
            />
          </div>
        </SectionHeader>

        {filtered.length === 0 ? (
          <EmptyVault />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} onClick={() => onSelect(p)} />
            ))}
          </div>
        )}
      </section>

      {/* how it works */}
      <section className="rounded-2xl border border-border-soft bg-base-800/40 p-5">
        <SectionHeader icon={Activity} title="The 4-Step Journey" subtitle="How a buried idea earns its second life." />
        <div className="grid gap-3 md:grid-cols-4 mt-3">
          <Step n={1} title="Vault" desc="Import & log abandoned projects." icon={Package} onClick={() => onNavigate('dashboard')} />
          <Step n={2} title="Diagnose" desc="Tag friction, audit what's done." icon={Microscope} onClick={() => onNavigate('diagnose')} />
          <Step n={3} title="Revival" desc="AI picks a pathway forward." icon={Sparkles} onClick={() => onNavigate('revival')} />
          <Step n={4} title="Bazaar" desc="Open for community adoption." icon={Store} onClick={() => onNavigate('bazaar')} />
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Package;
  label: string;
  value: string | number;
  accent: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
}) {
  const color = {
    cyan: 'text-accent-cyan',
    purple: 'text-accent-purple',
    emerald: 'text-accent-emerald',
    amber: 'text-accent-amber',
    rose: 'text-accent-rose',
  }[accent];
  return (
    <div className="card-surface rounded-xl p-4 flex items-center gap-3">
      <div className={`grid h-10 w-10 place-items-center rounded-lg bg-base-600 ${color}`}>
        <Icon size={18} />
      </div>
      <div>
        <div className="font-rog text-xl font-bold text-gray-100">{value}</div>
        <div className="text-[11px] text-gray-500">{label}</div>
      </div>
    </div>
  );
}

export function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof Package;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <Icon size={18} className="text-accent-cyan" />
        <div>
          <h2 className="font-rog text-lg font-semibold text-gray-100">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Step({
  n,
  title,
  desc,
  icon: Icon,
  onClick,
}: {
  n: number;
  title: string;
  desc: string;
  icon: typeof Package;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl border border-border-soft bg-base-700/40 p-4 hover:border-accent-cyan/40 transition-all group"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-accent-cyan/10 text-accent-cyan font-mono text-xs font-bold">
          {n}
        </span>
        <Icon size={16} className="text-gray-400 group-hover:text-accent-cyan transition-colors" />
      </div>
      <div className="font-rog text-sm font-semibold text-gray-200">{title}</div>
      <div className="text-[11px] text-gray-500 mt-1">{desc}</div>
    </button>
  );
}

function EmptyVault() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-border p-10 text-center">
      <Archive size={28} className="mx-auto text-gray-600" />
      <p className="mt-3 text-sm text-gray-500">No projects match. The vault is quiet.</p>
    </div>
  );
}
