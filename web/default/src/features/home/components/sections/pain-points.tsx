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
import { DollarSign, ShieldOff, LayoutList, FileWarning } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimateInView } from '@/components/animate-in-view'

export function PainPoints() {
  const { t } = useTranslation()

  const painPoints = [
    {
      icon: <DollarSign className='size-5' strokeWidth={1.5} />,
      title: t('Cost Pressure'),
      desc: t(
        'Purchasing at standard list prices with no bulk discounts — costs become hard to compress at scale'
      ),
      accent: 'text-muted-foreground bg-muted/30 border-border/50',
    },
    {
      icon: <ShieldOff className='size-5' strokeWidth={1.5} />,
      title: t('Service Disruption'),
      desc: t(
        'Self-managed accounts frequently trigger risk controls — bans and rate limits cause service interruptions affecting business continuity'
      ),
      accent: 'text-muted-foreground bg-muted/30 border-border/50',
    },
    {
      icon: <LayoutList className='size-5' strokeWidth={1.5} />,
      title: t('Scattered Management'),
      desc: t(
        'Multiple platform accounts are siloed — financial reconciliation is tedious and model switching costs are high'
      ),
      accent: 'text-muted-foreground bg-muted/30 border-border/50',
    },
    {
      icon: <FileWarning className='size-5' strokeWidth={1.5} />,
      title: t('Compliance Challenges'),
      desc: t(
        'Overseas providers cannot issue VAT invoices — enterprises face pressure on financial booking and compliance'
      ),
      accent: 'text-muted-foreground bg-muted/30 border-border/50',
    },
  ]

  return (
    <section className='relative z-10 px-6 py-24 md:py-32'>
      <div className='mx-auto max-w-6xl'>
        <AnimateInView className='mb-16 text-center'>
          <p className='text-muted-foreground mb-3 text-xs font-medium tracking-widest uppercase'>
            {t('Pain Points')}
          </p>
          <h2 className='text-2xl leading-tight font-bold tracking-tight md:text-3xl'>
            {t('Challenges enterprises face')}
            <br />
            <span className='text-muted-foreground'>
              {t('when adopting AI models')}
            </span>
          </h2>
          <p className='text-muted-foreground mx-auto mt-3 max-w-lg text-sm'>
            {t(
              'Especially with overseas mainstream AI services, enterprises commonly encounter these problems during integration'
            )}
          </p>
        </AnimateInView>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {painPoints.map((point, i) => (
            <AnimateInView
              key={point.title}
              delay={i * 100}
              animation='fade-up'
              className='group'
            >
              <div className='border-border/40 bg-background hover:border-border/60 flex h-full flex-col rounded-xl border p-6 transition-all duration-300 hover:shadow-sm'>
                <div
                  className={`mb-4 flex size-10 items-center justify-center rounded-lg border ${point.accent}`}
                >
                  {point.icon}
                </div>
                <h3 className='mb-2 text-sm font-semibold'>{point.title}</h3>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  {point.desc}
                </p>
              </div>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
