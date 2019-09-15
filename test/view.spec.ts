/*
 * @adonisjs/view
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import test from 'japa'
import { join } from 'path'
import { Edge } from 'edge.js'
import { Ioc, Registrar } from '@adonisjs/fold'

test.group('View', () => {
  test('register view provider', async (assert) => {
    const ioc = new Ioc()

    ioc.bind('Adonis/Core/Env', () => {
      return {
        get () {},
      }
    })

    ioc.bind('Adonis/Core/Application', () => {
      return {
        viewsPath () {
          return __dirname
        },
      }
    })

    const registrar = new Registrar(ioc)
    await registrar.useProviders([join(__dirname, '..', 'providers', 'ViewProvider')]).registerAndBoot()

    assert.instanceOf(ioc.use('Adonis/Core/View'), Edge)
    assert.equal(ioc.use('Adonis/Core/View').loader.mounted.default, __dirname)
  })
})
