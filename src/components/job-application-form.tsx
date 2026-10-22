'use client'

import { SubmitEvent, useState, useTransition } from 'react'
import { CircleCheck, Loader2 } from 'lucide-react'

import { submitJobApplication } from '@/app/[locale]/(frontend)/website/careers/actions'
import {
  fieldClassName,
  labelClassName,
  submitButtonClassName,
  textareaClassName,
} from '@/components/form-styles'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

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
      <div
        className="flex items-start gap-3 rounded-xl bg-primary/10 p-4 text-[15px] text-foreground"
        role="status"
      >
        <CircleCheck className="mt-0.5 size-5 shrink-0 text-primary" />
        Thank you for your application. We&apos;ll be in touch.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="name" className={labelClassName}>
            Full name
          </FieldLabel>
          <Input
            className={fieldClassName}
            id="name"
            name="fullName"
            autoComplete="name"
            placeholder="Your name"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email" className={labelClassName}>
            Email
          </FieldLabel>
          <Input
            className={fieldClassName}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="reason" className={labelClassName}>
            5 reasons why you want to learn SEO
          </FieldLabel>
          <Textarea
            className={textareaClassName}
            id="reason"
            name="message"
            placeholder="Tell us a bit about yourself…"
            required
          />
        </Field>
        {error && <FieldError>{error}</FieldError>}
        <Button
          type="submit"
          disabled={isPending}
          className={cn(submitButtonClassName, 'w-full text-white')}
        >
          {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {isPending ? 'Sending…' : 'Apply now'}
        </Button>
      </FieldGroup>
    </form>
  )
}
