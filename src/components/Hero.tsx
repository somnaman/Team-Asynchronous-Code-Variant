import { Ghost, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/50">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[60rem] rounded-full bg-accent-purple/10 blur-3xl" />
      <div className="absolute -top-16 right-10 h-48 w-96 rounded-full bg-accent-cyan/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-base-700/60 px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-gray-400 animate-float-up">
          <Ghost size={13} className="text-accent-cyan" />
          A graveyard for abandoned code
        </div>

        <h2
          className="mt-5 font-rog font-black tracking-[0.08em] text-3xl sm:text-5xl md:text-6xl text-gray-100 text-glow-cyan animate-float-up"
          style={{ textShadow: '0 0 30px rgba(0,242,254,0.35), 0 0 60px rgba(121,40,202,0.2)' }}
        >
          EVERYTHING UNFINISHED
          <br className="hidden sm:block" />
          <span className="text-accent-cyan"> IS STILL USEFUL.</span>
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-gray-400 leading-relaxed animate-float-up">
          A quiet inventory of the ideas waiting for their second life.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-mono text-gray-500 animate-float-up">
          <Sparkles size={12} className="text-accent-amber" />
          Drag any project card into an action zone to begin
        </div>
      </div>
    </section>
  );
}
