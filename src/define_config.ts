import { ViewConfig } from '../index.js'

/**
 * Define configuration for the view provider
 */
export function defineConfig(config: Partial<ViewConfig>) {
  const normalizedConfig = {
    cache: { enabled: true },
    ...config,
  }

  return normalizedConfig
}
