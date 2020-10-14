/*
 * @adonisjs/view
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EdgeContract } from 'edge.js'
import { ViewContract } from '@ioc:Adonis/Core/View'
import { RouterContract } from '@ioc:Adonis/Core/Route'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { HttpContextConstructorContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * View provider to register view to the application
 */
export default class ViewProvider {
	constructor(protected app: ApplicationContract) {}
	public static needsApplication = true

	/**
	 * Add globals for resolving routes
	 */
	private addRouteGlobal(View: EdgeContract, Route: RouterContract) {
		/**
		 * Adding `route` global
		 */
		View.global('route', (routeIdentifier: string, options?: any, domain?: string) => {
			const url = Route.makeUrl(routeIdentifier, options, domain)

			/**
			 * Raise error when unable to lookup view.
			 */
			if (!url) {
				throw new Error(`Unable to lookup route "${routeIdentifier}"`)
			}

			return url
		})

		/**
		 * Adding `signedRoute` global
		 */
		View.global('signedRoute', (routeIdentifier: string, options?: any, domain?: string) => {
			const url = Route.makeSignedUrl(routeIdentifier, options, domain)
			if (!url) {
				throw new Error(`Unable to lookup route "${routeIdentifier}"`)
			}
			return url
		})
	}

	/**
	 * Share application reference
	 */
	private addAppGlobal(View: EdgeContract, Application: ApplicationContract) {
		View.global('app', Application)
	}

	/**
	 * Registering the brisk route to render view directly from the route.
	 */
	private registerBriskRoute(Route: RouterContract) {
		Route.BriskRoute.macro('render', function renderView(template: string, data?: any) {
			return this.setHandler(({ view }: { view: ViewContract }) => {
				return view.render(template, data)
			}, 'render')
		})
	}

	/**
	 * Registering the http context getter to access an isolated
	 * view instance with the request and route.
	 */
	private registerHTTPContextGetter(
		HttpContext: HttpContextConstructorContract,
		View: ViewContract
	) {
		HttpContext.getter(
			'view',
			function () {
				return View.share({ request: this.request, route: this.route })
			},
			true
		)
	}

	/**
	 * Register view binding
	 */
	public register() {
		this.app.container.singleton('Adonis/Core/View', () => {
			const Env = this.app.container.use('Adonis/Core/Env')
			const { Edge } = require('edge.js')

			/**
			 * Decide whether or not to cache views. If a user opts to remove
			 * the valdation, then `CACHE_VIEWS` will be a string and not
			 * a boolean, so we need to handle that case
			 */
			let cacheViews = Env.get('CACHE_VIEWS')
			if (typeof cacheViews === 'string') {
				cacheViews = cacheViews === 'true'
			}

			const edge = (new Edge({ cache: cacheViews }) as unknown) as ViewContract
			edge.mount(this.app.viewsPath())
			return edge
		})
	}

	/**
	 * Setup view on boot
	 */
	public boot() {
		/**
		 * Register repl binding
		 */
		if (this.app.environment === 'repl') {
			this.app.container.with(['Adonis/Addons/Repl'], (Repl) => {
				const { defineReplBindings } = require('../src/Bindings/Repl')
				defineReplBindings(this.app, Repl)
			})
		}

		this.app.container.with(
			['Adonis/Core/Route', 'Adonis/Core/View', 'Adonis/Core/HttpContext'],
			(Route, View, HttpContext) => {
				this.addRouteGlobal(View, Route)
				this.addAppGlobal(View, this.app)

				const { GLOBALS } = require('edge.js')
				Object.keys(GLOBALS).forEach((key) => View.global(key, GLOBALS[key]))

				this.registerBriskRoute(Route)
				this.registerHTTPContextGetter(HttpContext, View)
			}
		)
	}
}
