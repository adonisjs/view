/*
 * @adonisjs/view
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ViewContract } from '@ioc:Adonis/Core/View'
import { AssetsManagerContract } from '@ioc:Adonis/Core/AssetsManager'

/**
 * Registers the asset manager tags and globals with the template engine
 */
export function defineAssetsManagerBindings(
  View: ViewContract,
  AssetsManager: AssetsManagerContract
) {
  View.global('assetsManager', AssetsManager)
  View.global('asset', (filename: string) => AssetsManager.assetPath(filename))

  View.registerTag({
    tagName: 'entryPointStyles',
    seekable: true,
    block: false,
    compile(parser, buffer, token) {
      const parsed = parser.utils.transformAst(
        parser.utils.generateAST(token.properties.jsArg, token.loc, token.filename),
        token.filename,
        parser
      )

      const entrypointName = parser.utils.stringify(parsed)
      buffer.outputExpression(
        `state.assetsManager.entryPointStyleTags(${entrypointName})`,
        token.filename,
        token.loc.start.line,
        false
      )
    },
  })

  View.registerTag({
    tagName: 'entryPointScripts',
    seekable: true,
    block: false,
    compile(parser, buffer, token) {
      const parsed = parser.utils.transformAst(
        parser.utils.generateAST(token.properties.jsArg, token.loc, token.filename),
        token.filename,
        parser
      )

      const entrypointName = parser.utils.stringify(parsed)
      buffer.outputExpression(
        `state.assetsManager.entryPointScriptTags(${entrypointName})`,
        token.filename,
        token.loc.start.line,
        false
      )
    },
  })
}
