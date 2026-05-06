import { type ComponentType, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  Search,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import dayjs from '@/lib/dayjs'
import { formatTokens } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ErrorState } from '@/components/error-state'
import { PublicLayout } from '@/components/layout'
import { LoadingState } from '@/components/loading-state'
import { getModelHealthHourlyLast24h } from './api'
import type {
  ModelHealthCell,
  ModelHealthHourlyResponse,
  ModelHealthHourlyRow,
  ModelHealthModel,
} from './types'

const HOUR_SECONDS = 3600

type HealthLevel = 'excellent' | 'good' | 'warning' | 'poor' | 'critical'

const HEALTH_LEVELS: Array<{
  key: HealthLevel
  label: string
  min: number
  className: string
}> = [
  {
    key: 'excellent',
    label: 'Excellent',
    min: 0.95,
    className: 'bg-emerald-500 dark:bg-emerald-400',
  },
  {
    key: 'good',
    label: 'Good',
    min: 0.8,
    className: 'bg-sky-500 dark:bg-sky-400',
  },
  {
    key: 'warning',
    label: 'Warning',
    min: 0.6,
    className: 'bg-amber-500 dark:bg-amber-400',
  },
  {
    key: 'poor',
    label: 'Poor',
    min: 0.2,
    className: 'bg-orange-600 dark:bg-orange-500',
  },
  {
    key: 'critical',
    label: 'Critical',
    min: 0,
    className: 'bg-rose-600 dark:bg-rose-500',
  },
]

const EMPTY_CELL_CLASS = 'bg-muted/70 ring-muted-foreground/10'

function getHealthLevel(rate: number): (typeof HEALTH_LEVELS)[number] {
  return HEALTH_LEVELS.find((level) => rate >= level.min) ?? HEALTH_LEVELS[4]
}

