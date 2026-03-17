import { Skill, Track, TrackerState } from './types'

export const MBA_TRACKER_STORAGE_KEY = 'dauzzie_mba_tracker_v1'

export const mbaTracks: Track[] = [
  {
    id: 'foundations',
    title: 'Stage 1: Business Foundations',
    goal: 'Learn how businesses actually operate and make decisions.',
    whyItMatters:
      'Strong engineering decisions need business context. This stage builds fluency in revenue, margin, demand, and operational constraints.',
    courses: [
      {
        id: 'marketing',
        title: 'Introduction to Marketing',
        provider: 'Wharton / Coursera',
        url: 'https://www.coursera.org/learn/wharton-marketing',
        reason:
          'Teaches positioning, segmentation, and demand generation so product decisions match customer behavior.',
      },
      {
        id: 'accounting',
        title: 'Introduction to Financial Accounting',
        provider: 'Wharton / Coursera',
        url: 'https://www.coursera.org/learn/wharton-accounting',
        reason: 'Builds understanding of financial statements and business health indicators.',
      },
      {
        id: 'finance',
        title: 'Introduction to Corporate Finance',
        provider: 'Wharton / Coursera',
        url: 'https://www.coursera.org/learn/wharton-finance',
        reason: 'Develops intuition for investment tradeoffs, ROI, risk, and capital allocation.',
      },
      {
        id: 'operations',
        title: 'Introduction to Operations Management',
        provider: 'Wharton / Coursera',
        url: 'https://www.coursera.org/learn/wharton-operations',
        reason: 'Improves systems thinking around throughput, bottlenecks, quality, and delivery.',
      },
      {
        id: 'cs50-business',
        title: 'CS50 for Business Professionals',
        provider: 'Harvard / edX',
        url: 'https://www.edx.org/course/cs50s-computer-science-for-business-professionals',
        reason: 'Bridges technical implementation and business stakeholder communication.',
      },
    ],
  },
  {
    id: 'strategy',
    title: 'Stage 2: Strategy & Competitive Thinking',
    goal: 'Understand how products and companies win markets.',
    whyItMatters:
      'This shifts you from building features to shaping strategy, differentiation, and long-term positioning.',
    courses: [
      {
        id: 'business-strategy',
        title: 'Business Strategy',
        provider: 'Wharton / Coursera',
        url: 'https://www.coursera.org/learn/wharton-business-strategy',
        reason: 'Gives frameworks for competition, value creation, and strategic moat building.',
      },
      {
        id: 'connected-strategy',
        title: 'Connected Strategy',
        provider: 'Harvard Business School Online',
        url: 'https://online.hbs.edu/courses/connected-strategy/',
        reason: 'Explains durable customer relationships through connected products and services.',
      },
      {
        id: 'decision-making',
        title: 'Decision Making & Scenarios',
        provider: 'Wharton / Coursera',
        url: 'https://www.coursera.org/learn/wharton-decision-making-scenarios',
        reason: 'Strengthens high-stakes decision quality under uncertainty.',
      },
      {
        id: 'design-innovation',
        title: 'Leadership Through Design Innovation',
        provider: 'Northwestern / Coursera',
        url: 'https://www.coursera.org/learn/leadership-design-innovation',
        reason: 'Connects leadership, creativity, and product strategy into practical execution.',
      },
    ],
  },
  {
    id: 'tech-data',
    title: 'Stage 3: Technology & Data Strategy',
    goal: 'Use data and technology as a business lever, not just implementation detail.',
    whyItMatters:
      'This stage builds the bridge between engineering depth and executive-level business impact.',
    courses: [
      {
        id: 'predictive-analytics',
        title: 'Predictive Analytics',
        provider: 'edX',
        url: 'https://www.edx.org/course/predictive-analytics',
        reason: 'Supports product forecasting, prioritization, and measurable outcomes.',
      },
      {
        id: 'data-driven-decisions',
        title: 'Data-Driven Decision Making',
        provider: 'PwC Academy',
        url: 'https://www.pwc.com/gx/en/services/academy/digital-learning/data-driven-decision-making.html',
        reason: 'Builds repeatable decision frameworks tied to metrics and real-world signals.',
      },
      {
        id: 'digital-transformation',
        title: 'Digital Transformation',
        provider: 'BCG + Darden / Coursera',
        url: 'https://www.coursera.org/learn/bcg-uva-darden-digital-transformation',
        reason: 'Teaches org-level transformation strategy, not only tool adoption.',
      },
    ],
  },
  {
    id: 'entrepreneurship',
    title: 'Stage 4: Entrepreneurship & Product Creation',
    goal: 'Learn how to validate, launch, and grow technology products.',
    whyItMatters:
      'This stage translates leadership and strategy into concrete product outcomes and venture execution.',
    courses: [
      {
        id: 'startup-course',
        title: 'How to Start a Startup',
        provider: 'Stanford',
        url: 'https://startupclass.samaltman.com/',
        reason: 'Covers venture fundamentals from idea validation to early scaling.',
      },
      {
        id: 'mit-entrepreneurship',
        title: 'Becoming an Entrepreneur',
        provider: 'MIT / edX',
        url: 'https://www.edx.org/course/becoming-an-entrepreneur',
        reason: 'Provides operational structure for turning ideas into executable business plans.',
      },
      {
        id: 'harvard-entrepreneurship',
        title: 'Entrepreneurship in Emerging Economies',
        provider: 'Harvard / edX',
        url: 'https://www.edx.org/course/entrepreneurship-in-emerging-economies',
        reason: 'Adds market context, resource constraints, and systems-level venture thinking.',
      },
      {
        id: 'product-creation',
        title: 'Product & Service Creation in the Internet Age',
        provider: 'MIT Sloan / edX',
        url: 'https://www.edx.org/course/product-design-the-delta-method',
        reason:
          'Strengthens product design and iterative solution development in modern internet markets.',
      },
    ],
  },
  {
    id: 'leadership',
    title: 'Stage 5: Leadership & Organizational Design',
    goal: 'Build the leadership capability to scale teams and outcomes.',
    whyItMatters:
      'Execution quality at scale depends on communication, team systems, and organizational trust.',
    courses: [
      {
        id: 'social-capital',
        title: 'Managing Social and Human Capital',
        provider: 'Wharton / Coursera',
        url: 'https://www.coursera.org/learn/wharton-social-human-capital',
        reason: 'Develops strong people systems for hiring, retention, and capability growth.',
      },
      {
        id: 'leading-teams',
        title: 'Leading People and Teams',
        provider: 'University of Michigan / Coursera',
        url: 'https://www.coursera.org/specializations/leading-teams',
        reason: 'Builds practical leadership habits for cross-functional teams and delivery.',
      },
      {
        id: 'leadership-communication',
        title: 'Leadership Communication for Maximum Impact',
        provider: 'Northwestern / Coursera',
        url: 'https://www.coursera.org/learn/leadership-communication',
        reason:
          'Improves influence and clarity for alignment with leadership, peers, and stakeholders.',
      },
    ],
  },
]

