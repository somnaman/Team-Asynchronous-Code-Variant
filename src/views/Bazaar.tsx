import { useMemo } from 'react';
import { Handshake, Heart, Store, Users } from 'lucide-react';
import { SectionHeader } from '@/views/Dashboard';
import { ProjectCard } from '@/components/ProjectCard';
import { DropZone } from '@/components/DropZone';
import { StatusBadgeLookup } from '@/components/Badges';
import { FRICTION_META, type Project } from '@/data';

interface BazaarProps {
  projects: Project[];
  onAdopt: (id: string) => void;
  onListForAdoption: (id: string) => void;
  onSelect: (p: Project) => void;
}

export function Bazaar({ projects, onAdopt, onListForAdoption, onSelect }: BazaarProps) {
  const listed = useMemo(() => projects.filter((p) => p.bazaar), [projects]);
  const adoptable = useMemo(() => listed.filter((p) => p.adoptable), [listed]);
  const adopted = useMemo(() => projects.filter((p) => p.status === 'Adopted'), [projects]);
  const otherProjects = useMemo(
    () => projects.filter((p) => !p.bazaar && p.status !== 'Adopted'),
    [projects]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      <SectionHeader
        icon={Store}
        title="Graveyard Adoption Bazaar"
        subtitle="List buried projects for takeover — or adopt one into your active workspace."
      />

      {/* community adoption zone */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <DropZone
          zoneId="bazaar-adopt"
          onDrop={onAdopt}
          title="Community Adoption Zone"
          subtitle="Drag a listed project here to adopt it into your active workspace."
          icon={<Handshake size={20} />}
          accent="emerald"
        >
          {adopted.length > 0 && (
            <div className="rounded-lg border border-accent-emerald/20 bg-accent-emerald/5 p-3">
              <div className="text-[11px] uppercase tracking-widest text-accent-emerald font-mono mb-2">
                Adopted into your workspace
              </div>
              <div className="space-y-1.5">
                {adopted.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-200 font-rog text-[13px]">{p.name}</span>
                    <span className="text-[11px] font-mono text-accent-emerald">adopted ✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DropZone>

        <DropZone
          zoneId="bazaar-list"
          onDrop={onListForAdoption}
          title="List for Takeover"
          subtitle="Drag any unlisted project here to flag it open for the community."
          icon={<Users size={20} />}
          accent="purple"
        >
          {otherProjects.length > 0 && (
            <div className="text-[11px] text-gray-500">
              {otherProjects.length} unlisted project{otherProjects.length > 1 ? 's' : ''} available to list.
            </div>
          )}
        </DropZone>
      </div>

      {/* listed projects board */}
      <section>
        <SectionHeader
          icon={Store}
          title="Open for Takeover"
          subtitle="Drag any of these into the Community Adoption Zone to claim it."
        />
        {listed.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-10 text-center">
            <Store size={26} className="mx-auto text-gray-600" />
            <p className="mt-3 text-sm text-gray-500">
              No projects on the bazaar yet. Drag a vault project into "List for Takeover".
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listed.map((p) => (
              <div key={p.id} className="relative">
                <ProjectCard project={p} onClick={() => onSelect(p)} />
                {p.adoptable && (
                  <div className="absolute -top-2 -right-2 inline-flex items-center gap-1 rounded-full bg-accent-emerald text-base-900 text-[10px] font-bold px-2 py-0.5 shadow-lg">
                    <Heart size={10} className="fill-current" /> ADOPTABLE
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* bazaar directory list */}
      <section className="card-surface rounded-2xl p-5">
        <SectionHeader icon={Users} title="Bazaar Directory" subtitle="Full inventory of listed projects." />
        {listed.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">Empty. List a project to populate the board.</p>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-widest text-gray-600 font-mono border-b border-border-soft">
                  <th className="py-2 pr-4">Project</th>
                  <th className="py-2 pr-4">Stack</th>
                  <th className="py-2 pr-4">Built</th>
                  <th className="py-2 pr-4">Friction</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {listed.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => onSelect(p)}
                    className="border-b border-border-soft/60 hover:bg-base-700/40 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 pr-4 font-rog font-semibold text-gray-200">{p.name}</td>
                    <td className="py-2.5 pr-4 text-gray-400 text-xs">
                      {p.techStack.slice(0, 3).join(', ')}
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-accent-emerald text-xs">
                      {p.completion}%
                    </td>
                    <td className="py-2.5 pr-4 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {p.friction.slice(0, 2).map((f) => (
                          <span key={f} className="text-gray-500 font-mono">
                            {FRICTION_META[f].label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <StatusBadgeLookup status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
