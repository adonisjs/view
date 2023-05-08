/*
 * @adonisjs/view
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Edge } from 'edge.js'
import { BASE_URL, setupApp } from '../test_helpers/index.js'
import { fileURLToPath } from 'node:url'

test.group('View Provider', () => {
  test('register view provider', async ({ assert }) => {
    const { app } = await setupApp('web')
    const view = await app.container.make('view')

    assert.instanceOf(view, Edge)
    assert.equal(view.loader.mounted.default, fileURLToPath(new URL('./resources/views', BASE_URL)))
  })

  test('register config global', async ({ assert }) => {
    const { app } = await setupApp('web')

    const appKey = app.config.get('app.appKey')

    const view = await app.container.make('view')
    const output = await view.renderRaw(`{{ config('app.appKey') }}`)

    assert.equal(output, appKey)
  })

  test('share route and signedRoute methods with view', async ({ assert }) => {
    const { app } = await setupApp('web')

    const router = await app.container.make('router')
    router.get('/', () => {})
    router.get('/signed', () => {})
    router.commit()

    const view = await app.container.make('view')

    view.registerTemplate('dummy', { template: "{{ route('/', {}) }}" })
    view.registerTemplate('signedDummy', { template: "{{ signedRoute('/signed', {}) }}" })

    assert.equal(await view.render('dummy'), '//')
    assert.match(await view.render('signedDummy'), /\/signed\?signature=/)
  })

  test('add brisk route macro "render"', async ({ assert }) => {
    const { app } = await setupApp('web')
    const route = await app.container.make('router')

    assert.isFunction(route.on('/').render)
  })

  test('ensure GLOBALS object exists on the View binding', async ({ assert }) => {
    const { app } = await setupApp('web')

    const view = await app.container.make('view')
    assert.isDefined(view.GLOBALS)
    assert.property(view.GLOBALS, 'route')
  })

  test("don't cache views if config is set to false", async ({ assert }) => {
    const { app } = await setupApp('web', {
      views: { cache: false },
    })

    const view = await app.container.make('view')
    assert.isFalse(view.compiler.cacheManager.enabled)
  })

  test('should be able to access the singleton from service', async ({ assert }) => {
    const { app } = await setupApp('web')

    const view = await import('../services/view.js')
    const view2 = await app.container.make('view')

    assert.instanceOf(view.default, Edge)
    assert.equal(view.default, view2)
  })

  test('todo: register env global')
  test('todo: register repl binding')
  test('todo: do not register repl binding when not in repl environment')
  test('todo: register driveUrl and driveSignedUrl globals')
})
