import { useEffect, useRef, useState } from 'react';
import { Github, PackagePlus, Sparkles, X } from 'lucide-react';
import type { FrictionTag, Project } from '@/data';
import { ALL_FRICTION, FRICTION_META } from '@/data';
import { FrictionChip } from '@/components/Badges';

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (p: Project) => void;
}

const TECH_SUGGESTIONS = ['React', 'TypeScript', 'Python', 'C++', 'Node.js', 'Vite', 'Vue', 'Go', 'Rust'];

export function ImportModal({ open, onClose, onAdd }: ImportModalProps) {
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [techInput, setTechInput] = useState('');
  const [tech, setTech] = useState<string[]>([]);
  const [completion, setCompletion] = useState(30);
  const [friction, setFriction] = useState<FrictionTag[]>([]);
  const [syncing, setSyncing] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setSummary('');
      setTechInput('');
      setTech([]);
      setCompletion(30);
      setFriction([]);
      setSyncing(false);
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const addTech = (t: string) => {
    const v = t.trim();
    if (v && !tech.includes(v)) setTech([...tech, v]);
    setTechInput('');
  };

  const toggleFriction = (f: FrictionTag) =>
    setFriction((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));

  const mockSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setName('QuantumTodo');
      setSummary(
        'A quantum-inspired todo manager with superposition tasks (done AND not done until you observe them). Synced from mock GitHub repo.'
      );
      setTech(['React', 'TypeScript', 'Vite']);
      setCompletion(25);
      setFriction(['NoTime', 'ComplexBug']);
    }, 1100);
  };

  const submit = () => {
    if (!name.trim()) return;
    onAdd({
      id: `p-${Date.now()}`,
      name: name.trim(),
      summary: summary.trim() || 'No summary provided.',
      techStack: tech.length ? tech : ['Unknown'],
      completion,
      friction,
      checklist: [
        { id: 'c1', label: 'Core feature scaffold', done: completion > 20 },
        { id: 'c2', label: 'Main data flow', done: completion > 45 },
        { id: 'c3', label: 'UI polish', done: completion > 65 },
        { id: 'c4', label: 'Testing + docs', done: completion > 85 },
      ],
      pathway: null,
      status: 'Buried',
      bazaar: false,
      adoptable: false,
      createdAt: Date.now(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-base-900/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg card-surface rounded-2xl shadow-2xl animate-float-up max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-base-700/95 backdrop-blur px-5 py-3">
          <div className="flex items-center gap-2">
            <PackagePlus size={18} className="text-accent-cyan" />
            <h3 className="font-rog text-base font-semibold text-gray-100">Import Project</h3>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:text-gray-100 hover:bg-base-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* mock github sync */}
          <button
            onClick={mockSync}
            disabled={syncing}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-base-700/60 px-4 py-2.5 text-sm text-gray-300 hover:border-accent-cyan/40 hover:text-accent-cyan transition-all"
          >
            <Github size={16} />
            {syncing ? 'Syncing mock repo…' : 'Sync from mock GitHub'}
            {syncing && <Sparkles size={14} className="animate-pulse" />}
          </button>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-soft" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-base-700 px-2 text-[10px] uppercase tracking-widest text-gray-600 font-mono">
                or log manually
              </span>
            </div>
          </div>

          <Field label="Project Name">
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. NovaChat"
              className="input"
            />
          </Field>

          <Field label="Summary Description">
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              placeholder="What was this project? Why did it stall?"
              className="input resize-none"
            />
          </Field>

          <Field label="Tech Stack Tags">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tech.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-md bg-base-600 px-2 py-0.5 text-[11px] text-gray-300 border border-border-soft"
                >
                  {t}
                  <button
                    onClick={() => setTech(tech.filter((x) => x !== t))}
                    className="text-gray-500 hover:text-accent-rose"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTech(techInput);
                }
              }}
              placeholder="Type a stack + Enter"
              className="input"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {TECH_SUGGESTIONS.filter((s) => !tech.includes(s)).slice(0, 5).map((s) => (
                <button
                  key={s}
                  onClick={() => addTech(s)}
                  className="rounded-md border border-border-soft px-2 py-0.5 text-[11px] text-gray-500 hover:text-accent-cyan hover:border-accent-cyan/30"
                >
                  + {s}
                </button>
              ))}
            </div>
          </Field>

          <Field label={`Completion Slider — ${completion}%`}>
            <input
              type="range"
              min={0}
              max={100}
              value={completion}
              onChange={(e) => setCompletion(Number(e.target.value))}
              className="w-full accent-accent-cyan"
            />
            <div className="mt-1 flex justify-between text-[10px] text-gray-500 font-mono">
              <span>0% — freshly buried</span>
              <span>100% — nearly shipped</span>
            </div>
          </Field>

          <Field label="Initial Friction Tags (optional)">
            <div className="flex flex-wrap gap-1.5">
              {ALL_FRICTION.map((f) => (
                <FrictionChip
                  key={f}
                  tag={f}
                  color={FRICTION_META[f].color}
                  active={friction.includes(f)}
                  onClick={() => toggleFriction(f)}
                />
              ))}
            </div>
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={!name.trim()}
              className="rounded-lg bg-accent-cyan/15 border border-accent-cyan/40 px-4 py-2 text-sm font-medium text-accent-cyan hover:bg-accent-cyan/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Bury it in the Vault
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: #0D1117;
          border: 1px solid #30363D;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #E6EDF3;
          outline: none;
          transition: border-color .15s;
        }
        .input:focus { border-color: rgba(0,242,254,0.5); }
        .input::placeholder { color: #6B7280; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-400">{label}</label>
      {children}
    </div>
  );
}
