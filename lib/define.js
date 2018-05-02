/**
 * Define task
 * @function define
 * @param {Object} [options={}] - Optional settings
 * @returns {function} Defined task
 */
'use strict'

const filecopy = require('filecopy')
const ababel = require('ababel')
const path = require('path')
const aglob = require('aglob')

const statusFile = 'tmp/es.status.json'

/** @lends define */
function define (src, dest, options = {}) {
  const {
    minified = false,
    pattern = '**/+(*.js|*.mjs)',
    presets,
    sourceRoot = path.relative(dest, src),
  } = options

  async function task (ctx) {
    await ababel(pattern, {
      cwd: src,
      out: dest,
      minified,
      ext: ['.js', '.mjs', '.es', '.es6'],
      status: statusFile,
      sourceRoot,
      plugins: [
        ['@babel/plugin-proposal-object-rest-spread', {}],
      ],
      presets: [
        ['@babel/preset-env', {targets: {browsers: ['> 1%']}}]
      ].concat(presets || [])
        .filter((name, i, array) => array.indexOf(name) === i)
    })

    for (const filename of await aglob(`**/*.json`, {cwd: src})) {
      const result = await filecopy(
        path.resolve(src, filename),
        path.resolve(dest, filename),
        {
          mkdirp: true
        }
      )
      for (const generated of Object.keys(result)) {
        ctx.logger.debug(`File generated: ${path.relative(ctx.cwd, generated)}`)
      }
    }
  }

  return Object.assign(task,
    // Define sub tasks here
    {}
  )
}

Object.assign(define, {
  file (src, dest, options = {}) {
    const {
      minified = false,
      presets,
      sourceRoot = '.'
    } = options

    async function task (ctx) {
      await ababel(path.basename(src), {
        cwd: path.dirname(src),
        out: dest,
        minified,
        status: statusFile,
        sourceRoot,
        plugins: [
          ['@babel/plugin-proposal-object-rest-spread', {}],
        ],
        presets: [
          ['@babel/preset-env', {targets: {browsers: ['> 1%']}}]
        ].concat(presets || [])
          .filter((name, i, array) => array.indexOf(name) === i)
      })
    }

    return task
  }
})

module.exports = define
