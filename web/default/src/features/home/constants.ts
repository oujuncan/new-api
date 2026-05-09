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
/**
 * Home page constants
 * All hardcoded data for home page sections
 */
import { type TFunction } from 'i18next'

// Layout - Main base classes
export const MAIN_BASE_CLASSES = 'bg-background text-foreground w-full'

// Hero section - AI Applications (Left side)
export const AI_APPLICATIONS = [
  'LobeHub.Color',
  'Dify.Color',
  'OpenWebUI',
  'Cline',
] as const

// Hero section - AI Models (Right side)
export const AI_MODELS = [
  'Qwen.Color',
  'DeepSeek.Color',
  'Doubao.Color',
  'OpenAI',
  'Claude.Color',
  'Gemini.Color',
] as const

// Hero section - Gateway Features
export const GATEWAY_FEATURES = [
  'Cost Tracking',
  'Model Access',
  'Guardrails',
  'Observability',
  'Budgets',
  'Load Balancing',
  'Rate Limiting',
  'Token Mgmt',
  'Prompt Caching',
  'Pass-Through',
] as const

// Stats section - Default statistics
export const DEFAULT_STATS = [
  {
    value: '10',
    suffix: '+',
    description: 'AI providers integrated',
  },
  {
    value: '200',
    suffix: '+',
    description: 'models available',
  },
  {
    value: '99.9',
    suffix: '%',
    description: 'service uptime',
  },
  {
    value: '50',
    suffix: '+',
    description: 'compatible API routes',
  },
] as const

// Features section - Default features
export const DEFAULT_FEATURES = [
  {
    title: 'Global Model Unified Access',
    description:
      'One platform covering ChatGPT, Claude, Gemini, DeepSeek, Qwen and more — text, image, and video capabilities all supported.',
    iconName: 'KeyRound',
  },
  {
    title: 'One Key for All Models',
    description:
      'Call all models with a single API key — no need to maintain multiple accounts and credential systems.',
    iconName: 'Code',
  },
  {
    title: 'Enterprise Stability & Control',
    description:
      '99.9% service availability with token-level permissions and budget control for every call.',
    iconName: 'Shield',
  },
  {
    title: 'Payment & Invoicing Compliance',
    description:
      'RMB settlement with official VAT invoices — solving the compliance and financial booking challenges of overseas AI services.',
    iconName: 'ReceiptText',
  },
  {
    title: 'Permission Isolation',
    description:
      'Different projects use independent tokens with clear boundaries',
    iconName: 'Lock',
  },
  {
    title: 'Cost Transparency',
    description:
      'Usage and costs are fully trackable, supporting allocation by department or project',
    iconName: 'Eye',
  },
  {
    title: 'Budget Control',
    description:
      'Per-member limits to prevent any single user or app from over-consuming',
    iconName: 'Wallet',
  },
  {
    title: 'Quick Troubleshooting',
    description:
      'Pinpoint anomaly spikes and error calls precisely by time dimension',
    iconName: 'Search',
  },
] as const

export function getGatewayFeatures(t: TFunction) {
  return GATEWAY_FEATURES.map((feature) => t(feature))
}

export function getDefaultStats(t: TFunction) {
  return DEFAULT_STATS.map((stat) => ({
    ...stat,
    description: stat.description ? t(stat.description) : undefined,
  }))
}

export function getDefaultFeatures(t: TFunction) {
  return DEFAULT_FEATURES.map((feature) => ({
    ...feature,
    title: t(feature.title),
    description: t(feature.description),
  }))
}
