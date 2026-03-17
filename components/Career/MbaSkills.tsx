import { Skill } from '@/lib/career/mba/types'

type MbaSkillsProps = {
  skills: Skill[]
}

export default function MbaSkills({ skills }: MbaSkillsProps) {
  return (
    <section className="apple-glass-card p-6 md:p-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 md:text-2xl">
        Top 12 MBA Skills
      </h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        These are the highest-leverage leadership and business capabilities this track is meant to
        build.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {skills.map((skill) => (
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
  )
}
