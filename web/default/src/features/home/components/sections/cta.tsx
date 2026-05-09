/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { AnimateInView } from '@/components/animate-in-view'

interface CTAProps {
  className?: string
  isAuthenticated?: boolean
}

export function CTA(props: CTAProps) {
  const { t } = useTranslation()

  if (props.isAuthenticated) {
    return null
  }

  return (
    <section className='relative z-10 overflow-hidden px-6 py-24 md:py-32'>
      {/* Gradient mesh background */}
      <div
        aria-hidden
        className='absolute inset-0 -z-10 opacity-20 dark:opacity-[0.08]'
        style={{
          background: [
            'radial-gradient(ellipse 50% 50% at 30% 50%, oklch(0.7 0.15 250 / 70%) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 40% at 70% 40%, oklch(0.65 0.12 200 / 50%) 0%, transparent 70%)',
          ].join(', '),
        }}
      />

      <AnimateInView
        className='mx-auto max-w-2xl text-center'
        animation='scale-in'
      >
        <h2 className='text-2xl leading-tight font-bold tracking-tight md:text-3xl'>
          {t("Don't let AI model capabilities")}
          <br />
          <span className='bg-gradient-to-r from-blue-400 via-violet-400 to-purple-500 bg-clip-text text-transparent'>
            {t('become a bottleneck for your growth')}
          </span>
        </h2>
        <p className='text-muted-foreground mx-auto mt-4 max-w-md text-sm leading-relaxed md:text-base'>
          {t(
            'The preferred AI Token aggregation platform for enterprises'
          )}
        </p>
        <div className='text-muted-foreground mx-auto mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm'>
          <span className='flex items-center gap-1.5'>
            <span className='inline-block size-1.5 rounded-full bg-emerald-500' />
            {t('Bulk Procurement')}
          </span>
          <span className='flex items-center gap-1.5'>
            <span className='inline-block size-1.5 rounded-full bg-blue-500' />
            {t('Technical Support')}
          </span>
          <span className='flex items-center gap-1.5'>
            <span className='inline-block size-1.5 rounded-full bg-violet-500' />
            {t('Tax Compliance')}
          </span>
        </div>
        <div className='mt-8 flex items-center justify-center gap-3'>
          <Button className='group rounded-lg' render={<Link to='/sign-up' />}>
            {t('Get Started Now')}
            <ArrowRight className='ml-1 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Button>
          <Button
            variant='outline'
            className='border-border/50 hover:border-border hover:bg-muted/50 rounded-lg'
            render={<Link to='/pricing' />}
          >
            {t('View Pricing')}
          </Button>
        </div>
      </AnimateInView>
    </section>
  )
}
