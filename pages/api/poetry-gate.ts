import type { NextApiRequest, NextApiResponse } from 'next'
import { POETRY_ACCESS_COOKIE, isPoetryProtectionEnabled } from '@/lib/auth'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isPoetryProtectionEnabled()) {
    return res.status(503).json({ error: 'Poetry protection is not configured' })
  }

  const { password } = req.body as { password?: string }
  if (!password || password !== process.env.POETRY_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `${POETRY_ACCESS_COOKIE}=${process.env.POETRY_ACCESS_TOKEN}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${secure}`
  )
  return res.status(200).json({ ok: true })
}
