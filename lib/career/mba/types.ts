export type Course = {
  id: string
  title: string
  provider: string
  url: string
  reason: string
}

export type Track = {
  id: string
  title: string
  goal: string
  whyItMatters: string
  courses: Course[]
}

export type Skill = {
  name: string
  reason: string
}

export type TrackerState = {
  completed: Record<string, boolean>
  notes: Record<string, string>
  updatedAt: string | null
}
