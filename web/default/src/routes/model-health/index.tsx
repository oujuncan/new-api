import { createFileRoute } from '@tanstack/react-router'
import { ModelHealth } from '@/features/model-health'

export const Route = createFileRoute('/model-health/')({
  component: ModelHealth,
})
