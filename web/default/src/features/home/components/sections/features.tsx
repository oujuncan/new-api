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
import { KeyRound, Code, Shield, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSystemConfig } from '@/hooks/use-system-config'
import { AnimateInView } from '@/components/animate-in-view'

export function Features() {
  const { t } = useTranslation()
  const { systemName } = useSystemConfig()

  const features = [
    {
      icon: <KeyRound className='size-5' strokeWidth={1.5} />,
      title: t('Global Model Unified Access'),
      desc: t(
        'One platform covering ChatGPT, Claude, Gemini, DeepSeek, Qwen and more — text, image, and video capabilities all supported.'
      ),
      accent: 'text-emerald-600 dark:text-emerald-400',
      accentBg: 'bg-emerald-500/10 border-emerald-500/20',
      span: 'md:col-span-1',
      visual: (
        <div className='mt-5 flex flex-wrap gap-1.5'>
          {['OpenAI', 'Claude', 'Gemini', 'DeepSeek', 'Qwen', 'Llama'].map(
            (name) => (
              <span
                key={name}
                className='border-border/30 bg-muted/30 text-muted-foreground rounded-md border px-2 py-1 text-[10px] font-medium'
              >
                {name}
              </span>
            )
          )}
        </div>
      ),
    },
    {
      icon: <Code className='size-5' strokeWidth={1.5} />,
      title: t('One Key for All Models'),
      desc: t(
        'Call all models with a single API key — no need to maintain multiple accounts and credential systems.'
      ),
      accent: 'text-violet-600 dark:text-violet-400',
      accentBg: 'bg-violet-500/10 border-violet-500/20',
      span: 'md:col-span-1',
    },
    {
      icon: <Shield className='size-5' strokeWidth={1.5} />,
      title: t('Enterprise Stability & Control'),
      desc: t(
        '99.9% service availability with token-level permissions and budget control for every call.'
      ),
      accent: 'text-amber-600 dark:text-amber-400',
      accentBg: 'bg-amber-500/10 border-amber-500/20',
      span: 'md:col-span-1',
    },
    {
      icon: <Zap className='size-5' strokeWidth={1.5} />,
      title: t('Plug and Play Integration'),
      desc: t(
        'Natively supports Cherry Studio, Lobe Chat, OpenCat and 8+ mainstream clients — ready to use out of the box.'
      ),
      accent: 'text-cyan-600 dark:text-cyan-400',
      accentBg: 'bg-cyan-500/10 border-cyan-500/20',
      span: 'md:col-span-3',
    },
  ]

  return (
    <section className='relative z-10 px-6 py-24 md:py-32'>
      <div className='mx-auto max-w-6xl'>
        <AnimateInView className='mb-14 text-center'>
          <h2 className='text-2xl leading-tight font-bold tracking-tight md:text-3xl'>
            {t('Why choose')} {systemName || 'New API'}
          </h2>
          <p className='text-muted-foreground mt-3 text-sm'>
            {t(
              'One-stop solution for multi-model integration challenges'
            )}
          </p>
        </AnimateInView>

        <div className='grid gap-4 md:grid-cols-3'>
          {features.map((f, i) => (
            <AnimateInView
              key={f.title}
              delay={i * 100}
              animation='scale-in'
              className={`border-border/40 bg-card rounded-2xl border p-6 transition-colors duration-300 hover:bg-muted/30 dark:bg-muted/10 dark:hover:bg-muted/20 md:p-8 ${f.span}`}
            >
              <div
                className={`mb-4 flex size-10 items-center justify-center rounded-xl border ${f.accentBg}`}
              >
                <span className={f.accent}>{f.icon}</span>
              </div>
              <h3 className={`mb-2 text-base font-semibold ${f.accent}`}>
                {f.title}
              </h3>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {f.desc}
              </p>
              {f.visual}
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
