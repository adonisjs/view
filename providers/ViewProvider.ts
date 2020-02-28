/*
 * @adonisjs/view
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { IocContract } from '@adonisjs/fold'
import { Edge, EdgeContract } from 'edge.js'
import applyGlobals from 'edge.js/build/src/Edge/globals'

import { RouterContract } from '@ioc:Adonis/Core/Route'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { ViewContract, ContextContract } from '@ioc:Adonis/Core/View'
import { HttpContextConstructorContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * View provider to register view to the application
 */
export default class ViewProvider {
  constructor (protected $container: IocContract) {}

  /**
   * Add globals for resolving routes
   */
  private addRouteGlobal (View: EdgeContract, Route: RouterContract) {
    /**
     * Adding `route` global
     */
    View.global('route', (
      ctx: ContextContract,
      routeIdentifier: string,
      options?: any,
      domain?: string,
    ) => {
      const url = Route.makeUrl(routeIdentifier, options, domain)

      /**
       * Raise error when unable to lookup view.
       */
      if (!url) {
        const filename = ctx.resolve('$filename')
        throw new Error(
          `Unable to lookup route "${routeIdentifier}" referenced by "${filename}" template`,
        )
      }

      return url
    })

    /**
     * Adding `signedRoute` global
     */
    View.global('signedRoute', (
      ctx: ContextContract,
      routeIdentifier: string,
      options?: any,
      domain?: string,
    ) => {
      const url = Route.makeSignedUrl(routeIdentifier, options, domain)
      if (!url) {
        const filename = ctx.resolve('$filename')
        throw new Error(
          `Unable to lookup route "${routeIdentifier}" referenced by "${filename}" template`,
        )
      }

      return url
    })
  }

  /**
   * Share application reference
   */
  private addAppGlobal (View: EdgeContract, Application: ApplicationContract) {
    View.global('app', Application)
  }

  /**
   * Registering the brisk route to render view directory
   * from the route.
   */
  private registerBriskRoute (Route: RouterContract) {
    Route.BriskRoute.macro('render', function renderView (template: string, data?: any) {
      this.setHandler(({ view }: { view: ViewContract }) => {
        return view.render(template, data)
      }, 'render')

      return this
    })
  }

  /**
   * Registering the http context getter to access an isolated
   * view instance with the request and route.
   */
  private registerHTTPContextGetter (
    HttpContext: HttpContextConstructorContract,
    View: ViewContract,
  ) {
    HttpContext.getter('view', function () {
      return View.share({ request: this.request, route: this.route })
    }, true)
  }

  /**
   * Register view binding
   */
  public register () {
    this.$container.singleton('Adonis/Core/View', () => {
      const Env = this.$container.use('Adonis/Core/Env')
      const Application = this.$container.use('Adonis/Core/Application')
      const edge = new Edge({ cache: Env.get('CACHE_VIEWS') })
      edge.mount(Application.viewsPath())
      return edge
    })
  }

  /**
   * Setup view on boot
   */
  public boot () {
    this.$container.with([
      'Adonis/Core/Route',
      'Adonis/Core/View',
      'Adonis/Core/HttpContext',
      'Adonis/Core/Application',
    ], (
      Route: RouterContract,
      View: Edge,
      HttpContext: HttpContextConstructorContract,
      Application: ApplicationContract,
    ) => {
      this.addRouteGlobal(View, Route)
      this.addAppGlobal(View, Application)
      applyGlobals(View)

      this.registerBriskRoute(Route)
      this.registerHTTPContextGetter(HttpContext, View)
    })
  }
}
