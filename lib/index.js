/**
 * Compile Javascript with ES2015
 * @module pon-task-es
 * @version 4.1.2
 */

'use strict'

const define = require('./define')

let lib = define.bind(this)

Object.assign(lib, define, {
  define
})

module.exports = lib
