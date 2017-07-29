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

/** @lends define */
function define (src, dest, options = {}) {
  const {
    minified = false,
    presets
  } = options

  async function task (ctx) {
    await ababel('**/*.js', {
      cwd: src,
      out: dest,
      minified,
      presets: ['es2015', 'es2016', 'es2017'].concat(presets || [])
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

module.exports = define
