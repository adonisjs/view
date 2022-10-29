/*
 * @adonisjs/view
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ViewContract } from '@ioc:Adonis/Core/View'

export function defineViteDriverBindings(View: ViewContract) {
  /**
   * Inject a script needed for the HMR working with React
   */
  View.registerTag({
    tagName: 'viteReactRefresh',
    seekable: true,
    block: false,
    compile(_parser, buffer, token) {
      buffer.outputExpression(
        `state.assetsManager.driver.getReactHmrScript()`,
        token.filename,
        token.loc.start.line,
        false
      )
    },
  })

  /**
   * Inject the script needed for Vite HMR
   */
  View.registerTag({
    tagName: 'vite',
    seekable: false,
    block: false,
    compile(_parser, buffer, token) {
      buffer.outputExpression(
        `state.assetsManager.driver.getViteHmrScript()`,
        token.filename,
        token.loc.start.line,
        false
      )
    },
  })
}
