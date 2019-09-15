# View
> View/template layer for AdonisJs

This module internally uses [edge.js](https://adonisjs.com/docs/view) and wraps it around a provider to be used with AdonisJs.

[![circleci-image]][circleci-url] [![npm-image]][npm-url] ![][typescript-image] [![license-image]][license-url]

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [Usage](#usage)
- [Maintainers](#maintainers)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

Install the package from npm as follows:

```sh
adonis install @adonisjs/view

# yarn
adonis install @adonisjs/view --yarn
```

Next, register the provider inside `start/app` file.

```
const providers = [
 '@adonisjs/view'
]
```

And then use it as follows:

```ts
import View from '@ioc:Adonis/Core/View'

View.render()
```

## Maintainers
[Harminder virk](https://github.com/thetutlage)

[circleci-image]: https://img.shields.io/circleci/project/github/adonisjs/view/master.svg?style=for-the-badge&logo=circleci
[circleci-url]: https://circleci.com/gh/adonisjs/view "circleci"

[npm-image]: https://img.shields.io/npm/v/@adonisjs/view.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/@adonisjs/view "npm"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript

[license-url]: LICENSE.md
[license-image]: https://img.shields.io/aur/license/pac.svg?style=for-the-badge
