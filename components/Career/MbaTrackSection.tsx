import { ChangeEvent } from 'react'
import { Track, TrackerState } from '@/lib/career/mba/types'

type MbaTrackSectionProps = {
  track: Track
  tracker: TrackerState
  onToggleCourse: (courseId: string) => void
  onUpdateNote: (courseId: string, event: ChangeEvent<HTMLTextAreaElement>) => void
}

export default function MbaTrackSection({
  track,
  tracker,
  onToggleCourse,
  onUpdateNote,
}: MbaTrackSectionProps) {
  return (
    <article className="apple-glass-card p-6 md:p-8">
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
                  onChange={() => onToggleCourse(course.id)}
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
              onChange={(event) => onUpdateNote(course.id, event)}
              placeholder="Write your notes, takeaways, or action items..."
              className="mt-3 h-24 w-full rounded-xl border border-gray-300/80 bg-white/80 p-3 text-sm text-gray-900 shadow-sm focus:border-primary-400 focus:outline-none dark:border-gray-600/80 dark:bg-gray-900/60 dark:text-gray-100"
            />
          </div>
        ))}
      </div>
    </article>
  )
}
