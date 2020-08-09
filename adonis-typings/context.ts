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

/**
 * Decorate context
 */
declare module '@ioc:Adonis/Core/HttpContext' {
	interface HttpContextContract {
		view: ViewContract
	}
}

/**
 * Decorate router
 */
declare module '@ioc:Adonis/Core/Route' {
	interface BriskRouteContract {
		render: (template: string, data?: any) => BriskRouteContract
	}
}
