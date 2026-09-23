'use client'

import { SubmitEvent, useState, useTransition } from 'react'
import { Mail, UserRound } from 'lucide-react'

import { submitJobApplication } from '@/app/[locale]/(frontend)/website/careers/actions'

export default function JobApplicationForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setError(null)

    startTransition(async () => {
      const result = await submitJobApplication(formData)
      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.error)
      }
    })
  }

  if (submitted) {
    return (
      <div className="rounded-lg bg-[#e2f6ed] p-[22px] text-lg leading-[1.4] text-[#217453]" role="status">Thank you for your application. We&apos;ll be in touch.</div>
    )
  }

  return (
    <form className="[&_label]:mb-[9px] [&_label]:block [&_label]:text-xs [&_label]:font-bold [&_label]:text-[#71717c]" onSubmit={handleSubmit}>
      <label htmlFor="name">FULL NAME</label>
      <div className="relative mb-[17px]"><UserRound aria-hidden="true" className="absolute left-[22px] top-1/2 size-[30px] -translate-y-1/2 text-[#777] stroke-[1.3]" /><input className="h-[59px] w-full rounded-[9px] border border-[#343440] bg-transparent px-4 pl-[72px] text-base text-[#2f2e3e] outline-none focus:border-[#42b889] focus:ring-2 focus:ring-[#42b889]/20" id="name" name="fullName" placeholder="e.g. Your name" required /></div>
      <label htmlFor="email">EMAIL</label>
      <div className="relative mb-[17px]"><Mail aria-hidden="true" className="absolute left-[22px] top-1/2 size-[30px] -translate-y-1/2 text-[#777] stroke-[1.3]" /><input className="h-[59px] w-full rounded-[9px] border border-[#343440] bg-transparent px-4 pl-[72px] text-base text-[#2f2e3e] outline-none focus:border-[#42b889] focus:ring-2 focus:ring-[#42b889]/20" id="email" name="email" type="email" placeholder="e.g. Text input" required /></div>
      <label htmlFor="reason">5 REASONS WHY YOU WANT TO LEARN SEO</label>
      <textarea className="min-h-[130px] w-full resize-y rounded-[9px] border border-[#343440] bg-transparent px-6 py-[19px] text-base text-[#2f2e3e] outline-none focus:border-[#42b889] focus:ring-2 focus:ring-[#42b889]/20" id="reason" name="message" placeholder="Text area input" required />
      <p className="my-[18px] mb-5 text-base text-[#6f6f7a]">Note: only shortlisted candidates will be contacted.</p>
      {error && <p className="mb-5 text-base text-red-600" role="alert">{error}</p>}
      <button className="h-[58px] w-full rounded-lg border-0 bg-[#42b889] text-base text-[#202933] transition-colors hover:bg-[#37aa7d] disabled:opacity-60" type="submit" disabled={isPending}>{isPending ? 'Sending…' : 'Apply'}</button>
    </form>
  )
}
