import { Skull, LayoutDashboard, PackagePlus, Store } from 'lucide-react';
import type { View } from '@/data';

interface TopBarProps {
  view: View;
  onNavigate: (v: View) => void;
  onOpenImport: () => void;
  counts: { vault: number; bazaar: number };
}

const NAV: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard / Vault', icon: LayoutDashboard },
  { id: 'bazaar', label: 'Graveyard Bazaar', icon: Store },
];

export function TopBar({ view, onNavigate, onOpenImport, counts }: TopBarProps) {
  const activeNav = view === 'diagnose' || view === 'revival' ? 'dashboard' : view;
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-base-900/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent-purple/30 to-accent-cyan/20 border border-accent-cyan/40">
            <Skull size={20} className="text-accent-cyan text-glow-cyan" />
          </div>
          <div className="min-w-0">
            <h1 className="font-rog text-base sm:text-lg font-bold tracking-wider text-gray-100 truncate">
              PROJECT GRAVEYARD
            </h1>
            <p className="text-[10px] sm:text-[11px] text-gray-500 truncate font-mono">
              Team Asynchronous · Naman Som & Vanshika Sharma
            </p>
          </div>
        </div>

        {/* nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = activeNav === n.id;
            const count = n.id === 'bazaar' ? counts.bazaar : counts.vault;
            return (
              <button
                key={n.id}
                onClick={() => onNavigate(n.id)}
                className={[
                  'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                  active
                    ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-base-700/60 border border-transparent',
                ].join(' ')}
              >
                <Icon size={16} />
                {n.label}
                {count > 0 && (
                  <span className="rounded-full bg-base-600 px-1.5 text-[10px] font-mono text-gray-300">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={onOpenImport}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:text-accent-cyan hover:bg-base-700/60 border border-transparent hover:border-accent-cyan/30 transition-all"
          >
            <PackagePlus size={16} />
            Import Project
          </button>
        </nav>

        {/* round chip */}
        <div className="hidden lg:flex items-center gap-2 rounded-lg border border-accent-purple/30 bg-accent-purple/10 px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-purple animate-blink" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent-purple">
            Code Variant · R2 · B01
          </span>
        </div>
      </div>

      {/* mobile nav */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto px-3 pb-2 scrollbar-thin">
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = activeNav === n.id;
          return (
            <button
              key={n.id}
              onClick={() => onNavigate(n.id)}
              className={[
                'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all',
                active
                  ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30'
                  : 'text-gray-400 border border-transparent',
              ].join(' ')}
            >
              <Icon size={14} />
              {n.label}
            </button>
          );
        })}
        <button
          onClick={onOpenImport}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-300 whitespace-nowrap border border-transparent"
        >
          <PackagePlus size={14} />
          Import
        </button>
      </div>
    </header>
  );
}
