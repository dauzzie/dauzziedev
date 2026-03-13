import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import MainLayout from '@/layouts/MainLayout'
import Link from 'next/link'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'

type Course = {
  id: string
  title: string
  provider: string
  url: string
  reason: string
}

type Track = {
  id: string
  title: string
  goal: string
  whyItMatters: string
  courses: Course[]
}

type Skill = {
  name: string
  reason: string
}

type TrackerState = {
  completed: Record<string, boolean>
  notes: Record<string, string>
  updatedAt: string | null
}

const STORAGE_KEY = 'dauzzie_mba_tracker_v1'

const mbaTracks: Track[] = [
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

const topMbaSkills: Skill[] = [
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

const allCourses = mbaTracks.flatMap((track) => track.courses)

const defaultState: TrackerState = {
  completed: {},
  notes: {},
  updatedAt: null,
}

export default function CareerMbaPage() {
  const [tracker, setTracker] = useState<TrackerState>(defaultState)
  const [hydrated, setHydrated] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        setHydrated(true)
        return
      }

      const parsed = JSON.parse(raw) as TrackerState
      setTracker({
        completed: parsed.completed || {},
        notes: parsed.notes || {},
        updatedAt: parsed.updatedAt || null,
      })
    } catch {
      setTracker(defaultState)
    } finally {
      setHydrated(true)
    }
  }, [])

  const totalCourses = allCourses.length
  const completedCount = useMemo(
    () => allCourses.filter((course) => tracker.completed[course.id]).length,
    [tracker.completed]
  )
  const progressPct = totalCourses === 0 ? 0 : Math.round((completedCount / totalCourses) * 100)

  const toggleCourse = (courseId: string) => {
    setTracker((prev) => ({
      ...prev,
      completed: {
        ...prev.completed,
        [courseId]: !prev.completed[courseId],
      },
    }))
    setIsDirty(true)
  }

  const updateNote = (courseId: string, event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value
    setTracker((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [courseId]: value,
      },
    }))
    setIsDirty(true)
  }

  const saveProgress = () => {
    if (typeof window === 'undefined') return

    const nextState: TrackerState = {
      ...tracker,
      updatedAt: new Date().toISOString(),
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
    setTracker(nextState)
    setIsDirty(false)
  }

  const resetProgress = () => {
    if (typeof window === 'undefined') return

    window.localStorage.removeItem(STORAGE_KEY)
    setTracker(defaultState)
    setIsDirty(false)
  }

  return (
    <MainLayout>
      <PageSEO
        title={`MBA - ${siteMetadata.author}`}
        description="Self-directed MBA roadmap with saved progress."
      />
      <div className="space-y-8 pt-8 pb-10">
        <section className="apple-glass-card apple-glass-sheen p-6 md:p-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary-500 uppercase">
            Career Hub
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 md:text-5xl">
            Self-Directed Tech MBA
          </h1>
          <p className="mt-4 max-w-4xl text-sm text-gray-600 dark:text-gray-300 md:text-base">
            Full roadmap with structured reasoning, tracked progress, and personal notes. Built from
            your journal post and organized for practical weekly execution.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/career" className="apple-button-secondary">
              Career
            </Link>
            <Link href="/career/mba" className="apple-button-primary">
              MBA
            </Link>
            <Link href="/career/vision" className="apple-button-secondary">
              Vision
            </Link>
            <Link
              href="/journal/2026-03-13-self-directed-tech-mba"
              className="apple-button-secondary"
            >
              Source Journal Post
            </Link>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-gray-200/70 bg-white/60 p-4 dark:border-gray-700/80 dark:bg-gray-900/40">
              <p className="text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                Courses
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalCourses}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200/70 bg-white/60 p-4 dark:border-gray-700/80 dark:bg-gray-900/40">
              <p className="text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                Completed
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {completedCount}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200/70 bg-white/60 p-4 dark:border-gray-700/80 dark:bg-gray-900/40">
              <p className="text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                Progress
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {progressPct}%
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200/70 bg-white/60 p-4 dark:border-gray-700/80 dark:bg-gray-900/40">
              <p className="text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                Last Saved
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                {tracker.updatedAt ? new Date(tracker.updatedAt).toLocaleString() : 'Not saved yet'}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={saveProgress}
              className="apple-button-primary"
              disabled={!hydrated}
            >
              Save Progress
            </button>
            <button
              type="button"
              onClick={resetProgress}
              className="apple-button-secondary"
              disabled={!hydrated}
            >
              Reset
            </button>
            <p className="self-center text-sm text-gray-600 dark:text-gray-300">
              {isDirty ? 'Unsaved changes' : 'All changes saved locally in this browser'}
            </p>
          </div>
        </section>

        <section className="apple-glass-card p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 md:text-2xl">
            Top 12 MBA Skills
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            These are the highest-leverage leadership and business capabilities this track is meant
            to build.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {topMbaSkills.map((skill) => (
              <article
                key={skill.name}
                className="rounded-2xl border border-gray-200/70 p-4 dark:border-gray-700/80"
              >
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {skill.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{skill.reason}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          {mbaTracks.map((track) => (
            <article key={track.id} className="apple-glass-card p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 md:text-2xl">
                {track.title}
              </h2>
              <p className="mt-2 text-sm font-medium text-primary-500">Goal: {track.goal}</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{track.whyItMatters}</p>

              <div className="mt-5 space-y-4">
                {track.courses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-2xl border border-gray-200/70 bg-white/60 p-4 dark:border-gray-700/80 dark:bg-gray-900/40"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={Boolean(tracker.completed[course.id])}
                          onChange={() => toggleCourse(course.id)}
                        />
                        <span>{course.title}</span>
                      </label>
                      <span className="rounded-full border border-primary-300/50 px-2 py-1 text-xs text-primary-600 dark:text-primary-300">
                        {course.provider}
                      </span>
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-primary-500 underline decoration-primary-400/70 underline-offset-2"
                      >
                        Open course
                      </a>
                    </div>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{course.reason}</p>
                    <textarea
                      value={tracker.notes[course.id] || ''}
                      onChange={(event) => updateNote(course.id, event)}
                      placeholder="Write your notes, takeaways, or action items..."
                      className="mt-3 h-24 w-full rounded-xl border border-gray-300/80 bg-white/80 p-3 text-sm text-gray-900 shadow-sm focus:border-primary-400 focus:outline-none dark:border-gray-600/80 dark:bg-gray-900/60 dark:text-gray-100"
                    />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </MainLayout>
  )
}
