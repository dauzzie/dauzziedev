export interface ProjectItem {
  slug: string
  title: string
  description: string
  imgSrc: string
  tag: string[]
  href: string
  featured?: boolean
  role: string
  status: 'Live' | 'In Progress' | 'Archived'
  duration?: string
  overview: string
  problem: string
  solution: string
  impact: string[]
  impactMetrics: { label: string; value: string }[]
  skillsLearned: string[]
  videoEmbedUrl?: string
  screenshots: { src: string; alt: string }[]
  stack: string[]
}

const projectsData: ProjectItem[] = [
  {
    slug: 'math-game-sprint',
    title: 'Math Game Sprint',
    description:
      'A speed-focused browser game: solve 10 arithmetic challenges in 10 seconds with a clean, responsive UI.',
    imgSrc: '/static/images/project/mathgame.png',
    tag: ['javascript', 'css'],
    href: 'https://mathgame-dlarroder.vercel.app/',
    featured: true,
    role: 'Solo Developer',
    status: 'Live',
    overview:
      'A lightweight browser game that prioritizes fast interaction loops, minimal loading overhead, and immediate player feedback.',
    problem:
      'Most quick math games feel visually outdated or laggy on first load. I wanted a version that stays responsive and readable on desktop and mobile.',
    solution:
      'Built a vanilla JavaScript game loop with deterministic countdown timing, simple state transitions, and a compact UI for instant play.',
    impact: [
      'Sub-second startup on modern browsers',
      'Responsive controls and readable game state',
      'Simple architecture that is easy to iterate',
    ],
    impactMetrics: [
      { label: 'Session Flow', value: '10 Q / 10s challenge loop' },
      { label: 'Load Profile', value: 'Lightweight static assets' },
      { label: 'Control Latency', value: 'Immediate keyboard response' },
    ],
    skillsLearned: [
      'Building deterministic time-based game loops',
      'Designing fast feedback UX for short sessions',
      'Structuring vanilla JS code for maintainability',
    ],
    videoEmbedUrl: 'https://www.youtube.com/embed/gtjarELUuDg',
    screenshots: [
      { src: '/static/images/project/mathgame.png', alt: 'Math Game Sprint gameplay screen' },
      { src: '/static/images/project/mathgame.png', alt: 'Math Game Sprint score state' },
    ],
    stack: ['JavaScript', 'CSS', 'HTML'],
  },
  {
    slug: 'snake-3310-rebuild',
    title: 'Snake 3310 Rebuild',
    description:
      'A modern recreation of the classic Nokia 3310 snake experience using plain HTML, CSS, and JavaScript.',
    imgSrc: '/static/images/project/snakegame.png',
    tag: ['javascript', 'css'],
    href: 'https://snakegame-dlarroder.vercel.app/',
    role: 'Solo Developer',
    status: 'Live',
    overview:
      'A faithful recreation of classic snake movement and collision behavior with modern web controls and rendering.',
    problem:
      'I wanted to preserve the feel of the original game while modernizing controls and browser compatibility.',
    solution:
      'Implemented grid-based movement, deterministic tick updates, and collision handling with a clean rendering pipeline.',
    impact: [
      'Classic gameplay feel with modern browser support',
      'Reliable collision and scoring logic',
      'Clear codebase for future level/game mode additions',
    ],
    impactMetrics: [
      { label: 'Gameplay Stability', value: 'Deterministic tick movement' },
      { label: 'Core Mechanics', value: 'Collision + score tracking' },
      { label: 'Compatibility', value: 'Runs in modern desktop browsers' },
    ],
    skillsLearned: [
      'Grid-state modeling for movement games',
      'Separating update/render cycles',
      'Balancing nostalgia accuracy with modern UX',
    ],
    screenshots: [
      { src: '/static/images/project/snakegame.png', alt: 'Snake 3310 gameplay board' },
      { src: '/static/images/project/snakegame.png', alt: 'Snake 3310 score screen' },
    ],
    stack: ['JavaScript', 'CSS', 'HTML'],
  },
]

export default projectsData
