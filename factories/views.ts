/*
 * @adonisjs/view
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Edge } from 'edge.js'

/**
 * View Factory to create a new instance of view
 * for testing purposes
 */
export class ViewFactory {
  create() {
    return new Edge()
  }
}
