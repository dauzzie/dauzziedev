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
    slug: 'liftwatch',
    title: 'LiftWatch',
    description:
      'Designed and built a full iPhone + Apple Watch fitness app from scratch, including data sync, cloud persistence, and App Store deployment workflow.',
    imgSrc: '/static/images/project/liftwatch/ios-workouts-home.png',
    tag: ['swift', 'watchkit', 'watch extension', 'cloudkit', 'app store connect'],
    href: '/projects/LiftWatch/support',
    featured: true,
    role: 'Founding iOS/watchOS Engineer',
    status: 'In Progress',
    duration: '2026 - Present',
    overview:
      'LiftWatch is an end-to-end product build focused on workout tracking and progress visibility across iPhone and Apple Watch.',
    problem:
      'I needed to build a fitness product where watch-collected activity data remains reliable, syncs cleanly to phone, and is production-ready for App Store release.',
    solution:
      'I designed the app architecture from zero, implemented WatchKit + Watch Extension flows for data capture/sync, integrated CloudKit for persistence, and built the App Store Connect pipeline for versioning, metadata, and deployment readiness.',
    impact: [
      'Shipped a working cross-device architecture from concept to deployable build',
      'Established a repeatable App Store Connect release workflow',
      'Validated watch-to-phone sync strategy with CloudKit-backed data flow',
    ],
    impactMetrics: [
      { label: 'Platforms', value: 'iOS + watchOS companion architecture' },
      { label: 'Release Flow', value: 'App Store Connect metadata + build pipeline' },
      { label: 'Data Layer', value: 'CloudKit-backed sync and persistence' },
    ],
    skillsLearned: [
      'Designing and shipping an app end-to-end from blank repo',
      'Using WatchKit and Watch Extension for companion app synchronization',
      'Modeling CloudKit record structure and sync behavior',
      'Preparing production releases in App Store Connect (builds, metadata, compliance)',
      'Balancing product UX decisions with system constraints across iPhone and Apple Watch',
    ],
    screenshots: [
      {
        src: '/static/images/project/liftwatch/watch-new-workout-flow.png',
        alt: 'LiftWatch watchOS new workout flow with type, category, and exercise',
      },
      {
        src: '/static/images/project/liftwatch/watch-workouts-list.png',
        alt: 'LiftWatch watchOS workouts list with sync status',
      },
      {
        src: '/static/images/project/liftwatch/ios-workouts-home.png',
        alt: 'LiftWatch iOS home screen with workout cards and plan summary',
      },
      {
        src: '/static/images/project/liftwatch/ios-history-progressive-overload.png',
        alt: 'LiftWatch iOS history screen with progressive overload chart',
      },
    ],
    stack: ['Swift', 'WatchKit', 'Watch Extension', 'CloudKit', 'Xcode', 'App Store Connect'],
  },
  {
    slug: 'math-game-sprint',
    title: 'Math Game Sprint',
    description:
      'A speed-focused browser game: solve 10 arithmetic challenges in 10 seconds with a clean, responsive UI.',
    imgSrc: '/static/images/project/mathgame.png',
    tag: ['javascript', 'css'],
    href: 'https://mathgame-dlarroder.vercel.app/',
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
