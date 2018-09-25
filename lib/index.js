/**
 * Compile Javascript with ES2015
 * @module pon-task-es
 * @version 5.0.7
 */

'use strict'

const define = require('./define')

let lib = define.bind(this)

Object.assign(lib, define, {
  define
})

module.exports = lib
