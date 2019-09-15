/*
 * @adonisjs/session
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import sinkStatic from '@adonisjs/sink'

export default function instructions (
  projectRoot: string,
  _application: ApplicationContract,
  { JsonFile, kleur, RcFile }: typeof sinkStatic,
) {
  const tsConfig = new JsonFile(projectRoot, 'tsconfig.json')
  const types = tsConfig.get('compilerOptions.types')

  /**
   * Adding `@adonisjs/view` to the types, when it doesn't exists
   * already
   */
  if (!types.find((type: string) => type.includes('@adonisjs/view'))) {
    types.push('@adonisjs/view')
    tsConfig.set('compilerOptions.types', types)
    tsConfig.commit()
    console.log(`  update  ${kleur.green('tsconfig.json')}`)
  }

  /**
   * Add meta file for views, so that cli will copy them to the
   * build folder
   */
  const instructions = new RcFile(projectRoot)
  instructions.addMetaFile('resources/views/**/*.edge')
  instructions.commit()
  console.log(`  update  ${kleur.green('.adonisrc.json')}`)
}
