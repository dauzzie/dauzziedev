import Link from 'next/link'

type CareerTabsProps = {
  active: 'career' | 'mba'
}

export default function CareerTabs({ active }: CareerTabsProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link
        href="/career"
        className={active === 'career' ? 'apple-button-primary' : 'apple-button-secondary'}
      >
        Career
      </Link>
      <Link
        href="/career/mba"
        className={active === 'mba' ? 'apple-button-primary' : 'apple-button-secondary'}
      >
        MBA
      </Link>
    </div>
  )
}
