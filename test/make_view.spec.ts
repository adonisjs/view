/*
 * @adonisjs/view
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { test } from '@japa/runner'
import { AppFactory } from '@adonisjs/application/factories'

import { stubsRoot } from '../stubs/index.js'

const BASE_URL = new URL('./tmp/', import.meta.url)
const BASE_PATH = fileURLToPath(BASE_URL)

test.group('Make view command', () => {
  test('create view stub', async ({ assert }) => {
    const app = new AppFactory().create(BASE_URL, () => {})
    await app.init()

    const stub = await app.stubs.build('make/view.stub', { source: stubsRoot })
    const { destination } = await stub.prepare({
      filename: 'welcome_page.edge',
      entity: app.generators.createEntity('WelcomePage'),
    })

    assert.equal(destination, join(BASE_PATH, 'resources/views/welcome_page.edge'))
  })
})
