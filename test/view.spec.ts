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

  test('share route and signedRoute methods with view', async (assert) => {
    assert.plan(6)
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

    ioc.bind('Adonis/Core/HttpContext', () => {
      return {
        getter () {},
      }
    })

    ioc.bind('Adonis/Core/Route', () => {
      return {
        makeUrl (identifier, options, domain) {
          assert.equal(identifier, '/')
          assert.deepEqual(options, {})
          assert.equal(domain, 'root')
          return '/'
        },
        BriskRoute: {
          macro () {},
        },
        makeSignedUrl (identifier, options, domain) {
          assert.equal(identifier, '/signed')
          assert.deepEqual(options, {})
          assert.equal(domain, 'root')
          return '/'
        },
      }
    })

    const registrar = new Registrar(ioc)
    await registrar.useProviders([join(__dirname, '..', 'providers', 'ViewProvider')]).registerAndBoot()

    const view = ioc.use('Adonis/Core/View')
    view.registerTemplate('dummy', { template: `{{ route('/', {}, 'root') }}` })
    view.registerTemplate('signedDummy', { template: `{{ signedRoute('/signed', {}, 'root') }}` })

    view.render('dummy')
    view.render('signedDummy')
  })

  test('add render brisk route macro', async (assert) => {
    assert.plan(2)
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

    ioc.bind('Adonis/Core/HttpContext', () => {
      return {
        getter () {},
      }
    })

    ioc.bind('Adonis/Core/Route', () => {
      return {
        makeUrl () {
        },
        BriskRoute: {
          macro (name: string, callback: any) {
            assert.equal(name, 'render')
            assert.isFunction(callback)
          },
        },
        makeSignedUrl () {
        },
      }
    })

    const registrar = new Registrar(ioc)
    await registrar.useProviders([join(__dirname, '..', 'providers', 'ViewProvider')]).registerAndBoot()
  })
})
