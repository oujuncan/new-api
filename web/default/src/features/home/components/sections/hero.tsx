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

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

const PROVIDERS = ['OpenAI', 'Claude', 'Gemini', 'DeepSeek', 'Qwen'] as const

export function Hero(props: HeroProps) {
  const { t } = useTranslation()

  return (
    <section className='relative z-10 flex flex-col items-center overflow-hidden px-6 pt-28 pb-20 md:pt-40 md:pb-28'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10 opacity-30 dark:opacity-[0.15]'
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% -10%, oklch(0.55 0.2 270 / 80%) 0%, transparent 70%)',
        }}
      />

      <div className='flex max-w-4xl flex-col items-center text-center'>
        <span
          className='landing-animate-fade-up border-border/60 bg-muted/40 text-muted-foreground mb-8 inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide'
          style={{ animationDelay: '0ms' }}
        >
          {t('Enterprise AI Resource Provider')} ·{' '}
          {t('homepage.hero.stat.providers')} ·{' '}
          {t('homepage.hero.stat.models')}
        </span>

        <h1
          className='landing-animate-fade-up text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.1] font-bold tracking-tight opacity-0'
          style={{ animationDelay: '80ms' }}
        >
          {t('One Platform, Access')}
          <br />
          <span className='bg-gradient-to-r from-blue-400 via-violet-400 to-purple-500 bg-clip-text text-transparent'>
            {t('All Global AI Models')}
          </span>
        </h1>

        <div
          className='landing-animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3 opacity-0'
          style={{ animationDelay: '160ms' }}
        >
          {PROVIDERS.map((name) => (
            <span
              key={name}
              className='text-foreground/60 text-sm font-semibold tracking-tight'
            >
              {name}
            </span>
          ))}
        </div>

        <div
          className='landing-animate-fade-up mt-10 flex items-center gap-3 opacity-0'
          style={{ animationDelay: '240ms' }}
        >
          {props.isAuthenticated ? (
            <Button
              className='group rounded-lg'
              render={<Link to='/dashboard' />}
            >
              {t('Go to Dashboard')}
              <ArrowRight className='ml-1 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Button>
          ) : (
            <>
              <Button
                className='group rounded-lg'
                render={<Link to='/sign-up' />}
              >
                {t('Get Started')}
                <ArrowRight className='ml-1 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Button>
              <Button
                variant='outline'
                className='border-border/50 hover:border-border hover:bg-muted/50 rounded-lg'
                render={<Link to='/pricing' />}
              >
                {t('View Pricing')}
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
