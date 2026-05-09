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
import { useTranslation } from 'react-i18next'
import { getLobeIcon } from '@/lib/lobe-icon'
import { AnimateInView } from '@/components/animate-in-view'

const PROVIDERS = [
  { name: 'Anthropic', icon: 'Anthropic.Color' },
  { name: 'OpenAI', icon: 'OpenAI' },
  { name: 'Google', icon: 'Google.Color' },
  { name: 'DeepSeek', icon: 'DeepSeek.Color' },
  { name: 'Perplexity', icon: 'Perplexity.Color' },
  { name: '豆包', icon: 'Doubao.Color' },
  { name: '智谱 AI', icon: 'Zhipu.Color' },
  { name: '通义千问', icon: 'Qwen.Color' },
  { name: 'Kimi', icon: 'Kimi' },
  { name: 'MiniMax', icon: 'Minimax.Color' },
] as const

export function Providers() {
  const { t } = useTranslation()

  return (
    <section className='bg-muted/20 relative z-10 px-6 py-24 dark:bg-transparent md:py-32'>
      <div className='mx-auto max-w-6xl'>
        <AnimateInView className='mb-14 text-center'>
          <h2 className='text-2xl leading-tight font-bold tracking-tight md:text-3xl'>
            {t('Global AI Providers')}
          </h2>
          <p className='text-muted-foreground mt-3 text-sm'>
            {t(
              'Access leading model providers, covering text, code, reasoning, voice and more'
            )}
          </p>
        </AnimateInView>

        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5'>
          {PROVIDERS.map((provider, i) => (
            <AnimateInView
              key={provider.name}
              delay={i * 60}
              animation='scale-in'
              className='border-border/40 bg-card flex flex-col items-center gap-3 rounded-xl border p-6 transition-colors duration-300 hover:bg-muted/30 dark:bg-transparent dark:hover:bg-muted/20'
            >
              <span className='flex size-8 items-center justify-center'>
                {getLobeIcon(provider.icon, 32)}
              </span>
              <p className='text-muted-foreground text-sm'>{provider.name}</p>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
