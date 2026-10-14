import { Clock, Cloud, FileCheck, Scale, Users, XCircle } from 'lucide-react'
import React from 'react'
import { cn } from 'cn'

interface DataItem {
  icon?: React.ReactNode
  /** Small text above the title, e.g. "01". */
  label?: string
  title: string
  description: string
}

const DATA: DataItem[] = [
  {
    icon: <Cloud strokeWidth={1.5} className="size-12" />,
    title: 'Boost Productivity',
    description:
      'Streamline your workflows and eliminate inefficiencies with our advanced task management tools.',
  },
  {
    icon: <XCircle strokeWidth={1.5} className="size-12" />,
    title: 'Minimize Errors',
    description:
      'Automate repetitive tasks to reduce human error and ensure consistent results.',
  },
  {
    icon: <Users strokeWidth={1.5} className="size-12" />,
    title: 'Enhance Collaboration',
    description:
      'Improve team communication and collaboration with real-time updates and shared workspaces.',
  },
  {
    icon: <Scale strokeWidth={1.5} className="size-12" />,
    title: 'Scale Seamlessly',
    description:
      'Grow your team and projects without hassle, thanks to flexible and scalable solutions.',
  },
  {
    icon: <FileCheck strokeWidth={1.5} className="size-12" />,
    title: 'Track Progress',
    description:
      'Stay on top of your goals with detailed progress tracking and actionable insights.',
  },
  {
    icon: <Clock strokeWidth={1.5} className="size-12" />,
    title: 'Save Time',
    description:
      'Focus on what matters most by automating time-consuming tasks and processes.',
  },
]

interface Timeline6Props {
  /** Left-column heading; defaults to the template's. Pass `null` to hide
   * the column and show the items full width. */
  heading?: React.ReactNode
  items?: DataItem[]
  className?: string
}

const Timeline6 = ({ heading, items = DATA, className }: Timeline6Props) => {
  return (
    <section className={className}>
      <div
        className={cn(
          heading !== null
            ? '-mt-8 sm:-mt-12'
            : // Full width without the heading: two items per row.
              'lg:grid lg:grid-cols-2 lg:gap-x-12',
        )}
      >
        {items.map((item, index) => (
              <div
                key={index}
                className="relative flex flex-col justify-center overflow-hidden border-b py-8 shadow-none sm:py-12"
              >
                <div className="flex gap-4 sm:gap-6">
                  {item.icon && <div className="shrink-0">{item.icon}</div>}
                  <div>
                    {item.label && (
                      <p className="mb-2 font-mono text-sm text-muted-foreground">
                        {item.label}
                      </p>
                    )}
                    <h4 className="mb-2 text-2xl font-semibold sm:text-3xl">
                      {item.title}
                    </h4>
                    <p className="mt-6 text-sm text-muted-foreground sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
    </section>
  )
}

export { Timeline6 }
