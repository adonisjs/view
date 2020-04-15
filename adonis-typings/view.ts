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
    TagContract as BaseTagContract,
    EdgeContract as BaseEdgeContract,
    ContextContract as BaseContextContract,
  } from 'edge.js'

  export interface ViewContract extends BaseEdgeContract {}
  export interface TagContract extends BaseTagContract {}
  export interface ContextContract extends BaseContextContract {}

  const View: ViewContract
  export default View
}
