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
import { UserRound, CircleDollarSign, KeyRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimateInView } from '@/components/animate-in-view'

export function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    {
      num: '1',
      title: t('Sign Up'),
      desc: t('Free to sign up, start using immediately'),
      icon: <UserRound className='size-5' strokeWidth={1.5} />,
      accent: 'text-blue-600 dark:text-blue-400',
      accentBg: 'bg-blue-500/10 border-blue-500/20',
      gradient: 'from-blue-50 dark:from-blue-500/10 via-violet-50/50 dark:via-violet-500/5 to-transparent',
    },
    {
      num: '2',
      title: t('Add Credits'),
      desc: t('Pay as you go, top up as needed'),
      icon: <CircleDollarSign className='size-5' strokeWidth={1.5} />,
      accent: 'text-teal-600 dark:text-teal-400',
      accentBg: 'bg-teal-500/10 border-teal-500/20',
      gradient: 'from-teal-50 dark:from-teal-500/10 via-cyan-50/50 dark:via-cyan-500/5 to-transparent',
    },
    {
      num: '3',
      title: t('Get Key & Start'),
      desc: t('Generate API Key, paste into your client and go'),
      icon: <KeyRound className='size-5' strokeWidth={1.5} />,
      accent: 'text-emerald-600 dark:text-emerald-400',
      accentBg: 'bg-emerald-500/10 border-emerald-500/20',
      gradient: 'from-emerald-50 dark:from-emerald-500/10 via-green-50/50 dark:via-green-500/5 to-transparent',
    },
  ]

  return (
    <section className='border-border/40 relative z-10 border-t px-6 py-24 md:py-32'>
      <div className='mx-auto max-w-6xl'>
        <AnimateInView className='mb-14 text-center'>
          <h2 className='text-2xl leading-tight font-bold tracking-tight md:text-3xl'>
            {t('Three Steps to Get Started')}
          </h2>
          <p className='text-muted-foreground mt-3 text-sm'>
            {t(
              'Complete integration in minutes, start calling global top AI models'
            )}
          </p>
        </AnimateInView>

        <div className='grid gap-4 md:grid-cols-3'>
          {steps.map((step, i) => (
            <AnimateInView
              key={step.num}
              delay={i * 120}
              animation='fade-up'
              className={`border-border/40 flex flex-col items-center rounded-2xl border bg-gradient-to-b ${step.gradient} p-8 text-center md:p-10`}
            >
              <div
                className={`mb-5 flex size-12 items-center justify-center rounded-2xl border ${step.accentBg}`}
              >
                <span className={step.accent}>{step.icon}</span>
              </div>
              <p
                className={`mb-2 text-xs font-bold tracking-widest uppercase ${step.accent}`}
              >
                STEP {step.num}
              </p>
              <h3 className='mb-2 text-base font-semibold'>{step.title}</h3>
              <p className='text-muted-foreground max-w-[200px] text-sm leading-relaxed'>
                {step.desc}
              </p>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
