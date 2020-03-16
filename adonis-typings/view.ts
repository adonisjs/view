/*
 * @adonisjs/view
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

declare module '@ioc:Adonis/Core/View' {
  import {
    EdgeContract as BaseEdgeContract,
    TagContract as BaseTagContract,
    ContextContract,
  } from 'edge.js'

  export interface ViewContract extends BaseEdgeContract {
    utils: {
      withCtx (callback: (ctx: ContextContract, ...args: any[]) => any): void
      safeValue<T extends string> (value: T): { value: T }
    }
  }

  export interface TagContract extends BaseTagContract {}
  export { ContextContract }

  const View: ViewContract
  export default View
}
