import Link from 'next/link'

export function Topbar({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <div className="flex justify-end gap-4 bg-sky-600 px-4 py-1.5 text-sm sm:px-6 lg:px-8 dark:bg-sky-800">
      <Link
        href="/dashboard"
        className="font-medium text-white hover:text-sky-100"
      >
        Back to dashboard
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          className="font-medium text-white hover:text-sky-100"
        >
          Admin
        </Link>
      )}
    </div>
  )
}
