/*
 * @adonisjs/view
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import * as tsStatic from '@adonisjs/sink'

/**
 * Adding `views` to `.adonisrc.json` file to copy them to the build
 * directory
 */
export default function instructions (
  projectRoot: string,
  _app,
  { RcFile, kleur }: typeof tsStatic,
) {
  const rcFile = new RcFile(projectRoot)
  rcFile.addMetaFile('resources/views/**/*.edge')
  rcFile.commit()

  console.log(`  update  ${kleur.green('.adonisrc.json')}`)
}
