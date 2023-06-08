/*
 * @adonisjs/view
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { BASE_URL } from '../test_helpers/index.js'
import { IgnitorFactory } from '@adonisjs/core/factories'
import MakeView from '../commands/make_view.js'

test.group('Make view command', () => {
  test('create mailer stub', async ({ assert }) => {
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

    const app = ignitor.createApp('web')
    await app.init()
    await app.boot()

    const ace = await app.container.make('ace')
    const command = await ace.create(MakeView, 'MyView')

    await command.exec()

    await assert.fileExists('resources/views/my_view.edge')
  })
})
