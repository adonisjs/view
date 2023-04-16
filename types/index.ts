/*
 * @adonisjs/view
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import type { EdgeContract, EdgeRendererContract } from 'edge.js'

export interface ViewContract extends EdgeContract {}
export interface ViewRendererContract extends EdgeRendererContract {}

export type {
  TagContract,
  ParserContract,
  EdgeBufferContract,
  TagTokenContract,
  TemplateConstructorContract,
} from 'edge.js'

export * from './container.js'
export * from './context.js'
