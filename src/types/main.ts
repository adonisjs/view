/*
 * @adonisjs/view
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { EdgeContract, EdgeRendererContract } from 'edge.js/types'

export interface ViewContract extends EdgeContract {}
export interface ViewRendererContract extends EdgeRendererContract {}

/**
 * View service is a singleton view instance registered
 * to the container
 */
export interface ViewService extends ViewContract {}

/**
 * Config accepted by the view provider
 */
export type ViewConfig = {
  cache: {
    enabled: boolean
  }
}

export type {
  TagContract,
  ParserContract,
  EdgeBufferContract,
  TagTokenContract,
  TemplateConstructorContract,
} from 'edge.js/types'
