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
export default function instructions (projectRoot: string, _: any, { files, logger }: typeof tsStatic) {
  const rcFile = new files.AdonisRcFile(projectRoot)
  rcFile.addMetaFile('resources/views/**/*.edge')
  rcFile.commit()
  logger.update('.adonisrc.json')
}
