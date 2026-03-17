type MbaStatsProps = {
  totalCourses: number
  completedCount: number
  progressPct: number
  updatedAt: string | null
}

export default function MbaStats({
  totalCourses,
  completedCount,
  progressPct,
  updatedAt,
}: MbaStatsProps) {
  return (
    <div className="mt-6 grid gap-3 md:grid-cols-4">
      <div className="rounded-2xl border border-gray-200/70 bg-white/60 p-4 dark:border-gray-700/80 dark:bg-gray-900/40">
        <p className="text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
          Courses
        </p>
        <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{totalCourses}</p>
      </div>
      <div className="rounded-2xl border border-gray-200/70 bg-white/60 p-4 dark:border-gray-700/80 dark:bg-gray-900/40">
        <p className="text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
          Completed
        </p>
        <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{completedCount}</p>
      </div>
      <div className="rounded-2xl border border-gray-200/70 bg-white/60 p-4 dark:border-gray-700/80 dark:bg-gray-900/40">
        <p className="text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
          Progress
        </p>
        <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{progressPct}%</p>
      </div>
      <div className="rounded-2xl border border-gray-200/70 bg-white/60 p-4 dark:border-gray-700/80 dark:bg-gray-900/40">
        <p className="text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
          Last Saved
        </p>
        <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
          {updatedAt ? new Date(updatedAt).toLocaleString() : 'Not saved yet'}
        </p>
      </div>
    </div>
  )
}
