const siteMetadata = {
  title: 'Dausi Husaini',
  author: 'Dausi Husaini',
  headerTitle: 'dauzzie',
  description: 'Senior software engineer building systems, automation, and resilient products.',
  slogan:
    'Designing secure macOS systems, modernizing legacy code, and accelerating reliable releases at scale.',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://dauzzie.dev/',
  siteRepo: 'https://github.com/dauzzie/dauzziedev',
  siteLogo: '/static/images/logo.png',
  resumeUrl: '/static/resume/muhamad-firdaus-husaini-2026-mar.pdf',
  image: '/static/images/avatar.webp',
  socialBanner: '/static/images/twitter-card.png',
  email: 'dausihunts@gmail.com',
  github: 'https://github.com/dauzzie',
  // twitter: 'https://twitter.com/dalelarroder',
  // facebook: 'https://facebook.com/dlarroder',
  linkedin: 'https://www.linkedin.com/in/m-husaini',
  spotify: 'https://open.spotify.com/user/dauzzie',
  steam: 'https://steamcommunity.com/id/jerome/',
  locale: 'en-US',
  comment: {
    provider: 'giscus',
    giscusConfig: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO || '',
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID || '',
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || '',
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '',
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
    },
  },
}

module.exports = siteMetadata
