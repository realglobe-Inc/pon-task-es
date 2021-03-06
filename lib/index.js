/**
 * Compile Javascript with es
 * @module pon-task-es
 * @version 6.0.6
 */

'use strict'

const define = require('./define')

let lib = define.bind(this)

Object.assign(lib, define, {
  define
})

module.exports = lib
