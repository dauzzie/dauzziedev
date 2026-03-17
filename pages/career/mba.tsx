import CareerTabs from '@/components/Career/CareerTabs'
import MbaSkills from '@/components/Career/MbaSkills'
import MbaStats from '@/components/Career/MbaStats'
import MbaTrackSection from '@/components/Career/MbaTrackSection'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import MainLayout from '@/layouts/MainLayout'
import { defaultMbaTrackerState, mbaCourses, mbaTracks, topMbaSkills } from '@/lib/career/mba/data'
import {
  applyCourseNote,
  loadMbaTrackerState,
  resetMbaTrackerState,
  saveMbaTrackerState,
  toggleCourseCompletion,
} from '@/lib/career/mba/tracker'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

export default function CareerMbaPage() {
  const [tracker, setTracker] = useState(defaultMbaTrackerState)
  const [hydrated, setHydrated] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setTracker(loadMbaTrackerState())
    setHydrated(true)
  }, [])

  const totalCourses = mbaCourses.length
  const completedCount = useMemo(
    () => mbaCourses.filter((course) => tracker.completed[course.id]).length,
    [tracker.completed]
  )
  const progressPct = totalCourses === 0 ? 0 : Math.round((completedCount / totalCourses) * 100)

  const handleToggleCourse = (courseId: string) => {
    setTracker((prev) => toggleCourseCompletion(prev, courseId))
    setIsDirty(true)
  }

  const handleUpdateNote = (courseId: string, event: ChangeEvent<HTMLTextAreaElement>) => {
    setTracker((prev) => applyCourseNote(prev, courseId, event))
    setIsDirty(true)
  }

  const handleSaveProgress = () => {
    setTracker((prev) => saveMbaTrackerState(prev))
    setIsDirty(false)
  }

  const handleResetProgress = () => {
    setTracker(resetMbaTrackerState())
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

          <CareerTabs active="mba" />

          <div className="mt-3">
            <Link
              href="/journal/2026-03-13-self-directed-tech-mba"
              className="apple-button-secondary"
            >
              Source Journal Post
            </Link>
          </div>

          <MbaStats
            totalCourses={totalCourses}
            completedCount={completedCount}
            progressPct={progressPct}
            updatedAt={tracker.updatedAt}
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSaveProgress}
              className="apple-button-primary"
              disabled={!hydrated}
            >
              Save Progress
            </button>
            <button
              type="button"
              onClick={handleResetProgress}
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

        <MbaSkills skills={topMbaSkills} />

        <section className="space-y-4">
          {mbaTracks.map((track) => (
            <MbaTrackSection
              key={track.id}
              track={track}
              tracker={tracker}
              onToggleCourse={handleToggleCourse}
              onUpdateNote={handleUpdateNote}
            />
          ))}
        </section>
      </div>
    </MainLayout>
  )
}
