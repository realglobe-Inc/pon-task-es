'use strict'

const pon = require('pon')
const ponTaskEs = require('pon-task-es')

;(async () => {
  let run = pon({
    'js:compile': ponTaskEs(
      'client/src',
      'client/shim'
    )
  })

  run('js:compile')
}).catch((err) => console.error(err))
