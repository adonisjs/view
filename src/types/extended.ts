/*
 * @adonisjs/view
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ViewContract, ViewRendererContract } from './main.js'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    view: ViewContract
  }
}

declare module '@adonisjs/core/http' {
  /**
   * Decorate context
   */
  interface HttpContext {
    view: ViewRendererContract
  }

  /**
   * Decorate router
   */
  interface BriskRoute {
    render: (template: string, data?: any) => Exclude<this['route'], null>
  }
}
