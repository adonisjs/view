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
import { Filesystem } from '@poppinss/dev-utils'
import { Application } from '@adonisjs/core/build/standalone'

const fs = new Filesystem(join(__dirname, 'app'))

export async function setup(environment: 'web' | 'repl') {
  await fs.add('.env', '')
  await fs.add(
    'config/app.ts',
    `
		export const appKey = '${Math.random().toFixed(36).substring(2, 38)}',
		export const http = {
			cookie: {},
			trustProxy: () => true,
		}
	`
  )

  const app = new Application(fs.basePath, environment, {
    providers: ['@adonisjs/core', '@adonisjs/repl', '../../providers/ViewProvider'],
  })

  await app.setup()
  await app.registerProviders()
  await app.bootProviders()

  return app
}

test.group('View Provider', (group) => {
  group.afterEach(async () => {
    await fs.cleanup()
  })

  test('register view provider', async (assert) => {
    const app = await setup('web')

    assert.instanceOf(app.container.use('Adonis/Core/View'), Edge)
    assert.equal(
      app.container.use('Adonis/Core/View').loader.mounted.default,
      join(fs.basePath, 'resources/views')
    )
  })

  test('share route and signedRoute methods with view', async (assert) => {
    const app = await setup('web')

    app.container.use('Adonis/Core/Route').get('/', async () => {})
    app.container.use('Adonis/Core/Route').get('/signed', async () => {})
    app.container.use('Adonis/Core/Route').commit()

    const view = app.container.use('Adonis/Core/View')
    view.registerTemplate('dummy', { template: "{{ route('/', {}, 'root') }}" })
    view.registerTemplate('signedDummy', { template: "{{ signedRoute('/signed', {}, 'root') }}" })

    assert.equal(view.render('dummy'), '/')
    assert.match(view.render('signedDummy'), /\/signed\?signature=/)
  })

  test('add brisk route macro "render"', async (assert) => {
    const app = await setup('web')
    assert.isFunction(app.container.use('Adonis/Core/Route').on('/').render)
  })

  test('ensure GLOBALS object exists on the View binding', async (assert) => {
    const app = await setup('web')
    assert.isDefined(app.container.use('Adonis/Core/View').GLOBALS)
    assert.property(app.container.use('Adonis/Core/View').GLOBALS, 'route')
  })

  test('register repl binding', async (assert) => {
    const app = await setup('repl')

    assert.property(app.container.use('Adonis/Addons/Repl')['customMethods'], 'loadView')
    assert.isFunction(
      app.container.use('Adonis/Addons/Repl')['customMethods']['loadView']['handler']
    )
  })

  test('register view global for the assets manager', async (assert) => {
    const app = await setup('web')
    assert.property(app.container.use('Adonis/Core/View').GLOBALS, 'asset')
    assert.property(app.container.use('Adonis/Core/View').GLOBALS, 'assetsManager')
    assert.property(app.container.use('Adonis/Core/View').tags, 'entryPointStyles')
    assert.property(app.container.use('Adonis/Core/View').tags, 'entryPointScripts')
  })

  test('do not register repl binding when not in repl environment', async (assert) => {
    const app = await setup('web')
    assert.notProperty(app.container.use('Adonis/Addons/Repl')['customMethods'], 'loadView')
  })
})
