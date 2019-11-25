/*
 * @adonisjs/view
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { Edge } from 'edge.js'
import { IocContract } from '@adonisjs/fold'
import { ViewContract } from '@ioc:Adonis/Core/View'
import { RouterContract } from '@ioc:Adonis/Core/Route'
import { HttpContextConstructorContract } from '@ioc:Adonis/Core/HttpContext'

export default class ViewProvider {
  constructor (protected $container: IocContract) {}

  public register () {
    this.$container.singleton('Adonis/Core/View', () => {
      const Env = this.$container.use('Adonis/Core/Env')
      const Application = this.$container.use('Adonis/Core/Application')

      const edge = new Edge({
        cache: Env.get('CACHE_VIEWS'),
      })

      edge.mount(Application.viewsPath())
      return edge
    })
  }

  public boot () {
    this.$container.with([
      'Adonis/Core/Route',
      'Adonis/Core/View',
      'Adonis/Core/HttpContext',
    ], (Route: RouterContract, View: Edge, HttpContext: HttpContextConstructorContract) => {
      /**
       * Adding `route` global
       */
      View.global('route', (_ctx, routeIdentifier, options, domain) => {
        return Route.makeUrl(routeIdentifier, options, domain)
      })

      /**
       * Adding `signedRoute` global
       */
      View.global('signedRoute', (_ctx, routeIdentifier, options, domain) => {
        return Route.makeSignedUrl(routeIdentifier, options, domain)
      })

      /**
       * Adding render to the brisk route
       */
      Route.BriskRoute.macro('render', function renderView (template: string, data?: any) {
        this.setHandler(({ view }: { view: ViewContract }) => {
          return view.render(template, data)
        }, 'render')

        return this
      })

      /**
       * Adding view to the ctx
       */
      HttpContext.getter('view', function () {
        return View.share({
          request: this.request,
        })
      }, true)
    })
  }
}
