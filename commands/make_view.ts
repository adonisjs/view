/*
 * @adonisjs/view
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { args, BaseCommand } from '@adonisjs/core/ace'
import string from '@adonisjs/core/helpers/string'

/**
 * Command to make a new view template
 */
export default class MakeView extends BaseCommand {
  static commandName = 'make:view'
  static description = 'Create a new view template'

  @args.string({ description: 'Name of the view', required: true })
  declare name: string

  /**
   * The stub to use for generating the command class
   */
  protected stubPath: string = 'make/view.stub'

  async run() {
    const entity = this.app.generators.createEntity(this.name)
    const filename = string.create(entity.name).snakeCase().ext('.edge').toString()

    await this.makeUsingStub(this.stubPath, { entity, filename }, this.app.viewsPath())
  }
}