export const topMbaSkills: Skill[] = [
  {
    name: 'Strategic Thinking',
    reason: 'Prioritize long-term advantage over short-term feature output.',
  },
  { name: 'Market Positioning', reason: 'Define who the product is for and why it wins.' },
  {
    name: 'Financial Literacy',
    reason: 'Interpret P&L, cost drivers, and profitability tradeoffs.',
  },
  {
    name: 'Capital Allocation',
    reason: 'Decide where time, money, and talent create highest return.',
  },
  {
    name: 'Product Strategy',
    reason: 'Connect roadmap choices to business goals and customer value.',
  },
  {
    name: 'Operational Excellence',
    reason: 'Design systems that are reliable, scalable, and efficient.',
  },
  {
    name: 'Decision-Making Under Uncertainty',
    reason: 'Move quickly with incomplete information and clear risk framing.',
  },
  {
    name: 'Data-Driven Leadership',
    reason: 'Use metrics to guide direction without losing product intuition.',
  },
  {
    name: 'Go-To-Market Design',
    reason: 'Link product delivery with adoption, retention, and revenue motion.',
  },
  {
    name: 'Entrepreneurial Execution',
    reason: 'Validate ideas, test hypotheses, and ship meaningful outcomes.',
  },
  {
    name: 'Organizational Leadership',
    reason: 'Build teams, structures, and incentives that compound performance.',
  },
  {
    name: 'Executive Communication',
    reason: 'Align diverse stakeholders through concise, high-trust messaging.',
  },
]

export const mbaCourses = mbaTracks.flatMap((track) => track.courses)

export const defaultMbaTrackerState: TrackerState = {
  completed: {},
  notes: {},
  updatedAt: null,
}
