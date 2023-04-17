/*
 * @adonisjs/view
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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
