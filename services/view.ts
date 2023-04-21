/*
 * @adonisjs/view
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import app from '@adonisjs/core/services/app'
import { ViewContract } from '../src/types/main.js'

let view: ViewContract

/**
 * Returns a singleton instance of the view class
 * from the container
 */
await app.booted(async () => {
  view = await app.container.make('view')
})

export { view as default }
