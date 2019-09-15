/**
 * @adonisjs/view
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/// <reference path="./view.ts" />

import { ViewContract } from '@ioc:Adonis/Core/View'
declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    view: ViewContract,
  }
}