function formatPercentValue(value: number): string {
  if (!Number.isFinite(value)) return '-'
  return Intl.NumberFormat(undefined, {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value)
}

function buildHours(startHour: number, endHour: number): number[] {
  const hours: number[] = []
  for (let ts = startHour; ts < endHour; ts += HOUR_SECONDS) {
    hours.push(ts)
  }
  return hours.slice(-24)
}

function emptyCell(modelName: string, hourStartTs: number): ModelHealthCell {
  return {
    model_name: modelName,
    hour_start_ts: hourStartTs,
    success_requests: 0,
    error_requests: 0,
    total_requests: 0,
    success_slices: 0,
    total_slices: 0,
    success_rate: 0,
    success_tokens: 0,
    has_data: false,
  }
}

function buildModels(data?: ModelHealthHourlyResponse): {
  hours: number[]
  models: ModelHealthModel[]
} {
  if (!data) return { hours: [], models: [] }

  const hours = buildHours(data.start_hour, data.end_hour)
  const byModel = new Map<string, Map<number, ModelHealthHourlyRow>>()

  for (const row of data.rows) {
    if (!row.model_name) continue
    let modelRows = byModel.get(row.model_name)
    if (!modelRows) {
      modelRows = new Map()
      byModel.set(row.model_name, modelRows)
    }
    modelRows.set(row.hour_start_ts, row)
  }

  const models = [...byModel.entries()].map(([modelName, rowsByHour]) => {
    const cells = hours.map((hour) => {
      const row = rowsByHour.get(hour)
      return row ? { ...row, has_data: true } : emptyCell(modelName, hour)
    })
    const totals = cells.reduce(
      (acc, cell) => {
        acc.successTokens += cell.success_tokens
        acc.successSlices += cell.success_slices
        acc.totalSlices += cell.total_slices
        acc.totalRequests += cell.total_requests
        acc.errorRequests += cell.error_requests
        return acc
      },
      {
        successTokens: 0,
        successSlices: 0,
        totalSlices: 0,
        totalRequests: 0,
        errorRequests: 0,
      }
    )

    return {
      model_name: modelName,
      cells,
      success_tokens: totals.successTokens,
      success_slices: totals.successSlices,
      total_slices: totals.totalSlices,
      success_rate:
        totals.totalSlices > 0 ? totals.successSlices / totals.totalSlices : 0,
      total_requests: totals.totalRequests,
      error_requests: totals.errorRequests,
    }
  })

  models.sort((a, b) => {
    if (b.success_tokens !== a.success_tokens) {
      return b.success_tokens - a.success_tokens
    }
    return a.model_name.localeCompare(b.model_name)
  })

  return { hours, models }
}

export function ModelHealth() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const healthQuery = useQuery({
    queryKey: ['public-model-health-hourly-last24h'],
    queryFn: getModelHealthHourlyLast24h,
    refetchInterval: 60_000,
  })

  const { hours, models } = useMemo(
    () => buildModels(healthQuery.data),
    [healthQuery.data]
  )

  const filteredModels = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return models
    return models.filter((model) =>
      model.model_name.toLowerCase().includes(term)
    )
  }, [models, search])

  const summary = useMemo(() => {
    const successSlices = models.reduce(
      (sum, model) => sum + model.success_slices,
      0
    )
    const totalSlices = models.reduce(
      (sum, model) => sum + model.total_slices,
      0
    )
    const totalTokens = models.reduce(
      (sum, model) => sum + model.success_tokens,
      0
    )
    const healthyModels = models.filter(
      (model) => model.success_rate >= 0.8
    ).length
    return {
      modelCount: models.length,
      overallSuccessRate: totalSlices > 0 ? successSlices / totalSlices : 0,
      totalTokens,
      healthyModels,
    }
  }, [models])

  return (
    <PublicLayout showMainContainer={false}>
      <main className='mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-3 pt-20 pb-10 sm:px-6 lg:px-8'>
        <header className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
          <div className='max-w-3xl'>
            <Badge variant='outline' className='mb-3 rounded-sm'>
              {t('Public status')}
            </Badge>
            <h1 className='text-foreground text-3xl leading-tight font-semibold tracking-normal sm:text-4xl'>
              {t('Model Health')}
            </h1>
            <p className='text-muted-foreground mt-2 text-sm leading-6 sm:text-base'>
              {t(
                'Recent 24-hour model availability from live request logs, including successful and failed requests.'
              )}
            </p>
          </div>
          {healthQuery.data && (
            <div className='text-muted-foreground text-sm'>
              {t('Window')}: {formatHour(healthQuery.data.start_hour)} -{' '}
              {formatHour(healthQuery.data.end_hour)}
            </div>
          )}
        </header>

        {healthQuery.isLoading ? (
          <LoadingState message={t('Loading model health...')} />
        ) : healthQuery.isError ? (
          <ErrorState
            title={t('Failed to load model health')}
            description={
              healthQuery.error instanceof Error
                ? healthQuery.error.message
                : t('Request failed')
            }
            onRetry={() => healthQuery.refetch()}
          />
        ) : (
          <>
            <section className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
              <SummaryCard
                icon={Database}
                label={t('Monitored Models')}
                value={String(summary.modelCount)}
              />
              <SummaryCard
                icon={Activity}
                label={t('Overall Success Rate')}
                value={formatPercentValue(summary.overallSuccessRate)}
              />
              <SummaryCard
                icon={CheckCircle2}
                label={t('Healthy Models')}
                value={String(summary.healthyModels)}
              />
              <SummaryCard
                icon={Clock3}
                label={t('Successful Tokens')}
                value={formatTokens(summary.totalTokens)}
              />
            </section>

            <section className='bg-card rounded-lg border'>
              <div className='flex flex-col gap-4 border-b p-4 md:flex-row md:items-center md:justify-between'>
                <div>
                  <h2 className='text-foreground text-base font-semibold'>
                    {t('Hourly Health')}
                  </h2>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    {t(
                      'Success rate is calculated by active five-minute slices.'
                    )}
                  </p>
                </div>
                <div className='flex flex-col gap-3 md:flex-row md:items-center'>
                  <HealthLegend />
                  <div className='relative w-full md:w-64'>
                    <Search className='text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2' />
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder={t('Search models')}
                      className='pl-8'
                    />
                  </div>
                </div>
              </div>

              {filteredModels.length === 0 ? (
                <div className='text-muted-foreground flex min-h-48 flex-col items-center justify-center gap-2 p-8 text-center'>
                  <AlertTriangle className='size-5' />
                  <p className='text-sm'>{t('No model health data found')}</p>
                </div>
              ) : (
                <TooltipProvider delay={120}>
                  <div className='overflow-x-auto'>
                    <div className='min-w-[860px]'>
                      <div className='grid grid-cols-[minmax(220px,1fr)_repeat(24,24px)_88px] items-center gap-2 border-b px-4 py-3'>
                        <div className='text-muted-foreground text-xs font-medium'>
                          {t('Model')}
                        </div>
                        {hours.map((hour) => (
                          <div
                            key={hour}
                            className='text-muted-foreground text-center text-[10px] tabular-nums'
                          >
                            {dayjs(hour * 1000).format('HH')}
                          </div>
                        ))}
                        <div className='text-muted-foreground text-right text-xs font-medium'>
                          {t('24h')}
                        </div>
                      </div>

                      {filteredModels.map((model) => (
                        <ModelHealthRow key={model.model_name} model={model} />
                      ))}
                    </div>
                  </div>
                </TooltipProvider>
              )}
            </section>
          </>
        )}
      </main>
    </PublicLayout>
  )
}

