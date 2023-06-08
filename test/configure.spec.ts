/*
 * @adonisjs/view
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { IgnitorFactory } from '@adonisjs/core/factories'
import Configure from '@adonisjs/core/commands/configure'
import { BASE_URL } from '../test_helpers/index.js'
import { fileURLToPath } from 'node:url'

test.group('Configure', (group) => {
  group.each.setup(({ context }) => {
    context.fs.baseUrl = BASE_URL
    context.fs.basePath = fileURLToPath(BASE_URL)
  })

  test('create config file, register provider, and add env variable', async ({ assert, fs }) => {
    const ignitor = new IgnitorFactory()
      .withCoreProviders()
      .withCoreConfig()
      .create(BASE_URL, {
        importer: (filePath) => {
          if (filePath.startsWith('./') || filePath.startsWith('../')) {
            return import(new URL(filePath, BASE_URL).href)
          }

          return import(filePath)
        },
      })

    await fs.create('.env', '')

    const app = ignitor.createApp('web')
    await app.init()
    await app.boot()

    const ace = await app.container.make('ace')
    const command = await ace.create(Configure, ['../../index.js'])
    await command.exec()

    await assert.fileExists('config/views.ts')
    await assert.fileExists('.adonisrc.json')
    await assert.fileContains('.adonisrc.json', '@adonisjs/view/providers/views_provider')
    await assert.fileContains('.adonisrc.json', '@adonisjs/view/commands')
    await assert.fileContains('config/views.ts', 'defineConfig')

    await assert.fileExists('.env')
    await assert.fileContains('.env', 'CACHE_VIEWS=false')
  })
})
