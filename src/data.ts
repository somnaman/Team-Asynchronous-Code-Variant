export type View = 'dashboard' | 'diagnose' | 'revival' | 'bazaar';

export type FrictionTag =
  | 'CollegeExams'
  | 'TechStackLimit'
  | 'NoTime'
  | 'TeamLoss'
  | 'ComplexBug';

export type Pathway =
  | 'Restart'
  | 'Continue'
  | 'ChangeIdea'
  | 'Repurpose'
  | 'Archive';

export type Status =
  | 'Buried'
  | 'Diagnosed'
  | 'Reviving'
  | 'ListedBazaar'
  | 'Adopted';

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface Project {
  id: string;
  name: string;
  summary: string;
  techStack: string[];
  completion: number;
  friction: FrictionTag[];
  checklist: ChecklistItem[];
  pathway: Pathway | null;
  status: Status;
  bazaar: boolean;
  adoptable: boolean;
  createdAt: number;
  diagnosis?: string;
  revivalLog?: string[];
}

export const ALL_FRICTION: FrictionTag[] = [
  'CollegeExams',
  'TechStackLimit',
  'NoTime',
  'TeamLoss',
  'ComplexBug',
];

export const ALL_PATHWAYS: { id: Pathway; title: string; desc: string }[] = [
  {
    id: 'Restart',
    title: 'Restart',
    desc: 'Modern tools & framework stack rebuilding strategy.',
  },
  {
    id: 'Continue',
    title: 'Continue',
    desc: 'Action plan pick-up guide with generated remaining checklist.',
  },
  {
    id: 'ChangeIdea',
    title: 'Change Idea',
    desc: 'Pivot product direction & feature scope.',
  },
  {
    id: 'Repurpose',
    title: 'Repurpose',
    desc: 'Modular code extraction helper for utility algorithms & UI components.',
  },
  {
    id: 'Archive',
    title: 'Archive',
    desc: 'Documentation generator producing clean markdown summaries.',
  },
];

export const FRICTION_META: Record<FrictionTag, { label: string; color: string }> = {
  CollegeExams: { label: '#CollegeExams', color: 'amber' },
  TechStackLimit: { label: '#TechStackLimit', color: 'rose' },
  NoTime: { label: '#NoTime', color: 'cyan' },
  TeamLoss: { label: '#TeamLoss', color: 'purple' },
  ComplexBug: { label: '#ComplexBug', color: 'emerald' },
};

export const STATUS_META: Record<Status, { label: string; color: string }> = {
  Buried: { label: 'Buried', color: 'rose' },
  Diagnosed: { label: 'Diagnosed', color: 'amber' },
  Reviving: { label: 'Reviving', color: 'cyan' },
  ListedBazaar: { label: 'Listed on Bazaar', color: 'purple' },
  Adopted: { label: 'Adopted', color: 'emerald' },
};

export const SEED_PROJECTS: Project[] = [
  {
    id: 'p-novachat',
    name: 'NovaChat',
    summary:
      'A real-time chat app with end-to-end encryption, thread replies and presence. Got auth + messaging 60% done before exams swallowed the team.',
    techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    completion: 60,
    friction: ['CollegeExams', 'TeamLoss'],
    checklist: [
      { id: 'c1', label: 'Auth + JWT flow', done: true },
      { id: 'c2', label: 'Realtime message send', done: true },
      { id: 'c3', label: 'Threaded replies UI', done: false },
      { id: 'c4', label: 'Presence indicators', done: false },
      { id: 'c5', label: 'End-to-end encryption', done: false },
    ],
    pathway: null,
    status: 'Buried',
    bazaar: false,
    adoptable: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 28,
  },
  {
    id: 'p-orbitbudget',
    name: 'OrbitBudget',
    summary:
      'Personal finance tracker with category charts, recurring bills and CSV import. Stalled on the charting library — the pie chart kept rendering NaN slices.',
    techStack: ['React', 'TypeScript', 'Recharts', 'Vite'],
    completion: 42,
    friction: ['ComplexBug', 'TechStackLimit'],
    checklist: [
      { id: 'c1', label: 'Transaction list', done: true },
      { id: 'c2', label: 'CSV import parser', done: true },
      { id: 'c3', label: 'Category breakdown charts', done: false },
      { id: 'c4', label: 'Recurring bills reminders', done: false },
      { id: 'c5', label: 'Monthly budget goals', done: false },
    ],
    pathway: null,
    status: 'Buried',
    bazaar: false,
    adoptable: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 19,
  },
  {
    id: 'p-terrainforge',
    name: 'TerrainForge',
    summary:
      'Procedural 3D terrain generator using noise functions and WebGL. Renders heightmaps beautifully but the erosion simulation kept crashing the GPU.',
    techStack: ['C++', 'OpenGL', 'GLSL', 'ImGui'],
    completion: 35,
    friction: ['ComplexBug', 'NoTime'],
    checklist: [
      { id: 'c1', label: 'Noise-based heightmap gen', done: true },
      { id: 'c2', label: 'WebGL render pipeline', done: true },
      { id: 'c3', label: 'Hydraulic erosion sim', done: false },
      { id: 'c4', label: 'Texture splatting', done: false },
      { id: 'c5', label: 'Export to OBJ', done: false },
    ],
    pathway: null,
    status: 'Buried',
    bazaar: false,
    adoptable: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 42,
  },
  {
    id: 'p-fitflow',
    name: 'FitFlow',
    summary:
      'Workout planner with adaptive routines, rest timers and streak tracking. Lost the backend teammate mid-semester and the API never stood back up.',
    techStack: ['React Native', 'Expo', 'Supabase', 'TypeScript'],
    completion: 55,
    friction: ['TeamLoss', 'NoTime'],
    checklist: [
      { id: 'c1', label: 'Onboarding flow', done: true },
      { id: 'c2', label: 'Exercise library', done: true },
      { id: 'c3', label: 'Adaptive routine engine', done: false },
      { id: 'c4', label: 'Streak + history sync', done: false },
      { id: 'c5', label: 'Push notifications', done: false },
    ],
    pathway: null,
    status: 'Buried',
    bazaar: false,
    adoptable: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
  },
  {
    id: 'p-synthwave-mixer',
    name: 'SynthwaveMixer',
    summary:
      'Browser-based synthwave DAW with step sequencer, synth presets and a web-audio fx chain. Ran into WebAudio latency issues on mobile and ran out of steam.',
    techStack: ['Vue', 'WebAudio API', 'TypeScript', 'Vite'],
    completion: 48,
    friction: ['TechStackLimit', 'CollegeExams'],
    checklist: [
      { id: 'c1', label: 'Step sequencer grid', done: true },
      { id: 'c2', label: 'Synth voice presets', done: true },
      { id: 'c3', label: 'FX chain (delay/reverb)', done: false },
      { id: 'c4', label: 'Mobile audio latency fix', done: false },
      { id: 'c5', label: 'Pattern save/load', done: false },
    ],
    pathway: null,
    status: 'Buried',
    bazaar: false,
    adoptable: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 50,
  },
];
