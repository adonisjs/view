/*
 * @adonisjs/view
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationService, HttpRouterService } from '@adonisjs/core/types'
import { ViewContract } from '../types/index.js'
import { BriskRoute, HttpContext } from '@adonisjs/core/http'

/**
 * View provider to register view to the application
 */
export default class ViewProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Add globals for resolving routes
   */
  #addRouteGlobal(view: ViewContract, router: HttpRouterService) {
    /**
     * Adding `route` global
     */
    view.global('route', (routeIdentifier: string, params?: any, options?: any) => {
      return router.makeUrl(routeIdentifier, params, options)
    })

    /**
     * Adding `signedRoute` global
     */
    view.global('signedRoute', (routeIdentifier: string, params?: any, options?: any) => {
      return router.makeSignedUrl(routeIdentifier, params, options)
    })
  }

  /**
   * Share application reference, a config and env variable with the
   * templates.
   */
  async #addGlobals(view: ViewContract) {
    const config = await this.app.container.make('config')

    view.global('app', this.app)
    view.global('config', (key: string, defaultValue?: any) => config.get(key, defaultValue))
  }

  /**
   * Copy globals exposed by Edge
   */
  async #copyEdgeGlobals(view: ViewContract) {
    const { GLOBALS } = (await import('edge.js')) as { GLOBALS: { [key: string]: any } }
    Object.keys(GLOBALS).forEach((key) => view.global(key, GLOBALS[key]))
  }

  /**
   * Registering the brisk route to render view directly from the route.
   */
  #registerBriskRoute() {
    BriskRoute.macro('render', function renderView(this: BriskRoute, template: string, data?: any) {
      return this.setHandler(({ view }: { view: ViewContract }) => {
        return view.render(template, data)
      })
    })
  }

  /**
   * Registering the http context getter to access an isolated
   * view instance with the request and route.
   */
  #registerHTTPContextGetter(view: ViewContract) {
    // Check if getter is already defined
    if (Object.getOwnPropertyDescriptor(HttpContext.prototype, 'view')) {
      return
    }

    HttpContext.getter(
      'view',
      function (this: HttpContext) {
        return view.share({ request: this.request }) as ViewContract
      },
      true
    )
  }

  /**
   * Decide whether or not to cache views.
   */
  async #shouldCacheViews(): Promise<boolean> {
    const config = await this.app.container.make('config')
    const cacheViews = config.get('views.cache', true)

    return cacheViews as boolean
  }

  /**
   * Register view binding
   */
  public register() {
    this.app.container.singleton('view', async () => {
      const { Edge } = await import('edge.js')
      const { Supercharged } = await import('edge-supercharged')

      const cacheViews = await this.#shouldCacheViews()

      const edge = new Edge({ cache: cacheViews })

      /**
       * Mount the views directory
       */
      edge.mount(this.app.viewsPath())

      /**
       * Enable recurring mode when not caching views, so that the
       * edge supercharged can re-scan components on each
       * render call
       */
      edge.use(new Supercharged().wire, { recurring: !cacheViews })

      return edge
    })
  }

  /**
   * Setup view on boot
   */
  public async boot() {
    const view = await this.app.container.make('view')
    const router = await this.app.container.make('router')

    /**
     * Registering globals
     */
    this.#addRouteGlobal(view, router)
    this.#addGlobals(view)
    this.#copyEdgeGlobals(view)

    /**
     * Registering the brisk route
     */
    this.#registerBriskRoute()

    /**
     * Registering isolated view renderer with the HTTP context
     */
    this.#registerHTTPContextGetter(view)
  }
}
