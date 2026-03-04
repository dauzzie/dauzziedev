import type { NextApiRequest, NextApiResponse } from 'next'
import { SITE_ACCESS_COOKIE, isPasswordProtectionEnabled } from '@/lib/auth'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isPasswordProtectionEnabled()) {
    return res.status(503).json({ error: 'Password protection is not configured' })
  }

  const { password } = req.body as { password?: string }
  if (!password || password !== process.env.SITE_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `${SITE_ACCESS_COOKIE}=${process.env.SITE_ACCESS_TOKEN}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${secure}`
  )
  return res.status(200).json({ ok: true })
}
