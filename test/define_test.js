/**
 * Test case for define.
 * Runs with mocha.
 */
'use strict'

const define = require('../lib/define.js')
const ponContext = require('pon-context')
const {ok} = require('assert')

describe('define', function () {
  this.timeout(3000)

  before(async () => {

  })

  after(async () => {

  })

  it('Define', async () => {
    const ctx = ponContext()
    const task = define(
      `${__dirname}/../misc/mocks/mock-project-01`,
      `${__dirname}/../tmp/shim/mock-project-01`,
      {}
    )
    ok(task)

    await Promise.resolve(task(ctx))
  })

  it('File', async () => {
    const ctx = ponContext()
    const task = define.file(__filename, `${__dirname}/../tmp/shim-test-compiled`)
    ok(task)
    await Promise.resolve(task(ctx))
  })
})

/* global describe, before, after, it */
