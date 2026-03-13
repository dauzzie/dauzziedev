export const SITE_ACCESS_COOKIE = 'site_access'
export const POETRY_ACCESS_COOKIE = 'poetry_access'
export const JOURNAL_ACCESS_COOKIE = 'journal_access'

export const isPasswordProtectionEnabled = () => {
  return Boolean(
    process.env.ENABLE_SITE_PASSWORD === 'true' &&
      process.env.SITE_PASSWORD &&
      process.env.SITE_ACCESS_TOKEN
  )
}

export const isPoetryProtectionEnabled = () => {
  return Boolean(
    process.env.ENABLE_POETRY_PASSWORD === 'true' &&
      process.env.POETRY_PASSWORD &&
      process.env.POETRY_ACCESS_TOKEN
  )
}

export const isJournalProtectionEnabled = () => {
  return Boolean(
    process.env.ENABLE_JOURNAL_PASSWORD === 'true' &&
      process.env.JOURNAL_PASSWORD &&
      process.env.JOURNAL_ACCESS_TOKEN
  )
}
