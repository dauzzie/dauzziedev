import { ChangeEvent } from 'react'
import { defaultMbaTrackerState, MBA_TRACKER_STORAGE_KEY } from './data'
import { TrackerState } from './types'

export function loadMbaTrackerState(): TrackerState {
  if (typeof window === 'undefined') {
    return defaultMbaTrackerState
  }

  try {
    const raw = window.localStorage.getItem(MBA_TRACKER_STORAGE_KEY)
    if (!raw) {
      return defaultMbaTrackerState
    }

    const parsed = JSON.parse(raw) as TrackerState
    return {
      completed: parsed.completed || {},
      notes: parsed.notes || {},
      updatedAt: parsed.updatedAt || null,
    }
  } catch {
    return defaultMbaTrackerState
  }
}

export function saveMbaTrackerState(tracker: TrackerState): TrackerState {
  if (typeof window === 'undefined') {
    return tracker
  }

  const nextState = {
    ...tracker,
    updatedAt: new Date().toISOString(),
  }

  window.localStorage.setItem(MBA_TRACKER_STORAGE_KEY, JSON.stringify(nextState))
  return nextState
}

export function resetMbaTrackerState(): TrackerState {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(MBA_TRACKER_STORAGE_KEY)
  }

  return defaultMbaTrackerState
}

export function toggleCourseCompletion(tracker: TrackerState, courseId: string): TrackerState {
  return {
    ...tracker,
    completed: {
      ...tracker.completed,
      [courseId]: !tracker.completed[courseId],
    },
  }
}

export function applyCourseNote(
  tracker: TrackerState,
  courseId: string,
  event: ChangeEvent<HTMLTextAreaElement>
): TrackerState {
  const value = event.target.value

  return {
    ...tracker,
    notes: {
      ...tracker.notes,
      [courseId]: value,
    },
  }
}
