export const SITE_ACCESS_COOKIE = 'site_access'
export const POETRY_ACCESS_COOKIE = 'poetry_access'

export const isPasswordProtectionEnabled = () => {
  return Boolean(process.env.SITE_PASSWORD && process.env.SITE_ACCESS_TOKEN)
}

export const isPoetryProtectionEnabled = () => {
  return Boolean(process.env.POETRY_PASSWORD && process.env.POETRY_ACCESS_TOKEN)
}
