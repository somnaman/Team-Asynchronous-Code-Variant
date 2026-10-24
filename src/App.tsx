import { useCallback, useMemo, useState } from 'react';
import { CheckCircle2, Info, Skull, X } from 'lucide-react';
import { DragProvider, useDrag } from '@/drag/DragContext';
import { TopBar } from '@/components/TopBar';
import { Hero } from '@/components/Hero';
import { ImportModal } from '@/components/ImportModal';
import { Dashboard } from '@/views/Dashboard';
import { Diagnostics } from '@/views/Diagnostics';
import { Revival } from '@/views/Revival';
import { Bazaar } from '@/views/Bazaar';
import { StatusBadgeLookup } from '@/components/Badges';
import { usePersistentState } from '@/hooks/usePersistentState';
import {
  SEED_PROJECTS,
  type FrictionTag,
  type Pathway,
  type Project,
  type View,
} from '@/data';

interface AppState {
  projects: Project[];
}

const TOAST_TTL = 2600;

function AppInner() {
  const [state, setState, reset] = usePersistentState<AppState>({ projects: SEED_PROJECTS });
  const [view, setView] = useState<View>('dashboard');
  const [importOpen, setImportOpen] = useState(false);
  const [activeDiagnoseId, setActiveDiagnoseId] = useState<string | null>(null);
  const [activeRevivalId, setActiveRevivalId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Project | null>(null);
  const [toasts, setToasts] = useState<{ id: number; msg: string; kind: 'ok' | 'info' }[]>([]);
  const { clearTap } = useDrag();

  const toast = useCallback((msg: string, kind: 'ok' | 'info' = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), TOAST_TTL);
  }, []);

  const updateProject = useCallback(
    (id: string, patch: Partial<Project>) => {
      setState((s) => ({
        ...s,
        projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      }));
      setDetail((d) => (d && d.id === id ? { ...d, ...patch } : d));
    },
    [setState]
  );

  // ---- actions triggered by drag-and-drop ----
  const diagnose = useCallback(
    (id: string) => {
      const p = state.projects.find((x) => x.id === id);
      updateProject(id, { status: 'Diagnosed' });
      setActiveDiagnoseId(id);
      setView('diagnose');
      clearTap();
      toast(`Diagnosing "${p?.name ?? 'project'}" — friction chamber open.`, 'info');
    },
    [state.projects, updateProject, clearTap, toast]
  );

  const revive = useCallback(
    (id: string) => {
      const p = state.projects.find((x) => x.id === id);
      updateProject(id, { status: 'Reviving' });
      setActiveRevivalId(id);
      setView('revival');
      clearTap();
      toast(`AI Revival Engine engaged on "${p?.name ?? 'project'}".`, 'info');
    },
    [state.projects, updateProject, clearTap, toast]
  );

  const listBazaar = useCallback(
    (id: string) => {
      const p = state.projects.find((x) => x.id === id);
      updateProject(id, { bazaar: true, adoptable: true, status: 'ListedBazaar' });
      clearTap();
      toast(`"${p?.name ?? 'project'}" listed on the Bazaar — open for takeover.`, 'ok');
    },
    [state.projects, updateProject, clearTap, toast]
  );

  const setPathway = useCallback(
    (id: string, pw: Pathway) => {
      const p = state.projects.find((x) => x.id === id);
      updateProject(id, { pathway: pw, status: 'Reviving' });
      clearTap();
      toast(`Pathway committed: ${pw} for "${p?.name ?? 'project'}".`, 'ok');
    },
    [state.projects, updateProject, clearTap, toast]
  );

  const adopt = useCallback(
    (id: string) => {
      const p = state.projects.find((x) => x.id === id);
      updateProject(id, { status: 'Adopted', adoptable: false });
      clearTap();
      toast(`Adopted "${p?.name ?? 'project'}" into your active workspace.`, 'ok');
    },
    [state.projects, updateProject, clearTap, toast]
  );

  const listForAdoption = useCallback(
    (id: string) => {
      const p = state.projects.find((x) => x.id === id);
      updateProject(id, { bazaar: true, adoptable: true, status: 'ListedBazaar' });
      clearTap();
      toast(`"${p?.name ?? 'project'}" flagged open for adoption.`, 'ok');
    },
    [state.projects, updateProject, clearTap, toast]
  );

  const toggleFriction = useCallback(
    (id: string, f: FrictionTag) => {
      const p = state.projects.find((x) => x.id === id);
      if (!p) return;
      const next = p.friction.includes(f)
        ? p.friction.filter((x) => x !== f)
        : [...p.friction, f];
      updateProject(id, { friction: next });
    },
    [state.projects, updateProject]
  );

  const toggleChecklist = useCallback(
    (id: string, itemId: string) => {
      const p = state.projects.find((x) => x.id === id);
      if (!p) return;
      const checklist = p.checklist.map((c) =>
        c.id === itemId ? { ...c, done: !c.done } : c
      );
      updateProject(id, { checklist });
    },
    [state.projects, updateProject]
  );

  const addProject = useCallback(
    (p: Project) => {
      setState((s) => ({ ...s, projects: [p, ...s.projects] }));
      toast(`"${p.name}" buried in the vault.`, 'ok');
    },
    [setState, toast]
  );

  const counts = useMemo(
    () => ({
      vault: state.projects.filter((p) => !p.bazaar && p.status !== 'Adopted').length,
      bazaar: state.projects.filter((p) => p.bazaar).length,
    }),
    [state.projects]
  );

  return (
    <div className="min-h-screen">
      <TopBar
        view={view}
        onNavigate={setView}
        onOpenImport={() => setImportOpen(true)}
        counts={counts}
      />
      {view === 'dashboard' && <Hero />}

      <main>
        {view === 'dashboard' && (
          <Dashboard
            projects={state.projects}
            onDiagnose={diagnose}
            onRevive={revive}
            onListBazaar={listBazaar}
            onSelect={setDetail}
            onNavigate={setView}
          />
        )}
        {view === 'diagnose' && (
          <Diagnostics
            projects={state.projects}
            activeId={activeDiagnoseId}
            onSelect={setActiveDiagnoseId}
            onToggleFriction={toggleFriction}
            onToggleChecklist={toggleChecklist}
          />
        )}
        {view === 'revival' && (
          <Revival
            projects={state.projects}
            activeId={activeRevivalId}
            onSelect={setActiveRevivalId}
            onSetPathway={setPathway}
          />
        )}
        {view === 'bazaar' && (
          <Bazaar
            projects={state.projects}
            onAdopt={adopt}
            onListForAdoption={listForAdoption}
            onSelect={setDetail}
          />
        )}
      </main>

      <Footer onReset={reset} />

      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onAdd={addProject} />

      <DetailDrawer project={detail} onClose={() => setDetail(null)} onDiagnose={diagnose} />

      {/* toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-2.5 rounded-xl border border-border bg-base-700/95 backdrop-blur px-4 py-2.5 shadow-2xl animate-float-up max-w-xs"
          >
            {t.kind === 'ok' ? (
              <CheckCircle2 size={16} className="text-accent-emerald shrink-0" />
            ) : (
              <Info size={16} className="text-accent-cyan shrink-0" />
            )}
            <span className="text-sm text-gray-200">{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer({ onReset }: { onReset: () => void }) {
  return (
    <footer className="mt-12 border-t border-border/50 bg-base-900/60">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] text-gray-600 font-mono">
          <Skull size={13} className="text-accent-cyan" />
          PROJECT GRAVEYARD · Team Asynchronous · Code Variant R2 · Build 01 · 24 Oct 2026
        </div>
        <button
          onClick={() => {
            if (confirm('Reset all data back to the seeded demo projects?')) onReset();
          }}
          className="text-[11px] text-gray-600 hover:text-accent-rose font-mono underline"
        >
          reset demo data
        </button>
      </div>
    </footer>
  );
}

function DetailDrawer({
  project,
  onClose,
  onDiagnose,
}: {
  project: Project | null;
  onClose: () => void;
  onDiagnose: (id: string) => void;
}) {
  if (!project) return null;
  const done = project.checklist.filter((c) => c.done).length;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-base-900/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative h-full w-full max-w-md card-surface border-l border-border shadow-2xl overflow-y-auto scrollbar-thin animate-float-up">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-base-700/95 backdrop-blur px-5 py-3">
          <h3 className="font-rog text-base font-semibold text-gray-100">Project Detail</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:text-gray-100 hover:bg-base-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-rog text-xl font-bold text-gray-100">{project.name}</h4>
            <StatusBadgeLookup status={project.status} />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{project.summary}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((t) => (
              <span
                key={t}
                className="rounded-md bg-base-600 px-2 py-0.5 text-[11px] text-gray-300 border border-border-soft"
              >
                {t}
              </span>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-500">Completion</span>
              <span className="font-mono text-accent-emerald">{project.completion}%</span>
            </div>
            <div className="h-2 rounded-full bg-base-600 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-emerald to-accent-cyan"
                style={{ width: `${project.completion}%` }}
              />
            </div>
          </div>

          {project.pathway && (
            <div className="rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-2 text-sm text-accent-cyan">
              Pathway: <strong>{project.pathway}</strong>
            </div>
          )}

          <div>
            <div className="text-xs uppercase tracking-widest text-gray-600 font-mono mb-2">
              Audit checklist ({done}/{project.checklist.length})
            </div>
            <ul className="space-y-1.5">
              {project.checklist.map((c) => (
                <li key={c.id} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className={c.done ? 'text-accent-emerald' : 'text-gray-600'}>
                    {c.done ? '✓' : '○'}
                  </span>
                  {c.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-border-soft">
            <p className="text-[11px] text-gray-500 mb-2">
              To act on this project, close this drawer and drag its card into an action zone.
            </p>
            <button
              onClick={() => {
                onDiagnose(project.id);
                onClose();
              }}
              className="w-full rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-4 py-2 text-sm text-accent-amber hover:bg-accent-amber/20 transition-all"
            >
              Send to Diagnostics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DragProvider>
      <AppInner />
    </DragProvider>
  );
}
