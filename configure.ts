/*
 * @adonisjs/view
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type Configure from '@adonisjs/core/commands/configure'

/**
 * Configures the package
 */
export async function configure(command: Configure) {
  await command.publishStub('views/config.stub')
  await command.defineEnvVariables({ CACHE_VIEWS: false })

  await command.updateRcFile((rcFile) => {
    rcFile
      .addProvider('@adonisjs/view/views_provider')
      .addMetaFile('resources/views/**/*.edge', true)
      .addCommand('@adonisjs/view/commands')
  })
}
