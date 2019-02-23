/**
 * Define task
 * @function define
 * @param {string} srcDir - Source directory name
 * @param {string} destDir - Destination directory name
 * @param {Object} [options={}] - Optional settings
 * @param {string|string[]} [options.pattern] - File name pattern
 * @param {string[]} [options.presets=['env']] - Babel preset names
 * @param {string[]} [options.plugins=[]] - Babel plugin names
 * @param {string[]} [options.watchTargets=[]] - Additional watch target filenames
 * @param {number} [options.watchDelay=100] - Delay after watch
 * @returns {function} Defined task
 */
'use strict'

const path = require('path')
const { byPattern } = require('pon-task-compile')
const { readFileAsync } = require('asfs')

/** @lends define */
function define(srcDir, destDir, options = {}) {
  const {
    pattern = ['**/*.js', '**/*.mjs', '**/*.json',],
    minified = false,
    presets = [
      ['@babel/preset-env', { targets: { browsers: ['> 1%'] } }]
    ],
    watchTargets = [],
    plugins = [
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-transform-runtime',
    ],
    sourceMaps = 'inline',
    sourceRoot = path.relative(destDir, srcDir),
    watchDelay = 100,
    ext = '.js'
  } = options

  const compiler = async (code, inputSourceMap, options = {}) => {
    const { src, dest, watching } = options
    const isJson = path.extname(src) === '.json'
    if (isJson) {
      return [await readFileAsync(src)]
    }
    const babel = require('@babel/core') // Require here to reduce initial loading time
    const compiled = await new Promise((resolve, reject) =>
      babel.transform(code, {
        minified,
        presets,
        plugins,
        filename: src,
        filenameRelative: path.relative(process.cwd(), src),
        sourceMaps,
        sourceRoot,
        inputSourceMap: inputSourceMap || false
      }, (err, result) => err ? reject(err) : resolve(result))
    )
    return [compiled.code, compiled.map]
  }

  const task = byPattern(srcDir, destDir, compiler, {
    pattern,
    watchDelay,
    watchTargets,
    namer: (filename) => filename
      .replace(/\.mjs$/, ext)
  })

  const { watch } = task

  return Object.assign(function es(ctx) {
    return task(ctx)
  }, {
    watch: function watchDecorate(ctx) {
      const { logger } = ctx
      // Env check
      {
        const wanted = 'development'
        const actual = process.env.NODE_ENV
        if (wanted !== actual) {
          logger.warn(`NODE_ENV should be "${wanted}", but given: "${actual}"`)
        }
      }
      return watch.apply(this, arguments)
    }
  })
}

module.exports = define
