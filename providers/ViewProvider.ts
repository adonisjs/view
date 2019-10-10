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
import { RouterContract } from '@ioc:Adonis/Core/Route'

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
      'Adonis/Core/Server',
      'Adonis/Core/Route',
      'Adonis/Core/View',
    ], (Server, Route: RouterContract, View: Edge) => {
      Server.hooks.before((ctx) => {
        ctx.view = View.share({
          request: ctx.request,
          user: ctx.auth ? ctx.auth.user : null,
          route: Route.makeUrl.bind(Route),
          signedRoute: Route.makeSignedUrl.bind(Route),
        })
      })
    })
  }
}
