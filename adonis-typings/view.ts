/*
 * @adonisjs/view
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Adonis/Core/View' {
	import { EdgeContract as BaseEdgeContract, ContextContract as BaseContextContract } from 'edge.js'

	export interface ViewContract extends BaseEdgeContract {}
	export interface ContextContract extends BaseContextContract {}

	export { TagContract, ParserContract, EdgeBufferContract, TagTokenContract } from 'edge.js'

	const View: ViewContract
	export default View
}