function SummaryCard(props: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  const Icon = props.icon
  return (
    <Card className='rounded-lg'>
      <CardHeader className='pb-0'>
        <CardTitle className='text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-normal uppercase'>
          <Icon className='text-primary size-4' />
          {props.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-foreground text-2xl font-semibold tabular-nums'>
          {props.value}
        </div>
      </CardContent>
    </Card>
  )
}

function HealthLegend() {
  const { t } = useTranslation()
  return (
    <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
      {HEALTH_LEVELS.map((level) => (
        <span
          key={level.key}
          className='text-muted-foreground inline-flex items-center gap-1.5 text-xs'
        >
          <span className={cn('size-2.5 rounded-sm', level.className)} />
          {t(level.label)}
        </span>
      ))}
    </div>
  )
}

function ModelHealthRow({ model }: { model: ModelHealthModel }) {
  return (
    <div className='grid grid-cols-[minmax(220px,1fr)_repeat(24,24px)_88px] items-center gap-2 border-b px-4 py-3 last:border-b-0'>
      <div className='min-w-0'>
        <div className='text-foreground truncate text-sm font-medium'>
          {model.model_name}
        </div>
        <div className='text-muted-foreground mt-0.5 text-xs tabular-nums'>
          {formatTokens(model.success_tokens)}
        </div>
      </div>
      {model.cells.map((cell) => (
        <HealthCell
          key={`${cell.model_name}-${cell.hour_start_ts}`}
          cell={cell}
        />
      ))}
      <div className='text-right'>
        <div className='text-foreground text-sm font-semibold tabular-nums'>
          {formatPercentValue(model.success_rate)}
        </div>
        <div className='text-muted-foreground text-xs tabular-nums'>
          {model.total_requests}
        </div>
      </div>
    </div>
  )
}

function HealthCell({ cell }: { cell: ModelHealthCell }) {
  const { t } = useTranslation()
  const level = cell.has_data ? getHealthLevel(cell.success_rate) : null
  const className = cell.has_data ? level?.className : EMPTY_CELL_CLASS

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={`${cell.model_name} ${formatHour(cell.hour_start_ts)} ${formatPercentValue(cell.success_rate)}`}
        className={cn(
          'focus-visible:ring-ring size-6 rounded-[4px] ring-1 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:outline-none',
          className,
          cell.has_data ? 'ring-black/10 dark:ring-white/10' : ''
        )}
      />
      <TooltipContent side='top' className='block max-w-72'>
        <div className='space-y-1.5'>
          <div className='font-medium'>{cell.model_name}</div>
          <div className='text-background/80'>
            {formatHour(cell.hour_start_ts)}
          </div>
          <div className='grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[11px]'>
            <span>{t('Success Rate')}</span>
            <span className='text-right tabular-nums'>
              {cell.has_data
                ? formatPercentValue(cell.success_rate)
                : t('No data')}
            </span>
            <span>{t('Requests')}</span>
            <span className='text-right tabular-nums'>
              {cell.success_requests}/{cell.total_requests}
            </span>
            <span>{t('Slices')}</span>
            <span className='text-right tabular-nums'>
              {cell.success_slices}/{cell.total_slices}
            </span>
            <span>{t('Tokens')}</span>
            <span className='text-right tabular-nums'>
              {formatTokens(cell.success_tokens)}
            </span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

function formatHour(timestamp: number): string {
  return dayjs(timestamp * 1000).format('MMM D HH:00')
}
