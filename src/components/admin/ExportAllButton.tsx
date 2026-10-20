'use client'

import { useEffect, useState } from 'react'

// Admin dashboard panel (admin.components.beforeDashboard) that downloads all
// data at once as a ZIP from GET /api/export-all (src/endpoints/exportAll.ts).
// Per-collection CSV/JSON import and export live in each list view's menu.
// Plain elements with Payload's admin button classes, since @payloadcms/ui
// isn't a direct dependency.

const fileName = (response: Response) =>
  response.headers.get('content-disposition')?.match(/filename="?([^";]+)"?/)?.[1] ??
  'conversion-century-export.zip'

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'export-all-spin 0.8s linear infinite', flexShrink: 0 }}
    >
      <style>{'@keyframes export-all-spin { to { transform: rotate(360deg) } }'}</style>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function ExportAllButton() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // The endpoint refuses non-admins anyway; this only hides the panel.
  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { user?: { role?: string } | null } | null) =>
        setIsAdmin(data?.user?.role === 'admin'),
      )
      .catch(() => setIsAdmin(false))
  }, [])

  if (!isAdmin) return null

  const exportAll = async () => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/export-all', { credentials: 'include' })
      if (!response.ok) throw new Error(`Export failed (${response.status})`)
      const url = URL.createObjectURL(await response.blob())
      const link = document.createElement('a')
      link.href = url
      link.download = fileName(response)
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--base)',
        marginBottom: 'calc(var(--base) * 2)',
        padding: 'var(--base)',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 'var(--style-radius-m)',
      }}
    >
      <div>
        <h4 style={{ margin: 0 }}>Export all data</h4>
        <p style={{ margin: 0, color: 'var(--theme-elevation-500)' }}>
          A ZIP with a JSON and a CSV file for every collection, in all locales. Use the list
          views&apos; menus to import or export a single collection.
        </p>
        {loading && (
          <p role="status" style={{ margin: 0, color: 'var(--theme-elevation-500)' }}>
            Collecting every collection — this can take a moment.
          </p>
        )}
        {error && (
          <p role="alert" style={{ margin: 0, color: 'var(--theme-error-500)' }}>
            {error}
          </p>
        )}
      </div>
      <button
        type="button"
        className={`btn btn--style-primary btn--size-medium btn--withoutPopup${
          loading ? ' btn--disabled' : ''
        }`}
        style={{
          margin: 0,
          cursor: loading ? 'not-allowed' : undefined,
          opacity: loading ? 0.7 : undefined,
        }}
        disabled={loading}
        aria-busy={loading}
        aria-disabled={loading}
        onClick={exportAll}
      >
        <span
          className="btn__content"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          {loading && <Spinner />}
          <span className="btn__label">{loading ? 'Exporting…' : 'Export all data'}</span>
        </span>
      </button>
    </div>
  )
}
