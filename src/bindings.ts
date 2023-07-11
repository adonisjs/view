/*
 * @adonisjs/view
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Repl } from '@adonisjs/core/repl'
import { ApplicationService } from '@adonisjs/core/types'

/**
 * Define repl bindings. The method must be invoked when application environment
 * is set to repl.
 */
export function defineReplBindings(app: ApplicationService, repl: Repl) {
  repl.addMethod(
    'loadView',
    async () => {
      repl.server!.context.view = await app.container.make('view')
      repl.notify(
        `Loaded view service. You can access it using the "${repl.colors.underline(
          'view'
        )}" variable`
      )
    },
    { description: 'Load "view" service in the REPL context' }
  )
}
